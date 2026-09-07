// src/components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist, WATCH_TYPE_METADATA } from '../utils/productStore';

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
    <div className="group relative flex flex-col justify-between rounded-xl border border-gray-200/75 bg-white p-2 sm:p-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-250 hover:shadow-[0_6px_16px_rgba(0,0,0,0.05)] hover:border-gray-300 hover:-translate-y-0.5">

      {/* Product Image Stage (Matching Reference Image) */}
      <Link
        to={`/product/${product.id}`}
        className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#F4F4F6] p-2 sm:p-3 flex items-center justify-center group-hover:bg-[#EFEFF2] transition-colors duration-250"
      >
        {/* Category Pill Tag (Top Right) */}
        <span className="absolute right-1.5 top-1.5 sm:right-2 sm:top-2 z-10 rounded-full bg-white/95 px-1.5 sm:px-2 py-0.5 text-[7.5px] sm:text-[8.5px] font-semibold uppercase tracking-wider text-gray-600 shadow-2xs border border-gray-200/50">
          {product.category || 'Luxury'}
        </span>

        {/* Watch Type Pill (Bottom Left of Stage) */}
        {isWatch && watchMeta && (
          <span className={`absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 z-10 inline-flex max-w-[85%] items-center gap-1 rounded-md px-1.5 py-0.5 text-[7.5px] sm:text-[8.5px] font-bold border shadow-2xs backdrop-blur-xs truncate ${watchMeta.badgeClass}`}>
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${watchMeta.dotClass || 'bg-current'}`} />
            <span className="truncate">{watchMeta.label}</span>
          </span>
        )}

        {/* Discount Badge (Top Left) */}
        {discount > 0 && (
          <span className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2 z-10 rounded-full bg-[#111827] px-1.5 py-0.5 text-[7.5px] sm:text-[8.5px] font-bold text-white shadow-2xs">
            {discount}% OFF
          </span>
        )}

        {/* Wishlist Heart Action Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label="Toggle Wishlist"
          className={`absolute ${discount > 0 ? 'top-6 sm:top-7 left-1.5 sm:left-2' : 'top-1.5 sm:top-2 left-1.5 sm:left-2'} z-10 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-white/95 text-[10px] sm:text-[11px] shadow-2xs border border-gray-200/60 transition-transform duration-150 hover:scale-110 active:scale-90 ${inWish ? 'text-rose-500 bg-rose-50/80' : 'text-gray-400 hover:text-rose-500'
            }`}
        >
          {inWish ? '♥' : '♡'}
        </button>

        <img
          src={product.image || product.images?.[0]}
          alt={product.name}
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-400 ease-out group-hover:scale-104"
          loading="lazy"
        />
      </Link>

      {/* Product Information */}
      <div className="mt-2 sm:mt-2.5 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1">
            <Link
              to={`/product/${product.id}`}
              className="text-[11px] sm:text-xs font-semibold text-gray-900 transition-colors duration-150 hover:text-black line-clamp-1"
              title={product.name}
            >
              {product.name}
            </Link>
            <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider text-gray-400 shrink-0">
              {product.brand}
            </span>
          </div>

          {/* Rating & Price Row */}
          <div className="mt-1 flex items-center justify-between gap-1">
            <div className="flex items-center gap-0.5 sm:gap-1 text-[9.5px] sm:text-[10.5px] text-gray-600 font-medium shrink-0">
              <span className="text-amber-500 font-bold text-[10px] sm:text-[11px]">★</span>
              <span className="text-gray-900 font-semibold">{product.rating || 4.8}</span>
              <span className="text-gray-400 text-[8.5px] sm:text-[9.5px] hidden xs:inline">({product.reviews || 84})</span>
            </div>

            <div className="text-right truncate">
              <span className="text-[11px] sm:text-xs font-bold text-gray-950">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="ml-1 text-[8.5px] sm:text-[9.5px] text-gray-400 line-through hidden xs:inline">
                  ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Dual Action Buttons */}
        <div className="mt-2 sm:mt-2.5 flex items-center gap-1 sm:gap-1.5 pt-1.5 sm:pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`flex-1 rounded-full border py-1 sm:py-1.5 text-[9px] sm:text-[10.5px] font-semibold transition-all duration-150 active:scale-97 truncate ${justAdded
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
              : 'border-gray-200 bg-[#F4F4F6] text-gray-800 hover:bg-gray-200 hover:text-black'
              }`}
          >
            {justAdded ? '✓ Added' : 'Add to Bag'}
          </button>

          <button
            type="button"
            onClick={handleBuyNowClick}
            className="flex-1 rounded-full bg-[#111827] py-1 sm:py-1.5 text-[9px] sm:text-[10.5px] font-semibold text-white transition-all duration-150 hover:bg-black hover:shadow-xs active:scale-97 border border-gray-900 truncate"
          >
            Buy Now
          </button>
        </div>

      </div>

    </div>
  );
}
