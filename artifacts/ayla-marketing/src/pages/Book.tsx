import { useState } from "react";

export default function Book() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex flex-col w-full pb-24 min-h-[80vh] items-center">
      <section className="pt-24 pb-12 px-4 text-center max-w-2xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-[#0f172a] mb-4">Book a Discovery Call</h1>
        <p className="text-lg text-[#64748b] mb-12">
          20 minutes. We'll show you what Ayla would find in a practice your size. No pitch deck.
        </p>

        <div className="w-full rounded-xl overflow-hidden border border-border/60 shadow-sm bg-white">
          {!loaded ? (
            <div className="flex flex-col items-center justify-center py-20 px-8 gap-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f0fdfa]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
              </div>
              <div>
                <p className="text-[#0f172a] font-semibold text-lg mb-1">Schedule your call</p>
                <p className="text-sm text-[#64748b]">Opens a booking calendar. No account needed.</p>
              </div>
              <button
                data-testid="button-load-calendar"
                onClick={() => setLoaded(true)}
                className="inline-flex items-center gap-2 bg-[#0d9488] hover:bg-[#0f766e] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
                Load calendar
              </button>
              <p className="text-xs text-[#94a3b8]">Calendar powered by Cal.com</p>
            </div>
          ) : (
            <iframe
              data-testid="iframe-cal-embed"
              src="https://cal.com/aylainsights"
              width="100%"
              height="700"
              frameBorder="0"
              title="Book a discovery call with Ayla Insights"
            />
          )}
        </div>
      </section>
    </div>
  );
}
