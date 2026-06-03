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

  const availableRoles = industry ? getRolesByIndustry(industry) : [];

  function handlePainPoint(painPoint: string) {
    if (!role) return;
    router.push(`/for/${role}?focus=${painPoint}`);
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
            What industry are you in?
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
            What&apos;s your role?
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
                Request your role
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

      {/* Step 3: Pain point */}
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
          <h3 className="text-3xl font-semibold tracking-tight text-center mb-8">
            What slows you down most?
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {PAIN_POINTS.map((p) => (
              <button
                key={p.value}
                onClick={() => handlePainPoint(p.value)}
                className="text-left px-4 py-3 rounded-xl border border-mn-border hover:border-mn-primary hover:bg-mn-primary/5 transition text-sm font-medium text-mn-text"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
