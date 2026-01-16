"use server";

import "server-only";
import type { User } from "@/app/types/user";

export async function getUsers(): Promise<User[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    next: { tags: ["users", "layout"] },
  });
  if (!res.ok) throw new Error("Kullanıcılar alınamadı");
  return res.json();
}

export async function revalidateUsers() {
  const { revalidateTag } = await import("next/cache");
  revalidateTag("users");   // İlk etiketi temizle
  revalidateTag("layout");  // İkinci etiketi temizle
}

