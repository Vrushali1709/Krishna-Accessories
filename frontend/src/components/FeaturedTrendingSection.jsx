// src/components/FeaturedTrendingSection.jsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import { Reveal } from './useScrollReveal';
import {
  HeartIcon,
  BagIcon,
  StarIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from './Icons';

export default function FeaturedTrendingSection({ products = [], onToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const carouselRef = useRef(null);

  const [activeTab, setActiveTab] = useState('trending'); // 'trending', 'featured', 'top-rated', 'best-deals'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [wishlistMap, setWishlistMap] = useState({});
  const [addedMap, setAddedMap] = useState({});

  // Carousel scroll status
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

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

  // Auth requirement check
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

  const handleAddToCart = (e, product) => {
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

  const handleBuyNow = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  // Category filter list
  const categoryFilters = [
    'All',
    'Watches',
    'Bags & Wallets',
    'Shoes',
    'Mobiles',
    'Electronics',
    'Laptops',
    'Smart Gadgets',
    'Fashion Accessories'
  ];

  // Tab Definitions
  const tabs = [
    { id: 'trending', label: 'Trending Now', icon: '🔥' },
    { id: 'featured', label: 'Featured Picks', icon: '✦' },
    { id: 'top-rated', label: 'Top Rated', icon: '⭐' },
    { id: 'best-deals', label: 'Special Deals', icon: '🏷️' }
  ];

  // Compute products according to active tab and category
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (selectedCategory !== 'All') {
      list = list.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter & Sort by Tab
    switch (activeTab) {
      case 'trending':
        list.sort((a, b) => {
          const scoreB = (Number(b.reviews) || 0) * 2 + (Number(b.rating) || 4.5) * 10;
          const scoreA = (Number(a.reviews) || 0) * 2 + (Number(a.rating) || 4.5) * 10;
          return scoreB - scoreA;
        });
        break;

      case 'featured':
        list.sort((a, b) => {
          const isLuxuryA = ['Rolex', 'Titan', 'Apple', 'Dell', 'Hidesign', 'Nike', 'Sony'].includes(a.brand) ? 1 : 0;
          const isLuxuryB = ['Rolex', 'Titan', 'Apple', 'Dell', 'Hidesign', 'Nike', 'Sony'].includes(b.brand) ? 1 : 0;
          return isLuxuryB - isLuxuryA || (b.price || 0) - (a.price || 0);
        });
        break;

      case 'top-rated':
        list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
        break;

      case 'best-deals':
        list.sort((a, b) => {
          const discB = b.discount || (b.oldPrice && b.oldPrice > b.price ? Math.round(((b.oldPrice - b.price) / b.oldPrice) * 100) : 0);
          const discA = a.discount || (a.oldPrice && a.oldPrice > a.price ? Math.round(((a.oldPrice - a.price) / a.oldPrice) * 100) : 0);
          return discB - discA;
        });
        break;

      default:
        break;
    }

    // Return all matched products (up to 16) for rich carousel browsing
    return list.slice(0, 16);
  }, [products, activeTab, selectedCategory]);

  // Handle scroll measurement & state updates
  const updateScrollState = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;

    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(maxScroll > 10 && scrollLeft < maxScroll - 10);

    const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
    setScrollProgress(progress);
  }, []);

  // Update on filter change or products update
  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    }
    const timer = setTimeout(updateScrollState, 150);
    return () => clearTimeout(timer);
  }, [activeTab, selectedCategory, filteredProducts.length, updateScrollState]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    updateScrollState();

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, filteredProducts]);

  // Carousel navigation handlers
  const scrollPrev = () => {
    if (!carouselRef.current) return;
    const { clientWidth } = carouselRef.current;
    const scrollDistance = clientWidth >= 1024 ? clientWidth * 0.75 : clientWidth * 0.85;
    carouselRef.current.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
  };

  const scrollNext = () => {
    if (!carouselRef.current) return;
    const { clientWidth } = carouselRef.current;
    const scrollDistance = clientWidth >= 1024 ? clientWidth * 0.75 : clientWidth * 0.85;
    carouselRef.current.scrollBy({ left: scrollDistance, behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-b from-[#FAFBFD] via-[#F4F6F9] to-[#FAFBFD] py-10 sm:py-16 border-t border-b border-gray-200/80 overflow-hidden">
      
      {/* Subtle ambient luxury gold & slate glows */}
      <div className="pointer-events-none absolute -top-28 -left-28 h-96 w-96 rounded-full bg-[#C5A880]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-neutral-900/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ============================================================
            1. SECTION HEADER WITH TABS & CAROUSEL ARROWS
        ============================================================ */}
        <Reveal direction="up" delay={50}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 mb-6 sm:mb-8">
            <div>
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-widest mb-2.5 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span>Curated Selections</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-950 font-sans">
                Featured &amp; Trending Products
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 max-w-xl leading-relaxed">
                Explore our handpicked curation of best-selling luxury timepieces, leather goods, smart electronics, and footwear.
              </p>
            </div>

            {/* Right Controls: Tabs + Navigation Arrows */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              
              {/* Interactive Tab Navigation Capsule */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-200/70 backdrop-blur-md rounded-2xl border border-neutral-300/70 shadow-xs sm:flex sm:flex-wrap sm:items-center sm:gap-1.5">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 sm:px-3.5 py-2 sm:py-2 rounded-xl text-xs sm:text-[12.5px] font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                        isActive
                          ? 'bg-neutral-950 text-white shadow-md font-extrabold scale-[1.02]'
                          : 'text-neutral-700 hover:text-black hover:bg-white/80 bg-white/40 sm:bg-transparent'
                      }`}
                    >
                      <span className="text-sm shrink-0">{tab.icon}</span>
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Carousel Arrow Controls (Header) */}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-neutral-300/80">
                <button
                  type="button"
                  onClick={scrollPrev}
                  disabled={!canScrollLeft}
                  aria-label="Previous products"
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 cursor-pointer shadow-xs ${
                    canScrollLeft
                      ? 'bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-950 hover:text-white hover:border-neutral-950 hover:scale-105 active:scale-95'
                      : 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed opacity-40'
                  }`}
                  title="Scroll Left"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={scrollNext}
                  disabled={!canScrollRight}
                  aria-label="Next products"
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 cursor-pointer shadow-xs ${
                    canScrollRight
                      ? 'bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-950 hover:text-white hover:border-neutral-950 hover:scale-105 active:scale-95'
                      : 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed opacity-40'
                  }`}
                  title="Scroll Right"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </Reveal>

        {/* ============================================================
            2. CATEGORY FILTER SUB-BAR (SLICK HORIZONTAL CHIPS)
        ============================================================ */}
        <Reveal direction="up" delay={80}>
          <div className="relative mb-6 sm:mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
              {categoryFilters.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-[12.5px] font-bold rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer shadow-2xs ${
                      isActive
                        ? 'bg-neutral-950 text-white border-2 border-neutral-950 shadow-sm font-black scale-[1.02]'
                        : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400 hover:text-neutral-950 hover:bg-neutral-50/90'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* ============================================================
            3. CAROUSEL SLIDER TRACK (RESPONSIVE CARDS WITH SCROLL-SNAP)
        ============================================================ */}
        {filteredProducts.length > 0 ? (
          <div className="relative group/carousel">
            
            {/* Left Floating Arrow (Visible on hover for desktop) */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Scroll left"
                className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 h-11 w-11 items-center justify-center rounded-full bg-white/95 text-neutral-950 shadow-xl border border-neutral-200/90 hover:bg-neutral-950 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
            )}

            {/* Right Floating Arrow (Visible on hover for desktop) */}
            {canScrollRight && (
              <button
                type="button"
                onClick={scrollNext}
                aria-label="Scroll right"
                className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 h-11 w-11 items-center justify-center rounded-full bg-white/95 text-neutral-950 shadow-xl border border-neutral-200/90 hover:bg-neutral-950 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            )}

            {/* Scrollable Carousel Flex Track */}
            <div
              ref={carouselRef}
              className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar py-3 px-1 -mx-4 sm:mx-0 px-4 sm:px-0"
              style={{ scrollPaddingLeft: '16px' }}
            >
              {filteredProducts.map((product, idx) => {
                const isWish = Boolean(wishlistMap[product.id]);
                const isAdded = Boolean(addedMap[product.id]);

                const discount = product.discount || (
                  product.oldPrice && product.oldPrice > product.price
                    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                    : 0
                );

                // Visual badge determination
                let badgeText = '';
                let badgeColor = '';

                if (discount >= 20) {
                  badgeText = `${discount}% OFF`;
                  badgeColor = 'bg-rose-600 text-white border-rose-500/30';
                } else if (activeTab === 'trending' || idx === 0) {
                  badgeText = '🔥 TRENDING';
                  badgeColor = 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-400/30';
                } else if (product.rating >= 4.8) {
                  badgeText = '★ TOP RATED';
                  badgeColor = 'bg-neutral-900 text-white border-neutral-800';
                } else {
                  badgeText = '✦ LUXE PICK';
                  badgeColor = 'bg-neutral-900 text-amber-300 border-neutral-800';
                }

                return (
                  <div
                    key={`carousel-card-${activeTab}-${selectedCategory}-${product.id}`}
                    className="shrink-0 snap-start w-[80vw] xs:w-[270px] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] flex flex-col"
                  >
                    <div className="group relative flex flex-col justify-between h-full rounded-[24px] border border-gray-200/90 bg-white p-3.5 sm:p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_20px_45px_rgba(0,0,0,0.09)] hover:border-amber-400/60 hover:-translate-y-1.5 select-none">
                      
                      {/* 1. Product Image Frame with Hover Zoom & Badges */}
                      <div className="relative aspect-square w-full overflow-hidden rounded-[18px] bg-gradient-to-b from-[#F7F7F8] to-[#ECECEF] mb-3.5 flex items-center justify-center">
                        <Link
                          to={`/product/${product.id}`}
                          className="relative flex h-full w-full items-center justify-center cursor-pointer overflow-hidden"
                        >
                          <img
                            src={product.image || product.images?.[0]}
                            alt={product.name}
                            className={`h-full w-full object-cover object-center transition-transform duration-700 ease-out ${
                              product.images && product.images.length > 1
                                ? 'group-hover:opacity-0 group-hover:scale-105'
                                : 'group-hover:scale-108'
                            }`}
                            loading="lazy"
                          />
                          {product.images && product.images.length > 1 && (
                            <img
                              src={product.images[1]}
                              alt={`${product.name} alternate view`}
                              className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105 pointer-events-none"
                              loading="lazy"
                            />
                          )}
                        </Link>

                        {/* Top Badges & Actions Overlay */}
                        <div className="absolute top-2.5 sm:top-3 inset-x-2.5 sm:inset-x-3 z-10 flex items-center justify-between pointer-events-none">
                          {/* Dynamic Badge */}
                          <span className={`rounded-lg px-2 sm:px-2.5 py-0.5 sm:py-1 text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md border ${badgeColor}`}>
                            {badgeText}
                          </span>

                          {/* Wishlist Button */}
                          <button
                            type="button"
                            onClick={(e) => handleWishlistToggle(e, product)}
                            aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                            className={`pointer-events-auto flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-300 hover:scale-115 active:scale-90 cursor-pointer ${
                              isWish
                                ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-100 scale-105'
                                : 'bg-white/95 text-neutral-700 hover:text-rose-600 border border-gray-200/90 hover:bg-white'
                            }`}
                            title={isWish ? 'In Wishlist' : 'Add to Wishlist'}
                          >
                            <HeartIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors" filled={isWish} />
                          </button>
                        </div>

                        {/* Floating Brand / Category Bottom Pill */}
                        <div className="absolute bottom-2.5 left-2.5 sm:left-3 pointer-events-none">
                          <span className="rounded-full bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[8.5px] sm:text-[9.5px] font-bold text-white uppercase tracking-wider border border-white/15 shadow-xs">
                            {product.brand || product.category}
                          </span>
                        </div>
                      </div>

                      {/* 2. Product Information Content */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          {/* Category & Verified Sourcing Tag */}
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#C5A880] truncate">
                              {product.category}
                            </span>
                            <span className="text-[9.5px] sm:text-[10px] font-medium text-neutral-400">
                              Verified
                            </span>
                          </div>

                          {/* Product Title */}
                          <Link
                            to={`/product/${product.id}`}
                            className="block font-bold text-gray-950 text-[14px] sm:text-[15.5px] transition-colors duration-200 hover:text-[#9E8362] line-clamp-1 leading-snug"
                            title={product.name}
                          >
                            {product.name}
                          </Link>

                          {/* Rating Stars & Customer Review Count */}
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="flex items-center text-amber-500">
                              <StarIcon className="w-3.5 h-3.5 text-amber-400" filled={true} />
                            </div>
                            <span className="font-bold text-gray-900 text-xs tabular-nums">
                              {product.rating ? Number(product.rating).toFixed(1) : '4.9'}
                            </span>
                            <span className="text-gray-400 text-[11px] tabular-nums truncate">
                              ({product.reviews || 50}+)
                            </span>
                          </div>

                          {/* Price Architecture (Price + MRP + Save Pill) */}
                          <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 mt-2 pt-2 border-t border-gray-100">
                            <span className="text-base sm:text-xl font-black text-gray-950 tabular-nums">
                              ₹{Number(product.price).toLocaleString('en-IN')}
                            </span>

                            {product.oldPrice && product.oldPrice > product.price && (
                              <span className="text-xs sm:text-sm text-neutral-400 line-through tabular-nums font-normal">
                                ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                              </span>
                            )}

                            {discount > 0 && (
                              <span className="ml-auto text-[9.5px] sm:text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shadow-2xs">
                                -{discount}%
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 3. Action Buttons (Add to Bag & Instant Buy) */}
                        <div className="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center gap-2">
                          {/* Primary Add to Bag Button */}
                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(e, product)}
                            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                              isAdded
                                ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700 scale-[1.02]'
                                : 'bg-neutral-950 text-white hover:bg-black hover:shadow-md'
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
                                <span className="truncate">Add to Bag</span>
                              </>
                            )}
                          </button>

                          {/* Secondary Instant Buy Button */}
                          <button
                            type="button"
                            onClick={(e) => handleBuyNow(e, product)}
                            className="px-3 py-2.5 rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-wider border border-gray-300 bg-white text-neutral-800 hover:border-neutral-950 hover:bg-neutral-50 transition-all duration-300 active:scale-95 cursor-pointer shadow-2xs shrink-0"
                            title="Instant Checkout"
                          >
                            Buy
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* ============================================================
                4. CAROUSEL BOTTOM PROGRESS BAR & PAGINATION CONTROLS
            ============================================================ */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-200/70">
              
              {/* Product counter badge */}
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
                <span>Showing {filteredProducts.length} curated products</span>
                <span className="h-1 w-1 rounded-full bg-neutral-300" />
                <span className="text-amber-700 font-bold uppercase tracking-wider text-[11px]">
                  {selectedCategory === 'All' ? activeTab.replace('-', ' ') : selectedCategory}
                </span>
              </div>

              {/* Progress track & Mobile Controls */}
              <div className="flex items-center gap-4">
                {/* Visual Progress Bar */}
                <div className="w-28 sm:w-36 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-950 rounded-full transition-all duration-200"
                    style={{ width: `${Math.max(20, scrollProgress)}%` }}
                  />
                </div>

                {/* Mobile Left / Right Buttons */}
                <div className="flex sm:hidden items-center gap-1.5">
                  <button
                    type="button"
                    onClick={scrollPrev}
                    disabled={!canScrollLeft}
                    className={`h-8 w-8 rounded-full border flex items-center justify-center ${
                      canScrollLeft ? 'bg-white text-black border-neutral-300' : 'bg-neutral-100 text-neutral-400 border-neutral-200 opacity-40'
                    }`}
                  >
                    <ChevronLeftIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={scrollNext}
                    disabled={!canScrollRight}
                    className={`h-8 w-8 rounded-full border flex items-center justify-center ${
                      canScrollRight ? 'bg-white text-black border-neutral-300' : 'bg-neutral-100 text-neutral-400 border-neutral-200 opacity-40'
                    }`}
                  >
                    <ChevronRightIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* View Full Collection link */}
                <Link
                  to={selectedCategory === 'All' ? '/shop' : `/shop?category=${encodeURIComponent(selectedCategory)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:text-amber-700 transition-colors uppercase tracking-wider"
                >
                  <span>View All</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-16 rounded-3xl bg-white border border-gray-200/80 shadow-xs">
            <p className="text-sm font-semibold text-neutral-700">No products found for this category and tab.</p>
            <button
              type="button"
              onClick={() => { setSelectedCategory('All'); setActiveTab('trending'); }}
              className="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-5 py-2 text-xs font-bold text-white hover:bg-black cursor-pointer shadow-sm transition"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
