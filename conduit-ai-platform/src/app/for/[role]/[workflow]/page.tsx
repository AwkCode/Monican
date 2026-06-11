import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  WORKFLOWS,
  getRoleBySlug,
  getWorkflow,
  getWorkflowsForRole,
} from "@/lib/marketplace/seed";

type Props = {
  params: { role: string; workflow: string };
};

// Pre-render every workflow detail page at build time.
export function generateStaticParams() {
  return WORKFLOWS.map((w) => ({ role: w.roleSlug, workflow: w.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const role = getRoleBySlug(params.role);
  const workflow = role ? getWorkflow(params.role, params.workflow) : undefined;
  if (!role || !workflow) return {};
  const description = `${workflow.tagline} ${workflow.timePerAction}. For ${role.name.toLowerCase()}s — sourced from ${workflow.source}, ~${workflow.setupMinutes} min setup.`;
  return {
    title: `${workflow.name} — for ${role.name}s`,
    description,
    alternates: { canonical: `/for/${role.slug}/${workflow.slug}` },
    openGraph: { title: workflow.name, description },
  };
}

export default function WorkflowDetailPage({ params }: Props) {
  const role = getRoleBySlug(params.role);
  if (!role) notFound();

  const workflow = getWorkflow(params.role, params.workflow);
  if (!workflow) notFound();

  // Related workflows
  const related = getWorkflowsForRole(role.slug)
    .filter((w) => w.slug !== workflow.slug)
    .slice(0, 3);

  return (
    <main className="relative min-h-screen bg-white">
      {/* Top nav */}
      <header className="border-b border-mn-border bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg tracking-tight text-mn-text"
          >
            <img src="/monican-logo.png" alt="Monican" className="h-7 w-7" />
            monican.
          </Link>
          <Link
            href={`/for/${role.slug}`}
            className="text-sm text-mn-muted hover:text-mn-text"
          >
            ← Back to {role.name} workflows
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-white">
        <div className="absolute top-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-mn-primary/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-12">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-mn-muted mb-6">
            <Link href="/" className="hover:text-mn-text">
              Home
            </Link>
            <span>›</span>
            <Link href={`/for/${role.slug}`} className="hover:text-mn-text">
              {role.name}
            </Link>
            <span>›</span>
            <span className="text-mn-text font-medium">{workflow.name}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-mn-bg-subtle text-mn-text">
              {workflow.category}
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-mn-text text-white">
              Sourced from {workflow.source}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05] mb-5">
            {workflow.name}
          </h1>
          <p className="text-xl text-mn-text/70 max-w-3xl leading-relaxed mb-6">
            {workflow.tagline}
          </p>

          {/* Time-per-action callout */}
          <div className="inline-flex items-center gap-2 bg-mn-primary/10 text-mn-primary text-sm font-semibold px-4 py-2 rounded-full mb-10">
            <span>⚡</span>
            <span>{workflow.timePerAction}</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
            <BigStat
              value={workflow.hoursSavedWeekly}
              label="est. hours saved / week"
              color="text-mn-primary"
            />
            <BigStat
              value={
                workflow.dollarsSavedMonthly >= 1000
                  ? `$${(workflow.dollarsSavedMonthly / 1000).toFixed(1)}k`
                  : `$${workflow.dollarsSavedMonthly}`
              }
              label="est. $ saved / month"
              color="text-emerald-600"
            />
            <BigStat
              value={workflow.source}
              label="source"
              color="text-mn-text"
            />
            <BigStat
              value={`${workflow.setupMinutes} min`}
              label="setup time"
              color="text-mn-text"
            />
          </div>
          <p className="text-xs text-mn-muted mt-4 max-w-3xl">
            Time and dollar figures are Monican estimates based on typical
            volumes for this role — not user-reported data. We&apos;ll replace
            them with real numbers as clients run this workflow.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        {/* Left — description & steps */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">What it does</h2>
          <p className="text-mn-text/80 leading-relaxed mb-10">
            {workflow.longDescription || workflow.description}
          </p>

          <h2 className="text-2xl font-semibold mb-4">How it works</h2>
          <ol className="space-y-4 mb-10">
            {workflow.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-mn-primary/15 text-mn-primary font-semibold text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-mn-text/80 leading-relaxed pt-1">
                  {step}
                </span>
              </li>
            ))}
          </ol>

          <div className="bg-mn-bg-subtle border border-mn-border rounded-2xl p-6 mb-10">
            <h3 className="text-lg font-semibold mb-2">
              💡 Real example
            </h3>
            <p className="text-mn-text/80 leading-relaxed text-sm">
              We&apos;ll share a case study from a real {role.name} who&apos;s
              been running this workflow once we have user data to share. In
              the meantime, book a demo and we&apos;ll walk you through how
              we&apos;d set it up for your business specifically.
            </p>
          </div>
        </div>

        {/* Right — sticky sidebar */}
        <aside className="md:col-span-1">
          <div className="bg-white border border-mn-border rounded-2xl p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-2">Activate this workflow</h3>
            <p className="text-xs text-mn-muted mb-5">
              Sourced from <span className="font-semibold text-mn-text">{workflow.source}</span>
              {workflow.priceModel === "free" && " · free template"}
              {workflow.priceModel === "freemium" && " · freemium"}
              {workflow.priceModel === "paid" && " · paid"}
              {workflow.priceModel === "monican-setup" && " · Monican-built"}
            </p>

            {workflow.source === "Monican" ? (
              <>
                {/* Monican Original — primary CTA is book demo */}
                <Link
                  href={`/book?workflow=${workflow.slug}&role=${role.slug}`}
                  className="block bg-black hover:bg-black/85 text-white font-medium text-center py-3 rounded-full mb-3 transition"
                >
                  Book setup demo
                </Link>
                <p className="text-xs text-mn-muted text-center mb-2">
                  We set it up. You save the hours.
                </p>
              </>
            ) : (
              <>
                {/* Sourced workflow — primary CTA is affiliate redirect */}
                <a
                  href={`/api/go/${role.slug}/${workflow.slug}`}
                  className="block bg-mn-primary hover:bg-mn-primary-hover text-white font-medium text-center py-3 rounded-full mb-3 transition"
                >
                  Use on {workflow.source} →
                </a>
                <Link
                  href={`/book?workflow=${workflow.slug}&role=${role.slug}`}
                  className="block bg-black hover:bg-black/85 text-white font-medium text-center py-3 rounded-full mb-2 transition text-sm"
                >
                  Or have Monican set it up
                </Link>
                <p className="text-[11px] text-mn-muted text-center leading-snug mt-2">
                  We earn a small commission if you activate via the {workflow.source} link — at no extra cost to you.
                </p>
              </>
            )}

            <div className="mt-6 pt-6 border-t border-mn-border">
              <h4 className="text-sm font-semibold mb-3">Required tools</h4>
              <ul className="space-y-2">
                {workflow.requirements.map((req) => (
                  <li
                    key={req}
                    className="flex items-center gap-2 text-sm text-mn-muted"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-mn-primary" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 pt-5 border-t border-mn-border text-xs text-mn-muted">
              <p>
                💡 <strong>Why Monican?</strong> We handle the setup, integrate with your existing tools, train it on your voice, and stay on call for issues.
              </p>
            </div>
          </div>
        </aside>
      </section>

      {/* Related workflows */}
      {related.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <h2 className="text-2xl font-semibold mb-6">
            Other workflows for {role.name.toLowerCase()}s
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {related.map((w) => (
              <Link
                key={w.slug}
                href={`/for/${role.slug}/${w.slug}`}
                className="block bg-white border border-mn-border rounded-xl p-5 hover:border-mn-primary/40 hover:shadow-md transition"
              >
                <div className="text-xs text-mn-primary font-medium uppercase tracking-wide mb-2">
                  {w.category}
                </div>
                <h3 className="font-semibold mb-2">{w.name}</h3>
                <p className="text-sm text-mn-muted line-clamp-2">
                  {w.tagline}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function BigStat({
  value,
  label,
  color,
}: {
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-white border border-mn-border rounded-xl p-4">
      <div className={`text-2xl font-semibold ${color}`}>{value}</div>
      <div className="text-xs text-mn-muted uppercase tracking-wide mt-1">
        {label}
      </div>
    </div>
  );
}
