// src/components/ProductsByPriceSection.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Reveal } from './useScrollReveal';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import {
  HeartIcon,
  BagIcon,
  ArrowRightIcon,
  TagIcon,
  CheckIcon
} from './Icons';
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
    badgeBg: 'bg-[#F2EFE9] text-[#9A7B56] border-[#E2DDD3]',
    iconBg: 'bg-[#F5F2EC] text-[#9A7B56]',
    activeBorder: 'border-[#9A7B56] ring-2 ring-[#9A7B56]/20',
    accentDot: 'bg-[#9A7B56]'
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
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    iconBg: 'bg-amber-50 text-amber-700',
    activeBorder: 'border-amber-600 ring-2 ring-amber-500/20',
    accentDot: 'bg-amber-600'
  },
  {
    id: 'under-15k',
    maxPrice: 15000,
    minPrice: 0,
    label: 'Under ₹15,000',
    title: 'Under ₹15,000',
    subtitle: 'Signature Prestige',
    badge: 'Prestige Range',
    icon: Sparkles,
    badgeBg: 'bg-neutral-100 text-neutral-800 border-neutral-300',
    iconBg: 'bg-neutral-100 text-neutral-800',
    activeBorder: 'border-neutral-800 ring-2 ring-neutral-700/20',
    accentDot: 'bg-neutral-900'
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
    badgeBg: 'bg-[#0E1217] text-[#C9A96E] border-neutral-700',
    iconBg: 'bg-[#0E1217] text-[#C9A96E]',
    activeBorder: 'border-[#C9A96E] ring-2 ring-[#C9A96E]/25',
    accentDot: 'bg-[#C9A96E]'
  }
];

