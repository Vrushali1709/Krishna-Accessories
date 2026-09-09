// src/components/NewArrivalsSection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import {
  HeartIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from './Icons';

const COLOR_NAME_MAP = {
  gold: '#D4AF37',
  silver: '#C0C0C0',
  black: '#111827',
  'midnight black': '#0B0F19',
  'deep black': '#18181B',
  'carbon black': '#1E293B',
  'royal blue': '#1E40AF',
  blue: '#2563EB',
  navy: '#1E3A8A',
  red: '#DC2626',
  crimson: '#B91C1C',
  white: '#F8FAFC',
  'pure white': '#FFFFFF',
  green: '#15803D',
  brown: '#78350F',
  tan: '#D97706',
  grey: '#6B7280',
  gray: '#9CA3AF',
  yellow: '#EAB308',
  mustard: '#F59E0B',
  cyan: '#06B6D4'
};

function getColorDots(product) {
  if (Array.isArray(product.colors) && product.colors.length > 0) {
    const dots = product.colors.slice(0, 4).map((c) => {
      const lower = c.toLowerCase();
      for (const [name, hex] of Object.entries(COLOR_NAME_MAP)) {
        if (lower.includes(name)) return hex;
      }
      return '#6B7280';
    });
    const defaults = ['#111827', '#1E40AF', '#06B6D4', '#F59E0B'];
    while (dots.length < 4) {
      dots.push(defaults[dots.length]);
    }
    return dots;
  }
  return ['#111827', '#1E40AF', '#06B6D4', '#F59E0B'];
}

export default function NewArrivalsSection({ products = [], onToast }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
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

  const totalItems = products.length;
  const maxPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const currentItems = products.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, maxPages - 1));
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
    <section className="bg-[#F8F9FA] py-12 sm:py-16 border-b border-gray-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =======================================================
            1. SECTION HEADER (MATCHING USER REFERENCE DESIGN)
        ======================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 sm:mb-9">
          <div>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-gray-900 block mb-1">
              LATEST DROP
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-gray-950 font-sans uppercase">
              NEW ARRIVALS
            </h2>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs sm:text-sm font-semibold text-gray-800">
              {totalItems > 0 ? `${totalItems}+ Fresh Style Picks` : '50+ Fresh Style Picks'}
            </span>

            <div className="flex items-center gap-1.5 ml-1">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentPage === 0}
                aria-label="Previous arrivals"
                className={`flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center rounded-full transition-all duration-200 shadow-2xs ${
                  currentPage === 0
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed opacity-60'
                    : 'bg-[#111827] text-white hover:bg-black hover:scale-105 active:scale-95 cursor-pointer'
                }`}
              >
                <ChevronLeftIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentPage >= maxPages - 1}
                aria-label="Next arrivals"
                className={`flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center rounded-full transition-all duration-200 shadow-2xs ${
                  currentPage >= maxPages - 1
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed opacity-60'
                    : 'bg-[#111827] text-white hover:bg-black hover:scale-105 active:scale-95 cursor-pointer'
                }`}
              >
                <ChevronRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* =======================================================
            2. PRODUCT CARDS GRID (3 COLUMNS x 2 ROWS)
        ======================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
          {currentItems.map((product, idx) => {
            const isAdded = Boolean(addedMap[product.id]);
            const isWish = Boolean(wishlistMap[product.id]);

            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between rounded-[26px] sm:rounded-[30px] bg-white p-4 sm:p-5 border border-gray-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-gray-300 transition-all duration-300 hover:-translate-y-1"
              >
                {/* 2A. TOP IMAGE FRAME */}
                <div className="relative aspect-[4/3.3] sm:aspect-[4/3.2] w-full overflow-hidden rounded-[18px] sm:rounded-[20px] bg-[#E8EAEF] mb-4 flex items-center justify-center">
                  <Link
                    to={`/product/${product.id}`}
                    className="block h-full w-full"
                  >
                    <img
                      src={product.image || product.images?.[0]}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-106"
                    />
                  </Link>

                  {/* Inset Top-Left Badge ('New' / 'FRESH') */}
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="inline-flex items-center rounded-md bg-white/95 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-semibold text-gray-800 shadow-2xs">
                      {idx % 4 === 1 ? 'FRESH' : 'New'}
                    </span>
                  </div>

                  {/* Inset Top-Right Wishlist Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => handleWishlistToggle(e, product)}
                    aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                    className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-xs shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
                      isWish
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-white/90 text-gray-800 hover:text-rose-600 hover:bg-white'
                    }`}
                  >
                    <HeartIcon className="w-4 h-4 transition-colors" filled={isWish} />
                  </button>
                </div>

                {/* 2B. MIDDLE STRIP: Price, Color Swatches, Star Rating */}
                <div className="flex items-center justify-between gap-2 px-1 mb-2.5">
                  {/* Price */}
                  <span className="text-[14.5px] sm:text-[15.5px] font-extrabold text-gray-950 tabular-nums">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>

                  {/* Color Palette Dots */}
                  <div className="flex items-center gap-1.5">
                    {getColorDots(product).map((colorHex, cIdx) => (
                      <span
                        key={cIdx}
                        className="h-2.5 w-2.5 rounded-full border border-black/15 shadow-2xs inline-block"
                        style={{ backgroundColor: colorHex }}
                        title={`Color swatch ${cIdx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-[11.5px] sm:text-xs font-semibold text-gray-700">
                    <span className="text-amber-500 text-xs">★</span>
                    <span>{product.rating || '4.1'}</span>
                    <span className="text-gray-400 font-normal">({product.reviews || '234'})</span>
                  </div>
                </div>

                {/* 2C. PRODUCT DETAILS: Title & Description */}
                <div className="px-1 mb-4.5 flex-1">
                  <Link
                    to={`/product/${product.id}`}
                    className="block text-[14px] sm:text-[15px] font-bold text-gray-950 hover:text-black line-clamp-1 leading-snug mb-1"
                    title={product.name}
                  >
                    {product.name}
                  </Link>

                  <p className="text-[11.5px] sm:text-xs text-gray-500 line-clamp-2 leading-relaxed font-normal">
                    {product.description ||
                      'Relaxed tailored piece designed for a polished, comfortable everyday fit.'}
                  </p>
                </div>

                {/* 2D. ACTION BUTTONS: 'view details' & 'Quick Buy' */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <Link
                    to={`/product/${product.id}`}
                    className="w-full text-center py-2 px-3 rounded-full bg-[#EFECE6] hover:bg-[#E2DDD5] text-gray-800 text-[11.5px] sm:text-xs font-medium transition-colors duration-150 active:scale-98"
                  >
                    view details
                  </Link>

                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(e, product)}
                    className={`w-full text-center py-2 px-3 rounded-full text-[11.5px] sm:text-xs font-medium transition-colors duration-150 active:scale-98 cursor-pointer ${
                      isAdded
                        ? 'bg-black text-white'
                        : 'bg-[#EFECE6] hover:bg-black hover:text-white text-gray-800'
                    }`}
                  >
                    {isAdded ? '✓ Added' : 'Quick Buy'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
