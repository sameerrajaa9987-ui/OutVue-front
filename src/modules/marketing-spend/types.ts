export type MarketingSpend = {
  id: string;
  userId: string;
  platform: string;
  campaignName: string;
  spend: number;
  clicks: number;
  impressions: number;
  leads: number;
  conversions: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateMarketingSpendPayload = Omit<
  MarketingSpend,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export type UpdateMarketingSpendPayload = Partial<CreateMarketingSpendPayload>;

export const MARKETING_PLATFORMS = [
  { value: "meta", label: "Meta (Facebook/Instagram)" },
  { value: "google", label: "Google Ads" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "email", label: "Email Marketing" },
  { value: "seo", label: "SEO" },
  { value: "content", label: "Content Marketing" },
  { value: "social", label: "Organic Social" },
] as const;

export const PLATFORM_COLORS: Record<string, string> = {
  meta: "bg-blue-100 text-blue-800 border-blue-200",
  google: "bg-red-100 text-red-800 border-red-200",
  linkedin: "bg-indigo-100 text-indigo-800 border-indigo-200",
  email: "bg-emerald-100 text-emerald-800 border-emerald-200",
  seo: "bg-purple-100 text-purple-800 border-purple-200",
  content: "bg-amber-100 text-amber-800 border-amber-200",
  social: "bg-cyan-100 text-cyan-800 border-cyan-200",
};

export type MarketingSpendFilters = {
  platform?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
};
