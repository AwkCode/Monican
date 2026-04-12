"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import type { Signal, SignalStats } from "@/lib/signals/types";
import StatsCards from "./components/StatsCards";
import SignalFilters from "./components/SignalFilters";
import SignalTable from "./components/SignalTable";

// Dynamic import — Leaflet requires browser
const SignalMap = dynamic(() => import("./components/SignalMap"), {
  ssr: false,
  loading: () => (
    <div className="border border-cb-border rounded-lg bg-cb-card h-[400px] flex items-center justify-center text-cb-gray text-sm">
      Loading map...
    </div>
  ),
});

type Filters = { type: string; city: string; status: string; minScore: string };

export default function SignalDashboard({
  initialSignals,
  initialStats,
  cities,
}: {
  initialSignals: Signal[];
  initialStats: SignalStats;
  cities: string[];
}) {
  const [signals, setSignals] = useState<Signal[]>(initialSignals);
  const [stats] = useState<SignalStats>(initialStats);
  const [filters, setFilters] = useState<Filters>({
    type: "",
    city: "",
    status: "new,viewed",
    minScore: "",
  });
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const fetchSignals = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.type) params.set("type", filters.type);
    if (filters.city) params.set("city", filters.city);
    if (filters.status) params.set("status", filters.status);
    if (filters.minScore) params.set("min_score", filters.minScore);

    const res = await fetch(`/api/signals?${params}`);
    const data = await res.json();
    setSignals(data.signals ?? []);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  return (
    <div className="space-y-6">
      <StatsCards stats={stats} />

      <SignalMap
        signals={signals}
        onSelect={(id) => setSelectedId(id)}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Opportunities
          {loading && (
            <span className="text-cb-gray text-sm font-normal ml-2">
              Loading...
            </span>
          )}
        </h2>
        <SignalFilters
          filters={filters}
          onChange={setFilters}
          cities={cities}
        />
      </div>

      <SignalTable signals={signals} selectedId={selectedId} />
    </div>
  );
}
