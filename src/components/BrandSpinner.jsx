// src/components/BrandSpinner.jsx
import React from 'react';

const SIZES = {
  xs: { ring: 'w-4 h-4', text: 'text-[10px]', badge: 'w-2.5 h-2.5 text-[7px]' },
  sm: { ring: 'w-5 h-5', text: 'text-xs', badge: 'w-3.5 h-3.5 text-[8px]' },
  md: { ring: 'w-8 h-8', text: 'text-xs', badge: 'w-5 h-5 text-[10px]' },
  lg: { ring: 'w-12 h-12', text: 'text-sm', badge: 'w-7 h-7 text-xs' },
  xl: { ring: 'w-16 h-16', text: 'text-base', badge: 'w-10 h-10 text-sm' }
};

const VARIANTS = {
  gold: {
    track: 'stroke-amber-900/20',
    head: 'stroke-amber-400',
    text: 'text-amber-700 dark:text-amber-300',
    badgeBg: 'bg-[#0F172A]',
    badgeText: 'text-amber-300'
  },
  dark: {
    track: 'stroke-gray-300',
    head: 'stroke-gray-900',
    text: 'text-gray-900',
    badgeBg: 'bg-black',
    badgeText: 'text-white'
  },
  white: {
    track: 'stroke-white/20',
    head: 'stroke-white',
    text: 'text-white',
    badgeBg: 'bg-white/20',
    badgeText: 'text-white'
  }
};

export default function BrandSpinner({
  size = 'md',
  variant = 'gold',
  showBadge = false,
  label = '',
  inline = false,
  className = ''
}) {
  const sizeConfig = SIZES[size] || SIZES.md;
  const variantConfig = VARIANTS[variant] || VARIANTS.gold;

  const content = (
    <div className={`${inline ? 'inline-flex' : 'flex flex-col'} items-center justify-center gap-2.5 ${className}`}>
      <div className={`relative ${sizeConfig.ring} flex items-center justify-center`}>
        {/* Animated Ring */}
        <svg
          className="animate-spin w-full h-full"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            className={variantConfig.track}
            strokeWidth="2.5"
          />
          <path
            d="M12 2C6.47715 2 2 6.47715 2 12C2 14.6649 3.04008 17.0865 4.7383 18.88"
            className={variantConfig.head}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Optional Miniature 'K' Badge */}
        {showBadge && (
          <div
            className={`absolute rounded-full ${sizeConfig.badge} ${variantConfig.badgeBg} ${variantConfig.badgeText} flex items-center justify-center font-serif font-bold shadow-xs border border-amber-400/30`}
          >
            K
          </div>
        )}
      </div>

      {label && (
        <span className={`font-medium ${sizeConfig.text} ${variantConfig.text} tracking-wide`}>
          {label}
        </span>
      )}
    </div>
  );

  return content;
}
