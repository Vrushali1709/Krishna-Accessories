// src/components/OfferBanner.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function OfferBanner({
  tag = "LIMITED TIME OFFER",
  title = "Spring Sale is Live!",
  subtitle = "Enjoy up to 40% off on selected collections.",
  discount = "40%",
  discountPrefix = "UP TO",
  discountSuffix = "OFF",
  ctaText = "Explore Deals",
  ctaLink = "/shop",
  image = "/images/spring-offer-banner.jpg"
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-[#17382B] shadow-[0_12px_40px_rgba(23,56,43,0.16)] border border-emerald-950/40">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[300px] sm:min-h-[340px] lg:min-h-[380px] relative">
          
          {/* ================= LEFT CONTENT PANEL ================= */}
          <div className="lg:col-span-6 xl:col-span-5 z-10 flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12 lg:pl-14 lg:pr-6 text-white">
            
            {/* Tag with 4-point Sparkle */}
            <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
              <svg 
                className="w-3.5 h-3.5 text-[#E7B8B6]" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
              <span className="text-[10.5px] sm:text-[11.5px] font-semibold uppercase tracking-[0.22em] text-[#E7B8B6]">
                {tag}
              </span>
            </div>

            {/* Headline with Serif Font */}
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-normal leading-[1.15] text-white tracking-tight">
              {title}
            </h2>

            {/* Subtitle */}
            <p className="mt-2.5 sm:mt-3.5 text-xs sm:text-sm md:text-[14.5px] text-[#C6DDD3] max-w-md font-normal leading-relaxed">
              {subtitle}
            </p>

            {/* CTA Pill Button */}
            <div className="mt-6 sm:mt-8">
              <Link
                to={ctaLink}
                className="inline-flex items-center gap-2.5 rounded-full bg-[#DE9D9D] hover:bg-[#d48e8e] text-[#1a221f] px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-[13.5px] font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-[#DE9D9D]/30 hover:scale-[1.03] active:scale-[0.98] group"
              >
                <span>{ctaText}</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* ================= RIGHT IMAGE PANEL WITH CURVE ================= */}
          <div className="lg:col-span-6 xl:col-span-7 relative min-h-[220px] sm:min-h-[270px] lg:min-h-full overflow-hidden bg-[#f4ebe1]">
            
            {/* Smooth organic curve dividing green side and image (Desktop) */}
            <div className="hidden lg:block absolute inset-y-0 left-0 w-20 xl:w-28 -ml-px z-10 pointer-events-none">
              <svg 
                className="w-full h-full text-[#17382B] fill-current" 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none"
              >
                <path d="M0,0 C65,30 65,70 0,100 Z" />
              </svg>
            </div>

            {/* Background Image */}
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-103"
            />

            {/* Subtle soft gradient overlay on mobile */}
            <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* ================= OVERLAPPING CIRCULAR DISCOUNT BADGE ================= */}
          {/* Desktop/Tablet Center Placement */}
          <div className="absolute top-1/2 left-[44%] xl:left-[41.6%] -translate-x-1/2 -translate-y-1/2 z-20 hidden sm:flex">
            <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full bg-[#DE9D9D] shadow-[0_10px_30px_rgba(222,157,157,0.45)] flex flex-col items-center justify-center text-center select-none border-4 border-white/20 transition-transform duration-300 hover:scale-108">
              <span className="text-[10px] lg:text-[11px] font-semibold tracking-[0.2em] uppercase text-white/95 leading-none">
                {discountPrefix}
              </span>
              <span className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-white leading-none my-1 tracking-tight">
                {discount}
              </span>
              <span className="text-[10px] lg:text-[11px] font-bold tracking-[0.22em] uppercase text-white/95 leading-none">
                {discountSuffix}
              </span>
            </div>
          </div>

          {/* Mobile Corner Badge */}
          <div className="sm:hidden absolute top-4 right-4 z-20">
            <div className="w-20 h-20 rounded-full bg-[#DE9D9D] shadow-lg flex flex-col items-center justify-center text-center select-none border-2 border-white/30">
              <span className="text-[8px] font-semibold tracking-wider uppercase text-white/95 leading-none">
                {discountPrefix}
              </span>
              <span className="font-serif text-xl font-normal text-white leading-none my-0.5">
                {discount}
              </span>
              <span className="text-[8px] font-bold tracking-wider uppercase text-white/95 leading-none">
                {discountSuffix}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
