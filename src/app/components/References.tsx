"use client";

export default function References() {
  const groups = [
    {
      title: "🏛️ GOVERNMENT POLICY & DATA ECOSYSTEM",
      items: [
        {
          label: "MoSPI — Infrastructure & Project Monitoring Division (IPMD)",
          desc: "Monthly Status Report on Central Sector Projects (₹150 Cr & above), 2006–2026. Baseline covering 1,981 projects across ministries.",
        },
        {
          label: "PAIMANA Portal & Common Upload Form (CUF) Specifications",
          desc: "Ministry of Statistics and Programme Implementation (MoSPI), Govt. of India.",
        },
      ],
    },
    {
      title: "🧠 PREDICTIVE ML & MODEL EXPLAINABILITY (XAI)",
      items: [
        {
          label: "A Unified Approach to Interpreting Model Predictions",
          desc: "Lundberg, S. M., & Lee, S.-I. — NeurIPS. SHAP framework for local feature attribution.",
        },
        {
          label: "LightGBM: A Highly Efficient Gradient Boosting Decision Tree",
          desc: "Ke, G. et al. — NeurIPS. High-speed gradient boosting for sparse, imbalanced tabular time-series forecasting.",
        },
      ],
    },
    {
      title: "📐 INFRASTRUCTURE RISK & COST ESCALATION LITERATURE",
      items: [
        {
          label: "Megaprojects and Risk: An Anatomy of Ambition",
          desc: "Flyvbjerg, B., Bruzelius, N., & Rothengatter, W. — Cambridge University Press.",
        },
        {
          label: "Delays and Cost Overruns in Indian Infrastructure Projects",
          desc: "Singh, R. — Economic and Political Weekly & IPMD Data Empirical Studies.",
        },
      ],
    },
  ];

  return (
    <div className="animate-[fadeUp_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white">
          References & Verification
        </h2>
        <p className="text-sm text-slate-400">
          Government sources, academic literature, and open repositories
        </p>
      </div>

      <div className="space-y-5 mb-6">
        {groups.map((g, i) => (
          <div key={i} className="glass p-5">
            <div className="text-sm font-bold text-blue-300 tracking-wider mb-3">
              {g.title}
            </div>
            <div className="space-y-3">
              {g.items.map((it, j) => (
                <div
                  key={j}
                  className="p-3 rounded-lg bg-slate-900/40 border-l-2 border-blue-500/40"
                >
                  <div className="text-sm font-semibold text-slate-200">
                    {it.label}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{it.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-5 border-l-4 border-emerald-500">
        <div className="text-sm font-bold text-emerald-300 mb-3">
          🔗 VERIFICATION LINKS & OPEN REPOSITORIES
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex flex-wrap gap-2">
            <span className="font-bold text-slate-300">
              Official MoSPI PAIMANA Portal:
            </span>
            <span className="mono text-blue-300">
              paimana-proj.mospi.gov.in
            </span>
            <span className="text-slate-500">
              — Live Central Sector Infrastructure Monitoring Dashboard
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="font-bold text-slate-300">
              SIH 2026 Problem Statement:
            </span>
            <span className="mono text-blue-300">sih.gov.in</span>
            <span className="text-slate-500">
              — PS ID: SIH26103 — AI-powered Early Warning Decision Support
              System
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}