// src/pages/Cart.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  calculateCartSummary,
  applyCoupon,
  removeCoupon,
  clearCart,
  AVAILABLE_COUPONS,
  FREE_SHIPPING_THRESHOLD
} from '../utils/cart';
import {
  ShoppingBag,
  Trash2,
  Tag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Check,
  Plus,
  Minus,
  Lock
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

export default function Cart() {
  const navigate = useNavigate();
  const [cartSummary, setCartSummary] = useState(() => calculateCartSummary());
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);

  const refreshCart = () => {
    const summary = calculateCartSummary();
    setCartSummary(summary);
  };

  useEffect(() => {
    refreshCart();
    window.addEventListener('cartUpdated', refreshCart);
    window.addEventListener('storage', refreshCart);
    return () => {
      window.removeEventListener('cartUpdated', refreshCart);
      window.removeEventListener('storage', refreshCart);
    };
  }, []);

  const { cart, subtotal, discount, coupon, shipping, total, freeShippingDifference, qualifiesForFreeShipping } = cartSummary;

  const handleQuantityChange = (item, newQty) => {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty <= 0) {
      handleRemove(item);
      return;
    }
    updateCartQuantity(item.id, item.color || '', item.variant || '', qty, item.size || '');
  };

  const handleRemove = (item) => {
    removeFromCart(item.id, item.color || '', item.variant || '', item.size || '');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all items from your bag?')) {
      clearCart();
      setCouponMsg(null);
    }
  };

  const handleApplyCoupon = async (e, explicitCode = null) => {
    if (e) e.preventDefault();
    setCouponMsg(null);
    const codeToApply = (explicitCode || couponCodeInput || '').trim();
    if (!codeToApply) {
      setCouponMsg({ type: 'error', text: 'Please enter a valid voucher code.' });
      return;
    }

    const res = await applyCoupon(codeToApply, subtotal);
    if (res.success) {
      const discountVal = res.discount ? `₹${res.discount.toLocaleString('en-IN')} saved` : '';
      setCouponMsg({
        type: 'success',
        text: `✓ ${res.message} ${discountVal ? `(${discountVal})` : ''}`
      });
      setCouponCodeInput('');
    } else {
      setCouponMsg({ type: 'error', text: res.message });
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponMsg({ type: 'info', text: 'Voucher removed from order.' });
    setTimeout(() => setCouponMsg(null), 3000);
  };

  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const couponCodeString = typeof coupon === 'object' && coupon?.code ? coupon.code : (typeof coupon === 'string' ? coupon : '');
  const totalItemCount = cart.reduce((s, i) => s + (i.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

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

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3 font-medium">
            <Link to="/" className="hover:text-neutral-950 transition">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-neutral-950 transition">Catalog</Link>
            <span>/</span>
            <span className="text-[#8C6734] font-semibold">Shopping Bag</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              {/* Eyebrow Badge with Pulse */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs mb-2">
                <span className="w-2 h-2 rounded-full bg-[#8C6734] animate-ping" />
                <span className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-[#8C6734]">
                  Boutique Bag &amp; Reservation
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl font-medium tracking-tight text-neutral-950">
                Your Shopping Bag{' '}
                <span className="italic font-normal text-[#8C6734]">
                  ({totalItemCount} {totalItemCount === 1 ? 'Piece' : 'Pieces'})
                </span>
              </h1>
            </div>

            {cart.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-200 bg-white text-xs font-semibold text-neutral-600 hover:text-rose-600 hover:border-rose-300 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Empty Bag</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. BAG CONTENTS & ORDER SUMMARY                                           */}
      {/* ========================================================================= */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        {cart.length === 0 ? (
          /* Empty Bag State */
          <Reveal delay={0} direction="up">
            <div className="mx-auto max-w-md rounded-2xl border border-neutral-200/80 bg-white py-16 px-6 text-center shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#F5F2EB] text-[#8C6734] flex items-center justify-center mx-auto mb-4 border border-[#C5A880]/40">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl font-medium text-neutral-950 mb-2">
                Your Bag is Currently Empty
              </h2>
              <p className="text-xs text-neutral-500 leading-relaxed mb-6 max-w-sm mx-auto">
                Discover our curated selections of luxury Swiss timepieces, handcrafted Italian leather, sneakers, and modern audio accessories.
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
          <div className="grid gap-8 lg:grid-cols-12 items-start">

            {/* Left 8 Cols: Free Shipping Bar + Items List + Promo Coupons */}
            <div className="lg:col-span-8 space-y-6">

              {/* Free Shipping Progress Indicator */}
              <Reveal delay={0} direction="up">
                <div className="rounded-xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-semibold text-neutral-900">
                      <Truck className="w-4 h-4 text-[#8C6734]" />
                      <span>
                        {qualifiesForFreeShipping
                          ? '🎉 You have unlocked complimentary insured express delivery!'
                          : `Add ₹${freeShippingDifference?.toLocaleString('en-IN')} more to unlock FREE Express Delivery`}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-[#8C6734] bg-[#F5F2EB] px-2 py-0.5 rounded-sm border border-[#C5A880]/40">
                      {progressToFreeShipping}%
                    </span>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#C5A880] to-[#8C6734] transition-all duration-500 rounded-full"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>
              </Reveal>

              {/* Cart Items List */}
              <div className="space-y-3.5">
                {cart.map((item, index) => (
                  <Reveal key={`${item.id}-${item.color || ''}-${item.variant || ''}-${item.size || ''}`} delay={index * 40} direction="up">
                    <div className="group rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-2xs transition-all duration-300 hover:border-[#C5A880]/60 hover:shadow-md flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                      
                      {/* Product Thumbnail */}
                      <Link
                        to={`/product/${item.id}`}
                        className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl bg-[#FAFAFB] border border-neutral-200/80 p-2 flex items-center justify-center shrink-0 overflow-hidden"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>

                      {/* Item Details */}
                      <div className="flex-1 text-center sm:text-left min-w-0 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6734]">
                          {item.brand || 'Krishna Verified'}
                        </span>
                        <Link
                          to={`/product/${item.id}`}
                          className="block font-serif text-base sm:text-lg font-medium text-neutral-950 hover:text-[#8C6734] transition-colors truncate"
                        >
                          {item.name}
                        </Link>

                        {/* Variants / Color / Size Chips */}
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-0.5 text-[11px] text-neutral-500">
                          {item.color && (
                            <span className="px-2 py-0.5 rounded bg-[#FAFAFB] border border-neutral-200">
                              Color: {item.color}
                            </span>
                          )}
                          {item.size && (
                            <span className="px-2 py-0.5 rounded bg-[#FAFAFB] border border-neutral-200">
                              Size: {item.size}
                            </span>
                          )}
                          {item.variant && (
                            <span className="px-2 py-0.5 rounded bg-[#FAFAFB] border border-neutral-200">
                              Edition: {item.variant}
                            </span>
                          )}
                        </div>

                        {/* Price Breakdown */}
                        <div className="pt-1 flex items-baseline justify-center sm:justify-start gap-2">
                          <span className="font-serif text-sm font-medium text-neutral-950">
                            ₹{Number(item.price).toLocaleString('en-IN')}
                          </span>
                          {item.oldPrice && item.oldPrice > item.price && (
                            <span className="text-xs text-neutral-400 line-through">
                              ₹{Number(item.oldPrice).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper & Remove */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                        <span className="font-serif text-base sm:text-lg font-medium text-neutral-950 tabular-nums">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>

                        <div className="flex items-center gap-3">
                          {/* Stepper */}
                          <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-white">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item, item.quantity - 1)}
                              className="px-2.5 py-1 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-l-lg transition cursor-pointer text-xs"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 py-1 text-xs font-semibold text-neutral-900 tabular-nums min-w-[28px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item, item.quantity + 1)}
                              className="px-2.5 py-1 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-r-lg transition cursor-pointer text-xs"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleRemove(item)}
                            className="text-neutral-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-rose-50 transition cursor-pointer"
                            title="Remove piece from bag"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </Reveal>
                ))}
              </div>

              {/* Available Promo Vouchers Strip */}
              <Reveal delay={100} direction="up">
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
                    <Tag className="w-4 h-4 text-[#8C6734]" />
                    <span>Exclusive Concierge Vouchers Available</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {AVAILABLE_COUPONS.map((cpn) => (
                      <button
                        key={cpn.code}
                        type="button"
                        onClick={(e) => handleApplyCoupon(e, cpn.code)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          couponCodeString === cpn.code
                            ? 'border-[#8C6734] bg-[#FAF8F5] ring-1 ring-[#8C6734]'
                            : 'border-neutral-200/80 bg-[#FAFAFB] hover:border-[#C5A880] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-[#8C6734] uppercase tracking-wider">
                            {cpn.code}
                          </span>
                          {couponCodeString === cpn.code && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                              APPLIED
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-600 mt-1 font-medium">{cpn.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </Reveal>

            </div>

            {/* Right 4 Cols: Order Summary Sticky Card */}
            <div className="lg:col-span-4 sticky top-24 space-y-5">
              <Reveal delay={150} direction="left">
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm space-y-5">
                  <div className="border-b border-neutral-100 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                      Checkout Summary
                    </span>
                    <h3 className="font-serif text-xl font-medium text-neutral-950 mt-0.5">
                      Order Breakdown
                    </h3>
                  </div>

                  {/* Voucher Application Form */}
                  <div>
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        placeholder="Enter voucher code"
                        className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-mono uppercase tracking-wider text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] transition-all"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C6734] transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>

                    {couponMsg && (
                      <div className={`mt-2 text-xs font-semibold p-2 rounded-lg ${
                        couponMsg.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : couponMsg.type === 'error'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {couponMsg.text}
                      </div>
                    )}

                    {couponCodeString && (
                      <div className="mt-2 flex items-center justify-between text-xs bg-[#FAF8F5] border border-[#C5A880]/40 p-2 rounded-lg">
                        <span className="font-mono font-bold text-[#8C6734]">{couponCodeString} Applied</span>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-rose-600 hover:underline font-semibold cursor-pointer text-[11px]"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Summary Rows */}
                  <div className="space-y-2.5 text-xs text-neutral-600 border-t border-neutral-100 pt-4">
                    <div className="flex justify-between">
                      <span>Bag Subtotal ({totalItemCount} pieces)</span>
                      <span className="font-semibold text-neutral-900">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Voucher Savings</span>
                        <span>−₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Insured Express Shipping</span>
                      <span className="font-semibold text-emerald-700">
                        {shipping === 0 ? 'FREE COMPLIMENTARY' : `₹${shipping}`}
                      </span>
                    </div>

                    <div className="flex justify-between border-t border-neutral-200 pt-3 text-sm font-bold text-neutral-950">
                      <span>Total Amount</span>
                      <span className="font-serif text-lg text-neutral-950">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => navigate('/checkout')}
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#8C6734] transition-colors duration-200 shadow-sm cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Proceed to Secure Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Trust Micro-Badges */}
                  <div className="pt-2 border-t border-neutral-100 space-y-2 text-[11px] text-neutral-500">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#8C6734] shrink-0" />
                      <span>100% Quality &amp; Authenticity Guaranteed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-3.5 h-3.5 text-[#8C6734] shrink-0" />
                      <span>7-Day Inspection &amp; Replacement Policy</span>
                    </div>
                  </div>

                </div>
              </Reveal>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}