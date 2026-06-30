export function Logo({ className = "" }: { className?: string }) {
  // Official Mandi lockup: rings mark + "mandi" wordmark in Hanken Grotesk
  // (loaded via fonts.bunny.net in index.css) — rendered as text, the canonical
  // brand treatment, so it stays crisp and uses the real brand font.
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img src="/favicon.svg" alt="" aria-hidden="true" className="h-8 w-8" />
      <span
        className="font-bold text-2xl text-[#0f172a]"
        style={{ fontFamily: "'Hanken Grotesk', sans-serif", letterSpacing: "-0.035em" }}
      >
        mandi
      </span>
    </div>
  );
}
