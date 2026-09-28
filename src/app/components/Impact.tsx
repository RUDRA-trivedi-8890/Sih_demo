"use client";

export default function Impact() {
  return (
    <div className="animate-[fadeUp_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white">Impact & Benefits</h2>
        <p className="text-sm text-slate-400">
          From reactive monitoring to proactive governance
        </p>
      </div>

      {/* Comparison table */}
      <div className="glass overflow-hidden mb-6">
        <div className="grid grid-cols-2">
          <div className="bg-red-500/20 px-5 py-3 text-sm font-bold text-red-300 border-b border-red-500/30">
            ❌ CURRENT / PASSIVE
          </div>
          <div className="bg-emerald-500/20 px-5 py-3 text-sm font-bold text-emerald-300 border-b border-emerald-500/30">
            ✅ PROPOSED / PREDICTIVE
          </div>
        </div>
        {[
          [
            "Project Monitoring (Static manual audit reports)",
            "Continuous Risk Assessment (Real-time automated scoring)",
          ],
          [
            "Issue Develops (Bottleneck undetected on ground)",
            "Risk Detected Early (6–12 months prior warning)",
          ],
          [
            "Delay / Escalation Visible (Discovered after schedule slips)",
            "Explainable Warning (SHAP driver attribution)",
          ],
          [
            "Intervention After Delay (Reactive cost escalations)",
            "Timely Intervention (Proactive procedural review)",
          ],
        ].map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-2 border-b border-slate-800/60 last:border-0"
          >
            <div className="px-5 py-4 text-sm text-slate-400 border-r border-slate-800/60">
              {row[0]}
            </div>
            <div className="px-5 py-4 text-sm text-slate-200">{row[1]}</div>
          </div>
        ))}
      </div>

      {/* Benefit cards */}
      <div className="mb-4">
        <div className="text-sm font-bold text-blue-300 tracking-wider mb-3">
          KEY STRATEGIC & OPERATIONAL BENEFITS
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "⚡",
              title: "Early Risk Detection",
              desc: "Identifies cost and schedule risks 6–12 months before contractual slippage occurs.",
            },
            {
              icon: "🔍",
              title: "Explainable AI (SHAP)",
              desc: "Provides actionable legal and operational rationale rather than an opaque risk score.",
            },
            {
              icon: "🎯",
              title: "Prioritized Action",
              desc: "Directs limited nodal audit resources to the highest-risk red-flagged projects first.",
            },
            {
              icon: "🧭",
              title: "Causal Attribution",
              desc: "Pinpoints exact bottlenecks across budget, land acquisition, and supply chain streams.",
            },
            {
              icon: "📊",
              title: "National Benchmarking",
              desc: "Compares performance objectively across 17 ministries, 22 sectors, and all states.",
            },
            {
              icon: "🚀",
              title: "Scalable Intelligence",
              desc: "Establishes an open-source, extensible baseline for national predictive governance.",
            },
          ].map((b, i) => (
            <div key={i} className="glass glass-hover p-5">
              <div className="text-2xl mb-2">{b.icon}</div>
              <div className="text-sm font-bold text-slate-200 mb-1">
                {b.title}
              </div>
              <div className="text-xs text-slate-400 leading-relaxed">
                {b.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}