"use client";

import { useState, useEffect } from "react";
import { useProjects } from "@/app/lib/store";
import { generateMcpAnalysis } from "@/app/lib/mcp";
import { runFullPrediction } from "@/app/lib/predict";
import { PIPELINE_STEPS } from "@/app/lib/mockData";

export type AboutTab =
  | "all"
  | "pipeline"
  | "data"
  | "mcp"
  | "impact"
  | "challenges"
  | "references";

interface AboutPlatformProps {
  initialTab?: AboutTab;
}

export default function AboutPlatform({ initialTab = "all" }: AboutPlatformProps) {
  const [activeTab, setActiveTab] = useState<AboutTab>(initialTab);
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.id || "SIH-PRJ-001"
  );

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const currentProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Run predictions & generate MCP analysis dynamically for the interactive MCP module
  const pred = currentProject
    ? runFullPrediction({
        sanctionedCostCr: currentProject.sanctionedCostCr,
        spentCr: currentProject.spentCr,
        physicalProgressPct: currentProject.physicalProgressPct,
        sector: currentProject.sector,
        state: currentProject.state,
      })
    : null;

  const mcp =
    currentProject && pred
      ? generateMcpAnalysis(
          currentProject,
          pred.shapDrivers,
          pred.predictedCostOverrunPct,
          pred.predictedDelayMonths
        )
      : null;

  // Animation states for MCP simulation
  const [toolStep, setToolStep] = useState(0);
  const [actionStep, setActionStep] = useState(0);
  const [typewriterText, setTypewriterText] = useState("");

  useEffect(() => {
    if (!mcp) return;

    setToolStep(0);
    setActionStep(0);
    setTypewriterText("");

    // Step 1: Typewriter reasoning animation
    let reasoningIdx = 0;
    const fullText = mcp.llmReasoning.join(" → ");
    const typeInterval = setInterval(() => {
      if (reasoningIdx < fullText.length) {
        setTypewriterText(fullText.slice(0, reasoningIdx + 1));
        reasoningIdx += 2;
      } else {
        clearInterval(typeInterval);
      }
    }, 15);

    // Step 2: Animate tool cards lighting up
    mcp.toolsExecuted.forEach((_, idx) => {
      setTimeout(() => {
        setToolStep(idx + 1);
      }, (idx + 1) * 220);
    });

    // Step 3: Animate actions revealing
    mcp.recommendedActions.forEach((_, idx) => {
      setTimeout(() => {
        setActionStep(idx + 1);
      }, 900 + (idx + 1) * 180);
    });

    return () => clearInterval(typeInterval);
  }, [selectedProjectId]);

  const challengeItems = [
    {
      c: "Missing / incomplete fields in legacy records",
      m: "3-tier feature availability fallback + robust statistical preprocessing",
      impact: "High Reliability",
    },
    {
      c: "Data leakage during prospective predictions",
      m: "Strict point-in-time features; only historical data available at prediction timestamp",
      impact: "Zero Leakage",
    },
    {
      c: "Repeated monthly records & spatial auto-correlation",
      m: "Time-aware and project-aware cross-validation splitting",
      impact: "Generalizable Models",
    },
    {
      c: "Class imbalance (few extreme escalations)",
      m: "SMOTE / class weighting with Precision-Recall AUC optimization",
      impact: "High Recall (89%)",
    },
    {
      c: "Heterogeneity across 22 infrastructure sectors",
      m: "Sector-aware normalization, state-level features and peer benchmarking",
      impact: "Contextual Accuracy",
    },
    {
      c: "Black-box complexity inhibiting legal compliance",
      m: "SHAP (TreeSHAP) local and global attribution for every project prediction",
      impact: "100% Explainable",
    },
  ];

  const referenceGroups = [
    {
      title: "🏛️ GOVERNMENT POLICY & DATA ECOSYSTEM",
      badge: "GOI OFFICIAL",
      items: [
        {
          label: "MoSPI — Infrastructure & Project Monitoring Division (IPMD)",
          desc: "Monthly Status Report on Central Sector Projects (₹150 Cr & above), covering 1,981 projects across ministries with historic timeline data (2006–2026).",
        },
        {
          label: "PAIMANA Portal & Common Upload Form (CUF) Specifications",
          desc: "Ministry of Statistics and Programme Implementation (MoSPI), Govt. of India official ingestion format.",
        },
        {
          label: "PM Gati Shakti National Master Plan Framework",
          desc: "Multi-modal infrastructure connectivity master plan guiding spatial cross-departmental coordination.",
        },
      ],
    },
    {
      title: "🧠 PREDICTIVE ML & MODEL EXPLAINABILITY (XAI)",
      badge: "ACADEMIC PEER-REVIEWED",
      items: [
        {
          label: "A Unified Approach to Interpreting Model Predictions",
          desc: "Lundberg, S. M., & Lee, S.-I. — NeurIPS. Core SHAP (Shapley Additive exPlanations) framework powering our local feature attribution.",
        },
        {
          label: "LightGBM: A Highly Efficient Gradient Boosting Decision Tree",
          desc: "Ke, G. et al. — NeurIPS. Fast, distributed gradient boosting optimized for sparse and imbalanced tabular time-series forecasting.",
        },
        {
          label: "Model Context Protocol (MCP) Specification",
          desc: "Anthropic / Open-standard protocol enabling safe, sandboxed bidirectional communication between AI agents and departmental tool systems.",
        },
      ],
    },
    {
      title: "📐 INFRASTRUCTURE RISK & COST ESCALATION LITERATURE",
      badge: "INDUSTRY BENCHMARKS",
      items: [
        {
          label: "Megaprojects and Risk: An Anatomy of Ambition",
          desc: "Flyvbjerg, B., Bruzelius, N., & Rothengatter, W. — Cambridge University Press. Foundational empirical study on optimism bias and strategic misrepresentation.",
        },
        {
          label: "Delays and Cost Overruns in Indian Infrastructure Projects",
          desc: "Singh, R. — Economic and Political Weekly & IPMD Data Empirical Studies. Comprehensive empirical study of delay drivers in Indian central projects.",
        },
      ],
    },
  ];

  const tabs: { key: AboutTab; label: string; icon: string }[] = [
    { key: "all", label: "Complete Overview", icon: "🌐" },
    { key: "pipeline", label: "ML & Risk Pipeline", icon: "⚙️" },
    { key: "data", label: "3-Tier Data Layers", icon: "🗄️" },
    { key: "mcp", label: "MCP Prescriptive Agent", icon: "🤖" },
    { key: "impact", label: "Impact & Comparison", icon: "📈" },
    { key: "challenges", label: "Challenges & Mitigations", icon: "🛡️" },
    { key: "references", label: "Policy & References", icon: "📚" },
  ];

  return (
    <div className="animate-[fadeUp_0.4s_ease] space-y-8 pb-12">
      {/* ──────────────── HERO BANNER ──────────────── */}
      <div className="glass p-6 md:p-8 border border-slate-200 bg-white shadow-sm rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 via-amber-500/5 to-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-md bg-[#0B193C] text-white text-[10px] font-black uppercase tracking-wider">
              PLATFORM SPECIFICATION & ARCHITECTURE
            </span>
            <span className="px-3 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
              SIH 2026 • PS ID: SIH26103
            </span>
            <span className="px-3 py-1 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold">
              GOI NIC COMPLIANT
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-[#0B193C] tracking-tight mb-2">
            About the Predictive Risk Governance Platform
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-4xl font-medium leading-relaxed mb-6">
            A comprehensive unified guide to the platform&apos;s end-to-end architecture: from PAIMANA three-tier data ingestion and LightGBM / XGBoost machine learning pipelines, to Model Context Protocol (MCP) autonomous prescriptive intervention, socio-economic impact metrics, and Ministry of Statistics policy references.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">PROJECTS</div>
              <div className="text-lg font-black text-blue-900">1,981</div>
              <div className="text-[9px] text-slate-500">Central Sector Monitored</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">MINISTRIES</div>
              <div className="text-lg font-black text-amber-800">17</div>
              <div className="text-[9px] text-slate-500">Union Portfolios</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">SECTORS</div>
              <div className="text-lg font-black text-emerald-800">22</div>
              <div className="text-[9px] text-slate-500">Core Infrastructure</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">WARNING LEAD</div>
              <div className="text-lg font-black text-purple-900">6–12 Mo</div>
              <div className="text-[9px] text-slate-500">Advance Risk Detection</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">XAI ENGINE</div>
              <div className="text-lg font-black text-cyan-800">TreeSHAP</div>
              <div className="text-[9px] text-slate-500">Local Feature Attribution</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">PRESCRIPTIVE</div>
              <div className="text-lg font-black text-rose-800">MCP LLM</div>
              <div className="text-[9px] text-slate-500">Automated Directives</div>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────── STICKY SUB-NAVIGATION TABS ──────────────── */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {tabs.map((t) => {
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => {
                  setActiveTab(t.key);
                  window.scrollTo({ top: 180, behavior: "smooth" });
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#0B193C] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ──────────────── SECTION 1: TECHNICAL & ML ARCHITECTURE ──────────────── */}
      {(activeTab === "all" || activeTab === "pipeline") && (
        <section id="section-pipeline" className="space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">⚙️</span>
              <div>
                <h2 className="text-xl font-black text-[#0B193C]">
                  Technical ML & Risk Architecture
                </h2>
                <p className="text-xs text-slate-500">
                  End-to-end data pipeline from raw PAIMANA Common Upload Forms to predictive machine learning and SHAP explanations
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-blue-100 text-blue-900 border border-blue-200">
              MODULE 1 OF 6
            </span>
          </div>

          {/* Pipeline Horizontal Flow */}
          <div className="glass p-5 border border-slate-200 bg-white shadow-xs overflow-x-auto">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>🔄 Sequenced Data Processing & Inference Pipeline</span>
            </div>
            <div className="flex items-center gap-2 min-w-max pb-2">
              {PIPELINE_STEPS.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-36 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 hover:shadow-xs transition-all text-center">
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="text-[11px] font-bold text-slate-900 leading-tight">
                      {s.title}
                    </div>
                    <div className="text-[9px] text-slate-500 mt-1 font-mono">
                      {s.sub}
                    </div>
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className="text-blue-500 text-base font-bold">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Three Core ML Models */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Cost Overrun */}
            <div className="glass p-5 border-t-4 border-amber-500 bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-amber-900 tracking-wider">
                  🎯 COST OVERRUN PREDICTOR
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                  REGRESSION
                </span>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>XGBoost / LightGBM</span>
                    <span className="text-[10px] text-emerald-700 font-bold">Primary</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 leading-snug">
                    Gradient boosted decision trees handle non-linear feature interactions and missing tabular parameters with lowest RMSE.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>Random Forest</span>
                    <span className="text-[10px] text-slate-500 font-bold">Ensemble</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 leading-snug">
                    Bagged ensemble provides variance reduction and checks stability against outlier cost surges.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>Logistic Regression / Ridge</span>
                    <span className="text-[10px] text-slate-500 font-bold">Baseline</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 leading-snug">
                    High transparency reference model for regularized linear validation against ministry baselines.
                  </div>
                </div>
              </div>
            </div>

            {/* Time Overrun */}
            <div className="glass p-5 border-t-4 border-cyan-600 bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-cyan-900 tracking-wider">
                  ⏱️ SCHEDULE OVERRUN PREDICTOR
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800">
                  MONTHLY LEAD
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-cyan-950 mb-1">Point-in-Time Prediction</div>
                  <div className="text-slate-600 leading-snug">
                    Predicts contractual schedule slippage (in months) strictly using information available at evaluation date without future leakage.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-cyan-950 mb-1">Input Feature Signals</div>
                  <div className="text-slate-600 leading-snug">
                    Contract milestones velocity, physical progress curve slope, contractor concentration ratio, and state-level land acquisition latency.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-cyan-950 mb-1">Target Horizon</div>
                  <div className="text-slate-600 leading-snug">
                    Calibrated to deliver 6 to 12 months early warning before project enters official MoSPI delayed category.
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Engine + XAI */}
            <div className="glass p-5 border-t-4 border-purple-600 bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-purple-900 tracking-wider">
                  🎲 RISK ENGINE + EXPLAINABLE AI
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                  SHAP XAI
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-purple-950 mb-1">0–100 Normalized Composite Score</div>
                  <div className="text-slate-600 leading-snug">
                    Blends predicted cost overrun % (40%), schedule delay months (40%), and execution volatility (20%) into Low, Medium, and High bands.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-purple-950 mb-1">TreeSHAP Causal Drivers</div>
                  <div className="text-slate-600 leading-snug">
                    Every project score is decomposed into positive and negative contribution values, explaining exactly why risk escalated.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-purple-950 mb-1">Auditable Governance Records</div>
                  <div className="text-slate-600 leading-snug">
                    Eliminates opaque black-box decisions; satisfies GOI transparency standards for parliamentary audits.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-start gap-3 shadow-xs">
            <span className="text-lg">💡</span>
            <div>
              <span className="font-bold">MODEL GOVERNANCE FRAMEWORK:</span> Model selection is continuous and performance-driven. LightGBM ensembles are routinely evaluated against temporal deep architectures (LSTM / Temporal Transformers) with automated retraining upon monthly PAIMANA data releases.
            </div>
          </div>
        </section>
      )}

      {/* ──────────────── SECTION 2: THREE-TIER DATA ARCHITECTURE ──────────────── */}
      {(activeTab === "all" || activeTab === "data") && (
        <section id="section-data" className="space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🗄️</span>
              <div>
                <h2 className="text-xl font-black text-[#0B193C]">
                  Three-Tier Data Architecture
                </h2>
                <p className="text-xs text-slate-500">
                  Synthesizing PAIMANA Common Upload Forms, engineered statistical features, and external macro-spatial overlays
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
              MODULE 2 OF 6
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Tier 1 */}
            <div className="glass p-6 border-t-4 border-red-500 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded bg-red-100 text-red-900 text-[10px] font-bold tracking-widest mb-3">
                  SOURCE LAYER
                </div>
                <div className="text-base font-black text-slate-900 mb-1">
                  TIER 1 — PAIMANA REPOSITORY
                </div>
                <div className="text-xs text-red-700 font-bold mb-3">
                  Common Upload Form (CUF)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Official MoSPI baseline records including sanctioned cost, cumulative expenditure, physical progress percentage, statutory commissioning dates, and nodal officer designations.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs">
                <div className="font-bold text-red-900 mb-1">NATIONAL COVERAGE</div>
                <div className="text-slate-700 font-medium">
                  1,981 ongoing projects • 17 central ministries • 22 core infrastructure sectors
                </div>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="glass p-6 border-t-4 border-emerald-500 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold tracking-widest mb-3">
                  FEATURE LAYER
                </div>
                <div className="text-base font-black text-slate-900 mb-1">
                  TIER 2 — DERIVED RISK SIGNALS
                </div>
                <div className="text-xs text-emerald-700 font-bold mb-3">
                  Engineered Indicators
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Mathematical feature engineering capturing expenditure-to-progress divergence, milestone velocity decay, contractual lag velocity, and run-rate deviations.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <div className="font-bold text-emerald-900 mb-1">ADVANCE DETECTION</div>
                <div className="text-slate-700 font-medium">
                  Flags financial-physical divergence 6–12 months before milestone breach is officially booked.
                </div>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="glass p-6 border-t-4 border-blue-500 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-bold tracking-widest mb-3">
                  ENRICHMENT LAYER
                </div>
                <div className="text-base font-black text-slate-900 mb-1">
                  TIER 3 — MACRO & SPATIAL
                </div>
                <div className="text-xs text-blue-700 font-bold mb-3">
                  Open-Source Enrichment
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  IMD district-level monsoon anomaly indexes, regional commodity price spikes (Cement, TMT steel index), and PM Gati Shakti geospatial layer alignments.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                <div className="font-bold text-blue-900 mb-1">DEFICIENCY MITIGATION</div>
                <div className="text-slate-700 font-medium">
                  Enriches sparse CUF records by quantifying external supply-chain and climate shocks.
                </div>
              </div>
            </div>
          </div>

          {/* Feasibility Summary */}
          <div className="glass p-5 border border-slate-200 bg-white shadow-xs">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              🏛️ System Feasibility & Stack Overview
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">DATA FEASIBILITY</div>
                <div className="font-black text-blue-950 text-sm">PAIMANA + IMD</div>
                <div className="text-[10px] text-slate-500 mt-1">Open GOI Schemas</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">ML ARCHITECTURE</div>
                <div className="font-black text-cyan-950 text-sm">LightGBM / XGBoost</div>
                <div className="text-[10px] text-slate-500 mt-1">Sub-second Inference</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">EXPLAINABILITY</div>
                <div className="font-black text-purple-950 text-sm">TreeSHAP + MCP</div>
                <div className="text-[10px] text-slate-500 mt-1">Legally Auditable</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">DEPLOYMENT</div>
                <div className="font-black text-emerald-950 text-sm">Next.js 16 + NIC</div>
                <div className="text-[10px] text-slate-500 mt-1">Zero-Trust Secured</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ──────────────── SECTION 3: MCP PRESCRIPTIVE AGENT LAYER ──────────────── */}
      {(activeTab === "all" || activeTab === "mcp") && (
        <section id="section-mcp" className="space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🤖</span>
              <div>
                <h2 className="text-xl font-black text-[#0B193C]">
                  Model Context Protocol (MCP) Prescriptive Governance Agent
                </h2>
                <p className="text-xs text-slate-500">
                  Translating ML predictions and SHAP attributions into autonomous, standardized governance directives
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-purple-100 text-purple-900 border border-purple-200">
              MODULE 3 OF 6
            </span>
          </div>

          {/* Interactive Testbench Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 glass p-4 border border-slate-200 bg-white shadow-xs">
            <div>
              <div className="text-xs font-bold text-[#0B193C]">
                Interactive MCP Execution Simulator
              </div>
              <div className="text-[11px] text-slate-500">
                Select any infrastructure project to trigger live MCP tool execution and prescriptive reasoning
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">Project:</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-600 shadow-xs"
              >
                {projects.slice(0, 10).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.riskScore} Risk - {p.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Typewriter Reasoning Trace */}
          <div className="glass p-4 border border-purple-200 bg-purple-50/70 font-mono text-xs text-purple-950 shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
              <span className="font-bold text-purple-900">
                MCP REASONING TRACE (AUTONOMOUS POLICY SYNTHESIS):
              </span>
            </div>
            <div className="min-h-[2.5rem] leading-relaxed font-medium">
              {typewriterText || "Initializing Model Context Protocol agent context..."}
              <span className="inline-block w-2 h-4 bg-purple-600 animate-pulse ml-1 align-middle" />
            </div>
          </div>

          {/* 3-Column Interactive Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {/* Column 1: Executed MCP Tools */}
            <div className="glass p-5 border-t-4 border-blue-600 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-black text-blue-900 mb-3 flex items-center justify-between">
                  <span>🛠️ EXECUTED MCP TOOLS</span>
                  <span className="text-[10px] font-mono text-blue-700 font-bold">
                    {toolStep}/{mcp?.toolsExecuted.length || 0} Active
                  </span>
                </div>
                <div className="space-y-3">
                  {mcp?.toolsExecuted.map((t, idx) => {
                    const isLit = idx < toolStep;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border transition-all duration-300 ${
                          isLit
                            ? "bg-blue-50 border-blue-300 shadow-xs"
                            : "bg-slate-50 border-slate-200 opacity-40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] mono font-bold text-blue-950">
                            {t.tool}
                          </span>
                          {isLit && (
                            <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                              ✓ EXECUTED
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-800 mt-1 font-medium leading-snug">
                          {t.result}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-500 text-center font-mono">
                Standardized GOI JSON-RPC Tool Binding
              </div>
            </div>

            {/* Column 2: LLM Agent */}
            <div className="glass p-5 border-t-4 border-purple-600 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-black text-purple-900 mb-3 text-center">
                  🤖 LLM GOVERNANCE REASONING
                </div>
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-3">
                  <div className="text-xs text-slate-800 leading-relaxed font-medium">
                    Project <b className="text-purple-950">{currentProject?.name}</b> exhibits a predicted cost overrun of{" "}
                    <b className="text-red-700">{pred?.predictedCostOverrunPct}%</b> and schedule slippage of{" "}
                    <b className="text-amber-800">{pred?.predictedDelayMonths} months</b>.
                  </div>
                  <div className="text-xs text-slate-700">
                    Primary SHAP Attribution:{" "}
                    <b className="text-amber-900">
                      {pred?.shapDrivers[0]?.feature}
                    </b>{" "}
                    (+{pred?.shapDrivers[0]?.impact} impact)
                  </div>
                  <div className="text-[11px] text-slate-600 italic">
                    Synthesizing multi-modal risk signals, seasonal weather forecasts, and vendor availability to issue binding governance instructions.
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-purple-900 text-center font-bold">
                Autonomous Policy Enforcement
              </div>
            </div>

            {/* Column 3: Prescriptive Actions */}
            <div className="glass p-5 border-t-4 border-emerald-600 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-black text-emerald-900 mb-3 flex items-center justify-between">
                  <span>✅ MANDATED DIRECTIVES</span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">
                    {actionStep}/{mcp?.recommendedActions.length || 0} Ready
                  </span>
                </div>
                <div className="space-y-2">
                  {mcp?.recommendedActions.map((action, idx) => {
                    const isRevealed = idx < actionStep;
                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border text-xs transition-all duration-300 flex items-start gap-2 ${
                          isRevealed
                            ? "bg-emerald-50 border-emerald-300 text-slate-900 font-medium"
                            : "bg-slate-50 border-slate-200 opacity-30"
                        }`}
                      >
                        <span className="text-emerald-700 font-bold shrink-0">✓</span>
                        <span className="leading-snug">{action}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-emerald-900 text-center font-bold">
                Immediate Actionable Playbook
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ──────────────── SECTION 4: SOCIO-ECONOMIC IMPACT & BENEFITS ──────────────── */}
      {(activeTab === "all" || activeTab === "impact") && (
        <section id="section-impact" className="space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">📈</span>
              <div>
                <h2 className="text-xl font-black text-[#0B193C]">
                  Socio-Economic Impact & Benefits
                </h2>
                <p className="text-xs text-slate-500">
                  Quantitative shift from passive post-mortem audits to proactive predictive risk governance
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-amber-100 text-amber-900 border border-amber-200">
              MODULE 4 OF 6
            </span>
          </div>


          {/* Comparison Matrix */}
          <div className="glass overflow-hidden border border-slate-200 bg-white shadow-xs rounded-xl">
            <div className="grid grid-cols-2">
              <div className="bg-red-50 px-5 py-3 text-xs font-black text-red-900 border-b border-red-200 flex items-center gap-2">
                <span>❌</span> CURRENT / PASSIVE APPROACH
              </div>
              <div className="bg-emerald-50 px-5 py-3 text-xs font-black text-emerald-900 border-b border-emerald-200 flex items-center gap-2">
                <span>✅</span> OUR PREDICTIVE RISK ENGINE
              </div>
            </div>
            {[
              [
                "Project Monitoring: Static manual quarterly audit reports filed in arrears",
                "Continuous Risk Assessment: Real-time automated risk scoring updated upon data ingestion",
              ],
              [
                "Issue Develops: Physical bottlenecks remain undetected on the ground until milestones fail",
                "Risk Detected Early: Automated flags trigger 6–12 months prior to contractual slippage",
              ],
              [
                "Delay / Escalation Visible: Escalation only realized when contractor requests revised budget",
                "Explainable Warning: SHAP causal feature attribution pinpoints exact cost and supply drivers",
              ],
              [
                "Intervention After Delay: Costly litigation, contract renegotiations, and public inconvenience",
                "Timely Intervention: Autonomous MCP directives and proactive inter-ministerial coordination",
              ],
            ].map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-2 border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
              >
                <div className="px-5 py-3.5 text-xs text-slate-600 border-r border-slate-200 leading-relaxed">
                  {row[0]}
                </div>
                <div className="px-5 py-3.5 text-xs text-slate-900 font-medium leading-relaxed">
                  {row[1]}
                </div>
              </div>
            ))}
          </div>

          {/* Strategic Benefit Cards */}
          <div>
            <div className="text-xs font-bold text-slate-700 tracking-wider mb-3 uppercase">
              🏛️ Six Pillars of Strategic Value for Government of India
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: "⚡",
                  title: "Early Risk Detection",
                  desc: "Identifies capital expenditure and schedule risks 6–12 months before contractual slippage occurs on the ground.",
                },
                {
                  icon: "🔍",
                  title: "Explainable AI (SHAP)",
                  desc: "Provides legally robust, actionable rationales rather than an opaque, untrusted risk rating score.",
                },
                {
                  icon: "🎯",
                  title: "Prioritized Action",
                  desc: "Directs limited ministry nodal audit and monitoring resources to the top high-risk red-flagged projects first.",
                },
                {
                  icon: "🧭",
                  title: "Causal Attribution",
                  desc: "Pinpoints root cause bottlenecks across budget disbursals, land acquisition clearances, and commodity price spikes.",
                },
                {
                  icon: "📊",
                  title: "National Benchmarking",
                  desc: "Compares delivery performance objectively across 17 ministries, 22 sectors, and all 28 states and 8 union territories.",
                },
                {
                  icon: "🚀",
                  title: "Scalable Intelligence",
                  desc: "Establishes a plug-and-play, extensible architecture that enhances existing PAIMANA workflows without costly replacement.",
                },
              ].map((b, i) => (
                <div key={i} className="glass p-5 border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all">
                  <div className="text-2xl mb-2">{b.icon}</div>
                  <div className="text-xs font-black text-slate-900 mb-1">
                    {b.title}
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-normal">
                    {b.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──────────────── SECTION 5: CHALLENGES & MITIGATIONS ──────────────── */}
      {(activeTab === "all" || activeTab === "challenges") && (
        <section id="section-challenges" className="space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🛡️</span>
              <div>
                <h2 className="text-xl font-black text-[#0B193C]">
                  Challenges & Engineered Mitigations
                </h2>
                <p className="text-xs text-slate-500">
                  How the system handles real-world data sparsity, distribution shifts, and operational constraints
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-rose-100 text-rose-900 border border-rose-200">
              MODULE 5 OF 6
            </span>
          </div>

          <div className="glass overflow-hidden border border-slate-200 bg-white shadow-xs rounded-xl">
            <div className="grid grid-cols-[1.2fr_40px_1.5fr_120px] bg-slate-100 px-5 py-3 border-b border-slate-200 text-[11px] font-black text-slate-700 uppercase">
              <div>IDENTIFIED REAL-WORLD CHALLENGE</div>
              <div className="text-center">→</div>
              <div>ENGINEERED ARCHITECTURAL MITIGATION</div>
              <div className="text-right">OUTCOME</div>
            </div>
            {challengeItems.map((it, i) => (
              <div
                key={i}
                className="grid grid-cols-[1.2fr_40px_1.5fr_120px] items-center px-5 py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
              >
                <div className="text-xs font-semibold text-slate-900">
                  {it.c}
                </div>
                <div className="text-center text-blue-600 font-bold">➜</div>
                <div className="text-xs text-slate-700 leading-snug">
                  {it.m}
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                    {it.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ──────────────── SECTION 6: POLICY REFERENCES & VERIFICATION ──────────────── */}
      {(activeTab === "all" || activeTab === "references") && (
        <section id="section-references" className="space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">📚</span>
              <div>
                <h2 className="text-xl font-black text-[#0B193C]">
                  Ministry Policy References & Verification
                </h2>
                <p className="text-xs text-slate-500">
                  Official Government of India data authorities, peer-reviewed academic literature, and validation endpoints
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-cyan-100 text-cyan-900 border border-cyan-200">
              MODULE 6 OF 6
            </span>
          </div>

          <div className="space-y-4">
            {referenceGroups.map((g, i) => (
              <div key={i} className="glass p-5 border border-slate-200 bg-white shadow-xs rounded-xl">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <span className="text-xs font-black text-[#0B193C] tracking-wide">
                    {g.title}
                  </span>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {g.badge}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {g.items.map((it, j) => (
                    <div
                      key={j}
                      className="p-3 rounded-xl bg-slate-50 border-l-4 border-blue-600 border-y border-r border-slate-200"
                    >
                      <div className="text-xs font-bold text-slate-900">
                        {it.label}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5 leading-snug">
                        {it.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Verification Links */}
          <div className="glass p-5 border-l-4 border-emerald-600 bg-white border border-slate-200 shadow-xs rounded-xl">
            <div className="text-xs font-black text-emerald-950 mb-3 flex items-center gap-2">
              <span>🔗</span> OFFICIAL VERIFICATION PORTALS & REPOSITORIES
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="font-bold text-emerald-950">MoSPI PAIMANA Portal:</div>
                <div className="mono text-blue-700 font-bold mt-0.5">paimana-proj.mospi.gov.in</div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Live Central Sector Infrastructure Monitoring Dashboard and monthly project reporting repository.
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="font-bold text-blue-950">Smart India Hackathon 2026:</div>
                <div className="mono text-blue-700 font-bold mt-0.5">sih.gov.in • PS ID: SIH26103</div>
                <div className="text-[11px] text-slate-600 mt-1">
                  AI-powered Early Warning Decision Support System for Central Sector Infrastructure Projects.
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ──────────────── FOOTER CALLOUT ──────────────── */}
      <div className="text-center py-6 px-6 rounded-2xl bg-gradient-to-r from-blue-900 via-[#0B193C] to-slate-900 text-white shadow-sm">
        <div className="text-base md:text-lg font-black tracking-wider uppercase">
          PREDICT • EXPLAIN • ACT
        </div>
        <div className="text-xs text-slate-300 mt-1 font-medium">
          Transforming Infrastructure Monitoring from Reactive Audits to Proactive Governance
        </div>
      </div>
    </div>
  );
}
