// src/pages/NewArrivals.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Reveal, AnimatedCounter } from '../components/useScrollReveal';
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  BoxIcon
} from '../components/Icons';
import { Sparkles, Award, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getProducts } from '../utils/productStore';
import { addToCart } from '../utils/cart';

const categoryTabs = ['All', 'Watches', 'Bags & Wallets', 'Shoes', 'Mobiles', 'Electronics', 'Smart Gadgets', 'Gaming', 'Fitness'];

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

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-md px-4 py-3 text-xs font-semibold shadow-2xl animate-fade-in">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✓</span>
          <span className="text-gray-900">{toastMessage}</span>
          <Link to="/cart" className="ml-1 rounded-full bg-gray-950 px-3 py-1 text-[11px] font-bold text-white hover:bg-black transition">
            View Bag
          </Link>
        </div>
      )}

      <main>
        {/* Luxury Hero Banner */}
        <section className="relative overflow-hidden border-b border-gray-800 bg-[#0F172A] text-white">
          {/* Subtle Ambient Gold Glow Background */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            {/* Breadcrumbs */}
            <Reveal direction="down" delay={50}>
              <div className="mb-4 flex items-center gap-2 text-xs text-gray-400 font-medium">
                <Link to="/" className="hover:text-white transition">Home</Link>
                <span>/</span>
                <span className="text-amber-300 font-semibold">New Arrivals</span>
              </div>
            </Reveal>

            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <Reveal direction="up" delay={100}>
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.2em] text-amber-300 backdrop-blur-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Season 2026 / Fresh Release</span>
                  </div>
                </Reveal>

                <Reveal direction="up" delay={200}>
                  <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-white">
                    New Arrivals <span className="font-light italic text-amber-200">&amp; Curated Drops</span>
                  </h1>
                </Reveal>

                <Reveal direction="up" delay={300}>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
                    Discover handpicked Swiss chronographs, Italian leather briefcases, flagship smartphones, and audiophile sound engineered for discerning taste.
                  </p>
                </Reveal>

                <Reveal direction="up" delay={400}>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-950 transition hover:bg-amber-300 hover:text-gray-950 shadow-md"
                    >
                      <span>Explore Entire Catalog</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <a
                      href="#arrivals-grid"
                      className="inline-flex items-center gap-2 rounded-full border border-gray-600 bg-white/5 px-5 py-2.5 text-xs font-semibold text-gray-300 backdrop-blur-sm transition hover:border-gray-400 hover:text-white"
                    >
                      <span>Browse {arrivals.length} Just In</span>
                    </a>
                  </div>
                </Reveal>
              </div>

              {/* Stat Highlights Card */}
              <div className="lg:col-span-5">
                <Reveal direction="zoom" delay={350}>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Live Collection</span>
                        <div className="text-3xl font-bold text-white">
                          <AnimatedCounter end={products.length} suffix="+" duration={1200} />
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Authenticity</span>
                        <div className="text-sm font-bold text-emerald-400 flex items-center gap-1 justify-end">
                          <CheckCircle2 className="h-4 w-4" /> 100% Certified
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
                        <div className="text-[10.5px] font-semibold text-gray-400">Fast Shipping</div>
                        <div className="font-bold text-white mt-0.5">24-48H Express Air</div>
                      </div>
                      <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
                        <div className="text-[10.5px] font-semibold text-gray-400">Warranty</div>
                        <div className="font-bold text-white mt-0.5">Official Brand Card</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog Filter & Grid Section */}
        <section id="arrivals-grid" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <Reveal direction="up" delay={100}>
            <div className="flex flex-col gap-5 border-b border-gray-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B89758]">Curated edit</p>
                <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">Fresh From The Collection</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Displaying <span className="font-bold text-gray-900">{arrivals.length}</span> luxury pieces updated in real-time
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                  <span>Sort by:</span>
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 font-semibold outline-none focus:border-gray-900 cursor-pointer shadow-2xs"
                  >
                    <option value="newest">Latest first</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                    <option value="discount">Highest discount</option>
                  </select>
                </label>
              </div>
            </div>
          </Reveal>

          {/* Category Tabs Strip */}
          <Reveal direction="up" delay={150}>
            <div className="mt-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categoryTabs.map((tab) => {
                const isActive = category === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setCategory(tab)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gray-950 text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {tab === 'All' ? 'All Arrivals' : tab}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Products Grid */}
          {arrivals.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {arrivals.map((product, idx) => (
                <Reveal key={product.id} direction="up" delay={Math.min(idx * 60, 400)}>
                  <ProductCard product={product} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal direction="zoom" delay={100}>
              <div className="mt-8 rounded-3xl border border-gray-200 bg-white py-16 text-center shadow-xs">
                <BoxIcon className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-3 text-base font-bold text-gray-950">No Arrivals in this Category</h3>
                <p className="mt-1 text-xs text-gray-500">Check back shortly or browse all categories.</p>
                <button
                  type="button"
                  onClick={() => setCategory('All')}
                  className="mt-4 rounded-full bg-gray-950 px-5 py-2 text-xs font-bold text-white hover:bg-black transition"
                >
                  View All Arrivals
                </button>
              </div>
            </Reveal>
          )}

          {/* Trust Guarantees Strip */}
          <div className="mt-16 border-t border-gray-200 pt-12">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Reveal direction="up" delay={100}>
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs flex items-start gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-950">100% Certified Genuine</h4>
                    <p className="mt-0.5 text-[11px] text-gray-500">All products backed with official manufacturer warranty &amp; papers.</p>
                  </div>
                </div>
              </Reveal>

              <Reveal direction="up" delay={200}>
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs flex items-start gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 shrink-0">
                    <TruckIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-950">Insured Air Express</h4>
                    <p className="mt-0.5 text-[11px] text-gray-500">Complimentary fast shipping on qualifying boutique orders.</p>
                  </div>
                </div>
              </Reveal>

              <Reveal direction="up" delay={300}>
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs flex items-start gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                    <ShieldCheckIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-950">7-Day Return Privilege</h4>
                    <p className="mt-0.5 text-[11px] text-gray-500">Hassle-free returns on pristine items with security tags intact.</p>
                  </div>
                </div>
              </Reveal>

              <Reveal direction="up" delay={400}>
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs flex items-start gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-950">Dedicated Concierge</h4>
                    <p className="mt-0.5 text-[11px] text-gray-500">Live WhatsApp support &amp; guidance from our Mumbai advisors.</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}