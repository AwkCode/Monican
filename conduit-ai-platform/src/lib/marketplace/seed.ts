import { Industry, Role, Workflow } from "./types";

export const INDUSTRIES: Industry[] = [
  { slug: "real-estate", name: "Real Estate", description: "Brokers, agents, and property managers" },
  { slug: "insurance", name: "Insurance", description: "Independent agents and brokerages" },
  { slug: "mortgage", name: "Mortgage", description: "Loan officers and brokers" },
  { slug: "legal", name: "Legal", description: "Solo and small law firms" },
  { slug: "dental", name: "Dental", description: "Dental practices and office managers" },
  { slug: "medical", name: "Medical", description: "Private practice and clinics" },
  { slug: "home-services", name: "Home Services", description: "HVAC, plumbing, electrical, roofing, solar" },
  { slug: "aesthetics", name: "Med Spa & Aesthetics", description: "Owners, injectors, and providers" },
  { slug: "financial-advisors", name: "Financial Advisors", description: "Wealth managers and RIAs" },
  { slug: "marketing-agencies", name: "Marketing Agencies", description: "Small to mid-size agencies" },
  { slug: "coaches-consultants", name: "Coaches & Consultants", description: "Solo experts and small firms" },
  { slug: "saas-startups", name: "SaaS & Startups", description: "Founders, ops, and CS teams" },
  { slug: "ecommerce", name: "Ecommerce", description: "DTC brands and Shopify operators" },
  { slug: "education", name: "Education", description: "Tutors, course creators, and schools" },
  { slug: "nonprofits", name: "Nonprofits", description: "Small to mid-size nonprofits" },
  { slug: "other", name: "Other", description: "Tell us your industry" },
];

export const ROLES: Role[] = [
  // Real Estate
  { slug: "real-estate-agent", name: "Real Estate Agent", industrySlug: "real-estate",
    description: "Residential or commercial agent working leads and closing deals",
    searchTerms: ["realtor", "agent", "re agent"] },
  { slug: "real-estate-broker", name: "Real Estate Broker / Owner", industrySlug: "real-estate",
    description: "Brokerage owner managing a team of agents",
    searchTerms: ["broker", "brokerage owner"] },
  { slug: "property-manager", name: "Property Manager", industrySlug: "real-estate",
    description: "Manages residential or commercial rentals",
    searchTerms: ["property mgr", "landlord"] },

  // Insurance
  { slug: "insurance-agent", name: "Insurance Agent", industrySlug: "insurance",
    description: "Independent or captive agent selling personal/commercial lines",
    searchTerms: ["p&c agent", "life agent"] },
  { slug: "insurance-broker", name: "Insurance Broker", industrySlug: "insurance",
    description: "Independent broker placing risk across carriers" },

  // Mortgage
  { slug: "mortgage-loan-officer", name: "Mortgage Loan Officer", industrySlug: "mortgage",
    description: "Originates residential mortgages",
    searchTerms: ["lo", "mlo", "loan officer"] },

  // Legal
  { slug: "solo-attorney", name: "Solo Attorney", industrySlug: "legal",
    description: "Single-shingle lawyer running a small practice" },
  { slug: "personal-injury-attorney", name: "Personal Injury Attorney", industrySlug: "legal",
    description: "PI law firm handling auto, slip-and-fall, and similar cases" },

  // Dental
  { slug: "dental-office-manager", name: "Dental Office Manager", industrySlug: "dental",
    description: "Runs day-to-day operations of a dental practice" },
  { slug: "dentist", name: "Dentist (Owner)", industrySlug: "dental",
    description: "Practice owner balancing chair time and ops" },

  // Medical
  { slug: "private-practice-physician", name: "Private Practice Physician", industrySlug: "medical",
    description: "Solo or small group practice owner" },

  // Home services
  { slug: "hvac-contractor", name: "HVAC Contractor", industrySlug: "home-services",
    description: "Residential HVAC service and install" },
  { slug: "roofing-contractor", name: "Roofing Contractor", industrySlug: "home-services",
    description: "Residential or commercial roofing" },
  { slug: "solar-installer", name: "Solar Installer", industrySlug: "home-services",
    description: "Residential solar sales and install" },

  // Aesthetics
  { slug: "med-spa-owner", name: "Med Spa Owner", industrySlug: "aesthetics",
    description: "Owner-operator of a medical spa or aesthetic clinic" },

  // Financial advisors
  { slug: "financial-advisor", name: "Financial Advisor", industrySlug: "financial-advisors",
    description: "Wealth manager or RIA serving HNW clients" },

  // Marketing agencies
  { slug: "agency-owner", name: "Marketing Agency Owner", industrySlug: "marketing-agencies",
    description: "Owns and runs a small to mid-size agency" },

  // Coaches
  { slug: "coach-consultant", name: "Coach / Consultant", industrySlug: "coaches-consultants",
    description: "Solo expert delivering 1:1 or group programs" },

  // SaaS
  { slug: "saas-founder", name: "SaaS Founder", industrySlug: "saas-startups",
    description: "Early-stage founder wearing every hat" },
  { slug: "customer-success-lead", name: "Customer Success Lead", industrySlug: "saas-startups",
    description: "Runs CS for an early-stage SaaS" },

  // Ecommerce
  { slug: "ecommerce-owner", name: "Ecommerce Owner", industrySlug: "ecommerce",
    description: "DTC brand operator on Shopify or similar" },
];

