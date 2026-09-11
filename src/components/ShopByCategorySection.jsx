// src/components/ShopByCategorySection.jsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

export default function ShopByCategorySection({
  categories = [],
  getProductCount
}) {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const checkScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    const maxScroll = scrollWidth - clientWidth;
    setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
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
    const cardWidth = container.firstElementChild?.clientWidth || 180;
    const scrollAmount = (cardWidth + 16) * 3;
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
    <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8 relative">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5 sm:mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-700/90 mb-1">
            <span className="text-amber-500">✦</span>
            <span>Curated Collections</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
            Shop by Category
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-xl">
            Explore handcrafted timepieces, genuine leather, audio &amp; curated luxury essentials.
          </p>
        </div>

        {/* Action Controls (View All + Navigation Arrows) */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 hover:text-black transition-colors mr-1"
          >
            <span>View All</span>
            <span className="text-xs text-gray-400 font-normal">({categories.length})</span>
            <ArrowRightIcon className="w-3.5 h-3.5 text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-2xs hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
              aria-label="Previous categories"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-2xs hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
              aria-label="Next categories"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Track */}
      <div
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((c) => {
          const count = getProductCount ? getProductCount(c.name) : 0;
          return (
            <Link
              key={c.name}
              to={`/shop?category=${encodeURIComponent(c.name)}`}
              onClick={handleCategoryClick}
              className="group relative flex-shrink-0 w-[150px] sm:w-[172px] md:w-[188px] lg:w-[200px] p-2 sm:p-2.5 rounded-2xl sm:rounded-[20px] bg-white border border-gray-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:border-gray-300 transition-all duration-300 hover:-translate-y-1 snap-start flex flex-col justify-between"
            >
              {/* Image Frame with Badges */}
              <div className="relative w-full aspect-square overflow-hidden rounded-xl sm:rounded-[15px] bg-[#F4F3F0]">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108 pointer-events-none"
                />

                {/* Subtle gradient overlay on hover */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Inset Count Badge (Top-Left) */}
                <div className="absolute top-2 left-2 pointer-events-none">
                  <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9.5px] sm:text-[10px] font-medium text-white border border-white/15 shadow-2xs">
                    {count > 0 ? `${count} ${count === 1 ? 'item' : 'items'}` : 'Top rated'}
                  </span>
                </div>

                {/* Inset Hover Arrow Circle (Top-Right) */}
                <div className="absolute top-2 right-2 pointer-events-none">
                  <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-gray-900 border border-black/5 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 shadow-2xs">
                    <svg
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-900 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5L19.5 4.5m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="pt-2 sm:pt-2.5 pb-0.5 px-0.5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-[13px] sm:text-[14px] font-bold text-gray-900 tracking-tight group-hover:text-black transition-colors truncate">
                    {c.name}
                  </h3>
                  <p className="text-[10px] sm:text-[10.5px] text-gray-400 font-normal truncate mt-0.5">
                    {c.tag || c.description}
                  </p>
                </div>

                {/* Subtle Explore Footer Link */}
                <div className="mt-2 pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10.5px] sm:text-[11px] font-semibold text-gray-600 group-hover:text-black transition-colors">
                  <span>Explore</span>
                  <span className="text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition-all duration-200">
                    →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Minimal Scroll Progress Indicator for Desktop */}
      <div className="hidden sm:flex items-center justify-center mt-3">
        <div className="h-1 w-28 rounded-full bg-gray-200/80 overflow-hidden">
          <div
            className="h-full bg-neutral-800 rounded-full transition-all duration-150"
            style={{ width: `${Math.max(15, scrollProgress)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
