import DashboardClient from "./dashboard/dashboard-client";

export const metadata = {
  title: "Ana Sayfa",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <DashboardClient title="Ana Sayfa" subtitle="Genel durum özeti" />
      </main>
    </div>
  );
}
