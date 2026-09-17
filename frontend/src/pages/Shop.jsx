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
import { Reveal } from '../components/useScrollReveal';

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
  const [categories, setCategories] = useState(() => ['All', ...getCategories().map(c => typeof c === 'object' && c !== null ? c.name : String(c)).filter(Boolean)]);

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

  // Sync Products from localStorage
  useEffect(() => {
    const handleProductsUpdate = () => {
      setProducts(getProducts());
      setCategories(['All', ...getCategories().map(c => typeof c === 'object' && c !== null ? c.name : String(c)).filter(Boolean)]);
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
    const brandsList = getBrandsByCategory(category).map(b => typeof b === 'object' && b !== null ? b.name : String(b)).filter(Boolean);
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
    const list = getSubcategoriesByCategory(category).map(s => typeof s === 'object' && s !== null ? s.name : String(s)).filter(Boolean);
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
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-5 py-3.5 text-xs font-semibold text-neutral-900 shadow-2xl animate-slide-up">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            ✓
          </span>
          <span>{toastMessage}</span>
          <Link
            to="/cart"
            className="ml-2 rounded-lg bg-neutral-950 px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#8C6734] transition-colors"
          >
            View Bag &rarr;
          </Link>
        </div>
      )}

      {/* Luxury Editorial Header Section */}
      <section className="border-b border-neutral-200/80 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal delay={0} direction="up">
            {/* Breadcrumb Trail */}
            <nav className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-3">
              <Link to="/" className="hover:text-neutral-950 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-neutral-300" />
              <button
                onClick={() => handleCategorySelect('All')}
                className={`hover:text-neutral-950 transition-colors cursor-pointer ${category === 'All' ? 'font-semibold text-neutral-950' : ''}`}
              >
                Catalog
              </button>
              {category !== 'All' && (
                <>
                  <ChevronRight className="w-3 h-3 text-neutral-300" />
                  <span className="font-semibold text-neutral-950">{category}</span>
                </>
              )}
              {selectedBrand !== 'All' && (
                <>
                  <ChevronRight className="w-3 h-3 text-neutral-300" />
                  <span className="font-semibold text-[#8C6734]">{selectedBrand}</span>
                </>
              )}
            </nav>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734] animate-ping" />
                  <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#8C6734]">
                    Curated Boutique Catalog
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-4xl font-medium tracking-tight text-neutral-950">
                  {category === 'All' ? (
                    <>Complete <span className="italic font-normal text-[#8C6734]">Collection</span></>
                  ) : (
                    <>{category} <span className="italic font-normal text-[#8C6734]">{selectedBrand !== 'All' ? `• ${selectedBrand}` : 'Catalog'}</span></>
                  )}
                </h1>
                <p className="text-xs text-neutral-500 font-normal">
                  {totalItems} verified products available with insured BlueDart express delivery across India.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Main Catalogue Container with Persistent Side Filters */}
      <main ref={productsTopRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-8">

          {/* ================= LEFT SIDEBAR FILTERS (Luxury About Us Style) ================= */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-6 bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-sm">

              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#8C6734]" />
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-950">Refine Selection</span>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-xs font-semibold text-[#8C6734] hover:underline cursor-pointer"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* 1. Categories Section */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400 mb-2.5">Categories</h4>
                <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
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
                        className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#FAF8F5] text-[#8C6734] font-bold border border-[#C5A880]/50'
                            : 'text-neutral-600 hover:bg-[#FAF8F5] hover:text-neutral-950'
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isSelected ? 'bg-[#F5F2EB] text-[#8C6734] font-bold' : 'text-neutral-400'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Product Type / Subcategories */}
              {dynamicSubcategories.length > 1 && (
                <div className="border-t border-neutral-100 pt-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400 mb-2.5">Product Type</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                    {dynamicSubcategories.map((subcat) => {
                      const isSelected = selectedSubcategory === subcat;
                      return (
                        <button
                          key={subcat}
                          type="button"
                          onClick={() => handleSubcategorySelect(subcat)}
                          className={`w-full flex items-center justify-between rounded-lg px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#FAF8F5] text-[#8C6734] font-bold border border-[#C5A880]/40'
                              : 'text-neutral-600 hover:bg-[#FAF8F5] hover:text-neutral-950'
                          }`}
                        >
                          <span className="truncate">{subcat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Brand Filter Section */}
              <div className="border-t border-neutral-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">Brand Partners</h4>
                  {selectedBrand !== 'All' && (
                    <button
                      type="button"
                      onClick={() => handleBrandSelect('All')}
                      className="text-[11px] font-semibold text-[#8C6734] hover:underline cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {dynamicBrands.length > 5 && (
                  <div className="mb-2.5">
                    <input
                      type="text"
                      value={brandSearchQuery}
                      onChange={(e) => setBrandSearchQuery(e.target.value)}
                      placeholder="Search brands..."
                      className="w-full rounded-lg border border-neutral-200/90 bg-[#FAFAFB] px-3 py-1.5 text-xs text-neutral-900 outline-none transition-colors focus:border-[#C5A880] focus:bg-white"
                    />
                  </div>
                )}

                <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                  {visibleBrands.map((brand) => {
                    const isSelected = selectedBrand === brand;
                    return (
                      <label
                        key={brand}
                        onClick={() => handleBrandSelect(brand)}
                        className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-1.5 text-xs transition-colors ${
                          isSelected ? 'bg-[#FAF8F5] font-bold text-[#8C6734]' : 'text-neutral-600 hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <input
                            type="radio"
                            name="desktopBrandFilter"
                            checked={isSelected}
                            onChange={() => handleBrandSelect(brand)}
                            className="accent-[#8C6734] h-3.5 w-3.5"
                          />
                          <span className="truncate">{brand}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4. Price Tiers */}
              <div className="border-t border-neutral-100 pt-4">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400 mb-2.5">Price Range</h4>
                <div className="space-y-1">
                  {PRICE_BRACKETS.map((bracket) => (
                    <button
                      key={bracket.id}
                      type="button"
                      onClick={() => handlePriceBracketSelect(bracket)}
                      className={`w-full text-left rounded-lg px-3 py-1.5 text-xs transition-colors cursor-pointer flex items-center justify-between ${
                        activePriceBracket === bracket.id
                          ? 'bg-neutral-950 text-white font-medium'
                          : 'text-neutral-600 hover:bg-[#FAF8F5] hover:text-neutral-950'
                      }`}
                    >
                      <span>{bracket.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. In Stock Only */}
              <div className="border-t border-neutral-100 pt-4">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-xs font-medium text-neutral-900">In Stock Pieces Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 accent-[#8C6734] cursor-pointer"
                  />
                </label>
              </div>

            </div>
          </aside>

          {/* ================= RIGHT CONTENT AREA ================= */}
          <div className="min-w-0">

            {/* Top Toolbar: Search + Layout + Sort */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between bg-white border border-neutral-200/90 p-3.5 rounded-2xl shadow-sm">
              
              {/* Search Bar */}
              <div className="relative w-full sm:max-w-xs">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search curated products..."
                  className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFB] py-2 pl-9 pr-8 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#C5A880] focus:bg-white"
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-3.5 h-3.5" />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-900 font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                {/* Mobile Filter Button */}
                <button
                  type="button"
                  onClick={() => setMobileFilters(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-semibold text-neutral-900 lg:hidden hover:bg-[#F5F2EB] transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C6734]" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#8C6734] text-[10px] font-bold text-white">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* View Mode Switcher */}
                <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-[#FAF8F5] border border-neutral-200/80">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid-3')}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'grid-3' ? 'bg-white text-neutral-950 shadow-2xs font-bold' : 'text-neutral-400 hover:text-neutral-900'}`}
                    title="3-Column Grid"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid-4')}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'grid-4' ? 'bg-white text-neutral-950 shadow-2xs font-bold' : 'text-neutral-400 hover:text-neutral-900'}`}
                    title="4-Column Grid"
                  >
                    <Grid2X2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-white text-neutral-950 shadow-2xs font-bold' : 'text-neutral-400 hover:text-neutral-900'}`}
                    title="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="rounded-lg border border-neutral-200 bg-[#FAFAFB] px-3.5 py-2 text-xs font-semibold text-neutral-900 outline-none transition-colors focus:border-[#C5A880] cursor-pointer"
                >
                  <option value="featured">Featured &amp; Best Match</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>

            </div>

            {/* Active Filters Pill Bar */}
            {activeFiltersCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl bg-white border border-neutral-200/90 p-3 text-xs shadow-2xs">
                <span className="text-neutral-400 font-medium">Active Filters:</span>
                {category !== 'All' && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF8F5] border border-[#C5A880]/40 px-2.5 py-1 text-xs font-semibold text-[#8C6734]">
                    {category} <button onClick={() => handleCategorySelect('All')} className="font-bold hover:text-red-600 cursor-pointer">×</button>
                  </span>
                )}
                {selectedBrand !== 'All' && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF8F5] border border-[#C5A880]/40 px-2.5 py-1 text-xs font-semibold text-[#8C6734]">
                    {selectedBrand} <button onClick={() => handleBrandSelect('All')} className="font-bold hover:text-red-600 cursor-pointer">×</button>
                  </span>
                )}
                {selectedSubcategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF8F5] border border-[#C5A880]/40 px-2.5 py-1 text-xs font-semibold text-[#8C6734]">
                    {selectedSubcategory} <button onClick={() => handleSubcategorySelect('All')} className="font-bold hover:text-red-600 cursor-pointer">×</button>
                  </span>
                )}
                <button onClick={clearAllFilters} className="ml-auto text-xs font-semibold text-[#8C6734] hover:underline cursor-pointer">
                  Clear All
                </button>
              </div>
            )}

            {/* Products Listing Grid */}
            {isFiltering ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : totalItems > 0 ? (
              <>
                {viewMode === 'grid-3' && (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

                {viewMode === 'grid-4' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
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

                {viewMode === 'list' && (
                  <div className="space-y-4">
                    {paginatedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm hover:border-[#C5A880] gap-5 transition-all duration-300 group"
                      >
                        <Link to={`/product/${product.id}`} className="h-32 w-32 shrink-0 bg-[#FAF8F5] rounded-xl p-2.5 flex items-center justify-center border border-neutral-200/80">
                          <img src={product.image || product.images?.[0]} alt={product.name} className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                        </Link>
                        <div className="flex-1 text-center sm:text-left min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8C6734]">{product.brand} &bull; {product.category}</span>
                          <Link to={`/product/${product.id}`} className="block font-medium text-base text-neutral-950 truncate mt-0.5 hover:text-[#8C6734] transition-colors">
                            {product.name}
                          </Link>
                          <p className="text-xs text-neutral-500 line-clamp-2 mt-1 font-normal leading-relaxed">{product.description}</p>
                          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-xs">
                            <span className="text-amber-500 font-bold">★ {product.rating || '4.8'}</span>
                            <span className="text-neutral-300">&bull;</span>
                            <span className="text-emerald-700 font-semibold">{product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}</span>
                            <span className="text-neutral-300">&bull;</span>
                            <span className="text-neutral-400 font-mono text-[11px]">{product.sku}</span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2.5 w-full sm:w-auto shrink-0">
                          <span className="font-serif text-lg font-bold text-neutral-950 tabular-nums">₹{Number(product.price).toLocaleString('en-IN')}</span>
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="rounded-lg bg-neutral-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#8C6734] transition-colors cursor-pointer"
                          >
                            Add to Bag
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <div className="mt-10 flex items-center justify-center gap-2.5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => { setCurrentPage(p => p - 1); scrollToProducts(); }}
                    className="px-4 py-2.5 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-[#FAF8F5] disabled:opacity-40 cursor-pointer transition-colors"
                  >
                    &larr; Previous
                  </button>
                  <span className="text-xs font-semibold text-neutral-600 px-3">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => { setCurrentPage(p => p + 1); scrollToProducts(); }}
                    className="px-4 py-2.5 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-[#FAF8F5] disabled:opacity-40 cursor-pointer transition-colors"
                  >
                    Next &rarr;
                  </button>
                </div>
              </>
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-neutral-200/90 bg-white p-8 sm:p-12 text-center shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#8C6734] border border-[#C5A880]/50 mb-3">
                  🔍
                </div>
                <h3 className="font-serif text-xl font-medium text-neutral-950">No Matching Products Found</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  We couldn't find any items matching your filter combination. Try clearing filters to see all pieces.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-5 rounded-lg bg-neutral-950 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#8C6734] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

          </div>

        </div>

      </main>

      {/* Mobile Filter Slide-over Drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div onClick={() => setMobileFilters(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-in" />
          <div className="relative w-full max-w-xs h-full bg-white shadow-2xl flex flex-col justify-between z-50 animate-slide-up">
            <div className="flex items-center justify-between border-b border-neutral-200 p-4 bg-[#FAF8F5]">
              <span className="text-sm font-bold text-neutral-950">Filters &amp; Refinements</span>
              <button onClick={() => setMobileFilters(false)} className="text-xs font-bold text-neutral-500 hover:text-black cursor-pointer">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div>
                <h4 className="font-bold uppercase tracking-wider text-neutral-900 mb-2">Categories</h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${category === cat ? 'bg-neutral-950 text-white' : 'text-neutral-700 hover:bg-neutral-100'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-neutral-200 p-4 flex gap-2 bg-[#FAF8F5]">
              <button type="button" onClick={clearAllFilters} className="flex-1 py-2.5 border border-neutral-300 bg-white rounded-lg font-semibold text-xs text-neutral-700 cursor-pointer">Clear</button>
              <button type="button" onClick={() => setMobileFilters(false)} className="flex-1 py-2.5 bg-neutral-950 text-white rounded-lg font-semibold text-xs cursor-pointer">Apply</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}