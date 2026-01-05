import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background mt-auto">
      {/* ÜST BİLGİ ALANI */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div>
            <h3 className="font-semibold mb-3">Kurumsal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:underline">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  İletişim
                </Link>
              </li>
            </ul>
            <div className="mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="size-4" />
                <span>+90 532 709 32 77</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Mail className="size-4" />
                <span>oksaksindilara@gmail.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Yasal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:underline">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  Kullanım Şartları
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  KVKK
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ALT BAR */}
      <div className="border-t border-border bg-background text-center p-4">
        <p className="text-sm text-muted-foreground">
          © 2025 Intern Project. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}













