"use server";

import "server-only";
import type { User } from "@/app/types/user";
import { getUsers as getUsersService } from "@/app/services/userService";

export async function getUsers(): Promise<User[]> {
  const users = await getUsersService({
    next: { tags: ["users", "layout"] },
  });
  if (!users.length) throw new Error("Kullanıcılar alınamadı");
  return users;
}

export async function revalidateUsers() {
  const { revalidateTag } = await import("next/cache");
  revalidateTag("users");   // İlk etiketi temizle
  revalidateTag("layout");  // İkinci etiketi temizle
}

