import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Calendar, Users, MessageSquare, CheckCircle, Shield } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { useCountUp } from "@/hooks/useCountUp";
import { StaggerChildren, StaggerItem } from "@/components/animations";

export default function Features() {
  useSEO({
    title: "Features",
    fullTitleOverride: "Features | Mandi Dental Office Software",
    description: "Fill schedule gaps, recover unscheduled treatments, reactivate recall, and spot insurance that hurts collections, all from your Dentrix data.",
    path: "/features",
  });

  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".scroll-section");
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          setActiveSection(index);
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Header */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-b from-[#f0fdfa]/50 to-background text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-6">Everything your front desk needs to grow the practice</h1>
          <p className="text-xl text-[#334155] max-w-2xl mx-auto">
            Dental office software that finds, prioritizes, and schedules the hidden revenue in your practice, built on your Dentrix data.
          </p>
        </div>
      </section>

      <section className="relative px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start relative">
            
            {/* Left side (Sticky Visual Mock) - Only sticky on LG+ */}
            <div className="hidden lg:flex sticky top-24 h-[calc(100vh-96px)] py-12 flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="w-full relative"
                >
                  {activeSection === 0 && <DashboardMock />}
                  {activeSection === 1 && <ChatMock />}
                  {activeSection === 2 && <BookingMock />}
                  {activeSection === 3 && <TeamMock />}
                  {activeSection === 4 && <InsuranceMock />}
                  {activeSection === 5 && <AuditMock />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right side (Scrollable content) */}
            <div className="lg:py-0 pb-12">
              
              {/* Section 0: Dashboard */}
              <div className="scroll-section min-h-[80vh] flex flex-col justify-center py-12 lg:py-24">
                <div className="lg:hidden mb-12">
                  <DashboardMock />
                </div>
                <div className={`transition-opacity duration-500 ${activeSection === 0 ? "opacity-100" : "opacity-35"}`}>
                  <h2 className="text-3xl font-bold text-[#0f172a] mb-6">Fill the Schedule</h2>
                  <p className="text-lg text-[#64748b] mb-8">
                    Mandi detects open slots and instantly identifies the best patients to fill them, ranked by treatment need, recall status, and how long they've been waiting.
                  </p>
                  <ul className="space-y-6">
                    <li className="flex gap-4">
                      <div className="mt-1 h-10 w-10 rounded-full bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center shrink-0">
                        <ActivityIcon />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0f172a] text-lg">Unscheduled Treatments</h4>
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
                </div>
              </div>

              {/* Section 1: Ask Mandi */}
              <div className="scroll-section min-h-[80vh] flex flex-col justify-center py-12 lg:py-24">
                <div className="lg:hidden mb-12">
                  <ChatMock />
                </div>
                <div className={`transition-opacity duration-500 ${activeSection === 1 ? "opacity-100" : "opacity-35"}`}>
                  <h2 className="text-3xl font-bold text-[#0f172a] mb-6">Ask Mandi</h2>
                  <p className="text-lg text-[#64748b] mb-6">
                    Your team can ask Mandi to find specific opportunities or draft communications, just like talking to a colleague using natural language.
                  </p>
                  <div className="bg-[#0f172a] p-4 rounded-lg inline-block mb-6">
                    <p className="text-sm text-slate-300 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[#14b8a6]" />
                      Privacy architecture: Patient names are masked as "First L." before reaching AI.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Booking Flow */}
              <div className="scroll-section min-h-[80vh] flex flex-col justify-center py-12 lg:py-24">
                <div className="lg:hidden mb-12">
                  <BookingMock />
                </div>
                <div className={`transition-opacity duration-500 ${activeSection === 2 ? "opacity-100" : "opacity-35"}`}>
                  <h2 className="text-3xl font-bold text-[#0f172a] mb-6">Human-in-the-loop</h2>
                  <p className="text-lg text-[#64748b] mb-8">
                    AI cannot book without staff confirmation. Every action requires a human tap.
                  </p>
                  <StaggerChildren className="space-y-4">
                    <StaggerItem className="p-6 rounded-xl border border-border/50 bg-white">
                      <div className="text-sm font-semibold text-[#0d9488] mb-2">Step 1: Proposal</div>
                      <p className="text-[#64748b]">Mandi proposes an appointment time based on the exact gap in your schedule.</p>
                    </StaggerItem>
                    <StaggerItem className="p-6 rounded-xl border border-border/50 bg-white">
                      <div className="text-sm font-semibold text-[#0d9488] mb-2">Step 2: Confirm</div>
                      <p className="text-[#64748b]">Staff reviews the proposal and taps Confirm on the action card.</p>
                    </StaggerItem>
                    <StaggerItem className="p-6 rounded-xl border border-border/50 bg-white">
                      <div className="text-sm font-semibold text-[#0d9488] mb-2">Step 3: Booked</div>
                      <p className="text-[#64748b]">The appointment is securely written back to your practice management system.</p>
                    </StaggerItem>
                  </StaggerChildren>
                </div>
              </div>

              {/* Section 3: Team Scoreboard */}
              <div className="scroll-section min-h-[80vh] flex flex-col justify-center py-12 lg:py-24">
                <div className="lg:hidden mb-12">
                  <TeamMock />
                </div>
                <div className={`transition-opacity duration-500 ${activeSection === 3 ? "opacity-100" : "opacity-35"}`}>
                  <h2 className="text-3xl font-bold text-[#0f172a] mb-6">Align your team around growth</h2>
                  <p className="text-lg text-[#64748b] mb-6">
                    Mandi tracks production by provider and hygiene productivity by hygienist, and shows everyone their pacing toward monthly goals. When the team can see the gap, they can close it.
                  </p>
                  <blockquote className="border-l-4 border-[#0d9488] pl-4 py-1 text-[#334155] italic text-base mb-2">
                    "I need my staff to be as invested in growth as I am."
                  </blockquote>
                  <p className="text-sm text-[#64748b] mt-2">
                    General dentist, 20-year practice owner
                  </p>
                </div>
              </div>

              {/* Section 4: Insurance Profitability */}
              <div className="scroll-section min-h-[80vh] flex flex-col justify-center py-12 lg:py-24">
                <div className="lg:hidden mb-12">
                  <InsuranceMock />
                </div>
                <div className={`transition-opacity duration-500 ${activeSection === 4 ? "opacity-100" : "opacity-35"}`}>
                  <h2 className="text-3xl font-bold text-[#0f172a] mb-6">See which insurance plans hurt your collections</h2>
                  <p className="text-lg text-[#64748b] mb-6">
                    Mandi breaks down your production and collections by carrier and calculates your effective reimbursement rate. Make participation decisions with data, not gut feel.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
                    Plans with high write-off rates are often the first to go when practices review their insurance mix.
                  </div>
                </div>
              </div>

              {/* Section 5: Audit Trail */}
              <div className="scroll-section min-h-[80vh] flex flex-col justify-center py-12 lg:py-24">
                <div className="lg:hidden mb-12">
                  <AuditMock />
                </div>
                <div className={`transition-opacity duration-500 ${activeSection === 5 ? "opacity-100" : "opacity-35"}`}>
                  <div className="mb-6"><CheckCircle className="h-10 w-10 text-[#0f766e]" /></div>
                  <h2 className="text-3xl font-bold text-[#0f172a] mb-6">Every action logged</h2>
                  <p className="text-lg text-[#64748b]">
                    Every action, every read of patient data, and every confirmation is logged, tenant-scoped, and retained in a tamper-evident audit trail. You always know exactly what Mandi and your staff are doing.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* What Mandi Doesn't Do */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-8 text-center">What Mandi doesn't do</h2>
          <div className="bg-white border border-border/50 rounded-2xl p-8 shadow-sm">
            <StaggerChildren className="space-y-4">
              <StaggerItem className="flex items-start gap-3">
                <span className="text-[#ef4444] font-bold text-lg leading-none mt-1">×</span>
                <span className="text-lg text-[#334155]"><strong>Doesn't send SMS/email automatically.</strong> It provides display-only scripts for your staff to copy.</span>
              </StaggerItem>
              <StaggerItem className="flex items-start gap-3">
                <span className="text-[#ef4444] font-bold text-lg leading-none mt-1">×</span>
                <span className="text-lg text-[#334155]"><strong>Doesn't give clinical advice.</strong> It only surfaces administrative and scheduling data.</span>
              </StaggerItem>
              <StaggerItem className="flex items-start gap-3">
                <span className="text-[#ef4444] font-bold text-lg leading-none mt-1">×</span>
                <span className="text-lg text-[#334155]"><strong>Doesn't replace front-desk staff.</strong> It gives them superpowers.</span>
              </StaggerItem>
            </StaggerChildren>
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardMock() {
  const { ref: unscheduledRef, displayValue: unscheduledValue } = useCountUp(145000, { prefix: "$", duration: 1500 });
  const { ref: fillableRef, displayValue: fillableValue } = useCountUp(47200, { prefix: "$", duration: 1500 });
  const { ref: recallsRef, displayValue: recallsValue } = useCountUp(117, { duration: 1500 });

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-border/50 p-6 md:p-8 relative w-full">
      <div className="space-y-4 pt-6">
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
      </div>
    </div>
  );
}