export default function ProductsByPriceSection({
  products = [],
  onAddToCart,
  onBuyNow,
  onToast
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTierId, setActiveTierId] = useState('under-5k');
  const [wishlistMap, setWishlistMap] = useState({});
  const [addedMap, setAddedMap] = useState({});

  // Sync wishlist status
  const syncWishlist = useCallback(() => {
    const map = {};
    products.forEach((p) => {
      map[p.id] = isInWishlist(p.id);
    });
    setWishlistMap(map);
  }, [products]);

  useEffect(() => {
    syncWishlist();
    const handleWishlistChange = () => syncWishlist();
    window.addEventListener('wishlistUpdated', handleWishlistChange);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistChange);
  }, [syncWishlist]);

  // Auth requirement check for wishlist
  const requireLogin = (action = 'continue') => {
    if (!getCurrentUser()) {
      const message = action === 'wishlist'
        ? 'Please sign in to save items to your wishlist.'
        : 'Please sign in to continue.';

      navigate('/login', {
        state: {
          from: location.pathname + (location.search || ''),
          message,
          requiredRole: 'customer'
        }
      });
      return false;
    }
    return true;
  };

  const handleWishlistToggle = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireLogin('wishlist')) return;

    const active = toggleWishlist(product);
    setWishlistMap((prev) => ({ ...prev, [product.id]: active }));
    if (onToast) {
      onToast(active ? `♥ Added "${product.name}" to wishlist` : `Removed "${product.name}" from wishlist`);
    }
  };

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    if (onToast) {
      onToast(`✓ Added "${product.name}" to your bag`);
    }

    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

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

  const ActiveTierIcon = activeTier.icon;

  return (
    <section className="bg-[#FAF8F5] pt-10 sm:pt-14 pb-12 sm:pb-16 border-t border-b border-[#ECE6DB]/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ============================================================
            1. REFINED LUXURY SECTION HEADER
        ============================================================ */}
        <Reveal direction="up" delay={40}>
          <div className="text-center mb-8 sm:mb-11">
            <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500 font-sans">
                CURATED BUDGET TIERS
              </span>
              <span className="w-7 h-[1.5px] bg-[#9A7B56]" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif leading-[1.1] text-neutral-900 tracking-tight">
              Shop by <span className="text-[#9A7B56] font-normal">Budget</span>
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto font-sans leading-relaxed">
              Discover curated luxury accessories, timepieces, and essentials tailored for your planned budget.
            </p>
          </div>
        </Reveal>

        {/* ============================================================
            2. LUXURY INTERACTIVE PRICE TIER SELECTOR CARDS
        ============================================================ */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5 mb-8 sm:mb-10">
          {PRICE_TIERS.map((tier, idx) => {
            const isActive = activeTierId === tier.id;
            const count = tierCounts[tier.id] || 0;
            const TierIcon = tier.icon;

            return (
              <Reveal key={tier.id} direction="up" delay={idx * 50} duration={600}>
                <div
                  onClick={() => setActiveTierId(tier.id)}
                  className={`group relative flex min-w-0 flex-col justify-between rounded-2xl p-3.5 sm:p-5 border transition-all duration-300 cursor-pointer select-none ${
                    isActive
                      ? `bg-white shadow-[0_12px_28px_rgba(0,0,0,0.07)] ${tier.activeBorder} -translate-y-1`
                      : 'bg-white/80 border-neutral-200/80 hover:border-neutral-300 hover:bg-white hover:shadow-sm hover:-translate-y-0.5'
                  }`}
                >
                  {/* Top: Badge & Count */}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`max-w-[65%] truncate rounded-md px-2 py-0.5 text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider border shadow-2xs ${tier.badgeBg}`}>
                        {tier.badge}
                      </span>
                      <span className="shrink-0 text-[10px] sm:text-[11px] font-medium text-neutral-400">
                        {count > 0 ? `${count} items` : 'Curated'}
                      </span>
                    </div>

                    {/* Middle: Icon & Title */}
                    <div className="mt-3.5 flex items-center gap-2.5 sm:gap-3">
                      <div className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl ${tier.iconBg} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                        <TierIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="truncate text-sm sm:text-base lg:text-lg font-bold tracking-tight text-neutral-950 leading-snug">
                          {tier.title}
                        </h3>
                        <p className="truncate text-[9.5px] sm:text-xs font-medium text-neutral-500">
                          {tier.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Status & Shop Link */}
                  <div className="mt-3.5 sm:mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? tier.accentDot : 'bg-neutral-300'}`} />
                      <span className={`truncate text-[9.5px] sm:text-[11px] font-semibold transition-colors ${
                        isActive ? 'text-neutral-950 font-bold' : 'text-neutral-500 group-hover:text-neutral-800'
                      }`}>
                        {isActive ? 'Active Tier' : 'Click to view'}
                      </span>
                    </div>

                    <Link
                      to={`/shop?maxPrice=${tier.maxPrice}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex shrink-0 items-center gap-1 text-[9.5px] sm:text-[11px] font-semibold text-neutral-600 hover:text-black transition-colors rounded-full bg-[#F5F2EC] hover:bg-[#ECE6DB] px-2.5 py-1"
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
            3. LUXURY PRODUCT CARDS GRID FOR THE SELECTED TIER
        ============================================================ */}
        <div className="mb-9">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${activeTier.accentDot} animate-pulse`} />
              <span className="text-xs sm:text-sm font-bold text-neutral-900">
                Top Recommendations ({activeTier.label})
              </span>
            </div>

            <Link
              to={`/shop?maxPrice=${activeTier.maxPrice}`}
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#9A7B56] hover:text-[#856543] transition-colors"
            >
              <span>View All ({tierCounts[activeTier.id] || 0}) Products</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {activeProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-7">
              {activeProducts.map((product, idx) => {
                const isWish = Boolean(wishlistMap[product.id]);
                const isAdded = Boolean(addedMap[product.id]);
                const discount = product.discount || (
                  product.oldPrice && product.oldPrice > product.price
                    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                    : 0
                );

                return (
                  <Reveal
                    key={`budget-prod-${activeTier.id}-${product.id}`}
                    direction="up"
                    delay={idx * 60}
                    duration={600}
                  >
                    <div className="group flex flex-col justify-between rounded-2xl bg-white p-3 sm:p-3.5 border border-neutral-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] hover:border-neutral-300 hover:-translate-y-1.5 h-full">
                      {/* Image Canvas */}
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F2EFE9] mb-3.5">
                        <Link
                          to={`/product/${product.id}`}
                          className="relative flex h-full w-full items-center justify-center overflow-hidden"
                        >
                          <img
                            src={product.image || product.images?.[0]}
                            alt={product.name}
                            loading="lazy"
                            className={`h-full w-full object-cover object-center transition-all duration-500 ease-out ${
                              product.images && product.images.length > 1
                                ? 'group-hover:opacity-0 group-hover:scale-105'
                                : 'group-hover:scale-108'
                            }`}
                          />
                          {product.images && product.images.length > 1 && (
                            <img
                              src={product.images[1]}
                              alt={`${product.name} alternate angle`}
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-105 pointer-events-none"
                            />
                          )}
                        </Link>

                        {/* Top Badges & Wishlist */}
                        <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
                          <span className="rounded-md bg-[#B6966C] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white shadow-xs">
                            {activeTier.badge}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => handleWishlistToggle(e, product)}
                            aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                            className={`pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md shadow-xs transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer ${
                              isWish
                                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                : 'bg-white/90 text-neutral-600 hover:text-rose-600 border border-neutral-200/80 hover:bg-white'
                            }`}
                          >
                            <HeartIcon className="w-3.5 h-3.5" filled={isWish} />
                          </button>
                        </div>
                      </div>

                      {/* Product Meta */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link
                            to={`/product/${product.id}`}
                            className="block font-bold text-neutral-900 text-[13.5px] sm:text-[14px] leading-snug line-clamp-1 transition-colors duration-200 hover:text-[#9A7B56]"
                            title={product.name}
                          >
                            {product.name}
                          </Link>

                          <p className="text-[11px] sm:text-[11.5px] font-medium text-neutral-400 mt-0.5">
                            {product.brand || 'Luxury Essential'}
                          </p>

                          {/* Star Rating */}
                          <div className="flex items-center gap-1.5 mt-2">
                            <div className="flex text-amber-500 text-xs tracking-tight">
                              ★ ★ ★ ★ ★
                            </div>
                            <span className="text-[11px] font-semibold text-neutral-500 tabular-nums">
                              {product.rating ? Number(product.rating).toFixed(1) : '4.8'} ({product.reviews || 124})
                            </span>
                          </div>
                        </div>

                        {/* Pricing Line */}
                        <div className="flex items-center justify-between gap-1.5 mt-3 pt-2.5 border-t border-neutral-100">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[14.5px] sm:text-[15px] font-extrabold text-neutral-950 tabular-nums">
                              ₹ {Number(product.price).toLocaleString('en-IN')}
                            </span>
                            {product.oldPrice && product.oldPrice > product.price && (
                              <span className="text-[11px] sm:text-[12px] text-neutral-400 line-through tabular-nums font-normal">
                                ₹ {Number(product.oldPrice).toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          {discount > 0 && (
                            <span className="rounded bg-[#FDF2E9] text-[#B76E28] border border-[#F0D5BE] px-1.5 py-0.5 text-[9.5px] sm:text-[10px] font-bold tracking-tight">
                              {discount}% OFF
                            </span>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(e, product)}
                            className={`w-full py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-98 shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                              isAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#111827] text-white hover:bg-black'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <span className="font-bold text-xs">✓</span>
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <BagIcon className="w-3.5 h-3.5 text-amber-300" />
                                <span>Add to Bag</span>
                              </>
                            )}
                          </button>
                        </div>

                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl bg-white border border-neutral-200/80">
              <p className="text-sm font-semibold text-neutral-700">
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
            4. OBSIDIAN LUXURY CALLOUT BANNER
        ============================================================ */}
        <Reveal direction="up" delay={80}>
          <div className="rounded-2xl sm:rounded-3xl bg-[#0E1217] text-white p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-neutral-800/80 relative overflow-hidden">
            {/* Ambient Gold Glow */}
            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#C9A96E]/10 blur-2xl" />

            <div className="flex items-center gap-3.5 text-center sm:text-left relative z-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-800/80 border border-neutral-700 text-[#C9A96E] shrink-0">
                <ActiveTierIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif text-base sm:text-lg text-white">
                  Looking for more options {activeTier.label}?
                </p>
                <p className="text-[11.5px] sm:text-xs text-neutral-400 font-sans mt-0.5">
                  Filter by category, brand, and warranty directly in our specialized catalog view.
                </p>
              </div>
            </div>

            <Link
              to={`/shop?maxPrice=${activeTier.maxPrice}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#9A7B56] hover:bg-[#856543] px-6 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:shadow-lg active:scale-95 shrink-0 cursor-pointer relative z-10"
            >
              <span>Explore All {activeTier.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
