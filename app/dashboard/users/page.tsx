import type { User } from "@/app/types/user";
import UsersPageClient from "./users-page-client";
import { getUsers as getUsersService } from "@/app/services/userService";

export const metadata = {
  title: "Kullanıcılar",
};

export default async function DashboardUsersPage() {
  const users: User[] = await getUsersService({ cache: "no-store" });

  return <UsersPageClient users={users} />;
}