function ChatMock() {
  const queries = [
    {
      user: "Find unscheduled crowns over $1,000",
      ayla: "Found 14 patients. Top match: John S., $1,450, $1,500 benefits remaining."
    },
    {
      user: "Fill tomorrow's 2pm opening",
      ayla: "Sarah M. has an unscheduled cleaning that fits exactly. Shall I propose the slot?"
    },
    {
      user: "Who is most overdue for recall?",
      ayla: "Robert T., 18 months overdue, high show-rate history."
    }
  ];

  const [queryIndex, setQueryIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentAylaText = queries[queryIndex].ayla;

    if (isTyping) {
      if (typedText.length < currentAylaText.length) {
        timeout = setTimeout(() => {
          setTypedText(currentAylaText.substring(0, typedText.length + 1));
        }, 28);
      } else {
        setIsTyping(false);
        timeout = setTimeout(() => {
          setTypedText("");
          setIsTyping(true);
          setQueryIndex((prev) => (prev + 1) % queries.length);
        }, 2000);
      }
    }
    return () => clearTimeout(timeout);
  }, [typedText, isTyping, queryIndex, queries]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-border/50 p-6 relative w-full h-[400px] flex flex-col">
      <div className="flex-1 space-y-6 flex flex-col justify-end pb-4">
        <AnimatePresence mode="wait">
          <motion.div 
            key={queryIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4 w-full"
          >
            <div className="self-end bg-[#0f766e] text-white p-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm text-sm">
              {queries[queryIndex].user}
            </div>
            <div className="self-start bg-slate-50 border border-border/50 p-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm flex gap-3 text-sm">
              <div className="mt-0.5 h-6 w-6 rounded-full bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center shrink-0">
                <span className="font-bold text-[10px]">A</span>
              </div>
              <div className="text-[#334155] min-h-[40px]">
                {typedText}
                {isTyping && <span className="animate-pulse ml-1">|</span>}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-xs text-slate-400 flex items-center gap-2">
          <Shield className="h-3 w-3 text-[#14b8a6]" />
          Patient names masked as "First L." before reaching AI
        </p>
      </div>
    </div>
  );
}

