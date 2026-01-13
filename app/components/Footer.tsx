export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background px-6 py-8 text-center">
      <div className="w-full">
        <p className="mb-4 text-lg font-semibold text-foreground">
          Dilara Okşaksin
        </p>

        <div className="flex flex-col items-center justify-center gap-3 text-sm sm:flex-row sm:gap-6">
          {/* Email */}
          <a
            href="mailto:oksaksindilara@gmail.com"
            className="flex items-center gap-2 text-foreground hover:underline"
          >
            <span className="text-muted-foreground">📧</span>
            <span>oksaksindilara@gmail.com</span>
          </a>

          {/* Telephone */}
          <a
            href="tel:+905327093277"
            className="flex items-center gap-2 text-foreground hover:underline"
          >
            <span className="text-muted-foreground">📱</span>
            <span>+90 532 709 32 77</span>
          </a>
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Veri Görselleştirme Paneli — Tüm Hakları Saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
