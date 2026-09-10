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
} from '../utils/productStore';

import { getCurrentUser } from '../utils/auth';
import { addToCart } from '../utils/cart';

import {
  ShieldCheckIcon,
  TruckIcon,
  SparklesIcon,
  CheckCircleIcon,
} from '../components/Icons';

const MAX_PRICE = 250000;
const DEFAULT_PAGE_SIZE = 12;

export default function Shop() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const productsTopRef = useRef(null);

  /* =========================================================
     URL PARAMS
  ========================================================= */

  const urlCategory = searchParams.get('category') || 'All';

  const urlSubcategory =
    searchParams.get('subcategory') ||
    searchParams.get('type') ||
    'All';

  const urlBrand = searchParams.get('brand') || 'All';

  const urlSearch = searchParams.get('search') || '';

  const urlMinPrice = searchParams.get('minPrice')
    ? Number(searchParams.get('minPrice'))
    : 0;

  const urlMaxPrice = searchParams.get('maxPrice')
    ? Number(searchParams.get('maxPrice'))
    : MAX_PRICE;

  const urlSort = searchParams.get('sort') || 'featured';

  const urlRating = searchParams.get('rating')
    ? Number(searchParams.get('rating'))
    : 0;

  const urlDiscount = searchParams.get('discount')
    ? Number(searchParams.get('discount'))
    : 0;

  const urlInStock = searchParams.get('inStock') === 'true';

  const urlPage = searchParams.get('page')
    ? Math.max(1, Number(searchParams.get('page')))
    : 1;

  /* =========================================================
     STATE
  ========================================================= */

  const [products, setProducts] = useState(() => getProducts());

  const [categories, setCategories] = useState(() => [
    'All',
    ...getCategories(),
  ]);

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

  const [viewMode, setViewMode] = useState('grid3');

  const [currentPage, setCurrentPage] = useState(urlPage);

  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [mobileFilters, setMobileFilters] = useState(false);

  const [brandSearchQuery, setBrandSearchQuery] = useState('');

  const [toastMessage, setToastMessage] = useState('');

  const [faqOpen, setFaqOpen] = useState(null);

  /* =========================================================
     SYNC PRODUCT DATA
  ========================================================= */

  useEffect(() => {
    const handleProductsUpdate = () => {
      setProducts(getProducts());

      setCategories([
        'All',
        ...getCategories(),
      ]);
    };

    window.addEventListener(
      'productsUpdated',
      handleProductsUpdate
    );

    return () => {
      window.removeEventListener(
        'productsUpdated',
        handleProductsUpdate
      );
    };
  }, []);

  /* =========================================================
     SYNC STATE FROM URL
  ========================================================= */

  useEffect(() => {
    setCategory(urlCategory);
    setSubcategory(urlSubcategory);
    setSelectedBrand(urlBrand);
    setSearch(urlSearch);

    setMinPrice(urlMinPrice);
    setMaxPrice(urlMaxPrice);

    setMinRating(urlRating);
    setMinDiscount(urlDiscount);

    setInStockOnly(urlInStock);
    setSort(urlSort);

    setCurrentPage(urlPage);
  }, [
    urlCategory,
    urlSubcategory,
    urlBrand,
    urlSearch,
    urlMinPrice,
    urlMaxPrice,
    urlRating,
    urlDiscount,
    urlInStock,
    urlSort,
    urlPage,
  ]);

  /* =========================================================
     NORMALIZED HELPERS
  ========================================================= */

  const normalize = (value) =>
    String(value || '').trim().toLowerCase();

  const getProductDiscount = (product) => {
    if (Number(product?.discount) > 0) {
      return Number(product.discount);
    }

    if (
      Number(product?.oldPrice) > Number(product?.price) &&
      Number(product?.oldPrice) > 0
    ) {
      return Math.round(
        ((Number(product.oldPrice) - Number(product.price)) /
          Number(product.oldPrice)) *
          100
      );
    }

    return 0;
  };

  /* =========================================================
     DYNAMIC CATEGORY DATA
  ========================================================= */

  const dynamicBrands = useMemo(() => {
    const list = getBrandsByCategory(category) || [];

    return [
      'All',
      ...list.filter(
        (brand) => normalize(brand) !== 'all'
      ),
    ];
  }, [category, products]);

  const dynamicSubcategories = useMemo(() => {
    const list =
      getSubcategoriesByCategory(category) || [];

    return [
      'All',
      ...list.filter(
        (sub) => normalize(sub) !== 'all'
      ),
    ];
  }, [category, products]);

  /* =========================================================
     BRAND SEARCH
  ========================================================= */

  const filteredBrandList = useMemo(() => {
    if (!brandSearchQuery.trim()) {
      return dynamicBrands;
    }

    const query = normalize(brandSearchQuery);

    return dynamicBrands.filter(
      (brand) =>
        normalize(brand).includes(query) ||
        normalize(brand) === 'all'
    );
  }, [
    dynamicBrands,
    brandSearchQuery,
  ]);

  /* =========================================================
     URL UPDATE HELPER
  ========================================================= */

  const updateUrlParams = (updates = {}) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === null ||
        value === undefined ||
        value === '' ||
        value === 'All' ||
        value === 0 ||
        value === false
      ) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    setSearchParams(params);
  };

  /* =========================================================
     CATEGORY HANDLERS
  ========================================================= */

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setSubcategory('All');
    setSelectedBrand('All');

    setCurrentPage(1);

    setBrandSearchQuery('');

    updateUrlParams({
      category: selectedCategory,
      subcategory: 'All',
      type: 'All',
      brand: 'All',
      page: 1,
    });
  };

  /* =========================================================
     SUBCATEGORY HANDLER
  ========================================================= */

  const handleSubcategorySelect = (selectedSubcategory) => {
    setSubcategory(selectedSubcategory);

    setCurrentPage(1);

    updateUrlParams({
      subcategory: selectedSubcategory,
      type: 'All',
      page: 1,
    });
  };

  /* =========================================================
     BRAND HANDLER
  ========================================================= */

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);

    setCurrentPage(1);

    updateUrlParams({
      brand,
      page: 1,
    });
  };

  /* =========================================================
     SORT HANDLER
  ========================================================= */

  const handleSortChange = (newSort) => {
    setSort(newSort);

    setCurrentPage(1);

    updateUrlParams({
      sort: newSort,
      page: 1,
    });
  };

  /* =========================================================
     SEARCH HANDLER
  ========================================================= */

  const handleSearchChange = (value) => {
    setSearch(value);

    setCurrentPage(1);

    updateUrlParams({
      search: value,
      page: 1,
    });
  };

  /* =========================================================
     PRICE HANDLERS
  ========================================================= */

  const handleMinPriceChange = (value) => {
    const nextValue = Math.max(
      0,
      Number(value) || 0
    );

    setMinPrice(nextValue);
    setCurrentPage(1);

    updateUrlParams({
      minPrice: nextValue,
      page: 1,
    });
  };

  const handleMaxPriceChange = (value) => {
    const nextValue = Math.max(
      0,
      Number(value) || 0
    );

    setMaxPrice(nextValue);
    setCurrentPage(1);

    updateUrlParams({
      maxPrice: nextValue,
      page: 1,
    });
  };

  /* =========================================================
     RATING HANDLER
  ========================================================= */

  const handleRatingChange = (rating) => {
    setMinRating(rating);

    setCurrentPage(1);

    updateUrlParams({
      rating,
      page: 1,
    });
  };

  /* =========================================================
     DISCOUNT HANDLER
  ========================================================= */

  const handleDiscountChange = (discount) => {
    const nextValue =
      minDiscount === discount ? 0 : discount;

    setMinDiscount(nextValue);

    setCurrentPage(1);

    updateUrlParams({
      discount: nextValue,
      page: 1,
    });
  };

  /* =========================================================
     STOCK HANDLER
  ========================================================= */

  const handleStockChange = (checked) => {
    setInStockOnly(checked);

    setCurrentPage(1);

    updateUrlParams({
      inStock: checked,
      page: 1,
    });
  };

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearAllFilters = () => {
    setCategory('All');
    setSubcategory('All');
    setSelectedBrand('All');

    setSearch('');

    setMinPrice(0);
    setMaxPrice(MAX_PRICE);

    setMinRating(0);
    setMinDiscount(0);

    setInStockOnly(false);

    setSort('featured');

    setCurrentPage(1);

    setBrandSearchQuery('');

    setSearchParams({});
  };

  /* =========================================================
     FILTER + SORT PRODUCTS
     
     IMPORTANT:
     Category -> Subcategory -> Brand
     are applied strictly.
  ========================================================= */

  const filteredProducts = useMemo(() => {
    let list = [...products];

    /* CATEGORY */
    if (category !== 'All') {
      const categoryValue = normalize(category);

      list = list.filter(
        (product) =>
          normalize(product.category) ===
          categoryValue
      );
    }

    /* PRODUCT TYPE / SUBCATEGORY */
    if (subcategory !== 'All') {
      const subcategoryValue =
        normalize(subcategory);

      list = list.filter(
        (product) =>
          normalize(product.subcategory) ===
          subcategoryValue
      );
    }

    /* BRAND */
    if (selectedBrand !== 'All') {
      const brandValue =
        normalize(selectedBrand);

      list = list.filter(
        (product) =>
          normalize(product.brand) ===
          brandValue
      );
    }

    /* PRICE */
    list = list.filter((product) => {
      const price = Number(product.price) || 0;

      return (
        price >= minPrice &&
        price <= maxPrice
      );
    });

    /* RATING */
    if (minRating > 0) {
      list = list.filter(
        (product) =>
          Number(product.rating || 0) >=
          minRating
      );
    }

    /* DISCOUNT */
    if (minDiscount > 0) {
      list = list.filter(
        (product) =>
          getProductDiscount(product) >=
          minDiscount
      );
    }

    /* STOCK */
    if (inStockOnly) {
      list = list.filter(
        (product) =>
          Number(product.stock || 0) > 0
      );
    }

    /* SEARCH */
    if (search.trim()) {
      const query =
        normalize(search);

      list = list.filter((product) => {
        const searchableText = [
          product.name,
          product.brand,
          product.category,
          product.subcategory,
          product.sku,
          product.description,
        ]
          .map(normalize)
          .join(' ');

        return searchableText.includes(query);
      });
    }

    /* SORT */
    if (sort === 'price-low') {
      list.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sort === 'price-high') {
      list.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sort === 'rating') {
      list.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
    }

    if (sort === 'discount') {
      list.sort(
        (a, b) =>
          getProductDiscount(b) -
          getProductDiscount(a)
      );
    }

    if (sort === 'newest') {
      list.sort(
        (a, b) =>
          Number(b.id || 0) -
          Number(a.id || 0)
      );
    }

    if (sort === 'alpha-asc') {
      list.sort((a, b) =>
        String(a.name || '').localeCompare(
          String(b.name || '')
        )
      );
    }

    return list;
  }, [
    products,
    category,
    subcategory,
    selectedBrand,
    minPrice,
    maxPrice,
    minRating,
    minDiscount,
    inStockOnly,
    search,
    sort,
  ]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalItems =
    filteredProducts.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  );

  const effectivePage = Math.min(
    Math.max(currentPage, 1),
    totalPages
  );

  const startIndex =
    (effectivePage - 1) * pageSize;

  const endIndex = Math.min(
    startIndex + pageSize,
    totalItems
  );

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      startIndex,
      endIndex
    );
  }, [
    filteredProducts,
    startIndex,
    endIndex,
  ]);

  /* =========================================================
     VISIBLE PAGE NUMBERS
  ========================================================= */

  const visiblePageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    const pages = [];

    pages.push(1);

    if (effectivePage > 4) {
      pages.push('...');
    }

    const start = Math.max(
      2,
      effectivePage - 1
    );

    const end = Math.min(
      totalPages - 1,
      effectivePage + 1
    );

    for (
      let page = start;
      page <= end;
      page++
    ) {
      pages.push(page);
    }

    if (effectivePage < totalPages - 3) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  }, [
    totalPages,
    effectivePage,
  ]);

  /* =========================================================
     PAGE CHANGE
  ========================================================= */

  const handlePageChange = (newPage) => {
    const safePage = Math.min(
      Math.max(newPage, 1),
      totalPages
    );

    setCurrentPage(safePage);

    updateUrlParams({
      page: safePage,
    });

    window.setTimeout(() => {
      if (productsTopRef.current) {
        productsTopRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 50);
  };

  /* =========================================================
     PAGE SIZE
  ========================================================= */

  const handlePageSizeChange = (size) => {
    const nextSize = Number(size);

    setPageSize(nextSize);
    setCurrentPage(1);

    updateUrlParams({
      page: 1,
    });
  };

  /* =========================================================
     CART
  ========================================================= */

  const handleAddToCart = (product) => {
    if (!getCurrentUser()) {
      navigate('/login');
      return;
    }

    addToCart(
      product,
      1,
      product.colors?.[0] || '',
      product.variants?.[0] || ''
    );

    setToastMessage(
      `✓ Added "${product.name}" to your bag`
    );

    window.setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  /* =========================================================
     BUY NOW
  ========================================================= */

  const handleBuyNow = (product) => {
    if (!getCurrentUser()) {
      navigate('/login');
      return;
    }

    addToCart(
      product,
      1,
      product.colors?.[0] || '',
      product.variants?.[0] || ''
    );

    navigate('/checkout');
  };

  /* =========================================================
     RECOMMENDATIONS
     
     IMPORTANT:
     Recommendations remain relevant to the
     currently selected category/subcategory/brand.
  ========================================================= */

  const recommendedProducts = useMemo(() => {
    let candidates = products.filter(
      (product) =>
        !paginatedProducts.some(
          (visibleProduct) =>
            String(visibleProduct.id) ===
            String(product.id)
        )
    );

    /* Category relevance */
    if (category !== 'All') {
      candidates = candidates.filter(
        (product) =>
          normalize(product.category) ===
          normalize(category)
      );
    }

    /* Subcategory relevance */
    if (subcategory !== 'All') {
      const subcategoryProducts =
        candidates.filter(
          (product) =>
            normalize(product.subcategory) ===
            normalize(subcategory)
        );

      if (subcategoryProducts.length > 0) {
        candidates =
          subcategoryProducts;
      }
    }

    /* Brand relevance */
    if (selectedBrand !== 'All') {
      const brandProducts =
        candidates.filter(
          (product) =>
            normalize(product.brand) ===
            normalize(selectedBrand)
        );

      if (brandProducts.length > 0) {
        candidates = brandProducts;
      }
    }

    return candidates.slice(0, 4);
  }, [
    products,
    category,
    subcategory,
    selectedBrand,
    paginatedProducts,
  ]);

  /* =========================================================
     ACTIVE FILTER CHECK
  ========================================================= */

  const hasActiveFilters =
    category !== 'All' ||
    subcategory !== 'All' ||
    selectedBrand !== 'All' ||
    Boolean(search.trim()) ||
    minPrice > 0 ||
    maxPrice < MAX_PRICE ||
    minRating > 0 ||
    minDiscount > 0 ||
    inStockOnly;

  /* =========================================================
     CATEGORY DESCRIPTION
  ========================================================= */

  const categoryDescription =
    category === 'Watches'
      ? 'Precision automatic timepieces, Swiss chronographs, and certified luxury editions with international warranty.'
      : category === 'Bags & Wallets'
      ? 'Handcrafted vegetable-tanned leather briefcases, travel backpacks, and designer totes.'
      : category === 'Shoes'
      ? 'High-performance athletic runners, iconic basketball high-tops, and rugged trekking boots.'
      : category === 'Mobiles'
      ? 'Next-generation smartphones, professional camera systems, and certified genuine devices.'
      : category === 'All'
      ? 'Explore our complete collection of authentic branded products, carefully organized by category, brand, and product type.'
      : `Explore our ${category} collection featuring authentic branded products with reliable delivery and warranty support.`;

  /* =========================================================
     FAQ DATA
  ========================================================= */

  const faqItems = [
    {
      q: 'How do I verify the authenticity of products purchased from Krishna Accessories?',
      a: 'All products should be sourced and supplied with applicable manufacturer documentation, serial numbers, packaging, and warranty information. Product-specific authenticity and warranty details are available according to the selected brand and product.',
    },
    {
      q: 'What are the delivery timelines and is the parcel insured during transit?',
      a: 'Delivery timelines depend on your location, product availability, and shipping method selected during checkout. Eligible orders can be shipped using secure delivery partners with applicable transit protection.',
    },
    {
      q: 'How does the official brand warranty and after-sales service work?',
      a: 'Warranty coverage depends on the individual product and brand. Please check the warranty information displayed on the product page or contact customer support for product-specific assistance.',
    },
    {
      q: 'What payment modes and Cash on Delivery options are available?',
      a: 'Available payment methods depend on the checkout configuration. Customers may see options such as UPI, cards, net banking, and COD where supported for the selected delivery location.',
    },
    {
      q: 'Can I visit the physical showroom to inspect and try products in Mumbai?',
      a: 'If showroom visits are supported, please use the current contact information displayed on the website or contact the store before visiting to confirm availability and operating hours.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 selection:bg-amber-100 selection:text-amber-900">

      <Navbar />

      {/* =====================================================
          TOAST
      ====================================================== */}

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[80] flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-900 shadow-xl animate-slide-up">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">
            ✓
          </span>

          <span>{toastMessage}</span>

          <Link
            to="/cart"
            className="ml-1.5 rounded-full bg-[#111827] px-3 py-1 text-[10.5px] font-semibold text-white transition hover:bg-black"
          >
            View Bag
          </Link>
        </div>
      )}

      {/* =====================================================
          PROMOTIONAL STRIP
      ====================================================== */}

      <section className="border-b border-amber-500/20 bg-gradient-to-r from-gray-950 via-slate-900 to-gray-950 px-4 py-2.5 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs sm:flex-row">

          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-gray-950">
              ★
            </span>

            <span className="text-gray-300">
              <strong className="font-semibold text-amber-300">
                Krishna Privé Offer:
              </strong>{' '}
              Enjoy 10% instant discount on orders above ₹1,000 with coupon{' '}
              <span className="rounded border border-white/15 bg-white/10 px-1.5 py-0.5 font-mono text-white">
                KRISHNA10
              </span>
            </span>
          </div>

          <span className="hidden text-[11px] text-gray-400 md:inline">
            100% Certified Authentic • Official Warranty Included
          </span>
        </div>
      </section>

      {/* =====================================================
          SHOP HEADER
      ====================================================== */}

      <section className="border-b border-gray-200/80 bg-white pt-5 pb-4 sm:pt-7 sm:pb-6">

        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="mb-3 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-[11px] text-gray-400 no-scrollbar">

            <Link
              to="/"
              className="transition hover:text-gray-900"
            >
              Home
            </Link>

            <span>/</span>

            <button
              type="button"
              onClick={clearAllFilters}
              className={`transition hover:text-gray-900 ${
                category === 'All'
                  ? 'font-bold text-gray-950'
                  : ''
              }`}
            >
              Shop
            </button>

            {category !== 'All' && (
              <>
                <span>/</span>

                <span className="font-semibold text-gray-900">
                  {category}
                </span>
              </>
            )}

            {subcategory !== 'All' && (
              <>
                <span>/</span>

                <span className="font-semibold text-amber-700">
                  {subcategory}
                </span>
              </>
            )}

            {selectedBrand !== 'All' && (
              <>
                <span>/</span>

                <span className="font-medium text-gray-700">
                  {selectedBrand}
                </span>
              </>
            )}
          </nav>

          {/* Main Heading */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div className="min-w-0">

              <span className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#B89758]">
                {category === 'All'
                  ? 'Complete E-Commerce Collection'
                  : `Certified ${category}`}
              </span>

              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
                {category === 'All'
                  ? 'Explore All Products'
                  : `${category} Collection`}
              </h1>

              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-gray-500">
                {categoryDescription}
              </p>

            </div>

            {/* Category Chips */}
            <div className="flex max-w-full items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap">

              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    handleCategorySelect(cat)
                  }
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    category === cat
                      ? 'border-slate-900 bg-[#0F172A] text-amber-300 shadow-sm ring-2 ring-amber-400/20'
                      : 'border-transparent bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              ))}

            </div>
          </div>

          {/* Product Types */}
          {dynamicSubcategories.length > 1 && (
            <div className="mt-5 flex items-center gap-2 overflow-x-auto border-t border-gray-100 pt-3.5 no-scrollbar">

              <span className="mr-1 whitespace-nowrap text-[10.5px] font-bold uppercase tracking-wider text-gray-400">
                Product Types:
              </span>

              {dynamicSubcategories.map(
                (sub) => {
                  const selected =
                    subcategory === sub;

                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() =>
                        handleSubcategorySelect(
                          sub
                        )
                      }
                      className={`shrink-0 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition ${
                        selected
                          ? 'border-amber-300/80 bg-amber-100/90 font-bold text-amber-950 shadow-sm'
                          : 'border-gray-200/80 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {sub}
                    </button>
                  );
                }
              )}

            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          MAIN SHOP AREA
      ====================================================== */}

      <main
        ref={productsTopRef}
        className="mx-auto max-w-7xl px-2.5 py-4 sm:px-6 sm:py-7 lg:px-8"
      >

        {/* ===================================================
            TOP CONTROL BAR
        ==================================================== */}

        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm sm:p-4 lg:mb-6 lg:flex-row lg:items-center lg:justify-between">

          {/* Search */}
          <div className="relative w-full max-w-xl">

            <input
              type="text"
              value={search}
              onChange={(e) =>
                handleSearchChange(
                  e.target.value
                )
              }
              placeholder={`Search ${
                category === 'All'
                  ? 'products'
                  : category.toLowerCase()
              }, brands, product types, SKU...`}
              className="w-full rounded-full border border-gray-200 bg-[#F4F4F6] py-2.5 pl-10 pr-9 text-xs text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
            />

            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              🔍
            </span>

            {search && (
              <button
                type="button"
                onClick={() =>
                  handleSearchChange('')
                }
                className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400 transition hover:text-black"
              >
                ✕
              </button>
            )}

          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 lg:justify-end">

            {/* Count */}
            <span className="hidden whitespace-nowrap text-xs font-semibold text-gray-500 sm:inline">
              Showing{' '}
              <strong className="text-gray-900">
                {totalItems === 0
                  ? 0
                  : startIndex + 1}
                –
                {endIndex}
              </strong>{' '}
              of{' '}
              <strong className="text-gray-900">
                {totalItems}
              </strong>
            </span>

            {/* View Modes */}
            <div className="hidden items-center rounded-xl border border-gray-200 bg-[#F4F4F6] p-0.5 md:flex">

              <button
                type="button"
                onClick={() =>
                  setViewMode('grid3')
                }
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                  viewMode === 'grid3'
                    ? 'bg-white text-gray-950 shadow-sm'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                ⊞ 3-Grid
              </button>

              <button
                type="button"
                onClick={() =>
                  setViewMode('grid4')
                }
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                  viewMode === 'grid4'
                    ? 'bg-white text-gray-950 shadow-sm'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                ▦ 4-Grid
              </button>

              <button
                type="button"
                onClick={() =>
                  setViewMode('list')
                }
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-950 shadow-sm'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                ☰ List
              </button>

            </div>

            {/* Mobile Filters */}
            <button
              type="button"
              onClick={() =>
                setMobileFilters(true)
              }
              className="flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-[#F4F4F6] px-3.5 py-2 text-xs font-bold text-gray-800 transition hover:bg-gray-200 lg:hidden"
            >
              ⚙️ Filters

              {hasActiveFilters && (
                <span className="h-2 w-2 rounded-full bg-amber-500" />
              )}
            </button>

            {/* Sort */}
            <select
              id="shop-sort-select"
              value={sort}
              onChange={(e) =>
                handleSortChange(
                  e.target.value
                )
              }
              className="w-[190px] rounded-full border border-gray-200 bg-[#F4F4F6] px-3 py-2 text-xs font-medium text-gray-800 outline-none transition focus:border-gray-400"
            >
              <option value="featured">
                Featured / Best Match
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="rating">
                Highest Rated
              </option>

              <option value="discount">
                Biggest Discount
              </option>

              <option value="newest">
                New Arrivals
              </option>

              <option value="alpha-asc">
                Alphabetical: A to Z
              </option>
            </select>

          </div>
        </div>

        {/* ===================================================
            MOBILE FILTER DRAWER
        ==================================================== */}

        {mobileFilters && (
          <div className="fixed inset-0 z-[70] lg:hidden">

            <div
              onClick={() =>
                setMobileFilters(false)
              }
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <div className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-4">

                <div>
                  <h2 className="text-sm font-bold text-gray-950">
                    Filters & Options
                  </h2>

                  <span className="mt-0.5 block text-[10px] text-gray-500">
                    {filteredProducts.length}{' '}
                    matching products
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMobileFilters(false)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700"
                >
                  ✕
                </button>

              </div>

              {/* Filter Content */}
              <div className="flex-1 space-y-5 overflow-y-auto p-4">

                {/* Category */}
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-950">
                    Categories
                  </h3>

                  <div className="max-h-44 space-y-1 overflow-y-auto">

                    {categories.map((cat) => {
                      const count =
                        cat === 'All'
                          ? products.length
                          : products.filter(
                              (product) =>
                                normalize(
                                  product.category
                                ) ===
                                normalize(cat)
                            ).length;

                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() =>
                            handleCategorySelect(
                              cat
                            )
                          }
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition ${
                            category === cat
                              ? 'bg-[#0F172A] font-semibold text-amber-200'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span>
                            {cat}
                          </span>

                          <span className="text-[10px] opacity-70">
                            ({count})
                          </span>
                        </button>
                      );
                    })}

                  </div>
                </div>

                {/* Product Type */}
                {dynamicSubcategories.length >
                  1 && (
                  <div className="border-t border-gray-100 pt-4">

                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-950">
                      Product Type
                    </h3>

                    <div className="space-y-1">

                      {dynamicSubcategories.map(
                        (sub) => (
                          <button
                            key={sub}
                            type="button"
                            onClick={() =>
                              handleSubcategorySelect(
                                sub
                              )
                            }
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs ${
                              subcategory === sub
                                ? 'bg-amber-100 font-bold text-amber-950'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {sub}
                          </button>
                        )
                      )}

                    </div>
                  </div>
                )}

                {/* Brand */}
                <div className="border-t border-gray-100 pt-4">

                  <div className="mb-2 flex items-center justify-between">

                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950">
                      Brands
                    </h3>

                    {selectedBrand !== 'All' && (
                      <button
                        type="button"
                        onClick={() =>
                          handleBrandSelect(
                            'All'
                          )
                        }
                        className="text-[10px] font-semibold text-[#B89758]"
                      >
                        Clear
                      </button>
                    )}

                  </div>

                  {dynamicBrands.length > 6 && (
                    <input
                      type="text"
                      value={brandSearchQuery}
                      onChange={(e) =>
                        setBrandSearchQuery(
                          e.target.value
                        )
                      }
                      placeholder="Search brands..."
                      className="mb-2 w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-3 py-2 text-xs outline-none focus:border-gray-400"
                    />
                  )}

                  <div className="max-h-40 space-y-1 overflow-y-auto">

                    {filteredBrandList.map(
                      (brand) => (
                        <label
                          key={brand}
                          className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs ${
                            selectedBrand ===
                            brand
                              ? 'bg-gray-100 font-semibold text-gray-950'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span className="flex items-center gap-2">

                            <input
                              type="radio"
                              name="mobileBrand"
                              checked={
                                selectedBrand ===
                                brand
                              }
                              onChange={() =>
                                handleBrandSelect(
                                  brand
                                )
                              }
                              className="h-3.5 w-3.5 accent-[#111827]"
                            />

                            {brand}

                          </span>
                        </label>
                      )
                    )}

                  </div>
                </div>

                {/* Price */}
                <div className="border-t border-gray-100 pt-4">

                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-950">
                    Price Range
                  </h3>

                  <div className="grid grid-cols-2 gap-2">

                    <div>
                      <span className="mb-1 block text-[9px] uppercase text-gray-400">
                        Minimum
                      </span>

                      <input
                        type="number"
                        min="0"
                        value={minPrice}
                        onChange={(e) =>
                          handleMinPriceChange(
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-2.5 py-2 text-xs outline-none focus:border-gray-400"
                      />
                    </div>

                    <div>
                      <span className="mb-1 block text-[9px] uppercase text-gray-400">
                        Maximum
                      </span>

                      <input
                        type="number"
                        min="0"
                        value={maxPrice}
                        onChange={(e) =>
                          handleMaxPriceChange(
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-2.5 py-2 text-xs outline-none focus:border-gray-400"
                      />
                    </div>

                  </div>
                </div>

                {/* Rating */}
                <div className="border-t border-gray-100 pt-4">

                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-950">
                    Customer Rating
                  </h3>

                  <div className="space-y-1">

                    {[4.5, 4, 3].map(
                      (rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() =>
                            handleRatingChange(
                              minRating ===
                                rating
                                ? 0
                                : rating
                            )
                          }
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs ${
                            minRating === rating
                              ? 'bg-amber-50 font-bold text-amber-900'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span>
                            ★ {rating} & Above
                          </span>

                          <span className="text-[10px] text-gray-400">
                            (
                            {
                              products.filter(
                                (product) =>
                                  (category ===
                                    'All' ||
                                    normalize(
                                      product.category
                                    ) ===
                                      normalize(
                                        category
                                      )) &&
                                  Number(
                                    product.rating ||
                                      0
                                  ) >= rating
                              ).length
                            }
                            )
                          </span>
                        </button>
                      )
                    )}

                  </div>
                </div>

                {/* Discount */}
                <div className="border-t border-gray-100 pt-4">

                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-950">
                    Discount Offers
                  </h3>

                  <div className="flex flex-wrap gap-2">

                    {[10, 20, 30, 50].map(
                      (discount) => (
                        <button
                          key={discount}
                          type="button"
                          onClick={() =>
                            handleDiscountChange(
                              discount
                            )
                          }
                          className={`rounded-full border px-3 py-1 text-[10px] font-semibold ${
                            minDiscount ===
                            discount
                              ? 'border-gray-900 bg-gray-900 text-white'
                              : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {discount}%+ Off
                        </button>
                      )
                    )}

                  </div>
                </div>

                {/* Stock */}
                <div className="border-t border-gray-100 pt-4">

                  <label className="flex cursor-pointer items-center justify-between">

                    <span className="text-xs font-semibold text-gray-800">
                      In Stock Only
                    </span>

                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) =>
                        handleStockChange(
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 accent-[#111827]"
                    />

                  </label>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="flex gap-2 border-t border-gray-200 bg-gray-50 p-3">

                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="flex-1 rounded-full border border-gray-300 bg-white py-2.5 text-xs font-semibold text-gray-700"
                >
                  Clear All
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMobileFilters(false)
                  }
                  className="flex-1 rounded-full bg-[#111827] py-2.5 text-xs font-bold text-white"
                >
                  Show {filteredProducts.length}{' '}
                  Items
                </button>

              </div>

            </div>
          </div>
        )}

        {/* ===================================================
            CATALOG LAYOUT
        ==================================================== */}

        <div className="grid gap-6 lg:grid-cols-[245px_minmax(0,1fr)]">

          {/* =================================================
              DESKTOP SIDEBAR
          ================================================== */}

          <aside className="hidden lg:block">

            <div className="sticky top-20 space-y-5 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">

              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">

                <div className="flex items-center gap-2">

                  <span className="text-xs font-bold uppercase tracking-wider text-gray-950">
                    Shop Filters
                  </span>

                  <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[9.5px] font-bold text-gray-600">
                    {filteredProducts.length}
                  </span>

                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-[10.5px] font-semibold text-[#B89758] hover:underline"
                  >
                    Reset All
                  </button>
                )}

              </div>

              {/* CATEGORY */}
              <div>

                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-950">
                  Category
                </h3>

                <div className="max-h-48 space-y-0.5 overflow-y-auto pr-1">

                  {categories.map((cat) => {

                    const count =
                      cat === 'All'
                        ? products.length
                        : products.filter(
                            (product) =>
                              normalize(
                                product.category
                              ) ===
                              normalize(cat)
                          ).length;

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() =>
                          handleCategorySelect(
                            cat
                          )
                        }
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
                          category === cat
                            ? 'bg-[#0F172A] font-semibold text-amber-200'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                        }`}
                      >
                        <span className="truncate">
                          {cat}
                        </span>

                        <span className="text-[9.5px] opacity-70">
                          ({count})
                        </span>
                      </button>
                    );
                  })}

                </div>
              </div>

              {/* PRODUCT TYPE */}
              {dynamicSubcategories.length >
                1 && (
                <div className="border-t border-gray-100 pt-4">

                  <div className="mb-2 flex items-center justify-between">

                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950">
                      Product Type
                    </h3>

                    {subcategory !== 'All' && (
                      <button
                        type="button"
                        onClick={() =>
                          handleSubcategorySelect(
                            'All'
                          )
                        }
                        className="text-[10px] font-semibold text-[#B89758] hover:underline"
                      >
                        Clear
                      </button>
                    )}

                  </div>

                  <div className="max-h-36 space-y-0.5 overflow-y-auto">

                    {dynamicSubcategories.map(
                      (sub) => {

                        const selected =
                          subcategory === sub;

                        const count =
                          sub === 'All'
                            ? products.filter(
                                (product) =>
                                  category ===
                                    'All' ||
                                  normalize(
                                    product.category
                                  ) ===
                                    normalize(
                                      category
                                    )
                              ).length
                            : products.filter(
                                (product) =>
                                  (category ===
                                    'All' ||
                                    normalize(
                                      product.category
                                    ) ===
                                      normalize(
                                        category
                                      )) &&
                                  normalize(
                                    product.subcategory
                                  ) ===
                                    normalize(sub)
                              ).length;

                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() =>
                              handleSubcategorySelect(
                                sub
                              )
                            }
                            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
                              selected
                                ? 'border border-amber-300/70 bg-amber-100 font-bold text-amber-950'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                            }`}
                          >
                            <span className="truncate">
                              {sub}
                            </span>

                            <span className="text-[9.5px] text-gray-400">
                              ({count})
                            </span>
                          </button>
                        );
                      }
                    )}

                  </div>
                </div>
              )}

              {/* BRANDS */}
              <div className="border-t border-gray-100 pt-4">

                <div className="mb-2 flex items-center justify-between">

                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950">
                    Brands
                  </h3>

                  {selectedBrand !==
                    'All' && (
                    <button
                      type="button"
                      onClick={() =>
                        handleBrandSelect(
                          'All'
                        )
                      }
                      className="text-[10px] font-semibold text-[#B89758] hover:underline"
                    >
                      Clear
                    </button>
                  )}

                </div>

                {dynamicBrands.length > 6 && (
                  <input
                    type="text"
                    value={brandSearchQuery}
                    onChange={(e) =>
                      setBrandSearchQuery(
                        e.target.value
                      )
                    }
                    placeholder="Search brands..."
                    className="mb-2 w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-2.5 py-1.5 text-[11px] outline-none focus:border-gray-400 focus:bg-white"
                  />
                )}

                <div className="max-h-40 space-y-0.5 overflow-y-auto">

                  {filteredBrandList.map(
                    (brand) => {

                      const selected =
                        selectedBrand ===
                        brand;

                      const count =
                        brand === 'All'
                          ? products.filter(
                              (product) =>
                                category ===
                                  'All' ||
                                normalize(
                                  product.category
                                ) ===
                                  normalize(
                                    category
                                  )
                            ).length
                          : products.filter(
                              (product) =>
                                (category ===
                                  'All' ||
                                  normalize(
                                    product.category
                                  ) ===
                                    normalize(
                                      category
                                    )) &&
                                normalize(
                                  product.brand
                                ) ===
                                  normalize(brand)
                            ).length;

                      return (
                        <label
                          key={brand}
                          className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
                            selected
                              ? 'bg-gray-100 font-semibold text-gray-950'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                          }`}
                        >

                          <span className="flex min-w-0 items-center gap-1.5">

                            <input
                              type="radio"
                              name="desktopBrandFilter"
                              checked={selected}
                              onChange={() =>
                                handleBrandSelect(
                                  brand
                                )
                              }
                              className="h-3 w-3 shrink-0 accent-[#111827]"
                            />

                            <span className="truncate">
                              {brand}
                            </span>

                          </span>

                          <span className="ml-2 text-[9.5px] text-gray-400">
                            ({count})
                          </span>

                        </label>
                      );
                    }
                  )}

                </div>
              </div>

              {/* PRICE */}
              <div className="border-t border-gray-100 pt-4">

                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-950">
                  Price Range
                </h3>

                <div className="grid grid-cols-2 gap-2">

                  <div>
                    <label className="mb-1 block text-[8.5px] uppercase text-gray-400">
                      Min
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={minPrice}
                      onChange={(e) =>
                        handleMinPriceChange(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-2 py-1.5 text-xs outline-none focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[8.5px] uppercase text-gray-400">
                      Max
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(e) =>
                        handleMaxPriceChange(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-2 py-1.5 text-xs outline-none focus:border-gray-400"
                    />
                  </div>

                </div>

                {/* Quick Price */}
                <div className="mt-2 flex flex-wrap gap-1">

                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice(0);
                      setMaxPrice(5000);
                      setCurrentPage(1);

                      updateUrlParams({
                        minPrice: 0,
                        maxPrice: 5000,
                        page: 1,
                      });
                    }}
                    className="rounded-full bg-gray-100 px-2 py-1 text-[9.5px] font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    &lt; ₹5K
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice(5000);
                      setMaxPrice(25000);
                      setCurrentPage(1);

                      updateUrlParams({
                        minPrice: 5000,
                        maxPrice: 25000,
                        page: 1,
                      });
                    }}
                    className="rounded-full bg-gray-100 px-2 py-1 text-[9.5px] font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    ₹5K–₹25K
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice(25000);
                      setMaxPrice(MAX_PRICE);
                      setCurrentPage(1);

                      updateUrlParams({
                        minPrice: 25000,
                        maxPrice: MAX_PRICE,
                        page: 1,
                      });
                    }}
                    className="rounded-full bg-gray-100 px-2 py-1 text-[9.5px] font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    &gt; ₹25K
                  </button>

                </div>
              </div>

              {/* RATING */}
              <div className="border-t border-gray-100 pt-4">

                <div className="mb-2 flex items-center justify-between">

                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950">
                    Customer Rating
                  </h3>

                  {minRating > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        handleRatingChange(0)
                      }
                      className="text-[10px] font-semibold text-[#B89758]"
                    >
                      Clear
                    </button>
                  )}

                </div>

                <div className="space-y-1">

                  {[4.5, 4, 3].map(
                    (rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() =>
                          handleRatingChange(
                            minRating ===
                              rating
                              ? 0
                              : rating
                          )
                        }
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
                          minRating === rating
                            ? 'bg-amber-50 font-bold text-amber-900'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>
                          ★ {rating} & Above
                        </span>

                        <span className="text-[9.5px] text-gray-400">
                          (
                          {
                            products.filter(
                              (product) =>
                                (category ===
                                  'All' ||
                                  normalize(
                                    product.category
                                  ) ===
                                    normalize(
                                      category
                                    )) &&
                                Number(
                                  product.rating ||
                                    0
                                ) >= rating
                            ).length
                          }
                          )
                        </span>
                      </button>
                    )
                  )}

                </div>
              </div>

              {/* DISCOUNT */}
              <div className="border-t border-gray-100 pt-4">

                <div className="mb-2 flex items-center justify-between">

                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950">
                    Discount
                  </h3>

                  {minDiscount > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        handleDiscountChange(
                          minDiscount
                        )
                      }
                      className="text-[10px] font-semibold text-[#B89758]"
                    >
                      Clear
                    </button>
                  )}

                </div>

                <div className="flex flex-wrap gap-1.5">

                  {[10, 20, 30, 50].map(
                    (discount) => (
                      <button
                        key={discount}
                        type="button"
                        onClick={() =>
                          handleDiscountChange(
                            discount
                          )
                        }
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold transition ${
                          minDiscount ===
                          discount
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {discount}%+ Off
                      </button>
                    )
                  )}

                </div>
              </div>

              {/* STOCK */}
              <div className="border-t border-gray-100 pt-4">

                <label className="flex cursor-pointer items-center justify-between">

                  <span className="text-xs font-semibold text-gray-800">
                    In Stock Items Only
                  </span>

                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) =>
                      handleStockChange(
                        e.target.checked
                      )
                    }
                    className="h-3.5 w-3.5 accent-[#111827]"
                  />

                </label>
              </div>

            </div>
          </aside>

          {/* =================================================
              PRODUCT LISTING
          ================================================== */}

          <section className="min-w-0">

            {/* ACTIVE FILTERS */}
            {hasActiveFilters && (
              <div className="mb-4 flex flex-wrap items-center gap-1.5 rounded-2xl border border-gray-200/80 bg-white p-2.5 text-xs shadow-sm sm:p-3">

                <span className="mr-1 text-[10.5px] font-bold uppercase tracking-wider text-gray-400">
                  Active:
                </span>

                {category !== 'All' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[10.5px] font-semibold text-white">
                    Category: {category}

                    <button
                      type="button"
                      onClick={() =>
                        handleCategorySelect(
                          'All'
                        )
                      }
                      className="ml-0.5 font-bold hover:text-amber-300"
                    >
                      ×
                    </button>
                  </span>
                )}

                {subcategory !==
                  'All' && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-1 text-[10.5px] font-semibold text-amber-950">
                    Type: {subcategory}

                    <button
                      type="button"
                      onClick={() =>
                        handleSubcategorySelect(
                          'All'
                        )
                      }
                      className="ml-0.5 font-bold hover:text-black"
                    >
                      ×
                    </button>
                  </span>
                )}

                {selectedBrand !==
                  'All' && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-[10.5px] font-semibold text-gray-900">
                    Brand: {selectedBrand}

                    <button
                      type="button"
                      onClick={() =>
                        handleBrandSelect(
                          'All'
                        )
                      }
                      className="ml-0.5 font-bold hover:text-black"
                    >
                      ×
                    </button>
                  </span>
                )}

                {(minPrice > 0 ||
                  maxPrice <
                    MAX_PRICE) && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-[10.5px] font-semibold text-gray-900">
                    ₹
                    {minPrice.toLocaleString(
                      'en-IN'
                    )}{' '}
                    – ₹
                    {maxPrice.toLocaleString(
                      'en-IN'
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setMinPrice(0);
                        setMaxPrice(
                          MAX_PRICE
                        );
                        setCurrentPage(1);

                        updateUrlParams({
                          minPrice: 0,
                          maxPrice:
                            MAX_PRICE,
                          page: 1,
                        });
                      }}
                      className="ml-0.5 font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}

                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10.5px] font-semibold text-amber-900">
                    ★ {minRating}+
                    
                    <button
                      type="button"
                      onClick={() =>
                        handleRatingChange(
                          0
                        )
                      }
                      className="ml-0.5 font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}

                {minDiscount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-[10.5px] font-semibold text-gray-900">
                    {minDiscount}%+ Off

                    <button
                      type="button"
                      onClick={() =>
                        handleDiscountChange(
                          minDiscount
                        )
                      }
                      className="ml-0.5 font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}

                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-[10.5px] font-semibold text-gray-900">
                    In Stock

                    <button
                      type="button"
                      onClick={() =>
                        handleStockChange(
                          false
                        )
                      }
                      className="ml-0.5 font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}

                {search && (
                  <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-[10.5px] font-semibold text-gray-900">
                    <span className="max-w-[180px] truncate">
                      "{search}"
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleSearchChange(
                          ''
                        )
                      }
                      className="ml-0.5 font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="ml-auto text-[10.5px] font-bold text-[#B89758] hover:underline"
                >
                  Clear All
                </button>

              </div>
            )}

            {/* RESULT SUMMARY */}
            <div className="mb-3 flex items-center justify-between">

              <div>
                <h2 className="text-sm font-bold text-gray-950 sm:text-base">
                  {category === 'All'
                    ? 'All Products'
                    : category}
                </h2>

                <p className="mt-0.5 text-[10.5px] text-gray-500">
                  {subcategory !==
                    'All' &&
                    `${subcategory} • `}
                  {selectedBrand !==
                    'All' &&
                    `${selectedBrand} • `}
                  {totalItems}{' '}
                  products
                </p>
              </div>

              <span className="text-[10.5px] text-gray-400">
                Page {effectivePage} of{' '}
                {totalPages}
              </span>

            </div>

            {/* PRODUCT GRID */}
            {paginatedProducts.length >
            0 ? (
              <div
                className={`grid gap-2.5 sm:gap-4 ${
                  viewMode === 'list'
                    ? 'grid-cols-1'
                    : viewMode ===
                      'grid4'
                    ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3'
                }`}
              >

                {paginatedProducts.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={
                        viewMode === 'list'
                          ? 'list'
                          : 'grid'
                      }
                      onAddToCart={
                        handleAddToCart
                      }
                      onBuyNow={
                        handleBuyNow
                      }
                    />
                  )
                )}

              </div>
            ) : (
              /* EMPTY */
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-gray-200/80 bg-white p-8 text-center shadow-sm sm:p-12">

                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                  🔍
                </div>

                <h3 className="text-base font-bold text-gray-900">
                  No products found
                </h3>

                <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-gray-500">
                  We couldn't find products
                  matching your selected
                  category, brand, product
                  type, or filters.
                </p>

                <button
                  type="button"
                  onClick={
                    clearAllFilters
                  }
                  className="mt-5 rounded-full bg-[#111827] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-black"
                >
                  Reset All Filters
                </button>

              </div>
            )}

            {/* =================================================
                PAGINATION
            ================================================== */}

            {totalItems > 0 && (
              <div className="mt-8 rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm sm:p-4">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  {/* Items per page */}
                  <div className="flex items-center justify-between gap-2 text-xs text-gray-500">

                    <span>
                      Show per page:
                    </span>

                    <select
                      value={pageSize}
                      onChange={(e) =>
                        handlePageSizeChange(
                          e.target.value
                        )
                      }
                      className="rounded-lg border border-gray-200 bg-[#F4F4F6] px-2.5 py-1.5 text-xs font-semibold text-gray-800 outline-none"
                    >
                      <option value="12">
                        12
                      </option>

                      <option value="24">
                        24
                      </option>

                      <option value="48">
                        48
                      </option>
                    </select>

                  </div>

                  {/* Pages */}
                  <div className="flex items-center justify-center gap-1.5">

                    <button
                      type="button"
                      disabled={
                        effectivePage <=
                        1
                      }
                      onClick={() =>
                        handlePageChange(
                          effectivePage -
                            1
                        )
                      }
                      className="rounded-xl border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40 sm:px-3"
                    >
                      ←
                      <span className="hidden sm:inline">
                        {' '}
                        Previous
                      </span>
                    </button>

                    {visiblePageNumbers.map(
                      (pageNumber, index) =>
                        pageNumber ===
                        '...' ? (
                          <span
                            key={`dots-${index}`}
                            className="px-1 text-xs text-gray-400"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={pageNumber}
                            type="button"
                            onClick={() =>
                              handlePageChange(
                                pageNumber
                              )
                            }
                            className={`h-8 w-8 rounded-xl text-xs font-bold transition ${
                              effectivePage ===
                              pageNumber
                                ? 'bg-[#0F172A] text-amber-300 shadow-sm'
                                : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {
                              pageNumber
                            }
                          </button>
                        )
                    )}

                    <button
                      type="button"
                      disabled={
                        effectivePage >=
                        totalPages
                      }
                      onClick={() =>
                        handlePageChange(
                          effectivePage +
                            1
                        )
                      }
                      className="rounded-xl border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40 sm:px-3"
                    >
                      <span className="hidden sm:inline">
                        Next{' '}
                      </span>
                      →
                    </button>

                  </div>

                  {/* Counter */}
                  <span className="text-center text-[11px] font-medium text-gray-500 lg:text-right">
                    Showing{' '}
                    <strong className="text-gray-900">
                      {totalItems === 0
                        ? 0
                        : startIndex +
                          1}
                      –
                      {endIndex}
                    </strong>{' '}
                    of{' '}
                    <strong className="text-gray-900">
                      {totalItems}
                    </strong>
                  </span>

                </div>
              </div>
            )}

            {/* =================================================
                TRUST SECTION
            ================================================== */}

            <div className="mt-10 rounded-3xl border border-gray-200/80 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm sm:mt-14 sm:p-7">

              <div className="grid grid-cols-2 gap-5 md:grid-cols-4">

                <div className="flex flex-col items-center text-center">

                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-200/60 bg-amber-50 text-amber-700">
                    <ShieldCheckIcon className="h-5 w-5" />
                  </div>

                  <h4 className="text-xs font-bold text-gray-950 sm:text-sm">
                    Certified Authentic
                  </h4>

                  <p className="mt-0.5 text-[10px] text-gray-500">
                    Genuine products with applicable documentation
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">

                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-200/60 bg-blue-50 text-blue-700">
                    <TruckIcon className="h-5 w-5" />
                  </div>

                  <h4 className="text-xs font-bold text-gray-950 sm:text-sm">
                    Secure Shipping
                  </h4>

                  <p className="mt-0.5 text-[10px] text-gray-500">
                    Safe delivery across eligible locations
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">

                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-200/60 bg-emerald-50 text-emerald-700">
                    <CheckCircleIcon className="h-5 w-5" />
                  </div>

                  <h4 className="text-xs font-bold text-gray-950 sm:text-sm">
                    Easy Returns
                  </h4>

                  <p className="mt-0.5 text-[10px] text-gray-500">
                    Hassle-free return support
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">

                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl border border-purple-200/60 bg-purple-50 text-purple-700">
                    <SparklesIcon className="h-5 w-5" />
                  </div>

                  <h4 className="text-xs font-bold text-gray-950 sm:text-sm">
                    Brand Warranty
                  </h4>

                  <p className="mt-0.5 text-[10px] text-gray-500">
                    Warranty according to product and brand
                  </p>
                </div>

              </div>
            </div>

            {/* =================================================
                RECOMMENDATIONS
            ================================================== */}

            {recommendedProducts.length >
              0 && (
              <div className="mt-10 border-t border-gray-200 pt-8 sm:mt-14">

                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                  <div>

                    <span className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#B89758]">
                      Relevant Selections
                    </span>

                    <h2 className="mt-1 text-lg font-bold tracking-tight text-gray-950 sm:text-2xl">
                      You May Also Like
                    </h2>

                    <p className="text-xs text-gray-500">
                      Products selected based on your current browsing category and preferences.
                    </p>

                  </div>

                  <Link
                    to="/shop"
                    className="text-xs font-semibold text-[#B89758] hover:underline"
                  >
                    Explore Full Collection →
                  </Link>

                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">

                  {recommendedProducts.map(
                    (product) => (
                      <ProductCard
                        key={`recommendation-${product.id}`}
                        product={product}
                        onAddToCart={
                          handleAddToCart
                        }
                        onBuyNow={
                          handleBuyNow
                        }
                      />
                    )
                  )}

                </div>
              </div>
            )}

            {/* =================================================
                FAQ
            ================================================== */}

            <div className="mt-10 border-t border-gray-200 pt-8 sm:mt-14">

              <div className="mb-6">

                <span className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#B89758]">
                  Buyer Guide
                </span>

                <h2 className="mt-1 text-lg font-bold tracking-tight text-gray-950 sm:text-2xl">
                  Frequently Asked Questions
                </h2>

                <p className="text-xs text-gray-500">
                  Helpful information about shopping, products, delivery and returns.
                </p>

              </div>

              <div className="space-y-2.5">

                {faqItems.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm"
                    >

                      <button
                        type="button"
                        onClick={() =>
                          setFaqOpen(
                            faqOpen ===
                              index
                              ? null
                              : index
                          )
                        }
                        className="flex w-full items-center justify-between gap-4 p-4 text-left text-xs font-semibold text-gray-900 transition hover:bg-gray-50 sm:text-sm"
                      >

                        <span>
                          {item.q}
                        </span>

                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                          {faqOpen ===
                          index
                            ? '−'
                            : '+'}
                        </span>

                      </button>

                      {faqOpen ===
                        index && (
                        <div className="border-t border-gray-100 bg-gray-50/60 px-4 pb-4 pt-3 text-xs leading-relaxed text-gray-600">
                          {item.a}
                        </div>
                      )}

                    </div>
                  )
                )}

              </div>
            </div>

          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}