import type { User } from "@/types/user";
import UsersPageClient from "./users-page-client";

export const metadata = {
  title: "Kullanıcılar",
};

async function getUsers(): Promise<User[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    cache: "no-store",
  });
  return res.json();
}

export default async function DashboardUsersPage() {
  const users = await getUsers();

  return <UsersPageClient users={users} />;
}
