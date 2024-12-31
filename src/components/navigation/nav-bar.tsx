"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Ambulance, LayoutDashboard, Home } from "lucide-react";

export function NavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-primary"
          >
            <Ambulance className="h-6 w-6" />
            NARS
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link
                href="/"
                className={`flex items-center gap-2 ${
                  pathname === "/" ? "text-primary" : ""
                }`}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link
                href="/driver"
                className={`flex items-center gap-2 ${
                  pathname === "/driver" ? "text-primary" : ""
                }`}
              >
                <Ambulance className="h-4 w-4" />
                Driver
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link
                href="/admin"
                className={`flex items-center gap-2 ${
                  pathname === "/admin" ? "text-primary" : ""
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
