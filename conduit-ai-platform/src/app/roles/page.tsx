import type { Metadata } from "next";
import Link from "next/link";
import {
  INDUSTRIES,
  ROLES,
  WORKFLOWS,
} from "@/lib/marketplace/seed";

export const metadata: Metadata = {
  title: "Browse all roles",
  description:
    "AI workflows organized by job — browse every role and industry in the Monican library, from real estate agents to gym owners to solo CPAs.",
};

export default function RolesIndexPage() {
  const workflowCountByRole = WORKFLOWS.reduce<Record<string, number>>(
    (acc, w) => {
      acc[w.roleSlug] = (acc[w.roleSlug] || 0) + 1;
      return acc;
    },
    {}
  );

  const industries = INDUSTRIES.filter((i) => i.slug !== "other").map(
    (industry) => ({
      ...industry,
      roles: ROLES.filter((r) => r.industrySlug === industry.slug),
    })
  ).filter((i) => i.roles.length > 0);

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
            <Link href="/pricing" className="text-mn-muted hover:text-mn-text">
              Pricing
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

      {/* Hero */}
      <section className="bg-gradient-to-b from-orange-100 via-orange-50 to-white">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-14">
          <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-4">
            The library
          </p>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight max-w-3xl mb-5">
            Every role. Every industry.
          </h1>
          <p className="text-lg text-mn-text/70 max-w-2xl">
            {WORKFLOWS.length} curated AI workflows across {ROLES.length} roles.
            Pick your job and see only what matters for it.
          </p>
        </div>
      </section>

      {/* Industry sections */}
      <section className="max-w-6xl mx-auto px-6 py-16 space-y-14">
        {industries.map((industry) => (
          <div key={industry.slug} id={industry.slug} className="scroll-mt-24">
            <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-mn-border">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {industry.name}
                </h2>
                <p className="text-sm text-mn-muted mt-0.5">
                  {industry.description}
                </p>
              </div>
              <span className="text-sm text-mn-muted whitespace-nowrap">
                {industry.roles.length} role
                {industry.roles.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {industry.roles.map((role) => (
                <Link
                  key={role.slug}
                  href={`/for/${role.slug}`}
                  className="group bg-white border border-mn-border rounded-xl p-4 hover:border-mn-primary/50 hover:shadow-sm transition"
                >
                  <div className="font-semibold text-mn-text group-hover:text-mn-primary transition-colors mb-1">
                    {role.name}
                  </div>
                  <div className="text-xs text-mn-muted line-clamp-1 mb-2">
                    {role.description}
                  </div>
                  <div className="text-xs text-mn-primary font-medium">
                    {workflowCountByRole[role.slug] || 0} workflows →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-mn-text text-white">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Don&apos;t see your role?
          </h2>
          <p className="text-white/70 mb-8">
            Tell us what you do — we add new roles and workflows every week.
          </p>
          <Link
            href="/book"
            className="inline-block bg-mn-primary hover:bg-mn-primary-hover text-white font-medium px-8 py-4 rounded-full transition-colors"
          >
            Request your role
          </Link>
        </div>
      </section>
    </main>
  );
}
