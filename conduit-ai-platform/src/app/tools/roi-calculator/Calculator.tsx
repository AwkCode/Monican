"use client";

import { useMemo, useState } from "react";

type Workflow = {
  id: number;
  name: string;
  who: string;
  minPerTask: number;
  timesPerWeek: number;
};

const PRESETS: Record<string, Omit<Workflow, "id">> = {
  lead: { name: "Lead Response", who: "Admin / Agent", minPerTask: 15, timesPerWeek: 20 },
  listing: { name: "Listing Descriptions", who: "Agent", minPerTask: 45, timesPerWeek: 4 },
  transaction: { name: "Transaction Coordination", who: "TC / Admin", minPerTask: 30, timesPerWeek: 10 },
  email: { name: "Email Triage & Response", who: "Agent / Admin", minPerTask: 60, timesPerWeek: 5 },
  reports: { name: "Market Reports", who: "Agent", minPerTask: 45, timesPerWeek: 2 },
  social: { name: "Social Media Posts", who: "Marketing / Agent", minPerTask: 30, timesPerWeek: 3 },
};

export default function Calculator() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    { id: 1, ...PRESETS.lead },
  ]);
  const [nextId, setNextId] = useState(2);
  const [buildFee, setBuildFee] = useState(1500);
  const [retainer, setRetainer] = useState(750);
  const [hourlyRate, setHourlyRate] = useState(25);
  const [efficiency, setEfficiency] = useState(0.8);

  function addWorkflow(preset?: Omit<Workflow, "id">) {
    const p = preset ?? { name: "", who: "", minPerTask: 0, timesPerWeek: 0 };
    setWorkflows((w) => [...w, { id: nextId, ...p }]);
    setNextId((n) => n + 1);
  }

  function updateWf<K extends keyof Workflow>(id: number, field: K, value: Workflow[K]) {
    setWorkflows((w) => w.map((wf) => (wf.id === id ? { ...wf, [field]: value } : wf)));
  }

  function removeWf(id: number) {
    setWorkflows((w) => w.filter((wf) => wf.id !== id));
  }

  const results = useMemo(() => {
    const totalMinBefore = workflows.reduce(
      (sum, w) => sum + (w.minPerTask || 0) * (w.timesPerWeek || 0),
      0
    );
    const hrsBefore = totalMinBefore / 60;
    const hrsAfter = hrsBefore * (1 - efficiency);
    const annualCostBefore = hrsBefore * hourlyRate * 52;
    const annualCostAfter = hrsAfter * hourlyRate * 52 + retainer * 12;
    const annualSavings = annualCostBefore - annualCostAfter;
    const totalInvestmentY1 = buildFee + retainer * 12;
    const netSavingsY1 = annualSavings - buildFee;
    const monthlySavings = (annualCostBefore - hrsAfter * hourlyRate * 52) / 12;
    const breakeven =
      monthlySavings > retainer ? buildFee / (monthlySavings - retainer) : null;
    const roi =
      totalInvestmentY1 > 0
        ? ((annualSavings - totalInvestmentY1) / totalInvestmentY1) * 100
        : 0;

    return {
      hrsBefore,
      hrsAfter,
      annualCostBefore,
      annualCostAfter,
      annualSavings,
      netSavingsY1,
      breakeven,
      roi,
    };
  }, [workflows, buildFee, retainer, hourlyRate, efficiency]);

  const showResults = workflows.length > 0;
  const money = (n: number) => "$" + Math.round(n).toLocaleString();

  return (
    <div className="space-y-6">
      <Card>
        <label className="text-xs font-semibold text-cb-gray uppercase tracking-wide mb-3 block">
          Quick Add — Common Real Estate Workflows
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESETS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => addWorkflow(p)}
              className="bg-cb-border hover:bg-cb-border border border-cb-border px-3 py-1.5 rounded-md text-sm"
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {workflows.map((w) => (
            <div
              key={w.id}
              className="border border-cb-border rounded-md p-4 bg-cb-bg relative"
            >
              <button
                onClick={() => removeWf(w.id)}
                className="absolute top-2 right-2 text-neutral-500 hover:text-red-400 text-xl leading-none"
              >
                ×
              </button>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <FieldSmall label="Workflow name">
                  <input
                    value={w.name}
                    onChange={(e) => updateWf(w.id, "name", e.target.value)}
                    placeholder="e.g. Lead Response"
                    className="w-full bg-cb-card border border-cb-border rounded px-2 py-1.5 text-sm"
                  />
                </FieldSmall>
                <FieldSmall label="Who does it">
                  <input
                    value={w.who}
                    onChange={(e) => updateWf(w.id, "who", e.target.value)}
                    placeholder="Admin"
                    className="w-full bg-cb-card border border-cb-border rounded px-2 py-1.5 text-sm"
                  />
                </FieldSmall>
                <FieldSmall label="Minutes per task">
                  <input
                    type="number"
                    value={w.minPerTask}
                    onChange={(e) => updateWf(w.id, "minPerTask", +e.target.value)}
                    className="w-full bg-cb-card border border-cb-border rounded px-2 py-1.5 text-sm"
                  />
                </FieldSmall>
                <FieldSmall label="Times / week">
                  <input
                    type="number"
                    value={w.timesPerWeek}
                    onChange={(e) => updateWf(w.id, "timesPerWeek", +e.target.value)}
                    className="w-full bg-cb-card border border-cb-border rounded px-2 py-1.5 text-sm"
                  />
                </FieldSmall>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => addWorkflow()}
          className="mt-4 border border-cb-border hover:border-cb-gray px-4 py-2 rounded-md text-sm"
        >
          + Add custom workflow
        </button>
      </Card>

      <Card title="Your Investment">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FieldSmall label="One-time build fee">
            <input
              type="number"
              value={buildFee}
              onChange={(e) => setBuildFee(+e.target.value)}
              className="w-full bg-cb-bg border border-cb-border rounded px-2 py-2"
            />
          </FieldSmall>
          <FieldSmall label="Monthly retainer">
            <input
              type="number"
              value={retainer}
              onChange={(e) => setRetainer(+e.target.value)}
              className="w-full bg-cb-bg border border-cb-border rounded px-2 py-2"
            />
          </FieldSmall>
          <FieldSmall label="Avg staff hourly cost">
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(+e.target.value)}
              className="w-full bg-cb-bg border border-cb-border rounded px-2 py-2"
            />
          </FieldSmall>
          <FieldSmall label="Automation efficiency">
            <select
              value={efficiency}
              onChange={(e) => setEfficiency(+e.target.value)}
              className="w-full bg-cb-bg border border-cb-border rounded px-2 py-2"
            >
              <option value="0.7">70% time saved</option>
              <option value="0.8">80% time saved</option>
              <option value="0.9">90% time saved</option>
            </select>
          </FieldSmall>
        </div>
      </Card>

      {showResults && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat label="Hours/week (before)" value={results.hrsBefore.toFixed(1)} color="red" />
            <Stat label="Hours/week (after)" value={results.hrsAfter.toFixed(1)} color="green" />
            <Stat label="Annual savings" value={money(results.annualSavings)} color="white" />
            <Stat
              label="Months to break even"
              value={results.breakeven !== null ? results.breakeven.toFixed(1) : "N/A"}
              color="yellow"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ResultBox label="Current cost" sub="Per year in staff time" value={money(results.annualCostBefore)} />
            <ResultBox label="After automation" sub="Per year (staff + retainer)" value={money(results.annualCostAfter)} />
            <ResultBox label="Net savings" sub="After paying for everything" value={money(results.netSavingsY1)} />
            <ResultBox label="Year 1 ROI" sub="Return on investment" value={Math.round(results.roi) + "%"} />
          </div>
        </>
      )}
    </div>
  );
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="border border-cb-border rounded-lg p-6 bg-cb-card">
      {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );
}

function FieldSmall({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-cb-gray mb-1">{label}</label>
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "red" | "green" | "white" | "yellow";
}) {
  const colorClass = {
    red: "text-red-400",
    green: "text-green-400",
    white: "text-white",
    yellow: "text-yellow-400",
  }[color];
  return (
    <div className="border border-cb-border rounded-lg p-5 bg-cb-card">
      <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
      <div className="text-xs text-cb-gray mt-1 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function ResultBox({ label, sub, value }: { label: string; sub: string; value: string }) {
  return (
    <div className="border border-cb-border rounded-lg p-5 bg-cb-card">
      <div className="text-xs text-cb-gray uppercase tracking-wide mb-1">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-neutral-500 mt-1">{sub}</div>
    </div>
  );
}
