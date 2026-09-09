// src/components/NewArrivalsSection.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist, WATCH_TYPE_METADATA } from '../utils/productStore';
import {
  HeartIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  SparklesIcon,
  FlameIcon,
  ClockIcon,
  BagIcon,
  ShieldCheckIcon
} from './Icons';

export default function NewArrivalsSection({ products = [], onToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const carouselRef = useRef(null);

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Drag-to-scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  // Wishlist & Add to Cart states
  const [wishlistMap, setWishlistMap] = useState({});
  const [addedMap, setAddedMap] = useState({});

  // Countdown timer for Spotlight Drop
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

  // Sync wishlist map
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

  // Handle Carousel Scroll Status & Progress Bar
  const checkScrollState = useCallback(() => {
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
    checkScrollState();
    el.addEventListener('scroll', checkScrollState, { passive: true });
    window.addEventListener('resize', checkScrollState);
    return () => {
      el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [checkScrollState, products, selectedCategory]);

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cardWidth = container.firstElementChild?.clientWidth || 240;
    const scrollDistance = (cardWidth + 16) * 2;
    container.scrollBy({
      left: direction === 'left' ? -scrollDistance : scrollDistance,
      behavior: 'smooth'
    });
  };

  // Mouse Drag to Scroll handlers
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

  const handleCardClick = (e) => {
    if (hasMoved) {
      e.preventDefault();
    }
  };

  // Login Protection Helper
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

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireLogin('bag')) return;

    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    if (onToast) onToast(`✓ Added "${product.name}" to your bag`);

    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
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
      onToast(active ? `♥ Added "${product.name}" to wishlist` : `Removed "${product.name}" from wishlist`);
    }
  };

  // Categories list for tabs
  const arrivalCategories = [
    'All',
    'Watches',
    'Shoes',
    'Bags & Wallets',
    'Mobiles',
    'Electronics',
    'Smart Gadgets',
    'Gaming'
  ];

  // Dynamic filter products
  const newArrivalsList = products.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Pick standout spotlight drop (prioritize watches/tech or first matching product)
  const spotlightProduct = products.find((p) => p.category === 'Watches' && p.watchType === 'Original') ||
    products.find((p) => p.category === 'Watches') ||
    products[0];

  const spotlightDiscount = spotlightProduct?.discount || (
    spotlightProduct?.oldPrice && spotlightProduct?.oldPrice > spotlightProduct?.price
      ? Math.round(((spotlightProduct.oldPrice - spotlightProduct.price) / spotlightProduct.oldPrice) * 100)
      : 0
  );

  return (
    <section className="relative w-full bg-[#F5F6F9] py-10 sm:py-16 overflow-hidden border-b border-gray-200/80">
      {/* Ambient background glow accents */}
      <div className="pointer-events-none absolute top-0 right-1/4 h-96 w-96 rounded-full bg-amber-400/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ==========================================
            1. SECTION HEADER WITH GLOWING BADGE & NAVIGATION
        ========================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-7 sm:mb-9">
          <div>
            {/* Live Pulsing Glowing Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-[10.5px] sm:text-[11px] font-bold tracking-widest text-amber-900 uppercase shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
              </span>
              <SparklesIcon className="w-3.5 h-3.5 text-amber-700" />
              <span>JUST LANDED 2026 • THE FRESH DROP</span>
            </div>

            {/* Editorial Headline */}
            <h2 className="mt-2.5 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-950">
              New Arrivals <span className="font-serif italic font-normal text-amber-700">&</span> Novelties
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-xl font-normal leading-relaxed">
              Certified authentic horology, handcrafted leather goods, flagship titanium smartphones and audiophile noise-cancelling sound.
            </p>
          </div>

          {/* Navigation Controls & View All Link */}
          <div className="flex items-center gap-3 self-start lg:self-end">
            <Link
              to="/shop?sort=newest"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-900 hover:text-amber-800 transition-colors mr-2 group"
            >
              <span>Explore All Novelties</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <button
              type="button"
              onClick={() => scrollCarousel('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left new arrivals"
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 shadow-2xs ${canScrollLeft
                ? 'border-gray-300 bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 active:scale-95 cursor-pointer'
                : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed opacity-50'
                }`}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => scrollCarousel('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right new arrivals"
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 shadow-2xs ${canScrollRight
                ? 'border-gray-300 bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 active:scale-95 cursor-pointer'
                : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed opacity-50'
                }`}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ==========================================
            2. INTERACTIVE CATEGORY FILTER PILLS
        ========================================== */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 sm:mb-8 no-scrollbar">
          {arrivalCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = cat === 'All'
              ? products.length
              : products.filter((p) => p.category?.toLowerCase() === cat.toLowerCase()).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${isActive
                  ? 'bg-gray-950 text-white shadow-sm scale-102 ring-2 ring-gray-950/20'
                  : 'bg-white text-gray-700 border border-gray-200/90 hover:bg-gray-100 hover:border-gray-300 hover:text-black'
                  }`}
              >
                <span>{cat === 'All' ? 'All Novelties' : cat}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-500'
                    }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ==========================================
            3. HYBRID SPOTLIGHT DROP + HORIZONTAL CAROUSEL DECK
        ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">

          {/* 3A. SPOTLIGHT HERO DROP CARD (LEFT COLUMN - 4 COLS) */}
          {spotlightProduct && (
            <div className="lg:col-span-4 rounded-3xl bg-[#0B0F17] text-white p-5 sm:p-6 shadow-xl border border-neutral-800/90 flex flex-col justify-between relative overflow-hidden group">
              {/* Subtle metallic luxury grid & ambient flare */}
              <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-amber-500/15 blur-2xl" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/80 to-transparent z-10" />

              <div>
                {/* Header Tag + Stock Scarcity */}
                <div className="flex items-center justify-between gap-2 mb-4 relative z-20">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-400/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    <FlameIcon className="w-3 h-3 text-amber-400" />
                    <span>Drop of the Week</span>
                  </span>

                  <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-rose-300 bg-rose-950/60 border border-rose-800/50 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span>Only 3 Units Left</span>
                  </span>
                </div>

                {/* Hero Showcase Image Frame */}
                <Link
                  to={`/product/${spotlightProduct.id}`}
                  className="block relative aspect-[4/3.8] sm:aspect-[4/3.5] lg:aspect-[4/3.6] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 group-hover:border-neutral-700 transition-colors"
                >
                  <img
                    src={spotlightProduct.image || spotlightProduct.images?.[0]}
                    alt={spotlightProduct.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />

                  {/* Top Wishlist Button on Spotlight */}
                  <button
                    type="button"
                    onClick={(e) => handleWishlistToggle(e, spotlightProduct)}
                    aria-label="Save spotlight to wishlist"
                    className={`absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${wishlistMap[spotlightProduct.id]
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-black/60 text-white hover:bg-black/80 border border-white/20'
                      }`}
                  >
                    <HeartIcon className="w-4 h-4" filled={wishlistMap[spotlightProduct.id]} />
                  </button>

                  {/* Inset Watch Certification / Category Badge */}
                  <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/75 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-amber-200 border border-amber-400/20">
                      <ShieldCheckIcon className="w-3 h-3 text-amber-400" />
                      <span>{spotlightProduct.brand} • {spotlightProduct.watchType || 'Certified Edition'}</span>
                    </span>
                  </div>
                </Link>

                {/* Product Title & Star Rating */}
                <div className="mt-4 relative z-20">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
                      {spotlightProduct.brand}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
                      <StarIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>{spotlightProduct.rating || '4.9'}</span>
                      <span className="text-neutral-400 font-normal text-[10px]">({spotlightProduct.reviews || 120})</span>
                    </div>
                  </div>

                  <Link
                    to={`/product/${spotlightProduct.id}`}
                    className="block text-base sm:text-lg font-bold text-white hover:text-amber-200 transition-colors line-clamp-1"
                  >
                    {spotlightProduct.name}
                  </Link>

                  {/* Live Exclusivity Countdown Timer */}
                  <div className="mt-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-semibold">
                      <ClockIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-[11px] uppercase tracking-wider text-neutral-300">Drop Window:</span>
                    </div>

                    <div className="flex items-center gap-1 font-mono text-xs font-bold">
                      <span className="rounded-md bg-neutral-800 px-1.5 py-0.5 text-amber-300">
                        {String(timeLeft.hours).padStart(2, '0')}h
                      </span>
                      <span className="text-neutral-500">:</span>
                      <span className="rounded-md bg-neutral-800 px-1.5 py-0.5 text-amber-300">
                        {String(timeLeft.minutes).padStart(2, '0')}m
                      </span>
                      <span className="text-neutral-500">:</span>
                      <span className="rounded-md bg-neutral-800 px-1.5 py-0.5 text-amber-300">
                        {String(timeLeft.seconds).padStart(2, '0')}s
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & 1-Click Buy / Add to Bag */}
              <div className="mt-4 pt-3 border-t border-neutral-800/80 relative z-20">
                <div className="flex items-baseline justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Special Drop Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-black text-white tabular-nums">
                        ₹{Number(spotlightProduct.price).toLocaleString('en-IN')}
                      </span>
                      {spotlightProduct.oldPrice && spotlightProduct.oldPrice > spotlightProduct.price && (
                        <span className="text-xs text-neutral-400 line-through tabular-nums">
                          ₹{Number(spotlightProduct.oldPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {spotlightDiscount > 0 && (
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                      Save {spotlightDiscount}%
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(e, spotlightProduct)}
                    className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all duration-150 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer truncate ${addedMap[spotlightProduct.id]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700'
                      }`}
                  >
                    <BagIcon className="w-3.5 h-3.5" />
                    <span>{addedMap[spotlightProduct.id] ? '✓ Added' : 'Add to Bag'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleBuyNow(e, spotlightProduct)}
                    className="w-full rounded-xl bg-white text-gray-950 hover:bg-amber-100 py-2.5 text-xs font-bold transition-all duration-150 active:scale-95 shadow-md flex items-center justify-center gap-1 cursor-pointer truncate"
                  >
                    <span>Instant Buy</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3B. HORIZONTAL CAROUSEL CARD DECK (RIGHT COLUMN - 8 COLS) */}
          <div className="lg:col-span-8 flex flex-col justify-between min-w-0">
            {/* Scrollable Track Container */}
            <div
              ref={carouselRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`flex gap-3.5 sm:gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {newArrivalsList.map((product) => {
                const isWatch = product.category === 'Watches' || Boolean(product.watchType);
                const watchMeta = product.watchType ? WATCH_TYPE_METADATA[product.watchType] : (isWatch ? WATCH_TYPE_METADATA['Original'] : null);
                const isAdded = Boolean(addedMap[product.id]);
                const isWish = Boolean(wishlistMap[product.id]);

                const discount = product.discount || (
                  product.oldPrice && product.oldPrice > product.price
                    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                    : 0
                );

                return (
                  <div
                    key={product.id}
                    className="group relative flex-shrink-0 w-[215px] sm:w-[245px] md:w-[260px] rounded-3xl bg-white border border-gray-200/90 p-3 sm:p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.09)] transition-all duration-300 hover:-translate-y-1 snap-start flex flex-col justify-between"
                  >
                    {/* 1. Image Frame & Floating Badges */}
                    <div className="relative aspect-[4/4.6] w-full overflow-hidden rounded-2xl bg-[#F6F7FA]">
                      <Link
                        to={`/product/${product.id}`}
                        onClick={handleCardClick}
                        className="block h-full w-full"
                      >
                        <img
                          src={product.image || product.images?.[0]}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-106 pointer-events-none"
                        />
                      </Link>

                      {/* Floating Inset Badges */}
                      <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
                        <div className="flex items-center gap-1 flex-wrap max-w-[75%]">
                          {/* Sparkle New Badge */}
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-gray-950/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-amber-300 shadow-2xs">
                            <SparklesIcon className="w-2.5 h-2.5 text-amber-400" />
                            <span>NEW</span>
                          </span>

                          {discount > 0 && (
                            <span className="rounded-full bg-emerald-700/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white shadow-2xs">
                              {discount}% OFF
                            </span>
                          )}

                          {isWatch && watchMeta ? (
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8.5px] font-bold border shadow-xs backdrop-blur-md truncate ${watchMeta.badgeClass}`}>
                              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${watchMeta.dotClass || 'bg-current'}`} />
                              <span className="truncate">{watchMeta.shortLabel || watchMeta.label}</span>
                            </span>
                          ) : null}
                        </div>

                        {/* Wishlist Heart Toggle */}
                        <button
                          type="button"
                          onClick={(e) => handleWishlistToggle(e, product)}
                          aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                          className={`pointer-events-auto flex h-7.5 w-7.5 items-center justify-center rounded-full shadow-2xs backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${isWish
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-white/90 text-gray-700 hover:text-rose-600 border border-gray-200/70 hover:bg-white'
                            }`}
                        >
                          <HeartIcon className="w-3.5 h-3.5 transition-colors" filled={isWish} />
                        </button>
                      </div>

                      {/* Desktop Hover Action Slide-Up Bar */}
                      <div className="hidden sm:flex absolute inset-x-2 bottom-2 z-10 gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-auto">
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(e, product)}
                          className={`flex-1 flex items-center justify-center gap-1 rounded-xl py-2 text-[11px] font-bold backdrop-blur-md border shadow-md transition-all duration-150 active:scale-95 cursor-pointer truncate ${isAdded
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white/95 text-gray-900 border-white/80 hover:bg-white hover:text-black'
                            }`}
                        >
                          <BagIcon className="w-3 h-3" />
                          <span>{isAdded ? '✓ Added' : '+ Add'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleBuyNow(e, product)}
                          className="rounded-xl bg-gray-950/95 backdrop-blur-md px-3 py-2 text-[11px] font-bold text-white transition-all duration-150 hover:bg-black active:scale-95 shadow-md cursor-pointer shrink-0"
                        >
                          Buy
                        </button>
                      </div>
                    </div>

                    {/* 2. Product Details */}
                    <div className="pt-3 px-1 pb-0.5 flex flex-1 flex-col justify-between">
                      <div>
                        {/* Brand & Rating */}
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 truncate">
                            {product.brand || 'Original'}
                          </span>
                          <div className="flex items-center gap-0.5 text-[11px] font-bold text-gray-700 shrink-0">
                            <span className="text-amber-500 text-xs">★</span>
                            <span>{product.rating || '4.8'}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <Link
                          to={`/product/${product.id}`}
                          onClick={handleCardClick}
                          className="block text-[13.5px] font-bold text-gray-900 transition-colors duration-150 hover:text-amber-800 line-clamp-1 leading-snug"
                          title={product.name}
                        >
                          {product.name}
                        </Link>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mt-1.5">
                          <span className="text-[15px] font-extrabold text-gray-950 tabular-nums">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>

                          {product.oldPrice && product.oldPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through tabular-nums">
                              ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Mobile Touch Quick Actions */}
                      <div className="grid grid-cols-2 gap-1.5 pt-2.5 mt-2 border-t border-gray-100 sm:hidden">
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(e, product)}
                          className={`w-full rounded-lg py-1.5 text-[10.5px] font-bold transition-all active:scale-95 truncate ${isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {isAdded ? '✓ Added' : 'Add to Bag'}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleBuyNow(e, product)}
                          className="w-full rounded-lg bg-gray-950 py-1.5 text-[10.5px] font-bold text-white transition-all active:scale-95 truncate"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Scroll Progress Bar */}
            <div className="mt-2 flex items-center justify-between gap-4 px-1">
              <div className="relative h-1 flex-1 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gray-950 transition-all duration-150 rounded-full"
                  style={{ width: `${Math.max(15, scrollProgress)}%` }}
                />
              </div>

              <span className="text-[11px] font-semibold text-gray-400 tracking-wider shrink-0">
                {newArrivalsList.length} Novelties Listed
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
