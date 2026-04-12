"use client";

import { useState } from "react";
import Link from "next/link";

type ModuleState = {
  enabled: boolean;
  workflowId: string | null;
  activatedAt: string | null;
} | null;

export default function ActivationPanel({
  profileReady,
  moduleState,
}: {
  profileReady: boolean;
  moduleState: ModuleState;
}) {
  const [state, setState] = useState(moduleState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function activate() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/modules/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module_key: "signal_engine" }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Activation failed");
      setLoading(false);
      return;
    }
    setState({
      enabled: true,
      workflowId: data.workflow_id,
      activatedAt: new Date().toISOString(),
    });
    setLoading(false);
    window.location.reload();
  }

  if (!profileReady) {
    return (
      <div className="border border-cb-border rounded-lg p-6 bg-cb-card">
        <h2 className="text-lg font-semibold mb-2">Activation</h2>
        <p className="text-cb-gray text-sm mb-4">
          Complete your profile to activate the Signal Engine.
        </p>
        <Link
          href="/profile"
          className="inline-block bg-cb-blue hover:bg-cb-blue-hover text-white font-medium px-5 py-2.5 rounded-md text-sm"
        >
          Complete profile
        </Link>
      </div>
    );
  }

  if (state?.enabled) return null; // Dashboard is showing instead

  return (
    <div className="border border-cb-border rounded-lg p-6 bg-cb-card">
      <h2 className="text-lg font-semibold mb-2">Activate Signal Engine</h2>
      <p className="text-cb-gray text-sm mb-5">
        Start scanning public records for opportunities in your farm towns.
        You&apos;ll get a daily digest of ranked leads with one-click outreach.
      </p>
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <button
        onClick={activate}
        disabled={loading}
        className="bg-cb-blue hover:bg-cb-blue-hover text-white font-medium px-6 py-3 rounded-md disabled:opacity-50"
      >
        {loading ? "Activating..." : "Activate Signal Engine"}
      </button>
    </div>
  );
}
