import { Shield, Lock, Server, FileText, CheckCircle2, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

export default function Security() {
  useSEO({
    title: "Security & Data Protection",
    fullTitleOverride: "Security & Data Protection | Ayla Insights",
    description: "How Ayla protects patient data: tenant isolation, human-in-the-loop writes, minimum-necessary data to AI, and a tamper-evident audit trail.",
    path: "/security",
  });
  return (
    <div className="flex flex-col w-full pb-24">
      {/* Header */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-b from-[#f8fafc] to-background text-center border-b border-border/40">
        <div className="container mx-auto max-w-4xl">
          <div className="inline-flex items-center justify-center p-3 bg-[#f0fdfa] rounded-2xl mb-6">
            <Shield className="h-8 w-8 text-[#0f766e]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-6">Built for HIPAA from the ground up. Not bolted on after.</h1>
          <p className="text-xl text-[#334155] max-w-2xl mx-auto">
            Ayla was designed by an IAM and cybersecurity architect with enterprise defense-industry experience. Your patient data is treated the same way aerospace systems treat classified access — by construction, not by policy.
          </p>
          <div className="inline-flex flex-wrap justify-center gap-3 mt-8">
            <span className="inline-flex items-center gap-2 bg-white border border-border/50 rounded-full px-4 py-2 text-sm font-medium text-[#0f172a] shadow-sm">
              <ShieldCheck className="h-4 w-4 text-[#0f766e]" /> HIPAA-ready architecture
            </span>
            <span className="inline-flex items-center gap-2 bg-white border border-border/50 rounded-full px-4 py-2 text-sm font-medium text-[#0f172a] shadow-sm">
              <FileText className="h-4 w-4 text-[#0f766e]" /> BAA with every customer
            </span>
            <span className="inline-flex items-center gap-2 bg-white border border-border/50 rounded-full px-4 py-2 text-sm font-medium text-[#0f172a] shadow-sm">
              <Lock className="h-4 w-4 text-[#0f766e]" /> Encrypted in transit & at rest
            </span>
            <span className="inline-flex items-center gap-2 bg-white border border-border/50 rounded-full px-4 py-2 text-sm font-medium text-[#0f172a] shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-[#0f766e]" /> SOC 2 (in progress)
            </span>
          </div>
        </div>
      </section>

      {/* Built from Day One */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-12 text-center">What's built in — not bolted on.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Server className="h-6 w-6 text-[#0d9488]" />
                <h3 className="text-xl font-bold text-[#0f172a]">Tenant isolation by construction</h3>
              </div>
              <p className="text-[#64748b] leading-relaxed">
                Cross-tenant reads are structurally impossible at the database level. Each practice's data is strictly isolated.
              </p>
            </div>

            <div className="bg-white border border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="h-6 w-6 text-[#0d9488]" />
                <h3 className="text-xl font-bold text-[#0f172a]">Human-in-the-loop writes</h3>
              </div>
              <p className="text-[#64748b] leading-relaxed">
                AI proposes; staff confirms; nothing executes automatically. No rogue scripts modifying your schedule.
              </p>
            </div>

            <div className="bg-white border border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="h-6 w-6 text-[#0d9488]" />
                <h3 className="text-xl font-bold text-[#0f172a]">AI sandbox boundaries</h3>
              </div>
              <p className="text-[#64748b] leading-relaxed">
                The AI never touches the database directly. It only calls a whitelisted, tightly constrained set of validated tools.
              </p>
            </div>

            <div className="bg-white border border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-[#0d9488]" />
                <h3 className="text-xl font-bold text-[#0f172a]">Minimum-necessary to AI</h3>
              </div>
              <p className="text-[#64748b] leading-relaxed">
                Patient names are masked as "First L." Phone numbers, emails, and DOBs never reach the language model at all.
              </p>
            </div>

            <div className="bg-white border border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-[#0d9488]" />
                <h3 className="text-xl font-bold text-[#0f172a]">PHI-scrubbed logs</h3>
              </div>
              <p className="text-[#64748b] leading-relaxed">
                Aggressive filtering ensures patient data cannot accidentally land in application or server logs.
              </p>
            </div>

            <div className="bg-white border border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-[#0d9488]" />
                <h3 className="text-xl font-bold text-[#0f172a]">Tamper-evident audit trail</h3>
              </div>
              <p className="text-[#64748b] leading-relaxed">
                Every action and every read is logged, tenant-scoped, and securely retained for compliance auditing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why this matters */}
      <section className="px-4 pb-20">
        <div className="bg-[#0f172a] rounded-2xl p-8 max-w-4xl mx-auto mb-0">
          <Shield className="h-6 w-6 text-[#14b8a6] inline mr-3 mb-1" />
          <h2 className="text-xl font-bold text-white inline-block mb-3">We sign a BAA before anything else.</h2>
          <p className="text-slate-300 leading-relaxed">
            Before any real patient data flows through Ayla, we execute a fully signed Business Associate Agreement with your practice. HIPAA compliance isn't a feature — it's the foundation. We won't cut corners on this, and we won't ask you to either.
          </p>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 px-4 bg-[#f8fafc]">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-8 text-center">What's coming before launch</h2>
          <div className="bg-white border border-border/50 rounded-2xl p-8 shadow-sm">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-[#0d9488] shrink-0" />
                <span className="text-lg text-[#334155]">TLS end-to-end and encryption at rest across all datastores.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-[#0d9488] shrink-0" />
                <span className="text-lg text-[#334155]">SSO + MFA support, Role-Based Access Control (RBAC), and automatic session expiry.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-[#0d9488] shrink-0" />
                <span className="text-lg text-[#334155]">Fully executed BAAs with every underlying business associate/infrastructure provider.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-[#0d9488] shrink-0" />
                <span className="text-lg text-[#334155]">Documented risk analysis, written security policies, and designated Security Officer.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-[#0d9488] shrink-0" />
                <span className="text-lg text-[#334155]">Independent third-party HIPAA gap assessment before any real PHI flows.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-6">Talk to our security team</h2>
          <p className="text-xl text-[#64748b] mb-8">
            Have specific compliance requirements or technical questions? We're happy to discuss our architecture in detail.
          </p>
          <a href="mailto:security@aylainsights.com" className="inline-flex h-12 items-center justify-center rounded-md bg-[#0f172a] px-8 text-base font-medium text-white transition-colors hover:bg-[#1e293b]">
            Email security@aylainsights.com
          </a>
        </div>
      </section>
    </div>
  );
}
