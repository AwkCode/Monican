"use client";

import { useState } from "react";
import Link from "next/link";

type ModuleState = {
  enabled: boolean;
  workflowId: string | null;
  webhookUrl: string | null;
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

  const isActive = state?.enabled && state?.workflowId;

  async function activate() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/modules/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module_key: "lead_responder" }),
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
      webhookUrl: data.webhook_url,
      activatedAt: new Date().toISOString(),
    });
    setLoading(false);
  }

  async function deactivate() {
    setLoading(true);
    const res = await fetch("/api/modules/activate?module_key=lead_responder", {
      method: "DELETE",
    });

    if (res.ok) {
      setState((s) => (s ? { ...s, enabled: false } : null));
    }
    setLoading(false);
  }

  if (!profileReady) {
    return (
      <div className="border border-cb-border rounded-lg p-6 bg-cb-card">
        <h2 className="text-lg font-semibold mb-2">Activation</h2>
        <p className="text-cb-gray text-sm mb-4">
          Complete your profile before activating this module. Your agents need
          your name, brokerage, and phone number to draft replies in your voice.
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

  return (
    <div className="border border-cb-border rounded-lg p-6 bg-cb-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Activation</h2>
        {isActive && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 font-medium">
            Active
          </span>
        )}
      </div>

      {isActive ? (
        <>
          <div className="space-y-3 mb-6">
            <InfoRow label="Workflow ID" value={state!.workflowId!} />
            <InfoRow label="Webhook URL" value={state!.webhookUrl!} mono />
            <InfoRow
              label="Activated"
              value={new Date(state!.activatedAt!).toLocaleDateString()}
            />
            {state!.workflowId!.startsWith("stub_") && (
              <div className="bg-cb-blue/10 border border-cb-blue/20 rounded-md p-3 text-sm text-blue-300">
                This is a <strong>stubbed</strong> activation. The n8n workflow
                will be created automatically once API access is connected. Your
                webhook URL will update at that time.
              </div>
            )}
          </div>
          <button
            onClick={deactivate}
            disabled={loading}
            className="border border-red-500/40 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-md text-sm disabled:opacity-50"
          >
            {loading ? "Deactivating..." : "Deactivate module"}
          </button>
        </>
      ) : (
        <>
          <p className="text-cb-gray text-sm mb-5">
            {state?.workflowId
              ? "This module was previously active. Re-activate to resume lead responses."
              : "Ready to go. Click below to spin up your Lead Responder agent."}
          </p>
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <button
            onClick={activate}
            disabled={loading}
            className="bg-cb-blue hover:bg-cb-blue-hover text-white font-medium px-6 py-3 rounded-md disabled:opacity-50"
          >
            {loading ? "Activating..." : "Activate Lead Responder"}
          </button>
        </>
      )}
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-xs text-cb-gray uppercase tracking-wide w-28 shrink-0">
        {label}
      </span>
      <span
        className={`text-sm text-white break-all ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
