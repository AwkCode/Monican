import Link from "next/link";
import { Suspense } from "react";
import BookForm from "./BookForm";
import { CONTACT_EMAIL } from "@/lib/site";

export default function BookDemoPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-orange-100 via-orange-50 to-white">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-rose-200/30 blur-3xl pointer-events-none" />

      {/* Top nav */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-2xl tracking-tight text-mn-text">
            <img src="/monican-logo.png" alt="Monican" className="h-8 w-8" />
            monican.
          </Link>
          <Link
            href="/"
            className="rounded-full bg-white/60 hover:bg-white/80 backdrop-blur border border-white/60 px-5 py-2 text-sm font-medium text-mn-text transition"
          >
            &larr; Back home
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-16 items-start">
        {/* Left — copy */}
        <div>
          <p className="text-mn-primary font-semibold tracking-wide uppercase text-xs mb-5">
            Book a demo
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05] mb-6">
            See your AI workflows in 15 minutes.
          </h1>
          <p className="text-lg text-mn-text/70 leading-relaxed mb-10 max-w-md">
            I&apos;ll walk you through the workflows that fit your role — live,
            on your screen, with your actual data.
          </p>

          <div className="space-y-5">
            <Bullet>15-minute screen-share demo</Bullet>
            <Bullet>Custom setup for your industry</Bullet>
            <Bullet>30-day free pilot if it&apos;s a fit</Bullet>
            <Bullet>No sales script. Just a real conversation.</Bullet>
          </div>

          <div className="mt-12 pt-8 border-t border-mn-border/60">
            <p className="text-sm text-mn-muted">
              Prefer email? Reach me at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-mn-text font-medium hover:text-mn-primary"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>

        {/* Right — form */}
        <Suspense fallback={null}>
          <BookForm />
        </Suspense>
      </div>
    </main>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 w-5 h-5 rounded-full bg-mn-primary/15 flex items-center justify-center flex-shrink-0">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#E8603C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="text-mn-text/80">{children}</span>
    </div>
  );
}
