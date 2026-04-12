import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/past-clients/upload — Parse a CSV and bulk-insert into past_clients.
 *
 * Expects the CSV as plain text in the body with Content-Type text/csv,
 * or as JSON { csv: "..." }.
 *
 * Required columns: first_name
 * Optional: last_name, email, phone, property_address, transaction_type,
 *           closing_date, birthday, tags, last_contacted, notes
 */
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let csvText: string;

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await request.json();
    csvText = body.csv;
  } else {
    csvText = await request.text();
  }

  if (!csvText || csvText.trim().length === 0) {
    return NextResponse.json({ error: "Empty CSV" }, { status: 400 });
  }

  // Parse CSV
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) {
    return NextResponse.json(
      { error: "CSV must have a header row and at least one data row" },
      { status: 400 }
    );
  }

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));

  // Map common header variations
  const headerMap: Record<string, string> = {
    first_name: "first_name",
    firstname: "first_name",
    first: "first_name",
    last_name: "last_name",
    lastname: "last_name",
    last: "last_name",
    email: "email",
    email_address: "email",
    phone: "phone",
    phone_number: "phone",
    property_address: "property_address",
    address: "property_address",
    property: "property_address",
    transaction_type: "transaction_type",
    type: "transaction_type",
    closing_date: "closing_date",
    close_date: "closing_date",
    birthday: "birthday",
    birth_date: "birthday",
    dob: "birthday",
    tags: "tags",
    last_contacted: "last_contacted",
    last_contact: "last_contacted",
    notes: "notes",
  };

  const colMap = headers.map((h) => headerMap[h] ?? null);

  if (!colMap.includes("first_name")) {
    return NextResponse.json(
      { error: "CSV must include a 'first_name' or 'firstname' column" },
      { status: 400 }
    );
  }

  const rows: Record<string, string | null>[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parse (handles quoted fields with commas)
    const values = parseCSVLine(line);
    const row: Record<string, string | null> = {};

    colMap.forEach((field, idx) => {
      if (field && values[idx] !== undefined) {
        row[field] = values[idx].trim() || null;
      }
    });

    if (!row.first_name) {
      errors.push(`Row ${i + 1}: missing first_name`);
      continue;
    }

    rows.push(row);
  }

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "No valid rows found", details: errors },
      { status: 400 }
    );
  }

  // Bulk insert
  const insertData = rows.map((r) => ({
    client_id: user.id,
    first_name: r.first_name!,
    last_name: r.last_name ?? null,
    email: r.email ?? null,
    phone: r.phone ?? null,
    property_address: r.property_address ?? null,
    transaction_type: r.transaction_type ?? null,
    closing_date: r.closing_date || null,
    birthday: r.birthday || null,
    tags: r.tags ?? null,
    last_contacted: r.last_contacted || null,
    notes: r.notes ?? null,
  }));

  const { error: insertError } = await supabase
    .from("past_clients")
    .insert(insertData);

  if (insertError) {
    return NextResponse.json(
      { error: insertError.message },
      { status: 500 }
    );
  }

  // Log the upload
  await supabase.from("activity_log").insert({
    client_id: user.id,
    module_key: "past_client_reactivator",
    event_type: "csv_uploaded",
    event_data: { rows_imported: rows.length, errors: errors.length },
  });

  return NextResponse.json({
    status: "imported",
    rows_imported: rows.length,
    errors,
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
