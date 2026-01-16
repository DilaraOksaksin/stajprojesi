import type { Metadata } from "next";
import type { LayoutProps } from "@/app/types/next";

export const metadata: Metadata = {
  title: "Aktivite",
};

export default function ActivityLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
