// src/components/WhyShopWithUs.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  TruckIcon,
  RefreshIcon,
  HeadphonesIcon,
  LockClosedIcon,
  BuildingIcon,
  ArrowRightIcon,
  StarIcon
} from './Icons';

const features = [
  {
    id: 'authenticity',
    badge: 'Official Guarantee',
    title: '100% Certified Authentic',
    subtitle: 'Direct from Authorized Brand Houses',
    description:
      'Every timepiece, accessory, and gadget is sourced directly from certified authorized manufacturers, complete with official warranty cards and tamper-proof holographic seals.',
    icon: (
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
        <ShieldCheckIcon className="h-6 w-6" />
      </div>
    ),
    accentColor: 'group-hover:border-amber-400/80',
    link: '/faq',
    linkText: 'Learn about verification'
  },
  {
    id: 'shipping',
    badge: 'Free on ₹999+',
    title: 'Express Insured Delivery',
    subtitle: '24–48 Hour Priority Dispatch',
    description:
      'Priority air shipping across India with zero-loss transit insurance. Real-time GPS tracking via BlueDart and Delhivery in reinforced shock-proof luxury vault cases.',
    icon: (
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        <TruckIcon className="h-6 w-6" />
      </div>
    ),
    accentColor: 'group-hover:border-blue-400/80',
    link: '/tracking',
    linkText: 'Track your shipment'
  },
  {
    id: 'returns',
    badge: 'Zero Questions Asked',
    title: '7-Day Easy Exchange',
    subtitle: 'Hassle-Free Doorstep Pickup',
    description:
      'Not 100% delighted with fit or style? Enjoy our quick doorstep reverse pickup and instantaneous size replacements or store credits with complete peace of mind.',
    icon: (
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
        <RefreshIcon className="h-6 w-6" />
      </div>
    ),
    accentColor: 'group-hover:border-emerald-400/80',
    link: '/faq',
    linkText: 'View return policy'
  },
  {
    id: 'concierge',
    badge: 'VIP Assistance',
    title: 'Dedicated 24/7 Concierge',
    subtitle: 'Personal Styling & Support',
    description:
      'Direct access to our certified luxury specialists for sizing guidance, gifting packaging, custom curation, and instant post-purchase warranty support.',
    icon: (
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 border border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
        <HeadphonesIcon className="h-6 w-6" />
      </div>
    ),
    accentColor: 'group-hover:border-purple-400/80',
    link: '/contact',
    linkText: 'Chat with concierge'
  },
  {
    id: 'security',
    badge: 'Bank-Grade Safe',
    title: 'Secure Encrypted Checkout',
    subtitle: '256-Bit SSL Protection',
    description:
      'End-to-end encrypted payments with Instant UPI, all major credit/debit cards, Net Banking, and flexible 0% interest EMI options for a smooth checkout.',
    icon: (
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 border border-rose-500/20 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
        <LockClosedIcon className="h-6 w-6" />
      </div>
    ),
    accentColor: 'group-hover:border-rose-400/80',
    link: '/shop',
    linkText: 'Explore secure store'
  },
  {
    id: 'flagship',
    badge: 'Flagship Showroom',
    title: 'Ahmedabad Physical Studio',
    subtitle: 'Bodakdev, SG Highway',
    description:
      'Prefer a tactile trial? Visit our premier physical flagship studio in Ahmedabad to experience timepieces, adjust straps, and explore exclusive gallery releases.',
    icon: (
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 border border-teal-500/20 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
        <BuildingIcon className="h-6 w-6" />
      </div>
    ),
    accentColor: 'group-hover:border-teal-400/80',
    link: '/contact',
    linkText: 'Get studio directions'
  }
];

const stats = [
  { value: '45,000+', label: 'Happy Customers Across India' },
  { value: '100%', label: 'Certified Brand Authenticity' },
  { value: '4.9 ★', label: 'Average Client Satisfaction' },
  { value: '24–48h', label: 'Insured Air Dispatch' }
];

export default function WhyShopWithUs() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F8FA] via-white to-[#F7F8FA] py-14 sm:py-20 border-y border-gray-200/80">
      {/* Decorative ambient background accents */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-[800px] rounded-full bg-gradient-to-b from-amber-400/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-10 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-800 shadow-2xs mb-3.5">
            <span className="text-amber-600">✦</span>
            <span>The Krishna Assurance</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-950">
            Why Shop With Us?
          </h2>

          <p className="mt-3 text-xs sm:text-base text-gray-600 leading-relaxed">
            Every purchase at Krishna Accessories is backed by our unwavering commitment to genuine luxury, white-glove logistics, and uncompromising client satisfaction.
          </p>
        </div>

        {/* Features 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
          {features.map((item) => (
            <div
              key={item.id}
              className={`group relative rounded-[26px] bg-white p-6 sm:p-7 border border-gray-200/85 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${item.accentColor}`}
            >
              {/* Card Header with Icon & Pill Badge */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  {item.icon}
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-gray-700 group-hover:bg-gray-950 group-hover:text-white transition-colors duration-300">
                    {item.badge}
                  </span>
                </div>

                {/* Subtitle Tag */}
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 mb-1">
                  {item.subtitle}
                </p>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-gray-950 tracking-tight group-hover:text-black mb-2.5">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Card Action Link */}
              <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-800 group-hover:text-black">
                <Link
                  to={item.link}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-900 group-hover:text-amber-800 transition-colors"
                >
                  <span>{item.linkText}</span>
                  <ArrowRightIcon className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50 text-gray-400 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors text-[11px]">
                  ✓
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Trust Metrics Strip */}
        <div className="mt-12 sm:mt-16 rounded-[28px] bg-[#0A0E17] text-white p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center text-center ${idx !== 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''}`}
              >
                <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent">
                  {stat.value}
                </span>
                <span className="mt-1.5 text-[11px] sm:text-xs font-medium text-slate-400 max-w-[170px] leading-snug">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
