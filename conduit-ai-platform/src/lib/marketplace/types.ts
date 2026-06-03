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

export type Workflow = {
  slug: string;
  roleSlug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  category: WorkflowCategory;
  hoursSavedWeekly: number;
  dollarsSavedMonthly: number;
  rating: number; // 0-5
  ratingCount: number;
  setupMinutes: number;
  requirements: string[]; // ["Gmail", "Google Sheets"]
  steps: string[]; // ordered description of what it does
  featured?: boolean;
  aiGenerated?: boolean;
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
