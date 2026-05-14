"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-mn-muted mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-mn-bg-subtle border border-mn-border rounded-md px-3 py-2 text-mn-text focus:outline-none focus:border-mn-primary"
        />
      </div>
      <div>
        <label className="block text-sm text-mn-muted mb-1.5">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-mn-bg-subtle border border-mn-border rounded-md px-3 py-2 text-mn-text focus:outline-none focus:border-mn-primary"
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-mn-primary hover:bg-mn-primary-hover disabled:opacity-50 text-white font-medium py-3 rounded-md"
      >
        {loading ? "Logging in..." : "Log in"}
      </button>
      <p className="text-sm text-mn-muted text-center">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-mn-primary hover:text-mn-primary-hover">
          Sign up
        </Link>
      </p>
    </form>
  );
}
