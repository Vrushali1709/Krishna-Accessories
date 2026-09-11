// src/components/HomeDiscoveryStrip.jsx
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
    subtitle: 'On orders over ₹2,000',
    icon: TruckIcon,
    to: '/shop',
    iconBg: 'bg-blue-50 text-blue-600 border border-blue-100'
  },
  {
    id: 'returns',
    title: 'Easy Returns',
    subtitle: '30-day return policy',
    icon: RefreshIcon,
    to: '/terms-conditions',
    iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100'
  },
  {
    id: 'payments',
    title: 'Secure Payments',
    subtitle: '100% secure payment',
    icon: ShieldCheckIcon,
    to: '/checkout',
    iconBg: 'bg-purple-50 text-purple-600 border border-purple-100'
  },
  {
    id: 'support',
    title: '24/7 Support',
    subtitle: "We're here to help",
    icon: HeadphonesIcon,
    to: '/contact-us',
    iconBg: 'bg-orange-50 text-orange-600 border border-orange-100'
  }
];

export default function HomeDiscoveryStrip() {
  return (
    <section className="relative w-full py-4 sm:py-5 lg:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 4-Feature Interactive Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ id, title, subtitle, icon: Icon, to, iconBg }) => (
            <Link
              key={id}
              to={to}
              className="group relative flex items-center justify-between rounded-2xl border border-gray-200/70 bg-white p-3.5 sm:p-4 shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Pastel Icon Circle */}
                <div
                  className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full ${iconBg} transition-transform duration-300 group-hover:scale-105 shadow-2xs`}
                >
                  <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <h3 className="truncate text-xs sm:text-[13.5px] font-bold text-gray-950 transition-colors group-hover:text-black">
                    {title}
                  </h3>
                  <p className="mt-0.5 truncate text-[11px] sm:text-xs text-gray-500">
                    {subtitle}
                  </p>
                </div>
              </div>

              {/* Hover Cue Arrow */}
              <div className="ml-2 shrink-0 text-gray-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-gray-950">
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}