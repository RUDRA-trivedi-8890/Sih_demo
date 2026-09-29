"use client";

import { useState } from "react";
import { useProjects, NewProjectInput } from "@/app/lib/store";
import { Project } from "@/app/lib/mockData";
import { X, FileSpreadsheet, UploadCloud, Cpu, ArrowRight } from "lucide-react";

const MINISTRIES = [
  "MoRTH",
  "Ministry of Railways",
  "MoHUA",
  "Ministry of Power",
  "Jal Shakti",
  "MNRE",
  "Ministry of Shipping",
  "MoCA",
  "Ministry of Commerce",
  "DAE",
];

const SECTORS = [
  "Roadways",
  "Railways",
  "Urban Transit",
  "Power",
  "Water",
  "Renewable Energy",
  "Aviation",
  "Ports",
  "Urban Infra",
  "Logistics",
];

const STATES = [
  "Bihar",
  "Maharashtra",
  "Uttar Pradesh",
  "Gujarat",
  "Rajasthan",
  "Kerala",
  "Karnataka",
  "Madhya Pradesh",
  "Tamil Nadu",
  "Telangana",
  "Punjab",
  "Andhra Pradesh",
  "West Bengal",
  "Odisha",
  "Himachal Pradesh",
];

export default function AddProjectModal({
  isOpen,
  onClose,
  editProject,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  editProject?: Project;
  onSuccess: (newProjectId: string) => void;
}) {
  const { addProject, updateProject } = useProjects();

  const [name, setName] = useState(editProject?.name || "");
  const [ministry, setMinistry] = useState(editProject?.ministry || MINISTRIES[0]);
  const [sector, setSector] = useState(editProject?.sector || SECTORS[0]);
  const [state, setState] = useState(editProject?.state || STATES[0]);
  const [sanctionedCostCr, setSanctionedCostCr] = useState<number | string>(editProject?.sanctionedCostCr || 4820);
  const [spentCr, setSpentCr] = useState<number | string>(editProject?.spentCr || 2988);
  const [physicalProgressPct, setPhysicalProgressPct] = useState<number | string>(editProject?.physicalProgressPct || 38);
  const [milestonesCompleted, setMilestonesCompleted] = useState<number | string>(3);
  const [milestonesTotal, setMilestonesTotal] = useState<number | string>(10);
  const [originalDeadline, setOriginalDeadline] = useState(editProject?.originalDeadline || "2026-03-31");
  const [revisedDeadline, setRevisedDeadline] = useState(editProject?.revisedDeadline || "2027-06-30");
  const [landAcquisitionLag, setLandAcquisitionLag] = useState(true);

  // Fake CSV state
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvStep, setCsvStep] = useState("");

  if (!isOpen) return null;

  const handleFakeCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setCsvLoading(true);

    const steps = [
      "Parsing PAIMANA CSV structure...",
      "Validating financial & milestone schema...",
      "Cleaning CUF variables & spatial flags...",
      "Import completed! Auto-filling project parameters...",
    ];

    steps.forEach((stepText, idx) => {
      setTimeout(() => {
        setCsvStep(stepText);
        if (idx === steps.length - 1) {
          setTimeout(() => {
            setName("NH-44 Widening Corridor (Phase IV)");
            setMinistry("MoRTH");
            setSector("Roadways");
            setState("Bihar");
            setSanctionedCostCr(4820);
            setSpentCr(2988);
            setPhysicalProgressPct(38);
            setMilestonesCompleted(3);
            setMilestonesTotal(10);
            setOriginalDeadline("2026-03-31");
            setRevisedDeadline("2027-09-30");
            setLandAcquisitionLag(true);

            setCsvLoading(false);
            setCsvStep("");
          }, 400);
        }
      }, (idx + 1) * 350);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = Number(sanctionedCostCr);
    const spent = Number(spentCr);
    const progress = Number(physicalProgressPct);

    if (editProject) {
      updateProject(editProject.id, {
        name,
        ministry,
        sector,
        state,
        sanctionedCostCr: cost,
        spentCr: spent,
        physicalProgressPct: progress,
        originalDeadline,
        revisedDeadline,
      });
      onSuccess(editProject.id);
    } else {
      const input: NewProjectInput = {
        name: name || "New Infrastructure Project",
        ministry,
        sector,
        state,
        sanctionedCostCr: cost || 1000,
        spentCr: spent || 500,
        physicalProgressPct: progress || 50,
        milestonesCompleted: Number(milestonesCompleted),
        milestonesTotal: Number(milestonesTotal),
        originalDeadline,
        revisedDeadline,
        landAcquisitionLag,
      };

      const created = addProject(input);
      onSuccess(created.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease]">
      <div className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border border-slate-300 shadow-2xl bg-white relative rounded-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <div className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-1">
            {editProject ? "UPDATE PROJECT DATA" : "ADD NEW INFRASTRUCTURE RECORD"}
          </div>
          <h3 className="text-xl font-black text-[#0B193C]">
            {editProject ? `Edit GOI Record: ${editProject.id}` : "Infrastructure Data Ingestion"}
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Enter project parameters to compute real-time cost, schedule & SHAP risk drivers
          </p>
        </div>

        {/* Task 11: Fake CSV Upload Button */}
        {!editProject && (
          <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-blue-800" />
                  <span>Import from PAIMANA / CSV</span>
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  Simulate automated ingestion from Ministry PAIMANA dataset
                </div>
              </div>
              <label className="cursor-pointer px-3.5 py-1.5 rounded-lg bg-[#0B193C] hover:bg-blue-900 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-200" />
                <span>Upload PAIMANA CSV</span>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFakeCsvUpload}
                  disabled={csvLoading}
                />
              </label>
            </div>

            {csvLoading && (
              <div className="mt-3 pt-3 border-t border-blue-200 flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                <span className="text-xs text-blue-900 font-mono font-bold animate-pulse">
                  {csvStep}
                </span>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Project Name */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Project Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. NH-44 Widening Corridor (4-lane)"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
            />
          </div>

          {/* Ministry, Sector, State */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Ministry</label>
              <select
                value={ministry}
                onChange={(e) => setMinistry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
              >
                {MINISTRIES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Sector</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
              >
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
              >
                {STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Costs & Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Sanctioned Cost (₹ Cr)
              </label>
              <input
                type="number"
                required
                min="10"
                value={sanctionedCostCr}
                onChange={(e) => setSanctionedCostCr(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 mono font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Amount Spent (₹ Cr) ⭐
              </label>
              <input
                type="number"
                required
                min="0"
                value={spentCr}
                onChange={(e) => setSpentCr(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-amber-900 mono font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Physical Progress (%) ⭐
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={physicalProgressPct}
                onChange={(e) => setPhysicalProgressPct(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-emerald-800 mono font-bold focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Milestones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Milestones Completed
              </label>
              <input
                type="number"
                min="0"
                value={milestonesCompleted}
                onChange={(e) => setMilestonesCompleted(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Milestones Total
              </label>
              <input
                type="number"
                min="1"
                value={milestonesTotal}
                onChange={(e) => setMilestonesTotal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Deadlines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Original Deadline
              </label>
              <input
                type="date"
                value={originalDeadline}
                onChange={(e) => setOriginalDeadline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Revised Target Deadline
              </label>
              <input
                type="date"
                value={revisedDeadline}
                onChange={(e) => setRevisedDeadline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="landLag"
              checked={landAcquisitionLag}
              onChange={(e) => setLandAcquisitionLag(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="landLag" className="text-slate-800 font-medium cursor-pointer">
              Flag Land Acquisition / Right-of-Way Lag? (+2.5 mo delay risk driver)
            </label>
          </div>

          {/* Action button */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0B193C] hover:bg-blue-900 text-white font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all transform active:scale-[0.99]"
            >
              <Cpu className="w-4 h-4 text-blue-200" />
              <span>Compute ML Risk Assessment</span>
              <ArrowRight className="w-4 h-4 text-blue-200" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
