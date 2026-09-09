// src/components/NewArrivalsSection.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import {
  HeartIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from './Icons';

const COLOR_MAP = {
  gold: '#D4AF37',
  silver: '#C0C0C0',
  black: '#171717',
  'midnight black': '#0F172A',
  'deep black': '#18181B',
  'royal blue': '#1D4ED8',
  blue: '#3B82F6',
  navy: '#1E3A8A',
  red: '#DC2626',
  white: '#F8FAFC',
  'pure white': '#FFFFFF',
  green: '#15803D',
  brown: '#78350F',
  tan: '#D97706',
  grey: '#6B7280',
  gray: '#9CA3AF'
};

const CARD_STYLES = [
  {
    canvas: 'bg-[#F1EEE8] border-[#E5DED2]',
    image: 'rounded-[24px] rounded-br-[52px]',
    number: 'text-[#B9AA94]',
    accent: 'bg-[#25231F]'
  },
  {
    canvas: 'bg-[#E9F0F2] border-[#D5E2E5]',
    image: 'rounded-[24px] rounded-bl-[52px]',
    number: 'text-[#9AB3BA]',
    accent: 'bg-[#16434D]'
  },
  {
    canvas: 'bg-[#202124] border-[#34363A]',
    image: 'rounded-[24px] rounded-tl-[52px]',
    number: 'text-[#66686C]',
    accent: 'bg-[#D4AF37]'
  }
];

