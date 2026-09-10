// src/components/WhyChooseUsSection.jsx
import React from 'react';
import Reveal from './Reveal';
import { ShieldCheck, Award, Truck, Headset } from 'lucide-react';

const DIFFERENCE_ITEMS = [
  {
    number: '01',
    icon: ShieldCheck,
    title: '100% Certified Authentic',
    text: 'Every timepiece, leather good, and device is sourced directly with stamped brand warranties and official serial numbers.'
  },
  {
    number: '02',
    icon: Award,
    title: 'Curated Heritage Quality',
    text: 'Hand-inspected multi-brand luxury collections chosen for craftsmanship, enduring aesthetics, and everyday usability.'
  },
  {
    number: '03',
    icon: Truck,
    title: 'Insured Express Logistics',
    text: 'Priority dispatch across Mumbai and pan-India via BlueDart and Delhivery with tamper-proof security seals.'
  },
  {
    number: '04',
    icon: Headset,
    title: 'Mumbai Concierge Support',
    text: 'Direct assistance from our Heera Panna Haji Ali flagship team via WhatsApp, phone, and private showroom consultations.'
  }
];

export default function WhyChooseUsSection({ items = DIFFERENCE_ITEMS }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* Header */}
      <Reveal direction="up" className="mb-10 text-center">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#8C6734]">
          The Krishna Distinction
        </span>
        <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl font-serif">
          Why Discerning Clients Choose Us
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-gray-500 sm:text-sm font-light">
          We combine the prestige of an authorized Mumbai flagship boutique with seamless insured digital shopping.
        </p>
      </Reveal>

      {/* 4-Column Feature Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Reveal
              key={item.number}
              delay={idx * 80}
              direction="up"
              className="h-full"
            >
              <div className="group h-full rounded-[24px] border border-gray-200/90 bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-300/80 hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-[#8C6734] border border-amber-200/60 shadow-2xs group-hover:bg-[#0F172A] group-hover:text-amber-300 group-hover:border-[#0F172A] transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold tracking-wider text-gray-300 group-hover:text-[#8C6734] transition-colors">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-950 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-xs leading-relaxed text-gray-500 font-normal">
                    {item.text}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#8C6734] uppercase tracking-wider">
                    Verified Standard
                  </span>
                  <div className="h-1 w-6 rounded-full bg-gray-200 transition-all duration-300 group-hover:w-12 group-hover:bg-[#8C6734]" />
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
