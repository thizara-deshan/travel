"use client";

import { useState } from "react";
import Layout from "./layout";
import Dashboard from "./Dashboard";
import Destinations from "./Destinations";
import Packages from "./Packages";
import Booking from "./Booking";
import Profile from "../Profile";

type ClientDashboardProps = {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
};

export default function ClientDashboard({ user }: ClientDashboardProps) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [packageId, setPackageId] = useState(1);
  const renderContent = () => {
    switch (activeSection) {
      case "destinations":
        return <Destinations />;
      case "packages":
        return (
          <Packages
            onSectionChange={setActiveSection}
            setPackageId={setPackageId}
          />
        );
      case "booking":
        return (
          <Booking
            selectedPackageId={packageId}
            onSectionChange={setActiveSection}
          />
        );
      case "profile":
        return <Profile />;
      default:
        return <Dashboard onSectionChange={setActiveSection} user={user} />;
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
