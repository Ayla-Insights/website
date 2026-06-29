import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { FadeInSection } from "@/components/animations";

export default function Pricing() {
  useSEO({
    title: "Pricing",
    description: "Mandi pricing for independent dental practices. Starter plan for the opportunity dashboard, Growth plan for the full operating system including patient self-scheduling.",
    path: "/pricing",
  });
  return (
    <div className="flex flex-col w-full pb-24 items-center justify-center min-h-[70vh]">
      <section className="pt-24 pb-12 px-4 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-6">Simple pricing. Serious ROI.</h1>
        <p className="text-xl text-[#334155] leading-relaxed">
          Designed for independent practices. Priced to pay for itself in the first month.
        </p>
        <p className="text-sm text-[#64748b] mt-4">
          We're finalizing beta pricing with our launch partners. Book a call to see what Mandi finds in your practice first — pricing is always secondary to the ROI.
        </p>
      </section>

      <section className="w-full max-w-4xl mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* STARTER CARD */}
          <div className="bg-white border-2 border-border rounded-2xl p-8 shadow-sm relative">
            <h2 className="text-xl font-bold text-[#0f172a]">Starter</h2>
            <div className="mt-2 mb-6">
              <span className="text-2xl font-bold text-[#0f172a]">Beta pricing</span>
              <p className="text-sm text-[#64748b] mt-1">Finalized with each launch partner</p>
            </div>
            <div className="h-px w-full bg-border/50 mb-6"></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#14b8a6] shrink-0" />
                <span className="text-[#334155]">Staff chat console (Ask Mandi)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#14b8a6] shrink-0" />
                <span className="text-[#334155]">Dentrix integration</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#14b8a6] shrink-0" />
                <span className="text-[#334155]">Opportunity dashboard — unscheduled treatment, recall, schedule gaps</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#14b8a6] shrink-0" />
                <span className="text-[#334155]">Goal tracking by provider</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#14b8a6] shrink-0" />
                <span className="text-[#334155]">Monthly billing available</span>
              </li>
            </ul>
            <Link href="/demo" data-testid="pricing-starter-cta">
              <Button variant="outline" className="w-full h-12 text-base">Book a discovery call</Button>
            </Link>
          </div>

          {/* GROWTH CARD */}
          <div className="bg-[#0f172a] border-2 border-[#0d9488] rounded-2xl p-8 shadow-sm relative">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#0d9488] text-white text-xs font-bold px-3 py-1 rounded-full">
              Most popular
            </div>
            <h2 className="text-xl font-bold text-white">Growth</h2>
            <div className="mt-2 mb-6">
              <span className="text-2xl font-bold text-white">Beta pricing</span>
              <p className="text-sm text-slate-400 mt-1">Finalized with each launch partner</p>
            </div>
            <div className="h-px w-full bg-slate-700 mb-4"></div>
            <p className="text-sm text-slate-400 mb-3">Everything in Starter, plus:</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#14b8a6] shrink-0" />
                <span className="text-slate-300">24/7 patient self-scheduling widget</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#14b8a6] shrink-0" />
                <span className="text-slate-300">Staff performance dashboard</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#14b8a6] shrink-0" />
                <span className="text-slate-300">Insurance profitability analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#14b8a6] shrink-0" />
                <span className="text-slate-300">Proactive outreach automation</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#14b8a6] shrink-0" />
                <span className="text-slate-300">Priority support</span>
              </li>
            </ul>
            <Link href="/demo" data-testid="pricing-growth-cta">
              <Button className="w-full h-12 text-base bg-[#0d9488] hover:bg-[#0f766e] text-white">Book a discovery call</Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-[#64748b] flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-[#14b8a6] mr-2 inline" />
            All plans include a signed Business Associate Agreement (BAA) before any patient data flows.
          </p>
          <p className="text-sm text-[#64748b] mt-2">
            Monthly billing available on both plans at a small premium.
          </p>
        </div>
      </section>

      <section className="w-full py-20 px-4 bg-[#f8fafc] mt-16">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-10 text-center">Frequently asked questions</h2>
          <FadeInSection className="space-y-6">
            <div className="border-b border-border/50 pb-6">
              <h3 className="font-semibold text-lg text-[#0f172a] mb-2">Do you support multi-location practices?</h3>
              <p className="text-[#64748b]">Yes. Each location is billed separately, and you get a consolidated view across all locations.</p>
            </div>
            <div className="border-b border-border/50 pb-6">
              <h3 className="font-semibold text-lg text-[#0f172a] mb-2">Is there a setup fee?</h3>
              <p className="text-[#64748b]">No setup fee. We handle the Dentrix integration as part of onboarding.</p>
            </div>
            <div className="border-b border-border/50 pb-6">
              <h3 className="font-semibold text-lg text-[#0f172a] mb-2">What's required to get started?</h3>
              <p className="text-[#64748b]">An active Dentrix license and about 30 minutes for a setup call. That's it.</p>
            </div>
            <div className="pb-6">
              <h3 className="font-semibold text-lg text-[#0f172a] mb-2">When is pricing finalized?</h3>
              <p className="text-[#64748b]">We're working directly with launch partners to finalize pricing. Book a call and we'll show you the ROI numbers before you commit to anything.</p>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
