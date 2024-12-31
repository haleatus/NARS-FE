import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { NavigationBar } from "@/components/navigation/nav-bar";

import { Inter, Work_Sans, Lora } from "next/font/google";

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
        className={`bg-gradient-to-br from-white to-[#FEE9E9] max-w-8xl mx-auto px-4 md:px-8 ${inter.variable} ${lora.variable} ${work_sans.variable}`}
      >
        <NavigationBar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
