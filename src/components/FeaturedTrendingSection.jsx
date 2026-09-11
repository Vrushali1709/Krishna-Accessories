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
  TagIcon,
  CheckIcon
} from './Icons';

export default function FeaturedTrendingSection({ products = [], onToast }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('trending'); // 'trending', 'featured', 'top-rated', 'best-deals'
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
    }, 1800);
  };

  const handleBuyNow = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  // Category filter list
  const categoryFilters = [
    'All',
    'Watches',
    'Bags & Wallets',
    'Shoes',
    'Mobiles',
    'Electronics',
    'Laptops',
    'Smart Gadgets',
    'Fashion Accessories'
  ];

  // Tab Definitions
  const tabs = [
    { id: 'trending', label: 'Trending Now', icon: '🔥' },
    { id: 'featured', label: 'Featured Picks', icon: '✦' },
    { id: 'top-rated', label: 'Top Rated', icon: '⭐' },
    { id: 'best-deals', label: 'Special Deals', icon: '🏷️' }
  ];

  // Compute products according to active tab and category
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (selectedCategory !== 'All') {
      list = list.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter & Sort by Tab
    switch (activeTab) {
      case 'trending':
        list.sort((a, b) => {
          const scoreB = (Number(b.reviews) || 0) * 2 + (Number(b.rating) || 4.5) * 10;
          const scoreA = (Number(a.reviews) || 0) * 2 + (Number(a.rating) || 4.5) * 10;
          return scoreB - scoreA;
        });
        break;

      case 'featured':
        list.sort((a, b) => {
          const isLuxuryA = ['Rolex', 'Titan', 'Apple', 'Dell', 'Hidesign', 'Nike', 'Sony'].includes(a.brand) ? 1 : 0;
          const isLuxuryB = ['Rolex', 'Titan', 'Apple', 'Dell', 'Hidesign', 'Nike', 'Sony'].includes(b.brand) ? 1 : 0;
          return isLuxuryB - isLuxuryA || (b.price || 0) - (a.price || 0);
        });
        break;

      case 'top-rated':
        list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
        break;

      case 'best-deals':
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
    <section className="bg-[#FAFBFD] py-8 sm:py-10 border-t border-b border-gray-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ============================================================
            1. SECTION HEADER WITH TABS
        ============================================================ */}
        <Reveal direction="up" delay={50}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#C5A880] animate-pulse" />
                <span className="text-[10.5px] sm:text-xs font-bold uppercase tracking-[0.28em] text-[#9E8362]">
                  CURATED SELECTION
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-950 mt-1.5">
                Featured &amp; Trending Products
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 max-w-xl leading-relaxed">
                Explore our handpicked curation of best-selling luxury timepieces, leather goods, smart electronics, and footwear.
              </p>
            </div>

            {/* Interactive Feature Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-1.5 bg-neutral-200/60 backdrop-blur-md rounded-2xl border border-neutral-300/60 shadow-xs self-start lg:self-auto">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-neutral-950 text-white shadow-md scale-[1.02]'
                        : 'text-neutral-700 hover:text-black hover:bg-white/70'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* ============================================================
            2. CATEGORY FILTER SUB-BAR
        ============================================================ */}
        <Reveal direction="up" delay={100}>
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar scroll-smooth">
            {categoryFilters.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 text-xs sm:text-[12.5px] font-bold rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer shadow-2xs ${
                    isActive
                      ? 'bg-white text-gray-950 border-2 border-gray-950 shadow-xs font-black scale-[1.03]'
                      : 'bg-white text-gray-600 border border-gray-200/90 hover:border-gray-400 hover:text-gray-950 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* ============================================================
            3. PRODUCT CARDS GRID (PROPER SIZES & LUXURY SPACING)
        ============================================================ */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
            {filteredProducts.map((product, idx) => {
              const isWish = Boolean(wishlistMap[product.id]);
              const isAdded = Boolean(addedMap[product.id]);

              const discount = product.discount || (
                product.oldPrice && product.oldPrice > product.price
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                  : 0
              );

              // Visual badge determination
              let badgeText = '';
              let badgeColor = '';

              if (discount >= 20) {
                badgeText = `${discount}% OFF`;
                badgeColor = 'bg-rose-600 text-white';
              } else if (activeTab === 'trending' || idx === 0) {
                badgeText = '🔥 TRENDING';
                badgeColor = 'bg-amber-500 text-white';
              } else if (product.rating >= 4.8) {
                badgeText = '★ TOP RATED';
                badgeColor = 'bg-neutral-900 text-white';
              } else {
                badgeText = '✦ LUXE PICK';
                badgeColor = 'bg-neutral-900 text-white';
              }

              return (
                <Reveal key={`feat-trend-${activeTab}-${selectedCategory}-${product.id}`} direction="up" delay={(idx % 4) * 80} duration={650}>
                  <div className="group relative flex flex-col justify-between h-full rounded-[24px] sm:rounded-[28px] border border-gray-200/90 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-400 hover:shadow-[0_20px_45px_rgba(0,0,0,0.09)] hover:border-amber-400/70 hover:-translate-y-2">
                    
                    {/* 1. Product Image Frame with Hover Canvas */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-gradient-to-b from-[#F7F7F8] to-[#EDEDF0] mb-4">
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

                      {/* Top Badges & Actions Overlay */}
                      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
                        {/* Dynamic Badge */}
                        <span className={`rounded-lg px-2.5 py-1 text-[9.5px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md border border-white/10 ${badgeColor}`}>
                          {badgeText}
                        </span>

                        {/* Wishlist Button */}
                        <button
                          type="button"
                          onClick={(e) => handleWishlistToggle(e, product)}
                          aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                          className={`pointer-events-auto flex h-8.5 w-8.5 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-300 hover:scale-115 active:scale-90 cursor-pointer ${
                            isWish
                              ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-100 scale-105'
                              : 'bg-white/95 text-gray-700 hover:text-rose-600 border border-gray-200/90 hover:bg-white'
                          }`}
                          title={isWish ? 'In Wishlist' : 'Add to Wishlist'}
                        >
                          <HeartIcon className="w-4 h-4 transition-colors" filled={isWish} />
                        </button>
                      </div>

                      {/* Brand / Category Subtle Floating Bottom Pill */}
                      <div className="absolute bottom-2.5 left-3 pointer-events-none">
                        <span className="rounded-full bg-black/65 backdrop-blur-md px-2.5 py-0.5 text-[9.5px] font-bold text-white uppercase tracking-wider border border-white/10">
                          {product.brand || product.category}
                        </span>
                      </div>
                    </div>

                    {/* 2. Product Information Content */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        {/* Category & Verified Sourcing */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A880]">
                            {product.category}
                          </span>
                          <span className="text-[10px] font-medium text-neutral-400">
                            Premium Quality
                          </span>
                        </div>

                        {/* Product Title */}
                        <Link
                          to={`/product/${product.id}`}
                          className="block font-bold text-gray-950 text-[15px] sm:text-[16px] transition-colors duration-200 hover:text-[#9E8362] line-clamp-1 leading-snug"
                          title={product.name}
                        >
                          {product.name}
                        </Link>

                        {/* Rating Stars & Customer Review Count */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className="flex items-center text-amber-500">
                            {[...Array(5)].map((_, starI) => (
                              <StarIcon key={starI} className="w-3.5 h-3.5 text-amber-400" filled={true} />
                            ))}
                          </div>
                          <span className="font-bold text-gray-900 text-xs tabular-nums ml-0.5">
                            {product.rating ? Number(product.rating).toFixed(1) : '4.9'}
                          </span>
                          <span className="text-gray-400 text-[11px] tabular-nums">
                            ({product.reviews || 48} reviews)
                          </span>
                        </div>

                        {/* Price Architecture (Price + MRP + Save Pill) */}
                        <div className="flex items-baseline gap-2 mt-3 pt-2.5 border-t border-gray-100">
                          <span className="text-lg sm:text-xl font-black text-gray-950 tabular-nums">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>

                          {product.oldPrice && product.oldPrice > product.price && (
                            <span className="text-xs sm:text-sm text-neutral-400 line-through tabular-nums font-normal">
                              ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                            </span>
                          )}

                          {discount > 0 && (
                            <span className="ml-auto text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                              Save {discount}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 3. Action Buttons (Add to Bag & Buy Now) */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                        {/* Primary Add to Bag Button */}
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, product)}
                          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700 scale-[1.02]'
                              : 'bg-neutral-950 text-white hover:bg-black hover:shadow-md'
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

                        {/* Secondary Instant Buy Now Button */}
                        <button
                          type="button"
                          onClick={(e) => handleBuyNow(e, product)}
                          className="px-3.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider border border-gray-300 bg-white text-gray-800 hover:border-gray-950 hover:bg-gray-50 transition-all duration-300 active:scale-95 cursor-pointer shadow-2xs"
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
        ) : (
          <div className="text-center py-16 rounded-3xl bg-white border border-gray-200/80 shadow-xs">
            <p className="text-sm font-semibold text-neutral-700">No products found for the selected filter.</p>
            <button
              type="button"
              onClick={() => { setSelectedCategory('All'); setActiveTab('trending'); }}
              className="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2 text-xs font-bold text-white hover:bg-black cursor-pointer shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
