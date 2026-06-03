import Link from "next/link";
import { notFound } from "next/navigation";
import WorkflowListItem from "@/components/WorkflowListItem";
import TrustedBy from "@/components/TrustedBy";
import {
  getRoleBySlug,
  getWorkflowsForRole,
  getIndustryBySlug,
} from "@/lib/marketplace/seed";
import RoleFilters from "./RoleFilters";

type Props = {
  params: { role: string };
  searchParams: { focus?: string; category?: string; sort?: string };
};

export default function RolePage({ params, searchParams }: Props) {
  const role = getRoleBySlug(params.role);
  if (!role) notFound();

  const industry = getIndustryBySlug(role.industrySlug);
  let workflows = getWorkflowsForRole(role.slug);

  // Apply filter
  if (searchParams.category) {
    workflows = workflows.filter(
      (w) => w.category.toLowerCase() === searchParams.category!.toLowerCase()
    );
  }

  // Apply sort
  const sort = searchParams.sort || "rating";
  workflows = [...workflows].sort((a, b) => {
    if (sort === "hours") return b.hoursSavedWeekly - a.hoursSavedWeekly;
    if (sort === "money") return b.dollarsSavedMonthly - a.dollarsSavedMonthly;
    return b.rating - a.rating;
  });

  // Stat summary
  const totalHours = workflows.reduce((sum, w) => sum + w.hoursSavedWeekly, 0);
  const totalDollars = workflows.reduce(
    (sum, w) => sum + w.dollarsSavedMonthly,
    0
  );
  const avgRating =
    workflows.length > 0
      ? (
          workflows.reduce((sum, w) => sum + w.rating, 0) / workflows.length
        ).toFixed(1)
      : "—";

  // Available categories
  const categories = Array.from(
    new Set(getWorkflowsForRole(role.slug).map((w) => w.category))
  );

  return (
    <main className="relative min-h-screen bg-white">
      {/* Top nav */}
      <header className="border-b border-mn-border bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg tracking-tight text-mn-text"
          >
            <img
              src="/monican-logo.png"
              alt="Monican"
              className="h-7 w-7"
            />
            monican.
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="text-mn-muted hover:text-mn-text"
            >
              All roles
            </Link>
            <Link
              href="/book"
              className="bg-mn-primary hover:bg-mn-primary-hover text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              Book a demo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — coral gradient header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-100 via-orange-50 to-white">
        <div className="absolute top-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-mn-primary/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-12">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-mn-muted mb-8">
            <Link href="/" className="hover:text-mn-text">
              Home
            </Link>
            <span>›</span>
            {industry && (
              <>
                <span>{industry.name}</span>
                <span>›</span>
              </>
            )}
            <span className="text-mn-text font-medium">{role.name}</span>
          </div>

          <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-4">
            For {role.name.toLowerCase()}s
          </p>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-6 max-w-3xl">
            Proven AI workflows for {role.name.toLowerCase()}s.
          </h1>
          <p className="text-lg text-mn-text/70 max-w-2xl leading-relaxed mb-10">
            {role.description}. Each workflow below is already running in production —
            sourced from n8n, Zapier, the GPT Store, Claude Skills, or built by us.
            Pick what fits, we&apos;ll get it live in your stack.
          </p>

          {/* Stat summary */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            <BigStat
              label="hours saved / week"
              value={totalHours}
              color="text-mn-primary"
            />
            <BigStat
              label="$ saved / month"
              value={`$${(totalDollars / 1000).toFixed(1)}k`}
              color="text-emerald-600"
            />
            <BigStat
              label="avg rating"
              value={`${avgRating}★`}
              color="text-amber-600"
            />
          </div>
        </div>
      </section>

      {/* Trusted-by logo band */}
      <TrustedBy />

      {/* Filters + list */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <RoleFilters
          roleSlug={role.slug}
          categories={categories}
          currentCategory={searchParams.category}
          currentSort={sort}
        />

        {workflows.length === 0 ? (
          <EmptyState roleSlug={role.slug} />
        ) : (
          <div className="flex flex-col gap-3 mt-8">
            {workflows.map((w) => (
              <WorkflowListItem
                key={w.slug}
                workflow={w}
                roleSlug={role.slug}
              />
            ))}
          </div>
        )}

        {/* Request more */}
        <div className="mt-16 bg-mn-bg-subtle border border-mn-border rounded-2xl p-10 text-center">
          <h3 className="text-2xl font-semibold mb-3">
            Don&apos;t see a workflow you need?
          </h3>
          <p className="text-mn-muted mb-6 max-w-md mx-auto">
            Tell us the task you want automated. We&apos;ll build it and
            email you when it&apos;s live.
          </p>
          <Link
            href={`/book?role=${role.slug}`}
            className="inline-block bg-black hover:bg-black/85 text-white px-6 py-3 rounded-full font-medium"
          >
            Request a workflow
          </Link>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-mn-text text-white">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6">
            Ready to activate your AI team?
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
            15-minute demo. Custom for your business. No pressure.
          </p>
          <Link
            href="/book"
            className="inline-block bg-mn-primary hover:bg-mn-primary-hover text-white font-medium px-8 py-4 rounded-full transition-colors"
          >
            Book a demo
          </Link>
        </div>
      </section>
    </main>
  );
}

function BigStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white border border-mn-border rounded-xl p-5">
      <div className={`text-3xl font-semibold ${color}`}>{value}</div>
      <div className="text-xs text-mn-muted uppercase tracking-wide mt-1">
        {label}
      </div>
    </div>
  );
}

function EmptyState({ roleSlug }: { roleSlug: string }) {
  return (
    <div className="text-center py-16 bg-mn-bg-subtle rounded-2xl border border-mn-border">
      <div className="text-5xl mb-4">🔍</div>
      <h3 className="text-2xl font-semibold mb-3">
        We&apos;re curating workflows for this role.
      </h3>
      <p className="text-mn-muted mb-6 max-w-md mx-auto">
        We add 5-10 new workflows for new roles every week. Drop your email
        and we&apos;ll let you know when this one is live.
      </p>
      <Link
        href={`/book?role=${roleSlug}`}
        className="inline-block bg-black hover:bg-black/85 text-white px-6 py-3 rounded-full font-medium"
      >
        Get notified
      </Link>
    </div>
  );
}
