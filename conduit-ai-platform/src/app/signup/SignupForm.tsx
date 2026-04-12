"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      await supabase.from("clients").upsert({
        id: data.user!.id,
        email: data.user!.email!,
        full_name: fullName,
      });
      router.push("/dashboard");
      router.refresh();
    } else {
      setNeedsConfirm(true);
      setLoading(false);
    }
  }

  if (needsConfirm) {
    return (
      <div className="border border-cb-border rounded-lg p-6 bg-cb-card">
        <p className="text-neutral-200">
          Check your email for a confirmation link to activate your account.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Full name" type="text" value={fullName} onChange={setFullName} required />
      <Field label="Email" type="email" value={email} onChange={setEmail} required />
      <Field label="Password" type="password" value={password} onChange={setPassword} required hint="At least 6 characters" />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cb-blue hover:bg-cb-blue-hover disabled:opacity-50 text-white font-medium py-3 rounded-md"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
      <p className="text-sm text-cb-gray text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-cb-blue hover:text-cb-blue-hover">
          Log in
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  required,
  hint,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-cb-gray mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-cb-card border border-cb-border rounded-md px-3 py-2 text-white focus:outline-none focus:border-cb-blue"
      />
      {hint && <p className="text-xs text-neutral-500 mt-1">{hint}</p>}
    </div>
  );
}
