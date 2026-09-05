// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { clearCart, calculateCartSummary } from '../utils/cart';
import { createOrder, getUserAddresses } from '../utils/orderStore';
import { getCurrentUser } from '../utils/auth';
import { ShieldCheckIcon, LockClosedIcon, BagIcon, ArrowRightIcon } from '../components/Icons';

export default function Checkout() {
  const navigate = useNavigate();
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

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!form.firstName.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim() || !form.pincode.trim()) {
      alert('Please fill in all required contact and delivery details.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
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
      clearCart();
      setLoading(false);

      navigate('/order-success', {
        state: { order: newOrder }
      });
    }, 700);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] text-zinc-900">
        <Navbar />
        <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-800">
              <BagIcon className="w-6 h-6" />
            </div>
            <h1 className="mt-4 text-lg font-bold text-zinc-950">Your Shopping Bag is Empty</h1>
            <p className="mt-1 text-xs text-zinc-500">
              Please add selected timepieces or accessories before checking out.
            </p>
            <Link
              to="/shop"
              className="mt-5 inline-block rounded-lg bg-zinc-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black"
            >
              Browse Catalog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 overflow-x-clip">
      <Navbar />

      {/* Checkout Banner */}
      <section className="border-b border-zinc-200/80 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B89035]">
              Secure Consignment Dispatch
            </span>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
              Checkout & Delivery Details
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <LockClosedIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-12 items-start">

          {/* Left Column: Delivery Form & Payment (Span 7 or 8) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Saved Address Autofill Banner */}
            {savedAddresses.length > 0 && (
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Saved Delivery Addresses ({savedAddresses.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAutofillProfile}
                    className="text-xs font-semibold text-[#B89035] hover:underline"
                  >
                    Autofill Profile Data
                  </button>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => handleSelectSavedAddress(addr)}
                      className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100/80 hover:border-zinc-300 transition cursor-pointer text-xs space-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-900">{addr.label || 'Home'}</span>
                        {addr.isDefault && (
                          <span className="rounded bg-zinc-200 px-1.5 py-0.2 text-[9px] font-semibold text-zinc-700">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-600 font-medium">{addr.firstName} {addr.lastName}</p>
                      <p className="text-zinc-500 line-clamp-1">{addr.address}, {addr.city} {addr.pincode}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">Ph: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Delivery Address Form */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                  1. Contact & Consignment Coordinates
                </h3>
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="text-xs text-zinc-400 hover:text-zinc-700"
                >
                  Clear
                </button>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="e.g. Rahul"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="e.g. Patel"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="user@example.com"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Mobile Phone (For Courier Updates) *</label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 12345"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">Street Address / Suite / Apartment *</label>
                <textarea
                  rows={2}
                  required
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="e.g. 402, Time Center, Ring Road, Bodakdev"
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white resize-none"
                />
              </div>

              <div className="grid gap-3.5 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Ahmedabad"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">State / Province *</label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="Gujarat"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">PIN / Postal Code *</label>
                  <input
                    type="text"
                    required
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="380054"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 font-mono outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
                2. Select Settlement Method
              </h3>

              <div className="space-y-2">
                {[
                  { id: 'Online Gateway (UPI / Credit & Debit Cards / NetBanking)', label: 'Online Payment Gateway (Instant Dispatch)', desc: 'Supports Google Pay, PhonePe, Cards, NetBanking across all Indian banks.' },
                  { id: 'Cash on Delivery (COD)', label: 'Cash on Delivery (COD)', desc: 'Pay with verified cash or UPI upon courier arrival at doorstep.' }
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition cursor-pointer ${
                      paymentMethod === m.id
                        ? 'border-zinc-900 bg-zinc-50 shadow-2xs'
                        : 'border-zinc-200 bg-white hover:bg-zinc-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.id}
                      checked={paymentMethod === m.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-0.5 accent-zinc-900"
                    />
                    <div>
                      <span className="text-xs font-bold text-zinc-900 block">{m.label}</span>
                      <span className="text-[11px] text-zinc-500 block mt-0.5">{m.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Order Items & Place Order CTA (Span 4 or 5) */}
          <div className="lg:col-span-4 space-y-4">

            {/* Items in Consignment Card */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-2.5">
                Consignment Items ({cart.length})
              </h3>

              <div className="max-h-60 overflow-y-auto divide-y divide-zinc-100 pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="py-2.5 first:pt-0 flex items-center justify-between gap-3">
                    <img src={item.image} alt="" className="h-10 w-10 rounded-lg object-contain bg-zinc-50 border border-zinc-200 p-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-zinc-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-zinc-400">Qty: {item.quantity} &bull; {item.brand}</p>
                    </div>
                    <span className="text-xs font-bold text-zinc-950 font-mono shrink-0">
                      ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="border-t border-zinc-100 pt-3 space-y-2 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-zinc-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Applied Privilege Discount</span>
                    <span className="font-mono">−₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Insured Shipping</span>
                  <span className="font-mono font-semibold text-zinc-900">
                    {shipping === 0 ? <span className="text-emerald-700 font-bold uppercase text-[10px]">Free</span> : `₹${shipping}`}
                  </span>
                </div>
                <div className="border-t border-zinc-100 pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-zinc-950">Total Settlement</span>
                  <span className="text-xl font-bold font-mono text-zinc-950">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-zinc-900 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span>Securing Order Consignment...</span>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <p className="text-[10.5px] text-zinc-400 text-center leading-relaxed">
                By clicking confirm, you accept our standard client terms and insured courier dispatch protocols.
              </p>
            </div>

          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
}