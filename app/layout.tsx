import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import Footer from "../component/Footer";
import { SidebarProvider } from "./providers/sidebar-context";


const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Staj Projesi",
  description: "Frontend Intern Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex flex-col min-h-screen">

        {/* 👇 BURASI KRİTİK */}
        <SidebarProvider>
          <Header />

          <div className="flex flex-1">
            <Sidebar />

            <main className="flex-1 p-8">
              {children}
            </main>
          </div>

          <Footer />
        </SidebarProvider>

      </body>
    </html>
  );
}
