"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Initial = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  business_name: string;
  business_address: string;
  role: string;
  towns_served: string;
  school_district: string;
  years_in_business: number | null;
  voice_sample: string;
  signature_block: string;
};

export default function ProfileForm({ initial }: { initial: Initial }) {
  const [state, setState] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Initial>(key: K, value: Initial[K]) {
    setState((s) => ({ ...s, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const towns = state.towns_served
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const { error: upsertError } = await supabase.from("clients").upsert({
      id: state.id,
      email: state.email,
      full_name: state.full_name || null,
      phone: state.phone || null,
      business_name: state.business_name || null,
      business_address: state.business_address || null,
      role: state.role || null,
      towns_served: towns.length ? towns : null,
      school_district: state.school_district || null,
      years_in_business: state.years_in_business ?? null,
      voice_sample: state.voice_sample || null,
      signature_block: state.signature_block || null,
      updated_at: new Date().toISOString(),
    });

    if (upsertError) {
      setError(upsertError.message);
    } else {
      setSaved(true);
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Section title="Personal">
        <Input label="Full name" value={state.full_name} onChange={(v) => set("full_name", v)} />
        <Input label="Phone" value={state.phone} onChange={(v) => set("phone", v)} />
      </Section>

      <Section title="Business">
        <Input
          label="Business name / brokerage"
          value={state.business_name}
          onChange={(v) => set("business_name", v)}
        />
        <Input
          label="Business address"
          value={state.business_address}
          onChange={(v) => set("business_address", v)}
        />
        <Input label="Role (e.g. Broker, Agent)" value={state.role} onChange={(v) => set("role", v)} />
        <Input
          label="Towns served (comma-separated)"
          value={state.towns_served}
          onChange={(v) => set("towns_served", v)}
        />
        <Input
          label="School district"
          value={state.school_district}
          onChange={(v) => set("school_district", v)}
        />
        <Input
          label="Years in business"
          type="number"
          value={state.years_in_business?.toString() ?? ""}
          onChange={(v) => set("years_in_business", v ? parseInt(v) : null)}
        />
      </Section>

      <Section title="Voice">
        <Textarea
          label="Voice sample"
          hint="Paste 2-3 emails you've sent. Your agents will learn your voice from this."
          value={state.voice_sample}
          onChange={(v) => set("voice_sample", v)}
          rows={8}
        />
        <Textarea
          label="Email signature block"
          value={state.signature_block}
          onChange={(v) => set("signature_block", v)}
          rows={4}
        />
      </Section>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {saved && <p className="text-green-400 text-sm">Saved.</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-cb-blue hover:bg-cb-blue-hover disabled:opacity-50 text-white font-medium px-6 py-3 rounded-md"
      >
        {saving ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-cb-border rounded-lg p-6 bg-cb-card space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-cb-gray mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-cb-bg border border-cb-border rounded-md px-3 py-2 text-white focus:outline-none focus:border-cb-blue"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  hint,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm text-cb-gray mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-cb-bg border border-cb-border rounded-md px-3 py-2 text-white focus:outline-none focus:border-cb-blue font-mono text-sm"
      />
      {hint && <p className="text-xs text-neutral-500 mt-1">{hint}</p>}
    </div>
  );
}
