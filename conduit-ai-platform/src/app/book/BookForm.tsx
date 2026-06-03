"use client";

import { useState } from "react";

export default function BookForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("real-estate");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Demo request: ${company || name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nIndustry: ${industry}\n\nNotes:\n${notes}`
    );
    window.location.href = `mailto:daniel@monican.ai?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-white/60 p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 16L14 22L24 10" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold mb-3">Email opened.</h3>
        <p className="text-mn-muted">
          Finish sending in your mail client. I&apos;ll reply within 24 hours
          with a calendar link.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl border border-white/60 p-8 md:p-10"
    >
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
            <option value="real-estate">Real Estate</option>
            <option value="insurance">Insurance</option>
            <option value="mortgage">Mortgage</option>
            <option value="legal">Legal</option>
            <option value="dental">Dental</option>
            <option value="other">Other</option>
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
        className="mt-8 w-full bg-black hover:bg-black/85 text-white font-medium py-4 rounded-full transition"
      >
        Send demo request
      </button>

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
