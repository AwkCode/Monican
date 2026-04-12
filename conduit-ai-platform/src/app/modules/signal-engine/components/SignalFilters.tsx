"use client";

import { SIGNAL_TYPE_LABELS, type SignalType } from "@/lib/signals/types";

type Filters = {
  type: string;
  city: string;
  status: string;
  minScore: string;
};

export default function SignalFilters({
  filters,
  onChange,
  cities,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  cities: string[];
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={filters.type}
        onChange={(e) => onChange({ ...filters, type: e.target.value })}
        className="bg-cb-card border border-cb-border rounded-md px-3 py-2 text-sm text-white"
      >
        <option value="">All types</option>
        {Object.entries(SIGNAL_TYPE_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <select
        value={filters.city}
        onChange={(e) => onChange({ ...filters, city: e.target.value })}
        className="bg-cb-card border border-cb-border rounded-md px-3 py-2 text-sm text-white"
      >
        <option value="">All towns</option>
        {cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        value={filters.minScore}
        onChange={(e) => onChange({ ...filters, minScore: e.target.value })}
        className="bg-cb-card border border-cb-border rounded-md px-3 py-2 text-sm text-white"
      >
        <option value="">All confidence</option>
        <option value="80">Hot only (80+)</option>
        <option value="50">Warm+ (50+)</option>
        <option value="30">30+</option>
      </select>
      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className="bg-cb-card border border-cb-border rounded-md px-3 py-2 text-sm text-white"
      >
        <option value="new,viewed">Active</option>
        <option value="new">New only</option>
        <option value="contacted">Contacted</option>
        <option value="dismissed">Dismissed</option>
        <option value="">All</option>
      </select>
    </div>
  );
}
