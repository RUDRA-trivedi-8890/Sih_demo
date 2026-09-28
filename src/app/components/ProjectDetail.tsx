"use client";
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
import { getProjectById } from "@/app/lib/mockData";
import { riskColor } from "@/app/lib/utils";

export default function ProjectDetail({
  projectId,
  onBack,
}: {
  projectId: string;
  onBack: () => void;
}) {
  const p = getProjectById(projectId);
  if (!p) return <div className="text-slate-400">Project not found.</div>;

  const shapData = [...p.shapDrivers].sort(
    (a, b) => Math.abs(b.impact) - Math.abs(a.impact)
  );

  return (
    <div className="animate-[fadeUp_0.4s_ease]">
      <button
        onClick={onBack}
        className="text-xs text-slate-400 hover:text-white mb-4 flex items-center gap-2"
      >
        ← Back to Mission Control
      </button>

      {/* Header */}
      <div className="glass p-6 mb-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs mono text-slate-500 mb-1">{p.id}</div>
            <h2 className="text-2xl font-black text-white mb-2">{p.name}</h2>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 rounded-md bg-slate-800/60 text-slate-300">
                🏛️ {p.ministry}
              </span>
              <span className="px-2 py-1 rounded-md bg-slate-800/60 text-slate-300">
                🏗️ {p.sector}
              </span>
              <span className="px-2 py-1 rounded-md bg-slate-800/60 text-slate-300">
                📍 {p.state}
              </span>
              <span
                className={`px-2 py-1 rounded-md font-bold border ${riskColor(
                  p.riskBand
                )}`}
              >
                {p.riskBand.toUpperCase()} RISK
              </span>
            </div>
          </div>
          <RiskGauge score={p.riskScore} band={p.riskBand} />
        </div>
      </div>

      {/* Financial + prediction KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <div className="glass p-4">
          <div className="text-xs text-slate-400 mb-1">Sanctioned Cost</div>
          <div className="text-xl font-black text-white mono">
            ₹{p.sanctionedCostCr.toLocaleString("en-IN")} Cr
          </div>
        </div>
        <div className="glass p-4">
          <div className="text-xs text-slate-400 mb-1">Spent</div>
          <div className="text-xl font-black text-amber-400 mono">
            ₹{p.spentCr.toLocaleString("en-IN")} Cr
          </div>
        </div>
        <div className="glass p-4">
          <div className="text-xs text-slate-400 mb-1">Predicted Cost Overrun</div>
          <div className="text-xl font-black text-red-400 mono">
            {p.predictedCostOverrunPct}%
          </div>
          <div className="text-[10px] text-slate-500 mono">
            CI: [{(p.predictedCostOverrunPct * 0.7).toFixed(1)}–{(
              p.predictedCostOverrunPct * 1.3
            ).toFixed(1)}]
          </div>
        </div>
        <div className="glass p-4">
          <div className="text-xs text-slate-400 mb-1">Predicted Delay</div>
          <div className="text-xl font-black text-orange-400 mono">
            {p.predictedDelayMonths} mo
          </div>
          <div className="text-[10px] text-slate-500 mono">
            CI: [{(p.predictedDelayMonths * 0.75).toFixed(1)}–
            {(p.predictedDelayMonths * 1.25).toFixed(1)}]
          </div>
        </div>
      </div>

      {/* SHAP + progress chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="glass p-5">
          <div className="text-sm font-bold text-slate-200 mb-1">
            🔍 SHAP Explanation — Why this risk?
          </div>
          <div className="text-[11px] text-slate-500 mb-4">
            Red bars increase risk · Green bars decrease risk
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart
                data={shapData}
                layout="vertical"
                margin={{ left: 30, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis
                  type="category"
                  dataKey="feature"
                  stroke="#94A3B8"
                  fontSize={10}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0A1430",
                    border: "1px solid #1E293B",
                    borderRadius: 8,
                    color: "#F8FAFC",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                  {shapData.map((d, i) => (
                    <Cell key={i} fill={d.impact >= 0 ? "#EF4444" : "#10B981"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-5">
          <div className="text-sm font-bold text-slate-200 mb-1">
            📈 Progress vs Expenditure (18 months)
          </div>
          <div className="text-[11px] text-slate-500 mb-4">
            Divergence between physical progress and financial expenditure
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={p.monthlyRecords}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis
                  dataKey="month"
                  stroke="#64748B"
                  fontSize={10}
                  interval={2}
                />
                <YAxis stroke="#64748B" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{
                    background: "#0A1430",
                    border: "1px solid #1E293B",
                    borderRadius: 8,
                    color: "#F8FAFC",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="progressPct"
                  name="Physical Progress %"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="expenditurePct"
                  name="Expenditure %"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Explainable warning text */}
      <div className="glass p-5 mb-5 border-l-4 border-amber-500">
        <div className="text-sm font-bold text-amber-300 mb-2">
          ⚠️ Explainable Early Warning
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          This project is flagged{" "}
          <b className="text-red-400">{p.riskBand.toUpperCase()} RISK</b>{" "}
          primarily due to a{" "}
          <b className="text-white">
            {(p.financialProgressPct - p.physicalProgressPct).toFixed(1)}%
            expenditure-progress divergence
          </b>{" "}
          and predicted delay of{" "}
          <b className="text-white">{p.predictedDelayMonths} months</b>,
          compounded by monsoon anomaly in {p.state} and rising commodity
          prices. Early intervention is recommended within the next 30 days.
        </p>
      </div>

      {/* AI Agent / MCP output */}
      <div className="glass p-5 mb-5 border-l-4 border-purple-500">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-lg">🤖</div>
          <div>
            <div className="text-sm font-bold text-purple-300">
              LLM Agent — Prescriptive Action
            </div>
            <div className="text-[11px] text-slate-500">
              Model Context Protocol (MCP) — tool calls & recommended actions
            </div>
          </div>
        </div>

        {/* Tool calls */}
        <div className="space-y-2 mb-5">
          <div className="text-[10px] font-bold text-slate-500 tracking-widest">
            TOOL CALLS EXECUTED
          </div>
          {[
            {
              tool: "get_weather_forecast",
              result: `Heavy monsoon expected in ${p.state} over next 45 days`,
            },
            {
              tool: "get_project_exposure",
              result: `3 critical-path activities exposed to weather`,
            },
            {
              tool: "get_alternate_vendor",
              result: `Vendor B available at +3% cost, ready in 12 days`,
            },
            {
              tool: "get_mitigation_playbook",
              result: `Playbook #7: Accelerate pre-monsoon work`,
            },
          ].map((t, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-slate-900/40 border border-purple-500/20"
            >
              <span className="text-[10px] mono font-bold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded-md border border-purple-500/30">
                🛠️ {t.tool}
              </span>
              <span className="text-xs text-slate-300">{t.result}</span>
            </div>
          ))}
        </div>

        {/* Recommended actions */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 tracking-widest mb-2">
            RECOMMENDED ACTIONS
          </div>
          <ul className="grid md:grid-cols-2 gap-2 text-xs text-slate-200">
            {[
              "Shift to indoor work during monsoon window",
              "Approve +3% cost for alternate vendor",
              "Notify NDRF / district hospital standby",
              "Pre-emptively evacuate low-lying zone",
              "Request 15-day contractual extension",
              "Increase on-site audit frequency to weekly",
            ].map((a, i) => (
              <li
                key={i}
                className="flex gap-2 p-2 rounded-md bg-emerald-500/5 border border-emerald-500/20"
              >
                <span className="text-emerald-400">✓</span> {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Deadlines */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-4">
          <div className="text-xs text-slate-400 mb-1">Original Deadline</div>
          <div className="text-lg font-bold text-slate-200 mono">
            {p.originalDeadline}
          </div>
        </div>
        <div className="glass p-4">
          <div className="text-xs text-slate-400 mb-1">Predicted Revised</div>
          <div className="text-lg font-bold text-red-400 mono">
            {p.revisedDeadline}
          </div>
        </div>
      </div>
    </div>
  );
}