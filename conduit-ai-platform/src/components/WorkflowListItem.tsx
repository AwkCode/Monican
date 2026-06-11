import Link from "next/link";
import { Workflow } from "@/lib/marketplace/types";

const CATEGORY_CONFIG: Record<
  string,
  { icon: string; bg: string; text: string }
> = {
  "Lead gen": { icon: "🎯", bg: "bg-orange-100", text: "text-orange-800" },
  "Past clients": { icon: "💌", bg: "bg-rose-100", text: "text-rose-800" },
  Admin: { icon: "📋", bg: "bg-amber-100", text: "text-amber-800" },
  Marketing: { icon: "📣", bg: "bg-purple-100", text: "text-purple-800" },
  Sales: { icon: "💼", bg: "bg-emerald-100", text: "text-emerald-800" },
  Operations: { icon: "⚙️", bg: "bg-blue-100", text: "text-blue-800" },
  Recall: { icon: "🔔", bg: "bg-pink-100", text: "text-pink-800" },
  Compliance: { icon: "🛡️", bg: "bg-slate-100", text: "text-slate-800" },
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

export default function WorkflowListItem({
  workflow,
  roleSlug,
}: {
  workflow: Workflow;
  roleSlug: string;
}) {
  const cat = CATEGORY_CONFIG[workflow.category] || CATEGORY_CONFIG.Operations;
  const sourceStyle = SOURCE_STYLES[workflow.source] || SOURCE_STYLES.Monican;

  return (
    <Link
      href={`/for/${roleSlug}/${workflow.slug}`}
      className="group block bg-white border border-mn-border rounded-2xl p-5 hover:border-mn-primary/50 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-5">
        {/* Thumbnail / icon */}
        <div
          className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl ${cat.bg} flex items-center justify-center text-3xl md:text-4xl`}
        >
          {cat.icon}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Top row: category + source badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${cat.bg} ${cat.text}`}
            >
              {workflow.category}
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${sourceStyle.bg} ${sourceStyle.text}`}
            >
              {sourceStyle.label}
            </span>
            {workflow.featured && (
              <span className="text-xs font-medium text-mn-primary">★ Featured</span>
            )}
          </div>

          {/* Plain-English title */}
          <h3 className="text-lg md:text-xl font-semibold text-mn-text group-hover:text-mn-primary transition-colors leading-snug mb-1">
            {workflow.name}
          </h3>

          {/* Sub-description */}
          <p className="text-sm text-mn-muted leading-relaxed line-clamp-1">
            {workflow.description}
          </p>
        </div>

        {/* Right side: stats + arrow */}
        <div className="hidden md:flex flex-shrink-0 items-center gap-6">
          <InlineStat label="est. hrs/wk" value={workflow.hoursSavedWeekly} accent="text-mn-primary" />
          <InlineStat
            label="est. $/mo"
            value={
              workflow.dollarsSavedMonthly >= 1000
                ? `${(workflow.dollarsSavedMonthly / 1000).toFixed(1)}k`
                : workflow.dollarsSavedMonthly
            }
            accent="text-emerald-600"
          />
          <InlineStat
            label="setup"
            value={`${workflow.setupMinutes}m`}
            accent="text-mn-text"
          />
          <div className="text-mn-muted group-hover:text-mn-primary text-2xl transition-colors">
            →
          </div>
        </div>
      </div>

      {/* Mobile stats row */}
      <div className="md:hidden flex items-center justify-between gap-2 mt-4 pt-4 border-t border-mn-border text-sm">
        <span className="text-mn-primary font-semibold">
          est. {workflow.hoursSavedWeekly} hrs/wk
        </span>
        <span className="text-emerald-600 font-semibold">
          est. ${workflow.dollarsSavedMonthly >= 1000
            ? `${(workflow.dollarsSavedMonthly / 1000).toFixed(1)}k`
            : workflow.dollarsSavedMonthly}/mo
        </span>
        <span className="text-mn-muted font-medium">
          {workflow.setupMinutes}m setup
        </span>
        <span className="text-mn-muted">→</span>
      </div>
    </Link>
  );
}

function InlineStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="text-center min-w-[56px]">
      <div className={`text-lg font-semibold ${accent} leading-none`}>
        {value}
      </div>
      <div className="text-[10px] text-mn-muted uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
}
