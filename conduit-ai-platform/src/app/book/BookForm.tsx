"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CONTACT_EMAIL } from "@/lib/site";

const INDUSTRY_OPTIONS = [
  ["real-estate", "Real Estate"],
  ["insurance", "Insurance"],
  ["mortgage", "Mortgage"],
  ["legal", "Legal"],
  ["dental", "Dental"],
  ["medical", "Medical"],
  ["home-services", "Home Services (HVAC, plumbing, roofing...)"],
  ["accounting", "Accounting & Bookkeeping"],
  ["restaurants", "Restaurants & Hospitality"],
  ["construction", "Construction"],
  ["automotive", "Automotive"],
  ["fitness", "Fitness & Wellness"],
  ["salons", "Salons & Beauty"],
  ["sales-revenue", "Sales & Revenue Teams"],
  ["marketing-agencies", "Marketing & Agencies"],
  ["saas-startups", "SaaS & Startups"],
  ["other", "Other"],
] as const;

export default function BookForm() {
  const searchParams = useSearchParams();
  const roleSlug = searchParams.get("role") || "";
  const workflowSlug = searchParams.get("workflow") || "";
  const missingRole = searchParams.get("missing-role") || "";

  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("real-estate");
  const [notes, setNotes] = useState(
    missingRole ? `My role: ${missingRole}` : ""
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/demo-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          industry,
          notes,
          roleSlug,
          workflowSlug,
          missingRole,
        }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-white/60 p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 16L14 22L24 10" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold mb-3">Request received.</h3>
        <p className="text-mn-muted">
          I&apos;ll reply within 24 hours with a calendar link. If it&apos;s
          urgent, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-mn-text font-medium">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl border border-white/60 p-8 md:p-10"
    >
      {(workflowSlug || roleSlug || missingRole) && (
        <div className="mb-6 bg-mn-primary/10 text-mn-primary text-sm font-medium px-4 py-3 rounded-xl">
          {workflowSlug
            ? `Asking about: ${workflowSlug.replace(/-/g, " ")}`
            : missingRole
              ? `Requesting workflows for: ${missingRole}`
              : `Asking about workflows for: ${roleSlug.replace(/-/g, " ")}`}
        </div>
      )}

      <div className="space-y-5">
        <Field label="Your name">
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Smith"
            className="w-full bg-mn-bg-subtle border border-mn-border rounded-lg px-4 py-3 text-mn-text focus:outline-none focus:border-mn-primary"
          />
        </Field>

        <Field label="Work email">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@brokerage.com"
            className="w-full bg-mn-bg-subtle border border-mn-border rounded-lg px-4 py-3 text-mn-text focus:outline-none focus:border-mn-primary"
          />
        </Field>

        <Field label="Company">
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Smith Real Estate Group"
            className="w-full bg-mn-bg-subtle border border-mn-border rounded-lg px-4 py-3 text-mn-text focus:outline-none focus:border-mn-primary"
          />
        </Field>

        <Field label="Industry">
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full bg-mn-bg-subtle border border-mn-border rounded-lg px-4 py-3 text-mn-text focus:outline-none focus:border-mn-primary"
          >
            {INDUSTRY_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="What would success look like? (optional)">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Cut my lead response time, keep my past clients warm..."
            rows={3}
            className="w-full bg-mn-bg-subtle border border-mn-border rounded-lg px-4 py-3 text-mn-text focus:outline-none focus:border-mn-primary resize-none"
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-8 w-full bg-black hover:bg-black/85 disabled:bg-black/40 text-white font-medium py-4 rounded-full transition"
      >
        {status === "sending" ? "Sending..." : "Send demo request"}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-600 text-center mt-4">
          Something went wrong on our end. Email me directly at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline font-medium">
            {CONTACT_EMAIL}
          </a>{" "}
          and I&apos;ll get right back to you.
        </p>
      )}

      <p className="text-xs text-mn-muted text-center mt-4">
        No spam. No newsletter. I reply personally.
      </p>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-mn-text mb-2 block">
        {label}
      </span>
      {children}
    </label>
  );
}
