import Link from "next/link";

export default function Home() {
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
                <Link href="/modules" className="hover:text-mn-text">Modules</Link>
                <Link href="/tools/roi-calculator" className="hover:text-mn-text">ROI Calculator</Link>
                <Link href="#industries" className="hover:text-mn-text">Industries</Link>
                <Link href="/login" className="hover:text-mn-text">Log in</Link>
              </nav>
              <Link href="/" className="flex items-center gap-2 font-semibold text-2xl tracking-tight text-mn-text">
                <img src="/monican-logo.png" alt="Monican" className="h-8 w-8" />
                monican.
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-white/40 hover:bg-white/60 backdrop-blur border border-white/50 px-6 py-2.5 text-sm font-medium text-mn-text transition"
              >
                Get started
              </Link>
            </div>
          </header>

          {/* Centered hero content */}
          <div className="relative z-10 flex items-center justify-center px-6 min-h-[calc(100vh-100px)]">
            <div className="text-center max-w-5xl">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95] text-mn-text">
                Your AI team,
                <br />
                ready in minutes.
              </h1>
              <p className="mt-8 text-lg md:text-xl text-mn-text/70 max-w-2xl mx-auto leading-relaxed">
                Sign up, set your profile, and your agents start working — responding to leads, reactivating past clients, and surfacing opportunities.
              </p>
              <div className="mt-12 flex justify-center">
                <Link
                  href="/signup"
                  className="group bg-black hover:bg-black/85 text-white rounded-full pl-2 pr-8 py-2 inline-flex items-center gap-4 transition"
                >
                  <span className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-black">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 1.5L11 7L3 12.5V1.5Z" fill="currentColor" />
                    </svg>
                  </span>
                  <span className="text-base font-medium">Get started</span>
                </Link>
              </div>
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
              Monican turns every solo broker into a 10-agent shop —
              without the overhead, the meetings, or the burnout.
            </h2>
          </div>
        </section>

        {/* Three agents */}
        <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-2xl mb-16">
            <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-4">
              The platform
            </p>
            <h2 className="text-4xl font-semibold tracking-tight mb-4">
              Three agents. One platform.
            </h2>
            <p className="text-mn-muted text-lg">
              Each agent handles a different part of your business — so you can
              focus on closing deals.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <ModuleCard
              name="Lead Responder"
              tagline="Never miss a lead"
              description="Replies to website leads, Zillow inquiries, and form fills in under 2 minutes — in your voice."
            />
            <ModuleCard
              name="Past Client Reactivator"
              tagline="Your book of business, working"
              description="Weekly personalized check-ins with past clients. Birthdays, home anniversaries, market updates."
            />
            <ModuleCard
              name="Signal Engine"
              tagline="Know before your competition"
              description="Monitors public records for ownership milestones, life events, and seller signals in your farm."
            />
          </div>
        </section>

        {/* Industries */}
        <section id="industries" className="bg-mn-bg-subtle border-y border-mn-border">
          <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
            <div className="max-w-2xl mb-16">
              <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-4">
                Industries
              </p>
              <h2 className="text-4xl font-semibold tracking-tight mb-4">
                Built for one industry. Designed for every industry.
              </h2>
              <p className="text-mn-muted text-lg">
                We start with real estate. The same engine powers every vertical we expand into next.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <IndustryCard name="Real Estate" status="Live" active />
              <IndustryCard name="Legal" status="Coming soon" />
              <IndustryCard name="Dental" status="Coming soon" />
              <IndustryCard name="Your industry?" status="Tell us" />
            </div>
          </div>
        </section>

        {/* Built differently */}
        <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-2xl mb-12">
            <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-4">
              How it works
            </p>
            <h2 className="text-4xl font-semibold tracking-tight mb-4">
              Built differently.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-3">Lives in your tools</h3>
              <p className="text-mn-muted leading-relaxed">
                Monican isn&apos;t a chatbot you drop on your website. It&apos;s a
                suite of agents that live inside your existing Gmail, Google
                Sheets, and CRM — responding, drafting, and surfacing
                opportunities 24/7.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">You stay in control</h3>
              <p className="text-mn-muted leading-relaxed">
                Every draft is reviewed by you before it sends. Every tool stays
                in your name. We just build the brains, and you keep all the
                relationships.
              </p>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-mn-text text-white">
          <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6">
              Your agents are 10 minutes away.
            </h2>
            <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
              Sign up free. No credit card. Cancel anytime.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-mn-primary hover:bg-mn-primary-hover text-white font-medium px-8 py-4 rounded-md transition-colors"
              >
                Start free
              </Link>
              <Link
                href="/tools/roi-calculator"
                className="border border-white/30 hover:border-white text-white px-8 py-4 rounded-md transition-colors"
              >
                Calculate ROI
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
                  AI agent suites for every industry. Built in Boston, MA.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-4">Product</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/modules" className="text-mn-muted hover:text-mn-text">Modules</Link></li>
                  <li><Link href="/tools/roi-calculator" className="text-mn-muted hover:text-mn-text">ROI Calculator</Link></li>
                  <li><Link href="/signup" className="text-mn-muted hover:text-mn-text">Start free</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-4">Industries</h4>
                <ul className="space-y-3 text-sm">
                  <li><span className="text-mn-muted">Real Estate</span></li>
                  <li><span className="text-mn-muted">Legal (soon)</span></li>
                  <li><span className="text-mn-muted">Dental (soon)</span></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-4">Company</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/login" className="text-mn-muted hover:text-mn-text">Log in</Link></li>
                  <li><a href="mailto:daniel@monican.ai" className="text-mn-muted hover:text-mn-text">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-mn-border flex flex-col md:flex-row justify-between gap-4 text-sm text-mn-muted">
              <p>&copy; {new Date().getFullYear()} Monican &middot; Boston, MA</p>
              <p>Built with Claude, Next.js, and Supabase.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

function ModuleCard({
  name,
  tagline,
  description,
}: {
  name: string;
  tagline: string;
  description: string;
}) {
  return (
    <div className="border border-mn-border rounded-xl p-8 bg-white hover:shadow-md hover:border-mn-muted/30 transition-all">
      <p className="text-xs uppercase tracking-wide text-mn-primary font-semibold mb-3">
        {tagline}
      </p>
      <h3 className="text-xl font-semibold mb-3">{name}</h3>
      <p className="text-mn-muted text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function IndustryCard({
  name,
  status,
  active = false,
}: {
  name: string;
  status: string;
  active?: boolean;
}) {
  return (
    <div
      className={`border rounded-xl p-6 bg-white ${
        active ? "border-mn-primary/40" : "border-mn-border"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-2 h-2 rounded-full ${
            active ? "bg-green-500" : "bg-mn-muted/40"
          }`}
        />
        <p className="text-xs uppercase tracking-wide text-mn-muted font-medium">
          {status}
        </p>
      </div>
      <h3 className="text-lg font-semibold">{name}</h3>
    </div>
  );
}
