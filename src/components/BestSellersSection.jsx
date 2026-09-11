// src/components/BestSellersSection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import { Reveal } from './useScrollReveal';
import { HeartIcon, BagIcon, StarIcon, ArrowRightIcon } from './Icons';

const RANK_BADGES = [
  { rank: '#1', label: 'Bestseller', bg: 'bg-amber-500 text-white shadow-amber-500/20' },
  { rank: '#2', label: 'Top Rated', bg: 'bg-slate-900 text-amber-300 shadow-slate-900/20' },
  { rank: '#3', label: 'Most Loved', bg: 'bg-rose-600 text-white shadow-rose-600/20' },
  { rank: '#4', label: 'Staff Pick', bg: 'bg-emerald-700 text-white shadow-emerald-700/20' }
];

export default function BestSellersSection({ products = [], onToast }) {
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    if (onToast) {
      onToast(`✓ Added "${product.name}" to your bag`);
    }

    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleBuyNow = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="bg-white py-14 sm:py-20 border-t border-gray-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header with Centered Editorial Styling */}
        <Reveal direction="up" delay={50}>
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-[10.5px] font-bold uppercase tracking-[0.25em] mb-2.5">
              <span>✦</span>
              <span>MOST REQUESTED PIECES</span>
              <span>✦</span>
            </div>
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-1">
              <span className="h-px w-10 sm:w-20 bg-neutral-300" />
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-neutral-950 flex items-center gap-2">
                <span>Top Picks & Best Sellers</span>
                <span className="text-xl sm:text-2xl font-light text-rose-500 leading-none">♡</span>
              </h2>
              <span className="h-px w-10 sm:w-20 bg-neutral-300" />
            </div>
            <p className="mt-2.5 text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto">
              Our highest-rated client favorites across luxury Swiss timepieces, polarized eyewear, and premium audio.
            </p>
          </div>
        </Reveal>

        {/* 4-Card Ranked Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
          {products.slice(0, 4).map((product, idx) => {
            const isWish = Boolean(wishlistMap[product.id]);
            const isAdded = Boolean(addedMap[product.id]);
            const badge = RANK_BADGES[idx] || RANK_BADGES[0];
            const discount = product.discount || (
              product.oldPrice && product.oldPrice > product.price
                ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                : 0
            );

            return (
              <Reveal key={`bestseller-${product.id}`} direction="up" delay={idx * 80} duration={650}>
                <div className="group relative flex flex-col justify-between h-full rounded-2xl sm:rounded-3xl border border-gray-200/90 bg-white p-3.5 sm:p-4.5 shadow-[0_2px_14px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-amber-300/80 hover:-translate-y-1.5">

                  {/* 1. Image Canvas with Rank Indicator */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#F6F5F2]">
                    <Link
                      to={`/product/${product.id}`}
                      className="flex h-full w-full items-center justify-center cursor-pointer overflow-hidden"
                    >
                      <img
                        src={product.image || product.images?.[0]}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                        loading="lazy"
                      />
                    </Link>

                    {/* Top Row: Rank Badge & Wishlist Action */}
                    <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
                      {/* Rank Pill Badge */}
                      <div className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md ${badge.bg}`}>
                        <span>{badge.rank}</span>
                        <span className="opacity-90">{badge.label}</span>
                      </div>

                      {/* Floating Wishlist Button */}
                      <button
                        type="button"
                        onClick={(e) => handleWishlistToggle(e, product)}
                        aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                        className={`pointer-events-auto flex h-7.5 w-7.5 items-center justify-center rounded-full shadow-xs backdrop-blur-md transition-all duration-300 hover:scale-115 active:scale-90 cursor-pointer ${
                          isWish
                            ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-100 scale-105'
                            : 'bg-white/90 text-gray-700 hover:text-rose-600 border border-gray-200/80 hover:bg-white'
                        }`}
                        title={isWish ? 'In Wishlist' : 'Add to Wishlist'}
                      >
                        <HeartIcon className="w-3.5 h-3.5 transition-colors" filled={isWish} />
                      </button>
                    </div>

                    {/* Category Label at bottom left */}
                    <div className="absolute bottom-2 left-2.5 pointer-events-none">
                      <span className="rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white/90 uppercase tracking-wide">
                        {product.brand || product.category}
                      </span>
                    </div>
                  </div>

                  {/* 2. Product Details */}
                  <div className="pt-3.5 flex flex-1 flex-col justify-between text-center">
                    <div>
                      {/* Brand name */}
                      {product.brand && (
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1">
                          {product.brand}
                        </p>
                      )}

                      {/* Product Title */}
                      <Link
                        to={`/product/${product.id}`}
                        className="block font-bold text-gray-950 text-[13.5px] sm:text-[14.5px] transition-colors duration-200 hover:text-amber-800 line-clamp-1 leading-snug"
                        title={product.name}
                      >
                        {product.name}
                      </Link>

                      {/* Rating Score with 5 Stars */}
                      <div className="flex items-center justify-center gap-1.5 mt-1.5">
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, sIdx) => (
                            <StarIcon key={sIdx} className="w-3 h-3 text-amber-500" filled={true} />
                          ))}
                        </div>
                        <span className="font-bold text-gray-800 text-[11.5px] tabular-nums">
                          {product.rating ? Number(product.rating).toFixed(1) : '4.9'}
                        </span>
                        <span className="text-gray-400 text-[10.5px] tabular-nums">
                          ({product.reviews || 95}+)
                        </span>
                      </div>

                      {/* Price Row */}
                      <div className="flex items-baseline justify-center gap-2 mt-2">
                        <span className="text-base sm:text-lg font-extrabold text-gray-950 tabular-nums">
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

                    {/* 3. Action Buttons (Add to Bag & Buy Now) */}
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-98 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700 scale-[1.02]'
                            : 'bg-neutral-900 text-white hover:bg-black hover:shadow-md'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <span className="text-xs">✓</span>
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <BagIcon className="w-3.5 h-3.5 text-amber-300" />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(e, product)}
                        className="hidden sm:inline-flex py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-98 border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-500 cursor-pointer items-center justify-center"
                        title="Instant Checkout"
                      >
                        Buy Now
                      </button>
                    </div>

                  </div>

                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Bottom Call to Action Link */}
        <Reveal direction="up" delay={120}>
          <div className="mt-10 text-center">
            <Link
              to="/shop?filter=bestsellers"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-900 hover:text-black border-b-2 border-neutral-900 pb-0.5 hover:border-amber-500 transition-colors group"
            >
              <span>Explore All Bestselling Items</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
