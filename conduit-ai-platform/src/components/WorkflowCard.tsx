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

export default function WorkflowCard({
  workflow,
  roleSlug,
}: {
  workflow: Workflow;
  roleSlug: string;
}) {
  const categoryClass =
    CATEGORY_COLORS[workflow.category] || "bg-mn-bg-subtle text-mn-text";

  return (
    <Link
      href={`/for/${roleSlug}/${workflow.slug}`}
      className="group block bg-white border border-mn-border rounded-2xl p-6 hover:shadow-lg hover:border-mn-primary/40 transition-all"
    >
      {/* Top row: category + featured tag */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryClass}`}
        >
          {workflow.category}
        </span>
        {workflow.featured && (
          <span className="text-xs font-medium text-mn-primary">★ Featured</span>
        )}
      </div>

      {/* Title + tagline */}
      <h3 className="text-xl font-semibold mb-2 group-hover:text-mn-primary transition-colors">
        {workflow.name}
      </h3>
      <p className="text-mn-muted text-sm leading-relaxed mb-6 line-clamp-2">
        {workflow.tagline}
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5 pt-5 border-t border-mn-border">
        <Stat
          label="hrs/wk"
          value={workflow.hoursSavedWeekly}
          accent="text-mn-primary"
        />
        <Stat
          label="$/mo"
          value={
            workflow.dollarsSavedMonthly >= 1000
              ? `${(workflow.dollarsSavedMonthly / 1000).toFixed(1)}k`
              : workflow.dollarsSavedMonthly
          }
          accent="text-emerald-600"
        />
        <Stat
          label="rating"
          value={workflow.rating.toFixed(1)}
          accent="text-amber-600"
          suffix="★"
        />
      </div>

      {/* Footer row: setup time + arrow */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-mn-muted">
          🔧 {workflow.setupMinutes}-min setup
        </span>
        <span className="text-mn-text font-medium group-hover:text-mn-primary transition-colors">
          View workflow →
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
