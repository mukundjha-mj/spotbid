'use client';

import { useEffect, useState } from 'react';

export default function AuctionTimer({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const end = new Date(endsAt).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('AUCTION ENDED');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setIsUrgent(diff < 10 * 60 * 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-xs shadow-sm">
      <span className="text-zinc-500 font-mono">TIME REMAINING:</span>
      <span
        className={`font-mono font-bold tracking-wide tabular-nums ${
          isUrgent ? 'text-rose-600 animate-pulse' : 'text-zinc-900'
        }`}
      >
        {timeLeft || 'LOADING...'}
      </span>
      {isUrgent && (
        <span className="rounded bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-[10px] font-mono text-rose-700">
          [ANTI-SNIPE +10M]
        </span>
      )}
    </div>
  );
}
