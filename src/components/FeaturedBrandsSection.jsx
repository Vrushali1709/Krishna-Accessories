// src/components/FeaturedBrandsSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  siAdidas,
  siApple,
  siBose,
  siDell,
  siGarmin,
  siNike,
  siPuma,
  siRazer,
  siSamsung,
  siSony,
  siZara
} from 'simple-icons';
import { Reveal } from './useScrollReveal';
import { ArrowRightIcon } from './Icons';

export const brandRow1 = [
  {
    name: 'Titan',
    cat: 'Watches',
    tagline: 'Swiss Precision',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <svg viewBox="0 0 32 32" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-950 fill-current">
          <path d="M5 8h22v4h-8.5v16h-5V12H5V8z M16 1.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
        </svg>
        <span className="font-sans font-bold text-xs sm:text-sm md:text-[15px] tracking-[0.2em] text-gray-950">TITAN</span>
      </div>
    )
  },
  {
    name: 'Rolex',
    cat: 'Watches',
    tagline: 'Crown Luxury',
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center">
        <svg viewBox="0 0 24 14" className="h-4 sm:h-5 w-6 sm:w-7 text-[#006039] fill-current">
          <path d="M12 1l2.2 4.5 3.8-3 1.5 5.5-3.5 1.5 4.5 3H3.5l4.5-3-3.5-1.5 1.5-5.5 3.8 3L12 1zm-5 11.5h10V14H7v-1.5z" />
        </svg>
        <span className="font-serif font-bold text-[10px] sm:text-xs tracking-[0.25em] text-[#006039] leading-tight mt-0.5">ROLEX</span>
      </div>
    )
  },
  {
    name: 'Fossil',
    cat: 'Watches',
    tagline: 'Vintage Heritage',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-[#3D2314] text-white font-sans font-black text-[10px] sm:text-xs shadow-2xs">F</span>
        <span className="font-sans font-black text-xs sm:text-sm md:text-[15px] tracking-[0.16em] text-gray-950">FOSSIL</span>
      </div>
    )
  },
  {
    name: 'Casio',
    cat: 'Watches',
    tagline: 'Tough Solar',
    renderLogo: () => (
      <span className="font-sans font-black text-sm sm:text-base md:text-lg tracking-[0.12em] text-[#003B95]">CASIO</span>
    )
  },
  {
    name: 'Nike',
    cat: 'Shoes',
    tagline: 'Athletic Footwear',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-8 sm:w-10 fill-current text-gray-950">
          <path d={siNike.path} />
        </svg>
        <span className="font-sans font-black text-xs sm:text-sm md:text-[15px] tracking-[0.15em] text-gray-950 italic hidden sm:inline">NIKE</span>
      </div>
    )
  },
  {
    name: 'Adidas',
    cat: 'Shoes',
    tagline: 'Originals',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-6 sm:w-7 fill-current text-gray-950">
          <path d={siAdidas.path} />
        </svg>
        <span className="font-sans font-bold text-xs sm:text-sm md:text-[14px] tracking-wide text-gray-950">adidas</span>
      </div>
    )
  },
  {
    name: 'Apple',
    cat: 'Mobiles',
    tagline: 'Flagship iOS',
    renderLogo: () => (
      <div className="flex items-center gap-1 sm:gap-1.5">
        <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-5 sm:w-6 fill-current text-gray-950">
          <path d={siApple.path} />
        </svg>
        <span className="font-sans font-semibold text-xs sm:text-sm md:text-[15px] tracking-tight text-gray-950">Apple</span>
      </div>
    )
  },
  {
    name: 'Samsung',
    cat: 'Mobiles',
    tagline: 'Galaxy Innovation',
    renderLogo: () => (
      <span className="font-sans font-black text-xs sm:text-sm md:text-[15px] tracking-[0.2em] text-[#034EA2]">SAMSUNG</span>
    )
  }
];

