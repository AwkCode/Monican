import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import { createClient } from "@/lib/supabase/server";
import ActivationPanel from "./ActivationPanel";

export default async function LeadResponderPage() {
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
    .eq("module_key", "lead_responder")
    .maybeSingle();

  const profileReady = !!(client?.full_name && client?.business_name && client?.phone);

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-mn-primary text-xs uppercase tracking-wide font-medium mb-2">
          Module
        </p>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Lead Responder
        </h1>
        <p className="text-mn-muted mb-10">
          Replies to website leads, Zillow inquiries, and form fills in under 2
          minutes — in your voice. Drafts land in your Gmail for review before
          sending.
        </p>

        <div className="space-y-6">
          <div className="border border-mn-border rounded-lg p-6 bg-mn-bg-subtle">
            <h2 className="text-lg font-semibold mb-4">How it works</h2>
            <ol className="space-y-3 text-sm text-mn-muted">
              <li className="flex gap-3">
                <span className="text-mn-primary font-semibold">1.</span>
                A lead fills out your website form, Zillow inquiry, or sends an email.
              </li>
              <li className="flex gap-3">
                <span className="text-mn-primary font-semibold">2.</span>
                The lead data hits your unique webhook URL (set up once).
              </li>
              <li className="flex gap-3">
                <span className="text-mn-primary font-semibold">3.</span>
                Claude classifies the lead (hot/warm/cool) and drafts a personalized reply in your voice.
              </li>
              <li className="flex gap-3">
                <span className="text-mn-primary font-semibold">4.</span>
                The draft appears in your Gmail. You review, tweak if needed, and hit send.
              </li>
              <li className="flex gap-3">
                <span className="text-mn-primary font-semibold">5.</span>
                Everything is logged to your leads dashboard for tracking.
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

          <div className="border border-mn-border rounded-lg p-6 bg-mn-bg-subtle">
            <h2 className="text-lg font-semibold mb-3">What you get</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Stat label="Avg response time" value="< 2 min" />
              <Stat label="Cost per lead" value="~$0.002" />
              <Stat label="Languages" value="English + Spanish" />
              <Stat label="Lead classification" value="Hot / Warm / Cool" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-mn-text font-semibold">{value}</div>
      <div className="text-mn-muted text-xs">{label}</div>
    </div>
  );
}
