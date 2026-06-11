export default function Book() {
  return (
    <div className="flex flex-col w-full pb-24 min-h-[80vh] items-center">
      <section className="pt-24 pb-12 px-4 text-center max-w-2xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-[#0f172a] mb-4">Book a Discovery Call</h1>
        <p className="text-lg text-[#64748b] mb-12">
          20 minutes. We'll show you what Ayla would find in a practice your size. No pitch deck.
        </p>

        {/* Calendar Embed Placeholder */}
        <div className="w-full bg-white border border-border/60 rounded-xl shadow-sm aspect-[4/3] flex items-center justify-center p-8">
          <div className="text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
              </svg>
            </div>
            <p className="text-slate-500 font-medium">Calendar embed</p>
            <p className="text-sm text-slate-400 mt-2">Paste your Cal.com or Calendly URL here.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
