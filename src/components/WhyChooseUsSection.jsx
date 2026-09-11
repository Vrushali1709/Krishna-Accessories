// src/components/WhyChooseUsSection.jsx
import React from 'react';
import { Reveal } from './useScrollReveal';
import { ShieldCheckIcon, TruckIcon, RefreshIcon, HeadphonesIcon } from './Icons';

const DIFFERENCE_ITEMS = [
  {
    number: '01',
    icon: ShieldCheckIcon,
    title: '100% Certified Authentic',
    text: 'Every timepiece, leather good, and device is sourced directly from authorized brand houses with official manufacturer warranty.'
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
    <section className="mx-auto max-w-7xl px-4 pt-6 sm:pt-10 pb-4 sm:pb-6 lg:px-8">
      {/* Header */}
      <Reveal direction="up" delay={50}>
        <div className="mb-7 sm:mb-9 text-center">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.28em] text-neutral-400">
            THE KRISHNA PROMISE
          </span>
          <h2 className="mt-1.5 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-950">
            Why Shop With Us?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-gray-500 sm:text-sm">
            We hold ourselves to the highest standards of luxury curation, authentic sourcing, and client satisfaction.
          </p>
        </div>
      </Reveal>

      {/* 4-Column Feature Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, idx) => {
          const Icon = item.icon || ShieldCheckIcon;
          return (
            <Reveal key={item.number} direction="up" delay={idx * 80} duration={650}>
              <div className="group relative h-full rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-gray-300 hover:shadow-[0_14px_30px_rgba(0,0,0,0.06)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900 text-amber-300 shadow-2xs group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs font-bold tracking-[0.2em] text-neutral-300 group-hover:text-amber-600 transition-colors">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-base sm:text-[17px] font-bold text-gray-950 leading-snug">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-gray-500">
                    {item.text}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider group-hover:text-black transition-colors">
                    Guaranteed
                  </span>
                  <div className="h-1.5 w-8 rounded-full bg-neutral-200 transition-all duration-300 group-hover:w-14 group-hover:bg-amber-400" />
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
