import { useQuery } from "@tanstack/react-query";
import * as dashboardApi from "../api/dashboardApi";

export function useDashboardSummary(params?: {
  startDate?: string;
  endDate?: string;
  platform?: string;
}) {
  return useQuery({
    queryKey: ["dashboard-summary", params],
    queryFn: () => dashboardApi.getSummary(params),
  });
}

export function useTrends(params?: {
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ["dashboard-trends", params],
    queryFn: () => dashboardApi.getTrends(params),
  });
}

export function useBdSummary() {
  return useQuery({
    queryKey: ["dashboard-bd-summary"],
    queryFn: () => dashboardApi.getBdSummary(),
  });
}

export function useCostBreakdown() {
  return useQuery({
    queryKey: ["dashboard-cost-breakdown"],
    queryFn: () => dashboardApi.getCostBreakdown(),
  });
}
