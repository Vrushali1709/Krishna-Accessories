// src/pages/NewArrivals.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle2,
  PackageCheck,
  Truck,
  Check,
  Watch,
  Briefcase,
  Headphones,
  Glasses,
  Search,
  SlidersHorizontal,
  Flame,
  ArrowUpDown,
  RotateCcw,
  Sparkle
} from 'lucide-react';

// =========================================================================
// CUSTOM ANIMATION HOOK: Intersection Observer for on-scroll reveals
// =========================================================================
function useInView(options = { threshold: 0.15, triggerOnce: true }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (options.triggerOnce) {
          observer.unobserve(entry.target);
        }
      }
    }, options);

    const currentElem = ref.current;
    if (currentElem) observer.observe(currentElem);

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [options.threshold, options.triggerOnce]);

  return [ref, inView];
}

// =========================================================================
// REVEAL COMPONENT: Smooth fade-up / slide-in on scroll
// =========================================================================
function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  threshold = 0.12
}) {
  const [ref, inView] = useInView({ threshold, triggerOnce: true });

  const getTransform = () => {
    if (inView) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 28px, 0)';
      case 'down':
        return 'translate3d(0, -28px, 0)';
      case 'left':
        return 'translate3d(28px, 0, 0)';
      case 'right':
        return 'translate3d(-28px, 0, 0)';
      case 'zoom':
        return 'scale(0.96)';
      default:
        return 'translate3d(0, 20px, 0)';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
}

// =========================================================================
// ANIMATED STAT COUNTER: Smooth numbers count-up on scroll
// =========================================================================
function AnimatedCounter({ end, suffix = '', duration = 1400 }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ threshold: 0.25, triggerOnce: true });

  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    const endVal = parseInt(end, 10);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * endVal));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(endVal);
      }
    };

    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

const categoryTabs = [
  { id: 'All', label: 'All Arrivals', icon: Sparkles },
  { id: 'Watches', label: 'Watches', icon: Watch },
  { id: 'Bags & Wallets', label: 'Bags & Wallets', icon: Briefcase },
  { id: 'Shoes', label: 'Footwear', icon: PackageCheck },
  { id: 'Electronics', label: 'Audio & Tech', icon: Headphones },
  { id: 'Fashion Accessories', label: 'Eyewear & Style', icon: Glasses },
  { id: 'Mobiles', label: 'Mobiles', icon: Sparkle }
];

