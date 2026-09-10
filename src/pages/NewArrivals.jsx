// src/pages/NewArrivals.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';
import AnimatedCounter from '../components/AnimatedCounter';
import { ArrowRightIcon } from '../components/Icons';
import { getProducts } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { Sparkles, Clock, ShieldCheck, Flame } from 'lucide-react';

const categoryTabs = ['All', 'Watches', 'Bags & Wallets', 'Shoes', 'Mobiles', 'Electronics', 'Fashion Accessories'];

export default function NewArrivals() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(() => getProducts());
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const handleProductsUpdate = () => setProducts(getProducts());
    window.addEventListener('productsUpdated', handleProductsUpdate);
    return () => window.removeEventListener('productsUpdated', handleProductsUpdate);
  }, []);

  const arrivals = useMemo(() => {
    const filtered = category === 'All'
      ? [...products]
      : products.filter((product) => product.category?.toLowerCase() === category.toLowerCase());

    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    if (sort === 'discount') filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    if (sort === 'newest') filtered.sort((a, b) => b.id - a.id);
    return filtered;
  }, [products, category, sort]);

  const handleAddToCart = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setToastMessage(`✓ Added "${product.name}" to your bag`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleBuyNow = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
      <Navbar />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-900 shadow-xl animate-slide-up">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">✓</span>
          <span>{toastMessage}</span>
          <Link to="/cart" className="ml-1.5 rounded-full bg-[#111827] px-3 py-0.5 text-[10.5px] font-semibold text-white hover:bg-black transition">
            View Bag
          </Link>
        </div>
      )}

      <main>
        {/* ================= EDITORIAL HERO BANNER ================= */}
        <section className="relative border-b border-neutral-800 bg-[#07090E] text-white py-14 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#8C6734]/20 blur-3xl pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <Reveal direction="up" delay={0}>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.22em] text-amber-300 backdrop-blur-md mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Season 2026 • Fresh Releases</span>
                </div>
              </Reveal>

              <Reveal direction="up" delay={80}>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight leading-tight">
                  New Arrivals & Limited Editions
                </h1>
              </Reveal>

              <Reveal direction="up" delay={160}>
                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-neutral-300 max-w-xl font-light">
                  Direct from authorized horology houses and curated lifestyle creators. Every single piece is certified authentic with official brand warranty credentials.
                </p>
              </Reveal>

              <Reveal direction="up" delay={240}>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-amber-100 shadow-sm"
                  >
                    <span>Explore Full Catalog</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                    <span><AnimatedCounter end={arrivals.length} suffix=" Editions Live" /></span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================= CATALOG SECTION ================= */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <Reveal direction="up" className="flex flex-col gap-4 border-b border-gray-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                Curated Drop
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 font-serif">
                Fresh from the Collection
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                {arrivals.length} verified pieces available for immediate dispatch
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <label className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                Sort:
              </label>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-900 outline-none focus:border-gray-900 cursor-pointer shadow-2xs"
              >
                <option value="newest">Latest Releases First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
              </select>
            </div>
          </Reveal>

          {/* Category Filter Pills */}
          <Reveal direction="up" delay={50} className="mt-5 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categoryTabs.map((tab) => {
              const count = tab === 'All'
                ? products.length
                : products.filter(p => p.category?.toLowerCase() === tab.toLowerCase()).length;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCategory(tab)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${category === tab
                    ? 'bg-gray-950 text-white shadow-sm scale-102'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-black'
                    }`}
                >
                  {tab === 'All' ? 'All Arrivals' : tab}
                  <span className={`ml-1.5 text-[10px] opacity-70 ${category === tab ? 'text-amber-300' : 'text-gray-400'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </Reveal>

          {/* Grid of New Arrival Cards */}
          {arrivals.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {arrivals.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-gray-200 bg-white py-16 text-center shadow-sm">
              <p className="text-sm font-semibold text-gray-800">No new arrivals in this category at the moment.</p>
              <button
                type="button"
                onClick={() => setCategory('All')}
                className="mt-3 text-xs font-bold text-[#8C6734] hover:underline cursor-pointer"
              >
                View all new arrivals &rarr;
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}