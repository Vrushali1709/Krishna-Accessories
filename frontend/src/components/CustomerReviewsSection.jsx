// src/components/CustomerReviewsSection.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Reveal } from './useScrollReveal';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

const DEFAULT_REVIEWS = [
  {
    id: 1,
    name: 'Aarav Mehta',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    category: 'Luxury Watches',
    product: 'Titan Edge Ceramic Chronograph',
    text: 'Ordered the Titan Edge Ceramic watch. The packaging was immaculate with the brand warranty card. Premium showroom experience delivered directly to my doorstep in South Mumbai!',
    date: 'Verified Buyer • 2 days ago'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    category: 'Leather Handbags',
    product: 'Hidesign Genuine Leather Tote',
    text: 'The quality of the leather bag is absolutely top-notch. Fast same-day pickup from their Heera Panna, Haji Ali store. Top quality product and the concierge team was super helpful.',
    date: 'Verified Buyer • 4 days ago'
  },
  {
    id: 3,
    name: 'Rohan Patel',
    location: 'Surat, Gujarat',
    rating: 5,
    category: 'Audio & Gadgets',
    product: 'Sony WH-1000XM5 Noise Cancelling',
    text: 'Got the Sony flagship headphones at a fantastic price using code KRISHNA10. Exceptional quality product with verified product details and serial barcode.',
    date: 'Verified Buyer • 1 week ago'
  },
  {
    id: 4,
    name: 'Ananya Iyer',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    category: 'Designer Eyewear',
    product: 'Ray-Ban Aviator Classic Polarized',
    text: 'Best luxury shopping experience in India! The sunglasses arrived in pristine condition with leather case, microfiber cloth, and warranty seal. Truly impressed!',
    date: 'Verified Buyer • 1 week ago'
  },
  {
    id: 5,
    name: 'Vikram Desai',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    category: 'Automatic Watches',
    product: 'Fossil Heritage Automatic Masterpiece',
    text: 'Visited their Heera Panna store in Haji Ali first, then ordered online for an anniversary gift. Seamless checkout, express insured delivery, and genuinely high-end curation.',
    date: 'Verified Buyer • 2 weeks ago'
  },
  {
    id: 6,
    name: 'Neha Verma',
    location: 'Delhi NCR',
    rating: 5,
    category: 'Luxury Fragrance',
    product: 'Dior Sauvage Eau De Parfum',
    text: 'Finding trusted premium designer perfumes online can be tough, but Krishna Accessories delivers verified quality bottles with batch code verification. Top marks!',
    date: 'Verified Buyer • 2 weeks ago'
  },
  {
    id: 7,
    name: 'Harsh Joshi',
    location: 'Vadodara, Gujarat',
    rating: 5,
    category: 'Chronograph Watches',
    product: 'Casio Edifice Sapphire Chronograph',
    text: 'Super fast dispatch by BlueDart. The watch is gorgeous and came with brand tags, luxury presentation box, and tax invoice. 7-day peace-of-mind guarantee gives complete confidence.',
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
    }, 5000);

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
      className="relative w-full floor-velvet-lounge py-14 sm:py-20 border-b border-neutral-800/90 text-white select-none overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setIsDragging(false);
      }}
    >
      {/* Subtle Inset Ambient Light */}
      <div className="pointer-events-none absolute -top-40 right-1/3 h-96 w-96 rounded-full bg-[#C5A880]/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal direction="up" delay={50}>
          <div className="mb-8 sm:mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-1.5 w-6 rounded-full bg-[#C5A880]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D5C2A5]">
                  VERIFIED CLIENT EXPERIENCES
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-1">
                Client Voices &amp; Testimonials
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-400 max-w-xl font-light leading-relaxed">
                Real experiences from distinguished clients who trust Krishna Accessories for prestige products and boutique service.
              </p>
            </div>

            {/* Rating Score & Navigation Controls */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-[#121622] px-4 py-2 shadow-lg">
                <span className="flex items-center gap-0.5 text-xs text-amber-400">
                  {'★'.repeat(5)}
                </span>
                <span className="text-xs font-bold text-white">
                  4.9 / 5 <span className="text-neutral-400 font-normal hidden sm:inline">(2,840+ verified reviews)</span>
                </span>
              </div>

              {/* Left / Right Navigation Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollCarousel('left')}
                  disabled={!canScrollLeft}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#121622] text-white shadow-md hover:bg-white hover:text-black hover:border-white transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-90 cursor-pointer"
                  aria-label="Previous review"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel('right')}
                  disabled={!canScrollRight}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#121622] text-white shadow-md hover:bg-white hover:text-black hover:border-white transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-90 cursor-pointer"
                  aria-label="Next review"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Carousel Track */}
        <Reveal direction="up" delay={120}>
          <div
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex gap-4 sm:gap-6 overflow-x-auto pt-3 pb-8 sm:pt-4 sm:pb-9 snap-x snap-mandatory scroll-smooth no-scrollbar select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reviews.map((review, idx) => (
              <div
                key={review.id || review.name || idx}
                className="flex-shrink-0 w-[295px] sm:w-[350px] md:w-[390px] snap-start flex flex-col justify-between rounded-3xl border border-white/10 bg-[#121724]/95 backdrop-blur-md p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.4)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] hover:border-[#C5A880]/70 hover:-translate-y-2 relative"
              >
                <div>
                  {/* Top Row: Stars + Category/Product Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-sm text-amber-400">
                      {'★'.repeat(review.rating || 5)}
                    </div>
                    {review.product && (
                      <span className="truncate max-w-[190px] text-[10px] font-bold text-[#E5D7C5] bg-white/10 border border-white/10 rounded-full px-2.5 py-0.5">
                        {review.product}
                      </span>
                    )}
                  </div>

                  {/* Review Quote Text */}
                  <p className="mt-5 text-xs sm:text-sm leading-relaxed text-neutral-300 font-normal">
                    “{review.text}”
                  </p>
                </div>

                {/* Author Footer */}
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-[14px] font-bold text-white">
                        {review.name}
                      </h3>
                      <span className="text-[9.5px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <span>✓</span> Verified
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] sm:text-[11.5px] text-neutral-400">
                      {review.location}
                    </p>
                  </div>

                  {/* Avatar Initial with Stylish Gold Border */}
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1C2333] to-[#0A0D15] text-xs font-black text-[#C5A880] border border-[#C5A880]/40 shadow-md shrink-0">
                    {review.name.charAt(0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Slide Progress Indicator Dots */}
        <div className="mt-2 flex items-center justify-center gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to review ${i + 1}`}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                i === activeIndex
                  ? 'w-8 bg-[#C5A880]'
                  : 'w-2 bg-neutral-700 hover:bg-neutral-500'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
