// src/components/WhyChooseUsSection.jsx
import React from 'react';
import { Reveal } from './useScrollReveal';
import { ShieldCheckIcon, TruckIcon, RefreshIcon, HeadphonesIcon } from './Icons';

const ASSURANCE_PILLARS = [
  {
    icon: ShieldCheckIcon,
    title: 'Verified Quality & Warranty',
    description: 'Every timepiece, leather good, and device is sourced with verified serials and full brand manufacturer warranty.'
  },
  {
    icon: TruckIcon,
    title: 'Insured Express Logistics',
    description: 'Complimentary priority delivery across India via BlueDart & Delhivery with end-to-end tracking updates.'
  },
  {
    icon: RefreshIcon,
    title: '7-Day Peace-of-Mind',
    description: 'Frictionless 7-day replacements and return support should you need any size, color, or model adjustment.'
  },
  {
    icon: HeadphonesIcon,
    title: 'Flagship Mumbai Concierge',
    description: 'Direct assistance from our specialists at Heera Panna, Haji Ali, Mumbai for order care and styling consultations.'
  }
];

export default function WhyChooseUsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Header */}
      <Reveal direction="up" delay={40}>
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
            THE KRISHNA STANDARD
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-950">
            Boutique Craftsmanship &amp; Assurance
          </h2>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-500">
            Committed to exceptional product quality, secure nationwide delivery, and dedicated client service.
          </p>
        </div>
      </Reveal>

      {/* 4-Pillar Minimalist Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {ASSURANCE_PILLARS.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <Reveal key={pillar.title} direction="up" delay={idx * 60} duration={600}>
              <div className="group h-full rounded-2xl sm:rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:border-neutral-300 flex flex-col justify-between">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-amber-300 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-base font-bold text-neutral-950 leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] font-semibold text-neutral-400 group-hover:text-neutral-900 transition-colors">
                  <span>Guaranteed</span>
                  <span>✓</span>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
