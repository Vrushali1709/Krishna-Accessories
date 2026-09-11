// src/components/PriceTierUnder5k.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import { Reveal } from './useScrollReveal';
import { HeartIcon, BagIcon, ArrowRightIcon, StarIcon } from './Icons';

export default function PriceTierUnder5k({ products = [], onToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [wishlistMap, setWishlistMap] = useState({});
  const [addedMap, setAddedMap] = useState({});

  // Filter products <= 5000
  const under5kItems = products
    .filter((p) => Number(p.price) <= 5000)
    .slice(0, 4);

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
    if (onToast) onToast(`✓ Added "${product.name}" to your bag`);

    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1400);
  };

  if (under5kItems.length === 0) return null;

  return (
    <section className="bg-[#F8F9FA] py-14 sm:py-18 border-t border-gray-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <Reveal direction="up" delay={50}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-[0.22em] text-emerald-800">
                  SMART VALUE & EVERYDAY ESSENTIALS
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 font-sans">
                Curated Finds <span className="font-serif font-normal italic text-emerald-800">Under ₹5,000</span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Premium quality backpacks, smart wristwear, and audio gear at high-value accessible price points.
              </p>
            </div>

            <Link
              to="/shop?maxPrice=5000"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-900 hover:text-emerald-700 transition-colors shrink-0 group"
            >
              <span>Explore All Under ₹5,000</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        {/* 4-Card Compact Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
          {under5kItems.map((product, idx) => {
            const isWish = Boolean(wishlistMap[product.id]);
            const isAdded = Boolean(addedMap[product.id]);
            const discount = product.discount || (
              product.oldPrice && product.oldPrice > product.price
                ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                : 0
            );

            return (
              <Reveal key={`u5k-${product.id}`} direction="up" delay={idx * 70} duration={600}>
                <div className="group relative flex flex-col justify-between h-full rounded-2xl border border-gray-200/90 bg-white p-3 sm:p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-emerald-300 hover:shadow-[0_12px_28px_rgba(16,185,129,0.08)] hover:-translate-y-1">

                  {/* Image Frame */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50 mb-3">
                    <Link
                      to={`/product/${product.id}`}
                      className="flex h-full w-full items-center justify-center cursor-pointer overflow-hidden"
                    >
                      <img
                        src={product.image || product.images?.[0]}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-106"
                        loading="lazy"
                      />
                    </Link>

                    {/* Top Badges */}
                    <div className="absolute top-2 inset-x-2 flex items-center justify-between pointer-events-none">
                      <span className="rounded-md bg-emerald-900/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-200 shadow-xs border border-white/10">
                        {discount > 0 ? `${discount}% OFF` : 'Under ₹5k'}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleWishlistToggle(e, product)}
                        aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                        className={`pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md shadow-xs transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
                          isWish
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-white/90 text-gray-700 hover:text-rose-600 border border-gray-200/80 hover:bg-white'
                        }`}
                      >
                        <HeartIcon className="w-3.5 h-3.5" filled={isWish} />
                      </button>
                    </div>

                    <div className="absolute bottom-1.5 left-2 pointer-events-none">
                      <span className="rounded bg-black/55 backdrop-blur-md px-1.5 py-0.5 text-[8.5px] font-bold text-white uppercase tracking-wider">
                        {product.brand || product.category}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <Link
                        to={`/product/${product.id}`}
                        className="block font-bold text-gray-900 text-xs sm:text-[13.5px] transition-colors hover:text-emerald-800 line-clamp-1 leading-snug"
                        title={product.name}
                      >
                        {product.name}
                      </Link>

                      {/* Micro Rating */}
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-amber-500 text-[11px]">★</span>
                        <span className="text-[11px] font-semibold text-gray-700 tabular-nums">
                          {product.rating ? Number(product.rating).toFixed(1) : '4.7'}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          ({product.reviews || 42})
                        </span>
                      </div>
                    </div>

                    {/* Price and Add button */}
                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-extrabold text-gray-950 tabular-nums">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>
                        {product.oldPrice && product.oldPrice > product.price && (
                          <span className="text-[10px] text-gray-400 line-through tabular-nums">
                            ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 flex items-center gap-1 cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-900 text-white hover:bg-black'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <span>✓</span>
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <BagIcon className="w-3 h-3 text-amber-300" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </div>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
