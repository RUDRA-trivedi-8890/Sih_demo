"use client";

import { useState, useEffect } from "react";
import { useProjects } from "@/app/lib/store";
import { generateMcpAnalysis } from "@/app/lib/mcp";
import { runFullPrediction } from "@/app/lib/predict";

export default function MCPPage() {
  const { projects } = useProjects();
  const [selectedId, setSelectedId] = useState<string>(projects[0]?.id || "SIH-PRJ-001");

  const currentProject = projects.find((p) => p.id === selectedId) || projects[0];

  // Run predictions & generate MCP analysis dynamically
  const pred = currentProject
    ? runFullPrediction({
        sanctionedCostCr: currentProject.sanctionedCostCr,
        spentCr: currentProject.spentCr,
        physicalProgressPct: currentProject.physicalProgressPct,
        sector: currentProject.sector,
        state: currentProject.state,
      })
    : null;

  const mcp = currentProject && pred
    ? generateMcpAnalysis(
        currentProject,
        pred.shapDrivers,
        pred.predictedCostOverrunPct,
        pred.predictedDelayMonths
      )
    : null;

  // Animation states
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

    // Step 2: Animate tool cards lighting up 200ms apart
    mcp.toolsExecuted.forEach((_, idx) => {
      setTimeout(() => {
        setToolStep(idx + 1);
      }, (idx + 1) * 250);
    });

    // Step 3: Animate actions revealing
    mcp.recommendedActions.forEach((_, idx) => {
      setTimeout(() => {
        setActionStep(idx + 1);
      }, 1000 + (idx + 1) * 200);
    });

    return () => clearInterval(typeInterval);
  }, [selectedId]);

  return (
    <div className="animate-[fadeUp_0.4s_ease]">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 glass p-5 border border-slate-200 bg-white shadow-xs">
        <div>
          <div className="inline-block px-3.5 py-1 rounded-lg bg-[#0B193C] text-white font-black text-xs tracking-wider mb-2">
            MODEL CONTEXT PROTOCOL (MCP) GOVERNANCE LAYER
          </div>
          <h2 className="text-3xl font-black text-[#0B193C] font-sans">
            From Predictive Risk Data to Prescriptive Action
          </h2>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Model Context Protocol connects XGBoost model predictions & SHAP drivers to real-time GOI LLM tool execution
          </p>
        </div>

        {/* Project Selector */}
        <div className="p-3 bg-slate-50 flex items-center gap-3 border border-slate-300 rounded-xl">
          <label className="text-xs font-bold text-slate-700">Target Record:</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-600"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                GOI/{p.id}: {p.name} ({p.riskScore} Risk)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Typewriter Reasoning Box */}
      <div className="glass p-4 mb-6 border border-purple-200 bg-purple-50/70 font-mono text-xs text-purple-950 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
          <span className="font-bold text-purple-900">LLM GOVERNANCE REASONING TRACE:</span>
        </div>
        <div className="min-h-[2.5rem] leading-relaxed font-medium">
          {typewriterText || "Initializing Model Context Protocol agent context..."}
          <span className="inline-block w-2 h-4 bg-purple-600 animate-pulse ml-1 align-middle" />
        </div>
      </div>

      {/* 3-Column Interactive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {/* Column 1: MCP Tools */}
        <div className="glass p-5 border-t-4 border-blue-600 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-sm font-bold text-blue-900 mb-3 flex items-center justify-between">
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
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                          ✓ ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-800 mt-1 font-medium">{t.result}</div>
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
            <div className="text-sm font-bold text-purple-900 mb-3 text-center">
              🤖 LLM GOVERNANCE REASONING
            </div>
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-3">
              <div className="text-xs text-slate-800 leading-relaxed font-medium">
                Project <b className="text-purple-900">{currentProject?.name}</b> exhibits a predicted cost overrun of{" "}
                <b className="text-red-700">{pred?.predictedCostOverrunPct}%</b> and schedule slippage of{" "}
                <b className="text-amber-700">{pred?.predictedDelayMonths} months</b>.
              </div>
              <div className="text-xs text-slate-700">
                Top SHAP Driver: <b className="text-amber-900">{pred?.shapDrivers[0]?.feature}</b> (+{pred?.shapDrivers[0]?.impact})
              </div>
              <div className="text-[11px] text-slate-500 italic">
                Synthesizing multi-modal risk signals, weather forecasts & vendor availability to issue binding governance instructions.
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-purple-900 text-center font-bold">
            Autonomous Policy Enforcement
          </div>
        </div>

        {/* Column 3: Prescriptive Action */}
        <div className="glass p-5 border-t-4 border-emerald-600 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-sm font-bold text-emerald-900 mb-3 flex items-center justify-between">
              <span>✅ MANDATED DIRECTIVES</span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">
                {actionStep}/{mcp?.recommendedActions.length || 0}
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
                    <span>{action}</span>
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

      <div className="text-center mt-8 py-4 px-6 rounded-xl bg-slate-100 border border-slate-300 shadow-xs">
        <div className="text-base font-black text-[#0B193C]">
          PASSIVE MONITORING → PREDICTIVE GOVERNANCE
        </div>
        <div className="text-xs text-slate-600 mt-1 font-medium">
          PREDICT • EXPLAIN • ACT — Before projects go off-track
        </div>
      </div>
    </div>
  );
}