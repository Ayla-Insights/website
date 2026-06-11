import { BookOpen } from "lucide-react";

export default function Blog() {
  return (
    <div className="flex flex-col w-full min-h-[70vh] items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto bg-white border border-border/50 rounded-2xl p-12 shadow-sm">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f0fdfa] mb-6">
          <BookOpen className="h-8 w-8 text-[#0d9488]" />
        </div>
        <h1 className="text-3xl font-bold text-[#0f172a] mb-4">Blog coming soon</h1>
        <p className="text-lg text-[#64748b]">
          Dental practice management insights from the Ayla team.
        </p>
      </div>
    </div>
  );
}
