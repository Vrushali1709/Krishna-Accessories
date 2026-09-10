// src/components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import { HeartIcon } from './Icons';

export default function ProductCard({ product, onAddToCart, onBuyNow, viewMode = 'grid' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [justAdded, setJustAdded] = useState(false);
  const [inWish, setInWish] = useState(() => isInWishlist(product.id));

  useEffect(() => {
    const handleWishlistUpdate = () => {
      setInWish(isInWishlist(product.id));
    };
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, [product.id]);

  const discount = product.discount || (
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0
  );

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

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireLogin('bag')) return;
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleBuyNowClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireLogin('buy')) return;
    if (onBuyNow) {
      onBuyNow(product);
    } else {
      addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
      navigate('/checkout');
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireLogin('wishlist')) return;
    const active = toggleWishlist(product);
    setInWish(active);
  };

  // ================= LIST VIEW LAYOUT =================
  if (viewMode === 'list') {
    return (
      <div className="group relative flex flex-col sm:flex-row items-stretch rounded-2xl sm:rounded-3xl border border-gray-200/80 bg-white p-3 sm:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:border-gray-300 gap-3.5 sm:gap-5">
        
        {/* Thumbnail Frame */}
        <div className="relative aspect-[4/3.8] sm:w-56 sm:h-52 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl bg-[#F6F7F9]">
          <Link to={`/product/${product.id}`} className="block h-full w-full">
            <img
              src={product.image || product.images?.[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-106"
              loading="lazy"
            />
          </Link>

          {/* Floating Badges */}
          <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
            {discount > 0 ? (
              <span className="rounded-full bg-gray-950/90 backdrop-blur-md px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white shadow-xs">
                {discount}% OFF
              </span>
            ) : <span />}

            <button
              type="button"
              onClick={handleWishlistToggle}
              aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
              className={`pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full shadow-xs backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
                inWish
                  ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-100'
                  : 'bg-white/90 text-gray-700 hover:text-rose-600 border border-gray-200/70 hover:bg-white'
              }`}
            >
              <HeartIcon className="w-4 h-4 transition-colors" filled={inWish} />
            </button>
          </div>
        </div>

        {/* Content & Specs */}
        <div className="flex flex-1 flex-col justify-between min-w-0 py-1">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                {product.brand || 'Original'}
              </span>
              {product.subcategory && (
                <span className="rounded-md bg-gray-100 px-2 py-0.2 text-[9.5px] font-semibold text-gray-600 border border-gray-200/60">
                  {product.subcategory}
                </span>
              )}
              <div className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-gray-700">
                <span className="text-amber-500 text-xs">★</span>
                <span>{product.rating || '4.8'}</span>
                <span className="text-[10px] text-gray-400 font-normal">({product.reviews || 48})</span>
              </div>
            </div>

            <Link
              to={`/product/${product.id}`}
              className="block text-base sm:text-lg font-bold text-gray-950 transition-colors duration-150 hover:text-amber-700 leading-snug"
            >
              {product.name}
            </Link>

            <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {product.description || 'Authentic premium certified product with international manufacturer warranty and fast insured dispatch.'}
            </p>

            {/* Quick specs pill badges */}
            {product.specifications && (
              <div className="mt-2.5 hidden sm:flex flex-wrap items-center gap-1.5 text-[10px] text-gray-600">
                {Object.entries(product.specifications).slice(0, 3).map(([key, val]) => (
                  <span key={key} className="rounded-md bg-slate-50 border border-slate-200/70 px-2 py-0.5 font-medium">
                    <strong className="text-gray-900">{key}:</strong> {val}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Actions Strip */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold text-gray-950 tabular-nums">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-xs text-gray-400 line-through tabular-nums">
                  ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                </span>
              )}
              {discount > 0 && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                  {discount}% Off
                </span>
              )}
              {(product.stock || 0) <= 5 && (
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded ml-1">
                  Only {product.stock} left
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleQuickAdd}
                className={`rounded-xl px-4 py-2 text-xs font-semibold border transition-all active:scale-95 cursor-pointer ${
                  justAdded
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {justAdded ? '✓ Added to Bag' : '+ Add to Bag'}
              </button>

              <button
                type="button"
                onClick={handleBuyNowClick}
                className="rounded-xl bg-gray-950 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-black active:scale-95 shadow-xs cursor-pointer"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // ================= GRID VIEW LAYOUT (DEFAULT) =================
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-gray-200/80 bg-white p-2.5 sm:p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:border-gray-300 hover:-translate-y-1">
      
      {/* 1. Spacious & Clean Image Frame with Soft Neutral Canvas */}
      <div className="relative aspect-[4/4.7] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#F6F7F9]">
        <Link
          to={`/product/${product.id}`}
          className="block h-full w-full"
        >
          <img
            src={product.image || product.images?.[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-106"
            loading="lazy"
          />
        </Link>

        {/* Minimalist Floating Badges */}
        <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap max-w-[75%]">
            {discount > 0 && (
              <span className="rounded-full bg-gray-950/90 backdrop-blur-md px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white shadow-xs">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Floating Wishlist Heart */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
            className={`pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full shadow-xs backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              inWish
                ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-100'
                : 'bg-white/90 text-gray-700 hover:text-rose-600 border border-gray-200/70 hover:bg-white'
            }`}
          >
            <HeartIcon className="w-4 h-4 transition-colors" filled={inWish} />
          </button>
        </div>

        {/* 2. Desktop Quick-Action Slide-Up Bar */}
        <div className="hidden sm:flex absolute inset-x-2.5 bottom-2.5 z-10 gap-1.5 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-auto">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold backdrop-blur-md border shadow-md transition-all duration-150 active:scale-95 cursor-pointer truncate ${
              justAdded
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white/95 text-gray-900 border-white/80 hover:bg-white hover:text-black'
            }`}
          >
            <span>{justAdded ? '✓ Added' : '+ Add to Bag'}</span>
          </button>

          <button
            type="button"
            onClick={handleBuyNowClick}
            className="rounded-xl bg-gray-950/95 backdrop-blur-md px-3 py-2 text-xs font-semibold text-white transition-all duration-150 hover:bg-black active:scale-95 shadow-md cursor-pointer shrink-0"
          >
            Buy
          </button>
        </div>
      </div>

      {/* 3. Product Information */}
      <div className="pt-3 px-1 pb-0.5 flex flex-1 flex-col justify-between">
        <div>
          {/* Row A: Brand Name & Minimalist Star Rating */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-gray-400 truncate">
                {product.brand || 'Original'}
              </span>
              {product.subcategory && (
                <span className="hidden sm:inline-block text-[9px] text-gray-400 truncate">
                  • {product.subcategory}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-700 shrink-0">
              <span className="text-amber-500 text-xs">★</span>
              <span>{product.rating || '4.8'}</span>
            </div>
          </div>

          {/* Row B: Clean Product Title */}
          <Link
            to={`/product/${product.id}`}
            className="block text-[13.5px] sm:text-[14.5px] font-semibold text-gray-900 transition-colors duration-150 hover:text-black line-clamp-1 leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Row C: Price & Savings */}
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

        {/* 4. Mobile Action Buttons */}
        <div className="grid grid-cols-2 gap-1.5 pt-2.5 mt-2 border-t border-gray-100 sm:hidden">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full rounded-lg py-1.5 text-[11px] font-semibold transition-all active:scale-95 truncate ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {justAdded ? '✓ Added' : 'Add to Bag'}
          </button>

          <button
            type="button"
            onClick={handleBuyNowClick}
            className="w-full rounded-lg bg-gray-950 py-1.5 text-[11px] font-semibold text-white transition-all active:scale-95 truncate"
          >
            Buy Now
          </button>
        </div>

      </div>

    </div>
  );
}
