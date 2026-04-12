"use client";

import { useState } from "react";
import type { Signal } from "@/lib/signals/types";
import { SIGNAL_TYPE_LABELS, SIGNAL_TYPE_ICONS } from "@/lib/signals/types";
import ConfidenceBadge from "./ConfidenceBadge";
import DraftLetterButton from "./DraftLetterButton";

export default function SignalTable({
  signals,
  selectedId,
}: {
  signals: Signal[];
  selectedId?: string;
}) {
  const [expanded, setExpanded] = useState<string | null>(selectedId ?? null);

  return (
    <div className="border border-cb-border rounded-lg bg-cb-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="text-xs uppercase tracking-wide text-cb-gray border-b border-cb-border">
          <tr>
            <th className="text-left px-4 py-3 w-24">Score</th>
            <th className="text-left px-4 py-3">Address</th>
            <th className="text-left px-4 py-3 hidden md:table-cell">Town</th>
            <th className="text-left px-4 py-3 hidden md:table-cell">Type</th>
            <th className="text-left px-4 py-3 hidden lg:table-cell">Date</th>
            <th className="text-left px-4 py-3 w-20">Status</th>
          </tr>
        </thead>
        <tbody>
          {signals.map((s) => (
            <SignalRow
              key={s.id}
              signal={s}
              isExpanded={expanded === s.id}
              onToggle={() =>
                setExpanded((e) => (e === s.id ? null : s.id))
              }
            />
          ))}
          {signals.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-12 text-center text-cb-gray"
              >
                No signals match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function SignalRow({
  signal,
  isExpanded,
  onToggle,
}: {
  signal: Signal;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const statusColor = {
    new: "text-cb-blue",
    viewed: "text-cb-gray",
    contacted: "text-green-400",
    converted: "text-green-300",
    dismissed: "text-neutral-600",
  }[signal.status] ?? "text-cb-gray";

  return (
    <>
      <tr
        onClick={onToggle}
        className="border-b border-cb-border hover:bg-cb-bg/50 cursor-pointer"
      >
        <td className="px-4 py-3">
          <ConfidenceBadge score={signal.confidence_score} />
        </td>
        <td className="px-4 py-3 font-medium">
          {signal.address ?? "Unknown address"}
        </td>
        <td className="px-4 py-3 text-cb-gray hidden md:table-cell">
          {signal.city}
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <span className="text-sm">
            {SIGNAL_TYPE_ICONS[signal.signal_type]}{" "}
            {SIGNAL_TYPE_LABELS[signal.signal_type]}
          </span>
        </td>
        <td className="px-4 py-3 text-cb-gray hidden lg:table-cell">
          {signal.signal_date}
        </td>
        <td className={`px-4 py-3 text-xs uppercase ${statusColor}`}>
          {signal.status}
        </td>
      </tr>
      {isExpanded && (
        <tr className="border-b border-cb-border">
          <td colSpan={6} className="px-4 py-4 bg-cb-bg/30">
            <ExpandedDetails signal={signal} />
          </td>
        </tr>
      )}
    </>
  );
}

function ExpandedDetails({ signal }: { signal: Signal }) {
  const detail = signal.signal_detail as Record<string, unknown>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {signal.owner_name && (
          <Info label="Owner" value={signal.owner_name} />
        )}
        {signal.assessed_value && (
          <Info
            label="Assessed value"
            value={`$${signal.assessed_value.toLocaleString()}`}
          />
        )}
        {signal.last_sale_price && (
          <Info
            label="Last sale"
            value={`$${signal.last_sale_price.toLocaleString()} (${signal.last_sale_date})`}
          />
        )}
        {signal.beds && (
          <Info
            label="Size"
            value={`${signal.beds}bd / ${signal.baths}ba / ${signal.sqft?.toLocaleString()} sqft`}
          />
        )}
        {signal.year_built && (
          <Info label="Built" value={String(signal.year_built)} />
        )}
        {signal.lot_size && <Info label="Lot" value={signal.lot_size} />}
      </div>

      {Object.keys(detail).length > 0 && (
        <div className="border border-cb-border rounded-md p-3 bg-cb-card text-xs text-cb-gray">
          <p className="text-xs uppercase tracking-wide text-cb-gray mb-2 font-semibold">
            Signal details
          </p>
          {Object.entries(detail).map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <span className="text-neutral-500 w-32 shrink-0">
                {k.replace(/_/g, " ")}:
              </span>
              <span className="text-white">{String(v)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <DraftLetterButton signalId={signal.id} drafted={signal.letter_drafted} />
        <StatusButtons signalId={signal.id} current={signal.status} />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-cb-gray uppercase tracking-wide">
        {label}
      </span>
      <div className="text-white font-medium">{value}</div>
    </div>
  );
}

function StatusButtons({
  signalId,
  current,
}: {
  signalId: string;
  current: string;
}) {
  const [updating, setUpdating] = useState(false);

  async function setStatus(status: string) {
    setUpdating(true);
    await fetch(`/api/signals/${signalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdating(false);
    window.location.reload();
  }

  if (current === "dismissed") return null;

  return (
    <>
      {current !== "contacted" && (
        <button
          onClick={() => setStatus("contacted")}
          disabled={updating}
          className="text-xs border border-green-500/40 text-green-400 hover:bg-green-500/10 px-3 py-1.5 rounded-md disabled:opacity-50"
        >
          Mark contacted
        </button>
      )}
      <button
        onClick={() => setStatus("dismissed")}
        disabled={updating}
        className="text-xs border border-cb-border text-cb-gray hover:text-red-400 px-3 py-1.5 rounded-md disabled:opacity-50"
      >
        Dismiss
      </button>
    </>
  );
}
