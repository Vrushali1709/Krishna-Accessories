// src/components/EditorialSpotlightSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from './useScrollReveal';
import { ArrowRightIcon } from './Icons';

export default function EditorialSpotlightSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

        {/* Card 1: Luxury Watches Editorial */}
        <Reveal direction="up" delay={40} duration={600}>
          <div className="group relative h-[380px] sm:h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-neutral-200/80 bg-neutral-950">
            {/* Background Image with Subtle Scale */}
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&auto=format&fit=crop&q=80"
              alt="Luxury Chronographs"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

            {/* Content Box */}
            <div className="relative z-10 h-full p-6 sm:p-8 flex flex-col justify-between">
              {/* Top Tag */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-200 border border-white/15">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Horology Spotlight
                </span>
                <span className="text-[11px] font-mono text-neutral-400">01 / TIMEPIECES</span>
              </div>

              {/* Bottom Details */}
              <div>
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-amber-300">
                  Precision Engineering
                </span>
                <h3 className="mt-1 font-bold text-xl sm:text-2xl lg:text-3xl text-white leading-tight tracking-tight">
                  Swiss Chronographs &amp; Automatic Watches
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-300 font-light max-w-md line-clamp-2">
                  Crafted with sapphire crystal, ceramic bezels, and authentic brand warranty coverage.
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <Link
                    to="/shop?category=Watches"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-950 transition-all duration-200 hover:bg-neutral-200 active:scale-95"
                  >
                    <span>Explore Timepieces</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Card 2: Handcrafted Leather Goods Editorial */}
        <Reveal direction="up" delay={80} duration={600}>
          <div className="group relative h-[380px] sm:h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-neutral-200/80 bg-neutral-950">
            {/* Background Image with Subtle Scale */}
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80"
              alt="Handcrafted Leather Bags"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

            {/* Content Box */}
            <div className="relative z-10 h-full p-6 sm:p-8 flex flex-col justify-between">
              {/* Top Tag */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-200 border border-white/15">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Artisanal Series
                </span>
                <span className="text-[11px] font-mono text-neutral-400">02 / LEATHER</span>
              </div>

              {/* Bottom Details */}
              <div>
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-amber-300">
                  Full-Grain Leather
                </span>
                <h3 className="mt-1 font-bold text-xl sm:text-2xl lg:text-3xl text-white leading-tight tracking-tight">
                  Handcrafted Leather Bags &amp; Wallets
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-300 font-light max-w-md line-clamp-2">
                  Vegetable-tanned hides designed to develop a rich, unique patina over decades of journeys.
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <Link
                    to="/shop?category=Bags%20%26%20Wallets"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-950 transition-all duration-200 hover:bg-neutral-200 active:scale-95"
                  >
                    <span>Shop Leather Goods</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
