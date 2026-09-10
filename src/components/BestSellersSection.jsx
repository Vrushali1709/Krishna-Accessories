// src/components/BestSellersSection.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import {
  HeartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon
} from './Icons';

const BESTSELLER_TABS = [
  { id: 'All', label: 'All Bestsellers' },
  { id: 'Watches', label: 'Watches' },
  { id: 'Shoes', label: 'Footwear' },
  { id: 'Bags & Wallets', label: 'Leather Goods' },
  { id: 'Mobiles', label: 'Smartphones' },
  { id: 'Electronics', label: 'Audio & Tech' }
];

export default function BestSellersSection({ products = [], onToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const carouselRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [wishlistMap, setWishlistMap] = useState(() => {
    const map = {};
    products.forEach((p) => {
      map[p.id] = isInWishlist(p.id);
    });
    return map;
  });
  const [addedMap, setAddedMap] = useState({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Sync wishlist status on storage updates
  const syncWishlist = useCallback(() => {
    const map = {};
    products.forEach((p) => {
      map[p.id] = isInWishlist(p.id);
    });
    setWishlistMap(map);
  }, [products]);

  useEffect(() => {
    window.addEventListener('wishlistUpdated', syncWishlist);
    return () => window.removeEventListener('wishlistUpdated', syncWishlist);
  }, [syncWishlist]);

  // Filter bestselling candidates
  const filteredBestsellers = products
    .filter((p) => {
      if (selectedCategory === 'All') return true;
      return p.category?.toLowerCase() === selectedCategory.toLowerCase();
    })
    .sort((a, b) => ((b.rating || 0) * (b.reviews || 10)) - ((a.rating || 0) * (a.reviews || 10)))
    .slice(0, 10);

  // Scroll boundary check
  const checkScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, filteredBestsellers, selectedCategory]);

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cardWidth = container.firstElementChild?.clientWidth || 260;
    const scrollAmount = (cardWidth + 20) * 2;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

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

  const getRankBadge = (index) => {
    if (index === 0) {
      return {
        label: '#1 Best Seller',
        bg: 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-amber-500/20'
      };
    }
    if (index === 1) {
      return {
        label: '#2 Top Rated',
        bg: 'bg-gradient-to-r from-slate-900 to-slate-800 text-amber-300 shadow-slate-900/20'
      };
    }
    if (index === 2) {
      return {
        label: '#3 Trending',
        bg: 'bg-gradient-to-r from-zinc-800 to-zinc-900 text-white shadow-zinc-800/20'
      };
    }
    return {
      label: `Top Pick #${index + 1}`,
      bg: 'bg-black/70 backdrop-blur-md text-white'
    };
  };

  return (
    <section className="bg-gradient-to-b from-[#FAF8F5] to-white py-14 sm:py-20 border-b border-gray-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-800">
                Verified Customer Favorites
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-950">
              Best Sellers
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-xl">
              The most sought-after luxury timepieces, genuine leathercraft, and cutting-edge devices backed by 100% brand warranty.
            </p>
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
              {BESTSELLER_TABS.map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#111827] text-amber-200 shadow-sm scale-102'
                        : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-black border border-gray-200/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Carousel Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2 shrink-0 pl-2 border-l border-gray-200">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                disabled={!canScrollLeft}
                aria-label="Previous best sellers"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
                  canScrollLeft
                    ? 'border border-gray-300 bg-white text-gray-900 hover:bg-black hover:text-white hover:border-black cursor-pointer shadow-2xs active:scale-95'
                    : 'border border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronLeftIcon className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                disabled={!canScrollRight}
                aria-label="Next best sellers"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
                  canScrollRight
                    ? 'border border-gray-300 bg-white text-gray-900 hover:bg-black hover:text-white hover:border-black cursor-pointer shadow-2xs active:scale-95'
                    : 'border border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        {filteredBestsellers.length > 0 ? (
          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredBestsellers.map((product, idx) => {
              const isAdded = Boolean(addedMap[product.id]);
              const isWish = Boolean(wishlistMap[product.id]);
              const rankInfo = getRankBadge(idx);
              const discount = product.discount || (
                product.oldPrice && product.oldPrice > product.price
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                  : 0
              );

              return (
                <div
                  key={product.id}
                  className="group relative flex-shrink-0 w-[240px] sm:w-[275px] md:w-[295px] snap-start flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-gray-200/90 bg-white p-3 sm:p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.09)] hover:-translate-y-1.5 hover:border-amber-300/80"
                >
                  <div className="relative aspect-[4/4.8] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#F6F7F9]">
                    <Link
                      to={`/product/${product.id}`}
                      className="block h-full w-full"
                    >
                      <img
                        src={product.image || product.images?.[0]}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-600 ease-out group-hover:scale-108"
                      />
                    </Link>

                    <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider shadow-xs ${rankInfo.bg}`}>
                        {rankInfo.label}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleWishlistToggle(e, product)}
                        aria-label={isWish ? "Remove from wishlist" : "Add to wishlist"}
                        className={`pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md shadow-xs transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
                          isWish
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-white/90 text-gray-700 hover:text-rose-600 border border-gray-200/80 hover:bg-white'
                        }`}
                      >
                        <HeartIcon className="w-3.5 h-3.5 transition-colors" filled={isWish} />
                      </button>
                    </div>

                    {discount > 0 && (
                      <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
                        <span className="rounded-full bg-black/80 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-amber-300 border border-white/10">
                          {discount}% OFF
                        </span>
                      </div>
                    )}

                    <div className="hidden sm:flex absolute inset-x-2.5 bottom-2.5 z-10 gap-1.5 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold backdrop-blur-md border shadow-md transition-all active:scale-95 cursor-pointer truncate ${
                          isAdded
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white/95 text-gray-900 border-white/80 hover:bg-white hover:text-black'
                        }`}
                      >
                        <span>{isAdded ? '✓ Added' : '+ Add to Bag'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(e, product)}
                        className="rounded-xl bg-gray-950/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-black active:scale-95 shadow-md cursor-pointer shrink-0"
                      >
                        Buy
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 px-1 pb-0.5 flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 truncate">
                          {product.brand || 'ORIGINAL'}
                        </span>

                        <div className="flex items-center gap-1 text-[11px] font-bold text-gray-800 shrink-0">
                          <span className="text-amber-500 text-xs">★</span>
                          <span>{product.rating || '4.9'}</span>
                          <span className="text-[10px] text-gray-400 font-normal">
                            ({product.reviews || 85})
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/product/${product.id}`}
                        className="block text-[13.5px] sm:text-[14.5px] font-semibold text-gray-950 hover:text-amber-700 transition-colors line-clamp-1 leading-snug"
                        title={product.name}
                      >
                        {product.name}
                      </Link>

                      <p className="mt-1 text-[10.5px] text-amber-800 font-medium flex items-center gap-1">
                        <span>⚡</span>
                        <span>{product.salesCount ? `${product.salesCount.toLocaleString()}+ bought recently` : 'High demand item'}</span>
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[15px] sm:text-base font-bold text-gray-950 tabular-nums">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>
                        {product.oldPrice && product.oldPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through tabular-nums">
                            ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-semibold text-gray-400">
                        {product.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-2 mt-2 border-t border-gray-100 sm:hidden">
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`w-full rounded-lg py-1.5 text-[11px] font-semibold transition-all active:scale-95 truncate ${
                          isAdded ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {isAdded ? '✓ Added' : '+ Add to Bag'}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(e, product)}
                        className="w-full rounded-lg bg-gray-950 py-1.5 text-[11px] font-semibold text-white transition-all active:scale-95 truncate"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl bg-white border border-gray-200/80">
            <p className="text-xs font-semibold text-gray-600">No bestselling items in this category currently.</p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-center">
          <Link
            to="/shop?sort=rating"
            className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-6 py-2.5 text-xs font-semibold text-white hover:bg-black transition shadow-sm hover:scale-102 active:scale-98"
          >
            <span>View All Best Sellers Catalog</span>
            <ArrowRightIcon className="w-3.5 h-3.5 text-amber-300" />
          </Link>
        </div>

      </div>
    </section>
  );
}
