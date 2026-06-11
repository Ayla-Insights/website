import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const waitlistTable = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  practiceName: text("practice_name").notNull(),
  pmsInUse: text("pms_in_use"),
  numLocations: integer("num_locations"),
  numProviders: integer("num_providers"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWaitlistSchema = createInsertSchema(waitlistTable)
  .omit({ id: true, createdAt: true })
  .extend({
    email: z.email(),
    name: z.string().min(1),
    practiceName: z.string().min(1),
  });

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlistTable.$inferSelect;
