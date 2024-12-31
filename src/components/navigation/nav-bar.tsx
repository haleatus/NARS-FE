"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Ambulance,
  LayoutDashboard,
  Home,
  LogIn,
  UserPlus,
  Menu,
} from "lucide-react";

export function NavigationBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const NavLink = ({
    href,
    icon: Icon,
    children,
  }: {
    href: string;
    icon: React.ElementType;
    children: React.ReactNode;
  }) => (
    <Link
      href={href}
      className={`flex items-center gap-2 p-2 rounded-md hover:bg-accent ${
        pathname === href ? "text-primary" : ""
      }`}
      onClick={() => setIsOpen(false)}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {children}
    </Link>
  );

  return (
    <nav
      className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-primary"
            aria-label="NARS Home"
          >
            <Ambulance className="h-6 w-6" aria-hidden="true" />
            NARS
          </Link>

          {/* Desktop Navigation */}
          <div
            className="hidden md:flex items-center gap-4"
            role="navigation"
            aria-label="Desktop menu"
          >
            <NavLink href="/" icon={Home}>
              Home
            </NavLink>
            <NavLink href="/driver" icon={Ambulance}>
              Driver
            </NavLink>
            <NavLink href="/admin" icon={LayoutDashboard}>
              Admin
            </NavLink>
            <NavLink href="/signin" icon={LogIn}>
              Sign In
            </NavLink>
            <Button asChild variant="outline">
              <NavLink href="/signup" icon={UserPlus}>
                Sign Up
              </NavLink>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    className="flex items-center gap-2 font-bold text-xl text-primary"
                    onClick={() => setIsOpen(false)}
                    aria-label="NARS Home"
                  >
                    <Ambulance className="h-6 w-6" aria-hidden="true" />
                    NARS
                  </Link>
                </div>
                <nav className="flex flex-col gap-2" aria-label="Mobile menu">
                  <NavLink href="/" icon={Home}>
                    Home
                  </NavLink>
                  <NavLink href="/driver" icon={Ambulance}>
                    Driver
                  </NavLink>
                  <NavLink href="/admin" icon={LayoutDashboard}>
                    Admin
                  </NavLink>
                  <NavLink href="/signin" icon={LogIn}>
                    Sign In
                  </NavLink>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <NavLink href="/signup" icon={UserPlus}>
                      Sign Up
                    </NavLink>
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
