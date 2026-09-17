// src/pages/NewArrivals.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { ArrowRightIcon } from '../components/Icons';
import { getProducts } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { Reveal } from '../components/useScrollReveal';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';

const categoryTabs = ['All', 'Watches', 'Bags & Wallets', 'Shoes', 'Mobiles', 'Electronics'];

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
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-5 py-3.5 text-xs font-semibold text-neutral-900 shadow-2xl animate-slide-up">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">✓</span>
          <span>{toastMessage}</span>
          <Link to="/cart" className="ml-2 rounded-lg bg-neutral-950 px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#8C6734] transition-colors">
            View Bag
          </Link>
        </div>
      )}

      <main>
        {/* Luxury Hero Banner */}
        <section className="relative bg-white border-b border-neutral-200/80 overflow-hidden py-14 sm:py-20">
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal delay={0} direction="up">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734] animate-ping" />
                  <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#8C6734]">
                    Season 2026 Collection / Just In
                  </span>
                </div>
                <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-neutral-950">
                  New <span className="italic font-normal text-[#8C6734]">Arrivals</span>
                </h1>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                  Explore the latest additions to the Krishna Accessories boutique catalog, meticulously curated for craftsmanship, elegance, and everyday luxury.
                </p>
                <div className="pt-2">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#8C6734] transition-colors shadow-sm"
                  >
                    <span>Explore Full Catalog</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Catalog Grid Section */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8">
          <Reveal delay={50} direction="up">
            <div className="flex flex-col gap-4 border-b border-neutral-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#8C6734]">
                  Curated Edit
                </span>
                <h2 className="font-serif text-2xl font-medium tracking-tight text-neutral-950 mt-0.5">
                  Fresh from the Collection
                </h2>
                <p className="text-xs text-neutral-500">{arrivals.length} pieces available now</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 font-medium">Sort by:</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="rounded-lg border border-neutral-200/90 bg-white px-3 py-2 text-xs font-medium text-neutral-900 outline-none transition-colors focus:border-[#C5A880] cursor-pointer"
                >
                  <option value="newest">Latest first</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="discount">Best offers</option>
                </select>
              </div>
            </div>
          </Reveal>

          {/* Category Pills */}
          <Reveal delay={100} direction="up">
            <div className="mt-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categoryTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCategory(tab)}
                  className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    category === tab
                      ? 'bg-neutral-950 text-white shadow-xs'
                      : 'bg-white text-neutral-600 border border-neutral-200/90 hover:border-[#C5A880] hover:text-neutral-900'
                  }`}
                >
                  {tab === 'All' ? 'All Arrivals' : tab}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Products Grid */}
          <Reveal delay={150} direction="up">
            {arrivals.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-6">
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
              <div className="mt-8 rounded-2xl border border-neutral-200/90 bg-white py-16 text-center text-sm text-neutral-500 font-normal">
                No new arrivals found in this category yet.
              </div>
            )}
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}