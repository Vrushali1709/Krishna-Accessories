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
  RotateCcw as RefreshCw,
  Award
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

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-neutral-200 bg-white/95 backdrop-blur-md px-4 py-3.5 text-xs font-semibold shadow-2xl">
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
        {/* 1. HERO HEADER (About Page Design Language: Serif, Gold Pill, Image Card) */}
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

          <div className="relative mx-auto w-full px-4 sm:px-6 lg:px-8 2xl:px-12 py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Left Content */}
              <div className="lg:col-span-7 space-y-5 text-left">

                {/* Eyebrow Badge with Pulse */}
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
                    New Arrivals <br />
                    <span className="italic font-normal text-[#8C6734]">Curated for Everyday Distinction.</span>
                  </h1>
                </Reveal>

                {/* Description */}
                <Reveal delay={180} direction="up">
                  <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-xl">
                    Explore the newest additions to Krishna Accessories. Hand-selected timepieces, handcrafted leather goods, luxury footwear, and cutting-edge tech accessories.
                  </p>
                </Reveal>

                {/* Trust Highlights */}
                <Reveal delay={240} direction="up">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-neutral-700">
                    <div className="flex items-center gap-2 p-2 rounded-md bg-[#FAFAFB] border border-neutral-200/80">
                      <ShieldCheck className="w-4 h-4 text-[#8C6734] shrink-0" />
                      <span className="font-medium text-[11px] sm:text-xs">100% Verified Quality</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-md bg-[#FAFAFB] border border-neutral-200/80">
                      <Award className="w-4 h-4 text-[#8C6734] shrink-0" />
                      <span className="font-medium text-[11px] sm:text-xs">Brand Official Warranty</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex items-center gap-2 p-2 rounded-md bg-[#FAFAFB] border border-neutral-200/80">
                      <Truck className="w-4 h-4 text-[#8C6734] shrink-0" />
                      <span className="font-medium text-[11px] sm:text-xs">Fast Insured Delivery</span>
                    </div>
                  </div>
                </Reveal>

                {/* CTA Links */}
                <Reveal delay={300} direction="up">
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link
                      to="/shop"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#8C6734] transition-colors duration-200 shadow-sm"
                    >
                      <span>Explore Full Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Reveal>

              </div>

              {/* Right Column: Hero Visual Image (Requested Pinterest Image) */}
              <div className="lg:col-span-5">
                <Reveal delay={150} direction="left">
                  <div className="relative mx-auto max-w-md lg:max-w-none group">
                    <div className="aspect-[4/4.2] sm:aspect-[4/4.6] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-xl relative transition-transform duration-500 hover:shadow-2xl">
                      <img
                        src="https://i.pinimg.com/736x/c3/7a/84/c37a8441b798d917defa413de43a72a6.jpg"
                        alt="New Luxury Arrivals & Accessories"
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Floating Glassmorphism Tag */}
                      <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-lg border border-neutral-200/80 flex items-center justify-between text-xs shadow-md transition-all duration-300 group-hover:bg-white">
                        <div>
                          <p className="font-semibold text-neutral-950">New 2026 Collection</p>
                          <p className="text-[11px] text-neutral-500">Watches • Bags • Shoes • Tech</p>
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
        {/* 2. CATALOG & FILTER SECTION (Category Pills, Search, Sort & Product Grid) */}
        {/* ========================================================================= */}
        <section className="py-10 sm:py-14 bg-[#FAFAFB]">
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 2xl:px-12">

            {/* Filter Header Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated Edit</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-neutral-950 mt-1">
                  Fresh from the collection
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  {arrivals.length} {arrivals.length === 1 ? 'piece' : 'pieces'} available now
                </p>
              </div>

              {/* Search & Sort Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Input */}
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
              </div>
            </div>

            {/* Category Tabs Bar */}
            <div className="mt-6 flex gap-2.5 overflow-x-auto pb-3 pt-1 no-scrollbar">
              {categoryTabs.map((tab) => {
                const IconComponent = tab.icon;
                const isSelected = category === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCategory(tab.id)}
                    className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${isSelected
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

            {/* Products Grid */}
            {arrivals.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
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
              /* Empty State */
              <div className="mt-8 rounded-2xl border border-neutral-200/80 bg-white py-16 px-4 text-center max-w-md mx-auto shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-[#F5F2EB] text-[#8C6734] flex items-center justify-center mx-auto mb-4 border border-[#C5A880]/40">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-neutral-950 mb-1">
                  No products found
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                  {searchQuery
                    ? `No new arrivals matching "${searchQuery}" in ${category}.`
                    : 'We are currently adding new arrivals to this category.'}
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
                    <span>View All Shop</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}