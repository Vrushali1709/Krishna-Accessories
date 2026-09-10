// src/components/TrustServicesBar.jsx
import React from 'react';

const TRUST_PILLARS = [
  {
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    badge: '100% Certified',
    title: 'Certified Authentic',
    desc: 'Direct sourcing with official manufacturer warranty & verification',
  },
  {
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.175V3.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75" />
      </svg>
    ),
    badge: 'Express Delivery',
    title: 'Insured Logistics',
    desc: 'Tamper-proof express packaging via BlueDart & Delhivery Priority',
  },
  {
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    badge: 'Zero Risk',
    title: '7-Day Easy Return',
    desc: 'Hassle-free doorstep pickup & instant refund guaranteed',
  },
  {
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    badge: '256-Bit SSL',
    title: 'Secure Checkout',
    desc: 'Encrypted payments via UPI, EMI, Cards & Cash on Delivery',
  }
];

export default function TrustServicesBar() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
      <div className="rounded-2xl sm:rounded-3xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-gray-100">
          {TRUST_PILLARS.map((pillar, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3.5 group pt-3 sm:pt-0 ${idx > 0 ? 'lg:pl-6' : ''}`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 transition-transform duration-300 group-hover:scale-110 group-hover:bg-amber-500/15">
                {pillar.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-[13px] font-bold text-gray-950 tracking-tight group-hover:text-amber-900 transition-colors">
                    {pillar.title}
                  </h4>
                  <span className="inline-block rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 px-1.5 py-0.2 text-[8.5px] font-bold tracking-wider uppercase">
                    {pillar.badge}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
