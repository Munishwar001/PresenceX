import { useMemo, type ReactNode } from "react";
import Table, { type TableColumn } from "../components/ui/table";

type Status = "Present" | "Late" | "Absent";

interface AttendanceRow {
  name: string;
  department: string;
  checkIn: string;
  checkOut: string;
  status: Status;
}

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

const ATTENDANCE_COLUMNS: TableColumn<AttendanceRow>[] = [
  {
    key: "employee",
    header: "Employee",
    render: (row) => (
      <div className="flex items-center gap-3 font-medium text-ink-900">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-600">
          {row.name
            .split(" ")
            .map((part) => part[0])
            .join("")}
        </div>
        {row.name}
      </div>
    ),
  },
  { key: "department", header: "Department", render: (row) => row.department, cellClassName: "text-ink-500" },
  { key: "checkIn", header: "Check-in", render: (row) => row.checkIn, cellClassName: "text-ink-500" },
  { key: "checkOut", header: "Check-out", render: (row) => row.checkOut, cellClassName: "text-ink-500" },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[row.status]}`}>
        {row.status}
      </span>
    ),
  },
];

export default function DashboardHome() {
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
    <>
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
        <Table columns={ATTENDANCE_COLUMNS} data={ATTENDANCE_ROWS} rowKey={(row) => row.name} />
      </section>
    </>
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

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
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
