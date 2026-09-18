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
    <section className="relative w-full floor-midnight-salon py-14 sm:py-20 border-b border-neutral-800/90 text-white overflow-hidden">
      {/* Ambient Top Light Beam */}
      <div className="pointer-events-none absolute -top-32 inset-x-0 mx-auto h-72 w-full max-w-4xl rounded-full bg-[#C5A880]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ============================================================
            1. SECTION HEADER WITH TABS
        ============================================================ */}
        <Reveal direction="up" delay={50}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-1.5 w-6 rounded-full bg-[#C5A880]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D5C2A5]">
                  FLAGSHIP SALON
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-1">
                Featured &amp; Trending Products
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed font-light">
                Explore our handpicked curation of best-selling luxury timepieces, leather goods, smart electronics, and footwear.
              </p>
            </div>

            {/* Interactive Feature Tabs in Brushed Onyx & Gold */}
            <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-[#121622]/90 backdrop-blur-md rounded-2xl border border-[#C5A880]/30 shadow-xl w-full lg:w-auto sm:flex sm:flex-wrap sm:items-center sm:gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 text-center ${
                      isActive
                        ? 'bg-gradient-to-r from-[#C5A880] to-[#DFCCA8] text-black shadow-lg font-black scale-[1.02]'
                        : 'text-neutral-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-sm shrink-0">{tab.icon}</span>
                    <span className="truncate">{tab.label}</span>
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
          <div className="flex items-center gap-2 overflow-x-auto pb-2.5 mb-8 sm:mb-10 no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
            {categoryFilters.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-4 py-2 text-xs font-bold rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-black shadow-md scale-[1.03]'
                      : 'bg-[#151B28] text-neutral-300 border border-white/10 hover:border-[#C5A880]/70 hover:text-white hover:bg-[#1A2234]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* ============================================================
            3. PRODUCT CARDS GRID (LUXURY MIDNIGHT PEDESTALS)
        ============================================================ */}
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
                badgeColor = 'bg-[#C5A880] text-black font-black';
              } else {
                badgeText = '✦ LUXE PICK';
                badgeColor = 'bg-white/20 text-white backdrop-blur-md';
              }

              return (
                <Reveal key={`feat-trend-${activeTab}-${selectedCategory}-${product.id}`} direction="up" delay={(idx % 4) * 80} duration={650}>
                  <div className="group relative flex flex-col justify-between h-full rounded-3xl border border-white/10 bg-[#121724] p-3.5 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-400 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] hover:border-[#C5A880]/70 hover:-translate-y-2">
                    
                    {/* 1. Product Image Frame with Hover Canvas */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#090C14] mb-3.5 sm:mb-4 border border-white/5">
                      <Link
                        to={`/product/${product.id}`}
                        className="relative flex h-full w-full items-center justify-center cursor-pointer overflow-hidden"
                      >
                        <img
                          src={product.image || product.images?.[0]}
                          alt={product.name}
                          className={`h-full w-full object-cover object-center transition-all duration-500 ease-out ${
                            product.images && product.images.length > 1
                              ? 'group-hover:opacity-0 group-hover:scale-105'
                              : 'group-hover:scale-108'
                          }`}
                          loading="lazy"
                        />
                        {product.images && product.images.length > 1 && (
                          <img
                            src={product.images[1]}
                            alt={`${product.name} alternate angle`}
                            className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-105 pointer-events-none"
                            loading="lazy"
                          />
                        )}
                      </Link>

                      {/* Top Badges & Actions Overlay */}
                      <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
                        {/* Dynamic Badge */}
                        <span className={`rounded-lg px-2.5 py-1 text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md border border-white/10 ${badgeColor}`}>
                          {badgeText}
                        </span>

                        {/* Wishlist Button */}
                        <button
                          type="button"
                          onClick={(e) => handleWishlistToggle(e, product)}
                          aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                          className={`pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-300 hover:scale-115 active:scale-90 cursor-pointer ${
                            isWish
                              ? 'bg-rose-500 text-white shadow-rose-900/50 scale-105'
                              : 'bg-black/60 text-white/80 hover:text-rose-400 border border-white/20 hover:bg-black/90'
                          }`}
                          title={isWish ? 'In Wishlist' : 'Add to Wishlist'}
                        >
                          <HeartIcon className="w-3.5 h-3.5 transition-colors" filled={isWish} />
                        </button>
                      </div>

                      {/* Brand / Category Subtle Floating Bottom Pill */}
                      <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
                        <span className="rounded-full bg-black/75 backdrop-blur-md px-2.5 py-0.5 text-[8.5px] sm:text-[9.5px] font-bold text-[#E5D7C5] uppercase tracking-wider border border-white/10">
                          {product.brand || product.category}
                        </span>
                      </div>
                    </div>

                    {/* 2. Product Information Content */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        {/* Category Tag */}
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A880] truncate">
                            {product.category}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-medium text-neutral-400">
                            Verified
                          </span>
                        </div>

                        {/* Product Title */}
                        <Link
                          to={`/product/${product.id}`}
                          className="block font-bold text-white text-[14px] sm:text-[16px] transition-colors duration-200 hover:text-[#C5A880] line-clamp-1 leading-snug"
                          title={product.name}
                        >
                          {product.name}
                        </Link>

                        {/* Rating Stars & Customer Review Count */}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <div className="flex items-center text-amber-400">
                            <StarIcon className="w-3.5 h-3.5 text-amber-400" filled={true} />
                          </div>
                          <span className="font-bold text-white text-[11px] sm:text-xs tabular-nums">
                            {product.rating ? Number(product.rating).toFixed(1) : '4.9'}
                          </span>
                          <span className="text-neutral-400 text-[10px] sm:text-[11px] tabular-nums truncate">
                            ({product.reviews || 48})
                          </span>
                        </div>

                        {/* Price Architecture */}
                        <div className="flex flex-wrap items-baseline gap-2 mt-2.5 pt-2.5 border-t border-white/10">
                          <span className="text-base sm:text-xl font-extrabold text-white tabular-nums">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>

                          {product.oldPrice && product.oldPrice > product.price && (
                            <span className="text-[11px] sm:text-sm text-neutral-500 line-through tabular-nums font-normal">
                              ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                            </span>
                          )}

                          {discount > 0 && (
                            <span className="ml-auto text-[9px] sm:text-[10px] font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                              -{discount}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 3. Action Buttons (Add to Bag & Buy Now) */}
                      <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-col xs:flex-row items-center gap-2">
                        {/* Primary Add to Bag Button */}
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, product)}
                          className={`w-full flex-1 py-2 sm:py-2.5 px-3 rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-600 text-white shadow-emerald-900/50 scale-[1.02]'
                              : 'bg-white text-black hover:bg-[#E5D7C5] hover:shadow-lg'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <CheckIcon className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <BagIcon className="w-3.5 h-3.5 text-black" />
                              <span className="truncate">Add to Bag</span>
                            </>
                          )}
                        </button>

                        {/* Secondary Instant Buy Now Button */}
                        <button
                          type="button"
                          onClick={(e) => handleBuyNow(e, product)}
                          className="w-full xs:w-auto px-3.5 py-2 sm:py-2.5 rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-wider border border-white/20 bg-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 active:scale-95 cursor-pointer shadow-sm shrink-0"
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
          <div className="text-center py-16 rounded-3xl bg-[#121724] border border-white/10 shadow-xl">
            <p className="text-sm font-semibold text-neutral-300">No products found for the selected filter.</p>
            <button
              type="button"
              onClick={() => { setSelectedCategory('All'); setActiveTab('trending'); }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-2.5 text-xs font-bold text-black hover:bg-[#E5D7C5] cursor-pointer shadow-md"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
