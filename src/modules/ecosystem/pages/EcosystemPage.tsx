import { useState } from "react";
import { usePageTitle } from "@/shared/lib/usePageTitle";
import {
  Users,
  Mic,
  Handshake,
  Globe,
  Network,
  Heart,
  Target,
  Plus,
  Pencil,
  Trash2,
  DollarSign,
  TrendingUp,
  ArrowUpDown,
  PoundSterling,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useEcosystemEntries,
  useEcosystemSummary,
  useCreateEcosystem,
  useUpdateEcosystem,
  useDeleteEcosystem,
} from "../hooks";
import type { EcosystemEntry } from "../api/ecosystemApi";

const ACTIVITY_TYPES = [
  { value: "event", label: "Event", icon: Globe },
  { value: "speaking", label: "Speaking Engagement", icon: Mic },
  { value: "sponsorship", label: "Sponsorship", icon: DollarSign },
  { value: "referral-partner", label: "Referral Partner", icon: Handshake },
  { value: "business-network", label: "Business Network", icon: Network },
  { value: "community", label: "Community Activity", icon: Heart },
  {
    value: "strategic-partnership",
    label: "Strategic Partnership",
    icon: Target,
  },
];

const RELATIONSHIP_OPTIONS = ["low", "medium", "high"] as const;
const QUALITY_OPTIONS = ["poor", "average", "good", "excellent"] as const;

const QUALITY_COLORS: Record<string, string> = {
  excellent: "bg-emerald-500/10 text-emerald-600",
  good: "bg-emerald-500/10 text-emerald-600",
  average: "bg-amber-500/10 text-amber-600",
  poor: "bg-red-500/10 text-red-600",
};

const fmt = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;

type SortKey =
  | "name"
  | "activityType"
  | "date"
  | "cost"
  | "leadsGenerated"
  | "revenueConverted"
  | "roi"
  | "engagementQuality";
type SortDir = "asc" | "desc";

type FormData = {
  activityType: string;
  name: string;
  description: string;
  date: string;
  cost: number;
  leadsGenerated: number;
  followUpActions: number;
  opportunitiesCreated: number;
  revenueConverted: number;
  relationshipValue: string;
  engagementQuality: string;
};

const EMPTY: FormData = {
  activityType: "event",
  name: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  cost: 0,
  leadsGenerated: 0,
  followUpActions: 0,
  opportunitiesCreated: 0,
  revenueConverted: 0,
  relationshipValue: "medium",
  engagementQuality: "average",
};

