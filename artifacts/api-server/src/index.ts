import { sql } from "drizzle-orm";
import { db } from "@workspace/db";
import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

/**
 * Deploy-safety net. Replit's autoscale *deploy* does not run the `postMerge`
 * db-push hook, and the deployment's database is often distinct from the
 * workspace DB, so a newly-added table can be missing in production even after a
 * manual `db push` in the shell. Ensure the teaser_leads table exists at boot,
 * against whatever database this instance actually connects to. Idempotent
 * (CREATE TABLE IF NOT EXISTS) and concurrency-safe across autoscale instances.
 *
 * The Drizzle schema in @workspace/db (schema/teaserLeads.ts) remains the source
 * of truth — keep this DDL in sync if that table's columns change.
 */
async function ensureSchema(): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS teaser_leads (
      id serial PRIMARY KEY,
      practice_pseudonym text NOT NULL,
      contact_email text NOT NULL,
      unscheduled_treatment_value integer NOT NULL,
      fillable_gap_value integer,
      unscheduled_patient_count integer NOT NULL,
      overdue_recall_patient_count integer NOT NULL,
      diagnosed_earliest text,
      diagnosed_latest text,
      recall_earliest text,
      recall_latest text,
      source_format text NOT NULL,
      mapping_confidence real NOT NULL,
      created_at timestamp DEFAULT now() NOT NULL
    );
  `);
}

async function start(): Promise<void> {
  try {
    await ensureSchema();
    logger.info("Database schema ensured");
  } catch (err) {
    // Don't hard-crash on a transient DB hiccup — keep serving (health, etc.).
    logger.error({ err }, "Failed to ensure database schema (continuing)");
  }

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
}

void start();
