// Practice management systems Mandi connects to (or is building a sanctioned
// integration for). Drives the per-PMS landing pages (src/pages/Integration.tsx)
// and the "works with your PMS" section on the home page.
//
// HONESTY RULE: only Dentrix is in progress today (the cert-gated pilot). Every
// other system is "roadmap" — we surface the *sanctioned* developer program we
// would build through, and route interest to the waitlist. Never imply a live
// integration we don't have.

export type PmsStatus = "pilot" | "roadmap";

export interface Pms {
  slug: string;
  name: string;
  vendor: string;
  deployment: "On-premise" | "Cloud" | "On-premise & cloud";
  status: PmsStatus;
  /** The official, sanctioned integration channel we would build through. */
  program: string;
  /** SEO title (suffixed with " | Mandi") and meta description. */
  seoTitle: string;
  seoDescription: string;
  /** One-line hook under the page H1. */
  tagline: string;
  /** 1–2 sentences about this PMS and its API — kept distinct per system. */
  about: string;
  /** Why the sanctioned path matters / what we'd build through. */
  integration: string;
}

export const STATUS_LABEL: Record<PmsStatus, string> = {
  pilot: "In pilot",
  roadmap: "On the roadmap",
};

// Dentrix keeps its own richer /dentrix page; it's listed here only for the
// "supported systems" section and cross-links.
export const dentrix: Pms = {
  slug: "dentrix",
  name: "Dentrix",
  vendor: "Henry Schein One",
  deployment: "On-premise",
  status: "pilot",
  program: "Dentrix Developer Program (sanctioned ODBC + REST)",
  seoTitle: "Dentrix Analytics & AI Office Copilot",
  seoDescription:
    "Turn your Dentrix data into a fuller schedule. Mandi adds AI analytics and office automation on top of Dentrix, with no manual reporting.",
  tagline: "Live in pilot via the Dentrix Developer Program.",
  about: "",
  integration: "",
};

// Generic per-PMS pages (everything except Dentrix).
export const integrations: Pms[] = [
  {
    slug: "opendental",
    name: "Open Dental",
    vendor: "Open Dental Software",
    deployment: "On-premise",
    status: "roadmap",
    program: "Open Dental Developer Portal (REST + FHIR API)",
    seoTitle: "Open Dental AI Office Copilot & Analytics",
    seoDescription:
      "Mandi is building a sanctioned Open Dental integration, surfacing unscheduled treatments, schedule gaps, lapsed recall, and insurance opportunities from your Open Dental data.",
    tagline: "A sanctioned Open Dental integration, in development.",
    about:
      "Open Dental is one of the most integration-friendly systems in dentistry, with an official REST API and FHIR support, a developer portal, and a dedicated test database. That openness makes it a natural early home for Mandi.",
    integration:
      "We build through Open Dental's official API (developer and customer API keys, no screen-scraping or direct database access), so your data stays inside a sanctioned, auditable channel.",
  },
  {
    slug: "eaglesoft",
    name: "Eaglesoft",
    vendor: "Patterson Dental",
    deployment: "On-premise",
    status: "roadmap",
    program: "Patterson Innovation Connection (PIC)",
    seoTitle: "Eaglesoft AI Office Copilot & Analytics",
    seoDescription:
      "Mandi is building a sanctioned Eaglesoft integration via Patterson Innovation Connection, finding unscheduled treatments, schedule gaps, and lapsed recall in your Eaglesoft data.",
    tagline: "A sanctioned Eaglesoft integration, in development.",
    about:
      "Eaglesoft is one of the largest practice management systems in North America. Patterson Dental authorizes third-party integrations through its Patterson Innovation Connection (PIC) program: the secure, supported path to Eaglesoft data.",
    integration:
      "We integrate only through PIC as an authorized partner, the sanctioned route Patterson reviews and approves, never an off-API workaround.",
  },
  {
    slug: "dentrix-ascend",
    name: "Dentrix Ascend",
    vendor: "Henry Schein One",
    deployment: "Cloud",
    status: "roadmap",
    program: "Dentrix Ascend API (REST/JSON)",
    seoTitle: "Dentrix Ascend AI Office Copilot & Analytics",
    seoDescription:
      "Mandi is building a sanctioned Dentrix Ascend integration via the Ascend API Program, surfacing the revenue hiding in your cloud practice data.",
    tagline: "A sanctioned Dentrix Ascend integration, in development.",
    about:
      "Dentrix Ascend is Henry Schein One's cloud-native practice management system. It exposes a modern REST API (JSON) through the Ascend API Program, with sandbox access for approved developers.",
    integration:
      "We build through the official Ascend API Program (application, agreement, and sandbox), so every read and write rides a sanctioned, cloud-native channel.",
  },
  {
    slug: "denticon",
    name: "Denticon",
    vendor: "Planet DDS",
    deployment: "Cloud",
    status: "roadmap",
    program: "Planet DDS API Program (OAuth 2.0)",
    seoTitle: "Denticon AI Office Copilot & Analytics",
    seoDescription:
      "Mandi is building a sanctioned Denticon integration via the Planet DDS API Program, purpose-built for DSOs and multi-location groups.",
    tagline: "A sanctioned Denticon integration, in development.",
    about:
      "Denticon, by Planet DDS, runs one of the most comprehensive and open API programs in dentistry: OAuth 2.0, event-driven updates, and writebacks across patient, appointment, financial, and clinical data, with SOC 2 Type II and HIPAA controls. It's a strong fit for DSOs and multi-location groups.",
    integration:
      "We integrate through the Planet DDS API Program using OAuth 2.0, the sanctioned, modern path that matches Mandi's own security posture.",
  },
  {
    slug: "curve",
    name: "Curve Dental",
    vendor: "Curve Dental",
    deployment: "Cloud",
    status: "roadmap",
    program: "Curve Dental API & SDKs",
    seoTitle: "Curve Dental AI Office Copilot & Analytics",
    seoDescription:
      "Mandi is building a sanctioned Curve Dental integration, finding unscheduled treatments, schedule gaps, and lapsed recall in your cloud practice data.",
    tagline: "A sanctioned Curve Dental integration, in development.",
    about:
      "Curve Dental is a fully cloud-based practice management platform with a public API and published SDKs, making it a clean target for a modern, sanctioned integration.",
    integration:
      "We build through Curve's official API and SDKs, a supported, cloud-native channel, never an unsanctioned extraction path.",
  },
];

/** All systems for the "supported systems" grid, Dentrix first. */
export const allPms: Pms[] = [dentrix, ...integrations];

export function getIntegration(slug: string): Pms | undefined {
  return integrations.find((p) => p.slug === slug);
}
