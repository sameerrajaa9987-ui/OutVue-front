import { useState } from "react";
import { usePageTitle } from "@/shared/lib/usePageTitle";
import {
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Filter,
  Sparkles,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useRecommendations, useRecommendationSummary } from "../hooks";
import type { Recommendation } from "../api/insightsApi";

const PRIORITY_CONFIG = {
  high: {
    label: "High",
    color: "text-red-600",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-500",
    icon: ShieldAlert,
  },
  medium: {
    label: "Medium",
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    dot: "bg-amber-500",
    icon: AlertTriangle,
  },
  low: {
    label: "Low",
    color: "text-blue-600",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    dot: "bg-blue-500",
    icon: Lightbulb,
  },
} as const;

const TAG_ICONS: Record<string, typeof Lightbulb> = {
  "Underperforming Campaign": AlertTriangle,
  "Poor Creative": Zap,
  "Top Performer": TrendingUp,
  "Budget Reallocation": ArrowRight,
  "Overfunded Channel": ShieldAlert,
  "BD Opportunity": Sparkles,
  "Agency Efficiency": Filter,
};

type FilterPriority = "all" | "high" | "medium" | "low";

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const config = PRIORITY_CONFIG[rec.priority];
  const TagIcon = TAG_ICONS[rec.tag] || Lightbulb;

  return (
    <Card className={cn("border", config.border)}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              config.bg,
            )}
          >
            <TagIcon className={cn("h-5 w-5", config.color)} />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-sm">{rec.tag}</h3>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                  config.bg,
                  config.color,
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
                {config.label}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="capitalize">
                {rec.entityType.replace("-", " ")}
              </span>
              <span>&middot;</span>
              <span className="font-medium capitalize">{rec.entityName}</span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {rec.reasoning}
            </p>

            <div className="rounded-lg bg-muted/40 p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Suggested Action
              </p>
              <p className="text-sm">{rec.suggestedAction}</p>
            </div>
            <p className="text-xs text-gray-400 mt-2 italic">
              ⚠️{" "}
              {rec.disclaimer ||
                "This is a decision-support insight, not financial or regulated advice."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function InsightsPage() {
  usePageTitle("AI Insights");
  const [filter, setFilter] = useState<FilterPriority>("all");
  const { data: recs, isLoading } = useRecommendations();
  const { data: summary } = useRecommendationSummary();

  const filtered =
    recs?.filter((r) => filter === "all" || r.priority === filter) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Insights</h1>
        <p className="text-muted-foreground mt-1">
          Rule-based recommendations to optimize your growth spend.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{summary?.total ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Insights</p>
          </CardContent>
        </Card>
        <Card className="border-red-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-600">
              {summary?.high ?? 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">High Priority</p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">
              {summary?.medium ?? 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Medium Priority
            </p>
          </CardContent>
        </Card>
        <Card className="border-blue-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">
              {summary?.low ?? 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Low Priority</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["all", "high", "medium", "low"] as const).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
            className="gap-1.5"
          >
            {f !== "all" && (
              <span
                className={cn("h-2 w-2 rounded-full", PRIORITY_CONFIG[f].dot)}
              />
            )}
            {f === "all" ? "All" : PRIORITY_CONFIG[f].label}
            {f === "all" && (
              <span className="ml-1 text-muted-foreground">
                ({recs?.length ?? 0})
              </span>
            )}
            {f !== "all" && (
              <span className="ml-1 text-muted-foreground">
                ({recs?.filter((r) => r.priority === f).length ?? 0})
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Recommendations */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold">
              {recs && recs.length > 0
                ? "No matching insights"
                : "No insights yet"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {recs && recs.length > 0
                ? "Try changing the filter to see other insights."
                : "Add marketing, BD, and operational data to generate AI-powered recommendations."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((rec, i) => (
            <RecommendationCard
              key={`${rec.tag}-${rec.entityName}-${i}`}
              rec={rec}
            />
          ))}
        </div>
      )}
    </div>
  );
}
