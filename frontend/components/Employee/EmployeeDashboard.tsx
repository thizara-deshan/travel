"use client";

import { useState } from "react";
import Layout from "@/components/Employee/layout";

import AssignedBookings from "./AssignedBookings";
import TourPackages from "./TourPackage";
import CreatePackage from "./CreatePackage";
import Profile from "../Profile";

type EmployeeDashboardProps = {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
};

export default function EmployeeDashboard({ user }: EmployeeDashboardProps) {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "tour-packages":
        return <TourPackages onSectionChange={setActiveSection} user={user} />;

      case "assigned-bookings":
        return <AssignedBookings />;
      case "create-tour-package":
        return <CreatePackage onSectionChange={setActiveSection} user={user} />;
      case "profile":
        return <Profile />;
      default:
        return <AssignedBookings />;
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
