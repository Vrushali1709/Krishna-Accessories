// src/components/PromoVoucherBanner.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from './useScrollReveal';
import { ArrowRightIcon, CheckIcon } from './Icons';

export default function PromoVoucherBanner({ onToast }) {
  const [copied, setCopied] = useState(false);
  const couponCode = 'KRISHNA10';

  const handleCopy = (e) => {
    e.preventDefault();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(couponCode);
    } else {
      // Fallback
      const input = document.createElement('input');
      input.value = couponCode;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }

    setCopied(true);
    if (onToast) {
      onToast(`🎉 Voucher code "${couponCode}" copied to clipboard!`);
    }

    setTimeout(() => {
      setCopied(false);
    }, 3500);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <Reveal direction="zoom" delay={50} duration={700}>
        <div className="relative overflow-hidden rounded-[26px] sm:rounded-[32px] bg-gradient-to-r from-[#090B10] via-[#111624] to-[#0A0D15] text-white p-5 sm:p-7 md:p-8 border border-[#C5A880]/30 shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-all duration-300 hover:border-[#C5A880]/50 hover:shadow-[0_16px_48px_rgba(197,168,128,0.1)]">
          
          {/* Subtle Ambient Decorative Glows */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#C5A880]/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />
          
          {/* Subtle Guilloché / Geometric Mesh Overlay */}
          <div 
            className="pointer-events-none absolute inset-0 opacity-[0.035] bg-repeat"
            style={{
              backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Left & Middle Block: Seal + Offer Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 min-w-0">
              
              {/* Luxury Gold Voucher Seal */}
              <div className="relative flex-shrink-0">
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E2C799] via-[#C5A880] to-[#8C6D44] p-0.5 shadow-[0_4px_20px_rgba(197,168,128,0.3)]">
                  <div className="flex h-full w-full flex-col items-center justify-center rounded-[14px] bg-[#0C0E14] text-center px-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#E5D7C5]">
                      SAVE
                    </span>
                    <span className="font-serif text-xl sm:text-2xl font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#F7E7CE] via-[#E8D4B4] to-[#C5A880]">
                      10%
                    </span>
                    <span className="text-[8.5px] font-mono tracking-wider text-[#A89880] mt-0.5 uppercase">
                      OFF
                    </span>
                  </div>
                </div>
                {/* Micro Sparkle Tag */}
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-black text-[10px] font-bold shadow-sm">
                  ✦
                </span>
              </div>

              {/* Offer Info */}
              <div className="min-w-0 space-y-1.5">
                {/* Privé Tag with Live Status */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.22em] text-[#E8D4B4] border border-[#C5A880]/30 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIMITED PRIVÉ PRIVILEGE
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline-block">
                    • Valid Sitewide
                  </span>
                </div>

                {/* Headline */}
                <h3 className="font-serif text-lg sm:text-xl lg:text-[22px] font-normal text-white leading-snug">
                  Save 10% Instant Discount on orders over{' '}
                  <span className="font-sans font-bold text-[#E5D7C5]">₹1,000</span>
                </h3>

                {/* Micro Benefits & Voucher Code Stub */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {/* Coupon Code Pill */}
                  <div className="flex items-center">
                    <span className="text-xs text-neutral-400 mr-2">Use Promo Code:</span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className={`group relative inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
                        copied
                          ? 'border-emerald-500/80 bg-emerald-950/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                          : 'border-[#C5A880]/50 bg-[#161B29] text-[#F3DFCA] hover:border-[#C5A880] hover:bg-[#1E2538] hover:shadow-[0_0_15px_rgba(197,168,128,0.2)]'
                      }`}
                      title="Click to copy voucher code"
                    >
                      <span className="tracking-wider">{couponCode}</span>
                      {copied ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 font-sans font-semibold">
                          <CheckIcon className="h-3.5 w-3.5" />
                          <span>Copied!</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-sans font-medium text-[#C5A880] group-hover:text-white transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v2.25A2.25 2.25 0 0113.5 21.75h-7.5A2.25 2.25 0 013.75 19.5V7.5A2.25 2.25 0 016 5.25h2.25m6 0h2.25A2.25 2.25 0 0118.75 7.5v9a2.25 2.25 0 01-2.25 2.25h-9A2.25 2.25 0 015.25 16.5v-2.25" />
                          </svg>
                          <span>Copy</span>
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Micro reassurance bullets */}
                  <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-neutral-400">
                    <span className="text-amber-400">✓</span> Applies instantly at bag
                  </span>
                  <span className="hidden xl:inline-flex items-center gap-1 text-[11px] text-neutral-400">
                    <span className="text-amber-400">✓</span> Free insured shipping &gt; ₹2,000
                  </span>
                </div>
              </div>

            </div>

            {/* Right Action Block */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-center gap-2 sm:gap-3 flex-shrink-0 pt-2 lg:pt-0">
              <Link
                to="/shop"
                className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F5E6D3] via-[#E8D4B4] to-[#C5A880] px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0A0D14] shadow-[0_4px_20px_rgba(197,168,128,0.25)] transition-all duration-300 hover:brightness-105 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(197,168,128,0.4)] active:scale-98"
              >
                <span>Claim Offer Now</span>
                <ArrowRightIcon className="w-4 h-4 text-[#0A0D14] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              
              <span className="text-[10.5px] text-neutral-400 text-center lg:text-right font-light">
                Auto-applies or enter code in checkout
              </span>
            </div>

          </div>

        </div>
      </Reveal>
    </section>
  );
}
