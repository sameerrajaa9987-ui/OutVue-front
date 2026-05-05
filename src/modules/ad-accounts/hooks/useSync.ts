import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as syncApi from "../api/syncApi";

const STATUS_KEY = ["sync-status"];
const LOGS_KEY = ["sync-logs"];

export function useSyncStatus() {
  return useQuery({
    queryKey: STATUS_KEY,
    queryFn: () => syncApi.getSyncStatus(),
  });
}

export function useSyncLogs(params?: {
  adAccountId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [...LOGS_KEY, params],
    queryFn: () => syncApi.getSyncLogs(params),
  });
}

export function useTriggerSyncAll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => syncApi.triggerSyncAll(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STATUS_KEY });
      qc.invalidateQueries({ queryKey: LOGS_KEY });
      qc.invalidateQueries({ queryKey: ["ad-accounts"] });
    },
  });
}

export function useTriggerSyncOne() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (adAccountId: string) => syncApi.triggerSyncOne(adAccountId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STATUS_KEY });
      qc.invalidateQueries({ queryKey: LOGS_KEY });
      qc.invalidateQueries({ queryKey: ["ad-accounts"] });
    },
  });
}
