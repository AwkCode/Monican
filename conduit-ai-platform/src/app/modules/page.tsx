import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import { createClient } from "@/lib/supabase/server";
import ModulesGrid from "./ModulesGrid";

const MODULE_CATALOG = [
  {
    key: "lead_responder",
    name: "Lead Responder",
    tagline: "Never miss a lead",
    description:
      "Replies to website leads, Zillow inquiries, and form fills in under 2 minutes — in your voice. Drafts land in your Gmail for a quick review before sending.",
    phase: "Coming soon",
    href: "/modules/lead-responder",
    ready: true,
  },
  {
    key: "past_client_reactivator",
    name: "Past Client Reactivator",
    tagline: "Your book of business, working",
    description:
      "Weekly personalized check-ins with past clients. Birthdays, home anniversaries, market updates — drafted for your review.",
    phase: "Available",
    href: "/modules/past-client",
    ready: true,
  },
  {
    key: "signal_engine",
    name: "Signal Engine",
    tagline: "Know before your competition",
    description:
      "Monitors public records for ownership milestones, life events, and seller signals in your farm towns. Daily digest of opportunities.",
    phase: "Coming in Phase 4",
    href: "/modules/signal-engine",
    ready: false,
  },
];

export default async function ModulesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("client_modules")
    .select("module_key, enabled")
    .eq("client_id", user.id);

  const enabledMap = Object.fromEntries(
    (existing ?? []).map((m) => [m.module_key, m.enabled])
  );

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Modules</h1>
        <p className="text-cb-gray mb-10">
          Your AI agent suite. Activate the modules you need — each one runs
          independently.
        </p>
        <ModulesGrid catalog={MODULE_CATALOG} enabledMap={enabledMap} />
      </main>
    </>
  );
}
