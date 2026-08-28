'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const spotId = searchParams.get('spot_id');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111118] p-8 shadow-2xl animate-float-up">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-3xl text-green-400 mb-6">
          ✓
        </div>

        <h1 className="text-3xl font-bold text-white tracking-tight">
          Your Bid Is Live!
        </h1>
        <p className="mt-3 text-sm text-gray-400 leading-relaxed">
          {spotId
            ? `Congratulations! You are now the leading bidder for Spot #${spotId}.`
            : 'Your bid has been processed and your spot on the board is now live.'}
        </p>

        <div className="mt-6 rounded-2xl bg-white/[0.04] p-4 text-xs text-gray-400 border border-white/[0.06] text-left space-y-2">
          <div className="flex items-center gap-2 text-green-400 font-semibold">
            <span>●</span> Confirmation email sent
          </div>
          <div>We'll automatically alert you if someone attempts to outbid you.</div>
        </div>

        <div className="mt-8 space-y-3">
          <Link
            href="/#spots"
            className="block w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 transition-all"
          >
            View Live Board →
          </Link>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'SpotBid',
                  text: 'I just placed a bid for a spot on SpotBid!',
                  url: window.location.origin,
                });
              } else {
                navigator.clipboard.writeText(window.location.origin);
                alert('Link copied to clipboard!');
              }
            }}
            className="block w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 text-xs font-semibold text-gray-300 hover:bg-white/[0.08] transition-colors"
          >
            Share to Social 📢
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="text-center p-12 text-white">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
