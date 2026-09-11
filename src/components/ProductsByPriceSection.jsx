// src/components/ProductsByPriceSection.jsx
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Reveal } from './useScrollReveal';
import ProductCard from './ProductCard';
import { addToCart } from '../utils/cart';
import { ArrowRightIcon, TagIcon } from './Icons';

const PRICE_TIERS = [
  {
    id: 'under-5k',
    maxPrice: 5000,
    minPrice: 0,
    label: 'Under ₹5,000',
    title: 'Under ₹5,000',
    tag: 'Smart Essentials',
    badge: 'AFFORDABLE LUXE',
    description: 'Everyday watches, leather wallets, polarized eyewear & accessories',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    accentColor: 'from-emerald-500/10 to-teal-500/5',
    activeBorder: 'border-emerald-500 ring-2 ring-emerald-400/20',
    btnColor: 'hover:bg-emerald-600',
    icon: '🏷️'
  },
  {
    id: 'under-10k',
    maxPrice: 10000,
    minPrice: 0,
    label: 'Under ₹10,000',
    title: 'Under ₹10,000',
    tag: 'Sweet Spot Value',
    badge: 'MOST POPULAR',
    description: 'Designer chronographs, premium headphones, shoes & backpacks',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-300/80',
    accentColor: 'from-amber-500/10 to-yellow-500/5',
    activeBorder: 'border-amber-500 ring-2 ring-amber-400/20',
    btnColor: 'hover:bg-amber-600',
    icon: '⚡'
  },
  {
    id: 'under-15k',
    maxPrice: 15000,
    minPrice: 0,
    label: 'Under ₹15,000',
    title: 'Under ₹15,000',
    tag: 'Signature Prestige',
    badge: 'PREMIUM RANGE',
    description: 'Heritage Swiss styling, handcrafted leather totes & smart wearables',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    accentColor: 'from-indigo-500/10 to-blue-500/5',
    activeBorder: 'border-indigo-500 ring-2 ring-indigo-400/20',
    btnColor: 'hover:bg-indigo-600',
    icon: '✦'
  },
  {
    id: 'under-20k',
    maxPrice: 20000,
    minPrice: 0,
    label: 'Under ₹20,000',
    title: 'Under ₹20,000',
    tag: 'Executive Masterpiece',
    badge: 'LUXURY CLASS',
    description: 'Automatic timepieces, sapphire crystal glass & flagship devices',
    badgeColor: 'bg-neutral-900 text-amber-300 border-neutral-700',
    accentColor: 'from-neutral-900/10 to-amber-500/5',
    activeBorder: 'border-neutral-900 ring-2 ring-neutral-400/30',
    btnColor: 'hover:bg-neutral-900',
    icon: '👑'
  }
];

