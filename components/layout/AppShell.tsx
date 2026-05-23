"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { Sidebar } from "./Sidebar";

const STORAGE_KEY = "quantgifs-sidebar-collapsed";
const COLLAPSE_CHANGE_EVENT = "quantgifs-sidebar-collapse-change";

function getCollapsedSnapshot(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function subscribeCollapsed(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(COLLAPSE_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(COLLAPSE_CHANGE_EVENT, handler);
  };
}

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    getCollapsedSnapshot,
    () => false
  );

  const toggleCollapsed = useCallback(() => {
    try {
      const next = !getCollapsedSnapshot();
      localStorage.setItem(STORAGE_KEY, String(next));
      window.dispatchEvent(new Event(COLLAPSE_CHANGE_EVENT));
    } catch {
      // ignore storage errors
    }
  }, []);

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
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-[width,transform] duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-14" : "lg:w-72"}`}
      >
        <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapsed} />
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
