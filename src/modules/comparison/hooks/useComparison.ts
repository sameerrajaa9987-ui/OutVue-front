import { useQuery, useMutation } from "@tanstack/react-query";
import * as comparisonApi from "../api/comparisonApi";
import type { EntityType } from "../api/comparisonApi";

export function useComparableItems(entityType: EntityType) {
  return useQuery({
    queryKey: ["comparable-items", entityType],
    queryFn: () => comparisonApi.getComparableItems(entityType),
  });
}

export function useCompare() {
  return useMutation({
    mutationFn: ({ entityType, ids }: { entityType: EntityType; ids: string[] }) =>
      comparisonApi.compare(entityType, ids),
  });
}
