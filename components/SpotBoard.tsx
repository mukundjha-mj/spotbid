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
    <section id="board" className="scroll-mt-16 py-10 md:py-14 bg-zinc-50/40">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200 pb-4">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600">
              [THE BILLBOARD · 17 PLACEMENTS]
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 mt-0.5">
              Active Placements
            </h2>
          </div>
          <p className="text-xs font-mono text-zinc-500">
            Click any unit to claim or outbid
          </p>
        </div>

        {/* Billboard Frame & Structure */}
        <div className="relative mx-auto w-full max-w-[940px]">
          {/* Billboard Overhead Lighting Fixtures */}
          <div className="flex justify-around px-16 -mb-2 relative z-20">
            <div className="flex flex-col items-center">
              <div className="h-2.5 w-8 bg-zinc-800 rounded-t-sm shadow-sm" />
              <div className="h-1.5 w-10 bg-zinc-900 rounded-full" />
            </div>
            <div className="flex flex-col items-center">
              <div className="h-2.5 w-8 bg-zinc-800 rounded-t-sm shadow-sm" />
              <div className="h-1.5 w-10 bg-zinc-900 rounded-full" />
            </div>
            <div className="flex flex-col items-center">
              <div className="h-2.5 w-8 bg-zinc-800 rounded-t-sm shadow-sm" />
              <div className="h-1.5 w-10 bg-zinc-900 rounded-full" />
            </div>
          </div>

          {/* Outer Billboard Metal Bezel Frame */}
          <div className="relative rounded-2xl border-4 border-zinc-900 bg-zinc-900 p-2 sm:p-2.5 billboard-frame">
            {/* Corner Rivets / Screws */}
            <div className="absolute top-2 left-2 h-1.5 w-1.5 rounded-full bg-zinc-600 shadow-inner" />
            <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-zinc-600 shadow-inner" />
            <div className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-zinc-600 shadow-inner" />
            <div className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-zinc-600 shadow-inner" />

            {/* Billboard Inner Canvas */}
            <div className="relative rounded-xl border border-zinc-200 bg-zinc-100/90 p-2.5 sm:p-3.5 billboard-spotlight">
              {/* Grid: 6 columns, 4 rows = 100% full, zero black space */}
              <div
                className="grid gap-2.5 sm:gap-3"
                style={{
                  gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
                }}
              >
                {/* Row 1: 3 Large Banners (1, 2, 3) -> 2 cols each = 6 cols */}
                {spots.slice(0, 3).map((spot) => (
                  <SpotCard
                    key={spot.id}
                    spot={{
                      ...spot,
                      grid_col: spot.id === 1 ? '1 / span 2' : spot.id === 2 ? '3 / span 2' : '5 / span 2',
                    }}
                    onClick={() => setSelectedSpot(spot)}
                  />
                ))}

                {/* Row 2: Spot 4 (1 col), Spot 5 (1 col), Spot 6 (2 cols Center $50), Spot 7 (1 col), Spot 8 (1 col) */}
                {spots.slice(3, 8).map((spot) => (
                  <SpotCard
                    key={spot.id}
                    spot={{
                      ...spot,
                      grid_col: spot.id === 4
                        ? '1 / span 1'
                        : spot.id === 5
                        ? '2 / span 1'
                        : spot.id === 6
                        ? '3 / span 2'
                        : spot.id === 7
                        ? '5 / span 1'
                        : '6 / span 1',
                    }}
                    onClick={() => setSelectedSpot(spot)}
                  />
                ))}

                {/* Row 3: 6 Small Spots (9, 10, 11, 12, 13, 14) -> 1 col each = 6 cols */}
                {spots.slice(8, 14).map((spot, idx) => (
                  <SpotCard
                    key={spot.id}
                    spot={{
                      ...spot,
                      grid_col: `${idx + 1} / span 1`,
                    }}
                    onClick={() => setSelectedSpot(spot)}
                  />
                ))}

                {/* Row 4: 3 Medium Banners (15, 16, 17) -> 2 cols each = 6 cols */}
                {spots.slice(14, 17).map((spot, idx) => (
                  <SpotCard
                    key={spot.id}
                    spot={{
                      ...spot,
                      grid_col: idx === 0 ? '1 / span 2' : idx === 1 ? '3 / span 2' : '5 / span 2',
                    }}
                    onClick={() => setSelectedSpot(spot)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Billboard Dual Support Pillars & Ground Foundation */}
          <div className="flex justify-between px-20 -mt-0.5">
            <div className="h-6 w-5 bg-gradient-to-b from-zinc-800 to-zinc-600 rounded-b shadow-md" />
            <div className="h-6 w-5 bg-gradient-to-b from-zinc-800 to-zinc-600 rounded-b shadow-md" />
          </div>
          <div className="mx-auto h-1.5 w-[70%] bg-black/10 rounded-full blur-xs -mt-0.5" />
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
