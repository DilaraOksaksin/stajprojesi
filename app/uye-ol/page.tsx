"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useLocalStorage } from "@/app/lib/useLocalStorage";

type StoredUser = {
  name: string;
};

export default function UyeOlPage() {
  const router = useRouter();
  const [, setUser] = useLocalStorage<StoredUser | null>("user", null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();

    if (!name) return;

    setUser({ name });
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-2xl font-semibold">Üye ol</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Hesap oluşturmak için bilgilerinizi girin.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="signup-name">
            Ad soyad
          </label>
          <Input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Ad Soyad"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="signup-phone">
            Cep telefonu
          </label>
          <Input
            id="signup-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="05xx xxx xx xx"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="signup-email">
            Mail adresi
          </label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="ornek@posta.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="signup-password">
            Şifre oluştur
          </label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="signup-password-confirm">
            Yeni şifre
          </label>
          <Input
            id="signup-password-confirm"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Üye ol
        </Button>
      </form>
    </div>
  );
}
