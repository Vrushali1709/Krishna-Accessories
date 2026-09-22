// src/components/FeaturedCollectionShowcase.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import { Reveal } from './useScrollReveal';
import {
  HeartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  TruckIcon,
  RefreshIcon,
  ShieldCheckIcon,
  HeadphonesIcon
} from './Icons';

// Reusable luxury product card for light / cream sections
function LightProductCard({ product, badgeText = 'Featured', onWishlistToggle, isWishlist }) {
  const discount = product.discount || (
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0
  );

  return (
    <div className="group flex flex-col justify-between w-[230px] sm:w-[255px] md:w-[270px] shrink-0 rounded-2xl bg-white p-3 sm:p-3.5 border border-neutral-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] hover:border-neutral-300 hover:-translate-y-1.5 snap-start">
      {/* 1. Image Canvas */}
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
              alt={`${product.name} alternate view`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-105 pointer-events-none"
            />
          )}
        </Link>

        {/* Top Badges & Actions */}
        <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
          <span className="rounded-md bg-[#B6966C] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white shadow-xs">
            {badgeText}
          </span>

          <button
            type="button"
            onClick={(e) => onWishlistToggle(e, product)}
            aria-label={isWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md shadow-xs transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer ${
              isWishlist
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-white/90 text-neutral-600 hover:text-rose-600 border border-neutral-200/80 hover:bg-white'
            }`}
          >
            <HeartIcon className="w-3.5 h-3.5" filled={isWishlist} />
          </button>
        </div>
      </div>

      {/* 2. Product Meta Info */}
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

        {/* 3. Pricing Line */}
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
      </div>
    </div>
  );
}

// Reusable luxury product card for dark obsidian section (Trending Now)
function DarkProductCard({ product, badgeText = 'Trending', onWishlistToggle, isWishlist }) {
  const discount = product.discount || (
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0
  );

  return (
    <div className="group flex flex-col justify-between w-[230px] sm:w-[255px] md:w-[270px] shrink-0 rounded-2xl bg-[#161C24] p-3 sm:p-3.5 border border-neutral-800/90 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)] hover:border-neutral-700 hover:-translate-y-1.5 snap-start">
      {/* 1. Image Canvas */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#1B222C] mb-3.5">
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
              alt={`${product.name} alternate view`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-105 pointer-events-none"
            />
          )}
        </Link>

        {/* Top Badges & Actions */}
        <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
          <span className="rounded-md bg-[#B88746] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white shadow-xs">
            {badgeText}
          </span>

          <button
            type="button"
            onClick={(e) => onWishlistToggle(e, product)}
            aria-label={isWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md shadow-xs transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer ${
              isWishlist
                ? 'bg-rose-950/80 text-rose-400 border border-rose-800/80'
                : 'bg-neutral-900/80 text-neutral-300 hover:text-rose-400 border border-neutral-700/80 hover:bg-neutral-800'
            }`}
          >
            <HeartIcon className="w-3.5 h-3.5" filled={isWishlist} />
          </button>
        </div>
      </div>

      {/* 2. Product Meta Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            to={`/product/${product.id}`}
            className="block font-bold text-white text-[13.5px] sm:text-[14px] leading-snug line-clamp-1 transition-colors duration-200 hover:text-[#C9A96E]"
            title={product.name}
          >
            {product.name}
          </Link>

          <p className="text-[11px] sm:text-[11.5px] font-medium text-neutral-400 mt-0.5">
            {product.brand || 'Flagship Tech'}
          </p>

          {/* Star Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex text-amber-400 text-xs tracking-tight">
              ★ ★ ★ ★ ★
            </div>
            <span className="text-[11px] font-semibold text-neutral-400 tabular-nums">
              {product.rating ? Number(product.rating).toFixed(1) : '4.9'} ({product.reviews || 205})
            </span>
          </div>
        </div>

        {/* 3. Pricing Line */}
        <div className="flex items-center justify-between gap-1.5 mt-3 pt-2.5 border-t border-neutral-800">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[14.5px] sm:text-[15px] font-extrabold text-white tabular-nums">
              ₹ {Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-[11px] sm:text-[12px] text-neutral-500 line-through tabular-nums font-normal">
                ₹ {Number(product.oldPrice).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {discount > 0 && (
            <span className="rounded bg-[#3D2C1D] text-[#E0A96D] border border-[#5E4226] px-1.5 py-0.5 text-[9.5px] sm:text-[10px] font-bold tracking-tight">
              {discount}% OFF
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedCollectionShowcase({ products = [], onToast }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [wishlistMap, setWishlistMap] = useState({});

  // Carousel Refs & Scroll states
  const featuredCarouselRef = useRef(null);
  const trendingCarouselRef = useRef(null);
  const bestSellersCarouselRef = useRef(null);

  const [featuredCanScroll, setFeaturedCanScroll] = useState({ left: false, right: true });
  const [trendingCanScroll, setTrendingCanScroll] = useState({ left: false, right: true });
  const [bestSellersCanScroll, setBestSellersCanScroll] = useState({ left: false, right: true });

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

  // Scroll helpers
  const handleScroll = (ref, direction) => {
    if (!ref.current) return;
    const container = ref.current;
    const cardWidth = container.firstElementChild?.clientWidth || 260;
    const scrollAmount = (cardWidth + 16) * 2;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const updateScrollState = (ref, setScrollState) => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    setScrollState({
      left: scrollLeft > 10,
      right: scrollLeft < scrollWidth - clientWidth - 10
    });
  };

  useEffect(() => {
    const featEl = featuredCarouselRef.current;
    const trendEl = trendingCarouselRef.current;
    const bestEl = bestSellersCarouselRef.current;

    const checkAll = () => {
      updateScrollState(featuredCarouselRef, setFeaturedCanScroll);
      updateScrollState(trendingCarouselRef, setTrendingCanScroll);
      updateScrollState(bestSellersCarouselRef, setBestSellersCanScroll);
    };

    checkAll();

    featEl?.addEventListener('scroll', () => updateScrollState(featuredCarouselRef, setFeaturedCanScroll), { passive: true });
    trendEl?.addEventListener('scroll', () => updateScrollState(trendingCarouselRef, setTrendingCanScroll), { passive: true });
    bestEl?.addEventListener('scroll', () => updateScrollState(bestSellersCarouselRef, setBestSellersCanScroll), { passive: true });

    window.addEventListener('resize', checkAll);
    return () => {
      window.removeEventListener('resize', checkAll);
    };
  }, [products]);

  // ============================================================
  // PRODUCT LIST CURATIONS
  // ============================================================
  // 1. Featured Products (Curated luxury timepieces, leather, fine jewelry & sunglasses)
  const featuredProducts = useMemo(() => {
    const list = [...products];
    const curated = list.filter((p) =>
      ['Watches', 'Fashion Accessories', 'Bags & Wallets', 'Clothes & Fashion'].includes(p.category) ||
      ['Fossil', 'Titan', 'Swarovski', 'Ray-Ban', 'Rolex', 'Michael Kors', 'Hidesign', 'Wildcraft'].includes(p.brand)
    );
    if (curated.length >= 4) return curated;
    return list;
  }, [products]);

  // 2. Trending Now (Hot-selling flagships, earphones, sneakers, smart watches)
  const trendingProducts = useMemo(() => {
    const list = [...products];
    const hot = list.filter((p) =>
      ['Mobiles', 'Electronics', 'Shoes', 'Smart Gadgets', 'Gaming'].includes(p.category) ||
      ['Apple', 'Nike', 'Sony', 'Samsung', 'Razer', 'boAt', 'Adidas'].includes(p.brand)
    ).sort((a, b) => (Number(b.reviews) || 0) - (Number(a.reviews) || 0));
    if (hot.length >= 4) return hot;
    return list;
  }, [products]);

  // 3. Best Sellers (Highest customer satisfaction & multi-category icons)
  const bestSellers = useMemo(() => {
    const list = [...products];
    return list.sort((a, b) => {
      const scoreB = (Number(b.rating) || 4.5) * 100 + (Number(b.reviews) || 10);
      const scoreA = (Number(a.rating) || 4.5) * 100 + (Number(a.reviews) || 10);
      return scoreB - scoreA;
    });
  }, [products]);

  return (
    <div className="w-full flex flex-col">

      {/* =========================================================
          SECTION 1: FEATURED PRODUCTS (WARM IVORY / SAND CANVAS)
      ========================================================= */}
      <section className="bg-[#F5F2EC] py-10 sm:py-14 border-t border-b border-[#E8E2D6]/80 overflow-hidden relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8">

            {/* Left Hero Card */}
            <div className="lg:w-[310px] xl:w-[340px] shrink-0 flex flex-col justify-center py-2 lg:py-4">
              <Reveal direction="up" delay={40}>
                <div>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500 font-sans">
                      OUR COLLECTION
                    </span>
                    <span className="w-7 h-[1.5px] bg-[#9A7B56]" />
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif leading-[1.1] text-neutral-900 tracking-tight mb-3 sm:mb-4">
                    Featured <span className="text-[#9A7B56] font-normal">Products</span>
                  </h2>

                  <p className="text-neutral-600 text-xs sm:text-[13.5px] leading-relaxed mb-6 sm:mb-7 font-sans font-normal">
                    Handpicked just for you. Explore our most loved products that combine style, quality and timeless appeal.
                  </p>

                  <div>
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#9A7B56] hover:bg-[#856543] text-white text-xs sm:text-[13px] font-semibold transition-all duration-300 shadow-sm hover:shadow-md hover:translate-x-0.5 active:scale-95 cursor-pointer"
                    >
                      <span>View All Products</span>
                      <ArrowRightIcon className="w-3.5 h-3.5 text-white" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Horizontal Carousel Container */}
            <div className="flex-1 relative min-w-0 flex items-center">
              <div
                ref={featuredCarouselRef}
                className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto py-2 px-1 snap-x snap-mandatory scroll-smooth no-scrollbar select-none w-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {featuredProducts.map((p) => (
                  <LightProductCard
                    key={`feat-${p.id}`}
                    product={p}
                    badgeText="Featured"
                    isWishlist={Boolean(wishlistMap[p.id])}
                    onWishlistToggle={handleWishlistToggle}
                  />
                ))}
              </div>

              {/* Next Circular Arrow Button */}
              {featuredCanScroll.right && (
                <button
                  type="button"
                  onClick={() => handleScroll(featuredCarouselRef, 'right')}
                  aria-label="Scroll next"
                  className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-800 shadow-[0_4px_16px_rgba(0,0,0,0.14)] border border-neutral-200/90 transition-all duration-200 hover:bg-neutral-950 hover:text-white hover:scale-105 active:scale-90 cursor-pointer"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              )}

              {/* Prev Circular Arrow Button */}
              {featuredCanScroll.left && (
                <button
                  type="button"
                  onClick={() => handleScroll(featuredCarouselRef, 'left')}
                  aria-label="Scroll previous"
                  className="hidden md:flex absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-800 shadow-[0_4px_16px_rgba(0,0,0,0.14)] border border-neutral-200/90 transition-all duration-200 hover:bg-neutral-950 hover:text-white hover:scale-105 active:scale-90 cursor-pointer"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 2: TRENDING NOW (OBSIDIAN DARK LUXURY THEME)
      ========================================================= */}
      <section className="bg-[#0E1217] py-10 sm:py-14 text-white overflow-hidden relative">
        {/* Subtle Warm Amber Glow Behind */}
        <div className="pointer-events-none absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-[#C9A96E]/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-[#B88746]/5 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8">

            {/* Left Hero Card */}
            <div className="lg:w-[310px] xl:w-[340px] shrink-0 flex flex-col justify-center py-2 lg:py-4">
              <Reveal direction="up" delay={40}>
                <div>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#C9A96E] font-sans">
                      WHAT&apos;S HOT
                    </span>
                    <span className="w-7 h-[1.5px] bg-[#C9A96E]" />
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif leading-[1.1] text-white tracking-tight mb-3 sm:mb-4">
                    Trending <span className="text-[#C9A96E] font-normal">Now</span>
                  </h2>

                  <p className="text-neutral-300 text-xs sm:text-[13.5px] leading-relaxed mb-6 sm:mb-7 font-sans font-light">
                    Stay ahead with the latest trends. These products are creating a <strong className="text-white font-semibold">buzz</strong> and selling fast!
                  </p>

                  <div>
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-600 hover:border-[#C9A96E] bg-neutral-900/90 hover:bg-neutral-800 text-white text-xs sm:text-[13px] font-semibold transition-all duration-300 shadow-sm hover:shadow-md hover:translate-x-0.5 active:scale-95 cursor-pointer"
                    >
                      <span>Shop Trending</span>
                      <ArrowRightIcon className="w-3.5 h-3.5 text-white" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Horizontal Carousel Container */}
            <div className="flex-1 relative min-w-0 flex items-center">
              <div
                ref={trendingCarouselRef}
                className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto py-2 px-1 snap-x snap-mandatory scroll-smooth no-scrollbar select-none w-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {trendingProducts.map((p) => (
                  <DarkProductCard
                    key={`trend-${p.id}`}
                    product={p}
                    badgeText="Trending"
                    isWishlist={Boolean(wishlistMap[p.id])}
                    onWishlistToggle={handleWishlistToggle}
                  />
                ))}
              </div>

              {/* Next Dark Circular Arrow Button */}
              {trendingCanScroll.right && (
                <button
                  type="button"
                  onClick={() => handleScroll(trendingCarouselRef, 'right')}
                  aria-label="Scroll next"
                  className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-neutral-800/95 text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-neutral-700 transition-all duration-200 hover:bg-white hover:text-black hover:scale-105 active:scale-90 cursor-pointer"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              )}

              {/* Prev Dark Circular Arrow Button */}
              {trendingCanScroll.left && (
                <button
                  type="button"
                  onClick={() => handleScroll(trendingCarouselRef, 'left')}
                  aria-label="Scroll previous"
                  className="hidden md:flex absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-neutral-800/95 text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-neutral-700 transition-all duration-200 hover:bg-white hover:text-black hover:scale-105 active:scale-90 cursor-pointer"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3: BEST SELLERS (WARM NEUTRAL / CREAM CANVAS)
      ========================================================= */}
      <section className="bg-[#FAF8F5] py-10 sm:py-14 border-t border-b border-[#ECE6DB]/80 overflow-hidden relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8">

            {/* Left Hero Card */}
            <div className="lg:w-[310px] xl:w-[340px] shrink-0 flex flex-col justify-center py-2 lg:py-4">
              <Reveal direction="up" delay={40}>
                <div>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500 font-sans">
                      TOP RATED
                    </span>
                    <span className="w-7 h-[1.5px] bg-[#9A7B56]" />
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif leading-[1.1] text-neutral-900 tracking-tight mb-3 sm:mb-4">
                    Best <span className="text-[#9A7B56] font-normal">Sellers</span>
                  </h2>

                  <p className="text-neutral-600 text-xs sm:text-[13.5px] leading-relaxed mb-6 sm:mb-7 font-sans font-normal">
                    Loved by thousands. These best sellers are customer favorites for a reason!
                  </p>

                  <div>
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#9A7B56] hover:bg-[#856543] text-white text-xs sm:text-[13px] font-semibold transition-all duration-300 shadow-sm hover:shadow-md hover:translate-x-0.5 active:scale-95 cursor-pointer"
                    >
                      <span>View All Best Sellers</span>
                      <ArrowRightIcon className="w-3.5 h-3.5 text-white" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Horizontal Carousel Container */}
            <div className="flex-1 relative min-w-0 flex items-center">
              <div
                ref={bestSellersCarouselRef}
                className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto py-2 px-1 snap-x snap-mandatory scroll-smooth no-scrollbar select-none w-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {bestSellers.map((p) => (
                  <LightProductCard
                    key={`best-${p.id}`}
                    product={p}
                    badgeText="Best Seller"
                    isWishlist={Boolean(wishlistMap[p.id])}
                    onWishlistToggle={handleWishlistToggle}
                  />
                ))}
              </div>

              {/* Next Circular Arrow Button */}
              {bestSellersCanScroll.right && (
                <button
                  type="button"
                  onClick={() => handleScroll(bestSellersCarouselRef, 'right')}
                  aria-label="Scroll next"
                  className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-800 shadow-[0_4px_16px_rgba(0,0,0,0.14)] border border-neutral-200/90 transition-all duration-200 hover:bg-neutral-950 hover:text-white hover:scale-105 active:scale-90 cursor-pointer"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              )}

              {/* Prev Circular Arrow Button */}
              {bestSellersCanScroll.left && (
                <button
                  type="button"
                  onClick={() => handleScroll(bestSellersCarouselRef, 'left')}
                  aria-label="Scroll previous"
                  className="hidden md:flex absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-800 shadow-[0_4px_16px_rgba(0,0,0,0.14)] border border-neutral-200/90 transition-all duration-200 hover:bg-neutral-950 hover:text-white hover:scale-105 active:scale-90 cursor-pointer"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          BOTTOM TRUST BADGES STRIP (CLEAN LUXURY MINIMALIST)
      ========================================================= */}
      <div className="w-full bg-white py-6 sm:py-8 border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200/80">

            {/* 1. Free Shipping */}
            <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-0 sm:px-4 first:pt-0 first:pl-0">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#F5F2EC] text-[#9A7B56]">
                <TruckIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-xs sm:text-[13.5px] leading-snug">
                  Free Shipping
                </h4>
                <p className="text-neutral-500 text-[10.5px] sm:text-xs mt-0.5">
                  On orders above ₹999
                </p>
              </div>
            </div>

            {/* 2. Easy Returns */}
            <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-0 sm:px-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#F5F2EC] text-[#9A7B56]">
                <RefreshIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-xs sm:text-[13.5px] leading-snug">
                  Easy Returns
                </h4>
                <p className="text-neutral-500 text-[10.5px] sm:text-xs mt-0.5">
                  Hassle-free process
                </p>
              </div>
            </div>

            {/* 3. Secure Payment */}
            <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-0 sm:px-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#F5F2EC] text-[#9A7B56]">
                <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-xs sm:text-[13.5px] leading-snug">
                  Secure Payment
                </h4>
                <p className="text-neutral-500 text-[10.5px] sm:text-xs mt-0.5">
                  100% safe &amp; secure
                </p>
              </div>
            </div>

            {/* 4. 24/7 Support */}
            <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-0 sm:px-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#F5F2EC] text-[#9A7B56]">
                <HeadphonesIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-xs sm:text-[13.5px] leading-snug">
                  24/7 Support
                </h4>
                <p className="text-neutral-500 text-[10.5px] sm:text-xs mt-0.5">
                  We&apos;re here to help
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
