import { Router } from "express";
import { db } from "@workspace/db";
import { waitlistTable } from "@workspace/db";
import { insertWaitlistSchema } from "@workspace/db";
import { sendWaitlistNotification } from "../lib/email";

const router = Router();

router.post("/waitlist", async (req, res) => {
  const parsed = insertWaitlistSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }

  try {
    const [entry] = await db
      .insert(waitlistTable)
      .values(parsed.data)
      .returning();

    req.log.info({ id: entry.id, email: parsed.data.email }, "Waitlist signup");

    sendWaitlistNotification(entry).catch(() => {});

    res.status(201).json(entry);
  } catch (err) {
    req.log.error({ err }, "Failed to insert waitlist entry");
    res.status(500).json({ error: "Failed to save. Please try again." });
  }
});

export default router;
