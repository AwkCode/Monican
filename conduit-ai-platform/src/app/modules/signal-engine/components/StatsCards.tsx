"use client";

import type { SignalStats } from "@/lib/signals/types";

export default function StatsCards({ stats }: { stats: SignalStats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card label="New today" value={stats.newToday} color="text-mn-primary" />
      <Card label="Total active" value={stats.totalActive} color="text-mn-text" />
      <Card label="Hot leads" value={stats.hotLeads} color="text-red-600" />
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
    <div className="border border-mn-border rounded-lg p-5 bg-mn-bg-subtle">
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-mn-muted mt-1 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
