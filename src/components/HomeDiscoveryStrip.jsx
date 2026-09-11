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
    iconBg: 'bg-blue-50 text-blue-700 border border-blue-200/70',
    tagBg: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    id: 'returns',
    tag: 'EASY POLICY',
    title: '7-Day Easy Returns',
    subtitle: 'Hassle-free replacement & return policy',
    icon: RefreshIcon,
    to: '/terms-conditions',
    iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/70',
    tagBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'payments',
    tag: '100% ENCRYPTED',
    title: 'Secure Payment',
    subtitle: 'Bank-grade 256-bit SSL & UPI checkout',
    icon: ShieldCheckIcon,
    to: '/checkout',
    iconBg: 'bg-amber-50 text-amber-700 border border-amber-200/70',
    tagBg: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    id: 'support',
    tag: 'MUMBAI STORE',
    title: '24/7 VIP Concierge',
    subtitle: 'Direct Haji Ali boutique assistance',
    icon: HeadphonesIcon,
    to: '/contact',
    iconBg: 'bg-purple-50 text-purple-700 border border-purple-200/70',
    tagBg: 'bg-purple-50 text-purple-700 border-purple-200'
  }
];

export default function HomeDiscoveryStrip() {
  return (
    <section className="relative w-full pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 4-Feature Interactive Grid with Generous Responsive Spacing */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 md:gap-5 lg:gap-6">
          {features.map(({ id, tag, title, subtitle, icon: Icon, to, iconBg, tagBg }, idx) => (
            <Reveal key={id} direction="up" delay={idx * 65} duration={600}>
              <Link
                to={to}
                className="group relative flex items-center justify-between rounded-[22px] sm:rounded-3xl border border-gray-200/85 bg-white p-4 sm:p-5 lg:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-[0_14px_28px_rgba(0,0,0,0.06)] active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  {/* Luxury Rounded Icon Box */}
                  <div
                    className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg} transition-transform duration-300 group-hover:scale-108 shadow-2xs`}
                  >
                    <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                  </div>

                  {/* Content & Tag */}
                  <div className="min-w-0 pr-1">
                    <span className={`inline-block rounded-md px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider border mb-1 ${tagBg}`}>
                      {tag}
                    </span>
                    <h3 className="truncate text-xs sm:text-[13.5px] lg:text-[14px] font-bold text-gray-950 transition-colors group-hover:text-black leading-tight">
                      {title}
                    </h3>
                    <p className="mt-0.5 text-[11px] sm:text-[11.5px] text-gray-500 line-clamp-1 leading-snug font-normal">
                      {subtitle}
                    </p>
                  </div>
                </div>

                {/* Hover Cue Arrow */}
                <div className="ml-2 shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-50 text-gray-400 transition-all duration-300 group-hover:bg-neutral-900 group-hover:text-white group-hover:translate-x-0.5">
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}