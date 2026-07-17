interface RadarBackdropProps {
  accent?: "purple" | "rose";
}

export function RadarBackdrop({ accent = "purple" }: RadarBackdropProps) {
  const ring = accent === "rose" ? "border-rose-500/15" : "border-purple-500/15";
  const dashed = accent === "rose" ? "border-rose-500/10" : "border-purple-500/10";
  const label = accent === "rose" ? "text-rose-600/60" : "text-purple-600/60";

  return (
    <div
      className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-[0.3]"
      aria-hidden="true"
    >
      <div className={`absolute inset-0 animate-spin rounded-full border ${ring}`} style={{ animationDuration: "100s" }} />
      <div className={`absolute inset-[12%] rounded-full border border-dashed ${dashed}`} />
      <div className={`absolute inset-[26%] rounded-full border ${dashed}`} />
      <div className="absolute inset-[40%] rounded-full border border-dashed border-blue-500/10" />

      <span className={`absolute top-2 left-1/2 -translate-x-1/2 font-mono text-[8px] font-bold ${label}`}>000° N</span>
      <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[8px] font-bold ${label}`}>180° S</span>
      <span className={`absolute top-1/2 right-2 -translate-y-1/2 font-mono text-[8px] font-bold ${label}`}>090° E</span>
      <span className={`absolute top-1/2 left-2 -translate-y-1/2 font-mono text-[8px] font-bold ${label}`}>270° W</span>
    </div>
  );
}
