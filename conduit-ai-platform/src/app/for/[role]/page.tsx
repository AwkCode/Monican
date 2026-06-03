import Link from "next/link";
import { notFound } from "next/navigation";
import UseCaseCard from "@/components/UseCaseCard";
import CategoryBrowser from "@/components/CategoryBrowser";
import IntegrationsGrid from "@/components/IntegrationsGrid";
import WhyTrustGrid from "@/components/WhyTrustGrid";
import TrustedBy from "@/components/TrustedBy";
import {
  getRoleBySlug,
  getWorkflowsForRole,
  getIndustryBySlug,
} from "@/lib/marketplace/seed";

type Props = {
  params: { role: string };
  searchParams: { focus?: string };
};

export default function RolePage({ params }: Props) {
  const role = getRoleBySlug(params.role);
  if (!role) notFound();

  const industry = getIndustryBySlug(role.industrySlug);
  const workflows = getWorkflowsForRole(role.slug);

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

  // Top 6 workflows for the featured grid (sorted by rating)
  const featured = [...workflows]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  // All integration tools across this role's workflows
  const integrations = Array.from(
    new Set(workflows.flatMap((w) => w.requirements))
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
            <img src="/monican-logo.png" alt="Monican" className="h-7 w-7" />
            monican.
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-mn-muted hover:text-mn-text">
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
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 text-sm text-mn-muted mb-8">
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

          <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-5">
            For {role.name.toLowerCase()}s
          </p>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.02] mb-6 max-w-4xl mx-auto">
            Superpowers for your business.
          </h1>
          <p className="text-lg md:text-xl text-mn-text/70 max-w-2xl mx-auto leading-relaxed mb-10">
            Proven AI workflows for {role.name.toLowerCase()}s — sourced from
            n8n, Zapier, GPT Store, Claude Skills, and our own lab. Backed by
            real numbers.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
            <Link
              href="#workflows"
              className="bg-black hover:bg-black/85 text-white font-medium px-7 py-3.5 rounded-full transition"
            >
              Browse workflows
            </Link>
            <Link
              href="/book"
              className="border border-mn-border hover:border-mn-muted text-mn-text font-medium px-7 py-3.5 rounded-full transition"
            >
              Book a demo
            </Link>
          </div>

          {/* Big stats */}
          <div className="grid grid-cols-3 gap-3 max-w-3xl mx-auto">
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

      {/* Featured workflows — Use Case grid */}
      <section id="workflows" className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-3xl mb-12">
          <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-3">
            Top workflows
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-4">
            What a great workflow for {role.name.toLowerCase()}s looks like.
          </h2>
          <p className="text-lg text-mn-muted">
            The top-rated, most-used workflows for your role. Each one shows
            its tech stack so you know exactly what powers it.
          </p>
        </div>

        {featured.length === 0 ? (
          <EmptyState roleSlug={role.slug} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((w) => (
              <UseCaseCard
                key={w.slug}
                workflow={w}
                roleSlug={role.slug}
              />
            ))}
          </div>
        )}
      </section>

      {/* Browse by category */}
      {workflows.length > 0 && (
        <div className="bg-gradient-to-b from-white to-orange-50/30">
          <CategoryBrowser workflows={workflows} roleSlug={role.slug} />
        </div>
      )}

      {/* Integrations grid */}
      {integrations.length > 0 && (
        <IntegrationsGrid integrations={integrations} />
      )}

      {/* Why trust these workflows */}
      <WhyTrustGrid />

      {/* Request more */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-mn-bg-subtle border border-mn-border rounded-2xl p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-semibold mb-3">
            Don&apos;t see a workflow you need?
          </h3>
          <p className="text-mn-muted mb-6 max-w-md mx-auto">
            Tell us the task you want automated. We&apos;ll source or build it
            and email you when it&apos;s live.
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
    <div className="bg-white/80 backdrop-blur border border-mn-border rounded-xl p-4 md:p-5">
      <div className={`text-2xl md:text-3xl font-semibold ${color}`}>
        {value}
      </div>
      <div className="text-[10px] md:text-xs text-mn-muted uppercase tracking-wider mt-1">
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
