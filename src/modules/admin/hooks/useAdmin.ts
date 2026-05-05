import { useQuery } from "@tanstack/react-query";
import * as adminApi from "../api/adminApi";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: adminApi.getUsers,
  });
}

export function useRevenueSummary() {
  return useQuery({
    queryKey: ["admin-revenue-summary"],
    queryFn: adminApi.getRevenueSummary,
  });
}