function getMinimalColorDots(product) {
  if (Array.isArray(product.colors) && product.colors.length > 0) {
    const dots = product.colors.slice(0, 3).map((c) => {
      const lower = c.toLowerCase();
      for (const [name, hex] of Object.entries(COLOR_MAP)) {
        if (lower.includes(name)) return hex;
      }
      return '#737373';
    });
    const defaults = ['#171717', '#3B82F6', '#D4AF37'];
    while (dots.length < 3) {
      dots.push(defaults[dots.length]);
    }
    return dots;
  }
  return ['#171717', '#3B82F6', '#D4AF37'];
}

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
    const cardWidth = container.firstElementChild?.clientWidth || 280;
    const scrollAmount = (cardWidth + 24) * 2;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

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

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireLogin('bag')) return;

    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    if (onToast) onToast(`✓ Added "${product.name}" to your bag`);

    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1400);
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
    <section className="bg-white py-14 sm:py-20 border-b border-neutral-200/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =======================================================
            1. MINIMAL EDITORIAL SECTION HEADER
        ======================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
              <span className="text-[10.5px] font-mono font-medium uppercase tracking-[0.25em] text-neutral-500">
                SEASON 2026 / NOVELTIES
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-neutral-950 font-sans">
              The <span className="font-semibold">New Arrivals</span>
            </h2>
          </div>

          {/* Minimal Inline Category Text Tabs & Arrows */}
          <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto">
            {/* Minimal Category Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
              {tabs.map((tab) => {
                const isActive = selectedTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedTab(tab.id)}
                    className={`px-3 py-1.5 text-xs font-medium tracking-wide rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${isActive
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100'
                      }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Minimalist Carousel Arrows */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0 pl-2 border-l border-neutral-200">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                disabled={!canScrollLeft}
                aria-label="Previous items"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${canScrollLeft
                  ? 'border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 cursor-pointer active:scale-95'
                  : 'border border-neutral-200 bg-neutral-50 text-neutral-300 cursor-not-allowed'
                  }`}
              >
                <ChevronLeftIcon className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                disabled={!canScrollRight}
                aria-label="Next items"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${canScrollRight
                  ? 'border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 cursor-pointer active:scale-95'
                  : 'border border-neutral-200 bg-neutral-50 text-neutral-300 cursor-not-allowed'
                  }`}
              >
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* =======================================================
            2. ULTRA-MINIMAL CARDS CAROUSEL / GRID
        ======================================================= */}
        {filteredItems.length > 0 ? (
          <div
            ref={carouselRef}
            className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredItems.map((product, idx) => {
              const isAdded = Boolean(addedMap[product.id]);
              const isWish = Boolean(wishlistMap[product.id]);
              const colorDots = getMinimalColorDots(product);
              const cardStyle = CARD_STYLES[idx % CARD_STYLES.length];
              const isDarkCard = idx % CARD_STYLES.length === 2;

              return (
                <div
                  key={product.id}
                  className={`group flex-shrink-0 w-[240px] sm:w-[270px] md:w-[290px] lg:w-[305px] snap-start flex flex-col justify-between rounded-[28px] border p-2.5 sm:p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(15,23,42,0.12)] ${cardStyle.canvas}`}
                >
                  <div className={`relative aspect-[3/3.8] w-full overflow-hidden ${cardStyle.image} bg-[#F2F3F5] mb-3`}>
                    <Link
                      to={`/product/${product.id}`}
                      className="block h-full w-full"
                    >
                      <img
                        src={product.image || product.images?.[0]}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </Link>

                    <div className="absolute inset-x-3 top-3 flex items-start justify-between pointer-events-none">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/70 text-[11px] font-mono font-semibold backdrop-blur-md ${cardStyle.number}`}>
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <span className="rounded-full bg-white/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-neutral-700 backdrop-blur-md">
                        Just in
                      </span>
                    </div>

                    {/* Minimal Top-Right Wishlist Pill */}
                    <button
                      type="button"
                      onClick={(e) => handleWishlistToggle(e, product)}
                      aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                      className={`absolute top-[58px] right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md shadow-2xs transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${isWish
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-white/80 text-neutral-800 hover:text-rose-600 hover:bg-white border border-white/40'
                        }`}
                    >
                      <HeartIcon className="w-3.5 h-3.5 transition-colors" filled={isWish} />
                    </button>

                    {/* Floating Frosted Quick Add Bar (Desktop Hover) */}
                    <div className="hidden sm:flex absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`w-full py-2.5 px-4 rounded-full text-xs font-medium tracking-wide backdrop-blur-md shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 ${isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-950/90 text-white hover:bg-neutral-950'
                          }`}
                      >
                        <span>{isAdded ? '✓ Added to Bag' : '+ Quick Add'}</span>
                        <span className="text-neutral-400 text-[11px] font-normal">•</span>
                        <span className="text-[11px] font-semibold text-neutral-200">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className={`px-1 flex flex-col justify-between flex-1 ${isDarkCard ? 'text-white' : ''}`}>
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] truncate ${isDarkCard ? 'text-white/50' : 'text-neutral-500'}`}>
                          {product.brand || 'ESSENTIAL'}
                        </span>

                        <div className="flex items-center gap-1">
                          {colorDots.map((hex, dIdx) => (
                            <span
                              key={dIdx}
                              className="h-2 w-2 rounded-full border border-black/10 inline-block"
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Product Title */}
                      <Link
                        to={`/product/${product.id}`}
                        className={`block text-[14.5px] font-semibold transition-colors line-clamp-1 leading-snug mb-1 ${isDarkCard ? 'text-white hover:text-amber-200' : 'text-neutral-950 hover:text-neutral-600'}`}
                        title={product.name}
                      >
                        {product.name}
                      </Link>
                    </div>

                    {/* Price & Savings */}
                    <div className={`flex items-end justify-between gap-2 mt-2 pt-2 border-t ${isDarkCard ? 'border-white/10' : 'border-black/10'}`}>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-[15px] font-bold tabular-nums ${isDarkCard ? 'text-white' : 'text-neutral-950'}`}>
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>
                        {product.oldPrice && product.oldPrice > product.price && (
                          <span className={`text-xs line-through tabular-nums ${isDarkCard ? 'text-white/40' : 'text-neutral-400'}`}>
                            ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <span className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-wide ${isDarkCard ? 'bg-white/10 text-white/60' : 'bg-black/5 text-neutral-500'}`}>
                        {product.category}
                      </span>
                    </div>

                    {/* Mobile Quick Add Button */}
                    <div className="mt-2.5 pt-2 border-t border-neutral-100 sm:hidden">
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`w-full py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${isAdded
                          ? 'bg-emerald-600 text-white'
                          : `${cardStyle.accent} text-white`
                          }`}
                      >
                        {isAdded ? '✓ Added to Bag' : '+ Quick Add to Bag'}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl bg-neutral-50 border border-neutral-200/80">
            <p className="text-xs font-medium text-neutral-600">No novelties found in this category.</p>
            <Link
              to="/new-arrivals"
              className="mt-2 inline-block text-xs font-semibold text-neutral-950 underline cursor-pointer"
            >
              View all novelties
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
