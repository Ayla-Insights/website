import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col w-full min-h-[70vh] items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto bg-white border border-border/50 rounded-2xl p-12 shadow-sm">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-6">
          <AlertCircle className="h-8 w-8 text-slate-400" />
        </div>
        <h1 className="text-3xl font-bold text-[#0f172a] mb-4">Page not found</h1>
        <p className="text-[#64748b] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" data-testid="link-home-404">
          <Button className="bg-[#0d9488] hover:bg-[#0f766e] text-white">
            Return home
          </Button>
        </Link>
      </div>
    </div>
  );
}
