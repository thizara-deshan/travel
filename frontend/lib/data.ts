// src/data/mockData.ts
import {
  Package,
  Compass,
  CreditCard,
  Home,
  Users,
  Calendar,
} from "lucide-react";
import { MenuItem, MenuItemforSuperAdmin } from "@/lib/types";

export const menuItems: MenuItem[] = [
  { title: "Dashboard", icon: Home, id: "dashboard" },
  { title: "Destinations", icon: Compass, id: "destinations" },
  { title: "Tour Packages", icon: Package, id: "packages" },
  { title: "Book Now", icon: CreditCard, id: "booking" },
];

export const menuItemsforSuperAdmin: MenuItemforSuperAdmin[] = [
  { title: "All Bookings", icon: Calendar, id: "all-bookings" },
  { title: "Employees", icon: Users, id: "manage-employees" },
  { title: "Revenue Report", icon: Calendar, id: "revenue-report" },
];

export const menuItemsforEmployee: MenuItem[] = [
  { title: "Assigned Bookings", icon: Users, id: "assigned-bookings" },
  { title: "Tour Packages", icon: Package, id: "tour-packages" },
  { title: "Create Tour Package", icon: Package, id: "create-tour-package" },
];
