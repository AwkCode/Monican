import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cloneWorkflowForClient, type ClientContext } from "@/lib/n8n";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { module_key } = body as { module_key: string };

  if (!module_key) {
    return NextResponse.json({ error: "module_key required" }, { status: 400 });
  }

  // 1. Get client profile
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("*")
    .eq("id", user.id)
    .single();

  if (clientError || !client) {
    return NextResponse.json(
      { error: "Complete your profile first" },
      { status: 400 }
    );
  }

  // 2. Check if module is already active
  const { data: existing } = await supabase
    .from("client_modules")
    .select("*")
    .eq("client_id", user.id)
    .eq("module_key", module_key)
    .maybeSingle();

  if (existing?.enabled && existing?.n8n_workflow_id) {
    return NextResponse.json({
      status: "already_active",
      workflow_id: existing.n8n_workflow_id,
      webhook_url: existing.n8n_webhook_url,
    });
  }

  // 3. Clone the n8n template (stubbed for now)
  const clientContext: ClientContext = {
    clientId: user.id,
    fullName: client.full_name ?? "",
    businessName: client.business_name ?? "",
    phone: client.phone ?? "",
    email: client.email,
    townsServed: client.towns_served ?? [],
    schoolDistrict: client.school_district ?? "",
    signatureBlock: client.signature_block ?? "",
  };

  const result = await cloneWorkflowForClient(module_key, clientContext);

  // 4. Save to client_modules
  const { error: upsertError } = await supabase.from("client_modules").upsert(
    {
      client_id: user.id,
      module_key,
      enabled: true,
      n8n_workflow_id: result.workflowId,
      n8n_webhook_url: result.webhookUrl,
      activated_at: new Date().toISOString(),
    },
    { onConflict: "client_id,module_key" }
  );

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  // 5. Log activation event
  await supabase.from("activity_log").insert({
    client_id: user.id,
    module_key,
    event_type: "module_activated",
    event_data: {
      workflow_id: result.workflowId,
      webhook_url: result.webhookUrl,
      stubbed: result.stubbed,
    },
  });

  return NextResponse.json({
    status: "activated",
    workflow_id: result.workflowId,
    webhook_url: result.webhookUrl,
    stubbed: result.stubbed,
  });
}

export async function DELETE(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const module_key = searchParams.get("module_key");

  if (!module_key) {
    return NextResponse.json({ error: "module_key required" }, { status: 400 });
  }

  // Deactivate: set enabled=false but keep the record
  const { error } = await supabase
    .from("client_modules")
    .update({ enabled: false })
    .eq("client_id", user.id)
    .eq("module_key", module_key);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log deactivation
  await supabase.from("activity_log").insert({
    client_id: user.id,
    module_key,
    event_type: "module_deactivated",
    event_data: {},
  });

  return NextResponse.json({ status: "deactivated" });
}
