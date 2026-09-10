// src/components/FeaturedBrandsSection.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  siAdidas,
  siApple,
  siDell,
  siNike,
  siPuma,
  siRazer
} from 'simple-icons';
import { ArrowRightIcon } from './Icons';

const BRAND_SPOTLIGHTS = [
  {
    name: 'Titan',
    category: 'Watches',
    tagline: 'Timeless Indian Craftsmanship',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    logoText: 'TITAN',
    color: '#B89758',
    itemCount: '25+ Models'
  },
  {
    name: 'Rolex',
    category: 'Watches',
    tagline: 'Perpetual Excellence & Prestige',
    image: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800',
    logoText: 'ROLEX',
    color: '#006039',
    itemCount: 'Masterpieces'
  },
  {
    name: 'Fossil',
    category: 'Watches',
    tagline: 'Authentic Vintage Chronographs',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800',
    logoText: 'FOSSIL',
    color: '#3D2314',
    itemCount: '18+ Models'
  },
  {
    name: 'Nike',
    category: 'Shoes',
    tagline: 'Innovated for Human Potential',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    logoText: 'NIKE',
    color: '#111827',
    itemCount: '30+ Styles'
  },
  {
    name: 'Apple',
    category: 'Mobiles',
    tagline: 'Pinnacle of Silicon & Design',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800',
    logoText: 'Apple',
    color: '#111827',
    itemCount: 'Flagship Gear'
  },
  {
    name: 'Sony',
    category: 'Electronics',
    tagline: 'Mastering Sound & ANC Purity',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    logoText: 'SONY',
    color: '#111827',
    itemCount: 'Hi-Res Audio'
  },
  {
    name: 'Ray-Ban',
    category: 'Fashion Accessories',
    tagline: 'Iconic Polarized Eyewear',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
    logoText: 'Ray•Ban',
    color: '#E31837',
    itemCount: 'Polarized G-15'
  },
  {
    name: 'Hidesign',
    category: 'Bags & Wallets',
    tagline: 'Handcrafted Vegetable-Tanned Leather',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
    logoText: 'HIDESIGN',
    color: '#78350F',
    itemCount: 'Genuine Leather'
  }
];

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

export default function FeaturedBrandsSection() {
  const [selectedBrandCategory, setSelectedBrandCategory] = useState('All');

  const brandTabs = ['All', 'Watches', 'Shoes', 'Mobiles', 'Electronics', 'Bags & Wallets'];

  const filteredSpotlights = selectedBrandCategory === 'All'
    ? BRAND_SPOTLIGHTS
    : BRAND_SPOTLIGHTS.filter((b) => b.category.toLowerCase() === selectedBrandCategory.toLowerCase());

  return (
    <section className="bg-gradient-to-b from-[#FAFAFB] to-[#F3F4F6] py-14 sm:py-20 border-b border-gray-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-[#B89758]" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.26em] text-[#B89758]">
                Official Partnerships
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-950">
              Featured Brands
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-lg">
              100% certified authentic luxury pieces sourced directly from authorized heritage houses and global leaders.
            </p>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {brandTabs.map((cat) => {
              const isActive = selectedBrandCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedBrandCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#111827] text-white shadow-sm scale-102'
                      : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-black border border-gray-200/80'
                  }`}
                >
                  {cat === 'All' ? 'All Brands' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Brand Spotlight Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 mb-10">
          {filteredSpotlights.map((brand) => (
            <Link
              key={brand.name}
              to={`/shop?category=${encodeURIComponent(brand.category)}&brand=${encodeURIComponent(brand.name)}`}
              className="group relative overflow-hidden rounded-[24px] border border-gray-200/90 bg-white shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3.8] w-full overflow-hidden bg-gray-100">
                <img
                  src={brand.image}
                  alt={brand.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-gray-900 border border-white/20">
                    {brand.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:scale-110">
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="absolute inset-x-3.5 bottom-3.5 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                    {brand.name}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-gray-200/90 font-light truncate">
                    {brand.tagline}
                  </p>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 flex items-center justify-between bg-white border-t border-gray-100">
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  ✓ Certified Partner
                </span>
                <span className="text-[11px] font-semibold text-gray-900 group-hover:text-black flex items-center gap-1">
                  <span>Shop Catalog</span>
                  <span className="text-xs transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Dual Capsule Infinite Scrolling Marquee Track */}
        <div className="mt-8">
          <div className="text-center mb-4">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-gray-400">
              All Authorized House Partners
            </span>
          </div>

          <div className="space-y-3 sm:space-y-3.5">
            {/* Track 1: Row 1 Brands - Scrolling Left */}
            <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-gray-200/90 bg-white p-2 sm:p-2.5 sm:px-3 shadow-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10 rounded-l-[24px]" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10 rounded-r-[24px]" />

              <div className="animate-marquee flex items-center gap-2.5 sm:gap-3 py-0.5">
                {[...brandRow1, ...brandRow1, ...brandRow1, ...brandRow1].map((b, idx) => (
                  <Link
                    key={`${b.name}-t1-${idx}`}
                    to={`/shop?category=${encodeURIComponent(b.cat)}&brand=${encodeURIComponent(b.name)}`}
                    className="group relative flex-shrink-0 flex items-center justify-center w-[140px] sm:w-[160px] md:w-[175px] h-14 sm:h-16 px-4 rounded-xl sm:rounded-2xl border border-gray-200/80 bg-[#FAFAFB] shadow-2xs transition-all duration-200 hover:border-amber-400 hover:bg-white hover:shadow-md hover:scale-[1.03] active:scale-98"
                    title={`${b.name} • ${b.cat}`}
                  >
                    <div className="transition-transform duration-200 group-hover:scale-105">
                      {b.renderLogo()}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Track 2: Row 2 Brands - Scrolling Right */}
            <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-gray-200/90 bg-white p-2 sm:p-2.5 sm:px-3 shadow-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10 rounded-l-[24px]" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10 rounded-r-[24px]" />

              <div className="animate-marquee-reverse flex items-center gap-2.5 sm:gap-3 py-0.5">
                {[...brandRow2, ...brandRow2, ...brandRow2, ...brandRow2].map((b, idx) => (
                  <Link
                    key={`${b.name}-t2-${idx}`}
                    to={`/shop?category=${encodeURIComponent(b.cat)}&brand=${encodeURIComponent(b.name)}`}
                    className="group relative flex-shrink-0 flex items-center justify-center w-[140px] sm:w-[160px] md:w-[175px] h-14 sm:h-16 px-4 rounded-xl sm:rounded-2xl border border-gray-200/80 bg-[#FAFAFB] shadow-2xs transition-all duration-200 hover:border-amber-400 hover:bg-white hover:shadow-md hover:scale-[1.03] active:scale-98"
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
