"use client";
import { useEffect, useState } from "react";
import { ALERTS_POOL } from "@/app/lib/mockData";

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
  { key: "landing", label: "Home", icon: "🏠" },
  { key: "dashboard", label: "Mission Control", icon: "📊" },
  { key: "pipeline", label: "Technical Pipeline", icon: "⚙️" },
  { key: "data", label: "Data Layers", icon: "🗄️" },
  { key: "mcp", label: "MCP Agent", icon: "🤖" },
  { key: "impact", label: "Impact", icon: "📈" },
  { key: "challenges", label: "Challenges", icon: "🛡️" },
  { key: "references", label: "References", icon: "📚" },
];

export default function Sidebar({
  current,
  onNavigate,
}: {
  current: PageKey;
  onNavigate: (k: PageKey) => void;
}) {
  const [feed, setFeed] = useState(ALERTS_POOL.slice(0, 3));
  const [idx, setIdx] = useState(3);

  useEffect(() => {
    const t = setInterval(() => {
      setFeed((prev) => {
        const next = [...prev, ALERTS_POOL[idx % ALERTS_POOL.length]].slice(-3);
        return next;
      });
      setIdx((i) => i + 1);
    }, 4000);
    return () => clearInterval(t);
  }, [idx]);

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <nav className="glass p-3 space-y-1 sticky top-24">
        <div className="px-3 py-2 mb-2">
          <div className="text-[10px] font-bold text-slate-500 tracking-widest">
            NAVIGATION
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
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-all ${
                active
                  ? "bg-gradient-to-r from-blue-600/30 to-blue-600/5 border-l-[3px] border-blue-500 text-white"
                  : "text-slate-400 hover:bg-blue-500/10 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          );
        })}

        <div className="border-t border-slate-800 mt-3 pt-3 px-3">
          <div className="text-[10px] font-bold text-slate-500 tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            LIVE FEED
          </div>
          <div className="space-y-2 text-[11px] text-slate-400 max-h-48 overflow-hidden">
            {feed.map((a, i) => (
              <div
                key={i}
                className="animate-[slideIn_0.4s_ease] border-l-2 pl-2"
                style={{
                  borderColor:
                    a.level === "high"
                      ? "#EF4444"
                      : a.level === "medium"
                      ? "#F59E0B"
                      : "#10B981",
                }}
              >
                {a.text.slice(0, 90)}…
              </div>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}