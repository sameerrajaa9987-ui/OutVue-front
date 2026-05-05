export type BusinessProfile = {
  id: string;
  userId: string;
  businessType: string | null;
  industry: string | null;
  businessSize: string | null;
  annualBudgetRange: string | null;
  teamSize: number | null;
  mainObjective: string | null;
  keyRevenueChannels: string[];
  customerAcquisitionMethods: string[];
  preferredReportingPeriod: string;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
};

export const INDUSTRIES = [
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance & Banking" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "real-estate", label: "Real Estate" },
  { value: "legal", label: "Legal" },
  { value: "marketing-agency", label: "Marketing Agency" },
  { value: "consulting", label: "Consulting" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "media", label: "Media & Entertainment" },
  { value: "hospitality", label: "Hospitality" },
  { value: "construction", label: "Construction" },
  { value: "energy", label: "Energy" },
  { value: "other", label: "Other" },
] as const;

export const BUSINESS_SIZES = [
  { value: "solo", label: "Solo / Freelancer" },
  { value: "2-10", label: "2-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "500+", label: "500+ employees" },
] as const;

export const BUDGET_RANGES = [
  { value: "under-10k", label: "Under \u00a310k / year" },
  { value: "10k-50k", label: "\u00a310k - \u00a350k" },
  { value: "50k-100k", label: "\u00a350k - \u00a3100k" },
  { value: "100k-500k", label: "\u00a3100k - \u00a3500k" },
  { value: "500k-1m", label: "\u00a3500k - \u00a31m" },
  { value: "1m+", label: "\u00a31m+" },
] as const;

export const OBJECTIVES = [
  { value: "improve-budget-allocation", label: "Improve budget allocation" },
  { value: "track-bd-activity", label: "Track BD activity & ROI" },
  { value: "measure-event-roi", label: "Measure event ROI" },
  { value: "identify-underperforming-channels", label: "Find underperforming channels" },
  { value: "reduce-cpl", label: "Reduce cost-per-lead" },
  { value: "increase-conversion-rate", label: "Increase conversion rate" },
  { value: "benchmark-against-industry", label: "Benchmark against industry" },
  { value: "other", label: "Other" },
] as const;

export const REVENUE_CHANNELS = [
  "Paid Search (Google)",
  "Paid Social (Meta)",
  "LinkedIn Ads",
  "Email Marketing",
  "SEO / Organic",
  "Content Marketing",
  "Events & Conferences",
  "Referrals",
  "Partnerships",
  "Direct Sales",
  "Other",
] as const;

export const ACQUISITION_METHODS = [
  "Paid Advertising",
  "Content & Inbound",
  "Events & Networking",
  "Referral Programme",
  "Strategic Partnerships",
  "Outbound Sales",
  "PR & Media",
  "Other",
] as const;

export const REPORTING_PERIODS = [
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
] as const;
