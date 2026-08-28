'use client';

import { useState } from 'react';
import { Bid, formatCurrency } from '@/lib/types';

interface BidHistoryProps {
  bids: Bid[];
}

export default function BidHistory({ bids }: BidHistoryProps) {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'recent'>('leaderboard');

  // Only verified paid bids appear on the public leaderboard
  const confirmedBids = bids.filter((b) => b.status === 'paid');

  const topBids = [...confirmedBids].sort((a, b) => b.amount - a.amount);
  const recentBids = [...confirmedBids].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const displayBids = activeTab === 'leaderboard' ? topBids : recentBids;

  return (
    <section id="leaderboard" className="scroll-mt-16 py-12 border-t border-zinc-200 bg-zinc-50/50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600">
              [TRANSPARENT LEDGER]
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950 mt-1">
              The Leaderboard
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Live ranking of all bids verified through Polar
            </p>
          </div>

          <div className="flex rounded-lg border border-zinc-200 bg-white p-1 text-xs font-mono self-start sm:self-auto shadow-sm">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`rounded px-3 py-1 transition-all cursor-pointer ${
                activeTab === 'leaderboard'
                  ? 'bg-black text-white font-bold shadow-sm'
                  : 'text-zinc-500 hover:text-black'
              }`}
            >
              TOP BIDS
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`rounded px-3 py-1 transition-all cursor-pointer ${
                activeTab === 'recent'
                  ? 'bg-black text-white font-bold shadow-sm'
                  : 'text-zinc-500 hover:text-black'
              }`}
            >
              RECENT ({confirmedBids.length})
            </button>
          </div>
        </div>

        {/* Table View */}
        {displayBids.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-xs font-mono text-zinc-400 shadow-sm">
            [ NO VERIFIED BIDS RECORDED YET. BE THE FIRST TO CLAIM A SPOT. ]
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="divide-y divide-zinc-200">
              {displayBids.map((bid, index) => {
                const date = new Date(bid.created_at);
                const timeAgo = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div
                    key={bid.id}
                    className="flex items-center justify-between p-3.5 sm:px-5 hover:bg-zinc-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-zinc-200 bg-zinc-50 text-[11px] font-mono font-bold text-zinc-700">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-bold text-zinc-900 text-sm truncate">
                            {bid.bidder_name}
                          </span>
                          {bid.bidder_url && (
                            <a
                              href={bid.bidder_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] font-mono text-blue-600 hover:underline transition-colors cursor-pointer"
                            >
                              ↗
                            </a>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                          <span>Spot #{bid.spot_id}</span>
                          <span>·</span>
                          <span className="uppercase">{bid.spot_tier || 'Standard'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-emerald-600 text-sm sm:text-base tabular-nums">
                        {formatCurrency(bid.amount)}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400">{timeAgo}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
