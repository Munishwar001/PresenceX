import { Link } from "react-router";
import { Logo } from "../auth/Logo";

export function BrandPill() {
  return (
    <Link
      to="/"
      className="absolute top-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 rounded-2xl border border-black/8 bg-white/85 px-5 py-3 shadow-sm backdrop-blur-xl"
    >
      <Logo className="h-6 w-6.25" />
      <span className="font-display text-sm font-black tracking-tight text-[#1c1a22]">PresenceX</span>
      <span className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-purple-500/25 bg-purple-500/10 px-2 py-0.5 font-mono text-[8px] font-bold text-purple-700">
        <span className="h-1 w-1 animate-ping rounded-full bg-purple-500" />
        LIVE
      </span>
    </Link>
  );
}
