import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/authServer";

export default async function DashboardRootPage() {
  const { valid, user } = await verifyToken();

  if (!valid) return redirect("/login");

  if (user?.role === "SUPER_ADMIN") return redirect("/dashboard/super-admin");
  if (user?.role === "EMPLOYEE") return redirect("/dashboard/employee");
  if (user?.role === "CUSTOMER") return redirect("/dashboard/customer");

  return <p>Unknown role</p>;
}
