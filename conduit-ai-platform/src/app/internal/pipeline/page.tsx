import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import PipelineTable from "./PipelineTable";

export const dynamic = "force-dynamic";

type Prospect = {
  id: number;
  priority: string | null;
  name: string;
  town: string | null;
  contact: string | null;
  stage: string | null;
  last_action: string | null;
  notes: string | null;
};

export default async function PipelinePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/internal/pipeline");
  if (!isAdmin(user.email)) {
    return (
      <>
        <Nav />
        <main className="max-w-2xl mx-auto px-6 py-16">
          <h1 className="text-2xl font-semibold mb-2">Not authorized</h1>
          <p className="text-mn-muted">
            This page is internal to the Monican team.
          </p>
        </main>
      </>
    );
  }

  const { data, error } = await supabase
    .from("prospects")
    .select("id, priority, name, town, contact, stage, last_action, notes")
    .order("id");

  const prospects = (data ?? []) as Prospect[];

  const stageCounts = prospects.reduce<Record<string, number>>((acc, p) => {
    const s = p.stage ?? "Lead";
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});

  const stages = ["Lead", "Contacted", "Discovery", "Proposal", "Closed Won"];

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Prospect Pipeline
          </h1>
          <span className="text-xs uppercase tracking-wide text-mn-primary">
            Internal — admin only
          </span>
        </div>
        <p className="text-mn-muted mb-8">
          Legacy consulting pipeline. Not visible to platform clients.
        </p>

        {error && (
          <p className="text-red-600 text-sm mb-4">
            Error loading prospects: {error.message}
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {stages.map((s) => (
            <div
              key={s}
              className="border border-mn-border rounded-lg p-4 bg-mn-bg-subtle text-center"
            >
              <div className="text-3xl font-bold">{stageCounts[s] ?? 0}</div>
              <div className="text-xs text-mn-muted uppercase tracking-wide mt-1">
                {s}
              </div>
            </div>
          ))}
        </div>

        <PipelineTable prospects={prospects} />
      </main>
    </>
  );
}
