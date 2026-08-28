'use client';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Pick a Block',
      desc: 'Browse the 12 scarce positions on the board. Banners and Marquee spots provide maximum prominence.',
    },
    {
      num: '02',
      title: 'Bid and Upload Logo',
      desc: 'Enter your brand, link, upload your logo, and pay a 20% deposit via Polar (cards, Apple Pay, Google Pay).',
    },
    {
      num: '03',
      title: 'Anti-Sniping Engine',
      desc: 'Any bid in the final 10 minutes automatically extends the timer by 10 minutes to guarantee fair competition.',
    },
    {
      num: '04',
      title: 'Outbid Protection',
      desc: 'If someone outbids you, you get an instant email alert to counter-bid. If you pass, your deposit is refunded.',
    },
  ];

  return (
    <section id="how" className="scroll-mt-16 py-16 bg-white border-t border-zinc-200">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-8">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600">
            [THE MECHANICS]
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 mt-1">
            How SpotBid Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {steps.map((s) => (
            <div
              key={s.num}
              className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 hover:border-zinc-300 transition-colors shadow-sm"
            >
              <div className="font-mono text-xs font-bold text-zinc-400">{s.num}</div>
              <h3 className="text-base font-bold text-zinc-900 mt-2">{s.title}</h3>
              <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
