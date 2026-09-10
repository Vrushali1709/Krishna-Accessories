// src/components/Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Official Krishna Accessories Luxury Emblem & Wordmark Logo
 */
export function LogoIcon({ className = "w-8 h-8", size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0 transition-transform duration-300 hover:scale-105`}
      aria-label="Krishna Accessories Emblem"
    >
      <defs>
        {/* Luxury Gold Gradients */}
        <linearGradient id="kaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <linearGradient id="kaDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="50%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        <linearGradient id="kaGoldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FDE68A" stopOpacity="1" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0.8" />
        </linearGradient>

        <filter id="kaShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#D97706" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Outer Luxury Rounded Octagon / Shield Container */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="12"
        fill="url(#kaDarkGrad)"
        stroke="url(#kaGoldGrad)"
        strokeWidth="1.5"
      />

      {/* Subtle Inner Diamond Frame */}
      <rect
        x="5.5"
        y="5.5"
        width="37"
        height="37"
        rx="8.5"
        fill="none"
        stroke="url(#kaGoldGrad)"
        strokeWidth="0.6"
        strokeOpacity="0.4"
      />

      {/* Top Royal Crown Accent */}
      <path
        d="M18 13.5L21 16L24 12L27 16L30 13.5L29 18H19L18 13.5Z"
        fill="url(#kaGoldGrad)"
      />
      <circle cx="18" cy="13" r="0.9" fill="#FDE68A" />
      <circle cx="24" cy="11.5" r="1.1" fill="#FDE68A" />
      <circle cx="30" cy="13" r="0.9" fill="#FDE68A" />

      {/* Center Stylized 'K' Monogram */}
      <path
        d="M18 19.5 H21.2 V35.5 H18 Z"
        fill="url(#kaGoldGrad)"
      />
      {/* K Upper Arm */}
      <path
        d="M20.8 26.8 L27.8 19.5 H32.2 L24.6 27.2 L20.8 26.8 Z"
        fill="url(#kaGoldGrad)"
      />
      {/* K Lower Arm */}
      <path
        d="M23.6 25.8 L32.5 35.5 H28.0 L20.8 27.6 L23.6 25.8 Z"
        fill="url(#kaGoldGrad)"
      />

      {/* Horizontal Luxury Serifs */}
      <rect x="16.5" y="19.5" width="4.7" height="1" fill="url(#kaGoldGrad)" />
      <rect x="16.5" y="34.5" width="4.7" height="1" fill="url(#kaGoldGrad)" />

      {/* Sparkle star bottom center */}
      <path
        d="M24 37.5L24.5 39L26 39.5L24.5 40L24 41.5L23.5 40L22 39.5L23.5 39Z"
        fill="#FDE68A"
        opacity="0.8"
      />
    </svg>
  );
}

export default function Logo({
  variant = 'dark', // 'dark' (for light background), 'light' (for dark background), 'gold'
  size = 'md',      // 'sm', 'md', 'lg'
  showText = true,
  showSubtitle = true,
  linkTo = '/',
  className = ''
}) {
  const sizeConfig = {
    sm: { icon: 28, textMain: 'text-sm', textSub: 'text-[8.5px]', gap: 'gap-2' },
    md: { icon: 34, textMain: 'text-base sm:text-lg', textSub: 'text-[9.5px]', gap: 'gap-2.5' },
    lg: { icon: 42, textMain: 'text-xl sm:text-2xl', textSub: 'text-[11px]', gap: 'gap-3' }
  }[size] || { icon: 34, textMain: 'text-base sm:text-lg', textSub: 'text-[9.5px]', gap: 'gap-2.5' };

  const content = (
    <div className={`inline-flex items-center ${sizeConfig.gap} ${className} select-none group`}>
      <LogoIcon size={sizeConfig.icon} />

      {showText && (
        <div className="flex flex-col text-left leading-tight min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`font-serif font-bold tracking-tight ${
                variant === 'light' ? 'text-white' : 'text-gray-950'
              } ${sizeConfig.textMain} transition-colors group-hover:text-amber-500`}
            >
              Krishna
            </span>
            <span
              className={`font-sans font-extrabold tracking-normal uppercase text-amber-500 ${sizeConfig.textMain}`}
            >
              Accessories
            </span>
          </div>

          {showSubtitle && (
            <span
              className={`font-sans font-medium uppercase tracking-[0.22em] ${
                variant === 'light' ? 'text-slate-400' : 'text-gray-500'
              } ${sizeConfig.textSub} mt-0.5`}
            >
              Luxury Timepieces & Goods
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} aria-label="Krishna Accessories - Return to Homepage" className="inline-flex items-center outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
