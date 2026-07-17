import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { TerminalLog } from "./TerminalLog";
import { RadarBackdrop } from "../scene/RadarBackdrop";
import { BrandPill } from "../scene/BrandPill";

interface Stat {
  label: string;
  value: string;
}

interface AuthSceneProps {
  logLines: string[];
  stats: [Stat, Stat];
  children: ReactNode;
}

export function AuthScene({ logLines, stats, children }: AuthSceneProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#faf9f6] px-6 py-28">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern-warm opacity-70" aria-hidden="true" />
      <RadarBackdrop />
      <BrandPill />

      <motion.div
        className="absolute top-1/2 right-[6%] z-0 hidden w-60 -translate-y-1/2 rotate-3 rounded-2xl border border-white/5 bg-[#121018] p-4 shadow-2xl lg:block"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.4 },
          y: { duration: 5, delay: 1, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <div className="mb-3 flex items-center justify-between border-b border-white/5 pb-2.5">
          <span className="font-mono text-[8.5px] font-bold tracking-wider text-neutral-400 uppercase">Session Gateway</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </div>
        <TerminalLog lines={logLines} />
      </motion.div>

      <div className="relative z-10 w-full">{children}</div>

      <div className="relative z-10 mt-8 flex gap-8 font-mono text-[10px] text-neutral-500">
        <span>
          {stats[0].label}: <span className="font-bold text-purple-600">{stats[0].value}</span>
        </span>
        <span>
          {stats[1].label}: <span className="font-bold text-emerald-600">{stats[1].value}</span>
        </span>
      </div>
    </div>
  );
}
