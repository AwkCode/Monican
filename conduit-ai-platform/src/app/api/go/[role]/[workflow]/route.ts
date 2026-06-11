import { NextRequest, NextResponse } from "next/server";
import {
  getRoleBySlug,
  getWorkflow,
} from "@/lib/marketplace/seed";
import {
  buildAffiliateUrl,
  SOURCE_HOMEPAGES,
} from "@/lib/affiliate";
import { logEvent } from "@/lib/events";

/**
 * Tracked affiliate redirect.
 *
 * Flow:
 *   1. User clicks "Use template" on a workflow card or detail page
 *   2. Browser hits /api/go/[role]/[workflow]
 *   3. We log the click (console for now, Supabase later)
 *   4. 302 redirect to the source platform's affiliate-tagged URL
 *
 * Monican-original workflows redirect to /book?workflow=...
 * Sourced workflows redirect to the partner platform with affiliate code.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { role: string; workflow: string } }
) {
  const role = getRoleBySlug(params.role);
  const workflow = role ? getWorkflow(params.role, params.workflow) : undefined;

  if (!role || !workflow) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Monican Originals route to demo booking
  if (workflow.source === "Monican") {
    return NextResponse.redirect(
      new URL(`/book?workflow=${workflow.slug}&role=${role.slug}`, request.url)
    );
  }

  // Sourced workflows route to the partner platform with affiliate tag
  const fallback = SOURCE_HOMEPAGES[workflow.source];
  const destination = buildAffiliateUrl(
    workflow.source,
    workflow.sourceUrl,
    fallback
  );

  // Persist the click so we can see which workflows convert
  await logEvent(
    "affiliate_click",
    {
      role: role.slug,
      workflow: workflow.slug,
      source: workflow.source,
      destination,
      userAgent: request.headers.get("user-agent")?.slice(0, 120) || null,
    },
    request
  );

  return NextResponse.redirect(destination, { status: 302 });
}
