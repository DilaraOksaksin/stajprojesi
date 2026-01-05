import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Diller",
};

export default function LanguagesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
