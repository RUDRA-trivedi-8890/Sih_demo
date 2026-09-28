"use client";

import { useProjects } from "@/app/lib/store";

export default function TopBar() {
  const { user, logout } = useProjects();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Official Indian Tricolor Top Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Top Utility Strip (Deep Navy Bar - GOI Standard) */}
      <div className="bg-[#0B193C] text-white py-1.5 px-6">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold tracking-wide">
              <span className="text-sm">🇮🇳</span> भारत सरकार | GOVERNMENT OF INDIA
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-300 font-medium">
              सड़क परिवहन, राजमार्ग एवं अवसंरचना मंत्रालय
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px]">
            <span className="hidden md:inline text-amber-300 font-mono font-bold tracking-wider">
              PM GATI SHAKTI NATIONAL MASTER PLAN
            </span>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 font-mono text-slate-200">
              <button className="hover:text-white px-1">अ</button>
              <button className="hover:text-white px-1 font-bold">A+</button>
              <span className="text-slate-600">|</span>
              <span className="text-amber-300 font-bold cursor-pointer">ENGLISH</span>
              <span className="text-slate-600">|</span>
              <span className="hover:text-amber-200 cursor-pointer">हिन्दी</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Official Header Bar (Clean White Theme) */}
      <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* Emblem & Ministry Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3.5">
            {/* National Emblem Icon */}
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-1.5 shadow-sm">
              <svg viewBox="0 0 24 24" className="w-full h-full text-amber-700 fill-current">
                <path d="M12 2L9.5 6.5H14.5L12 2ZM12 8C8.686 8 6 10.686 6 14C6 17.314 8.686 20 12 20C15.314 20 18 17.314 18 14C18 10.686 15.314 8 12 8ZM12 18C9.791 18 8 16.209 8 14C8 11.791 9.791 10 12 10C14.209 10 16 11.791 16 14C16 16.209 14.209 18 12 18Z" />
                <circle cx="12" cy="14" r="2.5" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-tight text-[#0B193C] font-sans">
                  PREDICTIVE RISK GOVERNANCE PORTAL
                </h1>
                <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                  NATIONAL INFRASTRUCTURE CELL
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                Infrastructure Project Risk Intelligence System • Smart India Hackathon 2026 (PS ID: SIH26103)
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Badges & Logged-in GOI Officer info */}
        <div className="flex items-center gap-3">
          {/* Digital India / Gati Shakti Badges */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-base">🇮🇳</span>
            <div className="text-[10px] leading-tight">
              <span className="font-black text-blue-900 block">DIGITAL INDIA</span>
              <span className="text-slate-500 font-mono">GOVT OF INDIA</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <div className="text-[10px] leading-tight">
              <span className="font-bold text-emerald-900 block">LIVE ML RISK ENGINE</span>
              <span className="text-slate-500 font-mono">SIH26-100</span>
            </div>
          </div>

          {/* User Session Pill */}
          {user && (
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-300 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-blue-700 flex items-center justify-center text-xs font-bold text-white shadow">
                {user.role === "contractor" ? "🏗️" : user.role === "officer" ? "🏛️" : "⚡"}
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-slate-900 leading-none">
                  {user.name}
                </div>
                <div className="text-[9px] font-mono text-blue-800 font-bold uppercase tracking-wider mt-0.5">
                  {user.role} PERMIT
                </div>
              </div>
              <button
                onClick={logout}
                title="Sign out of GOI SSO"
                className="text-[10px] font-bold text-red-600 hover:text-red-800 ml-1 px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors"
              >
                Exit
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}