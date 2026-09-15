// src/components/ProductsByPriceSection.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Reveal } from './useScrollReveal';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import { Tag, Zap, Sparkles, Crown, ArrowRight } from 'lucide-react';
import { HeartIcon, BagIcon, CheckIcon, StarIcon } from './Icons';

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
    accentDot: 'bg-emerald-500',
    headerBg: 'from-emerald-950 via-slate-900 to-neutral-950'
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
    accentDot: 'bg-amber-500',
    headerBg: 'from-amber-950 via-slate-900 to-neutral-950'
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
    accentDot: 'bg-indigo-500',
    headerBg: 'from-indigo-950 via-slate-900 to-neutral-950'
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
    accentDot: 'bg-neutral-900',
    headerBg: 'from-neutral-950 via-slate-900 to-zinc-950'
  }
];

export default function ProductsByPriceSection({
  products = [],
  onAddToCart,
  onBuyNow
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTierId, setActiveTierId] = useState('under-5k');
  const [wishlistMap, setWishlistMap] = useState({});
  const [addedMap, setAddedMap] = useState({});

  const activeTier = useMemo(() => {
    return PRICE_TIERS.find((t) => t.id === activeTierId) || PRICE_TIERS[0];
  }, [activeTierId]);

  // Sync wishlist
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

  const requireLogin = (action = 'continue') => {
    if (!getCurrentUser()) {
      const message = action === 'bag'
        ? 'Please sign in to add items to your shopping bag.'
        : action === 'wishlist'
          ? 'Please sign in to save items to your wishlist.'
          : 'Please sign in to complete your purchase.';

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
  };

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

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    }
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleInstantBuy = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBuyNow) {
      onBuyNow(product);
    } else {
      addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
      navigate('/checkout');
    }
  };

  const ActiveTierIcon = activeTier.icon;

  return (
    <section className="bg-[#FAF9F6] pt-10 sm:pt-14 pb-12 sm:pb-16 border-t border-b border-stone-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ============================================================
            1. SECTION HEADER
        ============================================================ */}
        <Reveal direction="up" delay={50}>
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200/80 px-3.5 py-1 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-amber-900">
                PRICE SALONS &amp; VALUE CURATIONS
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-950">
              Shop by Budget
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto">
              Tailored collections filtered by price tier — enjoy authentic luxury craftsmanship at every budget point.
            </p>
          </div>
        </Reveal>

        {/* ============================================================
            2. INTERACTIVE PRICE TIER CARDS
        ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 mb-8 sm:mb-10">
          {PRICE_TIERS.map((tier, idx) => {
            const isActive = activeTierId === tier.id;
            const count = tierCounts[tier.id] || 0;
            const TierIcon = tier.icon;

            return (
              <Reveal key={tier.id} direction="up" delay={idx * 60} duration={650}>
                <div
                  onClick={() => setActiveTierId(tier.id)}
                  className={`group relative flex flex-col justify-between rounded-2xl p-4 sm:p-5 border transition-all duration-300 cursor-pointer select-none ${
                    isActive
                      ? `bg-white shadow-[0_12px_28px_rgba(0,0,0,0.08)] ${tier.activeBorder} -translate-y-1`
                      : 'bg-white/70 border-stone-200 hover:border-stone-400 hover:bg-white hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  {/* Top: Badge & Count */}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`rounded-md px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider border shadow-2xs ${tier.badgeColor}`}>
                        {tier.badge}
                      </span>
                      <span className="text-[11px] font-semibold text-neutral-400">
                        {count > 0 ? `${count} items` : 'Curated'}
                      </span>
                    </div>

                    {/* Middle: Icon & Title */}
                    <div className="mt-3.5 flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tier.iconBg} shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-2xs`}>
                        <TierIcon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold tracking-tight text-neutral-950 leading-snug">
                          {tier.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs font-medium text-neutral-500">
                          {tier.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Selection Status & Shop All Link */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${isActive ? tier.accentDot : 'bg-stone-300'}`} />
                      <span className={`text-[11px] font-semibold transition-colors ${
                        isActive ? 'text-neutral-950 font-bold' : 'text-neutral-500 group-hover:text-neutral-800'
                      }`}>
                        {isActive ? 'Active Salon' : 'Select Tier'}
                      </span>
                    </div>

                    <Link
                      to={`/shop?maxPrice=${tier.maxPrice}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-600 hover:text-black transition-colors rounded-full bg-stone-100 hover:bg-stone-200 px-2.5 py-1"
                      title={`Open catalog under ₹${tier.maxPrice.toLocaleString('en-IN')}`}
                    >
                      <span>Explore</span>
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
            3. BESPOKE HORIZONTAL SALON CARDS (DISTINCT LANDSCAPE UI)
        ============================================================ */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${activeTier.accentDot} animate-pulse`} />
              <span className="text-xs sm:text-sm font-bold text-gray-900">
                Salon Highlights ({activeTier.label})
              </span>
            </div>

            <Link
              to={`/shop?maxPrice=${activeTier.maxPrice}`}
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-700 hover:text-black transition-colors"
            >
              <span>View All ({tierCounts[activeTier.id] || 0}) in this Tier</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {activeProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
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
                    key={`price-prod-landscape-${activeTier.id}-${product.id}`}
                    direction="up"
                    delay={idx * 60}
                    duration={600}
                  >
                    <div className="group relative flex flex-col sm:flex-row items-stretch rounded-[22px] border border-stone-200/90 bg-white p-3.5 sm:p-4 shadow-[0_4px_18px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-amber-400/80 hover:shadow-[0_16px_34px_rgba(0,0,0,0.08)] hover:-translate-y-1">
                      
                      {/* Left: Product Visual with Aspect Ratio */}
                      <div className="relative w-full sm:w-44 md:w-48 aspect-square sm:aspect-auto shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-stone-100 to-stone-200">
                        <Link
                          to={`/product/${product.id}`}
                          className="flex h-full w-full items-center justify-center overflow-hidden"
                        >
                          <img
                            src={product.image || product.images?.[0]}
                            alt={product.name}
                            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                            loading="lazy"
                          />
                        </Link>

                        {/* Top Left Discount or Brand Pill */}
                        <div className="absolute top-2.5 left-2.5 pointer-events-none">
                          {discount > 0 ? (
                            <span className="rounded-md bg-rose-600 text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-xs">
                              {discount}% OFF
                            </span>
                          ) : (
                            <span className="rounded-md bg-stone-900/80 backdrop-blur-md text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-xs">
                              {product.category}
                            </span>
                          )}
                        </div>

                        {/* Top Right Floating Wishlist */}
                        <button
                          type="button"
                          onClick={(e) => handleWishlistToggle(e, product)}
                          aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                          className={`absolute top-2.5 right-2.5 flex h-7.5 w-7.5 items-center justify-center rounded-full shadow-xs backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
                            isWish
                              ? 'bg-rose-50 text-rose-600 border border-rose-200'
                              : 'bg-white/90 text-stone-700 hover:text-rose-600 border border-stone-200/80'
                          }`}
                        >
                          <HeartIcon className="w-3.5 h-3.5" filled={isWish} />
                        </button>
                      </div>

                      {/* Right: Product Details & Price-Centric Actions */}
                      <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-1 flex-col justify-between">
                        <div>
                          {/* Brand & Category Strip */}
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C5A880]">
                              {product.brand || 'PREMIUM'}
                            </span>
                            <span className="text-[9.5px] font-semibold text-stone-400">
                              {activeTier.label}
                            </span>
                          </div>

                          {/* Product Title */}
                          <Link
                            to={`/product/${product.id}`}
                            className="block font-bold text-stone-900 text-sm sm:text-[15px] leading-snug line-clamp-1 transition-colors hover:text-amber-800"
                            title={product.name}
                          >
                            {product.name}
                          </Link>

                          {/* Rating & Verified Tag */}
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex items-center text-amber-500">
                              <StarIcon className="w-3.5 h-3.5 text-amber-400" filled={true} />
                            </div>
                            <span className="text-xs font-bold text-stone-800 tabular-nums">
                              {product.rating ? Number(product.rating).toFixed(1) : '4.8'}
                            </span>
                            <span className="text-stone-400 text-[11px] tabular-nums">
                              ({product.reviews || 24} reviews)
                            </span>
                          </div>

                          {/* Price Tag Row */}
                          <div className="flex items-baseline gap-2 mt-2 pt-2 border-t border-stone-100">
                            <span className="text-base sm:text-lg font-black text-stone-950 tabular-nums">
                              ₹{Number(product.price).toLocaleString('en-IN')}
                            </span>
                            {product.oldPrice && product.oldPrice > product.price && (
                              <span className="text-xs text-stone-400 line-through tabular-nums">
                                ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                              </span>
                            )}
                            <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded-md ml-auto">
                              Budget Value
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons: Add & Buy */}
                        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(e, product)}
                            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                              isAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-900 text-white hover:bg-black'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <CheckIcon className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <BagIcon className="w-3.5 h-3.5 text-amber-300" />
                                <span>Add to Bag</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleInstantBuy(e, product)}
                            className="px-3 py-2 rounded-xl font-bold text-xs uppercase tracking-wider border border-stone-300 bg-stone-50 text-stone-800 hover:bg-stone-100 hover:border-stone-900 transition-all active:scale-95 cursor-pointer"
                          >
                            Buy
                          </button>
                        </div>

                      </div>

                    </div>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl bg-white border border-stone-200/80">
              <p className="text-sm font-semibold text-stone-700">
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
