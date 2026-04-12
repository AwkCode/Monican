import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/past-clients — Add a single past client.
 */
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.first_name) {
    return NextResponse.json(
      { error: "first_name is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("past_clients")
    .insert({
      client_id: user.id,
      first_name: body.first_name,
      last_name: body.last_name ?? null,
      email: body.email ?? null,
      phone: body.phone ?? null,
      property_address: body.property_address ?? null,
      transaction_type: body.transaction_type ?? null,
      closing_date: body.closing_date || null,
      birthday: body.birthday || null,
      tags: body.tags ?? null,
      last_contacted: body.last_contacted || null,
      notes: body.notes ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "created", client: data });
}

/**
 * DELETE /api/past-clients?id=... — Delete a past client.
 */
export async function DELETE(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("past_clients")
    .delete()
    .eq("id", id)
    .eq("client_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "deleted" });
}
