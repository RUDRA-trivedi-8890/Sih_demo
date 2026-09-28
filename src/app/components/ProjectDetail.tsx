"use client";

import { useState, useEffect } from "react";
import RiskGauge from "./RiskGauge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useProjects } from "@/app/lib/store";
import { riskColor } from "@/app/lib/utils";
import { runFullPrediction, generateShapDrivers } from "@/app/lib/predict";
import { generateMcpAnalysis } from "@/app/lib/mcp";
import AddProjectModal from "./AddProjectModal";

export default function ProjectDetail({
  projectId,
  onBack,
}: {
  projectId: string;
  onBack: () => void;
}) {
  const { getProjectById, user } = useProjects();
  const p = getProjectById(projectId);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeMcpToolIndex, setActiveMcpToolIndex] = useState(-1);

  const ANALYSIS_STEPS = [
    "Fetching site progress & financial records from PAIMANA schema...",
    "Running XGBoost cost overrun prediction model...",
    "Running LightGBM time-overrun schedule model...",
    "Generating SHAP feature driver attribution explanations...",
    "Executing Model Context Protocol (MCP) tool bindings...",
    "Synthesizing official prescriptive governance action plan...",
  ];

  const handleRunPrediction = () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setActiveMcpToolIndex(-1);

    ANALYSIS_STEPS.forEach((_, idx) => {
      setTimeout(() => {
        setAnalysisStep(idx + 1);
        if (idx === ANALYSIS_STEPS.length - 1) {
          setTimeout(() => {
            setIsAnalyzing(false);
            triggerMcpAnimations();
          }, 350);
        }
      }, (idx + 1) * 300);
    });
  };

  const triggerMcpAnimations = () => {
    setActiveMcpToolIndex(0);
    const interval = setInterval(() => {
      setActiveMcpToolIndex((prev) => {
        if (prev >= 3) {
          clearInterval(interval);
          return 3;
        }
        return prev + 1;
      });
    }, 250);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  useEffect(() => {
    if (p) {
      triggerMcpAnimations();
    }
  }, [projectId]);

  if (!p) return <div className="p-8 text-slate-500 font-bold">Project record not found in National Registry.</div>;

  // Run live prediction & MCP analysis
  const prediction = runFullPrediction({
    sanctionedCostCr: p.sanctionedCostCr,
    spentCr: p.spentCr,
    physicalProgressPct: p.physicalProgressPct,
    sector: p.sector,
    state: p.state,
  });

  const shapData = prediction.shapDrivers;
  const mcpAnalysis = generateMcpAnalysis(
    p,
    shapData,
    prediction.predictedCostOverrunPct,
    prediction.predictedDelayMonths
  );

  const isContractorOrAdmin = user?.role === "contractor" || user?.role === "admin";

  return (
    <div className="animate-[fadeUp_0.4s_ease]">
      {/* Back button & Official Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 print:hidden">
        <button
          onClick={onBack}
          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-2 font-bold"
        >
          ← Back to National Mission Control
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintDossier}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>🖨️ Print Governance Dossier</span>
          </button>

          {isContractorOrAdmin && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 hover:bg-amber-100 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>✏️ Update Progress & Logs</span>
            </button>
          )}

          <button
            onClick={handleRunPrediction}
            disabled={isAnalyzing}
            className="px-4 py-1.5 rounded-xl bg-[#0B193C] hover:bg-blue-900 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Executing ML Inference...</span>
              </>
            ) : (
              <>
                <span>⚡ Re-Analyze Risk with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Task 10: Analyzing Loading Overlay */}
      {isAnalyzing && (
        <div className="glass p-8 mb-6 border-2 border-amber-400 bg-white shadow-lg animate-[fadeIn_0.2s_ease]">
          <div className="max-w-xl mx-auto text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 border-2 border-amber-500 border-t-transparent animate-spin flex items-center justify-center text-xl">
              🇮🇳
            </div>

            <div>
              <div className="text-xs font-bold text-amber-900 uppercase tracking-widest mb-1">
                GOVERNMENT PREDICTIVE RISK ENGINE
              </div>
              <h3 className="text-xl font-black text-[#0B193C] font-sans">
                Evaluating GOI Record: {p.id} ({p.name})
              </h3>
            </div>

            <div className="space-y-2 text-left bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono">
              {ANALYSIS_STEPS.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 transition-opacity ${
                    idx < analysisStep
                      ? "text-emerald-700 opacity-100 font-bold"
                      : idx === analysisStep
                      ? "text-amber-700 opacity-100 font-bold animate-pulse"
                      : "text-slate-400 opacity-40"
                  }`}
                >
                  <span>{idx < analysisStep ? "✓" : "❯"}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-500 italic">
              Running multi-variable XGBoost cost model & SHAP driver attribution under PM Gati Shakti standards...
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isAnalyzing && (
        <>
          {/* Header */}
          <div className="glass p-6 mb-5 border border-slate-200 bg-white relative overflow-hidden shadow-xs">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-[#0B193C] to-[#138808]" />
            <div className="flex flex-wrap items-start justify-between gap-4 pt-1">
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-xs mono font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
                    NATIONAL RECORD: GOI/{p.id}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 uppercase">
                    OFFICIAL DOSSIER
                  </span>
                </div>
                <h2 className="text-2xl font-black text-[#0B193C] mb-2 font-sans">{p.name}</h2>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-medium">
                    🏛️ {p.ministry}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-medium">
                    🏗️ {p.sector}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-medium">
                    📍 State: {p.state}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-md font-bold border ${riskColor(
                      prediction.riskBand
                    )}`}
                  >
                    CATEGORY-{prediction.riskBand === "High" ? "A" : prediction.riskBand === "Medium" ? "B" : "C"} SEVERITY ({prediction.riskScore}/100)
                  </span>
                </div>
              </div>
              <RiskGauge score={prediction.riskScore} band={prediction.riskBand} />
            </div>
          </div>

          {/* Financial + prediction KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <div className="glass p-4 border border-slate-200 bg-white shadow-xs">
              <div className="text-[11px] text-slate-500 font-bold uppercase mb-1">Sanctioned Outlay</div>
              <div className="text-xl font-black text-[#0B193C] mono">
                ₹{p.sanctionedCostCr.toLocaleString("en-IN")} Cr
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-medium">
                Disbursed: ₹{p.spentCr.toLocaleString("en-IN")} Cr ({p.financialProgressPct}%)
              </div>
            </div>

            <div className="glass p-4 border border-slate-200 bg-white shadow-xs">
              <div className="text-[11px] text-slate-500 font-bold uppercase mb-1">Physical Completion</div>
              <div className="text-xl font-black text-emerald-700 mono">
                {p.physicalProgressPct}%
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-medium">
                Financial Divergence: +{(p.financialProgressPct - p.physicalProgressPct).toFixed(1)}%
              </div>
            </div>

            <div className="glass p-4 border border-slate-200 bg-white shadow-xs">
              <div className="text-[11px] text-slate-500 font-bold uppercase mb-1">Predicted Cost Overrun</div>
              <div className="text-xl font-black text-red-600 mono">
                {prediction.predictedCostOverrunPct}%
              </div>
              <div className="text-[10px] text-slate-500 mono mt-1 font-medium">
                CI: [{prediction.costCi[0]}% – {prediction.costCi[1]}%]
              </div>
            </div>

            <div className="glass p-4 border border-slate-200 bg-white shadow-xs">
              <div className="text-[11px] text-slate-500 font-bold uppercase mb-1">Predicted Schedule Slippage</div>
              <div className="text-xl font-black text-amber-700 mono">
                {prediction.predictedDelayMonths} mo
              </div>
              <div className="text-[10px] text-slate-500 mono mt-1 font-medium">
                CI: [{prediction.delayCi[0]} – {prediction.delayCi[1]} mo]
              </div>
            </div>
          </div>

          {/* SHAP + progress chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <div className="glass p-5 border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-bold text-[#0B193C]">
                  🔍 SHAP Driver Attribution Breakdown
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  XGBoost SHAP Framework
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mb-4">
                Red bars indicate cost & delay risk inflation · Green bars represent risk mitigation factors
              </div>
              <div className="h-72">
                <ResponsiveContainer>
                  <BarChart
                    data={shapData}
                    layout="vertical"
                    margin={{ left: 30, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis type="number" stroke="#64748B" fontSize={11} />
                    <YAxis
                      type="category"
                      dataKey="feature"
                      stroke="#475569"
                      fontSize={10}
                      width={135}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        borderRadius: 8,
                        color: "#0F172A",
                        fontSize: 12,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      formatter={(val: any) => [`Impact: ${val > 0 ? "+" : ""}${val}`, "SHAP Impact Score"]}
                    />
                    <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                      {shapData.map((d, i) => (
                        <Cell key={i} fill={d.impact >= 0 ? "#DC2626" : "#059669"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass p-5 border border-slate-200 bg-white shadow-xs">
              <div className="text-sm font-bold text-[#0B193C] mb-1">
                📈 Physical Progress vs Expenditure Divergence Curve (18 Months)
              </div>
              <div className="text-[11px] text-slate-500 mb-4">
                Tracking site billing pace vs verified physical completion rate
              </div>
              <div className="h-72">
                <ResponsiveContainer>
                  <LineChart data={p.monthlyRecords}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis
                      dataKey="month"
                      stroke="#64748B"
                      fontSize={10}
                      interval={2}
                    />
                    <YAxis stroke="#64748B" fontSize={11} unit="%" />
                    <Tooltip
                      contentStyle={{
                        background: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        borderRadius: 8,
                        color: "#0F172A",
                        fontSize: 12,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line
                      type="monotone"
                      dataKey="progressPct"
                      name="Physical Progress %"
                      stroke="#059669"
                      strokeWidth={2.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenditurePct"
                      name="Disbursed Expenditure %"
                      stroke="#DC2626"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Explainable warning text */}
          <div className="glass p-5 mb-5 border-l-4 border-amber-500 bg-amber-50/60 border border-amber-200">
            <div className="text-sm font-bold text-amber-950 mb-2 flex items-center gap-2">
              <span>⚠️ Official Risk Synthesis & Audit Note</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-sans font-medium">
              {prediction.explanationSummary}
            </p>
          </div>

          {/* MCP Prescriptive Agent Panel */}
          <div className="glass p-6 mb-5 border-l-4 border-purple-600 bg-purple-50/40 border border-purple-200 shadow-xs">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center text-xl">
                  🤖
                </div>
                <div>
                  <div className="text-sm font-bold text-purple-950">
                    Model Context Protocol (MCP) Prescriptive Governance Agent
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Standardized GOI JSON-RPC tool binding & automated policy intervention synthesis
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-purple-900 bg-purple-100 px-2.5 py-1 rounded-full border border-purple-300 font-bold">
                  PREDICT • EXPLAIN • ACT
                </span>
              </div>
            </div>

            {/* Tool calls animated */}
            <div className="space-y-2 mb-6">
              <div className="text-[10px] font-bold text-purple-900 tracking-widest uppercase">
                EXECUTED MCP GOVERNANCE TOOLS
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mcpAnalysis.toolsExecuted.map((t, i) => {
                  const isUnlocked = i <= activeMcpToolIndex;
                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        isUnlocked
                          ? "bg-white border-purple-300 shadow-xs"
                          : "bg-slate-50 border-slate-200 opacity-40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] mono font-bold text-purple-950 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                          🛠️ {t.tool}
                        </span>
                        {isUnlocked && <span className="text-xs text-emerald-700 font-bold">✓ BINDING SUCCESS</span>}
                      </div>
                      <div className="text-xs text-slate-800 mt-1 font-medium">{t.result}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended actions */}
            <div>
              <div className="text-[10px] font-bold text-emerald-900 tracking-widest uppercase mb-3">
                GOVERNANCE DIRECTIVES & MANDATED ACTIONS
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {mcpAnalysis.recommendedActions.map((actionText, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-slate-900 flex items-start gap-2.5 font-medium"
                  >
                    <span className="text-emerald-700 font-bold shrink-0 mt-0.5">✓</span>
                    <span className="leading-relaxed">{actionText}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Deadlines */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-4 border border-slate-200 bg-white shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase mb-1">Sanctioned Target Deadline</div>
              <div className="text-lg font-bold text-[#0B193C] mono">
                {p.originalDeadline}
              </div>
            </div>
            <div className="glass p-4 border border-slate-200 bg-white shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase mb-1">Predicted Revised Deadline</div>
              <div className="text-lg font-bold text-red-600 mono">
                {p.revisedDeadline}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit modal */}
      <AddProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editProject={p}
        onSuccess={() => handleRunPrediction()}
      />
    </div>
  );
}