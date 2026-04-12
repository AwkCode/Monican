"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddClientForm() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    property_address: "",
    transaction_type: "",
    closing_date: "",
    birthday: "",
    notes: "",
  });
  const router = useRouter();

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/past-clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        property_address: "",
        transaction_type: "",
        closing_date: "",
        birthday: "",
        notes: "",
      });
      setOpen(false);
      router.refresh();
    }
    setSaving(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-cb-blue hover:text-cb-blue-hover"
      >
        + Add a past client manually
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-cb-border rounded-lg p-4 bg-cb-bg space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <SmallInput label="First name *" value={form.first_name} onChange={(v) => set("first_name", v)} required />
        <SmallInput label="Last name" value={form.last_name} onChange={(v) => set("last_name", v)} />
        <SmallInput label="Email" value={form.email} onChange={(v) => set("email", v)} type="email" />
        <SmallInput label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
        <SmallInput label="Property address" value={form.property_address} onChange={(v) => set("property_address", v)} />
        <SmallInput label="Transaction type" value={form.transaction_type} onChange={(v) => set("transaction_type", v)} placeholder="Buyer / Seller" />
        <SmallInput label="Closing date" value={form.closing_date} onChange={(v) => set("closing_date", v)} type="date" />
        <SmallInput label="Birthday" value={form.birthday} onChange={(v) => set("birthday", v)} type="date" />
      </div>
      <SmallInput label="Notes" value={form.notes} onChange={(v) => set("notes", v)} />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving || !form.first_name}
          className="bg-cb-blue hover:bg-cb-blue-hover text-white font-medium px-4 py-2 rounded-md text-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : "Add client"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="border border-cb-border hover:border-cb-gray px-4 py-2 rounded-md text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function SmallInput({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-cb-gray mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full bg-cb-card border border-cb-border rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-cb-blue"
      />
    </div>
  );
}
