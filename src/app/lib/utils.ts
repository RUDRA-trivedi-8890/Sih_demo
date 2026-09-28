import clsx, { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function riskColor(band: string) {
  if (band === "High") return "text-red-400 border-red-500/40 bg-red-500/10";
  if (band === "Medium") return "text-amber-400 border-amber-500/40 bg-amber-500/10";
  return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
}

export function riskHex(band: string) {
  if (band === "High") return "#EF4444";
  if (band === "Medium") return "#F59E0B";
  return "#10B981";
}