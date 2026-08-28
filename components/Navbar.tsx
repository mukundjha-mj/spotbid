'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-white font-black text-xs shadow-sm">
            SB
          </div>
          <span className="font-bold text-sm tracking-tight text-zinc-900 flex items-center gap-1">
            spotbid<span className="text-zinc-400 font-mono font-normal text-xs">.top</span>
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
