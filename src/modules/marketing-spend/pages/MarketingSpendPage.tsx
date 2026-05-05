import { useState, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/http";
import { CsvUploadButton } from "@/shared/components/CsvUploadButton";
import { cn } from "@/lib/utils";
import {
  useMarketingSpendList,
  useCreateMarketingSpend,
  useUpdateMarketingSpend,
  useDeleteMarketingSpend,
  useBulkCreateMarketingSpend,
} from "../hooks";
import type {
  MarketingSpend,
  MarketingSpendFilters as Filters,
} from "../types";
import { MARKETING_PLATFORMS, PLATFORM_COLORS } from "../types";
import { MarketingSpendDialog } from "../components/MarketingSpendDialog";
import { MarketingSpendFilters } from "../components/MarketingSpendFilters";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
    n,
  );

const fmtNum = (n: number) => new Intl.NumberFormat("en-GB").format(n);

const pct = (n: number) => `${n.toFixed(1)}%`;

function platformLabel(val: string) {
  return MARKETING_PLATFORMS.find((p) => p.value === val)?.label ?? val;
}

export function MarketingSpendPage() {
  const [filters, setFilters] = useState<Filters>({});
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MarketingSpend | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MarketingSpend | null>(null);

  const { data, isLoading } = useMarketingSpendList({
    ...filters,
    page,
    limit: 20,
  });
  const createMut = useCreateMarketingSpend();
  const updateMut = useUpdateMarketingSpend();
  const deleteMut = useDeleteMarketingSpend();
  const bulkMut = useBulkCreateMarketingSpend();

  const items = data?.data ?? [];
  const meta = data?.meta;

  const openCreate = useCallback(() => {
    setEditing(null);
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((item: MarketingSpend) => {
    setEditing(item);
    setDialogOpen(true);
  }, []);

  async function handleSubmit(values: Record<string, unknown>) {
    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, data: values as never });
        toast.success("Campaign updated");
      } else {
        await createMut.mutateAsync(values as never);
        toast.success("Campaign added");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMut.mutateAsync(deleteTarget.id);
      toast.success("Campaign deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  async function handleCsvUpload(rows: Record<string, unknown>[]) {
    try {
      await bulkMut.mutateAsync(rows as never);
      toast.success(`${rows.length} campaign(s) imported`);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marketing Spend</h1>
          <p className="text-muted-foreground mt-1">
            Track campaign costs, performance and ROI across all channels.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CsvUploadButton
            onUpload={handleCsvUpload}
            isPending={bulkMut.isPending}
          />
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Campaign
          </Button>
        </div>
      </div>

      {/* Filters */}
      <MarketingSpendFilters
        filters={filters}
        onChange={(f) => {
          setFilters(f);
          setPage(1);
        }}
      />

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold">No campaigns yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Add your first marketing campaign to start tracking spend and
                performance.
              </p>
              <Button className="mt-4" onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Campaign
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium">
                      Platform
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      Campaign
                    </th>
                    <th className="px-4 py-3 text-right font-medium">Spend</th>
                    <th className="px-4 py-3 text-right font-medium">Clicks</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Impressions
                    </th>
                    <th className="px-4 py-3 text-right font-medium">Leads</th>
                    <th className="px-4 py-3 text-right font-medium">Conv.</th>
                    <th className="px-4 py-3 text-right font-medium">CPL</th>
                    <th className="px-4 py-3 text-right font-medium">CTR</th>
                    <th className="px-4 py-3 text-left font-medium">Period</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const cpl = item.leads > 0 ? item.spend / item.leads : 0;
                    const ctr =
                      item.impressions > 0
                        ? (item.clicks / item.impressions) * 100
                        : 0;
                    return (
                      <tr
                        key={item.id}
                        className={cn(
                          "border-b transition-colors hover:bg-muted/30",
                          idx % 2 === 0 ? "bg-background" : "bg-muted/10",
                        )}
                      >
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
                              PLATFORM_COLORS[item.platform] ??
                                "bg-gray-100 text-gray-800",
                            )}
                          >
                            {platformLabel(item.platform)}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {item.campaignName}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {fmt(item.spend)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {fmtNum(item.clicks)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {fmtNum(item.impressions)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {fmtNum(item.leads)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {fmtNum(item.conversions)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {cpl > 0 ? fmt(cpl) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {ctr > 0 ? pct(ctr) : "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                          {new Date(item.startDate).toLocaleDateString("en-GB")}
                          {" – "}
                          {new Date(item.endDate).toLocaleDateString("en-GB")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEdit(item)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => setDeleteTarget(item)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing page {meta.page} of {meta.totalPages} ({meta.total} total)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.hasPrevPage}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <MarketingSpendDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        defaultValues={editing}
        isPending={createMut.isPending || updateMut.isPending}
      />

      {/* Delete Confirmation */}
      {deleteTarget && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="fixed inset-x-4 top-[30%] z-50 mx-auto max-w-sm rounded-xl border bg-background p-6 shadow-2xl sm:inset-x-auto sm:w-[400px]">
            <h3 className="text-lg font-semibold">Delete Campaign</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.campaignName}</strong>? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMut.isPending}
              >
                {deleteMut.isPending ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
