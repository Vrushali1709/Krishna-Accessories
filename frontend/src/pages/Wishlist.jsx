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
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900">
      <Navbar />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-xs font-bold text-gray-900 shadow-2xl">
          <span className="text-base">🛍️</span>
          <span>{toastMessage}</span>
          <Link to="/cart" className="ml-2 rounded-full bg-[#111827] px-3 py-1 text-[11px] font-bold text-white hover:bg-black">
            View Bag
          </Link>
        </div>
      )}

      {/* Header Banner */}
      <section className="border-b border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Personal Curation
            </span>
            <h1 className="mt-1 text-2xl sm:text-4xl font-bold tracking-tight text-gray-950">
              Saved Wishlist ({wishlist.length})
            </h1>
            <p className="mt-1.5 text-xs text-gray-500">
              Your shortlisted luxury timepieces, footwear, leather goods, and tech editions.
            </p>
          </div>

          {wishlist.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleMoveAllToBag}
                className="rounded-full bg-[#111827] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-black shadow-sm transition"
              >
                Move All to Bag
              </button>
              <button
                type="button"
                onClick={clearWishlist}
                className="rounded-full border border-gray-200 bg-[#F4F4F6] px-4 py-2 text-xs font-bold text-gray-600 hover:text-red-600 hover:bg-gray-200 transition"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Wishlist Grid */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {wishlist.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500 border border-rose-100">
              <HeartIcon className="w-8 h-8" filled={false} />
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-950">Your Wishlist is Empty</h2>
            <p className="mt-1.5 max-w-sm text-xs text-gray-500 leading-relaxed">
              Explore our boutique catalog of Swiss watches, designer leather briefcases, and flagship smartphones and tap the heart icon to save favorites.
            </p>
            <Link
              to="/shop"
              className="mt-6 rounded-full bg-[#111827] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black shadow-sm"
            >
              Explore Collections &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
