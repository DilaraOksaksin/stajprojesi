import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Gizlilik ve Güvenlik",
};

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
