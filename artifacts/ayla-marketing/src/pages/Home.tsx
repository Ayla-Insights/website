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
    title: "Find the Revenue Hiding in Your Practice",
    description: "Ayla is an AI copilot for dental front offices. It finds unscheduled treatment, schedule gaps, and lapsed recall — and helps your team book it.",
    path: "/",
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
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#0f172a] mb-6 leading-tight">
                Find the revenue hiding in your practice.
              </h1>
              <p className="text-lg md:text-xl text-[#334155] mb-8 leading-relaxed">
                The average independent practice has over $100,000 of unscheduled treatment sitting in patient charts. Ayla shows your team exactly where the opportunity is — and helps them book it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/book" data-testid="hero-book-call">
                  <Button size="lg" className="bg-[#0d9488] hover:bg-[#0f766e] text-white w-full sm:w-auto h-12 px-8 text-base">
                    Book a discovery call
                  </Button>
                </Link>
                <Link href="/waitlist" data-testid="hero-waitlist">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">
                    Join the waitlist
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

      {/* Opportunity Buckets */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem className="p-6 rounded-2xl bg-white border border-border/50 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center mb-6">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">Unscheduled Treatment</h3>
              <p className="text-[#64748b] leading-relaxed">
                Find patients with diagnosed but unscheduled treatment plans. Prioritize by production value and insurance remaining.
              </p>
            </StaggerItem>

            <StaggerItem className="p-6 rounded-2xl bg-white border border-border/50 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">Fillable Hours This Week</h3>
              <p className="text-[#64748b] leading-relaxed">
                Instantly identify gaps in tomorrow's schedule and match them with patients who have unscheduled treatment of the right length.
              </p>
            </StaggerItem>

            <StaggerItem className="p-6 rounded-2xl bg-white border border-border/50 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">Lapsed Recall</h3>
              <p className="text-[#64748b] leading-relaxed">
                Surface patients who are overdue for hygiene, prioritizing those with remaining benefits or unscheduled family members.
              </p>
            </StaggerItem>
          </StaggerChildren>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-[#f8fafc]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-4">How Ayla works</h2>
            <p className="text-lg text-[#64748b]">No rip-and-replace required. Ayla sits on top of your existing systems.</p>
          </div>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-[#14b8a6]/20 via-[#14b8a6] to-[#14b8a6]/20" />
            
            {[
              { title: "Connect", desc: "Reads directly from Dentrix. No complex migration or rip-and-replace of your existing software." },
              { title: "Discover", desc: "The dashboard shows exactly where the money is every morning, ranked by priority." },
              { title: "Act", desc: "Ask Ayla in chat to draft messages or propose appointments. Your team confirms every booking." }
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ayla suggests. Your team decides.</h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Every booking and cancellation goes through a confirmation card. Nothing happens until a staff member taps Confirm. Every single action is auditable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Security Teaser */}
      <section className="py-16 px-4 bg-[#f0fdfa]">
        <div className="container mx-auto max-w-4xl text-center">
          <ShieldCheck className="h-12 w-12 text-[#0f766e] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#0f172a] mb-4">HIPAA-ready architecture</h2>
          <p className="text-lg text-[#334155] max-w-2xl mx-auto mb-8">
            Ayla is built around the technical safeguards required for healthcare data. Tenant isolation by construction, PHI-scrubbed logs, and human-in-the-loop writes.
          </p>
          <Link href="/security" data-testid="home-security-link" className="text-[#0d9488] font-semibold hover:text-[#0f766e] underline underline-offset-4">
            Read our security posture
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-[#0f172a] mb-6">Ready to see the opportunity?</h2>
          <p className="text-xl text-[#64748b] mb-10">
            Book a 20-minute discovery call. We'll show you what Ayla would find in a practice like yours. No pressure, just numbers.
          </p>
          <Link href="/book" data-testid="home-final-cta">
            <Button size="lg" className="bg-[#0d9488] hover:bg-[#0f766e] text-white h-14 px-10 text-lg">
              Book your discovery call
            </Button>
          </Link>
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
        <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider z-10 border border-amber-200">
          Demo data
        </div>
        
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
