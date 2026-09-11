import React from 'react';
import { Link } from 'react-router-dom';
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
    subtitle: 'On all orders above ₹2,000',
    tag: 'Pan-India Express',
    icon: TruckIcon,
    to: '/shop',
    accent: 'from-amber-500/10 to-transparent'
  },
  {
    id: 'returns',
    title: 'Easy Returns',
    subtitle: '7-day replacement guarantee',
    tag: 'Hassle-Free',
    icon: RefreshIcon,
    to: '/terms-conditions',
    accent: 'from-emerald-500/10 to-transparent'
  },
  {
    id: 'payments',
    title: 'Secure Payments',
    subtitle: '100% encrypted & safe checkout',
    tag: 'SSL 256-Bit',
    icon: ShieldCheckIcon,
    to: '/checkout',
    accent: 'from-blue-500/10 to-transparent'
  },
  {
    id: 'support',
    title: '24/7 Support',
    subtitle: "We're here to assist anytime",
    tag: 'Dedicated Care',
    icon: HeadphonesIcon,
    to: '/contact-us',
    accent: 'from-rose-500/10 to-transparent'
  }
];

export default function HomeDiscoveryStrip() {
  return (
    <section className="relative w-full py-5 sm:py-7 lg:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 4-Feature Interactive Grid */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {features.map(({ id, title, subtitle, tag, icon: Icon, to }) => (
            <Link
              key={id}
              to={to}
              className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                {/* Icon Badge */}
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-[#F7F7F8] text-gray-900 ring-1 ring-gray-200/80 transition-all duration-300 group-hover:scale-105 group-hover:bg-gray-950 group-hover:text-white group-hover:ring-gray-950 shadow-2xs">
                  <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5 transition-transform duration-300 group-hover:scale-110" />
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm sm:text-[14.5px] font-bold text-gray-950 transition-colors group-hover:text-black">
                      {title}
                    </h3>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] sm:text-xs text-gray-500 transition-colors group-hover:text-gray-700">
                    {subtitle}
                  </p>
                  <span className="mt-1.5 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-600 transition-colors group-hover:bg-amber-100 group-hover:text-amber-900">
                    {tag}
                  </span>
                </div>
              </div>

              {/* Hover Cue Arrow */}
              <div className="ml-2 shrink-0 text-gray-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-gray-950">
                <ArrowRightIcon className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}