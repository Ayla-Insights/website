import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Calendar, Users, Activity, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { useCountUp } from "@/hooks/useCountUp";
import { StaggerChildren, StaggerItem } from "@/components/animations";

export default function Home() {
  useSEO({
    title: "AI Front Office for Dental Practices",
    fullTitleOverride: "Mandi | AI Front Office for Dental Practices",
    description: "See the revenue hiding in your Dentrix data. Mandi helps your dental front desk fill the schedule, recover unscheduled treatment, and grow.",
    path: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Mandi",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://heymandi.ai",
      description:
        "AI front-office copilot for dental practices that finds unscheduled treatment, schedule gaps, and lapsed recall — and helps the team book it.",
      publisher: { "@type": "Organization", name: "Mandi" },
    },
  });

  const { ref: unscheduledRef, displayValue: unscheduledValue } = useCountUp(145000, { prefix: "$", duration: 1500 });
  const { ref: fillableRef, displayValue: fillableValue } = useCountUp(47200, { prefix: "$", duration: 1500 });
  const { ref: recallsRef, displayValue: recallsValue } = useCountUp(117, { duration: 1500 });

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -150]);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4 bg-gradient-to-b from-[#f0fdfa]/50 to-background overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <span className="inline-block py-1 px-3 rounded-full bg-[#ccfbf1] text-[#0f766e] text-sm font-semibold mb-6">
                AI for the dental front office
              </span>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#0f172a] mb-5 leading-tight">
                The AI front-office copilot for dental practices
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-5 leading-snug">
                Your practice is leaving <span className="text-[#0d9488]">$145,000</span> on the table. Mandi finds it.
              </p>
              <p className="text-lg md:text-xl text-[#334155] mb-8 leading-relaxed">
                Mandi connects to your Dentrix system and shows you exactly where you're losing production — then helps you get it back. Unscheduled treatment. Empty chair time. Patients who've fallen off recall. All in one place, in plain English — and your team confirms every action before anything happens.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://app.heymandi.ai" data-testid="hero-join-beta">
                  <Button size="lg" className="bg-[#0d9488] hover:bg-[#0f766e] text-white w-full sm:w-auto h-12 px-8 text-base">
                    Beta Access
                  </Button>
                </a>
                <Link href="/demo" data-testid="hero-book-call">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">
                    Book a walkthrough
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              style={{ y }}
              className="relative hidden md:block"
            >
              <HeroDashboard
                unscheduledRef={unscheduledRef} unscheduledValue={unscheduledValue}
                fillableRef={fillableRef} fillableValue={fillableValue}
                recallsRef={recallsRef} recallsValue={recallsValue}
              />
            </motion.div>

            <div className="relative md:hidden block">
              <HeroDashboard
                unscheduledRef={unscheduledRef} unscheduledValue={unscheduledValue}
                fillableRef={fillableRef} fillableValue={fillableValue}
                recallsRef={recallsRef} recallsValue={recallsValue}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">Dental practices lose money the same way, every time.</h2>
          </div>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem className="p-6 rounded-2xl bg-white border border-border/50 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">Empty chairs</h3>
              <p className="text-[#64748b] leading-relaxed">
                A cancelled appointment with no backfill is pure lost revenue. Most offices have no fast way to find a replacement.
              </p>
            </StaggerItem>

            <StaggerItem className="p-6 rounded-2xl bg-white border border-border/50 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center mb-6">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">Unscheduled treatment</h3>
              <p className="text-[#64748b] leading-relaxed">
                The average practice has $100,000+ in diagnosed-but-unscheduled treatment plans. Nobody has time to chase them.
              </p>
            </StaggerItem>

            <StaggerItem className="p-6 rounded-2xl bg-white border border-border/50 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">Staff flying blind</h3>
              <p className="text-[#64748b] leading-relaxed">
                Your team can't grow what they can't see. Without clear goals and real-time pacing, growth stays a conversation instead of becoming a result.
              </p>
            </StaggerItem>
          </StaggerChildren>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-[#f8fafc]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-4">How Mandi works</h2>
            <p className="text-lg text-[#64748b]">No rip-and-replace required. Mandi sits on top of your existing systems.</p>
          </div>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-[#14b8a6]/20 via-[#14b8a6] to-[#14b8a6]/20" />

            {[
              { title: "Connect to Dentrix", desc: "Mandi integrates directly with your Dentrix system — no manual data entry, no spreadsheets. Setup takes minutes." },
              { title: "See your opportunities", desc: "Your dashboard shows the numbers that matter: unscheduled treatment, schedule gaps, recall patients, goal pacing — in real dollars." },
              { title: "Ask Mandi to act", desc: "Type a question — 'Who can fill tomorrow's 2pm?' — and Mandi finds the answer and proposes the action. You approve it. Done." }
            ].map((step, i) => (
              <StaggerItem
                key={i}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-white border-4 border-[#ccfbf1] flex items-center justify-center text-2xl font-bold text-[#0d9488] shadow-sm mb-6">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-[#0f172a] mb-3">{step.title}</h3>
                <p className="text-[#64748b] leading-relaxed max-w-[280px]">
                  {step.desc}
                </p>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="py-20 px-4 bg-[#f8fafc]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-[#0f172a] mb-2">What practices typically find when they surface hidden revenue</h2>
          <p className="text-center text-sm text-[#94a3b8] mb-2">Illustrative examples based on industry data — not yet from Mandi customers.</p>
          <p className="text-center text-lg text-[#64748b] mb-12">Patterns observed across six common dental specialties.</p>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { badge: "General Dentistry", figure: "~$145,000", desc: "in unscheduled treatment identified. Crowns and implants, patients averaging 14 months since diagnosis." },
              { badge: "Periodontics", figure: "~31 patients", desc: "overdue for active perio maintenance, with a combined ~$41,000 in unscheduled scaling and root planing." },
              { badge: "Cosmetic Dentistry", figure: "~$220,000", desc: "in unscheduled elective treatment. Veneers and whitening cases diagnosed but never followed up on." },
              { badge: "Orthodontics", figure: "~18 openings", desc: "in the next 30 days that could be filled with recall exams from patients with pending treatment consults." },
              { badge: "Pediatric Dentistry", figure: "~94 families", desc: "with one or more members overdue for recall, representing a combined 187+ unscheduled hygiene appointments." },
              { badge: "Endodontics", figure: "~$67,000", desc: "in referred-out root canal cases that could have been retained in-house based on schedule availability." },
            ].map((card, i) => (
              <StaggerItem key={i} className="bg-white border border-border/50 rounded-2xl p-6 shadow-sm">
                <div className="inline-block px-3 py-1 rounded-full bg-[#ccfbf1] text-[#0f766e] text-xs font-semibold mb-4">
                  {card.badge}
                </div>
                <div className="text-3xl font-bold text-[#0f172a] mb-1">{card.figure}</div>
                <p className="text-sm text-[#64748b]">{card.desc}</p>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Trust Panel */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#0f172a] rounded-3xl p-8 md:p-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
              <CheckCircle2 className="h-8 w-8 text-[#14b8a6]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Mandi suggests. Your team decides. Every time.</h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              No action executes automatically. Every booking, every outreach, every schedule change goes through a staff confirmation card. Nothing happens until a human taps Confirm. Every single action is logged.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Security Teaser */}
      <section className="py-16 px-4 bg-[#f0fdfa]">
        <div className="container mx-auto max-w-4xl text-center">
          <ShieldCheck className="h-12 w-12 text-[#0f766e] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Built for HIPAA from the ground up. Not bolted on after.</h2>
          <p className="text-lg text-[#334155] max-w-2xl mx-auto mb-8">
            Mandi was designed by an IAM and cybersecurity architect with enterprise defense-industry experience. Encrypted in transit and at rest. Role-based access. Full audit trail. We sign a BAA with every practice before any patient data flows.
          </p>
          <Link href="/security" data-testid="home-security-link" className="text-[#0d9488] font-semibold hover:text-[#0f766e] underline underline-offset-4">
            Read our security posture
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-[#0f172a] mb-6">See what Mandi finds in your practice.</h2>
          <p className="text-xl text-[#64748b] mb-10">
            Get beta access or book a 30-minute walkthrough. No commitment. No pitch deck.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://app.heymandi.ai" data-testid="home-beta-cta">
              <Button size="lg" variant="outline" className="border-[#0d9488] text-[#0d9488] hover:bg-[#f0fdfa] h-14 px-10 text-lg">
                Beta Access
              </Button>
            </a>
            <Link href="/demo" data-testid="home-final-cta">
              <Button size="lg" className="bg-[#0d9488] hover:bg-[#0f766e] text-white h-14 px-10 text-lg">
                Book a walkthrough
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroDashboard({ unscheduledRef, unscheduledValue, fillableRef, fillableValue, recallsRef, recallsValue }: any) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-tr from-[#14b8a6]/20 to-transparent blur-3xl rounded-full" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="relative bg-white rounded-2xl shadow-xl border border-border/50 p-6 md:p-8 transform rotate-1 hover:rotate-0 transition-transform duration-500"
      >

        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border/50">
            <h3 className="font-semibold text-[#0f172a]">Morning Briefing</h3>
            <span className="text-sm text-muted-foreground">Today</span>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } }
            }}
            className="grid gap-4"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
              <Card className="bg-[#f8fafc] border-none shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#64748b] mb-1">Unscheduled Treatment</p>
                    <p ref={unscheduledRef} className="text-3xl font-bold text-[#0f172a]">{unscheduledValue}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <ArrowUpRight className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
              <Card className="bg-[#f8fafc] border-none shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#64748b] mb-1">Fillable Hours This Week</p>
                    <p ref={fillableRef} className="text-3xl font-bold text-[#0f172a]">{fillableValue}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Calendar className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
              <Card className="bg-[#f8fafc] border-none shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#64748b] mb-1">Overdue Recalls</p>
                    <p ref={recallsRef} className="text-3xl font-bold text-[#0f172a]">{recallsValue}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <Users className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
