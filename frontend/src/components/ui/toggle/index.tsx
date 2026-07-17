import { motion } from "framer-motion";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id?: string;
}

export function Toggle({ checked, onChange, label, id }: ToggleProps) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5 text-[13px] text-neutral-500 select-none">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative flex h-5 w-9 shrink-0 items-center rounded-full border-none p-0.5 transition-colors duration-200 ${
          checked ? "bg-purple-600" : "bg-neutral-200"
        }`}
      >
        <motion.span
          className="h-4 w-4 rounded-full bg-white shadow-sm"
          layout
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          style={{ marginLeft: checked ? "auto" : 0 }}
        />
      </button>
      <span>{label}</span>
    </label>
  );
}
