'use client';

import { Spot, formatCurrency } from '@/lib/types';

interface SpotCardProps {
  spot: Spot;
  onClick: () => void;
}

export default function SpotCard({ spot, onClick }: SpotCardProps) {
  const isTaken = spot.current_bid > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative flex h-full w-full flex-col items-center justify-between
        overflow-hidden rounded-xl border p-3 transition-all duration-200 bg-white
        ${
          isTaken
            ? 'border-zinc-300 shadow-xs hover:border-zinc-900 hover:shadow-md'
            : 'border-zinc-200/90 shadow-xs hover:border-zinc-900 hover:shadow-md'
        }
        focus-visible:outline-2 focus-visible:outline-black
        min-h-[92px] sm:min-h-[108px] text-left cursor-pointer
      `}
      style={{
        gridColumn: spot.grid_col,
      }}
    >
      {/* Top Meta Bar */}
      <div className="flex w-full items-center justify-between text-[10px] font-mono leading-none">
        <span className="text-zinc-400 font-bold">#{spot.id.toString().padStart(2, '0')}</span>
        <span
          className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider ${
            isTaken
              ? 'bg-zinc-100 text-zinc-800 font-bold border border-zinc-200'
              : 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/70'
          }`}
        >
          {isTaken ? 'TAKEN' : 'OPEN'}
        </span>
      </div>

      {/* Main Logo / Title Area */}
      <div className="flex w-full flex-1 items-center justify-center py-1 transition-all duration-200 group-hover:blur-[2px]">
        {isTaken && spot.logo_url ? (
          <img
            src={spot.logo_url}
            alt={spot.bidder_name || ''}
            className="max-h-[48px] max-w-[85%] object-contain"
          />
        ) : isTaken ? (
          <div className="text-center font-bold text-xs sm:text-sm text-zinc-900 truncate max-w-[90%]">
            {spot.bidder_name}
          </div>
        ) : (
          <div className="text-center">
            <span className="text-[11px] font-mono uppercase text-zinc-400 font-medium tracking-wide">
              {spot.tier}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Price Bar */}
      <div className="flex w-full items-center justify-between text-[11px] font-mono transition-all duration-200 group-hover:blur-[2px]">
        <span className="truncate text-zinc-400 text-[10px]">
          {isTaken ? spot.bidder_name : 'Starts at'}
        </span>
        <span
          className={`font-bold tabular-nums ${
            isTaken ? 'text-emerald-600' : 'text-zinc-900'
          }`}
        >
          {isTaken ? formatCurrency(spot.current_bid) : formatCurrency(spot.min_bid)}
        </span>
      </div>

      {/* Hover Action Overlay (Outbid / Claim) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100 bg-black/75 backdrop-blur-[1px]">
        <span
          className={`rounded-md px-3.5 py-1 text-xs font-bold font-mono tracking-wider text-white shadow-lg ${
            isTaken ? 'bg-rose-600 hover:bg-rose-500' : 'bg-white text-black font-extrabold'
          }`}
        >
          {isTaken ? 'OUTBID >' : 'CLAIM >'}
        </span>
      </div>
    </button>
  );
}
