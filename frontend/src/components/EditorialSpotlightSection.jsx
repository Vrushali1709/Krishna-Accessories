// src/components/EditorialSpotlightSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from './useScrollReveal';
import { ArrowRightIcon } from './Icons';

export default function EditorialSpotlightSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

        {/* Card 1: Luxury Watches Editorial */}
        <Reveal direction="left" delay={50} duration={800}>
          <div className="group relative h-[380px] sm:h-[440px] rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-neutral-800">
            {/* Background Image with Zoom */}
            <img
              src="https://i.pinimg.com/736x/c3/7a/84/c37a8441b798d917defa413de43a72a6.jpg"
              alt="Luxury Chronographs"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-108"
            />

            {/* Dark & Gold Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/20 to-black/80 pointer-events-none" />

            {/* Content Box */}
            <div className="relative z-10 h-full p-6 sm:p-8 flex flex-col justify-between">
              {/* Top Tag */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#E8D4B4] border border-white/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Privé Curation
                </span>
                <span className="text-[11px] font-mono text-neutral-400">01 / TIMEPIECES</span>
              </div>

              {/* Bottom Details */}
              <div>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-[#C5A880]">
                  Heritage Precision
                </p>
                <h3 className="mt-1.5 font-bold text-2xl sm:text-3xl lg:text-[32px] text-white leading-tight tracking-tight">
                  Swiss Chronographs & Automatic Watches
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-300 font-light max-w-md line-clamp-2">
                  Engineered with sapphire crystal, ceramic bezels, and trusted manufacturer warranty coverage.
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <Link
                    to="/shop?category=Watches"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:bg-[#E5D7C5] hover:shadow-lg active:scale-95"
                  >
                    <span>Explore Timepieces</span>
                    <ArrowRightIcon className="w-3.5 h-3.5 text-black" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Card 2: Handcrafted Leather Goods Editorial */}
        <Reveal direction="right" delay={150} duration={800}>
          <div className="group relative h-[380px] sm:h-[440px] rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-neutral-800">
            {/* Background Image with Zoom */}
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80"
              alt="Handcrafted Leather Bags"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-108"
            />

            {/* Dark & Warm Brown Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#2a1b12]/30 to-black/80 pointer-events-none" />

            {/* Content Box */}
            <div className="relative z-10 h-full p-6 sm:p-8 flex flex-col justify-between">
              {/* Top Tag */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#F3DFCA] border border-white/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Artisanal Series
                </span>
                <span className="text-[11px] font-mono text-neutral-400">02 / LEATHER</span>
              </div>

              {/* Bottom Details */}
              <div>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-[#D8B48D]">
                  Pure Full-Grain
                </p>
                <h3 className="mt-1.5 font-bold text-2xl sm:text-3xl lg:text-[32px] text-white leading-tight tracking-tight">
                  Handcrafted Leather Bags & Executive Wallets
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-300 font-light max-w-md line-clamp-2">
                  Vegetable-tanned hides designed to age with a rich, unique patina over decades of distinguished journeys.
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <Link
                    to="/shop?category=Bags%20%26%20Wallets"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:bg-[#E5D7C5] hover:shadow-lg active:scale-95"
                  >
                    <span>Shop Leather Goods</span>
                    <ArrowRightIcon className="w-3.5 h-3.5 text-black" />
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
