"use client";

import { useState } from "react";

/**
 * Lightweight email capture for visitors not ready to book a demo.
 * Posts to /api/subscribe → email_signups table.
 */
export default function EmailCapture({
  roleSlug,
  roleName,
  context,
}: {
  roleSlug?: string;
  roleName?: string;
  context: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, roleSlug, context }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="text-sm font-medium text-emerald-700 text-center py-3">
        ✓ You&apos;re on the list. We&apos;ll email you when new
        {roleName ? ` ${roleName.toLowerCase()}` : ""} workflows land.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="flex-1 bg-white border border-mn-border rounded-full px-5 py-3 text-sm text-mn-text focus:outline-none focus:border-mn-primary"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-black hover:bg-black/85 disabled:bg-black/40 text-white text-sm font-medium px-6 py-3 rounded-full transition whitespace-nowrap"
      >
        {status === "sending" ? "Adding..." : "Get new workflows"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-600 self-center">Try again?</p>
      )}
    </form>
  );
}
