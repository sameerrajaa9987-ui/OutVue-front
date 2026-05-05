import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as marketingSpendApi from "../api/marketingSpendApi";
import type {
  CreateMarketingSpendPayload,
  UpdateMarketingSpendPayload,
  MarketingSpendFilters,
} from "../types";

const BASE_KEY = ["marketing-spend"];

export function useMarketingSpendList(
  filters: MarketingSpendFilters & { page?: number; limit?: number } = {},
) {
  return useQuery({
    queryKey: [...BASE_KEY, filters],
    queryFn: () => marketingSpendApi.list(filters),
  });
}

export function useCreateMarketingSpend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMarketingSpendPayload) =>
      marketingSpendApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BASE_KEY });
    },
  });
}

export function useUpdateMarketingSpend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateMarketingSpendPayload;
    }) => marketingSpendApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BASE_KEY });
    },
  });
}

export function useDeleteMarketingSpend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => marketingSpendApi.deleteOne(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BASE_KEY });
    },
  });
}

export function useBulkCreateMarketingSpend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMarketingSpendPayload[]) =>
      marketingSpendApi.bulkCreate(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BASE_KEY });
    },
  });
}
