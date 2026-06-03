"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { INDUSTRIES, getRolesByIndustry } from "@/lib/marketplace/seed";

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

export default function DiscoveryWizard() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [industry, setIndustry] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [painPoints, setPainPoints] = useState<string[]>([]);

  const availableRoles = industry ? getRolesByIndustry(industry) : [];

  function togglePainPoint(value: string) {
    setPainPoints((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  }

  function submitPainPoints() {
    if (!role || painPoints.length === 0) return;
    const focus = painPoints.join(",");
    router.push(`/for/${role}?focus=${focus}`);
  }

  return (
    <div className="bg-white/80 backdrop-blur border border-white/60 rounded-3xl shadow-xl p-8 md:p-10 max-w-2xl mx-auto">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((n) => (
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

      {/* Step 1: Industry */}
      {step === 1 && (
        <div>
          <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-3 text-center">
            Step 1 of 3
          </p>
          <h3 className="text-3xl font-semibold tracking-tight text-center mb-8">
            What industry?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind.slug}
                onClick={() => {
                  setIndustry(ind.slug);
                  setStep(2);
                }}
                className="text-left px-4 py-3 rounded-xl border border-mn-border hover:border-mn-primary hover:bg-mn-primary/5 transition text-sm font-medium text-mn-text"
              >
                {ind.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Role */}
      {step === 2 && (
        <div>
          <button
            onClick={() => setStep(1)}
            className="text-mn-muted hover:text-mn-text text-sm mb-4 inline-flex items-center gap-1"
          >
            ← Back
          </button>
          <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-3 text-center">
            Step 2 of 3
          </p>
          <h3 className="text-3xl font-semibold tracking-tight text-center mb-8">
            What role?
          </h3>
          {availableRoles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-mn-muted mb-6">
                We don&apos;t have specific roles for this industry yet. Tell us
                what you do and we&apos;ll build it for you.
              </p>
              <a
                href="/book"
                className="inline-block bg-black hover:bg-black/85 text-white px-6 py-3 rounded-full font-medium"
              >
                Request a role
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {availableRoles.map((r) => (
                <button
                  key={r.slug}
                  onClick={() => {
                    setRole(r.slug);
                    setStep(3);
                  }}
                  className="text-left px-4 py-4 rounded-xl border border-mn-border hover:border-mn-primary hover:bg-mn-primary/5 transition"
                >
                  <div className="font-semibold text-mn-text text-sm mb-1">
                    {r.name}
                  </div>
                  <div className="text-xs text-mn-muted line-clamp-2">
                    {r.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Pain points — multi-select */}
      {step === 3 && (
        <div>
          <button
            onClick={() => setStep(2)}
            className="text-mn-muted hover:text-mn-text text-sm mb-4 inline-flex items-center gap-1"
          >
            ← Back
          </button>
          <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-3 text-center">
            Step 3 of 3
          </p>
          <h3 className="text-3xl font-semibold tracking-tight text-center mb-2">
            What slows you down?
          </h3>
          <p className="text-mn-muted text-sm text-center mb-8">
            Select all that apply.
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
