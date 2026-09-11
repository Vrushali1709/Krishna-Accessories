// src/components/NewArrivalsSection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import { Reveal } from './useScrollReveal';
import {
  HeartIcon,
  BagIcon,
  CheckIcon,
  ArrowRightIcon,
  StarIcon
} from './Icons';

export default function NewArrivalsSection({ products = [], onToast }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedTab, setSelectedTab] = useState('All');
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

  // Filter tabs
  const tabs = [
    { id: 'All', label: 'All Novelties' },
    { id: 'Watches', label: 'Timepieces' },
    { id: 'Bags & Wallets', label: 'Leather Goods' },
    { id: 'Shoes', label: 'Footwear' },
    { id: 'Mobiles', label: 'Flagship Tech' },
    { id: 'Electronics', label: 'Audio & Gear' }
  ];

  const filteredItems = products.filter((p) => {
    if (selectedTab === 'All') return true;
    return p.category?.toLowerCase() === selectedTab.toLowerCase();
  });

  const spotlightItem = filteredItems[0] || products[0];
  const companionItems = filteredItems.slice(1, 4).length > 0
    ? filteredItems.slice(1, 4)
    : products.slice(1, 4);

  // Auth requirement check
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

  const handleQuickAdd = (e, product) => {
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

  if (!spotlightItem) return null;

  return (
    <section className="bg-white py-14 sm:py-20 border-b border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <Reveal direction="up" delay={50}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-neutral-400">
                  NEW RELEASES 2026
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-neutral-950">
                Fresh Arrivals & Novelties
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-lg">
                Fresh seasonal arrivals, limited-run mechanical novelties, and authorized brand releases.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {tabs.map((tab) => {
                const isActive = selectedTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedTab(tab.id)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-neutral-950 text-white shadow-xs scale-[1.02]'
                        : 'bg-neutral-100 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Asymmetric Showcase: Large Left Spotlight + Right 3 Companion Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

          {/* 1. Large Left Spotlight Master Card (5 Cols) */}
          <div className="lg:col-span-5">
            <Reveal direction="left" delay={80} duration={750} className="h-full">
              <div className="group relative flex flex-col justify-between h-full rounded-3xl border border-neutral-200/90 bg-[#FAF9F6] p-5 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-amber-400/80 hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)]">
                
                {/* Spotlight Image with Glass Badges */}
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white border border-neutral-200/60">
                  <Link to={`/product/${spotlightItem.id}`} className="flex h-full w-full items-center justify-center overflow-hidden">
                    <img
                      src={spotlightItem.image || spotlightItem.images?.[0]}
                      alt={spotlightItem.name}
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                  </Link>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/85 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 shadow-md border border-white/10">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Hero Novelty
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => handleWishlistToggle(e, spotlightItem)}
                    className={`absolute top-3 right-3 z-10 flex h-8.5 w-8.5 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-300 hover:scale-115 cursor-pointer ${
                      wishlistMap[spotlightItem.id]
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-white/90 text-gray-700 hover:text-rose-600 border border-gray-200'
                    }`}
                  >
                    <HeartIcon className="w-4 h-4" filled={Boolean(wishlistMap[spotlightItem.id])} />
                  </button>
                </div>

                {/* Information */}
                <div className="pt-5 flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#C5A880]">
                        {spotlightItem.brand || spotlightItem.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-amber-500">
                        <StarIcon className="w-3.5 h-3.5" filled={true} />
                        <span className="font-bold text-gray-800 tabular-nums">
                          {spotlightItem.rating || '4.9'}
                        </span>
                        <span className="text-gray-400 font-normal">
                          ({spotlightItem.reviews || 95})
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/product/${spotlightItem.id}`}
                      className="block font-serif text-xl sm:text-2xl font-normal text-neutral-950 mt-1.5 hover:text-black line-clamp-2 leading-snug"
                      title={spotlightItem.name}
                    >
                      {spotlightItem.name}
                    </Link>

                    <p className="mt-2 text-xs sm:text-sm text-neutral-600 font-light line-clamp-2 leading-relaxed">
                      {spotlightItem.description || 'Crafted with premium materials, surgical-grade finishing, and backed by authentic manufacturer warranty.'}
                    </p>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="mt-6 pt-4 border-t border-neutral-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10.5px] text-neutral-400 uppercase tracking-wider block font-light">Price</span>
                      <span className="text-xl sm:text-2xl font-black text-neutral-950 font-mono">
                        ₹{Number(spotlightItem.price).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, spotlightItem)}
                        className={`py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          addedMap[spotlightItem.id]
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-950 text-white hover:bg-black'
                        }`}
                      >
                        {addedMap[spotlightItem.id] ? (
                          <>
                            <CheckIcon className="w-3.5 h-3.5 text-white" />
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
                        onClick={(e) => handleBuyNow(e, spotlightItem)}
                        className="py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#E8D4B4] text-black hover:bg-[#DFC59E] transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </Reveal>
          </div>

          {/* 2. Right 3 Companion Cards (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            {companionItems.map((product, idx) => {
              const isWish = Boolean(wishlistMap[product.id]);
              const isAdded = Boolean(addedMap[product.id]);

              return (
                <Reveal key={`companion-${product.id}`} direction="right" delay={100 + idx * 80} duration={650}>
                  <div className="group relative flex flex-col sm:flex-row items-stretch rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-neutral-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1">
                    
                    {/* Image */}
                    <div className="relative aspect-square sm:w-36 md:w-40 sm:h-auto shrink-0 overflow-hidden rounded-xl bg-[#F6F5F2]">
                      <Link to={`/product/${product.id}`} className="flex h-full w-full items-center justify-center overflow-hidden">
                        <img
                          src={product.image || product.images?.[0]}
                          alt={product.name}
                          className="h-full w-full object-cover object-center transition-transform duration-600 ease-out group-hover:scale-108"
                          loading="lazy"
                        />
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => handleWishlistToggle(e, product)}
                        className={`absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full shadow-xs backdrop-blur-md transition-all duration-300 hover:scale-110 cursor-pointer ${
                          isWish ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-white/90 text-gray-700 hover:text-rose-600'
                        }`}
                      >
                        <HeartIcon className="w-3.5 h-3.5" filled={isWish} />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="mt-3 sm:mt-0 sm:ml-5 flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#C5A880]">
                            {product.brand || product.category}
                          </span>
                          <span className="text-xs text-gray-500 font-semibold">
                            ★ {product.rating || '4.8'}
                          </span>
                        </div>

                        <Link
                          to={`/product/${product.id}`}
                          className="block font-bold text-neutral-900 text-sm sm:text-[15px] hover:text-black line-clamp-1 mt-1 leading-snug"
                          title={product.name}
                        >
                          {product.name}
                        </Link>

                        <p className="text-xs text-neutral-500 mt-1 line-clamp-1 font-light">
                          {product.description || '100% Certified Authentic with manufacturer warranty.'}
                        </p>
                      </div>

                      <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base sm:text-lg font-black text-neutral-950 font-mono">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>
                          {product.oldPrice && product.oldPrice > product.price && (
                            <span className="text-xs text-neutral-400 line-through font-light">
                              ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(e, product)}
                            className={`py-1.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                              isAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-neutral-900 text-white hover:bg-black'
                            }`}
                          >
                            {isAdded ? (
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

                          <Link
                            to={`/product/${product.id}`}
                            className="hidden sm:inline-flex items-center justify-center p-1.5 rounded-xl border border-gray-200 hover:border-black text-gray-700 hover:text-black transition-colors"
                            title="View details"
                          >
                            <ArrowRightIcon className="w-3.5 h-3.5" />
                          </Link>
                        </div>
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
