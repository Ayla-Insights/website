import { useSEO } from "@/hooks/useSEO";
import TeaserApp from "@/hidden-revenue/TeaserApp";

export default function HiddenRevenue() {
  useSEO({
    title: "Hidden Revenue Report",
    description:
      "See the revenue hiding in your practice's unscheduled treatment and overdue recall. Your file is read entirely in your browser — we never see your patient data.",
    path: "/hidden-revenue",
  });

  return (
    <div className="w-full bg-[#f8fafc] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <TeaserApp />
        <p className="mt-8 text-center text-xs text-slate-400">
          Your file is read entirely in your browser — it never leaves your computer. No trackers on
          this page.
        </p>
      </div>
    </div>
  );
}
