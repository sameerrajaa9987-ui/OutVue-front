import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useTrends } from "../hooks";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);
const fmtNum = (n: number) => new Intl.NumberFormat("en-GB").format(n);
const pct = (n: number) => `${n.toFixed(2)}%`;

export function TrendsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const params = {
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };
  const { data: trends, isLoading } = useTrends(params);

  const totalSpend = trends?.reduce((s, t) => s + t.spend, 0) ?? 0;
  const totalLeads = trends?.reduce((s, t) => s + t.leads, 0) ?? 0;
  const totalConversions = trends?.reduce((s, t) => s + t.conversions, 0) ?? 0;
  const totalClicks = trends?.reduce((s, t) => s + t.clicks, 0) ?? 0;
  const totalImpressions = trends?.reduce((s, t) => s + t.impressions, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Trends</h1>
        <p className="text-muted-foreground mt-1">
          Analyze your marketing performance over time.
        </p>
      </div>

      {/* Date Filter */}
      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-border bg-muted/30 p-4">
        <div className="space-y-1">
          <Label className="text-xs">Start Date</Label>
          <Input
            type="date"
            className="w-[160px]"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">End Date</Label>
          <Input
            type="date"
            className="w-[160px]"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Spend</p>
            <p className="text-xl font-bold">{fmt(totalSpend)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Leads</p>
            <p className="text-xl font-bold">{fmtNum(totalLeads)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Conversions</p>
            <p className="text-xl font-bold">{fmtNum(totalConversions)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Clicks</p>
            <p className="text-xl font-bold">{fmtNum(totalClicks)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">CTR</p>
            <p className="text-xl font-bold">
              {totalImpressions > 0
                ? pct((totalClicks / totalImpressions) * 100)
                : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {isLoading ? (
        <Skeleton className="h-96" />
      ) : !trends || trends.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold">No trend data yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Add marketing spend data to see performance trends over time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Spend Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={trends}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(d) =>
                      new Date(d).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })
                    }
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--background)",
                    }}
                    formatter={(val) => (val == null ? "" : fmt(Number(val)))}
                  />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Leads & Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={trends}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(d) =>
                      new Date(d).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })
                    }
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--background)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="leads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="conversions"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Clicks & Impressions</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={trends}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(d) =>
                      new Date(d).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })
                    }
                  />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--background)",
                    }}
                    formatter={(val) =>
                      val == null ? "" : fmtNum(Number(val))
                    }
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="clicks"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="impressions"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
