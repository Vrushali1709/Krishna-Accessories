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
  const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0];

  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || defaultAddr?.firstName || 'Rahul',
    lastName: user?.name?.split(' ')[1] || defaultAddr?.lastName || 'Patel',
    email: user?.email || 'rahul.patel@example.com',
    phone: user?.phone || defaultAddr?.phone || '9876512345',
    address: defaultAddr?.address || 'B-402, Shivalik Heights, Judges Bungalow Road, Bodakdev',
    city: defaultAddr?.city || 'Ahmedabad',
    state: defaultAddr?.state || 'Gujarat',
    pincode: defaultAddr?.pincode || '380054',
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

    if (!form.firstName || !form.phone || !form.address || !form.pincode) {
      alert('Please complete all required contact and delivery details.');
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
    }, 800);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFB] text-gray-900">
        <Navbar />
        <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-800">
              <BagIcon className="w-6 h-6" />
            </div>
            <h1 className="mt-3 text-lg font-bold text-gray-950">Your Bag is Empty</h1>
            <p className="mt-1 text-xs text-gray-500">
              Please add selected timepieces or accessories before checking out.
            </p>
            <Link
              to="/shop"
              className="mt-4 inline-block rounded-full bg-[#111827] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black"
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
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900">
      <Navbar />

      {/* Checkout Header */}
      <section className="border-b border-gray-200/80 bg-white py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#B89758]">
            Encrypted 256-Bit Transaction
          </span>
          <h1 className="mt-0.5 text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
            Express Checkout
          </h1>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <form onSubmit={handlePlaceOrder} className="grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* Left Column: Form Steps */}
          <div className="space-y-4">

            {/* Step 1: Contact Information */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5 mb-3.5">
                <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#111827] text-[9.5px] font-bold text-white">
                  1
                </span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-950">
                  Client Contact Information
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-medium text-gray-700 mb-1 block">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-gray-700 mb-1 block">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-gray-700 mb-1 block">Email Address (For Invoice) *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-gray-700 mb-1 block">Mobile Number (For Courier OTP) *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Address */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#111827] text-[9.5px] font-bold text-white">
                    2
                  </span>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-950">
                    Delivery Destination
                  </h2>
                </div>

                {savedAddresses.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-[9.5px] text-gray-400 font-medium">Saved:</span>
                    {savedAddresses.map(sa => (
                      <button
                        key={sa.id}
                        type="button"
                        onClick={() => handleSelectSavedAddress(sa)}
                        className="rounded-full bg-gray-100 px-2 py-0.2 text-[9.5px] font-semibold text-gray-800 hover:bg-gray-200 transition"
                      >
                        {sa.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-gray-700 mb-1 block">Street Address / House No. / Landmark *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={form.address}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="text-[11px] font-medium text-gray-700 mb-1 block">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={form.city}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-gray-700 mb-1 block">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={form.state}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-gray-700 mb-1 block">PIN Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={form.pincode}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-3 py-1.5 text-xs font-mono text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5 mb-3.5">
                <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#111827] text-[9.5px] font-bold text-white">
                  3
                </span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-950">
                  Payment Mode Selection
                </h2>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'online', label: 'Online Gateway (UPI / Credit & Debit Cards / NetBanking)', desc: 'Instant 256-bit encrypted checkout via Razorpay / Stripe' },
                  { id: 'cod', label: 'Cash on Delivery (COD)', desc: 'Inspect parcel upon delivery before payment' },
                  { id: 'emi', label: 'No-Cost Luxury EMI (Bank Cards)', desc: 'Available on major bank cards' }
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 transition ${paymentMethod === method.label
                      ? 'border-gray-950 bg-gray-50'
                      : 'border-gray-200 bg-[#FAFAFB] hover:border-gray-300'
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.label}
                      checked={paymentMethod === method.label}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-0.5 accent-[#111827]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-gray-950 block">{method.label}</span>
                      <span className="text-[10.5px] text-gray-500 mt-0.2 block">{method.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Order Review Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs space-y-3">

              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 border-b border-gray-100 pb-2.5">
                Order Review ({cart.length})
              </h3>

              {/* Items List Preview */}
              <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between gap-2.5 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={item.image} alt="" className="h-8 w-8 rounded-lg object-contain bg-[#F4F4F6] border border-gray-200 shrink-0 p-0.5" />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-950 truncate text-[11px]">{item.name}</p>
                        <span className="text-[9.5px] text-gray-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-950 shrink-0 text-xs">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="border-t border-gray-100 pt-2.5 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({coupon})</span>
                    <span>−₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Express Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shipping === 0 ? <span className="text-emerald-700 font-bold uppercase text-[9.5px]">Free</span> : `₹${shipping}`}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-2.5 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold text-gray-950">Total Payable</span>
                    <p className="text-[9.5px] text-gray-400">Incl. all taxes</p>
                  </div>
                  <span className="text-lg font-bold text-gray-950">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#111827] py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition hover:bg-black disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <LockClosedIcon className="w-3 h-3" />
                <span>{loading ? 'Confirming...' : `Place Order (₹${total.toLocaleString('en-IN')})`}</span>
              </button>

              <div className="rounded-xl bg-gray-50 border border-gray-100 p-2.5 text-[9.5px] text-gray-500 space-y-0.5">
                <p className="flex items-center gap-1 font-semibold text-gray-800">
                  <ShieldCheckIcon className="w-3 h-3 text-emerald-600" />
                  <span>Krishna Purchase Protection</span>
                </p>
                <p>100% Genuine Certified &bull; 7-Day Return Guarantee</p>
              </div>

            </div>
          </div>

        </form>

      </main>

      <Footer />
    </div>
  );
}