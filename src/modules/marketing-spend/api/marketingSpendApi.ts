import { http } from "@/shared/api/http";
import type {
  MarketingSpend,
  CreateMarketingSpendPayload,
  UpdateMarketingSpendPayload,
} from "../types";

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type ListParams = {
  page?: number;
  limit?: number;
  platform?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
};

export async function list(params?: ListParams) {
  const res = await http.get<{
    data: MarketingSpend[];
    meta: PaginationMeta;
  }>("/marketing-spend", { params });
  return res.data;
}

export async function create(data: CreateMarketingSpendPayload) {
  const res = await http.post<{ data: MarketingSpend }>(
    "/marketing-spend",
    data,
  );
  return res.data.data;
}

export async function getById(id: string) {
  const res = await http.get<{ data: MarketingSpend }>(
    `/marketing-spend/${id}`,
  );
  return res.data.data;
}

export async function update(id: string, data: UpdateMarketingSpendPayload) {
  const res = await http.patch<{ data: MarketingSpend }>(
    `/marketing-spend/${id}`,
    data,
  );
  return res.data.data;
}

export async function deleteOne(id: string) {
  await http.delete(`/marketing-spend/${id}`);
}

export async function bulkCreate(data: CreateMarketingSpendPayload[]) {
  const res = await http.post<{ data: MarketingSpend[] }>(
    "/marketing-spend/bulk",
    { items: data },
  );
  return res.data.data;
}
