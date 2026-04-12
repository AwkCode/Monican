"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PastClient = {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  property_address: string | null;
  transaction_type: string | null;
  closing_date: string | null;
  birthday: string | null;
  last_contacted: string | null;
};

export default function PastClientsList({ clients }: { clients: PastClient[] }) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete(id: string) {
    setDeleting(id);
    const res = await fetch(`/api/past-clients?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    }
    setDeleting(null);
  }

  return (
    <div className="border border-cb-border rounded-lg bg-cb-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-xs uppercase tracking-wide text-cb-gray border-b border-cb-border">
          <tr>
            <th className="text-left px-4 py-3">Name</th>
            <th className="text-left px-4 py-3">Email</th>
            <th className="text-left px-4 py-3">Property</th>
            <th className="text-left px-4 py-3">Closing</th>
            <th className="text-left px-4 py-3">Birthday</th>
            <th className="text-left px-4 py-3">Last contact</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id} className="border-b border-cb-border hover:bg-cb-bg/50">
              <td className="px-4 py-3 font-medium">
                {c.first_name} {c.last_name ?? ""}
              </td>
              <td className="px-4 py-3 text-cb-gray">{c.email ?? "—"}</td>
              <td className="px-4 py-3 text-cb-gray text-xs">
                {c.property_address ?? "—"}
              </td>
              <td className="px-4 py-3 text-cb-gray">{c.closing_date ?? "—"}</td>
              <td className="px-4 py-3 text-cb-gray">{c.birthday ?? "—"}</td>
              <td className="px-4 py-3 text-cb-gray">
                {c.last_contacted ?? "—"}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={deleting === c.id}
                  className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                  {deleting === c.id ? "..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
