import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";

export default async function Nav() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-mn-border bg-white/80 backdrop-blur sticky top-0 z-10">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight text-mn-text">
          <img src="/monican-logo.png" alt="Monican" className="h-8 w-8" />
          Monican
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/tools/roi-calculator" className="text-mn-muted hover:text-mn-text">
            ROI Calculator
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-mn-muted hover:text-mn-text">
                Dashboard
              </Link>
              <Link href="/modules" className="text-mn-muted hover:text-mn-text">
                Modules
              </Link>
              <Link href="/profile" className="text-mn-muted hover:text-mn-text">
                Profile
              </Link>
              <Link href="/settings" className="text-mn-muted hover:text-mn-text">
                Settings
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-mn-muted hover:text-mn-text">
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-mn-primary hover:bg-mn-primary-hover text-white font-medium px-3 py-1.5 rounded-md"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
