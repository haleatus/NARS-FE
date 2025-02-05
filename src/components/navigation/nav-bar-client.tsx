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
import { LucideGitCompareArrows, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import SignoutButton from "../auth/user/signout-button";
import AmbulanceSignoutButton from "../auth/ambulance/ambulance-signout-button";
import AdminSignoutButton from "../auth/admin/admin-signout-button";
import { AuthState } from "@/core/interface/auth-state.inteface";
import { getNavLinks } from "@/core/utils/nav-links";

interface NavigationBarClientProps {
  authState: AuthState;
}

export function NavigationBarClient({ authState }: NavigationBarClientProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = getNavLinks(authState);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const renderAuthButtons = () => {
    if (authState.isAdmin) return <AdminSignoutButton />;
    if (authState.isAmbulance) return <AmbulanceSignoutButton />;
    if (authState.isUser) return <SignoutButton />;

    return (
      <>
        <Link
          href="/signin"
          className={cn(
            "text-gray-700 hover:text-red-600 relative py-1",
            "after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-red-600 after:transition-transform after:duration-300",
            isActiveLink("/signin") && "text-gray-900 after:scale-x-100"
          )}
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className={cn(
            "bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full transition-colors",
            isActiveLink("/signup") && "bg-black"
          )}
        >
          Sign up →
        </Link>
      </>
    );
  };

  const NavLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <Link
      href={href}
      className={`flex items-center gap-2 p-2 rounded-md hover:text-gray-800 ${
        pathname === href ? "text-red-500" : ""
      }`}
      onClick={() => setIsOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <nav
      className="bg-transparent backdrop-blur-md max-w-8xl mx-auto px-4 md:px-8 sticky top-0 z-50 font-sans font-medium"
      aria-label="Main navigation"
    >
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-primary"
            aria-label="NARS Home"
          >
            <LucideGitCompareArrows className="h-6 w-6" aria-hidden="true" />
            <span>NARS</span>
          </Link>

          {/* Desktop Navigation */}
          <div
            className="hidden md:flex items-center  gap-4 font-work-sans text-sm"
            role="navigation"
            aria-label="Desktop menu"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "hover:text-red-600 relative py-1",
                  "after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-red-600 after:transition-transform after:duration-300",
                  isActiveLink(link.href) && "text-gray-900 after:scale-x-100"
                )}
              >
                {link.label}
              </Link>
            ))}
            {renderAuthButtons()}
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
                    <LucideGitCompareArrows
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                    NARS
                  </Link>
                </div>
                <nav className="flex flex-col gap-2" aria-label="Mobile menu">
                  {navLinks.map((link) => (
                    <NavLink key={link.href} href={link.href}>
                      {link.label}
                    </NavLink>
                  ))}
                  {renderAuthButtons()}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
