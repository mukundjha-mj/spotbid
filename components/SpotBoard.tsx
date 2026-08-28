'use client';

import { useState, useEffect } from 'react';
import { Spot } from '@/lib/types';
import SpotCard from './SpotCard';
import BidModal from './BidModal';

export default function SpotBoard({ spots: initialSpots }: { spots: Spot[] }) {
  const [spots, setSpots] = useState<Spot[]>(initialSpots);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const res = await fetch('/api/spots');
        if (res.ok) {
          const data = await res.json();
          if (data.spots) {
            setSpots(data.spots);
          }
        }
      } catch (err) {
        // silent fallback
      }
    };

    const interval = setInterval(fetchSpots, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="board" className="scroll-mt-16 py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200 pb-4">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600">
              [THE BOARD]
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950 mt-1">
              Active Placements
            </h2>
          </div>
          <p className="text-xs font-mono text-zinc-500">
            Click any block to place a bid or outbid
          </p>
        </div>

        {/* Board Surface */}
        <div className="relative mx-auto w-full">
          <div className="relative rounded-2xl border border-zinc-200 bg-zinc-50/50 p-3 sm:p-4 shadow-sm">
            {/* Center Watermark */}
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-1 opacity-[0.04]">
                <div className="h-16 w-16 rounded-2xl bg-black font-mono font-black text-3xl text-white flex items-center justify-center">
                  SB
                </div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-black">
                  SPOTBID.TOP
                </span>
              </div>
            </div>

            {/* Grid */}
            <div
              className="relative z-10 grid gap-2.5 sm:gap-3"
              style={{
                gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
                gridTemplateRows: 'minmax(0, 1fr) minmax(0, 0.9fr) minmax(0, 1fr) minmax(0, 0.95fr)',
              }}
            >
              {spots.map((spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  onClick={() => setSelectedSpot(spot)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      {selectedSpot && (
        <BidModal
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
          onSuccess={async () => {
            const res = await fetch('/api/spots');
            if (res.ok) {
              const data = await res.json();
              if (data.spots) setSpots(data.spots);
            }
          }}
        />
      )}
    </section>
  );
}
