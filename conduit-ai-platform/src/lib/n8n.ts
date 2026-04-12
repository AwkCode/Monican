/**
 * n8n integration layer.
 *
 * Right now this is STUBBED — the n8n Cloud trial doesn't expose the REST API.
 * Once Daniel upgrades to a paid plan (or self-hosts), uncomment the real
 * implementation and set N8N_API_URL + N8N_API_KEY in Vercel env vars.
 *
 * The real flow:
 * 1. GET /workflows/{templateId} → get the template JSON
 * 2. Replace placeholder variables with client-specific values
 * 3. POST /workflows → create the new workflow
 * 4. POST /workflows/{newId}/activate → turn it on
 * 5. Return the workflow ID + webhook URL
 */

export type CloneResult = {
  workflowId: string;
  webhookUrl: string;
  stubbed: boolean;
};

export type ClientContext = {
  clientId: string;
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
  townsServed: string[];
  schoolDistrict: string;
  signatureBlock: string;
};

// Template IDs — these map to the actual workflow IDs in n8n.
// Update these once you rename workflows to template_* format.
export const TEMPLATES = {
  lead_responder: {
    // The n8n workflow ID of the template. Set this once you have API access.
    n8nWorkflowId: process.env.N8N_LEAD_RESPONDER_TEMPLATE_ID ?? "STUB",
    webhookPath: "lead-responder",
  },
  past_client_reactivator: {
    n8nWorkflowId: process.env.N8N_PAST_CLIENT_TEMPLATE_ID ?? "STUB",
    webhookPath: "past-client",
  },
} as const;

/**
 * Clone a template workflow for a specific client.
 *
 * STUBBED: Returns fake IDs. Replace with real n8n API calls when ready.
 */
export async function cloneWorkflowForClient(
  moduleKey: string,
  client: ClientContext
): Promise<CloneResult> {
  // When n8n API is available, set these env vars and uncomment the real implementation below.
  // const n8nApiUrl = process.env.N8N_API_URL;
  // const n8nApiKey = process.env.N8N_API_KEY;
  // if (n8nApiUrl && n8nApiKey && n8nApiKey !== "STUB") {
  //   const template = TEMPLATES[moduleKey as keyof typeof TEMPLATES];
  //   if (!template) throw new Error(`Unknown module: ${moduleKey}`);
  //
  //   // 1. Fetch template workflow
  //   const res = await fetch(`${n8nApiUrl}/workflows/${template.n8nWorkflowId}`, {
  //     headers: { "X-N8N-API-KEY": n8nApiKey },
  //   });
  //   const templateJson = await res.json();
  //
  //   // 2. Replace placeholders in the workflow JSON
  //   let workflowStr = JSON.stringify(templateJson);
  //   workflowStr = workflowStr.replace(/\{\{CLIENT_NAME\}\}/g, client.fullName);
  //   workflowStr = workflowStr.replace(/\{\{CLIENT_BROKERAGE\}\}/g, client.businessName);
  //   workflowStr = workflowStr.replace(/\{\{CLIENT_PHONE\}\}/g, client.phone);
  //   workflowStr = workflowStr.replace(/\{\{CLIENT_ID\}\}/g, client.clientId);
  //   const newWorkflow = JSON.parse(workflowStr);
  //
  //   // 3. Create new workflow
  //   newWorkflow.name = `${client.fullName} — ${template.webhookPath}`;
  //   delete newWorkflow.id;
  //   const createRes = await fetch(`${n8nApiUrl}/workflows`, {
  //     method: "POST",
  //     headers: {
  //       "X-N8N-API-KEY": n8nApiKey,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(newWorkflow),
  //   });
  //   const created = await createRes.json();
  //
  //   // 4. Activate
  //   await fetch(`${n8nApiUrl}/workflows/${created.id}/activate`, {
  //     method: "POST",
  //     headers: { "X-N8N-API-KEY": n8nApiKey },
  //   });
  //
  //   return {
  //     workflowId: created.id,
  //     webhookUrl: `${n8nApiUrl.replace('/api/v1', '')}/webhook/${client.clientId}-${template.webhookPath}`,
  //     stubbed: false,
  //   };
  // }

  // ---------- STUB: Return fake values ----------
  const stubId = `stub_${moduleKey}_${client.clientId.slice(0, 8)}`;
  return {
    workflowId: stubId,
    webhookUrl: `https://conduitaii.app.n8n.cloud/webhook/${stubId}`,
    stubbed: true,
  };
}
