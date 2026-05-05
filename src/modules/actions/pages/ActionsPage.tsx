import { useState } from "react";
import {
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  Clock,
  CheckCircle2,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useActions,
  useCreateAction,
  useUpdateAction,
  useDeleteAction,
} from "../hooks";
import type { ActionItem } from "../api/actionsApi";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    icon: Clock,
  },
  "in-progress": {
    label: "In Progress",
    color: "text-blue-600",
    bg: "bg-blue-500/10",
    icon: PlayCircle,
  },
  completed: {
    label: "Completed",
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    icon: CheckCircle2,
  },
} as const;

type FormData = {
  action: string;
  assignedTo: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  outcome: string;
  recommendationTag: string;
};

const EMPTY: FormData = {
  action: "",
  assignedTo: "",
  dueDate: new Date().toISOString().slice(0, 10),
  status: "pending",
  outcome: "",
  recommendationTag: "",
};

export function ActionsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useActions({
    page,
    status: statusFilter || undefined,
  });
  const createMut = useCreateAction();
  const updateMut = useUpdateAction();
  const deleteMut = useDeleteAction();

  const items = data?.items ?? [];
  const meta = data?.meta;

  function openCreate(recTag?: string) {
    setEditId(null);
    setForm({ ...EMPTY, recommendationTag: recTag || "" });
    setShowForm(true);
  }

  function openEdit(a: ActionItem) {
    setEditId(a.id);
    setForm({
      action: a.action,
      assignedTo: a.assignedTo,
      dueDate: new Date(a.dueDate).toISOString().slice(0, 10),
      status: a.status,
      outcome: a.outcome,
      recommendationTag: a.recommendationTag || "",
    });
    setShowForm(true);
  }

  async function handleSubmit() {
    if (!form.action.trim())
      return toast.error("Action description is required");
    const payload = {
      ...form,
      recommendationTag: form.recommendationTag || null,
    };
    if (editId) {
      await updateMut.mutateAsync({ id: editId, data: payload });
      toast.success("Action updated");
    } else {
      await createMut.mutateAsync(payload);
      toast.success("Action created");
    }
    setShowForm(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    await deleteMut.mutateAsync(deleteId);
    toast.success("Action deleted");
    setDeleteId(null);
  }

  async function quickStatus(
    id: string,
    status: "pending" | "in-progress" | "completed",
  ) {
    await updateMut.mutateAsync({ id, data: { status } });
    toast.success(`Status updated to ${status}`);
  }

  const counts = items.reduce(
    (acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    },
    { pending: 0, "in-progress": 0, completed: 0 } as Record<string, number>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Action Planning</h1>
          <p className="text-muted-foreground mt-1">
            Convert insights into trackable action plans.
          </p>
        </div>
        <Button onClick={() => openCreate()} className="gap-2">
          <Plus className="h-4 w-4" /> New Action
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        {(
          Object.entries(STATUS_CONFIG) as [
            keyof typeof STATUS_CONFIG,
            (typeof STATUS_CONFIG)[keyof typeof STATUS_CONFIG],
          ][]
        ).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <Card key={key}>
              <CardContent className="p-4 flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    cfg.bg,
                  )}
                >
                  <Icon className={cn("h-5 w-5", cfg.color)} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{counts[key] ?? 0}</p>
                  <p className="text-xs text-muted-foreground">{cfg.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={statusFilter === "" ? "default" : "outline"}
          onClick={() => {
            setStatusFilter("");
            setPage(1);
          }}
        >
          All
        </Button>
        {(Object.entries(STATUS_CONFIG) as [string, { label: string }][]).map(
          ([key, cfg]) => (
            <Button
              key={key}
              size="sm"
              variant={statusFilter === key ? "default" : "outline"}
              onClick={() => {
                setStatusFilter(key);
                setPage(1);
              }}
            >
              {cfg.label}
            </Button>
          ),
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {editId ? "Edit" : "Create"} Action
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Action</Label>
                <Input
                  className="mt-1"
                  value={form.action}
                  onChange={(e) => setForm({ ...form, action: e.target.value })}
                  placeholder="Describe the action..."
                />
              </div>
              <div>
                <Label>Linked Recommendation</Label>
                <Input
                  className="mt-1"
                  value={form.recommendationTag}
                  onChange={(e) =>
                    setForm({ ...form, recommendationTag: e.target.value })
                  }
                  placeholder="e.g. Budget Reallocation"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Assigned To</Label>
                <Input
                  className="mt-1"
                  value={form.assignedTo}
                  onChange={(e) =>
                    setForm({ ...form, assignedTo: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input
                  className="mt-1"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Status</Label>
                <select
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as FormData["status"],
                    })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            {(editId || form.status === "completed") && (
              <div>
                <Label>Outcome / Notes</Label>
                <Input
                  className="mt-1"
                  value={form.outcome}
                  onChange={(e) =>
                    setForm({ ...form, outcome: e.target.value })
                  }
                  placeholder="What was the result?"
                />
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSubmit}
                disabled={createMut.isPending || updateMut.isPending}
              >
                {editId ? "Update" : "Create"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <Card className="border-red-500/30">
          <CardContent className="p-4 flex items-center justify-between">
            <p className="text-sm">Delete this action?</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMut.isPending}
              >
                Delete
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16">
            <ClipboardList className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="font-semibold">No actions yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create actions from AI recommendations or manually.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((a) => {
            const cfg = STATUS_CONFIG[a.status];
            const Icon = cfg.icon;
            const overdue =
              a.status !== "completed" && new Date(a.dueDate) < new Date();
            return (
              <Card key={a.id} className={cn(overdue && "border-red-500/30")}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg mt-0.5",
                        cfg.bg,
                      )}
                    >
                      <Icon className={cn("h-4 w-4", cfg.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">{a.action}</p>
                        {a.recommendationTag && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-xs text-violet-600">
                            <Sparkles className="h-3 w-3" />
                            {a.recommendationTag}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        {a.assignedTo && <span>Assigned: {a.assignedTo}</span>}
                        <span
                          className={cn(overdue && "text-red-500 font-medium")}
                        >
                          Due: {new Date(a.dueDate).toLocaleDateString("en-GB")}
                        </span>
                        <span className={cn("capitalize", cfg.color)}>
                          {cfg.label}
                        </span>
                      </div>
                      {a.outcome && (
                        <p className="text-sm text-muted-foreground mt-2 bg-muted/40 rounded-lg p-2">
                          {a.outcome}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {a.status === "pending" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Start"
                          onClick={() => quickStatus(a.id, "in-progress")}
                        >
                          <PlayCircle className="h-4 w-4 text-blue-500" />
                        </Button>
                      )}
                      {a.status === "in-progress" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Complete"
                          onClick={() => quickStatus(a.id, "completed")}
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(a)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteId(a.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={!meta.hasPrevPage}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span className="text-sm text-muted-foreground">
            {meta.page} / {meta.totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={!meta.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
