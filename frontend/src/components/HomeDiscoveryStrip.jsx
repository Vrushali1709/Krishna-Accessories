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
    tag: 'FREE DELIVERY',
    title: 'Free Express Shipping',
    subtitle: 'Insured delivery across India above ₹2,000',
    icon: TruckIcon,
    to: '/shop',
    iconBg: 'bg-blue-900/10 text-blue-700 border border-blue-300/60',
    tagBg: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  {
    id: 'returns',
    tag: 'EASY POLICY',
    title: '7-Day Easy Returns',
    subtitle: 'Hassle-free replacement & return policy',
    icon: RefreshIcon,
    to: '/terms-conditions',
    iconBg: 'bg-emerald-900/10 text-emerald-700 border border-emerald-300/60',
    tagBg: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  {
    id: 'payments',
    tag: '100% ENCRYPTED',
    title: 'Secure Payment',
    subtitle: 'Bank-grade 256-bit SSL & UPI checkout',
    icon: ShieldCheckIcon,
    to: '/checkout',
    iconBg: 'bg-amber-900/10 text-amber-700 border border-amber-300/60',
    tagBg: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  {
    id: 'support',
    tag: 'MUMBAI STORE',
    title: '24/7 VIP Concierge',
    subtitle: 'Direct Haji Ali boutique assistance',
    icon: HeadphonesIcon,
    to: '/contact',
    iconBg: 'bg-purple-900/10 text-purple-700 border border-purple-300/60',
    tagBg: 'bg-purple-50 text-purple-800 border-purple-200'
  }
];

export default function HomeDiscoveryStrip() {
  return (
    <section className="relative w-full floor-cashmere py-7 sm:py-9 border-b border-[#E7E2D9]">
      {/* Subtle Inset Ambient Light */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C5A880]/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* 4-Feature Interactive Grid with Luxurious Floating Pedestals */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-5 lg:grid-cols-4 lg:gap-6">
          {features.map(({ id, tag, title, subtitle, icon: Icon, to, iconBg, tagBg }, idx) => (
            <Reveal key={id} direction="up" delay={idx * 65} duration={600}>
              <Link
                to={to}
                className="group relative flex min-h-[142px] min-w-0 flex-col items-start justify-between rounded-2xl sm:min-h-0 sm:flex-row sm:items-center sm:rounded-3xl border border-[#E4DED4] bg-white/95 p-3.5 sm:p-5 lg:p-5 shadow-[0_4px_16px_rgba(20,15,5,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C5A880]/70 hover:shadow-[0_16px_34px_rgba(197,168,128,0.14)] active:scale-[0.99]"
              >
                <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
                  {/* Luxury Rounded Icon Box */}
                  <div
                    className={`flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl ${iconBg} transition-all duration-300 group-hover:scale-110 shadow-2xs`}
                  >
                    <Icon className="h-4 w-4 sm:h-5.5 sm:w-5.5" />
                  </div>

                  {/* Content & Tag */}
                  <div className="min-w-0 max-w-full pr-5 sm:pr-1">
                    <span className={`inline-block max-w-[calc(100%-8px)] truncate rounded-md px-1.5 py-0.2 text-[8px] sm:text-[9px] font-black uppercase tracking-wider border mb-1 ${tagBg}`}>
                      {tag}
                    </span>
                    <h3 className="truncate text-[12px] sm:text-[13.5px] lg:text-[14px] font-bold text-gray-950 transition-colors group-hover:text-black leading-tight">
                      {title}
                    </h3>
                    <p className="mt-0.5 text-[10px] sm:text-[11.5px] text-gray-500 line-clamp-2 leading-snug font-normal">
                      {subtitle}
                    </p>
                  </div>
                </div>

                {/* Hover Cue Arrow */}
                <div className="absolute right-3 top-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5F2EC] text-gray-500 transition-all duration-300 group-hover:bg-[#111827] group-hover:text-[#C5A880] group-hover:translate-x-0.5 sm:static sm:ml-2 sm:h-7 sm:w-7">
                  <ArrowRightIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}