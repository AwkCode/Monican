export default function WhyTrustGrid() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="max-w-3xl mb-16">
        <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-3">
          Why these workflows
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-4">
          Every workflow earns its spot.
        </h2>
        <p className="text-lg text-mn-muted">
          We don&apos;t list everything — we list what we&apos;d run ourselves.
          Every workflow here meets four criteria.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FeatureCard
          number="01"
          title="Curated, not scraped"
          description="Hand-picked from n8n, Zapier, Make, GPT Store, and Claude Skills — plus designs from our own lab. If it's junk, it doesn't get listed."
        />
        <FeatureCard
          number="02"
          title="Honest estimates"
          description="Time and dollar figures are our estimates from typical volumes for each role — clearly labeled as estimates until real client data replaces them."
        />
        <FeatureCard
          number="03"
          title="Setup transparency"
          description="Every workflow lists exactly what tools it needs, what data it touches, and how long setup takes."
        />
        <FeatureCard
          number="04"
          title="One person to call"
          description="We handle setup. We're on call when it breaks. You don't ping six different vendors when something goes wrong."
        />
      </div>
    </section>
  );
}

function FeatureCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-mn-border rounded-2xl p-6 hover:border-mn-primary/30 transition">
      <p className="text-xs font-mono text-mn-muted mb-4">{number}</p>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-mn-muted text-sm leading-relaxed">{description}</p>
    </div>
  );
}
