"use client";

export default function MCPPage() {
  return (
    <div className="animate-[fadeUp_0.4s_ease]">
      <div className="mb-6">
        <div className="inline-block px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black tracking-wider mb-2">
          MCP LAYER — OUR NOVELTY
        </div>
        <h2 className="text-3xl font-black text-white">
          From Data to Decisions in Real Time
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Model Context Protocol connects our predictive engine to an LLM agent
          that takes prescriptive action.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        <div className="glass p-5 border-t-4 border-blue-500">
          <div className="text-sm font-bold text-blue-300 mb-3 text-center">
            🛠️ MCP TOOLS
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              "get_weather_forecast",
              "get_project_exposure",
              "get_alternate_vendor",
              "get_mitigation_playbook",
            ].map((t) => (
              <div
                key={t}
                className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-[10px] mono text-blue-200 text-center"
              >
                {t}
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-5 border-t-4 border-purple-500">
          <div className="text-sm font-bold text-purple-300 mb-3 text-center">
            🤖 LLM AGENT
          </div>
          <p className="text-sm text-slate-300 text-center leading-relaxed">
            Analyzes project context, calls relevant tools, and decides best
            actions.
          </p>
        </div>

        <div className="glass p-5 border-t-4 border-emerald-500">
          <div className="text-sm font-bold text-emerald-300 mb-3 text-center">
            ✅ PRESCRIPTIVE ACTION
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {[
              "Shift to indoor work",
              "Approve +3% vendor cost",
              "Call NDRF / hospital",
              "Evacuate low-lying zone",
              "Request 15-day extension",
            ].map((a) => (
              <li key={a} className="flex gap-2 items-center">
                <span className="text-emerald-400">●</span> {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center mt-8 py-5 rounded-xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-emerald-600/20 border border-purple-500/30">
        <div className="text-lg font-black text-white">
          From data to decisions in real time
        </div>
      </div>
    </div>
  );
}