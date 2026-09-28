export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#050B1F]/90 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/40 bg-violet-500/10">
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-sm font-bold text-violet-200">Heuristic Hackers</span>
          </div>
          <span className="hidden md:block text-xs text-slate-500 mono">
            SIH26-100 • SIH26103
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-300">
              DEMO MODE • HARDCODED DATA
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30">
            <span className="text-lg">💡</span>
            <span className="text-xs font-bold text-orange-200 leading-tight">
              SMART INDIA
              <br />
              HACKATHON 2026
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}