import { http } from "@/shared/api/http";

export type BudgetAllocationItem = {
  category: string;
  currentAllocation: number;
  recommendedAllocation: number;
  reason: string;
  potentialImpact: string;
};

export async function getBudgetAllocation() {
  const res = await http.get<{ data: BudgetAllocationItem[] }>(
    "/budget/allocation",
  );
  return res.data.data;
}
