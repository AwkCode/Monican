export type Industry = {
  slug: string;
  name: string;
  description: string;
};

export type Role = {
  slug: string;
  name: string;
  industrySlug: string;
  description: string;
  searchTerms?: string[];
  aiGenerated?: boolean;
};

export type WorkflowCategory =
  | "Lead gen"
  | "Past clients"
  | "Admin"
  | "Marketing"
  | "Sales"
  | "Operations"
  | "Recall"
  | "Compliance";

export type WorkflowSource =
  | "Monican"
  | "n8n"
  | "Zapier"
  | "Make"
  | "GPT Store"
  | "Claude Skills"
  | "Pipedream"
  | "Anthropic"
  | "OpenAI";

export type Workflow = {
  slug: string;
  roleSlug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  category: WorkflowCategory;
  timePerAction: string; // "Saves 6 min per lead reply" — concrete per-event savings
  hoursSavedWeekly: number;
  dollarsSavedMonthly: number;
  rating: number; // 0-5
  ratingCount: number;
  setupMinutes: number;
  requirements: string[]; // ["Gmail", "Google Sheets"]
  steps: string[]; // ordered description of what it does
  featured?: boolean;
  source: WorkflowSource; // Where this workflow comes from
  sourceUrl?: string; // Deep link to the template on its source platform
  priceModel?: "free" | "paid" | "freemium" | "monican-setup"; // pricing model
};

export type PainPoint =
  | "lead-response"
  | "past-clients"
  | "admin"
  | "marketing"
  | "sales-followup"
  | "intake"
  | "scheduling"
  | "billing"
  | "other";
