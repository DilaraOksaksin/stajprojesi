import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Üye Ol",
};

export default function UyeOlLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
