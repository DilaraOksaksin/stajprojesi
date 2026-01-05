import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Aktivite",
};

export default function ActivityLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