export default function NewArrivals() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(() => getProducts());
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const handleProductsUpdate = () => setProducts(getProducts());
    window.addEventListener('productsUpdated', handleProductsUpdate);
    return () => window.removeEventListener('productsUpdated', handleProductsUpdate);
  }, []);

  const arrivals = useMemo(() => {
    let filtered = category === 'All'
      ? [...products]
      : products.filter((product) => product.category?.toLowerCase() === category.toLowerCase());

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((product) =>
        product.name?.toLowerCase().includes(q) ||
        product.brand?.toLowerCase().includes(q) ||
        product.category?.toLowerCase().includes(q)
      );
    }

    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    if (sort === 'discount') filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    if (sort === 'newest') filtered.sort((a, b) => b.id - a.id);
    return filtered;
  }, [products, category, searchQuery, sort]);

  const handleAddToCart = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setToastMessage(`✓ Added "${product.name}" to your bag`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleBuyNow = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  const scrollToGrid = (e) => {
    e?.preventDefault();
    const el = document.getElementById('arrivals-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      {/* Floating Toast Notification (Refined Luxury Pill) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-neutral-200 bg-white/95 backdrop-blur-md px-4 py-3.5 text-xs font-semibold shadow-2xl animate-fade-in">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5F2EB] text-[#8C6734] border border-[#C5A880]/40 text-[11px] font-bold">
            ✓
          </span>
          <span className="text-neutral-800">{toastMessage}</span>
          <Link
            to="/cart"
            className="ml-2 rounded-md bg-neutral-950 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#C5A880] hover:text-white hover:bg-neutral-800 transition-colors"
          >
            View Bag
          </Link>
        </div>
      )}

      <main>
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (Matching About Us Editorial Style)                      */}
        {/* ========================================================================= */}
        <section className="relative bg-white border-b border-neutral-200/80 overflow-hidden">
          {/* Subtle decorative background pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

              {/* Left Content */}
              <div className="lg:col-span-7 space-y-6 text-left">

                {/* Eyebrow with Gentle Pulse */}
                <Reveal delay={0} direction="up">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#8C6734] animate-ping" />
                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8C6734]">
                      Season 2026 / Just In
                    </span>
                  </div>
                </Reveal>

                {/* Main Heading */}
                <Reveal delay={120} direction="up">
                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-medium tracking-tight text-neutral-950 leading-[1.15]">
                    Fresh Additions, <br />
                    <span className="italic font-normal text-[#8C6734]">Curated for Distinction.</span>
                  </h1>
                </Reveal>

                {/* Narrative Intro */}
                <Reveal delay={220} direction="up">
                  <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-xl">
                    Discover the latest arrivals at Krishna Accessories. From precision luxury timepieces and handcrafted leather accessories to high-performance footwear and premium audio, explore handpicked releases curated for everyday elegance.
                  </p>
                </Reveal>

                {/* Store Promises (Animated Grid) */}
                <Reveal delay={300} direction="up">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs text-neutral-700">
                    <div className="flex items-center gap-2 p-2.5 rounded-md bg-[#FAFAFB] border border-neutral-200/80 hover:border-[#C5A880] transition-colors duration-200">
                      <Check className="w-4 h-4 text-[#8C6734] shrink-0" />
                      <span className="font-medium">100% Verified Sourcing</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-md bg-[#FAFAFB] border border-neutral-200/80 hover:border-[#C5A880] transition-colors duration-200">
                      <Check className="w-4 h-4 text-[#8C6734] shrink-0" />
                      <span className="font-medium">Brand Official Warranty</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-md bg-[#FAFAFB] border border-neutral-200/80 hover:border-[#C5A880] transition-colors duration-200">
                      <Check className="w-4 h-4 text-[#8C6734] shrink-0" />
                      <span className="font-medium">Mumbai Hub Dispatch</span>
                    </div>
                  </div>
                </Reveal>

                {/* Action Buttons */}
                <Reveal delay={380} direction="up">
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                    <button
                      type="button"
                      onClick={scrollToGrid}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#8C6734] transition-colors duration-200 shadow-sm cursor-pointer"
                    >
                      <span>Explore New Arrivals</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <Link
                      to="/shop"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-white border border-neutral-300 text-neutral-900 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-neutral-50 transition-colors duration-200"
                    >
                      <span>Full Catalog</span>
                    </Link>
                  </div>
                </Reveal>

              </div>

              {/* Right Column: Hero Visual Card */}
              <div className="lg:col-span-5">
                <Reveal delay={200} direction="left">
                  <div className="relative mx-auto max-w-md lg:max-w-none group">
                    <div className="aspect-[4/4.8] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-xl relative transition-transform duration-500 hover:shadow-2xl">
                      <img
                        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
                        alt="New Luxury Arrivals & Accessories"
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Bottom Label with subtle glassmorphism */}
                      <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-lg border border-neutral-200/80 flex items-center justify-between text-xs shadow-md transition-all duration-300 group-hover:bg-white">
                        <div>
                          <p className="font-semibold text-neutral-950">New 2026 Arrivals</p>
                          <p className="text-[11px] text-neutral-500">Titan &bull; Casio &bull; Fossil &bull; Sony &bull; Apple</p>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6734] bg-[#F5F2EB] px-2.5 py-1 rounded-sm border border-[#C5A880]/40">
                          Fresh Drop
                        </span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. ANIMATED STATS METRICS BAR                                             */}
        {/* ========================================================================= */}
        <section className="bg-[#FAF8F5] border-b border-neutral-200/80 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">

              <Reveal delay={50} direction="up" className="text-center md:text-left">
                <div className="space-y-1">
                  <p className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-950 tracking-tight text-[#8C6734]">
                    <AnimatedCounter end={100} suffix="%" />
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Quality Guarantee
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Curated multi-category product sourcing
                  </p>
                </div>
              </Reveal>

              <Reveal delay={120} direction="up" className="text-center md:text-left">
                <div className="space-y-1">
                  <p className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-950 tracking-tight text-[#8C6734]">
                    <AnimatedCounter end={Math.max(products.length, 30)} suffix="+" />
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Curated New Pieces
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Updated weekly from verified partners
                  </p>
                </div>
              </Reveal>

              <Reveal delay={190} direction="up" className="text-center md:text-left">
                <div className="space-y-1">
                  <p className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-950 tracking-tight text-[#8C6734]">
                    <AnimatedCounter end={24} suffix="h" />
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Express Dispatch
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Insured nationwide courier delivery
                  </p>
                </div>
              </Reveal>

              <Reveal delay={260} direction="up" className="text-center md:text-left">
                <div className="space-y-1">
                  <p className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-950 tracking-tight text-[#8C6734]">
                    <AnimatedCounter end={7} suffix=" Days" />
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Easy Replacement
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Hassle-free guarantee & support
                  </p>
                </div>
              </Reveal>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CURATED ARRIVALS CATALOG & FILTER SECTION                             */}
        {/* ========================================================================= */}
        <section id="arrivals-grid" className="py-14 sm:py-20 bg-white border-b border-neutral-200/80 scroll-mt-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* Section Header */}
            <Reveal delay={0} direction="up">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-neutral-200/80 pb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Curated Edit</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-4xl font-medium text-neutral-950 mt-1">
                    Fresh From The Collection
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                    {arrivals.length} {arrivals.length === 1 ? 'piece' : 'pieces'} available in this selection
                  </p>
                </div>

                {/* Filter Controls: Search & Sort */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative min-w-[180px] sm:min-w-[220px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search new arrivals..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 bg-[#FAFAFB] text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:bg-white transition-all"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C6734]" />
                      <span className="hidden sm:inline">Sort:</span>
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="rounded-lg border border-neutral-200 bg-[#FAFAFB] px-3 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#8C6734] focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="newest">Latest first</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="discount">Highest Discount</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Category Tabs Pill Bar (Matching About Us Card Style) */}
            <div className="mt-6 flex gap-2.5 overflow-x-auto pb-3 pt-1 no-scrollbar">
              {categoryTabs.map((tab) => {
                const IconComponent = tab.icon;
                const isSelected = category === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCategory(tab.id)}
                    className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-950 text-white shadow-sm border border-neutral-950 ring-2 ring-[#C5A880]/30'
                        : 'bg-[#FAFAFB] text-neutral-700 border border-neutral-200/80 hover:border-[#C5A880] hover:bg-white'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-[#C5A880]' : 'text-[#8C6734]'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Product Grid */}
            {arrivals.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                {arrivals.map((product, index) => (
                  <Reveal key={product.id} delay={Math.min(index * 40, 300)} direction="up">
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onBuyNow={handleBuyNow}
                    />
                  </Reveal>
                ))}
              </div>
            ) : (
              /* Luxury Empty State */
              <div className="mt-8 rounded-2xl border border-neutral-200/80 bg-[#FAFAFB] py-20 px-4 text-center max-w-md mx-auto">
                <div className="w-12 h-12 rounded-full bg-[#F5F2EB] text-[#8C6734] flex items-center justify-center mx-auto mb-4 border border-[#C5A880]/40">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-neutral-950 mb-1">
                  No arrivals found
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                  {searchQuery
                    ? `No new arrivals matching "${searchQuery}" in this category.`
                    : 'We are currently curating new additions for this category.'}
                </p>
                <div className="flex items-center justify-center gap-3">
                  {(category !== 'All' || searchQuery) && (
                    <button
                      type="button"
                      onClick={() => {
                        setCategory('All');
                        setSearchQuery('');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-white border border-neutral-300 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-neutral-950 text-white text-xs font-semibold hover:bg-[#8C6734] transition-colors"
                  >
                    <span>View Shop</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. QUALITY FEATURE SECTION (Charcoal Luxury Matching About Us)            */}
        {/* ========================================================================= */}
        <section className="bg-[#111827] text-white py-16 sm:py-20 border-b border-neutral-800 relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

              {/* Left Content */}
              <div className="lg:col-span-6 space-y-5 text-left">
                <Reveal delay={0} direction="up">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880] flex items-center gap-2">
                      <span className="w-5 h-[1.5px] bg-[#C5A880]" />
                      Zero Compromise
                    </span>
                    <h2 className="font-serif text-2xl sm:text-4xl font-medium text-white tracking-tight leading-tight mt-2">
                      Every New Release, Quality Assured.
                    </h2>
                  </div>
                </Reveal>

                <Reveal delay={100} direction="up">
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                    We believe trust is built on consistency. Every new release that arrives at our Mumbai boutique undergoes rigorous quality verification, arriving safely at your doorstep with valid manufacturer credentials and luxury presentation.
                  </p>
                </Reveal>

                {/* 3 Trust Indicators */}
                <div className="space-y-3 pt-1">
                  <Reveal delay={180} direction="up">
                    <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-white/5 border border-neutral-800 hover:border-[#C5A880]/50 transition-all duration-200">
                      <div className="w-7 h-7 rounded-md bg-[#C5A880]/15 flex items-center justify-center shrink-0 text-[#C5A880]">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-white">Brand Warranty Included</h3>
                        <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
                          Manufacturer warranty cards honored at authorized brand service centers nationwide.
                        </p>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={240} direction="up">
                    <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-white/5 border border-neutral-800 hover:border-[#C5A880]/50 transition-all duration-200">
                      <div className="w-7 h-7 rounded-md bg-[#C5A880]/15 flex items-center justify-center shrink-0 text-[#C5A880]">
                        <PackageCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-white">Verified Batch Sourcing</h3>
                        <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
                          Direct quality procurement with genuine seals and serial verification.
                        </p>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={300} direction="up">
                    <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-white/5 border border-neutral-800 hover:border-[#C5A880]/50 transition-all duration-200">
                      <div className="w-7 h-7 rounded-md bg-[#C5A880]/15 flex items-center justify-center shrink-0 text-[#C5A880]">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-white">Secure Insured Delivery</h3>
                        <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
                          Insured transit in tamper-evident sealed packaging via BlueDart Express & Delhivery.
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>

              {/* Right Visual Image */}
              <div className="lg:col-span-6">
                <Reveal delay={200} direction="left">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-xl group">
                    <img
                      src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop"
                      alt="Verified Horology & Accessories Quality"
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-3 rounded-lg border border-neutral-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-neutral-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Direct Quality Assurance</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-wider">
                        Mumbai Hub
                      </span>
                    </div>
                  </div>
                </Reveal>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. VISIT FLAGSHIP BOUTIQUE CALLOUT                                       */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-24 bg-[#FAFAFB] border-b border-neutral-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal delay={50} direction="up">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-2xl overflow-hidden border border-neutral-200/80 shadow-md bg-white">

                {/* Left Store Image */}
                <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full group">
                  <img
                    src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1000&auto=format&fit=crop"
                    alt="Krishna Accessories Mumbai Store"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                  <div className="absolute bottom-3 left-3 text-white lg:hidden">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A880]">
                      Mumbai Flagship
                    </span>
                    <p className="font-semibold text-sm">Heera Panna Shopping Center</p>
                  </div>
                </div>

                {/* Right Information Panel */}
                <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6 text-left">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8C6734] flex items-center gap-2">
                      <span className="w-5 h-[1.5px] bg-[#8C6734]" />
                      Visit Our Flagship
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-medium text-neutral-950 tracking-tight mt-1.5 mb-3">
                      Experience new arrivals in person.
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      Visit our flagship store in Mumbai to inspect new releases, feel genuine leather textures, test audio gear, and receive personalized styling assistance.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-neutral-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
                        <MapPin className="w-3.5 h-3.5 text-[#8C6734]" />
                        <span>Store Location</span>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed pl-5">
                        Shop No. 64, Heera Panna Shopping Center,<br />
                        Haji Ali, Mumbai 400026
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
                        <Clock className="w-3.5 h-3.5 text-[#8C6734]" />
                        <span>Opening Hours</span>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed pl-5">
                        Mon – Sat: 10:30 AM to 08:30 PM<br />
                        <span className="text-[#8C6734] font-medium">Sunday by Appointment</span>
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
                        <Phone className="w-3.5 h-3.5 text-[#8C6734]" />
                        <span>Private Desk & Enquiries</span>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed pl-5">
                        +91 93213 22761<br />
                        <span className="text-neutral-500">shantilal6186@gmail.com</span>
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
                        <Sparkles className="w-3.5 h-3.5 text-[#8C6734]" />
                        <span>In-Store Services</span>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed pl-5">
                        Complimentary Sizing &bull; Battery Replacement &bull; Gifting Wrap
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold tracking-[0.16em] uppercase rounded-sm transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 group"
                    >
                      <span>Schedule a Private Viewing</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A880] transition-transform duration-300 group-hover:translate-x-1.5" />
                    </Link>
                  </div>
                </div>

              </div>
            </Reveal>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. FINAL BRAND STATEMENT & SHOP CTA (Matching About Us)                   */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 bg-white text-center border-t border-neutral-100">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-5">
            <Reveal delay={0} direction="up">
              <div className="w-8 h-0.5 bg-[#8C6734] mx-auto" />
            </Reveal>

            <Reveal delay={100} direction="up">
              <h2 className="font-serif text-3xl sm:text-5xl text-neutral-950 font-medium tracking-tight leading-tight">
                TIMELESS PIECES.<br />
                <span className="italic font-normal text-neutral-500">LASTING IMPRESSIONS.</span>
              </h2>
            </Reveal>

            <Reveal delay={180} direction="up">
              <p className="text-xs sm:text-sm text-neutral-500 font-normal tracking-wide max-w-md mx-auto">
                Curated with precision. Chosen with confidence.
              </p>
            </Reveal>

            <Reveal delay={250} direction="up">
              <div className="pt-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 rounded-sm shadow-md hover:shadow-2xl hover:-translate-y-0.5 group border border-neutral-800"
                >
                  <span className="text-[#C5A880] group-hover:text-white transition-colors duration-200">Shop the Full Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5 text-[#C5A880]" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}