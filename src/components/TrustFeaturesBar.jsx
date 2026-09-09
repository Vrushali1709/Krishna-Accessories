// src/components/TrustFeaturesBar.jsx
import React from 'react';
import { TruckIcon, RotateCcwIcon, ShieldCheckIcon, HeadphonesIcon } from './Icons';

const features = [
  {
    icon: <TruckIcon className="w-5 h-5 text-gray-900" />,
    title: 'Free Shipping',
    subtitle: 'On orders above ₹2,000'
  },
  {
    icon: <RotateCcwIcon className="w-5 h-5 text-gray-900" />,
    title: 'Easy Returns',
    subtitle: '30 days return policy'
  },
  {
    icon: <ShieldCheckIcon className="w-5 h-5 text-gray-900" />,
    title: 'Secure Payments',
    subtitle: '100% secure checkout'
  },
  {
    icon: <HeadphonesIcon className="w-5 h-5 text-gray-900" />,
    title: '24/7 Support',
    subtitle: "We're here to help"
  }
];

export default function TrustFeaturesBar() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
      <div className="rounded-[24px] sm:rounded-[28px] bg-white border border-gray-200/85 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-4 sm:p-5 lg:p-6 transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-0 lg:divide-x lg:divide-gray-150">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`flex items-center gap-3.5 sm:gap-4 ${
                i > 0 ? 'lg:pl-6' : ''
              } ${i < features.length - 1 ? 'lg:pr-6' : ''}`}
            >
              {/* Circular Icon Container */}
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#F6F4F0] border border-gray-200/50 shadow-2xs transition-transform hover:scale-105">
                {f.icon}
              </div>

              {/* Text Info */}
              <div className="min-w-0">
                <h4 className="text-[13.5px] sm:text-[14.5px] font-bold text-gray-950 tracking-tight leading-snug truncate">
                  {f.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-500 font-normal leading-tight truncate mt-0.5">
                  {f.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
