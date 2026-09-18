// src/components/ShopByCategorySection.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from './useScrollReveal';
import { ArrowRightIcon } from './Icons';

// Default curated showcase categories with balanced, high-end editorial styling
const curatedShowcase = [
  {
    name: 'Watches',
    title: 'Heritage Timepieces',
    subtitle: 'Automatic chronographs & Swiss precision horology',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    tag: 'HERITAGE'
  },
  {
    name: 'Bags & Wallets',
    title: 'Handcrafted Leather',
    subtitle: 'Full-grain briefcases, wallets & urban luxury packs',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    tag: 'ARTISANAL'
  },
  {
    name: 'Electronics',
    title: 'Audiophile & Sound',
    subtitle: 'Studio acoustics & noise-cancelling audio gear',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    tag: 'ACOUSTIC'
  },
  {
    name: 'Shoes',
    title: 'Luxury Footwear',
    subtitle: 'Handcrafted leather shoes & iconic lifestyle silhouettes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    tag: 'FOOTWEAR'
  },
  {
    name: 'Fashion Accessories',
    title: 'Designer Accents',
    subtitle: 'Polarized eyewear, leather belts & curated accents',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
    tag: 'ACCESSORIES'
  },
  {
    name: 'Clothes & Fashion',
    title: 'Signature Apparel',
    subtitle: 'Tailored silhouettes, fine denim & modern wardrobe',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    tag: 'COUTURE'
  }
];

export default function ShopByCategorySection({
  categories = [],
  getProductCount
}) {
  const [showAllDrawer, setShowAllDrawer] = useState(false);

  const formatCount = (count) => {
    if (count === undefined || count === null || count === 0) return 'Curated';
    return count === 1 ? '1 Item' : `${count} Items`;
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* 1. Header Section */}
      <Reveal direction="up" delay={40}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-[#C5A880]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#9E7A4A]">
                CURATED DEPARTMENTS
              </span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-950">
              Shop by Category
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 max-w-xl leading-relaxed">
              Explore meticulously crafted timepieces, full-grain leather goods, studio acoustics, and luxury accents.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white hover:bg-neutral-950 hover:text-white hover:border-neutral-950 px-5 py-2.5 text-xs font-semibold text-neutral-900 transition-all duration-300 active:scale-95 shadow-2xs"
            >
              <span>View All Collections</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </Reveal>

      {/* 2. Sleek Quick-Filter Pills Strip */}
      <Reveal direction="up" delay={80}>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <Link
            to="/shop"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-4 py-1.5 text-xs font-medium text-white shadow-2xs hover:bg-neutral-800 transition"
          >
            <span>All Products</span>
          </Link>

          {categories.slice(0, 8).map((cat) => {
            const count = getProductCount ? getProductCount(cat.name) : 0;
            return (
              <Link
                key={cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-950 hover:border-neutral-400 hover:bg-neutral-50/80 transition shadow-2xs"
              >
                <span>{cat.name}</span>
                {count > 0 && (
                  <span className="text-[10px] text-neutral-400 font-mono">({count})</span>
                )}
              </Link>
            );
          })}

          {categories.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAllDrawer(!showAllDrawer)}
              className="shrink-0 text-xs font-semibold text-[#9E7A4A] hover:text-neutral-950 px-2.5 py-1.5 transition underline cursor-pointer"
            >
              {showAllDrawer ? 'Hide All Categories' : `+${categories.length - 8} More`}
            </button>
          )}
        </div>
      </Reveal>

      {/* Expanded All Categories Grid (Toggleable) */}
      {showAllDrawer && (
        <Reveal direction="down" delay={50}>
          <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-xs grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((cat) => {
              const count = getProductCount ? getProductCount(cat.name) : 0;
              return (
                <Link
                  key={`all-${cat.name}`}
                  to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="flex flex-col p-3 rounded-xl border border-neutral-100 hover:border-[#C5A880] hover:bg-[#FAF6F0]/40 transition group"
                >
                  <span className="text-xs font-semibold text-neutral-900 group-hover:text-black">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-neutral-400 mt-0.5">
                    {formatCount(count)}
                  </span>
                </Link>
              );
            })}
          </div>
        </Reveal>
      )}

      {/* 3. Balanced 6-Card Editorial Showcase Grid */}
      <Reveal direction="up" delay={120}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {curatedShowcase.map((item) => {
            const count = getProductCount ? getProductCount(item.name) : 0;

            return (
              <Link
                key={item.name}
                to={`/shop?category=${encodeURIComponent(item.name)}`}
                className="group relative h-[300px] sm:h-[340px] overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200/90 bg-[#0F1115] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_18px_40px_rgba(0,0,0,0.14)] hover:-translate-y-1.5 hover:border-[#C5A880]/70 flex flex-col justify-between p-6 text-white"
              >
                {/* Background Image with Smooth Scale */}
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Subtle Cinematic Vignette / Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/15 pointer-events-none transition-opacity duration-300 group-hover:opacity-90" />

                {/* Top Row: Tag & Item Count */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-black/45 backdrop-blur-md px-3 py-1 text-[9.5px] sm:text-[10px] font-bold tracking-[0.16em] text-[#E5D7C5] border border-white/15 uppercase shadow-2xs">
                    {item.tag}
                  </span>

                  <span className="rounded-full bg-white/15 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-mono font-medium text-white/90 border border-white/15 shadow-2xs">
                    {formatCount(count)}
                  </span>
                </div>

                {/* Bottom Content Box */}
                <div className="relative z-10">
                  <span className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.2em] text-[#D5C2A5] uppercase">
                    {item.name}
                  </span>

                  <h3 className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs text-neutral-300 font-light line-clamp-1 leading-relaxed">
                    {item.subtitle}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-white/90 group-hover:text-[#E5D7C5] transition-colors">
                    <span>Explore Collection</span>
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Reveal>

    </section>
  );
}
