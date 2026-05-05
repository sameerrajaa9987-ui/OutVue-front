import { useState } from "react";
import {
  CalendarDays,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMonthlyReview } from "../hooks";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const fmt = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;

function Delta({ value }: { value: number }) {
  const positive = value >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        positive ? "text-emerald-600" : "text-red-600",
      )}
    >
      <Icon className="h-3 w-3" />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

export function ReviewPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const { data: review, isLoading } = useMonthlyReview(year, month);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Monthly Review</h1>
          <p className="text-muted-foreground mt-1">
            Data &rarr; Insight &rarr; Decision &rarr; Action &rarr; Review
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (month === 1) {
                setMonth(12);
                setYear(year - 1);
              } else setMonth(month - 1);
            }}
          >
            &larr;
          </Button>
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            {MONTHS[month - 1]} {year}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (month === 12) {
                setMonth(1);
                setYear(year + 1);
              } else setMonth(month + 1);
            }}
          >
            &rarr;
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : !review ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            No data for this period.
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Marketing Performance */}
          <div>
            <h2 className="text-base font-semibold mb-3">
              Marketing Performance
            </h2>
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Spend</p>
                  <p className="text-xl font-bold">
                    {fmt(review.performance.marketing.spend)}
                  </p>
                  <Delta value={review.performance.marketing.spendDelta} />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Leads</p>
                  <p className="text-xl font-bold">
                    {review.performance.marketing.leads}
                  </p>
                  <Delta value={review.performance.marketing.leadsDelta} />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Conversions</p>
                  <p className="text-xl font-bold">
                    {review.performance.marketing.conversions}
                  </p>
                  <Delta
                    value={review.performance.marketing.conversionsDelta}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">CPL</p>
                  <p className="text-xl font-bold">
                    {fmt(review.performance.marketing.cpl)}
                  </p>
                  <Delta value={-review.performance.marketing.cplDelta} />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* BD Performance */}
          <div>
            <h2 className="text-base font-semibold mb-3">BD Performance</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">BD Cost</p>
                  <p className="text-xl font-bold">
                    {fmt(review.performance.bd.cost)}
                  </p>
                  <Delta value={review.performance.bd.costDelta} />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">BD Leads</p>
                  <p className="text-xl font-bold">
                    {review.performance.bd.leads}
                  </p>
                  <Delta value={review.performance.bd.leadsDelta} />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">BD Revenue</p>
                  <p className="text-xl font-bold">
                    {fmt(review.performance.bd.revenue)}
                  </p>
                  <Delta value={review.performance.bd.revenueDelta} />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions Status */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Action Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-amber-500/10 rounded-lg p-3">
                    <p className="text-xl font-bold text-amber-600">
                      {review.actions.pending}
                    </p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-3">
                    <p className="text-xl font-bold text-blue-600">
                      {review.actions["in-progress"]}
                    </p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                  <div className="bg-emerald-500/10 rounded-lg p-3">
                    <p className="text-xl font-bold text-emerald-600">
                      {review.actions.completed}
                    </p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-2xl font-bold">
                    {review.recommendations.total}
                  </span>
                  <span className="text-xs text-muted-foreground">total</span>
                  <span className="text-xs text-red-600 font-medium">
                    {review.recommendations.high} high
                  </span>
                  <span className="text-xs text-amber-600 font-medium">
                    {review.recommendations.medium} medium
                  </span>
                </div>
                <div className="space-y-2">
                  {review.recommendations.topItems.slice(0, 3).map((r, i) => (
                    <div key={i} className="text-sm bg-muted/40 rounded-lg p-2">
                      <span className="font-medium">{r.tag}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        — {r.suggestedAction}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Opportunities & Inefficiencies */}
          <div className="grid gap-4 lg:grid-cols-2">
            {review.budgetOpportunities.length > 0 && (
              <Card className="border-emerald-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-emerald-500" />
                    Budget Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {review.budgetOpportunities.map((o, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {review.emergingInefficiencies.length > 0 && (
              <Card className="border-red-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Emerging Inefficiencies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {review.emergingInefficiencies.map((e, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}
