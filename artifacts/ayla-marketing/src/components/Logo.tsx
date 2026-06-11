export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#14b8a6] to-[#0f766e] flex items-center justify-center shadow-sm">
        <span className="text-white font-bold text-lg leading-none">A</span>
      </div>
      <span className="text-[#0f766e] font-bold text-xl tracking-tight">Ayla</span>
    </div>
  );
}
