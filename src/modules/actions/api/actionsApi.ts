import { http } from "@/shared/api/http";

export type ActionItem = {
  id: string;
  recommendationId: string | null;
  recommendationTag: string | null;
  action: string;
  assignedTo: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  outcome: string;
  createdAt: string;
};

type PaginationMeta = { total: number; totalPages: number; page: number; limit: number; hasNextPage: boolean; hasPrevPage: boolean };

export type ActionListParams = { search?: string; status?: string; page?: number; limit?: number };

export async function getActions(params: ActionListParams = {}) {
  const res = await http.get<{ data: ActionItem[]; meta: PaginationMeta }>("/actions", { params });
  return { items: res.data.data, meta: res.data.meta! };
}

export async function createAction(data: Partial<ActionItem>) {
  const res = await http.post<{ data: ActionItem }>("/actions", data);
  return res.data.data;
}

export async function updateAction(id: string, data: Partial<ActionItem>) {
  const res = await http.put<{ data: ActionItem }>(`/actions/${id}`, data);
  return res.data.data;
}

export async function deleteAction(id: string) {
  await http.delete(`/actions/${id}`);
}