export function EcosystemPage() {
  usePageTitle("Ecosystem Tracking");
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const { data, isLoading } = useEcosystemEntries({
    page,
    activityType: typeFilter || undefined,
  });
  const { data: summary } = useEcosystemSummary();
  const createMut = useCreateEcosystem();
  const updateMut = useUpdateEcosystem();
  const deleteMut = useDeleteEcosystem();

  function openCreate() {
    setEditId(null);
    setForm(EMPTY);
    setShowForm(true);
  }

  function openEdit(e: EcosystemEntry) {
    setEditId(e.id);
    setForm({
      activityType: e.activityType,
      name: e.name,
      description: e.description,
      date: new Date(e.date).toISOString().slice(0, 10),
      cost: e.cost,
      leadsGenerated: e.leadsGenerated,
      followUpActions: e.followUpActions,
      opportunitiesCreated: e.opportunitiesCreated,
      revenueConverted: e.revenueConverted,
      relationshipValue:
        typeof e.relationshipValue === "number"
          ? e.relationshipValue >= 7
            ? "high"
            : e.relationshipValue >= 4
              ? "medium"
              : "low"
          : (e.relationshipValue as string) || "medium",
      engagementQuality: e.engagementQuality || "average",
    });
    setShowForm(true);
  }

  async function handleSubmit() {
    if (!form.name.trim()) return toast.error("Name is required");
    const payload = {
      ...form,
      cost: Number(form.cost),
      leadsGenerated: Number(form.leadsGenerated),
      followUpActions: Number(form.followUpActions),
      opportunitiesCreated: Number(form.opportunitiesCreated),
      revenueConverted: Number(form.revenueConverted),
      relationshipValue:
        form.relationshipValue === "high"
          ? 8
          : form.relationshipValue === "medium"
            ? 5
            : 3,
      engagementQuality: form.engagementQuality,
    };
    try {
      if (editId) {
        await updateMut.mutateAsync({ id: editId, data: payload });
        toast.success("Activity updated successfully");
      } else {
        await createMut.mutateAsync(payload as never);
        toast.success("Activity logged successfully");
      }
      setShowForm(false);
    } catch {
      toast.error("Failed to save activity");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteMut.mutateAsync(deleteId);
      toast.success("Activity deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete activity");
    }
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const items = data?.items ?? [];
  const meta = data?.meta;

  // Compute ROI per item and best activity type
  const itemsWithROI = items.map((e) => ({
    ...e,
    roi: e.cost > 0 ? ((e.revenueConverted - e.cost) / e.cost) * 100 : 0,
  }));

  // Sort items
  const sorted = [...itemsWithROI].sort((a, b) => {
    let cmp = 0;
    switch (sortKey) {
      case "name":
        cmp = a.name.localeCompare(b.name);
        break;
      case "activityType":
        cmp = a.activityType.localeCompare(b.activityType);
        break;
      case "date":
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case "cost":
        cmp = a.cost - b.cost;
        break;
      case "leadsGenerated":
        cmp = a.leadsGenerated - b.leadsGenerated;
        break;
      case "revenueConverted":
        cmp = a.revenueConverted - b.revenueConverted;
        break;
      case "roi":
        cmp = a.roi - b.roi;
        break;
      case "engagementQuality": {
        const rank: Record<string, number> = {
          low: 0,
          medium: 1,
          high: 2,
          average: 1,
          good: 2,
          excellent: 3,
          poor: 0,
        };
        cmp =
          (rank[a.engagementQuality] ?? 0) - (rank[b.engagementQuality] ?? 0);
        break;
      }
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  // Compute best activity type
  const bestType = summary?.byType?.reduce(
    (best, t) => {
      const roi =
        t.totalCost > 0
          ? ((t.totalRevenue - t.totalCost) / t.totalCost) * 100
          : 0;
      return roi > best.roi ? { type: t.activityType, roi } : best;
    },
    { type: "—", roi: -Infinity },
  );

  const SortHeader = ({
    label,
    field,
    align = "left",
  }: {
    label: string;
    field: SortKey;
    align?: "left" | "right";
  }) => (
    <th
      className={cn(
        "px-4 py-3 font-medium cursor-pointer select-none hover:bg-muted/60 transition-colors",
        align === "right" ? "text-right" : "text-left",
      )}
      onClick={() => toggleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown
          className={cn(
            "h-3 w-3",
            sortKey === field ? "text-foreground" : "text-muted-foreground/40",
          )}
        />
      </span>
    </th>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Ecosystem & BD Tracking
          </h1>
          <p className="text-muted-foreground mt-1">
            Track events, partnerships, referrals and their impact on growth
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Log Activity
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <PoundSterling className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Total Ecosystem Cost
                </p>
                <p className="text-2xl font-bold">
                  {fmt(summary?.totalCost ?? 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                <Users className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Total Leads Generated
                </p>
                <p className="text-2xl font-bold">{summary?.totalLeads ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Total Revenue Converted
                </p>
                <p className="text-2xl font-bold">
                  {fmt(summary?.totalRevenue ?? 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Award className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Best Activity Type
                </p>
                <p className="text-lg font-bold capitalize">
                  {(bestType?.type ?? "—").replace("-", " ")}
                </p>
                {bestType && bestType.roi > -Infinity && (
                  <p className="text-xs text-emerald-600 font-medium">
                    {bestType.roi.toFixed(1)}% ROI
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Type Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={typeFilter === "" ? "default" : "outline"}
          onClick={() => {
            setTypeFilter("");
            setPage(1);
          }}
        >
          All
        </Button>
        {ACTIVITY_TYPES.map((t) => {
          const Icon = t.icon;
          return (
            <Button
              key={t.value}
              size="sm"
              variant={typeFilter === t.value ? "default" : "outline"}
              onClick={() => {
                setTypeFilter(t.value);
                setPage(1);
              }}
              className="gap-1.5"
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </Button>
          );
        })}
      </div>

      {/* Log Activity Form */}
      {showForm && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {editId ? "Edit" : "Log"} Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Type</Label>
                <select
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.activityType}
                  onChange={(e) =>
                    setForm({ ...form, activityType: e.target.value })
                  }
                >
                  {ACTIVITY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Name</Label>
                <Input
                  className="mt-1"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Tech Summit 2026"
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  className="mt-1"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <Label>Cost (£)</Label>
                <Input
                  className="mt-1"
                  type="number"
                  min={0}
                  value={form.cost || ""}
                  onChange={(e) => setForm({ ...form, cost: +e.target.value })}
                />
              </div>
              <div>
                <Label>Leads Generated</Label>
                <Input
                  className="mt-1"
                  type="number"
                  min={0}
                  value={form.leadsGenerated || ""}
                  onChange={(e) =>
                    setForm({ ...form, leadsGenerated: +e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Opportunities Created</Label>
                <Input
                  className="mt-1"
                  type="number"
                  min={0}
                  value={form.opportunitiesCreated || ""}
                  onChange={(e) =>
                    setForm({ ...form, opportunitiesCreated: +e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Revenue Converted (£)</Label>
                <Input
                  className="mt-1"
                  type="number"
                  min={0}
                  value={form.revenueConverted || ""}
                  onChange={(e) =>
                    setForm({ ...form, revenueConverted: +e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Relationship Value</Label>
                <select
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.relationshipValue}
                  onChange={(e) =>
                    setForm({ ...form, relationshipValue: e.target.value })
                  }
                >
                  {RELATIONSHIP_OPTIONS.map((q) => (
                    <option key={q} value={q}>
                      {q.charAt(0).toUpperCase() + q.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Engagement Quality</Label>
                <select
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.engagementQuality}
                  onChange={(e) =>
                    setForm({ ...form, engagementQuality: e.target.value })
                  }
                >
                  {QUALITY_OPTIONS.map((q) => (
                    <option key={q} value={q}>
                      {q.charAt(0).toUpperCase() + q.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <textarea
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px] resize-y"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Additional notes about this activity..."
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSubmit}
                disabled={createMut.isPending || updateMut.isPending}
              >
                {createMut.isPending || updateMut.isPending
                  ? "Saving..."
                  : editId
                    ? "Update"
                    : "Save"}
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
            <p className="text-sm">
              Are you sure you want to delete this activity?
            </p>
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

      {/* Activity Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center py-16">
              <Users className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <p className="font-semibold">
                No ecosystem activities logged yet
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Click <span className="font-medium">Log Activity</span> to get
                started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <SortHeader label="Name" field="name" />
                    <SortHeader label="Type" field="activityType" />
                    <SortHeader label="Date" field="date" />
                    <SortHeader label="Cost" field="cost" align="right" />
                    <SortHeader
                      label="Leads"
                      field="leadsGenerated"
                      align="right"
                    />
                    <SortHeader
                      label="Revenue"
                      field="revenueConverted"
                      align="right"
                    />
                    <SortHeader label="ROI" field="roi" align="right" />
                    <SortHeader label="Quality" field="engagementQuality" />
                    <th className="px-4 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((e, idx) => (
                    <tr
                      key={e.id}
                      className={cn(
                        "border-b transition-colors hover:bg-muted/30",
                        idx % 2 === 0 ? "bg-background" : "bg-muted/10",
                      )}
                    >
                      <td className="px-4 py-3 font-medium">{e.name}</td>
                      <td className="px-4 py-3 capitalize text-muted-foreground">
                        {e.activityType.replace(/-/g, " ")}
                      </td>
                      <td className="px-4 py-3 tabular-nums text-muted-foreground">
                        {new Date(e.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {fmt(e.cost)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {e.leadsGenerated}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {fmt(e.revenueConverted)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <span
                          className={cn(
                            "font-medium",
                            e.roi > 0
                              ? "text-emerald-600"
                              : e.roi < 0
                                ? "text-red-600"
                                : "text-muted-foreground",
                          )}
                        >
                          {e.roi.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                            QUALITY_COLORS[e.engagementQuality] || "bg-muted",
                          )}
                        >
                          {e.engagementQuality}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(e)}
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteId(e.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

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
