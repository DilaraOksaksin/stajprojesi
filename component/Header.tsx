"use client";

import { useSidebar } from "../app/providers/sidebar-context";

export default function Header() {
  const { toggle } = useSidebar();

  return (
    <header className="bg-blue-600 text-white px-6 py-4 flex items-center gap-4">
      <button onClick={toggle} className="text-2xl">
        ☰
      </button>
      <h1 className="text-xl font-semibold">Dashboard Header</h1>
    </header>
  );
}
