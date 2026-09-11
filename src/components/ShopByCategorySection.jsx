// src/components/ShopByCategorySection.jsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from './useScrollReveal';
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from './Icons';

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
    const { scrollLeft: sLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(sLeft > 10);
    setCanScrollRight(sLeft < scrollWidth - clientWidth - 10);
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
    const cardWidth = container.firstElementChild?.clientWidth || 240;
    const scrollAmount = (cardWidth + 20) * 2;
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
    <section className="w-full bg-[#FAFAFB] pt-8 sm:pt-10 pb-8 sm:pb-12 border-b border-gray-200/70 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ============================================================
            1. SECTION HEADER WITH ALIGNED ACTION BUTTONS
        ============================================================ */}
        <Reveal direction="up" delay={50}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 sm:mb-9">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.28em] text-[#9E8362]">
                  CURATED DEPARTMENTS
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-950 mt-1">
                Shop by Category
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-xl leading-relaxed">
                Browse our handcrafted collections across certified luxury, tech, and lifestyle essentials.
              </p>
            </div>

            {/* Header Right Actions (All Categories Button + Carousel Nav Arrows) */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-start sm:self-auto">
              {/* All Categories Button */}
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-300 px-4 sm:px-5 py-2 text-xs font-bold text-gray-950 shadow-2xs transition-all duration-300 hover:border-gray-950 hover:bg-gray-50 active:scale-95 cursor-pointer"
                title="View All Categories in Catalog"
              >
                <span>All Categories</span>
                <ArrowRightIcon className="w-3.5 h-3.5 text-gray-700" />
              </Link>

              {/* Left / Right Carousel Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-2xs hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-90 cursor-pointer"
                  aria-label="Previous categories"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-2xs hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-90 cursor-pointer"
                  aria-label="Next categories"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ============================================================
            2. CATEGORIES CARDS STRIP WITH "ALL CATEGORIES" FINAL BUTTON CARD
        ============================================================ */}
        <Reveal direction="up" delay={120}>
          <div
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar select-none ${
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
                  className="group flex-shrink-0 w-[205px] sm:w-[235px] md:w-[255px] lg:w-[270px] flex flex-col justify-between rounded-[22px] sm:rounded-[26px] border border-gray-200/90 bg-white p-3.5 sm:p-4 shadow-[0_4px_18px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-neutral-400 hover:shadow-[0_16px_36px_rgba(0,0,0,0.09)] hover:-translate-y-1.5 snap-start"
                >
                  {/* Category Image Box */}
                  <div className="relative w-full h-36 sm:h-44 md:h-48 overflow-hidden rounded-2xl bg-[#F4F5F7] mb-3.5">
                    <img
                      src={c.image}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Item Count / Tag Pill */}
                    <span className="absolute top-2.5 right-2.5 rounded-full bg-black/65 backdrop-blur-md px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-white border border-white/10 shadow-xs">
                      {count > 0 ? `${count} Products` : 'Curated'}
                    </span>
                  </div>

                  {/* Category Details */}
                  <div className="flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-bold text-base sm:text-[17px] text-gray-950 group-hover:text-black transition-colors leading-snug">
                        {c.name}
                      </h3>
                      {c.description && (
                        <p className="mt-1 text-xs text-neutral-500 line-clamp-1 leading-relaxed">
                          {c.description}
                        </p>
                      )}
                    </div>

                    {/* Action Link Footer */}
                    <div className="mt-3.5 flex items-center justify-between pt-3 border-t border-gray-100 text-neutral-400 group-hover:text-black transition-colors">
                      <span className="text-[11.5px] sm:text-xs font-bold uppercase tracking-wider text-neutral-600 group-hover:text-neutral-950">
                        Explore Collection
                      </span>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold transition-all duration-300 group-hover:bg-black group-hover:text-white group-hover:translate-x-0.5">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* All Categories / Browse Everything Card (Aligned Matching Size) */}
            <Link
              to="/shop"
              onClick={handleCategoryClick}
              className="group flex-shrink-0 w-[205px] sm:w-[235px] md:w-[255px] lg:w-[270px] flex flex-col justify-between rounded-[22px] sm:rounded-[26px] border-2 border-dashed border-gray-300 bg-white p-3.5 sm:p-4 text-center shadow-[0_4px_18px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-black hover:bg-neutral-50/50 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 snap-start"
            >
              <div className="w-full h-36 sm:h-44 md:h-48 flex flex-col items-center justify-center rounded-2xl bg-[#F8F9FA] border border-gray-200 mb-3.5 group-hover:border-black transition-colors p-4">
                <div className="grid grid-cols-2 gap-2 p-3.5 rounded-2xl bg-white shadow-2xs group-hover:bg-neutral-950 transition-colors text-neutral-700 group-hover:text-white">
                  <span className="w-3.5 h-3.5 rounded-sm bg-current"></span>
                  <span className="w-3.5 h-3.5 rounded-sm bg-current"></span>
                  <span className="w-3.5 h-3.5 rounded-sm bg-current"></span>
                  <span className="w-3.5 h-3.5 rounded-sm bg-current"></span>
                </div>
                <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 group-hover:text-neutral-900">
                  Full Catalog
                </span>
              </div>

              <div className="flex flex-col flex-grow justify-between text-left">
                <div>
                  <h3 className="font-bold text-base sm:text-[17px] text-gray-950 group-hover:text-black transition-colors">
                    All Categories
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 line-clamp-1">
                    Discover 11+ departments &amp; brands
                  </p>
                </div>

                <div className="mt-3.5 flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-[11.5px] sm:text-xs font-bold uppercase tracking-wider text-neutral-600 group-hover:text-neutral-950">
                    Browse Everything
                  </span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold transition-all duration-300 group-hover:bg-black group-hover:text-white group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
