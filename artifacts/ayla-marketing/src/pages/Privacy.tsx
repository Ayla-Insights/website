import { useSEO } from "@/hooks/useSEO";

export default function Privacy() {
  useSEO({
    title: "Privacy Policy",
    description: "Mandi privacy policy — how we handle visitor data on the marketing site.",
    path: "/legal/privacy",
  });
  return (
    <div className="flex flex-col w-full pb-24 px-4 pt-16">
      <div className="container mx-auto max-w-3xl bg-white p-8 md:p-12 rounded-2xl border border-border/50 shadow-sm prose prose-slate">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-[#0f172a] mb-4">Privacy Policy</h1>
          <p className="text-sm font-medium px-3 py-1 bg-amber-100 text-amber-800 rounded-md inline-block">
            Last updated June 11, 2026. Reviewed by counsel: pending.
          </p>
        </div>

        <p>This privacy policy applies only to the Mandi marketing website and visitor data. It does not cover the handling of Protected Health Information (PHI) through our application, which is governed by our Business Associate Agreement (BAA) and platform Terms of Service.</p>
        
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you fill out a form, request a demo, or communicate with us. This may include your name, email address, practice name, and other contact details.</p>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our website</li>
          <li>Respond to your requests and inquiries</li>
          <li>Send you technical notices, updates, and administrative messages</li>
          <li>Communicate with you about products, services, and events</li>
        </ul>

        <h2>3. Analytics and Tracking</h2>
        <p>We use privacy-first analytics that do not track users across websites or employ tracking cookies. We do not use Google Analytics or similar invasive tracking services on our marketing site.</p>

        <h2>4. Data Sharing</h2>
        <p>We do not sell your personal information. We may share your information with service providers who perform services on our behalf, provided they are bound by appropriate confidentiality obligations.</p>

        <h2>5. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@heymandi.ai">privacy@heymandi.ai</a>.</p>
      </div>
    </div>
  );
}