function BookingMock() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-border/50 p-6 md:p-8 relative w-full">
      <div className="space-y-6 pt-6">
        <div className="bg-slate-50 border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-[#0f172a]">Proposed Appointment</h4>
            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">Pending</span>
          </div>
          <div className="space-y-2 mb-6">
            <p className="text-sm flex justify-between"><span className="text-slate-500">Patient:</span> <span className="font-medium">Sarah M.</span></p>
            <p className="text-sm flex justify-between"><span className="text-slate-500">Treatment:</span> <span className="font-medium">Prophy + Exam</span></p>
            <p className="text-sm flex justify-between"><span className="text-slate-500">Time:</span> <span className="font-medium">Tomorrow, 2:00 PM</span></p>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 bg-[#0d9488] text-white py-2 rounded-lg text-sm font-medium">Confirm & Book</button>
            <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-medium">Reject</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TeamMock() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-border/50 p-6 w-full relative">
      <h3 className="font-semibold text-[#0f172a] mb-6">Goal Pacing: This Month</h3>
      <div className="space-y-5">
        <div>
          <div className="flex justify-between items-end mb-1">
            <span className="font-medium text-[#0f172a] text-sm">Dr. Martinez</span>
            <span className="text-xs font-medium text-[#64748b]">78% to goal</span>
          </div>
          <div className="w-full bg-[#ccfbf1] h-2 rounded-full overflow-hidden">
            <div className="bg-[#0d9488] h-full" style={{ width: "78%" }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-end mb-1">
            <span className="font-medium text-[#0f172a] text-sm">Dr. Chen</span>
            <span className="text-xs font-medium text-[#64748b]">61% to goal</span>
          </div>
          <div className="w-full bg-[#ccfbf1] h-2 rounded-full overflow-hidden">
            <div className="bg-[#0d9488] h-full" style={{ width: "61%" }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-end mb-1">
            <span className="font-medium text-[#0f172a] text-sm">Sarah (Hygiene)</span>
            <span className="text-xs font-medium text-[#64748b]">92% to goal</span>
          </div>
          <div className="w-full bg-[#ccfbf1] h-2 rounded-full overflow-hidden">
            <div className="bg-[#0d9488] h-full" style={{ width: "92%" }}></div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex gap-2">
        <div className="flex-1 bg-[#f8fafc] rounded-lg px-3 py-2 text-center">
          <div className="font-semibold text-[#0f172a]">$42,800</div>
          <div className="text-xs text-[#64748b]">Production MTD</div>
        </div>
        <div className="flex-1 bg-[#f8fafc] rounded-lg px-3 py-2 text-center">
          <div className="font-semibold text-[#0f172a]">14 hrs</div>
          <div className="text-xs text-[#64748b]">Chair time used</div>
        </div>
        <div className="flex-1 bg-[#f8fafc] rounded-lg px-3 py-2 text-center">
          <div className="font-semibold text-[#0f172a]">6 open</div>
          <div className="text-xs text-[#64748b]">Slots this week</div>
        </div>
      </div>
    </div>
  );
}

function InsuranceMock() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-border/50 p-6 w-full relative">
      <h3 className="font-semibold text-[#0f172a] mb-6">Insurance Profitability</h3>
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm text-[#0f172a]">Delta Dental PPO</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">88% effective</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-emerald-500 h-full" style={{ width: "85%" }}></div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm text-[#0f172a]">Cigna DPPO</span>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-medium">74% effective</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-yellow-500 h-full" style={{ width: "72%" }}></div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm text-[#0f172a]">MetLife PDP</span>
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-medium">61% effective</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-orange-500 h-full" style={{ width: "58%" }}></div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-[#0f172a]">Aetna DMO</span>
              <span className="text-[10px] bg-red-100 text-red-700 px-1.5 rounded uppercase font-bold tracking-wider border border-red-200">Review</span>
            </div>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded font-medium">41% effective</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-red-500 h-full" style={{ width: "38%" }}></div>
          </div>
        </div>
      </div>
      <p className="text-xs text-[#64748b] italic mt-6 border-t border-slate-100 pt-4">
        Carriers below 65% effective rate flagged for review
      </p>
    </div>
  );
}

function AuditMock() {
  return (
    <div className="bg-[#0f172a] rounded-2xl shadow-xl border border-slate-700 p-6 relative w-full text-slate-300 font-mono text-xs overflow-hidden">
      <div className="space-y-3 opacity-80">
        <div className="flex gap-4">
          <span className="text-[#14b8a6]">14:02:11</span>
          <span className="text-slate-500">USER_QUERY</span>
          <span className="truncate">"Fill tomorrow's 2pm opening"</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[#14b8a6]">14:02:12</span>
          <span className="text-slate-500">DATA_READ</span>
          <span className="truncate">Dentrix DB: schedule gaps & unscheduled tx</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[#14b8a6]">14:02:12</span>
          <span className="text-amber-500">PHI_MASKING</span>
          <span className="truncate">Masked 12 patient records to "First L."</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[#14b8a6]">14:02:14</span>
          <span className="text-slate-500">AI_RESPONSE</span>
          <span className="truncate">Generated proposal for Sarah M.</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[#14b8a6]">14:03:05</span>
          <span className="text-emerald-500">USER_ACTION</span>
          <span className="truncate">Staff ID 402 clicked 'Confirm'</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[#14b8a6]">14:03:06</span>
          <span className="text-blue-500">DATA_WRITE</span>
          <span className="truncate">Dentrix DB: Inserted appointment ID 9942</span>
        </div>
      </div>
    </div>
  )
}

function ActivityIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
