'use client';

import Link from 'next/link';

export default function Footer() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-zinc-200 bg-white py-10 text-xs font-mono text-zinc-500">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 28 28" fill="none" className="h-4.5 w-4.5">
            <rect x="2" y="14" width="4.5" height="11" rx="1.5" fill="#a1a1aa" />
            <rect x="11.5" y="8" width="4.5" height="17" rx="1.5" fill="#09090b" />
            <rect x="21" y="2" width="4.5" height="23" rx="1.5" fill="#10b981" />
          </svg>
          <span className="font-bold text-zinc-900">spotbid.top</span>
          <span>·</span>
          <span>(c) {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="#board"
            onClick={(e) => handleScroll(e, 'board')}
            className="hover:text-black transition-colors"
          >
            board
          </a>
          <a
            href="#leaderboard"
            onClick={(e) => handleScroll(e, 'leaderboard')}
            className="hover:text-black transition-colors"
          >
            leaderboard
          </a>
          <a
            href="#how"
            onClick={(e) => handleScroll(e, 'how')}
            className="hover:text-black transition-colors"
          >
            how-it-works
          </a>
          <a
            href="#faq"
            onClick={(e) => handleScroll(e, 'faq')}
            className="hover:text-black transition-colors"
          >
            faq
          </a>
        </div>

        <div className="text-zinc-400">
          POWERED BY POLAR & SUPABASE
        </div>
      </div>
    </footer>
  );
}
