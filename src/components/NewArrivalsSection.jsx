// src/components/NewArrivalsSection.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist, WATCH_TYPE_METADATA } from '../utils/productStore';
import {
  HeartIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  ShieldCheckIcon
} from './Icons';

export default function NewArrivalsSection({ products = [], onToast }) {
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Mouse drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  // Wishlist state tracking
  const [wishlistMap, setWishlistMap] = useState({});
  const [addedMap, setAddedMap] = useState({});

  // Countdown timer for Spotlight drop
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 38,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update wishlist status
  const refreshWishlist = useCallback(() => {
    const map = {};
    products.forEach((p) => {
      map[p.id] = isInWishlist(p.id);
    });
    setWishlistMap(map);
  }, [products]);

  useEffect(() => {
    refreshWishlist();
    window.addEventListener('wishlistUpdated', refreshWishlist);
    return () => window.removeEventListener('wishlistUpdated', refreshWishlist);
  }, [refreshWishlist]);

  // Categories list for filter pills
  const categories = [
    { id: 'All', label: 'All Drops', icon: '✦' },
    { id: 'Watches', label: 'Watches', icon: '⌚' },
    { id: 'Shoes', label: 'Footwear', icon: '👟' },
    { id: 'Mobiles', label: 'Smartphones', icon: '📱' },
    { id: 'Bags & Wallets', label: 'Leather Bags', icon: '👜' },
    { id: 'Electronics', label: 'Audio & Tech', icon: '🎧' },
    { id: 'Fashion Accessories', label: 'Accessories', icon: '🕶️' }
  ];

  // Filtered new arrivals list
  const filteredProducts = React.useMemo(() => {
    if (selectedCategory === 'All') {
      // Pick top 12 fresh releases across categories
      return products.slice(0, 12);
    }
    return products
      .filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase())
      .slice(0, 12);
  }, [products, selectedCategory]);

  // Spotlight Product (First item or top rated item in category)
  const spotlightProduct = filteredProducts[0] || products[0];
  // Deck items (remaining items after spotlight)
  const deckProducts = filteredProducts.slice(1);

  // Scroll check callback
  const checkScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    const maxScroll = scrollWidth - clientWidth;
    setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, filteredProducts]);

  const scrollDeck = (direction) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cardWidth = container.firstElementChild?.clientWidth || 240;
    const scrollAmount = (cardWidth + 16) * 2;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleMouseDown = (e) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) setHasMoved(true);
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const requireLogin = (action = 'continue') => {
    if (!getCurrentUser()) {
      navigate('/login', {
        state: {
          from: window.location.pathname,
          message:
            action === 'bag'
              ? 'Please sign in to add items to your shopping bag.'
              : action === 'wishlist'
              ? 'Please sign in to save items to your wishlist.'
              : 'Please sign in to complete your purchase.',
          requiredRole: 'customer'
        }
      });
      return false;
    }
    return true;
  };

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireLogin('bag')) return;

    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);

    if (onToast) {
      onToast(`✓ Added "${product.name}" to your bag`);
    }
  };

  const handleBuyNow = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireLogin('buy')) return;

    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  const handleWishlistToggle = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireLogin('wishlist')) return;

    const active = toggleWishlist(product);
    setWishlistMap((prev) => ({ ...prev, [product.id]: active }));
    if (onToast) {
      onToast(
        active
          ? `❤️ Added "${product.name}" to wishlist`
          : `Removed "${product.name}" from wishlist`
      );
    }
  };

  const handleCardClick = (e) => {
    if (hasMoved) {
      e.preventDefault();
    }
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#0A0D14] via-[#0E131F] to-[#0A0D14] text-white py-12 sm:py-16 lg:py-20 border-y border-slate-800/80">
      {/* Ambient background glow orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= SECTION HEADER ================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            {/* Pulsing Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)] mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
              </span>
              <span className="tracking-[0.18em] uppercase text-[10.5px]">✦ JUST LANDED • 2026 DROPS</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              New Arrivals & <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-amber-400 to-amber-100">Novelties</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Discover the latest hand-inspected horology masterpieces, high-tech flagships, and artisanal leather pieces just arrived at our flagship vault.
            </p>
          </div>

          {/* Navigation Controls & View All Link */}
          <div className="flex items-center gap-3 self-start lg:self-end">
            <Link
              to={`/shop?category=${encodeURIComponent(selectedCategory === 'All' ? '' : selectedCategory)}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors mr-2 group"
            >
              <span>Explore All Drops</span>
              <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollDeck('left')}
                disabled={!canScrollLeft}
                aria-label="Previous new arrivals"
                className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border transition-all duration-200 ${
                  canScrollLeft
                    ? 'border-slate-700 bg-slate-900/90 text-white hover:bg-slate-800 hover:border-amber-400/50 hover:scale-105 active:scale-95 cursor-pointer shadow-lg'
                    : 'border-slate-800/60 bg-slate-950/40 text-slate-600 cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollDeck('right')}
                disabled={!canScrollRight}
                aria-label="Next new arrivals"
                className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border transition-all duration-200 ${
                  canScrollRight
                    ? 'border-slate-700 bg-slate-900/90 text-white hover:bg-slate-800 hover:border-amber-400/50 hover:scale-105 active:scale-95 cursor-pointer shadow-lg'
                    : 'border-slate-800/60 bg-slate-950/40 text-slate-600 cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= INTERACTIVE CATEGORY FILTER CHIPS ================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 sm:mb-8 no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)] scale-[1.03]'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/90 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= HYBRID LAYOUT: SPOTLIGHT + SCROLL REEL ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 1. SPOTLIGHT HERO DROP CARD (Featured Showcase) */}
          {spotlightProduct && (
            <div className="lg:col-span-4 flex flex-col justify-between rounded-[28px] border border-amber-500/30 bg-gradient-to-b from-slate-900/90 via-[#131926]/90 to-slate-950/90 p-4 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden group">
              {/* Subtle metallic edge sheen */}
              <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl group-hover:bg-amber-400/20 transition-all duration-500" />
              
              <div>
                {/* Spotlight Header with Live Countdown Banner */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-950 shadow-sm">
                    <span>👑</span>
                    <span>SPOTLIGHT NOVELTY</span>
                  </span>

                  {/* Real-time countdown timer */}
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-mono text-amber-300">
                    <span className="text-slate-400 font-sans text-[9px] uppercase">Drop Closes:</span>
                    <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                    <span>:</span>
                    <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                    <span>:</span>
                    <span className="text-amber-400 font-bold">{String(timeLeft.seconds).padStart(2, '0')}s</span>
                  </div>
                </div>

                {/* Spotlight Product Image Frame */}
                <div className="relative aspect-[4/3.8] w-full overflow-hidden rounded-[20px] bg-slate-950/80 border border-slate-800/80 group-hover:border-amber-500/40 transition-colors duration-300">
                  <Link to={`/product/${spotlightProduct.id}`} className="block h-full w-full">
                    <img
                      src={spotlightProduct.image || spotlightProduct.images?.[0]}
                      alt={spotlightProduct.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      loading="lazy"
                    />
                  </Link>

                  {/* Top Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => handleWishlistToggle(e, spotlightProduct)}
                    aria-label="Add spotlight to wishlist"
                    className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md border transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer z-10 ${
                      wishlistMap[spotlightProduct.id]
                        ? 'bg-rose-500/90 text-white border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                        : 'bg-black/60 text-slate-300 hover:text-rose-400 border-white/15 hover:bg-black/80'
                    }`}
                  >
                    <HeartIcon className="w-4 h-4" filled={wishlistMap[spotlightProduct.id]} />
                  </button>

                  {/* Low Stock Urgency Pill */}
                  <div className="absolute bottom-3 left-3 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/75 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Limited Vault Allocation • In Stock</span>
                    </span>
                  </div>
                </div>

                {/* Spotlight Meta Details */}
                <div className="mt-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
                      {spotlightProduct.brand || 'Original Edition'}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-300">
                      <StarIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>{spotlightProduct.rating || '4.9'}</span>
                      <span className="text-slate-500 text-[10px]">({spotlightProduct.reviews || '120+'})</span>
                    </div>
                  </div>

                  <Link
                    to={`/product/${spotlightProduct.id}`}
                    className="block text-base sm:text-lg font-bold text-white hover:text-amber-200 transition-colors line-clamp-1 leading-snug"
                    title={spotlightProduct.name}
                  >
                    {spotlightProduct.name}
                  </Link>

                  <p className="mt-1 text-xs text-slate-400 line-clamp-2 font-normal leading-relaxed">
                    {spotlightProduct.description || 'Exclusive handcrafted novelty piece crafted for unmatched prestige and longevity.'}
                  </p>

                  {/* Dynamic specs pills */}
                  {spotlightProduct.specifications && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {Object.entries(spotlightProduct.specifications)
                        .slice(0, 3)
                        .map(([k, v]) => (
                          <span
                            key={k}
                            className="inline-flex items-center rounded-md bg-slate-800/80 px-2 py-0.5 text-[9.5px] font-medium text-slate-300 border border-slate-700/60"
                          >
                            <strong className="text-slate-400 mr-1">{k}:</strong> {v}
                          </span>
                        ))}
                    </div>
                  )}

                  {/* Price & Savings */}
                  <div className="mt-3.5 flex items-baseline gap-2.5 pt-2.5 border-t border-slate-800/80">
                    <span className="text-xl font-extrabold text-white tabular-nums tracking-tight">
                      ₹{Number(spotlightProduct.price).toLocaleString('en-IN')}
                    </span>
                    {spotlightProduct.oldPrice && spotlightProduct.oldPrice > spotlightProduct.price && (
                      <span className="text-xs text-slate-500 line-through tabular-nums">
                        ₹{Number(spotlightProduct.oldPrice).toLocaleString('en-IN')}
                      </span>
                    )}
                    {spotlightProduct.discount > 0 && (
                      <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold ml-auto">
                        Save {spotlightProduct.discount}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Spotlight Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-2">
                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(e, spotlightProduct)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer border ${
                    addedMap[spotlightProduct.id]
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span>{addedMap[spotlightProduct.id] ? '✓ Added' : '+ Add to Bag'}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleBuyNow(e, spotlightProduct)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 hover:brightness-110 py-2.5 text-xs font-extrabold transition-all duration-200 active:scale-95 cursor-pointer shadow-[0_4px_15px_rgba(245,158,11,0.25)]"
                >
                  <span>Instant Buy</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 2. HORIZONTAL DRAGGABLE SCROLL REEL DECK */}
          <div className="lg:col-span-8 flex flex-col justify-between overflow-hidden">
            <div
              ref={carouselRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`flex gap-3.5 sm:gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar select-none h-full ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {deckProducts.length > 0 ? (
                deckProducts.map((product) => {
                  const isWatch = product.category === 'Watches' || Boolean(product.watchType);
                  const watchMeta = product.watchType
                    ? WATCH_TYPE_METADATA[product.watchType]
                    : isWatch
                    ? WATCH_TYPE_METADATA['Original']
                    : null;
                  const discount =
                    product.discount ||
                    (product.oldPrice && product.oldPrice > product.price
                      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                      : 0);

                  return (
                    <div
                      key={product.id}
                      className="group relative flex-shrink-0 w-[190px] sm:w-[220px] md:w-[235px] rounded-[24px] border border-slate-800/90 bg-slate-900/60 hover:bg-slate-900/90 p-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)] hover:border-amber-400/40 transition-all duration-300 hover:-translate-y-1 snap-start flex flex-col justify-between"
                    >
                      {/* Image Canvas with Badges */}
                      <div className="relative aspect-[4/4.4] w-full overflow-hidden rounded-[18px] bg-slate-950">
                        <Link
                          to={`/product/${product.id}`}
                          onClick={handleCardClick}
                          className="block h-full w-full"
                        >
                          <img
                            src={product.image || product.images?.[0]}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108 pointer-events-none"
                          />
                        </Link>

                        {/* Top Inset Badges */}
                        <div className="absolute top-2 inset-x-2 z-10 flex items-center justify-between pointer-events-none">
                          <div className="flex flex-col gap-1 items-start">
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-md px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider text-slate-950 shadow-xs">
                              <span className="h-1 w-1 rounded-full bg-slate-950" />
                              <span>NEW</span>
                            </span>

                            {discount > 0 && (
                              <span className="rounded-full bg-black/75 backdrop-blur-md px-1.5 py-0.5 text-[8.5px] font-bold text-white border border-white/10">
                                {discount}% OFF
                              </span>
                            )}
                          </div>

                          {/* Wishlist Button */}
                          <button
                            type="button"
                            onClick={(e) => handleWishlistToggle(e, product)}
                            aria-label="Add to wishlist"
                            className={`pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md border transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
                              wishlistMap[product.id]
                                ? 'bg-rose-500/90 text-white border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                                : 'bg-black/60 text-slate-300 hover:text-rose-400 border-white/15 hover:bg-black/80'
                            }`}
                          >
                            <HeartIcon className="w-3.5 h-3.5" filled={wishlistMap[product.id]} />
                          </button>
                        </div>

                        {/* Watch Type Tag (if applicable) */}
                        {isWatch && watchMeta && (
                          <div className="absolute bottom-2 left-2 pointer-events-none">
                            <span className="inline-flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-md px-2 py-0.5 text-[8.5px] font-bold text-slate-200 border border-white/15">
                              <span className={`h-1.5 w-1.5 rounded-full ${watchMeta.dotClass || 'bg-amber-400'}`} />
                              <span>{watchMeta.shortLabel || watchMeta.label}</span>
                            </span>
                          </div>
                        )}

                        {/* Desktop Hover Quick Action Bar */}
                        <div className="hidden sm:flex absolute inset-x-2 bottom-2 z-10 gap-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out pointer-events-auto">
                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(e, product)}
                            className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-bold backdrop-blur-md border shadow-md transition-all duration-150 active:scale-95 cursor-pointer truncate ${
                              addedMap[product.id]
                                ? 'bg-emerald-600 text-white border-emerald-500'
                                : 'bg-slate-900/90 text-white border-slate-700 hover:bg-white hover:text-slate-950'
                            }`}
                          >
                            <span>{addedMap[product.id] ? '✓ Added' : '+ Add'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleBuyNow(e, product)}
                            className="rounded-lg bg-amber-400 hover:bg-amber-300 px-2.5 py-1.5 text-[11px] font-extrabold text-slate-950 transition-all duration-150 active:scale-95 shadow-md cursor-pointer shrink-0"
                          >
                            Buy
                          </button>
                        </div>
                      </div>

                      {/* Card Information */}
                      <div className="pt-2.5 px-0.5 flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-slate-400 truncate">
                              {product.brand || 'Certified'}
                            </span>
                            <div className="flex items-center gap-0.5 text-[10.5px] font-semibold text-amber-300 shrink-0">
                              <span className="text-amber-400 text-xs">★</span>
                              <span>{product.rating || '4.8'}</span>
                            </div>
                          </div>

                          <Link
                            to={`/product/${product.id}`}
                            onClick={handleCardClick}
                            className="block text-[12.5px] sm:text-[13.5px] font-semibold text-white group-hover:text-amber-300 transition-colors duration-150 line-clamp-1 leading-snug"
                            title={product.name}
                          >
                            {product.name}
                          </Link>

                          <div className="flex items-baseline gap-1.5 mt-1.5">
                            <span className="text-[14px] sm:text-[15px] font-bold text-white tabular-nums">
                              ₹{Number(product.price).toLocaleString('en-IN')}
                            </span>
                            {product.oldPrice && product.oldPrice > product.price && (
                              <span className="text-[10.5px] text-slate-500 line-through tabular-nums">
                                ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mobile Action Buttons (Visible only on mobile touch screens) */}
                        <div className="grid grid-cols-2 gap-1 pt-2 mt-1.5 border-t border-slate-800/80 sm:hidden">
                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(e, product)}
                            className={`w-full rounded-md py-1 text-[10px] font-bold transition-all active:scale-95 truncate ${
                              addedMap[product.id]
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-800 text-slate-200'
                            }`}
                          >
                            {addedMap[product.id] ? '✓ Added' : '+ Bag'}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleBuyNow(e, product)}
                            className="w-full rounded-md bg-amber-400 py-1 text-[10px] font-extrabold text-slate-950 transition-all active:scale-95 truncate"
                          >
                            Buy
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="w-full flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center">
                  <p className="text-sm font-semibold text-slate-300">No new arrivals found in this category.</p>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('All')}
                    className="mt-2 text-xs font-bold text-amber-400 underline cursor-pointer"
                  >
                    View all fresh releases
                  </button>
                </div>
              )}
            </div>

            {/* Deck Progress Bar & Guarantee Pill */}
            <div className="mt-3 flex items-center justify-between gap-4 px-1">
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>100% Brand Certified • Direct Vault Stock</span>
              </div>

              {/* Minimalist Progress Track */}
              <div className="w-24 sm:w-36 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-amber-400 to-amber-200 transition-all duration-150 rounded-full"
                  style={{ width: `${Math.max(15, scrollProgress)}%` }}
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
