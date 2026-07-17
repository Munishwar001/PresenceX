import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { TerminalLog } from "./TerminalLog";
import { RadarBackdrop } from "../scene/RadarBackdrop";
import { BrandPill } from "../scene/BrandPill";

interface AuthSceneProps {
  panelTitle: string;
  steps: string[];
  note: string;
  children: ReactNode;
}

export function AuthScene({ panelTitle, steps, note, children }: AuthSceneProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#faf9f6] px-6 py-28">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern-warm opacity-70" aria-hidden="true" />
      <RadarBackdrop />
      <BrandPill />

      <motion.div
        className="absolute top-1/2 right-[6%] z-0 hidden w-64 -translate-y-1/2 rotate-3 rounded-2xl border border-white/5 bg-[#121018] p-5 shadow-2xl lg:block"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.4 },
          y: { duration: 5, delay: 1, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <div className="mb-3.5 flex items-center justify-between border-b border-white/5 pb-3">
          <span className="text-[13px] font-semibold text-white">{panelTitle}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </div>
        <TerminalLog lines={steps} />
      </motion.div>

      <div className="relative z-10 w-full">{children}</div>

      <p className="relative z-10 mt-8 text-[13px] text-neutral-500">{note}</p>
    </div>
  );
}
