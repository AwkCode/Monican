import Link from "next/link";
import { Workflow } from "@/lib/marketplace/types";

const CATEGORY_META: Record<string, { icon: string; description: string }> = {
  "Lead gen": {
    icon: "🎯",
    description: "Capture, qualify, and respond to new leads automatically",
  },
  "Past clients": {
    icon: "💌",
    description: "Keep your existing book of business warm and active",
  },
  Admin: {
    icon: "📋",
    description: "Paperwork, scheduling, and back-office tasks",
  },
  Marketing: {
    icon: "📣",
    description: "Content, social, and outbound marketing",
  },
  Sales: {
    icon: "💼",
    description: "Follow-up, proposals, and close mechanics",
  },
  Operations: {
    icon: "⚙️",
    description: "Internal ops, reporting, and team workflows",
  },
  Recall: {
    icon: "🔔",
    description: "Reminders, no-show recovery, and re-engagement",
  },
  Compliance: {
    icon: "🛡️",
    description: "Deadlines, filings, and regulatory tracking",
  },
};

export default function CategoryBrowser({
  workflows,
  roleSlug,
}: {
  workflows: Workflow[];
  roleSlug: string;
}) {
  // Group workflows by category
  const grouped = workflows.reduce(
    (acc, w) => {
      if (!acc[w.category]) acc[w.category] = [];
      acc[w.category].push(w);
      return acc;
    },
    {} as Record<string, Workflow[]>
  );

  const categories = Object.keys(grouped).sort();

  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="max-w-3xl mb-16">
        <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-3">
          Browse by category
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-4">
          Every workflow, every integration.
        </h2>
        <p className="text-lg text-mn-muted">
          Pick the category that hurts most. We&apos;ll show you the proven
          workflows for it.
        </p>
      </div>

      <div className="space-y-16">
        {categories.map((category) => {
          const meta = CATEGORY_META[category] || {
            icon: "⚙️",
            description: "",
          };
          const items = grouped[category];
          return (
            <div key={category}>
              {/* Category header */}
              <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-mn-border">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{meta.icon}</span>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight">
                      {category}
                    </h3>
                    {meta.description && (
                      <p className="text-sm text-mn-muted mt-0.5">
                        {meta.description}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-sm text-mn-muted whitespace-nowrap">
                  {items.length} workflow{items.length === 1 ? "" : "s"}
                </span>
              </div>

              {/* Workflow grid for this category */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((w) => (
                  <CategoryItem
                    key={w.slug}
                    workflow={w}
                    roleSlug={roleSlug}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CategoryItem({
  workflow,
  roleSlug,
}: {
  workflow: Workflow;
  roleSlug: string;
}) {
  const isMonican = workflow.source === "Monican";

  return (
    <div className="group block bg-white border border-mn-border rounded-xl p-5 hover:border-mn-primary/40 hover:shadow-sm transition-all flex flex-col">
      <Link href={`/for/${roleSlug}/${workflow.slug}`} className="block">
        <code className="text-xs bg-mn-bg-subtle text-mn-text px-2 py-1 rounded font-mono mb-3 inline-block border border-mn-border">
          {workflow.source}
        </code>
        <h4 className="text-base font-semibold text-mn-text group-hover:text-mn-primary transition-colors mb-2 leading-snug">
          {workflow.name}
        </h4>
        <p className="text-sm text-mn-muted leading-relaxed line-clamp-2 mb-3">
          {workflow.description}
        </p>
      </Link>

      <div className="inline-flex items-center gap-1.5 bg-mn-primary/10 text-mn-primary text-[11px] font-semibold px-2 py-0.5 rounded-full mb-4 self-start">
        ⚡ {workflow.timePerAction}
      </div>

      <div className="flex items-center justify-between text-xs mb-3">
        <span className="text-mn-primary font-semibold">
          {workflow.hoursSavedWeekly}h/wk · ${workflow.dollarsSavedMonthly >= 1000
            ? `${(workflow.dollarsSavedMonthly / 1000).toFixed(1)}k`
            : workflow.dollarsSavedMonthly}/mo
        </span>
        <span className="text-amber-600 font-semibold">
          {workflow.rating.toFixed(1)}★
        </span>
      </div>

      <div className="mt-auto pt-3 border-t border-mn-border">
        {isMonican ? (
          <Link
            href={`/for/${roleSlug}/${workflow.slug}`}
            className="block bg-black hover:bg-black/85 text-white text-xs font-medium text-center py-2 rounded-full transition"
          >
            See details
          </Link>
        ) : (
          <a
            href={`/api/go/${roleSlug}/${workflow.slug}`}
            className="block bg-mn-primary hover:bg-mn-primary-hover text-white text-xs font-medium text-center py-2 rounded-full transition"
          >
            Use on {workflow.source} →
          </a>
        )}
      </div>
    </div>
  );
}
