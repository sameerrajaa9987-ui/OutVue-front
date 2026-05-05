import { useQuery } from "@tanstack/react-query";
import * as reviewApi from "../api/reviewApi";

export function useMonthlyReview(year: number, month: number) {
  return useQuery({
    queryKey: ["monthly-review", year, month],
    queryFn: () => reviewApi.getMonthlyReview(year, month),
  });
}
