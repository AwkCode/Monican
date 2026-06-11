import Link from "next/link";
import { Workflow } from "@/lib/marketplace/types";

const CATEGORY_ICONS: Record<string, string> = {
  "Lead gen": "🎯",
  "Past clients": "💌",
  Admin: "📋",
  Marketing: "📣",
  Sales: "💼",
  Operations: "⚙️",
  Recall: "🔔",
  Compliance: "🛡️",
};

const SOURCE_DOT: Record<string, string> = {
  Monican: "bg-mn-text",
  n8n: "bg-red-500",
  Zapier: "bg-orange-500",
  Make: "bg-purple-500",
  "GPT Store": "bg-emerald-500",
  "Claude Skills": "bg-amber-500",
  Pipedream: "bg-blue-500",
  Anthropic: "bg-amber-500",
  OpenAI: "bg-emerald-500",
};

export default function UseCaseCard({
  workflow,
  roleSlug,
}: {
  workflow: Workflow;
  roleSlug: string;
}) {
  const icon = CATEGORY_ICONS[workflow.category] || "⚙️";
  const sourceDot = SOURCE_DOT[workflow.source] || "bg-mn-text";

  // Take first 3-4 requirements as the tech breadcrumb chain
  const chain = workflow.requirements.slice(0, 4);
  const isMonican = workflow.source === "Monican";

  return (
    <div className="group block bg-white border border-mn-border rounded-2xl p-6 hover:border-mn-primary/50 hover:shadow-lg transition-all h-full flex flex-col">
      {/* Header: icon + title — whole header is clickable to detail */}
      <Link href={`/for/${roleSlug}/${workflow.slug}`} className="block">
        <h3 className="text-lg font-semibold text-mn-text group-hover:text-mn-primary transition-colors leading-snug mb-3">
          <span className="mr-2">{icon}</span>
          {workflow.name}
        </h3>
      </Link>

      {/* Description */}
      <p className="text-sm text-mn-muted leading-relaxed mb-4 line-clamp-3">
        {workflow.description}
      </p>

      {/* Time-per-action callout */}
      <div className="inline-flex items-center gap-1.5 bg-mn-primary/10 text-mn-primary text-xs font-semibold px-2.5 py-1 rounded-full mb-5 self-start">
        <span>⚡</span>
        <span>{workflow.timePerAction}</span>
      </div>

      {/* Tech breadcrumb chain */}
      <div className="flex flex-wrap items-center gap-1.5 mb-5">
        {chain.map((req, i) => (
          <span key={req} className="flex items-center gap-1.5">
            <code className="text-xs bg-mn-bg-subtle text-mn-text px-2 py-1 rounded font-mono border border-mn-border">
              {req}
            </code>
            {i < chain.length - 1 && (
              <span className="text-mn-muted text-xs">→</span>
            )}
          </span>
        ))}
      </div>

      {/* Source + stats row */}
      <div className="flex items-center justify-between pt-4 border-t border-mn-border mb-4">
        <div className="flex items-center gap-2 text-xs">
          <span className={`w-2 h-2 rounded-full ${sourceDot}`} />
          <span className="text-mn-muted font-medium">{workflow.source}</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-mn-primary font-semibold">
            est. {workflow.hoursSavedWeekly}h/wk
          </span>
          <span className="text-mn-muted font-medium">
            {workflow.setupMinutes}-min setup
          </span>
        </div>
      </div>

      {/* Activation CTAs — pushed to bottom with mt-auto */}
      <div className="mt-auto flex items-center gap-2">
        {isMonican ? (
          <Link
            href={`/for/${roleSlug}/${workflow.slug}`}
            className="flex-1 bg-black hover:bg-black/85 text-white text-sm font-medium text-center py-2.5 rounded-full transition"
          >
            See details
          </Link>
        ) : (
          <>
            <a
              href={`/api/go/${roleSlug}/${workflow.slug}`}
              className="flex-1 bg-mn-primary hover:bg-mn-primary-hover text-white text-sm font-medium text-center py-2.5 rounded-full transition"
            >
              Use on {workflow.source}
            </a>
            <Link
              href={`/for/${roleSlug}/${workflow.slug}`}
              className="px-4 py-2.5 text-sm text-mn-muted hover:text-mn-text font-medium border border-mn-border hover:border-mn-muted rounded-full transition"
              title="See details"
            >
              ›
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
