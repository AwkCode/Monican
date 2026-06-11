import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Browse the workflow library free. Done-for-you setup from $500 flat — one workflow, fully wired into your tools, with a 30-day it-works guarantee.",
};

export default function PricingPage() {
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
            <Link href="/roles" className="text-mn-muted hover:text-mn-text">
              Browse roles
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
        <div className="max-w-4xl mx-auto px-6 pt-20 pb-14 text-center">
          <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-4">
            Pricing
          </p>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight mb-5">
            Browse free. Pay for setup.
          </h1>
          <p className="text-lg text-mn-text/70 max-w-2xl mx-auto">
            The library is free to browse, and every sourced workflow links
            straight to its platform so you can build it yourself. When you
            want it done-for-you, that&apos;s what we charge for.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Tier
            name="Self-serve"
            price="Free"
            sub="forever"
            description="Browse the full library and follow the source links to set up any workflow yourself."
            features={[
              "Full workflow library",
              "Direct links to every template",
              "Requirements + setup time listed",
              "New workflows weekly",
            ]}
            cta={{ label: "Browse the library", href: "/roles" }}
          />
          <Tier
            name="Quick Win"
            price="$500"
            sub="flat, one-time"
            description="One workflow, fully set up and wired into your tools. The lowest-risk way to test this."
            features={[
              "One workflow of your choice",
              "Set up in your Gmail / Sheets / CRM",
              "Trained on your voice",
              "30 days of support",
              "If it doesn't save you time, refund",
            ]}
            highlight
            cta={{ label: "Book a Quick Win", href: "/book?plan=quick-win" }}
          />
          <Tier
            name="Pilot"
            price="$1,500"
            sub="one-time"
            description="A full workflow overhaul — three workflows working together, documented and supported."
            features={[
              "Three workflows, integrated",
              "Full documentation",
              "Team training session",
              "60 days of support",
              "One revision round",
            ]}
            cta={{ label: "Book a Pilot", href: "/book?plan=pilot" }}
          />
          <Tier
            name="Retainer"
            price="$750"
            sub="per month"
            description="Ongoing automation partner. We keep everything running and keep adding what helps."
            features={[
              "Everything in Pilot",
              "New workflows as you need them",
              "Monitoring + fixes included",
              "Priority support",
              "Cancel anytime",
            ]}
            cta={{ label: "Talk retainer", href: "/book?plan=retainer" }}
          />
        </div>
        <p className="text-xs text-mn-muted text-center mt-8 max-w-2xl mx-auto">
          Third-party platform subscriptions (Zapier, Make, n8n, etc.) are
          billed by those platforms directly and aren&apos;t included. We&apos;ll
          always tell you the cheapest stack that does the job — some outbound
          links are affiliate links and may earn us a commission at no cost to
          you.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-mn-text text-white">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Not sure which fits?
          </h2>
          <p className="text-white/70 mb-8">
            15 minutes on a call and we&apos;ll tell you straight — including
            if the free self-serve route is all you need.
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

function Tier({
  name,
  price,
  sub,
  description,
  features,
  cta,
  highlight = false,
}: {
  name: string;
  price: string;
  sub: string;
  description: string;
  features: string[];
  cta: { label: string; href: string };
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-7 flex flex-col border ${
        highlight
          ? "border-mn-primary shadow-lg shadow-mn-primary/10 bg-gradient-to-b from-orange-50/60 to-white"
          : "border-mn-border bg-white"
      }`}
    >
      {highlight && (
        <span className="self-start text-[11px] font-bold uppercase tracking-wide bg-mn-primary text-white px-3 py-1 rounded-full mb-4">
          Most popular
        </span>
      )}
      <h3 className="text-lg font-semibold mb-1">{name}</h3>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-4xl font-semibold tracking-tight">{price}</span>
        <span className="text-sm text-mn-muted">{sub}</span>
      </div>
      <p className="text-sm text-mn-muted leading-relaxed mb-6">{description}</p>
      <ul className="space-y-2.5 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-mn-text/80">
            <span className="text-mn-primary mt-0.5">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={cta.href}
        className={`mt-auto block text-center font-medium py-3 rounded-full transition ${
          highlight
            ? "bg-mn-primary hover:bg-mn-primary-hover text-white"
            : "bg-black hover:bg-black/85 text-white"
        }`}
      >
        {cta.label}
      </Link>
    </div>
  );
}
