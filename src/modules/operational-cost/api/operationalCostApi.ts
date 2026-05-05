import { http } from "@/shared/api/http";
import type {
  OperationalCost,
  CreateOperationalCostPayload,
  UpdateOperationalCostPayload,
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
  period?: string;
};

export async function list(params?: ListParams) {
  const res = await http.get<{ data: OperationalCost[]; meta: PaginationMeta }>(
    "/operational-cost",
    { params },
  );
  return res.data;
}

export async function create(data: CreateOperationalCostPayload) {
  const res = await http.post<{ data: OperationalCost }>("/operational-cost", data);
  return res.data.data;
}

export async function getById(id: string) {
  const res = await http.get<{ data: OperationalCost }>(`/operational-cost/${id}`);
  return res.data.data;
}

export async function update(id: string, data: UpdateOperationalCostPayload) {
  const res = await http.patch<{ data: OperationalCost }>(`/operational-cost/${id}`, data);
  return res.data.data;
}

export async function deleteOne(id: string) {
  await http.delete(`/operational-cost/${id}`);
}

export async function bulkCreate(data: CreateOperationalCostPayload[]) {
  const res = await http.post<{ data: { count: number; errors: unknown[] } }>(
    "/operational-cost/bulk",
    { items: data },
  );
  return res.data.data;
}
