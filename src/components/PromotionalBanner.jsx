// src/components/PromotionalBanner.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from './Icons';

export default function PromotionalBanner({ onToast }) {
  const [copied, setCopied] = useState(false);
  const couponCode = 'LUXURY40';

  // Live countdown timer state (mocked 48 hours rolling for dynamic urgency)
  const [timeLeft, setTimeLeft] = useState({
    hours: 28,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 48, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(couponCode);
    setCopied(true);
    if (onToast) {
      onToast(`✓ Coupon code "${couponCode}" copied to clipboard! (40% Off applied at checkout)`);
    }
    setTimeout(() => setCopied(false), 3000);
  };

  const formatDigit = (num) => String(num).padStart(2, '0');

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="relative overflow-hidden rounded-3xl bg-[#090B10] text-white shadow-2xl border border-neutral-800/90 transition-all duration-300 hover:border-neutral-700">
        
        {/* Background Ambient Glow & Patterns */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-500/15 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-600/10 blur-[110px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(217,119,6,0.08),transparent_60%)]" />

        {/* Diagonal subtle gold grid accent */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 p-6 sm:p-9 lg:p-12">
          
          {/* Left Column: Promotion Details & CTAs (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Header Tag / Badge & Live Urgency Timer */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>Limited Time Privé</span>
              </span>

              {/* Countdown Pill */}
              <div className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] font-mono text-neutral-300">
                <span className="text-amber-400 text-xs">⏳</span>
                <span className="text-neutral-400">Ends in:</span>
                <span className="font-bold text-white tracking-wider">
                  {formatDigit(timeLeft.hours)}h : {formatDigit(timeLeft.minutes)}m : {formatDigit(timeLeft.seconds)}s
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-serif font-normal tracking-tight text-white leading-[1.12]">
                Luxury Essentials — <br className="hidden sm:inline" />
                <span className="font-sans font-extrabold bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  Up to 40% Off
                </span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-300 font-light max-w-xl leading-relaxed">
                Elevate your everyday aesthetic with our master collection of certified heritage timepieces, handcrafted Italian leather bags, polarized luxury eyewear, and audiophile acoustics.
              </p>
            </div>

            {/* Interactive Coupon Box & Action Buttons */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              
              {/* Primary CTA: Shop Collection */}
              <Link
                to="/shop"
                id="promotional-banner-shop-collection-btn"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-950 shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-amber-400/30 active:scale-[0.98]"
              >
                <span>Shop Collection</span>
                <ArrowRightIcon className="w-4 h-4 text-neutral-950 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              {/* Interactive Coupon Code Pill with Copy Action */}
              <div className="flex items-center justify-between sm:justify-start gap-2.5 rounded-full bg-neutral-900/90 border border-neutral-700/80 p-1.5 pl-4 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">Code:</span>
                  <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-amber-300">
                    {couponCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
                    copied
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
                  }`}
                  title="Click to copy promo code"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>

            </div>

            {/* Trust Points / Highlights */}
            <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] sm:text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">✓</span> 100% Certified Authentic
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">✓</span> Free Insured Express Logistics
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">✓</span> 7-Day Hassle-Free Exchange
              </span>
            </div>

          </div>

          {/* Right Column: Visual Product Showcase Card (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <div className="group relative mx-auto max-w-md lg:max-w-none overflow-hidden rounded-2xl border border-neutral-700/60 bg-gradient-to-b from-neutral-800/50 to-neutral-900/70 p-2 sm:p-3 backdrop-blur-xl shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
              
              {/* Product Visual Container */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-xl bg-neutral-950">
                <img
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&auto=format&fit=crop&q=80"
                  alt="Luxury Essentials Collection"
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Soft gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                {/* Floating Discount Badge */}
                <div className="absolute top-3 right-3 flex flex-col items-center justify-center rounded-2xl bg-amber-400 px-3.5 py-2 text-neutral-950 shadow-xl">
                  <span className="text-[10px] font-black uppercase tracking-wider leading-none">SAVE</span>
                  <span className="text-lg sm:text-xl font-black leading-none mt-0.5">40%</span>
                  <span className="text-[9px] font-bold tracking-tight uppercase leading-none mt-0.5">OFF</span>
                </div>

                {/* Bottom Showcase Caption Overlay */}
                <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300 block">
                      Curated Signature Edition
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white block truncate">
                      Heritage Horology & Leathercraft
                    </span>
                  </div>
                  <Link
                    to="/shop"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-neutral-950 transition-transform duration-200 hover:scale-110"
                    title="View Collection"
                  >
                    <ArrowRightIcon className="w-4 h-4 text-neutral-950" />
                  </Link>
                </div>

              </div>

              {/* Mini Feature Highlights Below Image */}
              <div className="mt-3 grid grid-cols-3 gap-2 px-1 text-center">
                <div className="rounded-lg bg-white/5 p-2 border border-white/5">
                  <span className="block text-[10px] text-neutral-400">Watches</span>
                  <span className="block text-xs font-bold text-amber-200">From ₹2,499</span>
                </div>
                <div className="rounded-lg bg-white/5 p-2 border border-white/5">
                  <span className="block text-[10px] text-neutral-400">Leather Bags</span>
                  <span className="block text-xs font-bold text-amber-200">From ₹1,899</span>
                </div>
                <div className="rounded-lg bg-white/5 p-2 border border-white/5">
                  <span className="block text-[10px] text-neutral-400">Audio & More</span>
                  <span className="block text-xs font-bold text-amber-200">From ₹999</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
