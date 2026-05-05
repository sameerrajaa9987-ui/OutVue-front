import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as operationalCostApi from "../api/operationalCostApi";
import type {
  CreateOperationalCostPayload,
  UpdateOperationalCostPayload,
  OperationalCostFilters,
} from "../types";

const BASE_KEY = ["operational-cost"];

export function useOperationalCostList(
  filters: OperationalCostFilters & { page?: number; limit?: number } = {},
) {
  return useQuery({
    queryKey: [...BASE_KEY, filters],
    queryFn: () => operationalCostApi.list(filters),
  });
}

export function useCreateOperationalCost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOperationalCostPayload) => operationalCostApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BASE_KEY }),
  });
}

export function useUpdateOperationalCost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOperationalCostPayload }) =>
      operationalCostApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BASE_KEY }),
  });
}

export function useDeleteOperationalCost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => operationalCostApi.deleteOne(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: BASE_KEY }),
  });
}

export function useBulkCreateOperationalCost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOperationalCostPayload[]) => operationalCostApi.bulkCreate(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BASE_KEY }),
  });
}
