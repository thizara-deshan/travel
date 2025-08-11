"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

const HIDDEN_PATHS = [
  "/dashboard/customer",
  "/dashboard/employee",
  "/dashboard/super-admin",
];

export default function NavbarWrapper() {
  const pathname = usePathname();

  const shouldHideNavbar = HIDDEN_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (shouldHideNavbar) return null;

  return <Navbar />;
}
