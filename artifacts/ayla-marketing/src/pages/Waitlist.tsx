import { useSEO } from "@/hooks/useSEO";
import { WaitlistForm } from "@/components/WaitlistForm";

export default function Waitlist() {
  useSEO({
    title: "Join the Waitlist",
    description: "Get early access to Mandi — the AI copilot that finds unscheduled treatment and schedule gaps in your dental practice.",
    path: "/waitlist",
  });

  return (
    <div className="flex flex-col w-full pb-24 items-center min-h-[80vh] justify-center bg-[#f8fafc] px-4 py-12">
      <div className="w-full max-w-md bg-white border border-border/50 rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0f172a] mb-3">Join the waitlist</h1>
          <p className="text-[#64748b]">
            Leave your details and we'll reach out as soon as we're ready to onboard new practices.
          </p>
        </div>

        <WaitlistForm submitLabel="Join Waitlist" />
      </div>
    </div>
  );
}
