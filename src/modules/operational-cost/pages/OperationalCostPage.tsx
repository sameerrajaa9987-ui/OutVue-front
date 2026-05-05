import { useState, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/http";
import { CsvUploadButton } from "@/shared/components/CsvUploadButton";
import { cn } from "@/lib/utils";
import {
  useOperationalCostList,
  useCreateOperationalCost,
  useUpdateOperationalCost,
  useDeleteOperationalCost,
  useBulkCreateOperationalCost,
} from "../hooks";
import type {
  OperationalCost,
  OperationalCostFilters as Filters,
} from "../types";
import { OPERATIONAL_TYPES, OPERATIONAL_TYPE_COLORS } from "../types";
import { OperationalCostDialog } from "../components/OperationalCostDialog";
import { OperationalCostFilters } from "../components/OperationalCostFilters";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
    n,
  );

function typeLabel(val: string) {
  return OPERATIONAL_TYPES.find((t) => t.value === val)?.label ?? val;
}

export function OperationalCostPage() {
  const [filters, setFilters] = useState<Filters>({});
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<OperationalCost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OperationalCost | null>(
    null,
  );

  const { data, isLoading } = useOperationalCostList({
    ...filters,
    page,
    limit: 20,
  });
  const createMut = useCreateOperationalCost();
  const updateMut = useUpdateOperationalCost();
  const deleteMut = useDeleteOperationalCost();
  const bulkMut = useBulkCreateOperationalCost();

  const items = data?.data ?? [];
  const meta = data?.meta;

  const openCreate = useCallback(() => {
    setEditing(null);
    setDialogOpen(true);
  }, []);
  const openEdit = useCallback((item: OperationalCost) => {
    setEditing(item);
    setDialogOpen(true);
  }, []);

  async function handleSubmit(values: Record<string, unknown>) {
    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, data: values as never });
        toast.success("Cost updated");
      } else {
        await createMut.mutateAsync(values as never);
        toast.success("Cost added");
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
      toast.success("Cost deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  async function handleCsvUpload(rows: Record<string, unknown>[]) {
    try {
      await bulkMut.mutateAsync(rows as never);
      toast.success(`${rows.length} cost(s) imported`);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Operational Costs
          </h1>
          <p className="text-muted-foreground mt-1">
            Track team, agency, software and consultant growth costs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CsvUploadButton
            onUpload={handleCsvUpload}
            isPending={bulkMut.isPending}
          />
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Cost
          </Button>
        </div>
      </div>

      <OperationalCostFilters
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
              <Building2 className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold">No costs yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Add operational costs to track your growth investment
                allocation.
              </p>
              <Button className="mt-4" onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Cost
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium">Type</th>
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Monthly Cost
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      Allocation
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      Effective Cost
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Period</th>
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
                            OPERATIONAL_TYPE_COLORS[item.type] ??
                              "bg-gray-100 text-gray-800",
                          )}
                        >
                          {typeLabel(item.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {fmt(item.monthlyCost)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {item.allocation}%
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {fmt((item.monthlyCost * item.allocation) / 100)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {item.period}
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

      <OperationalCostDialog
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
            <h3 className="text-lg font-semibold">Delete Cost</h3>
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
