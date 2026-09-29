import React from "react";

export default function IndiaFlag({ className = "w-5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 450 300"
      className={`inline-block rounded-xs shadow-2xs border border-slate-300/80 shrink-0 align-middle ${className}`}
      aria-label="Flag of India"
    >
      <rect width="450" height="100" fill="#FF9933" />
      <rect y="100" width="450" height="100" fill="#FFFFFF" />
      <rect y="200" width="450" height="100" fill="#138808" />
      <circle cx="225" cy="150" r="30" fill="none" stroke="#000080" strokeWidth="4" />
      <circle cx="225" cy="150" r="6" fill="#000080" />
      {Array.from({ length: 24 }).map((_, i) => {
        const rad = ((i * 360) / 24 * Math.PI) / 180;
        const x2 = 225 + 30 * Math.cos(rad);
        const y2 = 150 + 30 * Math.sin(rad);
        return (
          <line
            key={i}
            x1="225"
            y1="150"
            x2={x2}
            y2={y2}
            stroke="#000080"
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
}
