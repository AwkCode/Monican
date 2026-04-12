"use client";

import type { SignalStats } from "@/lib/signals/types";

export default function StatsCards({ stats }: { stats: SignalStats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card label="New today" value={stats.newToday} color="text-cb-blue" />
      <Card label="Total active" value={stats.totalActive} color="text-white" />
      <Card label="Hot leads" value={stats.hotLeads} color="text-red-400" />
      <Card label="Letters drafted" value={stats.lettersDrafted} color="text-green-400" />
    </div>
  );
}

function Card({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="border border-cb-border rounded-lg p-5 bg-cb-card">
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-cb-gray mt-1 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
