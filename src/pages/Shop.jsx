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
  getSubcategoriesByCategory,
  defaultCategories
} from '../utils/productStore';
import { getCurrentUser } from '../utils/auth';
import { addToCart } from '../utils/cart';
import {
  ShieldCheckIcon,
  TruckIcon,
  SparklesIcon,
  CheckCircleIcon
} from '../components/Icons';

export default function Shop() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const productsTopRef = useRef(null);

  // Read URL params
  const urlCategory = searchParams.get('category') || 'All';
  const urlSubcategory = searchParams.get('subcategory') || searchParams.get('type') || 'All';
  const urlBrand = searchParams.get('brand') || 'All';
  const urlSearch = searchParams.get('search') || '';
  const urlMinPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0;
  const urlMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 250000;
  const urlSort = searchParams.get('sort') || 'featured';
  const urlRating = searchParams.get('rating') ? Number(searchParams.get('rating')) : 0;
  const urlDiscount = searchParams.get('discount') ? Number(searchParams.get('discount')) : 0;
  const urlInStock = searchParams.get('inStock') === 'true';
  const urlPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  // State
  const [products, setProducts] = useState(() => getProducts());
  const [categories, setCategories] = useState(() => ['All', ...getCategories()]);

  const [category, setCategory] = useState(urlCategory);
  const [subcategory, setSubcategory] = useState(urlSubcategory);
  const [selectedBrand, setSelectedBrand] = useState(urlBrand);
  const [search, setSearch] = useState(urlSearch);
  const [minPrice, setMinPrice] = useState(urlMinPrice);
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice);
  const [minRating, setMinRating] = useState(urlRating);
  const [minDiscount, setMinDiscount] = useState(urlDiscount);
  const [inStockOnly, setInStockOnly] = useState(urlInStock);
  const [sort, setSort] = useState(urlSort);

  // Layout & Pagination States
  const [viewMode, setViewMode] = useState('grid3'); // 'grid3', 'grid4', 'list'
  const [currentPage, setCurrentPage] = useState(urlPage);
  const [pageSize, setPageSize] = useState(12);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [brandSearchQuery, setBrandSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [faqOpen, setFaqOpen] = useState(null);

  // Sync data on localStorage update
  useEffect(() => {
    const handleProductsUpdate = () => {
      setProducts(getProducts());
      setCategories(['All', ...getCategories()]);
    };
    window.addEventListener('productsUpdated', handleProductsUpdate);
    return () => window.removeEventListener('productsUpdated', handleProductsUpdate);
  }, []);

  // Sync state when URL params change
  useEffect(() => {
    if (urlCategory !== category) setCategory(urlCategory);
    if (urlSubcategory !== subcategory) setSubcategory(urlSubcategory);
    if (urlBrand !== selectedBrand) setSelectedBrand(urlBrand);
    if (urlSearch !== search) setSearch(urlSearch);
  }, [urlCategory, urlSubcategory, urlBrand, urlSearch]);

  // Dynamic Brands & Subcategories based on active Category
  const dynamicBrands = useMemo(() => {
    const list = getBrandsByCategory(category);
    return ['All', ...list];
  }, [category, products]);

  const dynamicSubcategories = useMemo(() => {
    const list = getSubcategoriesByCategory(category);
    return ['All', ...list];
  }, [category, products]);

  // Filtered brands for brand search box
  const filteredBrandList = useMemo(() => {
    if (!brandSearchQuery.trim()) return dynamicBrands;
    const q = brandSearchQuery.toLowerCase();
    return dynamicBrands.filter(b => b.toLowerCase().includes(q) || b === 'All');
  }, [dynamicBrands, brandSearchQuery]);

  // Helper to sync state and URL params
  const updateUrlParams = (updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === undefined || v === 'All' || v === '' || v === 0 || v === false) {
        params.delete(k);
      } else {
        params.set(k, String(v));
      }
    });
    setSearchParams(params);
  };

  // Filter Change Handlers
  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setSubcategory('All');
    setSelectedBrand('All');
    setCurrentPage(1);
    updateUrlParams({
      category: cat,
      subcategory: 'All',
      type: 'All',
      brand: 'All',
      page: 1
    });
  };

  const handleSubcategorySelect = (sub) => {
    setSubcategory(sub);
    setCurrentPage(1);
    updateUrlParams({ subcategory: sub, page: 1 });
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setCurrentPage(1);
    updateUrlParams({ brand, page: 1 });
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    updateUrlParams({ sort: newSort });
  };

  const clearAllFilters = () => {
    setCategory('All');
    setSubcategory('All');
    setSelectedBrand('All');
    setSearch('');
    setMinPrice(0);
    setMaxPrice(250000);
    setMinRating(0);
    setMinDiscount(0);
    setInStockOnly(false);
    setSort('featured');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Filter & Sort Products (Strict matching - No mixing unrelated products)
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Category Filter
    if (category !== 'All') {
      list = list.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }

    // 2. Product Type / Subcategory Filter
    if (subcategory !== 'All') {
      list = list.filter((p) => p.subcategory?.toLowerCase() === subcategory.toLowerCase());
    }

    // 3. Brand Filter
    if (selectedBrand !== 'All') {
      list = list.filter((p) => p.brand?.toLowerCase() === selectedBrand.toLowerCase());
    }

    // 4. Price Range Filter
    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // 5. Minimum Rating Filter
    if (minRating > 0) {
      list = list.filter((p) => (p.rating || 0) >= minRating);
    }

    // 6. Minimum Discount Filter
    if (minDiscount > 0) {
      list = list.filter((p) => {
        const disc = p.discount || (p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0);
        return disc >= minDiscount;
      });
    }

    // 7. In Stock Only Filter
    if (inStockOnly) {
      list = list.filter((p) => (p.stock || 0) > 0);
    }

    // 8. Search query filter
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
    } else if (sort === 'alpha-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, category, subcategory, selectedBrand, minPrice, maxPrice, minRating, minDiscount, inStockOnly, search, sort]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, startIndex, endIndex]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateUrlParams({ page: newPage });
    if (productsTopRef.current) {
      productsTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Cart Handlers
  const handleAddToCart = (product) => {
    if (!getCurrentUser()) {
      navigate('/login');
      return;
    }
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setToastMessage(`✓ Added "${product.name}" to your bag`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleBuyNow = (product) => {
    if (!getCurrentUser()) {
      navigate('/login');
      return;
    }
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  // Context-aware recommendations
  const recommendedProducts = useMemo(() => {
    if (category !== 'All') {
      return products.filter(p => p.category === category).slice(0, 4);
    }
    return products.slice(0, 4);
  }, [products, category]);

  // Check if any filter is active
  const hasActiveFilters =
    category !== 'All' ||
    subcategory !== 'All' ||
    selectedBrand !== 'All' ||
    search ||
    minPrice > 0 ||
    maxPrice < 250000 ||
    minRating > 0 ||
    minDiscount > 0 ||
    inStockOnly;

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-900 shadow-xl animate-slide-up">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">✓</span>
          <span>{toastMessage}</span>
          <Link
            to="/cart"
            className="ml-1.5 rounded-full bg-[#111827] px-3 py-0.5 text-[10.5px] font-semibold text-white hover:bg-black transition"
          >
            View Bag
          </Link>
        </div>
      )}

      {/* ================= 1. VIP PRIVÉ PROMOTIONAL STRIP ================= */}
      <section className="bg-gradient-to-r from-gray-950 via-slate-900 to-gray-950 text-white py-2.5 px-4 border-b border-amber-500/20">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-gray-950 text-[10px] font-bold">★</span>
            <span className="text-gray-300">
              <strong className="text-amber-300 font-semibold">Krishna Privé Offer:</strong> Enjoy 10% instant discount on orders above ₹1,000 with coupon{' '}
              <span className="font-mono bg-white/10 px-1.5 py-0.2 rounded text-white border border-white/15">KRISHNA10</span>
            </span>
          </div>
          <span className="text-[11px] text-gray-400 hidden md:inline">
            100% Certified Authentic • Official Warranty Included
          </span>
        </div>
      </section>

      {/* ================= 2. LUXURY CATALOG HERO & BREADCRUMBS ================= */}
      <section className="bg-white border-b border-gray-200/80 pt-5 pb-4 sm:pt-7 sm:pb-6">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Bar */}
          <nav className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-2 overflow-x-auto no-scrollbar">
            <Link to="/" className="hover:text-gray-900 transition">Home</Link>
            <span>/</span>
            <button
              type="button"
              onClick={clearAllFilters}
              className={`hover:text-gray-900 transition ${category === 'All' ? 'text-gray-950 font-bold' : ''}`}
            >
              Shop Catalog
            </button>
            {category !== 'All' && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-semibold">{category}</span>
              </>
            )}
            {subcategory !== 'All' && (
              <>
                <span>/</span>
                <span className="text-amber-700 font-semibold">{subcategory}</span>
              </>
            )}
            {selectedBrand !== 'All' && (
              <>
                <span>/</span>
                <span className="text-gray-700 font-medium">{selectedBrand}</span>
              </>
            )}
          </nav>

          {/* Header Row with Active Category & Direct Chip Selector */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <span className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#B89758]">
                {category === 'All' ? 'Complete E-Commerce Collection' : `Certified ${category}`}
              </span>
              <h1 className="mt-0.5 text-xl sm:text-3xl font-extrabold tracking-tight text-gray-950">
                {category === 'All' ? 'Explore All Products' : `${category} Collection`}
              </h1>
              <p className="mt-1 text-xs text-gray-500 max-w-xl leading-relaxed">
                {category === 'Watches'
                  ? 'Precision automatic timepieces, Swiss chronographs, and certified luxury editions with international warranty.'
                  : category === 'Bags & Wallets'
                  ? 'Handcrafted vegetable-tanned leather briefcases, travel backpacks, and designer totes.'
                  : category === 'Shoes'
                  ? 'High-performance athletic runners, iconic basketball high-tops, and rugged trekking boots.'
                  : category === 'Mobiles'
                  ? 'Next-generation AI titanium flagships, professional camera sensors, and certified genuine smartphones.'
                  : 'Authentic branded goods guaranteed with express insured delivery and 2-year warranty across India.'}
              </p>
            </div>

            {/* Category Quick Chips Carousel */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-97 cursor-pointer ${
                    category === cat
                      ? 'bg-[#0F172A] text-amber-300 shadow-sm border border-slate-900 ring-2 ring-amber-400/20'
                      : 'bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 hover:text-black border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory / Product Type Dynamic Strip */}
          {dynamicSubcategories.length > 1 && (
            <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap mr-1">
                Product Types:
              </span>
              {dynamicSubcategories.map((sub) => {
                const isSelected = subcategory === sub;
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => handleSubcategorySelect(sub)}
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-100/90 text-amber-950 font-bold border border-amber-300/80 shadow-2xs'
                        : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/80'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* ================= 3. MAIN CATALOG BODY ================= */}
      <main ref={productsTopRef} className="mx-auto max-w-7xl px-2.5 sm:px-6 lg:px-8 py-4 sm:py-7">

        {/* Top Controls Bar: Search, View Mode, Count, Sort, Mobile Filter */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-3 sm:p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
                updateUrlParams({ search: e.target.value, page: 1 });
              }}
              placeholder={`Search ${category === 'All' ? 'products' : category.toLowerCase()}, brands, product types, SKU...`}
              className="w-full rounded-full border border-gray-200 bg-[#F4F4F6] py-2 pl-9 pr-9 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-gray-400 focus:bg-white"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              🔍
            </span>
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  updateUrlParams({ search: '' });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-black font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Action Tools: Item Count, View Mode, Sort & Mobile Filter */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-between lg:justify-end">
            
            {/* Live Count Indicator */}
            <span className="text-xs font-semibold text-gray-500 hidden sm:inline whitespace-nowrap">
              Showing <strong className="text-gray-900">{totalItems === 0 ? 0 : startIndex + 1}–{endIndex}</strong> of <strong className="text-gray-900">{totalItems}</strong> items
            </span>

            {/* View Mode Toggle Switcher */}
            <div className="hidden md:flex items-center rounded-xl border border-gray-200 bg-[#F4F4F6] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid3')}
                title="3-Column Grid View"
                className={`rounded-lg px-2 py-1 text-xs font-semibold transition ${
                  viewMode === 'grid3' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-black'
                }`}
              >
                ⊞ 3-Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid4')}
                title="4-Column Compact Grid"
                className={`rounded-lg px-2 py-1 text-xs font-semibold transition ${
                  viewMode === 'grid4' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-black'
                }`}
              >
                ▦ 4-Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                title="Detailed List View"
                className={`rounded-lg px-2 py-1 text-xs font-semibold transition ${
                  viewMode === 'list' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-black'
                }`}
              >
                ☰ List
              </button>
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileFilters(true)}
              className="flex items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-[#F4F4F6] px-3.5 py-1.5 text-xs font-bold text-gray-800 lg:hidden hover:bg-gray-200 shrink-0 cursor-pointer"
            >
              <span>⚙️ Filters</span>
              {hasActiveFilters && (
                <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
              <label htmlFor="shop-sort-select" className="hidden xl:inline text-xs text-gray-500 font-medium whitespace-nowrap">
                Sort:
              </label>
              <select
                id="shop-sort-select"
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full sm:w-48 rounded-full border border-gray-200 bg-[#F4F4F6] px-3 py-1.5 text-xs font-medium text-gray-800 outline-none focus:border-gray-400 cursor-pointer"
              >
                <option value="featured">Featured / Best Match</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated (★ 4.8+)</option>
                <option value="discount">Biggest Discount (%)</option>
                <option value="newest">New Arrivals</option>
                <option value="alpha-asc">Alphabetical: A to Z</option>
              </select>
            </div>

          </div>
        </div>

        {/* ================= MOBILE SLIDE-OVER FILTER DRAWER ================= */}
        {mobileFilters && (
          <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
            <div
              onClick={() => setMobileFilters(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            />

            <div className="relative w-full max-w-xs sm:max-w-sm h-full bg-white shadow-2xl flex flex-col justify-between z-50 animate-slide-up">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3.5 bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-950">Filters & Options</span>
                  <span className="rounded-full bg-gray-200 px-2 py-0.2 text-[10px] font-bold text-gray-700">
                    {filteredProducts.length} items
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

              {/* Drawer Filter List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                
                {/* 1. Category */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">Categories</h3>
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                    {categories.map((cat) => {
                      const count = cat === 'All'
                        ? products.length
                        : products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
                      return (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => handleCategorySelect(cat)}
                          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
                            category === cat
                              ? 'bg-[#0F172A] font-semibold text-amber-200'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span className="truncate">{cat}</span>
                          <span className="text-[10px] opacity-70">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Product Types */}
                {dynamicSubcategories.length > 1 && (
                  <div className="border-t border-gray-100 pt-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">Product Types</h3>
                    <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                      {dynamicSubcategories.map((sub) => (
                        <button
                          type="button"
                          key={sub}
                          onClick={() => handleSubcategorySelect(sub)}
                          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1 text-xs transition ${
                            subcategory === sub
                              ? 'bg-amber-100 text-amber-950 font-bold'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span>{sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Brands */}
                <div className="border-t border-gray-100 pt-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">Brands</h3>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {dynamicBrands.map((brand) => (
                      <label
                        key={brand}
                        onClick={() => handleBrandSelect(brand)}
                        className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
                          selectedBrand === brand ? 'bg-gray-100 text-gray-950 font-semibold' : 'text-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="mobileBrand"
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

                {/* 4. Price Range */}
                <div className="border-t border-gray-100 pt-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">Price Range (₹)</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9px] text-gray-400 block mb-0.5">Min</span>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value));
                          setMinPrice(val);
                          updateUrlParams({ minPrice: val });
                        }}
                        className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-2 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 block mb-0.5">Max</span>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value));
                          setMaxPrice(val);
                          updateUrlParams({ maxPrice: val });
                        }}
                        className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-2 py-1 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. In Stock Only */}
                <div className="border-t border-gray-100 pt-3">
                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="text-xs font-semibold text-gray-800">In Stock Items Only</span>
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => {
                        setInStockOnly(e.target.checked);
                        updateUrlParams({ inStock: e.target.checked });
                      }}
                      className="h-4 w-4 rounded border-gray-300 accent-[#111827]"
                    />
                  </label>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-gray-200 p-3 bg-gray-50 flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="flex-1 rounded-full border border-gray-300 bg-white py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilters(false)}
                  className="flex-1 rounded-full bg-[#111827] py-2 text-xs font-bold text-white hover:bg-black"
                >
                  Show {filteredProducts.length} Items
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ================= 2-COLUMN DESKTOP LAYOUT (SIDEBAR + PRODUCTS) ================= */}
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">

          {/* ================= DESKTOP SIDEBAR FILTERS ================= */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs">
              
              {/* Filter Sidebar Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-950">Filters</span>
                  <span className="rounded-full bg-gray-100 px-1.5 py-0.2 text-[9.5px] font-bold text-gray-600">
                    {filteredProducts.length}
                  </span>
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-[10.5px] font-semibold text-[#B89758] hover:underline cursor-pointer"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* 1. Category Tree Filter */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">Category</h3>
                <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const count = cat === 'All'
                      ? products.length
                      : products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
                    const isSelected = category === cat;

                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1 text-xs transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#0F172A] font-semibold text-amber-200 shadow-2xs'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        <span className={`text-[9.5px] font-mono ${isSelected ? 'text-amber-300/80' : 'text-gray-400'}`}>
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Product Type / Subcategory Filter */}
              {dynamicSubcategories.length > 1 && (
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950">Product Type</h3>
                    {subcategory !== 'All' && (
                      <button
                        type="button"
                        onClick={() => handleSubcategorySelect('All')}
                        className="text-[10px] text-[#B89758] hover:underline font-semibold"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-0.5 max-h-36 overflow-y-auto pr-1">
                    {dynamicSubcategories.map((sub) => {
                      const isSelected = subcategory === sub;
                      const subCount = sub === 'All'
                        ? (category === 'All' ? products.length : products.filter(p => p.category === category).length)
                        : products.filter(p => (category === 'All' || p.category === category) && p.subcategory === sub).length;

                      return (
                        <button
                          type="button"
                          key={sub}
                          onClick={() => handleSubcategorySelect(sub)}
                          className={`flex w-full items-center justify-between rounded-lg px-2 py-1 text-xs transition cursor-pointer ${
                            isSelected
                              ? 'bg-amber-100/90 text-amber-950 font-bold border border-amber-300/80 shadow-2xs'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                          }`}
                        >
                          <span className="truncate">{sub}</span>
                          <span className="text-[9.5px] text-gray-400 font-mono">({subCount})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Category-Wise Dynamic Brand Filter */}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950">
                    Brands {category !== 'All' && <span className="text-gray-400 font-normal">({category})</span>}
                  </h3>
                  {selectedBrand !== 'All' && (
                    <button
                      type="button"
                      onClick={() => handleBrandSelect('All')}
                      className="text-[10px] text-[#B89758] hover:underline font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Brand Search Input if many brands */}
                {dynamicBrands.length > 6 && (
                  <div className="mb-2">
                    <input
                      type="text"
                      value={brandSearchQuery}
                      onChange={(e) => setBrandSearchQuery(e.target.value)}
                      placeholder="Find brand..."
                      className="w-full rounded-md border border-gray-200 bg-[#F4F4F6] px-2 py-1 text-[11px] outline-none focus:border-gray-400 focus:bg-white"
                    />
                  </div>
                )}

                <div className="space-y-0.5 max-h-40 overflow-y-auto pr-1">
                  {filteredBrandList.map((brand) => {
                    const isSelected = selectedBrand === brand;
                    const brandCount = brand === 'All'
                      ? (category === 'All' ? products.length : products.filter(p => p.category === category).length)
                      : products.filter(p => (category === 'All' || p.category === category) && p.brand === brand).length;

                    return (
                      <label
                        key={brand}
                        onClick={() => handleBrandSelect(brand)}
                        className={`flex cursor-pointer items-center justify-between rounded-lg px-2 py-1 text-xs transition ${
                          isSelected
                            ? 'bg-gray-100 text-gray-950 font-semibold'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <input
                            type="radio"
                            name="desktopBrandFilter"
                            checked={isSelected}
                            onChange={() => handleBrandSelect(brand)}
                            className="accent-[#111827] h-3 w-3 cursor-pointer"
                          />
                          <span className="truncate">{brand}</span>
                        </div>
                        <span className="text-[9.5px] text-gray-400 font-mono">({brandCount})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4. Price Range Filter */}
              <div className="border-t border-gray-100 pt-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">
                  Price Range
                </h3>

                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className="text-[8.5px] text-gray-400 uppercase block mb-0.5">Min (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={minPrice}
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value));
                        setMinPrice(val);
                        updateUrlParams({ minPrice: val });
                      }}
                      className="w-full rounded-md border border-gray-200 bg-[#F4F4F6] px-2 py-1 text-xs text-gray-900 outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-[8.5px] text-gray-400 uppercase block mb-0.5">Max (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value));
                        setMaxPrice(val);
                        updateUrlParams({ maxPrice: val });
                      }}
                      className="w-full rounded-md border border-gray-200 bg-[#F4F4F6] px-2 py-1 text-xs text-gray-900 outline-none focus:border-gray-400"
                    />
                  </div>
                </div>

                {/* Quick Price Shortcuts */}
                <div className="mt-2 flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice(0);
                      setMaxPrice(5000);
                      updateUrlParams({ minPrice: 0, maxPrice: 5000 });
                    }}
                    className="rounded-full bg-gray-100 px-2 py-0.2 text-[9.5px] font-semibold text-gray-700 hover:bg-gray-200 cursor-pointer"
                  >
                    &lt; ₹5K
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice(5000);
                      setMaxPrice(25000);
                      updateUrlParams({ minPrice: 5000, maxPrice: 25000 });
                    }}
                    className="rounded-full bg-gray-100 px-2 py-0.2 text-[9.5px] font-semibold text-gray-700 hover:bg-gray-200 cursor-pointer"
                  >
                    ₹5K–₹25K
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice(25000);
                      setMaxPrice(250000);
                      updateUrlParams({ minPrice: 25000, maxPrice: 250000 });
                    }}
                    className="rounded-full bg-gray-100 px-2 py-0.2 text-[9.5px] font-semibold text-gray-700 hover:bg-gray-200 cursor-pointer"
                  >
                    &gt; ₹25K
                  </button>
                </div>
              </div>

              {/* 5. Rating Filter */}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950">Customer Rating</h3>
                  {minRating > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setMinRating(0);
                        updateUrlParams({ rating: 0 });
                      }}
                      className="text-[10px] text-[#B89758] hover:underline font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-1 text-xs">
                  {[4.5, 4.0, 3.0].map((star) => (
                    <label
                      key={star}
                      onClick={() => {
                        setMinRating(star);
                        updateUrlParams({ rating: star });
                      }}
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-2 py-0.5 transition ${
                        minRating === star ? 'bg-amber-50 text-amber-900 font-bold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-500 text-xs">★</span>
                        <span>{star} & Above</span>
                      </div>
                      <span className="text-[9.5px] text-gray-400">
                        ({products.filter(p => (category === 'All' || p.category === category) && (p.rating || 0) >= star).length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 6. Discount Offers Filter */}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950">Discount Offers</h3>
                  {minDiscount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setMinDiscount(0);
                        updateUrlParams({ discount: 0 });
                      }}
                      className="text-[10px] text-[#B89758] hover:underline font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {[10, 20, 30, 50].map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => {
                        const val = minDiscount === d ? 0 : d;
                        setMinDiscount(val);
                        updateUrlParams({ discount: val });
                      }}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border transition cursor-pointer ${
                        minDiscount === d
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {d}%+ Off
                    </button>
                  ))}
                </div>
              </div>

              {/* 7. Availability Filter */}
              <div className="border-t border-gray-100 pt-3">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-xs text-gray-800 font-semibold">In Stock Items Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      updateUrlParams({ inStock: e.target.checked });
                    }}
                    className="h-3.5 w-3.5 rounded border-gray-300 accent-[#111827] cursor-pointer"
                  />
                </label>
              </div>

            </div>
          </aside>

          {/* ================= PRODUCT LISTING AREA ================= */}
          <section className="min-w-0">

            {/* Active Filters Pill Bar */}
            {hasActiveFilters && (
              <div className="mb-4 flex flex-wrap items-center gap-1.5 rounded-2xl border border-gray-200/80 bg-white p-2.5 sm:p-3 text-xs shadow-2xs animate-fade-in">
                <span className="text-[10.5px] text-gray-400 font-bold uppercase tracking-wider mr-1">Active:</span>

                {category !== 'All' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 text-white px-2.5 py-0.5 text-[10.5px] font-semibold shadow-2xs">
                    Category: {category}
                    <button type="button" onClick={() => handleCategorySelect('All')} className="hover:text-amber-300 ml-0.5 font-bold">×</button>
                  </span>
                )}

                {subcategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 px-2.5 py-0.5 text-[10.5px] font-semibold">
                    Type: {subcategory}
                    <button type="button" onClick={() => handleSubcategorySelect('All')} className="hover:text-black ml-0.5 font-bold">×</button>
                  </span>
                )}

                {selectedBrand !== 'All' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-900 border border-gray-200 px-2.5 py-0.5 text-[10.5px] font-semibold">
                    Brand: {selectedBrand}
                    <button type="button" onClick={() => handleBrandSelect('All')} className="hover:text-black ml-0.5 font-bold">×</button>
                  </span>
                )}

                {(minPrice > 0 || maxPrice < 250000) && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-900 border border-gray-200 px-2.5 py-0.5 text-[10.5px] font-semibold">
                    ₹{minPrice.toLocaleString('en-IN')} – ₹{maxPrice.toLocaleString('en-IN')}
                    <button
                      type="button"
                      onClick={() => {
                        setMinPrice(0);
                        setMaxPrice(250000);
                        updateUrlParams({ minPrice: 0, maxPrice: 250000 });
                      }}
                      className="hover:text-black ml-0.5 font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}

                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 text-[10.5px] font-semibold">
                    ★ {minRating}+ Stars
                    <button type="button" onClick={() => { setMinRating(0); updateUrlParams({ rating: 0 }); }} className="hover:text-black ml-0.5 font-bold">×</button>
                  </span>
                )}

                {minDiscount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[10.5px] font-semibold">
                    {minDiscount}%+ Off
                    <button type="button" onClick={() => { setMinDiscount(0); updateUrlParams({ discount: 0 }); }} className="hover:text-black ml-0.5 font-bold">×</button>
                  </span>
                )}

                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[10.5px] font-semibold">
                    In Stock
                    <button type="button" onClick={() => { setInStockOnly(false); updateUrlParams({ inStock: false }); }} className="hover:text-black ml-0.5 font-bold">×</button>
                  </span>
                )}

                {search && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 text-[10.5px] font-semibold">
                    "{search}"
                    <button type="button" onClick={() => { setSearch(''); updateUrlParams({ search: '' }); }} className="hover:text-black ml-0.5 font-bold">×</button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="ml-auto text-[10.5px] text-[#B89758] hover:underline font-bold cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Products Grid or List Container */}
            {paginatedProducts.length > 0 ? (
              <div
                className={`grid gap-2.5 sm:gap-4 ${
                  viewMode === 'list'
                    ? 'grid-cols-1'
                    : viewMode === 'grid4'
                    ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'
                }`}
              >
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode === 'list' ? 'list' : 'grid'}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-gray-200/80 bg-white p-8 sm:p-12 text-center shadow-xs">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl mb-2">
                  🔍
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  No products found
                </h3>
                <p className="mt-1.5 max-w-sm text-xs text-gray-500 leading-relaxed">
                  We couldn't find any products matching your specific filters in {category === 'All' ? 'our catalog' : category}.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-5 rounded-full bg-[#111827] px-6 py-2 text-xs font-semibold text-white hover:bg-black transition shadow-xs cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* ================= PAGINATION & LOAD MORE BAR ================= */}
            {totalItems > pageSize && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs">
                
                {/* Items per page selector */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Show per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="rounded-lg border border-gray-200 bg-[#F4F4F6] px-2.5 py-1 text-xs font-semibold text-gray-800 outline-none cursor-pointer"
                  >
                    <option value="12">12 items</option>
                    <option value="24">24 items</option>
                    <option value="48">48 items</option>
                  </select>
                </div>

                {/* Page Numbers */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={effectivePage <= 1}
                    onClick={() => handlePageChange(effectivePage - 1)}
                    className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                  >
                    ← Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = pageNum === effectivePage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`h-8 w-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                          isActive
                            ? 'bg-[#0F172A] text-amber-300 shadow-xs'
                            : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={effectivePage >= totalPages}
                    onClick={() => handlePageChange(effectivePage + 1)}
                    className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                  >
                    Next →
                  </button>
                </div>

                {/* Showing Counter */}
                <span className="text-xs text-gray-500 font-medium">
                  Page <strong className="text-gray-900">{effectivePage}</strong> of <strong className="text-gray-900">{totalPages}</strong>
                </span>

              </div>
            )}

            {/* ================= 4. TRUST & AUTHENTICITY ASSURANCE STRIP ================= */}
            <div className="mt-10 sm:mt-14 rounded-3xl border border-gray-200/80 bg-gradient-to-br from-white to-gray-50/80 p-5 sm:p-7 shadow-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 mb-2 border border-amber-200/60 shadow-2xs">
                    <ShieldCheckIcon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-950">100% Certified Authentic</h4>
                  <p className="mt-0.5 text-[10.5px] text-gray-500">Official stamps & brand serial numbers</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 mb-2 border border-blue-200/60 shadow-2xs">
                    <TruckIcon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-950">Insured Pan-India Shipping</h4>
                  <p className="mt-0.5 text-[10.5px] text-gray-500">Safe, tamper-evident express transit</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 mb-2 border border-emerald-200/60 shadow-2xs">
                    <CheckCircleIcon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-950">7-Day Easy Returns</h4>
                  <p className="mt-0.5 text-[10.5px] text-gray-500">Hassle-free guarantee & support</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 mb-2 border border-purple-200/60 shadow-2xs">
                    <SparklesIcon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-950">Brand Warranty</h4>
                  <p className="mt-0.5 text-[10.5px] text-gray-500">Up to 2–5 years international cover</p>
                </div>
              </div>
            </div>

            {/* ================= 5. CURATED RECOMMENDATIONS ("CUSTOMERS ALSO VIEWED") ================= */}
            <div className="mt-10 sm:mt-14 border-t border-gray-200 pt-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4 sm:mb-6">
                <div>
                  <span className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#B89758]">
                    Curated Luxury Selections
                  </span>
                  <h2 className="mt-0.5 text-lg sm:text-2xl font-bold tracking-tight text-gray-950">
                    Customers Also Explored
                  </h2>
                  <p className="text-xs text-gray-500">Handpicked top-tier authenticated products from our showroom</p>
                </div>
                <Link
                  to="/shop?category=Watches"
                  className="text-xs font-semibold text-[#B89758] hover:underline"
                >
                  View Watches Showcase →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
                {recommendedProducts.map((product) => (
                  <ProductCard
                    key={`rec-${product.id}`}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
                ))}
              </div>
            </div>

            {/* ================= 6. BUYER'S SHOPPING GUIDE & FAQ ACCORDION ================= */}
            <div className="mt-10 sm:mt-14 border-t border-gray-200 pt-8">
              <div className="mb-6">
                <span className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#B89758]">
                  Buyer Assurance Guide
                </span>
                <h2 className="mt-0.5 text-lg sm:text-2xl font-bold tracking-tight text-gray-950">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs text-gray-500">Everything you need to know about purchasing authentic goods from Krishna Accessories</p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    q: 'How do I verify the 100% authenticity of products purchased from Krishna Accessories?',
                    a: 'All our products are sourced directly from authorized brand distributors and luxury boutiques. Every luxury timepiece, bag, gadget, or accessory arrives in manufacturer original packaging, accompanied by official stamped warranty documentation, serial numbers, and certified authenticity cards verified at our Haji Ali showroom in Mumbai.'
                  },
                  {
                    q: 'What are the delivery timelines and is the parcel fully insured during transit?',
                    a: 'Yes, 100% of all orders are shipped in tamper-evident secured security crates with full comprehensive transit insurance. Deliveries within Mumbai and Maharashtra take 24–48 hours, while Pan-India express delivery takes 2–4 business days via Blue Dart and DTDC Priority Air.'
                  },
                  {
                    q: 'How does the official brand warranty and after-sales service work?',
                    a: 'Every product comes with standard international or brand warranty (ranging from 1 to 5 years depending on the brand like Rolex, Titan, Fossil, Apple, Sony, etc.). You can redeem warranty services at any authorized service centre nationwide or through our dedicated Mumbai concierge desk.'
                  },
                  {
                    q: 'What payment modes and Cash on Delivery (COD) options are available?',
                    a: 'We support all major payment methods including UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards (Visa, MasterCard, RuPay, Amex), Net Banking across 50+ banks, and Cash on Delivery (COD) for eligible pincodes across India.'
                  },
                  {
                    q: 'Can I visit the physical showroom to inspect and try products in Mumbai?',
                    a: 'Absolutely! You are warmly welcome to visit our flagship retail boutique at Shop No. 64, Heera Panna Shopping Center, Haji Ali, Mumbai - 400026. Our concierge team is available Monday to Saturday from 10:30 AM to 8:30 PM (IST).'
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-2xs transition"
                  >
                    <button
                      type="button"
                      onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                      className="flex w-full items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-gray-900 hover:bg-gray-50 transition cursor-pointer"
                    >
                      <span>{item.q}</span>
                      <span className="ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                        {faqOpen === idx ? '−' : '+'}
                      </span>
                    </button>
                    {faqOpen === idx && (
                      <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3 bg-gray-50/50">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </section>

        </div>

      </main>

      <Footer />
    </div>
  );
}