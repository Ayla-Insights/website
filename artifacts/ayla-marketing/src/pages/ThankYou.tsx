import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

// Redirect-only destination for the Cal.com "leaving meeting" redirect. Not
// linked from nav/footer and noindex — reached only after a discovery call.
export default function ThankYou() {
  useSEO({
    title: "Thank you",
    fullTitleOverride: "Thank you | Mandi",
    description: "Thanks for meeting with Mandi.",
    path: "/thank-you",
    noindex: true,
  });

  return (
    <div className="flex flex-col w-full items-center min-h-[70vh]">
      <section className="pt-24 pb-16 px-4 text-center max-w-xl mx-auto w-full">
        <div className="text-sm font-semibold uppercase tracking-wide text-[#0f766e] mb-4">
          Call complete
        </div>
        <h1 className="text-4xl font-bold text-[#0f172a] mb-6">Thanks for the time.</h1>
        <p className="text-lg text-[#334155] leading-relaxed mb-10">
          I'll follow up by email with next steps. If anything comes up before then, just reply to
          that email. It comes straight to me.
        </p>

        <p className="text-[#64748b] mb-4">In the meantime, here's more on how we handle your data:</p>
        <Link
          href="/security"
          data-testid="thankyou-security-link"
          className="inline-flex items-center gap-2 font-semibold text-[#0d9488] hover:text-[#0f766e]"
        >
          See how we protect your data <ArrowRight className="h-4 w-4" />
        </Link>

        <p className="text-sm text-[#94a3b8] mt-14">
          Questions?{" "}
          <a href="mailto:hello@heymandi.ai" className="text-[#0d9488] hover:underline">
            hello@heymandi.ai
          </a>
        </p>
      </section>
    </div>
  );
}
