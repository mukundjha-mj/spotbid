'use client';

import { formatCurrency } from '@/lib/types';
import AuctionTimer from './AuctionTimer';

interface HeroSectionProps {
  totalRaised: number;
  fundingGoal: number;
  endsAt: string;
  spotsTaken: number;
  totalSpots: number;
}

export default function HeroSection({
  totalRaised,
  fundingGoal,
  endsAt,
  spotsTaken,
  totalSpots,
}: HeroSectionProps) {
  const pct = fundingGoal > 0 ? Math.round((totalRaised / fundingGoal) * 100) : 0;

  return (
    <header className="relative mx-auto max-w-4xl px-4 pt-14 pb-10 text-center sm:px-6 md:pt-18">
      {/* Top Banner Tag */}
      <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1 text-xs text-zinc-600 shadow-sm">
        <span className="text-emerald-600 font-mono font-bold">● {spotsTaken}/{totalSpots} SPOTS OCCUPIED</span>
        <span className="text-zinc-300">|</span>
        <span className="font-mono">BIDS FROM $5</span>
      </div>

      {/* Main Headline */}
      <h1 className="mt-6 text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-zinc-950 leading-[1.08]">
        Bid to rank.
        <br />
        <span className="text-zinc-400 font-normal">Get your brand seen.</span>
      </h1>

      {/* Subtitle */}
      <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-zinc-600 leading-relaxed">
        The public attention board. Bid to claim prime visual placements.
        When someone outbids you, you get replaced and alerted instantly.
      </p>

      {/* Stats Ribbon */}
      <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 divide-x divide-zinc-200 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
        <div>
          <div className="text-[11px] font-mono text-zinc-400 uppercase">Total Volume</div>
          <div className="mt-0.5 text-base sm:text-lg font-bold font-mono text-emerald-600">
            {formatCurrency(totalRaised)}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-mono text-zinc-400 uppercase">Goal Status</div>
          <div className="mt-0.5 text-base sm:text-lg font-bold font-mono text-zinc-900">
            {pct}%
          </div>
        </div>
        <div>
          <div className="text-[11px] font-mono text-zinc-400 uppercase">Spots Open</div>
          <div className="mt-0.5 text-base sm:text-lg font-bold font-mono text-zinc-700">
            {totalSpots - spotsTaken} / {totalSpots}
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="mt-5">
        <AuctionTimer endsAt={endsAt} />
      </div>

      {/* Action Buttons */}
      <div className="mt-7 flex items-center justify-center gap-3">
        <a
          href="#board"
          className="rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-95 shadow-md"
        >
          View The Board ↓
        </a>
        <a
          href="#leaderboard"
          className="rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-black transition-colors shadow-sm"
        >
          Leaderboard
        </a>
      </div>
    </header>
  );
}
