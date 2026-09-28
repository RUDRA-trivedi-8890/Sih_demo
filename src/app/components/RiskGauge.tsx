"use client";
import { useEffect, useState } from "react";
import { riskHex } from "@/app/lib/utils";

export default function RiskGauge({ score, band }: { score: number; band: string }) {
  const [dash, setDash] = useState(0);
  const R = 70;
  const C = Math.PI * R;

  useEffect(() => {
    const t = setTimeout(() => setDash((score / 100) * C), 200);
    return () => clearTimeout(t);
  }, [score, C]);

  const color = riskHex(band);

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="110" viewBox="0 0 180 110">
        <path
          d={`M 20 100 A ${R} ${R} 0 0 1 160 100`}
          stroke="rgba(148,163,184,0.15)"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M 20 100 A ${R} ${R} 0 0 1 160 100`}
          stroke={color}
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C - dash}
          style={{ transition: "stroke-dashoffset 1.4s ease-out", filter: `drop-shadow(0 0 8px ${color})` }}
        />
        <text x="90" y="82" textAnchor="middle" fill="#F8FAFC" fontSize="30" fontWeight="900">
          {score}
        </text>
        <text x="90" y="100" textAnchor="middle" fill={color} fontSize="12" fontWeight="700" letterSpacing="2">
          {band.toUpperCase()} RISK
        </text>
      </svg>
    </div>
  );
}