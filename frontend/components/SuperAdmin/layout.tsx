"use client";

import { useState } from "react";
import { Menu, X, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { menuItemsforSuperAdmin } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { logout } from "@/lib/logout";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function Layout({
  children,
  activeSection,
  onSectionChange,
  user,
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push("/"); // Redirect to home page
    } else {
      console.error(result.error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-blue-200 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-100">
          <div className="flex items-center">
            <div className=" w-20 h-20 flex items-center justify-center mr-3">
              <Link href="/">
                <span className="sr-only">BlueLanka Travels & Tours </span>
                <Image
                  alt="travels and tours"
                  src="/logo.png"
                  width={150}
                  height={100}
                />
              </Link>
            </div>
            <span className="text-lg font-semibold text-blue-900">
              BlueLanka Travels & Tours
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-blue-600"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Profile Section */}
        <div className="px-6 py-6 border-b border-blue-100">
          <div className="text-sm font-medium text-blue-900 mb-4">Profile</div>
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback className="bg-blue-100 text-blue-700">
                User
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-blue-900">{user?.name}</p>
              <p className="text-xs text-blue-600">{user?.email}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start border-blue-200 text-blue-700 bg-transparent hover:bg-blue-50"
              >
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <button onClick={() => onSectionChange("profile")}>
                  <span className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </span>
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button onClick={() => handleLogout()}>
                  <span className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-6 py-6">
          <div className="text-sm font-medium text-blue-900 mb-4">
            Navigation
          </div>
          <nav className="space-y-2">
            {menuItemsforSuperAdmin.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-100 text-blue-900 font-medium"
                    : "text-blue-700 hover:bg-blue-50 hover:text-blue-900"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-blue-100">
          <div className="text-center">
            <p className="text-xs text-blue-600">© 2024 BlueLanka</p>
            <p className="text-xs text-blue-500">Your travel companion</p>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-blue-100 px-4 py-4 flex items-center justify-between lg:justify-start">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-blue-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-4">
            <div className="w-px h-6 bg-blue-200 hidden lg:block" />
            <h1 className="text-lg font-semibold text-blue-900 capitalize">
              {activeSection}
            </h1>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
