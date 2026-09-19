// src/pages/NewArrivals.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import {
  Sparkles,
  ArrowRight,
  PackageCheck,
  Watch,
  Briefcase,
  Headphones,
  Glasses,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkle,
  Truck,
  ShieldCheck,
  Award,
  Flame,
  LayoutGrid,
  Grid2X2,
  CheckCircle2,
  Mail,
  Check,
  Tag,
  Clock
} from 'lucide-react';

// =========================================================================
// CUSTOM ANIMATION HOOK: Intersection Observer for on-scroll reveals
// =========================================================================
function useInView(options = { threshold: 0.1, triggerOnce: true }) {
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
  threshold = 0.08
}) {
  const [ref, inView] = useInView({ threshold, triggerOnce: true });

  const getTransform = () => {
    if (inView) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 24px, 0)';
      case 'down':
        return 'translate3d(0, -24px, 0)';
      case 'left':
        return 'translate3d(24px, 0, 0)';
      case 'right':
        return 'translate3d(-24px, 0, 0)';
      case 'zoom':
        return 'scale(0.97)';
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
        transition: `opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </div>
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
  const [viewMode, setViewMode] = useState('grid-4'); // 'grid-4' | 'grid-3'
  const [toastMessage, setToastMessage] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    const handleProductsUpdate = () => setProducts(getProducts());
    window.addEventListener('productsUpdated', handleProductsUpdate);
    return () => window.removeEventListener('productsUpdated', handleProductsUpdate);
  }, []);

  // Filtered & Sorted Arrivals
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

  // Featured Spotlight Drops (Top 4 latest products)
  const spotlightDrops = useMemo(() => {
    return [...products].sort((a, b) => b.id - a.id).slice(0, 4);
  }, [products]);

  const handleAddToCart = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setToastMessage(`✓ Added "${product.name}" to your bag`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleBuyNow = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  const scrollToCatalog = (e) => {
    e?.preventDefault();
    const el = document.getElementById('arrivals-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 4000);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      {/* Floating Toast Notification */}
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
        {/* 1. TOP ANNOUNCEMENT RIBBON                                                */}
        {/* ========================================================================= */}
        <div className="bg-[#FAF8F5] border-b border-neutral-200/80 py-2.5 text-center px-4">
          <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[11px] font-semibold text-neutral-700 uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-[#8C6734]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Season 2026 Fresh Drops</span>
            </span>
            <span className="hidden sm:inline text-neutral-300">•</span>
            <span className="hidden sm:inline">100% Genuine Brand Sourcing</span>
            <span className="hidden sm:inline text-neutral-300">•</span>
            <span>Free Insured Delivery Across India</span>
            <span className="hidden sm:inline text-neutral-300">•</span>
            <span className="hidden md:inline">7 Days Replacement</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. EDITORIAL HERO SHOWCASE (About Page UI Styling + User's Pinterest Image) */}
        {/* ========================================================================= */}
        <section className="relative bg-white border-b border-neutral-200/80 overflow-hidden">
          {/* Subtle background pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Left Content */}
              <div className="lg:col-span-7 space-y-6 text-left">

                {/* Eyebrow Badge */}
                <Reveal delay={0} direction="up">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#8C6734] animate-ping" />
                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8C6734]">
                      Season 2026 / Just In
                    </span>
                  </div>
                </Reveal>

                {/* Editorial Serif Heading */}
                <Reveal delay={100} direction="up">
                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-medium tracking-tight text-neutral-950 leading-[1.15]">
                    The New Arrivals Edit <br />
                    <span className="italic font-normal text-[#8C6734]">Freshly Unveiled.</span>
                  </h1>
                </Reveal>

                {/* Narrative Intro */}
                <Reveal delay={180} direction="up">
                  <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-xl">
                    Discover the latest additions to the Krishna Accessories collection. From precision automatic timepieces and handcrafted leather bags to lifestyle sneakers and audio gear — handpicked for everyday distinction.
                  </p>
                </Reveal>

                {/* Quick Benefit Tags */}
                <Reveal delay={240} direction="up">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-neutral-700">
                    <div className="flex items-center gap-2 p-2.5 rounded-md bg-[#FAFAFB] border border-neutral-200/80 hover:border-[#C5A880] transition-colors">
                      <ShieldCheck className="w-4 h-4 text-[#8C6734] shrink-0" />
                      <span className="font-medium text-[11px] sm:text-xs">Verified Brand Sealed</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-md bg-[#FAFAFB] border border-neutral-200/80 hover:border-[#C5A880] transition-colors">
                      <Award className="w-4 h-4 text-[#8C6734] shrink-0" />
                      <span className="font-medium text-[11px] sm:text-xs">Official Manufacturer Warranty</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-md bg-[#FAFAFB] border border-neutral-200/80 hover:border-[#C5A880] transition-colors">
                      <Truck className="w-4 h-4 text-[#8C6734] shrink-0" />
                      <span className="font-medium text-[11px] sm:text-xs">Fast Insured Transit</span>
                    </div>
                  </div>
                </Reveal>

                {/* Actions */}
                <Reveal delay={300} direction="up">
                  <div className="pt-2 flex flex-wrap items-center gap-3.5">
                    <button
                      type="button"
                      onClick={scrollToCatalog}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#8C6734] transition-colors duration-200 shadow-sm cursor-pointer"
                    >
                      <span>Shop New Arrivals ({arrivals.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <Link
                      to="/shop"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-white border border-neutral-300 text-neutral-900 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-neutral-50 transition-colors duration-200"
                    >
                      <span>View Full Catalog</span>
                    </Link>
                  </div>
                </Reveal>

              </div>

              {/* Right Column: Hero Visual Card (Requested Pinterest Image) */}
              <div className="lg:col-span-5">
                <Reveal delay={150} direction="left">
                  <div className="relative mx-auto max-w-md lg:max-w-none group">
                    <div className="aspect-[4/4.6] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-xl relative transition-transform duration-500 hover:shadow-2xl">
                      <img
                        src="https://i.pinimg.com/736x/c3/7a/84/c37a8441b798d917defa413de43a72a6.jpg"
                        alt="New Luxury Arrivals & Accessories"
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Floating Glassmorphic Tag */}
                      <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3.5 rounded-lg border border-neutral-200/80 flex items-center justify-between text-xs shadow-md transition-all duration-300 group-hover:bg-white">
                        <div>
                          <p className="font-semibold text-neutral-950">New 2026 Collection</p>
                          <p className="text-[11px] text-neutral-500">Titan &bull; Casio &bull; Fossil &bull; Apple &bull; Sony</p>
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
        {/* 3. SPOTLIGHT: THIS WEEK'S TOP DROPS (Curated Row for E-Commerce Impact)   */}
        {/* ========================================================================= */}
        {spotlightDrops.length > 0 && (
          <section className="py-12 bg-white border-b border-neutral-200/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    <span>Featured Spotlight</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-neutral-950 mt-1">
                    Top New Drops This Week
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={scrollToCatalog}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#8C6734] hover:text-neutral-950 uppercase tracking-wider transition-colors"
                >
                  <span>See all {products.length} drops</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {spotlightDrops.map((product, idx) => (
                  <Reveal key={`spotlight-${product.id}`} delay={idx * 50} direction="up">
                    <div className="relative group">
                      <div className="absolute -top-2 left-3 z-20">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-neutral-950 text-white text-[9.5px] font-bold uppercase tracking-wider shadow-sm border border-[#C5A880]/30">
                          <Sparkles className="w-2.5 h-2.5 text-[#C5A880]" />
                          Drop #{idx + 1}
                        </span>
                      </div>
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 4. MAIN ARRIVALS CATALOG & FILTER SECTION (Core Shopping Experience)      */}
        {/* ========================================================================= */}
        <section id="arrivals-catalog" className="py-12 sm:py-16 bg-[#FAFAFB] scroll-mt-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* Filter Bar Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                  Full Collection
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-neutral-950 mt-1">
                  Explore All New Arrivals
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  Showing {arrivals.length} {arrivals.length === 1 ? 'piece' : 'pieces'} in {category === 'All' ? 'all categories' : category}
                </p>
              </div>

              {/* Controls: Search, Sort, View Toggle */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Instant Search Bar */}
                <div className="relative min-w-[180px] sm:min-w-[220px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search new arrivals..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]/30 transition-all"
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
                      className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#8C6734] transition-all cursor-pointer"
                    >
                      <option value="newest">Latest first</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="discount">Highest Discount</option>
                    </select>
                  </label>
                </div>

                {/* View Mode Toggle (Desktop) */}
                <div className="hidden lg:flex items-center rounded-lg border border-neutral-200 bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid-4')}
                    aria-label="4 columns grid"
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'grid-4' ? 'bg-neutral-950 text-white' : 'text-neutral-500 hover:text-neutral-900'}`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid-3')}
                    aria-label="3 columns grid"
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'grid-3' ? 'bg-neutral-950 text-white' : 'text-neutral-500 hover:text-neutral-900'}`}
                  >
                    <Grid2X2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filter Pills (About Page UI Styling) */}
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
                        : 'bg-white text-neutral-700 border border-neutral-200/80 hover:border-[#C5A880] hover:bg-neutral-50'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-[#C5A880]' : 'text-[#8C6734]'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Products Grid */}
            {arrivals.length > 0 ? (
              <div
                className={`mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-2 sm:gap-5 ${
                  viewMode === 'grid-3'
                    ? 'md:grid-cols-3 lg:grid-cols-3 lg:gap-8'
                    : 'md:grid-cols-3 lg:grid-cols-4 lg:gap-6'
                }`}
              >
                {arrivals.map((product, index) => (
                  <Reveal key={product.id} delay={Math.min(index * 30, 250)} direction="up">
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onBuyNow={handleBuyNow}
                    />
                  </Reveal>
                ))}
              </div>
            ) : (
              /* Clean Empty State */
              <div className="mt-8 rounded-2xl border border-neutral-200/80 bg-white py-16 px-4 text-center max-w-md mx-auto shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-[#F5F2EB] text-[#8C6734] flex items-center justify-center mx-auto mb-4 border border-[#C5A880]/40">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-neutral-950 mb-1">
                  No new arrivals found
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                  {searchQuery
                    ? `No new arrivals matching "${searchQuery}" in ${category}.`
                    : 'We are currently adding more arrivals to this category.'}
                </p>
                <div className="flex items-center justify-center gap-3">
                  {(category !== 'All' || searchQuery) && (
                    <button
                      type="button"
                      onClick={() => {
                        setCategory('All');
                        setSearchQuery('');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#FAFAFB] border border-neutral-300 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-neutral-950 text-white text-xs font-semibold hover:bg-[#8C6734] transition-colors"
                  >
                    <span>Browse All Shop</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. VIP NEW DROP ALERTS (E-Commerce Standard Bar)                         */}
        {/* ========================================================================= */}
        <section className="py-14 bg-white border-t border-b border-neutral-200/80">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
              VIP Drop Notifications
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-medium text-neutral-950 tracking-tight">
              Be the First to Know About New Releases
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
              Get notified immediately when limited batch luxury timepieces and exclusive accessories arrive in stock.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="pt-2 max-w-md mx-auto flex gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-md border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C6734] transition-colors cursor-pointer"
              >
                Notify Me
              </button>
            </form>

            {newsletterSubscribed && (
              <p className="text-xs font-semibold text-emerald-700 animate-fade-in flex items-center justify-center gap-1.5 pt-1">
                <Check className="w-4 h-4" />
                <span>Thank you! You're subscribed for new drop notifications.</span>
              </p>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. E-COMMERCE SHOPPING PROMISES (Standard Luxury Store Footer Strip)      */}
        {/* ========================================================================= */}
        <section className="py-10 bg-[#FAF8F5] border-b border-neutral-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-neutral-200 text-[#8C6734] flex items-center justify-center shrink-0 shadow-2xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">100% Genuine</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Verified authentic products with seals</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-neutral-200 text-[#8C6734] flex items-center justify-center shrink-0 shadow-2xs">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Brand Warranty</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Serviceable nationwide at brand centers</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-neutral-200 text-[#8C6734] flex items-center justify-center shrink-0 shadow-2xs">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Insured Shipping</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Fast & secure express transit</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-neutral-200 text-[#8C6734] flex items-center justify-center shrink-0 shadow-2xs">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">7-Day Returns</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Hassle-free replacement policy</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}