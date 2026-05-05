export type OperationalCost = {
  id: string;
  userId: string;
  type: string;
  name: string;
  monthlyCost: number;
  allocation: number;
  period: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateOperationalCostPayload = Omit<
  OperationalCost,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export type UpdateOperationalCostPayload =
  Partial<CreateOperationalCostPayload>;

export const OPERATIONAL_TYPES = [
  { value: "team", label: "Team" },
  { value: "agency", label: "Agency" },
  { value: "freelancer", label: "Freelancer" },
  { value: "software", label: "Software" },
  { value: "consultant", label: "Consultant" },
] as const;

export const OPERATIONAL_TYPE_COLORS: Record<string, string> = {
  team: "bg-teal-100 text-teal-800 border-teal-200",
  agency: "bg-blue-100 text-blue-800 border-blue-200",
  freelancer: "bg-amber-100 text-amber-800 border-amber-200",
  software: "bg-purple-100 text-purple-800 border-purple-200",
  consultant: "bg-rose-100 text-rose-800 border-rose-200",
};

export type OperationalCostFilters = {
  type?: string;
  search?: string;
  period?: string;
};
