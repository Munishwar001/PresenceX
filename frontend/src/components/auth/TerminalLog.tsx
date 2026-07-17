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
    <div ref={containerRef} className="terminal-scrollbar h-[132px] space-y-1.5 overflow-y-auto pr-1 font-mono text-[10px]">
      {visible.map((line, i) => (
        <div key={i} className="border-l border-purple-500/20 pl-2 text-neutral-400">
          <span className="mr-1 font-bold text-purple-400">$</span> {line}
        </div>
      ))}
    </div>
  );
}