export default function ProductsByPriceSection({
  products = [],
  onAddToCart,
  onBuyNow
}) {
  const navigate = useNavigate();
  const [activeTierId, setActiveTierId] = useState('under-5k');

  const activeTier = useMemo(() => {
    return PRICE_TIERS.find((t) => t.id === activeTierId) || PRICE_TIERS[0];
  }, [activeTierId]);

  // Compute products count for each tier
  const tierCounts = useMemo(() => {
    const counts = {};
    PRICE_TIERS.forEach((tier) => {
      counts[tier.id] = products.filter(
        (p) => Number(p.price) <= tier.maxPrice && Number(p.price) >= tier.minPrice
      ).length;
    });
    return counts;
  }, [products]);

  // Filter top 4 products for the active tier
  const activeProducts = useMemo(() => {
    const list = products
      .filter((p) => Number(p.price) <= activeTier.maxPrice && Number(p.price) >= activeTier.minPrice)
      .sort((a, b) => {
        // Sort by rating & review count for top recommendations
        const scoreB = (Number(b.rating) || 4.5) * 50 + (Number(b.reviews) || 10);
        const scoreA = (Number(a.rating) || 4.5) * 50 + (Number(a.reviews) || 10);
        return scoreB - scoreA;
      });

    return list.slice(0, 4);
  }, [products, activeTier]);

  const handleQuickAdd = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    }
  };

  const handleInstantBuy = (product) => {
    if (onBuyNow) {
      onBuyNow(product);
    } else {
      addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
      navigate('/checkout');
    }
  };

  return (
    <section className="bg-white pt-8 sm:pt-12 pb-10 sm:pb-14 border-t border-gray-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ============================================================
            1. SECTION HEADER
        ============================================================ */}
        <Reveal direction="up" delay={50}>
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/70 mb-2">
              <span className="text-amber-600 text-xs">🏷️</span>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-amber-900">
                CURATED BUDGET TIERS
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-1">
              <span className="h-px w-8 sm:w-16 bg-neutral-300 hidden sm:inline-block" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-950">
                Products by Price
              </h2>
              <span className="h-px w-8 sm:w-16 bg-neutral-300 hidden sm:inline-block" />
            </div>

            <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
              Find authentic luxury timepieces, genuine leather, and high-performance electronics crafted for your exact budget.
            </p>
          </div>
        </Reveal>

        {/* ============================================================
            2. 4 INTERACTIVE PRICE TIER CARDS
        ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 mb-8 sm:mb-10">
          {PRICE_TIERS.map((tier, idx) => {
            const isActive = activeTierId === tier.id;
            const count = tierCounts[tier.id] || 0;

            return (
              <Reveal key={tier.id} direction="up" delay={idx * 60} duration={650}>
                <div
                  onClick={() => setActiveTierId(tier.id)}
                  className={`group relative flex flex-col justify-between rounded-[22px] sm:rounded-[24px] p-4 sm:p-5 border transition-all duration-300 cursor-pointer select-none ${
                    isActive
                      ? `bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)] ${tier.activeBorder} -translate-y-1`
                      : 'bg-neutral-50/70 border-gray-200 hover:border-gray-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  {/* Top Row: Badge & Item Count */}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`rounded-md px-2 py-0.5 text-[9px] sm:text-[9.5px] font-black uppercase tracking-wider border shadow-2xs ${tier.badgeColor}`}>
                        {tier.badge}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-neutral-400">
                        {count > 0 ? `${count} items` : 'Curated'}
                      </span>
                    </div>

                    {/* Price Tier Headline */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-lg sm:text-xl">{tier.icon}</span>
                      <h3 className="text-lg sm:text-xl font-black tracking-tight text-gray-950">
                        {tier.title}
                      </h3>
                    </div>

                    {/* Tag / Category Subtitle */}
                    <p className="mt-0.5 text-[11px] sm:text-xs font-semibold text-neutral-600">
                      {tier.tag}
                    </p>

                    <p className="mt-1.5 text-[11px] text-neutral-400 line-clamp-2 leading-relaxed font-normal">
                      {tier.description}
                    </p>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="mt-4 pt-3 border-t border-gray-100/90 flex items-center justify-between">
                    <span className={`text-[11px] sm:text-xs font-bold transition-colors ${
                      isActive ? 'text-gray-950' : 'text-neutral-500 group-hover:text-black'
                    }`}>
                      {isActive ? '● Selected Tier' : 'Click to View'}
                    </span>

                    <Link
                      to={`/shop?maxPrice=${tier.maxPrice}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-600 hover:text-black transition-colors rounded-full bg-neutral-100 hover:bg-neutral-200 px-2.5 py-0.5"
                      title={`Open catalog under ₹${tier.maxPrice.toLocaleString('en-IN')}`}
                    >
                      <span>Shop All</span>
                      <span>→</span>
                    </Link>
                  </div>

                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute -bottom-[1px] inset-x-6 h-[3px] rounded-full bg-gray-950" />
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* ============================================================
            3. PRODUCT CARDS GRID FOR THE SELECTED PRICE TIER
        ============================================================ */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-gray-900">
                Top Recommendations {activeTier.label}
              </span>
            </div>

            <Link
              to={`/shop?maxPrice=${activeTier.maxPrice}`}
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-800 hover:text-black transition-colors"
            >
              <span>View All ({tierCounts[activeTier.id] || 0}) Products {activeTier.label}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {activeProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
              {activeProducts.map((product, idx) => (
                <Reveal
                  key={`price-prod-${activeTier.id}-${product.id}`}
                  direction="up"
                  delay={idx * 75}
                  duration={650}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleQuickAdd}
                    onBuyNow={handleInstantBuy}
                    showRating={true}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl bg-gray-50 border border-gray-200/80">
              <p className="text-sm font-semibold text-gray-700">
                No products found in this price tier currently.
              </p>
              <Link
                to="/shop"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2 text-xs font-bold text-white hover:bg-black"
              >
                Explore Full Catalog
              </Link>
            </div>
          )}
        </div>

        {/* ============================================================
            4. QUICK LINK BANNER FOR THIS PRICE TIER
        ============================================================ */}
        <Reveal direction="up" delay={100}>
          <div className="rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl shrink-0">
                {activeTier.icon}
              </span>
              <div>
                <p className="font-bold text-xs sm:text-sm text-white">
                  Looking for more authentic choices {activeTier.label}?
                </p>
                <p className="text-[11px] text-neutral-300">
                  Filter by category, brand, and warranty directly in our specialized shop view.
                </p>
              </div>
            </div>

            <Link
              to={`/shop?maxPrice=${activeTier.maxPrice}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-gray-950 uppercase tracking-wider transition-all duration-300 hover:bg-[#E5D7C5] hover:shadow-md active:scale-95 shrink-0"
            >
              <span>Explore All {activeTier.label}</span>
              <ArrowRightIcon className="w-3.5 h-3.5 text-black" />
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
