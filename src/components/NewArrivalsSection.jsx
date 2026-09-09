// src/components/NewArrivalsSection.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import {
  HeartIcon,
  ArrowRightIcon
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

function getMinimalColorDots(product) {
  if (Array.isArray(product?.colors) && product.colors.length > 0) {
    const dots = product.colors.slice(0, 3).map((c) => {
      const lower = c.toLowerCase();
      for (const [name, hex] of Object.entries(COLOR_MAP)) {
        if (lower.includes(name)) return hex;
      }
      return '#9CA3AF';
    });
    return dots;
  }
  return null;
}

export default function NewArrivalsSection({ products = [], onToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const carouselRef = useRef(null);

  const [selectedTab, setSelectedTab] = useState('All');
  const [wishlistMap, setWishlistMap] = useState({});
  const [addedMap, setAddedMap] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

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
    { id: 'All', label: 'All Items' },
    { id: 'Watches', label: 'Watches' },
    { id: 'Bags & Wallets', label: 'Bags & Wallets' },
    { id: 'Shoes', label: 'Shoes' },
    { id: 'Mobiles', label: 'Mobiles' },
    { id: 'Electronics', label: 'Audio & Tech' },
    { id: 'Fashion Accessories', label: 'Accessories' }
  ];

  const filteredItems = products.filter((p) => {
    if (selectedTab === 'All') return true;
    return p.category?.toLowerCase() === selectedTab.toLowerCase();
  });

  // Mouse drag support for horizontal scrolling
  const handleMouseDown = (e) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftPos(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) setHasMoved(true);
    carouselRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
    <section className="bg-white py-10 sm:py-14 border-b border-gray-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =======================================================
            1. CLEAN & MINIMAL EDITORIAL HEADER
        ======================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-amber-700">
                SEASON 2026 • JUST ARRIVED
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
              New Arrivals
            </h2>
          </div>

          {/* Right Header: ONLY View All button (No Arrows) */}
          <div className="flex items-center self-start sm:self-auto">
            <Link
              to="/new-arrivals"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-800 hover:text-black hover:underline group shrink-0"
            >
              <span>View All</span>
              <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Minimal Category Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-6 sm:mb-7 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTab(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gray-950 text-white shadow-xs scale-[1.02]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* =======================================================
            2. MINIMALIST, CLEAN & BALANCED CAROUSEL CARDS
        ======================================================= */}
        {filteredItems.length > 0 ? (
          <div
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex gap-3.5 sm:gap-4.5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredItems.map((product) => {
              const isAdded = Boolean(addedMap[product.id]);
              const isWish = Boolean(wishlistMap[product.id]);
              const colorDots = getMinimalColorDots(product);
              const discount = product.discount || (
                product.oldPrice && product.oldPrice > product.price
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                  : 0
              );

              return (
                <div
                  key={product.id}
                  className="group flex-shrink-0 w-[190px] sm:w-[215px] md:w-[230px] lg:w-[245px] snap-start flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-2.5 sm:p-3 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:border-gray-300 hover:-translate-y-1"
                >
                  {/* Clean Image Container */}
                  <div className="relative aspect-[4/4.6] w-full overflow-hidden rounded-xl bg-[#F6F7F9]">
                    <Link
                      to={`/product/${product.id}`}
                      onClick={(e) => {
                        if (hasMoved) e.preventDefault();
                      }}
                      className="block h-full w-full"
                    >
                      <img
                        src={product.image || product.images?.[0]}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-106 pointer-events-none"
                      />
                    </Link>

                    {/* Top Left Mini Badge */}
                    <div className="absolute top-2 left-2 z-10 pointer-events-none flex items-center gap-1">
                      <span className="rounded-full bg-white/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-900 border border-black/5 shadow-2xs">
                        NEW
                      </span>
                      {discount > 0 && (
                        <span className="rounded-full bg-neutral-900/90 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-bold text-white shadow-2xs">
                          {discount}%
                        </span>
                      )}
                    </div>

                    {/* Top Right Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => handleWishlistToggle(e, product)}
                      aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                      className={`absolute top-2 right-2 z-10 flex h-7.5 w-7.5 items-center justify-center rounded-full backdrop-blur-md shadow-2xs transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
                        isWish
                          ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-100'
                          : 'bg-white/90 text-gray-700 hover:text-rose-600 hover:bg-white border border-gray-200/70'
                      }`}
                    >
                      <HeartIcon className="w-3.5 h-3.5 transition-colors" filled={isWish} />
                    </button>

                    {/* Desktop Hover Quick Add Pill */}
                    <div className="hidden sm:flex absolute inset-x-2 bottom-2 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-semibold backdrop-blur-md shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-950/90 text-white hover:bg-black'
                        }`}
                      >
                        <span>{isAdded ? '✓ Added' : '+ Add to Bag'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="pt-2.5 px-0.5 flex flex-col justify-between flex-1">
                    <div>
                      {/* Brand & Category or Color Swatches */}
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 truncate">
                          {product.brand || 'Original'}
                        </span>

                        {colorDots && colorDots.length > 0 ? (
                          <div className="flex items-center gap-1 shrink-0">
                            {colorDots.map((hex, dIdx) => (
                              <span
                                key={dIdx}
                                className="h-1.5 w-1.5 rounded-full border border-black/10 inline-block"
                                style={{ backgroundColor: hex }}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="text-[9.5px] font-medium text-gray-400 truncate">
                            {product.category}
                          </span>
                        )}
                      </div>

                      {/* Product Name */}
                      <Link
                        to={`/product/${product.id}`}
                        onClick={(e) => {
                          if (hasMoved) e.preventDefault();
                        }}
                        className="block text-[13px] sm:text-[13.5px] font-semibold text-gray-900 transition-colors duration-150 hover:text-black line-clamp-1 leading-snug"
                        title={product.name}
                      >
                        {product.name}
                      </Link>
                    </div>

                    {/* Price & Savings */}
                    <div className="flex items-baseline justify-between gap-1.5 mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[14.5px] sm:text-[15px] font-bold text-gray-950 tabular-nums">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>
                        {product.oldPrice && product.oldPrice > product.price && (
                          <span className="text-[11px] text-gray-400 line-through tabular-nums">
                            ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {discount > 0 && (
                        <span className="text-[9.5px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                          {discount}% off
                        </span>
                      )}
                    </div>

                    {/* Mobile Quick Add Button */}
                    <div className="mt-2 pt-1 sm:hidden">
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`w-full py-1.5 rounded-lg text-[11px] font-semibold transition-all active:scale-95 ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {isAdded ? '✓ Added' : '+ Add to Bag'}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl bg-gray-50 border border-gray-200/80">
            <p className="text-xs font-medium text-gray-600">No new arrivals found in this category.</p>
            <Link
              to="/new-arrivals"
              className="mt-2 inline-block text-xs font-semibold text-gray-950 underline cursor-pointer"
            >
              View all new arrivals
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
