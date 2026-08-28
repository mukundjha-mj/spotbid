'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Transparent Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <svg viewBox="0 0 28 28" fill="none" className="h-6 w-6 transition-transform group-hover:scale-105">
            <rect x="2" y="14" width="4.5" height="11" rx="1.5" fill="#a1a1aa" />
            <rect x="11.5" y="8" width="4.5" height="17" rx="1.5" fill="#09090b" />
            <rect x="21" y="2" width="4.5" height="23" rx="1.5" fill="#10b981" />
          </svg>
          <span className="font-black text-base tracking-tight text-zinc-950 flex items-center gap-0.5">
            spotbid<span className="text-zinc-400 font-mono font-medium text-xs">.top</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden items-center gap-6 text-xs font-mono text-zinc-500 md:flex">
          <a href="#board" className="hover:text-black transition-colors">
            [board]
          </a>
          <a href="#leaderboard" className="hover:text-black transition-colors">
            [leaderboard]
          </a>
          <a href="#how" className="hover:text-black transition-colors">
            [how-it-works]
          </a>
          <a href="#faq" className="hover:text-black transition-colors">
            [faq]
          </a>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-mono text-emerald-700">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span>LIVE</span>
          </div>

          <a
            href="#board"
            className="rounded-lg bg-black px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-zinc-800 active:scale-95 shadow-sm"
          >
            Claim Spot
          </a>
        </div>
      </div>
    </nav>
  );
}
