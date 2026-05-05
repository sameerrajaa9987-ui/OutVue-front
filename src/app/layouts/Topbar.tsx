import { useNavigate } from "react-router-dom";
import { LogOut, UserCircle2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearAuth } from "@/modules/auth/authSlice";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Topbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  function handleLogout() {
    dispatch(clearAuth());
    navigate("/login", { replace: true });
  }

  const statusVariant =
    user?.subscriptionStatus === "active"
      ? "success"
      : user?.subscriptionStatus === "trial"
        ? "secondary"
        : "outline";

  return (
    <header className="sticky top-0 z-10 border-b border-border/70 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-14 items-center gap-3 px-4">
        <div className="flex-1" />

        <div className="flex items-center gap-3">
          {user?.subscriptionStatus && (
            <Badge variant={statusVariant} className="hidden sm:flex capitalize">
              {user.subscriptionStatus}
            </Badge>
          )}

          <ModeToggle />

          <div className="hidden sm:block text-right">
            <div className="text-sm font-semibold text-foreground">
              {user?.name || "User"}
            </div>
            <div className="text-xs text-muted-foreground">
              {user?.role || ""}
            </div>
          </div>

          <UserCircle2 className="h-8 w-8 text-primary/70" />

          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-1.5 h-3.5 w-3.5" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
