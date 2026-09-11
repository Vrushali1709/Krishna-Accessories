// src/components/PriceTierUnder15k.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import { Reveal } from './useScrollReveal';
import { HeartIcon, BagIcon, ArrowRightIcon, StarIcon, CheckIcon } from './Icons';

export default function PriceTierUnder15k({ products = [], onToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [wishlistMap, setWishlistMap] = useState({});
  const [addedMap, setAddedMap] = useState({});

  // Filter products in higher bracket (e.g. > 10000 or high-end items)
  const premiumItems = products
    .filter((p) => Number(p.price) >= 10000)
    .slice(0, 4);

  // Fallback if not enough >= 10000 items: pick top price items
  const displayItems = premiumItems.length >= 2
    ? premiumItems
    : [...products].sort((a, b) => (b.price || 0) - (a.price || 0)).slice(0, 4);

  const heroItem = displayItems[0];
  const sideItems = displayItems.slice(1, 4);

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

  const handleBuyNow = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  if (!heroItem) return null;

  const heroDiscount = heroItem.discount || (
    heroItem.oldPrice && heroItem.oldPrice > heroItem.price
      ? Math.round(((heroItem.oldPrice - heroItem.price) / heroItem.oldPrice) * 100)
      : 0
  );
  const isHeroWish = Boolean(wishlistMap[heroItem.id]);
  const isHeroAdded = Boolean(addedMap[heroItem.id]);

  return (
    <section className="bg-[#0D1117] text-white py-16 sm:py-22 border-t border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <Reveal direction="up" delay={50}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C5A880] animate-pulse" />
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-[0.25em] text-[#D5C2A5]">
                  PRESTIGE & BESPOKE COLLECTION
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-white">
                Executive Spotlight <span className="text-[#C5A880] italic">Under ₹15,000 – ₹20,000+</span>
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-400 max-w-xl font-light">
                Iconic mechanical timepieces, audiophile acoustics, and high-performance flagship devices.
              </p>
            </div>

            <Link
              to="/shop?minPrice=10000"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/80 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:border-[#C5A880] hover:text-[#C5A880] transition-all shrink-0 active:scale-95"
            >
              <span>Explore All Prestige</span>
              <ArrowRightIcon className="w-3.5 h-3.5 text-[#C5A880]" />
            </Link>
          </div>
        </Reveal>

        {/* Asymmetrical Spotlight Layout: 1 Hero Card + 3 Companion Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

          {/* Left Column (7 cols): Major Spotlight Card */}
          <div className="lg:col-span-7 flex flex-col">
            <Reveal direction="left" delay={80} duration={750} className="h-full">
              <div className="group relative h-full rounded-3xl border border-neutral-800 bg-[#161B22] p-5 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-[#C5A880]/60 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

                {/* Big Image Canvas */}
                <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#090C10] mb-5">
                  <Link
                    to={`/product/${heroItem.id}`}
                    className="flex h-full w-full items-center justify-center cursor-pointer overflow-hidden"
                  >
                    <img
                      src={heroItem.image || heroItem.images?.[0]}
                      alt={heroItem.name}
                      className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-106"
                      loading="lazy"
                    />
                  </Link>

                  {/* Gradient Overlay for Mood */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161B22]/80 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between pointer-events-none">
                    <span className="rounded-full bg-black/75 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E5D7C5] border border-[#C5A880]/40">
                      ✦ FLAGSHIP SPOTLIGHT
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleWishlistToggle(e, heroItem)}
                      aria-label={isHeroWish ? 'Remove from wishlist' : 'Add to wishlist'}
                      className={`pointer-events-auto flex h-8.5 w-8.5 items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
                        isHeroWish
                          ? 'bg-rose-950/90 text-rose-400 border border-rose-500/50'
                          : 'bg-black/60 text-white hover:text-rose-400 border border-white/20 hover:bg-black'
                      }`}
                    >
                      <HeartIcon className="w-4 h-4" filled={isHeroWish} />
                    </button>
                  </div>

                  {/* Bottom Brand Stamp */}
                  <div className="absolute bottom-3 left-3.5 pointer-events-none">
                    <span className="text-[11px] font-mono tracking-widest uppercase text-[#C5A880] font-bold bg-black/60 px-2.5 py-0.5 rounded backdrop-blur-md">
                      {heroItem.brand}
                    </span>
                  </div>
                </div>

                {/* Hero Details */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
                      {heroItem.category} • {heroItem.subcategory || 'Luxury Edition'}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      <span>★</span>
                      <span className="font-bold text-white tabular-nums">
                        {heroItem.rating ? Number(heroItem.rating).toFixed(1) : '4.9'}
                      </span>
                      <span className="text-neutral-500 text-[11px]">
                        ({heroItem.reviews || 120})
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/product/${heroItem.id}`}
                    className="block font-serif text-xl sm:text-2xl text-white hover:text-[#C5A880] transition-colors leading-snug line-clamp-1"
                  >
                    {heroItem.name}
                  </Link>

                  <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed line-clamp-2 font-light">
                    {heroItem.description}
                  </p>

                  {/* Specifications Badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-neutral-900 px-2.5 py-1 text-[10.5px] text-neutral-300 border border-neutral-800">
                      <span className="text-[#C5A880]">✓</span> Official Warranty
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-neutral-900 px-2.5 py-1 text-[10.5px] text-neutral-300 border border-neutral-800">
                      <span className="text-[#C5A880]">✓</span> Insured Express Dispatch
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-neutral-900 px-2.5 py-1 text-[10.5px] text-neutral-300 border border-neutral-800">
                      <span className="text-[#C5A880]">✓</span> 100% Certified
                    </span>
                  </div>

                  {/* Price & Actions Row */}
                  <div className="mt-6 pt-5 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                        ₹{Number(heroItem.price).toLocaleString('en-IN')}
                      </span>
                      {heroItem.oldPrice && heroItem.oldPrice > heroItem.price && (
                        <span className="text-sm text-neutral-500 line-through tabular-nums font-normal">
                          ₹{Number(heroItem.oldPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                      {heroDiscount > 0 && (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded">
                          Save {heroDiscount}%
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, heroItem)}
                        className={`py-3 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer ${
                          isHeroAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-black hover:bg-[#E5D7C5]'
                        }`}
                      >
                        {isHeroAdded ? (
                          <>
                            <span>✓</span>
                            <span>Added to Bag</span>
                          </>
                        ) : (
                          <>
                            <BagIcon className="w-3.5 h-3.5 text-black" />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(e, heroItem)}
                        className="py-3 px-5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 border border-neutral-700 bg-neutral-900 text-white hover:border-[#C5A880] cursor-pointer"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </Reveal>
          </div>

          {/* Right Column (5 cols): 3 Stacked Companion Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {sideItems.map((product, idx) => {
              const isWish = Boolean(wishlistMap[product.id]);
              const isAdded = Boolean(addedMap[product.id]);
              const discount = product.discount || (
                product.oldPrice && product.oldPrice > product.price
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                  : 0
              );

              return (
                <Reveal key={`u15k-side-${product.id}`} direction="right" delay={120 + idx * 80} duration={650}>
                  <div className="group relative flex items-center gap-4 rounded-2xl border border-neutral-800 bg-[#161B22] p-3 sm:p-4 transition-all duration-300 hover:border-[#C5A880]/50 hover:bg-[#1C2129]">

                    {/* Left Thumbnail */}
                    <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-[#090C10]">
                      <Link
                        to={`/product/${product.id}`}
                        className="flex h-full w-full items-center justify-center cursor-pointer overflow-hidden"
                      >
                        <img
                          src={product.image || product.images?.[0]}
                          alt={product.name}
                          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
                          loading="lazy"
                        />
                      </Link>

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={(e) => handleWishlistToggle(e, product)}
                        aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                        className={`absolute top-1.5 right-1.5 flex h-6.5 w-6.5 items-center justify-center rounded-full backdrop-blur-md shadow-xs transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
                          isWish
                            ? 'bg-rose-950/90 text-rose-400 border border-rose-500/40'
                            : 'bg-black/60 text-neutral-300 hover:text-rose-400 border border-white/10'
                        }`}
                      >
                        <HeartIcon className="w-3 h-3" filled={isWish} />
                      </button>
                    </div>

                    {/* Right Details */}
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A880] truncate">
                            {product.brand || product.category}
                          </span>
                          {discount > 0 && (
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/30">
                              {discount}% OFF
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/product/${product.id}`}
                          className="block font-bold text-white text-xs sm:text-[13.5px] transition-colors hover:text-[#C5A880] line-clamp-1 leading-snug mt-0.5"
                          title={product.name}
                        >
                          {product.name}
                        </Link>

                        <div className="flex items-center gap-1 mt-1 text-[11px] text-neutral-400">
                          <span className="text-amber-400">★</span>
                          <span className="font-semibold text-neutral-200">
                            {product.rating ? Number(product.rating).toFixed(1) : '4.8'}
                          </span>
                          <span>•</span>
                          <span className="truncate">{product.subcategory || product.category}</span>
                        </div>
                      </div>

                      {/* Price & Quick Add Button */}
                      <div className="mt-2.5 pt-2 border-t border-neutral-800 flex items-center justify-between gap-2">
                        <span className="text-sm sm:text-base font-extrabold text-white tabular-nums">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, product)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 flex items-center gap-1 cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-neutral-800 text-white hover:bg-neutral-700 hover:text-[#C5A880] border border-neutral-700'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <span>✓</span>
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <BagIcon className="w-3 h-3 text-[#C5A880]" />
                              <span>+ Add</span>
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

      </div>
    </section>
  );
}
