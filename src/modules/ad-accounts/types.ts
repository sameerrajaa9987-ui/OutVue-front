export type AdAccount = {
  id: string;
  userId: string;
  platform: string;
  accountId: string;
  status: string;
  lastSynced: string | null;
  label: string;
  createdAt: string;
  updatedAt: string;
};

export type ConnectAdAccountPayload = {
  platform: string;
  accountId: string;
  accessToken: string;
  refreshToken?: string;
  label?: string;
};

export type UpdateAdAccountPayload = {
  accessToken?: string;
  refreshToken?: string;
  label?: string;
  status?: "active" | "inactive";
};

export const AD_PLATFORMS = [
  { value: "meta", label: "Meta (Facebook/Instagram)" },
  { value: "google", label: "Google Ads" },
  { value: "linkedin", label: "LinkedIn Ads" },
] as const;

export const PLATFORM_COLORS: Record<string, string> = {
  meta: "bg-blue-100 text-blue-800 border-blue-200",
  google: "bg-red-100 text-red-800 border-red-200",
  linkedin: "bg-indigo-100 text-indigo-800 border-indigo-200",
};

export const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
  error: "bg-red-100 text-red-800 border-red-200",
  expired: "bg-amber-100 text-amber-800 border-amber-200",
};
