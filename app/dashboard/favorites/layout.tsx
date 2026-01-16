import type { Metadata } from "next";
import type { LayoutProps } from "@/app/types/next";

export const metadata: Metadata = {
  title: "Favoriler",
};

export default function FavoritesLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
