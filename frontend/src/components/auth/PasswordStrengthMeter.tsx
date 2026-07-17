import { motion } from "framer-motion";

const LEVELS = [
  { label: "Weak", color: "bg-rose-400" },
  { label: "Fair", color: "bg-amber-400" },
  { label: "Good", color: "bg-blue-500" },
  { label: "Strong", color: "bg-emerald-500" },
];

function scorePassword(password: string) {
  if (!password) return 0;

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) score++;

  return Math.max(1, Math.min(score, 4));
}

export function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null;

  const score = scorePassword(password);
  const level = LEVELS[score - 1];

  return (
    <div className="mt-1.5 flex items-center gap-2.5">
      <div className="flex flex-1 gap-1">
        {LEVELS.map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-200">
            <motion.div
              className={`h-full rounded-full ${i < score ? level.color : "bg-transparent"}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: i < score ? 1 : 0 }}
              style={{ originX: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />
          </div>
        ))}
      </div>
      <span className="w-10 text-right font-mono text-[10px] font-medium text-neutral-500 uppercase">{level.label}</span>
    </div>
  );
}
