import type { User } from "@/app/types";
import { fetchJson, type ServiceFetchInit } from "./http";

export async function getUsers(init?: ServiceFetchInit): Promise<User[]> {
  try {
    return await fetchJson<User[]>("/users", init);
  } catch {
    return [];
  }
}

export async function getUserById(
  id: string | number,
  init?: ServiceFetchInit
): Promise<User | null> {
  try {
    return await fetchJson<User>(`/users/${id}`, init);
  } catch {
    return null;
  }
}

export async function getUsersByIds(
  ids: Array<string | number>,
  init?: ServiceFetchInit
): Promise<User[]> {
  if (!ids.length) return [];
  const results = await Promise.all(ids.map((id) => getUserById(id, init)));
  return results.filter((u): u is User => u !== null);
}


