// src/components/FeaturedBrandsSection.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  siAdidas,
  siApple,
  siBose,
  siDell,
  siGarmin,
  siNike,
  siPuma,
  siRazer,
  siSamsung,
  siSony,
  siZara
} from 'simple-icons';
import { ArrowRightIcon } from './Icons';

// Top Tier Featured Brands Showcase Cards
const FEATURED_BRANDS = [
  {
    name: 'Titan',
    category: 'Watches',
    badge: 'Heritage Swiss & Smart',
    offer: 'Up to 30% Off',
    tagline: 'Precision Craftsmanship & Timeless Luxury',
    image: 'https://i.pinimg.com/736x/80/4d/7c/804d7c5ba3d69a866d1303f94299d564.jpg',
    logoType: 'titan',
    filterCat: 'Watches',
    brandQuery: 'Titan'
  },
  {
    name: 'Rolex',
    category: 'Watches',
    badge: 'Certified Masterpiece',
    offer: 'Exclusive Collection',
    tagline: 'The Ultimate Symbol of Heritage & Prestige',
    image: 'https://i.pinimg.com/736x/e6/df/98/e6df982c03d41dbf66fe9470007838c2.jpg',
    logoType: 'rolex',
    filterCat: 'Watches',
    brandQuery: 'Rolex'
  },
  {
    name: 'Apple',
    category: 'Mobiles & Tech',
    badge: 'Authorized Flagship',
    offer: 'Series 10 & Pro Max',
    tagline: 'Titanium Innovation & Studio Performance',
    image: 'https://i.pinimg.com/736x/00/9b/91/009b91eaa9c50df8e5d5681cbde9a9c3.jpg',
    logoType: 'apple',
    filterCat: 'Mobiles',
    brandQuery: 'Apple'
  },
  {
    name: 'Nike',
    category: 'Shoes & Streetwear',
    badge: 'Iconic Performance',
    offer: 'Air Jordan & Air Max',
    tagline: 'Engineered for Champions & Urban Trendsetters',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900',
    logoType: 'nike',
    filterCat: 'Shoes',
    brandQuery: 'Nike'
  },
  {
    name: 'Sony',
    category: 'Electronics & Sound',
    badge: 'Audiophile Noise-Cancel',
    offer: '1000X Flagship Series',
    tagline: 'Studio Acoustic Fidelity & Immersive Sound',
    image: 'https://i.pinimg.com/1200x/db/6c/da/db6cdaadde558a889e0c812ea679d8e1.jpg',
    logoType: 'sony',
    filterCat: 'Electronics',
    brandQuery: 'Sony'
  },
  {
    name: 'Fossil',
    category: 'Watches & Bags',
    badge: 'Vintage American Style',
    offer: 'Up to 35% Off',
    tagline: 'Genuine Leather Chronographs & Everyday Luxe',
    image: 'https://i.pinimg.com/736x/52/cc/2a/52cc2a9343298c070a2e66503a60b5cc.jpg',
    logoType: 'fossil',
    filterCat: 'Watches',
    brandQuery: 'Fossil'
  },
  {
    name: 'Ray-Ban',
    category: 'Fashion Accessories',
    badge: 'Polarized Eyewear',
    offer: 'Aviator & Wayfarer',
    tagline: 'Legendary Style & High-Definition Sun Protection',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900',
    logoType: 'rayban',
    filterCat: 'Fashion Accessories',
    brandQuery: 'Ray-Ban'
  },
  {
    name: 'Zara',
    category: 'Clothes & Fashion',
    badge: 'European Tailored Haute',
    offer: 'New Season Edit',
    tagline: 'Contemporary Silhouettes & Premium Fabrics',
    image: 'https://i.pinimg.com/1200x/7e/e0/55/7ee055c1c667557a592fa716eb5005fc.jpg',
    logoType: 'zara',
    filterCat: 'Clothes & Fashion',
    brandQuery: 'Zara'
  }
];

