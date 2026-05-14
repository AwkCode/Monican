import Link from "next/link";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <section className="py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-4">
              AI agents for your business
            </p>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1]">
              Your team of AI agents, ready in minutes.
            </h1>
            <p className="text-lg text-mn-muted mt-6 leading-relaxed">
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

        {/* Three agents */}
        <section className="py-16 border-t border-mn-border">
          <h2 className="text-3xl font-semibold tracking-tight mb-3">
            Three agents. One platform.
          </h2>
          <p className="text-mn-muted mb-10 max-w-xl">
            Each agent handles a different part of your business — so you can focus on closing deals.
          </p>
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

        {/* Differentiator */}
        <section className="py-16 border-t border-mn-border">
          <h2 className="text-3xl font-semibold tracking-tight mb-6">
            Built differently.
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-mn-muted">
            <p className="leading-relaxed">
              Monican isn&apos;t a chatbot you drop on your website. It&apos;s a suite
              of agents that live inside your existing Gmail, Google Sheets, and
              CRM — responding, drafting, and surfacing opportunities 24/7.
            </p>
            <p className="leading-relaxed">
              You keep control. Every draft is reviewed by you before it sends.
              Every tool stays in your name. We just build the brains.
            </p>
          </div>
        </section>

        {/* Social proof */}
        <section className="py-12 border-t border-mn-border text-center">
          <p className="text-mn-muted text-sm">
            Trusted by agents and brokerages across Massachusetts.
          </p>
        </section>

        <footer className="py-10 border-t border-mn-border text-sm text-mn-muted">
          &copy; {new Date().getFullYear()} Monican &middot; Bolton, MA
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
    <div className="border border-mn-border rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
      <p className="text-xs uppercase tracking-wide text-mn-primary font-medium mb-2">
        {tagline}
      </p>
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-mn-muted text-sm leading-relaxed">{description}</p>
    </div>
  );
}
