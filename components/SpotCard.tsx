'use client';

import { Spot, formatCurrency } from '@/lib/types';
import { getNextSpotPriceCents } from '@/lib/pricing';

interface SpotCardProps {
  spot: Spot;
  className?: string;
  onClick: () => void;
}

export default function SpotCard({ spot, className = '', onClick }: SpotCardProps) {
  const isTaken = spot.current_bid > 0;
  const isCenterStage = spot.id === 6;
  const isBanner = spot.tier === 'large' || spot.tier === 'medium' || (spot.grid_col && spot.grid_col.includes('span 2')) || (spot.grid_col && spot.grid_col.includes('span 3'));
  const nextPriceCents = getNextSpotPriceCents(spot);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative flex h-full w-full flex-col justify-between
        overflow-hidden rounded-xl border transition-all duration-150 bg-white
        ${
          isCenterStage && !isTaken
            ? 'border-emerald-300 shadow-xs hover:border-black hover:shadow-md'
            : isTaken
            ? 'border-zinc-300 shadow-xs hover:border-black hover:shadow-md'
            : 'border-zinc-200/90 shadow-xs hover:border-black hover:shadow-md'
        }
        focus-visible:outline-2 focus-visible:outline-black
        min-h-[88px] sm:min-h-[105px] text-left cursor-pointer p-2 sm:p-2.5
        ${className}
      `}
    >
      {/* Top Header Tag */}
      <div className="flex w-full items-center justify-between text-[10px] sm:text-xs font-mono leading-none gap-1">
        <span className="text-zinc-400 font-bold shrink-0">#{spot.id.toString().padStart(2, '0')}</span>
        <span
          className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono uppercase tracking-wider font-bold shrink-0 whitespace-nowrap ${
            isCenterStage && !isTaken
              ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
              : isTaken
              ? 'bg-zinc-100 text-zinc-800 font-bold border border-zinc-200'
              : 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/70'
          }`}
        >
          {isTaken ? 'TAKEN' : isCenterStage ? 'PRIME CENTER' : 'OPEN'}
        </span>
      </div>

      {/* Main Logo & Brand Lockup */}
      <div className="flex w-full flex-1 items-center justify-center my-1 transition-all duration-150 group-hover:opacity-10">
        {isTaken && spot.logo_url ? (
          <div className="flex items-center gap-2.5 justify-center w-full px-1">
            {/* Big Logo Icon */}
            <div className="relative flex h-11 w-11 sm:h-13 sm:w-13 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 p-1 shadow-xs">
              <img
                src={spot.logo_url}
                alt={spot.bidder_name || ''}
                className="max-h-full max-w-full object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(spot.bidder_name || 'Spot')}&background=10b981&color=fff&size=128&bold=true&format=png`;
                }}
              />
            </div>
            {isBanner && (
              <div className="min-w-0 text-left truncate flex-1">
                <div className="text-sm sm:text-base font-black text-zinc-950 truncate leading-tight tracking-tight">
                  {spot.bidder_name}
                </div>
                {spot.bidder_url && (
                  <div className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                    {spot.bidder_url.replace(/^https?:\/\/(?:www\.)?/, '')}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : isTaken ? (
          <div className="text-center font-bold text-sm text-zinc-900 truncate px-1">
            {spot.bidder_name}
          </div>
        ) : isCenterStage ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1.5">
              <svg viewBox="0 0 28 28" fill="none" className="h-4.5 w-4.5">
                <rect x="2" y="14" width="4.5" height="11" rx="1.5" fill="#a1a1aa" />
                <rect x="11.5" y="8" width="4.5" height="17" rx="1.5" fill="#09090b" />
                <rect x="21" y="2" width="4.5" height="23" rx="1.5" fill="#10b981" />
              </svg>
              <span className="font-black text-xs tracking-tight text-zinc-950">
                spotbid<span className="text-zinc-400 font-mono text-[10px]">.top</span>
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 font-bold mt-0.5 uppercase tracking-wider">
              Attention Board Anchor
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-mono font-bold uppercase text-zinc-400 tracking-wider">
              {spot.tier} SPOT
            </span>
            <span className="text-[10px] font-mono text-zinc-400 mt-0.5">
              ${spot.min_bid / 100} Fixed
            </span>
          </div>
        )}
      </div>

      {/* Bottom Price Bar */}
      <div className="flex w-full items-center justify-between text-[10px] sm:text-[11px] font-mono transition-all duration-150 group-hover:opacity-10 border-t border-zinc-100 pt-1.5 leading-none">
        <span className="truncate text-zinc-400 text-[9px] sm:text-[10px] max-w-[55%]">
          {isTaken ? (!isBanner ? spot.bidder_name : 'Current') : 'Fixed'}
        </span>
        <span
          className={`font-bold tabular-nums text-[10px] sm:text-[11px] ${
            isTaken ? 'text-emerald-600 font-extrabold' : isCenterStage ? 'text-emerald-700 font-extrabold' : 'text-zinc-900'
          }`}
        >
          {isTaken ? formatCurrency(spot.current_bid) : formatCurrency(spot.min_bid)}
        </span>
      </div>

      {/* 2-Line Hover Action Button (Clean Stacked Layout) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 bg-white/92 backdrop-blur-[2px]">
        <div
          className={`flex flex-col items-center justify-center rounded-lg px-3 py-1.5 shadow-md transition-transform group-hover:scale-105 min-w-[76px] ${
            isTaken
              ? 'bg-rose-600 text-white shadow-rose-600/20'
              : 'bg-black text-white shadow-black/20'
          }`}
        >
          <span className="text-[9px] font-mono font-extrabold uppercase tracking-wider leading-tight opacity-90">
            {isTaken ? 'TAKE OVER' : 'CLAIM SPOT'}
          </span>
          <span className="text-xs font-mono font-black tracking-tight leading-tight mt-0.5">
            ${isTaken ? nextPriceCents / 100 : spot.min_bid / 100} &gt;
          </span>
        </div>
      </div>
    </button>
  );
}
