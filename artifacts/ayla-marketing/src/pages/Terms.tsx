import { useSEO } from "@/hooks/useSEO";

export default function Terms() {
  useSEO({
    title: "Terms of Service",
    description: "Ayla Insights terms of service.",
    path: "/legal/terms",
  });
  return (
    <div className="flex flex-col w-full pb-24 px-4 pt-16">
      <div className="container mx-auto max-w-3xl bg-white p-8 md:p-12 rounded-2xl border border-border/50 shadow-sm prose prose-slate">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-[#0f172a] mb-4">Terms of Service</h1>
          <p className="text-sm font-medium px-3 py-1 bg-amber-100 text-amber-800 rounded-md inline-block">
            Last updated June 11, 2026. Reviewed by counsel: pending.
          </p>
        </div>

        <p>These Terms of Service ("Terms") govern your access to and use of the Ayla Insights website. By accessing or using our website, you agree to be bound by these Terms.</p>
        
        <h2>1. Use of the Website</h2>
        <p>You may use our website only for lawful purposes and in accordance with these Terms. You agree not to use the website in any way that violates any applicable federal, state, local, or international law or regulation.</p>

        <h2>2. Intellectual Property</h2>
        <p>The website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by Ayla Insights, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>

        <h2>3. Disclaimer of Warranties</h2>
        <p>Your use of the website is at your own risk. The website is provided on an "as is" and "as available" basis, without any warranties of any kind, either express or implied.</p>

        <h2>4. Limitation of Liability</h2>
        <p>In no event will Ayla Insights, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the website.</p>

        <h2>5. Changes to the Terms</h2>
        <p>We may revise and update these Terms from time to time in our sole discretion. All changes are effective immediately when we post them.</p>

        <h2>6. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at <a href="mailto:hello@aylainsights.com">hello@aylainsights.com</a>.</p>
      </div>
    </div>
  );
}
