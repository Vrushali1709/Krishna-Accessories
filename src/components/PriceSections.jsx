// src/components/PriceSections.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Reveal } from './useScrollReveal';
import { ArrowRightIcon, BagIcon, HeartIcon } from './Icons';

// ============================================================
// 1. UNDER ₹5,000 — EVERYDAY LUXURY & ESSENTIALS (COMPACT GRID)
// ============================================================
export function PriceSectionUnder5k({ products = [], onAddToCart, onBuyNow, onToast }) {
  const under5kProducts = products.filter((p) => Number(p.price) <= 5000).slice(0, 6);

  if (under5kProducts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <Reveal direction="up" delay={50}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.26em] text-neutral-400">
                VALUE CURATION • UNDER ₹5,000
              </span>
            </div>
            <h2 className="mt-1 font-serif text-2xl sm:text-3xl lg:text-[32px] font-normal text-gray-950">
              Everyday Luxury & Accessories
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-xl">
              Authentic smartwatches, designer eyewear, and Italian leather wallets without compromise.
            </p>
          </div>

          <Link
            to="/shop?maxPrice=5000"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-900 hover:text-black transition-colors shrink-0"
          >
            <span>Explore All Under ₹5,000</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </Reveal>

      {/* 6-Item Responsive Compact Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {under5kProducts.map((product, idx) => (
          <Reveal key={`under5k-${product.id}`} direction="up" delay={idx * 50} duration={600}>
            <ProductCard
              product={product}
              variant="compact"
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// 2. UNDER ₹10,000 — SMART LIFESTYLE & AUDIO (SPLIT HORIZONTAL)
// ============================================================
export function PriceSectionUnder10k({ products = [], onAddToCart, onBuyNow, onToast }) {
  const under10kProducts = products
    .filter((p) => Number(p.price) > 5000 && Number(p.price) <= 10000)
    .slice(0, 4);

  // Fallback if not enough in strictly 5k-10k range
  const displayProducts = under10kProducts.length >= 2
    ? under10kProducts
    : products.filter((p) => Number(p.price) <= 10000).slice(0, 4);

  if (displayProducts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-[#F8F9FA]/80 rounded-[32px] border border-gray-200/80 my-4 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
      <Reveal direction="up" delay={50}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10.5px] font-bold uppercase tracking-[0.26em] text-neutral-400">
              SMART GEAR & CHRONOGRAPHS • UNDER ₹10,000
            </span>
            <h2 className="mt-1 font-serif text-2xl sm:text-3xl lg:text-[32px] font-normal text-gray-950">
              Flagship Lifestyle & Noise-Cancelling Audio
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-xl">
              Solar-powered chronographs, noise-cancelling headphones, and handcrafted business folios.
            </p>
          </div>

          <Link
            to="/shop?maxPrice=10000"
            className="group inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-800 transition-all hover:border-black hover:bg-neutral-50 shadow-2xs shrink-0"
          >
            <span>View ₹10,000 Collection</span>
            <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>

      {/* 2-Column Split Horizontal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {displayProducts.map((product, idx) => (
          <Reveal key={`under10k-${product.id}`} direction="up" delay={idx * 80} duration={650}>
            <ProductCard
              product={product}
              variant="horizontal"
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// 3. UNDER ₹15,000 — EXECUTIVE SELECTS (3-CARD EDITORIAL)
// ============================================================
export function PriceSectionUnder15k({ products = [], onAddToCart, onBuyNow, onToast }) {
  const under15kProducts = products
    .filter((p) => Number(p.price) > 10000 && Number(p.price) <= 15000)
    .slice(0, 3);

  const displayProducts = under15kProducts.length >= 2
    ? under15kProducts
    : products.filter((p) => Number(p.price) <= 15000 && Number(p.price) > 6000).slice(0, 3);

  if (displayProducts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <Reveal direction="up" delay={50}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-[#C5A880]">
            DISTINGUISHED HOROLOGY & TECH • UNDER ₹15,000
          </span>
          <h2 className="mt-1 font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-gray-950">
            Executive Choice & Heritage Selects
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            Engineered with sapphire crystals, ceramic elements, and high-performance Bluetooth connectivity.
          </p>
        </div>
      </Reveal>

      {/* 3-Card Wide Luxury Editorial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {displayProducts.map((product, idx) => (
          <Reveal key={`under15k-${product.id}`} direction="up" delay={idx * 90} duration={700}>
            <ProductCard
              product={product}
              variant="editorial"
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// 4. UNDER ₹20,000 / PRIVÉ — ELITE MASTERPIECES (OBSIDIAN HERO SHOWCASE)
// ============================================================
export function PriceSectionUnder20k({ products = [], onAddToCart, onBuyNow, onToast }) {
  // Find highest tier products or under 20k
  const tierProducts = products
    .filter((p) => Number(p.price) >= 14000)
    .sort((a, b) => (b.price || 0) - (a.price || 0));

  const spotlightProduct = tierProducts[0] || products[0];
  const companionProducts = tierProducts.slice(1, 4);

  if (!spotlightProduct) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-18">
      <Reveal direction="zoom" delay={50} duration={800}>
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-[#090C14] via-[#0E1320] to-[#07090E] p-6 sm:p-10 lg:p-12 text-white border border-[#C5A880]/30 shadow-2xl">
          
          {/* Ambient Gold Glows */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#C5A880]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

          {/* Section Header */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-neutral-800/80 pb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#E8D4B4] border border-[#C5A880]/30">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                SIGNATURE MASTERPIECE COLLECTION
              </span>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-white">
                Under ₹20,000 & Privé Haute Horlogerie
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-400 max-w-xl font-light">
                Exquisite high-precision Swiss timepieces, flagship titanium handsets, and audiophile luxury.
              </p>
            </div>

            <Link
              to="/shop?minPrice=15000"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F5E6D3] via-[#E8D4B4] to-[#C5A880] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition-all hover:brightness-110 active:scale-95 shadow-md shrink-0"
            >
              <span>Explore Privé Vault</span>
              <ArrowRightIcon className="w-3.5 h-3.5 text-black" />
            </Link>
          </div>

          {/* Layout: Spotlight Hero Masterpiece (Left) + Companion Luxury Cards (Right) */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            
            {/* Left 5-Cols: Featured Spotlight Card */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-[#121724] border border-[#C5A880]/40 p-6 sm:p-7 shadow-xl">
              <div>
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#090C12] border border-neutral-800">
                  <img
                    src={spotlightProduct.image || spotlightProduct.images?.[0]}
                    alt={spotlightProduct.name}
                    className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-108"
                  />
                  <span className="absolute top-3 left-3 rounded-md bg-black/80 backdrop-blur-md px-2.5 py-1 text-[9px] font-bold text-amber-300 uppercase tracking-widest border border-amber-400/30">
                    ★ PINNACLE OF CRAFTSMANSHIP
                  </span>
                </div>

                <div className="mt-5">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C5A880]">
                    {spotlightProduct.brand} • {spotlightProduct.category}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-white mt-1">
                    {spotlightProduct.name}
                  </h3>
                  <p className="mt-2 text-xs text-neutral-300 font-light line-clamp-3 leading-relaxed">
                    {spotlightProduct.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Price</span>
                  <span className="text-xl sm:text-2xl font-black text-white font-mono">
                    ₹{Number(spotlightProduct.price).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onAddToCart && onAddToCart(spotlightProduct)}
                    className="py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <BagIcon className="w-3.5 h-3.5 text-amber-300" />
                    <span>Bag</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onBuyNow && onBuyNow(spotlightProduct)}
                    className="py-2.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#E8D4B4] text-black hover:bg-[#DFC59E] transition-all cursor-pointer font-bold shadow-md"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            {/* Right 7-Cols: 2–3 Companion Luxury Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {companionProducts.map((product) => (
                <ProductCard
                  key={`privé-${product.id}`}
                  product={product}
                  variant="dark-luxury"
                  onAddToCart={onAddToCart}
                  onBuyNow={onBuyNow}
                />
              ))}
            </div>

          </div>

        </div>
      </Reveal>
    </section>
  );
}
