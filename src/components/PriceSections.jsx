// src/components/PriceSections.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import { Reveal } from './useScrollReveal';
import { HeartIcon, BagIcon, ArrowRightIcon, StarIcon, CheckIcon } from './Icons';

// ============================================================================
// 1. PRICE SECTION UNDER ₹5,000 (COMPACT QUICK ACCESS GRID)
// ============================================================================
export function PriceSectionUnder5k({ products = [], onAddToCart, onBuyNow, onToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [wishlistMap, setWishlistMap] = useState({});
  const [addedMap, setAddedMap] = useState({});

  const under5kItems = products
    .filter((p) => Number(p.price) <= 5000)
    .slice(0, 4);

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
    if (onToast) {
      onToast(active ? `♥ Added "${product.name}" to wishlist` : `Removed "${product.name}" from wishlist`);
    }
  };

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
      if (onToast) onToast(`✓ Added "${product.name}" to your bag`);
    }

    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1400);
  };

  if (under5kItems.length === 0) return null;

  return (
    <section className="bg-[#F8F9FA] py-14 sm:py-18 border-b border-gray-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <Reveal direction="up" delay={50}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-[0.22em] text-emerald-800">
                  SMART VALUE & EVERYDAY ESSENTIALS
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 font-sans">
                Curated Finds <span className="font-serif font-normal italic text-emerald-800">Under ₹5,000</span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Premium quality backpacks, smart wristwear, and audio gear at accessible price points.
              </p>
            </div>

            <Link
              to="/shop?maxPrice=5000"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-900 hover:text-emerald-700 transition-colors shrink-0 group"
            >
              <span>Explore All Under ₹5,000</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        {/* 4-Card Compact Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
          {under5kItems.map((product, idx) => {
            const isWish = Boolean(wishlistMap[product.id]);
            const isAdded = Boolean(addedMap[product.id]);
            const discount = product.discount || (
              product.oldPrice && product.oldPrice > product.price
                ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                : 0
            );

            return (
              <Reveal key={`u5k-${product.id}`} direction="up" delay={idx * 70} duration={600}>
                <div className="group relative flex flex-col justify-between h-full rounded-2xl border border-gray-200/90 bg-white p-3 sm:p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-emerald-300 hover:shadow-[0_12px_28px_rgba(16,185,129,0.08)] hover:-translate-y-1">

                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50 mb-3">
                    <Link
                      to={`/product/${product.id}`}
                      className="flex h-full w-full items-center justify-center cursor-pointer overflow-hidden"
                    >
                      <img
                        src={product.image || product.images?.[0]}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-106"
                        loading="lazy"
                      />
                    </Link>

                    <div className="absolute top-2 inset-x-2 flex items-center justify-between pointer-events-none">
                      <span className="rounded-md bg-emerald-900/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-200 shadow-xs border border-white/10">
                        {discount > 0 ? `${discount}% OFF` : 'Under ₹5k'}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleWishlistToggle(e, product)}
                        aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                        className={`pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md shadow-xs transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
                          isWish
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-white/90 text-gray-700 hover:text-rose-600 border border-gray-200/80 hover:bg-white'
                        }`}
                      >
                        <HeartIcon className="w-3.5 h-3.5" filled={isWish} />
                      </button>
                    </div>

                    <div className="absolute bottom-1.5 left-2 pointer-events-none">
                      <span className="rounded bg-black/55 backdrop-blur-md px-1.5 py-0.5 text-[8.5px] font-bold text-white uppercase tracking-wider">
                        {product.brand || product.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <Link
                        to={`/product/${product.id}`}
                        className="block font-bold text-gray-900 text-xs sm:text-[13.5px] transition-colors hover:text-emerald-800 line-clamp-1 leading-snug"
                        title={product.name}
                      >
                        {product.name}
                      </Link>

                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-amber-500 text-[11px]">★</span>
                        <span className="text-[11px] font-semibold text-gray-700 tabular-nums">
                          {product.rating ? Number(product.rating).toFixed(1) : '4.7'}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          ({product.reviews || 42})
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-extrabold text-gray-950 tabular-nums">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>
                        {product.oldPrice && product.oldPrice > product.price && (
                          <span className="text-[10px] text-gray-400 line-through tabular-nums">
                            ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 flex items-center gap-1 cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-900 text-white hover:bg-black'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <span>✓</span>
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <BagIcon className="w-3 h-3 text-amber-300" />
                            <span>Add</span>
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

      </div>
    </section>
  );
}

// ============================================================================
// 2. PRICE SECTION UNDER ₹10,000 (HORIZONTAL SPLIT CARDS)
// ============================================================================
export function PriceSectionUnder10k({ products = [], onAddToCart, onBuyNow, onToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [wishlistMap, setWishlistMap] = useState({});
  const [addedMap, setAddedMap] = useState({});

  const under10kItems = products
    .filter((p) => Number(p.price) > 4000 && Number(p.price) <= 10000)
    .slice(0, 4);

  const displayItems = under10kItems.length >= 2
    ? under10kItems
    : products.filter((p) => Number(p.price) <= 10000).slice(0, 4);

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
    if (onToast) {
      onToast(active ? `♥ Added "${product.name}" to wishlist` : `Removed "${product.name}" from wishlist`);
    }
  };

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
      if (onToast) onToast(`✓ Added "${product.name}" to your bag`);
    }

    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1400);
  };

  if (displayItems.length === 0) return null;

  return (
    <section className="bg-white py-14 sm:py-20 border-b border-gray-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <Reveal direction="up" delay={50}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-[0.22em] text-blue-900">
                  DISTINGUISHED HOROLOGY & LEATHER
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-gray-950">
                Crafted Excellence <span className="italic font-light text-blue-900">Under ₹10,000</span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-xl">
                Multi-dial chronographs, handcrafted full-grain leather bags, and noise-cancelling lifestyle sound.
              </p>
            </div>

            <Link
              to="/shop?maxPrice=10000"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-900 hover:text-blue-700 transition-colors shrink-0 group"
            >
              <span>View All Under ₹10,000</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        {/* 2x2 Grid of Horizontal Split Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {displayItems.map((product, idx) => {
            const isWish = Boolean(wishlistMap[product.id]);
            const isAdded = Boolean(addedMap[product.id]);
            const discount = product.discount || (
              product.oldPrice && product.oldPrice > product.price
                ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                : 0
            );

            return (
              <Reveal key={`u10k-${product.id}`} direction="up" delay={idx * 80} duration={650}>
                <div className="group relative flex flex-col sm:flex-row rounded-2xl sm:rounded-3xl border border-gray-200/90 bg-[#FBFBFC] p-3.5 sm:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-blue-200 hover:shadow-[0_16px_36px_rgba(30,58,138,0.06)] hover:bg-white hover:-translate-y-1">

                  <div className="relative aspect-square sm:w-44 md:w-48 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl bg-[#F0F1F4] mb-3 sm:mb-0">
                    <Link
                      to={`/product/${product.id}`}
                      className="flex h-full w-full items-center justify-center cursor-pointer overflow-hidden"
                    >
                      <img
                        src={product.image || product.images?.[0]}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                        loading="lazy"
                      />
                    </Link>

                    <div className="absolute top-2 left-2 z-10">
                      {discount > 0 ? (
                        <span className="rounded-md bg-blue-950/85 backdrop-blur-md px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-blue-200 shadow-xs border border-white/10">
                          {discount}% OFF
                        </span>
                      ) : (
                        <span className="rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                          Under ₹10k
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleWishlistToggle(e, product)}
                      aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                      className={`absolute top-2 right-2 flex h-7.5 w-7.5 items-center justify-center rounded-full backdrop-blur-md shadow-xs transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
                        isWish
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-white/90 text-gray-700 hover:text-rose-600 border border-gray-200/80 hover:bg-white'
                      }`}
                    >
                      <HeartIcon className="w-3.5 h-3.5" filled={isWish} />
                    </button>
                  </div>

                  <div className="sm:pl-4 sm:pr-1 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 truncate">
                          {product.brand || product.category}
                        </span>
                        <span className="text-[9.5px] font-mono text-blue-800 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                          {product.subcategory || 'GENUINE'}
                        </span>
                      </div>

                      <Link
                        to={`/product/${product.id}`}
                        className="block font-bold text-gray-950 text-sm sm:text-[15px] transition-colors hover:text-blue-700 line-clamp-1 leading-snug"
                        title={product.name}
                      >
                        {product.name}
                      </Link>

                      <p className="mt-1 text-[11px] sm:text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {product.description || 'Authentic certified piece with official brand warranty and premium materials.'}
                      </p>

                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex items-center text-amber-500 text-xs">
                          {'★'.repeat(5)}
                        </div>
                        <span className="text-xs font-bold text-gray-800 tabular-nums">
                          {product.rating ? Number(product.rating).toFixed(1) : '4.8'}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          ({product.reviews || 80} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200/80 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base sm:text-lg font-extrabold text-gray-950 tabular-nums">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>
                          {product.oldPrice && product.oldPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through tabular-nums">
                              ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-neutral-900 text-white hover:bg-black'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <span>✓</span>
                            <span>In Bag</span>
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

      </div>
    </section>
  );
}

// ============================================================================
// 3. PRICE SECTION UNDER ₹15,000 (EXECUTIVE SELECTS)
// ============================================================================
export function PriceSectionUnder15k({ products = [], onAddToCart, onBuyNow, onToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [wishlistMap, setWishlistMap] = useState({});
  const [addedMap, setAddedMap] = useState({});

  const under15kItems = products
    .filter((p) => Number(p.price) > 8000 && Number(p.price) <= 15000)
    .slice(0, 4);

  const displayItems = under15kItems.length >= 2
    ? under15kItems
    : products.filter((p) => Number(p.price) <= 15000).slice(0, 4);

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
    if (onToast) {
      onToast(active ? `♥ Added "${product.name}" to wishlist` : `Removed "${product.name}" from wishlist`);
    }
  };

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
      if (onToast) onToast(`✓ Added "${product.name}" to your bag`);
    }

    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1400);
  };

  if (displayItems.length === 0) return null;

  return (
    <section className="bg-[#F8F7F4] py-14 sm:py-20 border-b border-gray-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <Reveal direction="up" delay={50}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B08744]" />
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-[0.25em] text-[#8C6734]">
                  PREMIUM ACOUSTICS & EXECUTIVE WEAR
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-gray-950">
                Executive Selection <span className="italic text-[#8C6734]">Under ₹15,000</span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-xl">
                Curated Swiss chronographs, noise-cancelling audio flagships, and artisanal leather accessories.
              </p>
            </div>

            <Link
              to="/shop?maxPrice=15000"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-900 hover:text-[#8C6734] transition-colors shrink-0 group"
            >
              <span>View All Under ₹15,000</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        {/* 4-Card Elevated Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayItems.map((product, idx) => {
            const isWish = Boolean(wishlistMap[product.id]);
            const isAdded = Boolean(addedMap[product.id]);
            const discount = product.discount || (
              product.oldPrice && product.oldPrice > product.price
                ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                : 0
            );

            return (
              <Reveal key={`u15k-${product.id}`} direction="up" delay={idx * 75} duration={650}>
                <div className="group relative flex flex-col justify-between h-full rounded-2xl sm:rounded-3xl border border-[#E5DFD5] bg-white p-3.5 sm:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-[#C5A059] hover:shadow-[0_16px_36px_rgba(197,160,89,0.12)] hover:-translate-y-1.5">

                  <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#F6F5F2] mb-3">
                    <Link
                      to={`/product/${product.id}`}
                      className="flex h-full w-full items-center justify-center cursor-pointer overflow-hidden"
                    >
                      <img
                        src={product.image || product.images?.[0]}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                        loading="lazy"
                      />
                    </Link>

                    <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                      <span className="rounded-md bg-[#25231F] backdrop-blur-md px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-[#E5D7C5] shadow-xs border border-white/10">
                        {discount > 0 ? `${discount}% OFF` : 'Executive'}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleWishlistToggle(e, product)}
                        aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                        className={`pointer-events-auto flex h-7.5 w-7.5 items-center justify-center rounded-full backdrop-blur-md shadow-xs transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
                          isWish
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-white/90 text-gray-700 hover:text-rose-600 border border-gray-200/80 hover:bg-white'
                        }`}
                      >
                        <HeartIcon className="w-3.5 h-3.5" filled={isWish} />
                      </button>
                    </div>

                    <div className="absolute bottom-2 left-2.5 pointer-events-none">
                      <span className="rounded bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                        {product.brand || product.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between flex-1 text-center">
                    <div>
                      {product.brand && (
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6734] mb-1">
                          {product.brand}
                        </p>
                      )}

                      <Link
                        to={`/product/${product.id}`}
                        className="block font-bold text-gray-950 text-xs sm:text-[14px] transition-colors hover:text-[#8C6734] line-clamp-1 leading-snug"
                        title={product.name}
                      >
                        {product.name}
                      </Link>

                      <div className="flex items-center justify-center gap-1.5 mt-1.5">
                        <div className="flex items-center text-amber-500 text-xs">
                          {'★'.repeat(5)}
                        </div>
                        <span className="font-bold text-gray-800 text-[11.5px] tabular-nums">
                          {product.rating ? Number(product.rating).toFixed(1) : '4.8'}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-center gap-2 mt-2">
                        <span className="text-base sm:text-lg font-extrabold text-gray-950 tabular-nums">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>
                        {product.oldPrice && product.oldPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through tabular-nums">
                            ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3.5">
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-98 shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#161922] text-white hover:bg-black'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <span>✓</span>
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

      </div>
    </section>
  );
}

// ============================================================================
// 4. PRICE SECTION UNDER ₹20,000 / PRIVÉ (OBSIDIAN MASTERPIECES)
// ============================================================================
export function PriceSectionUnder20k({ products = [], onAddToCart, onBuyNow, onToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [wishlistMap, setWishlistMap] = useState({});
  const [addedMap, setAddedMap] = useState({});

  const premiumItems = products
    .filter((p) => Number(p.price) >= 12000)
    .slice(0, 4);

  const displayItems = premiumItems.length >= 2
    ? premiumItems
    : [...products].sort((a, b) => (b.price || 0) - (a.price || 0)).slice(0, 4);

  const heroItem = displayItems[0];
  const sideItems = displayItems.slice(1, 4);

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
    if (onToast) {
      onToast(active ? `♥ Added "${product.name}" to wishlist` : `Removed "${product.name}" from wishlist`);
    }
  };

  const handleHeroAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
      if (onToast) onToast(`✓ Added "${product.name}" to your bag`);
    }

    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1400);
  };

  const handleHeroBuyNow = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBuyNow) {
      onBuyNow(product);
    } else {
      addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
      navigate('/checkout');
    }
  };

  if (!heroItem) return null;

  const heroDiscount = heroItem.discount || (
    heroItem.oldPrice && heroItem.oldPrice > heroItem.price
      ? Math.round(((heroItem.oldPrice - heroItem.price) / heroItem.oldPrice) * 100)
      : 0
  );
  const isHeroWish = Boolean(wishlistMap[heroItem.id]);
  const isHeroAdded = Boolean(addedMap[heroItem.id]);

  return (
    <section className="bg-[#0D1117] text-white py-16 sm:py-22 border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <Reveal direction="up" delay={50}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C5A880] animate-pulse" />
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-[0.25em] text-[#D5C2A5]">
                  PRESTIGE & BESPOKE COLLECTION
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-white">
                Masterpiece Gallery <span className="text-[#C5A880] italic">Under ₹20,000 & Beyond</span>
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-400 max-w-xl font-light">
                Iconic Swiss movements, flagship workstations, and timeless bespoke heirlooms.
              </p>
            </div>

            <Link
              to="/shop?minPrice=15000"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/80 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:border-[#C5A880] hover:text-[#C5A880] transition-all shrink-0 active:scale-95"
            >
              <span>Explore All Prestige</span>
              <ArrowRightIcon className="w-3.5 h-3.5 text-[#C5A880]" />
            </Link>
          </div>
        </Reveal>

        {/* Asymmetrical Spotlight Layout: 1 Hero Card + 3 Companion Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

          {/* Left: Hero Card (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <Reveal direction="left" delay={80} duration={750} className="h-full">
              <div className="group relative h-full rounded-3xl border border-neutral-800 bg-[#161B22] p-5 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-[#C5A880]/60 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

                <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#090C10] mb-5">
                  <Link
                    to={`/product/${heroItem.id}`}
                    className="flex h-full w-full items-center justify-center cursor-pointer overflow-hidden"
                  >
                    <img
                      src={heroItem.image || heroItem.images?.[0]}
                      alt={heroItem.name}
                      className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-106"
                      loading="lazy"
                    />
                  </Link>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#161B22]/80 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between pointer-events-none">
                    <span className="rounded-full bg-black/75 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E5D7C5] border border-[#C5A880]/40">
                      ✦ PRIVÉ MASTERPIECE
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleWishlistToggle(e, heroItem)}
                      aria-label={isHeroWish ? 'Remove from wishlist' : 'Add to wishlist'}
                      className={`pointer-events-auto flex h-8.5 w-8.5 items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
                        isHeroWish
                          ? 'bg-rose-950/90 text-rose-400 border border-rose-500/50'
                          : 'bg-black/60 text-white hover:text-rose-400 border border-white/20 hover:bg-black'
                      }`}
                    >
                      <HeartIcon className="w-4 h-4" filled={isHeroWish} />
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3.5 pointer-events-none">
                    <span className="text-[11px] font-mono tracking-widest uppercase text-[#C5A880] font-bold bg-black/60 px-2.5 py-0.5 rounded backdrop-blur-md">
                      {heroItem.brand}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
                      {heroItem.category} • {heroItem.subcategory || 'Luxury Edition'}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      <span>★</span>
                      <span className="font-bold text-white tabular-nums">
                        {heroItem.rating ? Number(heroItem.rating).toFixed(1) : '4.9'}
                      </span>
                      <span className="text-neutral-500 text-[11px]">
                        ({heroItem.reviews || 120})
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/product/${heroItem.id}`}
                    className="block font-serif text-xl sm:text-2xl text-white hover:text-[#C5A880] transition-colors leading-snug line-clamp-1"
                  >
                    {heroItem.name}
                  </Link>

                  <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed line-clamp-2 font-light">
                    {heroItem.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-neutral-900 px-2.5 py-1 text-[10.5px] text-neutral-300 border border-neutral-800">
                      <span className="text-[#C5A880]">✓</span> Official Warranty
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-neutral-900 px-2.5 py-1 text-[10.5px] text-neutral-300 border border-neutral-800">
                      <span className="text-[#C5A880]">✓</span> Insured Express Dispatch
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-neutral-900 px-2.5 py-1 text-[10.5px] text-neutral-300 border border-neutral-800">
                      <span className="text-[#C5A880]">✓</span> 100% Certified
                    </span>
                  </div>

                  <div className="mt-6 pt-5 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                        ₹{Number(heroItem.price).toLocaleString('en-IN')}
                      </span>
                      {heroItem.oldPrice && heroItem.oldPrice > heroItem.price && (
                        <span className="text-sm text-neutral-500 line-through tabular-nums font-normal">
                          ₹{Number(heroItem.oldPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                      {heroDiscount > 0 && (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded">
                          Save {heroDiscount}%
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => handleHeroAdd(e, heroItem)}
                        className={`py-3 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer ${
                          isHeroAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-black hover:bg-[#E5D7C5]'
                        }`}
                      >
                        {isHeroAdded ? (
                          <>
                            <span>✓</span>
                            <span>Added to Bag</span>
                          </>
                        ) : (
                          <>
                            <BagIcon className="w-3.5 h-3.5 text-black" />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleHeroBuyNow(e, heroItem)}
                        className="py-3 px-5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 border border-neutral-700 bg-neutral-900 text-white hover:border-[#C5A880] cursor-pointer"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </Reveal>
          </div>

          {/* Right: 3 Stacked Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {sideItems.map((product, idx) => {
              const isWish = Boolean(wishlistMap[product.id]);
              const isAdded = Boolean(addedMap[product.id]);
              const discount = product.discount || (
                product.oldPrice && product.oldPrice > product.price
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                  : 0
              );

              return (
                <Reveal key={`u20k-side-${product.id}`} direction="right" delay={120 + idx * 80} duration={650}>
                  <div className="group relative flex items-center gap-4 rounded-2xl border border-neutral-800 bg-[#161B22] p-3 sm:p-4 transition-all duration-300 hover:border-[#C5A880]/50 hover:bg-[#1C2129]">

                    <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-[#090C10]">
                      <Link
                        to={`/product/${product.id}`}
                        className="flex h-full w-full items-center justify-center cursor-pointer overflow-hidden"
                      >
                        <img
                          src={product.image || product.images?.[0]}
                          alt={product.name}
                          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
                          loading="lazy"
                        />
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => handleWishlistToggle(e, product)}
                        aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                        className={`absolute top-1.5 right-1.5 flex h-6.5 w-6.5 items-center justify-center rounded-full backdrop-blur-md shadow-xs transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
                          isWish
                            ? 'bg-rose-950/90 text-rose-400 border border-rose-500/40'
                            : 'bg-black/60 text-neutral-300 hover:text-rose-400 border border-white/10'
                        }`}
                      >
                        <HeartIcon className="w-3 h-3" filled={isWish} />
                      </button>
                    </div>

                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A880] truncate">
                            {product.brand || product.category}
                          </span>
                          {discount > 0 && (
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/30">
                              {discount}% OFF
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/product/${product.id}`}
                          className="block font-bold text-white text-xs sm:text-[13.5px] transition-colors hover:text-[#C5A880] line-clamp-1 leading-snug mt-0.5"
                          title={product.name}
                        >
                          {product.name}
                        </Link>

                        <div className="flex items-center gap-1 mt-1 text-[11px] text-neutral-400">
                          <span className="text-amber-400">★</span>
                          <span className="font-semibold text-neutral-200">
                            {product.rating ? Number(product.rating).toFixed(1) : '4.8'}
                          </span>
                          <span>•</span>
                          <span className="truncate">{product.subcategory || product.category}</span>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-neutral-800 flex items-center justify-between gap-2">
                        <span className="text-sm sm:text-base font-extrabold text-white tabular-nums">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => handleHeroAdd(e, product)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 flex items-center gap-1 cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-neutral-800 text-white hover:bg-neutral-700 hover:text-[#C5A880] border border-neutral-700'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <span>✓</span>
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <BagIcon className="w-3 h-3 text-[#C5A880]" />
                              <span>+ Add</span>
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

        </div>

      </div>
    </section>
  );
}
