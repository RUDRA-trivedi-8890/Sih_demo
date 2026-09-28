"use client";

import { useProjects } from "@/app/lib/store";

export type PageKey =
  | "landing"
  | "dashboard"
  | "pipeline"
  | "data"
  | "mcp"
  | "impact"
  | "challenges"
  | "references"
  | "project";

const NAV: { key: PageKey; label: string; icon: string }[] = [
  { key: "landing", label: "National Overview", icon: "🏛️" },
  { key: "dashboard", label: "Mission Control", icon: "📊" },
  { key: "pipeline", label: "ML & Risk Architecture", icon: "⚙️" },
  { key: "data", label: "PAIMANA Data Layers", icon: "🗄️" },
  { key: "mcp", label: "MCP Prescriptive Agent", icon: "🤖" },
  { key: "impact", label: "Socio-Economic Impact", icon: "📈" },
  { key: "challenges", label: "Risk Factors & Mitigation", icon: "🛡️" },
  { key: "references", label: "Ministry Policy References", icon: "📚" },
];

export default function Sidebar({
  current,
  onNavigate,
  onOpenAddProject,
}: {
  current: PageKey;
  onNavigate: (k: PageKey) => void;
  onOpenAddProject?: () => void;
}) {
  const { user, logout, projects } = useProjects();

  const canAddProject = user?.role === "contractor" || user?.role === "admin";

  // Get top 4 high-risk projects for sidebar live feed
  const liveAlerts = projects
    .filter((p) => p.riskScore >= 60)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 4);

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <nav className="glass p-3.5 space-y-1 sticky top-24 border border-slate-200 bg-white shadow-sm">
        {/* Government Officer Credentials Card */}
        {user && (
          <div className="p-3 mb-3 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold text-amber-800 tracking-wider uppercase">
                GOI AUTHORIZED USER
              </span>
              <button
                onClick={logout}
                className="text-[9px] font-bold text-red-600 hover:text-red-800 underline"
              >
                Sign Out
              </button>
            </div>
            <div className="text-xs font-black text-slate-900 flex items-center gap-1.5 truncate">
              <span>
                {user.role === "contractor" ? "🏗️" : user.role === "officer" ? "🏛️" : "⚡"}
              </span>
              <span className="truncate">{user.name}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-200">
                {user.role}
              </span>
              <span className="text-[9px] text-slate-500 mono font-semibold">NIC-GOI</span>
            </div>
          </div>
        )}

        {/* Task 1: Conditional Add Project Button */}
        {canAddProject && (
          <button
            onClick={onOpenAddProject}
            className="w-full py-2.5 px-3 mb-3 rounded-xl bg-[#0B193C] hover:bg-blue-900 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
          >
            <span>➕ Ingest Infrastructure Data</span>
          </button>
        )}

        <div className="px-3 py-1 mb-1 border-b border-slate-100 pb-2">
          <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            PORTAL NAVIGATION
          </div>
        </div>

        {NAV.map((item) => {
          const active =
            current === item.key ||
            (current === "project" && item.key === "dashboard");
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-3 transition-all ${
                active
                  ? "bg-blue-50 border-l-[4px] border-[#FF9933] text-[#0B193C] font-bold shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span>{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Sidebar Live Feed */}
        <div className="border-t border-slate-200 mt-4 pt-3 px-3">
          <div className="text-[10px] font-bold text-red-700 tracking-widest mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              CRITICAL ALERTS
            </span>
            <span className="text-[9px] font-mono text-slate-400">LIVE</span>
          </div>
          <div className="space-y-2 text-[11px] text-slate-700 max-h-44 overflow-y-auto pr-0.5">
            {liveAlerts.map((a, i) => (
              <div
                key={i}
                onClick={() => onNavigate("dashboard")}
                className="cursor-pointer border-l-2 pl-2 py-1 hover:bg-slate-100 rounded-r transition-all"
                style={{
                  borderColor: a.riskBand === "High" ? "#DC2626" : "#D97706",
                }}
              >
                <div className="font-bold text-slate-900 truncate">{a.name}</div>
                <div className="text-[9px] text-slate-500 font-mono font-medium">
                  Risk: {a.riskScore} • {a.predictedDelayMonths} mo delay
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NIC Watermark */}
        <div className="pt-3 border-t border-slate-200 text-[9px] text-slate-400 text-center font-mono">
          DESIGNED FOR SIH 2026 • GOI NIC SPEC
        </div>
      </nav>
    </aside>
  );
}