import { verifyToken } from "./authServer";
import { redirect } from "next/navigation";

export async function requireRole(requiredRole: string) {
  const { valid, user } = await verifyToken();

  if (!valid || user?.role !== requiredRole) {
    redirect("/login");
  }

  return user; // optionally return user info if needed
}
