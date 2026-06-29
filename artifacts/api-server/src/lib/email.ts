import { Resend } from "resend";
import { logger } from "./logger";

const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFY_EMAIL = "hello@heymandi.ai";
const FROM = "Mandi Waitlist <onboarding@resend.dev>";

export interface WaitlistEntry {
  id: number;
  name: string;
  email: string;
  practiceName: string;
  pmsInUse?: string | null;
  numLocations?: number | null;
  numProviders?: number | null;
  createdAt: Date;
}

export async function sendWaitlistNotification(entry: WaitlistEntry) {
  if (!process.env.RESEND_API_KEY) {
    logger.warn("RESEND_API_KEY not set — skipping email notification");
    return;
  }

  const details = [
    `Name: ${entry.name}`,
    `Email: ${entry.email}`,
    `Practice: ${entry.practiceName}`,
    entry.pmsInUse ? `PMS: ${entry.pmsInUse}` : null,
    entry.numLocations != null ? `Locations: ${entry.numLocations}` : null,
    entry.numProviders != null ? `Providers: ${entry.numProviders}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await resend.emails.send({
      from: FROM,
      to: NOTIFY_EMAIL,
      subject: `New waitlist signup: ${entry.name} — ${entry.practiceName}`,
      text: `New waitlist signup\n\n${details}\n\nSubmitted: ${entry.createdAt.toISOString()}`,
      html: `
        <h2 style="font-family:sans-serif;color:#0f172a">New waitlist signup</h2>
        <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse">
          <tr><td style="padding:4px 16px 4px 0;color:#64748b;white-space:nowrap">Name</td><td style="padding:4px 0"><strong>${entry.name}</strong></td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#64748b">Email</td><td style="padding:4px 0"><a href="mailto:${entry.email}">${entry.email}</a></td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#64748b">Practice</td><td style="padding:4px 0">${entry.practiceName}</td></tr>
          ${entry.pmsInUse ? `<tr><td style="padding:4px 16px 4px 0;color:#64748b">PMS</td><td style="padding:4px 0">${entry.pmsInUse}</td></tr>` : ""}
          ${entry.numLocations != null ? `<tr><td style="padding:4px 16px 4px 0;color:#64748b">Locations</td><td style="padding:4px 0">${entry.numLocations}</td></tr>` : ""}
          ${entry.numProviders != null ? `<tr><td style="padding:4px 16px 4px 0;color:#64748b">Providers</td><td style="padding:4px 0">${entry.numProviders}</td></tr>` : ""}
        </table>
        <p style="font-family:sans-serif;font-size:13px;color:#94a3b8;margin-top:24px">Submitted ${entry.createdAt.toISOString()}</p>
      `,
    });
    logger.info({ id: entry.id }, "Waitlist notification email sent");
  } catch (err) {
    logger.error({ err, id: entry.id }, "Failed to send waitlist notification email");
  }
}
