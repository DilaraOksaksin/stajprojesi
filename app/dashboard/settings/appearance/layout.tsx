import type { Metadata } from "next";
import type { LayoutProps } from "@/app/types/next";

export const metadata: Metadata = {
  title: "Görünüm",
};

export default function AppearanceLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
