import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Monican collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-mn-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg tracking-tight text-mn-text"
          >
            <img src="/monican-logo.png" alt="Monican" className="h-7 w-7" />
            monican.
          </Link>
          <Link href="/" className="text-sm text-mn-muted hover:text-mn-text">
            ← Back home
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-16 prose-headings:font-semibold">
        <h1 className="text-4xl font-semibold tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-mn-muted mb-10">Last updated: June 11, 2026</p>

        <Section title="Who we are">
          Monican (&quot;we&quot;, &quot;us&quot;) is an AI workflow library and
          done-for-you automation service based in Boston, MA. Questions about
          this policy: <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </Section>

        <Section title="What we collect">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Account data</strong> — email, name, and business profile
              details you provide when you create an account.
            </li>
            <li>
              <strong>Demo requests and email signups</strong> — name, email,
              company, industry, and anything you write in the notes field.
            </li>
            <li>
              <strong>Usage analytics</strong> — anonymized page views and
              events via Vercel Analytics (no cross-site tracking cookies), and
              first-party event logs such as which workflows are clicked and
              what roles are searched.
            </li>
            <li>
              <strong>Business data you upload</strong> — for example past
              client lists you import to power a workflow. This data is yours;
              we use it only to run the workflows you activate.
            </li>
          </ul>
        </Section>

        <Section title="Google user data (Gmail)">
          If you connect Gmail, we request <em>draft and modify</em> scopes
          only — our agents create drafts for your review and{" "}
          <strong>never send email on your behalf</strong>. OAuth tokens are
          stored server-side in our database (Supabase) protected by
          row-level security, are never exposed to your browser or other
          users, and are used solely to create drafts in your account. You can
          revoke access at any time from your{" "}
          <a
            className="underline"
            href="https://myaccount.google.com/permissions"
          >
            Google Account permissions
          </a>{" "}
          page or by contacting us. Monican&apos;s use and transfer of
          information received from Google APIs adheres to the{" "}
          <a
            className="underline"
            href="https://developers.google.com/terms/api-services-user-data-policy"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements. We do not sell Google user
          data, use it for advertising, or allow humans to read it except with
          your consent, for security purposes, or as required by law.
        </Section>

        <Section title="How we use your data">
          To respond to demo requests, run the workflows you activate, improve
          the library (e.g. seeing which roles people search for), and email
          you things you asked for. We do <strong>not</strong> sell your data,
          and we don&apos;t share it with third parties except the service
          providers that run our infrastructure (Vercel hosting, Supabase
          database, Anthropic for AI drafting, Resend for email notifications).
        </Section>

        <Section title="AI processing">
          Some features send text to Anthropic&apos;s Claude API — for example
          matching your search query to a role, or drafting an outreach email
          from profile details you provided. We send the minimum needed for
          the feature to work.
        </Section>

        <Section title="Affiliate links">
          Some outbound links to platforms like Zapier, Make, or n8n are
          affiliate links. If you sign up through them we may earn a
          commission at no extra cost to you. Those platforms have their own
          privacy policies.
        </Section>

        <Section title="Retention and deletion">
          We keep your data while your account is active or while needed to
          respond to your request. Email{" "}
          <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>{" "}
          and we&apos;ll delete your account data, uploaded lists, and stored
          tokens within 30 days.
        </Section>

        <Section title="Changes">
          We&apos;ll update this page when the policy changes and adjust the
          date above. Material changes will be flagged on the site.
        </Section>
      </article>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="text-mn-text/80 leading-relaxed text-[15px]">
        {children}
      </div>
    </section>
  );
}
