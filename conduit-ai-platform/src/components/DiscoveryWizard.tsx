"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { INDUSTRIES, ROLES, getIndustryBySlug } from "@/lib/marketplace/seed";

const PAIN_POINTS = [
  { value: "lead-response", label: "Responding to leads" },
  { value: "past-clients", label: "Staying in touch with past clients" },
  { value: "admin", label: "Admin & paperwork" },
  { value: "marketing", label: "Marketing & content" },
  { value: "sales-followup", label: "Sales follow-up" },
  { value: "scheduling", label: "Scheduling & no-shows" },
  { value: "billing", label: "Billing & collections" },
  { value: "other", label: "Something else" },
];

type Match = {
  type: "role";
  roleSlug: string;
  roleName: string;
  industryName: string;
  description: string;
  score: number;
};

function scoreMatch(query: string, candidate: string): number {
  const q = query.toLowerCase().trim();
  const c = candidate.toLowerCase();
  if (!q) return 0;
  if (c === q) return 100;
  if (c.startsWith(q)) return 80;
  if (c.includes(q)) return 60;
  // word-boundary match
  const words = c.split(/\W+/);
  if (words.some((w) => w.startsWith(q))) return 50;
  return 0;
}

export default function DiscoveryWizard() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [query, setQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<{
    slug: string;
    name: string;
  } | null>(null);
  const [painPoints, setPainPoints] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Compute search matches
  const matches = useMemo<Match[]>(() => {
    if (!query.trim()) return [];

    const results: Match[] = [];

    for (const r of ROLES) {
      const industry = getIndustryBySlug(r.industrySlug);
      const industryName = industry?.name || "";

      // Score across role name, industry name, search terms
      const nameScore = scoreMatch(query, r.name);
      const industryScore = scoreMatch(query, industryName);
      const termScore = Math.max(
        0,
        ...(r.searchTerms || []).map((t) => scoreMatch(query, t))
      );
      const score = Math.max(nameScore, industryScore * 0.7, termScore * 0.9);

      if (score > 0) {
        results.push({
          type: "role",
          roleSlug: r.slug,
          roleName: r.name,
          industryName,
          description: r.description,
          score,
        });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, 6);
  }, [query]);

  function togglePainPoint(value: string) {
    setPainPoints((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  }

  function pickRole(slug: string, name: string) {
    setSelectedRole({ slug, name });
    setStep(2);
  }

  function submitPainPoints() {
    if (!selectedRole || painPoints.length === 0) return;
    const focus = painPoints.join(",");
    router.push(`/for/${selectedRole.slug}?focus=${focus}`);
  }

  function requestMissingRole() {
    const q = encodeURIComponent(query);
    router.push(`/book?missing-role=${q}`);
  }

  // Focus search on mount
  useEffect(() => {
    if (step === 1 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  return (
    <div className="bg-white/80 backdrop-blur border border-white/60 rounded-3xl shadow-xl p-8 md:p-10 max-w-2xl mx-auto">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2].map((n) => (
          <div
            key={n}
            className={`h-1.5 rounded-full transition-all ${
              n === step
                ? "w-8 bg-mn-primary"
                : n < step
                  ? "w-4 bg-mn-primary/60"
                  : "w-4 bg-mn-border"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Search for role / industry */}
      {step === 1 && (
        <div>
          <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-3 text-center">
            Step 1 of 2
          </p>
          <h3 className="text-3xl font-semibold tracking-tight text-center mb-2">
            What&apos;s your job?
          </h3>
          <p className="text-mn-muted text-sm text-center mb-6">
            Type your role, industry, or what you do.
          </p>

          {/* Search input */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. real estate agent, veterinarian, accountant…"
              className="w-full bg-white border-2 border-mn-border focus:border-mn-primary rounded-xl px-5 py-4 text-mn-text placeholder:text-mn-muted/60 text-base focus:outline-none transition"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mn-muted hover:text-mn-text w-7 h-7 rounded-full hover:bg-mn-bg-subtle flex items-center justify-center"
                aria-label="Clear"
              >
                ×
              </button>
            )}
          </div>

          {/* Matches dropdown */}
          {query.trim().length > 0 && (
            <div className="mt-3 space-y-1">
              {matches.length > 0 ? (
                <>
                  <p className="text-xs uppercase tracking-wide text-mn-muted px-2 mb-2">
                    {matches.length} match{matches.length === 1 ? "" : "es"}
                  </p>
                  {matches.map((m) => (
                    <button
                      key={m.roleSlug}
                      onClick={() => pickRole(m.roleSlug, m.roleName)}
                      className="w-full text-left px-4 py-3 rounded-xl border border-mn-border hover:border-mn-primary hover:bg-mn-primary/5 transition flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-mn-text text-sm mb-0.5">
                          {m.roleName}
                        </div>
                        <div className="text-xs text-mn-muted line-clamp-1">
                          {m.industryName} · {m.description}
                        </div>
                      </div>
                      <span className="text-mn-muted text-lg flex-shrink-0">
                        →
                      </span>
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-4 py-6 rounded-xl border border-dashed border-mn-border text-center">
                  <p className="text-sm text-mn-muted mb-3">
                    We don&apos;t have <span className="font-semibold text-mn-text">{query}</span> in our library yet.
                  </p>
                  <button
                    onClick={requestMissingRole}
                    className="inline-block bg-black hover:bg-black/85 text-white px-5 py-2.5 rounded-full text-sm font-medium"
                  >
                    Add &quot;{query}&quot; to the queue
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Empty state — show popular roles */}
          {!query.trim() && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wide text-mn-muted mb-3">
                Popular jobs
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  ["Real Estate Agent", "real-estate-agent"],
                  ["SaaS Founder", "saas-founder"],
                  ["Insurance Agent", "insurance-agent"],
                  ["Solo Attorney", "solo-attorney"],
                  ["Med Spa Owner", "med-spa-owner"],
                  ["Mortgage Loan Officer", "mortgage-loan-officer"],
                  ["Marketing Agency Owner", "agency-owner"],
                ].map(([name, slug]) => (
                  <button
                    key={slug}
                    onClick={() => pickRole(slug, name)}
                    className="text-sm bg-white border border-mn-border hover:border-mn-primary text-mn-text px-3 py-1.5 rounded-full transition"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Pain points multi-select */}
      {step === 2 && selectedRole && (
        <div>
          <button
            onClick={() => setStep(1)}
            className="text-mn-muted hover:text-mn-text text-sm mb-4 inline-flex items-center gap-1"
          >
            ← Back
          </button>
          <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-3 text-center">
            Step 2 of 2
          </p>
          <h3 className="text-3xl font-semibold tracking-tight text-center mb-2">
            What slows you down?
          </h3>
          <p className="text-mn-muted text-sm text-center mb-6">
            Select all that apply. We&apos;ll surface workflows that fix these.
          </p>

          <p className="text-xs text-center text-mn-muted mb-6">
            Showing workflows for{" "}
            <span className="font-semibold text-mn-text">
              {selectedRole.name}
            </span>
          </p>

          <div className="grid grid-cols-2 gap-2 mb-6">
            {PAIN_POINTS.map((p) => {
              const selected = painPoints.includes(p.value);
              return (
                <button
                  key={p.value}
                  onClick={() => togglePainPoint(p.value)}
                  className={`relative text-left px-4 py-3 rounded-xl border transition text-sm font-medium ${
                    selected
                      ? "border-mn-primary bg-mn-primary/10 text-mn-text"
                      : "border-mn-border text-mn-text hover:border-mn-primary/40 hover:bg-mn-primary/5"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center transition flex-shrink-0 ${
                        selected
                          ? "bg-mn-primary border-mn-primary"
                          : "border-mn-border"
                      }`}
                    >
                      {selected && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.5 5L4 7.5L8.5 2.5"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span>{p.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <button
            onClick={submitPainPoints}
            disabled={painPoints.length === 0}
            className="w-full bg-black hover:bg-black/85 disabled:bg-mn-border disabled:cursor-not-allowed text-white font-medium py-3 rounded-full transition"
          >
            {painPoints.length === 0
              ? "Pick at least one"
              : `See workflows (${painPoints.length} selected)`}
          </button>
        </div>
      )}
    </div>
  );
}
