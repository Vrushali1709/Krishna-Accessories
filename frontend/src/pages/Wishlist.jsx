// src/pages/Wishlist.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getWishlist, clearWishlist } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { HeartIcon, BagIcon, ArrowRightIcon } from '../components/Icons';
import { Heart, Sparkles, Trash2, ShoppingBag } from 'lucide-react';
import { Reveal } from '../components/useScrollReveal';

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

  const handleAddToCart = (product) => {
    addToCart(product, 1, '', '');
    setToastMessage(`✓ Added "${product.name}" to your bag`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleBuyNow = (product) => {
    addToCart(product, 1, '', '');
    navigate('/checkout');
  };

  const handleMoveAllToBag = () => {
    wishlist.forEach(p => addToCart(p, 1, '', ''));
    setToastMessage(`✓ Moved ${wishlist.length} item(s) to your bag`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-5 py-3.5 text-xs font-semibold text-neutral-900 shadow-2xl animate-slide-up">
          <span className="text-base text-[#8C6734]">🛍️</span>
          <span>{toastMessage}</span>
          <Link to="/cart" className="ml-2 rounded-lg bg-neutral-950 px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#8C6734] transition-colors">
            View Bag
          </Link>
        </div>
      )}

      {/* Header Banner */}
      <section className="border-b border-neutral-200/80 bg-white py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal delay={0} direction="up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734] animate-ping" />
                  <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#8C6734]">
                    Personal Privé Curation
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-4xl font-medium tracking-tight text-neutral-950">
                  Saved <span className="italic font-normal text-[#8C6734]">Wishlist</span> <span className="text-neutral-400 text-lg sm:text-2xl font-normal font-sans">({wishlist.length})</span>
                </h1>
                <p className="text-xs text-neutral-500 font-normal">
                  Your shortlisted luxury timepieces, footwear, leather goods, and tech editions.
                </p>
              </div>

              {wishlist.length > 0 && (
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handleMoveAllToBag}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#8C6734] transition-colors shadow-sm cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move All to Bag</span>
                  </button>
                  <button
                    type="button"
                    onClick={clearWishlist}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Main Wishlist Grid */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        {wishlist.length === 0 ? (
          <Reveal delay={50} direction="up">
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-neutral-200/90 bg-white p-8 sm:p-12 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#8C6734] border border-[#C5A880]/50 mb-3 shadow-2xs">
                <Heart className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl font-medium text-neutral-950">Your Wishlist is Empty</h2>
              <p className="mt-2 max-w-md text-xs sm:text-sm text-neutral-500 leading-relaxed font-normal">
                Explore our boutique catalog of Swiss watches, designer leather briefcases, and flagship smartphones and tap the heart icon to save favorites.
              </p>
              <Link
                to="/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#8C6734] transition-colors shadow-sm"
              >
                <span>Explore Collections</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={50} direction="up">
            <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlist.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          </Reveal>
        )}
      </main>

      <Footer />
    </div>
  );
}
