import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import { createClient } from "@/lib/supabase/server";
import GmailConnection from "./GmailConnection";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { gmail?: string; reason?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: cred } = await supabase
    .from("client_credentials")
    .select("provider, expires_at, scopes, updated_at")
    .eq("client_id", user.id)
    .eq("provider", "google")
    .maybeSingle();

  const gmailConnected = !!cred;

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Settings</h1>
        <p className="text-cb-gray mb-10">
          Manage your integrations and account settings.
        </p>

        <GmailConnection
          connected={gmailConnected}
          lastUpdated={cred?.updated_at ?? null}
          flashStatus={searchParams.gmail ?? null}
          flashReason={searchParams.reason ?? null}
        />
      </main>
    </>
  );
}
