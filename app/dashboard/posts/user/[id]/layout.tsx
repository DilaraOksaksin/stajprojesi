import type { Metadata } from "next";
import type { LayoutProps } from "@/app/types/next";

export const metadata: Metadata = {
  title: "Gönderiler",
};

export default function UserPostsLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
