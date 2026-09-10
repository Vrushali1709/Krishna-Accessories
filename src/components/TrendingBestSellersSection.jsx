// src/components/TrendingBestSellersSection.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { ArrowRightIcon } from './Icons';

export default function TrendingBestSellersSection({ products = [], onAddToCart, onBuyNow }) {
  const [activeTab, setActiveTab] = useState('trending');

  const tabs = [
    { id: 'trending', label: '🔥 Trending Now', desc: 'Highest viewed and shared pieces this week' },
    { id: 'bestsellers', label: '⭐ Best Sellers', desc: 'Top purchased favorites across Mumbai boutique' },
    { id: 'luxury', label: '💎 Luxury Exclusives', desc: 'Heritage Swiss automatics & limited edition craftsmanship' },
    { id: 'toprated', label: '⚡ Top Rated (4.8+)', desc: 'Client verified 5-star perfection' }
  ];

  // Dynamically filter products according to tab
  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'bestsellers':
        return [...products]
          .sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0))
          .slice(0, 8);
      case 'luxury':
        return [...products]
          .filter(p => p.price >= 4000 || p.category === 'Watches')
          .slice(0, 8);
      case 'toprated':
        return [...products]
          .filter(p => Number(p.rating || 4.5) >= 4.8)
          .slice(0, 8);
      case 'trending':
      default:
        return products.slice(0, 8);
    }
  };

  const filteredProducts = getFilteredProducts();

  return (
    <section className="bg-white border-y border-gray-200/80 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-amber-600">
              Community Favorites
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
              Trending & Best Sellers
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-lg">
              {tabs.find(t => t.id === activeTab)?.desc}
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-900 hover:text-black hover:underline self-start md:self-auto group shrink-0"
          >
            <span>View Full Catalog</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 sm:mb-8 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 sm:px-5 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gray-950 text-white shadow-sm scale-102 font-bold'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={`${activeTab}-${product.id}`}
                product={product}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl bg-gray-50 border border-gray-200/80">
            <p className="text-sm font-semibold text-gray-700">No products found in this tab.</p>
          </div>
        )}
      </div>
    </section>
  );
}
