import { http } from "@/shared/api/http";

export type DashboardSummary = {
  totalGrowthSpend: number;
  totalMarketingSpend: number;
  totalBDSpend: number;
  totalOperationalCost: number;
  totalLeads: number;
  totalConversions: number;
  avgCPL: number;
  avgCPA: number;
  blendedROI: number | null;
  blendedCTR: number | null;
  totalCampaigns: number;
  bestChannel: string | null;
  worstChannel: string | null;
  platformBreakdown: {
    platform: string;
    spend: number;
    leads: number;
    clicks: number;
    impressions: number;
    cpl: number | null;
    ctr: number | null;
  }[];
  channelBreakdown: {
    channel: string;
    spend: number;
    leads: number;
    roi: number;
  }[];
};

export type TrendPoint = {
  date: string;
  spend: number;
  leads: number;
  conversions: number;
  clicks: number;
  impressions: number;
};

export type BdSummary = {
  totals: {
    count: number;
    totalCost: number;
    totalLeads: number;
    totalOpportunities: number;
    totalRevenue: number;
  };
  byType: {
    type: string;
    count: number;
    cost: number;
    leads: number;
    opportunities: number;
    revenue: number;
    roi: number;
  }[];
};

export type CostBreakdown = {
  totals: {
    count: number;
    totalMonthlyCost: number;
    totalEffectiveCost: number;
  };
  byType: {
    type: string;
    count: number;
    monthlyCost: number;
    effectiveCost: number;
    avgAllocation: number;
  }[];
};

type SummaryParams = {
  startDate?: string;
  endDate?: string;
  platform?: string;
};

export async function getSummary(params?: SummaryParams) {
  const res = await http.get<{ data: DashboardSummary }>("/dashboard/summary", {
    params,
  });
  return res.data.data;
}

export async function getTrends(params?: {
  startDate?: string;
  endDate?: string;
}) {
  const res = await http.get<{ data: TrendPoint[] }>("/dashboard/trends", {
    params,
  });
  return res.data.data;
}

export async function getBdSummary() {
  const res = await http.get<{ data: BdSummary }>("/dashboard/bd-summary");
  return res.data.data;
}

export async function getCostBreakdown() {
  const res = await http.get<{ data: CostBreakdown }>(
    "/dashboard/cost-breakdown",
  );
  return res.data.data;
}
