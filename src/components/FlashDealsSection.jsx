// src/components/FlashDealsSection.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { ArrowRightIcon, HeartIcon } from './Icons';
import ProductCard from './ProductCard';

export default function FlashDealsSection({ products = [], onToast }) {
  const navigate = useNavigate();

  // 12-hour countdown timer that updates dynamically every second
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter highest discount products or fallback to top products
  const dealProducts = [...products]
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))
    .slice(0, 5);

  const heroDeal = dealProducts[0] || products[0];
  const sideDeals = dealProducts.slice(1, 5);

  const handleQuickAdd = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    if (onToast) {
      onToast(`✓ Added "${product.name}" to your bag`);
    }
  };

  const handleBuyNow = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  if (!heroDeal) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Section Header & Live Timer Pill */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-rose-600">
              Limited-Time Flash Drop
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
            Deals of the Day
          </h2>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
            Exclusive daily privileges on certified genuine luxury accessories.
          </p>
        </div>

        {/* Live Dynamic Countdown Box */}
        <div className="flex items-center gap-2 bg-gray-950 text-white px-4 py-2.5 rounded-2xl shadow-md shrink-0">
          <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider mr-1">
            Ends In:
          </span>
          <div className="flex items-center gap-1 font-mono text-sm sm:text-base font-bold text-white">
            <span className="bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span className="text-amber-400 font-bold">:</span>
            <span className="bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span className="text-amber-400 font-bold">:</span>
            <span className="bg-rose-500/80 text-white px-2 py-0.5 rounded-lg border border-rose-400/40">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>

      {/* Hero Spotlight Deal + 4 Grid Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left: Big Featured Spotlight Card (5 cols on lg) */}
        <div className="lg:col-span-5 rounded-3xl border border-gray-200/90 bg-white p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col justify-between group hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-300">
          <div>
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-[10.5px] font-bold text-rose-700">
                🔥 SPOTLIGHT PRIVILEGE
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Save ₹{Number((heroDeal.oldPrice || heroDeal.price * 1.3) - heroDeal.price).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Main Product Image */}
            <Link
              to={`/product/${heroDeal.id}`}
              className="relative block aspect-[4/3.5] w-full overflow-hidden rounded-2xl bg-neutral-100"
            >
              <img
                src={heroDeal.image || heroDeal.images?.[0]}
                alt={heroDeal.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
              />
              <div className="absolute bottom-3 left-3 bg-gray-950/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-semibold">
                {heroDeal.category} • {heroDeal.brand}
              </div>
            </Link>

            {/* Product Details */}
            <div className="mt-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {heroDeal.brand} Official
                </span>
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-800">
                  <span className="text-amber-500">★</span>
                  <span>{heroDeal.rating || '4.9'}</span>
                  <span className="text-gray-400 text-[10.5px]">({heroDeal.reviewsCount || 128})</span>
                </div>
              </div>

              <Link
                to={`/product/${heroDeal.id}`}
                className="mt-1 block text-lg sm:text-xl font-bold text-gray-950 hover:text-black line-clamp-1 leading-snug"
              >
                {heroDeal.name}
              </Link>

              <div className="mt-2 flex items-baseline gap-2.5">
                <span className="text-xl sm:text-2xl font-extrabold text-gray-950">
                  ₹{Number(heroDeal.price).toLocaleString('en-IN')}
                </span>
                {heroDeal.oldPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{Number(heroDeal.oldPrice).toLocaleString('en-IN')}
                  </span>
                )}
                <span className="rounded-md bg-rose-500 px-2 py-0.5 text-[10.5px] font-bold text-white uppercase">
                  {heroDeal.discount || 30}% Off
                </span>
              </div>

              {/* Claimed Stock Meter */}
              <div className="mt-4 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700 mb-1.5">
                  <span className="text-rose-600 font-bold">⚡ 84% Claimed</span>
                  <span className="text-gray-500">Only 3 units left in Mumbai boutique</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500 w-[84%] transition-all duration-1000" />
                </div>
              </div>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="mt-5 grid grid-cols-2 gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={(e) => handleQuickAdd(heroDeal, e)}
              className="rounded-xl border border-gray-300 bg-white py-2.5 text-xs font-bold text-gray-900 shadow-sm hover:bg-gray-50 hover:border-black transition active:scale-98 cursor-pointer"
            >
              Add to Bag
            </button>
            <button
              type="button"
              onClick={(e) => handleBuyNow(heroDeal, e)}
              className="rounded-xl bg-gray-950 py-2.5 text-xs font-bold text-white shadow-md hover:bg-black transition active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Instant Buy</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: 4-Grid Deal Products (7 cols on lg) */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-3.5 sm:gap-4">
          {sideDeals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(p) => handleQuickAdd(p)}
              onBuyNow={(p) => handleBuyNow(p)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
