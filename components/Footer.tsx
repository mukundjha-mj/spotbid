import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-10 text-xs font-mono text-zinc-500">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-black text-[10px] font-black text-white">
            SB
          </div>
          <span className="font-bold text-zinc-900">spotbid.top</span>
          <span>·</span>
          <span>(c) {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#board" className="hover:text-black transition-colors">
            board
          </a>
          <a href="#leaderboard" className="hover:text-black transition-colors">
            leaderboard
          </a>
          <a href="#how" className="hover:text-black transition-colors">
            how-it-works
          </a>
          <a href="#faq" className="hover:text-black transition-colors">
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
