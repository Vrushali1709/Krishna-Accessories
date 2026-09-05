// src/components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';

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
    <div className="group relative flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-white p-3 transition-all duration-200 hover:border-zinc-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:-translate-y-0.5">
      
      {/* Product Image Stage */}
      <Link
        to={`/product/${product.id}`}
        className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#F6F6F7] p-4 flex items-center justify-center transition-colors duration-200 group-hover:bg-[#F0F0F2]"
      >
        {/* Category Pill Tag (Top Right) */}
        <span className="absolute right-2.5 top-2.5 z-10 rounded-md bg-white/90 backdrop-blur-xs px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-zinc-600 border border-zinc-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          {product.category || 'Luxury'}
        </span>

        {/* Discount Badge (Top Left) */}
        {discount > 0 && (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-zinc-900 px-1.5 py-0.5 text-[9px] font-semibold text-white tracking-wide shadow-xs">
            {discount}% OFF
          </span>
        )}

        {/* Wishlist Heart Action Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label="Toggle Wishlist"
          className={`absolute ${discount > 0 ? 'top-8 left-2.5' : 'top-2.5 left-2.5'} z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-xs shadow-xs border border-zinc-200/80 transition-all duration-150 hover:scale-105 active:scale-95 ${
            inWish ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-zinc-400 hover:text-rose-600 hover:border-zinc-300'
          }`}
        >
          {inWish ? '♥' : '♡'}
        </button>

        <img
          src={product.image || product.images?.[0]}
          alt={product.name}
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Product Information */}
      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 truncate">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-zinc-700 font-medium shrink-0">
              <span className="text-amber-500 font-bold text-[10px]">★</span>
              <span className="font-semibold text-zinc-900">{product.rating || 4.8}</span>
              <span className="text-zinc-400 text-[10px]">({product.reviews || 42})</span>
            </div>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="mt-0.5 block text-xs font-semibold text-zinc-900 transition-colors duration-150 hover:text-black line-clamp-1"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Pricing Row */}
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-zinc-950 tracking-tight">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-[10.5px] text-zinc-400 line-through">
                ₹{Number(product.oldPrice).toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Dual Action Buttons */}
        <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-zinc-100">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`flex-1 rounded-lg border py-1.5 text-[11px] font-semibold transition-all duration-150 active:scale-98 ${
              justAdded
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 hover:border-zinc-300 hover:text-black'
            }`}
          >
            {justAdded ? '✓ In Bag' : 'Add to Bag'}
          </button>

          <button
            type="button"
            onClick={handleBuyNowClick}
            className="flex-1 rounded-lg bg-zinc-900 py-1.5 text-[11px] font-semibold text-white transition-all duration-150 hover:bg-black active:scale-98 border border-zinc-900 shadow-2xs"
          >
            Buy Now
          </button>
        </div>

      </div>

    </div>
  );
}
