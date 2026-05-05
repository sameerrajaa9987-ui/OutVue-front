import { useState } from "react";
import {
  Shield,
  FileText,
  Database,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useDisclaimer,
  useGdprNotice,
  useDataSources,
  useAuditLogs,
  useAcknowledgeLog,
} from "../hooks";

const EVENT_LABELS: Record<string, string> = {
  recommendation_generated: "Recommendation Generated",
  recommendation_acknowledged: "Recommendation Acknowledged",
  action_created: "Action Created",
  report_downloaded: "Report Downloaded",
};

export function CompliancePage() {
  const [logPage, setLogPage] = useState(1);
  const { data: disclaimer, isLoading: dLoading } = useDisclaimer();
  const { data: gdpr, isLoading: gLoading } = useGdprNotice();
  const { data: dataSources, isLoading: dsLoading } = useDataSources();
  const { data: logsData, isLoading: lLoading } = useAuditLogs({
    page: logPage,
    limit: 20,
  });
  const ackMut = useAcknowledgeLog();

  async function handleAck(id: string) {
    await ackMut.mutateAsync(id);
    toast.success("Recommendation acknowledged");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Compliance & Data Governance
        </h1>
        <p className="text-muted-foreground mt-1">
          Transparency, audit trail, and UK GDPR compliance.
        </p>
      </div>

      {/* Disclaimer Banner */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="p-5 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">AI Disclaimer</p>
            {dLoading ? (
              <Skeleton className="h-4 w-full mt-1" />
            ) : (
              <p className="text-sm text-muted-foreground mt-1">{disclaimer}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* GDPR Notice */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              UK GDPR Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4" />
                ))}
              </div>
            ) : gdpr ? (
              <dl className="space-y-3 text-sm">
                {Object.entries(gdpr).map(([key, val]) => (
                  <div key={key}>
                    <dt className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </dt>
                    <dd className="text-muted-foreground mt-0.5">{val}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4 text-violet-500" />
              Data Source Transparency
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-8" />
                ))}
              </div>
            ) : !dataSources || dataSources.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No data sources yet.
              </p>
            ) : (
              <div className="space-y-2">
                {dataSources.map((ds) => (
                  <div
                    key={ds.source}
                    className="flex items-center justify-between bg-muted/40 rounded-lg p-3"
                  >
                    <span className="text-sm font-medium capitalize">
                      {ds.source.replace(/([a-z])([A-Z])/g, "$1 $2")}
                    </span>
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {ds.records} records
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Audit Log */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {lLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : !logsData || logsData.items.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              No audit entries yet. They are created automatically when
              recommendations are generated.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="px-4 py-3 text-left font-medium">Event</th>
                      <th className="px-4 py-3 text-left font-medium">
                        Details
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        Timestamp
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {logsData.items.map((log, idx) => (
                      <tr
                        key={log.id}
                        className={cn(
                          "border-b",
                          idx % 2 === 0 ? "bg-background" : "bg-muted/10",
                        )}
                      >
                        <td className="px-4 py-3 font-medium">
                          {EVENT_LABELS[log.eventType] || log.eventType}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                          {log.payload?.count
                            ? `${log.payload.count} items`
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          {log.acknowledged ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                              <CheckCircle2 className="h-3 w-3" />
                              Acknowledged
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                              <Clock className="h-3 w-3" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 tabular-nums text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString("en-GB")}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {!log.acknowledged && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              onClick={() => handleAck(log.id)}
                              disabled={ackMut.isPending}
                            >
                              <Eye className="h-3 w-3" />
                              Acknowledge
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {logsData.meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 p-4">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!logsData.meta.hasPrevPage}
                    onClick={() => setLogPage((p) => p - 1)}
                  >
                    Prev
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {logsData.meta.page} / {logsData.meta.totalPages}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!logsData.meta.hasNextPage}
                    onClick={() => setLogPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
