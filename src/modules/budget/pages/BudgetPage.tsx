import {
  PieChart as PieIcon,
  ArrowRight,
  Lightbulb,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useBudgetAllocation } from "../hooks";

export function BudgetPage() {
  const { data: allocations, isLoading } = useBudgetAllocation();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold tracking-tight">Budget Allocation</h1></div>
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      </div>
    );
  }

  const items = allocations ?? [];

  const chartData = items.map((a) => ({
    name: a.category.replace("Marketing: ", ""),
    Current: a.currentAllocation,
    Recommended: a.recommendedAllocation,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Budget Allocation</h1>
        <p className="text-muted-foreground mt-1">Current vs recommended spend per channel for board-level decisions.</p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16">
            <PieIcon className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="font-semibold">No allocation data</p>
            <p className="text-sm text-muted-foreground mt-1">Add marketing, BD, and operational data to generate budget recommendations.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                Current vs Recommended Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" domain={[0, "auto"]} tick={{ fontSize: 11 }} unit="%" />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", background: "var(--background)" }}
                    formatter={(v: number) => `${v.toFixed(1)}%`}
                  />
                  <Legend />
                  <Bar dataKey="Current" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="Recommended" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Detailed Cards */}
          <div className="space-y-3">
            {items.map((a, i) => {
              const diff = a.recommendedAllocation - a.currentAllocation;
              const increase = diff > 0.5;
              const decrease = diff < -0.5;

              return (
                <Card key={i}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        increase ? "bg-emerald-500/10" : decrease ? "bg-red-500/10" : "bg-muted",
                      )}>
                        <ArrowRight className={cn("h-5 w-5", increase ? "text-emerald-600 rotate-[-45deg]" : decrease ? "text-red-600 rotate-[45deg]" : "text-muted-foreground")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-sm">{a.category}</h3>
                          <div className="flex items-center gap-2 text-sm tabular-nums">
                            <span className="text-muted-foreground">{a.currentAllocation}%</span>
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className={cn("font-medium", increase ? "text-emerald-600" : decrease ? "text-red-600" : "")}>{a.recommendedAllocation}%</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{a.reason}</p>
                        <div className="mt-2 rounded-lg bg-muted/40 p-3 flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                          <p className="text-sm">{a.potentialImpact}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
