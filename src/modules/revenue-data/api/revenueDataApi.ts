import { http } from "@/shared/api/http";
import type {
  RevenueData,
  CreateRevenueDataPayload,
  UpdateRevenueDataPayload,
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
  source?: string;
  search?: string;
  period?: string;
};

export async function list(params?: ListParams) {
  const res = await http.get<{ data: RevenueData[]; meta: PaginationMeta }>(
    "/revenue-data",
    { params },
  );
  return res.data;
}

export async function create(data: CreateRevenueDataPayload) {
  const res = await http.post<{ data: RevenueData }>("/revenue-data", data);
  return res.data.data;
}

export async function getById(id: string) {
  const res = await http.get<{ data: RevenueData }>(`/revenue-data/${id}`);
  return res.data.data;
}

export async function update(id: string, data: UpdateRevenueDataPayload) {
  const res = await http.patch<{ data: RevenueData }>(
    `/revenue-data/${id}`,
    data,
  );
  return res.data.data;
}

export async function deleteOne(id: string) {
  await http.delete(`/revenue-data/${id}`);
}

export async function bulkCreate(data: CreateRevenueDataPayload[]) {
  const res = await http.post<{ data: { count: number; errors: unknown[] } }>(
    "/revenue-data/bulk",
    { items: data },
  );
  return res.data.data;
}
