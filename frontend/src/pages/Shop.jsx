// src/pages/Shop.jsx
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import {
  getProducts,
  getCategories,
  getBrandsByCategory,
  getSubcategoriesByCategory
} from '../utils/productStore';
import { addToCart } from '../utils/cart';
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  Search,
  RotateCcw,
  Sparkles,
  Watch,
  Briefcase,
  PackageCheck,
  Headphones,
  Glasses,
  Sparkle,
  ShieldCheck,
  Award,
  Truck,
  ArrowRight,
  ChevronDown,
  Filter,
  Check
} from 'lucide-react';

// =========================================================================
// CUSTOM ANIMATION HOOK: Intersection Observer for on-scroll reveals
// =========================================================================
function useInView(options = { threshold: 0.08, triggerOnce: true }) {
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

function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  threshold = 0.06
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

// Predefined Quick Price Tiers
const PRICE_BRACKETS = [
  { id: 'all', label: 'All Price Ranges', min: 0, max: 250000 },
  { id: 'under-5k', label: 'Under ₹5,000', min: 0, max: 5000 },
  { id: '5k-10k', label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { id: '10k-20k', label: '₹10,000 - ₹20,000', min: 10000, max: 20000 },
  { id: '20k-50k', label: '₹20,000 - ₹50,000', min: 20000, max: 50000 },
  { id: 'above-50k', label: 'Above ₹50,000', min: 50000, max: 250000 }
];

const categoryTabIcons = {
  'All': Sparkles,
  'Watches': Watch,
  'Bags & Wallets': Briefcase,
  'Shoes': PackageCheck,
  'Electronics': Headphones,
  'Fashion Accessories': Glasses,
  'Mobiles': Sparkle
};

export default function Shop() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const productsTopRef = useRef(null);

  // URL Query Parameters
  const urlCategory = searchParams.get('category') || 'All';
  const urlBrand = searchParams.get('brand') || 'All';
  const urlSubcategory = searchParams.get('type') || 'All';
  const urlSearch = searchParams.get('search') || '';
  const urlMinPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0;
  const urlMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 250000;
  const urlSort = searchParams.get('sort') || 'newest';

  // Base Products & Categories State
  const [products, setProducts] = useState(() => getProducts());
  const [categories, setCategories] = useState(() => [
    'All',
    ...getCategories().map(c => typeof c === 'object' && c !== null ? c.name : String(c)).filter(Boolean)
  ]);

  // Filter States
  const [category, setCategory] = useState(urlCategory);
  const [selectedBrand, setSelectedBrand] = useState(urlBrand);
  const [selectedSubcategory, setSelectedSubcategory] = useState(urlSubcategory);
  const [search, setSearch] = useState(urlSearch);
  const [minPrice, setMinPrice] = useState(urlMinPrice);
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice);
  const [activePriceBracket, setActivePriceBracket] = useState('all');
  const [minDiscount, setMinDiscount] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [brandSearchQuery, setBrandSearchQuery] = useState('');

  // Sorting & Layout Views
  const [sort, setSort] = useState(urlSort);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // UI States
  const [mobileFilters, setMobileFilters] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Sync Products
  useEffect(() => {
    const handleProductsUpdate = () => {
      setProducts(getProducts());
      setCategories(['All', ...getCategories().map(c => typeof c === 'object' && c !== null ? c.name : String(c)).filter(Boolean)]);
    };
    window.addEventListener('productsUpdated', handleProductsUpdate);
    return () => window.removeEventListener('productsUpdated', handleProductsUpdate);
  }, []);

  // Sync URL State changes
  useEffect(() => {
    if (urlCategory && urlCategory !== category) {
      setCategory(urlCategory);
      setSelectedBrand('All');
      setSelectedSubcategory('All');
    }
  }, [urlCategory]);

  useEffect(() => {
    if (urlBrand && urlBrand !== selectedBrand) setSelectedBrand(urlBrand);
  }, [urlBrand]);

  useEffect(() => {
    if (urlSubcategory && urlSubcategory !== selectedSubcategory) setSelectedSubcategory(urlSubcategory);
  }, [urlSubcategory]);

  useEffect(() => {
    if (urlSearch !== search) setSearch(urlSearch);
  }, [urlSearch]);

  // Dynamic Brands based on selected category
  const dynamicBrands = useMemo(() => {
    const brandsList = getBrandsByCategory(category).map(b => typeof b === 'object' && b !== null ? b.name : String(b)).filter(Boolean);
    return ['All', ...brandsList];
  }, [category, products]);

  // Filtered Brands
  const visibleBrands = useMemo(() => {
    if (!brandSearchQuery.trim()) return dynamicBrands;
    const q = brandSearchQuery.toLowerCase().trim();
    return dynamicBrands.filter(b => b === 'All' || b.toLowerCase().includes(q));
  }, [dynamicBrands, brandSearchQuery]);

  // Dynamic Subcategories
  const dynamicSubcategories = useMemo(() => {
    const list = getSubcategoriesByCategory(category).map(s => typeof s === 'object' && s !== null ? s.name : String(s)).filter(Boolean);
    return ['All', ...list];
  }, [category, products]);

  // Core Filtering Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (category !== 'All') {
      list = list.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (selectedSubcategory !== 'All') {
      list = list.filter((p) => p.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase());
    }

    if (selectedBrand !== 'All') {
      list = list.filter((p) => p.brand?.toLowerCase() === selectedBrand.toLowerCase());
    }

    list = list.filter((p) => Number(p.price) >= minPrice && Number(p.price) <= maxPrice);

    if (minDiscount > 0) {
      list = list.filter((p) => (p.discount || 0) >= minDiscount);
    }

    if (inStockOnly) {
      list = list.filter((p) => (p.stock || 0) > 0);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === 'discount') list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    else if (sort === 'newest') list.sort((a, b) => b.id - a.id);

    return list;
  }, [products, category, selectedSubcategory, selectedBrand, minPrice, maxPrice, minDiscount, inStockOnly, search, sort]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, selectedBrand, selectedSubcategory, minPrice, maxPrice, minDiscount, inStockOnly, search, sort]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setSelectedBrand('All');
    setSelectedSubcategory('All');
    setActivePriceBracket('all');

    const params = new URLSearchParams(searchParams);
    if (cat === 'All') params.delete('category');
    else params.set('category', cat);
    params.delete('brand');
    params.delete('type');
    setSearchParams(params);
  };

  const handleSubcategorySelect = (type) => {
    setSelectedSubcategory(type);
    const params = new URLSearchParams(searchParams);
    if (type === 'All') params.delete('type');
    else params.set('type', type);
    setSearchParams(params);
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    const params = new URLSearchParams(searchParams);
    if (brand === 'All') params.delete('brand');
    else params.set('brand', brand);
    setSearchParams(params);
  };

  const handlePriceBracketSelect = (bracket) => {
    setActivePriceBracket(bracket.id);
    setMinPrice(bracket.min);
    setMaxPrice(bracket.max);
    const params = new URLSearchParams(searchParams);
    if (bracket.min > 0) params.set('minPrice', bracket.min.toString());
    else params.delete('minPrice');
    if (bracket.max < 250000) params.set('maxPrice', bracket.max.toString());
    else params.delete('maxPrice');
    setSearchParams(params);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setCategory('All');
    setSelectedBrand('All');
    setSelectedSubcategory('All');
    setSort('newest');
    setSearch('');
    setMinPrice(0);
    setMaxPrice(250000);
    setActivePriceBracket('all');
    setMinDiscount(0);
    setInStockOnly(false);
    setBrandSearchQuery('');
    setSearchParams({});
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setToastMessage(`✓ Added "${product.name}" to your bag`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleBuyNow = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  const scrollToProducts = () => {
    if (productsTopRef.current) {
      productsTopRef.current.scrollIntoView({ behavior: 'smooth' });
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

      {/* ========================================================================= */}
      {/* 1. HERO BANNER (Luxury Editorial Header Matching About & New Arrivals)    */}
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

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-4 text-left">
              {/* Eyebrow Badge with Pulse */}
              <Reveal delay={0} direction="up">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#8C6734] animate-ping" />
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8C6734]">
                    The Complete Collection &bull; 2026 Edition
                  </span>
                </div>
              </Reveal>

              {/* Editorial Serif Heading */}
              <Reveal delay={100} direction="up">
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-[48px] font-medium tracking-tight text-neutral-950 leading-[1.15]">
                  Boutique Catalog <br />
                  <span className="italic font-normal text-[#8C6734]">Curated Distinction &amp; Craftsmanship.</span>
                </h1>
              </Reveal>

              {/* Description */}
              <Reveal delay={180} direction="up">
                <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed max-w-xl">
                  Browse our multi-category curation of precision timepieces, handcrafted Italian leather, designer footwear, and modern electronics with official brand warranty.
                </p>
              </Reveal>

              {/* Trust Badges Bar */}
              <Reveal delay={240} direction="up">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-neutral-700">
                  <div className="flex items-center gap-2 p-2 rounded-md bg-[#FAFAFB] border border-neutral-200/80">
                    <ShieldCheck className="w-4 h-4 text-[#8C6734] shrink-0" />
                    <span className="font-medium text-[11px]">100% Quality Checked</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-md bg-[#FAFAFB] border border-neutral-200/80">
                    <Award className="w-4 h-4 text-[#8C6734] shrink-0" />
                    <span className="font-medium text-[11px]">Brand Official Warranty</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex items-center gap-2 p-2 rounded-md bg-[#FAFAFB] border border-neutral-200/80">
                    <Truck className="w-4 h-4 text-[#8C6734] shrink-0" />
                    <span className="font-medium text-[11px]">Insured Air Delivery</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5">
              <Reveal delay={150} direction="left">
                <div className="relative mx-auto max-w-md lg:max-w-none group">
                  <div className="aspect-[4/3.8] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-xl relative transition-transform duration-500 hover:shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"
                      alt="Krishna Accessories Luxury Boutique"
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Floating Glassmorphism Tag */}
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3.5 rounded-lg border border-neutral-200/80 flex items-center justify-between text-xs shadow-md transition-all duration-300 group-hover:bg-white">
                      <div>
                        <p className="font-semibold text-neutral-950">Curated Multi-Category Store</p>
                        <p className="text-[11px] text-neutral-500">{products.length}+ Verified Pieces in Stock</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6734] bg-[#F5F2EB] px-2.5 py-1 rounded-sm border border-[#C5A880]/40">
                        Live Catalog
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
      {/* 2. CATALOG & FILTER SECTION                                               */}
      {/* ========================================================================= */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8" ref={productsTopRef}>

        {/* Filter Controls Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Catalog Navigation</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-neutral-950 mt-1">
              {category === 'All' ? 'All Collections' : category}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} available for delivery
            </p>
          </div>

          {/* Search, Sort & Layout Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[190px] sm:min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search collection..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]/30 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs cursor-pointer"
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
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#8C6734] transition-all cursor-pointer"
                >
                  <option value="newest">Latest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Highest Discount</option>
                </select>
              </label>
            </div>

            {/* View Mode Switcher */}
            <div className="hidden sm:flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-neutral-950 text-white' : 'text-neutral-500 hover:text-neutral-950'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md text-xs transition cursor-pointer ${
                  viewMode === 'list' ? 'bg-neutral-950 text-white' : 'text-neutral-500 hover:text-neutral-950'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Filter Trigger Button */}
            <button
              type="button"
              onClick={() => setMobileFilters(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-800"
            >
              <Filter className="w-3.5 h-3.5 text-[#8C6734]" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Category Tabs Strip */}
        <div className="mt-6 flex gap-2.5 overflow-x-auto pb-3 pt-1 no-scrollbar">
          {categories.map((cat) => {
            const IconComponent = categoryTabIcons[cat] || Sparkles;
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-950 text-white shadow-sm border border-neutral-950 ring-2 ring-[#C5A880]/30'
                    : 'bg-white text-neutral-700 border border-neutral-200/80 hover:border-[#C5A880] hover:bg-neutral-50'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-[#C5A880]' : 'text-[#8C6734]'}`} />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Main Grid: Sidebar Filters + Products Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">

          {/* Desktop Left Sidebar Filters (3 cols) */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs space-y-5">
              
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="font-serif text-base font-medium text-neutral-950">Filters &amp; Refine</span>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-[11px] font-semibold text-[#8C6734] hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              </div>

              {/* Price Range Tiers */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">Price Tier</h4>
                <div className="space-y-1">
                  {PRICE_BRACKETS.map((bracket) => (
                    <button
                      key={bracket.id}
                      type="button"
                      onClick={() => handlePriceBracketSelect(bracket)}
                      className={`w-full text-left rounded-lg px-3 py-1.5 text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                        activePriceBracket === bracket.id
                          ? 'bg-neutral-950 text-white font-semibold'
                          : 'text-neutral-700 hover:bg-[#FAFAFB]'
                      }`}
                    >
                      <span>{bracket.label}</span>
                      {activePriceBracket === bracket.id && <span className="text-[#C5A880] text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories (if available) */}
              {dynamicSubcategories.length > 2 && (
                <div className="border-t border-neutral-100 pt-4 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">Product Type</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                    {dynamicSubcategories.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleSubcategorySelect(type)}
                        className={`w-full text-left rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                          selectedSubcategory === type
                            ? 'bg-[#F5F2EB] text-[#8C6734] font-bold border border-[#C5A880]/40'
                            : 'text-neutral-700 hover:bg-[#FAFAFB]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands Filter */}
              {dynamicBrands.length > 2 && (
                <div className="border-t border-neutral-100 pt-4 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">Brand Partner</h4>
                  
                  {/* Brand search box */}
                  <div className="relative mb-2">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-400" />
                    <input
                      type="text"
                      value={brandSearchQuery}
                      onChange={(e) => setBrandSearchQuery(e.target.value)}
                      placeholder="Search brands..."
                      className="w-full pl-7 pr-2 py-1.5 rounded-md border border-neutral-200 bg-[#FAFAFB] text-xs outline-none focus:border-[#8C6734]"
                    />
                  </div>

                  <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                    {visibleBrands.map((brand) => (
                      <label
                        key={brand}
                        onClick={() => handleBrandSelect(brand)}
                        className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition cursor-pointer ${
                          selectedBrand === brand
                            ? 'bg-neutral-100 font-bold text-neutral-950'
                            : 'text-neutral-600 hover:bg-[#FAFAFB]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="brandFilter"
                            checked={selectedBrand === brand}
                            onChange={() => handleBrandSelect(brand)}
                            className="accent-[#111827] h-3.5 w-3.5"
                          />
                          <span>{brand}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* In Stock Only Checkbox */}
              <div className="border-t border-neutral-100 pt-4">
                <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-neutral-900">
                  <span>In Stock Pieces Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 accent-[#111827]"
                  />
                </label>
              </div>

            </div>
          </div>

          {/* Products Display (9 cols) */}
          <div className="lg:col-span-9">

            {paginatedProducts.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  /* Grid Mode */
                  <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-3">
                    {paginatedProducts.map((product, index) => (
                      <Reveal key={product.id} delay={Math.min(index * 30, 240)} direction="up">
                        <ProductCard
                          product={product}
                          onAddToCart={handleAddToCart}
                          onBuyNow={handleBuyNow}
                        />
                      </Reveal>
                    ))}
                  </div>
                ) : (
                  /* List Mode */
                  <div className="space-y-3.5">
                    {paginatedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="group flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:border-[#C5A880]/60 hover:shadow-md gap-4"
                      >
                        <Link
                          to={`/product/${product.id}`}
                          className="h-28 w-28 shrink-0 bg-[#FAFAFB] rounded-xl border border-neutral-200 p-2 flex items-center justify-center overflow-hidden"
                        >
                          <img
                            src={product.image || product.images?.[0]}
                            alt={product.name}
                            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>

                        <div className="flex-1 text-center sm:text-left min-w-0 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6734]">
                            {product.brand} &bull; {product.category}
                          </span>
                          <Link
                            to={`/product/${product.id}`}
                            className="block font-serif text-base font-medium text-neutral-950 hover:text-[#8C6734] truncate"
                          >
                            {product.name}
                          </Link>
                          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
                            <span className="text-amber-500 font-bold">★ {product.rating || '4.8'}</span>
                            <span className="text-neutral-300">&bull;</span>
                            <span className="text-emerald-700 font-semibold">{product.stock > 0 ? `${product.stock} In Stock` : 'Backorder Available'}</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto text-center sm:text-right">
                          <span className="font-serif text-lg font-medium text-neutral-950">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C6734] transition-colors cursor-pointer"
                          >
                            <span>Add to Bag</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => { setCurrentPage(p => p - 1); scrollToProducts(); }}
                      className="px-4 py-2 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 cursor-pointer"
                    >
                      &larr; Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => { setCurrentPage(pageNum); scrollToProducts(); }}
                            className={`h-8 w-8 rounded-lg text-xs font-bold transition cursor-pointer ${
                              currentPage === pageNum
                                ? 'bg-neutral-950 text-white shadow-2xs'
                                : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => { setCurrentPage(p => p + 1); scrollToProducts(); }}
                      className="px-4 py-2 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 cursor-pointer"
                    >
                      Next &rarr;
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty Search / Filter State */
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-12 text-center max-w-md mx-auto shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-[#F5F2EB] text-[#8C6734] flex items-center justify-center mx-auto mb-4 border border-[#C5A880]/40">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-neutral-950 mb-1">
                  No Matching Products Found
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                  We couldn't find pieces in <strong>{category}</strong> matching your selected filter criteria.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C6734] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </main>

      {/* Mobile Slide-Over Filter Drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden animate-fade-in">
          <div
            onClick={() => setMobileFilters(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-xs h-full bg-white shadow-2xl flex flex-col justify-between z-50">
            <div className="flex items-center justify-between border-b border-neutral-200 p-4">
              <span className="font-serif text-base font-medium text-neutral-950">Filters &amp; Refine</span>
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="text-neutral-500 hover:text-neutral-950 text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
              <div>
                <h4 className="font-bold uppercase tracking-wider text-neutral-900 mb-2">Category</h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg font-medium transition cursor-pointer ${
                        category === cat ? 'bg-neutral-950 text-white' : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-3">
                <h4 className="font-bold uppercase tracking-wider text-neutral-900 mb-2">Price Tiers</h4>
                <div className="space-y-1">
                  {PRICE_BRACKETS.map((bracket) => (
                    <button
                      key={bracket.id}
                      type="button"
                      onClick={() => handlePriceBracketSelect(bracket)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                        activePriceBracket === bracket.id ? 'bg-[#F5F2EB] text-[#8C6734] font-bold' : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {bracket.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200 p-4 flex gap-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex-1 py-2.5 border border-neutral-300 rounded-md font-semibold text-xs text-neutral-800 hover:bg-neutral-50 cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="flex-1 py-2.5 bg-neutral-950 text-white rounded-md font-semibold text-xs uppercase tracking-wider hover:bg-[#8C6734] cursor-pointer"
              >
                Show ({totalItems})
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}