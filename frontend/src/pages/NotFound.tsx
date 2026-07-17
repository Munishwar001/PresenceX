import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { RadarBackdrop } from "../components/scene/RadarBackdrop";
import { BrandPill } from "../components/scene/BrandPill";
import { TerminalLog } from "../components/auth/TerminalLog";
import { fieldContainer, fieldItem } from "../components/auth/formMotion";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#faf9f6] px-6 py-28">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern-warm opacity-70" aria-hidden="true" />
      <RadarBackdrop accent="rose" />
      <BrandPill />

      <motion.div
        className="relative z-10 flex w-full max-w-lg flex-col items-center text-center"
        initial="hidden"
        animate="show"
        variants={fieldContainer}
      >
        <motion.span
          variants={fieldItem}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3.5 py-1.5 font-mono text-[10px] font-bold text-rose-600 uppercase"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          Err_route_not_found
        </motion.span>

        <motion.h1
          variants={fieldItem}
          className="font-display bg-gradient-to-r from-purple-600 via-rose-500 to-blue-600 bg-clip-text text-[7rem] leading-none font-black tracking-tight text-transparent sm:text-[9rem]"
        >
          404
        </motion.h1>

        <motion.h2 variants={fieldItem} className="font-display mt-4 text-2xl font-black tracking-tight text-[#1c1a22] sm:text-3xl">
          This page hasn't checked in.
        </motion.h2>
        <motion.p variants={fieldItem} className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-500">
          The route you're looking for isn't in today's session. It may have moved, been renamed, or never existed.
        </motion.p>

        <motion.div variants={fieldItem} className="mt-8 w-full max-w-xs rounded-2xl border border-white/5 bg-[#121018] p-4 text-left shadow-2xl">
          <div className="mb-3 flex items-center justify-between border-b border-white/5 pb-2.5">
            <span className="font-mono text-[8.5px] font-bold tracking-wider text-neutral-400 uppercase">Route Resolver</span>
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          </div>
          <TerminalLog
            lines={[
              "Resolving requested path...",
              "Scanning known endpoints...",
              "No match found — 0 routes returned",
              "Standing by for redirect...",
            ]}
          />
        </motion.div>

        <motion.div variants={fieldItem} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="flex h-[46px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#1c1a22] px-6 text-xs font-extrabold tracking-wider text-white uppercase shadow-xs transition-colors hover:bg-neutral-800"
          >
            <span>&gt;_</span> Return home
          </Link>
          <Link
            to="/login"
            className="flex h-[46px] items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-6 text-xs font-extrabold tracking-wider text-[#1c1a22] uppercase transition-colors hover:bg-neutral-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Sign in
          </Link>
        </motion.div>
      </motion.div>

      <div className="relative z-10 mt-10 flex gap-8 font-mono text-[10px] text-neutral-500">
        <span>
          CODE: <span className="font-bold text-rose-600">404</span>
        </span>
        <span>
          STATUS: <span className="font-bold text-rose-600">OFFLINE</span>
        </span>
      </div>
    </div>
  );
}
