import UserSearch from "../components/user-search";
import type { User } from "@/types/user";

type UsersPageProps = {
  searchParams: {
    search?: string;
  };
};

export const metadata = {
  title: "Kullanıcılar",
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    cache: "no-store",
  });

  const users: User[] = await res.json();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-semibold mb-4">Kullanıcılar</h1>

      <UserSearch
        users={users}
        initialSearch={searchParams.search ?? ""}
      />
    </div>
  );
}
