import { http } from "@/shared/api/http";

export type Recommendation = {
  entityType: string;
  entityName: string;
  tag: string;
  priority: "high" | "medium" | "low";
  reasoning: string;
  suggestedAction: string;
  disclaimer?: string;
};

export type RecommendationSummary = {
  high: number;
  medium: number;
  low: number;
  total: number;
};

export async function getRecommendations() {
  const res = await http.get<{ data: Recommendation[] }>("/recommendations");
  return res.data.data;
}

export async function getRecommendationSummary() {
  const res = await http.get<{ data: RecommendationSummary }>(
    "/recommendations/summary",
  );
  return res.data.data;
}
