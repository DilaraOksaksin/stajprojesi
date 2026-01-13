import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Gönderiler",
};

export default function UserPostsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
