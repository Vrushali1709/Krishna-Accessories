// src/pages/Shop.jsx
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import {
  getProducts,
  getCategories,
  getBrandsByCategory,
  getSubcategoriesByCategory,
  toggleWishlist,
  isInWishlist
} from '../utils/productStore';
import { addToCart } from '../utils/cart';
import {
  ShieldCheckIcon,
  SearchIcon,
  BagIcon,
  HeartIcon,
  ArrowRightIcon,
  TruckIcon,
  LockClosedIcon,
  BoxIcon
} from '../components/Icons';
import {
  SlidersHorizontal,
  LayoutGrid,
  Grid2X2,
  List,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Star,
  Tag,
  ArrowUpDown,
  Flame,
  Award
} from 'lucide-react';

// Predefined Quick Price Tiers
const PRICE_BRACKETS = [
  { id: 'all', label: 'All Prices', min: 0, max: 250000 },
  { id: 'under-5k', label: 'Under ₹5,000', min: 0, max: 5000 },
  { id: '5k-10k', label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { id: '10k-20k', label: '₹10,000 - ₹20,000', min: 10000, max: 20000 },
  { id: '20k-50k', label: '₹20,000 - ₹50,000', min: 20000, max: 50000 },
  { id: 'above-50k', label: 'Above ₹50,000', min: 50000, max: 250000 }
];

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
  const urlSort = searchParams.get('sort') || 'featured';

  // Base Products & Categories State
  const [products, setProducts] = useState(() => getProducts());
  const [categories, setCategories] = useState(() => ['All', ...getCategories()]);

  // Filter States
  const [category, setCategory] = useState(urlCategory);
  const [selectedBrand, setSelectedBrand] = useState(urlBrand);
  const [selectedSubcategory, setSelectedSubcategory] = useState(urlSubcategory);
  const [search, setSearch] = useState(urlSearch);
  const [minPrice, setMinPrice] = useState(urlMinPrice);
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice);
  const [activePriceBracket, setActivePriceBracket] = useState('all');
  const [minDiscount, setMinDiscount] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [brandSearchQuery, setBrandSearchQuery] = useState('');

  // Sorting & Layout Views
  const [sort, setSort] = useState(urlSort);
  const [viewMode, setViewMode] = useState('grid-3'); // 'grid-3', 'grid-4', 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // UI States
  const [mobileFilters, setMobileFilters] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Sync Products from localStorage
  useEffect(() => {
    const handleProductsUpdate = () => {
      setProducts(getProducts());
      setCategories(['All', ...getCategories()]);
    };
    window.addEventListener('productsUpdated', handleProductsUpdate);
    return () => window.removeEventListener('productsUpdated', handleProductsUpdate);
  }, []);

  // Sync URL State
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
    const brandsList = getBrandsByCategory(category);
    return ['All', ...brandsList];
  }, [category, products]);

  // Filtered Brands based on brand search box
  const visibleBrands = useMemo(() => {
    if (!brandSearchQuery.trim()) return dynamicBrands;
    const q = brandSearchQuery.toLowerCase().trim();
    return dynamicBrands.filter(b => b === 'All' || b.toLowerCase().includes(q));
  }, [dynamicBrands, brandSearchQuery]);

  // Dynamic Subcategories (Product Types) for selected category
  const dynamicSubcategories = useMemo(() => {
    const list = getSubcategoriesByCategory(category);
    return ['All', ...list];
  }, [category, products]);

  // Core Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Category Filter
    if (category !== 'All') {
      list = list.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }

    // 2. Subcategory / Product Type Filter
    if (selectedSubcategory !== 'All') {
      list = list.filter((p) => p.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase());
    }

    // 3. Brand Filter
    if (selectedBrand !== 'All') {
      list = list.filter((p) => p.brand?.toLowerCase() === selectedBrand.toLowerCase());
    }

    // 4. Price Range Filter
    list = list.filter((p) => Number(p.price) >= minPrice && Number(p.price) <= maxPrice);

    // 5. Discount Filter
    if (minDiscount > 0) {
      list = list.filter((p) => (p.discount || 0) >= minDiscount);
    }

    // 6. Rating Filter
    if (minRating > 0) {
      list = list.filter((p) => (p.rating || 0) >= minRating);
    }

    // 7. In Stock Only Filter
    if (inStockOnly) {
      list = list.filter((p) => (p.stock || 0) > 0);
    }

    // 8. Search query match
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

    // 9. Sorting
    if (sort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'discount') {
      list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    } else if (sort === 'newest') {
      list.sort((a, b) => b.id - a.id);
    } else if (sort === 'name-az') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return list;
  }, [products, category, selectedSubcategory, selectedBrand, minPrice, maxPrice, minDiscount, minRating, inStockOnly, search, sort]);

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, selectedBrand, selectedSubcategory, minPrice, maxPrice, minDiscount, minRating, inStockOnly, search, sort]);

  // Paginated Slicing
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(0, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Handlers for Filters
  const handleCategorySelect = (cat) => {
    setIsFiltering(true);
    setCategory(cat);
    setSelectedBrand('All');
    setSelectedSubcategory('All');
    setActivePriceBracket('all');

    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    params.delete('brand');
    params.delete('type');
    setSearchParams(params);
    setTimeout(() => setIsFiltering(false), 200);
  };

  const handleSubcategorySelect = (type) => {
    setIsFiltering(true);
    setSelectedSubcategory(type);
    const params = new URLSearchParams(searchParams);
    if (type === 'All') {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    setSearchParams(params);
    setTimeout(() => setIsFiltering(false), 200);
  };

  const handleBrandSelect = (brand) => {
    setIsFiltering(true);
    setSelectedBrand(brand);
    const params = new URLSearchParams(searchParams);
    if (brand === 'All') {
      params.delete('brand');
    } else {
      params.set('brand', brand);
    }
    setSearchParams(params);
    setTimeout(() => setIsFiltering(false), 200);
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
    setIsFiltering(true);
    setCategory('All');
    setSelectedBrand('All');
    setSelectedSubcategory('All');
    setSort('featured');
    setSearch('');
    setMinPrice(0);
    setMaxPrice(250000);
    setActivePriceBracket('all');
    setMinDiscount(0);
    setMinRating(0);
    setInStockOnly(false);
    setBrandSearchQuery('');
    setSearchParams({});
    setTimeout(() => setIsFiltering(false), 200);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setToastMessage(`✓ Added "${product.name}" to your shopping bag`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleBuyNow = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  const scrollToProducts = () => {
    if (productsTopRef.current) {
      productsTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Check how many active filters are applied
  const activeFiltersCount = [
    category !== 'All',
    selectedBrand !== 'All',
    selectedSubcategory !== 'All',
    search.trim() !== '',
    minPrice > 0 || maxPrice < 250000,
    minDiscount > 0,
    minRating > 0,
    inStockOnly
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
      <Navbar />

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/95 px-4 py-3 text-xs font-bold text-gray-950 shadow-2xl backdrop-blur-md animate-slide-up">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">
            ✓
          </span>
          <span>{toastMessage}</span>
          <Link
            to="/cart"
            className="ml-2 rounded-full bg-[#111827] px-3.5 py-1 text-[11px] font-bold text-white transition hover:bg-black"
          >
            View Bag &rarr;
          </Link>
        </div>
      )}

      {/* ================= 1. BREADCRUMBS & LUXURY HEADER ================= */}
      <section className="border-b border-gray-200/80 bg-white pt-4 pb-6 sm:pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb Trail */}
          <nav className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-3">
            <Link to="/" className="hover:text-black transition">Home</Link>
            <ChevronRight className="w-3 h-3 text-neutral-300" />
            <button
              onClick={() => handleCategorySelect('All')}
              className={`hover:text-black transition ${category === 'All' ? 'font-bold text-black' : ''}`}
            >
              Shop All
            </button>
            {category !== 'All' && (
              <>
                <ChevronRight className="w-3 h-3 text-neutral-300" />
                <span className="font-bold text-neutral-900">{category}</span>
              </>
            )}
            {selectedBrand !== 'All' && (
              <>
                <ChevronRight className="w-3 h-3 text-neutral-300" />
                <span className="font-bold text-[#B89758]">{selectedBrand}</span>
              </>
            )}
          </nav>

          {/* Header Banner Content */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#B89758] border border-amber-200/60">
                  <Award className="w-3 h-3" />
                  100% Certified Luxury Catalog
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                  {totalItems} Available Products
                </span>
              </div>

              <h1 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-gray-950">
                {category === 'All' ? 'Curated Luxury Collection' : `${category} Collection`}
                {selectedBrand !== 'All' && ` — ${selectedBrand}`}
              </h1>

              <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-2xl">
                Explore handcrafted luxury horology, designer leather goods, high-performance footwear, and flagship mobile devices backed by authorized warranties and insured Pan-India express delivery.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="hidden sm:flex items-center gap-3 bg-[#F4F4F6] border border-gray-200 rounded-2xl p-2 px-3 text-xs text-neutral-600 shrink-0">
              <div className="flex items-center gap-1.5">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Bespoke Quality</span>
              </div>
              <span className="text-gray-300">&bull;</span>
              <div className="flex items-center gap-1.5">
                <TruckIcon className="w-4 h-4 text-blue-600" />
                <span className="font-semibold">BlueDart Express</span>
              </div>
            </div>
          </div>

          {/* ================= 2. HORIZONTAL CATEGORY CHIPS CAROUSEL ================= */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => {
              const isActive = category === cat;
              const count = cat === 'All'
                ? products.length
                : products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;

              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs ${isActive
                    ? 'bg-[#111827] text-white shadow-md'
                    : 'bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 hover:text-black border border-gray-200/60'
                    }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-amber-300' : 'bg-gray-200 text-gray-600'
                    }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= 3. BRAND SPOTLIGHT STRIP ================= */}
      {dynamicBrands.length > 2 && (
        <section className="bg-[#FAF9F6] border-b border-gray-200/70 py-3">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 shrink-0 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-600" />
              Brand Spotlight:
            </span>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {dynamicBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => handleBrandSelect(brand)}
                  className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition cursor-pointer ${selectedBrand === brand
                    ? 'bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/80'
                    }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= 4. MAIN CATALOGUE WRAPPER ================= */}
      <main ref={productsTopRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Top Floating Action & Search Toolbar */}
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-gray-200/90 bg-white p-3 sm:p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">

          {/* Search Input Box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${category === 'All' ? 'all products' : category}, brands, specifications, references...`}
              className="w-full rounded-full border border-gray-200 bg-[#F4F4F6] py-2 pl-9 pr-9 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-black focus:bg-white"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-black font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Toolbar Controls (View Mode + Sort + Mobile Filter Button) */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5">

            {/* Mobile Filter Trigger Button */}
            <button
              type="button"
              onClick={() => setMobileFilters(true)}
              className="flex items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-[#F4F4F6] px-4 py-2 text-xs font-bold text-gray-900 lg:hidden hover:bg-gray-200 transition cursor-pointer shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* View Mode Switcher (Desktop & Tablet) */}
            <div className="hidden sm:flex items-center p-0.5 rounded-full bg-[#F4F4F6] border border-gray-200">
              <button
                type="button"
                title="3-Column Luxury Grid"
                onClick={() => setViewMode('grid-3')}
                className={`p-1.5 rounded-full transition cursor-pointer ${viewMode === 'grid-3' ? 'bg-white text-black shadow-2xs font-bold' : 'text-gray-500 hover:text-black'}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                title="4-Column Compact Grid"
                onClick={() => setViewMode('grid-4')}
                className={`p-1.5 rounded-full transition cursor-pointer ${viewMode === 'grid-4' ? 'bg-white text-black shadow-2xs font-bold' : 'text-gray-500 hover:text-black'}`}
              >
                <Grid2X2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                title="Detailed List View"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-full transition cursor-pointer ${viewMode === 'list' ? 'bg-white text-black shadow-2xs font-bold' : 'text-gray-500 hover:text-black'}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sort Selector Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="hidden lg:inline text-xs text-gray-400 font-semibold whitespace-nowrap">
                Sort:
              </span>
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="rounded-full border border-gray-200 bg-[#F4F4F6] px-3.5 py-2 text-xs font-semibold text-gray-900 outline-none focus:border-black cursor-pointer shadow-2xs"
              >
                <option value="featured">✨ Featured &amp; Best Match</option>
                <option value="price-low">₹ Price: Low to High</option>
                <option value="price-high">₹ Price: High to Low</option>
                <option value="rating">★ Customer Rating</option>
                <option value="discount">% Highest Discount</option>
                <option value="newest">✦ New Arrivals</option>
                <option value="name-az">🔤 Name (A - Z)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {activeFiltersCount > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-1.5 rounded-2xl border border-gray-200 bg-white p-2.5 sm:p-3 text-xs shadow-2xs animate-fade-in">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">
              Active Filters:
            </span>

            {category !== 'All' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-900 border border-gray-200">
                Category: <strong>{category}</strong>
                <button type="button" onClick={() => handleCategorySelect('All')} className="hover:text-red-600 font-bold ml-0.5 cursor-pointer">×</button>
              </span>
            )}

            {selectedSubcategory !== 'All' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 border border-amber-200">
                Type: <strong>{selectedSubcategory}</strong>
                <button type="button" onClick={() => handleSubcategorySelect('All')} className="hover:text-red-600 font-bold ml-0.5 cursor-pointer">×</button>
              </span>
            )}

            {selectedBrand !== 'All' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-900 border border-gray-200">
                Brand: <strong>{selectedBrand}</strong>
                <button type="button" onClick={() => handleBrandSelect('All')} className="hover:text-red-600 font-bold ml-0.5 cursor-pointer">×</button>
              </span>
            )}

            {(minPrice > 0 || maxPrice < 250000) && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-900 border border-gray-200">
                Price: <strong>₹{minPrice.toLocaleString('en-IN')} – ₹{maxPrice.toLocaleString('en-IN')}</strong>
                <button type="button" onClick={() => { setMinPrice(0); setMaxPrice(250000); setActivePriceBracket('all'); }} className="hover:text-red-600 font-bold ml-0.5 cursor-pointer">×</button>
              </span>
            )}

            {minDiscount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                Discount: <strong>{minDiscount}%+ OFF</strong>
                <button type="button" onClick={() => setMinDiscount(0)} className="hover:text-red-600 font-bold ml-0.5 cursor-pointer">×</button>
              </span>
            )}

            {minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                Rating: <strong>{minRating}★ &amp; Above</strong>
                <button type="button" onClick={() => setMinRating(0)} className="hover:text-red-600 font-bold ml-0.5 cursor-pointer">×</button>
              </span>
            )}

            {search && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                Search: <strong>"{search}"</strong>
                <button type="button" onClick={() => setSearch('')} className="hover:text-red-600 font-bold ml-0.5 cursor-pointer">×</button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <strong>In Stock Only</strong>
                <button type="button" onClick={() => setInStockOnly(false)} className="hover:text-red-600 font-bold ml-0.5 cursor-pointer">×</button>
              </span>
            )}

            <button
              type="button"
              onClick={clearAllFilters}
              className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-[#B89758] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* 2-Column Grid Layout: Sidebar Filters + Main Product Feed */}
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">

          {/* ================= 5. DESKTOP SIDEBAR FILTERS ================= */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-4 rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs">

              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-700" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-950">
                    Refine Catalog
                  </h3>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-[11px] font-bold text-[#B89758] hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* 1. Category Tree */}
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-950 mb-2">
                  Categories
                </h4>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const isSelected = category === cat;
                    const count = cat === 'All'
                      ? products.length
                      : products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategorySelect(cat)}
                        className={`w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${isSelected
                          ? 'bg-[#111827] text-white shadow-xs'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                          }`}
                      >
                        <span className="truncate">{cat}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-amber-300' : 'text-gray-400'
                          }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Product Type / Subcategories */}
              {dynamicSubcategories.length > 1 && (
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-950">
                      Product Type
                    </h4>
                    {selectedSubcategory !== 'All' && (
                      <button
                        type="button"
                        onClick={() => handleSubcategorySelect('All')}
                        className="text-[10px] font-bold text-[#B89758] hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {dynamicSubcategories.map((subcat) => {
                      const isSelected = selectedSubcategory === subcat;
                      const count = subcat === 'All'
                        ? (category === 'All' ? products.length : products.filter(p => p.category === category).length)
                        : products.filter(p => (category === 'All' || p.category === category) && p.subcategory === subcat).length;

                      return (
                        <button
                          key={subcat}
                          type="button"
                          onClick={() => handleSubcategorySelect(subcat)}
                          className={`w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${isSelected
                            ? 'bg-amber-100 font-bold text-amber-950 border border-amber-300'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                          <span className="truncate">{subcat}</span>
                          <span className="text-[10px] font-mono text-gray-400">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Brands for Selected Category */}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-950">
                    Brands {category !== 'All' && <span className="font-normal text-gray-400">({category})</span>}
                  </h4>
                  {selectedBrand !== 'All' && (
                    <button
                      type="button"
                      onClick={() => handleBrandSelect('All')}
                      className="text-[10px] font-bold text-[#B89758] hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Brand Search filter box if brands > 6 */}
                {dynamicBrands.length > 6 && (
                  <div className="mb-2">
                    <input
                      type="text"
                      value={brandSearchQuery}
                      onChange={(e) => setBrandSearchQuery(e.target.value)}
                      placeholder="Filter brands..."
                      className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-2.5 py-1 text-[11px] text-gray-900 outline-none focus:border-black"
                    />
                  </div>
                )}

                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {visibleBrands.map((brand) => {
                    const isSelected = selectedBrand === brand;
                    const brandCount = brand === 'All'
                      ? (category === 'All' ? products.length : products.filter(p => p.category === category).length)
                      : products.filter(p => (category === 'All' || p.category === category) && p.brand === brand).length;

                    return (
                      <label
                        key={brand}
                        onClick={() => handleBrandSelect(brand)}
                        className={`flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-1.5 text-xs transition ${isSelected
                          ? 'bg-gray-100 font-bold text-gray-950 border border-gray-300'
                          : 'text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <input
                            type="radio"
                            name="desktopBrandFilter"
                            checked={isSelected}
                            onChange={() => handleBrandSelect(brand)}
                            className="accent-[#111827] h-3 w-3"
                          />
                          <span className="truncate">{brand}</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400">({brandCount})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4. Price Brackets & Range */}
              <div className="border-t border-gray-100 pt-3">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-950 mb-2">
                  Price Tiers (₹)
                </h4>

                <div className="space-y-1 mb-2.5">
                  {PRICE_BRACKETS.map((bracket) => (
                    <button
                      key={bracket.id}
                      type="button"
                      onClick={() => handlePriceBracketSelect(bracket)}
                      className={`w-full text-left rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer flex items-center justify-between ${activePriceBracket === bracket.id
                        ? 'bg-neutral-900 text-amber-200'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <span>{bracket.label}</span>
                      {activePriceBracket === bracket.id && <span className="text-[10px]">✓</span>}
                    </button>
                  ))}
                </div>

                {/* Custom Min/Max input boxes */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 block mb-0.5 uppercase">Min (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={minPrice}
                      onChange={(e) => {
                        setActivePriceBracket('custom');
                        setMinPrice(Math.max(0, Number(e.target.value)));
                      }}
                      className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-2 py-1 text-xs font-mono text-gray-900 outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 block mb-0.5 uppercase">Max (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(e) => {
                        setActivePriceBracket('custom');
                        setMaxPrice(Math.max(0, Number(e.target.value)));
                      }}
                      className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-2 py-1 text-xs font-mono text-gray-900 outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Discount Tiers */}
              <div className="border-t border-gray-100 pt-3">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-950 mb-2">
                  Special Discounts
                </h4>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { val: 0, label: 'All Items' },
                    { val: 10, label: '10%+ OFF' },
                    { val: 20, label: '20%+ OFF' },
                    { val: 30, label: '30%+ OFF' }
                  ].map((disc) => (
                    <button
                      key={disc.val}
                      type="button"
                      onClick={() => setMinDiscount(disc.val)}
                      className={`rounded-lg py-1 px-2 text-[11px] font-bold text-center transition cursor-pointer ${minDiscount === disc.val
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {disc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Customer Ratings */}
              <div className="border-t border-gray-100 pt-3">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-950 mb-2">
                  Customer Ratings
                </h4>
                <div className="space-y-1">
                  {[
                    { val: 0, label: 'All Ratings' },
                    { val: 4.5, label: '★ 4.5 & Above' },
                    { val: 4.0, label: '★ 4.0 & Above' }
                  ].map((r) => (
                    <button
                      key={r.val}
                      type="button"
                      onClick={() => setMinRating(r.val)}
                      className={`w-full text-left rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer flex items-center justify-between ${minRating === r.val
                        ? 'bg-amber-100 text-amber-950 border border-amber-300 font-bold'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <span>{r.label}</span>
                      {minRating === r.val && <span>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* 7. Stock Availability */}
              <div className="border-t border-gray-100 pt-3">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">In Stock Items Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 accent-[#111827] cursor-pointer"
                  />
                </label>
              </div>

            </div>
          </aside>

          {/* ================= 6. MAIN PRODUCT FEED ================= */}
          <section className="min-w-0">

            {/* Results Count Bar */}
            <div className="mb-4 flex items-center justify-between text-xs text-neutral-500 font-medium">
              <span>
                Showing <strong className="text-gray-950 font-bold">{Math.min(paginatedProducts.length, totalItems)}</strong> of{' '}
                <strong className="text-gray-950 font-bold">{totalItems}</strong> items
              </span>

              <div className="flex items-center gap-2">
                <span>Items per view:</span>
                {[9, 18, 27].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setItemsPerPage(num)}
                    className={`px-2 py-0.5 rounded font-mono text-xs font-bold transition cursor-pointer ${itemsPerPage === num
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Container */}
            {isFiltering ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : totalItems > 0 ? (
              <>
                {/* 1. GRID 3-COLS VIEW */}
                {viewMode === 'grid-3' && (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4.5">
                    {paginatedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                      />
                    ))}
                  </div>
                )}

                {/* 2. GRID 4-COLS DENSE VIEW */}
                {viewMode === 'grid-4' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
                    {paginatedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                      />
                    ))}
                  </div>
                )}

                {/* 3. DETAILED LIST VIEW */}
                {viewMode === 'list' && (
                  <div className="space-y-3.5">
                    {paginatedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="group flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-xs transition hover:shadow-md hover:border-gray-300 gap-4"
                      >
                        {/* Image */}
                        <Link
                          to={`/product/${product.id}`}
                          className="h-32 w-32 shrink-0 overflow-hidden rounded-xl bg-[#F4F3F0] p-1 flex items-center justify-center"
                        >
                          <img
                            src={product.image || product.images?.[0]}
                            alt={product.name}
                            className="h-full w-full object-contain transition group-hover:scale-105"
                          />
                        </Link>

                        {/* Middle Details */}
                        <div className="flex-1 min-w-0 text-center sm:text-left">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B89758]">
                            {product.brand} &bull; {product.category}
                          </span>
                          <Link
                            to={`/product/${product.id}`}
                            className="block text-base font-bold text-gray-950 hover:underline truncate mt-0.5"
                          >
                            {product.name}
                          </Link>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-xs">
                            <span className="text-amber-500 font-bold">★ {product.rating || '4.8'}</span>
                            <span className="text-gray-400">&bull;</span>
                            <span className="text-emerald-700 font-semibold">{product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}</span>
                            <span className="text-gray-400">&bull;</span>
                            <span className="text-gray-500 font-mono text-[11px]">{product.sku}</span>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex flex-col sm:items-end justify-center gap-2 shrink-0 text-center sm:text-right w-full sm:w-auto">
                          <div className="flex sm:flex-col items-center sm:items-end justify-center gap-1.5">
                            <span className="text-lg font-black text-gray-950">
                              ₹{Number(product.price).toLocaleString('en-IN')}
                            </span>
                            {product.oldPrice && product.oldPrice > product.price && (
                              <span className="text-xs text-gray-400 line-through">
                                ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#111827] px-5 py-2 text-xs font-bold text-white hover:bg-black transition cursor-pointer"
                          >
                            <BagIcon className="w-3.5 h-3.5 text-amber-300" />
                            <span>Add to Bag</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ================= 7. PAGINATION & LOAD MORE BAR ================= */}
                <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-xs space-y-4">
                  
                  {/* Progress Bar Indicator */}
                  <div className="max-w-xs mx-auto space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-gray-500">
                      <span>Showing {Math.min(paginatedProducts.length, totalItems)} of {totalItems} items</span>
                      <span>{Math.round((Math.min(paginatedProducts.length, totalItems) / totalItems) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-black rounded-full transition-all duration-300"
                        style={{ width: `${(Math.min(paginatedProducts.length, totalItems) / totalItems) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Load More Button or Numbered Pages */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    {paginatedProducts.length < totalItems && (
                      <button
                        type="button"
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black shadow-sm transition active:scale-95 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Load More Products ({totalItems - paginatedProducts.length} remaining)</span>
                      </button>
                    )}

                    {totalPages > 1 && (
                      <div className="flex items-center gap-1 w-full justify-center mt-3">
                        <button
                          type="button"
                          disabled={currentPage === 1}
                          onClick={() => {
                            setCurrentPage(p => Math.max(1, p - 1));
                            scrollToProducts();
                          }}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
                        >
                          &larr; Prev
                        </button>

                        {Array.from({ length: totalPages }).map((_, idx) => {
                          const pageNum = idx + 1;
                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => {
                                setCurrentPage(pageNum);
                                scrollToProducts();
                              }}
                              className={`h-8 w-8 rounded-lg text-xs font-bold transition cursor-pointer ${currentPage === pageNum
                                ? 'bg-black text-white shadow-xs'
                                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          type="button"
                          disabled={currentPage === totalPages}
                          onClick={() => {
                            setCurrentPage(p => Math.min(totalPages, p + 1));
                            scrollToProducts();
                          }}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
                        >
                          Next &rarr;
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </>
            ) : (
              /* Empty Search / Filter State */
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-8 sm:p-12 text-center shadow-xs">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-2xl text-[#B89758] border border-amber-200">
                  🔍
                </div>
                <h3 className="mt-4 text-lg font-black text-gray-950">
                  No Matching Products Found
                </h3>
                <p className="mt-1 max-w-md text-xs text-gray-500 leading-relaxed">
                  We couldn't find any products in <strong>{category}</strong> matching your selected criteria. Try adjusting your brand, price range, or clearing filters.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#111827] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition cursor-pointer shadow-sm active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}

            {/* ================= 8. CURATED RECOMMENDATIONS ================= */}
            <div className="mt-12 border-t border-gray-200/80 pt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#B89758]">
                    Connoisseur Recommendations
                  </span>
                  <h3 className="text-lg font-black text-gray-950">
                    You May Also Appreciate
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleCategorySelect('Watches')}
                  className="text-xs font-bold text-neutral-800 hover:text-black hover:underline cursor-pointer"
                >
                  Explore Horology &rarr;
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
                {products.slice(0, 3).map((product) => (
                  <ProductCard
                    key={`curated-${product.id}`}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
                ))}
              </div>
            </div>

          </section>

        </div>

        {/* ================= 9. LUXURY TRUST FOOTER STRIP ================= */}
        <div className="mt-14 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1.5">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-[#B89758] border border-amber-200">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider">100% Certified Authentic</h4>
              <p className="text-[11px] text-gray-500">Rigorous boutique inspection with manufacturer warranty cards.</p>
            </div>

            <div className="space-y-1.5">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 border border-blue-200">
                <TruckIcon className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider">Insured BlueDart Delivery</h4>
              <p className="text-[11px] text-gray-500">Tamper-evident sealed packaging dispatched within 24 hours.</p>
            </div>

            <div className="space-y-1.5">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <BoxIcon className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider">7-Day Inspection Return</h4>
              <p className="text-[11px] text-gray-500">Hassle-free reverse courier pickup and prompt refund settlement.</p>
            </div>

            <div className="space-y-1.5">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 border border-purple-200">
                <LockClosedIcon className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider">256-Bit Encrypted Payments</h4>
              <p className="text-[11px] text-gray-500">Safe UPI, Cards, NetBanking, and Cash on Delivery options.</p>
            </div>
          </div>
        </div>

        {/* ================= 10. FREQUENTLY ASKED QUESTIONS ACCORDION ================= */}
        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#B89758]">Client Assistance</span>
            <h3 className="text-xl font-black text-gray-950 mt-1">Frequently Asked Questions</h3>
            <p className="text-xs text-gray-500 mt-1">Everything you need to know about purchasing, warranties, and delivery.</p>
          </div>

          <div className="divide-y divide-gray-100 max-w-3xl mx-auto text-xs">
            {[
              {
                q: 'How do I know the products are 100% genuine?',
                a: 'Every timepiece, leather bag, pair of sneakers, and tech gadget in our boutique is sourced directly through certified authorized channels and includes official stamped warranty cards and manufacturer serial codes.'
              },
              {
                q: 'How fast is express delivery across India?',
                a: 'We partner with BlueDart and Delhivery Express. Metro orders (Mumbai, Delhi, Bengaluru, Ahmedabad) typically arrive in 24 to 48 hours with real-time SMS and email tracking.'
              },
              {
                q: 'Can I return an item if the size or finish does not suit me?',
                a: 'Yes. We offer a 7-day inspection window. You can initiate a return directly from your profile account and our courier partner will pick up the parcel from your doorstep.'
              },
              {
                q: 'What payment modes are supported?',
                a: 'We support all major payment modes including UPI (Google Pay, PhonePe, Paytm), Credit & Debit cards, NetBanking, and Cash on Delivery (COD).'
              }
            ].map((faq, idx) => (
              <div key={idx} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-gray-950 text-xs sm:text-sm hover:text-amber-800 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-base text-gray-400 ml-2 font-mono">
                    {openFaqIndex === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaqIndex === idx && (
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed pl-1 animate-fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* ================= MOBILE FILTER SLIDE-OVER DRAWER ================= */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileFilters(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-xs sm:max-w-sm h-full bg-white shadow-2xl flex flex-col justify-between z-50 animate-slide-up">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3.5 bg-gray-50">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-black" />
                <span className="text-sm font-bold text-gray-950">Filters &amp; Refinements</span>
                <span className="rounded-full bg-black text-white px-2 py-0.2 text-[10px] font-black">
                  {totalItems}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">Categories</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs font-semibold transition ${category === cat
                        ? 'bg-[#111827] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <span>{cat}</span>
                      <span className="text-[10px] opacity-70">
                        ({cat === 'All' ? products.length : products.filter(p => p.category === cat).length})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Types */}
              {dynamicSubcategories.length > 1 && (
                <div className="border-t border-gray-100 pt-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">Product Type</h4>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {dynamicSubcategories.map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => handleSubcategorySelect(type)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs font-semibold transition ${selectedSubcategory === type
                          ? 'bg-amber-100 text-amber-950 border border-amber-300'
                          : 'text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        <span>{type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands */}
              <div className="border-t border-gray-100 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">Brands</h4>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {dynamicBrands.map((brand) => (
                    <label
                      key={brand}
                      onClick={() => handleBrandSelect(brand)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-1.5 text-xs transition ${selectedBrand === brand
                        ? 'bg-gray-100 font-bold text-gray-950'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="mobileBrandFilter"
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

              {/* Price Tiers */}
              <div className="border-t border-gray-100 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">Price Tiers</h4>
                <div className="space-y-1">
                  {PRICE_BRACKETS.map((bracket) => (
                    <button
                      key={bracket.id}
                      type="button"
                      onClick={() => handlePriceBracketSelect(bracket)}
                      className={`w-full text-left rounded-lg px-2.5 py-1 text-xs font-semibold transition flex items-center justify-between ${activePriceBracket === bracket.id
                        ? 'bg-black text-amber-300 font-bold'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <span>{bracket.label}</span>
                      {activePriceBracket === bracket.id && <span>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Only */}
              <div className="border-t border-gray-100 pt-3">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-xs font-bold text-gray-950">In Stock Items Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 accent-[#111827]"
                  />
                </label>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="border-t border-gray-200 p-3.5 bg-gray-50 flex items-center gap-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex-1 rounded-full border border-gray-300 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="flex-1 rounded-full bg-[#111827] py-2.5 text-xs font-bold text-white hover:bg-black"
              >
                Show {totalItems} Items
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}