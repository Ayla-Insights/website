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

/**
 * Notify the team of a new "Hidden Revenue Report" lead. Everything here is
 * NON-PHI by construction (the strict egress aggregate): a pseudonym, the lead's
 * BUSINESS email, rounded dollar totals, and suppressed counts — no patient data.
 */
export interface TeaserLeadEntry {
  id: number;
  contactEmail: string;
  unscheduledTreatmentValue: number;
  unscheduledPatientCount: number;
  overdueRecallPatientCount: number;
  sourceFormat: string;
  createdAt: Date;
}

export async function sendTeaserLeadNotification(entry: TeaserLeadEntry) {
  if (!process.env.RESEND_API_KEY) {
    logger.warn("RESEND_API_KEY not set — skipping teaser lead notification");
    return;
  }

  const to = process.env.LEAD_NOTIFICATION_EMAIL || NOTIFY_EMAIL;
  const usd = `$${entry.unscheduledTreatmentValue.toLocaleString("en-US")}`;
  const details = [
    `Email: ${entry.contactEmail}`,
    `Estimated unscheduled treatment: ${usd}`,
    `Unscheduled patients: ${entry.unscheduledPatientCount}`,
    `Overdue recall patients: ${entry.overdueRecallPatientCount}`,
    `Source: ${entry.sourceFormat}`,
  ].join("\n");

  try {
    await resend.emails.send({
      from: "Mandi <onboarding@resend.dev>",
      to,
      subject: `New Hidden Revenue Report lead — ${usd} estimated (${entry.contactEmail})`,
      text: `New Hidden Revenue Report lead\n\n${details}\n\nSubmitted: ${entry.createdAt.toISOString()}`,
      html: `
        <h2 style="font-family:sans-serif;color:#0f172a">New Hidden Revenue Report lead</h2>
        <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse">
          <tr><td style="padding:4px 16px 4px 0;color:#64748b;white-space:nowrap">Email</td><td style="padding:4px 0"><a href="mailto:${entry.contactEmail}">${entry.contactEmail}</a></td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#64748b">Est. unscheduled tx</td><td style="padding:4px 0"><strong>${usd}</strong></td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#64748b">Unscheduled patients</td><td style="padding:4px 0">${entry.unscheduledPatientCount}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#64748b">Overdue recall</td><td style="padding:4px 0">${entry.overdueRecallPatientCount}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#64748b">Source</td><td style="padding:4px 0">${entry.sourceFormat}</td></tr>
        </table>
        <p style="font-family:sans-serif;font-size:13px;color:#94a3b8;margin-top:24px">Submitted ${entry.createdAt.toISOString()}</p>
      `,
    });
    logger.info({ id: entry.id }, "Teaser lead notification email sent");
  } catch (err) {
    logger.error({ err, id: entry.id }, "Failed to send teaser lead notification email");
  }
}
