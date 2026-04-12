import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/signals — List signals with filters, pagination, sorting.
 *
 * Query params:
 * - type: filter by signal_type
 * - city: filter by city
 * - status: filter by status (default: new,viewed)
 * - min_score: minimum confidence score
 * - sort: field to sort by (default: confidence_score)
 * - order: asc or desc (default: desc)
 * - page: page number (default: 1)
 * - limit: per page (default: 50)
 */
export async function GET(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const type = params.get("type");
  const city = params.get("city");
  const status = params.get("status");
  const minScore = params.get("min_score");
  const sort = params.get("sort") ?? "confidence_score";
  const order = params.get("order") === "asc";
  const page = parseInt(params.get("page") ?? "1");
  const limit = parseInt(params.get("limit") ?? "50");

  let query = supabase
    .from("signals")
    .select("*", { count: "exact" })
    .eq("client_id", user.id);

  if (type) query = query.eq("signal_type", type);
  if (city) query = query.ilike("city", `%${city}%`);
  if (status) {
    const statuses = status.split(",");
    query = query.in("status", statuses);
  } else {
    query = query.in("status", ["new", "viewed"]);
  }
  if (minScore) query = query.gte("confidence_score", parseInt(minScore));

  query = query
    .order(sort, { ascending: order })
    .range((page - 1) * limit, page * limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    signals: data ?? [],
    total: count ?? 0,
    page,
    limit,
  });
}
