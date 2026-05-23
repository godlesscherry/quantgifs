"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <div
        className={`fixed inset-0 z-40 bg-black/60 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-md border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-800"
            aria-label="Open navigation"
          >
            Menu
          </button>
          <span className="text-sm font-semibold text-slate-100">QuantGifs</span>
        </header>
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
