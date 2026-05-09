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
  ListTodo,
  AlertCircle,
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

const PRIORITY_CONFIG = {
  high: {
    label: "High",
    color: "text-red-600",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
  medium: {
    label: "Medium",
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  low: {
    label: "Low",
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
} as const;

type Priority = "high" | "medium" | "low";

type FormData = {
  action: string;
  assignedTo: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  outcome: string;
  recommendationTag: string;
  priority: Priority;
};

const EMPTY: FormData = {
  action: "",
  assignedTo: "",
  dueDate: new Date().toISOString().slice(0, 10),
  status: "pending",
  outcome: "",
  recommendationTag: "",
  priority: "medium",
};

export function ActionsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Mark complete modal state
  const [completeId, setCompleteId] = useState<string | null>(null);
  const [completeOutcome, setCompleteOutcome] = useState("");

  const { data, isLoading } = useActions({
    page,
    status: statusFilter || undefined,
  });
  const createMut = useCreateAction();
  const updateMut = useUpdateAction();
  const deleteMut = useDeleteAction();

  const allItems = data?.items ?? [];
  const meta = data?.meta;

  // Apply priority filter client-side
  const items = priorityFilter
    ? allItems.filter(
        (a) => (a as ActionItem & { priority?: string }).priority === priorityFilter,
      )
    : allItems;

  // Counts from all items (not filtered)
  const counts = allItems.reduce(
    (acc, a) => {
      acc.total += 1;
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    },
    { total: 0, pending: 0, "in-progress": 0, completed: 0 } as Record<
      string,
      number
    >,
  );

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
      priority: (a as ActionItem & { priority?: Priority }).priority || "medium",
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
    try {
      if (editId) {
        await updateMut.mutateAsync({ id: editId, data: payload });
        toast.success("Action updated");
      } else {
        await createMut.mutateAsync(payload);
        toast.success("Action created");
      }
      setShowForm(false);
    } catch {
      toast.error("Failed to save action");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteMut.mutateAsync(deleteId);
      toast.success("Action deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete action");
    }
  }

  async function quickStatus(
    id: string,
    status: "pending" | "in-progress" | "completed",
  ) {
    if (status === "completed") {
      setCompleteId(id);
      setCompleteOutcome("");
      return;
    }
    try {
      await updateMut.mutateAsync({ id, data: { status } });
      toast.success(`Status updated to ${status.replace("-", " ")}`);
    } catch {
      toast.error("Failed to update status");
    }
  }

  async function handleMarkComplete() {
    if (!completeId) return;
    try {
      await updateMut.mutateAsync({
        id: completeId,
        data: {
          status: "completed",
          outcome: completeOutcome,
        },
      });
      toast.success("Action marked as completed");
      setCompleteId(null);
      setCompleteOutcome("");
    } catch {
      toast.error("Failed to complete action");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Action Planning</h1>
          <p className="text-muted-foreground mt-1">
            Convert AI recommendations into trackable actions
          </p>
        </div>
        <Button onClick={() => openCreate()} className="gap-2">
          <Plus className="h-4 w-4" /> New Action
        </Button>
      </div>

      {/* Summary Cards - 4 cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-500/10">
              <ListTodo className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{counts.total}</p>
              <p className="text-xs text-muted-foreground">Total Actions</p>
            </div>
          </CardContent>
        </Card>
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

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center mr-1">
            Status:
          </span>
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

        <div className="h-4 w-px bg-border" />

        {/* Priority Filter */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center mr-1">
            Priority:
          </span>
          <Button
            size="sm"
            variant={priorityFilter === "" ? "default" : "outline"}
            onClick={() => setPriorityFilter("")}
          >
            All
          </Button>
          {(
            Object.entries(PRIORITY_CONFIG) as [
              string,
              { label: string; color: string },
            ][]
          ).map(([key, cfg]) => (
            <Button
              key={key}
              size="sm"
              variant={priorityFilter === key ? "default" : "outline"}
              onClick={() => setPriorityFilter(key)}
              className="gap-1.5"
            >
              <span
                className={cn("h-2 w-2 rounded-full", {
                  "bg-red-500": key === "high",
                  "bg-amber-500": key === "medium",
                  "bg-emerald-500": key === "low",
                })}
              />
              {cfg.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Create / Edit Form */}
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
                <Label>Action Description</Label>
                <Input
                  className="mt-1"
                  value={form.action}
                  onChange={(e) => setForm({ ...form, action: e.target.value })}
                  placeholder="Describe the action to take..."
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
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <Label>Assigned To</Label>
                <Input
                  className="mt-1"
                  value={form.assignedTo}
                  onChange={(e) =>
                    setForm({ ...form, assignedTo: e.target.value })
                  }
                  placeholder="Name or email"
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
                <Label>Priority</Label>
                <select
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.priority}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value as Priority,
                    })
                  }
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
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
                <textarea
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px] resize-y"
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
                {createMut.isPending || updateMut.isPending
                  ? "Saving..."
                  : editId
                    ? "Update"
                    : "Create"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mark Complete Modal */}
      {completeId && (
        <Card className="border-emerald-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Mark Action as Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Outcome Notes</Label>
              <textarea
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px] resize-y"
                value={completeOutcome}
                onChange={(e) => setCompleteOutcome(e.target.value)}
                placeholder="Describe the outcome of this action..."
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleMarkComplete}
                disabled={updateMut.isPending}
                className="gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                {updateMut.isPending ? "Saving..." : "Complete"}
              </Button>
              <Button variant="outline" onClick={() => setCompleteId(null)}>
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
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm">Delete this action?</p>
            </div>
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
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16">
            <ClipboardList className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="font-semibold">No actions yet</p>
            <p className="text-sm text-muted-foreground mt-1 text-center max-w-md">
              Visit{" "}
              <span className="font-medium text-foreground">AI Insights</span>{" "}
              to create your first action plan from a recommendation.
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
            const priority = (a as ActionItem & { priority?: Priority })
              .priority || "medium";
            const pCfg = PRIORITY_CONFIG[priority];
            return (
              <Card
                key={a.id}
                className={cn(overdue && "border-red-500/30")}
              >
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
                        {/* Priority Badge */}
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                            pCfg.bg,
                            pCfg.color,
                          )}
                        >
                          {pCfg.label}
                        </span>
                        {a.recommendationTag && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-xs text-violet-600">
                            <Sparkles className="h-3 w-3" />
                            {a.recommendationTag}
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-sm mt-1.5">{a.action}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        {a.assignedTo && <span>Assigned: {a.assignedTo}</span>}
                        <span
                          className={cn(overdue && "text-red-500 font-medium")}
                        >
                          Due:{" "}
                          {new Date(a.dueDate).toLocaleDateString("en-GB")}
                          {overdue && " (overdue)"}
                        </span>
                        <span className={cn("capitalize", cfg.color)}>
                          {cfg.label}
                        </span>
                      </div>
                      {a.outcome && (
                        <p className="text-sm text-muted-foreground mt-2 bg-muted/40 rounded-lg p-2">
                          <span className="font-medium text-foreground">
                            Outcome:
                          </span>{" "}
                          {a.outcome}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {a.status === "pending" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Mark In Progress"
                          onClick={() => quickStatus(a.id, "in-progress")}
                        >
                          <PlayCircle className="h-4 w-4 text-blue-500" />
                        </Button>
                      )}
                      {(a.status === "pending" ||
                        a.status === "in-progress") && (
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Mark Complete"
                          onClick={() => quickStatus(a.id, "completed")}
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(a)}
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteId(a.id)}
                        title="Delete"
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
