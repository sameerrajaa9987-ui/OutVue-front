import { http } from "@/shared/api/http";

export type EntityType = "campaign" | "channel" | "bd-activity";

export type ComparableItem = {
  id: string;
  name: string;
  platform?: string;
  type?: string;
  spend?: number;
  cost?: number;
  leads?: number;
  revenue?: number;
  count?: number;
};

export type CampaignComparison = {
  id: string;
  name: string;
  platform: string;
  spend: number;
  clicks: number;
  impressions: number;
  leads: number;
  conversions: number;
  cpl: number;
  ctr: number;
  cpa: number;
  convRate: number;
};

export type BdComparison = {
  id: string;
  name: string;
  type: string;
  cost: number;
  leads: number;
  opportunities: number;
  revenue: number;
  cpl: number;
  roi: number;
};

export type ComparisonResult = {
  entityType: EntityType;
  items: (CampaignComparison | BdComparison)[];
};

export async function getComparableItems(entityType: EntityType) {
  const res = await http.get<{ data: ComparableItem[] }>(`/compare/items/${entityType}`);
  return res.data.data;
}

export async function compare(entityType: EntityType, ids: string[]) {
  const res = await http.post<{ data: ComparisonResult }>("/compare", { entityType, ids });
  return res.data.data;
}
