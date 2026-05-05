import { useQuery } from "@tanstack/react-query";
import * as budgetApi from "../api/budgetApi";

export function useBudgetAllocation() {
  return useQuery({
    queryKey: ["budget-allocation"],
    queryFn: budgetApi.getBudgetAllocation,
  });
}
