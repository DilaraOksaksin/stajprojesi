"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
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
import { Search, ChevronLeft, ChevronRight } from "lucide-react"; // İkonları ekledik

import { 
  User, 
  UsersPageClientProps, 
  RoleFilter, 
  StatusFilter, 
  SortOption 
} from "@/types";

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
  
  // HER SAYFADA 10 KİŞİ
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

    return () => clearTimeout(timeoutId);
  }, [searchTerm, router, basePath]);

  const filteredUsers = useMemo(() => {
    let next = [...users];
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
        case "name-desc": return b.name.localeCompare(a.name);
        case "email-asc": return a.email.localeCompare(b.email);
        case "email-desc": return b.email.localeCompare(a.email);
        default: return a.name.localeCompare(b.name);
      }
    });

    return next;
  }, [users, debouncedTerm, roleFilter, statusFilter, sortOption]);

  // Filtreler değişince 1. sayfaya dön
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
      {/* Üst Kısım: Başlık ve Arama */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kullanıcılar</h1>
          <p className="text-sm text-muted-foreground">Sistemdeki tüm kullanıcıları yönetin.</p>
        </div>
        <div className="flex w-full flex-1 items-center gap-3 sm:w-auto sm:flex-none">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Kullanıcı ara..."
              className="pl-9"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="cursor-pointer">
                Filtrele
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filtreler</SheetTitle>
                <SheetDescription>Kriterleri belirleyerek aramayı daraltın.</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rol</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer"
                  >
                    <option value="all">Hepsi</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
                {/* Durum ve Sıralama select yapıları buraya gelecek (aynı mantıkla) */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3"><Skeleton className="h-24 w-full rounded-xl" /></div>
      ) : (
        <>
          <UsersGrid users={pagedUsers} />

          {/* İSTEDİĞİN MODERN SAYFALAMA YAPISI (Önceki / Sonraki) */}
          {filteredUsers.length > PAGE_SIZE && (
            <div className="flex items-center justify-between pt-8 border-t">
              <p className="text-sm text-muted-foreground hidden sm:block">
                Toplam <span className="font-medium text-foreground">{filteredUsers.length}</span> kullanıcıdan 
                <span className="font-medium text-foreground"> {(currentPage - 1) * PAGE_SIZE + 1}</span> - 
                <span className="font-medium text-foreground"> {Math.min(currentPage * PAGE_SIZE, filteredUsers.length)}</span> arası gösteriliyor.
              </p>

              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPage(prev => prev - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="gap-1 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Önceki
                </Button>

                <div className="flex items-center gap-1 px-4">
                   <span className="text-sm font-bold">{currentPage}</span>
                   <span className="text-sm text-muted-foreground">/</span>
                   <span className="text-sm text-muted-foreground">{totalPages}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPage(prev => prev + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="gap-1 cursor-pointer"
                >
                  Sonraki
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}