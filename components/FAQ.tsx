'use client';

import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How do payments work with Polar in India and globally?',
      a: 'SpotBid uses Polar (Merchant of Record). Bidders can pay using credit cards, debit cards, Apple Pay, or Google Pay in USD. Payouts are automatically routed to your bank account without needing Stripe.',
    },
    {
      q: 'What happens when someone outbids me?',
      a: 'You instantly receive an email alert powered by Resend with a one-click link to counter-bid. If you choose not to counter-bid before the auction closes, your deposit is refunded.',
    },
    {
      q: 'How does the anti-sniping protection work?',
      a: 'Any bid placed within the final 10 minutes of the auction automatically extends the countdown clock by another 10 minutes to prevent bot sniping.',
    },
    {
      q: 'What formats are supported for logos?',
      a: 'We support PNG, SVG, WEBP, and JPG images with transparent or solid backgrounds.',
    },
  ];

  return (
    <section id="faq" className="scroll-mt-16 py-16 bg-zinc-50/50 border-t border-zinc-200">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-8">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600">
            [DOCUMENTATION]
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left font-medium text-zinc-900 hover:text-black transition-colors text-sm"
                >
                  <span>{faq.q}</span>
                  <span className="font-mono text-xs text-zinc-400 ml-4">
                    {isOpen ? '[-]' : '[+]'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
