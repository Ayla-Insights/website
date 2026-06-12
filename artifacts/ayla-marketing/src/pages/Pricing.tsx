import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

export default function Pricing() {
  useSEO({
    title: "Pricing",
    description: "Pricing built for independent dental practices. We're partnering with launch customers to set pricing that pays for itself in the first month.",
    path: "/pricing",
  });
  return (
    <div className="flex flex-col w-full pb-24 items-center justify-center min-h-[70vh]">
      <section className="pt-24 px-4 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-6">Pricing built for independent practices.</h1>
        <p className="text-xl text-[#334155] mb-12 leading-relaxed">
          We're still partnering directly with our launch customers to set pricing that pays for itself in the first month. No public pricing yet.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link href="/book" data-testid="pricing-book-call">
            <Button size="lg" className="bg-[#0d9488] hover:bg-[#0f766e] text-white w-full sm:w-auto h-12 px-8 text-base">
              Book a discovery call
            </Button>
          </Link>
          <Link href="/waitlist" data-testid="pricing-waitlist">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">
              Join the waitlist
            </Button>
          </Link>
        </div>

        <p className="text-sm text-[#64748b] border-t border-border/50 pt-8 inline-block px-12">
          Pricing tiers will be published when we open to new customers.
        </p>
      </section>
    </div>
  );
}
