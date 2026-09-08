// src/components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist, WATCH_TYPE_METADATA } from '../utils/productStore';
import { HeartIcon } from './Icons';

export default function ProductCard({ product, onAddToCart, onBuyNow }) {
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

  const isWatch = product.category === 'Watches' || Boolean(product.watchType);
  const watchMeta = product.watchType ? WATCH_TYPE_METADATA[product.watchType] : (isWatch ? WATCH_TYPE_METADATA['Original'] : null);

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

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.07)] hover:border-gray-300 hover:-translate-y-1">

      {/* 1. Product Image Showcase */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F6F6F8]">
        <Link
          to={`/product/${product.id}`}
          className="block h-full w-full"
        >
          <img
            src={product.image || product.images?.[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Discount Badge (Top Left) */}
        {discount > 0 && (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#111827] px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white shadow-sm pointer-events-none">
            {discount}% OFF
          </span>
        )}

        {/* Wishlist Heart Button (Top Right - Floating Circle with SVG Icon) */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
            inWish
              ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-100'
              : 'bg-white/95 text-gray-600 hover:text-rose-600 border border-gray-200/80'
          }`}
        >
          <HeartIcon className="w-4 h-4 transition-colors" filled={inWish} />
        </button>

        {/* Watch Edition or Category Tag (Bottom Left) */}
        {isWatch && watchMeta ? (
          <span className={`absolute bottom-2.5 left-2.5 z-10 inline-flex max-w-[85%] items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold border shadow-xs backdrop-blur-md truncate pointer-events-none ${watchMeta.badgeClass}`}>
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${watchMeta.dotClass || 'bg-current'}`} />
            <span className="truncate">{watchMeta.label}</span>
          </span>
        ) : product.category ? (
          <span className="absolute bottom-2.5 left-2.5 z-10 rounded-md bg-white/90 px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-gray-700 shadow-xs border border-gray-200/60 backdrop-blur-md pointer-events-none">
            {product.category}
          </span>
        ) : null}
      </div>

      {/* 2. Product Information Area */}
      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          {/* Row A: Brand & Rating */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 truncate">
              {product.brand || 'Original'}
            </span>

            <div className="flex items-center gap-1 rounded-md bg-amber-50/80 px-1.5 py-0.5 text-[10.5px] font-bold text-amber-900 border border-amber-200/60 shrink-0">
              <span className="text-amber-500 text-[11px]">★</span>
              <span>{product.rating || '4.8'}</span>
            </div>
          </div>

          {/* Row B: Product Title */}
          <Link
            to={`/product/${product.id}`}
            className="mt-1 block text-[13px] sm:text-[13.5px] font-semibold text-gray-900 transition-colors duration-150 hover:text-black line-clamp-1 leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Row C: Price Details */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-gray-950 tabular-nums">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>

            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-gray-400 line-through tabular-nums">
                ₹{Number(product.oldPrice).toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* 3. Dual Action Buttons */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 pt-2.5 border-t border-gray-100">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full rounded-xl border py-2 text-xs font-semibold transition-all duration-150 active:scale-97 cursor-pointer truncate ${
              justAdded
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'border-gray-200 bg-[#F4F4F6] text-gray-800 hover:bg-gray-200 hover:text-black'
            }`}
          >
            {justAdded ? '✓ Added' : 'Add to Bag'}
          </button>

          <button
            type="button"
            onClick={handleBuyNowClick}
            className="w-full rounded-xl bg-[#111827] py-2 text-xs font-semibold text-white transition-all duration-150 hover:bg-black hover:shadow-xs active:scale-97 border border-gray-900 cursor-pointer truncate"
          >
            Buy Now
          </button>
        </div>

      </div>

    </div>
  );
}
