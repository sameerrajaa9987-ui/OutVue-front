import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  BarChart3,
  PieChart as PieIcon,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { useDashboardSummary, useTrends, useBdSummary, useCostBreakdown } from "../hooks";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
const fmtNum = (n: number) => new Intl.NumberFormat("en-GB").format(n);
const pct = (n: number) => `${n.toFixed(1)}%`;

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"];

const PLATFORM_LABELS: Record<string, string> = {
  meta: "Meta", google: "Google", linkedin: "LinkedIn",
  email: "Email", seo: "SEO", content: "Content", social: "Social",
};

function StatCard({
  title, value, subtitle, icon: Icon, trend, color,
}: {
  title: string; value: string; subtitle?: string;
  icon: typeof DollarSign; trend?: number; color?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", color || "bg-primary/10")}>
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        {trend !== undefined && (
          <div className={cn("mt-3 flex items-center gap-1 text-xs font-medium", trend >= 0 ? "text-emerald-600" : "text-red-600")}>
            {trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {pct(Math.abs(trend))} blended ROI
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: trends, isLoading: trendsLoading } = useTrends();
  const { data: bdSummary } = useBdSummary();
  const { data: costBreakdown } = useCostBreakdown();

  if (summaryLoading) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold tracking-tight">Dashboard</h1></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  const s = summary || {
    totalGrowthSpend: 0, totalMarketingSpend: 0, totalBDSpend: 0, totalOperationalCost: 0,
    totalLeads: 0, totalConversions: 0, avgCPL: 0, avgCPA: 0, blendedROI: 0,
    bestChannel: null, worstChannel: null, platformBreakdown: [], channelBreakdown: [],
  };

  const pieData = s.platformBreakdown.map((p) => ({
    name: PLATFORM_LABELS[p.platform] || p.platform,
    value: p.spend,
  }));

  const spendBreakdown = [
    { name: "Marketing", value: s.totalMarketingSpend },
    { name: "BD Activity", value: s.totalBDSpend },
    { name: "Operational", value: s.totalOperationalCost },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Your growth intelligence overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Growth Spend" value={fmt(s.totalGrowthSpend)} icon={DollarSign} trend={s.blendedROI} />
        <StatCard title="Total Leads" value={fmtNum(s.totalLeads)} subtitle={`${fmtNum(s.totalConversions)} conversions`} icon={Users} />
        <StatCard title="Avg. CPL" value={fmt(s.avgCPL)} subtitle={`CPA: ${fmt(s.avgCPA)}`} icon={Target} />
        <StatCard
          title="Blended ROI"
          value={pct(s.blendedROI)}
          subtitle={s.bestChannel ? `Best: ${PLATFORM_LABELS[s.bestChannel] || s.bestChannel}` : undefined}
          icon={s.blendedROI >= 0 ? TrendingUp : TrendingDown}
          color={s.blendedROI >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"}
        />
      </div>

      {/* Spend Breakdown Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Marketing Spend</p>
            <p className="text-xl font-bold mt-1">{fmt(s.totalMarketingSpend)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">BD Spend</p>
            <p className="text-xl font-bold mt-1">{fmt(s.totalBDSpend)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Operational Cost</p>
            <p className="text-xl font-bold mt-1">{fmt(s.totalOperationalCost)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Spend Trends */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              Spend & Leads Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trendsLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : !trends || trends.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
                Add marketing data to see trends
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", background: "var(--background)" }}
                    formatter={(val: number, name: string) => [name === "spend" ? fmt(val) : fmtNum(val), name.charAt(0).toUpperCase() + name.slice(1)]}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="spend" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                  <Area yAxisId="right" type="monotone" dataKey="leads" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Platform Breakdown Pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-muted-foreground" />
              Spend by Platform
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
                Add marketing data to see breakdown
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: number) => fmt(val)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Platform Table */}
      {s.platformBreakdown.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Platform Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium">Platform</th>
                    <th className="px-4 py-3 text-right font-medium">Spend</th>
                    <th className="px-4 py-3 text-right font-medium">Leads</th>
                    <th className="px-4 py-3 text-right font-medium">CPL</th>
                    <th className="px-4 py-3 text-right font-medium">CTR</th>
                    <th className="px-4 py-3 text-right font-medium">Clicks</th>
                    <th className="px-4 py-3 text-right font-medium">Impressions</th>
                  </tr>
                </thead>
                <tbody>
                  {s.platformBreakdown.map((p, idx) => (
                    <tr key={p.platform} className={cn("border-b", idx % 2 === 0 ? "bg-background" : "bg-muted/10")}>
                      <td className="px-4 py-3 font-medium capitalize">{PLATFORM_LABELS[p.platform] || p.platform}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{fmt(p.spend)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{fmtNum(p.leads)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{p.cpl > 0 ? fmt(p.cpl) : "—"}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{p.ctr > 0 ? pct(p.ctr) : "—"}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{fmtNum(p.clicks)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{fmtNum(p.impressions)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* BD & Cost Breakdown */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* BD Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">BD Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {!bdSummary || bdSummary.byType.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Add BD activities to see summary</p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="rounded-lg bg-muted/30 p-3 text-center">
                    <p className="text-lg font-bold">{fmtNum(bdSummary.totals.totalLeads)}</p>
                    <p className="text-xs text-muted-foreground">Leads</p>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-3 text-center">
                    <p className="text-lg font-bold">{fmtNum(bdSummary.totals.totalOpportunities)}</p>
                    <p className="text-xs text-muted-foreground">Opportunities</p>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-3 text-center">
                    <p className="text-lg font-bold">{fmt(bdSummary.totals.totalRevenue)}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={bdSummary.byType}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="type" tick={{ fontSize: 11 }} className="capitalize" />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(val: number) => fmt(val)} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="cost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Operational Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {!costBreakdown || costBreakdown.byType.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Add operational costs to see breakdown</p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-lg bg-muted/30 p-3 text-center">
                    <p className="text-lg font-bold">{fmt(costBreakdown.totals.totalMonthlyCost)}</p>
                    <p className="text-xs text-muted-foreground">Total Monthly</p>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-3 text-center">
                    <p className="text-lg font-bold">{fmt(costBreakdown.totals.totalEffectiveCost)}</p>
                    <p className="text-xs text-muted-foreground">Effective Cost</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={costBreakdown.byType.map((t) => ({ name: t.type, value: t.effectiveCost }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {costBreakdown.byType.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => fmt(val)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
