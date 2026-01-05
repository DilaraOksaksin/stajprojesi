import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Giriş",
};

export default function GirisLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
