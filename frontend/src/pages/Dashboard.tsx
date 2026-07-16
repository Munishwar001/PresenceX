import { useMemo, useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/ui/sidebar";

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    []
  );

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-w-0 flex-1 overflow-x-hidden p-5 md:p-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ink-100 bg-white text-ink-500 md:hidden"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-ink-900 md:text-2xl">Good morning, Munish</h1>
              <p className="text-sm text-ink-500">{today}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-ink-100 bg-white px-3.5 py-2.5 sm:flex">
              <SearchIcon className="text-ink-300" />
              <input
                type="text"
                placeholder="Search employees..."
                className="w-44 border-none bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-200"
              />
            </div>
            <button
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-ink-100 bg-white text-ink-500 hover:text-brand-600"
            >
              <BellIcon />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-600" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-brand-600 to-brand-400 text-sm font-semibold text-white">
              MK
            </div>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
