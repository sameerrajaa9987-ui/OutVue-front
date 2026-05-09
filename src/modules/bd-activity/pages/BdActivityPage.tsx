import { useState, useCallback } from "react";
import { usePageTitle } from "@/shared/lib/usePageTitle";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/http";
import { CsvUploadButton } from "@/shared/components/CsvUploadButton";
import { cn } from "@/lib/utils";
import {
  useBdActivityList,
  useCreateBdActivity,
  useUpdateBdActivity,
  useDeleteBdActivity,
  useBulkCreateBdActivity,
} from "../hooks";
import type { BdActivity, BdActivityFilters as Filters } from "../types";
import { BD_TYPES, BD_TYPE_COLORS } from "../types";
import { BdActivityDialog } from "../components/BdActivityDialog";
import { BdActivityFilters } from "../components/BdActivityFilters";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
    n,
  );
const fmtNum = (n: number) => new Intl.NumberFormat("en-GB").format(n);

function typeLabel(val: string) {
  return BD_TYPES.find((t) => t.value === val)?.label ?? val;
}

export function BdActivityPage() {
  usePageTitle("BD Activity");
  const [filters, setFilters] = useState<Filters>({});
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BdActivity | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BdActivity | null>(null);

  const { data, isLoading } = useBdActivityList({
    ...filters,
    page,
    limit: 20,
  });
  const createMut = useCreateBdActivity();
  const updateMut = useUpdateBdActivity();
  const deleteMut = useDeleteBdActivity();
  const bulkMut = useBulkCreateBdActivity();

  const items = data?.data ?? [];
  const meta = data?.meta;

  const openCreate = useCallback(() => {
    setEditing(null);
    setDialogOpen(true);
  }, []);
  const openEdit = useCallback((item: BdActivity) => {
    setEditing(item);
    setDialogOpen(true);
  }, []);

  async function handleSubmit(values: Record<string, unknown>) {
    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, data: values as never });
        toast.success("Activity updated");
      } else {
        await createMut.mutateAsync(values as never);
        toast.success("Activity added");
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
      toast.success("Activity deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  async function handleCsvUpload(rows: Record<string, unknown>[]) {
    try {
      await bulkMut.mutateAsync(rows as never);
      toast.success(`${rows.length} activity/ies imported`);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">BD Activity</h1>
          <p className="text-muted-foreground mt-1">
            Track business development events, partnerships and networking.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CsvUploadButton
            onUpload={handleCsvUpload}
            isPending={bulkMut.isPending}
          />
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Activity
          </Button>
        </div>
      </div>

      <BdActivityFilters
        filters={filters}
        onChange={(f) => {
          setFilters(f);
          setPage(1);
        }}
      />

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
              <Handshake className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold">No activities yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Add your first BD activity to start tracking leads and
                opportunities.
              </p>
              <Button className="mt-4" onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Activity
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium">Type</th>
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-right font-medium">Cost</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-right font-medium">Leads</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Opportunities
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      Revenue
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Notes</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
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
                            BD_TYPE_COLORS[item.type] ??
                              "bg-gray-100 text-gray-800",
                          )}
                        >
                          {typeLabel(item.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {fmt(item.cost)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {new Date(item.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {fmtNum(item.leadsGenerated)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {fmtNum(item.opportunitiesCreated)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {fmt(item.revenueConverted)}
                      </td>
                      <td className="px-4 py-3 max-w-[200px] truncate text-muted-foreground">
                        {item.notes || "—"}
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

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

      <BdActivityDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        defaultValues={editing}
        isPending={createMut.isPending || updateMut.isPending}
      />

      {deleteTarget && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="fixed inset-x-4 top-[30%] z-50 mx-auto max-w-sm rounded-xl border bg-background p-6 shadow-2xl sm:inset-x-auto sm:w-[400px]">
            <h3 className="text-lg font-semibold">Delete Activity</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.name}</strong>? This action cannot be
              undone.
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
