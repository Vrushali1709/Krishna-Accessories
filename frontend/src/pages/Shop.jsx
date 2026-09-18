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
  SlidersHorizontal,
  LayoutGrid,
  Grid2X2,
  List,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Check,
  Star,
  Tag,
  ArrowUpDown,
  Flame,
  Search,
  X,
  ShieldCheck,
  Truck,
  RotateCcw as ReturnIcon,
  Lock,
  ShoppingBag,
  ExternalLink,
  Filter,
  CheckCircle2
} from 'lucide-react';

// Predefined Quick Price Brackets
const PRICE_BRACKETS = [
  { id: 'all', label: 'All Prices', min: 0, max: 250000 },
  { id: 'under-5k', label: 'Under ₹5,000', min: 0, max: 5000 },
  { id: '5k-10k', label: '₹5,000 – ₹10,000', min: 5000, max: 10000 },
  { id: '10k-20k', label: '₹10,000 – ₹20,000', min: 10000, max: 20000 },
  { id: '20k-50k', label: '₹20,000 – ₹50,000', min: 20000, max: 50000 },
  { id: 'above-50k', label: 'Above ₹50,000', min: 50000, max: 250000 }
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured & Best Match' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'discount', label: 'Highest Discount' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'name-az', label: 'Name (A – Z)' }
];

