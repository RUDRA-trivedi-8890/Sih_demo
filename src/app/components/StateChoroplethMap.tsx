"use client";

import React, { useState, useRef, useMemo } from "react";
import IndiaMapData from "@svg-maps/india";
import {
  Calculator,
  Coins,
  Wallet,
  BarChart3,
  CalendarCheck2,
  HardHat,
  Info,
  MapPin,
  RotateCcw,
  TrendingUp,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  STATE_PROJECTS_MAP,
  NATIONAL_SUMMARY_DATA,
  StateProjectData,
  formatIndianCurrency,
  getChoroplethColor,
} from "@/app/data/stateProjectsData";

interface MetricInfo {
  id: string;
  title: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  tooltip: string;
}

export default function StateChoroplethMap() {
  // Default to Gujarat as specified in the prompt requirement
  const defaultStateId = "gj";
  const [selectedStateId, setSelectedStateId] = useState<string>(defaultStateId);
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Mouse cursor position for floating tooltip pill
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Determine currently active state (hover takes precedence unless pinned or mouse leaves)
  const activeStateId = hoveredStateId || selectedStateId;
  const activeStateData: StateProjectData = useMemo(() => {
    return (
      STATE_PROJECTS_MAP[activeStateId] ||
      NATIONAL_SUMMARY_DATA
    );
  }, [activeStateId]);

  // Handle map mouse move for tooltip pill
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!mapContainerRef.current) return;
    const target = e.target as SVGElement | null;
    if (!target || target.tagName.toLowerCase() !== "path") {
      setHoveredStateId(null);
      setCursorPos(null);
      return;
    }
    const rect = mapContainerRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleStateMouseEnter = (stateId: string) => {
    setHoveredStateId(stateId);
  };

  const handleStateMouseLeave = () => {
    setHoveredStateId(null);
    setCursorPos(null);
  };

  const handleStateClick = (stateId: string) => {
    if (selectedStateId === stateId && isPinned) {
      // Unpin, revert to default
      setIsPinned(false);
      setSelectedStateId(defaultStateId);
    } else {
      setSelectedStateId(stateId);
      setIsPinned(true);
    }
  };

  const handleReset = () => {
    setSelectedStateId(defaultStateId);
    setHoveredStateId(null);
    setIsPinned(false);
  };

  const handleSelectNational = () => {
    setSelectedStateId("all");
    setHoveredStateId(null);
    setIsPinned(true);
  };

  // Metric grid configuration
  const metrics: MetricInfo[] = [
    {
      id: "projectCount",
      title: "Project Count (No.)",
      value: activeStateData.projectCount.toLocaleString("en-IN"),
      subValue: "Central Sector Projects",
      icon: <Calculator className="w-5 h-5" />,
      iconBg: "bg-blue-50 text-blue-700 border-blue-200",
      iconColor: "text-blue-700",
      tooltip:
        "Total sanctioned central sector infrastructure projects currently monitored in this state on PAIMANA.",
    },
    {
      id: "originalCost",
      title: "Original Cost (in Cr.)",
      value: formatIndianCurrency(activeStateData.originalCost),
      subValue: "Baseline Sanction",
      icon: <Coins className="w-5 h-5" />,
      iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconColor: "text-emerald-700",
      tooltip:
        "Initial approved investment sanctioned by the Cabinet / Ministry at project clearance in ₹ Crore.",
    },
    {
      id: "revisedCost",
      title: "Latest Revised Cost (in Cr.)",
      value: formatIndianCurrency(activeStateData.revisedCost),
      subValue: `+${(
        ((activeStateData.revisedCost - activeStateData.originalCost) /
          activeStateData.originalCost) *
        100
      ).toFixed(2)}% Escalation`,
      icon: <Wallet className="w-5 h-5" />,
      iconBg: "bg-amber-50 text-amber-700 border-amber-200",
      iconColor: "text-amber-700",
      tooltip:
        "Current approved / anticipated total investment accounting for scope adjustments and cost escalation in ₹ Crore.",
    },
    {
      id: "expenditure",
      title: "Expenditure (Cumm.) (in Cr.)",
      value: formatIndianCurrency(activeStateData.expenditure),
      subValue: `${(
        (activeStateData.expenditure / activeStateData.revisedCost) *
        100
      ).toFixed(1)}% of Revised Disbursed`,
      icon: <BarChart3 className="w-5 h-5" />,
      iconBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
      iconColor: "text-indigo-700",
      tooltip:
        "Cumulative financial capital expenditure recorded and disbursed on the project portfolio till date in ₹ Crore.",
    },
    {
      id: "completedMonth",
      title: "Completed During month (No.)",
      value: activeStateData.completedThisMonth,
      subValue: "Handed over in Aug 2026",
      icon: <CalendarCheck2 className="w-5 h-5" />,
      iconBg: "bg-teal-50 text-teal-700 border-teal-200",
      iconColor: "text-teal-700",
      tooltip:
        "Major infrastructure packages that achieved 100% physical completion and commercial commissioning in August 2026.",
    },
    {
      id: "newlyAdded",
      title: "Newly Added (No.)",
      value: activeStateData.newlyAdded,
      subValue: "Sanctioned in Aug 2026",
      icon: <HardHat className="w-5 h-5" />,
      iconBg: "bg-purple-50 text-purple-700 border-purple-200",
      iconColor: "text-purple-700",
      tooltip:
        "New central infrastructure works sanctioned and registered on PAIMANA in the current review cycle.",
    },
  ];

  // Financial progress bar percentage
  const expenditurePct = Math.min(
    100,
    Math.round(
      (activeStateData.expenditure / (activeStateData.revisedCost || 1)) * 100
    )
  );

  return (
    <section className="mb-12">
      {/* ── Section Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            STATE-WISE INFRASTRUCTURE MONITORING
          </div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              State-wise Projects
            </h2>
            <span className="text-slate-500 font-medium text-sm md:text-base">
              (as of August, 2026)
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl">
            Interactive GIS choropleth visualization of ₹150+ Crore central
            sector projects across 36 Indian States and Union Territories.
          </p>
        </div>

        {/* Quick Actions / Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSelectNational}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              activeStateData.id === "all"
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            🇮🇳 All-India Overview
          </button>
          <button
            onClick={handleReset}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              selectedStateId === defaultStateId && !isPinned
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
            title="Reset to default (Gujarat)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset (Gujarat)
          </button>
        </div>
      </div>

      {/* ── Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT COLUMN: State Overview Card (5 cols) ── */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="glass bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
            {/* Top Tricolor Accent Line */}
            <div className="h-1 bg-gradient-to-r from-[#FF9933] via-[#0B193C] to-[#138808]" />

            {/* Dark Header Banner */}
            <div className="bg-[#0F172A] text-white p-5 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
                <MapPin className="w-36 h-36 text-white" />
              </div>

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
                      {activeStateData.id === "all"
                        ? "PORTFOLIO TOTAL"
                        : `STATE CODE: ${activeStateData.id.toUpperCase()}`}
                    </span>
                    {isPinned && activeStateData.id !== "all" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-200 border border-blue-400/30">
                        PINNED
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    {activeStateData.stateName}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Density Rank
                  </div>
                  <div className="text-lg font-mono font-black text-amber-400">
                    {activeStateData.id === "all"
                      ? "36 Regions"
                      : `#${
                          Object.values(STATE_PROJECTS_MAP)
                            .sort((a, b) => b.projectCount - a.projectCount)
                            .findIndex((s) => s.id === activeStateData.id) + 1
                        } in India`}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  Choropleth Intensity:
                </span>
                <span className="font-mono font-bold flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full border border-white/40 shadow-xs inline-block"
                    style={{
                      backgroundColor: getChoroplethColor(
                        activeStateData.projectCount
                      ),
                    }}
                  />
                  {activeStateData.projectCount} Projects
                </span>
              </div>
            </div>

            {/* 2x3 Metric Grid with Clean Borders */}
            <div className="grid grid-cols-2 divide-x divide-y divide-slate-200 border-b border-slate-200 bg-white">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="p-4 relative hover:bg-slate-50/70 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight leading-tight">
                      {metric.title}
                    </span>
                    {/* Tooltip trigger */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveTooltip(
                            activeTooltip === metric.id ? null : metric.id
                          )
                        }
                        onMouseEnter={() => setActiveTooltip(metric.id)}
                        onMouseLeave={() => setActiveTooltip(null)}
                        className="text-slate-400 hover:text-blue-600 p-0.5 rounded transition-colors focus:outline-none"
                        aria-label={`Info about ${metric.title}`}
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>

                      {/* Tooltip Popup */}
                      {activeTooltip === metric.id && (
                        <div className="absolute right-0 top-6 z-50 w-52 p-2.5 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl border border-slate-700 pointer-events-none animate-[fadeUp_0.15s_ease]">
                          <div className="font-semibold text-blue-300 mb-1">
                            {metric.title}
                          </div>
                          <div className="text-slate-200 leading-relaxed">
                            {metric.tooltip}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className={`p-1.5 rounded-lg border shadow-2xs ${metric.iconBg}`}
                    >
                      {metric.icon}
                    </div>
                    <div className="text-base md:text-lg font-black text-slate-900 font-mono tracking-tight truncate">
                      {metric.value}
                    </div>
                  </div>

                  {metric.subValue && (
                    <div className="text-[10px] font-medium text-slate-500 truncate">
                      {metric.subValue}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Financial Progress & Active Sectors Strip */}
            <div className="p-4 bg-slate-50/80 space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    Portfolio Financial Absorption
                  </span>
                  <span className="font-mono font-bold text-slate-800 text-xs">
                    {expenditurePct}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${expenditurePct}%` }}
                  />
                </div>
              </div>

              {activeStateData.topSectors && (
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Key Infrastructure Sectors
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeStateData.topSectors.map((sector, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs"
                      >
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 text-[11px] text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Hover any state to inspect • Click to pin selection
            </span>
            <span className="font-mono text-slate-500">
              Active: {activeStateData.stateName}
            </span>
          </div>
        </div>

        {/* ── RIGHT COLUMN: India SVG Choropleth Map & Vertical Legend (7 cols) ── */}
        <div className="lg:col-span-7">
          <div
            ref={mapContainerRef}
            className="glass bg-gradient-to-b from-[#F8FAFC] to-[#EFF6FF] border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm relative overflow-hidden"
          >
            {/* Map Card Header Banner */}
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800">
                  National Spatial Density Heatmap
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  LIVE GIS SVG
                </span>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Projection: Geographic EPSG:4326
              </div>
            </div>

            {/* Map Area with Relative Floating Tooltip & Legend */}
            <div className="relative flex items-center justify-center min-h-[460px] md:min-h-[560px]">
              {/* SVG Map of India */}
              <svg
                viewBox={IndiaMapData.viewBox}
                className="w-full max-h-[540px] drop-shadow-sm select-none"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleStateMouseLeave}
              >
                {IndiaMapData.locations.map((location) => {
                  const stateData = STATE_PROJECTS_MAP[location.id];
                  const projectCount = stateData ? stateData.projectCount : 0;
                  const isHovered = hoveredStateId === location.id;

                  // Dynamic choropleth color interpolation (original state heatmap color)
                  const baseFill = getChoroplethColor(projectCount);

                  // Fill changes to dark navy blue (#1E3A8A) ONLY while hovered.
                  // After click or unhover, the state's previous choropleth color appears back!
                  const fill = isHovered ? "#1E3A8A" : baseFill;

                  return (
                    <path
                      key={location.id}
                      id={location.id}
                      name={location.name}
                      d={location.path}
                      fill={fill}
                      stroke="#FFFFFF"
                      strokeWidth={0.75}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className="cursor-pointer outline-none"
                      style={{
                        transition: "fill 0.15s ease",
                      }}
                      onMouseEnter={() => handleStateMouseEnter(location.id)}
                      onMouseLeave={handleStateMouseLeave}
                      onClick={() => handleStateClick(location.id)}
                    />
                  );
                })}
              </svg>

              {/* ── Floating Pill Label Over Cursor ── */}
              {cursorPos && hoveredStateId && STATE_PROJECTS_MAP[hoveredStateId] && (
                <div
                  className="absolute pointer-events-none z-30 transition-transform duration-75"
                  style={{
                    left: `${cursorPos.x}px`,
                    top: `${cursorPos.y - 14}px`,
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <div className="bg-[#0F172A] text-white text-xs px-3 py-1.5 rounded-full shadow-2xl border border-slate-700 font-sans flex items-center gap-2 whitespace-nowrap">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/60"
                      style={{
                        backgroundColor: getChoroplethColor(
                          STATE_PROJECTS_MAP[hoveredStateId].projectCount
                        ),
                      }}
                    />
                    <span className="font-bold">
                      {STATE_PROJECTS_MAP[hoveredStateId].stateName}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-amber-300 font-mono font-semibold">
                      {STATE_PROJECTS_MAP[hoveredStateId].projectCount} Projects
                    </span>
                  </div>
                </div>
              )}

              {/* ── Vertical Legend Bar (Right side of the map) ── */}
              <div className="absolute right-2 md:right-4 bottom-4 md:bottom-8 z-20 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl p-3 shadow-md flex flex-col items-center select-none">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-700 mb-2">
                  Projects
                </div>

                <div className="flex items-stretch gap-2 h-44">
                  {/* Vertical Gradient Bar */}
                  <div className="relative w-4 rounded-full border border-slate-300/80 overflow-hidden shadow-inner">
                    <div
                      className="w-full h-full"
                      style={{
                        background:
                          "linear-gradient(to top, #FEF9C3 0%, #FDBA74 25%, #F87171 50%, #EF4444 75%, #991B1B 100%)",
                      }}
                    />
                  </div>

                  {/* Tick Labels */}
                  <div className="flex flex-col justify-between text-[10px] font-mono font-bold text-slate-700 py-0.5">
                    <span className="flex items-center gap-1 text-red-800">
                      — 180+
                    </span>
                    <span className="flex items-center gap-1 text-red-600">
                      — 135
                    </span>
                    <span className="flex items-center gap-1 text-rose-500">
                      — 90
                    </span>
                    <span className="flex items-center gap-1 text-amber-600">
                      — 45
                    </span>
                    <span className="flex items-center gap-1 text-amber-800">
                      — 0
                    </span>
                  </div>
                </div>

                {/* Hover Indicator in Legend */}
                <div className="mt-3 pt-2 border-t border-slate-200 text-center w-full">
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                    Hover Highlight
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <div className="w-3 h-3 rounded-full bg-[#1E3A8A] border border-slate-800 shadow-2xs" />
                    <span className="text-[10px] font-mono font-bold text-slate-800">
                      #1E3A8A
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom State Selector & Quick Filter Bar */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Quick Select State:</span>
                <select
                  value={selectedStateId}
                  onChange={(e) => {
                    setSelectedStateId(e.target.value);
                    setIsPinned(true);
                  }}
                  className="bg-white border border-slate-200 text-slate-800 font-semibold rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                >
                  <option value="all">🇮🇳 All-India National Summary</option>
                  {Object.values(STATE_PROJECTS_MAP)
                    .sort((a, b) => a.stateName.localeCompare(b.stateName))
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.stateName} ({s.projectCount} projects)
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Total Value: ₹34.89 Lakh Cr
                </span>
                <span className="text-slate-300">|</span>
                <span className="font-mono">MoSPI / PAIMANA Baseline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
