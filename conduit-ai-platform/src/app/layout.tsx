import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Monican — The AI workflow library for every role",
    template: "%s — Monican",
  },
  description:
    "Curated AI workflows from n8n, Zapier, GPT Store, Claude Skills, and our own lab — organized by your job. We set them up. You save the hours.",
  icons: {
    icon: "/monican-logo.png",
    apple: "/monican-logo.png",
  },
  openGraph: {
    siteName: "Monican",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-mn-bg text-mn-text min-h-screen`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
