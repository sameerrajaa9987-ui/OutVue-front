import { http } from "@/shared/api/http";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  subscription: {
    tier: string;
    status: string;
    billingCycle: string;
    pilotType: string | null;
  } | null;
};

export type MRRData = { mrr: number; activeSubscriptions: number };
export type ARRData = { arr: number };
export type ChurnData = { total: number; cancelled: number; churnRate: number };
export type LTVData = {
  ltv: number;
  avgRevenuePerAccount: number;
  avgLifetimeMonths: number;
};

export type RevenueSummary = {
  totalUsers: number;
  mrr: number;
  arr: number;
  activeSubscriptions: number;
  churnRate: number;
  ltv: number;
  avgRevenuePerAccount: number;
  revenueByTier: {
    tier: string;
    name: string;
    count: number;
    monthlyRevenue: number;
  }[];
  statusBreakdown: { status: string; count: number }[];
  pilotConversion: {
    totalPilots: number;
    convertedPilots: number;
    conversionRate: number;
  };
};

export async function getUsers() {
  const res = await http.get<{ data: AdminUser[] }>("/admin/users");
  return res.data.data;
}

export async function getMRR() {
  const res = await http.get<{ data: MRRData }>("/admin/revenue/mrr");
  return res.data.data;
}

export async function getARR() {
  const res = await http.get<{ data: ARRData }>("/admin/revenue/arr");
  return res.data.data;
}

export async function getChurn() {
  const res = await http.get<{ data: ChurnData }>("/admin/revenue/churn");
  return res.data.data;
}

export async function getLTV() {
  const res = await http.get<{ data: LTVData }>("/admin/revenue/ltv");
  return res.data.data;
}

export async function getRevenueSummary() {
  const res = await http.get<{ data: RevenueSummary }>(
    "/admin/revenue/summary",
  );
  return res.data.data;
}
