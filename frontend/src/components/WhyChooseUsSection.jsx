// src/components/WhyChooseUsSection.jsx
import React from 'react';
import { Reveal } from './useScrollReveal';
import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

const DIFFERENCE_ITEMS = [
  {
    number: '01',
    icon: ShieldCheck,
    title: 'Quality & Premium Products',
    text: 'Every timepiece, leather good, and device is curated with verified product details and reliable manufacturer warranty.'
  },
  {
    number: '02',
    icon: Truck,
    title: 'Insured Express Logistics',
    text: 'Dispatched securely via premium couriers (BlueDart & Delhivery) with real-time end-to-end SMS & WhatsApp tracking.'
  },
  {
    number: '03',
    icon: RotateCcw,
    title: '7-Day Peace-of-Mind',
    text: 'Enjoy straightforward 7-day replacements and zero-hassle returns should you need any size, color, or model adjustment.'
  },
  {
    number: '04',
    icon: Headphones,
    title: 'Dedicated Mumbai Concierge',
    text: 'Our specialized luxury consultants at Heera Panna, Haji Ali are available for personal consultations and order assistance.'
  }
];

export default function WhyChooseUsSection({ items = DIFFERENCE_ITEMS }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 sm:pt-14 pb-6 sm:pb-8 lg:px-8">
      {/* Header */}
      <Reveal direction="up" delay={50}>
        <div className="mb-8 sm:mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734] animate-ping" />
            <span className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-[#8C6734]">
              The Krishna Standard
            </span>
          </div>
          <h2 className="mt-1 font-serif text-2xl sm:text-4xl font-medium tracking-tight text-neutral-950">
            Why Shop With Us? <br />
            <span className="italic font-normal text-[#8C6734]">Distinction in Every Detail.</span>
          </h2>
          <p className="mx-auto mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
            We hold ourselves to the highest standards of luxury curation, verified product quality, and personalized client concierge.
          </p>
        </div>
      </Reveal>

      {/* 4-Column Feature Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, idx) => {
          const Icon = item.icon || ShieldCheck;
          return (
            <Reveal key={item.number} direction="up" delay={idx * 80} duration={650}>
              <div className="group relative h-full rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C5A880] hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAFAFB] border border-neutral-200/80 text-[#8C6734] group-hover:bg-neutral-950 group-hover:text-[#C5A880] group-hover:border-neutral-950 transition-all duration-300">
                      <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="font-mono text-xs font-bold tracking-[0.2em] text-neutral-300 group-hover:text-[#8C6734] transition-colors">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-base font-serif font-medium text-neutral-950 leading-snug">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                    {item.text}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[10.5px] font-bold text-neutral-400 uppercase tracking-wider group-hover:text-[#8C6734] transition-colors">
                    Guaranteed
                  </span>
                  <div className="h-1.5 w-8 rounded-full bg-neutral-200 transition-all duration-300 group-hover:w-12 group-hover:bg-[#8C6734]" />
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
