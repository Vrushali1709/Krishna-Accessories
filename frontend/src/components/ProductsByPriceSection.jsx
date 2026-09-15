// src/components/ProductsByPriceSection.jsx
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Reveal } from './useScrollReveal';
import ProductCard from './ProductCard';
import { addToCart } from '../utils/cart';
import { Tag, Zap, Sparkles, Crown, ArrowRight } from 'lucide-react';

const PRICE_TIERS = [
  {
    id: 'under-5k',
    maxPrice: 5000,
    minPrice: 0,
    label: 'Under ₹5,000',
    title: 'Under ₹5,000',
    subtitle: 'Everyday Essentials',
    badge: 'Essentials',
    icon: Tag,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    iconBg: 'bg-emerald-50 text-emerald-600',
    activeBorder: 'border-emerald-500 ring-2 ring-emerald-400/20',
    accentDot: 'bg-emerald-500'
  },
  {
    id: 'under-10k',
    maxPrice: 10000,
    minPrice: 0,
    label: 'Under ₹10,000',
    title: 'Under ₹10,000',
    subtitle: 'Popular & Trending',
    badge: 'Most Popular',
    icon: Zap,
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-300/80',
    iconBg: 'bg-amber-50 text-amber-600',
    activeBorder: 'border-amber-500 ring-2 ring-amber-400/20',
    accentDot: 'bg-amber-500'
  },
  {
    id: 'under-15k',
    maxPrice: 15000,
    minPrice: 0,
    label: 'Under ₹15,000',
    title: 'Under ₹15,000',
    subtitle: 'Signature Prestige',
    badge: 'Premium Range',
    icon: Sparkles,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    iconBg: 'bg-indigo-50 text-indigo-600',
    activeBorder: 'border-indigo-500 ring-2 ring-indigo-400/20',
    accentDot: 'bg-indigo-500'
  },
  {
    id: 'under-20k',
    maxPrice: 20000,
    minPrice: 0,
    label: 'Under ₹20,000',
    title: 'Under ₹20,000',
    subtitle: 'Executive Luxury',
    badge: 'Luxury Class',
    icon: Crown,
    badgeColor: 'bg-neutral-900 text-amber-300 border-neutral-700',
    iconBg: 'bg-neutral-900 text-amber-400',
    activeBorder: 'border-neutral-900 ring-2 ring-neutral-400/30',
    accentDot: 'bg-neutral-900'
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

  const ActiveTierIcon = activeTier.icon;

  return (
    <section className="bg-white pt-8 sm:pt-12 pb-10 sm:pb-14 border-t border-gray-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ============================================================
            1. SECTION HEADER
        ============================================================ */}
        <Reveal direction="up" delay={50}>
          <div className="text-center mb-8 sm:mb-10">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <span className="h-px w-8 sm:w-16 bg-neutral-300 hidden sm:inline-block" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-950">
                Shop by Budget
              </h2>
              <span className="h-px w-8 sm:w-16 bg-neutral-300 hidden sm:inline-block" />
            </div>

            <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto">
              Discover curated luxury accessories and essentials tailored for your budget.
            </p>
          </div>
        </Reveal>

        {/* ============================================================
            2. MINIMAL INTERACTIVE PRICE TIER CARDS
        ============================================================ */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4 lg:gap-5 mb-8 sm:mb-10">
          {PRICE_TIERS.map((tier, idx) => {
            const isActive = activeTierId === tier.id;
            const count = tierCounts[tier.id] || 0;
            const TierIcon = tier.icon;

            return (
              <Reveal key={tier.id} direction="up" delay={idx * 60} duration={650}>
                <div
                  onClick={() => setActiveTierId(tier.id)}
                    className={`group relative flex min-w-0 flex-col justify-between rounded-2xl p-3 sm:p-5 border transition-all duration-300 cursor-pointer select-none ${isActive
                      ? `bg-white shadow-[0_10px_25px_rgba(0,0,0,0.06)] ${tier.activeBorder} -translate-y-1`
                      : 'bg-neutral-50/60 border-gray-200 hover:border-gray-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5'
                    }`}
                >
                  {/* Top: Badge & Count */}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`max-w-[58%] truncate rounded-md px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9.5px] font-bold uppercase tracking-wider border shadow-2xs ${tier.badgeColor}`}>
                        {tier.badge}
                      </span>
                      <span className="shrink-0 text-[9px] sm:text-[11px] font-medium text-neutral-400">
                        {count > 0 ? `${count} items` : 'Curated'}
                      </span>
                    </div>

                    {/* Middle: Icon & Title */}
                    <div className="mt-3 flex items-center gap-2 sm:gap-3">
                      <div className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl ${tier.iconBg} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                        <TierIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="truncate text-sm sm:text-lg font-bold tracking-tight text-neutral-950 leading-snug">
                          {tier.title}
                        </h3>
                        <p className="truncate text-[9px] sm:text-xs font-medium text-neutral-500">
                          {tier.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Selection Status & Shop All Link */}
                  <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? tier.accentDot : 'bg-neutral-300'}`} />
                      <span className={`truncate text-[9px] sm:text-[11px] font-semibold transition-colors ${isActive ? 'text-neutral-950' : 'text-neutral-500 group-hover:text-neutral-800'
                        }`}>
                        {isActive ? 'Selected' : 'Click to view'}
                      </span>
                    </div>

                    <Link
                      to={`/shop?maxPrice=${tier.maxPrice}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex shrink-0 items-center gap-1 text-[9px] sm:text-[11px] font-semibold text-neutral-600 hover:text-black transition-colors rounded-full bg-neutral-100 hover:bg-neutral-200 px-2 sm:px-2.5 py-1"
                      title={`Open catalog under ₹${tier.maxPrice.toLocaleString('en-IN')}`}
                    >
                      <span>Shop All</span>
                      <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </div>

                  {/* Active Indicator Line */}
                  {isActive && (
                    <div className={`absolute -bottom-[1px] inset-x-6 h-[2.5px] rounded-full ${tier.accentDot}`} />
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
              <span className={`h-2 w-2 rounded-full ${activeTier.accentDot} animate-pulse`} />
              <span className="text-xs sm:text-sm font-bold text-gray-900">
                Top Recommendations ({activeTier.label})
              </span>
            </div>

            <Link
              to={`/shop?maxPrice=${activeTier.maxPrice}`}
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-700 hover:text-black transition-colors"
            >
              <span>View All ({tierCounts[activeTier.id] || 0}) Products</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white shrink-0">
                <ActiveTierIcon className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm text-white">
                  Looking for more options {activeTier.label}?
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
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
