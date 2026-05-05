export type RevenueData = {
  id: string;
  userId: string;
  source: string;
  leads: number;
  conversions: number;
  dealValue: number;
  recurringRevenue: number;
  period: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateRevenueDataPayload = Omit<
  RevenueData,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export type UpdateRevenueDataPayload = Partial<CreateRevenueDataPayload>;

export type RevenueDataFilters = {
  source?: string;
  search?: string;
  period?: string;
};
