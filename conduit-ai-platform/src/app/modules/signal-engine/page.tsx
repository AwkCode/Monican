import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import { createClient } from "@/lib/supabase/server";
import ActivationPanel from "./ActivationPanel";
import SignalDashboard from "./SignalDashboard";
import type { Signal } from "@/lib/signals/types";

export const dynamic = "force-dynamic";

export default async function SignalEnginePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: client } = await supabase
    .from("clients")
    .select("full_name, business_name, phone, towns_served")
    .eq("id", user.id)
    .maybeSingle();

  const { data: mod } = await supabase
    .from("client_modules")
    .select("enabled, n8n_workflow_id, activated_at")
    .eq("client_id", user.id)
    .eq("module_key", "signal_engine")
    .maybeSingle();

  const profileReady = !!(
    client?.full_name &&
    client?.business_name &&
    client?.phone
  );
  const isActive = mod?.enabled;

  // If active, fetch signals + stats for the dashboard
  let initialSignals: Signal[] = [];
  let initialStats = { newToday: 0, totalActive: 0, hotLeads: 0, lettersDrafted: 0 };
  let cities: string[] = [];

  if (isActive) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [signalsRes, newTodayRes, totalRes, hotRes, draftedRes, citiesRes] =
      await Promise.all([
        supabase
          .from("signals")
          .select("*")
          .eq("client_id", user.id)
          .in("status", ["new", "viewed"])
          .order("confidence_score", { ascending: false })
          .limit(100),
        supabase
          .from("signals")
          .select("id", { count: "exact", head: true })
          .eq("client_id", user.id)
          .gte("created_at", today.toISOString()),
        supabase
          .from("signals")
          .select("id", { count: "exact", head: true })
          .eq("client_id", user.id)
          .in("status", ["new", "viewed"]),
        supabase
          .from("signals")
          .select("id", { count: "exact", head: true })
          .eq("client_id", user.id)
          .gte("confidence_score", 80)
          .in("status", ["new", "viewed"]),
        supabase
          .from("signals")
          .select("id", { count: "exact", head: true })
          .eq("client_id", user.id)
          .eq("letter_drafted", true),
        supabase
          .from("signals")
          .select("city")
          .eq("client_id", user.id)
          .not("city", "is", null),
      ]);

    initialSignals = signalsRes.data ?? [];
    initialStats = {
      newToday: newTodayRes.count ?? 0,
      totalActive: totalRes.count ?? 0,
      hotLeads: hotRes.count ?? 0,
      lettersDrafted: draftedRes.count ?? 0,
    };
    const citySet = new Set<string>();
    (citiesRes.data ?? []).forEach((r: { city: string }) => {
      if (r.city) citySet.add(r.city);
    });
    cities = Array.from(citySet).sort();
  }

  return (
    <>
      <Nav />
      <main className={`mx-auto px-6 py-12 ${isActive ? "max-w-7xl" : "max-w-3xl"}`}>
        <p className="text-cb-blue text-xs uppercase tracking-wide font-medium mb-2">
          Module
        </p>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Signal Engine
        </h1>
        <p className="text-cb-gray mb-10">
          AI-powered lead generation. Scans public records to find seller
          signals before your competition.
        </p>

        {!isActive ? (
          <div className="space-y-6">
            <div className="border border-cb-border rounded-lg p-6 bg-cb-card">
              <h2 className="text-lg font-semibold mb-4">How it works</h2>
              <ol className="space-y-3 text-sm text-cb-gray">
                <li className="flex gap-3">
                  <span className="text-cb-blue font-semibold">1.</span>
                  Every morning, scrapers scan multiple public data sources for
                  your farm towns.
                </li>
                <li className="flex gap-3">
                  <span className="text-cb-blue font-semibold">2.</span>
                  FSBO listings, ownership milestones, expired listings, and
                  building permits are all captured.
                </li>
                <li className="flex gap-3">
                  <span className="text-cb-blue font-semibold">3.</span>
                  Each opportunity gets a confidence score (0-100) based on
                  signal strength, recency, and correlation.
                </li>
                <li className="flex gap-3">
                  <span className="text-cb-blue font-semibold">4.</span>
                  You see everything on an interactive map + ranked table.
                  One-click to draft a personalized letter.
                </li>
                <li className="flex gap-3">
                  <span className="text-cb-blue font-semibold">5.</span>
                  Daily digest email with your top opportunities, delivered by
                  7:30am.
                </li>
              </ol>
            </div>

            <div className="border border-cb-border rounded-lg p-6 bg-cb-card">
              <h2 className="text-lg font-semibold mb-3">Signal types</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <TypeCard
                  icon="🏠"
                  name="FSBO"
                  desc="For-sale-by-owner listings — homeowners trying to sell without an agent"
                  score={70}
                />
                <TypeCard
                  icon="📅"
                  name="Ownership Milestone"
                  desc="Homeowners at 5/10/15/20+ year marks — statistically likely to sell"
                  score={50}
                />
                <TypeCard
                  icon="📋"
                  name="Expired Listing"
                  desc="Properties that were listed but didn't sell — frustrated sellers"
                  score={75}
                />
                <TypeCard
                  icon="🔨"
                  name="Building Permit"
                  desc="Recent renovations — often a precursor to listing at a higher price"
                  score={35}
                />
              </div>
            </div>

            <ActivationPanel
              profileReady={profileReady}
              moduleState={
                mod
                  ? {
                      enabled: mod.enabled,
                      workflowId: mod.n8n_workflow_id,
                      activatedAt: mod.activated_at,
                    }
                  : null
              }
            />
          </div>
        ) : (
          <SignalDashboard
            initialSignals={initialSignals}
            initialStats={initialStats}
            cities={cities}
          />
        )}
      </main>
    </>
  );
}

function TypeCard({
  icon,
  name,
  desc,
  score,
}: {
  icon: string;
  name: string;
  desc: string;
  score: number;
}) {
  return (
    <div className="border border-cb-border rounded-md p-4 bg-cb-bg">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="font-semibold">{name}</span>
        <span className="text-xs text-cb-gray ml-auto">Base: {score}</span>
      </div>
      <p className="text-xs text-cb-gray">{desc}</p>
    </div>
  );
}