export const WORKFLOWS: Workflow[] = [
  // ============ REAL ESTATE AGENT ============
  {
    slug: "lead-responder",
    roleSlug: "real-estate-agent",
    name: "2-Minute Lead Responder",
    tagline: "Reply to every Zillow & web lead in under 2 minutes — in your voice.",
    description:
      "Monitors your Gmail and Zillow inbox 24/7. Drafts a personalized first response in your voice and tone within 90 seconds. You approve, they hit send.",
    longDescription:
      "Most leads go to the agent who replies first. This workflow watches every lead source — Zillow, Realtor.com, your website forms, IDX inquiries — and uses Claude to draft a personalized first response that sounds like you wrote it. Drafts land in your Gmail Drafts folder. You glance, hit send. Average reply time drops from 4 hours to under 2 minutes.",
    category: "Lead gen",
    hoursSavedWeekly: 8,
    dollarsSavedMonthly: 2400,
    rating: 4.9,
    ratingCount: 47,
    setupMinutes: 10,
    requirements: ["Gmail", "Zillow Premier Agent (optional)", "Google Sheets"],
    steps: [
      "Watches your Gmail and Zillow inbox in real time",
      "Detects new lead inquiries using subject patterns + sender filters",
      "Pulls the property address, lead name, and source",
      "Generates a personalized reply using your past responses as voice training",
      "Drops the draft in Gmail Drafts and pings you on Slack",
      "Logs every lead to a Google Sheet for tracking",
    ],
    featured: true,
  },
  {
    slug: "past-client-reactivator",
    roleSlug: "real-estate-agent",
    name: "Past Client Reactivator",
    tagline: "Weekly check-ins with past clients. Birthdays, home anniversaries, market updates.",
    description:
      "Keeps your book of business warm without you remembering anything. Auto-drafts personalized check-in emails every Monday based on milestones, birthdays, and home anniversaries.",
    longDescription:
      "Your past clients are your highest-LTV source of referrals — but most go cold within 18 months. This workflow scans your client database every Monday morning. It identifies who's having a birthday this week, whose home anniversary is coming up, and whose market has shifted (price changes, new comps). Drafts a personalized email for each, you approve and send in 5 minutes flat.",
    category: "Past clients",
    hoursSavedWeekly: 4,
    dollarsSavedMonthly: 1800,
    rating: 4.8,
    ratingCount: 32,
    setupMinutes: 15,
    requirements: ["Gmail", "Google Sheets (client list)", "Public records API"],
    steps: [
      "Reads your past client list from Google Sheets",
      "Cross-references birthdays and home-purchase anniversaries",
      "Pulls market data for each client's home address",
      "Generates a custom check-in email for each (3-5 sentences, personal)",
      "Lands every draft in Gmail Monday at 8am",
      "Tracks who opened, replied, or scheduled a call",
    ],
    featured: true,
  },
  {
    slug: "signal-engine",
    roleSlug: "real-estate-agent",
    name: "Signal Engine",
    tagline: "Spot listing opportunities 60 days before your competition.",
    description:
      "Monitors public records in your farm area for ownership changes, life events, and seller signals. Surfaces high-intent leads weekly.",
    longDescription:
      "By the time a 'For Sale by Owner' sign goes up, you're already late. This workflow watches public records and life-event signals in your farm — divorces filed, death certificates, new mortgages, expired listings, code violations, tax delinquencies. Each signal is scored 1-10 for sell intent. You get a weekly digest of the top 30 with suggested outreach.",
    category: "Lead gen",
    hoursSavedWeekly: 6,
    dollarsSavedMonthly: 4500,
    rating: 4.7,
    ratingCount: 28,
    setupMinutes: 20,
    requirements: ["County records access", "Gmail", "Google Sheets"],
    steps: [
      "Scrapes county records weekly for your farm ZIPs",
      "Detects divorce filings, deaths, code violations, expired listings",
      "Scores each signal 1-10 for seller intent",
      "Drafts a tailored outreach letter for the top 30",
      "Delivers a Monday digest with addresses, signals, and draft letters",
      "Auto-archives signals after 90 days",
    ],
    featured: true,
  },
  {
    slug: "listing-description-writer",
    roleSlug: "real-estate-agent",
    name: "Listing Description Writer",
    tagline: "Turn property notes into Realtor.com-ready listing copy in 30 seconds.",
    description:
      "Paste photos and bullet notes. Get back polished MLS description, social media captions, and email blast copy.",
    longDescription:
      "Listing descriptions are tedious. This workflow takes your raw notes — square footage, bedrooms, features, neighborhood — and outputs MLS-compliant descriptions in multiple lengths. Plus matching Instagram captions, an email blast, and a Facebook post. All in your tone of voice.",
    category: "Marketing",
    hoursSavedWeekly: 3,
    dollarsSavedMonthly: 600,
    rating: 4.6,
    ratingCount: 19,
    setupMinutes: 5,
    requirements: ["Web app (no install)"],
    steps: [
      "Drop in photos and a few bullet points",
      "Claude generates MLS-compliant description (long + short)",
      "Generates 3 Instagram caption variants",
      "Generates a 'just listed' email blast",
      "Generates a Facebook marketplace post",
      "Exports all copy in one click",
    ],
  },
  {
    slug: "open-house-followup",
    roleSlug: "real-estate-agent",
    name: "Open House Auto-Follow-up",
    tagline: "Every open house attendee gets a personalized thank-you in 24 hours.",
    description:
      "Upload your open-house sign-in sheet. Each attendee gets a personalized follow-up email referencing the specific property within 24 hours.",
    longDescription:
      "Open house follow-up is where most agents lose deals. This workflow ingests your sign-in sheet (paper photo or digital) and within 24 hours sends each attendee a personalized email — references the property, asks one specific question, suggests a similar listing if appropriate. You approve each draft before send.",
    category: "Lead gen",
    hoursSavedWeekly: 2,
    dollarsSavedMonthly: 1200,
    rating: 4.7,
    ratingCount: 22,
    setupMinutes: 8,
    requirements: ["Gmail", "Phone camera"],
    steps: [
      "Snap a photo of your open house sign-in sheet",
      "OCR extracts names, emails, phone numbers",
      "Each attendee gets a personalized email draft",
      "Drafts reference the property they viewed",
      "Sent within 24 hours (you approve each)",
      "Adds attendees to your past-client CRM",
    ],
  },
];

// Helpers
export function getIndustryBySlug(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}

export function getRoleBySlug(slug: string): Role | undefined {
  return ROLES.find((r) => r.slug === slug);
}

export function getRolesByIndustry(industrySlug: string): Role[] {
  return ROLES.filter((r) => r.industrySlug === industrySlug);
}

export function getWorkflowsForRole(roleSlug: string): Workflow[] {
  return WORKFLOWS.filter((w) => w.roleSlug === roleSlug);
}

export function getWorkflow(roleSlug: string, workflowSlug: string): Workflow | undefined {
  return WORKFLOWS.find((w) => w.roleSlug === roleSlug && w.slug === workflowSlug);
}
