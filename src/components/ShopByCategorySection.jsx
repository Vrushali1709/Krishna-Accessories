// src/components/ShopByCategorySection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function ShopByCategorySection({
  categories = [],
  getProductCount
}) {
  if (!categories || categories.length === 0) return null;

  // Curated list for the 8-card showcase matching the reference UI
  const displayCategories = categories.slice(0, 7);

  return (
    <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4 mb-3.5 sm:mb-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
          Shop by Category
        </h2>

        <Link
          to="/shop"
          className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
        >
          <span>View All Categories</span>
          <span className="text-sm font-bold transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>

      {/* 8-Card Clean Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3 md:gap-3.5">
        {displayCategories.map((c) => {
          const count = getProductCount
            ? getProductCount(c.targetCategory || c.name)
            : 0;
          return (
            <Link
              key={c.name}
              to={`/shop?category=${encodeURIComponent(c.targetCategory || c.name)}`}
              className="group flex flex-col items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-3 sm:p-3.5 md:p-4 text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Isolated Product Cutout Image */}
              <div className="w-full h-18 sm:h-20 md:h-22 flex items-center justify-center mb-2">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-108"
                />
              </div>

              {/* Title & Count */}
              <div className="w-full">
                <h3 className="font-bold text-xs sm:text-[13px] md:text-sm text-gray-950 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {c.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-400 font-normal mt-0.5">
                  {c.itemCount || (count > 0 ? `${count}+ Items` : '80+ Items')}
                </p>
              </div>
            </Link>
          );
        })}

        {/* 8th Card: Accessories / Explore More */}
        <Link
          to="/shop"
          className="group flex flex-col items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-3 sm:p-3.5 md:p-4 text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="w-full h-18 sm:h-20 md:h-22 flex items-center justify-center mb-2 text-gray-400 group-hover:text-blue-600 transition-colors">
            <div className="grid grid-cols-2 gap-1.5 p-2 rounded-xl bg-gray-50 border border-gray-100 group-hover:bg-blue-50/70 group-hover:border-blue-100 transition-colors">
              <span className="w-2.5 h-2.5 rounded-sm border-2 border-current"></span>
              <span className="w-2.5 h-2.5 rounded-sm border-2 border-current"></span>
              <span className="w-2.5 h-2.5 rounded-sm border-2 border-current"></span>
              <span className="w-2.5 h-2.5 rounded-sm border-2 border-current"></span>
            </div>
          </div>
          <div className="w-full">
            <h3 className="font-bold text-xs sm:text-[13px] md:text-sm text-gray-950 group-hover:text-blue-600 transition-colors">
              Accessories
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-400 font-normal mt-0.5">
              Explore more
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
