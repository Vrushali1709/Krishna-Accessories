// src/pages/Wishlist.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getWishlist, clearWishlist } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import {
  Heart,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Trash2,
  ShieldCheck,
  Award
} from 'lucide-react';

// =========================================================================
// CUSTOM ANIMATION HOOK: Intersection Observer for on-scroll reveals
// =========================================================================
function useInView(options = { threshold: 0.1, triggerOnce: true }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (options.triggerOnce) {
          observer.unobserve(entry.target);
        }
      }
    }, options);

    const currentElem = ref.current;
    if (currentElem) observer.observe(currentElem);

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [options.threshold, options.triggerOnce]);

  return [ref, inView];
}

function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  threshold = 0.08
}) {
  const [ref, inView] = useInView({ threshold, triggerOnce: true });

  const getTransform = () => {
    if (inView) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 24px, 0)';
      case 'down':
        return 'translate3d(0, -24px, 0)';
      case 'left':
        return 'translate3d(24px, 0, 0)';
      case 'right':
        return 'translate3d(-24px, 0, 0)';
      case 'zoom':
        return 'scale(0.97)';
      default:
        return 'translate3d(0, 20px, 0)';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
}

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
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleBuyNow = (product) => {
    addToCart(product, 1, '', '');
    navigate('/checkout');
  };

  const handleMoveAllToBag = () => {
    wishlist.forEach(p => addToCart(p, 1, '', ''));
    setToastMessage(`✓ Moved ${wishlist.length} item(s) to your bag`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-neutral-200 bg-white/95 backdrop-blur-md px-4 py-3.5 text-xs font-semibold shadow-2xl animate-fade-in">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5F2EB] text-[#8C6734] border border-[#C5A880]/40 text-[11px] font-bold">
            ✓
          </span>
          <span className="text-neutral-800">{toastMessage}</span>
          <Link
            to="/cart"
            className="ml-2 rounded-md bg-neutral-950 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#C5A880] hover:text-white hover:bg-neutral-800 transition-colors"
          >
            View Bag
          </Link>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HERO BANNER (Luxury Editorial Header Matching About & New Arrivals)    */}
      {/* ========================================================================= */}
      <section className="relative bg-white border-b border-neutral-200/80 overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            <div className="space-y-3">
              {/* Eyebrow Badge with Pulse */}
              <Reveal delay={0} direction="up">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#8C6734] animate-ping" />
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8C6734]">
                    Personal Curation
                  </span>
                </div>
              </Reveal>

              {/* Editorial Serif Heading */}
              <Reveal delay={100} direction="up">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-medium tracking-tight text-neutral-950 leading-[1.15]">
                  Saved Wishlist <br />
                  <span className="italic font-normal text-[#8C6734]">
                    ({wishlist.length} {wishlist.length === 1 ? 'Curated Piece' : 'Curated Pieces'})
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={180} direction="up">
                <p className="text-xs sm:text-sm text-neutral-600 font-normal max-w-xl">
                  Your shortlisted luxury timepieces, handcrafted leather goods, footwear, and consumer tech accessories.
                </p>
              </Reveal>
            </div>

            {/* Top Wishlist Actions */}
            {wishlist.length > 0 && (
              <Reveal delay={200} direction="left">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleMoveAllToBag}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#8C6734] transition-colors duration-200 shadow-sm cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Move All to Bag</span>
                  </button>

                  <button
                    type="button"
                    onClick={clearWishlist}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md border border-neutral-300 bg-white text-xs font-semibold uppercase tracking-wider text-neutral-700 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/50 transition-colors duration-200 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>
              </Reveal>
            )}

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. WISHLIST PRODUCTS GRID OR EMPTY STATE                                  */}
      {/* ========================================================================= */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:py-14 sm:px-6 lg:px-8">
        {wishlist.length === 0 ? (
          /* Luxury Empty State */
          <Reveal delay={50} direction="up">
            <div className="mx-auto max-w-md rounded-2xl border border-neutral-200/80 bg-white py-16 px-6 text-center shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#F5F2EB] text-[#8C6734] flex items-center justify-center mx-auto mb-4 border border-[#C5A880]/40">
                <Heart className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl font-medium text-neutral-950 mb-2">
                Your Wishlist is Empty
              </h2>
              <p className="text-xs text-neutral-500 leading-relaxed mb-6 max-w-sm mx-auto">
                Explore our curated boutique catalog of verified luxury watches, Italian leather goods, sneakers, and modern electronics and tap the heart icon on any product to save it.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#8C6734] transition-colors duration-200 shadow-sm"
              >
                <span>Explore Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {wishlist.map((product, index) => (
              <Reveal key={product.id} delay={Math.min(index * 40, 300)} direction="up">
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              </Reveal>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
