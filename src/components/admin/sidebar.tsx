"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Ambulance,
  ClipboardList,
  Users,
  UserCog,
  User,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Ambulance", href: "/admin/ambulance", icon: Ambulance },
  {
    name: "Ambulance Requests",
    href: "/admin/ambulance-requests",
    icon: ClipboardList,
  },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Admin Users", href: "/admin/admin-users", icon: UserCog },
  { name: "My Profile", href: "/admin/my-profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-md rounded-lg font-work-sans">
      <div className="p-2 flex justify-center items-center border-b">
        <h1 className="text-xl font-bold font-lora">Admin User Name</h1>
      </div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100",
                  pathname === item.href && "bg-gray-100 font-medium"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
