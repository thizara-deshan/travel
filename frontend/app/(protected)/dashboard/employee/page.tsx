// import { requireRole } from "@/lib/requireRole";
import { getUserData } from "@/lib/getUserData";

import EmployeeDashboard from "@/components/Employee/EmployeeDashboard";

export default async function EmployeeDashboardPage() {
  // await requireRole("EMPLOYEE");
  const user = await getUserData();

  return <EmployeeDashboard user={user} />;
}
