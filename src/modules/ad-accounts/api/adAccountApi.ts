import { http } from "@/shared/api/http";
import type {
  AdAccount,
  ConnectAdAccountPayload,
  UpdateAdAccountPayload,
} from "../types";

export async function list() {
  const res = await http.get<{ data: AdAccount[] }>("/accounts");
  return res.data.data;
}

export async function connect(data: ConnectAdAccountPayload) {
  const res = await http.post<{
    data: { account: AdAccount; tokenValid: boolean; validationMessage?: string };
  }>("/accounts/connect", data);
  return res.data.data;
}

export async function getById(id: string) {
  const res = await http.get<{ data: AdAccount }>(`/accounts/${id}`);
  return res.data.data;
}

export async function update(id: string, data: UpdateAdAccountPayload) {
  const res = await http.patch<{ data: AdAccount }>(`/accounts/${id}`, data);
  return res.data.data;
}

export async function remove(id: string) {
  await http.delete(`/accounts/${id}`);
}
