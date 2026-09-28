"use client";
import { useEffect, useState } from "react";
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
import { ALERTS_POOL, PROJECTS } from "@/app/lib/mockData";
import { riskColor } from "@/app/lib/utils";

export default function Dashboard({
  onSelectProject,
}: {
  onSelectProject: (id: string) => void;
}) {
  const [feed, setFeed] = useState(ALERTS_POOL.slice(0, 6));
  const [search, setSearch] = useState("");

  useEffect(() => {
    let i = 6;
    const t = setInterval(() => {
      setFeed((prev) => [...prev, ALERTS_POOL[i % ALERTS_POOL.length]].slice(-6));
      i++;
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const riskCounts = [
    { name: "Low", value: PROJECTS.filter((p) => p.riskBand === "Low").length, color: "#10B981" },
    { name: "Medium", value: PROJECTS.filter((p) => p.riskBand === "Medium").length, color: "#F59E0B" },
    { name: "High", value: PROJECTS.filter((p) => p.riskBand === "High").length, color: "#EF4444" },
  ];

  const scatterData = PROJECTS.map((p) => ({
    x: p.predictedCostOverrunPct,
    y: p.predictedDelayMonths,
    z: p.sanctionedCostCr,
    band: p.riskBand,
  }));

  const filtered = PROJECTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.ministry.toLowerCase().includes(search.toLowerCase()) ||
      p.state.toLowerCase().includes(search.toLowerCase())
  )
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 20);

  return (
    <div className="animate-[fadeUp_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white">Mission Control</h2>
        <p className="text-sm text-slate-400">
          Real-time portfolio risk intelligence across all monitored projects
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="glass p-4">
          <div className="text-xs text-slate-400 mb-1">Projects at Risk</div>
          <div className="text-2xl font-black text-amber-400">
            <AnimatedCounter target={247} />
          </div>
        </div>
        <div className="glass p-4">
          <div className="text-xs text-slate-400 mb-1">Predicted Cost Overrun</div>
          <div className="text-2xl font-black text-red-400">
            ₹<AnimatedCounter target={18400} />Cr
          </div>
        </div>
        <div className="glass p-4">
          <div className="text-xs text-slate-400 mb-1">Avg Schedule Slippage</div>
          <div className="text-2xl font-black text-orange-400">
            <AnimatedCounter target={8} />
            .4 mo
          </div>
        </div>
        <div className="glass p-4">
          <div className="text-xs text-slate-400 mb-1">Early Warnings</div>
          <div className="text-2xl font-black text-blue-400">
            <AnimatedCounter target={312} />
          </div>
        </div>
        <div className="glass p-4 animate-pulseGlow">
          <div className="text-xs text-slate-400 mb-1">High-Risk Red Flags</div>
          <div className="text-2xl font-black text-red-500">
            <AnimatedCounter target={42} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="glass p-5">
          <div className="text-sm font-bold text-slate-200 mb-3">Risk Distribution</div>
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
                    <Cell key={e.name} fill={e.color} stroke="#0A1430" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#0A1430",
                    border: "1px solid #1E293B",
                    borderRadius: 8,
                    color: "#F8FAFC",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-5 lg:col-span-2">
          <div className="text-sm font-bold text-slate-200 mb-3">
            Cost vs Time Overrun — Portfolio
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
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
                    background: "#0A1430",
                    border: "1px solid #1E293B",
                    borderRadius: 8,
                    color: "#F8FAFC",
                    fontSize: 12,
                  }}
                  formatter={(v: number, n: string) => [v, n]}
                />
                <Scatter data={scatterData}>
                  {scatterData.map((d, i) => (
                    <Cell
                      key={i}
                      fill={
                        d.band === "High"
                          ? "#EF4444"
                          : d.band === "Medium"
                          ? "#F59E0B"
                          : "#10B981"
                      }
                      fillOpacity={0.7}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Macro ticker */}
      <div className="glass p-4 mb-6 overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="text-xs font-bold text-orange-300 shrink-0">
            🌾 MACRO ENRICHMENT (TIER 3)
          </div>
          <div className="overflow-hidden flex-1">
            <div className="flex gap-8 marquee whitespace-nowrap text-sm">
              {[
                "IMD Monsoon Anomaly: +14% in Bihar",
                "Cement Price: +6.2%",
                "TMT Steel: +4.8%",
                "Fuel Index: −1.3%",
                "IMD Monsoon Anomaly: +14% in Bihar",
                "Cement Price: +6.2%",
                "TMT Steel: +4.8%",
                "Fuel Index: −1.3%",
              ].map((t, i) => (
                <span key={i} className="text-slate-300">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table + Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="glass p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="text-sm font-bold text-slate-200">
              Top High-Risk Projects
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search project, ministry, state..."
              className="bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 w-64 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-900/95 backdrop-blur z-10">
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-2 px-2 font-semibold">PROJECT</th>
                  <th className="text-left py-2 px-2 font-semibold">MINISTRY</th>
                  <th className="text-left py-2 px-2 font-semibold">STATE</th>
                  <th className="text-right py-2 px-2 font-semibold">COST OVR</th>
                  <th className="text-right py-2 px-2 font-semibold">DELAY</th>
                  <th className="text-center py-2 px-2 font-semibold">RISK</th>
                  <th className="text-center py-2 px-2 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-800/50 hover:bg-blue-500/5 transition-colors"
                  >
                    <td className="py-2.5 px-2">
                      <div className="font-semibold text-slate-200">{p.name}</div>
                      <div className="text-[10px] text-slate-500 mono">{p.id}</div>
                    </td>
                    <td className="py-2.5 px-2 text-slate-400">{p.ministry}</td>
                    <td className="py-2.5 px-2 text-slate-400">{p.state}</td>
                    <td className="py-2.5 px-2 text-right text-red-400 mono">
                      {p.predictedCostOverrunPct}%
                    </td>
                    <td className="py-2.5 px-2 text-right text-orange-400 mono">
                      {p.predictedDelayMonths} mo
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${riskColor(
                          p.riskBand
                        )}`}
                      >
                        {p.riskScore} {p.riskBand}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={() => onSelectProject(p.id)}
                        className="text-[10px] font-bold px-2 py-1 rounded-md bg-blue-600/20 text-blue-300 border border-blue-500/40 hover:bg-blue-600/40"
                      >
                        Explain →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <div className="text-sm font-bold text-slate-200">Live Alert Feed</div>
          </div>
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {feed.map((a, i) => (
              <div
                key={i}
                className="animate-[slideIn_0.4s_ease] p-3 rounded-lg border-l-2 bg-slate-900/40"
                style={{
                  borderColor:
                    a.level === "high"
                      ? "#EF4444"
                      : a.level === "medium"
                      ? "#F59E0B"
                      : "#10B981",
                }}
              >
                <div className="text-[10px] font-bold mb-1 tracking-wider"
                  style={{
                    color:
                      a.level === "high"
                        ? "#F87171"
                        : a.level === "medium"
                        ? "#FBBF24"
                        : "#34D399",
                  }}
                >
                  {a.level.toUpperCase()} ALERT
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
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