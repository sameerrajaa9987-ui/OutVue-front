import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as ecosystemApi from "../api/ecosystemApi";
import type { ListParams } from "../api/ecosystemApi";

export function useEcosystemEntries(params: ListParams = {}) {
  return useQuery({
    queryKey: ["ecosystem", params],
    queryFn: () => ecosystemApi.getEcosystemEntries(params),
  });
}

export function useEcosystemSummary() {
  return useQuery({
    queryKey: ["ecosystem-summary"],
    queryFn: ecosystemApi.getEcosystemSummary,
  });
}

export function useCreateEcosystem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ecosystemApi.createEcosystemEntry,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ecosystem"] });
      qc.invalidateQueries({ queryKey: ["ecosystem-summary"] });
    },
  });
}

export function useUpdateEcosystem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof ecosystemApi.updateEcosystemEntry>[1];
    }) => ecosystemApi.updateEcosystemEntry(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ecosystem"] });
      qc.invalidateQueries({ queryKey: ["ecosystem-summary"] });
    },
  });
}

export function useDeleteEcosystem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ecosystemApi.deleteEcosystemEntry,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ecosystem"] });
      qc.invalidateQueries({ queryKey: ["ecosystem-summary"] });
    },
  });
}
