import { Link } from "react-router";

const FEATURES = [
  {
    title: "Real-time attendance",
    description: "See who's checked in, late, or out for the day the moment it happens — no manual refresh.",
    icon: <ClockIcon />,
  },
  {
    title: "Team dashboards",
    description: "Attendance rate, trends, and department breakdowns in one clean view for managers.",
    icon: <ChartIcon />,
  },
  {
    title: "Smart notifications",
    description: "Automatic alerts for late arrivals, absences, and unusual patterns before they become problems.",
    icon: <BellIcon />,
  },
  {
    title: "Simple employee records",
    description: "One place for every employee's department, schedule, and attendance history.",
    icon: <UsersIcon />,
  },
];

const STATS = [
  { label: "Teams onboarded", value: "1,200+" },
  { label: "Check-ins tracked daily", value: "85K+" },
  { label: "Avg. setup time", value: "< 10 min" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Logo className="h-6.75 w-7" />
            <span className="text-lg font-bold tracking-tight text-ink-900">PresenceX</span>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-ink-500 md:flex">
            <a href="#features" className="hover:text-ink-900">
              Features
            </a>
            <a href="#stats" className="hover:text-ink-900">
              Why PresenceX
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-ink-500 hover:text-ink-900">
              Sign in
            </Link>
            <Link
              to="/signup"
              className="rounded-xl bg-linear-to-br from-brand-600 to-brand-400 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(126,20,255,0.08),transparent_40%),radial-gradient(circle_at_85%_0%,rgba(71,191,255,0.1),transparent_45%)]" />

          <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pt-20 pb-24 text-center">
            <span className="mb-6 rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-600">
              Attendance, simplified
            </span>

            <h1 className="max-w-3xl text-4xl leading-tight font-bold tracking-tight text-ink-900 sm:text-5xl">
              Track attendance and presence for your team in{" "}
              <span className="bg-linear-to-br from-brand-600 to-accent-400 bg-clip-text text-transparent">
                one place
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg">
              PresenceX gives you real-time check-ins, clear dashboards, and instant alerts — so you always know
              who's in, who's out, and who needs a nudge.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="rounded-xl bg-linear-to-br from-brand-600 to-brand-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_-20px_rgba(126,20,255,0.45)] transition-opacity hover:opacity-90"
              >
                Get started free
              </Link>
              <Link
                to="/dashboard"
                className="rounded-xl border border-ink-100 bg-white px-6 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-ink-50"
              >
                View live demo
              </Link>
            </div>

            <div className="mt-16 w-full max-w-4xl overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-[0_30px_60px_-30px_rgba(26,21,35,0.25)]">
              <div className="flex items-center gap-1.5 border-b border-ink-100 bg-ink-50 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
              </div>
              <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
                <PreviewStat label="Present Today" value="3" tone="green" />
                <PreviewStat label="Late Today" value="2" tone="amber" />
                <PreviewStat label="Absent Today" value="1" tone="red" />
              </div>
            </div>
          </div>
        </section>

        <section id="stats" className="border-y border-ink-100 bg-ink-50">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-14 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold tracking-tight text-ink-900">{stat.value}</p>
                <p className="mt-1 text-sm text-ink-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink-900">Everything you need to manage presence</h2>
            <p className="mt-3 text-base text-ink-500">
              Built for teams who want attendance data that's accurate, visible, and easy to act on.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-ink-100 p-6 transition-colors hover:border-brand-100">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-base font-semibold text-ink-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-ink-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-brand-600 via-brand-400 to-accent-400 px-8 py-16 text-center text-white sm:px-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_80%_85%,rgba(255,255,255,0.14),transparent_50%)]" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to see who's actually in the room?</h2>
              <p className="mx-auto mt-4 max-w-lg text-white/85">
                Set up PresenceX for your team in minutes. No credit card required.
              </p>
              <Link
                to="/signup"
                className="mt-8 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-600 transition-opacity hover:opacity-90"
              >
                Get started free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <Logo className="h-5.5 w-6" />
            <span className="text-sm font-semibold text-ink-900">PresenceX</span>
          </div>
          <p className="text-sm text-ink-500">© {new Date().getFullYear()} PresenceX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function PreviewStat({ label, value, tone }: { label: string; value: string; tone: "green" | "amber" | "red" }) {
  const tones = {
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-xl border border-ink-100 p-4 text-left">
      <p className="text-xs text-ink-500">{label}</p>
      <p className={`mt-2 inline-flex rounded-lg px-2 py-1 text-lg font-bold ${tones[tone]}`}>{value}</p>
    </div>
  );
}

function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="url(#landing-logo-gradient)"
        d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
      />
      <defs>
        <linearGradient id="landing-logo-gradient" x1="0" y1="0" x2="48" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a566ff" />
          <stop offset="1" stopColor="#7e14ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M18 17V9M13 17v-5M8 17v-3" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
