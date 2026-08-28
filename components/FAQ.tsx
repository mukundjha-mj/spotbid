'use client';

import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does the +70% Takeover Rule work?',
      a: 'Just like BrandMyMac, when a spot is taken, another user can buy it out by paying the fixed +70% upgraded price (e.g. $5 -> $9 -> $15 -> $26, or $25 -> $43 -> $73). The new buyer immediately secures the spot on the live billboard.',
    },
    {
      q: 'What are the base starting prices?',
      a: 'Open spots start at fixed base rates: Small spots at $5, Medium spots at $10, and Large Marquee banners at $25.',
    },
    {
      q: 'How do payments work in India and worldwide?',
      a: 'SpotBid uses Polar (Merchant of Record). You pay the fixed placement fee directly using cards, Apple Pay, or Google Pay in USD. All purchases are fixed and non-refundable.',
    },
    {
      q: 'What happens when my spot is taken over?',
      a: 'You instantly receive an email notification powered by Resend with a direct link to take back your spot at the next upgraded tier if you choose.',
    },
    {
      q: 'Do I need to upload a logo file?',
      a: 'No! Simply enter your website domain or X handle, and SpotBid automatically fetches and displays your high-resolution logo on the billboard in real-time.',
    },
  ];

  return (
    <section id="faq" className="scroll-mt-16 py-14 bg-zinc-50/50 border-t border-zinc-200">
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
                  className="w-full flex items-center justify-between p-4 text-left font-medium text-zinc-900 hover:text-black transition-colors text-sm cursor-pointer"
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
