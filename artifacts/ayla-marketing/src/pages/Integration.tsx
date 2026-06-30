import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, Users, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { STATUS_LABEL, type Pms } from "@/data/pms";

const opportunities = [
  { icon: Activity, title: "Unscheduled treatment", body: "Diagnosed-but-unbooked treatment, ranked by production value and remaining benefits." },
  { icon: Calendar, title: "Schedule gaps", body: "Open chair time matched to patients who need treatment of the right length." },
  { icon: Users, title: "Lapsed recall", body: "Overdue hygiene patients surfaced before they fall away for good." },
  { icon: ShieldCheck, title: "Insurance & back office", body: "Effective reimbursement by carrier and the admin work that quietly drains production." },
];

export default function Integration({ pms }: { pms: Pms }) {
  useSEO({
    title: pms.seoTitle,
    fullTitleOverride: `${pms.seoTitle} | Mandi`,
    description: pms.seoDescription,
    path: `/${pms.slug}`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: `Mandi for ${pms.name}`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: `https://heymandi.ai/${pms.slug}`,
      description: pms.seoDescription,
      offers: { "@type": "Offer", category: "Integration" },
      publisher: { "@type": "Organization", name: "Mandi", url: "https://heymandi.ai" },
    },
  });

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-28 px-4 bg-gradient-to-b from-[#f0fdfa]/50 to-background">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-[#ccfbf1] text-[#0f766e] text-sm font-semibold mb-6">
            <span className="h-2 w-2 rounded-full bg-[#0d9488]" />
            {STATUS_LABEL[pms.status]}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0f172a] mb-5">
            Mandi for {pms.name}
          </h1>
          <p className="text-xl text-[#334155] max-w-2xl mx-auto mb-8">
            {pms.tagline} The AI copilot for the dental office — surfacing the revenue hiding in your {pms.name} data and helping the team act on it, with staff confirming every action.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/hidden-revenue" data-testid={`${pms.slug}-revenue-report-cta`}>
              <Button size="lg" className="bg-[#0d9488] hover:bg-[#0f766e] text-white h-12 px-8 text-base">
                Find my hidden revenue →
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                Book a walkthrough
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About this PMS */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-4">Built for {pms.name}</h2>
              <p className="text-lg text-[#334155] leading-relaxed mb-4">{pms.about}</p>
              <p className="text-lg text-[#334155] leading-relaxed">{pms.integration}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-6 space-y-4">
              <Detail label="System" value={pms.name} />
              <Detail label="Vendor" value={pms.vendor} />
              <Detail label="Deployment" value={pms.deployment} />
              <Detail label="Integration path" value={pms.program} />
            </div>
          </div>
        </div>
      </section>

      {/* What Mandi finds */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-10 text-center">
            What Mandi finds in your {pms.name} data
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {opportunities.map((o) => (
              <motion.div
                key={o.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="p-6 rounded-2xl bg-white border border-border/50 shadow-sm"
              >
                <div className="h-11 w-11 rounded-xl bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center mb-4">
                  <o.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0f172a] mb-2">{o.title}</h3>
                <p className="text-[#64748b] leading-relaxed">{o.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sanctioned + secure */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-[#0f172a] rounded-2xl p-8 md:p-10">
            <ShieldCheck className="h-7 w-7 text-[#14b8a6] mb-4" />
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Sanctioned, secure, human-in-the-loop</h2>
            <ul className="space-y-3 text-slate-300">
              {[
                `We connect only through the ${pms.program} — never screen-scraping or reading the database directly.`,
                "Mandi proposes; a staff member confirms every booking, message, and action.",
                "Built for HIPAA from day one — encrypted in transit and at rest, tenant-scoped, fully audited. We sign a BAA before any patient data flows.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#14b8a6] shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-4">
            Be first when Mandi connects to {pms.name}.
          </h2>
          <p className="text-lg text-[#64748b] mb-8">
            {pms.status === "pilot"
              ? `Mandi is live in pilot on ${pms.name}. Book a walkthrough to see what it finds in a practice your size.`
              : `We're building the sanctioned ${pms.name} integration now. In the meantime, see your hidden revenue today — upload a ${pms.name} export and get your free report in two minutes.`}
          </p>
          <Link href="/hidden-revenue" data-testid={`${pms.slug}-revenue-report-cta-bottom`}>
            <Button size="lg" className="bg-[#0d9488] hover:bg-[#0f766e] text-white h-12 px-8 text-base">
              Find my hidden revenue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#94a3b8] mb-1">{label}</p>
      <p className="text-[#0f172a] font-medium">{value}</p>
    </div>
  );
}
