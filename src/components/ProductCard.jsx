// src/components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import { HeartIcon, BagIcon, CheckIcon, StarIcon, ArrowRightIcon } from './Icons';

export default function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
  showRating = true,
  buttonLabel = 'Add to Cart',
  showBrand = true,
  variant = 'standard', // 'standard', 'ranked', 'compact', 'horizontal', 'editorial', 'dark-luxury'
  rankNumber = null
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

  // ============================================================
  // 1. RANKED VARIANT (FOR BEST SELLERS #01 - #04)
  // ============================================================
  if (variant === 'ranked') {
    return (
      <div className="group relative flex flex-col justify-between rounded-[22px] border border-gray-200/90 bg-white p-3.5 sm:p-4 shadow-[0_2px_14px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.09)] hover:border-amber-400/80 hover:-translate-y-1.5 overflow-hidden">
        {/* Top Gold Medal Badge */}
        <div className="relative aspect-square w-full overflow-hidden rounded-[16px] bg-[#F5F4F0]">
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

          {/* Rank Ribbon */}
          {rankNumber && (
            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-[#111827] to-[#1F2937] px-2.5 py-1 text-[10px] font-mono font-bold text-amber-300 shadow-md border border-amber-400/30">
              <span className="text-amber-400 font-serif font-black">#0{rankNumber}</span>
              <span className="text-[9px] uppercase tracking-wider text-neutral-300">BESTSELLER</span>
            </div>
          )}

          {/* Floating Wishlist Heart */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-300 hover:scale-115 active:scale-90 cursor-pointer ${
              inWish
                ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-100 scale-105'
                : 'bg-white/95 text-gray-700 hover:text-rose-600 border border-gray-200 hover:bg-white'
            }`}
          >
            <HeartIcon className="w-3.5 h-3.5" filled={inWish} />
          </button>

          {/* Category Tag */}
          <div className="absolute bottom-2 left-2.5 pointer-events-none">
            <span className="rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white/95 uppercase tracking-wider">
              {product.brand || product.category}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="pt-3.5 flex flex-1 flex-col justify-between">
          <div>
            <Link
              to={`/product/${product.id}`}
              className="block font-bold text-gray-900 text-[14px] sm:text-[15px] transition-colors duration-200 hover:text-black line-clamp-1 leading-snug"
              title={product.name}
            >
              {product.name}
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-3 h-3 text-amber-500" filled={true} />
                ))}
              </div>
              <span className="font-bold text-gray-800 text-xs tabular-nums">
                {product.rating ? Number(product.rating).toFixed(1) : '4.9'}
              </span>
              <span className="text-gray-400 text-[11px] tabular-nums">
                ({product.reviews || 85})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-base sm:text-lg font-black text-gray-950 tabular-nums">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-xs text-gray-400 line-through tabular-nums">
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

          {/* Action */}
          <div className="mt-3.5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickAdd}
              className={`py-2 px-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                justAdded
                  ? 'bg-emerald-600 text-white shadow-emerald-200'
                  : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border border-neutral-200/90'
              }`}
            >
              {justAdded ? (
                <>
                  <CheckIcon className="w-3 h-3 text-white" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <BagIcon className="w-3 h-3 text-neutral-800" />
                  <span>Add</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNowClick}
              className="py-2 px-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider bg-gray-950 text-amber-300 hover:bg-black hover:shadow-md transition-all duration-300 active:scale-95 flex items-center justify-center gap-1 cursor-pointer shadow-xs"
            >
              <span>Buy Now</span>
              <ArrowRightIcon className="w-3 h-3 text-amber-300" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 2. COMPACT VARIANT (FOR UNDER ₹5,000 QUICK ACCESS)
  // ============================================================
  if (variant === 'compact') {
    return (
      <div className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-3 shadow-2xs transition-all duration-300 hover:border-neutral-400 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F6F5F2]">
          <Link to={`/product/${product.id}`} className="flex h-full w-full items-center justify-center overflow-hidden">
            <img
              src={product.image || product.images?.[0]}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-106"
              loading="lazy"
            />
          </Link>

          {/* Price Pill Tag */}
          <div className="absolute top-2 left-2 z-10">
            <span className="rounded-full bg-neutral-950/85 backdrop-blur-md px-2 py-0.5 text-[10px] font-black text-amber-300 shadow-xs border border-white/10">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Wishlist */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full shadow-xs backdrop-blur-md transition-all duration-300 hover:scale-115 cursor-pointer ${
              inWish ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-white/90 text-gray-600 hover:text-rose-600'
            }`}
          >
            <HeartIcon className="w-3 h-3" filled={inWish} />
          </button>
        </div>

        <div className="pt-2.5 flex flex-1 flex-col justify-between">
          <div>
            {showBrand && product.brand && (
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                {product.brand}
              </span>
            )}
            <Link
              to={`/product/${product.id}`}
              className="font-bold text-gray-900 text-xs sm:text-[13px] hover:text-black line-clamp-1 block"
              title={product.name}
            >
              {product.name}
            </Link>
          </div>

          <div className="mt-2.5">
            <button
              type="button"
              onClick={handleQuickAdd}
              className={`w-full py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-900 text-white hover:bg-black'
              }`}
            >
              {justAdded ? (
                <>
                  <CheckIcon className="w-3 h-3 text-white" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <BagIcon className="w-3 h-3 text-amber-300" />
                  <span>Quick Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 3. HORIZONTAL SPLIT VARIANT (FOR UNDER ₹10,000)
  // ============================================================
  if (variant === 'horizontal') {
    return (
      <div className="group relative flex flex-col sm:flex-row items-stretch rounded-2xl border border-gray-200/90 bg-white p-3.5 shadow-2xs transition-all duration-300 hover:border-gray-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:-translate-y-1">
        {/* Left Image */}
        <div className="relative aspect-square sm:w-36 md:w-40 sm:h-auto shrink-0 overflow-hidden rounded-xl bg-[#F6F5F2]">
          <Link to={`/product/${product.id}`} className="flex h-full w-full items-center justify-center overflow-hidden">
            <img
              src={product.image || product.images?.[0]}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-600 ease-out group-hover:scale-108"
              loading="lazy"
            />
          </Link>
          {discount > 0 && (
            <span className="absolute top-2 left-2 rounded-md bg-rose-600 text-white px-1.5 py-0.5 text-[9px] font-extrabold shadow-xs">
              {discount}% OFF
            </span>
          )}
          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full shadow-xs backdrop-blur-md transition-all duration-300 hover:scale-110 cursor-pointer ${
              inWish ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-white/90 text-gray-700 hover:text-rose-600'
            }`}
          >
            <HeartIcon className="w-3.5 h-3.5" filled={inWish} />
          </button>
        </div>

        {/* Right Info */}
        <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded">
                {product.brand || 'Luxury'}
              </span>
              <div className="flex items-center text-amber-500 text-xs">
                <span>★</span>
                <span className="font-bold text-gray-700 text-[11px] ml-1">
                  {product.rating ? Number(product.rating).toFixed(1) : '4.8'}
                </span>
              </div>
            </div>

            <Link
              to={`/product/${product.id}`}
              className="font-bold text-gray-900 text-sm sm:text-[14.5px] hover:text-black line-clamp-2 mt-1.5 leading-snug"
              title={product.name}
            >
              {product.name}
            </Link>

            <p className="text-xs text-neutral-500 mt-1 line-clamp-1 font-light">
              {product.description || 'Verified manufacturer warranty & premium craftsmanship.'}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-gray-950">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleQuickAdd}
              className={`py-1.5 px-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-900 text-white hover:bg-black'
              }`}
            >
              {justAdded ? (
                <>
                  <CheckIcon className="w-3 h-3 text-white" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <BagIcon className="w-3 h-3 text-amber-300" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 4. EDITORIAL TRIO VARIANT (FOR UNDER ₹15,000)
  // ============================================================
  if (variant === 'editorial') {
    return (
      <div className="group relative flex flex-col justify-between rounded-3xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] hover:border-gray-300 hover:-translate-y-1.5">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#F5F4F0]">
          <Link to={`/product/${product.id}`} className="flex h-full w-full items-center justify-center overflow-hidden">
            <img
              src={product.image || product.images?.[0]}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              loading="lazy"
            />
          </Link>

          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/75 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#E8D4B4] border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Executive Choice
            </span>
          </div>

          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-300 hover:scale-115 cursor-pointer ${
              inWish ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-white/95 text-gray-700 hover:text-rose-600'
            }`}
          >
            <HeartIcon className="w-4 h-4" filled={inWish} />
          </button>
        </div>

        <div className="pt-4 flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A880]">
                {product.brand || product.category}
              </span>
              <span className="text-[11px] font-semibold text-gray-500">
                ★ {product.rating ? Number(product.rating).toFixed(1) : '4.9'} ({product.reviews || 90}+)
              </span>
            </div>

            <Link
              to={`/product/${product.id}`}
              className="block font-serif text-lg font-normal text-gray-950 mt-1 hover:text-black line-clamp-1"
              title={product.name}
            >
              {product.name}
            </Link>

            <p className="text-xs text-gray-500 font-light mt-1.5 line-clamp-2 leading-relaxed">
              {product.description || 'Premium certified horology and luxury design with authentic manufacturer warranty.'}
            </p>
          </div>

          <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-neutral-400 block font-light">Price</span>
              <span className="text-lg font-black text-gray-950">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleQuickAdd}
                className={`py-2 px-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  justAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-900 text-white hover:bg-black'
                }`}
              >
                {justAdded ? (
                  <>
                    <CheckIcon className="w-3.5 h-3.5 text-white" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <BagIcon className="w-3.5 h-3.5 text-amber-300" />
                    <span>Bag</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNowClick}
                className="py-2 px-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#E8D4B4] text-black hover:bg-[#DFC59E] transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 5. DARK LUXURY VARIANT (FOR UNDER ₹20,000 / PRIVÉ)
  // ============================================================
  if (variant === 'dark-luxury') {
    return (
      <div className="group relative flex flex-col justify-between rounded-3xl border border-neutral-800 bg-[#0E111A] p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-[#C5A880]/60 hover:shadow-[0_15px_40px_rgba(197,168,128,0.15)] hover:-translate-y-1.5">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#161B26]">
          <Link to={`/product/${product.id}`} className="flex h-full w-full items-center justify-center overflow-hidden">
            <img
              src={product.image || product.images?.[0]}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              loading="lazy"
            />
          </Link>

          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/80 backdrop-blur-md px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-widest text-[#F3DFCA] border border-[#C5A880]/30">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Flagship Masterpiece
            </span>
          </div>

          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-300 hover:scale-115 cursor-pointer ${
              inWish ? 'bg-rose-950 text-rose-400 border border-rose-500/50' : 'bg-black/70 text-gray-300 hover:text-rose-400 border border-neutral-700'
            }`}
          >
            <HeartIcon className="w-4 h-4" filled={inWish} />
          </button>
        </div>

        <div className="pt-4 flex flex-1 flex-col justify-between text-white">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A880] block">
              {product.brand || 'Privé'} • {product.category}
            </span>

            <Link
              to={`/product/${product.id}`}
              className="block font-serif text-base sm:text-lg font-normal text-white mt-1 hover:text-[#E8D4B4] line-clamp-1 transition-colors"
              title={product.name}
            >
              {product.name}
            </Link>

            <div className="flex items-center gap-1.5 mt-2 text-xs text-neutral-400">
              <span className="text-amber-400">★ ★ ★ ★ ★</span>
              <span className="text-neutral-300 font-bold">{product.rating || '4.9'}</span>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Signature Price</span>
              <span className="text-base sm:text-lg font-black text-white font-mono">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="button"
              onClick={handleQuickAdd}
              className={`py-2 px-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                justAdded
                  ? 'bg-emerald-600 text-white shadow-emerald-900/50'
                  : 'bg-gradient-to-r from-[#F5E6D3] via-[#E8D4B4] to-[#C5A880] text-black hover:brightness-110 shadow-[0_4px_15px_rgba(197,168,128,0.25)]'
              }`}
            >
              {justAdded ? (
                <>
                  <CheckIcon className="w-3.5 h-3.5 text-white" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <BagIcon className="w-3.5 h-3.5 text-black" />
                  <span>Acquire</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 6. STANDARD DEFAULT VARIANT
  // ============================================================
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/70 bg-white p-3 sm:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:border-gray-300 hover:-translate-y-1.5">
      {/* 1. Clean Rounded Image Frame with Warm Canvas & Zoom */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F4F3F0]">
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
          {discount > 0 ? (
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
              <span className="text-amber-500 text-xs tracking-tight">
                ★ ★ ★ ★ ★
              </span>
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
          </div>
        </div>

        {/* 3. Action Button with Add to Cart / Shop Now */}
        <div className="mt-3.5">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-98 shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 scale-[1.02]'
                : 'bg-[#111827] text-white hover:bg-black hover:shadow-md'
            }`}
          >
            {justAdded ? (
              <>
                <span className="font-bold text-xs">✓</span>
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <BagIcon className="w-3.5 h-3.5 text-amber-300 transition-transform group-hover:scale-110" />
                <span>{buttonLabel}</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
