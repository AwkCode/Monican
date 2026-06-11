import Link from "next/link";
import DiscoveryWizard from "@/components/DiscoveryWizard";
import { INDUSTRIES, ROLES, WORKFLOWS } from "@/lib/marketplace/seed";
import { CONTACT_EMAIL } from "@/lib/site";

export default function Home() {
  const industryCount = INDUSTRIES.filter((i) => i.slug !== "other").length;

  return (
    <>
      <main>
        {/* Hero — cinematic full-bleed */}
        <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-orange-200 via-orange-100 to-rose-200">
          {/* Atmospheric overlays */}
          <div className="absolute inset-0">
            {/* Soft sun glow top-right */}
            <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-orange-300/40 blur-3xl" />
            {/* Warm haze bottom-left */}
            <div className="absolute bottom-[-15%] left-[-15%] w-[70vw] h-[70vw] rounded-full bg-rose-300/30 blur-3xl" />
            {/* Subtle center glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,237,213,0.5)_0%,_transparent_60%)]" />
            {/* Bottom fade to white for transition */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white" />
          </div>

          {/* Top nav */}
          <header className="relative z-10">
            <div className="max-w-7xl mx-auto px-8 py-6 flex items-start justify-between">
              <nav className="flex flex-col gap-2 text-sm font-medium text-mn-text/80">
                <Link href="/roles" className="hover:text-mn-text">Browse roles</Link>
                <Link href="/pricing" className="hover:text-mn-text">Pricing</Link>
                <Link href="/tools/roi-calculator" className="hover:text-mn-text">ROI Calculator</Link>
                <Link href="/login" className="hover:text-mn-text">Log in</Link>
              </nav>
              <Link href="/" className="flex items-center gap-2 font-semibold text-2xl tracking-tight text-mn-text">
                <img src="/monican-logo.png" alt="Monican" className="h-8 w-8" />
                monican.
              </Link>
              <Link
                href="/book"
                className="rounded-full bg-white/40 hover:bg-white/60 backdrop-blur border border-white/50 px-6 py-2.5 text-sm font-medium text-mn-text transition"
              >
                Book a demo
              </Link>
            </div>
          </header>

          {/* Centered hero content */}
          <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-8 pb-20">
            <div className="text-center max-w-5xl mb-12">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.95] text-mn-text">
                The AI workflow
                <br />
                library for every role.
              </h1>
              <p className="mt-6 text-lg md:text-xl text-mn-text/70 max-w-2xl mx-auto leading-relaxed">
                Curated workflows from n8n, Zapier, GPT Store, Claude Skills, and our own lab —
                organized by your job. We set them up. You save the hours.
              </p>
            </div>

            {/* Wizard */}
            <div className="w-full max-w-2xl">
              <DiscoveryWizard />
            </div>

            <div className="mt-8 text-sm text-mn-text/60 flex items-center gap-4 flex-wrap justify-center">
              <span>Or</span>
              <Link href="/book" className="underline hover:text-mn-text">
                book a custom demo
              </Link>
              <span>·</span>
              <Link href="/tools/roi-calculator" className="underline hover:text-mn-text">
                calculate your ROI
              </Link>
            </div>
          </div>
        </section>

        {/* Mission statement */}
        <section className="bg-mn-bg-subtle border-y border-mn-border">
          <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
            <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-6">
              Why Monican
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
              Monican turns every solo operator into a 10-person shop —
              without the overhead, the meetings, or the burnout.
            </h2>
          </div>
        </section>

        {/* The library — by the numbers */}
        <section className="max-w-6xl mx-auto px-6 pt-32 pb-12">
          <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-4">
            The library
          </p>
          <h2 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight max-w-3xl mb-10">
            One place to find the workflow that fits your job.
          </h2>
          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            <LibraryStat value={`${WORKFLOWS.length}`} label="curated workflows" />
            <LibraryStat value={`${ROLES.length}`} label="roles covered" />
            <LibraryStat value={`${industryCount}`} label="industries" />
          </div>
          <p className="text-mn-muted text-sm mt-6 max-w-xl">
            Every workflow shows where it comes from, what tools it needs, and
            what we estimate it saves. Use it yourself on the source platform —
            or have us set it up for you.
          </p>
        </section>

        {/* Section header — From our lab */}
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-12">
          <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-4">
            From our lab
          </p>
          <h2 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight max-w-3xl">
            Three agents we build and run for you.
          </h2>
          <p className="text-mn-muted text-lg mt-4 max-w-2xl">
            Our own designs — set up done-for-you, trained on your voice, with
            a human on call. Every draft waits for your approval before
            anything sends.
          </p>
        </section>

        {/* Module 01 — Lead Responder */}
        <ModuleSpotlight
          number="01"
          tagline="Never miss a lead"
          name="Lead Responder"
          description="Replies to website leads, Zillow inquiries, and form fills in under 2 minutes — in your voice. Drafts every message, you approve before send."
          gradient="from-orange-100 via-amber-50 to-rose-100"
          accentColor="bg-mn-primary"
          stats={[
            { label: "Draft response time", value: "<2 min" },
            { label: "Sends without you", value: "Never" },
            { label: "Lives in", value: "Your Gmail" },
          ]}
        />

        {/* Module 02 — Past Client Reactivator */}
        <ModuleSpotlight
          number="02"
          tagline="Your book of business, working"
          name="Past Client Reactivator"
          description="Weekly personalized check-ins with past clients. Birthdays, closing anniversaries, market updates — every reason to stay top of mind, drafted for your review."
          gradient="from-rose-100 via-orange-50 to-amber-100"
          accentColor="bg-rose-400"
          reverse
          stats={[
            { label: "Touch points / yr", value: "52x" },
            { label: "Triggers on", value: "Birthdays + closings" },
            { label: "You approve", value: "Every send" },
          ]}
        />

        {/* Module 03 — Signal Engine */}
        <ModuleSpotlight
          number="03"
          tagline="Know before your competition"
          name="Signal Engine"
          description="Monitors public records for ownership milestones, life events, and seller signals in your farm. Be first to the door with a real reason to reach out."
          gradient="from-amber-100 via-rose-50 to-orange-100"
          accentColor="bg-amber-500"
          stats={[
            { label: "Data source", value: "Public records" },
            { label: "Every signal", value: "Scored 1–10" },
            { label: "Digest lands", value: "Monday 8am" },
          ]}
        />

        {/* Industries */}
        <section id="industries" className="relative overflow-hidden bg-mn-text text-white">
          <div className="absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-mn-primary/10 blur-3xl" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-500/10 blur-3xl" />
          </div>
          <div className="relative max-w-6xl mx-auto px-6 py-32">
            <div className="max-w-3xl mb-20">
              <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-4">
                Industries
              </p>
              <h2 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
                {industryCount} industries.{" "}
                <span className="text-white/50">Find yours.</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {INDUSTRIES.filter((i) => i.slug !== "other").map((industry) => (
                <Link
                  key={industry.slug}
                  href={`/roles#${industry.slug}`}
                  className="border border-white/15 hover:border-white/50 hover:bg-white/5 rounded-full px-5 py-2.5 text-sm text-white/80 hover:text-white transition"
                >
                  {industry.name}
                </Link>
              ))}
              <Link
                href="/book"
                className="border border-mn-primary/60 bg-mn-primary/10 hover:bg-mn-primary/20 rounded-full px-5 py-2.5 text-sm text-white transition"
              >
                Your industry missing? Tell us →
              </Link>
            </div>
          </div>
        </section>

        {/* How it works — feature grid */}
        <section className="max-w-6xl mx-auto px-6 py-32">
          <div className="max-w-3xl mb-20">
            <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-4">
              How it works
            </p>
            <h2 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
              Built differently.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-mn-border border border-mn-border rounded-2xl overflow-hidden">
            <FeatureTile
              icon="🧭"
              title="Organized by your job"
              description="Not by app, not by trigger. Tell us what you do and see only the workflows that matter for your role."
            />
            <FeatureTile
              icon="✋"
              title="You stay in control"
              description="Our agents draft — they never auto-send. You approve, edit, or reject. The voice stays yours."
            />
            <FeatureTile
              icon="🔧"
              title="Done-for-you setup"
              description="Use any workflow yourself on its source platform, or have us wire it into your Gmail, Sheets, and CRM. No migration."
            />
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-mn-text text-white">
          <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6">
              Find your workflows in 2 minutes.
            </h2>
            <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
              15-minute demo. Custom for your business. No pressure.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/book"
                className="bg-mn-primary hover:bg-mn-primary-hover text-white font-medium px-8 py-4 rounded-full transition-colors"
              >
                Book a demo
              </Link>
              <Link
                href="/roles"
                className="border border-white/30 hover:border-white text-white px-8 py-4 rounded-full transition-colors"
              >
                Browse all roles
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-mn-border">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
              <div className="col-span-2 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <img src="/monican-logo.png" alt="Monican" className="h-8 w-8" />
                  <span className="font-semibold text-lg">Monican</span>
                </div>
                <p className="text-mn-muted text-sm max-w-xs leading-relaxed">
                  The AI workflow library for every role. Built in Boston, MA.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-4">Product</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/roles" className="text-mn-muted hover:text-mn-text">Browse roles</Link></li>
                  <li><Link href="/pricing" className="text-mn-muted hover:text-mn-text">Pricing</Link></li>
                  <li><Link href="/tools/roi-calculator" className="text-mn-muted hover:text-mn-text">ROI Calculator</Link></li>
                  <li><Link href="/book" className="text-mn-muted hover:text-mn-text">Book a demo</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-4">Popular roles</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/for/real-estate-agent" className="text-mn-muted hover:text-mn-text">Real Estate Agent</Link></li>
                  <li><Link href="/for/general-contractor" className="text-mn-muted hover:text-mn-text">General Contractor</Link></li>
                  <li><Link href="/for/solo-cpa" className="text-mn-muted hover:text-mn-text">Solo CPA</Link></li>
                  <li><Link href="/for/gym-owner" className="text-mn-muted hover:text-mn-text">Gym Owner</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-4">Company</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/login" className="text-mn-muted hover:text-mn-text">Log in</Link></li>
                  <li><a href={`mailto:${CONTACT_EMAIL}`} className="text-mn-muted hover:text-mn-text">Contact</a></li>
                  <li><Link href="/privacy" className="text-mn-muted hover:text-mn-text">Privacy</Link></li>
                  <li><Link href="/terms" className="text-mn-muted hover:text-mn-text">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-mn-border flex flex-col md:flex-row justify-between gap-4 text-sm text-mn-muted">
              <p>&copy; {new Date().getFullYear()} Monican &middot; Boston, MA</p>
              <p>
                Some outbound links are affiliate links — we may earn a
                commission at no cost to you.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

function LibraryStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white border border-mn-border rounded-2xl p-6">
      <div className="text-4xl font-semibold text-mn-text">{value}</div>
      <div className="text-xs text-mn-muted uppercase tracking-wider mt-2">
        {label}
      </div>
    </div>
  );
}

