"use client";

import React from "react";
import { useProjects } from "@/app/lib/store";
import {
  Landmark,
  LayoutDashboard,
  BookOpen,
  HardHat,
  Building2,
  ShieldCheck,
  PlusCircle,
  LogOut,
} from "lucide-react";

export type PageKey =
  | "landing"
  | "dashboard"
  | "about"
  | "pipeline"
  | "data"
  | "mcp"
  | "impact"
  | "challenges"
  | "references"
  | "project";

interface NavItem {
  key: PageKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV: NavItem[] = [
  { key: "landing", label: "National Overview", icon: Landmark },
  { key: "dashboard", label: "Mission Control", icon: LayoutDashboard },
  { key: "about", label: "About Platform", icon: BookOpen },
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

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "contractor":
        return <HardHat className="w-3.5 h-3.5 text-amber-700" />;
      case "officer":
        return <Building2 className="w-3.5 h-3.5 text-blue-700" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />;
    }
  };

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
          <div className="p-3 mb-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-bold text-amber-800 tracking-wider uppercase">
                GOI AUTHORIZED USER
              </span>
              <button
                onClick={logout}
                className="text-[9px] font-bold text-red-600 hover:text-red-800 flex items-center gap-0.5 hover:underline"
              >
                <LogOut className="w-2.5 h-2.5" />
                Sign Out
              </button>
            </div>
            <div className="text-xs font-black text-slate-900 flex items-center gap-2 truncate">
              <span className="shrink-0 p-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                {getRoleIcon(user.role)}
              </span>
              <span className="truncate">{user.name}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
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
            className="w-full py-2.5 px-3 mb-3 rounded-xl bg-[#0B193C] hover:bg-blue-900 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-200" />
            <span>Ingest Infrastructure Data</span>
          </button>
        )}

        <div className="px-3 py-1 mb-1 border-b border-slate-100 pb-2">
          <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            PORTAL NAVIGATION
          </div>
        </div>

        {NAV.map((item) => {
          const Icon = item.icon;
          const active =
            current === item.key ||
            (current === "project" && item.key === "dashboard") ||
            (item.key === "about" &&
              [
                "about",
                "pipeline",
                "data",
                "mcp",
                "impact",
                "challenges",
                "references",
              ].includes(current));
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-3 transition-all cursor-pointer ${
                active
                  ? "bg-blue-50 border-l-[4px] border-[#FF9933] text-[#0B193C] font-bold shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#0B193C]" : "text-slate-500"}`} />
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