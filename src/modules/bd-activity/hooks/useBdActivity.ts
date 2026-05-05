import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as bdActivityApi from "../api/bdActivityApi";
import type {
  CreateBdActivityPayload,
  UpdateBdActivityPayload,
  BdActivityFilters,
} from "../types";

const BASE_KEY = ["bd-activity"];

export function useBdActivityList(
  filters: BdActivityFilters & { page?: number; limit?: number } = {},
) {
  return useQuery({
    queryKey: [...BASE_KEY, filters],
    queryFn: () => bdActivityApi.list(filters),
  });
}

export function useCreateBdActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBdActivityPayload) => bdActivityApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BASE_KEY }),
  });
}

export function useUpdateBdActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBdActivityPayload }) =>
      bdActivityApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BASE_KEY }),
  });
}

export function useDeleteBdActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bdActivityApi.deleteOne(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: BASE_KEY }),
  });
}

export function useBulkCreateBdActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBdActivityPayload[]) => bdActivityApi.bulkCreate(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BASE_KEY }),
  });
}
