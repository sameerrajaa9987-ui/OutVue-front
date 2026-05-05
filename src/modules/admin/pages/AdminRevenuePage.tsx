import {
  DollarSign,
  TrendingUp,
  Users,
  AlertTriangle,
  BarChart3,
  PieChart as PieIcon,
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
} from "recharts";
import { useRevenueSummary } from "../hooks";

const fmt = (pence: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(pence / 100);
const fmtNum = (n: number) => new Intl.NumberFormat("en-GB").format(n);
const pct = (n: number) => `${n.toFixed(1)}%`;

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

const STATUS_COLORS: Record<string, string> = {
  trial: "#3b82f6",
  active: "#10b981",
  pilot: "#8b5cf6",
  suspended: "#f59e0b",
  cancelled: "#ef4444",
};

export function AdminRevenuePage() {
  const { data: summary, isLoading } = useRevenueSummary();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold tracking-tight">Admin: Revenue</h1></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  const s = summary || {
    totalUsers: 0, mrr: 0, arr: 0, activeSubscriptions: 0, churnRate: 0,
    ltv: 0, avgRevenuePerAccount: 0, revenueByTier: [], statusBreakdown: [],
    pilotConversion: { totalPilots: 0, convertedPilots: 0, conversionRate: 0 },
  };

  const tierChartData = s.revenueByTier.map((t) => ({
    name: t.name,
    Users: t.count,
    Revenue: t.monthlyRevenue / 100,
  }));

  const statusPieData = s.statusBreakdown.map((st) => ({
    name: st.status.charAt(0).toUpperCase() + st.status.slice(1),
    value: st.count,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin: Revenue</h1>
        <p className="text-muted-foreground mt-1">Platform revenue metrics and subscription analytics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <p className="text-xs text-muted-foreground">MRR</p>
            </div>
            <p className="text-xl font-bold">{fmt(s.mrr)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <p className="text-xs text-muted-foreground">ARR</p>
            </div>
            <p className="text-xl font-bold">{fmt(s.arr)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-violet-500" />
              <p className="text-xs text-muted-foreground">Active Subs</p>
            </div>
            <p className="text-xl font-bold">{fmtNum(s.activeSubscriptions)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <p className="text-xs text-muted-foreground">Churn Rate</p>
            </div>
            <p className="text-xl font-bold">{pct(s.churnRate)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-amber-500" />
              <p className="text-xs text-muted-foreground">LTV</p>
            </div>
            <p className="text-xl font-bold">{fmt(s.ltv)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-cyan-500" />
              <p className="text-xs text-muted-foreground">ARPA</p>
            </div>
            <p className="text-xl font-bold">{fmt(s.avgRevenuePerAccount)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue by Tier */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              Revenue by Tier
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tierChartData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No subscription data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={tierChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", background: "var(--background)" }} />
                  <Legend />
                  <Bar dataKey="Users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-muted-foreground" />
              Subscription Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusPieData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No subscription data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {statusPieData.map((entry, i) => (
                      <Cell key={i} fill={STATUS_COLORS[entry.name.toLowerCase()] || COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pilot Conversion + Extra Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-3xl font-bold mt-1">{fmtNum(s.totalUsers)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">Pilot Conversions</p>
            <p className="text-3xl font-bold mt-1">
              {s.pilotConversion.convertedPilots}/{s.pilotConversion.totalPilots}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{pct(s.pilotConversion.conversionRate)} conversion rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">Revenue by Tier</p>
            <div className="mt-2 space-y-1">
              {s.revenueByTier.map((t) => (
                <div key={t.tier} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{t.name}</span>
                  <span className="font-medium">{t.count} users</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
