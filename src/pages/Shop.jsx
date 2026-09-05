// src/pages/Shop.jsx
import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories, getBrandsByCategory } from '../utils/productStore';
import { getCurrentUser } from '../utils/auth';
import { addToCart } from '../utils/cart';
import { SearchIcon } from '../components/Icons';

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

    // Sorting
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
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 overflow-x-clip">
      <Navbar />

      {/* Floating Alert Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-900 shadow-xl animate-slide-up max-w-[calc(100vw-32px)]">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs">✓</span>
          <span className="truncate">{toastMessage}</span>
          <Link to="/cart" className="ml-1 rounded-md bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-black transition shrink-0">
            View Bag
          </Link>
        </div>
      )}

      {/* Catalog Header Banner */}
      <section className="border-b border-zinc-200/80 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B89035]">
                Certified Luxury Collections
              </span>
              <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-sans">
                {category === 'All' ? 'Complete Store Catalog' : category}
              </h1>
              <p className="mt-1 text-xs text-zinc-500">
                Displaying {filteredProducts.length} certified authentic horology and lifestyle pieces.
              </p>
            </div>

            {/* Mobile Filter Trigger Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileFilters(true)}
                className="flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-800 shadow-2xs"
              >
                Filters & Refinements ({category !== 'All' ? 1 : 0} active)
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">

          {/* ================= DESKTOP FILTER SIDEBAR ================= */}
          <aside className="hidden lg:block space-y-6">

            {/* Search within Catalog */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 block">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Model, brand, SKU..."
                  className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Categories List */}
            <div className="space-y-2 border-t border-zinc-200/80 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">Department</span>
                {category !== 'All' && (
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('All')}
                    className="text-[10px] text-[#B89035] hover:underline font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-left transition ${
                      category === cat
                        ? 'bg-zinc-900 text-white font-semibold shadow-2xs'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    {category === cat && <span className="text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands List */}
            <div className="space-y-2 border-t border-zinc-200/80 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">Brand Maison</span>
                {selectedBrand !== 'All' && (
                  <button
                    type="button"
                    onClick={() => handleBrandSelect('All')}
                    className="text-[10px] text-[#B89035] hover:underline font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                {dynamicBrands.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleBrandSelect(b)}
                    className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-left transition ${
                      selectedBrand === b
                        ? 'bg-zinc-900 text-white font-semibold shadow-2xs'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    }`}
                  >
                    <span className="truncate">{b}</span>
                    {selectedBrand === b && <span className="text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2 border-t border-zinc-200/80 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">Max Budget</span>
                <span className="text-xs font-bold font-mono text-zinc-950">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="250000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-zinc-900 cursor-pointer"
              />
            </div>

            {/* In Stock Toggle */}
            <div className="border-t border-zinc-200/80 pt-5">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-800">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                />
                <span>In-Stock Ready for Dispatch</span>
              </label>
            </div>

            {/* Reset All Filters CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition shadow-2xs"
              >
                Clear All Filters
              </button>
            </div>

          </aside>

          {/* ================= MAIN PRODUCTS AREA ================= */}
          <div className="space-y-6">

            {/* Top Toolbar: Active Pills + Sort Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-zinc-200/80 shadow-2xs">
              
              {/* Active Filter Chips */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <span className="text-zinc-400 text-[11px] font-medium mr-1">Active:</span>
                {category !== 'All' && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-800">
                    Dept: {category}
                    <button type="button" onClick={() => handleCategorySelect('All')} className="hover:text-black">✕</button>
                  </span>
                )}
                {selectedBrand !== 'All' && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-800">
                    Brand: {selectedBrand}
                    <button type="button" onClick={() => handleBrandSelect('All')} className="hover:text-black">✕</button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                    In Stock Only
                    <button type="button" onClick={() => setInStockOnly(false)} className="hover:text-black">✕</button>
                  </span>
                )}
                {category === 'All' && selectedBrand === 'All' && !inStockOnly && (
                  <span className="text-zinc-500 text-[11px]">All Products</span>
                )}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-zinc-500 font-medium">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-900 outline-none focus:border-zinc-900 cursor-pointer"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Greatest Discount</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>

            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-12 text-center shadow-xs space-y-3">
                <h3 className="text-base font-bold text-zinc-950">No Matching Products Found</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  We couldn't find any products matching your active filters. Try resetting your department or price range.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-black transition shadow-xs mt-2 cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
                ))}
              </div>
            )}

          </div>

        </div>
      </main>

      {/* ================= MOBILE FILTERS DRAWER ================= */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 flex bg-zinc-950/40 backdrop-blur-xs lg:hidden animate-fade-in">
          <div className="ml-auto w-full max-w-xs h-full bg-white p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">Filters</h3>
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="text-zinc-500 hover:text-zinc-900 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-zinc-900 block">Department</span>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      handleCategorySelect(cat);
                      setMobileFilters(false);
                    }}
                    className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs ${
                      category === cat ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Price */}
            <div className="space-y-2 border-t border-zinc-100 pt-4">
              <div className="flex justify-between text-xs font-semibold">
                <span>Max Budget:</span>
                <span>₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="250000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-zinc-900"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                clearAllFilters();
                setMobileFilters(false);
              }}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 text-xs font-semibold text-zinc-800"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}