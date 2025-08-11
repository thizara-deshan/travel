import { requireRole } from "@/lib/requireRole";
import { getEmployees, getUserData } from "@/lib/getUserData";

import SuperAdminDashboard from "@/components/SuperAdmin/SuperAdminDashboard";

export default async function SuperAdminDashboardPage() {
  await requireRole("SUPER_ADMIN");
  const user = await getUserData();

  const employeeData = await getEmployees();

  return <SuperAdminDashboard user={user} employeeData={employeeData} />;
}
