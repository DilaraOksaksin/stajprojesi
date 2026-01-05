"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useLocalStorage } from "@/app/lib/useLocalStorage";

type StoredUser = {
  name: string;
};

export default function GirisPage() {
  const router = useRouter();
  const [, setUser] = useLocalStorage<StoredUser | null>("user", null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const identifier = String(formData.get("identifier") || "").trim();

    const displayName = name || identifier;
    if (!displayName) return;

    setUser({ name: displayName });
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-2xl font-semibold">Giriş yap</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        E-posta veya telefon numaranız ve şifrenizle giriş yapın.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="login-name">
            Ad soyad
          </label>
          <Input
            id="login-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Ad Soyad"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="login-identifier">
            E-posta veya telefon
          </label>
          <Input
            id="login-identifier"
            name="identifier"
            type="text"
            autoComplete="username"
            placeholder="ornek@posta.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="login-password">
            Şifre
          </label>
          <Input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Giriş yap
        </Button>
      </form>
    </div>
  );
}