// Dual-Track Partner Brand Strips
const brandRow1 = [
  {
    name: 'Titan',
    cat: 'Watches',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <svg viewBox="0 0 32 32" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-950 fill-current">
          <path d="M5 8h22v4h-8.5v16h-5V12H5V8z M16 1.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
        </svg>
        <span className="font-sans font-bold text-xs sm:text-sm md:text-[15px] tracking-[0.2em] text-gray-950">TITAN</span>
      </div>
    )
  },
  {
    name: 'Rolex',
    cat: 'Watches',
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center">
        <svg viewBox="0 0 24 14" className="h-4 sm:h-5 w-6 sm:w-7 text-[#006039] fill-current">
          <path d="M12 1l2.2 4.5 3.8-3 1.5 5.5-3.5 1.5 4.5 3H3.5l4.5-3-3.5-1.5 1.5-5.5 3.8 3L12 1zm-5 11.5h10V14H7v-1.5z" />
        </svg>
        <span className="font-serif font-bold text-[10px] sm:text-xs tracking-[0.25em] text-[#006039] leading-tight mt-0.5">ROLEX</span>
      </div>
    )
  },
  {
    name: 'Fossil',
    cat: 'Watches',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-[#3D2314] text-white font-sans font-black text-[10px] sm:text-xs shadow-2xs">F</span>
        <span className="font-sans font-black text-xs sm:text-sm md:text-[15px] tracking-[0.16em] text-gray-950">FOSSIL</span>
      </div>
    )
  },
  {
    name: 'Casio',
    cat: 'Watches',
    renderLogo: () => (
      <span className="font-sans font-black text-sm sm:text-base md:text-lg tracking-[0.12em] text-[#003B95]">CASIO</span>
    )
  },
  {
    name: 'Nike',
    cat: 'Shoes',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-8 sm:w-10 fill-current text-gray-950">
          <path d={siNike.path} />
        </svg>
        <span className="font-sans font-black text-xs sm:text-sm md:text-[15px] tracking-[0.15em] text-gray-950 italic hidden sm:inline">NIKE</span>
      </div>
    )
  },
  {
    name: 'Adidas',
    cat: 'Shoes',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-6 sm:w-7 fill-current text-gray-950">
          <path d={siAdidas.path} />
        </svg>
        <span className="font-sans font-bold text-xs sm:text-sm md:text-[14px] tracking-wide text-gray-950">adidas</span>
      </div>
    )
  },
  {
    name: 'Apple',
    cat: 'Mobiles',
    renderLogo: () => (
      <div className="flex items-center gap-1 sm:gap-1.5">
        <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-5 sm:w-6 fill-current text-gray-950">
          <path d={siApple.path} />
        </svg>
        <span className="font-sans font-semibold text-xs sm:text-sm md:text-[15px] tracking-tight text-gray-950">Apple</span>
      </div>
    )
  },
  {
    name: 'Samsung',
    cat: 'Mobiles',
    renderLogo: () => (
      <span className="font-sans font-black text-xs sm:text-sm md:text-[15px] tracking-[0.2em] text-[#034EA2]">SAMSUNG</span>
    )
  }
];

const brandRow2 = [
  {
    name: 'Puma',
    cat: 'Shoes',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-6 sm:w-7 fill-current text-[#111827]">
          <path d={siPuma.path} />
        </svg>
        <span className="font-sans font-black text-xs sm:text-sm md:text-[14px] tracking-[0.16em] text-[#111827]">PUMA</span>
      </div>
    )
  },
  {
    name: 'Sony',
    cat: 'Electronics',
    renderLogo: () => (
      <span className="font-serif font-black text-sm sm:text-base md:text-lg tracking-[0.22em] text-gray-950">SONY</span>
    )
  },
  {
    name: 'Bose',
    cat: 'Electronics',
    renderLogo: () => (
      <span className="font-serif italic font-black text-sm sm:text-base md:text-lg tracking-[0.16em] text-gray-950">BOSE</span>
    )
  },
  {
    name: 'Dell',
    cat: 'Laptops',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-5 sm:w-6 fill-current text-[#0076CE]">
          <path d={siDell.path} />
        </svg>
        <span className="font-sans font-bold text-xs sm:text-sm md:text-[14px] tracking-[0.14em] text-[#0076CE]">DELL</span>
      </div>
    )
  },
  {
    name: 'Zara',
    cat: 'Clothes & Fashion',
    renderLogo: () => (
      <span className="font-serif font-black text-sm sm:text-base md:text-lg tracking-[0.28em] text-gray-950">ZARA</span>
    )
  },
  {
    name: 'Hidesign',
    cat: 'Bags & Wallets',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <span className="text-amber-800 text-xs sm:text-sm">🦌</span>
        <span className="font-serif font-bold text-xs sm:text-xs md:text-sm tracking-[0.2em] text-gray-900">HIDESIGN</span>
      </div>
    )
  },
  {
    name: 'Ray-Ban',
    cat: 'Fashion Accessories',
    renderLogo: () => (
      <span className="font-serif italic font-black text-sm sm:text-base md:text-lg text-[#E31837] tracking-tight">Ray•Ban</span>
    )
  },
  {
    name: 'Razer',
    cat: 'Gaming',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-5 sm:w-6 fill-current text-[#00E700]">
          <path d={siRazer.path} />
        </svg>
        <span className="font-sans font-black text-xs sm:text-xs md:text-sm tracking-[0.18em] text-gray-900">RAZER</span>
      </div>
    )
  }
];

