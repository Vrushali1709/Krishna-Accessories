// src/pages/Shop.jsx
import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  ArrowUpDown,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  Grid3X3,
  LayoutGrid,
  Check,
  Star,
  Tag,
  RefreshCw,
  ShoppingBag,
  Sliders
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import { getProducts, getCategories, getBrandsByCategory, getBrands } from '../utils/productStore';
import { getCurrentUser } from '../utils/auth';
import { addToCart } from '../utils/cart';

export default function Shop() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const productGridRef = useRef(null);

  // Read URL search params with sensible defaults
  const urlCategory = searchParams.get('category') || 'All';
  const urlBrand = searchParams.get('brand') || 'All';
  const urlSubcategory = searchParams.get('subcategory') || searchParams.get('type') || 'All';
  const urlSearch = searchParams.get('search') || '';
  const urlSort = searchParams.get('sort') || 'featured';
  const urlMinPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0;
  const urlMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 250000;
  const urlInStock = searchParams.get('inStock') === 'true';
  const urlRating = searchParams.get('rating') ? Number(searchParams.get('rating')) : 0;
  const urlDiscount = searchParams.get('discount') ? Number(searchParams.get('discount')) : 0;
  const urlPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  // Store data states
  const [products, setProducts] = useState(() => getProducts());
  const [categories, setCategories] = useState(() => ['All', ...getCategories()]);

  // Filter & Search states
  const [category, setCategory] = useState(urlCategory);
  const [selectedBrand, setSelectedBrand] = useState(urlBrand);
  const [selectedSubcategory, setSelectedSubcategory] = useState(urlSubcategory);
  const [search, setSearch] = useState(urlSearch);
  const [sort, setSort] = useState(urlSort);
  const [minPrice, setMinPrice] = useState(urlMinPrice);
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice);
  const [inStockOnly, setInStockOnly] = useState(urlInStock);
  const [minRating, setMinRating] = useState(urlRating);
  const [minDiscount, setMinDiscount] = useState(urlDiscount);
  const [page, setPage] = useState(urlPage);

  // UI state
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [gridCols, setGridCols] = useState(3); // 3 or 4 columns for desktop
  const [mobileFilters, setMobileFilters] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [brandSearchTerm, setBrandSearchTerm] = useState('');

  // Synchronize store updates in real-time (from Admin/Supplier actions)
  useEffect(() => {
    const handleProductsUpdate = () => {
      setProducts(getProducts());
      setCategories(['All', ...getCategories()]);
    };
    const handleCategoriesUpdate = () => {
      setCategories(['All', ...getCategories()]);
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    window.addEventListener('brandsUpdated', handleProductsUpdate);

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
      window.removeEventListener('brandsUpdated', handleProductsUpdate);
    };
  }, []);

  // Sync state from URL parameters when navigation occurs
  useEffect(() => {
    if (urlCategory !== category) {
      setCategory(urlCategory);
    }
  }, [urlCategory]);

  useEffect(() => {
    if (urlBrand !== selectedBrand) {
      setSelectedBrand(urlBrand);
    }
  }, [urlBrand]);

  useEffect(() => {
    if (urlSubcategory !== selectedSubcategory) {
      setSelectedSubcategory(urlSubcategory);
    }
  }, [urlSubcategory]);

  useEffect(() => {
    if (urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [urlSearch]);

  useEffect(() => {
    if (urlSort !== sort) {
      setSort(urlSort);
    }
  }, [urlSort]);

  // Sync URL search params helper
  const updateUrlParams = useCallback((updates) => {
    const current = Object.fromEntries(searchParams.entries());
    const merged = { ...current, ...updates };

    // Clean up default/empty values to keep URL clean
    Object.keys(merged).forEach((k) => {
      if (
        merged[k] === 'All' ||
        merged[k] === '' ||
        merged[k] === undefined ||
        merged[k] === null ||
        (k === 'minPrice' && Number(merged[k]) === 0) ||
        (k === 'maxPrice' && Number(merged[k]) === 250000) ||
        (k === 'inStock' && merged[k] === 'false') ||
        (k === 'rating' && Number(merged[k]) === 0) ||
        (k === 'discount' && Number(merged[k]) === 0) ||
        (k === 'sort' && merged[k] === 'featured') ||
        (k === 'page' && Number(merged[k]) === 1)
      ) {
        delete merged[k];
      }
    });

    setSearchParams(merged);
  }, [searchParams, setSearchParams]);

  // Dynamic Brands based on selected category & available products
  const dynamicBrands = useMemo(() => {
    const brandsList = getBrandsByCategory(category);
    return ['All', ...brandsList];
  }, [category, products]);

  // Dynamic Subcategories / Product Types extracted from products in active category
  const dynamicSubcategories = useMemo(() => {
    let catProducts = products;
    if (category !== 'All') {
      catProducts = catProducts.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }
    const subs = new Set();
    catProducts.forEach((p) => {
      if (p.subcategory && p.subcategory.trim()) {
        subs.add(p.subcategory.trim());
      }
    });
    return ['All', ...Array.from(subs)];
  }, [category, products]);

  // Filter change handlers with smooth micro-skeleton state
  const handleCategorySelect = (cat) => {
    setIsFiltering(true);
    setCategory(cat);
    setSelectedBrand('All');
    setSelectedSubcategory('All');
    setPage(1);

    updateUrlParams({
      category: cat === 'All' ? undefined : cat,
      brand: undefined,
      subcategory: undefined,
      page: 1,
    });
    setTimeout(() => setIsFiltering(false), 220);
  };

  const handleBrandSelect = (brand) => {
    setIsFiltering(true);
    setSelectedBrand(brand);
    setPage(1);

    updateUrlParams({
      brand: brand === 'All' ? undefined : brand,
      page: 1,
    });
    setTimeout(() => setIsFiltering(false), 220);
  };

  const handleSubcategorySelect = (sub) => {
    setIsFiltering(true);
    setSelectedSubcategory(sub);
    setPage(1);

    updateUrlParams({
      subcategory: sub === 'All' ? undefined : sub,
      page: 1,
    });
    setTimeout(() => setIsFiltering(false), 220);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
    updateUrlParams({ search: val || undefined, page: 1 });
  };

  const handleSortChange = (val) => {
    setSort(val);
    updateUrlParams({ sort: val });
  };

  const handlePricePreset = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
    setPage(1);
    updateUrlParams({ minPrice: min, maxPrice: max, page: 1 });
  };

  const handleRatingSelect = (rating) => {
    setMinRating(rating);
    setPage(1);
    updateUrlParams({ rating: rating || undefined, page: 1 });
  };

  const handleDiscountSelect = (disc) => {
    setMinDiscount(disc);
    setPage(1);
    updateUrlParams({ discount: disc || undefined, page: 1 });
  };

  const handleInStockToggle = (e) => {
    const checked = e.target.checked;
    setInStockOnly(checked);
    setPage(1);
    updateUrlParams({ inStock: checked ? 'true' : undefined, page: 1 });
  };

  const clearAllFilters = () => {
    setCategory('All');
    setSelectedBrand('All');
    setSelectedSubcategory('All');
    setSort('featured');
    setSearch('');
    setMinPrice(0);
    setMaxPrice(250000);
    setInStockOnly(false);
    setMinRating(0);
    setMinDiscount(0);
    setPage(1);
    setBrandSearchTerm('');
    setSearchParams({});
  };

  // Check how many filters are active
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (category !== 'All') count++;
    if (selectedBrand !== 'All') count++;
    if (selectedSubcategory !== 'All') count++;
    if (search.trim()) count++;
    if (minPrice > 0 || maxPrice < 250000) count++;
    if (inStockOnly) count++;
    if (minRating > 0) count++;
    if (minDiscount > 0) count++;
    return count;
  }, [category, selectedBrand, selectedSubcategory, search, minPrice, maxPrice, inStockOnly, minRating, minDiscount]);

  // Main Product Filtering & Sorting Pipeline
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Category Filter
    if (category !== 'All') {
      list = list.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }

    // 2. Brand Filter
    if (selectedBrand !== 'All') {
      list = list.filter((p) => p.brand?.toLowerCase() === selectedBrand.toLowerCase());
    }

    // 3. Subcategory / Product Type Filter
    if (selectedSubcategory !== 'All') {
      list = list.filter(
        (p) => p.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase()
      );
    }

    // 4. Price Range Filter
    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // 5. In Stock Only Filter
    if (inStockOnly) {
      list = list.filter((p) => (p.stock || 0) > 0);
    }

    // 6. Minimum Rating Filter
    if (minRating > 0) {
      list = list.filter((p) => (p.rating || 0) >= minRating);
    }

    // 7. Minimum Discount Filter
    if (minDiscount > 0) {
      list = list.filter((p) => (p.discount || 0) >= minDiscount);
    }

    // 8. Search query across name, brand, category, subcategory, sku, description
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
    } else if (sort === 'alpha') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return list;
  }, [
    products,
    category,
    selectedBrand,
    selectedSubcategory,
    minPrice,
    maxPrice,
    inStockOnly,
    minRating,
    minDiscount,
    search,
    sort,
  ]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const clampedPage = Math.min(Math.max(1, page), totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (clampedPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, clampedPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    updateUrlParams({ page: newPage });
    if (productGridRef.current) {
      productGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Curated Discovery & Recommendations: Top-rated products from catalog
  const curatedRecommendations = useMemo(() => {
    let source = products;
    if (category !== 'All') {
      const inCat = products.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
      if (inCat.length >= 3) source = inCat;
    }
    return [...source]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);
  }, [products, category]);

  // Quick Action Handlers
  const handleAddToCart = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setToastMessage(`✓ Added "${product.name}" to your bag`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleBuyNow = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  // Filtered brands inside sidebar brand search
  const filteredDynamicBrands = useMemo(() => {
    if (!brandSearchTerm.trim()) return dynamicBrands;
    return dynamicBrands.filter((b) =>
      b.toLowerCase().includes(brandSearchTerm.toLowerCase().trim())
    );
  }, [dynamicBrands, brandSearchTerm]);

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 font-sans selection:bg-gray-950 selection:text-white">
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-gray-200/90 bg-white/95 px-4 py-3 text-xs font-semibold text-gray-950 shadow-2xl backdrop-blur-md animate-slide-up">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
            ✓
          </span>
          <span>{toastMessage}</span>
          <Link
            to="/cart"
            className="ml-2 rounded-full bg-[#0F172A] px-3 py-1 text-[11px] font-semibold text-white hover:bg-black transition shadow-xs"
          >
            View Bag
          </Link>
        </div>
      )}

      {/* ================= 1. LUXURY VALUE PROPOSITION BAR ================= */}
      <section className="bg-[#0F172A] text-gray-300 py-2 border-b border-gray-800 text-[11px]">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-200/90 font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>100% Certified Authentic Brands & Official Warranties Across India</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[10.5px] text-gray-400">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3 h-3 text-gray-300" /> Free Insured Express Shipping
            </span>
            <span className="flex items-center gap-1.5">
              <RotateCcw className="w-3 h-3 text-gray-300" /> 7-Day Hassle-Free Replacement
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-gray-300" /> 100% Secure Checkout
            </span>
          </div>
        </div>
      </section>

      {/* ================= 2. BREADCRUMB NAVIGATION ================= */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-100 py-2.5">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 flex items-center gap-1.5 text-[11px] text-gray-500 overflow-x-auto no-scrollbar">
          <Link to="/" className="hover:text-gray-950 transition shrink-0 font-medium">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
          <button
            type="button"
            onClick={clearAllFilters}
            className={`hover:text-gray-950 transition shrink-0 font-medium ${
              category === 'All' && selectedBrand === 'All' && selectedSubcategory === 'All'
                ? 'text-gray-950 font-semibold'
                : 'text-gray-600'
            }`}
          >
            Catalog
          </button>

          {category !== 'All' && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
              <button
                type="button"
                onClick={() => handleCategorySelect(category)}
                className={`hover:text-gray-950 transition shrink-0 font-medium ${
                  selectedBrand === 'All' && selectedSubcategory === 'All'
                    ? 'text-gray-950 font-semibold'
                    : 'text-gray-600'
                }`}
              >
                {category}
              </button>
            </>
          )}

          {selectedBrand !== 'All' && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
              <span className="text-gray-950 font-semibold shrink-0">
                {selectedBrand}
              </span>
            </>
          )}

          {selectedSubcategory !== 'All' && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
              <span className="text-[#B89758] font-semibold shrink-0">
                {selectedSubcategory}
              </span>
            </>
          )}
        </div>
      </nav>

      {/* ================= 3. EDITORIAL HERO / CATALOG HEADER ================= */}
      <header className="bg-white border-b border-gray-200/80 py-6 sm:py-9">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 border border-amber-200/60 mb-2">
                <span className="flex h-1.5 w-1.5 rounded-full bg-[#B89758]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8C6734]">
                  Authorized Luxury & Lifestyle Boutique
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-gray-950">
                {category === 'All'
                  ? selectedBrand === 'All'
                    ? 'Explore All Collections'
                    : `${selectedBrand} Collection`
                  : selectedBrand === 'All'
                  ? `${category} Collection`
                  : `${selectedBrand} ${category}`}
              </h1>
              <p className="mt-1 sm:mt-1.5 text-xs sm:text-[13px] text-gray-500 leading-relaxed">
                Browse certified genuine timepieces, fine leather goods, footwear, and flagship tech. All items guaranteed original with manufacturer warranties and insured express delivery across India.
              </p>
            </div>

            {/* Quick Metrics Strip */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0 bg-gray-50/80 p-2.5 sm:p-3 rounded-2xl border border-gray-200/70">
              <div className="text-center px-2">
                <span className="block text-xs sm:text-sm font-bold text-gray-950 tabular-nums">
                  {products.length}
                </span>
                <span className="text-[9.5px] uppercase tracking-wider text-gray-400 font-semibold">Products</span>
              </div>
              <div className="h-6 w-px bg-gray-200" />
              <div className="text-center px-2">
                <span className="block text-xs sm:text-sm font-bold text-gray-950 tabular-nums">
                  {dynamicBrands.length - 1}
                </span>
                <span className="text-[9.5px] uppercase tracking-wider text-gray-400 font-semibold">Brands</span>
              </div>
              <div className="h-6 w-px bg-gray-200" />
              <div className="text-center px-2">
                <span className="block text-xs sm:text-sm font-bold text-emerald-700">100%</span>
                <span className="text-[9.5px] uppercase tracking-wider text-gray-400 font-semibold">Authentic</span>
              </div>
            </div>
          </div>

          {/* ================= 4. CATEGORY NAVIGATION PILLS ================= */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                Browse Departments ({categories.length - 1})
              </span>
              {category !== 'All' && (
                <button
                  type="button"
                  onClick={() => handleCategorySelect('All')}
                  className="text-[11px] font-semibold text-[#B89758] hover:underline"
                >
                  View All &rarr;
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-3 px-3 sm:mx-0 sm:px-0">
              {categories.map((cat) => {
                const count =
                  cat === 'All'
                    ? products.length
                    : products.filter((p) => p.category?.toLowerCase() === cat.toLowerCase()).length;
                const isActive = category === cat;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`shrink-0 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 active:scale-97 cursor-pointer ${
                      isActive
                        ? 'bg-[#0F172A] text-amber-200 shadow-sm font-semibold'
                        : 'bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 hover:text-black'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] rounded-full px-1.5 py-0.2 font-mono ${
                        isActive
                          ? 'bg-amber-400/20 text-amber-200 font-bold'
                          : 'bg-white/80 text-gray-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================= 5. SUBCATEGORY / PRODUCT TYPE QUICK BAR ================= */}
          {dynamicSubcategories.length > 2 && (
            <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0 pt-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 shrink-0 mr-1">
                Type:
              </span>
              {dynamicSubcategories.map((sub) => {
                const isSubActive = selectedSubcategory === sub;
                const subCount =
                  sub === 'All'
                    ? category === 'All'
                      ? products.length
                      : products.filter((p) => p.category?.toLowerCase() === category.toLowerCase()).length
                    : products.filter(
                        (p) =>
                          (category === 'All' || p.category?.toLowerCase() === category.toLowerCase()) &&
                          p.subcategory?.toLowerCase() === sub.toLowerCase()
                      ).length;

                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => handleSubcategorySelect(sub)}
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium transition active:scale-95 ${
                      isSubActive
                        ? 'bg-white border border-[#B89758] text-[#8C6734] font-semibold shadow-2xs'
                        : 'bg-white border border-gray-200/80 text-gray-600 hover:border-gray-400 hover:text-gray-900'
                    }`}
                  >
                    <span>{sub}</span>
                    <span className="text-[9.5px] opacity-60 ml-1 font-mono">({subCount})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* ================= 6. MAIN CATALOG BODY ================= */}
      <main ref={productGridRef} className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-5 sm:py-8">

        {/* Toolbar Strip: Search, Count, Layout Mode & Sorting */}
        <div className="mb-4 sm:mb-5 flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-3 sm:p-3.5 shadow-2xs lg:flex-row lg:items-center lg:justify-between">

          {/* Search Box with Clear Button */}
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search products by model, brand, specification or SKU..."
              className="w-full rounded-full border border-gray-200 bg-[#F4F4F6] py-2 pl-9 pr-9 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-1 focus:ring-gray-300"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            {search && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Toolbar Controls */}
          <div className="flex items-center justify-between lg:justify-end gap-2.5">

            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileFilters(true)}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-[#F4F4F6] px-4 py-2 text-xs font-semibold text-gray-800 lg:hidden hover:bg-gray-200 shrink-0 active:scale-95 transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-600" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#0F172A] px-1 text-[9.5px] font-bold text-amber-200">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Items Per Page Selector */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
              <span className="text-[11px] font-medium text-gray-400">Show:</span>
              {[12, 24, 48].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setItemsPerPage(size);
                    setPage(1);
                  }}
                  className={`rounded-md px-2 py-0.5 text-[11px] font-semibold transition ${
                    itemsPerPage === size
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Desktop Grid Layout Switcher (3-col vs 4-col) */}
            <div className="hidden xl:flex items-center gap-1 border-l border-gray-200 pl-2">
              <button
                type="button"
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-lg border transition ${
                  gridCols === 3
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-500 hover:text-black'
                }`}
                title="3 Columns"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-lg border transition ${
                  gridCols === 4
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-500 hover:text-black'
                }`}
                title="4 Columns"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sort Dropdown Selector */}
            <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
              <label htmlFor="shop-sort-select" className="hidden sm:inline text-xs text-gray-500 font-medium whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="shop-sort-select"
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full sm:w-48 rounded-full border border-gray-200 bg-[#F4F4F6] px-3 py-2 text-xs font-medium text-gray-800 outline-none focus:border-gray-400 focus:bg-white cursor-pointer"
              >
                <option value="featured">Featured / Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated ★</option>
                <option value="discount">Biggest Discount %</option>
                <option value="newest">New Arrivals (Newest)</option>
                <option value="alpha">Product Name (A-Z)</option>
              </select>
            </div>

          </div>

        </div>

        {/* ================= ACTIVE FILTERS TAG STRIP ================= */}
        {activeFiltersCount > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-1.5 rounded-2xl border border-gray-200/80 bg-white p-2.5 sm:p-3 text-xs shadow-2xs animate-fade-in">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-gray-400 mr-1">
              Active Filters:
            </span>

            {category !== 'All' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-900 border border-gray-200">
                Department: {category}
                <button
                  type="button"
                  onClick={() => handleCategorySelect('All')}
                  className="hover:text-black ml-0.5 font-bold"
                  title="Remove category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedBrand !== 'All' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-900 border border-gray-200">
                Brand: {selectedBrand}
                <button
                  type="button"
                  onClick={() => handleBrandSelect('All')}
                  className="hover:text-black ml-0.5 font-bold"
                  title="Remove brand filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSubcategory !== 'All' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#8C6734] border border-amber-200">
                Type: {selectedSubcategory}
                <button
                  type="button"
                  onClick={() => handleSubcategorySelect('All')}
                  className="hover:text-black ml-0.5 font-bold"
                  title="Remove product type filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {search && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-800 border border-blue-200">
                "{search}"
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="hover:text-black ml-0.5 font-bold"
                  title="Clear search filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(minPrice > 0 || maxPrice < 250000) && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-900 border border-gray-200">
                ₹{minPrice.toLocaleString('en-IN')} – ₹{maxPrice.toLocaleString('en-IN')}
                <button
                  type="button"
                  onClick={() => handlePricePreset(0, 250000)}
                  className="hover:text-black ml-0.5 font-bold"
                  title="Reset price filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {minRating > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200">
                {minRating}★ & Above
                <button
                  type="button"
                  onClick={() => handleRatingSelect(0)}
                  className="hover:text-black ml-0.5 font-bold"
                  title="Clear rating filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {minDiscount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                {minDiscount}%+ Off
                <button
                  type="button"
                  onClick={() => handleDiscountSelect(0)}
                  className="hover:text-black ml-0.5 font-bold"
                  title="Clear discount filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                In Stock Only
                <button
                  type="button"
                  onClick={() => {
                    setInStockOnly(false);
                    updateUrlParams({ inStock: undefined });
                  }}
                  className="hover:text-black ml-0.5 font-bold"
                  title="Clear stock filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={clearAllFilters}
              className="ml-auto text-[11px] font-bold text-[#B89758] hover:text-[#8C6734] hover:underline"
            >
              Clear All ({activeFiltersCount})
            </button>
          </div>
        )}

        {/* 2-Column Desktop Grid Layout (Sidebar Filters + Products Grid) */}
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">

          {/* ================= 7. DESKTOP SIDEBAR FILTERS ================= */}
          <aside className="hidden lg:block space-y-4">
            <div className="sticky top-20 space-y-5 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs">

              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-gray-700" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-950">Filter Catalog</h2>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-[11px] font-semibold text-[#B89758] hover:underline"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Section 1: Categories */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900">
                    Department
                  </h3>
                  {category !== 'All' && (
                    <button
                      type="button"
                      onClick={() => handleCategorySelect('All')}
                      className="text-[10px] text-[#B89758] font-semibold hover:underline"
                    >
                      All
                    </button>
                  )}
                </div>
                <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const count =
                      cat === 'All'
                        ? products.length
                        : products.filter((p) => p.category?.toLowerCase() === cat.toLowerCase()).length;
                    const isSelected = category === cat;

                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
                          isSelected
                            ? 'bg-[#0F172A] font-semibold text-amber-200 shadow-2xs'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        <span
                          className={`text-[10px] font-mono ${
                            isSelected ? 'text-amber-300' : 'text-gray-400'
                          }`}
                        >
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Brands (Category-aware) */}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900">
                    Brands {category !== 'All' && <span className="text-gray-400 font-normal">({category})</span>}
                  </h3>
                  {selectedBrand !== 'All' && (
                    <button
                      type="button"
                      onClick={() => handleBrandSelect('All')}
                      className="text-[10px] text-[#B89758] font-semibold hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Brand mini search if many brands */}
                {dynamicBrands.length > 7 && (
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder="Search brands..."
                      value={brandSearchTerm}
                      onChange={(e) => setBrandSearchTerm(e.target.value)}
                      className="w-full rounded-md border border-gray-200 bg-[#F4F4F6] px-2 py-1 text-[11px] outline-none focus:border-gray-400"
                    />
                  </div>
                )}

                <div className="space-y-0.5 max-h-40 overflow-y-auto pr-1">
                  {filteredDynamicBrands.map((brand) => {
                    const isSelected = selectedBrand === brand;
                    const brandCount =
                      brand === 'All'
                        ? category === 'All'
                          ? products.length
                          : products.filter((p) => p.category?.toLowerCase() === category.toLowerCase()).length
                        : products.filter(
                            (p) =>
                              (category === 'All' || p.category?.toLowerCase() === category.toLowerCase()) &&
                              p.brand?.toLowerCase() === brand.toLowerCase()
                          ).length;

                    return (
                      <label
                        key={brand}
                        onClick={() => handleBrandSelect(brand)}
                        className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1 text-xs transition ${
                          isSelected
                            ? 'bg-gray-100 text-gray-950 font-semibold'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <input
                            type="radio"
                            name="brandFilterSidebar"
                            checked={isSelected}
                            onChange={() => handleBrandSelect(brand)}
                            className="accent-[#0F172A] h-3 w-3 cursor-pointer"
                          />
                          <span className="truncate">{brand}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono shrink-0">
                          ({brandCount})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Subcategory / Product Type */}
              {dynamicSubcategories.length > 2 && (
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900">
                      Product Type
                    </h3>
                    {selectedSubcategory !== 'All' && (
                      <button
                        type="button"
                        onClick={() => handleSubcategorySelect('All')}
                        className="text-[10px] text-[#B89758] font-semibold hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-0.5 max-h-36 overflow-y-auto pr-1">
                    {dynamicSubcategories.map((sub) => {
                      const isSubActive = selectedSubcategory === sub;
                      const subCount =
                        sub === 'All'
                          ? category === 'All'
                            ? products.length
                            : products.filter((p) => p.category?.toLowerCase() === category.toLowerCase()).length
                          : products.filter(
                              (p) =>
                                (category === 'All' || p.category?.toLowerCase() === category.toLowerCase()) &&
                                p.subcategory?.toLowerCase() === sub.toLowerCase()
                            ).length;

                      return (
                        <button
                          type="button"
                          key={sub}
                          onClick={() => handleSubcategorySelect(sub)}
                          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1 text-xs transition ${
                            isSubActive
                              ? 'bg-amber-50 border border-amber-200 font-semibold text-[#8C6734]'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                          }`}
                        >
                          <span className="truncate">{sub}</span>
                          <span className="text-[10px] text-gray-400 font-mono">({subCount})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section 4: Price Range */}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900">
                    Price Range (₹)
                  </h3>
                  {(minPrice > 0 || maxPrice < 250000) && (
                    <button
                      type="button"
                      onClick={() => handlePricePreset(0, 250000)}
                      className="text-[10px] text-[#B89758] font-semibold hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  <div>
                    <label className="text-[9px] text-gray-400 uppercase block mb-0.5">Min (₹)</label>
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
                    <label className="text-[9px] text-gray-400 uppercase block mb-0.5">Max (₹)</label>
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
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => handlePricePreset(0, 5000)}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    &lt; ₹5K
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePricePreset(5000, 25000)}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    ₹5K – ₹25K
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePricePreset(25000, 50000)}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    ₹25K – ₹50K
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePricePreset(50000, 250000)}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    &gt; ₹50K
                  </button>
                </div>
              </div>

              {/* Section 5: Customer Rating */}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900">
                    Minimum Rating
                  </h3>
                  {minRating > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRatingSelect(0)}
                      className="text-[10px] text-[#B89758] font-semibold hover:underline"
                    >
                      All
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {[
                    { label: '4.5★ & Above', value: 4.5 },
                    { label: '4.0★ & Above', value: 4.0 },
                    { label: 'All Ratings', value: 0 },
                  ].map((r) => (
                    <label
                      key={r.value}
                      onClick={() => handleRatingSelect(r.value)}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-xs transition ${
                        minRating === r.value
                          ? 'bg-gray-100 text-gray-950 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="ratingFilterSidebar"
                        checked={minRating === r.value}
                        onChange={() => handleRatingSelect(r.value)}
                        className="accent-[#0F172A] h-3 w-3"
                      />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section 6: Discount */}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900">
                    Discount
                  </h3>
                  {minDiscount > 0 && (
                    <button
                      type="button"
                      onClick={() => handleDiscountSelect(0)}
                      className="text-[10px] text-[#B89758] font-semibold hover:underline"
                    >
                      All
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {[
                    { label: '30% or more', value: 30 },
                    { label: '20% or more', value: 20 },
                    { label: '10% or more', value: 10 },
                    { label: 'All Discounts', value: 0 },
                  ].map((d) => (
                    <label
                      key={d.value}
                      onClick={() => handleDiscountSelect(d.value)}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-xs transition ${
                        minDiscount === d.value
                          ? 'bg-gray-100 text-gray-950 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="discountFilterSidebar"
                        checked={minDiscount === d.value}
                        onChange={() => handleDiscountSelect(d.value)}
                        className="accent-[#0F172A] h-3 w-3"
                      />
                      <span>{d.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section 7: Availability */}
              <div className="border-t border-gray-100 pt-3">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-xs text-gray-800 font-semibold">In Stock Items Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={handleInStockToggle}
                    className="h-3.5 w-3.5 rounded border-gray-300 accent-[#0F172A] cursor-pointer"
                  />
                </label>
              </div>

            </div>
          </aside>

          {/* ================= 8. PRODUCT LISTING AREA ================= */}
          <section className="min-w-0">

            {/* Product Count Header Bar */}
            <div className="mb-3.5 flex items-center justify-between text-xs text-gray-500">
              <div>
                <span className="font-semibold text-gray-950">
                  {totalItems === 0
                    ? '0 Products'
                    : `Showing ${(clampedPage - 1) * itemsPerPage + 1}–${Math.min(
                        clampedPage * itemsPerPage,
                        totalItems
                      )} of ${totalItems} Products`}
                </span>
                {category !== 'All' && (
                  <span className="ml-1 text-gray-400">in {category}</span>
                )}
              </div>
              <div className="text-[11px] text-gray-400">
                Page {clampedPage} of {totalPages}
              </div>
            </div>

            {/* Product Grid Render */}
            {isFiltering ? (
              <div className={`grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-2 lg:grid-cols-${gridCols}`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div
                className={`grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-2 lg:grid-cols-${gridCols}`}
              >
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
                ))}
              </div>
            ) : (
              /* ================= 9. PROFESSIONAL EMPTY STATE ================= */
              <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 text-center shadow-xs">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl mb-3">
                  🔍
                </div>
                <h3 className="text-base font-bold text-gray-950">
                  No products found matching your filters
                </h3>
                <p className="mt-1 max-w-md text-xs text-gray-500 leading-relaxed">
                  We couldn't find any products in{' '}
                  <strong className="text-gray-800">{category === 'All' ? 'our catalog' : category}</strong>{' '}
                  matching your selected brand, price range, or search criteria.
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="rounded-full bg-[#0F172A] px-5 py-2 text-xs font-semibold text-white hover:bg-black transition shadow-sm"
                  >
                    Reset All Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('All')}
                    className="rounded-full border border-gray-200 bg-[#F4F4F6] px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Explore All Categories
                  </button>
                </div>

                {/* Popular Categories Shortcut Chips */}
                <div className="mt-6 pt-5 border-t border-gray-100 w-full max-w-md">
                  <span className="text-[10.5px] uppercase tracking-wider text-gray-400 font-semibold block mb-2">
                    Or jump into popular departments:
                  </span>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {['Watches', 'Bags & Wallets', 'Shoes', 'Mobiles', 'Electronics'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleCategorySelect(c)}
                        className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium text-gray-700 hover:border-gray-400"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= 10. PAGINATION CONTROLS ================= */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200/80 pt-5">
                <div className="text-xs text-gray-500">
                  Showing page <strong className="text-gray-900">{clampedPage}</strong> of{' '}
                  <strong className="text-gray-900">{totalPages}</strong>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={clampedPage <= 1}
                    onClick={() => handlePageChange(clampedPage - 1)}
                    className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      // Display first, last, and around current page
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= clampedPage - 1 && pageNum <= clampedPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                              clampedPage === pageNum
                                ? 'bg-[#0F172A] text-amber-200 shadow-2xs font-bold'
                                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      if (pageNum === clampedPage - 2 || pageNum === clampedPage + 2) {
                        return (
                          <span key={pageNum} className="text-gray-400 px-1">
                            …
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    type="button"
                    disabled={clampedPage >= totalPages}
                    onClick={() => handlePageChange(clampedPage + 1)}
                    className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= 11. CURATED DISCOVERY / RECOMMENDATIONS ================= */}
            <section className="mt-10 sm:mt-14 border-t border-gray-200/80 pt-8 sm:pt-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4 sm:mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B89758]">
                    Handpicked Spotlight
                  </span>
                  <h2 className="text-base sm:text-xl font-bold tracking-tight text-gray-950 mt-0.5">
                    {category === 'All'
                      ? 'Featured Masterpieces & Top-Rated Editions'
                      : `Highly Rated in ${category}`}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-gray-500">
                    Highest-rated authentic original creations certified by our luxury curators.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
                {curatedRecommendations.map((product) => (
                  <ProductCard
                    key={`spotlight-${product.id}`}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
                ))}
              </div>
            </section>

          </section>

        </div>

        {/* ================= 12. STORE GUARANTEE & TRUST PILLARS ================= */}
        <section className="mt-12 sm:mt-16 rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-[#B89758] shrink-0 border border-amber-200/60">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950">
                  100% Genuine Certified
                </h4>
                <p className="mt-0.5 text-[11px] text-gray-500 leading-relaxed">
                  Every product is sourced directly from authorized brand distributors with valid warranties.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 shrink-0 border border-blue-200/60">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950">
                  Insured Express Delivery
                </h4>
                <p className="mt-0.5 text-[11px] text-gray-500 leading-relaxed">
                  Tamper-evident luxury packaging with real-time tracking across all Indian pin codes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shrink-0 border border-emerald-200/60">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950">
                  7-Day Easy Returns
                </h4>
                <p className="mt-0.5 text-[11px] text-gray-500 leading-relaxed">
                  Hassle-free replacement guarantee if product differs from official specifications.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 shrink-0 border border-purple-200/60">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950">
                  Official Brand Warranty
                </h4>
                <p className="mt-0.5 text-[11px] text-gray-500 leading-relaxed">
                  Includes original manufacturer warranty cards valid across authorized service centers.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ================= 13. MOBILE FILTER SLIDE-OVER DRAWER ================= */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileFilters(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          {/* Slide-over sheet */}
          <div className="relative w-full max-w-xs sm:max-w-sm h-full bg-white shadow-2xl flex flex-col justify-between z-50 animate-slide-up">

            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3.5 bg-gray-50">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-gray-800" />
                <span className="text-sm font-bold text-gray-950">Catalog Filters</span>
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

            {/* Drawer Body Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">

              {/* Department Filter */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">
                  Department
                </h3>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const count =
                      cat === 'All'
                        ? products.length
                        : products.filter((p) => p.category?.toLowerCase() === cat.toLowerCase()).length;
                    const isSelected = category === cat;

                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
                          isSelected
                            ? 'bg-[#0F172A] font-semibold text-amber-200'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        <span className="text-[10px] opacity-70 font-mono">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950">
                    Brands
                  </h3>
                  {selectedBrand !== 'All' && (
                    <button
                      type="button"
                      onClick={() => handleBrandSelect('All')}
                      className="text-[10px] text-[#B89758] font-semibold hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {dynamicBrands.map((brand) => (
                    <label
                      key={brand}
                      onClick={() => handleBrandSelect(brand)}
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
                        selectedBrand === brand
                          ? 'bg-gray-100 text-gray-950 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="mobileBrandFilter"
                          checked={selectedBrand === brand}
                          onChange={() => handleBrandSelect(brand)}
                          className="accent-[#0F172A] h-3.5 w-3.5"
                        />
                        <span>{brand}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Product Type / Subcategory Filter */}
              {dynamicSubcategories.length > 2 && (
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950">
                      Product Type
                    </h3>
                    {selectedSubcategory !== 'All' && (
                      <button
                        type="button"
                        onClick={() => handleSubcategorySelect('All')}
                        className="text-[10px] text-[#B89758] font-semibold hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {dynamicSubcategories.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => handleSubcategorySelect(sub)}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
                          selectedSubcategory === sub
                            ? 'bg-amber-50 border border-amber-200 text-[#8C6734] font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range Filter */}
              <div className="border-t border-gray-100 pt-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">
                  Price Range (₹)
                </h3>
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

              {/* Minimum Rating Filter */}
              <div className="border-t border-gray-100 pt-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">
                  Rating
                </h3>
                <div className="space-y-1">
                  {[
                    { label: '4.5★ & Above', value: 4.5 },
                    { label: '4.0★ & Above', value: 4.0 },
                    { label: 'All Ratings', value: 0 },
                  ].map((r) => (
                    <label
                      key={r.value}
                      onClick={() => handleRatingSelect(r.value)}
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
                        minRating === r.value
                          ? 'bg-gray-100 text-gray-950 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{r.label}</span>
                      <input
                        type="radio"
                        name="mobileRating"
                        checked={minRating === r.value}
                        onChange={() => handleRatingSelect(r.value)}
                        className="accent-[#0F172A] h-3.5 w-3.5"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* In Stock Checkbox */}
              <div className="border-t border-gray-100 pt-3">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-xs font-semibold text-gray-800">In Stock Items Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={handleInStockToggle}
                    className="h-4 w-4 rounded border-gray-300 accent-[#0F172A]"
                  />
                </label>
              </div>

            </div>

            {/* Drawer Sticky Footer Actions */}
            <div className="border-t border-gray-200 p-3 bg-gray-50 flex items-center gap-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex-1 rounded-full border border-gray-300 bg-white py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="flex-1 rounded-full bg-[#0F172A] py-2.5 text-xs font-bold text-white hover:bg-black transition shadow-sm"
              >
                Show {filteredProducts.length} Items
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}