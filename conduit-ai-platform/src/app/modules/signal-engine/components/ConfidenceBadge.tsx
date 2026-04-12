"use client";

import { getConfidenceLevel } from "@/lib/signals/types";

export default function ConfidenceBadge({ score }: { score: number }) {
  const level = getConfidenceLevel(score);
  const config = {
    hot: { label: "HOT", className: "bg-red-500/20 text-red-400" },
    warm: { label: "WARM", className: "bg-amber-500/20 text-amber-400" },
    cool: { label: "COOL", className: "bg-neutral-500/20 text-neutral-400" },
  }[level];

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${config.className}`}
    >
      <span className="text-sm">{score}</span>
      {config.label}
    </span>
  );
}
