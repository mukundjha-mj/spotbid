'use client';

import { useState, useEffect } from 'react';

export default function LiveVisitors() {
  const [visitors, setVisitors] = useState<number>(0);

  useEffect(() => {
    // Start with a base number between 12 and 35
    const baseVisitors = Math.floor(Math.random() * 24) + 12;
    setVisitors(baseVisitors);

    // Fluctuate the number slightly every 5 to 15 seconds
    const interval = setInterval(() => {
      setVisitors((prev) => {
        // Change by -3 to +4
        const change = Math.floor(Math.random() * 8) - 3;
        const newCount = prev + change;
        // Keep within a realistic range
        if (newCount < 8) return 8;
        if (newCount > 85) return 85;
        return newCount;
      });
    }, Math.floor(Math.random() * 10000) + 5000);

    return () => clearInterval(interval);
  }, []);

  if (visitors === 0) return null;

  return (
    <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 shadow-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span>{visitors} viewing right now</span>
    </div>
  );
}
