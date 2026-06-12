import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

export default function About() {
  useSEO({
    title: "About",
    description: "Ayla was built by someone who grew up in dental offices and spent years in enterprise cybersecurity. Here's why we built it — and who we are.",
    path: "/about",
  });
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
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-12 text-center">About the Founder</h2>

          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Avatar placeholder */}
            <div className="shrink-0 mx-auto md:mx-0">
              <div className="w-36 h-36 rounded-2xl bg-[#f1f5f9] border border-border/50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </div>
              <p className="text-xs text-center text-[#94a3b8] mt-2">Photo coming soon</p>
            </div>

            {/* Bio */}
            <div className="space-y-5 text-[#334155] leading-relaxed text-[1.0625rem]">
              <p>
                Some kids grow up wanting to be astronauts. I grew up wanting to be a dentist — until biology had other plans for me. My mom has been practicing dentistry for decades, and some of my earliest memories are sitting in her office, watching her care for patients and quietly fixing whatever the computer was doing wrong that day. That combination — the craft of dentistry and the puzzle of technology — got into my blood early.
              </p>
              <p>
                While studying computer science and engineering in college, I worked for a prominent dental IT company, spending years inside dental practices of every size and shape. I saw firsthand how hard the people in those offices worked, and how much energy got spent wrestling with software instead of serving patients. Practice management systems are powerful — but they weren't built for the person at the front desk who just wants to fill tomorrow's schedule and go home on time.
              </p>
              <p>
                After college I took my skills into aerospace and defense, spending years in cybersecurity ensuring that one of the world's largest companies could trust exactly who had access to its most sensitive systems. It's detailed, high-stakes work — and it taught me that security and simplicity aren't opposites. The best systems are the ones people actually use, because they're designed to get out of the way.
              </p>
              <p>
                But dentistry never let me go. I kept coming back to the same question: why is it so hard for a dental practice to use technology the way the rest of the world does? Dentists spend years mastering an incredibly demanding craft. They shouldn't also have to become IT professionals just to grow their business.
              </p>
              <p>
                Ayla is my answer to that question. It's built from everything I've learned — from years inside dental offices, from enterprise-grade security architecture, and from a genuine love for a field that I almost made my career. My mom still practices. She still calls me when the computer acts up. And she was my very first beta tester.
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
