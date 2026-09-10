// src/components/CustomerReviewsSection.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

const DEFAULT_REVIEWS = [
  {
    id: 1,
    name: 'Aarav Mehta',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    product: 'Titan Edge Ceramic Chronograph',
    text: 'Ordered the Titan Edge Ceramic. The packaging was immaculate with the official warranty card stamped. Genuine showroom experience delivered directly to my doorstep in South Mumbai!',
    date: 'Verified Buyer • 2 days ago'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    product: 'Hidesign Genuine Leather Tote',
    text: 'The quality of the leather bag is absolutely top-notch. Fast same-day pickup from their Haji Ali store. 100% authentic product and the support team was super helpful with live tracking.',
    date: 'Verified Buyer • 4 days ago'
  },
  {
    id: 3,
    name: 'Rohan Patel',
    location: 'Surat, Gujarat',
    rating: 5,
    product: 'Sony WH-1000XM5 Headphones',
    text: 'Got the Sony noise-cancelling headphones at a fantastic discount with instant coupon KRISHNA10. 100% original product with serial number verified on Sony portal.',
    date: 'Verified Buyer • 1 week ago'
  },
  {
    id: 4,
    name: 'Ananya Iyer',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    product: 'Ray-Ban Aviator Polarized',
    text: 'Best luxury shopping experience in India! The sunglasses arrived in pristine condition with microfiber cloth, leather case, and authenticity certificate. Very impressed!',
    date: 'Verified Buyer • 1 week ago'
  },
  {
    id: 5,
    name: 'Vikram Desai',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    product: 'Fossil Automatic Masterpiece',
    text: 'Visited their Heera Panna store in Haji Ali first, then ordered online for an anniversary gift. Seamless checkout, insured express logistics, and truly premium curation.',
    date: 'Verified Buyer • 2 weeks ago'
  },
  {
    id: 6,
    name: 'Neha Verma',
    location: 'Delhi NCR',
    rating: 5,
    product: 'Nike Air Jordan 1 Retro',
    text: 'Finding 100% verified authentic sneakers online is tough, but Krishna Accessories delivers genuine goods with zero hassle. Will definitely recommend to friends!',
    date: 'Verified Buyer • 2 weeks ago'
  },
  {
    id: 7,
    name: 'Harsh Joshi',
    location: 'Vadodara, Gujarat',
    rating: 5,
    product: 'Casio Edifice Sapphire',
    text: 'Super fast dispatch by BlueDart. The watch is gorgeous and came with all official tags, box, and invoice. 7-day peace-of-mind guarantee gives real confidence.',
    date: 'Verified Buyer • 3 weeks ago'
  }
];

export default function CustomerReviewsSection({ reviews = DEFAULT_REVIEWS }) {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Check scroll boundary
  const checkScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft: sLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(sLeft > 10);
    setCanScrollRight(sLeft < scrollWidth - clientWidth - 10);

    const cardWidth = carouselRef.current.firstElementChild?.clientWidth || 320;
    const gap = 16;
    const index = Math.round(sLeft / (cardWidth + gap));
    setActiveIndex(Math.min(Math.max(index, 0), reviews.length - 1));
  }, [reviews.length]);

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
  }, [checkScroll]);

  // Smooth scroll handler
  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cardWidth = container.firstElementChild?.clientWidth || 320;
    const scrollAmount = cardWidth + 16;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Scroll directly to a specific slide index
  const scrollToIndex = (index) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cardWidth = container.firstElementChild?.clientWidth || 320;
    const gap = 16;
    container.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth'
    });
  };

  // Autoplay functionality with pause on hover
  useEffect(() => {
    if (isPaused || isDragging) return;
    const timer = setInterval(() => {
      if (!carouselRef.current) return;
      const { scrollLeft: sLeft, scrollWidth, clientWidth } = carouselRef.current;
      if (sLeft >= scrollWidth - clientWidth - 20) {
        carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollCarousel('right');
      }
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, isDragging]);

  // Drag to scroll handlers
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
    if (Math.abs(walk) > 4) setHasMoved(true);
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setIsDragging(false);
      }}
    >
      {/* Section Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400">
            Customer Stories
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Loved by Our Customers
          </h2>
        </div>

        {/* Rating Score & Navigation Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="flex items-center gap-2 rounded-full border border-gray-200/90 bg-white px-3.5 py-1.5 shadow-2xs">
            <span className="flex items-center gap-0.5 text-xs text-[#B48A4A]">
              {'★'.repeat(5)}
            </span>
            <span className="text-xs font-semibold text-gray-700">
              4.9 / 5 customer experience
            </span>
          </div>

          {/* Carousel Arrows */}
          
        </div>
      </div>

      {/* Carousel Track */}
      <div
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reviews.map((review, idx) => (
          <div
            key={review.id || review.name || idx}
            className="flex-shrink-0 w-[290px] sm:w-[340px] md:w-[380px] lg:w-[390px] snap-start flex flex-col justify-between rounded-[22px] border border-gray-200/90 bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1"
          >
            <div>
              {/* Top Row: Stars + Verified Badge */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-sm text-[#B48A4A]">
                  {'★'.repeat(review.rating || 5)}
                </div>
                {review.product && (
                  <span className="truncate max-w-[170px] text-[9.5px] font-medium text-amber-800/90 bg-amber-50 border border-amber-200/60 rounded-full px-2 py-0.5">
                    {review.product}
                  </span>
                )}
              </div>

              {/* Review Text */}
              <p className="mt-4 text-sm leading-6 text-gray-600 font-normal">
                “{review.text}”
              </p>
            </div>

            {/* Author Footer */}
            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-[13px] font-bold text-gray-950">
                    {review.name}
                  </h3>
                  <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.2 rounded">✓ Verified</span>
                </div>
                <p className="mt-0.5 text-[10px] sm:text-[10.5px] text-gray-400">
                  {review.location}
                </p>
              </div>

              {/* Avatar Initial with Stylish Gradient */}
              <span className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-xs font-bold text-gray-800 border border-gray-200 shadow-2xs">
                {review.name.charAt(0)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Progress Indicator Dots */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {reviews.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to review ${i + 1}`}
            className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
              i === activeIndex
                ? 'w-6 bg-gray-900'
                : 'w-1.5 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
