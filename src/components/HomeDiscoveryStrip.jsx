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
    title: 'Insured Free Shipping',
    subtitle: 'Across India on orders > ₹2,000',
    icon: TruckIcon,
    to: '/shop',
    iconBg: 'bg-blue-50 text-blue-700 border border-blue-100/80'
  },
  {
    id: 'returns',
    title: '7-Day Easy Returns',
    subtitle: 'Hassle-free replacement policy',
    icon: RefreshIcon,
    to: '/terms-conditions',
    iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-100/80'
  },
  {
    id: 'payments',
    title: '100% Secure Checkout',
    subtitle: 'Bank-grade SSL encryption',
    icon: ShieldCheckIcon,
    to: '/checkout',
    iconBg: 'bg-amber-50 text-amber-700 border border-amber-100/80'
  },
  {
    id: 'support',
    title: '24/7 VIP Concierge',
    subtitle: 'Direct Mumbai store support',
    icon: HeadphonesIcon,
    to: '/contact-us',
    iconBg: 'bg-purple-50 text-purple-700 border border-purple-100/80'
  }
];

export default function HomeDiscoveryStrip() {
  return (
    <section className="relative w-full py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 4-Feature Interactive Grid */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ id, title, subtitle, icon: Icon, to, iconBg }, idx) => (
            <Reveal key={id} direction="up" delay={idx * 60} duration={600}>
              <Link
                to={to}
                className="group relative flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Pastel Icon Circle */}
                  <div
                    className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg} transition-transform duration-300 group-hover:scale-108 shadow-2xs`}
                  >
                    <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0">
                    <h3 className="truncate text-[13px] sm:text-[14px] font-bold text-gray-950 transition-colors group-hover:text-black">
                      {title}
                    </h3>
                    <p className="mt-0.5 truncate text-[11px] sm:text-xs text-gray-500">
                      {subtitle}
                    </p>
                  </div>
                </div>

                {/* Hover Cue Arrow */}
                <div className="ml-2 shrink-0 text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gray-950">
                  <ArrowRightIcon className="h-4 w-4" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}