import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="flex flex-col w-full pb-24">
      {/* Mission Section */}
      <section className="pt-24 pb-16 px-4 bg-[#f8fafc] text-center border-b border-border/40">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-8">Our Mission</h1>
          <p className="text-xl text-[#334155] leading-relaxed">
            Dental practices leave hundreds of thousands of dollars unbilled and untreated every year — not because they're bad at their jobs, but because the systems they use don't surface it. We built Ayla to fix that.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-10 text-center">Who We Are</h2>
          
          <div className="bg-white border border-border/50 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start max-w-2xl mx-auto">
            <div className="w-32 h-32 rounded-xl bg-slate-200 shrink-0 border border-border/50 flex items-center justify-center">
              <span className="text-slate-400 text-sm font-medium">Avatar</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-2">Founder bio coming soon</h3>
              <p className="text-[#64748b] leading-relaxed">
                Name, background, and story will be added here. This space is reserved for the founder's journey into building software for dental practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-[#f0fdfa]">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-6">Ready to see it in action?</h2>
          <Link href="/book" data-testid="about-book-cta">
            <Button size="lg" className="bg-[#0d9488] hover:bg-[#0f766e] text-white h-14 px-10 text-lg mt-4">
              Book a discovery call
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
