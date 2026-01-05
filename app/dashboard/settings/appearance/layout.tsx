import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Görünüm",
};

export default function AppearanceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
