// import { requireRole } from "@/lib/requireRole";
import ClientDashboard from "@/components/customer/ClientDashboard";
import { getUserData } from "@/lib/getUserData";

export default async function ClientDashboardPage() {
  const user = await getUserData();

  return <ClientDashboard user={user} />;
}
