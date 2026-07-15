import { useMemo, useState, type ReactNode } from "react";

type Status = "Present" | "Late" | "Absent";

interface AttendanceRow {
  name: string;
  department: string;
  checkIn: string;
  checkOut: string;
  status: Status;
}

const NAV_ITEMS = [
  { label: "Dashboard", icon: <GridIcon /> },
  { label: "Employees", icon: <UsersIcon /> },
  { label: "Attendance", icon: <CalendarIcon /> },
  { label: "Reports", icon: <ChartIcon /> },
  { label: "Settings", icon: <SettingsIcon /> },
];

const WEEKLY_ATTENDANCE = [
  { day: "Mon", value: 92 },
  { day: "Tue", value: 88 },
  { day: "Wed", value: 95 },
  { day: "Thu", value: 90 },
  { day: "Fri", value: 84 },
  { day: "Sat", value: 40 },
  { day: "Sun", value: 12 },
];

const ATTENDANCE_ROWS: AttendanceRow[] = [
  { name: "Ananya Rao", department: "Engineering", checkIn: "09:02 AM", checkOut: "06:10 PM", status: "Present" },
  { name: "Rahul Mehta", department: "Design", checkIn: "09:45 AM", checkOut: "06:05 PM", status: "Late" },
  { name: "Priya Nair", department: "Marketing", checkIn: "—", checkOut: "—", status: "Absent" },
  { name: "Karan Shah", department: "Engineering", checkIn: "08:58 AM", checkOut: "05:58 PM", status: "Present" },
  { name: "Sara Khan", department: "Sales", checkIn: "09:15 AM", checkOut: "06:20 PM", status: "Present" },
  { name: "Vikram Singh", department: "Support", checkIn: "10:05 AM", checkOut: "06:00 PM", status: "Late" },
];

const STATUS_STYLES: Record<Status, string> = {
  Present: "bg-green-50 text-green-600",
  Late: "bg-amber-50 text-amber-600",
  Absent: "bg-red-50 text-red-600",
};

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

  const statusCounts = useMemo(() => {
    return ATTENDANCE_ROWS.reduce(
      (acc, row) => {
        acc[row.status] += 1;
        return acc;
      },
      { Present: 0, Late: 0, Absent: 0 } as Record<Status, number>
    );
  }, []);

  return (
    <div className="flex min-h-screen bg-ink-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 -translate-x-full flex-col gap-8 border-r border-ink-100 bg-white p-6 transition-transform duration-200 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : ""
        }`}
      >
        <div className="flex items-center gap-2.5">
          <svg className="h-6.75 w-7" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="url(#dash-logo-gradient)"
              d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
            />
            <defs>
              <linearGradient id="dash-logo-gradient" x1="0" y1="0" x2="48" y2="46" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a566ff" />
                <stop offset="1" stopColor="#7e14ff" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-lg font-bold tracking-tight text-ink-900">PresenceX</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActiveNav(item.label);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                activeNav === item.label
                  ? "bg-brand-50 text-brand-600"
                  : "text-ink-500 hover:bg-ink-50 hover:text-ink-900"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-500 transition-colors hover:bg-red-50 hover:text-red-600">
          <LogOutIcon />
          <span>Log out</span>
        </button>
      </aside>

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

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Employees" value={ATTENDANCE_ROWS.length.toString()} icon={<UsersIcon />} tone="purple" />
          <StatCard label="Present Today" value={statusCounts.Present.toString()} icon={<CheckIcon />} tone="green" />
          <StatCard label="Late Today" value={statusCounts.Late.toString()} icon={<ClockIcon />} tone="amber" />
          <StatCard label="Absent Today" value={statusCounts.Absent.toString()} icon={<XIcon />} tone="red" />
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-ink-900">Weekly attendance</h2>
              <p className="text-sm text-ink-500">Team attendance rate for this week</p>
            </div>
            <div className="flex h-40 items-end justify-between gap-3">
              {WEEKLY_ATTENDANCE.map((item) => (
                <div className="flex flex-1 flex-col items-center gap-2" key={item.day}>
                  <div className="flex h-32 w-full items-end overflow-hidden rounded-lg bg-ink-50">
                    <div
                      className="w-full rounded-lg bg-linear-to-t from-brand-600 to-accent-400"
                      style={{ height: `${item.value}%` }}
                    />
                  </div>
                  <span className="text-xs text-ink-500">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-6">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-ink-900">This week</h2>
              <p className="text-sm text-ink-500">Snapshot of team presence</p>
            </div>
            <ul className="flex flex-col gap-4">
              <SummaryRow color="bg-green-500" label="Average attendance" value="85%" />
              <SummaryRow color="bg-amber-500" label="Late arrivals" value={statusCounts.Late.toString()} />
              <SummaryRow color="bg-red-500" label="Absences" value={statusCounts.Absent.toString()} />
              <SummaryRow color="bg-brand-600" label="On leave" value="0" />
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-ink-100 bg-white p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-ink-900">Recent activity</h2>
            <p className="text-sm text-ink-500">Today's check-in and check-out records</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-140 border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-xs tracking-wide text-ink-300 uppercase">
                  <th className="pb-3 font-medium">Employee</th>
                  <th className="pb-3 font-medium">Department</th>
                  <th className="pb-3 font-medium">Check-in</th>
                  <th className="pb-3 font-medium">Check-out</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {ATTENDANCE_ROWS.map((row) => (
                  <tr key={row.name} className="border-b border-ink-100 last:border-none">
                    <td className="py-3.5">
                      <div className="flex items-center gap-3 font-medium text-ink-900">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-600">
                          {row.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </div>
                        {row.name}
                      </div>
                    </td>
                    <td className="text-ink-500">{row.department}</td>
                    <td className="text-ink-500">{row.checkIn}</td>
                    <td className="text-ink-500">{row.checkOut}</td>
                    <td>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <li className="flex items-center gap-2.5 text-sm text-ink-500">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span className="flex-1">{label}</span>
      <strong className="text-ink-900">{value}</strong>
    </li>
  );
}

const STAT_TONES = {
  purple: "bg-brand-50 text-brand-600",
  green: "bg-green-50 text-green-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
};

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  tone: keyof typeof STAT_TONES;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${STAT_TONES[tone]}`}>{icon}</div>
      <div>
        <p className="text-sm text-ink-500">{label}</p>
        <p className="text-xl font-bold text-ink-900">{value}</p>
      </div>
    </div>
  );
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M18 17V9M13 17v-5M8 17v-3" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
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

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
