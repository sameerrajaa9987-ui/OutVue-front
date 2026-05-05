import { http } from "@/shared/api/http";

export type AuditLogEntry = {
  id: string;
  eventType: string;
  payload: Record<string, unknown>;
  acknowledged: boolean;
  acknowledgedAt: string | null;
  createdAt: string;
};

export type DataSource = { source: string; records: number };

export type GdprNotice = {
  purpose: string;
  legalBasis: string;
  retention: string;
  rights: string;
  contact: string;
};

type PaginationMeta = {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export async function getDisclaimer() {
  const res = await http.get<{ data: { disclaimer: string } }>(
    "/compliance/disclaimer",
  );
  return res.data.data.disclaimer;
}

export async function getGdprNotice() {
  const res = await http.get<{ data: GdprNotice }>("/compliance/gdpr");
  return res.data.data;
}

export async function getDataSources() {
  const res = await http.get<{ data: DataSource[] }>(
    "/compliance/data-sources",
  );
  return res.data.data;
}

export async function getAuditLogs(
  params: { eventType?: string; page?: number; limit?: number } = {},
) {
  const res = await http.get<{ data: AuditLogEntry[]; meta: PaginationMeta }>(
    "/compliance/audit-logs",
    { params },
  );
  return { items: res.data.data, meta: res.data.meta! };
}

export async function acknowledgeLog(id: string) {
  const res = await http.post<{ data: AuditLogEntry }>(
    `/compliance/audit-logs/${id}/acknowledge`,
  );
  return res.data.data;
}
