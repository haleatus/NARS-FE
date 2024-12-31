import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { NavigationBar } from "@/components/navigation/nav-bar";

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
      <body>
        <NavigationBar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
