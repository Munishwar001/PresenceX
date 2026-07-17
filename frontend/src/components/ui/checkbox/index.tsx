import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  id?: string;
  error?: boolean;
}

export function Checkbox({ checked, onChange, children, id, error }: CheckboxProps) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-relaxed text-neutral-500 select-none">
      <button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border-[1.5px] transition-colors ${
          checked ? "border-purple-600 bg-purple-600" : error ? "border-rose-400 bg-white" : "border-neutral-300 bg-white"
        }`}
      >
        <motion.svg
          width="10"
          height="8"
          viewBox="0 0 10 8"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ opacity: checked ? 1 : 0, scale: checked ? 1 : 0.6 }}
          transition={{ duration: 0.15 }}
        >
          <path d="M1 4l2.5 2.5L9 1" />
        </motion.svg>
      </button>
      <span>{children}</span>
    </label>
  );
}