const FAQ_ITEMS = [
  {
    q: 'How do I know about product quality and authenticity?',
    a: 'Every timepiece, leather bag, pair of footwear, and tech accessory in our boutique undergoes multi-point quality checks and comes with official documentation and warranty.'
  },
  {
    q: 'How fast is express delivery across India?',
    a: 'We partner with BlueDart & Delhivery Express. Metro orders (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Ahmedabad) are delivered within 24 to 48 hours with live SMS & email tracking.'
  },
  {
    q: 'Can I return or exchange an item?',
    a: 'Yes, we provide a 7-day doorstep inspection window. You can easily initiate a return or exchange from your account profile.'
  },
  {
    q: 'What payment options are accepted?',
    a: 'We accept all major UPI apps (GPay, PhonePe, Paytm), Credit & Debit Cards, NetBanking, EMI options, and Cash on Delivery (COD).'
  }
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
  const [categories, setCategories] = useState(() => [
    'All',
    ...getCategories().map(c => (typeof c === 'object' && c !== null ? c.name : String(c))).filter(Boolean)
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
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [brandSearchQuery, setBrandSearchQuery] = useState('');

  // Custom price input state
  const [customMin, setCustomMin] = useState(urlMinPrice > 0 ? String(urlMinPrice) : '');
  const [customMax, setCustomMax] = useState(urlMaxPrice < 250000 ? String(urlMaxPrice) : '');

  // Sorting & Layout Views
  const [sort, setSort] = useState(urlSort);
  const [viewMode, setViewMode] = useState('grid-3'); // 'grid-3', 'grid-4', 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [showDesktopFilters, setShowDesktopFilters] = useState(true);

  // Accordion open/collapse states for sidebar sections
  const [openSections, setOpenSections] = useState({
    categories: true,
    subcategories: true,
    brands: true,
    price: true,
    ratings: true,
    discount: false,
    stock: true
  });

  // UI States
  const [mobileFilters, setMobileFilters] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Toggle Accordion section
  const toggleSection = (sectionKey) => {
    setOpenSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  // Sync Products from localStorage or custom events
  useEffect(() => {
    const handleProductsUpdate = () => {
      setProducts(getProducts());
      setCategories([
        'All',
        ...getCategories().map(c => (typeof c === 'object' && c !== null ? c.name : String(c))).filter(Boolean)
      ]);
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
    const brandsList = getBrandsByCategory(category)
      .map(b => (typeof b === 'object' && b !== null ? b.name : String(b)))
      .filter(Boolean);
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
    const list = getSubcategoriesByCategory(category)
      .map(s => (typeof s === 'object' && s !== null ? s.name : String(s)))
      .filter(Boolean);
    return ['All', ...list];
  }, [category, products]);

  // Core Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Category Filter
    if (category !== 'All') {
      list = list.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }

    // 2. Subcategory / Product Type Filter
    if (selectedSubcategory !== 'All') {
      list = list.filter(p => p.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase());
    }

    // 3. Brand Filter
    if (selectedBrand !== 'All') {
      list = list.filter(p => p.brand?.toLowerCase() === selectedBrand.toLowerCase());
    }

    // 4. Price Range Filter
    list = list.filter(p => Number(p.price) >= minPrice && Number(p.price) <= maxPrice);

    // 5. Discount Filter
    if (minDiscount > 0) {
      list = list.filter(p => (p.discount || 0) >= minDiscount);
    }

    // 6. Rating Filter
    if (minRating > 0) {
      list = list.filter(p => (p.rating || 0) >= minRating);
    }

    // 7. In Stock Only Filter
    if (inStockOnly) {
      list = list.filter(p => (p.stock || 0) > 0);
    }

    // 8. Search query match
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        p =>
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
  }, [
    products,
    category,
    selectedSubcategory,
    selectedBrand,
    minPrice,
    maxPrice,
    minDiscount,
    minRating,
    inStockOnly,
    search,
    sort
  ]);

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    category,
    selectedBrand,
    selectedSubcategory,
    minPrice,
    maxPrice,
    minDiscount,
    minRating,
    inStockOnly,
    search,
    sort
  ]);

  // Paginated Slicing
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Handlers for Filters
  const handleCategorySelect = cat => {
    setIsFiltering(true);
    setCategory(cat);
    setSelectedBrand('All');
    setSelectedSubcategory('All');

    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    params.delete('brand');
    params.delete('type');
    setSearchParams(params);
    setTimeout(() => setIsFiltering(false), 150);
  };

  const handleSubcategorySelect = type => {
    setIsFiltering(true);
    setSelectedSubcategory(type);
    const params = new URLSearchParams(searchParams);
    if (type === 'All') {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    setSearchParams(params);
    setTimeout(() => setIsFiltering(false), 150);
  };

  const handleBrandSelect = brand => {
    setIsFiltering(true);
    setSelectedBrand(brand);
    const params = new URLSearchParams(searchParams);
    if (brand === 'All') {
      params.delete('brand');
    } else {
      params.set('brand', brand);
    }
    setSearchParams(params);
    setTimeout(() => setIsFiltering(false), 150);
  };

  const handlePriceBracketSelect = bracket => {
    setActivePriceBracket(bracket.id);
    setMinPrice(bracket.min);
    setMaxPrice(bracket.max);
    setCustomMin(bracket.min > 0 ? String(bracket.min) : '');
    setCustomMax(bracket.max < 250000 ? String(bracket.max) : '');

    const params = new URLSearchParams(searchParams);
    if (bracket.min > 0) params.set('minPrice', bracket.min.toString());
    else params.delete('minPrice');
    if (bracket.max < 250000) params.set('maxPrice', bracket.max.toString());
    else params.delete('maxPrice');
    setSearchParams(params);
  };

  const applyCustomPrice = () => {
    const min = customMin ? Math.max(0, Number(customMin)) : 0;
    const max = customMax ? Math.max(min, Number(customMax)) : 250000;
    setMinPrice(min);
    setMaxPrice(max);
    setActivePriceBracket('custom');

    const params = new URLSearchParams(searchParams);
    if (min > 0) params.set('minPrice', min.toString());
    else params.delete('minPrice');
    if (max < 250000) params.set('maxPrice', max.toString());
    else params.delete('maxPrice');
    setSearchParams(params);
  };

  const handleSortChange = newSort => {
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
    setCustomMin('');
    setCustomMax('');
    setMinDiscount(0);
    setMinRating(0);
    setInStockOnly(false);
    setBrandSearchQuery('');
    setSearchParams({});
    setTimeout(() => setIsFiltering(false), 150);
  };

  const handleAddToCart = product => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setToastMessage(`✓ Added "${product.name}" to bag`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleBuyNow = product => {
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
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      <Navbar />

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-xs font-semibold text-neutral-900 shadow-2xl animate-slide-up">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
            ✓
          </span>
          <span>{toastMessage}</span>
          <Link
            to="/cart"
            className="ml-2 rounded-lg bg-neutral-900 px-3 py-1 text-[11px] font-bold text-white transition hover:bg-black"
          >
            View Bag &rarr;
          </Link>
        </div>
      )}

      {/* ================= 1. CLEAN HEADER & BREADCRUMBS ================= */}
      <header className="border-b border-neutral-200 bg-white pt-4 pb-5 sm:pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Trail */}
          <nav className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-3">
            <Link to="/" className="hover:text-neutral-900 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <button
              type="button"
              onClick={() => handleCategorySelect('All')}
              className={`hover:text-neutral-900 transition cursor-pointer ${
                category === 'All' ? 'font-bold text-neutral-900' : ''
              }`}
            >
              Shop
            </button>
            {category !== 'All' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
                <span className="font-semibold text-neutral-900">{category}</span>
              </>
            )}
            {selectedBrand !== 'All' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
                <span className="font-semibold text-amber-700">{selectedBrand}</span>
              </>
            )}
          </nav>

          {/* Title and Item Count Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
                {category === 'All' ? 'All Products' : category}
                {selectedBrand !== 'All' && ` — ${selectedBrand}`}
              </h1>
              <p className="mt-1 text-xs text-neutral-500">
                Showing {totalItems} {totalItems === 1 ? 'item' : 'items'} with verified authenticity and express delivery across India.
              </p>
            </div>

            {/* Quick Guarantees (Desktop) */}
            <div className="hidden lg:flex items-center gap-3 text-xs text-neutral-600 bg-neutral-50 border border-neutral-200/80 rounded-full px-4 py-1.5">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Genuine
              </span>
              <span className="text-neutral-300">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-blue-600" /> BlueDart Express
              </span>
            </div>
          </div>

          {/* ================= 2. HORIZONTAL CATEGORY PILLS ================= */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map(cat => {
              const isActive = category === cat;
              const count =
                cat === 'All'
                  ? products.length
                  : products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className={`shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-neutral-950 text-white shadow-sm'
                      : 'bg-neutral-100/90 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-950 border border-neutral-200/70'
                  }`}
                >
                  <span>{cat === 'All' ? 'All Categories' : cat}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-neutral-200/80 text-neutral-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ================= 3. MAIN CATALOGUE & FILTER WRAPPER ================= */}
      <main ref={productsTopRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Sticky Toolbar */}
        <div className="sticky top-0 z-30 mb-6 bg-[#FAFAFB]/95 backdrop-blur-md py-2.5 transition-all">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between rounded-2xl border border-neutral-200 bg-white p-3 shadow-xs">
            {/* Left: Filter Toggle & Quick Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Desktop Filter Toggle Button */}
              <button
                type="button"
                onClick={() => setShowDesktopFilters(prev => !prev)}
                className="hidden lg:flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs font-bold text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showDesktopFilters ? 'Hide Filters' : 'Show Filters'}</span>
                {activeFiltersCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-950 text-[10px] font-bold text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Mobile Filter Trigger Button */}
              <button
                type="button"
                onClick={() => setMobileFilters(true)}
                className="flex lg:hidden items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs font-bold text-neutral-900 hover:bg-neutral-100 transition cursor-pointer shrink-0"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-950 text-[10px] font-bold text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* 1-Click Quick Filter Chips */}
              <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setInStockOnly(prev => !prev)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer border ${
                    inStockOnly
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200'
                  }`}
                >
                  {inStockOnly ? '✓ In Stock' : 'In Stock Only'}
                </button>

                <button
                  type="button"
                  onClick={() => setMinDiscount(prev => (prev === 20 ? 0 : 20))}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer border ${
                    minDiscount === 20
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200'
                  }`}
                >
                  {minDiscount === 20 ? '✓ On Sale (20%+)' : 'On Sale (20%+)'}
                </button>

                <button
                  type="button"
                  onClick={() => setMinRating(prev => (prev === 4 ? 0 : 4))}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer border ${
                    minRating === 4
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200'
                  }`}
                >
                  {minRating === 4 ? '✓ ★ 4.0 & Up' : '★ 4.0 & Up'}
                </button>
              </div>
            </div>

            {/* Right: Search, View Switcher & Sort */}
            <div className="flex items-center justify-between md:justify-end gap-2.5">
              {/* Search Box */}
              <div className="relative flex-1 md:w-60">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products, brands, SKU..."
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-1.5 pl-8 pr-7 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-950 focus:bg-white"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-950 p-0.5 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* View Switcher (Desktop/Tablet) */}
              <div className="hidden sm:flex items-center rounded-xl bg-neutral-100 p-0.5 border border-neutral-200/80">
                <button
                  type="button"
                  title="3-Column Grid"
                  onClick={() => setViewMode('grid-3')}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewMode === 'grid-3'
                      ? 'bg-white text-neutral-950 shadow-xs font-bold'
                      : 'text-neutral-500 hover:text-neutral-950'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="4-Column Grid"
                  onClick={() => setViewMode('grid-4')}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewMode === 'grid-4'
                      ? 'bg-white text-neutral-950 shadow-xs font-bold'
                      : 'text-neutral-500 hover:text-neutral-950'
                  }`}
                >
                  <Grid2X2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="List View"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-neutral-950 shadow-xs font-bold'
                      : 'text-neutral-500 hover:text-neutral-950'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sort Selector Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={sort}
                  onChange={e => handleSortChange(e.target.value)}
                  className="appearance-none rounded-xl border border-neutral-200 bg-neutral-50 pl-3 pr-8 py-1.5 text-xs font-semibold text-neutral-900 outline-none focus:border-neutral-950 cursor-pointer shadow-2xs"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {activeFiltersCount > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-1.5 rounded-xl border border-neutral-200 bg-white p-2.5 sm:p-3 text-xs shadow-2xs animate-fade-in">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mr-1">
              Active Filters:
            </span>

            {category !== 'All' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-900 border border-neutral-200">
                Category: <strong>{category}</strong>
                <button
                  type="button"
                  onClick={() => handleCategorySelect('All')}
                  className="hover:text-red-600 font-bold ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSubcategory !== 'All' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 border border-amber-200">
                Type: <strong>{selectedSubcategory}</strong>
                <button
                  type="button"
                  onClick={() => handleSubcategorySelect('All')}
                  className="hover:text-red-600 font-bold ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedBrand !== 'All' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-900 border border-neutral-200">
                Brand: <strong>{selectedBrand}</strong>
                <button
                  type="button"
                  onClick={() => handleBrandSelect('All')}
                  className="hover:text-red-600 font-bold ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(minPrice > 0 || maxPrice < 250000) && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-900 border border-neutral-200">
                Price: <strong>₹{minPrice.toLocaleString('en-IN')} – ₹{maxPrice.toLocaleString('en-IN')}</strong>
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice(0);
                    setMaxPrice(250000);
                    setActivePriceBracket('all');
                    setCustomMin('');
                    setCustomMax('');
                    const p = new URLSearchParams(searchParams);
                    p.delete('minPrice');
                    p.delete('maxPrice');
                    setSearchParams(p);
                  }}
                  className="hover:text-red-600 font-bold ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {minDiscount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                Discount: <strong>{minDiscount}%+ OFF</strong>
                <button
                  type="button"
                  onClick={() => setMinDiscount(0)}
                  className="hover:text-red-600 font-bold ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 border border-amber-200">
                Rating: <strong>{minRating}★ &amp; Above</strong>
                <button
                  type="button"
                  onClick={() => setMinRating(0)}
                  className="hover:text-red-600 font-bold ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {search && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                Search: <strong>"{search}"</strong>
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="hover:text-red-600 font-bold ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <strong>In Stock Only</strong>
                <button
                  type="button"
                  onClick={() => setInStockOnly(false)}
                  className="hover:text-red-600 font-bold ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={clearAllFilters}
              className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-neutral-900 hover:text-amber-800 underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* 2-Column Responsive Layout: Collapsible Sidebar + Products Feed */}
        <div
          className={`grid gap-8 items-start transition-all duration-300 ${
            showDesktopFilters ? 'lg:grid-cols-[250px_1fr]' : 'grid-cols-1'
          }`}
        >
          {/* ================= 4. DESKTOP ACCORDION SIDEBAR FILTERS ================= */}
          {showDesktopFilters && (
            <aside className="hidden lg:block space-y-4">
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xs space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-800" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
                      Filters
                    </h3>
                  </div>
                  {activeFiltersCount > 0 && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
                    >
                      Reset All
                    </button>
                  )}
                </div>

                {/* 1. Categories Accordion */}
                <div className="border-b border-neutral-100 pb-3.5">
                  <button
                    type="button"
                    onClick={() => toggleSection('categories')}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-neutral-950 transition cursor-pointer mb-2"
                  >
                    <span>Categories</span>
                    {openSections.categories ? (
                      <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                  </button>

                  {openSections.categories && (
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                      {categories.map(cat => {
                        const isSelected = category === cat;
                        const count =
                          cat === 'All'
                            ? products.length
                            : products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;

                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleCategorySelect(cat)}
                            className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                              isSelected
                                ? 'bg-neutral-950 text-white font-semibold shadow-2xs'
                                : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
                            }`}
                          >
                            <span className="truncate">{cat === 'All' ? 'All Products' : cat}</span>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                                isSelected ? 'bg-white/20 text-white' : 'text-neutral-400'
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Subcategory / Product Type Accordion */}
                {dynamicSubcategories.length > 1 && (
                  <div className="border-b border-neutral-100 pb-3.5">
                    <button
                      type="button"
                      onClick={() => toggleSection('subcategories')}
                      className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-neutral-950 transition cursor-pointer mb-2"
                    >
                      <span>Product Type</span>
                      {openSections.subcategories ? (
                        <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                      )}
                    </button>

                    {openSections.subcategories && (
                      <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                        {dynamicSubcategories.map(subcat => {
                          const isSelected = selectedSubcategory === subcat;
                          return (
                            <button
                              key={subcat}
                              type="button"
                              onClick={() => handleSubcategorySelect(subcat)}
                              className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-100/80 text-amber-950 font-semibold border border-amber-300'
                                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
                              }`}
                            >
                              <span className="truncate">{subcat}</span>
                              {isSelected && <Check className="w-3 h-3 text-amber-900" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Brands Accordion */}
                <div className="border-b border-neutral-100 pb-3.5">
                  <button
                    type="button"
                    onClick={() => toggleSection('brands')}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-neutral-950 transition cursor-pointer mb-2"
                  >
                    <span>Brands</span>
                    {openSections.brands ? (
                      <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                  </button>

                  {openSections.brands && (
                    <div className="space-y-2">
                      {dynamicBrands.length > 5 && (
                        <div className="relative mb-1.5">
                          <input
                            type="text"
                            value={brandSearchQuery}
                            onChange={e => setBrandSearchQuery(e.target.value)}
                            placeholder="Find brand..."
                            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs text-neutral-900 outline-none focus:border-neutral-950"
                          />
                          {brandSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setBrandSearchQuery('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}

                      <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                        {visibleBrands.map(brand => {
                          const isSelected = selectedBrand === brand;
                          return (
                            <button
                              key={brand}
                              type="button"
                              onClick={() => handleBrandSelect(brand)}
                              className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                                isSelected
                                  ? 'bg-neutral-100 font-bold text-neutral-950'
                                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span
                                  className={`flex h-3.5 w-3.5 items-center justify-center rounded border ${
                                    isSelected
                                      ? 'border-neutral-950 bg-neutral-950 text-white'
                                      : 'border-neutral-300 bg-white'
                                  }`}
                                >
                                  {isSelected && <Check className="w-2.5 h-2.5" />}
                                </span>
                                <span className="truncate">{brand}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Price Range Accordion */}
                <div className="border-b border-neutral-100 pb-3.5">
                  <button
                    type="button"
                    onClick={() => toggleSection('price')}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-neutral-950 transition cursor-pointer mb-2"
                  >
                    <span>Price Range</span>
                    {openSections.price ? (
                      <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                  </button>

                  {openSections.price && (
                    <div className="space-y-2 pt-1">
                      {/* Price Tier Buttons */}
                      <div className="space-y-1">
                        {PRICE_BRACKETS.map(bracket => (
                          <button
                            key={bracket.id}
                            type="button"
                            onClick={() => handlePriceBracketSelect(bracket)}
                            className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                              activePriceBracket === bracket.id
                                ? 'bg-neutral-950 text-white font-semibold'
                                : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                            }`}
                          >
                            <span>{bracket.label}</span>
                            {activePriceBracket === bracket.id && <Check className="w-3 h-3 text-amber-300" />}
                          </button>
                        ))}
                      </div>

                      {/* Custom Price Inputs */}
                      <div className="pt-2 border-t border-neutral-100">
                        <span className="text-[11px] font-semibold text-neutral-500 mb-1 block">
                          Custom Range (₹)
                        </span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            placeholder="Min"
                            value={customMin}
                            onChange={e => setCustomMin(e.target.value)}
                            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs outline-none focus:border-neutral-950"
                          />
                          <span className="text-neutral-400 text-xs">–</span>
                          <input
                            type="number"
                            placeholder="Max"
                            value={customMax}
                            onChange={e => setCustomMax(e.target.value)}
                            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs outline-none focus:border-neutral-950"
                          />
                          <button
                            type="button"
                            onClick={applyCustomPrice}
                            className="rounded-lg bg-neutral-900 px-2.5 py-1 text-xs font-bold text-white hover:bg-black transition cursor-pointer shrink-0"
                          >
                            Go
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Customer Rating Accordion */}
                <div className="border-b border-neutral-100 pb-3.5">
                  <button
                    type="button"
                    onClick={() => toggleSection('ratings')}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-neutral-950 transition cursor-pointer mb-2"
                  >
                    <span>Customer Rating</span>
                    {openSections.ratings ? (
                      <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                  </button>

                  {openSections.ratings && (
                    <div className="space-y-1">
                      {[
                        { stars: 4, label: '4★ & Above' },
                        { stars: 3, label: '3★ & Above' }
                      ].map(r => (
                        <button
                          key={r.stars}
                          type="button"
                          onClick={() => setMinRating(prev => (prev === r.stars ? 0 : r.stars))}
                          className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                            minRating === r.stars
                              ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200'
                              : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-amber-500 font-bold">★ {r.stars}.0</span>
                            <span>&amp; up</span>
                          </div>
                          {minRating === r.stars && <Check className="w-3 h-3 text-amber-800" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 6. Discount Accordion */}
                <div className="border-b border-neutral-100 pb-3.5">
                  <button
                    type="button"
                    onClick={() => toggleSection('discount')}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-neutral-950 transition cursor-pointer mb-2"
                  >
                    <span>Discounts</span>
                    {openSections.discount ? (
                      <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                  </button>

                  {openSections.discount && (
                    <div className="space-y-1">
                      {[10, 20, 30, 50].map(disc => (
                        <button
                          key={disc}
                          type="button"
                          onClick={() => setMinDiscount(prev => (prev === disc ? 0 : disc))}
                          className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                            minDiscount === disc
                              ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200'
                              : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                          }`}
                        >
                          <span>{disc}% or more</span>
                          {minDiscount === disc && <Check className="w-3 h-3 text-emerald-700" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 7. In Stock Availability Toggle */}
                <div className="pt-1">
                  <label className="flex cursor-pointer items-center justify-between rounded-lg p-1.5 hover:bg-neutral-50 transition">
                    <span className="text-xs font-semibold text-neutral-900">In Stock Items Only</span>
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={e => setInStockOnly(e.target.checked)}
                      className="h-4 w-4 rounded border-neutral-300 accent-neutral-950 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </aside>
          )}

          {/* ================= 5. PRODUCT CATALOG DISPLAY ================= */}
          <section className="min-w-0">
            {isFiltering ? (
              <div
                className={`grid gap-4 ${
                  viewMode === 'grid-4'
                    ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                    : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : totalItems > 0 ? (
              <>
                {/* 3-Column Standard Grid View */}
                {viewMode === 'grid-3' && (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {paginatedProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                      />
                    ))}
                  </div>
                )}

                {/* 4-Column Compact Grid View */}
                {viewMode === 'grid-4' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5">
                    {paginatedProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                      />
                    ))}
                  </div>
                )}

                {/* Rich Horizontal List View */}
                {viewMode === 'list' && (
                  <div className="space-y-3.5">
                    {paginatedProducts.map(product => (
                      <div
                        key={product.id}
                        className="group flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xs transition hover:shadow-md hover:border-neutral-300 gap-4"
                      >
                        {/* Left: Product Thumbnail */}
                        <Link
                          to={`/product/${product.id}`}
                          className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl bg-stone-50 p-1 flex items-center justify-center border border-neutral-100"
                        >
                          <img
                            src={product.image || product.images?.[0]}
                            alt={product.name}
                            className={`h-full w-full object-contain transition-all duration-500 ${
                              product.images && product.images.length > 1
                                ? 'group-hover:opacity-0 group-hover:scale-105'
                                : 'group-hover:scale-105'
                            }`}
                          />
                          {product.images && product.images.length > 1 && (
                            <img
                              src={product.images[1]}
                              alt={`${product.name} alternate angle`}
                              className="absolute inset-0 h-full w-full object-contain p-1 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105 pointer-events-none"
                            />
                          )}
                        </Link>

                        {/* Center: Specs & Info */}
                        <div className="flex-1 min-w-0 text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                              {product.brand}
                            </span>
                            <span className="text-neutral-300">•</span>
                            <span className="text-[10px] font-semibold text-neutral-500">
                              {product.category}
                            </span>
                          </div>

                          <Link
                            to={`/product/${product.id}`}
                            className="block text-sm sm:text-base font-bold text-neutral-950 hover:underline truncate mt-0.5"
                          >
                            {product.name}
                          </Link>

                          <p className="text-xs text-neutral-500 line-clamp-2 mt-1">
                            {product.description}
                          </p>

                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2 text-xs">
                            <span className="text-amber-500 font-bold">★ {product.rating || '4.8'}</span>
                            <span className="text-neutral-300">•</span>
                            <span
                              className={`font-semibold ${
                                product.stock > 0 ? 'text-emerald-700' : 'text-rose-600'
                              }`}
                            >
                              {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                            </span>
                            <span className="text-neutral-300">•</span>
                            <span className="text-neutral-400 font-mono text-[11px]">{product.sku}</span>
                          </div>
                        </div>

                        {/* Right: Pricing & Add to Bag */}
                        <div className="flex flex-col sm:items-end justify-center gap-2.5 shrink-0 text-center sm:text-right w-full sm:w-auto">
                          <div>
                            <span className="text-base sm:text-lg font-extrabold text-neutral-950">
                              ₹{Number(product.price).toLocaleString('en-IN')}
                            </span>
                            {product.oldPrice && product.oldPrice > product.price && (
                              <span className="ml-2 text-xs text-neutral-400 line-through">
                                ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-black transition cursor-pointer active:scale-98 shadow-xs"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                            <span>Add to Bag</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ================= 6. PAGINATION BAR ================= */}
                <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-5 text-center shadow-2xs space-y-4">
                  {/* Progress Bar Indicator */}
                  <div className="max-w-xs mx-auto space-y-1.5">
                    <div className="flex justify-between text-[11px] font-semibold text-neutral-500">
                      <span>
                        Showing {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
                      </span>
                      <span>
                        {Math.round((Math.min(currentPage * itemsPerPage, totalItems) / totalItems) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                      <div
                        className="h-full bg-neutral-950 rounded-full transition-all duration-300"
                        style={{
                          width: `${(Math.min(currentPage * itemsPerPage, totalItems) / totalItems) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Numbered Page Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage(p => Math.max(1, p - 1));
                        scrollToProducts();
                      }}
                      className="px-3.5 py-1.5 rounded-xl border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 transition cursor-pointer"
                    >
                      &larr; Previous
                    </button>

                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      // Display smart window around current page
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => {
                              setCurrentPage(pageNum);
                              scrollToProducts();
                            }}
                            className={`min-w-[34px] h-[34px] rounded-xl text-xs font-bold transition cursor-pointer ${
                              currentPage === pageNum
                                ? 'bg-neutral-950 text-white shadow-xs'
                                : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                        return (
                          <span key={pageNum} className="text-neutral-400 text-xs px-1">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => {
                        setCurrentPage(p => Math.min(totalPages, p + 1));
                        scrollToProducts();
                      }}
                      className="px-3.5 py-1.5 rounded-xl border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 transition cursor-pointer"
                    >
                      Next &rarr;
                    </button>
                  </div>

                  {/* Items per page selector */}
                  <div className="flex items-center justify-center gap-2 pt-1 text-xs text-neutral-500">
                    <span>Show:</span>
                    {[12, 24, 48].map(count => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => {
                          setItemsPerPage(count);
                          setCurrentPage(1);
                        }}
                        className={`px-2 py-0.5 rounded-md font-semibold transition cursor-pointer ${
                          itemsPerPage === count
                            ? 'bg-neutral-950 text-white'
                            : 'text-neutral-600 hover:text-neutral-950'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                    <span>per page</span>
                  </div>
                </div>
              </>
            ) : (
              /* Polished Clean Empty Search / Filter State */
              <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white p-8 sm:p-12 text-center shadow-xs">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-700">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-neutral-950">
                  No matching products found
                </h3>
                <p className="mt-1 max-w-md text-xs text-neutral-500 leading-relaxed">
                  We couldn't find any products in{' '}
                  <strong>{category === 'All' ? 'our catalog' : category}</strong> matching your selected
                  filters. Try adjusting your brand, price range, or clearing search filters.
                </p>
                <div className="mt-5 flex flex-wrap gap-2 justify-center">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-black transition cursor-pointer active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('All')}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs font-semibold text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
                  >
                    <span>View All Categories</span>
                  </button>
                </div>
              </div>
            )}

            {/* ================= 7. CURATED RECOMMENDATIONS ================= */}
            <div className="mt-14 border-t border-neutral-200/80 pt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                    Curated Collection
                  </span>
                  <h3 className="text-lg font-bold text-neutral-950">You May Also Appreciate</h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleCategorySelect('Watches')}
                  className="text-xs font-bold text-neutral-800 hover:text-black hover:underline cursor-pointer"
                >
                  Explore Horology &rarr;
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                {products.slice(0, 3).map(product => (
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

        {/* ================= 8. TRUST PILLARS STRIP ================= */}
        <div className="mt-14 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1.5">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-neutral-950">100% Genuine Products</h4>
              <p className="text-[11px] text-neutral-500">Rigorous boutique inspection with verified warranties.</p>
            </div>

            <div className="space-y-1.5">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200/60">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-neutral-950">Insured Express Delivery</h4>
              <p className="text-[11px] text-neutral-500">BlueDart &amp; Delhivery tracked shipping dispatched in 24h.</p>
            </div>

            <div className="space-y-1.5">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <ReturnIcon className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-neutral-950">7-Day Inspection Return</h4>
              <p className="text-[11px] text-neutral-500">Hassle-free doorstep return pickup with swift refunds.</p>
            </div>

            <div className="space-y-1.5">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-200/60">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-neutral-950">256-Bit Encrypted Payments</h4>
              <p className="text-[11px] text-neutral-500">Safe UPI, Cards, NetBanking &amp; Cash on Delivery.</p>
            </div>
          </div>
        </div>

        {/* ================= 9. FREQUENTLY ASKED QUESTIONS ACCORDION ================= */}
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
              Assistance &amp; FAQs
            </span>
            <h3 className="text-lg font-bold text-neutral-950 mt-1">Frequently Asked Questions</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Everything you need to know about deliveries, warranties, and orders.
            </p>
          </div>

          <div className="divide-y divide-neutral-100 max-w-3xl mx-auto text-xs">
            {FAQ_ITEMS.map((faq, idx) => (
              <div key={idx} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-neutral-950 text-xs sm:text-sm hover:text-amber-800 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-sm text-neutral-400 ml-2 font-mono">
                    {openFaqIndex === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaqIndex === idx && (
                  <p className="mt-2 text-xs text-neutral-600 leading-relaxed pl-1 animate-fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ================= 10. MOBILE SLIDE-OVER FILTER DRAWER ================= */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            onClick={() => setMobileFilters(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content Panel */}
          <div className="relative w-full max-w-xs sm:max-w-sm h-full bg-white shadow-2xl flex flex-col justify-between z-50 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3.5 bg-neutral-50">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-neutral-900" />
                <span className="text-sm font-bold text-neutral-950">Filters &amp; Refinements</span>
                <span className="rounded-full bg-neutral-950 text-white px-2 py-0.2 text-[10px] font-bold">
                  {totalItems}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200 text-neutral-700 hover:bg-neutral-300 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-2">
                  Categories
                </h4>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {categories.map(cat => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                        category === cat
                          ? 'bg-neutral-950 text-white'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-[10px] opacity-70">
                        (
                        {cat === 'All'
                          ? products.length
                          : products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length}
                        )
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Types */}
              {dynamicSubcategories.length > 1 && (
                <div className="border-t border-neutral-100 pt-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-2">
                    Product Type
                  </h4>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {dynamicSubcategories.map(type => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => handleSubcategorySelect(type)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                          selectedSubcategory === type
                            ? 'bg-amber-100 text-amber-950 border border-amber-300'
                            : 'text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        <span>{type}</span>
                        {selectedSubcategory === type && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands */}
              <div className="border-t border-neutral-100 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-2">
                  Brands
                </h4>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {dynamicBrands.map(brand => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => handleBrandSelect(brand)}
                      className={`w-full flex items-center justify-between rounded-xl px-3 py-1.5 text-xs transition cursor-pointer ${
                        selectedBrand === brand
                          ? 'bg-neutral-100 font-bold text-neutral-950'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{brand}</span>
                      {selectedBrand === brand && <Check className="w-3.5 h-3.5 text-neutral-950" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Tiers */}
              <div className="border-t border-neutral-100 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-2">
                  Price Range
                </h4>
                <div className="space-y-1">
                  {PRICE_BRACKETS.map(bracket => (
                    <button
                      key={bracket.id}
                      type="button"
                      onClick={() => handlePriceBracketSelect(bracket)}
                      className={`w-full text-left rounded-lg px-2.5 py-1 text-xs font-semibold transition flex items-center justify-between ${
                        activePriceBracket === bracket.id
                          ? 'bg-neutral-950 text-white font-bold'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <span>{bracket.label}</span>
                      {activePriceBracket === bracket.id && <span>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Only */}
              <div className="border-t border-neutral-100 pt-3">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-xs font-bold text-neutral-950">In Stock Items Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 accent-neutral-950"
                  />
                </label>
              </div>
            </div>

            {/* Sticky Drawer Footer */}
            <div className="border-t border-neutral-200 p-4 flex gap-2 bg-neutral-50">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex-1 py-2.5 border border-neutral-300 rounded-xl font-bold text-xs hover:bg-neutral-100 transition cursor-pointer"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="flex-1 py-2.5 bg-neutral-950 text-white rounded-xl font-bold text-xs hover:bg-black transition cursor-pointer shadow-sm"
              >
                Show {totalItems} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 11. MOBILE BOTTOM STICKY ACTION BAR ================= */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-2 sm:hidden flex items-center justify-between gap-2 shadow-lg">
        <button
          type="button"
          onClick={() => setMobileFilters(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-neutral-100 text-neutral-900 font-bold text-xs active:bg-neutral-200"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
        </button>

        <div className="flex-1 relative">
          <select
            value={sort}
            onChange={e => handleSortChange(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl bg-neutral-950 text-white font-bold text-xs outline-none text-center appearance-none"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-white text-neutral-900 text-left">
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Footer />
    </div>
  );
}