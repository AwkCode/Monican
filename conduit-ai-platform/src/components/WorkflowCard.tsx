import Link from "next/link";
import { Workflow } from "@/lib/marketplace/types";

const CATEGORY_COLORS: Record<string, string> = {
  "Lead gen": "bg-orange-100 text-orange-800",
  "Past clients": "bg-rose-100 text-rose-800",
  Admin: "bg-amber-100 text-amber-800",
  Marketing: "bg-purple-100 text-purple-800",
  Sales: "bg-emerald-100 text-emerald-800",
  Operations: "bg-blue-100 text-blue-800",
  Recall: "bg-pink-100 text-pink-800",
  Compliance: "bg-slate-100 text-slate-800",
};

const SOURCE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  Monican: { bg: "bg-mn-text", text: "text-white", label: "Monican Original" },
  n8n: { bg: "bg-red-100", text: "text-red-800", label: "n8n Template" },
  Zapier: { bg: "bg-orange-100", text: "text-orange-900", label: "Zapier" },
  Make: { bg: "bg-purple-100", text: "text-purple-900", label: "Make" },
  "GPT Store": { bg: "bg-emerald-100", text: "text-emerald-900", label: "GPT Store" },
  "Claude Skills": { bg: "bg-amber-100", text: "text-amber-900", label: "Claude Skill" },
  Pipedream: { bg: "bg-blue-100", text: "text-blue-900", label: "Pipedream" },
  Anthropic: { bg: "bg-amber-100", text: "text-amber-900", label: "Anthropic" },
  OpenAI: { bg: "bg-emerald-100", text: "text-emerald-900", label: "OpenAI" },
};

export default function WorkflowCard({
  workflow,
  roleSlug,
}: {
  workflow: Workflow;
  roleSlug: string;
}) {
  const categoryClass =
    CATEGORY_COLORS[workflow.category] || "bg-mn-bg-subtle text-mn-text";
  const sourceStyle = SOURCE_STYLES[workflow.source] || SOURCE_STYLES.Monican;

  return (
    <Link
      href={`/for/${roleSlug}/${workflow.slug}`}
      className="group block bg-white border border-mn-border rounded-2xl p-6 hover:shadow-lg hover:border-mn-primary/40 transition-all"
    >
      {/* Top row: category + source */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryClass} whitespace-nowrap`}
        >
          {workflow.category}
        </span>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${sourceStyle.bg} ${sourceStyle.text} whitespace-nowrap`}
        >
          {sourceStyle.label}
        </span>
      </div>

      {/* Title + tagline */}
      <h3 className="text-xl font-semibold mb-2 group-hover:text-mn-primary transition-colors line-clamp-2">
        {workflow.name}
      </h3>
      <p className="text-mn-muted text-sm leading-relaxed mb-6 line-clamp-2">
        {workflow.tagline}
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5 pt-5 border-t border-mn-border">
        <Stat
          label="est. hrs/wk"
          value={workflow.hoursSavedWeekly}
          accent="text-mn-primary"
        />
        <Stat
          label="est. $/mo"
          value={
            workflow.dollarsSavedMonthly >= 1000
              ? `${(workflow.dollarsSavedMonthly / 1000).toFixed(1)}k`
              : workflow.dollarsSavedMonthly
          }
          accent="text-emerald-600"
        />
        <Stat
          label="setup"
          value={`${workflow.setupMinutes}m`}
          accent="text-mn-text"
        />
      </div>

      {/* Footer row: setup time + arrow */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-mn-muted">
          🔧 {workflow.setupMinutes}-min setup
        </span>
        <span className="text-mn-text font-medium group-hover:text-mn-primary transition-colors">
          View →
        </span>
      </div>
    </Link>
  );
}

function Stat({
  label,
  value,
  accent,
  suffix,
}: {
  label: string;
  value: string | number;
  accent: string;
  suffix?: string;
}) {
  return (
    <div>
      <div className={`text-2xl font-semibold ${accent}`}>
        {value}
        {suffix && <span className="text-base ml-0.5">{suffix}</span>}
      </div>
      <div className="text-xs text-mn-muted uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
