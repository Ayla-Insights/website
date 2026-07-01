import { useSEO } from "@/hooks/useSEO";

export default function Demo() {
  useSEO({
    title: "Book a Discovery Call",
    fullTitleOverride: "Book a Discovery Call | Mandi",
    description: "30 minutes. We'll show you what Mandi would find in a dental practice your size. No pitch deck.",
    path: "/demo",
  });

  return (
    <div className="flex flex-col w-full pb-24 min-h-[80vh] items-center">
      <section className="pt-24 pb-12 px-4 text-center max-w-2xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-[#0f172a] mb-4">Book a Discovery Call</h1>
        <p className="text-lg text-[#64748b] mb-10">
          30 minutes. We'll connect to your data and show you exactly what you're leaving on the table. No pitch deck.
        </p>

        <div className="w-full rounded-xl overflow-hidden border border-border/60 shadow-sm bg-white">
          <iframe
            data-testid="iframe-cal-embed"
            src="https://cal.com/heymandi"
            width="100%"
            height="700"
            frameBorder="0"
            title="Book a discovery call with Mandi"
          />
          <p className="text-xs text-[#94a3b8] pb-4">Calendar powered by Cal.com</p>
        </div>
      </section>
    </div>
  );
}
