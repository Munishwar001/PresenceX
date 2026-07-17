interface RadarBackdropProps {
  accent?: "purple" | "rose";
}

export function RadarBackdrop({ accent = "purple" }: RadarBackdropProps) {
  const ring = accent === "rose" ? "border-rose-500/15" : "border-purple-500/15";
  const dashed = accent === "rose" ? "border-rose-500/10" : "border-purple-500/10";

  return (
    <div
      className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-[0.3]"
      aria-hidden="true"
    >
      <div className={`absolute inset-0 animate-spin rounded-full border ${ring}`} style={{ animationDuration: "100s" }} />
      <div className={`absolute inset-[12%] rounded-full border border-dashed ${dashed}`} />
      <div className={`absolute inset-[26%] rounded-full border ${dashed}`} />
      <div className="absolute inset-[40%] rounded-full border border-dashed border-blue-500/10" />
    </div>
  );
}
