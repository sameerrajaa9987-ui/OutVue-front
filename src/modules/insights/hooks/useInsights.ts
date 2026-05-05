import { useQuery } from "@tanstack/react-query";
import * as insightsApi from "../api/insightsApi";

export function useRecommendations() {
  return useQuery({
    queryKey: ["recommendations"],
    queryFn: () => insightsApi.getRecommendations(),
  });
}

export function useRecommendationSummary() {
  return useQuery({
    queryKey: ["recommendation-summary"],
    queryFn: () => insightsApi.getRecommendationSummary(),
  });
}
