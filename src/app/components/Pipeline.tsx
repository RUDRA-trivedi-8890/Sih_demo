"use client";
import { PIPELINE_STEPS } from "@/app/lib/mockData";

export default function Pipeline() {
  return (
    <div className="animate-[fadeUp_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white">Technical Pipeline</h2>
        <p className="text-sm text-slate-400">
          End-to-end flow from raw PAIMANA data to actionable decision support
        </p>
      </div>

      {/* Pipeline flow */}
      <div className="glass p-6 mb-6 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {PIPELINE_STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-40 p-3 rounded-xl bg-slate-900/60 border border-blue-500/30 hover:border-blue-500 transition-all text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-[11px] font-bold text-slate-200 leading-tight">
                  {s.title}
                </div>
                <div className="text-[9px] text-slate-500 mt-1">{s.sub}</div>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <div className="text-blue-500 text-xl">→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Three model cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="glass p-5 border-t-4 border-orange-500">
          <div className="text-sm font-bold text-orange-300 mb-3">
            🎯 COST OVERRUN MODEL
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <div className="text-xs font-bold text-red-300">
                XGBoost / LightGBM
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Gradient boosting. High performance, less interpretable.
              </div>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="text-xs font-bold text-amber-300">
                Random Forest
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Ensemble of decision trees. Good accuracy.
              </div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-xs font-bold text-emerald-300">
                Logistic Regression
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Easy to understand. Linear relationship.
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-5 border-t-4 border-cyan-500">
          <div className="text-sm font-bold text-cyan-300 mb-3">
            ⏱️ TIME OVERRUN MODEL
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-800/40">
              <div className="font-bold text-cyan-300 mb-1">
                Prediction capability
              </div>
              <div className="text-slate-400">
                Predicts future schedule overrun using only information
                available at prediction time.
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40">
              <div className="font-bold text-cyan-300 mb-1">Input features</div>
              <div className="text-slate-400">
                Schedule, physical-progress, milestone & delay features.
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40">
              <div className="font-bold text-cyan-300 mb-1">
                Candidate models
              </div>
              <div className="text-slate-400">
                Logistic Regression, Random Forest, XGBoost/LightGBM.
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-5 border-t-4 border-purple-500">
          <div className="text-sm font-bold text-purple-300 mb-3">
            🎲 RISK ENGINE + XAI
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-800/40">
              <div className="font-bold text-purple-300 mb-1">Scale Risk</div>
              <div className="text-slate-400">
                Scales risk 0–100; categorizes as Low, Medium, High.
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40">
              <div className="font-bold text-purple-300 mb-1">
                Combine Probabilities
              </div>
              <div className="text-slate-400">
                Integrates cost-risk and time-risk probabilities with
                operational signals.
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40">
              <div className="font-bold text-purple-300 mb-1">
                SHAP for Reasons
              </div>
              <div className="text-slate-400">
                Project-specific reasons for risk score — total transparency.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-4 text-xs text-slate-400 italic text-center border-l-4 border-blue-500">
        <b className="text-blue-300">MODEL GOVERNANCE:</b> Model selection is
        performance-driven. Deep learning architectures (LSTM / Temporal
        Transformers) will be benchmarked and deployed if validation gains
        exceed tree ensembles.
      </div>
    </div>
  );
}