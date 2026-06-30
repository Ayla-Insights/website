import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

export default function About() {
  useSEO({
    title: "About the Founder",
    fullTitleOverride: "About the Founder | Mandi",
    description: "Mandi was built by a founder who grew up in dental offices and spent years in enterprise cybersecurity. Here's why we built it, and who we are.",
    path: "/about",
  });
  return (
    <div className="flex flex-col w-full pb-24">
      {/* Mission Section */}
      <section className="pt-24 pb-16 px-4 bg-[#f8fafc] text-center border-b border-border/40">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-8">Our Mission</h1>
          <p className="text-xl text-[#334155] leading-relaxed">
            Dental practices leave hundreds of thousands of dollars unbilled and untreated every year, not because they're bad at their jobs, but because the systems they use don't surface it. We built Mandi to fix that.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-12 text-center">About the Founder</h2>

          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Founder photo */}
            <div className="shrink-0 mx-auto md:mx-0">
              <img
                src="/fitch-spencer.jpg"
                alt="Fitch Spencer, Founder of Mandi"
                className="w-40 h-40 rounded-2xl object-cover object-top shadow-md border border-border/40"
              />
              <p className="text-sm text-center text-[#0f766e] font-semibold mt-3">Fitch Spencer</p>
              <p className="text-xs text-center text-[#94a3b8] mt-0.5">Founder</p>
            </div>

            {/* Bio */}
            <div className="space-y-5 text-[#334155] leading-relaxed text-[1.0625rem]">
              <p className="text-lg font-medium text-[#0f172a]">
                Grew up fixing computers at his mom's dental office. Spent his career building secure systems at the intersection of healthcare and enterprise technology. Built Mandi because the problem never left him.
              </p>
              <p>
                Some kids grow up wanting to be astronauts. Fitch grew up wanting to be a dentist, until biology had other plans. His mom has been practicing dentistry for decades, and some of his earliest memories are sitting in her office, watching her care for patients and quietly fixing whatever the computer was doing wrong that day. That combination, the craft of dentistry and the puzzle of technology, got into his blood early.
              </p>
              <p>
                While studying computer science and engineering in college, Fitch worked for a prominent dental IT company, spending years inside dental practices of every size and shape. He saw firsthand how hard the people in those offices worked, and how much energy got spent wrestling with software instead of serving patients.
              </p>
              <p>
                After college he took his skills into aerospace and defense, spending years in cybersecurity ensuring that one of the world's largest companies could trust exactly who had access to its most sensitive systems. High-stakes, detailed work, and it taught him that security and simplicity aren't opposites. The best systems are the ones people actually use, because they're designed to get out of the way.
              </p>
              <p>
                But dentistry never let him go. Mandi is the answer to a question Fitch has been sitting with for years: why is it so hard for a dental practice to use technology the way the rest of the world does? His mom still practices. She still calls him when the computer acts up. And she was his very first beta tester.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-[#f0fdfa]">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-6">Ready to see it in action?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/hidden-revenue" data-testid="about-revenue-report-cta">
              <Button size="lg" className="bg-[#0d9488] hover:bg-[#0f766e] text-white h-14 px-10 text-lg">
                Find my hidden revenue →
              </Button>
            </Link>
            <Link href="/demo" data-testid="about-book-cta">
              <Button size="lg" variant="outline" className="border-[#0d9488] text-[#0d9488] hover:bg-[#f0fdfa] h-14 px-10 text-lg">
                Book a discovery call
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
