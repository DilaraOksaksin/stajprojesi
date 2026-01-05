"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, PanelLeftIcon, Search, User } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useSidebar } from "@/app/components/ui/sidebar";
import { useLocalStorage } from "@/app/lib/useLocalStorage";

type StoredUser = {
  name: string;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Header() {
  const { toggleSidebar } = useSidebar();
  const [accountOpen, setAccountOpen] = useState(false);
  const [feedOpen, setFeedOpen] = useState(false);
  const [user, setUser] = useLocalStorage<StoredUser | null>("user", null);
  const feedRef = useRef<HTMLDivElement | null>(null);
  const accountRef = useRef<HTMLDivElement | null>(null);

  const initials = user ? getInitials(user.name) : "";

  useEffect(() => {
    if (!feedOpen && !accountOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (feedRef.current?.contains(target)) return;
      if (accountRef.current?.contains(target)) return;
      setFeedOpen(false);
      setAccountOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [feedOpen, accountOpen]);

  return (
    <header className="relative z-50 border-b border-border bg-background">
      <div className="flex items-center justify-between gap-4 px-4 py-2">
        <Button
          variant="ghost"
          className="h-9 gap-2 px-2"
          onClick={toggleSidebar}
        >
          <PanelLeftIcon className="size-4" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        <div className="relative flex w-full max-w-xs items-center">
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Ara..."
            className="h-9 w-full pl-9"
            aria-label="Sayfada ara"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={feedRef}>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => {
                setFeedOpen((open) => !open);
                setAccountOpen(false);
              }}
              aria-expanded={feedOpen}
              aria-haspopup="dialog"
            >
              <Bell className="size-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              <span className="sr-only">Bildirim Merkezi</span>
            </Button>
            {feedOpen ? (
              <div className="absolute right-0 mt-2 w-80 rounded-md border border-border bg-background p-4 shadow-md">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Bildirim Merkezi</p>
                    <p className="text-xs text-muted-foreground">Son loglar</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      "Dilara Okşaksin favorilere eklendi",
                      "Kullanıcı #12 profili güncelledi",
                      "Yeni gönderi paylaşıldı",
                      "Aktivite raporu indirildi",
                      "Kullanıcı #7 hesap doğruladı",
                    ].map((item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="rounded-md border border-border px-3 py-2 text-xs text-foreground"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="relative" ref={accountRef}>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 gap-2 px-2"
              onClick={() => {
                setAccountOpen((open) => !open);
                setFeedOpen(false);
              }}
              aria-expanded={accountOpen}
              aria-haspopup="menu"
            >
              {user ? (
                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  {initials}
                </span>
              ) : (
                <User className="size-4" />
              )}
              <span className="text-sm font-medium">
                {user ? user.name : "Hesabım"}
              </span>
              <ChevronDown className="size-4" />
            </Button>
            {accountOpen ? (
              <div
                className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-background shadow-sm"
                role="menu"
              >
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm font-semibold">
                      {user.name}
                    </div>
                    <button
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-muted"
                      role="menuitem"
                      onClick={() => {
                        setUser(null);
                        setAccountOpen(false);
                      }}
                    >
                      Çıkış yap
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/giris"
                      className="block px-3 py-2 text-sm hover:bg-muted"
                      role="menuitem"
                    >
                      Giriş yap
                    </Link>
                    <Link
                      href="/uye-ol"
                      className="block px-3 py-2 text-sm hover:bg-muted"
                      role="menuitem"
                    >
                      Üye ol
                    </Link>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}