function ModuleSpotlight({
  number,
  tagline,
  name,
  description,
  gradient,
  accentColor,
  stats,
  reverse = false,
}: {
  number: string;
  tagline: string;
  name: string;
  description: string;
  gradient: string;
  accentColor: string;
  stats: { label: string; value: string }[];
  reverse?: boolean;
}) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-10 md:p-16`}
      >
        {/* Decorative blobs */}
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 rounded-full bg-white/20 blur-3xl" />

        <div
          className={`relative grid md:grid-cols-2 gap-12 items-center ${
            reverse ? "md:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* Text */}
          <div>
            <p className="text-mn-text/60 font-mono text-sm mb-6">{number}</p>
            <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-3">
              {tagline}
            </p>
            <h3 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-5">
              {name}
            </h3>
            <p className="text-mn-text/70 text-lg leading-relaxed max-w-md">
              {description}
            </p>
          </div>

          {/* Stats card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-white/50">
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2.5 h-2.5 ${accentColor} rounded-full`} />
              <span className="text-sm font-medium text-mn-text">
                {name} — done-for-you
              </span>
            </div>
            <div className="space-y-5">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-2 gap-4">
                    <span className="text-mn-muted text-sm">{s.label}</span>
                    <span className="text-xl font-semibold text-mn-text text-right">
                      {s.value}
                    </span>
                  </div>
                  <div className="w-full bg-mn-bg-subtle rounded-full h-1.5">
                    <div
                      className={`${accentColor} h-1.5 rounded-full`}
                      style={{ width: `${30 + i * 25}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureTile({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-10 hover:bg-mn-bg-subtle/40 transition">
      <div className="text-3xl mb-5">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-mn-muted leading-relaxed">{description}</p>
    </div>
  );
}
