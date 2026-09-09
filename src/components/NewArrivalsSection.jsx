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
  StarIcon
} from './Icons';

export default function NewArrivalsSection({ products = [], onToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const carouselRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

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

  // Login check
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

  const categories = [
    'All',
    'Watches',
    'Bags & Wallets',
    'Shoes',
    'Electronics',
    'Mobiles',
    'Fashion Accessories'
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <section className="bg-white border-b border-gray-200/80 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-px w-6 bg-[#C5A880]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A68248]">
                2026 Season Release
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
              New Arrivals
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-lg">
              Fresh additions crafted with distinction — explore certified Swiss timepieces, handcrafted leather, and flagship tech.
            </p>
          </div>

          {/* Navigation and View All */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <Link
              to="/shop?sort=newest"
              className="text-xs sm:text-sm font-semibold text-gray-800 hover:text-black hover:underline flex items-center gap-1 shrink-0 mr-1"
            >
              <span>View All New Arrivals</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => scrollCarousel('left')}
              disabled={!canScrollLeft}
              aria-label="Previous arrivals"
              className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition-all duration-200 shadow-2xs ${canScrollLeft
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
              aria-label="Next arrivals"
              className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition-all duration-200 shadow-2xs ${canScrollRight
                ? 'border-gray-300 bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 active:scale-95 cursor-pointer'
                : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed opacity-50'
                }`}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 sm:mb-8 no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = cat === 'All'
              ? products.length
              : products.filter((p) => p.category?.toLowerCase() === cat.toLowerCase()).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${isActive
                  ? 'bg-gray-950 text-white shadow-sm scale-102'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black'
                  }`}
              >
                <span>{cat === 'All' ? 'All Novelties' : cat}</span>
                <span className={`ml-1.5 text-[10px] ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Horizontal Card Carousel */}
        {filteredProducts.length > 0 ? (
          <div
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex gap-3.5 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredProducts.map((product) => {
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
                  className="group relative flex-shrink-0 w-[210px] sm:w-[245px] md:w-[260px] rounded-2xl sm:rounded-3xl border border-gray-200/80 bg-white p-2.5 sm:p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:border-gray-300 hover:-translate-y-1 snap-start flex flex-col justify-between"
                >
                  {/* Image Frame */}
                  <div className="relative aspect-[4/4.7] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#F6F7F9]">
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

                    {/* Inset Badges */}
                    <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-1.5 flex-wrap max-w-[75%]">
                        <span className="rounded-full bg-gray-950/90 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
                          New
                        </span>

                        {discount > 0 && (
                          <span className="rounded-full bg-emerald-700/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
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

                      {/* Wishlist Heart */}
                      <button
                        type="button"
                        onClick={(e) => handleWishlistToggle(e, product)}
                        aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                        className={`pointer-events-auto flex h-7.5 w-7.5 items-center justify-center rounded-full shadow-xs backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${isWish
                          ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-100'
                          : 'bg-white/90 text-gray-700 hover:text-rose-600 border border-gray-200/70 hover:bg-white'
                          }`}
                      >
                        <HeartIcon className="w-3.5 h-3.5 transition-colors" filled={isWish} />
                      </button>
                    </div>

                    {/* Desktop Quick-Action Slide-Up Bar */}
                    <div className="hidden sm:flex absolute inset-x-2.5 bottom-2.5 z-10 gap-1.5 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold backdrop-blur-md border shadow-md transition-all duration-150 active:scale-95 cursor-pointer truncate ${isAdded
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white/95 text-gray-900 border-white/80 hover:bg-white hover:text-black'
                          }`}
                      >
                        <span>{isAdded ? '✓ Added' : '+ Add to Bag'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(e, product)}
                        className="rounded-xl bg-gray-950/95 backdrop-blur-md px-3 py-2 text-xs font-semibold text-white transition-all duration-150 hover:bg-black active:scale-95 shadow-md cursor-pointer shrink-0"
                      >
                        Buy
                      </button>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="pt-3 px-1 pb-0.5 flex flex-1 flex-col justify-between">
                    <div>
                      {/* Brand & Star Rating */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-gray-400 truncate">
                          {product.brand || 'Original'}
                        </span>

                        <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-700 shrink-0">
                          <span className="text-amber-500 text-xs">★</span>
                          <span>{product.rating || '4.8'}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <Link
                        to={`/product/${product.id}`}
                        onClick={handleCardClick}
                        className="block text-[13.5px] sm:text-[14.5px] font-semibold text-gray-900 transition-colors duration-150 hover:text-black line-clamp-1 leading-snug"
                        title={product.name}
                      >
                        {product.name}
                      </Link>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-[15px] sm:text-base font-bold text-gray-950 tabular-nums">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>

                        {product.oldPrice && product.oldPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through tabular-nums">
                            ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                          </span>
                        )}

                        {discount > 0 && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded ml-auto">
                            {discount}% Off
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Mobile Quick Action Buttons */}
                    <div className="grid grid-cols-2 gap-1.5 pt-2.5 mt-2 border-t border-gray-100 sm:hidden">
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`w-full rounded-lg py-1.5 text-[11px] font-semibold transition-all active:scale-95 truncate ${isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {isAdded ? '✓ Added' : 'Add to Bag'}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(e, product)}
                        className="w-full rounded-lg bg-gray-950 py-1.5 text-[11px] font-semibold text-white transition-all active:scale-95 truncate"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl bg-gray-50 border border-gray-200/80">
            <p className="text-sm font-semibold text-gray-700">No new arrivals found in this category.</p>
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="mt-3 text-xs font-bold text-black underline cursor-pointer"
            >
              View all novelties
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
