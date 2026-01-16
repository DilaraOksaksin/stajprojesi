import type { Metadata } from "next";
import type { LayoutProps } from "@/app/types/next";

export const metadata: Metadata = {
  title: "Gizlilik ve Güvenlik",
};

export default function PrivacyLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
