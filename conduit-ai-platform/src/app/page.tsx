import Link from "next/link";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-6">
        <section className="py-24 md:py-32">
          <div className="max-w-3xl">
            <p className="text-cb-blue font-medium tracking-wide uppercase text-xs mb-4">
              Conduit AI Platform
            </p>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
              AI agent suites for any industry.
            </h1>
            <p className="text-xl text-cb-gray mt-6 leading-relaxed">
              Sign up, set your profile, your agents are running in 10 minutes.
              Real estate, legal, dental, and more.
            </p>
            <div className="flex gap-4 mt-10">
              <Link
                href="/signup"
                className="bg-cb-blue hover:bg-cb-blue-hover text-white font-medium px-6 py-3 rounded-md"
              >
                Start free
              </Link>
              <Link
                href="/tools/roi-calculator"
                className="border border-cb-border hover:border-cb-gray px-6 py-3 rounded-md"
              >
                See the ROI
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 border-t border-cb-border">
          <h2 className="text-3xl font-semibold tracking-tight mb-10">
            Three agents. One platform.
          </h2>
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

        <section className="py-16 border-t border-cb-border">
          <h2 className="text-3xl font-semibold tracking-tight mb-6">
            Built differently.
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-cb-gray">
            <p>
              Conduit isn&apos;t a chatbot you drop on your website. It&apos;s a suite
              of agents that live inside your existing Gmail, Google Sheets, and
              CRM — responding, drafting, and surfacing opportunities 24/7.
            </p>
            <p>
              You keep control. Every draft is reviewed by you before it sends.
              Every tool stays in your name. We just build the brains.
            </p>
          </div>
        </section>

        <footer className="py-10 border-t border-cb-border text-sm text-neutral-500">
          © {new Date().getFullYear()} Conduit AI · Bolton, MA
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
    <div className="border border-cb-border rounded-lg p-6 bg-cb-card">
      <p className="text-xs uppercase tracking-wide text-cb-blue mb-2">
        {tagline}
      </p>
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-cb-gray text-sm leading-relaxed">{description}</p>
    </div>
  );
}
