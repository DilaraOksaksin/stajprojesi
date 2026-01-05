"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "../../types/user";

type Props = {
  users: User[];
  initialSearch: string;
};

export default function UserSearch({ users, initialSearch }: Props) {
  const [search, setSearch] = useState(initialSearch);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    let isActive = true;
    const term = search.trim();
    const timeoutId = setTimeout(async () => {
      if (!isActive) return;

      if (!term) {
        setFilteredUsers(users);
        router.replace("/users");
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/users?name_like=${encodeURIComponent(term)}`,
          { cache: "no-store" }
        );
        const data: User[] = res.ok ? await res.json() : [];
        if (isActive) {
          setFilteredUsers(data);
          router.replace(`/users?search=${encodeURIComponent(term)}`);
        }
      } catch {
        if (isActive) {
          setFilteredUsers(
            users.filter((user) =>
              user.name.toLowerCase().includes(term.toLowerCase())
            )
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [search, users, router]);

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={handleChange}
        placeholder="Kullanıcı ara..."
        className="border p-2 rounded mb-4 w-full max-w-sm"
      />

      {isLoading ? (
        <p className="text-muted-foreground">Yukleniyor...</p>
      ) : null}

      <ul className="space-y-2">
        {filteredUsers.map((user) => (
          <li key={user.id} className="flex items-center justify-between gap-2 border p-2 rounded">
            <span>{user.name}</span>
            <Link
              href={`/users/${user.id}`}
              className="text-xs font-medium text-primary hover:underline"
            >
              Detay
            </Link>
          </li>
        ))}
      </ul>

      {!isLoading && filteredUsers.length === 0 ? (
        <p className="text-muted-foreground">Sonuç bulunamadı.</p>
      ) : null}
    </div>
  );
}
