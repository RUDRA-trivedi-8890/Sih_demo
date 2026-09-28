"use client";
import AnimatedCounter from "./AnimatedCounter";
import { PageKey } from "./Sidebar";

export default function LandingPage({
  onNavigate,
}: {
  onNavigate: (k: PageKey) => void;
}) {
  return (
    <div className="animate-[fadeUp_0.4s_ease]">
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/40 bg-blue-500/10 mb-6">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs font-semibold text-blue-200 tracking-wider">
            SIH 2026 • SMART AUTOMATION • SOFTWARE
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            Predictive Risk Governance
          </span>
          <br />
          <span className="text-slate-200">for Infrastructure Projects</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-3">
          An AI-powered early-warning and decision-support platform. A{" "}
          <span className="text-blue-300 font-semibold">
            predictive-intelligence layer
          </span>{" "}
          over existing PAIMANA data —{" "}
          <span className="text-emerald-300 font-semibold">
            not a replacement
          </span>
          .
        </p>
        <p className="text-sm mono text-slate-500 mb-8">
          Problem Statement ID: SIH26103 • Team: Heuristic Hackers (SIH26-100)
        </p>

        <button
          onClick={() => onNavigate("dashboard")}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 font-bold text-white text-lg glow-blue transition-all"
        >
          Launch Mission Control →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          { target: 1981, color: "text-blue-400", label: "Ongoing Projects Monitored" },
          { target: 17, color: "text-cyan-400", label: "Central Ministries" },
          { target: 22, color: "text-emerald-400", label: "Core Infrastructure Sectors" },
        ].map((s) => (
          <div key={s.label} className="glass glass-hover p-6 text-center">
            <div className={`text-4xl font-black ${s.color}`}>
              <AnimatedCounter target={s.target} />
            </div>
            <div className="text-sm text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="glass p-6 border-l-4 border-red-500/60">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-red-400 font-bold text-sm">PAIMANA TODAY</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/40">
              PASSIVE
            </span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Data collected → descriptive monitoring →{" "}
            <span className="text-red-400 font-semibold">
              issue found after it becomes serious
            </span>
          </p>
        </div>
        <div className="glass p-6 border-l-4 border-emerald-500/60">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-emerald-400 font-bold text-sm">
              OUR APPROACH
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/40">
              PREDICTIVE
            </span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Project data → predictive analytics →{" "}
            <span className="text-emerald-400 font-semibold">
              risk detected early → timely intervention
            </span>
          </p>
        </div>
      </div>

      <div className="glass p-6 mb-6">
        <div className="text-sm font-bold text-blue-300 mb-3 tracking-wider">
          CORE CAPABILITIES
        </div>
        <ul className="grid md:grid-cols-2 gap-3 text-sm text-slate-300">
          <li className="flex gap-2">
            <span className="text-emerald-400">▸</span> Cost-overrun &
            schedule-overrun risk predicted{" "}
            <b className="text-white">before escalation</b>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-400">▸</span> Emerging implementation
            bottlenecks identified early
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-400">▸</span> Explainable early
            warnings for decision-makers
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-400">▸</span> Target:{" "}
            <b className="text-white">proactive 6–12 month advance warnings</b>
          </li>
        </ul>
      </div>

      <div className="text-center py-6 rounded-xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-emerald-600/20 border border-blue-500/30">
        <div className="text-2xl md:text-3xl font-black tracking-wider">
          <span className="text-blue-300">PREDICT</span>
          <span className="text-slate-500 mx-3">•</span>
          <span className="text-purple-300">EXPLAIN</span>
          <span className="text-slate-500 mx-3">•</span>
          <span className="text-emerald-300">ACT</span>
        </div>
        <div className="text-xs text-slate-400 mt-2 tracking-widest">
          BEFORE PROJECTS GO OFF-TRACK
        </div>
      </div>
    </div>
  );
}