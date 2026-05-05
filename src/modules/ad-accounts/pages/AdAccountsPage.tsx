import { useState, useCallback } from "react";
import { Plus, Trash2, Link2, Unlink, RefreshCw, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/http";
import { cn } from "@/lib/utils";
import {
  useAdAccountList,
  useConnectAdAccount,
  useRemoveAdAccount,
  useUpdateAdAccount,
  useTriggerSyncAll,
  useTriggerSyncOne,
  useSyncLogs,
} from "../hooks";
import type { AdAccount } from "../types";
import { AD_PLATFORMS, STATUS_COLORS } from "../types";
import { ConnectAccountDialog } from "../components/ConnectAccountDialog";

function platformLabel(val: string) {
  return AD_PLATFORMS.find((p) => p.value === val)?.label ?? val;
}

function platformIcon(platform: string) {
  if (platform === "meta") return "📘";
  if (platform === "google") return "🔴";
  if (platform === "linkedin") return "🔵";
  return "🔗";
}

export function AdAccountsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdAccount | null>(null);

  const { data: accounts, isLoading } = useAdAccountList();
  const connectMut = useConnectAdAccount();
  const removeMut = useRemoveAdAccount();
  const updateMut = useUpdateAdAccount();
  const syncAllMut = useTriggerSyncAll();
  const syncOneMut = useTriggerSyncOne();
  const { data: logsData } = useSyncLogs({ limit: 10 });

  const openConnect = useCallback(() => setDialogOpen(true), []);

  async function handleConnect(values: Record<string, unknown>) {
    try {
      const result = await connectMut.mutateAsync(values as never);
      if (result.tokenValid) {
        toast.success("Account connected successfully");
      } else {
        toast.warning(
          result.validationMessage ||
            "Account saved but token could not be verified",
        );
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await removeMut.mutateAsync(deleteTarget.id);
      toast.success("Account disconnected");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  async function toggleStatus(account: AdAccount) {
    const newStatus = account.status === "active" ? "inactive" : "active";
    try {
      await updateMut.mutateAsync({
        id: account.id,
        data: { status: newStatus },
      });
      toast.success(
        `Account ${newStatus === "active" ? "activated" : "deactivated"}`,
      );
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Connected Ad Accounts
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect your advertising platforms to enable automatic data syncing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {accounts && accounts.length > 0 && (
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const results = await syncAllMut.mutateAsync();
                  const ok = results.filter(
                    (r) => r.status === "success",
                  ).length;
                  toast.success(
                    `Sync complete: ${ok}/${results.length} accounts synced`,
                  );
                } catch (err) {
                  toast.error(getApiErrorMessage(err));
                }
              }}
              disabled={syncAllMut.isPending}
            >
              <RefreshCw
                className={cn(
                  "mr-2 h-4 w-4",
                  syncAllMut.isPending && "animate-spin",
                )}
              />
              {syncAllMut.isPending ? "Syncing…" : "Sync All"}
            </Button>
          )}
          <Button onClick={openConnect}>
            <Plus className="mr-2 h-4 w-4" />
            Connect Account
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : !accounts || accounts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Plug className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold">No accounts connected</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Connect your Meta, Google, or LinkedIn ad accounts to start
              syncing campaign data automatically.
            </p>
            <Button className="mt-4" onClick={openConnect}>
              <Plus className="mr-2 h-4 w-4" />
              Connect Your First Account
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((acc) => (
            <Card key={acc.id} className="relative overflow-hidden">
              <div
                className={cn(
                  "absolute top-0 left-0 right-0 h-1",
                  acc.status === "active"
                    ? "bg-emerald-500"
                    : acc.status === "error"
                      ? "bg-red-500"
                      : "bg-gray-300",
                )}
              />
              <CardContent className="p-5 pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {platformIcon(acc.platform)}
                    </span>
                    <div>
                      <h3 className="font-semibold">
                        {platformLabel(acc.platform)}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        {acc.accountId}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
                      STATUS_COLORS[acc.status] ?? "bg-gray-100 text-gray-800",
                    )}
                  >
                    {acc.status}
                  </span>
                </div>

                {acc.label && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {acc.label}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <RefreshCw className="h-3 w-3" />
                  {acc.lastSynced
                    ? `Last synced: ${new Date(acc.lastSynced).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}`
                    : "Never synced"}
                </div>

                <div className="flex items-center gap-2 border-t pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        await syncOneMut.mutateAsync(acc.id);
                        toast.success(`${platformLabel(acc.platform)} synced`);
                      } catch (err) {
                        toast.error(getApiErrorMessage(err));
                      }
                    }}
                    disabled={syncOneMut.isPending || acc.status === "inactive"}
                  >
                    <RefreshCw
                      className={cn(
                        "mr-1.5 h-3.5 w-3.5",
                        syncOneMut.isPending && "animate-spin",
                      )}
                    />
                    Sync
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleStatus(acc)}
                    disabled={updateMut.isPending}
                  >
                    {acc.status === "active" ? (
                      <>
                        <Unlink className="mr-1.5 h-3.5 w-3.5" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Link2 className="mr-1.5 h-3.5 w-3.5" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteTarget(acc)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Sync Logs */}
      {logsData && logsData.data.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold mb-3">Recent Sync Activity</h3>
            <div className="space-y-2">
              {logsData.data.map((log) => (
                <div
                  key={log.id}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-3 text-sm",
                    log.status === "success"
                      ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20"
                      : log.status === "error"
                        ? "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20"
                        : "border-border bg-muted/20",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        log.status === "success"
                          ? "bg-emerald-500"
                          : log.status === "error"
                            ? "bg-red-500"
                            : log.status === "running"
                              ? "bg-amber-500 animate-pulse"
                              : "bg-gray-400",
                      )}
                    />
                    <div>
                      <span className="font-medium capitalize">
                        {log.platform}
                      </span>
                      <span className="text-muted-foreground mx-1.5">—</span>
                      <span className="text-muted-foreground">
                        {log.message || log.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {log.campaignsSynced > 0 && (
                      <span>{log.campaignsSynced} campaigns</span>
                    )}
                    {log.durationMs > 0 && (
                      <span>{(log.durationMs / 1000).toFixed(1)}s</span>
                    )}
                    <span>
                      {new Date(log.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connect Dialog */}
      <ConnectAccountDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleConnect}
        isPending={connectMut.isPending}
      />

      {/* Delete Confirmation */}
      {deleteTarget && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="fixed inset-x-4 top-[30%] z-50 mx-auto max-w-sm rounded-xl border bg-background p-6 shadow-2xl sm:inset-x-auto sm:w-[400px]">
            <h3 className="text-lg font-semibold">Disconnect Account</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Are you sure you want to disconnect{" "}
              <strong>{platformLabel(deleteTarget.platform)}</strong> account{" "}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                {deleteTarget.accountId}
              </code>
              ? This will remove all stored tokens.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={removeMut.isPending}
              >
                {removeMut.isPending ? "Disconnecting…" : "Disconnect"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
