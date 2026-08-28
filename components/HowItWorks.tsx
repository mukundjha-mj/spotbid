'use client';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Choose a Placement',
      desc: 'Pick an open unit or an occupied spot. Starting base prices are $5 for Small, $10 for Medium, and $25 for Large.',
    },
    {
      num: '02',
      title: 'Enter Name & Link',
      desc: 'Type your website or X handle. Your logo is automatically fetched and placed on the billboard.',
    },
    {
      num: '03',
      title: '+70% Takeover Rule',
      desc: 'To take over an occupied spot, pay the fixed +70% upgraded price. All payments are fixed and non-refundable.',
    },
    {
      num: '04',
      title: 'Instant Outbid Alert',
      desc: 'If another brand takes over your spot with the upgraded price, you receive an instant email alert to reclaim it.',
    },
  ];

  return (
    <section id="how" className="scroll-mt-16 py-14 bg-white border-t border-zinc-200">
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
