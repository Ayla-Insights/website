export interface Post {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingMinutes: number;
  body: Section[];
}

export interface Section {
  type: "p" | "h2" | "h3" | "ul" | "callout";
  content: string | string[];
}

export const posts: Post[] = [
  {
    slug: "the-100k-hiding-in-your-patient-charts",
    title: "The $100,000 Hiding in Your Patient Charts",
    description:
      "Most independent dental practices have six figures of diagnosed, unbooked treatment sitting in their system right now. Here's why it happens — and what you can do about it.",
    publishedAt: "2026-06-01",
    readingMinutes: 5,
    body: [
      {
        type: "p",
        content:
          "Ask any practice owner how much unscheduled treatment they have, and you'll get one of two answers: a number that's too low, or a shrug. The real figure — pulled from the practice management system and ranked by dollar value and recency — tends to be a shock.",
      },
      {
        type: "p",
        content:
          "In a typical independent practice with two to four operatories, diagnosed but unbooked treatment routinely runs between $80,000 and $150,000. That's treatment the dentist recommended, the patient acknowledged, and then… nothing. Life got in the way. The reminder never came. The front desk was busy with the patient who just walked in.",
      },
      {
        type: "h2",
        content: "Why the gap exists",
      },
      {
        type: "p",
        content:
          "The accumulation isn't anybody's fault. It's a systems problem. Practice management software is very good at recording what was diagnosed. It is much less good at surfacing it later, ranking it by urgency or dollar value, and putting it in front of the right person at the right moment.",
      },
      {
        type: "p",
        content:
          "Most systems have a report somewhere that will generate a list of unscheduled treatment. The problem is that running it, interpreting it, and doing something with it requires time the front desk simply doesn't have — especially during the morning rush when the schedule already has holes that need filling.",
      },
      {
        type: "ul",
        content: [
          "The report exists, but nobody has time to run it",
          "When it is run, the list is flat — no ranking, no context",
          "Following up requires manual outreach with no scripting support",
          "Patients who said no once rarely get a second, differently-framed ask",
        ],
      },
      {
        type: "h2",
        content: "What 'finding' the money actually means",
      },
      {
        type: "p",
        content:
          "Recovering unscheduled treatment isn't about being aggressive with patients. It's about making sure a patient who said 'let me think about it' six months ago gets a well-timed, human follow-up — and that the front desk has the context to have that conversation confidently.",
      },
      {
        type: "p",
        content:
          "The highest-value opportunities are usually not the oldest ones — they're the ones where the patient has a history of accepting treatment, the procedure has a meaningful out-of-pocket component, and enough time has passed that a natural check-in makes sense. Ranking by recency alone misses most of that.",
      },
      {
        type: "callout",
        content:
          "The average independent practice Ayla has analyzed has $145,000 of unscheduled treatment ranked and ready to act on. That's estimated revenue — not guaranteed — but it represents real patients who already said yes to a diagnosis.",
      },
      {
        type: "h2",
        content: "The front desk has to want to use it",
      },
      {
        type: "p",
        content:
          "Any tool that surfaces this opportunity only works if the person at the front desk trusts it and has time to act on it. That means the interface has to fit into the morning briefing, not require a 20-minute training session. It means the outreach scripts have to sound like a person, not a billing department. And it means the confirmation of every action has to stay with the staff member — not the software.",
      },
      {
        type: "p",
        content:
          "Technology can find the opportunity. The front desk has to close it. The best systems make that handoff feel seamless.",
      },
    ],
  },
  {
    slug: "why-your-front-desk-is-the-most-important-part-of-your-practice",
    title: "Why Your Front Desk Is the Most Important Part of Your Practice",
    description:
      "Clinical excellence keeps patients healthy. The front desk keeps the practice solvent. Here's why dental software has historically underserved the people who matter most to your revenue.",
    publishedAt: "2026-06-08",
    readingMinutes: 6,
    body: [
      {
        type: "p",
        content:
          "Dental school spends years on the clinical side of the equation. It spends almost none on the business side. And yet, in most independent practices, the financial health of the business rests almost entirely on the judgment and bandwidth of one or two people at the front desk.",
      },
      {
        type: "p",
        content:
          "They schedule, reschedule, verify insurance, handle billing questions, greet patients, answer the phone, and somehow also find time to follow up on the treatment that was diagnosed three months ago and never booked. The list of things competing for their attention is extraordinary.",
      },
      {
        type: "h2",
        content: "The software wasn't built for them",
      },
      {
        type: "p",
        content:
          "Practice management systems like Dentrix are sophisticated, powerful tools. They were also, in large part, designed for the people who configure them — not the people who use them all day. The result is software that requires significant training to use even at a basic level, surfaces information in ways that require interpretation, and demands context-switching that breaks the flow of a busy morning.",
      },
      {
        type: "p",
        content:
          "Ask a front desk coordinator what they need to do their job well, and you'll hear a consistent set of answers: know which patients to call and why, have something useful to say when they pick up, know which holes in tomorrow's schedule are actually fillable, and have that information ready before 9 AM — not after.",
      },
      {
        type: "ul",
        content: [
          "Which patients are most likely to book if called today?",
          "What's the estimated production value of filling each open slot?",
          "Who's overdue for hygiene and hasn't responded to the automated reminder?",
          "What treatment did this patient have diagnosed that they haven't scheduled yet?",
        ],
      },
      {
        type: "h2",
        content: "Automation without trust doesn't work",
      },
      {
        type: "p",
        content:
          "The industry response to front desk overload has largely been automation — automated reminders, automated recall, automated confirmations. These tools reduce phone volume, which helps. But they've also created a dynamic where patients feel managed by software rather than cared for by a practice.",
      },
      {
        type: "p",
        content:
          "The front desk coordinator who knows a patient's name, remembers they were anxious last time, and asks how the crown is feeling — that's the experience that builds retention. No automation replaces it. The right role for technology is to make sure that person has the information they need to have that conversation well, not to have the conversation for them.",
      },
      {
        type: "callout",
        content:
          "Ayla is designed around one rule: the AI can propose, but a staff member always confirms. Every booking, every cancellation, every outreach script — nothing executes until someone at the front desk taps Confirm.",
      },
      {
        type: "h2",
        content: "What good support looks like",
      },
      {
        type: "p",
        content:
          "The front desk coordinator who starts their morning knowing exactly which three patients to call, why each one is likely to say yes, and what to say when they pick up — that person is operating at a completely different level than one who has to reconstruct that context from three separate reports.",
      },
      {
        type: "p",
        content:
          "The opportunity is there in every practice. The challenge has always been making it visible in the right way, at the right time, to the right person. That's what software for the front desk should actually do.",
      },
    ],
  },
  {
    slug: "built-for-hipaa-what-that-actually-means",
    title: "Built for HIPAA: What That Actually Means",
    description:
      "You'll see dental vendors claim 'HIPAA compliance' constantly. Most of those claims are meaningless. Here's what a genuinely careful HIPAA posture looks like — and what questions to ask before you hand over patient data.",
    publishedAt: "2026-06-11",
    readingMinutes: 7,
    body: [
      {
        type: "p",
        content:
          "Before we get into specifics: Ayla does not claim to be HIPAA compliant. That's an intentional choice, not an oversight. 'HIPAA compliant' is a legal status that requires executed Business Associate Agreements, a completed risk analysis, written policies, a designated Security Officer, and often a third-party assessment. Claiming it before those elements are in place is a compliance risk, not a selling point.",
      },
      {
        type: "p",
        content:
          "What we can say — and what we say carefully — is that Ayla is built for HIPAA. That means the architecture was designed from day one with the HIPAA technical safeguards as a constraint, not an afterthought. Here's what that looks like in practice.",
      },
      {
        type: "h2",
        content: "Tenant isolation by construction",
      },
      {
        type: "p",
        content:
          "In a multi-tenant application, the most dangerous failure mode is a bug that allows one customer's data to be read by another. In many systems, this is prevented by access control logic — checks that run at query time and filter results to the right tenant.",
      },
      {
        type: "p",
        content:
          "In Ayla's architecture, cross-tenant reads are structurally impossible. Each practice's data is accessed through a tenant-bound data adapter, and the adapter itself — not just the query logic — enforces the boundary. A bug in application code cannot cause a cross-tenant data leak, because the layer below it doesn't allow it.",
      },
      {
        type: "h2",
        content: "The AI never touches the database",
      },
      {
        type: "p",
        content:
          "This is the one that surprises people most. In many AI-integrated systems, the language model has relatively broad access — it can query, it can write, it can read patient records directly. The surface area for a mistake (or a prompt injection) is large.",
      },
      {
        type: "p",
        content:
          "In Ayla, the AI can only call a whitelisted, validated set of tools. It cannot query the database directly. It cannot read a patient record it hasn't been explicitly given access to. It cannot execute a booking without generating a proposal that a staff member must confirm. The boundary between the model and the data is enforced in code, not in prompting.",
      },
      {
        type: "h2",
        content: "Minimum-necessary data to the model",
      },
      {
        type: "p",
        content:
          "HIPAA's minimum-necessary standard says you should only use, disclose, or request the minimum PHI needed to accomplish the purpose. We take this seriously in how data flows to the language model.",
      },
      {
        type: "ul",
        content: [
          "Patient names are masked to 'First L.' before reaching the model",
          "Phone numbers, email addresses, and dates of birth never reach the model",
          "Outreach scripts are generated for staff to send — the model doesn't send them",
          "PHI cannot land in server logs — it's scrubbed before logging",
        ],
      },
      {
        type: "h2",
        content: "The audit trail",
      },
      {
        type: "p",
        content:
          "Every action in Ayla — every booking proposal, every confirmation, every cancellation, every time a patient record is read — is logged with the user, the timestamp, and the tenant. The log is tamper-evident and retained.",
      },
      {
        type: "p",
        content:
          "This matters for two reasons. First, it supports the HIPAA requirement to account for disclosures of PHI. Second, it gives practice owners visibility into what their software is actually doing with patient data — something that's surprisingly rare.",
      },
      {
        type: "h2",
        content: "What's still being built",
      },
      {
        type: "p",
        content:
          "We believe in being honest about where we are. Before any real patient data flows through Ayla, we will have in place: TLS end-to-end and encryption at rest, SSO with MFA and automatic session expiry, executed BAAs with every business associate, a completed risk analysis and written policies, and an independent HIPAA gap assessment.",
      },
      {
        type: "p",
        content:
          "The questions to ask any dental software vendor before you share patient data: Do you have a signed BAA? Have you completed a formal risk analysis? Can you describe how your architecture prevents cross-tenant access? What data reaches your AI models, and in what form? If you can't get clear answers to those questions, the posture isn't ready — regardless of what the marketing page says.",
      },
      {
        type: "callout",
        content:
          "If you have questions about Ayla's security architecture, we're happy to go deep. Reach out to security@aylainsights.com — we'll respond with specifics, not talking points.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
