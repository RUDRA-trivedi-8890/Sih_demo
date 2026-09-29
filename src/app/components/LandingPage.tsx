"use client";
import AnimatedCounter from "./AnimatedCounter";
import { PageKey } from "./Sidebar";
import StateChoroplethMap from "./StateChoroplethMap";

export default function LandingPage({
  onNavigate,
}: {
  onNavigate: (k: PageKey) => void;
}) {
  return (
    <div className="animate-[fadeUp_0.4s_ease]">
      {/* Hero Banner */}
      <div className="text-center py-10 md:py-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50/80 shadow-2xs mb-6">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-semibold text-blue-800 tracking-wider">
            SIH 2026 • SMART AUTOMATION • SOFTWARE
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4 tracking-tight">
          <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
            Predictive Risk Governance
          </span>
          <br />
          <span className="text-slate-900">for Infrastructure Projects</span>
        </h1>
        <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto mb-3 font-normal leading-relaxed">
          An AI-powered early-warning and decision-support platform. A{" "}
          <span className="text-blue-700 font-semibold">
            predictive-intelligence layer
          </span>{" "}
          over existing PAIMANA data —{" "}
          <span className="text-emerald-700 font-semibold">
            not a replacement
          </span>
          .
        </p>
        <p className="text-xs md:text-sm mono text-slate-500 mb-8 font-medium">
          Problem Statement ID: SIH26103 • Team: Heuristic Hackers (SIH26-100)
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => onNavigate("dashboard")}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 font-bold text-white text-base shadow-md hover:shadow-lg transition-all"
          >
            Launch Mission Control →
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("state-map-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 font-bold text-slate-800 text-base shadow-2xs transition-all"
          >
            Explore State-wise Map ↓
          </button>
        </div>
      </div>

      {/* National Portoflio Metric Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          { target: 1981, color: "text-blue-700", label: "Ongoing Projects Monitored" },
          { target: 17, color: "text-indigo-700", label: "Central Ministries" },
          { target: 22, color: "text-emerald-700", label: "Core Infrastructure Sectors" },
        ].map((s) => (
          <div key={s.label} className="glass glass-hover p-6 text-center bg-white border border-slate-200">
            <div className={`text-4xl font-black ${s.color} font-mono`}>
              <AnimatedCounter target={s.target} />
            </div>
            <div className="text-sm font-semibold text-slate-600 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── State-wise Projects Choropleth Map Section ── */}
      <div id="state-map-section">
        <StateChoroplethMap />
      </div>

      {/* Comparison Cards: PAIMANA TODAY vs OUR APPROACH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="glass p-6 border-l-4 border-red-500 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-red-700 font-bold text-sm">PAIMANA TODAY</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
              PASSIVE
            </span>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed">
            Data collected → descriptive monitoring →{" "}
            <span className="text-red-700 font-semibold">
              issue found after it becomes serious
            </span>
          </p>
        </div>
        <div className="glass p-6 border-l-4 border-emerald-500 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-emerald-700 font-bold text-sm">
              OUR APPROACH
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              PREDICTIVE
            </span>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed">
            Project data → predictive analytics →{" "}
            <span className="text-emerald-700 font-semibold">
              risk detected early → timely intervention
            </span>
          </p>
        </div>
      </div>

      {/* Core Capabilities */}
      <div className="glass p-6 mb-6 bg-white border border-slate-200">
        <div className="text-sm font-bold text-blue-900 mb-3 tracking-wider uppercase">
          CORE CAPABILITIES
        </div>
        <ul className="grid md:grid-cols-2 gap-3 text-sm text-slate-700">
          <li className="flex gap-2">
            <span className="text-emerald-600 font-bold">▸</span> Cost-overrun &
            schedule-overrun risk predicted{" "}
            <b className="text-slate-900">before escalation</b>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-600 font-bold">▸</span> Emerging implementation
            bottlenecks identified early
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-600 font-bold">▸</span> Explainable early
            warnings for decision-makers
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-600 font-bold">▸</span> Target:{" "}
            <b className="text-slate-900">proactive 6–12 month advance warnings</b>
          </li>
        </ul>
      </div>

      {/* Motto Banner */}
      <div className="text-center py-6 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-slate-200">
        <div className="text-2xl md:text-3xl font-black tracking-wider">
          <span className="text-blue-800">PREDICT</span>
          <span className="text-slate-400 mx-3">•</span>
          <span className="text-indigo-800">EXPLAIN</span>
          <span className="text-slate-400 mx-3">•</span>
          <span className="text-emerald-800">ACT</span>
        </div>
        <div className="text-xs font-semibold text-slate-600 mt-2 tracking-widest">
          BEFORE PROJECTS GO OFF-TRACK
        </div>
      </div>
    </div>
  );
}