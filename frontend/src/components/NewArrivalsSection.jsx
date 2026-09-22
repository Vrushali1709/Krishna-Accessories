// src/components/NewArrivalsSection.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import { Reveal } from './useScrollReveal';
import {
  HeartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BagIcon,
  ArrowRightIcon
} from './Icons';

export default function NewArrivalsSection({ products = [], onToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const carouselRef = useRef(null);

  const [selectedTab, setSelectedTab] = useState('All');
  const [wishlistMap, setWishlistMap] = useState({});
  const [addedMap, setAddedMap] = useState({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  // Filter tabs
  const tabs = [
    { id: 'All', label: 'All Novelties' },
    { id: 'Watches', label: 'Timepieces' },
    { id: 'Bags & Wallets', label: 'Leather Goods' },
    { id: 'Shoes', label: 'Footwear' },
    { id: 'Mobiles', label: 'Flagship Tech' },
    { id: 'Electronics', label: 'Audio & Gear' }
  ];

  const filteredItems = products.filter((p) => {
    if (selectedTab === 'All') return true;
    return p.category?.toLowerCase() === selectedTab.toLowerCase();
  });

  // Scroll check for horizontal carousel
  const checkScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
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
  }, [checkScroll, filteredItems, selectedTab]);

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cardWidth = container.firstElementChild?.clientWidth || 260;
    const scrollAmount = (cardWidth + 16) * 2;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Auth requirement check
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

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    if (onToast) onToast(`✓ Added "${product.name}" to your bag`);

    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
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

  return (
    <section className="bg-white py-12 sm:py-16 border-t border-b border-neutral-200/80">
      <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">

        {/* =======================================================
            1. REFINED LUXURY SECTION HEADER
        ======================================================= */}
        <Reveal direction="up" delay={40}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500 font-sans">
                  SEASON 2026 / NOVELTIES
                </span>
                <span className="w-7 h-[1.5px] bg-[#9A7B56]" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif leading-[1.1] text-neutral-900 tracking-tight">
                New <span className="text-[#9A7B56] font-normal">Arrivals</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-xl font-sans leading-relaxed">
                Fresh seasonal releases, novelties, and smart devices straight to catalog.
              </p>
            </div>

            {/* Category Filter Tabs & Carousel Navigation Buttons */}
            <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0">
                {tabs.map((tab) => {
                  const isActive = selectedTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedTab(tab.id)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-[#9A7B56] text-white shadow-xs'
                          : 'bg-[#F5F2EC] text-neutral-700 hover:text-black hover:bg-[#ECE6DB]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Next & Previous Carousel Arrows */}
              <div className="hidden sm:flex items-center gap-2 shrink-0 pl-3 border-l border-neutral-200">
                <button
                  type="button"
                  onClick={() => scrollCarousel('left')}
                  disabled={!canScrollLeft}
                  aria-label="Previous items"
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
                    canScrollLeft
                      ? 'border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 cursor-pointer shadow-xs active:scale-95'
                      : 'border border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollCarousel('right')}
                  disabled={!canScrollRight}
                  aria-label="Next items"
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
                    canScrollRight
                      ? 'border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 cursor-pointer shadow-xs active:scale-95'
                      : 'border border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* =======================================================
            2. REFINED LUXURY CAROUSEL
        ======================================================= */}
        {filteredItems.length > 0 ? (
          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto py-2 snap-x snap-mandatory scroll-smooth no-scrollbar select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredItems.map((product) => {
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
                  className="group flex-shrink-0 w-[230px] sm:w-[255px] md:w-[270px] snap-start flex flex-col justify-between rounded-2xl bg-white p-3 sm:p-3.5 border border-neutral-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] hover:border-neutral-300 hover:-translate-y-1.5"
                >
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
                          alt={`${product.name} alternate view`}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-105 pointer-events-none"
                        />
                      )}
                    </Link>

                    {/* Top Badges & Actions */}
                    <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
                      <span className="rounded-md bg-[#B6966C] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white shadow-xs">
                        New Arrival
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
                          {product.rating ? Number(product.rating).toFixed(1) : '4.8'} ({product.reviews || 88})
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
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl bg-[#FAF8F5] border border-neutral-200/80">
            <p className="text-xs font-semibold text-neutral-600">No novelties found in this category.</p>
            <Link
              to="/new-arrivals"
              className="mt-2 inline-block text-xs font-bold text-[#9A7B56] hover:underline cursor-pointer"
            >
              View all novelties
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
