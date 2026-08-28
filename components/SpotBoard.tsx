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
    <section id="board" className="scroll-mt-16 py-10 md:py-14">
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
          <div className="relative rounded-2xl border border-zinc-200/80 bg-zinc-100/70 p-3 sm:p-4 shadow-sm">
            {/* Grid */}
            <div
              className="grid gap-2.5 sm:gap-3"
              style={{
                gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
              }}
            >
              {/* Row 1: Large Spots (1, 2, 3) */}
              {spots.slice(0, 3).map((spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  onClick={() => setSelectedSpot(spot)}
                />
              ))}

              {/* Row 2: Spot 4, 5, Center Anchor, Spot 6, 7 */}
              {spots.slice(3, 5).map((spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  onClick={() => setSelectedSpot(spot)}
                />
              ))}

              {/* Center Branded Anchor Box */}
              <div
                className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-3 text-center shadow-xs"
                style={{ gridColumn: '3 / span 2', gridRow: 2 }}
              >
                <div className="flex items-center gap-1.5">
                  <svg viewBox="0 0 28 28" fill="none" className="h-4 w-4">
                    <rect x="2" y="14" width="4.5" height="11" rx="1.5" fill="#a1a1aa" />
                    <rect x="11.5" y="8" width="4.5" height="17" rx="1.5" fill="#09090b" />
                    <rect x="21" y="2" width="4.5" height="23" rx="1.5" fill="#10b981" />
                  </svg>
                  <span className="font-black text-xs tracking-tight text-zinc-900">
                    spotbid<span className="text-zinc-400 font-mono text-[10px]">.top</span>
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 mt-1 uppercase tracking-wider">
                  Attention Board
                </span>
              </div>

              {spots.slice(5, 7).map((spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  onClick={() => setSelectedSpot(spot)}
                />
              ))}

              {/* Row 3: Medium Spots (8, 9, 10) */}
              {spots.slice(7, 10).map((spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  onClick={() => setSelectedSpot(spot)}
                />
              ))}

              {/* Row 4: Wide Footer Banners (11, 12) */}
              {spots.slice(10, 12).map((spot, idx) => (
                <SpotCard
                  key={spot.id}
                  spot={{
                    ...spot,
                    grid_col: idx === 0 ? '1 / span 3' : '4 / span 3',
                  }}
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
