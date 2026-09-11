// src/components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import { HeartIcon, BagIcon, CheckIcon, StarIcon } from './Icons';

const RANK_BADGE_STYLES = {
  1: { badge: '#01', label: 'Bestseller', bg: 'bg-amber-500 text-white shadow-amber-500/30' },
  2: { badge: '#02', label: 'Top Rated', bg: 'bg-slate-900 text-amber-300 shadow-slate-900/30' },
  3: { badge: '#03', label: 'Client Fav', bg: 'bg-rose-600 text-white shadow-rose-600/30' },
  4: { badge: '#04', label: 'Staff Pick', bg: 'bg-emerald-700 text-white shadow-emerald-700/30' }
};

export default function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
  showRating = true,
  buttonLabel = 'Add to Cart',
  showBrand = true,
  variant = 'standard', // 'standard' | 'ranked'
  rankNumber
}) {
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
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNowClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const rankInfo = rankNumber ? (RANK_BADGE_STYLES[rankNumber] || { badge: `#0${rankNumber}`, label: 'Ranked', bg: 'bg-neutral-900 text-white' }) : null;

  return (
    <div className={`group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border bg-white p-3.5 sm:p-4.5 transition-all duration-300 hover:-translate-y-1.5 ${
      variant === 'ranked'
        ? 'border-gray-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:border-amber-300 hover:shadow-[0_20px_42px_rgba(197,168,128,0.18)]'
        : 'border-gray-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-gray-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)]'
    }`}>

      {/* 1. Clean Rounded Image Frame with Warm Canvas & Zoom */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#F6F5F2]">
        <Link
          to={`/product/${product.id}`}
          className="flex h-full w-full items-center justify-center overflow-hidden"
        >
          <img
            src={product.image || product.images?.[0]}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
            loading="lazy"
          />
        </Link>

        {/* Top Badges / Actions */}
        <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
          {variant === 'ranked' && rankInfo ? (
            <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md ${rankInfo.bg}`}>
              <span>{rankInfo.badge}</span>
              <span className="opacity-90">{rankInfo.label}</span>
            </div>
          ) : discount > 0 ? (
            <span className="rounded-md bg-gray-950/85 backdrop-blur-md px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-amber-300 shadow-xs border border-white/10">
              {discount}% OFF
            </span>
          ) : product.isNew || product.tag ? (
            <span className="rounded-md bg-emerald-950/85 backdrop-blur-md px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-emerald-300 shadow-xs border border-white/10">
              {product.tag || 'NEW'}
            </span>
          ) : (
            <span />
          )}

          {/* Minimalist Floating Wishlist Heart */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
            className={`pointer-events-auto flex h-7.5 w-7.5 items-center justify-center rounded-full shadow-xs backdrop-blur-md transition-all duration-300 hover:scale-115 active:scale-90 cursor-pointer ${
              inWish
                ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-100 scale-105'
                : 'bg-white/90 text-gray-600 hover:text-rose-600 border border-gray-200/80 hover:bg-white'
            }`}
          >
            <HeartIcon className="w-3.5 h-3.5 transition-transform group-active:scale-90" filled={inWish} />
          </button>
        </div>

        {/* Category Overlay Tag */}
        <div className="absolute bottom-2 left-2.5 pointer-events-none">
          <span className="rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white/90 uppercase tracking-wide">
            {product.brand || product.category}
          </span>
        </div>
      </div>

      {/* 2. Product Information */}
      <div className="pt-3.5 flex flex-1 flex-col justify-between text-center">
        <div>
          {/* Brand Tag (if available) */}
          {showBrand && product.brand && (
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-400 mb-1">
              {product.brand}
            </p>
          )}

          {/* Product Title */}
          <Link
            to={`/product/${product.id}`}
            className="block text-center font-bold text-gray-900 text-[13.5px] sm:text-[14.5px] transition-colors duration-200 hover:text-black line-clamp-1 leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Star Rating (Gold Stars + Score) */}
          {showRating && (
            <div className="flex items-center justify-center gap-1.5 mt-1.5">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, sIdx) => (
                  <StarIcon key={sIdx} className="w-3 h-3 text-amber-500" filled={true} />
                ))}
              </div>
              <span className="font-semibold text-gray-600 text-[11px] sm:text-xs tabular-nums">
                ({product.rating ? Number(product.rating).toFixed(1) : '4.8'})
              </span>
            </div>
          )}

          {/* Price Row (Bold Current Price + Strikethrough Old Price) */}
          <div className="flex items-baseline justify-center gap-2 mt-2">
            <span className="text-sm sm:text-base font-extrabold text-gray-950 tabular-nums">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>

            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs sm:text-sm text-gray-400 line-through tabular-nums font-normal">
                ₹{Number(product.oldPrice).toLocaleString('en-IN')}
              </span>
            )}

            {discount > 0 && (
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* 3. Action Buttons */}
        <div className="mt-3.5 flex gap-2">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-98 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 scale-[1.02]'
                : 'bg-[#111827] text-white hover:bg-black hover:shadow-md'
            }`}
          >
            {justAdded ? (
              <>
                <span className="font-bold text-xs">✓</span>
                <span>Added</span>
              </>
            ) : (
              <>
                <BagIcon className="w-3.5 h-3.5 text-amber-300 transition-transform group-hover:scale-110" />
                <span>{buttonLabel}</span>
              </>
            )}
          </button>

          {variant === 'ranked' && (
            <button
              type="button"
              onClick={handleBuyNowClick}
              className="hidden sm:inline-flex py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-98 border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-500 cursor-pointer items-center justify-center"
              title="Instant Checkout"
            >
              Buy Now
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
