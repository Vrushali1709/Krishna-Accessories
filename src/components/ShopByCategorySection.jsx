// src/components/ShopByCategorySection.jsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

export default function ShopByCategorySection({
  categories = [],
  getProductCount
}) {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const checkScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, categories]);

  const scroll = (direction) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cardWidth = container.firstElementChild?.clientWidth || 150;
    const scrollAmount = (cardWidth + 14) * 3;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleMouseDown = (e) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) setHasMoved(true);
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCategoryClick = (e) => {
    if (hasMoved) {
      e.preventDefault();
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
          Shop by Category
        </h2>

        {/* Header Right Actions (Scroll Arrows + View All Link) */}
        <div className="flex items-center gap-3">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors mr-1"
          >
            <span>View All Categories</span>
            <span className="text-sm font-bold transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </Link>

          {/* Left / Right Carousel Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-2xs hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
              aria-label="Previous categories"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-2xs hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
              aria-label="Next categories"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Smooth Scrolling Strip */}
      <div
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex gap-3 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((c) => {
          const count = getProductCount
            ? getProductCount(c.targetCategory || c.name)
            : 0;
          return (
            <Link
              key={c.name}
              to={`/shop?category=${encodeURIComponent(c.targetCategory || c.name)}`}
              onClick={handleCategoryClick}
              className="group flex-shrink-0 w-[130px] sm:w-[145px] md:w-[155px] lg:w-[165px] flex flex-col items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-3 sm:p-3.5 md:p-4 text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 snap-start"
            >
              {/* Isolated Product Cutout Image */}
              <div className="w-full h-18 sm:h-20 md:h-22 flex items-center justify-center mb-2">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-108 pointer-events-none"
                />
              </div>

              {/* Category Name & Exact Dynamic Count */}
              <div className="w-full">
                <h3 className="font-bold text-xs sm:text-[13px] md:text-sm text-gray-950 group-hover:text-blue-600 transition-colors truncate">
                  {c.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-400 font-normal mt-0.5">
                  {count > 0 ? `${count} ${count === 1 ? 'item' : 'items'}` : '0 items'}
                </p>
              </div>
            </Link>
          );
        })}

        {/* 12th Card: All Categories / Explore More */}
        <Link
          to="/shop"
          onClick={handleCategoryClick}
          className="group flex-shrink-0 w-[130px] sm:w-[145px] md:w-[155px] lg:w-[165px] flex flex-col items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-3 sm:p-3.5 md:p-4 text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 snap-start"
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
            <h3 className="font-bold text-xs sm:text-[13px] md:text-sm text-gray-950 group-hover:text-blue-600 transition-colors truncate">
              All Categories
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-400 font-normal mt-0.5">
              Explore all
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
