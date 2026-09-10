// src/components/SkeletonLoader.jsx
import React from 'react';
import BrandSpinner from './BrandSpinner';

export function ProductCardSkeleton() {
  return (
    <div className="luxury-card rounded-2xl overflow-hidden p-3 sm:p-4 flex flex-col justify-between bg-white border border-gray-100/80 animate-pulse">
      {/* Product Image Area */}
      <div className="relative aspect-square w-full rounded-xl skeleton-shimmer overflow-hidden mb-3">
        <div className="absolute top-2 left-2 w-12 h-4 rounded-md bg-gray-200/80" />
      </div>

      {/* Info Area */}
      <div className="space-y-2">
        <div className="w-1/3 h-3 rounded skeleton-shimmer" />
        <div className="w-4/5 h-4 rounded skeleton-shimmer" />
        <div className="w-1/2 h-3 rounded skeleton-shimmer" />

        {/* Rating & Price */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="w-16 h-5 rounded skeleton-shimmer" />
          <div className="w-8 h-8 rounded-xl skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ContentLoader({
  minHeight = '300px',
  label = 'Loading curated items...',
  transparent = false
}) {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center p-8 rounded-2xl ${
        transparent ? 'bg-transparent' : 'bg-white/60 backdrop-blur-xs border border-gray-100'
      }`}
      style={{ minHeight }}
    >
      <BrandSpinner size="lg" variant="gold" showBadge={true} label={label} />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="w-full space-y-3">
      <div className="h-10 w-full rounded-xl skeleton-shimmer" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 w-full rounded-lg skeleton-shimmer" />
      ))}
    </div>
  );
}

export default {
  ProductCardSkeleton,
  ProductGridSkeleton,
  ContentLoader,
  TableSkeleton
};
