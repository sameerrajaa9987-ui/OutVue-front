import { useState, useMemo } from "react";
import {
  ArrowLeftRight,
  Check,
  Loader2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useComparableItems, useCompare } from "../hooks";
import type { EntityType, CampaignComparison, BdComparison } from "../api/comparisonApi";

const ENTITY_OPTIONS: { value: EntityType; label: string }[] = [
  { value: "campaign", label: "Campaigns" },
  { value: "channel", label: "Channels" },
  { value: "bd-activity", label: "BD Activities" },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
const fmtNum = (n: number) => new Intl.NumberFormat("en-GB").format(n);
const pct = (n: number) => `${n.toFixed(2)}%`;

type SortDir = "asc" | "desc";

const CAMPAIGN_COLS = [
  { key: "name", label: "Name", format: (v: string) => v, align: "left" as const, noHighlight: true },
  { key: "platform", label: "Platform", format: (v: string) => v, align: "left" as const, noHighlight: true },
  { key: "spend", label: "Spend", format: (v: number) => fmt(v), align: "right" as const, best: "min" as const },
  { key: "leads", label: "Leads", format: (v: number) => fmtNum(v), align: "right" as const, best: "max" as const },
  { key: "conversions", label: "Conversions", format: (v: number) => fmtNum(v), align: "right" as const, best: "max" as const },
  { key: "cpl", label: "CPL", format: (v: number) => fmt(v), align: "right" as const, best: "min" as const },
  { key: "ctr", label: "CTR", format: (v: number) => pct(v), align: "right" as const, best: "max" as const },
  { key: "cpa", label: "CPA", format: (v: number) => fmt(v), align: "right" as const, best: "min" as const },
  { key: "clicks", label: "Clicks", format: (v: number) => fmtNum(v), align: "right" as const, best: "max" as const },
  { key: "impressions", label: "Impressions", format: (v: number) => fmtNum(v), align: "right" as const, best: "max" as const },
];

const BD_COLS = [
  { key: "name", label: "Name", format: (v: string) => v, align: "left" as const, noHighlight: true },
  { key: "type", label: "Type", format: (v: string) => v, align: "left" as const, noHighlight: true },
  { key: "cost", label: "Cost", format: (v: number) => fmt(v), align: "right" as const, best: "min" as const },
  { key: "leads", label: "Leads", format: (v: number) => fmtNum(v), align: "right" as const, best: "max" as const },
  { key: "opportunities", label: "Opportunities", format: (v: number) => fmtNum(v), align: "right" as const, best: "max" as const },
  { key: "revenue", label: "Revenue", format: (v: number) => fmt(v), align: "right" as const, best: "max" as const },
  { key: "cpl", label: "CPL", format: (v: number) => fmt(v), align: "right" as const, best: "min" as const },
  { key: "roi", label: "ROI", format: (v: number) => pct(v), align: "right" as const, best: "max" as const },
];

type ColDef = { key: string; label: string; format: (v: never) => string; align: "left" | "right"; noHighlight?: boolean; best?: "min" | "max" };

export function ComparisonPage() {
  const [entityType, setEntityType] = useState<EntityType>("campaign");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const { data: items, isLoading: itemsLoading } = useComparableItems(entityType);
  const compareMut = useCompare();

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 10) { toast.error("Maximum 10 items"); return prev; }
      return [...prev, id];
    });
  };

  const handleCompare = () => {
    if (selectedIds.length < 2) { toast.error("Select at least 2 items"); return; }
    compareMut.mutate({ entityType, ids: selectedIds });
  };

  const handleEntityChange = (et: EntityType) => {
    setEntityType(et);
    setSelectedIds([]);
    compareMut.reset();
    setSortKey("");
  };

  const columns: ColDef[] = useMemo(() => {
    if (!compareMut.data) return [];
    return (compareMut.data.entityType === "bd-activity" ? BD_COLS : CAMPAIGN_COLS) as ColDef[];
  }, [compareMut.data]);

  const result = compareMut.data?.items ?? [];

  const sorted = useMemo(() => {
    if (!sortKey || result.length === 0) return result;
    const arr = [...result];
    arr.sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey];
      const bv = (b as Record<string, unknown>)[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return arr;
  }, [result, sortKey, sortDir]);

  const bestWorst = useMemo(() => {
    const bw: Record<string, { best: number; worst: number }> = {};
    if (sorted.length === 0) return bw;
    for (const col of columns) {
      if (col.noHighlight || !col.best) continue;
      const vals = sorted.map((r) => (r as Record<string, number>)[col.key]).filter((v) => typeof v === "number" && v > 0);
      if (vals.length < 2) continue;
      bw[col.key] = {
        best: col.best === "max" ? Math.max(...vals) : Math.min(...vals),
        worst: col.best === "max" ? Math.min(...vals) : Math.max(...vals),
      };
    }
    return bw;
  }, [sorted, columns]);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Comparison</h1>
        <p className="text-muted-foreground mt-1">
          Compare campaigns, channels, or BD activities side-by-side.
        </p>
      </div>

      {/* Entity Type Selector */}
      <div className="flex flex-wrap gap-2">
        {ENTITY_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={entityType === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleEntityChange(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* Item Picker */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Select items to compare ({selectedIds.length}/10)
            </CardTitle>
            <Button
              size="sm"
              disabled={selectedIds.length < 2 || compareMut.isPending}
              onClick={handleCompare}
              className="gap-2"
            >
              {compareMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowLeftRight className="h-4 w-4" />}
              Compare
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {itemsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
            </div>
          ) : !items || items.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No {entityType === "bd-activity" ? "BD activities" : `${entityType}s`} found. Add data first.
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const selected = selectedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 text-left transition-all hover:border-primary/50",
                      selected ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                        selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30",
                      )}
                    >
                      {selected && <Check className="h-3 w-3" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium capitalize">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.platform && <span className="capitalize">{item.platform}</span>}
                        {item.type && <span className="capitalize">{item.type}</span>}
                        {item.spend != null && <span> &middot; {fmt(item.spend)}</span>}
                        {item.cost != null && <span> &middot; {fmt(item.cost)}</span>}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Table */}
      {compareMut.data && sorted.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
              Comparison Results
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className={cn(
                          "px-4 py-3 font-medium cursor-pointer select-none hover:bg-muted/60 transition-colors",
                          col.align === "right" ? "text-right" : "text-left",
                        )}
                        onClick={() => handleSort(col.key)}
                      >
                        <span className="inline-flex items-center gap-1">
                          {col.label}
                          {sortKey === col.key && (
                            sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((row, rowIdx) => (
                    <tr key={(row as { id: string }).id} className={cn("border-b", rowIdx % 2 === 0 ? "bg-background" : "bg-muted/10")}>
                      {columns.map((col) => {
                        const val = (row as Record<string, unknown>)[col.key];
                        const numVal = typeof val === "number" ? val : null;
                        const bw = bestWorst[col.key];
                        let highlight = "";
                        if (bw && numVal !== null && numVal > 0) {
                          if (numVal === bw.best) highlight = "text-emerald-600 font-semibold";
                          else if (numVal === bw.worst) highlight = "text-red-500 font-semibold";
                        }
                        return (
                          <td
                            key={col.key}
                            className={cn(
                              "px-4 py-3 tabular-nums",
                              col.align === "right" ? "text-right" : "text-left",
                              highlight,
                              col.key === "name" && "font-medium capitalize",
                              col.key === "platform" && "capitalize",
                              col.key === "type" && "capitalize",
                            )}
                          >
                            {col.format(val as never)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-4 border-t px-4 py-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Best
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Worst
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
