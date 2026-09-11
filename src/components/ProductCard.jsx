// src/components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import { HeartIcon, BagIcon } from './Icons';

export default function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
  showRating = true,
  buttonLabel = 'Add to Cart'
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
    setTimeout(() => setJustAdded(false), 1400);
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

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-3 sm:p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:border-gray-200 hover:-translate-y-1">

      {/* 1. Clean Rounded Image Frame with Warm Neutral Canvas */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F4F3F0]">
        <Link
          to={`/product/${product.id}`}
          className="flex h-full w-full items-center justify-center"
        >
          <img
            src={product.image || product.images?.[0]}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Top Badges / Actions */}
        <div className="absolute top-2 inset-x-2 z-10 flex items-center justify-between pointer-events-none">
          {discount > 0 ? (
            <span className="rounded-md bg-gray-950/85 backdrop-blur-xs px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
              {discount}% OFF
            </span>
          ) : (
            <span />
          )}

          {/* Minimalist Floating Wishlist Heart */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
            className={`pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full shadow-xs backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              inWish
                ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-100'
                : 'bg-white/90 text-gray-600 hover:text-rose-600 border border-gray-200/70 hover:bg-white'
            }`}
          >
            <HeartIcon className="w-3.5 h-3.5 transition-colors" filled={inWish} />
          </button>
        </div>
      </div>

      {/* 2. Centered Product Information */}
      <div className="pt-3 flex flex-1 flex-col justify-between text-center">
        <div>
          {/* Product Title */}
          <Link
            to={`/product/${product.id}`}
            className="block text-center font-bold text-gray-900 text-[13.5px] sm:text-[14.5px] transition-colors duration-150 hover:text-[#133827] line-clamp-1 leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Star Rating (Gold Stars + Score) */}
          {showRating && (
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="text-[#E8A317] text-xs tracking-tight">
                ★ ★ ★ ★ ★
              </span>
              <span className="font-semibold text-gray-600 text-[11px] sm:text-xs">
                ({product.rating ? Number(product.rating).toFixed(1) : '4.8'})
              </span>
            </div>
          )}

          {/* Price Row (Bold Current Price + Strikethrough Old Price) */}
          <div className="flex items-baseline justify-center gap-2 mt-1.5">
            <span className="text-sm sm:text-base font-bold text-gray-950 tabular-nums">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>

            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs sm:text-sm text-gray-400 line-through tabular-nums">
                ₹{Number(product.oldPrice).toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* 3. Action Button with Add to Cart / Shop Now */}
        <div className="mt-3">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs uppercase tracking-wider text-white transition-all duration-200 active:scale-98 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                : 'bg-[#111827] hover:bg-black hover:shadow-md'
            }`}
          >
            {justAdded ? (
              <span>✓ Added to Cart</span>
            ) : (
              <>
                <BagIcon className="w-3.5 h-3.5 text-amber-300" />
                <span>{buttonLabel}</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}

