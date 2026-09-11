// src/components/ShopByCategorySection.jsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from './useScrollReveal';
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
    const cardWidth = container.firstElementChild?.clientWidth || 160;
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
    <section className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8">
      <Reveal direction="up" delay={50}>
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-neutral-400">
              CURATED DEPARTMENTS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 mt-1">
              Shop by Category
            </h2>
          </div>

          {/* Header Right Actions (Scroll Arrows + View All Link) */}
          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-800 hover:text-black transition-colors mr-1"
            >
              <span>View All Catalog</span>
              <span className="text-sm font-bold transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            {/* Left / Right Carousel Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="flex h-8.5 w-8.5 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-2xs hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-90 cursor-pointer"
                aria-label="Previous categories"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="flex h-8.5 w-8.5 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-2xs hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-90 cursor-pointer"
                aria-label="Next categories"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Categories Smooth Scrolling Strip */}
      <Reveal direction="up" delay={120}>
        <div
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex gap-3.5 sm:gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar select-none ${
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
                className="group flex-shrink-0 w-[135px] sm:w-[155px] md:w-[165px] lg:w-[175px] flex flex-col items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-3.5 sm:p-4 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-gray-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 snap-start"
              >
                {/* Category Image */}
                <div className="w-full h-20 sm:h-24 md:h-26 flex items-center justify-center mb-2.5 overflow-hidden rounded-xl bg-neutral-50 p-2">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                  />
                </div>

                {/* Category Name & Count */}
                <div className="w-full">
                  <h3 className="font-bold text-xs sm:text-[13.5px] text-gray-950 group-hover:text-black transition-colors truncate">
                    {c.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-400 font-medium mt-0.5">
                    {count > 0 ? `${count} ${count === 1 ? 'item' : 'items'}` : 'Explore'}
                  </p>
                </div>
              </Link>
            );
          })}

          {/* All Categories / Explore More Card */}
          <Link
            to="/shop"
            onClick={handleCategoryClick}
            className="group flex-shrink-0 w-[135px] sm:w-[155px] md:w-[165px] lg:w-[175px] flex flex-col items-center justify-between rounded-2xl border border-dashed border-gray-300 bg-neutral-50/70 p-3.5 sm:p-4 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-black hover:bg-white hover:shadow-md hover:-translate-y-1 snap-start"
          >
            <div className="w-full h-20 sm:h-24 md:h-26 flex items-center justify-center mb-2.5 text-neutral-400 group-hover:text-black transition-colors">
              <div className="grid grid-cols-2 gap-1.5 p-3 rounded-xl bg-white border border-gray-200 group-hover:border-black transition-colors shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-xs bg-current"></span>
                <span className="w-2.5 h-2.5 rounded-xs bg-current"></span>
                <span className="w-2.5 h-2.5 rounded-xs bg-current"></span>
                <span className="w-2.5 h-2.5 rounded-xs bg-current"></span>
              </div>
            </div>
            <div className="w-full">
              <h3 className="font-bold text-xs sm:text-[13.5px] text-gray-950 group-hover:text-black transition-colors truncate">
                All Categories
              </h3>
              <p className="text-[11px] sm:text-xs text-neutral-400 font-medium mt-0.5">
                View Entire Shop →
              </p>
            </div>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
