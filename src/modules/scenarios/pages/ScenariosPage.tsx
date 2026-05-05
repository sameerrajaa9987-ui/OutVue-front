import { useState } from "react";
import {
  FlaskConical,
  Plus,
  Trash2,
  Loader2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useRunScenario } from "../hooks";
import type { Adjustment } from "../api/scenarioApi";

const CHANNELS = [
  "meta", "google", "linkedin", "email", "seo", "content", "social",
  "event", "networking", "partnership", "referral", "sponsorship",
];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
const fmtNum = (n: number) => new Intl.NumberFormat("en-GB").format(Math.round(n));
const pct = (n: number) => `${n.toFixed(1)}%`;

function DeltaBadge({ current, projected, inverse }: { current: number; projected: number; inverse?: boolean }) {
  if (current === 0) return null;
  const delta = ((projected - current) / current) * 100;
  const isGood = inverse ? delta < 0 : delta > 0;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", isGood ? "text-emerald-600" : "text-red-500")}>
      {isGood ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {delta >= 0 ? "+" : ""}{pct(delta)}
    </span>
  );
}

export function ScenariosPage() {
  const [adjustments, setAdjustments] = useState<Adjustment[]>([
    { channel: "meta", changePercent: 0 },
  ]);
  const scenarioMut = useRunScenario();

  const addRow = () => {
    const used = new Set(adjustments.map((a) => a.channel));
    const next = CHANNELS.find((c) => !used.has(c));
    if (!next) return;
    setAdjustments((prev) => [...prev, { channel: next, changePercent: 0 }]);
  };

  const removeRow = (idx: number) => {
    setAdjustments((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateRow = (idx: number, field: keyof Adjustment, value: string | number) => {
    setAdjustments((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, [field]: value } : a)),
    );
  };

  const handleRun = () => {
    const valid = adjustments.filter((a) => a.changePercent !== 0);
    if (valid.length === 0) return;
    scenarioMut.mutate(adjustments.filter((a) => a.changePercent !== 0));
  };

  const result = scenarioMut.data;

  const chartData = result?.channelDetails?.map((d) => ({
    name: d.channel.charAt(0).toUpperCase() + d.channel.slice(1),
    "Current Spend": d.currentSpend,
    "Projected Spend": d.projectedSpend,
    "Current Leads": d.currentLeads,
    "Projected Leads": d.projectedLeads,
  })) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Scenario Modelling</h1>
        <p className="text-muted-foreground mt-1">
          Test "what-if" budget scenarios to project impact on leads, CPL, and ROI.
        </p>
      </div>

      {/* Adjustment Builder */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
              Budget Adjustments
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={addRow} disabled={adjustments.length >= CHANNELS.length} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Channel
              </Button>
              <Button
                size="sm"
                onClick={handleRun}
                disabled={scenarioMut.isPending || adjustments.every((a) => a.changePercent === 0)}
                className="gap-1.5"
              >
                {scenarioMut.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                Run Scenario
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {adjustments.map((adj, idx) => (
              <div key={idx} className="flex items-end gap-3 rounded-lg border border-border bg-muted/20 p-3">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Channel</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm capitalize"
                    value={adj.channel}
                    onChange={(e) => updateRow(idx, "channel", e.target.value)}
                  >
                    {CHANNELS.map((c) => (
                      <option key={c} value={c} disabled={adjustments.some((a, i) => i !== idx && a.channel === c)}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-[140px] space-y-1">
                  <Label className="text-xs">Change %</Label>
                  <Input
                    type="number"
                    min={-100}
                    max={500}
                    value={adj.changePercent}
                    onChange={(e) => updateRow(idx, "changePercent", Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="range"
                    min={-100}
                    max={200}
                    value={adj.changePercent}
                    onChange={(e) => updateRow(idx, "changePercent", Number(e.target.value))}
                    className="w-[120px] accent-primary"
                  />
                </div>
                <span
                  className={cn(
                    "w-[60px] text-right text-sm font-semibold tabular-nums",
                    adj.changePercent > 0 ? "text-emerald-600" : adj.changePercent < 0 ? "text-red-500" : "text-muted-foreground",
                  )}
                >
                  {adj.changePercent > 0 ? "+" : ""}{adj.changePercent}%
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 shrink-0"
                  onClick={() => removeRow(idx)}
                  disabled={adjustments.length <= 1}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <>
          {/* Summary */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm leading-relaxed">{result.summary}</p>
              </div>
            </CardContent>
          </Card>

          {/* Metric Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Total Spend</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold">{fmt(result.projectedSpend)}</span>
                  <DeltaBadge current={result.currentSpend} projected={result.projectedSpend} inverse />
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {fmt(result.currentSpend)} <ArrowRight className="h-3 w-3" /> {fmt(result.projectedSpend)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Total Leads</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold">{fmtNum(result.projectedLeads)}</span>
                  <DeltaBadge current={result.currentLeads} projected={result.projectedLeads} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {fmtNum(result.currentLeads)} <ArrowRight className="h-3 w-3" /> {fmtNum(result.projectedLeads)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">CPL</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold">{fmt(result.projectedCPL)}</span>
                  <DeltaBadge current={result.currentCPL} projected={result.projectedCPL} inverse />
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {fmt(result.currentCPL)} <ArrowRight className="h-3 w-3" /> {fmt(result.projectedCPL)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Blended ROI</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold">{pct(result.projectedROI)}</span>
                  <DeltaBadge current={result.currentROI} projected={result.projectedROI} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {pct(result.currentROI)} <ArrowRight className="h-3 w-3" /> {pct(result.projectedROI)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Current Revenue</p>
                <p className="text-xl font-bold mt-1">{fmt(result.currentRevenue)}</p>
              </CardContent>
            </Card>
            <Card className="border-emerald-500/20">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Projected Revenue</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-xl font-bold">{fmt(result.projectedRevenue)}</p>
                  <DeltaBadge current={result.currentRevenue} projected={result.projectedRevenue} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Channel Detail Chart */}
          {chartData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Channel Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", background: "var(--background)" }} formatter={(val: number) => fmt(val)} />
                    <Legend />
                    <Bar dataKey="Current Spend" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Projected Spend" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Channel Detail Table */}
          {result.channelDetails.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Detailed Projections</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/40">
                        <th className="px-4 py-3 text-left font-medium">Channel</th>
                        <th className="px-4 py-3 text-right font-medium">Change</th>
                        <th className="px-4 py-3 text-right font-medium">Current Spend</th>
                        <th className="px-4 py-3 text-right font-medium">Projected Spend</th>
                        <th className="px-4 py-3 text-right font-medium">Current Leads</th>
                        <th className="px-4 py-3 text-right font-medium">Projected Leads</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.channelDetails.map((d, idx) => (
                        <tr key={d.channel} className={cn("border-b", idx % 2 === 0 ? "bg-background" : "bg-muted/10")}>
                          <td className="px-4 py-3 font-medium capitalize">{d.channel}</td>
                          <td className={cn("px-4 py-3 text-right tabular-nums font-medium", d.changePercent > 0 ? "text-emerald-600" : d.changePercent < 0 ? "text-red-500" : "")}>
                            {d.changePercent > 0 ? "+" : ""}{d.changePercent}%
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">{fmt(d.currentSpend)}</td>
                          <td className="px-4 py-3 text-right tabular-nums font-medium">{fmt(d.projectedSpend)}</td>
                          <td className="px-4 py-3 text-right tabular-nums">{fmtNum(d.currentLeads)}</td>
                          <td className="px-4 py-3 text-right tabular-nums font-medium">{fmtNum(d.projectedLeads)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
