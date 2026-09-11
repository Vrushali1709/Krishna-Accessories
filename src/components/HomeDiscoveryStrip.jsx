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
    title: 'Free Shipping',
    subtitle: 'Free across India on prepaid orders > ₹2,000',
    tag: 'INSURED TRANSIT',
    icon: TruckIcon,
    to: '/shop',
    iconBg: 'bg-blue-50 text-blue-700 border border-blue-200/80'
  },
  {
    id: 'returns',
    title: 'Easy Returns',
    subtitle: '7-Day hassle-free replacement guarantee',
    tag: 'PEACE OF MIND',
    icon: RefreshIcon,
    to: '/terms',
    iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
  },
  {
    id: 'payments',
    title: 'Secure Payment',
    subtitle: '100% bank-grade SSL encrypted checkout',
    tag: 'CERTIFIED SAFE',
    icon: ShieldCheckIcon,
    to: '/checkout',
    iconBg: 'bg-amber-50 text-amber-800 border border-amber-200/80'
  },
  {
    id: 'support',
    title: '24/7 VIP Concierge',
    subtitle: 'Direct Mumbai boutique & WhatsApp support',
    tag: 'OFFICIAL STORE',
    icon: HeadphonesIcon,
    to: '/contact',
    iconBg: 'bg-neutral-900 text-amber-300 border border-neutral-700'
  }
];

export default function HomeDiscoveryStrip() {
  return (
    <section className="w-full bg-white pt-8 sm:pt-10 pb-6 sm:pb-8 border-b border-gray-200/70 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 4-Feature Interactive Grid with Consistent Balanced Spacing */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 lg:gap-5">
          {features.map(({ id, title, subtitle, tag, icon: Icon, to, iconBg }, idx) => (
            <Reveal key={id} direction="up" delay={idx * 60} duration={650}>
              <Link
                to={to}
                className="group relative flex items-center justify-between h-full rounded-2xl sm:rounded-3xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-[0_2px_14px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-[0_14px_30px_rgba(0,0,0,0.07)]"
              >
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  {/* Luxury Icon Circle */}
                  <div
                    className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg} transition-transform duration-300 group-hover:scale-110 shadow-2xs`}
                  >
                    <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-[13.5px] sm:text-[14.5px] font-bold text-gray-950 transition-colors group-hover:text-black leading-tight">
                        {title}
                      </h3>
                    </div>
                    <span className="inline-block text-[9.5px] font-extrabold uppercase tracking-wider text-[#9E8362] mt-0.5">
                      {tag}
                    </span>
                    <p className="mt-0.5 truncate text-[11px] sm:text-xs text-neutral-500 font-normal">
                      {subtitle}
                    </p>
                  </div>
                </div>

                {/* Subtle Hover Cue Arrow */}
                <div className="ml-2.5 shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-50 text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5">
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