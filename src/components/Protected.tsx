import { Navigate } from "react-router-dom";
import { getUser } from "../lib/auth";
import type { Role } from "../lib/types";
import { Card, Shell } from "./ui";

export function Protected({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) {
    return <Shell><Card className="p-8 text-center"><h1 className="text-2xl font-bold">Access restricted</h1><p className="mt-2 text-slate-600">This route is not available for your account role.</p></Card></Shell>;
  }
  return <>{children}</>;
}
