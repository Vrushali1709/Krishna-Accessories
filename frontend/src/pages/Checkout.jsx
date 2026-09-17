// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { clearCart, calculateCartSummary } from '../utils/cart';
import { createOrder, getUserAddresses } from '../utils/orderStore';
import { getCurrentUser } from '../utils/auth';
import { sendOrderConfirmationEmail } from '../utils/emailService';
import { ShieldCheckIcon, LockClosedIcon, BagIcon, ArrowRightIcon } from '../components/Icons';
import { useLoading } from '../context/LoadingContext';
import BrandSpinner from '../components/BrandSpinner';
import { Reveal } from '../components/useScrollReveal';
import { Lock, Shield, CheckCircle2, Truck, CreditCard, Banknote, Landmark } from 'lucide-react';

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

  const handleClearForm = () => {
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    });
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
          <div className="w-full max-w-md rounded-2xl border border-neutral-200/90 bg-white p-8 sm:p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FAF8F5] border border-[#C5A880]/50 text-[#8C6734] mb-3">
              <BagIcon className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-2xl font-medium text-neutral-950">Your Bag is Empty</h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500">
              Please add selected timepieces or accessories before checking out.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#8C6734] transition-colors"
            >
              <span>Explore Catalog</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
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

      {/* Checkout Header */}
      <section className="border-b border-neutral-200/80 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal delay={0} direction="up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734] animate-ping" />
                  <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#8C6734]">
                    256-Bit Encrypted Checkout
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-4xl font-medium tracking-tight text-neutral-950">
                  Express <span className="italic font-normal text-[#8C6734]">Checkout</span>
                </h1>
                <p className="text-xs text-neutral-500 font-normal">
                  Provide your client delivery coordinates and preferred payment mode to confirm your purchase.
                </p>
              </div>

              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                {user && (
                  <button
                    type="button"
                    onClick={handleAutofillProfile}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#C5A880]/50 bg-[#FAF8F5] hover:bg-[#F5F2EB] px-3.5 py-2 text-xs font-semibold text-[#8C6734] transition-colors cursor-pointer"
                  >
                    <span>⚡ Autofill from Profile</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 px-3.5 py-2 text-xs font-medium text-neutral-600 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <span>Clear Form</span>
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">

        <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_390px]">

          {/* Left Column: Form Steps */}
          <div className="space-y-6">

            {/* Step 1: Contact Information */}
            <Reveal delay={50} direction="up">
              <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-950 text-xs font-semibold text-white">
                      1
                    </span>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-950">
                      Client Contact Information
                    </h2>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-medium">Personal Details</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-neutral-700 mb-1.5 block">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="e.g. Rahul"
                      value={form.firstName}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-neutral-200/90 bg-[#FAFAFB] px-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors duration-200 focus:border-[#C5A880] focus:bg-white focus:ring-1 focus:ring-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-700 mb-1.5 block">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="e.g. Patel"
                      value={form.lastName}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-neutral-200/90 bg-[#FAFAFB] px-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors duration-200 focus:border-[#C5A880] focus:bg-white focus:ring-1 focus:ring-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-700 mb-1.5 block">Email Address (For Invoice & Updates) *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. rahul.patel@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-neutral-200/90 bg-[#FAFAFB] px-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors duration-200 focus:border-[#C5A880] focus:bg-white focus:ring-1 focus:ring-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-700 mb-1.5 block">Mobile Number (For Courier Tracking) *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. +91 98765 12345"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-neutral-200/90 bg-[#FAFAFB] px-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors duration-200 focus:border-[#C5A880] focus:bg-white focus:ring-1 focus:ring-[#C5A880]"
                    />
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Step 2: Delivery Address */}
            <Reveal delay={120} direction="up">
              <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-950 text-xs font-semibold text-white">
                      2
                    </span>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-950">
                      Delivery Destination Address
                    </h2>
                  </div>

                  {savedAddresses.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-neutral-400 font-medium">Saved:</span>
                      {savedAddresses.map(sa => (
                        <button
                          key={sa.id}
                          type="button"
                          onClick={() => handleSelectSavedAddress(sa)}
                          className="rounded-md bg-[#FAF8F5] border border-[#C5A880]/40 px-2.5 py-1 text-[10.5px] font-semibold text-[#8C6734] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
                        >
                          {sa.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-neutral-700 mb-1.5 block">Street Address / House No. / Building / Landmark *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="e.g. Flat B-402, Shivalik Heights, Judges Bungalow Road"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-neutral-200/90 bg-[#FAFAFB] px-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors duration-200 focus:border-[#C5A880] focus:bg-white focus:ring-1 focus:ring-[#C5A880]"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="text-xs font-medium text-neutral-700 mb-1.5 block">City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        placeholder="e.g. Ahmedabad"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-neutral-200/90 bg-[#FAFAFB] px-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors duration-200 focus:border-[#C5A880] focus:bg-white focus:ring-1 focus:ring-[#C5A880]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-700 mb-1.5 block">State *</label>
                      <input
                        type="text"
                        name="state"
                        required
                        placeholder="e.g. Gujarat"
                        value={form.state}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-neutral-200/90 bg-[#FAFAFB] px-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors duration-200 focus:border-[#C5A880] focus:bg-white focus:ring-1 focus:ring-[#C5A880]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-700 mb-1.5 block">PIN Code *</label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        placeholder="e.g. 380054"
                        value={form.pincode}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-neutral-200/90 bg-[#FAFAFB] px-4 py-2.5 text-xs font-mono text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors duration-200 focus:border-[#C5A880] focus:bg-white focus:ring-1 focus:ring-[#C5A880]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Step 3: Payment Method */}
            <Reveal delay={180} direction="up">
              <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-950 text-xs font-semibold text-white">
                    3
                  </span>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-950">
                    Payment Mode Selection
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'online', label: 'Online Gateway (UPI / Credit & Debit Cards / NetBanking)', desc: 'Instant 256-bit encrypted checkout via Razorpay / Stripe', icon: CreditCard },
                    { id: 'cod', label: 'Cash on Delivery (COD)', desc: 'Inspect parcel upon delivery before payment', icon: Banknote },
                    { id: 'emi', label: 'No-Cost Luxury EMI (Bank Cards)', desc: 'Available on major bank credit cards', icon: Landmark }
                  ].map((method) => {
                    const isSelected = paymentMethod === method.label;
                    const IconComponent = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-all duration-200 ${
                          isSelected
                            ? 'border-[#8C6734] bg-[#FAF8F5] shadow-2xs'
                            : 'border-neutral-200/90 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.label}
                          checked={isSelected}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mt-0.5 accent-[#8C6734] h-4 w-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <IconComponent className={`w-4 h-4 ${isSelected ? 'text-[#8C6734]' : 'text-neutral-400'}`} />
                            <span className="text-xs font-semibold text-neutral-950">{method.label}</span>
                          </div>
                          <span className="text-[11px] text-neutral-500 mt-1 block leading-relaxed">{method.desc}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </Reveal>

          </div>

          {/* Right Column: Order Review Sidebar */}
          <div className="space-y-5">
            <Reveal delay={100} direction="up">
              <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-4">

                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-950 border-b border-neutral-100 pb-3 flex items-center justify-between">
                  <span>Order Review</span>
                  <span className="text-[11px] font-normal text-neutral-400 normal-case">
                    {cart.length} {cart.length === 1 ? 'item' : 'items'}
                  </span>
                </h3>

                {/* Items List Preview */}
                <div className="divide-y divide-neutral-100 max-h-52 overflow-y-auto pr-1">
                  {cart.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={item.image} alt="" className="h-9 w-9 rounded-lg object-contain bg-[#FAF8F5] border border-neutral-200/80 shrink-0 p-0.5" />
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-950 truncate text-[11px]">{item.name}</p>
                          <span className="text-[10px] text-neutral-400">Qty: {item.quantity} {item.color && `• ${item.color}`}</span>
                        </div>
                      </div>
                      <span className="font-semibold text-neutral-950 shrink-0 text-xs tabular-nums">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial Calculation */}
                <div className="border-t border-neutral-100 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-950 tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount ({typeof coupon === 'object' && coupon?.code ? coupon.code : (coupon || 'Voucher')})</span>
                      <span className="tabular-nums">−₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-600">
                    <span>Express Air Shipping</span>
                    <span className="font-semibold text-neutral-950 tabular-nums">
                      {shipping === 0 ? <span className="text-emerald-700 font-bold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Free</span> : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="border-t border-neutral-200/90 pt-3 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-semibold text-neutral-950">Total Payable</span>
                      <p className="text-[10.5px] text-neutral-400">Inclusive of all taxes</p>
                    </div>
                    <span className="font-serif text-xl sm:text-2xl font-semibold text-neutral-950 tabular-nums text-[#8C6734]">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Place Order CTA Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-neutral-950 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-sm transition-all duration-200 hover:bg-[#8C6734] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {loading ? (
                    <>
                      <BrandSpinner size="xs" variant="gold" inline={true} />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <LockClosedIcon className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Confirm &amp; Place Order (₹{total.toLocaleString('en-IN')})</span>
                    </>
                  )}
                </button>

                <div className="rounded-xl bg-[#FAF8F5] border border-neutral-200/80 p-3 text-[10.5px] text-neutral-600 space-y-1">
                  <p className="flex items-center gap-1.5 font-semibold text-neutral-950">
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-[#8C6734]" />
                    <span>The Krishna Privé Assurance</span>
                  </p>
                  <p className="text-neutral-500 pl-5 leading-relaxed">
                    Verified product quality &bull; 7-day hassle-free replacement privilege
                  </p>
                </div>

              </div>
            </Reveal>
          </div>

        </form>

      </main>

      <Footer />
    </div>
  );
}