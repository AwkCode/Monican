// Integration name → emoji or short label for the chip
const INTEGRATION_DISPLAY: Record<string, { emoji: string; label: string }> = {
  Gmail: { emoji: "📧", label: "Gmail" },
  "Google Sheets": { emoji: "📊", label: "Sheets" },
  "Google Drive": { emoji: "📁", label: "Drive" },
  Calendar: { emoji: "📅", label: "Calendar" },
  Slack: { emoji: "💬", label: "Slack" },
  Discord: { emoji: "🎮", label: "Discord" },
  Twilio: { emoji: "📱", label: "Twilio" },
  Stripe: { emoji: "💳", label: "Stripe" },
  HubSpot: { emoji: "🟧", label: "HubSpot" },
  Salesforce: { emoji: "☁️", label: "Salesforce" },
  Notion: { emoji: "📝", label: "Notion" },
  Airtable: { emoji: "🗂️", label: "Airtable" },
  Shopify: { emoji: "🛍️", label: "Shopify" },
  Zendesk: { emoji: "🎫", label: "Zendesk" },
  Intercom: { emoji: "💭", label: "Intercom" },
  LinkedIn: { emoji: "💼", label: "LinkedIn" },
  Twitter: { emoji: "🐦", label: "X / Twitter" },
  X: { emoji: "🐦", label: "X / Twitter" },
  GitHub: { emoji: "🐙", label: "GitHub" },
  Segment: { emoji: "📡", label: "Segment" },
  Mixpanel: { emoji: "📈", label: "Mixpanel" },
  Calendly: { emoji: "🗓️", label: "Calendly" },
  Typeform: { emoji: "📋", label: "Typeform" },
  Tally: { emoji: "📋", label: "Tally" },
  Clay: { emoji: "🧱", label: "Clay" },
  Apollo: { emoji: "🚀", label: "Apollo" },
  "Anthropic API key": { emoji: "🟣", label: "Anthropic" },
  "Claude or ChatGPT": { emoji: "🤖", label: "Claude / GPT" },
  "ChatGPT Plus": { emoji: "🟢", label: "ChatGPT" },
  "ChatGPT Plus or Claude": { emoji: "🤖", label: "Claude / GPT" },
};

export default function IntegrationsGrid({
  integrations,
}: {
  integrations: string[];
}) {
  // Dedupe and pick known ones first
  const unique = Array.from(new Set(integrations));

  // Filter to ones we have nice displays for, fall back to raw
  const displayed = unique.slice(0, 18);

  if (displayed.length === 0) return null;

  return (
    <section className="bg-mn-bg-subtle border-y border-mn-border">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-3">
            Integrations
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
            Works with the tools you already use.
          </h2>
          <p className="text-mn-muted max-w-xl mx-auto">
            These workflows run inside your existing stack. No new logins. No
            migration.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {displayed.map((name) => {
            const display = INTEGRATION_DISPLAY[name] || {
              emoji: "🔌",
              label: name.length > 24 ? name.slice(0, 22) + "…" : name,
            };
            return (
              <div
                key={name}
                className="flex items-center gap-2 bg-white border border-mn-border rounded-full px-4 py-2.5 hover:border-mn-primary/40 transition"
              >
                <span className="text-lg">{display.emoji}</span>
                <span className="text-sm font-medium text-mn-text">
                  {display.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
