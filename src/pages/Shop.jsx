// src/pages/Shop.jsx
import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories, getBrandsByCategory } from '../utils/productStore'; import { getCurrentUser } from '../utils/auth'; import { addToCart } from '../utils/cart';

export default function Shop() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlCategory = searchParams.get('category') || 'All';
  const urlBrand = searchParams.get('brand') || 'All';
  const urlSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState(() => getProducts());
  const [categories, setCategories] = useState(() => ['All', ...getCategories()]);

  const [category, setCategory] = useState(urlCategory);
  const [selectedBrand, setSelectedBrand] = useState(urlBrand);
  const [sort, setSort] = useState('featured');
  const [search, setSearch] = useState(urlSearch);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(250000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Sync when storage or search params change
  useEffect(() => {
    const handleProductsUpdate = () => {
      setProducts(getProducts());
      setCategories(['All', ...getCategories()]);
    };
    window.addEventListener('productsUpdated', handleProductsUpdate);
    return () => window.removeEventListener('productsUpdated', handleProductsUpdate);
  }, []);

  useEffect(() => {
    if (urlCategory && urlCategory !== category) {
      setCategory(urlCategory);
      setSelectedBrand('All');
    }
  }, [urlCategory]);

  useEffect(() => {
    if (urlBrand && urlBrand !== selectedBrand) {
      setSelectedBrand(urlBrand);
    }
  }, [urlBrand]);

  useEffect(() => {
    if (urlSearch && urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [urlSearch]);

  // Dynamic Brands based on selected category
  const dynamicBrands = useMemo(() => {
    const brandsList = getBrandsByCategory(category);
    return ['All', ...brandsList];
  }, [category, products]);

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setSelectedBrand('All');

    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    params.delete('brand');
    setSearchParams(params);
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    const params = new URLSearchParams(searchParams);
    if (brand === 'All') {
      params.delete('brand');
    } else {
      params.set('brand', brand);
    }
    setSearchParams(params);
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category Filter
    if (category !== 'All') {
      list = list.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }

    // Brand Filter
    if (selectedBrand !== 'All') {
      list = list.filter((p) => p.brand?.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Price Range Filter
    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // In Stock Only Filter
    if (inStockOnly) {
      list = list.filter((p) => (p.stock || 0) > 0);
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }

    // Sorting (Including Price Low to High, High to Low)
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
    }

    return list;
  }, [products, category, selectedBrand, minPrice, maxPrice, inStockOnly, search, sort]);

  const clearAllFilters = () => {
    setCategory('All');
    setSelectedBrand('All');
    setSort('featured');
    setSearch('');
    setMinPrice(0);
    setMaxPrice(250000);
    setInStockOnly(false);
    setSearchParams({});
  };

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

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-900 shadow-xl animate-slide-up">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">✓</span>
          <span>{toastMessage}</span>
          <Link to="/cart" className="ml-1.5 rounded-full bg-[#111827] px-3 py-0.5 text-[10.5px] font-semibold text-white hover:bg-black transition">
            View Bag
          </Link>
        </div>
      )}

      {/* Minimalist Luxury Catalog Header */}
      <section className="bg-white border-b border-gray-200/80 py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#B89758]">
                Authorized Luxury Catalog
              </span>
              <h1 className="mt-0.5 text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
                {category === 'All' ? 'Shop All Products' : `${category} Collection`}
              </h1>
              <p className="mt-1 text-xs text-gray-500 max-w-md">
                Certified authentic brand warranties and insured express delivery across India.
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-1.5">
              {categories.slice(0, 7).map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all duration-150 active:scale-97 ${category === cat
                    ? 'bg-[#0F172A] text-amber-200 shadow-2xs'
                    : 'bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 hover:text-black'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Body */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Top Search & Filter Bar */}
        <div className="mb-5 flex flex-col gap-2.5 rounded-xl border border-gray-200/80 bg-white p-3 shadow-xs lg:flex-row lg:items-center lg:justify-between">

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, brand, or SKU..."
              className="w-full rounded-full border border-gray-200 bg-[#F4F4F6] py-1.5 pl-8 pr-8 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-gray-400 focus:bg-white"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              🔍
            </span>
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          {/* Controls: Sort & Mobile Filter toggle */}
          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() => setMobileFilters(!mobileFilters)}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-[#F4F4F6] px-3 py-1.5 text-xs font-semibold text-gray-800 lg:hidden hover:bg-gray-200"
            >
              <span>⚙️ Filters</span>
              {(category !== 'All' || selectedBrand !== 'All' || search || inStockOnly) && (
                <span className="flex h-1.5 w-1.5 rounded-full bg-[#111827]" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 flex-1 lg:flex-initial">
              <label className="hidden sm:inline text-xs text-gray-500 font-medium whitespace-nowrap">
                Sort:
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full lg:w-44 rounded-full border border-gray-200 bg-[#F4F4F6] px-3 py-1.5 text-xs font-medium text-gray-800 outline-none focus:border-gray-400 cursor-pointer"
              >
                <option value="featured">Featured / Best Match</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Biggest Discount</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>

          </div>
        </div>

        {/* 2-Column Layout (Sidebar Filters + Products Grid) */}
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">

          {/* ================= SIDEBAR FILTERS ================= */}
          <aside className={`${mobileFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-20 space-y-4 rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs">

              {/* Filter Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-950">Categories</span>
                  <span className="rounded-full bg-gray-100 px-1.5 py-0.2 text-[9.5px] font-bold text-gray-600">
                    {filteredProducts.length}
                  </span>
                </div>

                {(category !== 'All' || selectedBrand !== 'All' || search || inStockOnly || minPrice > 0 || maxPrice < 250000) && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-[10.5px] font-semibold text-[#B89758] hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* 1. Category Tree Filter */}
              <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const count = cat === 'All'
                    ? products.length
                    : products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1 text-xs transition ${category === cat
                        ? 'bg-[#0F172A] font-semibold text-amber-200 shadow-2xs'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                        }`}
                    >
                      <span className="truncate">{cat}</span>
                      <span className={`text-[9.5px] font-mono ${category === cat ? 'text-amber-300/80' : 'text-gray-400'}`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* 2. DYNAMIC CATEGORY-WISE BRAND FILTER */}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950">
                    Brands {category !== 'All' && <span className="text-gray-400 font-normal">in {category}</span>}
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

                <div className="space-y-0.5 max-h-40 overflow-y-auto pr-1">
                  {dynamicBrands.map((brand) => {
                    const isSelected = selectedBrand === brand;
                    const brandCount = brand === 'All'
                      ? (category === 'All' ? products.length : products.filter(p => p.category === category).length)
                      : products.filter(p => (category === 'All' || p.category === category) && p.brand === brand).length;

                    return (
                      <label
                        key={brand}
                        onClick={() => handleBrandSelect(brand)}
                        className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1 text-xs transition ${isSelected
                          ? 'bg-gray-100 text-gray-950 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                          }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <input
                            type="radio"
                            name="brandFilter"
                            checked={isSelected}
                            onChange={() => handleBrandSelect(brand)}
                            className="accent-[#111827] h-3 w-3"
                          />
                          <span>{brand}</span>
                        </div>
                        <span className="text-[9.5px] text-gray-400 font-mono">({brandCount})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. Price Range Filter */}
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
                      onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
                      className="w-full rounded-md border border-gray-200 bg-[#F4F4F6] px-2 py-1 text-xs text-gray-900 outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-[8.5px] text-gray-400 uppercase block mb-0.5">Max (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Math.max(0, Number(e.target.value)))}
                      className="w-full rounded-md border border-gray-200 bg-[#F4F4F6] px-2 py-1 text-xs text-gray-900 outline-none focus:border-gray-400"
                    />
                  </div>
                </div>

                {/* Quick Price Shortcuts */}
                <div className="mt-2 flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => { setMinPrice(0); setMaxPrice(5000); }}
                    className="rounded-full bg-gray-100 px-2 py-0.2 text-[9.5px] font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    &lt; ₹5K
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMinPrice(5000); setMaxPrice(25000); }}
                    className="rounded-full bg-gray-100 px-2 py-0.2 text-[9.5px] font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    ₹5K - ₹25K
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMinPrice(25000); setMaxPrice(250000); }}
                    className="rounded-full bg-gray-100 px-2 py-0.2 text-[9.5px] font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    &gt; ₹25K
                  </button>
                </div>
              </div>

              {/* 4. Availability Filter */}
              <div className="border-t border-gray-100 pt-3">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-xs text-gray-800 font-semibold">In Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-gray-300 accent-[#111827] cursor-pointer"
                  />
                </label>
              </div>

            </div>
          </aside>

          {/* ================= PRODUCT LISTING AREA ================= */}
          <section>

            {/* Active Filters Pill Bar */}
            {(category !== 'All' || selectedBrand !== 'All' || search || inStockOnly) && (
              <div className="mb-4 flex flex-wrap items-center gap-1.5 rounded-xl border border-gray-200/80 bg-white p-2.5 text-xs shadow-2xs animate-fade-in">
                <span className="text-[10.5px] text-gray-400 font-semibold">Active:</span>

                {category !== 'All' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10.5px] font-semibold text-gray-900 border border-gray-200">
                    Category: {category}
                    <button type="button" onClick={() => handleCategorySelect('All')} className="hover:text-black ml-0.5 font-bold">×</button>
                  </span>
                )}

                {selectedBrand !== 'All' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10.5px] font-semibold text-gray-900 border border-gray-200">
                    Brand: {selectedBrand}
                    <button type="button" onClick={() => handleBrandSelect('All')} className="hover:text-black ml-0.5 font-bold">×</button>
                  </span>
                )}

                {search && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10.5px] font-semibold text-blue-700 border border-blue-200">
                    "{search}"
                    <button type="button" onClick={() => setSearch('')} className="hover:text-black ml-0.5 font-bold">×</button>
                  </span>
                )}

                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10.5px] font-semibold text-emerald-700 border border-emerald-200">
                    In Stock
                    <button type="button" onClick={() => setInStockOnly(false)} className="hover:text-black ml-0.5 font-bold">×</button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="ml-auto text-[10.5px] text-[#B89758] hover:underline font-semibold"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xs">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
                  🔍
                </div>
                <h3 className="mt-3 text-sm font-bold text-gray-900">
                  No products found
                </h3>
                <p className="mt-1 max-w-sm text-xs text-gray-500">
                  We couldn't find any products matching your filters in {category === 'All' ? 'our catalog' : category}.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-4 rounded-full bg-[#111827] px-5 py-1.5 text-xs font-semibold text-white hover:bg-black transition"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Recommendations Section */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-gray-950">
                    Explore Curated Recommendations
                  </h2>
                  <p className="text-xs text-gray-500">Top-rated certified items handpicked for luxury connoisseurs</p>
                </div>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {products.slice(0, 3).map((product) => (
                  <ProductCard
                    key={`rec-${product.id}`}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
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