import { useState } from "react";
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
  { value: "speaking", label: "Speaking", icon: Mic },
  { value: "sponsorship", label: "Sponsorship", icon: DollarSign },
  { value: "referral-partner", label: "Referral Partner", icon: Handshake },
  { value: "business-network", label: "Business Network", icon: Network },
  { value: "community", label: "Community", icon: Heart },
  {
    value: "strategic-partnership",
    label: "Strategic Partnership",
    icon: Target,
  },
];

const QUALITY_OPTIONS = ["excellent", "good", "average", "poor"];

const QUALITY_COLORS: Record<string, string> = {
  excellent: "bg-emerald-500/10 text-emerald-600",
  good: "bg-blue-500/10 text-blue-600",
  average: "bg-amber-500/10 text-amber-600",
  poor: "bg-red-500/10 text-red-600",
};

const fmt = (n: number) => `£${n.toLocaleString("en-GB")}`;

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
  relationshipValue: number;
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
  relationshipValue: 0,
  engagementQuality: "average",
};

export function EcosystemPage() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
      relationshipValue: e.relationshipValue,
      engagementQuality: e.engagementQuality,
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
      relationshipValue: Number(form.relationshipValue),
    };
    if (editId) {
      await updateMut.mutateAsync({ id: editId, data: payload });
      toast.success("Entry updated");
    } else {
      await createMut.mutateAsync(payload as never);
      toast.success("Entry created");
    }
    setShowForm(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    await deleteMut.mutateAsync(deleteId);
    toast.success("Entry deleted");
    setDeleteId(null);
  }

  const items = data?.items ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Ecosystem & BD Tracking
          </h1>
          <p className="text-muted-foreground mt-1">
            Track relationship-led growth activities and their impact.
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
            <p className="text-xs text-muted-foreground">Activities</p>
            <p className="text-2xl font-bold">
              {summary?.totalActivities ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Cost</p>
            <p className="text-2xl font-bold">{fmt(summary?.totalCost ?? 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Leads Generated</p>
            <p className="text-2xl font-bold">{summary?.totalLeads ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <p className="text-xs text-muted-foreground">ROI</p>
            </div>
            <p className="text-2xl font-bold">
              {(summary?.roi ?? 0).toFixed(1)}%
            </p>
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

      {/* Form Slide */}
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
                <Label>Activity Type</Label>
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
            <div>
              <Label>Description</Label>
              <Input
                className="mt-1"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <Label>Cost</Label>
                <Input
                  className="mt-1"
                  type="number"
                  min={0}
                  value={form.cost}
                  onChange={(e) => setForm({ ...form, cost: +e.target.value })}
                />
              </div>
              <div>
                <Label>Leads Generated</Label>
                <Input
                  className="mt-1"
                  type="number"
                  min={0}
                  value={form.leadsGenerated}
                  onChange={(e) =>
                    setForm({ ...form, leadsGenerated: +e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Follow-up Actions</Label>
                <Input
                  className="mt-1"
                  type="number"
                  min={0}
                  value={form.followUpActions}
                  onChange={(e) =>
                    setForm({ ...form, followUpActions: +e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Opportunities</Label>
                <Input
                  className="mt-1"
                  type="number"
                  min={0}
                  value={form.opportunitiesCreated}
                  onChange={(e) =>
                    setForm({ ...form, opportunitiesCreated: +e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Revenue Converted</Label>
                <Input
                  className="mt-1"
                  type="number"
                  min={0}
                  value={form.revenueConverted}
                  onChange={(e) =>
                    setForm({ ...form, revenueConverted: +e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Relationship Value</Label>
                <Input
                  className="mt-1"
                  type="number"
                  min={0}
                  value={form.relationshipValue}
                  onChange={(e) =>
                    setForm({ ...form, relationshipValue: +e.target.value })
                  }
                />
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
            <p className="text-sm">
              Are you sure you want to delete this entry?
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

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center py-16">
              <Users className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <p className="font-semibold">No activities logged yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start tracking your ecosystem activities.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Type</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-right font-medium">Cost</th>
                    <th className="px-4 py-3 text-right font-medium">Leads</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Revenue
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Quality</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((e, idx) => (
                    <tr
                      key={e.id}
                      className={cn(
                        "border-b",
                        idx % 2 === 0 ? "bg-background" : "bg-muted/10",
                      )}
                    >
                      <td className="px-4 py-3 font-medium">{e.name}</td>
                      <td className="px-4 py-3 capitalize text-muted-foreground">
                        {e.activityType.replace("-", " ")}
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
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteId(e.id)}
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
