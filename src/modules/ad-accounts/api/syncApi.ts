import { http } from "@/shared/api/http";

export type SyncStatus = {
  adAccountId: string;
  platform: string;
  accountId: string;
  accountStatus: string;
  lastSynced: string | null;
  lastSyncStatus: string | null;
  lastSyncMessage: string | null;
  campaignsSynced: number;
};

export type SyncLog = {
  id: string;
  userId: string;
  adAccountId: string;
  platform: string;
  status: string;
  message: string;
  campaignsSynced: number;
  syncedAt: string | null;
  durationMs: number;
  createdAt: string;
};

export type SyncResult = {
  adAccountId: string;
  platform: string;
  accountId: string;
  status: string;
  synced?: number;
  message?: string;
  durationMs: number;
};

export async function triggerSyncAll() {
  const res = await http.post<{ data: SyncResult[] }>("/sync/trigger");
  return res.data.data;
}

export async function triggerSyncOne(adAccountId: string) {
  const res = await http.post<{ data: SyncResult }>(
    `/sync/trigger/${adAccountId}`,
  );
  return res.data.data;
}

export async function getSyncStatus() {
  const res = await http.get<{ data: SyncStatus[] }>("/sync/status");
  return res.data.data;
}

export async function getSyncLogs(params?: {
  adAccountId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const res = await http.get<{
    data: SyncLog[];
    meta: Record<string, unknown>;
  }>("/sync/logs", { params });
  return res.data;
}