export const brandRow2 = [
  {
    name: 'Puma',
    cat: 'Shoes',
    tagline: 'Fastest Gear',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-6 sm:w-7 fill-current text-[#111827]">
          <path d={siPuma.path} />
        </svg>
        <span className="font-sans font-black text-xs sm:text-sm md:text-[14px] tracking-[0.16em] text-[#111827]">PUMA</span>
      </div>
    )
  },
  {
    name: 'Sony',
    cat: 'Electronics',
    tagline: 'Audiophile Sound',
    renderLogo: () => (
      <span className="font-serif font-black text-sm sm:text-base md:text-lg tracking-[0.22em] text-gray-950">SONY</span>
    )
  },
  {
    name: 'Bose',
    cat: 'Electronics',
    tagline: 'QuietComfort',
    renderLogo: () => (
      <span className="font-serif italic font-black text-sm sm:text-base md:text-lg tracking-[0.16em] text-gray-950">BOSE</span>
    )
  },
  {
    name: 'Dell',
    cat: 'Laptops',
    tagline: 'XPS Series',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-5 sm:w-6 fill-current text-[#0076CE]">
          <path d={siDell.path} />
        </svg>
        <span className="font-sans font-bold text-xs sm:text-sm md:text-[14px] tracking-[0.14em] text-[#0076CE]">DELL</span>
      </div>
    )
  },
  {
    name: 'Zara',
    cat: 'Clothes & Fashion',
    tagline: 'Couture Styling',
    renderLogo: () => (
      <span className="font-serif font-black text-sm sm:text-base md:text-lg tracking-[0.28em] text-gray-950">ZARA</span>
    )
  },
  {
    name: 'Hidesign',
    cat: 'Bags & Wallets',
    tagline: 'Full-Grain Leather',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <span className="text-amber-800 text-xs sm:text-sm">🦌</span>
        <span className="font-serif font-bold text-xs sm:text-xs md:text-sm tracking-[0.2em] text-gray-900">HIDESIGN</span>
      </div>
    )
  },
  {
    name: 'Ray-Ban',
    cat: 'Fashion Accessories',
    tagline: 'Polarized Eyewear',
    renderLogo: () => (
      <span className="font-serif italic font-black text-sm sm:text-base md:text-lg text-[#E31837] tracking-tight">Ray•Ban</span>
    )
  },
  {
    name: 'Razer',
    cat: 'Gaming',
    tagline: 'Chroma Esports',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-5 sm:w-6 fill-current text-[#00E700]">
          <path d={siRazer.path} />
        </svg>
        <span className="font-sans font-black text-xs sm:text-xs md:text-sm tracking-[0.18em] text-gray-900">RAZER</span>
      </div>
    )
  }
];

export default function FeaturedBrandsSection() {
  return (
    <section className="bg-white py-14 sm:py-20 border-t border-gray-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <Reveal direction="up" delay={50}>
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[10.5px] font-bold uppercase tracking-[0.24em] mb-2.5">
              <span>✦</span>
              <span>100% CERTIFIED AUTHENTIC</span>
              <span>✦</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-gray-950">
              Official Heritage & Global Brand Partners
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
              Direct sourcing from authorized global makers with stamped manufacturer warranty cards.
            </p>
          </div>
        </Reveal>

        {/* Dual Capsule Infinite Scrolling Showcase Strips */}
        <Reveal direction="up" delay={120}>
          <div className="space-y-4 sm:space-y-5">

            {/* Track 1: Scrolling Left */}
            <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-gray-200/90 bg-[#F9FAFB]/90 p-2.5 sm:p-3 sm:px-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-[#F9FAFB] to-transparent z-10 rounded-l-[24px] sm:rounded-l-[32px]" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-[#F9FAFB] to-transparent z-10 rounded-r-[24px] sm:rounded-r-[32px]" />

              <div className="animate-marquee flex items-center gap-3.5 py-1">
                {[...brandRow1, ...brandRow1, ...brandRow1].map((b, idx) => (
                  <Link
                    key={`${b.name}-t1-${idx}`}
                    to={`/shop?category=${encodeURIComponent(b.cat)}&brand=${encodeURIComponent(b.name)}`}
                    className="group relative flex-shrink-0 flex flex-col items-center justify-center w-[150px] sm:w-[170px] md:w-[185px] h-18 sm:h-21 px-4 rounded-2xl border border-gray-200/80 bg-white shadow-2xs transition-all duration-300 hover:border-amber-400 hover:shadow-md hover:scale-[1.03] active:scale-98"
                    title={`${b.name} • ${b.cat}`}
                  >
                    <div className="transition-transform duration-300 group-hover:scale-108">
                      {b.renderLogo()}
                    </div>
                    <span className="text-[9.5px] font-mono text-neutral-400 mt-1 uppercase tracking-wider group-hover:text-amber-800 transition-colors">
                      {b.cat}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Track 2: Scrolling Right / Reverse */}
            <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-gray-200/90 bg-[#F9FAFB]/90 p-2.5 sm:p-3 sm:px-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-[#F9FAFB] to-transparent z-10 rounded-l-[24px] sm:rounded-l-[32px]" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-[#F9FAFB] to-transparent z-10 rounded-r-[24px] sm:rounded-r-[32px]" />

              <div className="animate-marquee-reverse flex items-center gap-3.5 py-1">
                {[...brandRow2, ...brandRow2, ...brandRow2].map((b, idx) => (
                  <Link
                    key={`${b.name}-t2-${idx}`}
                    to={`/shop?category=${encodeURIComponent(b.cat)}&brand=${encodeURIComponent(b.name)}`}
                    className="group relative flex-shrink-0 flex flex-col items-center justify-center w-[150px] sm:w-[170px] md:w-[185px] h-18 sm:h-21 px-4 rounded-2xl border border-gray-200/80 bg-white shadow-2xs transition-all duration-300 hover:border-amber-400 hover:shadow-md hover:scale-[1.03] active:scale-98"
                    title={`${b.name} • ${b.cat}`}
                  >
                    <div className="transition-transform duration-300 group-hover:scale-108">
                      {b.renderLogo()}
                    </div>
                    <span className="text-[9.5px] font-mono text-neutral-400 mt-1 uppercase tracking-wider group-hover:text-amber-800 transition-colors">
                      {b.cat}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </Reveal>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-700 hover:text-black transition-colors"
          >
            <span>Explore all 20+ Official Partner Brands</span>
            <span className="text-amber-600">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
