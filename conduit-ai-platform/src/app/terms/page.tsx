import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of Monican.",
};

export default function TermsPage() {
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

      <article className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-semibold tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-mn-muted mb-10">Last updated: June 11, 2026</p>

        <Section title="The service">
          Monican provides (1) a free, browsable library of AI workflow
          descriptions sourced from third-party platforms and our own designs,
          and (2) paid done-for-you setup and support services. By using the
          site or buying a service you agree to these terms.
        </Section>

        <Section title="Third-party platforms">
          Workflows sourced from platforms like n8n, Zapier, Make, OpenAI, or
          Anthropic run on those platforms under their own terms and pricing.
          We don&apos;t control them and aren&apos;t responsible for their
          availability, pricing changes, or behavior. Platform names and
          trademarks belong to their owners; listing a workflow does not imply
          the platform endorses Monican.
        </Section>

        <Section title="Estimates, not guarantees">
          Time-saved and dollar figures shown in the library are estimates
          based on typical volumes for a role, clearly labeled as such. Your
          results depend on your business volume, tools, and follow-through.
          They are not a promise of earnings.
        </Section>

        <Section title="Paid services">
          Scope, deliverables, and timelines for paid setups are agreed before
          work starts. Quick Win engagements carry an it-works guarantee: if
          the delivered workflow doesn&apos;t function as scoped, we&apos;ll
          fix it or refund the fee. Third-party subscription costs are yours
          and billed by those platforms directly.
        </Section>

        <Section title="Your responsibilities">
          You&apos;re responsible for the data you upload (e.g. having the
          right to contact people on your client lists), for reviewing AI
          drafts before sending them, and for complying with laws that apply
          to your outreach (e.g. CAN-SPAM, TCPA, your industry&apos;s
          advertising rules). Monican agents draft — you decide what sends.
        </Section>

        <Section title="Acceptable use">
          No scraping the library for resale, no using the service for spam,
          deception, or anything illegal, and no attempting to access other
          users&apos; data.
        </Section>

        <Section title="Liability">
          The site and library are provided &quot;as is.&quot; To the maximum
          extent permitted by law, Monican&apos;s total liability for any claim
          is limited to the amount you paid us in the 12 months before the
          claim. We&apos;re not liable for indirect or consequential damages,
          or for actions of third-party platforms.
        </Section>

        <Section title="Governing law">
          These terms are governed by the laws of the Commonwealth of
          Massachusetts, USA.
        </Section>

        <Section title="Contact">
          Questions:{" "}
          <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
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
