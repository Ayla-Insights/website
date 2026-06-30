import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { WaitlistForm } from "@/components/WaitlistForm";

export default function Demo() {
  useSEO({
    title: "Book a Discovery Call",
    fullTitleOverride: "Book a Discovery Call | Mandi",
    description: "30 minutes. We'll show you what Mandi would find in a dental practice your size. No pitch deck.",
    path: "/demo",
  });
  const [scheduling, setScheduling] = useState(false);

  return (
    <div className="flex flex-col w-full pb-24 min-h-[80vh] items-center">
      <section className="pt-24 pb-12 px-4 text-center max-w-2xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-[#0f172a] mb-4">Book a Discovery Call</h1>
        <p className="text-lg text-[#64748b] mb-10">
          30 minutes. We'll connect to your data and show you exactly what you're leaving on the table. No pitch deck.
        </p>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8" data-testid="demo-steps">
          <div className="flex items-center gap-2">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${!scheduling ? "bg-[#0d9488] text-white" : "bg-[#ccfbf1] text-[#0f766e]"}`}>
              {scheduling ? "✓" : "1"}
            </span>
            <span className={`text-sm font-medium ${!scheduling ? "text-[#0f172a]" : "text-[#64748b]"}`}>Your details</span>
          </div>
          <div className="h-px w-8 bg-border" />
          <div className="flex items-center gap-2">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${scheduling ? "bg-[#0d9488] text-white" : "bg-[#e2e8f0] text-[#94a3b8]"}`}>
              2
            </span>
            <span className={`text-sm font-medium ${scheduling ? "text-[#0f172a]" : "text-[#94a3b8]"}`}>Pick a time</span>
          </div>
        </div>

        {!scheduling ? (
          <div className="w-full max-w-md mx-auto bg-white border border-border/60 rounded-2xl shadow-sm p-8 text-left">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-[#0f172a] mb-2">First, tell us about your practice</h2>
              <p className="text-sm text-[#64748b]">
                So we can tailor the walkthrough, then you'll pick a time.
              </p>
            </div>
            <WaitlistForm
              submitLabel="Continue to scheduling →"
              submittingLabel="Saving..."
              showInternalSuccess={false}
              onSuccess={() => setScheduling(true)}
            />
          </div>
        ) : (
          <div className="w-full rounded-xl overflow-hidden border border-border/60 shadow-sm bg-white">
            <div className="px-6 pt-6 pb-2 text-center">
              <h2 className="text-xl font-bold text-[#0f172a] mb-1">Pick a time that works</h2>
              <p className="text-sm text-[#64748b]">Thanks! Choose a slot below and we'll see you then.</p>
            </div>
            <iframe
              data-testid="iframe-cal-embed"
              src="https://cal.com/aylainsights"
              width="100%"
              height="660"
              frameBorder="0"
              title="Book a discovery call with Mandi"
            />
            <p className="text-xs text-[#94a3b8] pb-4">Calendar powered by Cal.com</p>
          </div>
        )}
      </section>
    </div>
  );
}
