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
  getProductTypesByCategory,
  getRecentlyViewedProducts
} from '../utils/productStore';
import { getCurrentUser } from '../utils/auth';
import { addToCart } from '../utils/cart';
import {
  ShieldCheckIcon,
  TruckIcon,
  StarIcon,
  HeartIcon,
  SearchIcon,
  BagIcon,
  RefreshIcon,
  HeadphonesIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '../components/Icons';

// Category Visual Metadata: Icons, Taglines and Descriptions
const CATEGORY_META = {
  'All': {
    icon: '✨',
    title: 'All Products',
    tagline: 'Authorized Luxury Catalog',
    desc: 'Certified authentic luxury timepieces, footwear, tech gadgets, and designer accessories.'
  },
  'Watches': {
    icon: '⌚',
    title: 'Luxury Timepieces',
    tagline: 'Horology & Smart Dials',
    desc: 'Precision Swiss automatics, chronographs, solar-powered dials, and modern smartwatches.'
  },
  'Bags & Wallets': {
    icon: '🎒',
    title: 'Bags & Leather Goods',
    tagline: 'Artisanal Craftsmanship',
    desc: 'Top-grain vegetable-tanned briefcases, commuter backpacks, and luxury totes.'
  },
  'Shoes': {
    icon: '👟',
    title: 'Designer Footwear',
    tagline: 'Performance & Streetwear',
    desc: 'Responsive running shoes, premium retro high-tops, and genuine nubuck boots.'
  },
  'Mobiles': {
    icon: '📱',
    title: 'Flagship Smartphones',
    tagline: 'Titanium & AI Systems',
    desc: 'Next-gen flagship smartphones with Pro camera arrays and aerospace titanium chassis.'
  },
  'Clothes & Fashion': {
    icon: '👔',
    title: 'Clothes & Formalwear',
    tagline: 'Tailored Luxury Fashion',
    desc: 'Italian slim-fit blazers, authentic denim jeans, and organic cotton polos.'
  },
  'Laptops': {
    icon: '💻',
    title: 'High-End Laptops',
    tagline: 'Pro Computing & Gaming',
    desc: 'OLED touchscreen laptops, Apple Silicon workstations, and ROG gaming rigs.'
  },
  'Electronics': {
    icon: '🎧',
    title: 'Premium Audio & Tech',
    tagline: 'High-Fidelity Sound',
    desc: 'Active noise-cancelling headphones, spatial audio earbuds, and vintage home speakers.'
  },
  'Smart Gadgets': {
    icon: '⚡',
    title: 'Smart Gadgets & Wearables',
    tagline: 'Next-Gen Connected Tech',
    desc: 'Titanium biometric smart rings, Apple Watch Ultra, and smart home innovations.'
  },
  'Gaming': {
    icon: '🎮',
    title: 'Gaming Peripherals',
    tagline: 'Pro Esports Hardware',
    desc: '8000Hz mechanical switch keyboards, lightweight gaming mice, and audio headsets.'
  },
  'Fitness': {
    icon: '🏃',
    title: 'Fitness & Health Trackers',
    tagline: 'Athletic Precision Metrics',
    desc: 'Multi-band GPS sports watches, AMOLED fitness bands, and biometric health monitors.'
  },
  'Fashion Accessories': {
    icon: '🕶️',
    title: 'Fashion Accessories',
    tagline: 'Signature Luxury Accents',
    desc: 'Polarized pilot sunglasses, reversible cowhide leather belts, and designer accessories.'
  }
};

const FAQ_ITEMS = [
  {
    q: 'How does Krishna Accessories guarantee 100% product authenticity?',
    a: 'Every item in our catalog is sourced directly from authorized brand distributors and brand-certified manufacturing partners. All luxury timepieces, electronics, and leather goods include official manufacturer warranty cards, valid serial barcodes, and tamper-proof security seals.'
  },
  {
    q: 'What is the delivery timeline and shipping policy across India?',
    a: 'We offer free, fully insured express courier shipping across all major Indian cities (24–48 hours for metro locations, 2–4 business days nationwide). Every parcel is secured with specialized tamper-resistant packaging and full tracking updates via SMS and WhatsApp.'
  },
  {
    q: 'What warranty is included with my purchase?',
    a: 'All branded products include standard official manufacturer warranty (from 1 to 5 years depending on the brand), valid at authorized service centers across India. In addition, Krishna Accessories provides direct warranty assistance and concierge support.'
  },
  {
    q: 'What is your return and exchange policy?',
    a: 'We provide an easy, hassle-free 7-day return and exchange policy. If an item arrives damaged, defective, or does not match the specifications, our courier partner will arrange doorstep pickup and you will receive an immediate replacement or full refund.'
  },
  {
    q: 'Can I pay securely using UPI, Credit Cards, or Cash on Delivery?',
    a: 'Yes, we accept all major payment methods including Instant UPI (Google Pay, PhonePe, Paytm), Visa/Mastercard/RuPay Credit and Debit Cards, Net Banking across all Indian banks, and Cash on Delivery with OTP verification at doorstep.'
  }
];

export default function Shop() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL params
  const urlCategory = searchParams.get('category') || 'All';
  const urlBrand = searchParams.get('brand') || 'All';
  const urlType = searchParams.get('type') || searchParams.get('subcategory') || 'All';
  const urlSearch = searchParams.get('search') || '';
  const urlSort = searchParams.get('sort') || 'featured';

  // Core Data States
  const [products, setProducts] = useState(() => getProducts());
  const [categories, setCategories] = useState(() => ['All', ...getCategories()]);
  const [recentlyViewed, setRecentlyViewed] = useState(() => getRecentlyViewedProducts());

  // Active Filter States
  const [category, setCategory] = useState(urlCategory);
  const [selectedBrand, setSelectedBrand] = useState(urlBrand);
  const [selectedType, setSelectedType] = useState(urlType);
  const [sort, setSort] = useState(urlSort);
  const [search, setSearch] = useState(urlSearch);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(250000);
  const [minDiscount, setMinDiscount] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  // UI Control States
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [brandSearchInput, setBrandSearchInput] = useState('');
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const productGridTopRef = useRef(null);

  // Sync data on storage changes
  useEffect(() => {
    const handleProductsUpdate = () => {
      setProducts(getProducts());
      setCategories(['All', ...getCategories()]);
    };
    const handleRecentlyViewedUpdate = () => {
      setRecentlyViewed(getRecentlyViewedProducts());
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);
    window.addEventListener('recentlyViewedUpdated', handleRecentlyViewedUpdate);
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
      window.removeEventListener('recentlyViewedUpdated', handleRecentlyViewedUpdate);
    };
  }, []);

  // Sync from URL changes
  useEffect(() => {
    if (urlCategory && urlCategory !== category) {
      setCategory(urlCategory);
      setSelectedBrand('All');
      setSelectedType('All');
      setCurrentPage(1);
    }
  }, [urlCategory]);

  useEffect(() => {
    if (urlBrand && urlBrand !== selectedBrand) {
      setSelectedBrand(urlBrand);
      setCurrentPage(1);
    }
  }, [urlBrand]);

  useEffect(() => {
    if (urlType && urlType !== selectedType) {
      setSelectedType(urlType);
      setCurrentPage(1);
    }
  }, [urlType]);

  useEffect(() => {
    if (urlSearch !== search) {
      setSearch(urlSearch);
      setCurrentPage(1);
    }
  }, [urlSearch]);

  // Dynamic Brands for currently selected Category
  const dynamicBrands = useMemo(() => {
    const list = getBrandsByCategory(category);
    return ['All', ...list];
  }, [category, products]);

  // Filtered Brands for internal search inside the sidebar
  const filteredSidebarBrands = useMemo(() => {
    if (!brandSearchInput.trim()) return dynamicBrands;
    const q = brandSearchInput.toLowerCase().trim();
    return dynamicBrands.filter(b => b === 'All' || b.toLowerCase().includes(q));
  }, [dynamicBrands, brandSearchInput]);

  // Dynamic Product Types / Subcategories for currently selected Category
  const dynamicProductTypes = useMemo(() => {
    const types = getProductTypesByCategory(category);
    return ['All', ...types];
  }, [category, products]);

  // Update URL Query Helper
  const updateUrlParams = (updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (!val || val === 'All') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    setSearchParams(params);
  };

  // Handlers for Filters
  const handleCategorySelect = (cat) => {
    setIsFiltering(true);
    setCategory(cat);
    setSelectedBrand('All');
    setSelectedType('All');
    setCurrentPage(1);
    updateUrlParams({ category: cat, brand: 'All', type: 'All' });
    setTimeout(() => setIsFiltering(false), 150);
  };

  const handleBrandSelect = (brand) => {
    setIsFiltering(true);
    setSelectedBrand(brand);
    setCurrentPage(1);
    updateUrlParams({ brand });
    setTimeout(() => setIsFiltering(false), 150);
  };

  const handleTypeSelect = (type) => {
    setIsFiltering(true);
    setSelectedType(type);
    setCurrentPage(1);
    updateUrlParams({ type });
    setTimeout(() => setIsFiltering(false), 150);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setCurrentPage(1);
    updateUrlParams({ search: val });
  };

  const clearAllFilters = () => {
    setIsFiltering(true);
    setCategory('All');
    setSelectedBrand('All');
    setSelectedType('All');
    setSort('featured');
    setSearch('');
    setMinPrice(0);
    setMaxPrice(250000);
    setMinDiscount(0);
    setMinRating(0);
    setInStockOnly(false);
    setCurrentPage(1);
    setSearchParams({});
    setTimeout(() => setIsFiltering(false), 150);
  };

  // Master Filter & Sort Engine
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Category Filter
    if (category !== 'All') {
      list = list.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }

    // 2. Product Type / Subcategory Filter
    if (selectedType !== 'All') {
      list = list.filter((p) => p.subcategory?.toLowerCase() === selectedType.toLowerCase());
    }

    // 3. Brand Filter
    if (selectedBrand !== 'All') {
      list = list.filter((p) => p.brand?.toLowerCase() === selectedBrand.toLowerCase());
    }

    // 4. Price Range Filter
    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // 5. Discount Filter
    if (minDiscount > 0) {
      list = list.filter((p) => (p.discount || 0) >= minDiscount);
    }

    // 6. Rating Filter
    if (minRating > 0) {
      list = list.filter((p) => (p.rating || 0) >= minRating);
    }

    // 7. In Stock Filter
    if (inStockOnly) {
      list = list.filter((p) => (p.stock || 0) > 0);
    }

    // 8. Keyword Search Filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((p) =>
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
    } else if (sort === 'brand-az') {
      list.sort((a, b) => (a.brand || '').localeCompare(b.brand || ''));
    }

    return list;
  }, [
    products,
    category,
    selectedType,
    selectedBrand,
    minPrice,
    maxPrice,
    minDiscount,
    minRating,
    inStockOnly,
    search,
    sort
  ]);

  // Pagination Computations
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const activeFiltersCount =
    (category !== 'All' ? 1 : 0) +
    (selectedBrand !== 'All' ? 1 : 0) +
    (selectedType !== 'All' ? 1 : 0) +
    (search ? 1 : 0) +
    (minPrice > 0 || maxPrice < 250000 ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  // Active Category Meta
  const currentMeta = CATEGORY_META[category] || {
    icon: '✨',
    title: `${category} Collection`,
    tagline: 'Exclusive Luxury Collection',
    desc: `Discover authentic ${category} crafted for superior style and precision.`
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (productGridTopRef.current) {
      productGridTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans antialiased selection:bg-[#111827] selection:text-white">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-xs font-semibold text-gray-900 shadow-2xl animate-slide-up">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">✓</span>
          <span>{toastMessage}</span>
          <Link
            to="/cart"
            className="ml-2 rounded-full bg-[#111827] px-3.5 py-1 text-[11px] font-semibold text-white hover:bg-black transition"
          >
            View Bag
          </Link>
        </div>
      )}

      {/* 1. TOP LUXURY ASSURANCE MARQUEE */}
      <section className="border-b border-gray-200/80 bg-white py-2 text-[10.5px] sm:text-xs font-medium text-gray-600">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-gray-800">
              <span className="text-[#B89758]">★</span>
              <span className="font-semibold text-gray-950">100% Certified Authentic</span>
              <span className="hidden sm:inline text-gray-400">• Direct Brand Warranty</span>
            </div>
            <div className="flex items-center gap-4 text-gray-500 text-[11px] sm:text-xs">
              <span className="hidden md:flex items-center gap-1">
                <span>🚚</span> Free Express Shipping across India
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <span>🛡️</span> 2-Year Official Brand Warranty
              </span>
              <span className="flex items-center gap-1">
                <span>🔄</span> 7-Day Doorstep Exchange
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC HERO HEADER & BREADCRUMBS */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-[#F6F7F9] border-b border-gray-200/80 py-6 sm:py-9">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumbs */}
          <nav className="mb-3 flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <Link to="/" className="hover:text-black transition">Home</Link>
            <span className="text-gray-300">/</span>
            <button
              onClick={() => handleCategorySelect('All')}
              className={`hover:text-black transition ${category === 'All' ? 'font-bold text-gray-900' : ''}`}
            >
              Shop Catalog
            </button>
            {category !== 'All' && (
              <>
                <span className="text-gray-300">/</span>
                <span className="font-bold text-gray-950">{category}</span>
              </>
            )}
            {selectedType !== 'All' && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-[#B89758] font-bold">{selectedType}</span>
              </>
            )}
            {selectedBrand !== 'All' && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-gray-900 font-semibold">{selectedBrand}</span>
              </>
            )}
          </nav>

          {/* Hero Content Row */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-[#B89758] border border-amber-200/70">
                <span>{currentMeta.icon}</span>
                <span>{currentMeta.tagline}</span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-950">
                {category === 'All' ? 'Curated Luxury Catalog' : currentMeta.title}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
                {currentMeta.desc}
              </p>
            </div>

            {/* Catalog Statistics Pill */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="rounded-2xl border border-gray-200/90 bg-white/80 backdrop-blur-md px-4 py-2.5 shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block">
                  Catalog Status
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm sm:text-base font-bold text-gray-950">
                    {filteredProducts.length} Items Found
                  </span>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. VISUAL CATEGORY HORIZONTAL CAROUSEL */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
                Explore All Departments
              </span>
              {category !== 'All' && (
                <button
                  type="button"
                  onClick={() => handleCategorySelect('All')}
                  className="text-xs font-semibold text-[#B89758] hover:underline"
                >
                  View All Departments →
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-3 px-3 sm:mx-0 sm:px-0">
              {categories.map((cat) => {
                const meta = CATEGORY_META[cat] || { icon: '📦' };
                const count = cat === 'All'
                  ? products.length
                  : products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
                const isSelected = category.toLowerCase() === cat.toLowerCase();

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`shrink-0 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95 ${isSelected
                      ? 'bg-[#111827] text-amber-300 shadow-md ring-2 ring-gray-900 ring-offset-2'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400 hover:text-black shadow-xs'
                      }`}
                  >
                    <span className="text-sm">{meta.icon}</span>
                    <span>{cat}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-amber-200' : 'bg-gray-100 text-gray-500'
                      }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 4. DYNAMIC SUB-TIER NAVIGATION: BRAND SPOTLIGHT & PRODUCT TYPES */}
      <section className="bg-white border-b border-gray-200/80 py-3 shadow-xs">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 space-y-2.5">
          
          {/* A. Product Types / Subcategories Quick Bar */}
          {dynamicProductTypes.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-gray-400 shrink-0">
                Product Type:
              </span>
              {dynamicProductTypes.map((type) => {
                const isSelected = selectedType.toLowerCase() === type.toLowerCase();
                const typeCount = type === 'All'
                  ? (category === 'All' ? products.length : products.filter(p => p.category === category).length)
                  : products.filter(p => (category === 'All' || p.category === category) && p.subcategory === type).length;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${isSelected
                      ? 'bg-[#B89758] text-white font-bold shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black'
                      }`}
                  >
                    {type} {type !== 'All' && <span className="opacity-75 font-mono">({typeCount})</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* B. Dynamic Brand Spotlight Scroller */}
          {dynamicBrands.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-gray-100">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-gray-400 shrink-0">
                Featured Brands:
              </span>
              {dynamicBrands.map((b) => {
                const isSelected = selectedBrand.toLowerCase() === b.toLowerCase();
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleBrandSelect(b)}
                    className={`shrink-0 rounded-full px-3 py-0.5 text-[11px] font-semibold transition-all ${isSelected
                      ? 'bg-gray-900 text-white'
                      : 'bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 hover:text-black'
                      }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 5. MAIN CATALOG & DUAL COLUMN SECTION */}
      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-5 sm:py-7">

        {/* Master Toolbar: Search, View Mode Toggle, Sort, and Mobile Drawer Trigger */}
        <div
          ref={productGridTopRef}
          className="mb-5 flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-3 sm:p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between"
        >
          {/* Live Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={`Search in ${category === 'All' ? 'all items' : category} by name, brand, specs, SKU...`}
              className="w-full rounded-xl border border-gray-200 bg-[#F6F7F9] py-2 pl-9 pr-8 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              🔍
            </span>
            {search && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-between lg:justify-end">
            
            {/* Mobile Filter Drawer Button */}
            <button
              type="button"
              onClick={() => setMobileFilters(true)}
              className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-bold text-gray-900 lg:hidden shadow-xs hover:bg-gray-50 active:scale-95 shrink-0"
            >
              <span>⚙️ Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#111827] text-[10px] font-bold text-amber-300">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Grid vs List View Mode Toggle */}
            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-100 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title="Grid View"
                aria-label="Grid View"
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs transition ${viewMode === 'grid'
                  ? 'bg-white font-bold text-gray-950 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                ⊞
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                title="List View"
                aria-label="List View"
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs transition ${viewMode === 'list'
                  ? 'bg-white font-bold text-gray-950 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                ☰
              </button>
            </div>

            {/* Items Per Page Selector */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
              <span className="font-medium whitespace-nowrap">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-gray-200 bg-[#F6F7F9] px-2 py-1.5 text-xs font-semibold text-gray-900 outline-none cursor-pointer"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={36}>36</option>
                <option value={100}>All</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
              <label className="hidden md:inline text-xs text-gray-500 font-medium whitespace-nowrap">
                Sort:
              </label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  updateUrlParams({ sort: e.target.value });
                }}
                className="w-full sm:w-44 rounded-xl border border-gray-200 bg-[#F6F7F9] px-3 py-2 text-xs font-semibold text-gray-900 outline-none focus:border-gray-900 cursor-pointer"
              >
                <option value="featured">Featured / Best Match</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Biggest Savings %</option>
                <option value="newest">Newest Arrivals</option>
                <option value="brand-az">Brand Name (A-Z)</option>
              </select>
            </div>

          </div>
        </div>

        {/* 2-Column Catalog Layout: Sidebar + Product Grid */}
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">

          {/* ================= DESKTOP SIDEBAR FACETED FILTERS ================= */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-5 rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs">
              
              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-gray-950">
                    Filters & Refinements
                  </span>
                  {activeFiltersCount > 0 && (
                    <span className="rounded-full bg-[#111827] px-2 py-0.5 text-[10px] font-bold text-amber-300">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-xs font-semibold text-[#B89758] hover:underline"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* 1. Category Tree */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">
                  1. Departments
                </h3>
                <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const count = cat === 'All'
                      ? products.length
                      : products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
                    const isSelected = category.toLowerCase() === cat.toLowerCase();

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategorySelect(cat)}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${isSelected
                          ? 'bg-[#111827] font-bold text-amber-200 shadow-xs'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                          }`}
                      >
                        <span className="truncate">{cat}</span>
                        <span className={`text-[10px] font-mono ${isSelected ? 'text-amber-300' : 'text-gray-400'}`}>
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Product Type / Subcategory Filter */}
              {dynamicProductTypes.length > 1 && (
                <div className="border-t border-gray-100 pt-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950">
                      2. Product Types
                    </h3>
                    {selectedType !== 'All' && (
                      <button
                        type="button"
                        onClick={() => handleTypeSelect('All')}
                        className="text-[10px] text-[#B89758] font-semibold hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-0.5 max-h-40 overflow-y-auto pr-1">
                    {dynamicProductTypes.map((type) => {
                      const isSelected = selectedType.toLowerCase() === type.toLowerCase();
                      const count = type === 'All'
                        ? (category === 'All' ? products.length : products.filter(p => p.category === category).length)
                        : products.filter(p => (category === 'All' || p.category === category) && p.subcategory === type).length;

                      return (
                        <label
                          key={type}
                          onClick={() => handleTypeSelect(type)}
                          className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1 text-xs transition ${isSelected
                            ? 'bg-gray-100 text-gray-950 font-bold'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="sidebarProductType"
                              checked={isSelected}
                              onChange={() => handleTypeSelect(type)}
                              className="accent-[#111827] h-3.5 w-3.5"
                            />
                            <span className="truncate">{type}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">({count})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Brands with In-Sidebar Search */}
              <div className="border-t border-gray-100 pt-3.5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950">
                    3. Brands {category !== 'All' && <span className="text-gray-400 font-normal">in {category}</span>}
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

                {/* Brand Search Input */}
                {dynamicBrands.length > 6 && (
                  <input
                    type="text"
                    value={brandSearchInput}
                    onChange={(e) => setBrandSearchInput(e.target.value)}
                    placeholder="Search brand..."
                    className="mb-2 w-full rounded-lg border border-gray-200 bg-[#F6F7F9] px-2.5 py-1 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400"
                  />
                )}

                <div className="space-y-0.5 max-h-44 overflow-y-auto pr-1">
                  {filteredSidebarBrands.map((brand) => {
                    const isSelected = selectedBrand.toLowerCase() === brand.toLowerCase();
                    const brandCount = brand === 'All'
                      ? (category === 'All' ? products.length : products.filter(p => p.category === category).length)
                      : products.filter(p => (category === 'All' || p.category === category) && p.brand === brand).length;

                    return (
                      <label
                        key={brand}
                        onClick={() => handleBrandSelect(brand)}
                        className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1 text-xs transition ${isSelected
                          ? 'bg-gray-100 text-gray-950 font-bold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="sidebarBrand"
                            checked={isSelected}
                            onChange={() => handleBrandSelect(brand)}
                            className="accent-[#111827] h-3.5 w-3.5"
                          />
                          <span className="truncate">{brand}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">({brandCount})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4. Price Range Slider & Brackets */}
              <div className="border-t border-gray-100 pt-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">
                  4. Price Range (₹)
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-gray-400 uppercase block mb-0.5 font-semibold">Min (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
                      className="w-full rounded-lg border border-gray-200 bg-[#F6F7F9] px-2 py-1 text-xs text-gray-900 outline-none focus:border-gray-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-400 uppercase block mb-0.5 font-semibold">Max (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Math.max(0, Number(e.target.value)))}
                      className="w-full rounded-lg border border-gray-200 bg-[#F6F7F9] px-2 py-1 text-xs text-gray-900 outline-none focus:border-gray-400 font-mono"
                    />
                  </div>
                </div>

                {/* Quick Price Buttons */}
                <div className="mt-2.5 flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => { setMinPrice(0); setMaxPrice(5000); }}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[9.5px] font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    &lt; ₹5,000
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMinPrice(5000); setMaxPrice(25000); }}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[9.5px] font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    ₹5K - ₹25K
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMinPrice(25000); setMaxPrice(75000); }}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[9.5px] font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    ₹25K - ₹75K
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMinPrice(75000); setMaxPrice(250000); }}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[9.5px] font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    &gt; ₹75,000
                  </button>
                </div>
              </div>

              {/* 5. Customer Rating Filter */}
              <div className="border-t border-gray-100 pt-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">
                  5. Customer Rating
                </h3>
                <div className="space-y-1">
                  {[4.5, 4.0, 3.5].map((rating) => (
                    <label
                      key={rating}
                      className="flex cursor-pointer items-center justify-between text-xs text-gray-700 hover:text-black"
                    >
                      <div className="flex items-center gap-1.5">
                        <input
                          type="radio"
                          name="ratingFilter"
                          checked={minRating === rating}
                          onChange={() => setMinRating(minRating === rating ? 0 : rating)}
                          className="accent-[#111827] h-3.5 w-3.5"
                        />
                        <span className="font-medium">{rating}★ & above</span>
                      </div>
                      <span className="text-amber-500">★★★★</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 6. Discount & In-Stock Checkboxes */}
              <div className="border-t border-gray-100 pt-3.5 space-y-2">
                <label className="flex cursor-pointer items-center justify-between text-xs font-semibold text-gray-800">
                  <span>In Stock Only</span>
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

          {/* ================= MAIN PRODUCT CATALOG AREA ================= */}
          <section className="min-w-0">

            {/* Active Filter Badges Bar */}
            {activeFiltersCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-1.5 rounded-2xl border border-gray-200/80 bg-white p-3 text-xs shadow-2xs animate-fade-in">
                <span className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider mr-1">
                  Active Filters ({activeFiltersCount}):
                </span>

                {category !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1 text-[11px] font-bold text-amber-300 shadow-xs">
                    Dept: {category}
                    <button type="button" onClick={() => handleCategorySelect('All')} className="hover:text-white font-bold ml-0.5">✕</button>
                  </span>
                )}

                {selectedType !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-900 border border-amber-300">
                    Type: {selectedType}
                    <button type="button" onClick={() => handleTypeSelect('All')} className="hover:text-black font-bold ml-0.5">✕</button>
                  </span>
                )}

                {selectedBrand !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold text-gray-900 border border-gray-300">
                    Brand: {selectedBrand}
                    <button type="button" onClick={() => handleBrandSelect('All')} className="hover:text-black font-bold ml-0.5">✕</button>
                  </span>
                )}

                {search && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 border border-blue-200">
                    "{search}"
                    <button type="button" onClick={() => handleSearchChange('')} className="hover:text-black font-bold ml-0.5">✕</button>
                  </span>
                )}

                {(minPrice > 0 || maxPrice < 250000) && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-800 border border-gray-200 font-mono">
                    ₹{minPrice.toLocaleString('en-IN')} - ₹{maxPrice.toLocaleString('en-IN')}
                    <button type="button" onClick={() => { setMinPrice(0); setMaxPrice(250000); }} className="hover:text-black font-bold ml-0.5">✕</button>
                  </span>
                )}

                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-800 border border-amber-200">
                    {minRating}★+
                    <button type="button" onClick={() => setMinRating(0)} className="hover:text-black font-bold ml-0.5">✕</button>
                  </span>
                )}

                {inStockOnly && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                    In Stock
                    <button type="button" onClick={() => setInStockOnly(false)} className="hover:text-black font-bold ml-0.5">✕</button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="ml-auto text-xs font-bold text-[#B89758] hover:underline"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Product Listing Area */}
            {isFiltering ? (
              <div className={viewMode === 'grid'
                ? "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
                : "space-y-4"
              }>
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div className={viewMode === 'grid'
                ? "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
                : "space-y-4"
              }>
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    layout={viewMode}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search State */
              <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-xs">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-2xl">
                  🔍
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-950">
                  No matching products found
                </h3>
                <p className="mt-1.5 max-w-md text-xs sm:text-sm text-gray-500 leading-relaxed">
                  We couldn't find items matching your filter criteria in {category === 'All' ? 'our catalog' : category}. Try broadening your search or resetting active filters.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-5 rounded-full bg-[#111827] px-6 py-2.5 text-xs font-bold text-white hover:bg-black transition shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls & Item Progress Bar */}
            {totalItems > itemsPerPage && (
              <div className="mt-8 rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Progress Bar */}
                <div className="w-full sm:w-auto">
                  <div className="flex items-center justify-between sm:justify-start gap-2 text-xs font-medium text-gray-600 mb-1.5">
                    <span>
                      Showing <strong className="text-gray-950">{startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalItems)}</strong> of <strong className="text-gray-950">{totalItems}</strong> items
                    </span>
                  </div>
                  <div className="h-1.5 w-full sm:w-48 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-[#111827] transition-all duration-300 rounded-full"
                      style={{ width: `${Math.min(100, ((startIndex + itemsPerPage) / totalItems) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={effectivePage === 1}
                    onClick={() => handlePageChange(effectivePage - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isCurrent = pageNum === effectivePage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition ${isCurrent
                          ? 'bg-[#111827] text-white shadow-xs'
                          : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={effectivePage === totalPages}
                    onClick={() => handlePageChange(effectivePage + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    ›
                  </button>
                </div>

              </div>
            )}

          </section>

        </div>

        {/* ================= 6. RECENTLY VIEWED PRODUCTS CAROUSEL ================= */}
        {recentlyViewed.length > 0 && (
          <section className="mt-12 sm:mt-16 border-t border-gray-200/80 pt-8 sm:pt-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B89758]">
                  Personalized History
                </span>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-950">
                  Recently Viewed by You
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {recentlyViewed.slice(0, 4).map((product) => (
                <ProductCard
                  key={`rv-${product.id}`}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          </section>
        )}

        {/* ================= 7. TRUST & QUALITY ASSURANCE 4-PILLAR GRID ================= */}
        <section className="mt-14 sm:mt-20 rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#B89758]">
              The Krishna Accessories Promise
            </span>
            <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-gray-950">
              Why Discerning Shoppers Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 text-xl mb-3 shadow-xs">
                🛡️
              </div>
              <h3 className="text-sm font-bold text-gray-950">100% Genuine Guaranteed</h3>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                Direct authorized sourcing with original serial barcodes and official brand certificates.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-800 text-xl mb-3 shadow-xs">
                🚚
              </div>
              <h3 className="text-sm font-bold text-gray-950">Insured Rapid Courier</h3>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                Free express shipping with real-time transit telemetry and secure tamper-proof packaging.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 text-xl mb-3 shadow-xs">
                📜
              </div>
              <h3 className="text-sm font-bold text-gray-950">2-Year Brand Warranty</h3>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                Complete national manufacturer warranty valid at authorized service centers across India.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-800 text-xl mb-3 shadow-xs">
                💬
              </div>
              <h3 className="text-sm font-bold text-gray-950">24/7 Concierge Support</h3>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                Dedicated luxury advisory for product selection, order tracking, and after-sales support.
              </p>
            </div>

          </div>
        </section>

        {/* ================= 8. BUYER'S FREQUENTLY ASKED QUESTIONS (FAQ) ================= */}
        <section className="mt-12 sm:mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B89758]">
              Customer Care & Information
            </span>
            <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-gray-950">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = faqOpenIndex === idx;
              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-xs transition"
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-gray-900 hover:text-[#B89758]"
                  >
                    <span>{faq.q}</span>
                    <span className="ml-3 text-sm font-bold text-gray-400">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-gray-100 px-4 sm:px-5 pb-4 sm:pb-5 pt-2 text-xs text-gray-600 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= 9. VIP NEWSLETTER & EXCLUSIVE OFFERS ================= */}
        <section className="mt-14 sm:mt-20 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">
              Exclusive VIP Connoisseurs Club
            </span>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-white">
              Unlock 10% Off Your First Luxury Order
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-300">
              Subscribe to receive private preview access to limited edition timepieces, exclusive discount vouchers, and new luxury arrival drops.
            </p>

            {newsletterSubscribed ? (
              <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 px-5 py-3 text-xs font-bold text-emerald-300 animate-slide-up">
                <span>✓</span>
                <span>Thank you! Your exclusive 10% voucher code <strong>KRISHNA10</strong> has been sent.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs text-white placeholder:text-gray-400 outline-none backdrop-blur-md focus:border-amber-300 focus:bg-white/15"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-amber-400 px-6 py-2.5 text-xs font-bold text-gray-950 transition hover:bg-amber-300 active:scale-95 shadow-md shrink-0"
                >
                  Join VIP Club
                </button>
              </form>
            )}
          </div>
        </section>

      </main>

      {/* ================= MOBILE SLIDE-OVER FILTER DRAWER ================= */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileFilters(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          {/* Slide Sheet */}
          <div className="relative w-full max-w-xs sm:max-w-sm h-full bg-white shadow-2xl flex flex-col justify-between z-50 animate-slide-up">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-950">Filters & Refinements</span>
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

            {/* Drawer Body Scroll */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
              
              {/* Category */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">Departments</h3>
                <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const count = cat === 'All'
                      ? products.length
                      : products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
                    const isSelected = category.toLowerCase() === cat.toLowerCase();

                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${isSelected
                          ? 'bg-[#111827] font-bold text-amber-200'
                          : 'text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        <span className="truncate">{cat}</span>
                        <span className="text-[10px] opacity-75">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product Types */}
              {dynamicProductTypes.length > 1 && (
                <div className="border-t border-gray-100 pt-3.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">Product Types</h3>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {dynamicProductTypes.map((type) => (
                      <label
                        key={type}
                        onClick={() => handleTypeSelect(type)}
                        className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${selectedType.toLowerCase() === type.toLowerCase()
                          ? 'bg-gray-100 text-gray-950 font-bold'
                          : 'text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="mobProductType"
                            checked={selectedType.toLowerCase() === type.toLowerCase()}
                            onChange={() => handleTypeSelect(type)}
                            className="accent-[#111827] h-3.5 w-3.5"
                          />
                          <span>{type}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands */}
              <div className="border-t border-gray-100 pt-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">Brands</h3>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {dynamicBrands.map((brand) => (
                    <label
                      key={brand}
                      onClick={() => handleBrandSelect(brand)}
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${selectedBrand.toLowerCase() === brand.toLowerCase()
                        ? 'bg-gray-100 text-gray-950 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="mobBrand"
                          checked={selectedBrand.toLowerCase() === brand.toLowerCase()}
                          onChange={() => handleBrandSelect(brand)}
                          className="accent-[#111827] h-3.5 w-3.5"
                        />
                        <span>{brand}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="border-t border-gray-100 pt-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">Price Range (₹)</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-gray-400 block mb-0.5">Min</span>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
                      className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block mb-0.5">Max</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Math.max(0, Number(e.target.value)))}
                      className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* In Stock */}
              <div className="border-t border-gray-100 pt-3.5">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">In Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 accent-[#111827]"
                  />
                </label>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="border-t border-gray-200 p-3.5 bg-gray-50 flex items-center gap-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex-1 rounded-full border border-gray-300 bg-white py-2 text-xs font-bold text-gray-700 hover:bg-gray-100"
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

      <Footer />
    </div>
  );
}