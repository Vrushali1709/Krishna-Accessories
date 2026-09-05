// src/pages/Wishlist.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getWishlist, clearWishlist } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { HeartIcon, BagIcon, ArrowRightIcon } from '../components/Icons';

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
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 overflow-x-clip">
      <Navbar />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-900 shadow-xl animate-slide-up max-w-[calc(100vw-32px)]">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs">✓</span>
          <span className="truncate">{toastMessage}</span>
          <Link to="/cart" className="ml-1 rounded-md bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-black transition shrink-0">
            View Bag
          </Link>
        </div>
      )}

      {/* Header Banner */}
      <section className="border-b border-zinc-200/80 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B89035]">
              Personal Luxury Curation
            </span>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-sans">
              Saved Wishlist ({wishlist.length})
            </h1>
            <p className="mt-1 text-xs text-zinc-500">
              Your shortlisted luxury horology, footwear, leather goods, and tech editions.
            </p>
          </div>

          {wishlist.length > 0 && (
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleMoveAllToBag}
                className="rounded-lg bg-zinc-900 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black shadow-xs transition"
              >
                Move All to Bag
              </button>
              <button
                type="button"
                onClick={clearWishlist}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-rose-600 hover:bg-zinc-50 transition shadow-2xs"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Wishlist Grid */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {wishlist.length === 0 ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-zinc-200/80 bg-white p-8 text-center shadow-xs space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500 border border-rose-100">
              <HeartIcon className="w-7 h-7" filled={false} />
            </div>
            <h2 className="text-lg font-bold text-zinc-950">Your Wishlist is Empty</h2>
            <p className="max-w-sm text-xs text-zinc-500 leading-relaxed">
              Explore our boutique catalog of Swiss watches, designer leather briefcases, and smartphones and tap the heart icon to save favorites.
            </p>
            <Link
              to="/shop"
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black shadow-xs transition"
            >
              <span>Explore Collections</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {wishlist.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
