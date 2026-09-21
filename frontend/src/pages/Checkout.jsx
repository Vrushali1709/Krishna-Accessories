// src/pages/Checkout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { clearCart, calculateCartSummary } from '../utils/cart';
import { createOrder, getUserAddresses } from '../utils/orderStore';
import { getCurrentUser } from '../utils/auth';
import { sendOrderConfirmationEmail } from '../utils/emailService';
import {
  ShieldCheck,
  Lock,
  ShoppingBag,
  ArrowRight,
  User,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  Sparkles,
  Banknote
} from 'lucide-react';
import { useLoading } from '../context/LoadingContext';
import BrandSpinner from '../components/BrandSpinner';

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

export default function Checkout() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [cartSummary, setCartSummary] = useState(() => calculateCartSummary());
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Online Gateway (UPI / Credit & Debit Cards / NetBanking)');

  const user = getCurrentUser();
  const savedAddresses = getUserAddresses();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    const summary = calculateCartSummary();
    setCartSummary(summary);
  }, []);

  const { cart, subtotal, discount, coupon, shipping, total } = cartSummary;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutofillProfile = () => {
    if (user) {
      setForm(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || prev.firstName,
        lastName: user.name?.split(' ').slice(1).join(' ') || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        city: user.city || prev.city,
        state: user.state || prev.state,
        pincode: user.pincode || prev.pincode
      }));
    }
  };

  const handleSelectSavedAddress = (addr) => {
    setForm(prev => ({
      ...prev,
      firstName: addr.firstName || prev.firstName,
      lastName: addr.lastName || prev.lastName,
      phone: addr.phone || prev.phone,
      address: addr.address || prev.address,
      city: addr.city || prev.city,
      state: addr.state || prev.state,
      pincode: addr.pincode || prev.pincode
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!form.firstName.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim() || !form.pincode.trim()) {
      alert('Please fill in all required contact and delivery details.');
      return;
    }

    setLoading(true);
    showLoading('Securing your order & generating consignment invoice...');

    const orderPayload = {
      customer: form,
      items: cart,
      subtotal,
      shipping,
      discount,
      total,
      paymentMethod,
    };

    const newOrder = createOrder(orderPayload);

    // Dispatch Official Order Confirmation & Invoice Email to Customer
    try {
      await sendOrderConfirmationEmail(newOrder);
    } catch (emailErr) {
      console.error('Email dispatch error:', emailErr);
    }

    setTimeout(() => {
      clearCart();
      setLoading(false);
      hideLoading();

      navigate('/order-success', {
        state: { order: newOrder }
      });
    }, 600);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
        <Navbar />
        <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200/80 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F2EB] text-[#8C6734] border border-[#C5A880]/40 mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-xl font-medium text-neutral-950">Your Bag is Empty</h1>
            <p className="mt-1 text-xs text-neutral-500">
              Please add selected timepieces or accessories before proceeding to checkout.
            </p>
            <Link
              to="/shop"
              className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#8C6734] transition-colors"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2 font-medium">
            <Link to="/" className="hover:text-neutral-950 transition">Home</Link>
            <span>/</span>
            <Link to="/cart" className="hover:text-neutral-950 transition">Bag</Link>
            <span>/</span>
            <span className="text-[#8C6734] font-semibold">Secure Checkout</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs mb-2">
                <span className="w-2 h-2 rounded-full bg-[#8C6734] animate-ping" />
                <span className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-[#8C6734]">
                  256-Bit Encrypted Settlement
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl font-medium tracking-tight text-neutral-950">
                Finalize Your Order <br className="hidden sm:inline" />
                <span className="italic font-normal text-[#8C6734]">Seamless Insured Delivery.</span>
              </h1>
            </div>

            {user && (
              <button
                type="button"
                onClick={handleAutofillProfile}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-[#C5A880]/50 bg-[#FAF8F5] text-xs font-semibold text-[#8C6734] hover:bg-[#F5F2EB] transition-colors cursor-pointer self-start sm:self-auto"
              >
                <User className="w-3.5 h-3.5" />
                <span>Autofill from Profile</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CHECKOUT FORM & REVIEW SIDEBAR                                         */}
      {/* ========================================================================= */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <form onSubmit={handlePlaceOrder}>
          <div className="grid gap-8 lg:grid-cols-12 items-start">

            {/* Left 8 Cols: Delivery Address & Payment Selector */}
            <div className="lg:col-span-8 space-y-6">

              {/* Saved Address Selection Chips (if any) */}
              {savedAddresses && savedAddresses.length > 0 && (
                <Reveal delay={0} direction="up">
                  <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs space-y-3">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8C6734] block">
                      Saved Delivery Addresses
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {savedAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => handleSelectSavedAddress(addr)}
                          className="p-3 rounded-xl border border-neutral-200/80 bg-[#FAFAFB] hover:border-[#C5A880] hover:bg-white text-left transition cursor-pointer space-y-0.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-neutral-950">{addr.label || 'Saved Destination'}</span>
                            <span className="text-[10px] text-[#8C6734] font-bold uppercase">Use This &rarr;</span>
                          </div>
                          <p className="text-[11px] text-neutral-500 truncate">{addr.address}, {addr.city}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Section 1: Customer Contact & Delivery Address Form */}
              <Reveal delay={50} direction="up">
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-5">
                  <div className="border-b border-neutral-100 pb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#8C6734]" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">Step 01</span>
                      <h2 className="font-serif text-lg font-medium text-neutral-950">Delivery &amp; Client Details</h2>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="font-semibold text-neutral-800 block mb-1">First Name <span className="text-[#8C6734]">*</span></label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={form.firstName}
                          onChange={handleChange}
                          placeholder="e.g. Rahul"
                          className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]/30 transition-all"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-neutral-800 block mb-1">Last Name <span className="text-[#8C6734]">*</span></label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={form.lastName}
                          onChange={handleChange}
                          placeholder="e.g. Patel"
                          className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]/30 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="font-semibold text-neutral-800 block mb-1">Email Address <span className="text-[#8C6734]">*</span></label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="user@example.com"
                          className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]/30 transition-all"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-neutral-800 block mb-1">Mobile Phone <span className="text-[#8C6734]">*</span></label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+91 93213 22761"
                          className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]/30 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-neutral-800 block mb-1">Street Address / Landmark <span className="text-[#8C6734]">*</span></label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={form.address}
                        onChange={handleChange}
                        placeholder="House / Flat No., Building, Street Name, Landmark"
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]/30 transition-all"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="font-semibold text-neutral-800 block mb-1">City <span className="text-[#8C6734]">*</span></label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={form.city}
                          onChange={handleChange}
                          placeholder="e.g. Mumbai"
                          className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] transition-all"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-neutral-800 block mb-1">State <span className="text-[#8C6734]">*</span></label>
                        <input
                          type="text"
                          name="state"
                          required
                          value={form.state}
                          onChange={handleChange}
                          placeholder="e.g. Maharashtra"
                          className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] transition-all"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-neutral-800 block mb-1">Pincode <span className="text-[#8C6734]">*</span></label>
                        <input
                          type="text"
                          name="pincode"
                          required
                          value={form.pincode}
                          onChange={handleChange}
                          placeholder="e.g. 400026"
                          className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Section 2: Payment Method Selector */}
              <Reveal delay={100} direction="up">
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="border-b border-neutral-100 pb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#8C6734]" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">Step 02</span>
                      <h2 className="font-serif text-lg font-medium text-neutral-950">Payment Method</h2>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Option 1: Online Gateway */}
                    <label
                      onClick={() => setPaymentMethod('Online Gateway (UPI / Credit & Debit Cards / NetBanking)')}
                      className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                        paymentMethod.includes('Online Gateway')
                          ? 'border-[#8C6734] bg-[#FAF8F5] ring-1 ring-[#8C6734]/40'
                          : 'border-neutral-200/80 bg-[#FAFAFB] hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentMethod.includes('Online Gateway')}
                        onChange={() => setPaymentMethod('Online Gateway (UPI / Credit & Debit Cards / NetBanking)')}
                        className="mt-1 accent-[#111827]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-neutral-950">Online Payment Gateway (Fast &amp; Insured)</span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">RECOMMENDED</span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Instant checkout via Google Pay, PhonePe, Paytm, Visa, Mastercard, RuPay, Amex &amp; NetBanking.
                        </p>
                      </div>
                    </label>

                    {/* Option 2: Cash on Delivery */}
                    <label
                      onClick={() => setPaymentMethod('Cash on Delivery (COD)')}
                      className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                        paymentMethod.includes('Cash on Delivery')
                          ? 'border-[#8C6734] bg-[#FAF8F5] ring-1 ring-[#8C6734]/40'
                          : 'border-neutral-200/80 bg-[#FAFAFB] hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentMethod.includes('Cash on Delivery')}
                        onChange={() => setPaymentMethod('Cash on Delivery (COD)')}
                        className="mt-1 accent-[#111827]"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-xs text-neutral-950">Cash on Delivery (COD)</span>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Pay in cash or via mobile UPI at the time of insured doorstep handover by BlueDart / Delhivery courier.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </Reveal>

            </div>

            {/* Right 4 Cols: Order Review Sticky Sidebar */}
            <div className="lg:col-span-4 sticky top-24 space-y-5">
              <Reveal delay={120} direction="left">
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm space-y-5">
                  <div className="border-b border-neutral-100 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                      Consignment Review
                    </span>
                    <h3 className="font-serif text-xl font-medium text-neutral-950 mt-0.5">
                      Order Summary ({cart.reduce((s, i) => s + (i.quantity || 1), 0)} items)
                    </h3>
                  </div>

                  {/* Items Mini List */}
                  <div className="divide-y divide-neutral-100 max-h-56 overflow-y-auto pr-1 space-y-2.5">
                    {cart.map((it, idx) => (
                      <div key={idx} className="pt-2.5 first:pt-0 flex items-center gap-3 text-xs">
                        <img
                          src={it.image}
                          alt={it.name}
                          className="h-10 w-10 rounded-lg object-contain bg-[#FAFAFB] border border-neutral-200 p-0.5 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-neutral-950 truncate">{it.name}</p>
                          <span className="text-[10px] text-neutral-500 truncate block">Qty: {it.quantity} {it.color && `&bull; ${it.color}`}</span>
                        </div>
                        <span className="font-serif font-medium text-neutral-950 shrink-0">
                          ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-2 text-xs text-neutral-600 border-t border-neutral-100 pt-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-neutral-900">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Voucher Discount</span>
                        <span>−₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Express Courier Shipping</span>
                      <span className="font-semibold text-emerald-700">
                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                      </span>
                    </div>

                    <div className="flex justify-between border-t border-neutral-200 pt-2.5 text-sm font-bold text-neutral-950">
                      <span>Grand Total</span>
                      <span className="font-serif text-lg text-neutral-950">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Place Order CTA Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#8C6734] transition-colors duration-200 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>{loading ? 'Processing Order...' : `Place Order • ₹${total.toLocaleString('en-IN')}`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Trust guarantees */}
                  <div className="pt-2 border-t border-neutral-100 space-y-1.5 text-[11px] text-neutral-500">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#8C6734] shrink-0" />
                      <span>100% Brand Official Warranty</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-[#8C6734] shrink-0" />
                      <span>Insured BlueDart Express Handover</span>
                    </div>
                  </div>

                </div>
              </Reveal>
            </div>

          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}