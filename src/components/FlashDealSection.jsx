// src/components/FlashDealSection.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { ArrowRightIcon } from './Icons';

export default function FlashDealSection({ products = [], onToast }) {
  const navigate = useNavigate();

  // Real-time ticking countdown timer (counts down to midnight or a fixed offset)
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
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

  // Primary deal product: Casio Edifice Solar (50% Off) or fallback to ID 3
  const primaryDeal = products.find((p) => p.id === 3) || {
    id: 3,
    name: "Edifice Tough Solar Chronograph",
    brand: "Casio",
    category: "Watches",
    price: 6499,
    oldPrice: 12999,
    discount: 50,
    rating: 4.9,
    reviews: 160,
    image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800",
    description: "High-precision solar chronograph powered by any light energy with sapphire crystal glass and 100m water resistance."
  };

  // Secondary deals: products with >= 28% discount
  const secondaryDeals = products
    .filter((p) => (p.discount || 0) >= 28 && p.id !== primaryDeal.id)
    .slice(0, 2);

  const handleClaimDeal = () => {
    addToCart(primaryDeal, 1, primaryDeal.colors?.[0] || '', primaryDeal.variants?.[0] || '');
    if (onToast) onToast(`✓ Claimed 50% Flash Discount for "${primaryDeal.name}"`);
    navigate('/checkout');
  };

  const handleAddDealToBag = (dealProduct) => {
    addToCart(dealProduct, 1, dealProduct.colors?.[0] || '', dealProduct.variants?.[0] || '');
    if (onToast) onToast(`✓ Added "${dealProduct.name}" to your bag`);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-[#090D16] text-white border border-slate-800 shadow-2xl p-6 sm:p-8 lg:p-12">
        
        {/* Decorative Glow Elements */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.26em] text-rose-400">
                Limited Time Vault Drop
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Flash Deal of the Day
            </h2>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-2.5 shadow-inner">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
              Ends in:
            </span>

            <div className="flex items-center gap-1.5 font-mono">
              <div className="flex flex-col items-center bg-black/60 rounded-lg px-2.5 py-1 min-w-[36px] border border-white/10">
                <span className="text-base sm:text-lg font-bold text-amber-300">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[8px] text-slate-400 uppercase">Hours</span>
              </div>

              <span className="text-amber-400 font-bold">:</span>

              <div className="flex flex-col items-center bg-black/60 rounded-lg px-2.5 py-1 min-w-[36px] border border-white/10">
                <span className="text-base sm:text-lg font-bold text-amber-300">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[8px] text-slate-400 uppercase">Mins</span>
              </div>

              <span className="text-amber-400 font-bold">:</span>

              <div className="flex flex-col items-center bg-black/60 rounded-lg px-2.5 py-1 min-w-[36px] border border-white/10">
                <span className="text-base sm:text-lg font-bold text-rose-400 animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[8px] text-slate-400 uppercase">Secs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deal Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Left: Main Deal Block */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-6 items-center">
            
            <div className="relative w-full md:w-[280px] lg:w-[320px] aspect-[1/1.05] rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/80 shrink-0">
              <img
                src={primaryDeal.image || primaryDeal.images?.[0]}
                alt={primaryDeal.name}
                className="h-full w-full object-cover"
              />
              
              <div className="absolute top-3 left-3">
                <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg">
                  {primaryDeal.discount || 50}% OFF
                </span>
              </div>

              <div className="absolute bottom-3 left-3">
                <span className="rounded-full bg-black/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-amber-300 border border-white/10">
                  ⚡ Deal Verified
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                    {primaryDeal.brand}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs font-medium text-slate-300">
                    ★ {primaryDeal.rating || 4.9} ({primaryDeal.reviews || 160} reviews)
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {primaryDeal.name}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                  {primaryDeal.description}
                </p>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                    ₹{Number(primaryDeal.price).toLocaleString('en-IN')}
                  </span>
                  {primaryDeal.oldPrice && (
                    <span className="text-sm sm:text-base text-slate-500 line-through tabular-nums">
                      ₹{Number(primaryDeal.oldPrice).toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Save ₹{Number(primaryDeal.oldPrice - primaryDeal.price).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-rose-400 font-semibold">Only 3 units remaining!</span>
                    <span className="text-slate-400 font-mono">82% Claimed</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 rounded-full w-[82%]" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleClaimDeal}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-7 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:from-amber-300 hover:to-amber-400 active:scale-97 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <span>Claim Deal Now</span>
                  <ArrowRightIcon className="w-4 h-4 text-black" />
                </button>

                <button
                  type="button"
                  onClick={() => handleAddDealToBag(primaryDeal)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-5 py-3 text-xs font-semibold text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  + Add to Bag
                </button>
              </div>
            </div>

          </div>

          {/* Right: 2 Runner-up Flash Deals */}
          <div className="lg:col-span-5 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-slate-800/90 pt-6 lg:pt-0 lg:pl-8">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                More Vault Specials
              </span>
              <Link to="/shop" className="text-xs text-amber-400 hover:underline">
                View All →
              </Link>
            </div>

            {secondaryDeals.map((deal) => (
              <div
                key={deal.id}
                className="group flex items-center gap-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 p-3 transition-all hover:bg-slate-850 hover:border-slate-700"
              >
                <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                  <img
                    src={deal.image || deal.images?.[0]}
                    alt={deal.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  {deal.discount && (
                    <span className="absolute top-1 left-1 rounded bg-rose-600 px-1 py-0.2 text-[9px] font-bold text-white">
                      {deal.discount}% OFF
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {deal.brand}
                  </span>
                  <h4 className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-amber-200 transition-colors">
                    {deal.name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-bold text-white">
                      ₹{Number(deal.price).toLocaleString('en-IN')}
                    </span>
                    {deal.oldPrice && (
                      <span className="text-xs text-slate-500 line-through">
                        ₹{Number(deal.oldPrice).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddDealToBag(deal)}
                  className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-black hover:bg-amber-300 transition shrink-0 cursor-pointer shadow-xs active:scale-95"
                >
                  + Add
                </button>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
