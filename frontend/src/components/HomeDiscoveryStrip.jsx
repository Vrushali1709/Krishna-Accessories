// src/components/HomeDiscoveryStrip.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from './useScrollReveal';
import {
  ArrowRightIcon,
  HeadphonesIcon,
  RefreshIcon,
  ShieldCheckIcon,
  TruckIcon
} from './Icons';

const features = [
  {
    id: 'shipping',
    tag: 'EXPRESS DISPATCH',
    title: 'Free Express Shipping',
    subtitle: 'Complimentary insured shipping across India on orders above ₹2,000',
    icon: TruckIcon,
    to: '/shop'
  },
  {
    id: 'returns',
    tag: 'EASY POLICY',
    title: '7-Day Easy Returns',
    subtitle: 'Hassle-free 100% replacement and verified doorstep pickup',
    icon: RefreshIcon,
    to: '/terms-conditions'
  },
  {
    id: 'payments',
    tag: '100% ENCRYPTED',
    title: 'Secure Payment',
    subtitle: 'Bank-grade 256-bit SSL, UPI, Credit Cards & NetBanking protection',
    icon: ShieldCheckIcon,
    to: '/checkout'
  },
  {
    id: 'support',
    tag: 'MUMBAI FLAGSHIP',
    title: '24/7 VIP Concierge',
    subtitle: 'Direct boutique assistance and personal styling at Haji Ali Sanctuary',
    icon: HeadphonesIcon,
    to: '/contact'
  }
];

export default function HomeDiscoveryStrip() {
  return (
    <section className="relative w-full py-6 sm:py-8 bg-[#FAFAFB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 4-Column Luxury Service Feature Grid */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4.5">
          {features.map(({ id, tag, title, subtitle, icon: Icon, to }, idx) => (
            <Reveal key={id} direction="up" delay={idx * 60} duration={500}>
              <Link
                to={to}
                className="group relative flex flex-col justify-between h-full rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-[0_2px_14px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C5A880] hover:shadow-[0_12px_28px_rgba(197,168,128,0.12)] active:scale-[0.99]"
              >
                <div>
                  {/* Top Row: Luxury Icon + Micro Tag */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-[#0F1115] text-[#E5D7C5] transition-all duration-300 group-hover:bg-[#C5A880] group-hover:text-neutral-950 shadow-xs">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="inline-block rounded-full bg-[#FAF6F0] px-2.5 py-0.5 text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#9E7A4A] border border-[#EADBCA]/80">
                      {tag}
                    </span>
                  </div>

                  {/* Title & Description — No Truncation */}
                  <div className="mt-4">
                    <h3 className="text-[14.5px] sm:text-[15px] font-bold text-neutral-900 tracking-tight transition-colors group-hover:text-neutral-950 leading-snug">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-[11.5px] sm:text-[12px] text-neutral-500 leading-relaxed font-normal">
                      {subtitle}
                    </p>
                  </div>
                </div>

                {/* Bottom Interactive Link Cue */}
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-semibold text-neutral-400 transition-colors group-hover:text-[#9E7A4A]">
                  <span>Discover More</span>
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}