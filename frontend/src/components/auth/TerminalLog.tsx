import { useEffect, useRef, useState } from "react";

export function TerminalLog({ lines }: { lines: string[] }) {
  const [visible, setVisible] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible([]);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisible(lines.slice(0, i));
      if (i >= lines.length) clearInterval(interval);
    }, 550);

    return () => clearInterval(interval);
  }, [lines]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visible]);

  return (
    <div ref={containerRef} className="terminal-scrollbar h-[132px] space-y-2 overflow-y-auto pr-1 text-[12px]">
      {visible.map((line, i) => (
        <div key={i} className="flex items-center gap-2 text-neutral-300">
          <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[9px] font-bold text-emerald-400">
            ✓
          </span>
          {line}
        </div>
      ))}
    </div>
  );
}
