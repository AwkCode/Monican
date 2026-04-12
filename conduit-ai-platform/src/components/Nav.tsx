import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";

export default async function Nav() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-cb-border bg-cb-bg/80 backdrop-blur sticky top-0 z-10">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          Conduit<span className="text-cb-blue">.AI</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/tools/roi-calculator" className="text-cb-gray hover:text-white">
            ROI Calculator
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-cb-gray hover:text-white">
                Dashboard
              </Link>
              <Link href="/modules" className="text-cb-gray hover:text-white">
                Modules
              </Link>
              <Link href="/profile" className="text-cb-gray hover:text-white">
                Profile
              </Link>
              <Link href="/settings" className="text-cb-gray hover:text-white">
                Settings
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-cb-gray hover:text-white">
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-cb-blue hover:bg-cb-blue-hover text-white font-medium px-3 py-1.5 rounded-md"
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
