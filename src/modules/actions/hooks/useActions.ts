import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as actionsApi from "../api/actionsApi";
import type { ActionListParams } from "../api/actionsApi";

export function useActions(params: ActionListParams = {}) {
  return useQuery({
    queryKey: ["actions", params],
    queryFn: () => actionsApi.getActions(params),
  });
}

export function useCreateAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: actionsApi.createAction,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["actions"] }),
  });
}

export function useUpdateAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof actionsApi.updateAction>[1];
    }) => actionsApi.updateAction(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["actions"] }),
  });
}

export function useDeleteAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: actionsApi.deleteAction,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["actions"] }),
  });
}
