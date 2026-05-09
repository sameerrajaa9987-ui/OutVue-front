import { useState } from "react";
import {
  CalendarDays,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Zap,
  Clock,
  Minus,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMonthlyReview } from "../hooks";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const fmt = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;

function Delta({ value, invert = false }: { value: number | null; invert?: boolean }) {
  if (value == null) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground">
        <Minus className="h-3 w-3" />
        New this month
      </span>
    );
  }
  const effective = invert ? -value : value;
  const positive = effective >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        positive ? "text-emerald-600" : "text-red-600",
      )}
    >
      <Icon className="h-3 w-3" />
      {Math.abs(value).toFixed(1)}% vs last month
    </span>
  );
}

export function ReviewPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const { data: review, isLoading } = useMonthlyReview(year, month);

  const goBack = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else setMonth(month - 1);
  };

  const goForward = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else setMonth(month + 1);
  };

  // Compute derived values
  const overdue =
    review?.actions?.pending && review.actions.pending > 0
      ? Math.max(
          0,
          review.actions.pending - (review.actions["in-progress"] || 0),
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Monthly Review</h1>
          <p className="text-muted-foreground mt-1">
            Track progress and identify new opportunities each month
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={goBack}>
            &larr;
          </Button>
          <div className="flex items-center gap-1.5 text-sm font-medium min-w-[140px] justify-center">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            {MONTHS[month - 1]} {year}
          </div>
          <Button size="sm" variant="outline" onClick={goForward}>
            &rarr;
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <Skeleton className="h-64" />
          <Skeleton className="h-48" />
        </div>
      ) : !review ? (
        <Card>
          <CardContent className="py-16 text-center">
            <CalendarDays className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="font-semibold">No data available for this period</p>
            <p className="text-sm text-muted-foreground mt-1">
              Make sure data is entered for this month.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Section 1: Performance vs Last Month */}
          <div>
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance vs Last Month
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Spend
                  </p>
                  <p className="text-2xl font-bold">
                    {fmt(review.performance.marketing.spend)}
                  </p>
                  <div className="mt-2">
                    <Delta value={review.performance.marketing.spendDelta} invert />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Leads
                  </p>
                  <p className="text-2xl font-bold">
                    {review.performance.marketing.leads}
                  </p>
                  <div className="mt-2">
                    <Delta value={review.performance.marketing.leadsDelta} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground mb-1">
                    CPL
                  </p>
                  <p className="text-2xl font-bold">
                    {review.performance.marketing.cpl != null
                      ? fmt(review.performance.marketing.cpl)
                      : "—"}
                  </p>
                  <div className="mt-2">
                    {review.performance.marketing.cplDelta != null ? (
                      <Delta
                        value={-review.performance.marketing.cplDelta}
                      />
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground">
                        <Minus className="h-3 w-3" />
                        No lead data yet
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section 2: Recommendations Review */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Recommendations Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              {review.recommendations.topItems.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No recommendations were generated this period.
                </p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/40">
                          <th className="px-4 py-2.5 text-left font-medium">
                            Recommendation
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Priority
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Action Taken
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Outcome
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {review.recommendations.topItems.map((r, i) => {
                          const actioned = r.priority === "high";
                          return (
                            <tr key={i} className="border-b">
                              <td className="px-4 py-2.5">
                                <span className="font-medium">{r.tag}</span>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {r.suggestedAction}
                                </p>
                              </td>
                              <td className="px-4 py-2.5">
                                <span
                                  className={cn(
                                    "rounded-full px-2 py-0.5 text-xs font-semibold capitalize",
                                    r.priority === "high"
                                      ? "bg-red-500/10 text-red-600"
                                      : r.priority === "medium"
                                        ? "bg-amber-500/10 text-amber-600"
                                        : "bg-emerald-500/10 text-emerald-600",
                                  )}
                                >
                                  {r.priority}
                                </span>
                              </td>
                              <td className="px-4 py-2.5">
                                {actioned ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                ) : (
                                  <Minus className="h-4 w-4 text-muted-foreground/40" />
                                )}
                              </td>
                              <td className="px-4 py-2.5 text-muted-foreground text-xs">
                                {actioned ? "Applied" : "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    {review.recommendations.high} of{" "}
                    {review.recommendations.total} recommendations actioned
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Section 3: Actions Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Actions Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-emerald-500/10 rounded-lg p-4">
                  <p className="text-2xl font-bold text-emerald-600">
                    {review.actions.completed}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Completed This Month
                  </p>
                </div>
                <div className="bg-amber-500/10 rounded-lg p-4">
                  <p className="text-2xl font-bold text-amber-600">
                    {review.actions.pending}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Still Pending
                  </p>
                </div>
                <div
                  className={cn(
                    "rounded-lg p-4",
                    overdue > 0 ? "bg-red-500/10" : "bg-muted/40",
                  )}
                >
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      overdue > 0 ? "text-red-600" : "text-muted-foreground",
                    )}
                  >
                    {overdue}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Overdue Actions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4 & 5: Opportunities & Inefficiencies */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-emerald-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-emerald-500" />
                  New Opportunities This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                {review.budgetOpportunities.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">
                    No new opportunities identified this period.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {review.budgetOpportunities.map((o, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="h-3.5 w-3.5 mt-0.5 text-emerald-500 shrink-0" />
                        {o}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="border-red-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Emerging Inefficiencies
                </CardTitle>
              </CardHeader>
              <CardContent>
                {review.emergingInefficiencies.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">
                    No emerging inefficiencies detected — great performance!
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {review.emergingInefficiencies.map((e, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-3.5 w-3.5 mt-0.5 text-red-500 shrink-0" />
                        {e}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
