export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/logo-primary.svg"
        alt="Mandi logo"
        className="w-8 h-8 object-contain"
      />
      <span className="text-[#0f766e] font-bold text-xl tracking-tight">Mandi</span>
    </div>
  );
}
