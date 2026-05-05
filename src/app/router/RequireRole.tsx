import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import type { Role } from "@/modules/auth/types";

type Props = {
  children: ReactNode;
  roles: Role[];
};

export function RequireRole({ children, roles }: Props) {
  const role = useAppSelector((s) => s.auth.user?.role);

  if (!role || !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
