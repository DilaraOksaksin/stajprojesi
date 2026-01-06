import { Globe, Mail, Phone, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto w-full bg-background text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-6 text-center">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Zap className="size-4 text-primary" />
          <span>Dilara Okşaksin</span>
        </div>
        <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground sm:flex-row sm:justify-center">
          <div className="flex items-center gap-2">
            <Mail className="size-4 text-primary" />
            <a href="mailto:oksaksindilara@gmail.com" className="hover:text-foreground">
              oksaksindilara@gmail.com
            </a>
          </div>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <div className="flex items-center gap-2">
            <Phone className="size-4 text-primary" />
            <a href="tel:+905327093277" className="hover:text-foreground">
              +90 532 709 32 77
              </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-background text-center">
        <p className="px-6 py-3 text-xs text-muted-foreground">
          © 2026 Veri Görselleştirme Paneli — Tüm Hakları Saklıdır.
        </p>
      </div>
    </footer>
  );
}
