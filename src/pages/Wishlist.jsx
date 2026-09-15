// src/pages/Wishlist.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Reveal, AnimatedCounter } from '../components/useScrollReveal';
import { getWishlist, clearWishlist } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { HeartIcon, BagIcon, ArrowRightIcon, ShieldCheckIcon, TruckIcon } from '../components/Icons';
import { Heart, Trash2, ShoppingBag, Sparkles, Award, ArrowRight } from 'lucide-react';

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(() => getWishlist());
  const [toastMessage, setToastMessage] = useState('');

  const refreshWishlist = () => {
    setWishlist(getWishlist());
  };

  useEffect(() => {
    refreshWishlist();
    window.addEventListener('wishlistUpdated', refreshWishlist);
    return () => window.removeEventListener('wishlistUpdated', refreshWishlist);
  }, []);

  const totalValue = useMemo(() => {
    return wishlist.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  }, [wishlist]);

  const handleAddToCart = (product) => {
    addToCart(product, 1, '', '');
    setToastMessage(`✓ Added "${product.name}" to your bag`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleBuyNow = (product) => {
    addToCart(product, 1, '', '');
    navigate('/checkout');
  };

  const handleMoveAllToBag = () => {
    wishlist.forEach(p => addToCart(p, 1, '', ''));
    setToastMessage(`✓ Moved all ${wishlist.length} item(s) to your shopping bag`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
      <Navbar />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-md px-5 py-3.5 text-xs font-bold text-gray-900 shadow-2xl animate-fade-in">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✓</span>
          <span>{toastMessage}</span>
          <Link to="/cart" className="ml-2 rounded-full bg-[#111827] px-3.5 py-1 text-[11px] font-bold text-white hover:bg-black transition">
            View Bag
          </Link>
        </div>
      )}

      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white py-10 sm:py-12">
        <div className="pointer-events-none absolute -top-16 right-10 h-64 w-64 rounded-full bg-rose-50/70 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Reveal direction="down" delay={50}>
            <div className="mb-3 flex items-center gap-2 text-xs text-gray-400 font-medium">
              <Link to="/" className="hover:text-gray-900 transition">Home</Link>
              <span>/</span>
              <span className="text-[#B89758] font-semibold">Saved Wishlist</span>
            </div>
          </Reveal>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <Reveal direction="up" delay={100}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-700">
                  <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                  <span>Personal Luxury Curation</span>
                </span>
              </Reveal>

              <Reveal direction="up" delay={200}>
                <h1 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-gray-950">
                  Saved Wishlist ({wishlist.length})
                </h1>
              </Reveal>

              <Reveal direction="up" delay={300}>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  Your shortlisted luxury timepieces, footwear, leather goods, and flagship tech.
                </p>
              </Reveal>
            </div>

            {wishlist.length > 0 && (
              <Reveal direction="left" delay={250}>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="hidden md:block text-right pr-2">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Estimated Value</span>
                    <span className="text-sm font-bold text-gray-950">₹{totalValue.toLocaleString('en-IN')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleMoveAllToBag}
                    className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black shadow-sm transition cursor-pointer"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Move All to Bag</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Clear all items from your wishlist?')) {
                        clearWishlist();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-red-600 hover:bg-gray-200 transition cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* Main Wishlist Grid */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        {wishlist.length === 0 ? (
          <Reveal direction="zoom" delay={100}>
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-2xs">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500 border border-rose-200 shadow-xs">
                <Heart className="w-8 h-8" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-950">Your Wishlist is Empty</h2>
              <p className="mt-1.5 max-w-md text-xs sm:text-sm text-gray-500 leading-relaxed">
                Explore our boutique catalog of Swiss watches, Italian leather briefcases, and flagship smartphones. Tap the heart icon on any piece to save it here.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black shadow-sm transition"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/new-arrivals"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-[#F4F4F6] px-6 py-3 text-xs font-semibold text-gray-800 hover:bg-gray-200 transition"
                >
                  <span>View New Arrivals</span>
                </Link>
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {wishlist.map((product, idx) => (
              <Reveal key={product.id} direction="up" delay={Math.min(idx * 60, 400)}>
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              </Reveal>
            ))}
          </div>
        )}

        {/* Bottom Trust Assurance Strip */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <div className="grid gap-6 sm:grid-cols-3">
            <Reveal direction="up" delay={100}>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-950">Guaranteed Authenticity</h4>
                  <p className="text-[11px] text-gray-500">Every piece certified with warranty.</p>
                </div>
              </div>
            </Reveal>

            <Reveal direction="up" delay={200}>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 shrink-0">
                  <TruckIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-950">Express Insured Air</h4>
                  <p className="text-[11px] text-gray-500">Doorstep delivery nationwide.</p>
                </div>
              </div>
            </Reveal>

            <Reveal direction="up" delay={300}>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                  <ShieldCheckIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-950">7-Day Return Privilege</h4>
                  <p className="text-[11px] text-gray-500">Hassle-free boutique exchanges.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
