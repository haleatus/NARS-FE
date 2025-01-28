import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

import { Inter, Work_Sans, Lora } from "next/font/google";
import NavigationBarServer from "./_components/navigation/nav-bar-server";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/context/user-context";
import { AmbulanceProvider } from "@/context/ambulance-context";
import { AdminProvider } from "@/context/admin-context";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const work_sans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
});

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "NARS App",
  description: "NARS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-gradient-to-br from-white to-[#FEE9E9] ${inter.variable} ${lora.variable} ${work_sans.variable}`}
      >
        <UserProvider>
          <AmbulanceProvider>
            <AdminProvider>
              <TooltipProvider>
                <NavigationBarServer />
                <div className="max-w-8xl mx-auto px-4">{children}</div>
                <Toaster closeButton richColors />
              </TooltipProvider>
            </AdminProvider>
          </AmbulanceProvider>
        </UserProvider>
      </body>
    </html>
  );
}
