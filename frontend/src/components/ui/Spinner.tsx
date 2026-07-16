export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={className ?? "h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/40 border-t-white"}
      aria-hidden="true"
    />
  );
}
