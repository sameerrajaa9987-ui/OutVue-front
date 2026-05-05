import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as complianceApi from "../api/complianceApi";

export function useDisclaimer() {
  return useQuery({ queryKey: ["disclaimer"], queryFn: complianceApi.getDisclaimer });
}

export function useGdprNotice() {
  return useQuery({ queryKey: ["gdpr"], queryFn: complianceApi.getGdprNotice });
}

export function useDataSources() {
  return useQuery({ queryKey: ["data-sources"], queryFn: complianceApi.getDataSources });
}

export function useAuditLogs(params: { eventType?: string; page?: number; limit?: number } = {}) {
  return useQuery({ queryKey: ["audit-logs", params], queryFn: () => complianceApi.getAuditLogs(params) });
}

export function useAcknowledgeLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: complianceApi.acknowledgeLog,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["audit-logs"] }),
  });
}
