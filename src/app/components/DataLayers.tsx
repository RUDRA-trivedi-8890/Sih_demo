"use client";

export default function DataLayers() {
  return (
    <div className="animate-[fadeUp_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white">
          Three-Tier Data Architecture
        </h2>
        <p className="text-sm text-slate-400">
          PAIMANA data + derived features + external enrichment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass p-6 border-t-4 border-red-500">
          <div className="inline-block px-3 py-1 rounded-md bg-red-500/20 text-red-300 text-[10px] font-bold tracking-widest mb-3">
            SOURCE
          </div>
          <div className="text-lg font-black text-red-300 mb-2">
            TIER 1 — PAIMANA DATA
          </div>
          <div className="text-xs text-red-200 mb-3">
            (Common Upload Form)
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Project meta data, cost, expenditure, progress, dates,
            ministry/sector/state, status.
          </p>
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs">
            <div className="font-bold text-red-300 mb-1">COVERAGE</div>
            <div className="text-slate-300">
              1,981 ongoing projects • 17 central ministries • 22 core sectors
            </div>
          </div>
        </div>

        <div className="glass p-6 border-t-4 border-emerald-500">
          <div className="inline-block px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold tracking-widest mb-3">
            DERIVED
          </div>
          <div className="text-lg font-black text-emerald-300 mb-2">
            TIER 2 — DERIVED FEATURES
          </div>
          <div className="text-xs text-emerald-200 mb-3">
            Engineered Indicators
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Expenditure ratio, progress shortfall, schedule slippage, progress
            rate, milestone indicators.
          </p>
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs">
            <div className="font-bold text-emerald-300 mb-1">ANALYTICS</div>
            <div className="text-slate-300">
              Detects financial & physical divergence 6–12 months prior to
              deadline.
            </div>
          </div>
        </div>

        <div className="glass p-6 border-t-4 border-blue-500">
          <div className="inline-block px-3 py-1 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold tracking-widest mb-3">
            EXTERNAL
          </div>
          <div className="text-lg font-black text-blue-300 mb-2">
            TIER 3 — MACRO & SPATIAL
          </div>
          <div className="text-xs text-blue-200 mb-3">
            Open-Source Enrichment
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            IMD district monsoon anomalies, commodity price spikes (Cement, TMT
            steel), and spatial overlays.
          </p>
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs">
            <div className="font-bold text-blue-300 mb-1">BENCHMARK</div>
            <div className="text-slate-300">
              Addresses CUF field deficiency by quantifying non-captured
              external risks.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 glass p-5">
        <div className="text-sm font-bold text-slate-200 mb-3">
          Feasibility at a Glance
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-800/40 text-center">
            <div className="text-xs text-slate-500 mb-1">DATA</div>
            <div className="font-bold text-blue-300">
              PAIMANA +<br />
              Open Sources
            </div>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/40 text-center">
            <div className="text-xs text-slate-500 mb-1">ML</div>
            <div className="font-bold text-cyan-300">
              XGBoost
              <br />/ LSTM
            </div>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/40 text-center">
            <div className="text-xs text-slate-500 mb-1">XAI</div>
            <div className="font-bold text-purple-300">
              SHAP
              <br />
              MCP Tools
            </div>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/40 text-center">
            <div className="text-xs text-slate-500 mb-1">DEPLOYMENT</div>
            <div className="font-bold text-emerald-300">
              Web-based
              <br />
              Modular
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}