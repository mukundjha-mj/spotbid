'use client';

export default function ComingSoon() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-white px-4 py-8 sm:py-12 text-center text-zinc-950 selection:bg-emerald-500 selection:text-white">
      {/* Subtle Ambient Mesh Gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-emerald-100/50 via-zinc-100/30 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-50/40 blur-3xl" />

      {/* Top Navbar Brand Header */}
      <header className="relative z-10 mx-auto flex items-center justify-between w-full max-w-4xl px-2">
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 28 28" fill="none" className="h-6 w-6">
            <rect x="2" y="14" width="4.5" height="11" rx="1.5" fill="#a1a1aa" />
            <rect x="11.5" y="8" width="4.5" height="17" rx="1.5" fill="#09090b" />
            <rect x="21" y="2" width="4.5" height="23" rx="1.5" fill="#10b981" />
          </svg>
          <span className="font-black text-base tracking-tight text-zinc-950">
            spotbid<span className="text-zinc-400 font-mono font-medium text-xs">.top</span>
          </span>
        </div>

        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-mono font-bold text-emerald-700 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>PREPARATION STAGE</span>
        </div>
      </header>

      {/* Main Center Minimalist Hero */}
      <div className="relative z-10 mx-auto my-auto flex w-full max-w-2xl flex-col items-center py-12">
        {/* Monospace System Tag */}
        <div className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600">
          <span>[ THE PUBLIC ATTENTION BILLBOARD ]</span>
        </div>

        {/* Big Crisp Typography Headline */}
        <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight text-zinc-950 leading-[1.06]">
          Bidding Starts <span className="bg-gradient-to-r from-zinc-950 via-zinc-800 to-emerald-600 bg-clip-text text-transparent">Soon.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 max-w-lg text-sm sm:text-base text-zinc-500 leading-relaxed font-normal">
          We are finalizing payment verification and gateway integration. All 17 billboard placements will unlock for live auction bidding shortly.
        </p>

        {/* 3 Sleek Feature / Metric Badges */}
        <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-md">
          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 sm:p-4 text-center shadow-2xs transition-all hover:bg-white hover:shadow-xs">
            <div className="text-xl sm:text-2xl font-black text-zinc-950 font-mono">17</div>
            <div className="text-[10px] sm:text-xs font-mono text-zinc-400 mt-1 uppercase font-semibold">Placements</div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 sm:p-4 text-center shadow-2xs transition-all hover:bg-emerald-50 hover:shadow-xs">
            <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">$5</div>
            <div className="text-[10px] sm:text-xs font-mono text-emerald-600 mt-1 uppercase font-semibold">Starting Bid</div>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 sm:p-4 text-center shadow-2xs transition-all hover:bg-white hover:shadow-xs">
            <div className="text-xl sm:text-2xl font-black text-zinc-950 font-mono">24/7</div>
            <div className="text-[10px] sm:text-xs font-mono text-zinc-400 mt-1 uppercase font-semibold">Live Traffic</div>
          </div>
        </div>

        {/* Share on X Button */}
        <div className="mt-8 flex items-center gap-3">
          <a
            href="https://twitter.com/intent/tweet?text=SpotBid%20is%20launching%20soon%20-%2017%20brand%20spots%20on%20a%20public%20attention%20billboard!%20Check%20it%20out:&url=https%3A%2F%2Fspotbid.top"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-black transition-all active:scale-95"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-xs font-mono text-zinc-400">
        spotbid.top · All Rights Reserved
      </footer>
    </main>
  );
}



