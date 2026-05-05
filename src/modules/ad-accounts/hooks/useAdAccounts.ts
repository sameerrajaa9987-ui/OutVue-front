import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as adAccountApi from "../api/adAccountApi";
import type { ConnectAdAccountPayload, UpdateAdAccountPayload } from "../types";

const BASE_KEY = ["ad-accounts"];

export function useAdAccountList() {
  return useQuery({
    queryKey: BASE_KEY,
    queryFn: () => adAccountApi.list(),
  });
}

export function useConnectAdAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ConnectAdAccountPayload) => adAccountApi.connect(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BASE_KEY }),
  });
}

export function useUpdateAdAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdAccountPayload }) =>
      adAccountApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BASE_KEY }),
  });
}

export function useRemoveAdAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adAccountApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: BASE_KEY }),
  });
}
