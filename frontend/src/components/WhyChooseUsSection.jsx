// src/components/WhyChooseUsSection.jsx
import React from 'react';
import { Reveal } from './useScrollReveal';
import { ShieldCheckIcon, TruckIcon, RefreshIcon, HeadphonesIcon } from './Icons';

const DIFFERENCE_ITEMS = [
  {
    number: '01',
    icon: ShieldCheckIcon,
    title: 'Quality & Premium Products',
    text: 'Every timepiece, leather good, and device is curated with verified product details and reliable manufacturer warranty.'
  },
  {
    number: '02',
    icon: TruckIcon,
    title: 'Insured Express Logistics',
    text: 'Dispatched securely via premium couriers (BlueDart & Delhivery) with real-time end-to-end SMS & WhatsApp tracking.'
  },
  {
    number: '03',
    icon: RefreshIcon,
    title: '7-Day Peace-of-Mind',
    text: 'Enjoy straightforward 7-day replacements and zero-hassle returns should you need any size, color, or model adjustment.'
  },
  {
    number: '04',
    icon: HeadphonesIcon,
    title: 'Dedicated Mumbai Concierge',
    text: 'Our specialized luxury consultants at Heera Panna, Haji Ali are available 24/7 for styling advice and order assistance.'
  }
];

export default function WhyChooseUsSection({ items = DIFFERENCE_ITEMS }) {
  return (
    <section className="relative w-full floor-artisan-hall py-14 sm:py-20 border-b border-[#E2DBD0] overflow-hidden">
      {/* Subtle Inset Ambient Light */}
      <div className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-[#C5A880]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal direction="up" delay={50}>
          <div className="mb-10 sm:mb-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <span className="h-1.5 w-6 rounded-full bg-[#C5A880]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8C6734]">
                THE KRISHNA PROMISE
              </span>
              <span className="h-1.5 w-6 rounded-full bg-[#C5A880]" />
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950">
              Why Shop With Us?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-neutral-600 font-normal">
              We hold ourselves to the highest standards of luxury curation, verified authentic sourcing, and lifetime client relationships.
            </p>
          </div>
        </Reveal>

        {/* 4-Column Feature Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, idx) => {
            const Icon = item.icon || ShieldCheckIcon;
            return (
              <Reveal key={item.number} direction="up" delay={idx * 80} duration={650}>
                <div className="group relative h-full rounded-3xl border border-[#DCD5C6] bg-white/95 backdrop-blur-md p-6 sm:p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#C5A880] hover:shadow-[0_18px_38px_rgba(197,168,128,0.16)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111827] text-[#E5D7C5] shadow-md group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-5.5 w-5.5" />
                      </div>
                      <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#C5A880] group-hover:text-black transition-colors">
                        {item.number}
                      </span>
                    </div>

                    <h3 className="mt-5 text-base sm:text-[17px] font-extrabold text-gray-950 leading-snug">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-neutral-600 font-normal">
                      {item.text}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#EFEAE1] flex items-center justify-between">
                    <span className="text-[10.5px] font-bold text-neutral-500 uppercase tracking-wider group-hover:text-black transition-colors">
                      Guaranteed
                    </span>
                    <div className="h-1.5 w-10 rounded-full bg-[#E8E2D6] transition-all duration-300 group-hover:w-16 group-hover:bg-[#C5A880]" />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

