import { Users, Shield, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAdminUsers } from "../hooks";

const STATUS_COLORS: Record<string, string> = {
  trial: "bg-blue-500",
  pilot: "bg-violet-500",
  active: "bg-emerald-500",
  suspended: "bg-amber-500",
  cancelled: "bg-red-500",
};

const ROLE_COLORS: Record<string, string> = {
  Admin: "bg-red-500/10 text-red-600",
  Manager: "bg-violet-500/10 text-violet-600",
  User: "bg-blue-500/10 text-blue-600",
};

export function AdminUsersPage() {
  const { data: users, isLoading } = useAdminUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin: Users</h1>
        <p className="text-muted-foreground mt-1">Manage all platform users and their subscriptions.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-2xl font-bold">{users?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-5 w-5 mx-auto text-emerald-500 mb-1" />
            <p className="text-2xl font-bold">{users?.filter((u) => u.isActive).length ?? 0}</p>
            <p className="text-xs text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto text-blue-500 mb-1" />
            <p className="text-2xl font-bold">{users?.filter((u) => u.subscription?.status === "trial").length ?? 0}</p>
            <p className="text-xs text-muted-foreground">On Trial</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">All Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : !users || users.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Role</th>
                    <th className="px-4 py-3 text-left font-medium">Plan</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr key={u.id} className={cn("border-b", idx % 2 === 0 ? "bg-background" : "bg-muted/10")}>
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", ROLE_COLORS[u.role] || "bg-muted")}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 capitalize">{u.subscription?.tier || "—"}</td>
                      <td className="px-4 py-3">
                        {u.subscription ? (
                          <span className="inline-flex items-center gap-1.5 text-xs">
                            <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_COLORS[u.subscription.status] || "bg-gray-400")} />
                            <span className="capitalize">{u.subscription.status}</span>
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">
                        {new Date(u.createdAt).toLocaleDateString("en-GB")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
