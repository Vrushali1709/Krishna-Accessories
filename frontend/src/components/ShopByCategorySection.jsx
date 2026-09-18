// src/components/ShopByCategorySection.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from './useScrollReveal';
import { ArrowRightIcon } from './Icons';

// Curated top store categories with clean studio imagery and descriptions
const curatedCategories = [
  {
    name: 'Watches',
    title: 'Luxury Watches',
    description: 'Heritage Swiss chronographs, automatic movements & smart timepieces.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    tag: 'CHRONOGRAPHS'
  },
  {
    name: 'Bags & Wallets',
    title: 'Bags & Wallets',
    description: 'Handcrafted full-grain leather briefcases, sleek cardholders & backpacks.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
    tag: 'LEATHER GOODS'
  },
  {
    name: 'Shoes',
    title: 'Footwear & Sneakers',
    description: 'Bespoke leather formal shoes, designer sneakers & lifestyle classics.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
    tag: 'FOOTWEAR'
  },
  {
    name: 'Electronics',
    title: 'Audio & Acoustics',
    description: 'Audiophile noise-cancelling headphones, wireless earbuds & sound gear.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
    tag: 'STUDIO SOUND'
  },
  {
    name: 'Fashion Accessories',
    title: 'Fashion Accessories',
    description: 'Polarized designer sunglasses, Italian leather belts & fine cufflinks.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    tag: 'ACCESSORIES'
  },
  {
    name: 'Clothes & Fashion',
    title: 'Apparel & Couture',
    description: 'Tailored luxury suits, premium denim, jackets & modern wardrobe staples.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80',
    tag: 'COUTURE'
  },
  {
    name: 'Mobiles',
    title: 'Mobiles & Gadgets',
    description: 'Flagship smartphones, titanium cases, magnetic docks & high-speed chargers.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    tag: 'FLAGSHIPS'
  },
  {
    name: 'Smart Gadgets',
    title: 'Smart Wearables',
    description: 'Next-gen smart rings, health trackers, biometric gear & ambient AI devices.',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
    tag: 'WEARABLES'
  }
];

export default function ShopByCategorySection({
  categories = [],
  getProductCount
}) {
  const [showAllDrawer, setShowAllDrawer] = useState(false);

  const getCountText = (catName) => {
    const count = getProductCount ? getProductCount(catName) : 0;
    if (!count || count === 0) return 'Curated';
    return `${count} ${count === 1 ? 'Product' : 'Products'}`;
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* 1. Refined Minimalist Header */}
      <Reveal direction="up" delay={30}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-[#C5A880]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#9E7A4A]">
                EXPLORE OUR DEPARTMENTS
              </span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-950">
              Shop by Category
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-xl leading-relaxed">
              Explore hand-selected luxury chronographs, handcrafted leather goods, studio acoustics, and designer accessories.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white hover:bg-black hover:text-white hover:border-black px-5 py-2.5 text-xs font-bold text-gray-900 transition-all duration-300 active:scale-95 shadow-2xs"
            >
              <span>View All Products</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </Reveal>

      {/* 2. Sleek Quick-Navigation Filter Strip */}
      <Reveal direction="up" delay={60}>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <Link
            to="/shop"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-gray-950 px-4 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition"
          >
            <span>All Products</span>
          </Link>

          {categories.slice(0, 8).map((cat) => {
            const count = getProductCount ? getProductCount(cat.name) : 0;
            return (
              <Link
                key={cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-950 hover:border-gray-400 hover:bg-gray-50 transition shadow-2xs"
              >
                <span>{cat.name}</span>
                {count > 0 && (
                  <span className="text-[10px] text-gray-400 font-mono">({count})</span>
                )}
              </Link>
            );
          })}

          {categories.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAllDrawer(!showAllDrawer)}
              className="shrink-0 text-xs font-semibold text-[#9E7A4A] hover:text-gray-950 px-2.5 py-1.5 transition underline cursor-pointer"
            >
              {showAllDrawer ? 'Hide All' : `+${categories.length - 8} More`}
            </button>
          )}
        </div>
      </Reveal>

      {/* Expanded Directory Grid (Toggleable) */}
      {showAllDrawer && (
        <Reveal direction="down" delay={40}>
          <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-xs grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((cat) => {
              const count = getProductCount ? getProductCount(cat.name) : 0;
              return (
                <Link
                  key={`all-${cat.name}`}
                  to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="flex flex-col p-3 rounded-xl border border-gray-100 hover:border-[#C5A880] hover:bg-[#FAF6F0]/50 transition group"
                >
                  <span className="text-xs font-semibold text-gray-900 group-hover:text-black">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-gray-400 mt-0.5 font-mono">
                    {getCountText(cat.name)}
                  </span>
                </Link>
              );
            })}
          </div>
        </Reveal>
      )}

      {/* 3. Studio-Grade Clean Luxury Category Cards (Balanced 4-Column Grid) */}
      <Reveal direction="up" delay={90}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {curatedCategories.map((item, index) => {
            const countText = getCountText(item.name);

            return (
              <Link
                key={item.name}
                to={`/shop?category=${encodeURIComponent(item.name)}`}
                className="group relative flex flex-col rounded-2xl sm:rounded-3xl border border-gray-200/90 bg-white overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1.5 hover:border-gray-950 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] active:scale-[0.99]"
              >
                {/* Clean Product Studio Chamber */}
                <div className="relative h-48 sm:h-52 w-full bg-[#F4F4F6] overflow-hidden p-4 sm:p-5 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover rounded-xl transition-transform duration-700 ease-out group-hover:scale-106"
                  />

                  {/* Top-Right Pill Badge */}
                  <span className="absolute top-3.5 right-3.5 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[9.5px] font-semibold text-gray-700 shadow-2xs border border-gray-200/60">
                    {countText}
                  </span>

                  {/* Top-Left Category Index */}
                  <span className="absolute top-3.5 left-3.5 rounded-md bg-black/50 backdrop-blur-sm px-2 py-0.5 text-[9px] font-mono font-bold text-white/90">
                    0{index + 1}
                  </span>
                </div>

                {/* Typography & Details Box (Clean White Canvas) */}
                <div className="p-5 flex flex-col justify-between flex-1 bg-white">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9E7A4A]">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="mt-1.5 text-base sm:text-[17px] font-bold text-gray-950 group-hover:text-black tracking-tight leading-snug flex items-center justify-between">
                      <span>{item.title}</span>
                      <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                    </h3>

                    <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-gray-400 group-hover:text-[#9E7A4A] transition-colors">
                    <span>Explore Department</span>
                    <span className="text-xs font-bold transition-transform duration-300 group-hover:translate-x-1">→</span>
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
