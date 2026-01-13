import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AppSidebar from "@/app/components/AppSidebar";
import PageTitle from "@/app/components/PageTitle";

import {
  SidebarProvider,
  SidebarInset,
} from "@/app/components/ui/sidebar";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider defaultOpen={false}>
            {/* SIDEBAR + CONTENT */}
            <div className="flex flex-1 overflow-hidden">
              <AppSidebar />

              <SidebarInset className="flex-1 overflow-y-auto flex flex-col">
                {/* HEADER */}
                <Header />

                <main className="p-8 flex-1">
                  <PageTitle />
                  {children}
                </main>

                {/* FOOTER */}
                <Footer />
              </SidebarInset>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    template: "%s | Staj Projesi",
    default: "Staj Projesi",
  },
};
