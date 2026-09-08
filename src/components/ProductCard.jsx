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
    <div className="group relative flex flex-col justify-end rounded-2xl border border-gray-200/90 bg-gray-950 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.18)] hover:border-gray-400 hover:-translate-y-1.5 aspect-[3/4] sm:aspect-[3/4.2]">
      
      {/* 1. Full-Bleed Background Image */}
      <Link
        to={`/product/${product.id}`}
        className="absolute inset-0 block h-full w-full overflow-hidden"
      >
        <img
          src={product.image || product.images?.[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        {/* Cinematic Gradient Overlays for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 via-40% to-black/10 transition-opacity duration-300 group-hover:via-black/70" />
      </Link>

      {/* 2. Top Badges & Floating Actions */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 flex-wrap max-w-[78%]">
          {discount > 0 && (
            <span className="rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-300 border border-amber-400/30 shadow-md">
              {discount}% OFF
            </span>
          )}

          {isWatch && watchMeta ? (
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9.5px] font-bold border shadow-md backdrop-blur-md truncate ${watchMeta.badgeClass}`}>
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${watchMeta.dotClass || 'bg-current'}`} />
              <span className="truncate">{watchMeta.label}</span>
            </span>
          ) : product.category ? (
            <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm border border-white/20 truncate">
              {product.category}
            </span>
          ) : null}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
          className={`pointer-events-auto flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${inWish
              ? 'bg-rose-500 text-white border border-rose-400 shadow-rose-500/30'
              : 'bg-black/40 text-white hover:bg-black/70 hover:text-rose-400 border border-white/20'
            }`}
        >
          <HeartIcon className="w-4.5 h-4.5 transition-colors" filled={inWish} />
        </button>
      </div>

      {/* 3. Bottom Content & Actions (Overlaid directly on the image) */}
      <div className="relative z-10 p-3.5 sm:p-4 flex flex-col justify-end pointer-events-auto">
        
        {/* Row A: Brand Name & Rating */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-300 truncate">
            {product.brand || 'Original Brand'}
          </span>

          <div className="flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-md px-2 py-0.5 text-[10.5px] font-bold text-white border border-white/15 shrink-0">
            <span className="text-amber-400 text-xs">★</span>
            <span>{product.rating || '4.8'}</span>
            <span className="text-neutral-300 font-normal text-[9px]">({product.reviews || 84})</span>
          </div>
        </div>

        {/* Row B: Clear Bold Title */}
        <Link
          to={`/product/${product.id}`}
          className="block text-[14.5px] sm:text-[15.5px] font-bold text-white transition-colors duration-200 hover:text-amber-300 line-clamp-1 leading-snug mb-1.5 drop-shadow-sm"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Row C: Price Details & Discount savings */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base sm:text-lg font-black text-white tabular-nums tracking-tight drop-shadow-sm">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>

          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-xs sm:text-sm text-neutral-400 line-through tabular-nums">
              ₹{Number(product.oldPrice).toLocaleString('en-IN')}
            </span>
          )}

          {discount > 0 && (
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-1.5 py-0.5 rounded-md">
              {discount}% Off
            </span>
          )}
        </div>

        {/* 4. Sleek Modern Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/15">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full rounded-xl py-2 sm:py-2.5 text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer truncate backdrop-blur-md border ${justAdded
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/40'
                : 'border-white/20 bg-white/15 text-white hover:bg-white/25 hover:border-white/30'
              }`}
          >
            {justAdded ? '✓ Added' : 'Add to Bag'}
          </button>

          <button
            type="button"
            onClick={handleBuyNowClick}
            className="w-full rounded-xl bg-white py-2 sm:py-2.5 text-xs font-bold text-gray-950 transition-all duration-200 hover:bg-neutral-100 hover:shadow-lg hover:shadow-black/30 active:scale-95 border border-white cursor-pointer truncate"
          >
            Buy Now
          </button>
        </div>

      </div>

    </div>
  );
}
