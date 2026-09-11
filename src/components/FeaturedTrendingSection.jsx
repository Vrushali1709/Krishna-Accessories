// src/components/FeaturedTrendingSection.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import {
  HeartIcon,
  BagIcon,
  StarIcon,
  ArrowRightIcon,
  TagIcon
} from './Icons';

export default function FeaturedTrendingSection({ products = [], onToast }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('trending'); // 'trending', 'featured', 'top-rated', 'best-deals'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cardLimit, setCardLimit] = useState(8); // 4 or 8 product cards
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

  // Auth requirement check for wishlist
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
      onToast(`✓ Added "${product.name}" to your cart`);
    }

    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  // Curated category filter pills
  const categoryFilters = ['All', 'Watches', 'Bags & Wallets', 'Shoes', 'Mobiles', 'Electronics', 'Laptops'];

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
        // Trending: Products with highest reviews and rating score
        list.sort((a, b) => {
          const scoreB = (Number(b.reviews) || 0) * 2 + (Number(b.rating) || 4.5) * 10;
          const scoreA = (Number(a.reviews) || 0) * 2 + (Number(a.rating) || 4.5) * 10;
          return scoreB - scoreA;
        });
        break;

      case 'featured':
        // Featured: Hand-picked luxury flagships across brands
        list.sort((a, b) => {
          const isLuxuryA = ['Rolex', 'Titan', 'Apple', 'Dell', 'Hidesign', 'Jordan', 'Samsung'].includes(a.brand) ? 1 : 0;
          const isLuxuryB = ['Rolex', 'Titan', 'Apple', 'Dell', 'Hidesign', 'Jordan', 'Samsung'].includes(b.brand) ? 1 : 0;
          return isLuxuryB - isLuxuryA || (b.price || 0) - (a.price || 0);
        });
        break;

      case 'top-rated':
        // Top Rated: Highest rating score
        list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
        break;

      case 'best-deals':
        // Best Deals: Highest discount percentage
        list.sort((a, b) => {
          const discB = b.discount || (b.oldPrice && b.oldPrice > b.price ? Math.round(((b.oldPrice - b.price) / b.oldPrice) * 100) : 0);
          const discA = a.discount || (a.oldPrice && a.oldPrice > a.price ? Math.round(((a.oldPrice - a.price) / a.oldPrice) * 100) : 0);
          return discB - discA;
        });
        break;

      default:
        break;
    }

    return list.slice(0, cardLimit);
  }, [products, activeTab, selectedCategory, cardLimit]);

  return (
    <section className="bg-white py-12 sm:py-16 border-t border-b border-gray-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ============================================================
            1. SECTION HEADER
        ============================================================ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
             
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-950 tracking-tight flex items-center gap-2.5">
              <span>Featured / Trending Products</span>
              <span className="text-xl sm:text-2xl text-amber-500">✦</span>
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 max-w-xl">
              Discover our handpicked showcase of top-rated accessories, trending flagship essentials, and exclusive luxury pieces.
            </p>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-1 bg-neutral-100 rounded-2xl border border-neutral-200/80 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('trending')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'trending'
                  ? 'bg-white text-neutral-950 shadow-xs scale-[1.02]'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/50'
              }`}
            >
              <span>🔥</span>
              <span>Trending Now</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('featured')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'featured'
                  ? 'bg-white text-neutral-950 shadow-xs scale-[1.02]'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/50'
              }`}
            >
              <span>✦</span>
              <span>Featured</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('top-rated')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'top-rated'
                  ? 'bg-white text-neutral-950 shadow-xs scale-[1.02]'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/50'
              }`}
            >
              <span>⭐</span>
              <span>Top Rated</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('best-deals')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'best-deals'
                  ? 'bg-white text-neutral-950 shadow-xs scale-[1.02]'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/50'
              }`}
            >
              <span>🏷️</span>
              <span>Best Deals</span>
            </button>
          </div>
        </div>

        {/* ============================================================
            2. SUB-BAR: CATEGORY PILLS & CARD COUNT TOGGLE (4 vs 8)
        ============================================================ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-neutral-100">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categoryFilters.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-neutral-50 text-neutral-600 border border-neutral-200/70 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Cards Display Selector (4 vs 8) */}
         
        </div>

        {/* ============================================================
            3. PRODUCT CARDS GRID (4–8 CARDS)
        ============================================================ */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
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

              if (activeTab === 'trending' || idx === 0) {
                badgeText = '🔥 Trending';
                badgeColor = 'bg-amber-500 text-white';
              } else if (activeTab === 'best-deals' || discount >= 25) {
                badgeText = `${discount}% OFF`;
                badgeColor = 'bg-rose-600 text-white';
              } else if (product.rating >= 4.8) {
                badgeText = '★ Top Pick';
                badgeColor = 'bg-neutral-900 text-white';
              } else {
                badgeText = '✦ Featured';
                badgeColor = 'bg-slate-900 text-white';
              }

              return (
                <div
                  key={`feat-trend-${product.id}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/90 bg-white p-3 sm:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_14px_30px_rgba(0,0,0,0.09)] hover:border-gray-300 hover:-translate-y-1.5"
                >
                  {/* 1. Product Image Frame with Hover Effects */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F5F4F0]">
                    <Link
                      to={`/product/${product.id}`}
                      className="flex h-full w-full items-center justify-center cursor-pointer"
                    >
                      <img
                        src={product.image || product.images?.[0]}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
                        loading="lazy"
                      />
                    </Link>

                    {/* Top Badges & Actions */}
                    <div className="absolute top-2 inset-x-2 z-10 flex items-center justify-between pointer-events-none">
                      {/* Dynamic Badge */}
                      <span className={`rounded-md px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider shadow-xs backdrop-blur-xs ${badgeColor}`}>
                        {badgeText}
                      </span>

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={(e) => handleWishlistToggle(e, product)}
                        aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                        className={`pointer-events-auto flex h-7.5 w-7.5 items-center justify-center rounded-full shadow-xs backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
                          isWish
                            ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-100'
                            : 'bg-white/90 text-gray-700 hover:text-rose-600 border border-gray-200/80 hover:bg-white'
                        }`}
                        title={isWish ? 'In Wishlist' : 'Add to Wishlist'}
                      >
                        <HeartIcon className="w-3.5 h-3.5 transition-colors" filled={isWish} />
                      </button>
                    </div>

                    {/* Category Overlay Tag */}
                    <div className="absolute bottom-2 left-2 pointer-events-none">
                      <span className="rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[9px] font-semibold text-white/90 uppercase tracking-wide">
                        {product.brand || product.category}
                      </span>
                    </div>
                  </div>

                  {/* 2. Product Information */}
                  <div className="pt-3 flex flex-1 flex-col justify-between text-center">
                    <div>
                      {/* Product Name */}
                      <Link
                        to={`/product/${product.id}`}
                        className="block font-bold text-gray-900 text-[13.5px] sm:text-[14.5px] transition-colors duration-150 hover:text-emerald-800 line-clamp-1 leading-snug"
                        title={product.name}
                      >
                        {product.name}
                      </Link>

                      {/* Rating (Stars + Score + Review count) */}
                      <div className="flex items-center justify-center gap-1.5 mt-1.5">
                        <div className="flex items-center text-[#F59E0B]">
                          {[...Array(5)].map((_, starI) => (
                            <StarIcon key={starI} className="w-3 h-3 text-[#F59E0B]" filled={true} />
                          ))}
                        </div>
                        <span className="font-bold text-gray-800 text-[11.5px]">
                          {product.rating ? Number(product.rating).toFixed(1) : '4.8'}
                        </span>
                        <span className="text-gray-400 text-[10.5px]">
                          ({product.reviews || 45})
                        </span>
                      </div>

                      {/* Price Row (Current Price + Old Price) */}
                      <div className="flex items-baseline justify-center gap-2 mt-2">
                        <span className="text-base sm:text-lg font-bold text-gray-950 tabular-nums">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>

                        {product.oldPrice && product.oldPrice > product.price && (
                          <span className="text-xs sm:text-sm text-gray-400 line-through tabular-nums">
                            ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                          </span>
                        )}

                        {discount > 0 && (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                            {discount}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 3. Add to Cart Button */}
                    <div className="mt-3.5">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`w-full py-2.5 px-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-98 shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700'
                            : 'bg-[#111827] text-white hover:bg-black hover:shadow-md'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <span className="text-sm">✓</span>
                            <span>Added to Cart</span>
                          </>
                        ) : (
                          <>
                            <BagIcon className="w-3.5 h-3.5 text-amber-300" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl bg-neutral-50 border border-neutral-200/80">
            <p className="text-sm font-semibold text-neutral-700">No products found in this category.</p>
            <button
              type="button"
              onClick={() => { setSelectedCategory('All'); setActiveTab('trending'); }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-black cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ============================================================
            4. SECTION FOOTER CALL TO ACTION
        ============================================================ */}
        <div className="mt-10 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-black hover:shadow-lg hover:scale-[1.02] active:scale-98 shadow-xs"
          >
            <span>Explore All {products.length} Products</span>
            <ArrowRightIcon className="w-4 h-4 text-amber-300" />
          </Link>

          <Link
            to="/shop?filter=offers"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-800 transition hover:border-neutral-500 hover:bg-neutral-50 shadow-2xs"
          >
            <TagIcon className="w-4 h-4 text-rose-600" />
            <span>View Today&apos;s Deals</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
