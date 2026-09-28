"use client";

import { useState } from "react";
import { useProjects, Role } from "@/app/lib/store";

export default function Login() {
  const { login } = useProjects();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = login(username, password);
    if (!res.success) {
      setError(res.message || "Invalid credentials.");
    }
  };

  const handleQuickLogin = (role: Role) => {
    setError("");
    login(role, "1234");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 animate-[fadeUp_0.4s_ease]">
      <div className="w-full max-w-2xl">
        {/* Main Official White Card */}
        <div className="glass p-8 relative overflow-hidden border border-slate-200 shadow-xl bg-white">
          {/* Top Tricolor Strip */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-[#0B193C] to-[#138808]" />

          {/* Header */}
          <div className="mb-6 text-center pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
              <span>🇮🇳</span>
              <span>GOVERNMENT OF INDIA • PM GATI SHAKTI PORTAL</span>
            </div>
            <h1 className="text-3xl font-black text-[#0B193C] tracking-tight font-sans">
              National Infrastructure Risk Governance
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-lg mx-auto leading-relaxed">
              Predictive Cost Overrun, Schedule Delay & Risk Mitigation Governance Platform (PS ID: SIH26103)
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium animate-pulse">
              ⚠️ {error}
            </div>
          )}

          {/* Quick Demo Login Cards for Judges */}
          <div className="mb-6">
            <div className="text-[10px] font-bold text-amber-800 tracking-widest uppercase mb-3 text-center flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
              SELECT DEMO GOVERNMENT SSO PROFILE (FOR EVALUATORS)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin("contractor")}
                className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 hover:border-amber-400 hover:bg-amber-100/60 transition-all text-left group shadow-sm"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-amber-900">
                    Contractor Agent
                  </span>
                  <span className="text-sm">🏗️</span>
                </div>
                <div className="text-[10px] text-slate-600 leading-tight mb-2">
                  Submit site progress, financial logs & PAIMANA data
                </div>
                <div className="text-[9px] text-amber-900 mono font-bold bg-amber-200/60 px-2 py-0.5 rounded border border-amber-300 inline-block">
                  contractor / 1234
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("officer")}
                className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 hover:border-blue-400 hover:bg-blue-100/60 transition-all text-left group shadow-sm"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-blue-950">
                    Nodal Officer
                  </span>
                  <span className="text-sm">🏛️</span>
                </div>
                <div className="text-[10px] text-slate-600 leading-tight mb-2">
                  View Mission Control, SHAP drivers & run ML analysis
                </div>
                <div className="text-[9px] text-blue-900 mono font-bold bg-blue-200/60 px-2 py-0.5 rounded border border-blue-300 inline-block">
                  officer / 1234
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("admin")}
                className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 hover:border-purple-400 hover:bg-purple-100/60 transition-all text-left group shadow-sm"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-purple-950">
                    Director General
                  </span>
                  <span className="text-sm">⚡</span>
                </div>
                <div className="text-[10px] text-slate-600 leading-tight mb-2">
                  Full portfolio governance & execute MCP playbooks
                </div>
                <div className="text-[9px] text-purple-900 mono font-bold bg-purple-200/60 px-2 py-0.5 rounded border border-purple-300 inline-block">
                  admin / 1234
                </div>
              </button>
            </div>
          </div>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-4 text-[10px] font-bold text-slate-500 tracking-widest uppercase">
              OR LOGIN WITH GOI SSO CREDENTIALS
            </span>
          </div>

          {/* Form Login */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                GOI SSO ID / Official Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="contractor | officer | admin"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password / Passcode
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="1234"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#0B193C] hover:bg-blue-900 text-white font-bold text-sm shadow-md transition-all transform active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>Authenticate GOI Single Sign-On →</span>
            </button>
          </form>

          {/* Official Security Disclaimer */}
          <div className="mt-8 pt-5 border-t border-slate-200">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-600 space-y-1">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <span>🛡️ OFFICIAL GOVERNMENT NOTICE</span>
              </div>
              <p className="leading-relaxed">
                This portal is hosted under the PM Gati Shakti Infrastructure Governance Framework. Unauthorized access or tampering with risk prediction parameters is punishable under Section 66 of the Information Technology Act 2000.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
