import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  PlugZap,
  FileSpreadsheet,
  CheckCircle2,
  ArrowUpRight,
  Lock,
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const valueProps = [
  {
    icon: BarChart3,
    title: "Dentrix analytics, in plain English",
    body: "Mandi reads your Dentrix data and surfaces the numbers that move production — unscheduled treatment, fillable gaps, and lapsed recall — without you building a single report.",
  },
  {
    icon: PlugZap,
    title: "A Dentrix integration that just runs",
    body: "Connect once. Mandi syncs in the background — no manual exports, no spreadsheets, no double entry. Your front desk keeps working in Dentrix the way they already do.",
  },
  {
    icon: FileSpreadsheet,
    title: "Dentrix reporting on autopilot",
    body: "The reports you'd build by hand on a Friday afternoon — production pacing, recall, treatment acceptance — refreshed automatically and ready every morning.",
  },
];

const steps = [
  "Connect Mandi to your Dentrix system in minutes — read-only to start.",
  "Mandi analyzes your schedule, ledger, and treatment plans for missed production.",
  "Your team sees ranked opportunities and books them, with every action confirmed by staff.",
];

export default function Dentrix() {
  useSEO({
    title: "Dentrix Analytics & AI Front Office",
    fullTitleOverride: "Dentrix Analytics & AI Front Office | Mandi",
    description:
      "Turn your Dentrix data into a fuller schedule. Mandi adds AI analytics and front-office automation on top of Dentrix — no manual reporting.",
    path: "/dentrix",
  });

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Hero */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-b from-[#f0fdfa]/50 to-background">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-[#ccfbf1] text-[#0f766e] text-sm font-semibold mb-6">
            Works with Dentrix
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0f172a] mb-6 leading-tight">
            Turn your Dentrix data into a fuller schedule
          </h1>
          <p className="text-lg md:text-xl text-[#334155] max-w-2xl mx-auto mb-8 leading-relaxed">
            You already have everything you need to grow — it's sitting in Dentrix. Mandi is the AI
            front-office copilot that reads your Dentrix data, finds the production you're missing, and
            helps your team book it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo" data-testid="dentrix-demo-cta">
              <Button size="lg" className="bg-[#0d9488] hover:bg-[#0f766e] text-white w-full sm:w-auto h-12 px-8 text-base">
                Book a walkthrough
              </Button>
            </Link>
            <a href="https://app.heymandi.ai" data-testid="dentrix-beta-cta">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">
                Beta Access
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Demo stat strip */}
      <section className="px-4 pb-4">
        <div className="container mx-auto max-w-4xl">
          <div className="relative rounded-2xl border border-border/60 bg-white shadow-sm p-6 md:p-8">
            <span className="absolute top-4 right-4 text-[0.65rem] font-semibold uppercase tracking-wide text-[#94a3b8] bg-[#f1f5f9] rounded px-2 py-0.5">
              Demo data
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-[#0d9488]">$145,000</div>
                <div className="text-sm text-[#64748b] mt-1">Unscheduled treatment found</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0d9488]">$47,200</div>
                <div className="text-sm text-[#64748b] mt-1">Fillable chair time next week</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0d9488]">117</div>
                <div className="text-sm text-[#64748b] mt-1">Patients lapsed on recall</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {valueProps.map((vp, i) => (
              <motion.div
                key={vp.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-border/50 bg-white p-7 shadow-sm"
              >
                <div className="h-11 w-11 rounded-xl bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center mb-5">
                  <vp.icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-[#0f172a] mb-2">{vp.title}</h2>
                <p className="text-[#64748b] leading-relaxed text-[0.95rem]">{vp.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-[#f8fafc] border-y border-border/40">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-10 text-center">
            How the Dentrix integration works
          </h2>
          <ol className="space-y-6">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="shrink-0 h-8 w-8 rounded-full bg-[#0d9488] text-white font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-[#334155] text-lg leading-relaxed pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex items-start gap-3 rounded-xl bg-white border border-border/50 px-5 py-4">
            <Lock className="h-5 w-5 text-[#0f766e] shrink-0 mt-0.5" />
            <p className="text-sm text-[#64748b] leading-relaxed">
              Patient data is handled with minimum-necessary access and a tamper-evident audit trail.
              Mandi is built for HIPAA from day one.{" "}
              <Link href="/security" className="text-[#0d9488] font-medium hover:underline">
                See our security posture
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* What you can ask */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-8 text-center">
            Questions Mandi answers from your Dentrix data
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Who can fill tomorrow's 2pm opening?",
              "Which patients have unscheduled treatment and active benefits?",
              "How is production pacing against goal this month?",
              "Which patients are overdue for recall?",
            ].map((q) => (
              <li
                key={q}
                className="flex gap-3 items-start rounded-xl border border-border/50 bg-white px-5 py-4"
              >
                <CheckCircle2 className="h-5 w-5 text-[#0f766e] shrink-0 mt-0.5" />
                <span className="text-[#334155] leading-relaxed">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl bg-[#0f766e] text-white px-8 py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">See what Mandi finds in your Dentrix data</h2>
            <p className="text-[#ccfbf1] text-lg max-w-xl mx-auto mb-8">
              Book a 30-minute walkthrough and we'll show you the production hiding in your practice.
            </p>
            <Link href="/demo" data-testid="dentrix-final-cta">
              <Button size="lg" className="bg-white text-[#0f766e] hover:bg-[#f0fdfa] h-12 px-8 text-base font-semibold">
                Book a walkthrough <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
