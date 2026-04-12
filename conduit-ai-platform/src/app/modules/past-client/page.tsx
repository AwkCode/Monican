import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import { createClient } from "@/lib/supabase/server";
import ActivationPanel from "./ActivationPanel";
import CsvUpload from "./CsvUpload";
import PastClientsList from "./PastClientsList";
import AddClientForm from "./AddClientForm";

export const dynamic = "force-dynamic";

export default async function PastClientPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: client } = await supabase
    .from("clients")
    .select("full_name, business_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  const { data: mod } = await supabase
    .from("client_modules")
    .select("*")
    .eq("client_id", user.id)
    .eq("module_key", "past_client_reactivator")
    .maybeSingle();

  const { data: pastClients } = await supabase
    .from("past_clients")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  const profileReady = !!(client?.full_name && client?.business_name && client?.phone);

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-cb-blue text-xs uppercase tracking-wide font-medium mb-2">
          Module
        </p>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Past Client Reactivator
        </h1>
        <p className="text-cb-gray mb-10">
          Weekly personalized check-ins with your past clients. Birthdays, home
          anniversaries, market updates — drafted for your review.
        </p>

        <div className="space-y-6">
          <div className="border border-cb-border rounded-lg p-6 bg-cb-card">
            <h2 className="text-lg font-semibold mb-4">How it works</h2>
            <ol className="space-y-3 text-sm text-cb-gray">
              <li className="flex gap-3">
                <span className="text-cb-blue font-semibold">1.</span>
                Upload your past clients via CSV or add them manually.
              </li>
              <li className="flex gap-3">
                <span className="text-cb-blue font-semibold">2.</span>
                Every Monday at 8am, the agent scans for upcoming birthdays, home
                anniversaries, and dormant contacts.
              </li>
              <li className="flex gap-3">
                <span className="text-cb-blue font-semibold">3.</span>
                Claude drafts a warm, personal email for each — in your voice.
              </li>
              <li className="flex gap-3">
                <span className="text-cb-blue font-semibold">4.</span>
                Drafts land in your Gmail. You review, tweak, and send.
              </li>
              <li className="flex gap-3">
                <span className="text-cb-blue font-semibold">5.</span>
                You get a weekly summary of who was drafted and why.
              </li>
            </ol>
          </div>

          <ActivationPanel
            profileReady={profileReady}
            moduleState={
              mod
                ? {
                    enabled: mod.enabled,
                    workflowId: mod.n8n_workflow_id,
                    webhookUrl: mod.n8n_webhook_url,
                    activatedAt: mod.activated_at,
                  }
                : null
            }
          />

          <div className="border border-cb-border rounded-lg p-6 bg-cb-card">
            <h2 className="text-lg font-semibold mb-4">
              Your past clients ({(pastClients ?? []).length})
            </h2>
            <CsvUpload />
            <div className="mt-6">
              <AddClientForm />
            </div>
          </div>

          {(pastClients ?? []).length > 0 && (
            <PastClientsList clients={pastClients ?? []} />
          )}
        </div>
      </main>
    </>
  );
}
