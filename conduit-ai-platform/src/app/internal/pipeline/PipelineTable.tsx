"use client";

import { useState } from "react";

type Prospect = {
  id: number;
  priority: string | null;
  name: string;
  town: string | null;
  contact: string | null;
  stage: string | null;
  last_action: string | null;
  notes: string | null;
};

export default function PipelineTable({ prospects }: { prospects: Prospect[] }) {
  const [priorityFilter, setPriorityFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");

  const filtered = prospects.filter((p) => {
    if (priorityFilter && p.priority !== priorityFilter) return false;
    if (stageFilter && p.stage !== stageFilter) return false;
    return true;
  });

  return (
    <div className="border border-cb-border rounded-lg bg-cb-card">
      <div className="p-4 flex gap-3 items-center border-b border-cb-border">
        <h2 className="text-lg font-semibold mr-auto">All prospects</h2>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-cb-bg border border-cb-border rounded px-2 py-1.5 text-sm"
        >
          <option value="">All priorities</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="bg-cb-bg border border-cb-border rounded px-2 py-1.5 text-sm"
        >
          <option value="">All stages</option>
          <option value="Lead">Lead</option>
          <option value="Contacted">Contacted</option>
          <option value="Discovery">Discovery</option>
          <option value="Proposal">Proposal</option>
          <option value="Closed Won">Closed Won</option>
          <option value="Closed Lost">Closed Lost</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wide text-cb-gray border-b border-cb-border">
            <tr>
              <th className="text-left px-4 py-3">Priority</th>
              <th className="text-left px-4 py-3">Agency</th>
              <th className="text-left px-4 py-3">Town</th>
              <th className="text-left px-4 py-3">Contact</th>
              <th className="text-left px-4 py-3">Stage</th>
              <th className="text-left px-4 py-3">Last action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-cb-border hover:bg-cb-card/50">
                <td className="px-4 py-3">
                  <PriorityPill value={p.priority} />
                </td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-cb-gray">{p.town}</td>
                <td className="px-4 py-3 text-cb-gray">{p.contact}</td>
                <td className="px-4 py-3">{p.stage}</td>
                <td className="px-4 py-3 text-neutral-500">{p.last_action}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                  No prospects match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PriorityPill({ value }: { value: string | null }) {
  if (!value) return null;
  const color =
    value === "HIGH"
      ? "bg-red-500/20 text-red-300"
      : value === "MEDIUM"
        ? "bg-yellow-500/20 text-yellow-300"
        : "bg-neutral-700 text-neutral-300";
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${color}`}>
      {value}
    </span>
  );
}