export default function FeaturedBrandsSection({ products = [] }) {
  const [selectedBrandCategory, setSelectedBrandCategory] = useState('All');

  const brandFilterCategories = [
    'All',
    'Watches',
    'Mobiles & Tech',
    'Shoes & Streetwear',
    'Electronics & Sound',
    'Fashion Accessories'
  ];

  const filteredBrands = selectedBrandCategory === 'All'
    ? FEATURED_BRANDS
    : FEATURED_BRANDS.filter(b => b.category.toLowerCase().includes(selectedBrandCategory.toLowerCase()) || b.filterCat.toLowerCase().includes(selectedBrandCategory.toLowerCase()));

  // Count items available per brand in state
  const getProductCountForBrand = (brandName) => {
    return products.filter(p => p.brand?.toLowerCase() === brandName.toLowerCase()).length;
  };

  const renderBrandLogoBadge = (brand) => {
    switch (brand.logoType) {
      case 'titan':
        return (
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-black text-amber-300 font-serif font-bold text-sm shadow-md border border-amber-400/30">
            T
          </div>
        );
      case 'rolex':
        return (
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#006039] text-[#D5C2A5] font-serif font-bold text-sm shadow-md border border-[#D5C2A5]/30">
            👑
          </div>
        );
      case 'apple':
        return (
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-black text-white p-2 shadow-md">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d={siApple.path} />
            </svg>
          </div>
        );
      case 'nike':
        return (
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-black text-white p-2 shadow-md">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d={siNike.path} />
            </svg>
          </div>
        );
      case 'sony':
        return (
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-black text-white font-serif font-extrabold text-xs shadow-md tracking-wider">
            SONY
          </div>
        );
      case 'fossil':
        return (
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#3D2314] text-white font-sans font-black text-xs shadow-md">
            F
          </div>
        );
      case 'rayban':
        return (
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#E31837] text-white font-serif italic font-bold text-xs shadow-md">
            RB
          </div>
        );
      case 'zara':
        return (
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-black text-white font-serif font-black text-xs shadow-md tracking-widest">
            Z
          </div>
        );
      default:
        return (
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-black text-white font-bold text-xs shadow-md">
            {brand.name.slice(0, 2).toUpperCase()}
          </div>
        );
    }
  };

  return (
    <section className="bg-[#0B0F19] text-white py-12 sm:py-16 lg:py-20 border-y border-neutral-800 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="h-px w-6 bg-amber-400" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-amber-300">
                Official Houses & Partners
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-white">
              Featured Brands
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-400 max-w-xl font-light">
              Certified authentic collections directly sourced from global luxury maisons and authorized brand sanctuaries.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-300 hover:text-white transition group self-start md:self-auto shrink-0"
          >
            <span>View All Brands Catalog</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Brand Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
          {brandFilterCategories.map((cat) => {
            const isActive = selectedBrandCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedBrandCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-md font-bold'
                    : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700/60'
                }`}
              >
                {cat === 'All' ? 'All Featured Brands' : cat}
              </button>
            );
          })}
        </div>

        {/* Featured Brands Grid (Interactive Cards with Hover Zoom & Action) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredBrands.map((b) => {
            const count = getProductCountForBrand(b.name);
            return (
              <Link
                key={b.name}
                to={`/shop?category=${encodeURIComponent(b.filterCat)}&brand=${encodeURIComponent(b.brandQuery)}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-800 bg-[#121623] p-4 sm:p-5 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/60 hover:shadow-[0_12px_30px_rgba(217,119,6,0.15)]"
              >
                {/* Background Image with Dark Vignette Overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={b.image}
                    alt={b.name}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-25 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-35"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121623] via-[#121623]/80 to-transparent" />
                </div>

                {/* Top Row: Brand Emblem & Special Offer Ribbon */}
                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div className="transition-transform duration-300 group-hover:scale-105">
                    {renderBrandLogoBadge(b)}
                  </div>

                  <span className="rounded-full bg-amber-400/15 border border-amber-400/30 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-amber-300 backdrop-blur-md">
                    {b.offer}
                  </span>
                </div>

                {/* Card Content & Brand Info */}
                <div className="relative z-10 mt-14 sm:mt-16 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400/90">
                      {b.category}
                    </span>
                    <span className="text-neutral-500">•</span>
                    <span className="text-[10px] text-neutral-400 font-medium">
                      {count > 0 ? `${count} Items in Stock` : 'Curated Catalog'}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight group-hover:text-amber-200 transition-colors">
                    {b.name}
                  </h3>

                  <p className="mt-1 text-xs text-neutral-300 font-light line-clamp-2 leading-relaxed">
                    {b.tagline}
                  </p>

                  {/* Bottom Action Pill */}
                  <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-300 group-hover:text-white transition-colors">
                      Explore Store
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 group-hover:bg-amber-400 group-hover:text-black group-hover:translate-x-1">
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ================= DUAL MARQUEE TICKER (20+ PARTNER HOUSES) ================= */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-neutral-800">
          <div className="text-center mb-5 sm:mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-neutral-400">
              Complete Global Brand Network
            </span>
          </div>

          <div className="space-y-3">
            {/* Track 1 (Scrolling Left) */}
            <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-2 sm:p-2.5 backdrop-blur-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#121623] to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#121623] to-transparent z-10" />

              <div className="animate-marquee flex items-center gap-3">
                {[...brandRow1, ...brandRow1, ...brandRow1, ...brandRow1].map((b, idx) => (
                  <Link
                    key={`${b.name}-t1-${idx}`}
                    to={`/shop?category=${encodeURIComponent(b.cat)}&brand=${encodeURIComponent(b.name)}`}
                    className="group flex-shrink-0 flex items-center justify-center w-[140px] sm:w-[160px] h-14 sm:h-16 px-4 rounded-xl border border-gray-200/80 bg-white text-gray-950 shadow-sm transition-all duration-200 hover:border-amber-400 hover:scale-105"
                    title={`${b.name} • ${b.cat}`}
                  >
                    <div className="transition-transform duration-200 group-hover:scale-105">
                      {b.renderLogo()}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Track 2 (Scrolling Right) */}
            <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-2 sm:p-2.5 backdrop-blur-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#121623] to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#121623] to-transparent z-10" />

              <div className="animate-marquee-reverse flex items-center gap-3">
                {[...brandRow2, ...brandRow2, ...brandRow2, ...brandRow2].map((b, idx) => (
                  <Link
                    key={`${b.name}-t2-${idx}`}
                    to={`/shop?category=${encodeURIComponent(b.cat)}&brand=${encodeURIComponent(b.name)}`}
                    className="group flex-shrink-0 flex items-center justify-center w-[140px] sm:w-[160px] h-14 sm:h-16 px-4 rounded-xl border border-gray-200/80 bg-white text-gray-950 shadow-sm transition-all duration-200 hover:border-amber-400 hover:scale-105"
                    title={`${b.name} • ${b.cat}`}
                  >
                    <div className="transition-transform duration-200 group-hover:scale-105">
                      {b.renderLogo()}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
