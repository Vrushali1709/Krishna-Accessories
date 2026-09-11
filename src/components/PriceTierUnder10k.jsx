// src/components/PriceTierUnder10k.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import { Reveal } from './useScrollReveal';
import { HeartIcon, BagIcon, ArrowRightIcon, StarIcon } from './Icons';

export default function PriceTierUnder10k({ products = [], onToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [wishlistMap, setWishlistMap] = useState({});
  const [addedMap, setAddedMap] = useState({});

  // Filter products between 5000 and 10000 (or <= 10000 if not enough)
  const under10kItems = products
    .filter((p) => Number(p.price) > 4000 && Number(p.price) <= 10000)
    .slice(0, 4);

  // Fallback if strict range has fewer items
  const displayItems = under10kItems.length >= 2
    ? under10kItems
    : products.filter((p) => Number(p.price) <= 10000).slice(0, 4);

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

  if (displayItems.length === 0) return null;

  return (
    <section className="bg-white py-14 sm:py-20 border-t border-gray-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <Reveal direction="up" delay={50}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-[0.22em] text-blue-900">
                  DISTINGUISHED HOROLOGY & LEATHER
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-gray-950">
                Crafted Excellence <span className="italic font-light text-blue-900">Under ₹10,000</span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-xl">
                Multi-dial chronographs, handcrafted full-grain leather bags, and noise-cancelling lifestyle sound.
              </p>
            </div>

            <Link
              to="/shop?maxPrice=10000"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-900 hover:text-blue-700 transition-colors shrink-0 group"
            >
              <span>View All Under ₹10,000</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        {/* 2x2 Grid of Horizontal Split Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {displayItems.map((product, idx) => {
            const isWish = Boolean(wishlistMap[product.id]);
            const isAdded = Boolean(addedMap[product.id]);
            const discount = product.discount || (
              product.oldPrice && product.oldPrice > product.price
                ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                : 0
            );

            return (
              <Reveal key={`u10k-${product.id}`} direction="up" delay={idx * 80} duration={650}>
                <div className="group relative flex flex-col sm:flex-row rounded-2xl sm:rounded-3xl border border-gray-200/90 bg-[#FBFBFC] p-3.5 sm:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-blue-200 hover:shadow-[0_16px_36px_rgba(30,58,138,0.06)] hover:bg-white hover:-translate-y-1">

                  {/* Left: Product Image Canvas */}
                  <div className="relative aspect-square sm:w-44 md:w-48 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl bg-[#F0F1F4] mb-3 sm:mb-0">
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

                    {/* Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      {discount > 0 ? (
                        <span className="rounded-md bg-blue-950/85 backdrop-blur-md px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-blue-200 shadow-xs border border-white/10">
                          {discount}% OFF
                        </span>
                      ) : (
                        <span className="rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                          Under ₹10k
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => handleWishlistToggle(e, product)}
                      aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                      className={`absolute top-2 right-2 flex h-7.5 w-7.5 items-center justify-center rounded-full backdrop-blur-md shadow-xs transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
                        isWish
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-white/90 text-gray-700 hover:text-rose-600 border border-gray-200/80 hover:bg-white'
                      }`}
                    >
                      <HeartIcon className="w-3.5 h-3.5" filled={isWish} />
                    </button>
                  </div>

                  {/* Right: Info, Specs & Actions */}
                  <div className="sm:pl-4 sm:pr-1 flex flex-col justify-between flex-1">
                    <div>
                      {/* Eyebrow / Brand */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 truncate">
                          {product.brand || product.category}
                        </span>
                        <span className="text-[9.5px] font-mono text-blue-800 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                          {product.subcategory || 'GENUINE'}
                        </span>
                      </div>

                      {/* Title */}
                      <Link
                        to={`/product/${product.id}`}
                        className="block font-bold text-gray-950 text-sm sm:text-[15px] transition-colors hover:text-blue-700 line-clamp-1 leading-snug"
                        title={product.name}
                      >
                        {product.name}
                      </Link>

                      {/* Brief description / specs snippet */}
                      <p className="mt-1 text-[11px] sm:text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {product.description || 'Authentic certified piece with official brand warranty and premium materials.'}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex items-center text-amber-500 text-xs">
                          {'★'.repeat(5)}
                        </div>
                        <span className="text-xs font-bold text-gray-800 tabular-nums">
                          {product.rating ? Number(product.rating).toFixed(1) : '4.8'}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          ({product.reviews || 80} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Price and Add to Bag Button */}
                    <div className="mt-4 pt-3 border-t border-gray-200/80 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base sm:text-lg font-extrabold text-gray-950 tabular-nums">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>
                          {product.oldPrice && product.oldPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through tabular-nums">
                              ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-neutral-900 text-white hover:bg-black'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <span>✓</span>
                            <span>In Bag</span>
                          </>
                        ) : (
                          <>
                            <BagIcon className="w-3.5 h-3.5 text-amber-300" />
                            <span>Add to Bag</span>
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
