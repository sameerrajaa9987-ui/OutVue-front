import { http } from "@/shared/api/http";

export type EcosystemEntry = {
  id: string;
  activityType: string;
  name: string;
  description: string;
  date: string;
  cost: number;
  leadsGenerated: number;
  followUpActions: number;
  opportunitiesCreated: number;
  revenueConverted: number;
  relationshipValue: number;
  engagementQuality: string;
  createdAt: string;
};

export type EcosystemSummary = {
  totalActivities: number;
  totalCost: number;
  totalLeads: number;
  totalFollowUps: number;
  totalOpportunities: number;
  totalRevenue: number;
  totalRelationshipValue: number;
  roi: number;
  costPerLead: number;
  byType: {
    activityType: string;
    count: number;
    totalCost: number;
    totalLeads: number;
    totalOpportunities: number;
    totalRevenue: number;
    totalRelationshipValue: number;
  }[];
};

type PaginationMeta = {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ListParams = {
  search?: string;
  activityType?: string;
  page?: number;
  limit?: number;
};

export async function getEcosystemEntries(params: ListParams = {}) {
  const res = await http.get<{ data: EcosystemEntry[]; meta: PaginationMeta }>("/ecosystem", { params });
  return { items: res.data.data, meta: res.data.meta! };
}

export async function getEcosystemSummary() {
  const res = await http.get<{ data: EcosystemSummary }>("/ecosystem/summary");
  return res.data.data;
}

export async function createEcosystemEntry(data: Omit<EcosystemEntry, "id" | "createdAt">) {
  const res = await http.post<{ data: EcosystemEntry }>("/ecosystem", data);
  return res.data.data;
}

export async function updateEcosystemEntry(id: string, data: Partial<EcosystemEntry>) {
  const res = await http.put<{ data: EcosystemEntry }>(`/ecosystem/${id}`, data);
  return res.data.data;
}

export async function deleteEcosystemEntry(id: string) {
  await http.delete(`/ecosystem/${id}`);
}
