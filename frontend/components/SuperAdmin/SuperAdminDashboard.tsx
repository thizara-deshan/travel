"use client";

import { useState } from "react";
import Layout from "@/components/SuperAdmin/layout";
import EmployeesManageSection from "./Employees";
import AllBookings from "./AllBookings";
import { Employee } from "@/lib/types";
import Profile from "../Profile";
import RevenueReport from "./RevenueRepot";

type SuperAdminDashboardProps = {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
  employeeData: Employee[] | null;
};

export default function SuperAdminDashboard({
  user,
  employeeData,
}: SuperAdminDashboardProps) {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "all-bookings":
        return <AllBookings user={user} employeeData={employeeData} />;
      case "manage-employees":
        return <EmployeesManageSection user={user} />;

      case "profile":
        return <Profile />;
      case "revenue-report":
        return <RevenueReport />;
      default:
        return <AllBookings user={user} employeeData={employeeData} />;
    }
  };

  return (
    <Layout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      user={user}
    >
      {renderContent()}
    </Layout>
  );
}
