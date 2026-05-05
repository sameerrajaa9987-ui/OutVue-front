import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as revenueDataApi from "../api/revenueDataApi";
import type {
  CreateRevenueDataPayload,
  UpdateRevenueDataPayload,
  RevenueDataFilters,
} from "../types";

const BASE_KEY = ["revenue-data"];

export function useRevenueDataList(
  filters: RevenueDataFilters & { page?: number; limit?: number } = {},
) {
  return useQuery({
    queryKey: [...BASE_KEY, filters],
    queryFn: () => revenueDataApi.list(filters),
  });
}

export function useCreateRevenueData() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRevenueDataPayload) => revenueDataApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BASE_KEY }),
  });
}

export function useUpdateRevenueData() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateRevenueDataPayload;
    }) => revenueDataApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BASE_KEY }),
  });
}

export function useDeleteRevenueData() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => revenueDataApi.deleteOne(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: BASE_KEY }),
  });
}

export function useBulkCreateRevenueData() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRevenueDataPayload[]) =>
      revenueDataApi.bulkCreate(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BASE_KEY }),
  });
}
