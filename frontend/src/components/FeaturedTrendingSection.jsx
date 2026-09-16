// src/components/FeaturedTrendingSection.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import { Reveal } from './useScrollReveal';
import {
  HeartIcon,
  BagIcon,
  StarIcon,
  ArrowRightIcon,
  CheckIcon
} from './Icons';

export default function FeaturedTrendingSection({ products = [], onToast }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('curated'); // 'curated', 'new-drops', 'best-sellers', 'offers'
  const [selectedCategory, setSelectedCategory] = useState('All');
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

  const handleWishlistToggle = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireLogin('wishlist')) return;

    const active = toggleWishlist(product);
    setWishlistMap((prev) => ({ ...prev, [product.id]: active }));
    if (onToast) {
      onToast(active ? `Saved "${product.name}" to wishlist` : `Removed "${product.name}" from wishlist`);
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    if (onToast) {
      onToast(`Added "${product.name}" to shopping bag`);
    }

    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const handleBuyNow = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  // Primary curated tabs
  const tabs = [
    { id: 'curated', label: 'Curated Essentials' },
    { id: 'new-drops', label: 'New Arrivals' },
    { id: 'best-sellers', label: 'Most Desired' },
    { id: 'offers', label: 'Special Offers' }
  ];

  // Category filter list
  const categoryFilters = [
    'All',
    'Watches',
    'Bags & Wallets',
    'Shoes',
    'Mobiles',
    'Electronics',
    'Fashion Accessories'
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (selectedCategory !== 'All') {
      list = list.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort by Tab
    switch (activeTab) {
      case 'curated':
        list.sort((a, b) => {
          const isLuxeA = ['Rolex', 'Titan', 'Apple', 'Hidesign', 'Sony', 'Bose'].includes(a.brand) ? 1 : 0;
          const isLuxeB = ['Rolex', 'Titan', 'Apple', 'Hidesign', 'Sony', 'Bose'].includes(b.brand) ? 1 : 0;
          return isLuxeB - isLuxeA || (Number(b.rating) || 4.5) - (Number(a.rating) || 4.5);
        });
        break;

      case 'new-drops':
        list.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;

      case 'best-sellers':
        list.sort((a, b) => {
          const scoreB = (Number(b.reviews) || 0) * 2 + (Number(b.rating) || 4.5) * 10;
          const scoreA = (Number(a.reviews) || 0) * 2 + (Number(a.rating) || 4.5) * 10;
          return scoreB - scoreA;
        });
        break;

      case 'offers':
        list.sort((a, b) => {
          const discB = b.discount || (b.oldPrice && b.oldPrice > b.price ? Math.round(((b.oldPrice - b.price) / b.oldPrice) * 100) : 0);
          const discA = a.discount || (a.oldPrice && a.oldPrice > a.price ? Math.round(((a.oldPrice - a.price) / a.oldPrice) * 100) : 0);
          return discB - discA;
        });
        break;

      default:
        break;
    }

    return list.slice(0, 8);
  }, [products, activeTab, selectedCategory]);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* 1. Header with Clean Minimal Tabs */}
      <Reveal direction="up" delay={40}>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
              TIMELESS SELECTION
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-950">
              Featured Collection
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 max-w-lg leading-relaxed">
              Explore our quintessential pieces across Swiss horology, genuine leathercraft, and acoustic electronics.
            </p>
          </div>

          {/* Clean Segmented Tab Control */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-full border border-neutral-200/80 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-neutral-950 text-white shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* 2. Minimalist Category Filter Pills */}
      <Reveal direction="up" delay={80}>
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {categoryFilters.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer shadow-2xs ${
                  isActive
                    ? 'bg-neutral-950 text-white font-semibold'
                    : 'bg-white text-neutral-700 border border-neutral-200/90 hover:border-neutral-400 hover:text-neutral-950'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* 3. Product Cards Grid (8 Clean Cards) */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-7">
          {filteredProducts.map((product, idx) => {
            const isWish = Boolean(wishlistMap[product.id]);
            const isAdded = Boolean(addedMap[product.id]);

            const discount = product.discount || (
              product.oldPrice && product.oldPrice > product.price
                ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                : 0
            );

            return (
              <Reveal key={`feat-prod-${product.id}`} direction="up" delay={(idx % 4) * 60} duration={600}>
                <div className="group relative flex flex-col justify-between h-full rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-3 sm:p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.07)] hover:border-neutral-300 hover:-translate-y-1">
                  
                  {/* Image Container with Warm Neutral Background */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#F7F7F8] mb-3">
                    <Link
                      to={`/product/${product.id}`}
                      className="relative flex h-full w-full items-center justify-center overflow-hidden"
                    >
                      <img
                        src={product.image || product.images?.[0]}
                        alt={product.name}
                        className={`h-full w-full object-cover object-center transition-all duration-500 ease-out ${
                          product.images && product.images.length > 1
                            ? 'group-hover:opacity-0 group-hover:scale-105'
                            : 'group-hover:scale-105'
                        }`}
                        loading="lazy"
                      />
                      {product.images && product.images.length > 1 && (
                        <img
                          src={product.images[1]}
                          alt={`${product.name} alternate`}
                          className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-105 pointer-events-none"
                          loading="lazy"
                        />
                      )}
                    </Link>

                    {/* Top Overlay: Badges & Wishlist */}
                    <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
                      {discount >= 10 ? (
                        <span className="rounded-md bg-neutral-900/90 backdrop-blur-md px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-amber-300 shadow-2xs border border-white/10">
                          {discount}% OFF
                        </span>
                      ) : product.isNew ? (
                        <span className="rounded-md bg-neutral-900/90 backdrop-blur-md px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-white shadow-2xs border border-white/10">
                          NEW
                        </span>
                      ) : (
                        <span />
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleWishlistToggle(e, product)}
                        aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                        className={`pointer-events-auto flex h-7.5 w-7.5 items-center justify-center rounded-full shadow-2xs backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
                          isWish
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-white/90 text-neutral-600 hover:text-rose-600 border border-neutral-200 hover:bg-white'
                        }`}
                      >
                        <HeartIcon className="w-3.5 h-3.5" filled={isWish} />
                      </button>
                    </div>

                    {/* Brand Pill */}
                    {product.brand && (
                      <div className="absolute bottom-2 left-2 pointer-events-none">
                        <span className="rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[8.5px] sm:text-[9.5px] font-medium text-white uppercase tracking-wider border border-white/10">
                          {product.brand}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <span className="text-[9.5px] sm:text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
                        {product.category}
                      </span>

                      <Link
                        to={`/product/${product.id}`}
                        className="block font-semibold text-neutral-950 text-[13px] sm:text-[14.5px] transition-colors duration-200 hover:text-neutral-700 line-clamp-1 leading-snug mt-0.5"
                        title={product.name}
                      >
                        {product.name}
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="flex items-center text-amber-500">
                          <StarIcon className="w-3 h-3 text-amber-400" filled={true} />
                        </div>
                        <span className="font-semibold text-neutral-800 text-[11px] tabular-nums">
                          {product.rating ? Number(product.rating).toFixed(1) : '4.8'}
                        </span>
                        <span className="text-neutral-400 text-[10px] tabular-nums">
                          ({product.reviews || 24})
                        </span>
                      </div>

                      {/* Price Row */}
                      <div className="flex items-baseline gap-2 mt-2 pt-2 border-t border-neutral-100">
                        <span className="text-sm sm:text-base font-bold text-neutral-950 tabular-nums">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>

                        {product.oldPrice && product.oldPrice > product.price && (
                          <span className="text-xs text-neutral-400 line-through tabular-nums font-normal">
                            ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`flex-1 py-2 px-3 rounded-xl font-semibold text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                          isAdded
                            ? 'bg-emerald-700 text-white'
                            : 'bg-neutral-950 text-white hover:bg-neutral-800'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <CheckIcon className="w-3.5 h-3.5" />
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
                        className="px-3 py-2 rounded-xl font-medium text-[11px] sm:text-xs uppercase tracking-wider border border-neutral-200 bg-white text-neutral-800 hover:border-neutral-900 hover:bg-neutral-50 transition active:scale-95 cursor-pointer shadow-2xs"
                      >
                        Buy
                      </button>
                    </div>

                  </div>

                </div>
              </Reveal>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
          <p className="text-sm font-medium text-neutral-600">No products found for this filter.</p>
          <button
            type="button"
            onClick={() => { setSelectedCategory('All'); setActiveTab('curated'); }}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-black cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 4. Bottom View All CTA */}
      <Reveal direction="up" delay={120}>
        <div className="mt-10 text-center">
          <Link
            to={selectedCategory !== 'All' ? `/shop?category=${encodeURIComponent(selectedCategory)}` : '/shop'}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-2xs hover:bg-neutral-800 transition active:scale-95"
          >
            <span>Explore All {selectedCategory !== 'All' ? selectedCategory : 'Catalog'}</span>
            <ArrowRightIcon className="w-3.5 h-3.5 text-amber-300" />
          </Link>
        </div>
      </Reveal>

    </section>
  );
}
