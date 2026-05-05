import { http } from "@/shared/api/http";
import type {
  BdActivity,
  CreateBdActivityPayload,
  UpdateBdActivityPayload,
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
  type?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
};

export async function list(params?: ListParams) {
  const res = await http.get<{ data: BdActivity[]; meta: PaginationMeta }>(
    "/bd-activity",
    { params },
  );
  return res.data;
}

export async function create(data: CreateBdActivityPayload) {
  const res = await http.post<{ data: BdActivity }>("/bd-activity", data);
  return res.data.data;
}

export async function getById(id: string) {
  const res = await http.get<{ data: BdActivity }>(`/bd-activity/${id}`);
  return res.data.data;
}

export async function update(id: string, data: UpdateBdActivityPayload) {
  const res = await http.patch<{ data: BdActivity }>(
    `/bd-activity/${id}`,
    data,
  );
  return res.data.data;
}

export async function deleteOne(id: string) {
  await http.delete(`/bd-activity/${id}`);
}

export async function bulkCreate(data: CreateBdActivityPayload[]) {
  const res = await http.post<{ data: { count: number; errors: unknown[] } }>(
    "/bd-activity/bulk",
    { items: data },
  );
  return res.data.data;
}
