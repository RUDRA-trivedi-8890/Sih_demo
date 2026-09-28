"use client";

export default function Challenges() {
  const items = [
    {
      c: "Missing / incomplete fields",
      m: "Feature availability tiers + robust preprocessing",
    },
    {
      c: "Data leakage",
      m: "Only use information available at prediction time",
    },
    {
      c: "Repeated monthly records",
      m: "Time-aware + project-aware train/test split",
    },
    {
      c: "Class imbalance",
      m: "Class weights / resampling + F1 / PR metrics",
    },
    {
      c: "Different project types",
      m: "Sector-aware features and benchmarking",
    },
    {
      c: "Black-box predictions",
      m: "SHAP-based explanations",
    },
  ];

  return (
    <div className="animate-[fadeUp_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white">
          Challenges & Mitigations
        </h2>
        <p className="text-sm text-slate-400">
          How we address real-world data and modeling issues
        </p>
      </div>

      <div className="glass overflow-hidden">
        <div className="grid grid-cols-[1fr_40px_1fr] bg-slate-900/60 px-5 py-3 border-b border-slate-700 text-xs font-bold text-slate-300">
          <div>CHALLENGE</div>
          <div className="text-center">→</div>
          <div>MITIGATION</div>
        </div>
        {items.map((it, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_40px_1fr] px-5 py-4 border-b border-slate-800/60 last:border-0 hover:bg-blue-500/5 transition-colors"
          >
            <div className="text-sm text-slate-300">{it.c}</div>
            <div className="text-center text-blue-400">➜</div>
            <div className="text-sm text-emerald-200">{it.m}</div>
          </div>
        ))}
      </div>
    </div>
  );
}