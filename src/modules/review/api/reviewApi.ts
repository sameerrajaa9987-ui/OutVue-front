import { http } from "@/shared/api/http";

export type MonthlyReview = {
  period: { year: number; month: number };
  performance: {
    marketing: {
      spend: number;
      leads: number;
      conversions: number;
      cpl: number;
      spendDelta: number;
      leadsDelta: number;
      conversionsDelta: number;
      cplDelta: number;
    };
    bd: {
      cost: number;
      leads: number;
      revenue: number;
      costDelta: number;
      leadsDelta: number;
      revenueDelta: number;
    };
    operationalCost: number;
  };
  recommendations: {
    total: number;
    high: number;
    medium: number;
    topItems: { tag: string; priority: string; suggestedAction: string }[];
  };
  actions: {
    total: number;
    pending: number;
    "in-progress": number;
    completed: number;
  };
  budgetOpportunities: string[];
  emergingInefficiencies: string[];
};

export async function getMonthlyReview(year: number, month: number) {
  const res = await http.get<{ data: MonthlyReview }>("/review/monthly", {
    params: { year, month },
  });
  return res.data.data;
}
