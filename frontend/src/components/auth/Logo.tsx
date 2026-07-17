import { useId } from "react";

export function Logo({ className }: { className?: string }) {
  const gradientId = useId();

  return (
    <svg className={className} viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="23" r="18" stroke={`url(#${gradientId})`} strokeWidth="1.5" strokeDasharray="3 3" />

      <path d="M 6 12 L 6 6 L 12 6" stroke={`url(#${gradientId})`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 42 12 L 42 6 L 36 6" stroke={`url(#${gradientId})`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 6 34 L 6 40 L 12 40" stroke={`url(#${gradientId})`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 42 34 L 42 40 L 36 40" stroke={`url(#${gradientId})`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      <path d="M 12 11 L 18 17 M 30 29 L 36 35" stroke={`url(#${gradientId})`} strokeWidth="3" strokeLinecap="round" />
      <path d="M 36 11 L 30 17 M 18 29 L 12 35" stroke={`url(#${gradientId})`} strokeWidth="3" strokeLinecap="round" />

      <circle cx="24" cy="23" r="5.5" fill={`url(#${gradientId})`} className="animate-pulse" />

      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="48" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a855f7" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
