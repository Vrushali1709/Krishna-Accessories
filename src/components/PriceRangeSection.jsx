// src/components/PriceRangeSection.jsx
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

const PRICE_TIERS = [
  {
    id: 'under-5000',
    label: 'Under ₹5,000',
    title: 'Everyday Essentials & Smart Picks',
    description: 'Pocket-friendly genuine watches, leather wallets, running sneakers & audio earbuds.',
    minPrice: 0,
    maxPrice: 5000,
    badge: 'Budget Luxe',
    accentColor: 'from-blue-600 to-indigo-700',
    pillBg: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  {
    id: 'under-10000',
    label: 'Under ₹10,000',
    title: 'Mid-Tier Premium & Handcrafted',
    description: 'Handcrafted leather briefcases, solar chronographs, designer eyewear & high-energy sneakers.',
    minPrice: 0,
    maxPrice: 10000,
    badge: 'Popular Choice',
    accentColor: 'from-amber-600 to-amber-700',
    pillBg: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  {
    id: 'under-15000',
    label: 'Under ₹15,000',
    title: 'Elite Collection & Sport Heritage',
    description: 'Automatic sports timepieces, retro basketball high-tops, and ANC true-wireless earbuds.',
    minPrice: 0,
    maxPrice: 15000,
    badge: 'Elite Tier',
    accentColor: 'from-emerald-600 to-teal-700',
    pillBg: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  {
    id: 'under-20000',
    label: 'Under ₹20,000',
    title: 'Prestige Tier & Masterpieces',
    description: 'Swiss Powermatic automatic timepieces, pro mechanical gaming gear & 360° wireless speakers.',
    minPrice: 0,
    maxPrice: 20000,
    badge: 'Prestige',
    accentColor: 'from-purple-600 to-slate-800',
    pillBg: 'bg-purple-50 text-purple-800 border-purple-200'
  },
  {
    id: 'above-20000',
    label: 'Above ₹20,000',
    title: 'Flagship Luxury & Haute Horlogerie',
    description: 'Certified Swiss chronometers, grade-5 titanium handsets, and M3 Max workstations.',
    minPrice: 20000,
    maxPrice: 300000,
    badge: 'Ultra Luxury',
    accentColor: 'from-zinc-900 to-black',
    pillBg: 'bg-zinc-100 text-zinc-900 border-zinc-300'
  }
];

export default function PriceRangeSection({ products = [], onToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const carouselRef = useRef(null);

  const [selectedTierId, setSelectedTierId] = useState('under-5000');
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

  const activeTier = PRICE_TIERS.find((t) => t.id === selectedTierId) || PRICE_TIERS[0];

  // Sync wishlist status
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

  // Filter products by selected tier
  const tierProducts = products.filter((p) => {
    if (activeTier.id === 'above-20000') {
      return p.price >= 20000;
    }
    return p.price <= activeTier.maxPrice;
  });

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
  }, [checkScroll, tierProducts, selectedTierId]);

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

  const getTierShopLink = (tier) => {
    if (tier.id === 'above-20000') {
      return `/shop?minPrice=20000&maxPrice=300000`;
    }
    return `/shop?minPrice=0&maxPrice=${tier.maxPrice}`;
  };

  return (
    <section className="bg-white py-14 sm:py-20 border-b border-gray-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.26em] text-[#B89758]">
            Curated by Budget
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-950">
            Products by Price
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            Find certified genuine timepieces, footwear, tech and accessories perfectly aligned with your investment budget.
          </p>
        </div>

        {/* 4 Primary Price Navigation Buttons */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">
          {PRICE_TIERS.map((tier) => {
            const isSelected = selectedTierId === tier.id;
            const count = products.filter((p) => {
              if (tier.id === 'above-20000') return p.price >= 20000;
              return p.price <= tier.maxPrice;
            }).length;

            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedTierId(tier.id)}
                className={`group flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-[13px] font-bold transition-all duration-200 cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-[#111827] text-white shadow-md scale-102 ring-2 ring-gray-900/10'
                    : 'bg-[#F4F5F7] text-gray-700 hover:bg-gray-200 hover:text-black'
                }`}
              >
                <span>{tier.label}</span>
                <span className={`rounded-full px-2 py-0.2 text-[10px] font-mono transition-colors ${
                  isSelected ? 'bg-white/20 text-amber-300' : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Highlight Banner for Selected Price Bracket */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#0F172A] text-white p-5 sm:p-7 mb-8 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="rounded-full bg-amber-400 text-black px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                {activeTier.label}
              </span>
              <span className="text-xs text-amber-200/80 font-medium">
                {activeTier.badge}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white">
              {activeTier.title}
            </h3>
            <p className="mt-1 text-xs text-slate-300 max-w-xl leading-relaxed">
              {activeTier.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to={getTierShopLink(activeTier)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-950 hover:bg-amber-100 transition shadow-sm active:scale-97"
            >
              <span>Explore All {activeTier.label}</span>
              <ArrowRightIcon className="w-3.5 h-3.5 text-black" />
            </Link>

            {/* Carousel navigation buttons */}
            <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-700">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                disabled={!canScrollLeft}
                aria-label="Previous products"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                  canScrollLeft
                    ? 'bg-slate-800 text-white hover:bg-slate-700 cursor-pointer active:scale-95'
                    : 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
                }`}
              >
                <ChevronLeftIcon className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                disabled={!canScrollRight}
                aria-label="Next products"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                  canScrollRight
                    ? 'bg-slate-800 text-white hover:bg-slate-700 cursor-pointer active:scale-95'
                    : 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
                }`}
              >
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Carousel Grid */}
        {tierProducts.length > 0 ? (
          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tierProducts.map((product) => {
              const isAdded = Boolean(addedMap[product.id]);
              const isWish = Boolean(wishlistMap[product.id]);
              const discount = product.discount || (
                product.oldPrice && product.oldPrice > product.price
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                  : 0
              );

              return (
                <div
                  key={product.id}
                  className="group relative flex-shrink-0 w-[240px] sm:w-[270px] md:w-[285px] snap-start flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-gray-200/90 bg-white p-3 sm:p-3.5 shadow-[0_2px_14px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.09)] hover:-translate-y-1.5 hover:border-gray-300"
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
                      <span className="rounded-full bg-black/80 backdrop-blur-md px-2.5 py-0.5 text-[9.5px] font-bold text-white shadow-xs">
                        ₹{Number(product.price).toLocaleString('en-IN')}
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
                        <span className="rounded-full bg-emerald-600/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white">
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
                          <span>{product.rating || '4.8'}</span>
                        </div>
                      </div>

                      <Link
                        to={`/product/${product.id}`}
                        className="block text-[13.5px] sm:text-[14.5px] font-semibold text-gray-950 hover:text-black transition-colors line-clamp-1 leading-snug"
                        title={product.name}
                      >
                        {product.name}
                      </Link>
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
          <div className="text-center py-12 rounded-2xl bg-gray-50 border border-gray-200/80">
            <p className="text-xs font-semibold text-gray-600">No products found in this price range.</p>
          </div>
        )}

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {PRICE_TIERS.slice(0, 4).map((tier) => (
            <Link
              key={`card-${tier.id}`}
              to={getTierShopLink(tier)}
              className="group relative overflow-hidden rounded-2xl border border-gray-200/90 bg-gradient-to-br from-white to-gray-50 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-gray-300 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B89758]">
                  {tier.badge}
                </span>
                <span className="text-xs text-gray-400 group-hover:text-black transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-gray-950">
                {tier.label}
              </h4>
              <p className="mt-1 text-[11px] text-gray-500 line-clamp-1">
                {tier.title}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
