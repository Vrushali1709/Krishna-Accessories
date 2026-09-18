// src/components/ShopByCategorySection.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from './useScrollReveal';
import { ArrowRightIcon } from './Icons';

// Default curated showcase categories
const curatedShowcase = [
  {
    name: 'Watches',
    title: 'Heritage Horology',
    subtitle: 'Swiss Chronographs & Automatic Masterpieces',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    tag: 'Signature Focus',
    span: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-2 min-h-[360px] sm:min-h-[420px]'
  },
  {
    name: 'Bags & Wallets',
    title: 'Handcrafted Leather',
    subtitle: 'Full-Grain Briefcases, Wallets & Totes',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    tag: 'Artisanal',
    span: 'col-span-1 min-h-[190px] sm:min-h-[200px]'
  },
  {
    name: 'Electronics',
    title: 'Audiophile & Sound',
    subtitle: 'Noise-Cancelling Studio Acoustics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    tag: 'Acoustic',
    span: 'col-span-1 min-h-[190px] sm:min-h-[200px]'
  },
  {
    name: 'Shoes',
    title: 'Footwear & Sneakers',
    subtitle: 'Handcrafted Leather & Sport Silhouettes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    tag: 'Lifestyle',
    span: 'col-span-1 min-h-[190px] sm:min-h-[200px]'
  },
  {
    name: 'Fashion Accessories',
    title: 'Eyewear & Accents',
    subtitle: 'Polarized Sunglasses, Belts & Essentials',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    tag: 'Curated',
    span: 'col-span-1 min-h-[190px] sm:min-h-[200px]'
  }
];

export default function ShopByCategorySection({
  categories = [],
  getProductCount
}) {
  const [showAllDrawer, setShowAllDrawer] = useState(false);

  return (
    <section className="relative w-full floor-travertine py-14 sm:py-20 border-b border-[#E6E0D5] overflow-hidden">
      {/* Subtle Ambient Radial Lighting */}
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-[#C5A880]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-[#E5D7C5]/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 1. Header with Architectural Framing */}
        <Reveal direction="up" delay={40}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-1.5 w-6 rounded-full bg-[#C5A880]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C6734]">
                  CURATED DEPARTMENTS
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-950">
                Shop by Category
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 max-w-xl leading-relaxed">
                Explore meticulously crafted timepieces, full-grain leather goods, studio acoustics, and luxury accents.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-[#D5CDBD] bg-white/90 backdrop-blur-md hover:bg-neutral-950 hover:text-white hover:border-neutral-950 px-5 py-2.5 text-xs font-bold text-neutral-900 transition-all duration-300 active:scale-95 shadow-2xs hover:shadow-md"
              >
                <span>View All Collections</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* 2. Sleek Quick-Filter Pills Strip */}
        <Reveal direction="up" delay={80}>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
            <Link
              to="/shop"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-neutral-800 transition"
            >
              <span>All Collections</span>
            </Link>

            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#DDD6C8] bg-white/95 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:border-[#C5A880] hover:bg-white transition-all shadow-2xs hover:shadow-xs"
              >
                <span>{cat.name}</span>
              </Link>
            ))}

            {categories.length > 8 && (
              <button
                type="button"
                onClick={() => setShowAllDrawer(!showAllDrawer)}
                className="shrink-0 text-xs font-bold text-[#8C6734] hover:text-neutral-950 px-3 py-2 transition underline cursor-pointer"
              >
                {showAllDrawer ? 'Hide Categories' : `+${categories.length - 8} More`}
              </button>
            )}
          </div>
        </Reveal>

        {/* Expanded All Categories Grid (Toggleable) */}
        {showAllDrawer && (
          <Reveal direction="down" delay={50}>
            <div className="mb-10 p-6 sm:p-7 rounded-3xl bg-white/95 backdrop-blur-md border border-[#DCD5C6] shadow-sm grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {categories.map((cat) => {
                const count = getProductCount ? getProductCount(cat.name) : 0;
                return (
                  <Link
                    key={`all-${cat.name}`}
                    to={`/shop?category=${encodeURIComponent(cat.name)}`}
                    className="flex flex-col p-3.5 rounded-2xl border border-[#EAE5DA] bg-[#FDFCFB] hover:border-[#C5A880] hover:bg-white hover:shadow-xs transition-all group"
                  >
                    <span className="text-xs font-bold text-neutral-900 group-hover:text-black">
                      {cat.name}
                    </span>
                    <span className="text-[11px] font-medium text-neutral-500 mt-0.5">
                      {count > 0 ? `${count} items` : 'Curated'}
                    </span>
                  </Link>
                );
              })}
            </div>
          </Reveal>
        )}

        {/* 3. Editorial Showcase Grid (1 Large Featured + 4 Compact Tiles) */}
        <Reveal direction="up" delay={120}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {curatedShowcase.map((item, idx) => {
              const count = getProductCount ? getProductCount(item.name) : 0;
              const isLarge = idx === 0;

              return (
                <Link
                  key={item.name}
                  to={`/shop?category=${encodeURIComponent(item.name)}`}
                  className={`group relative overflow-hidden rounded-3xl sm:rounded-[32px] border border-[#DDD5C7] bg-neutral-950 ${item.span} shadow-[0_4px_20px_rgba(30,20,10,0.06)] transition-all duration-400 hover:shadow-[0_20px_45px_rgba(0,0,0,0.18)] hover:-translate-y-1.5 flex flex-col justify-end p-6 sm:p-8 text-white`}
                >
                  {/* Background Image with Smooth Scale */}
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                  />

                  {/* Subtle Cinematic Vignette / Multi-Stop Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />

                  {/* Top Corner Pill */}
                  <div className="absolute top-4 sm:top-5 left-4 sm:left-5 z-10">
                    <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-bold tracking-wider text-[#E5D7C5] border border-white/20 uppercase shadow-xs">
                      {item.tag}
                    </span>
                  </div>

                  {count > 0 && (
                    <div className="absolute top-4 sm:top-5 right-4 sm:right-5 z-10">
                      <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10.5px] font-mono font-medium text-neutral-300 border border-white/15">
                        {count} Items
                      </span>
                    </div>
                  )}

                  {/* Bottom Content Box */}
                  <div className="relative z-10">
                    <span className="text-[11px] font-bold tracking-wider text-[#D5C2A5] uppercase">
                      {item.name}
                    </span>

                    <h3 className={`font-bold tracking-tight text-white mt-1 leading-snug ${
                      isLarge ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-base sm:text-lg'
                    }`}>
                      {item.title}
                    </h3>

                    <p className={`mt-1.5 text-neutral-300 font-light line-clamp-2 ${
                      isLarge ? 'text-xs sm:text-sm max-w-md' : 'text-xs'
                    }`}>
                      {item.subtitle}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white group-hover:text-[#E5D7C5] transition-colors">
                      <span>Explore Department</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Reveal>

      </div>
    </section>
  );
}
