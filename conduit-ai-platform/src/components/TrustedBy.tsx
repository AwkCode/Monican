export default function TrustedBy() {
  return (
    <section className="border-y border-mn-border bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-center text-xs uppercase tracking-widest text-mn-muted mb-8 font-medium">
          Sources we curate workflows from
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
          <Logo name="n8n" color="text-red-500" />
          <Logo name="Zapier" color="text-orange-500" />
          <Logo name="Make" color="text-purple-500" />
          <Logo name="GPT Store" color="text-emerald-600" sub="OpenAI" />
          <Logo name="Claude Skills" color="text-amber-600" sub="Anthropic" />
          <Logo name="Pipedream" color="text-blue-500" />
        </div>
        <p className="text-center text-[11px] text-mn-muted mt-6">
          Platform names indicate where a workflow comes from — not an
          endorsement of Monican. All trademarks belong to their owners.
        </p>
      </div>
    </section>
  );
}

function Logo({
  name,
  color,
  sub,
}: {
  name: string;
  color: string;
  sub?: string;
}) {
  return (
    <div className="text-center">
      <div className={`text-2xl md:text-3xl font-bold tracking-tight ${color} opacity-70 hover:opacity-100 transition-opacity`}>
        {name}
      </div>
      {sub && (
        <div className="text-[10px] uppercase tracking-wide text-mn-muted mt-1">
          by {sub}
        </div>
      )}
    </div>
  );
}
