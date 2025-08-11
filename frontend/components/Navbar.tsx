"use client";

import Image from "next/image";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import { Menu, Plane, MapPin, Users, PhoneCall } from "lucide-react";
import { useState } from "react";
import React from "react";

type NavigationType = {
  name: string;
  href: string;
  icon: React.ElementType;
};

const navigation: NavigationType[] = [
  { name: "About Us", href: "/#about", icon: Users },
  { name: "Tour Packages", href: "/tour-packages", icon: Plane },
  { name: "Destinations", href: "/destinations", icon: MapPin },
  { name: "Login", href: "/login", icon: PhoneCall },
  { name: "Register", href: "/register", icon: PhoneCall },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  const closeSheet = () => setOpen(false);
  return (
    <>
      <header className=" relative container mx-auto py-6 inset-x-0  z-50">
        <nav className=" flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex lg:flex-1 gap-3 items-center">
            <Link href="/">
              <span className="sr-only">BlueLanka Travels & Tours </span>
              <Image
                alt="BlueLanka travels and tours"
                src="/logo.png"
                width={110}
                height={100}
              />
            </Link>
            <span className="hidden lg:inline-flex text-lg font-bold tracking-tighter text-blue-900">
              BlueLanka Travels & Tours
            </span>
          </div>

          <div className="flex lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden ">
                  <Menu className="h-6 w-6 " />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex flex-col items-center gap-8 text-xl font-bold tracking-tighter ">
                    <div>
                      <Link href="/" onClick={closeSheet}>
                        <Image
                          alt="BlueLanka travels and tours"
                          src="/logo.png"
                          width={150}
                          height={100}
                        />
                      </Link>
                    </div>
                    <span>
                      Welcome to{" "}
                      <span className="text-blue-900  ">
                        BlueLanka Travels & Tours
                      </span>
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col space-y-4 gap-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeSheet}
                      className="flex items-center gap-2 text-lg hover:text-blue-600"
                    >
                      <item.icon />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden lg:flex lg:gap-x-8 items-center justify-center">
            <div className="hidden lg:flex lg:gap-x-8">
              {navigation
                .map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-base font-semibold leading-6 text-gray-900 hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                ))
                .slice(0, 3)}
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end px-2 space-x-4">
              <Button
                asChild
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 bg-transparent"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
