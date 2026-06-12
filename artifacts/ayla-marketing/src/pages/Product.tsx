import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Calendar, Users, MessageSquare, CheckCircle, Shield } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export default function Product() {
  useSEO({
    title: "Product",
    description: "See how Ayla surfaces unscheduled treatment, fillable schedule gaps, and lapsed recall — and helps your team book it, with every action confirmed by staff.",
    path: "/product",
  });
  return (
    <div className="flex flex-col w-full pb-24">
      {/* Header */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-b from-[#f0fdfa]/50 to-background text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-6">What Ayla Does</h1>
          <p className="text-xl text-[#334155] max-w-2xl mx-auto">
            A complete platform to find, prioritize, and schedule the hidden revenue in your practice.
          </p>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-[#0f172a] mb-6">The Dashboard</h2>
              <p className="text-lg text-[#64748b] mb-8">
                Every morning, your team sees exactly where the opportunity is, ranked by priority. No running reports, no digging through charts.
              </p>
              
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="mt-1 h-10 w-10 rounded-full bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center shrink-0">
                    <ActivityIcon />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0f172a] text-lg">Unscheduled Treatment</h4>
                    <p className="text-[#64748b]">Prioritized by production value and remaining insurance benefits.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 h-10 w-10 rounded-full bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0f172a] text-lg">Fillable Hours</h4>
                    <p className="text-[#64748b]">Matches tomorrow's gaps with patients who need treatment of the exact right length.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 h-10 w-10 rounded-full bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0f172a] text-lg">Lapsed Recall</h4>
                    <p className="text-[#64748b]">Surfaces overdue patients who have unscheduled family members to maximize appointment value.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-border/50 p-6 md:p-8">
                <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider z-10 border border-amber-200">
                  Demo data
                </div>
                
                <div className="space-y-4 pt-6">
                  <Card className="bg-[#f8fafc] border-none shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#64748b] mb-1">Unscheduled Treatment</p>
                        <p className="text-3xl font-bold text-[#0f172a]">$145,000</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <ArrowUpRight className="h-6 w-6" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#f8fafc] border-none shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#64748b] mb-1">Fillable Hours This Week</p>
                        <p className="text-3xl font-bold text-[#0f172a]">$47,200</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Calendar className="h-6 w-6" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#f8fafc] border-none shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#64748b] mb-1">Overdue Recalls</p>
                        <p className="text-3xl font-bold text-[#0f172a]">117</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <Users className="h-6 w-6" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ask Ayla */}
      <section className="py-20 px-4 bg-[#f8fafc]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-row-reverse">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:order-2"
            >
              <h2 className="text-3xl font-bold text-[#0f172a] mb-6">Ask Ayla</h2>
              <p className="text-lg text-[#64748b] mb-6">
                Your team can ask Ayla to find specific opportunities or draft communications, just like talking to a colleague.
              </p>
              <div className="bg-[#0f172a] p-4 rounded-lg inline-block mb-6">
                <p className="text-sm text-slate-300 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#14b8a6]" />
                  Privacy architecture: Patient names are masked as "First L." before being sent to the AI.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:order-1 space-y-6"
            >
              <div className="flex flex-col gap-3">
                <div className="self-end bg-[#0f766e] text-white p-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                  Find unscheduled crowns over $1,000 for patients with remaining benefits.
                </div>
                <div className="self-start bg-white border border-border/50 p-4 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm flex gap-3">
                  <div className="mt-1 h-8 w-8 rounded-full bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center shrink-0">
                    <span className="font-bold text-xs">A</span>
                  </div>
                  <div>
                    <p className="text-[#334155] mb-2">I found 14 patients matching those criteria. Here are the top 3 by production value:</p>
                    <ul className="text-sm space-y-1 text-[#64748b]">
                      <li>• John S. - $1,450 (Has $1,500 remaining)</li>
                      <li>• Sarah M. - $1,200 (Has $2,000 remaining)</li>
                      <li>• Robert T. - $1,150 (Has $1,200 remaining)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="self-end bg-[#0f766e] text-white p-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                  Draft a text to John S. about scheduling his crown.
                </div>
                <div className="self-start bg-white border border-border/50 p-4 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm flex gap-3">
                  <div className="mt-1 h-8 w-8 rounded-full bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center shrink-0">
                    <span className="font-bold text-xs">A</span>
                  </div>
                  <div>
                    <p className="text-[#334155] mb-2">Here's a draft you can copy:</p>
                    <div className="bg-slate-50 p-3 rounded text-sm text-[#334155] border border-slate-100">
                      Hi John! This is Sarah from [Practice Name]. I noticed you still have insurance benefits remaining for the year that could cover your pending crown treatment. Would you like to schedule that before your benefits reset?
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Booking Flow */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-6">Human-in-the-loop booking</h2>
          <p className="text-lg text-[#64748b] mb-12 max-w-2xl mx-auto">
            AI cannot book without staff confirmation. Every action requires a human tap.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-xl border border-border/50 bg-white">
              <div className="text-sm font-semibold text-[#0d9488] mb-2">Step 1</div>
              <h3 className="font-bold text-[#0f172a] mb-2">Proposal</h3>
              <p className="text-sm text-[#64748b]">Ayla proposes an appointment time based on the exact gap in your schedule.</p>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-white">
              <div className="text-sm font-semibold text-[#0d9488] mb-2">Step 2</div>
              <h3 className="font-bold text-[#0f172a] mb-2">Confirm</h3>
              <p className="text-sm text-[#64748b]">Staff reviews the proposal and taps Confirm on the action card.</p>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-white">
              <div className="text-sm font-semibold text-[#0d9488] mb-2">Step 3</div>
              <h3 className="font-bold text-[#0f172a] mb-2">Booked</h3>
              <p className="text-sm text-[#64748b]">The appointment is securely written back to your practice management system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Audit Trail */}
      <section className="py-16 px-4 bg-[#f0fdfa]">
        <div className="container mx-auto max-w-4xl text-center">
          <CheckCircle className="h-10 w-10 text-[#0f766e] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Tamper-evident audit trail</h2>
          <p className="text-[#334155]">
            Every action, every read of patient data, and every confirmation is logged, tenant-scoped, and retained. You always know exactly what Ayla and your staff are doing.
          </p>
        </div>
      </section>

      {/* What Ayla Doesn't Do */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-8 text-center">What Ayla doesn't do</h2>
          <div className="bg-white border border-border/50 rounded-2xl p-8 shadow-sm">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-[#ef4444] font-bold text-lg leading-none mt-1">×</span>
                <span className="text-lg text-[#334155]"><strong>Doesn't send SMS/email automatically.</strong> It provides display-only scripts for your staff to copy.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#ef4444] font-bold text-lg leading-none mt-1">×</span>
                <span className="text-lg text-[#334155]"><strong>Doesn't give clinical advice.</strong> It only surfaces administrative and scheduling data.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#ef4444] font-bold text-lg leading-none mt-1">×</span>
                <span className="text-lg text-[#334155]"><strong>Doesn't replace front-desk staff.</strong> It gives them superpowers.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function ActivityIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}