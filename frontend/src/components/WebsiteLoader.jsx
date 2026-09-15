// src/components/WebsiteLoader.jsx
import React from 'react';
import { useLoading } from '../context/LoadingContext';

export default function WebsiteLoader({ forceVisible = false, customMessage = null }) {
  const { isLoading, loadingMessage, initialLoading } = useLoading();

  const isVisible = forceVisible || isLoading || initialLoading;
  const message = customMessage || (initialLoading ? 'Welcome to Krishna Accessories' : loadingMessage);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Krishna Accessories"
      className="fixed inset-0 z-[99990] flex flex-col items-center justify-center bg-[#080C14]/97 backdrop-blur-xl transition-opacity duration-500 ease-out"
    >
      {/* Ambient background glowing orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-blue-500/5 blur-[50px] pointer-events-none" />

      {/* Main Luxury Brand Loading Card */}
      <div className="relative flex flex-col items-center justify-center px-6 py-8 z-10 text-center max-w-sm">

        {/* Animated Brand Emblem Insignia */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mb-6">
          {/* Outer Orbiting Golden Ring with gradient stroke */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin-slow"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="url(#goldGradient1)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="40 180"
            />
            <defs>
              <linearGradient id="goldGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#FDE68A" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
          </svg>

          {/* Middle Counter-Spinning Subtle Geometric Ring */}
          <svg
            className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] animate-spin-reverse opacity-75"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#B45309"
              strokeWidth="1"
              strokeDasharray="4 8"
              strokeOpacity="0.6"
            />
            {/* 4 Cardinal Diamond Accents */}
            <rect x="48" y="2" width="4" height="4" fill="#FBBF24" transform="rotate(45 50 4)" />
            <rect x="48" y="94" width="4" height="4" fill="#FBBF24" transform="rotate(45 50 96)" />
            <rect x="2" y="48" width="4" height="4" fill="#FBBF24" transform="rotate(45 4 50)" />
            <rect x="94" y="48" width="4" height="4" fill="#FBBF24" transform="rotate(45 96 50)" />
          </svg>

          {/* Central Luxury Crest Badge with Official Logo */}
          <div className="relative z-10 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-white/95 border-2 border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.35)] p-1.5 group backdrop-blur-md">
            <img
              src="/images/krishna-logo.png"
              alt="Krishna Accessories Logo"
              className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
            />

            {/* Micro gold corner accents */}
            <span className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
          </div>
        </div>

        {/* Brand Name Typography */}
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-[0.28em] sm:tracking-[0.32em] font-sans animate-gold-shimmer select-none">
            Krishna Accessories
          </h2>
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-amber-200/60 font-medium">
            Mumbai Boutique • Curated Luxury
          </p>
        </div>

        {/* Luxury Loading Progress Bar Track */}
        <div className="mt-6 w-36 sm:w-44 h-[3px] bg-slate-800/80 rounded-full overflow-hidden relative shadow-inner">
          <div className="h-full w-full rounded-full animate-laser-progress" />
        </div>

        {/* Contextual Status Message */}
        <p className="mt-3 text-xs text-slate-400 font-medium tracking-wide flex items-center justify-center gap-1.5 min-h-[1.25rem]">
          <span>{message}</span>
        </p>

      </div>
    </div>
  );
}
