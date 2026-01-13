"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Skeleton } from "@/app/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import UsersGrid from "./users-grid";
import type { User } from "@/types/user";
import { Search } from "lucide-react";

type RoleFilter = "all" | "admin" | "user";
type StatusFilter = "all" | "aktif" | "pasif";
type SortOption = "name-asc" | "name-desc" | "email-asc" | "email-desc";

type UsersPageClientProps = {
  users: User[];
};

function getRole(user: User) {
  return user.id % 2 === 0 ? "admin" : "user";
}

function getStatus(user: User) {
  return user.id % 2 === 0 ? "aktif" : "pasif";
}

export default function UsersPageClient({ users }: UsersPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const basePath = "/dashboard/users";
  const PAGE_SIZE = 10;
  const initialQuery = searchParams.get("q") ?? "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [debouncedTerm, setDebouncedTerm] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const qParam = searchParams.get("q") ?? "";
    setSearchTerm(qParam);
    setDebouncedTerm(qParam);
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const term = searchTerm.trim();
      setDebouncedTerm(term);
      if (term) {
        router.replace(`${basePath}?q=${encodeURIComponent(term)}`);
      } else {
        router.replace(basePath);
      }
      setIsLoading(false);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm, router, basePath]);

  const filteredUsers = useMemo(() => {
    let next = users.slice();
    const term = debouncedTerm.toLowerCase();

    if (term) {
      next = next.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
    }

    if (roleFilter !== "all") {
      next = next.filter((user) => getRole(user) === roleFilter);
    }

    if (statusFilter !== "all") {
      next = next.filter((user) => getStatus(user) === statusFilter);
    }

    next.sort((a, b) => {
      switch (sortOption) {
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "email-asc":
          return a.email.localeCompare(b.email);
        case "email-desc":
          return b.email.localeCompare(a.email);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return next;
  }, [users, debouncedTerm, roleFilter, statusFilter, sortOption]);

  useEffect(() => {
    setPage(1);
  }, [debouncedTerm, roleFilter, statusFilter, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const pagedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredUsers]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Kullanıcılar</h1>
          <p className="text-sm text-muted-foreground">Kullanıcıları kart olarak görüntüle.</p>
        </div>
        <div className="flex w-full flex-1 items-center gap-3 sm:w-auto sm:flex-none">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Kullanıcı ara..."
              className="pl-9"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                Filtrele
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filtreler</SheetTitle>
                <SheetDescription>Rol, durum ve sıralama seçeneklerini ayarla.</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Rol</label>
                  <select
                    value={roleFilter}
                    onChange={(event) => setRoleFilter(event.target.value as RoleFilter)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="all">Hepsi</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Durum</label>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="all">Hepsi</option>
                    <option value="aktif">Aktif</option>
                    <option value="pasif">Pasif</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Sıralama</label>
                  <select
                    value={sortOption}
                    onChange={(event) => setSortOption(event.target.value as SortOption)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="name-asc">İsim (A-Z)</option>
                    <option value="name-desc">İsim (Z-A)</option>
                    <option value="email-asc">E-posta (A-Z)</option>
                    <option value="email-desc">E-posta (Z-A)</option>
                  </select>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={`skeleton-${index}`} className="py-4">
              <div className="flex flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-between gap-3 md:justify-end">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <div className="flex w-full max-w-xs items-center gap-2 md:w-auto">
                    <Skeleton className="h-8 w-full rounded-md" />
                    <Skeleton className="h-8 w-full rounded-md" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <UsersGrid users={pagedUsers} />
          {totalPages >= 1 ? (
            <nav className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                const isActive = pageNumber === currentPage;
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    aria-current={isActive ? "page" : undefined}
                    className={
                      isActive
                        ? "rounded-md border border-primary bg-primary px-3 py-1 text-sm text-primary-foreground"
                        : "rounded-md border border-border px-3 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </nav>
          ) : null}
        </>
      )}
    </div>
  );
}
