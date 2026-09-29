"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
} from "recharts";
import AnimatedCounter from "./AnimatedCounter";
import IndiaFlag from "./IndiaFlag";
import { useProjects } from "@/app/lib/store";
import { riskColor } from "@/app/lib/utils";
import {
  Radio,
  Search,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export default function Dashboard({
  onSelectProject,
}: {
  onSelectProject: (id: string) => void;
}) {
  const { projects } = useProjects();
  const [search, setSearch] = useState("");

  // Recompute KPIs dynamically from live project store
  const totalProjectsAtRisk = projects.filter((p) => p.riskBand === "High" || p.riskBand === "Medium").length;
  
  const totalOverrunCr = projects.reduce((acc, p) => {
    const costExtra = (p.sanctionedCostCr * p.predictedCostOverrunPct) / 100;
    return acc + costExtra;
  }, 0);

  const avgSlippageMonths = (
    projects.reduce((acc, p) => acc + p.predictedDelayMonths, 0) / Math.max(projects.length, 1)
  ).toFixed(1);

  const highRiskCount = projects.filter((p) => p.riskBand === "High").length;
  const earlyWarningsCount = projects.filter((p) => p.riskScore >= 60).length;

  const riskCounts = [
    { name: "Low Risk (Cat C)", value: projects.filter((p) => p.riskBand === "Low").length, color: "#059669" },
    { name: "Medium Risk (Cat B)", value: projects.filter((p) => p.riskBand === "Medium").length, color: "#D97706" },
    { name: "High Risk (Cat A)", value: projects.filter((p) => p.riskBand === "High").length, color: "#DC2626" },
  ];

  const scatterData = projects.map((p) => ({
    x: p.predictedCostOverrunPct,
    y: p.predictedDelayMonths,
    z: p.sanctionedCostCr,
    band: p.riskBand,
    name: p.name,
  }));

  // Dynamic alerts generated from projects with high/medium risk
  const generatedAlerts = projects
    .filter((p) => p.riskScore >= 60)
    .sort((a, b) => b.riskScore - a.riskScore)
    .map((p) => {
      const topDriver = p.shapDrivers && p.shapDrivers[0] ? p.shapDrivers[0].feature : "Expenditure Ratio";
      return {
        id: p.id,
        level: p.riskBand === "High" ? "high" : "medium",
        title: `${p.name} (${p.ministry}, ${p.state})`,
        text: `${p.riskScore}% risk probability of ${p.predictedDelayMonths}-month delay & ${p.predictedCostOverrunPct}% cost overrun. Top driver: '${topDriver}'.`,
        score: p.riskScore,
      };
    });

  const filteredProjects = projects
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.ministry.toLowerCase().includes(search.toLowerCase()) ||
        p.state.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="animate-[fadeUp_0.4s_ease]">
      {/* Header Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 glass p-5 border border-slate-200 bg-white relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-[#0B193C] to-[#138808]" />
        <div>
          <div className="flex items-center gap-2.5 mb-1 pt-1">
            <IndiaFlag className="w-5 h-3.5" />
            <h2 className="text-2xl font-black text-[#0B193C] font-sans tracking-tight">
              Mission Control — National Risk Governance
            </h2>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
              NATIONAL INFRASTRUCTURE REGISTER ({projects.length} PROJECTS)
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Real-time portfolio intelligence, XGBoost cost predictions & SHAP driver attribution for Ministry Officers
          </p>
        </div>
      </div>

      {/* Official White KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="glass p-4 border border-slate-200 bg-white shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
            PROJECTS AT RISK
          </div>
          <div className="text-2xl font-black text-amber-700 font-mono">
            <AnimatedCounter target={totalProjectsAtRisk} />
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">Category A + B Flagged</div>
        </div>

        <div className="glass p-4 border border-slate-200 bg-white shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
            ESTIMATED OVERRUN
          </div>
          <div className="text-2xl font-black text-red-600 font-mono">
            ₹<AnimatedCounter target={Math.round(totalOverrunCr)} />Cr
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">Portfolio Cumulative</div>
        </div>

        <div className="glass p-4 border border-slate-200 bg-white shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
            AVG SCHEDULE SLIPPAGE
          </div>
          <div className="text-2xl font-black text-orange-600 font-mono">
            {avgSlippageMonths} mo
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">National Portfolio Average</div>
        </div>

        <div className="glass p-4 border border-slate-200 bg-white shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
            EARLY WARNING FLAGS
          </div>
          <div className="text-2xl font-black text-blue-700 font-mono">
            <AnimatedCounter target={earlyWarningsCount} />
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">Risk Score &ge; 60</div>
        </div>

        <div className="glass p-4 animate-pulseGlow border border-red-300 bg-red-50/30 shadow-xs">
          <div className="text-[11px] font-bold text-red-900 mb-1 uppercase tracking-wider">
            CATEGORY-A RED FLAGS
          </div>
          <div className="text-2xl font-black text-red-700 font-mono">
            <AnimatedCounter target={highRiskCount} />
          </div>
          <div className="text-[10px] text-red-800 mt-1 font-medium">Score &ge; 70 Critical</div>
        </div>
      </div>

      {/* Dynamic Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="glass p-5 border border-slate-200 bg-white shadow-xs">
          <div className="text-sm font-bold text-[#0B193C] mb-3 flex items-center justify-between">
            <span>Portfolio Risk Severity Breakdown</span>
            <span className="text-[10px] text-slate-500 mono font-semibold">GOI Category A-C</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={riskCounts}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {riskCounts.map((e) => (
                    <Cell key={e.name} fill={e.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
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
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-5 lg:col-span-2 border border-slate-200 bg-white shadow-xs">
          <div className="text-sm font-bold text-[#0B193C] mb-3 flex items-center justify-between">
            <span>Cost vs Time Overrun Dispersion Matrix</span>
            <span className="text-[10px] text-slate-500 mono font-semibold">PM Gati Shakti Master Dataset</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Cost Overrun %"
                  unit="%"
                  stroke="#64748B"
                  fontSize={11}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Delay (months)"
                  stroke="#64748B"
                  fontSize={11}
                />
                <ZAxis type="number" dataKey="z" range={[40, 500]} />
                <Tooltip
                  contentStyle={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: 8,
                    color: "#0F172A",
                    fontSize: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  formatter={(v: any, n: any) => [v, n]}
                />
                <Scatter data={scatterData}>
                  {scatterData.map((d, i) => (
                    <Cell
                      key={i}
                      fill={
                        d.band === "High"
                          ? "#DC2626"
                          : d.band === "Medium"
                          ? "#D97706"
                          : "#059669"
                      }
                      fillOpacity={0.85}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Macro Sensitivity Ticker */}
      <div className="glass p-3.5 mb-6 overflow-hidden border border-amber-200 bg-amber-50/50 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="text-xs font-bold text-amber-900 shrink-0 flex items-center gap-1.5 font-mono">
            <Radio className="w-3.5 h-3.5 text-amber-700" />
            <span>TIER-3 GOI SENSITIVITY FEED:</span>
          </div>
          <div className="overflow-hidden flex-1">
            <div className="flex gap-8 marquee whitespace-nowrap text-xs">
              {[
                "IMD Monsoon Anomaly: +14% Rainfall in Bihar Corridor",
                "MoCIP Cement Wholesale Index: +6.2%",
                "TMT Steel Benchmark (MoS): +4.8%",
                "Fuel Diesel Index: −1.3%",
                "Land Acquisition ROW Lag Index: High",
                "IMD Monsoon Anomaly: +14% Rainfall in Bihar Corridor",
              ].map((t, i) => (
                <span key={i} className="text-slate-800 font-mono font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table + Live Alert Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Table */}
        <div className="glass p-5 xl:col-span-2 border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <div className="text-sm font-bold text-[#0B193C]">
                National Infrastructure Projects Directory
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Displaying {filteredProjects.length} registered projects sorted by risk priority
              </div>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search project, ministry, state..."
                className="bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-100 backdrop-blur z-10">
                <tr className="text-slate-700 border-b border-slate-300">
                  <th className="text-left py-2.5 px-2.5 font-bold">PROJECT NAME</th>
                  <th className="text-left py-2.5 px-2.5 font-bold">MINISTRY</th>
                  <th className="text-left py-2.5 px-2.5 font-bold">STATE</th>
                  <th className="text-right py-2.5 px-2.5 font-bold">COST OVERRUN</th>
                  <th className="text-right py-2.5 px-2.5 font-bold">DELAY</th>
                  <th className="text-center py-2.5 px-2.5 font-bold">RISK SEVERITY</th>
                  <th className="text-center py-2.5 px-2.5 font-bold">GOVERNANCE</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => {
                  const isNewlyAdded = p.id.startsWith("SIH-PRJ-") && parseInt(p.id.replace("SIH-PRJ-", "")) > 40;
                  return (
                    <tr
                      key={p.id}
                      className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                        isNewlyAdded ? "bg-amber-50/60 border-l-4 border-l-amber-500" : ""
                      }`}
                    >
                      <td className="py-3 px-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{p.name}</span>
                          {isNewlyAdded && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500 text-slate-950 animate-pulse">
                              NEW INGESTION
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 mono font-semibold">GOI/{p.id}</div>
                      </td>
                      <td className="py-3 px-2.5 text-slate-700 font-medium">{p.ministry}</td>
                      <td className="py-3 px-2.5 text-slate-700 font-medium">{p.state}</td>
                      <td className="py-3 px-2.5 text-right text-red-600 mono font-black">
                        {p.predictedCostOverrunPct}%
                      </td>
                      <td className="py-3 px-2.5 text-right text-amber-700 mono font-black">
                        {p.predictedDelayMonths} mo
                      </td>
                      <td className="py-3 px-2.5 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${riskColor(
                            p.riskBand
                          )}`}
                        >
                          {p.riskScore} {p.riskBand}
                        </span>
                      </td>
                      <td className="py-3 px-2.5 text-center">
                        <button
                          onClick={() => onSelectProject(p.id)}
                          className="text-[10px] font-bold px-3 py-1 rounded-lg bg-[#0B193C] text-white hover:bg-blue-900 transition-all shadow-xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Inspect SHAP</span>
                          <ChevronRight className="w-3 h-3 text-blue-200" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Live Alert Feed */}
        <div className="glass p-5 border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <div className="text-sm font-bold text-[#0B193C]">
                National Risk Alert Dispatch
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
              {generatedAlerts.length} ALERTS
            </span>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {generatedAlerts.slice(0, 10).map((a, i) => (
              <div
                key={i}
                onClick={() => onSelectProject(a.id)}
                className="group cursor-pointer animate-[slideIn_0.4s_ease] p-3.5 rounded-xl border-l-4 bg-slate-50 border-slate-200 hover:bg-amber-50/40 transition-all shadow-xs"
                style={{
                  borderLeftColor: a.level === "high" ? "#DC2626" : "#D97706",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div
                    className="text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5"
                    style={{
                      color: a.level === "high" ? "#B91C1C" : "#B45309",
                    }}
                  >
                    {a.level === "high" ? (
                      <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    )}
                    <span>
                      {a.level === "high" ? "CATEGORY-A CRITICAL ALERT" : "CATEGORY-B WARNING"} (SCORE: {a.score})
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-700 group-hover:underline font-bold inline-flex items-center gap-0.5">
                    <span>View Record</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 mb-1">
                  {a.title}
                </div>
                <div className="text-[11px] text-slate-700 leading-relaxed font-sans">
                  {a.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}