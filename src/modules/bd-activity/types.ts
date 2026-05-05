export type BdActivity = {
  id: string;
  userId: string;
  type: string;
  name: string;
  cost: number;
  date: string;
  leadsGenerated: number;
  opportunitiesCreated: number;
  revenueConverted: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateBdActivityPayload = Omit<
  BdActivity,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export type UpdateBdActivityPayload = Partial<CreateBdActivityPayload>;

export const BD_TYPES = [
  { value: "event", label: "Event" },
  { value: "networking", label: "Networking" },
  { value: "partnership", label: "Partnership" },
  { value: "referral", label: "Referral" },
  { value: "sponsorship", label: "Sponsorship" },
] as const;

export const BD_TYPE_COLORS: Record<string, string> = {
  event: "bg-violet-100 text-violet-800 border-violet-200",
  networking: "bg-sky-100 text-sky-800 border-sky-200",
  partnership: "bg-emerald-100 text-emerald-800 border-emerald-200",
  referral: "bg-orange-100 text-orange-800 border-orange-200",
  sponsorship: "bg-pink-100 text-pink-800 border-pink-200",
};

export type BdActivityFilters = {
  type?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
};
