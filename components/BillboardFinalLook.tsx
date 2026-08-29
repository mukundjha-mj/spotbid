'use client';

import { useState } from 'react';
import { Spot } from '@/lib/types';

interface BillboardFinalLookProps {
  spots: Spot[];
}

export default function BillboardFinalLook({ spots }: BillboardFinalLookProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== 'undefined') {
      const text = encodeURIComponent(
        'Check out the live attention billboard on spotbid.top! Claim your brand spot before it sells out 🔥\n\n'
      );
      const url = encodeURIComponent(window.location.origin);
      window.open(
        `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[1000px] flex flex-col items-center">
      {/* 16:9 Aspect Ratio Container for Photorealistic Billboard Image */}
      <div className="relative w-full aspect-[16/9] select-none overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-100 shadow-2xl">
        {/* Photorealistic Billboard Base Photograph with Spotlights, Catwalk, and Steel Frame */}
        <img
          src="/billboard-real.jpg"
          alt="Photorealistic Billboard Showcase"
          className="h-full w-full object-cover"
        />

        {/* Billboard Canvas Area Overlay */}
        {/* Perfectly mapped to the inner white vinyl canvas of the billboard image */}
        <div
          className="absolute z-10"
          style={{
            top: '17.4%',
            left: '15.9%',
            width: '68.2%',
            height: '50.9%',
          }}
        >
          {/* 17 Placements Grid (6 Columns x 4 Rows) */}
          <div className="h-full w-full p-1 sm:p-2.5 flex flex-col justify-between">
            <div className="grid grid-cols-6 gap-1 sm:gap-2 h-full w-full">
              {/* Row 1: 3 Large Banners (Spots 1, 2, 3 -> 2 cols each) */}
              {spots.slice(0, 3).map((spot) => {
                const isTaken = spot.current_bid > 0;
                return (
                  <div
                    key={spot.id}
                    className={`col-span-2 relative flex flex-col items-center justify-center rounded-sm sm:rounded p-1 sm:p-1.5 transition-all ${
                      isTaken
                        ? 'bg-white/90 backdrop-blur-[1px] border border-zinc-200 shadow-2xs'
                        : 'border border-dashed border-zinc-300/70 bg-white/30'
                    }`}
                  >
                    {isTaken && spot.logo_url ? (
                      <div className="flex items-center gap-1.5 sm:gap-2.5 justify-center w-full px-1">
                        <div className="flex h-6 w-6 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded bg-white p-0.5 shadow-2xs border border-zinc-100">
                          <img
                            src={spot.logo_url}
                            alt={spot.bidder_name || ''}
                            className="max-h-full max-w-full object-contain rounded-xs"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(spot.bidder_name || 'Spot')}&background=10b981&color=fff&size=128&bold=true&format=png`;
                            }}
                          />
                        </div>
                        <div className="min-w-0 text-left truncate flex-1">
                          <div className="text-[9px] sm:text-xs md:text-sm font-black text-zinc-950 truncate tracking-tight leading-none">
                            {spot.bidder_name}
                          </div>
                          {spot.bidder_url && (
                            <div className="text-[7px] sm:text-[9px] md:text-[10px] font-mono text-zinc-500 truncate mt-0.5 leading-none">
                              {spot.bidder_url.replace(/^https?:\/\/(?:www\.)?/, '')}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : isTaken ? (
                      <div className="text-[9px] sm:text-xs md:text-sm font-black text-zinc-900 truncate px-1">
                        {spot.bidder_name}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center opacity-40">
                        <span className="text-[8px] sm:text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                          {spot.label}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Row 2: Spot 4 (1 col), Spot 5 (1 col), Spot 6 (Center Stage 2 cols), Spot 7 (1 col), Spot 8 (1 col) */}
              {spots.slice(3, 8).map((spot) => {
                const isTaken = spot.current_bid > 0;
                const isCenter = spot.id === 6;
                return (
                  <div
                    key={spot.id}
                    className={`${
                      isCenter ? 'col-span-2' : 'col-span-1'
                    } relative flex flex-col items-center justify-center rounded-sm sm:rounded p-0.5 sm:p-1 transition-all ${
                      isCenter && !isTaken
                        ? 'bg-emerald-50/80 border border-emerald-300 shadow-2xs'
                        : isTaken
                        ? 'bg-white/90 backdrop-blur-[1px] border border-zinc-200 shadow-2xs'
                        : 'border border-dashed border-zinc-300/70 bg-white/30'
                    }`}
                  >
                    {isTaken && spot.logo_url ? (
                      <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 justify-center w-full px-0.5">
                        <div className="flex h-5 w-5 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded bg-white p-0.5 shadow-2xs border border-zinc-100">
                          <img
                            src={spot.logo_url}
                            alt={spot.bidder_name || ''}
                            className="max-h-full max-w-full object-contain rounded-xs"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(spot.bidder_name || 'Spot')}&background=10b981&color=fff&size=128&bold=true&format=png`;
                            }}
                          />
                        </div>
                        <div className="text-center sm:text-left truncate max-w-full">
                          <div className="text-[8px] sm:text-[11px] font-black text-zinc-950 truncate leading-none">
                            {spot.bidder_name}
                          </div>
                        </div>
                      </div>
                    ) : isTaken ? (
                      <div className="text-[8px] sm:text-[11px] font-bold text-zinc-900 truncate px-0.5">
                        {spot.bidder_name}
                      </div>
                    ) : isCenter ? (
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="flex items-center gap-1">
                          <svg viewBox="0 0 28 28" fill="none" className="h-3 w-3 sm:h-4 sm:w-4">
                            <rect x="2" y="14" width="4.5" height="11" rx="1.5" fill="#a1a1aa" />
                            <rect x="11.5" y="8" width="4.5" height="17" rx="1.5" fill="#09090b" />
                            <rect x="21" y="2" width="4.5" height="23" rx="1.5" fill="#10b981" />
                          </svg>
                          <span className="font-black text-[8px] sm:text-xs md:text-sm tracking-tight text-zinc-950 leading-none">
                            spotbid<span className="text-zinc-400 font-mono text-[7px] sm:text-[9px]">.top</span>
                          </span>
                        </div>
                        <span className="text-[6px] sm:text-[8px] md:text-[9px] font-mono text-emerald-700 font-bold uppercase tracking-wider mt-0.5 leading-none">
                          Attention Board Anchor
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center opacity-40">
                        <span className="text-[7px] sm:text-[9px] md:text-[10px] font-mono font-bold text-zinc-400">
                          #{spot.id.toString().padStart(2, '0')}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Row 3: 6 Small Spots (Spots 9, 10, 11, 12, 13, 14 -> 1 col each) */}
              {spots.slice(8, 14).map((spot) => {
                const isTaken = spot.current_bid > 0;
                return (
                  <div
                    key={spot.id}
                    className={`col-span-1 relative flex flex-col items-center justify-center rounded-sm sm:rounded p-0.5 sm:p-1 transition-all ${
                      isTaken
                        ? 'bg-white/90 backdrop-blur-[1px] border border-zinc-200 shadow-2xs'
                        : 'border border-dashed border-zinc-300/70 bg-white/30'
                    }`}
                  >
                    {isTaken && spot.logo_url ? (
                      <div className="flex flex-col items-center justify-center w-full px-0.5">
                        <div className="flex h-4.5 w-4.5 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded bg-white p-0.5 shadow-2xs border border-zinc-100">
                          <img
                            src={spot.logo_url}
                            alt={spot.bidder_name || ''}
                            className="max-h-full max-w-full object-contain rounded-xs"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(spot.bidder_name || 'Spot')}&background=10b981&color=fff&size=128&bold=true&format=png`;
                            }}
                          />
                        </div>
                        <div className="text-[7px] sm:text-[9px] font-bold text-zinc-900 truncate mt-0.5 max-w-full leading-none">
                          {spot.bidder_name}
                        </div>
                      </div>
                    ) : isTaken ? (
                      <div className="text-[7px] sm:text-[9px] font-bold text-zinc-900 truncate px-0.5">
                        {spot.bidder_name}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center opacity-40">
                        <span className="text-[7px] sm:text-[9px] md:text-[10px] font-mono font-bold text-zinc-400">
                          #{spot.id.toString().padStart(2, '0')}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Row 4: 3 Medium Banners (Spots 15, 16, 17 -> 2 cols each) */}
              {spots.slice(14, 17).map((spot) => {
                const isTaken = spot.current_bid > 0;
                return (
                  <div
                    key={spot.id}
                    className={`col-span-2 relative flex flex-col items-center justify-center rounded-sm sm:rounded p-1 sm:p-1.5 transition-all ${
                      isTaken
                        ? 'bg-white/90 backdrop-blur-[1px] border border-zinc-200 shadow-2xs'
                        : 'border border-dashed border-zinc-300/70 bg-white/30'
                    }`}
                  >
                    {isTaken && spot.logo_url ? (
                      <div className="flex items-center gap-1.5 sm:gap-2.5 justify-center w-full px-1">
                        <div className="flex h-5 w-5 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded bg-white p-0.5 shadow-2xs border border-zinc-100">
                          <img
                            src={spot.logo_url}
                            alt={spot.bidder_name || ''}
                            className="max-h-full max-w-full object-contain rounded-xs"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(spot.bidder_name || 'Spot')}&background=10b981&color=fff&size=128&bold=true&format=png`;
                            }}
                          />
                        </div>
                        <div className="min-w-0 text-left truncate flex-1">
                          <div className="text-[8px] sm:text-xs md:text-sm font-black text-zinc-950 truncate tracking-tight leading-none">
                            {spot.bidder_name}
                          </div>
                          {spot.bidder_url && (
                            <div className="text-[6px] sm:text-[8px] md:text-[9px] font-mono text-zinc-500 truncate mt-0.5 leading-none">
                              {spot.bidder_url.replace(/^https?:\/\/(?:www\.)?/, '')}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : isTaken ? (
                      <div className="text-[8px] sm:text-xs md:text-sm font-bold text-zinc-900 truncate px-0.5">
                        {spot.bidder_name}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center opacity-40">
                        <span className="text-[8px] sm:text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                          {spot.label}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Share / Showcase Viral Action Bar */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleShareTwitter}
          className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-black transition-all active:scale-95"
        >
          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share on X
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 hover:text-zinc-950 transition-all active:scale-95"
        >
          {copied ? (
            <>
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
