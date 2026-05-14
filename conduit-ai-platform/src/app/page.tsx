import Link from "next/link";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-5">
              AI agents for your business
            </p>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Your team of AI agents, ready in minutes.
            </h1>
            <p className="text-lg text-mn-muted mt-6 leading-relaxed max-w-lg">
              Sign up, set your profile, and your agents start working —
              responding to leads, reactivating past clients, and surfacing
              opportunities. Real estate first, every industry next.
            </p>
            <div className="flex gap-4 mt-10">
              <Link
                href="/signup"
                className="bg-mn-primary hover:bg-mn-primary-hover text-white font-medium px-6 py-3 rounded-md transition-colors"
              >
                Start free
              </Link>
              <Link
                href="/tools/roi-calculator"
                className="border border-mn-border hover:border-mn-muted text-mn-text px-6 py-3 rounded-md transition-colors"
              >
                See the ROI
              </Link>
            </div>
          </div>
          <HeroVisual />
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
        <section className="bg-mn-bg-subtle border-y border-mn-border">
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

function HeroVisual() {
  return (
    <div className="relative hidden md:flex items-center justify-center h-80">
      {/* Background gradient blob */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-orange-50 to-transparent rounded-3xl" />

      {/* Accent circles */}
      <div className="absolute top-6 right-8 w-16 h-16 bg-mn-primary/20 rounded-full blur-xl" />
      <div className="absolute bottom-10 left-6 w-24 h-24 bg-orange-200/40 rounded-full blur-2xl" />

      {/* Floating dashboard card */}
      <div className="relative bg-white border border-mn-border rounded-xl shadow-lg p-6 w-72">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
          <span className="text-sm font-medium text-mn-text">3 agents active</span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-mn-muted">Leads responded</span>
            <span className="font-semibold text-mn-text">24</span>
          </div>
          <div className="w-full bg-mn-bg-subtle rounded-full h-1.5">
            <div className="bg-mn-primary h-1.5 rounded-full w-3/4" />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-mn-muted">Clients reactivated</span>
            <span className="font-semibold text-mn-text">12</span>
          </div>
          <div className="w-full bg-mn-bg-subtle rounded-full h-1.5">
            <div className="bg-orange-300 h-1.5 rounded-full w-1/2" />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-mn-muted">Signals detected</span>
            <span className="font-semibold text-mn-text">8</span>
          </div>
          <div className="w-full bg-mn-bg-subtle rounded-full h-1.5">
            <div className="bg-orange-200 h-1.5 rounded-full w-1/3" />
          </div>
        </div>
      </div>
    </div>
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
