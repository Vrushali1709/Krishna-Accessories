// src/pages/Cart.jsx
import React, { useState, useEffect } from 'react';
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
  getAppliedCoupon,
  FREE_SHIPPING_THRESHOLD
} from '../utils/cart';
import { ShieldCheckIcon, TruckIcon, TagIcon, ArrowRightIcon, BagIcon, TrashIcon } from '../components/Icons';

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
    return () => window.removeEventListener('cartUpdated', refreshCart);
  }, []);

  const { cart, subtotal, discount, coupon, shipping, total } = cartSummary;

  const handleQuantityChange = (item, newQty) => {
    if (newQty <= 0) {
      handleRemove(item);
      return;
    }
    updateCartQuantity(item.id, item.color || item.selectedColor || '', item.variant || item.selectedVariant || '', newQty);
  };

  const handleRemove = (item) => {
    removeFromCart(item.id, item.color || item.selectedColor || '', item.variant || item.selectedVariant || '');
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponMsg(null);
    if (!couponCodeInput.trim()) return;

    const res = applyCoupon(couponCodeInput.trim());
    if (res.success) {
      setCouponMsg({ type: 'success', text: `✓ ${res.message}` });
      setCouponCodeInput('');
    } else {
      setCouponMsg({ type: 'error', text: res.message });
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponMsg(null);
  };

  const progressToFreeShipping = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 overflow-x-clip">
      <Navbar />

      {/* Cart Banner */}
      <section className="border-b border-zinc-200/80 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B89035]">
            Shopping Bag Overview
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            Your Selected Editions ({cart.length})
          </h1>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {cart.length === 0 ? (
          /* Empty Bag State */
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-zinc-200/80 bg-white p-8 text-center shadow-xs">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-800">
              <BagIcon className="w-6 h-6" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-zinc-950">Your Shopping Bag is Empty</h2>
            <p className="mt-1 max-w-sm text-xs text-zinc-500 leading-relaxed">
              Explore our boutique catalog of certified Swiss horology, handcrafted leather briefcases, and footwear.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition hover:bg-black"
            >
              <span>Explore Catalog</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          /* 2-Column Cart Grid */
          <div className="grid gap-8 lg:grid-cols-12 items-start">

            {/* Left Column: Items List & Free Shipping Meter (Span 7 or 8) */}
            <div className="lg:col-span-8 space-y-4 min-w-0">

              {/* Free Shipping Progress Indicator */}
              <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between text-xs mb-2 gap-2">
                  <div className="flex items-center gap-2 font-semibold text-zinc-900 truncate">
                    <TruckIcon className="w-4 h-4 text-zinc-900 shrink-0" />
                    {remainingForFreeShipping > 0 ? (
                      <span className="truncate">
                        Add <strong className="text-[#B89035] font-mono">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> more for Free Express Shipping
                      </span>
                    ) : (
                      <span className="text-emerald-700 truncate">✓ Unlocked Free Express Air Shipping!</span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 font-mono shrink-0">{progressToFreeShipping}%</span>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-zinc-900"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-6 shadow-xs divide-y divide-zinc-100">
                {cart.map((item, idx) => {
                  const itemColor = item.color || item.selectedColor;
                  const itemVariant = item.variant || item.selectedVariant;
                  return (
                    <div key={`${item.id}-${itemColor || ''}-${itemVariant || ''}-${idx}`} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                      {/* Item Details */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <Link to={`/product/${item.id}`} className="aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-50 p-2 border border-zinc-200/80 flex items-center justify-center">
                          <img src={item.image} alt={item.name} className="h-full w-full object-contain mix-blend-multiply transition-transform hover:scale-105" />
                        </Link>

                        <div className="min-w-0 space-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">{item.brand}</span>
                          <Link to={`/product/${item.id}`} className="text-xs sm:text-sm font-bold text-zinc-950 hover:text-black line-clamp-1 block">
                            {item.name}
                          </Link>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-500 flex-wrap">
                            {itemColor && <span>Edition: <strong className="text-zinc-700">{itemColor}</strong></span>}
                            {itemVariant && <span>Spec: <strong className="text-zinc-700">{itemVariant}</strong></span>}
                            <span>SKU: <strong className="font-mono text-zinc-600">{item.sku || `KA-${item.id}`}</strong></span>
                          </div>
                          <span className="text-xs font-bold text-zinc-950 font-mono block pt-1 sm:hidden">
                            ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Stepper and Price Row */}
                      <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                        
                        {/* Quantity Stepper */}
                        <div className="flex items-center rounded-lg border border-zinc-200 bg-white">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            className="px-2.5 py-1 text-xs font-bold text-zinc-600 hover:text-zinc-950"
                          >
                            −
                          </button>
                          <span className="px-2.5 py-1 text-xs font-bold font-mono text-zinc-950 min-w-[28px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            className="px-2.5 py-1 text-xs font-bold text-zinc-600 hover:text-zinc-950"
                          >
                            +
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="hidden sm:block text-right min-w-[90px]">
                          <span className="text-sm font-bold text-zinc-950 font-mono block">
                            ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-[10.5px] text-zinc-400 font-mono block">
                              ₹{Number(item.price).toLocaleString('en-IN')} each
                            </span>
                          )}
                        </div>

                        {/* Remove Action */}
                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          aria-label="Remove item"
                          className="text-zinc-400 hover:text-rose-600 p-1.5 transition cursor-pointer"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right Column: Order Summary & Promo Code (Span 4) */}
            <div className="lg:col-span-4 space-y-4">

              {/* Promo Coupon Card */}
              <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                  <TagIcon className="w-3.5 h-3.5 text-zinc-700" />
                  <span>Promo / Privé Code</span>
                </span>

                {coupon ? (
                  <div className="flex items-center justify-between rounded-lg bg-amber-50 p-2.5 border border-amber-200 text-xs">
                    <div>
                      <p className="font-bold text-amber-900 font-mono">{coupon.code}</p>
                      <p className="text-[10px] text-amber-700">{coupon.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs font-bold text-rose-600 hover:underline ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. KRISHNA10"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-mono uppercase text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-black transition shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponMsg && (
                  <p className={`text-[11px] font-medium ${couponMsg.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {couponMsg.text}
                  </p>
                )}

                <div className="text-[10.5px] text-zinc-400 pt-1">
                  Try test codes: <strong className="font-mono text-zinc-700">KRISHNA10</strong> (10% off) &bull; <strong className="font-mono text-zinc-700">LUXURY500</strong> (₹500 off)
                </div>
              </div>

              {/* Summary Breakdown Card */}
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
                  Consignment Summary
                </h3>

                <div className="space-y-2 text-xs text-zinc-600">
                  <div className="flex justify-between">
                    <span>Bag Subtotal</span>
                    <span className="font-mono font-semibold text-zinc-950">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Privé Discount</span>
                      <span className="font-mono font-bold">−₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Express Air Shipping</span>
                    <span className="font-mono font-semibold text-zinc-950">
                      {shipping === 0 ? <span className="text-emerald-700 font-bold uppercase text-[10px]">Free</span> : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="border-t border-zinc-100 pt-3 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-zinc-950">Grand Total</span>
                    <span className="text-xl font-bold font-mono text-zinc-950 tracking-tight">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black transition shadow-xs cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>

                <div className="space-y-2 pt-2 border-t border-zinc-100 text-[10.5px] text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                    <span>256-Bit SSL Encrypted & RBI Gateway Compliant</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TruckIcon className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                    <span>Insured Transit Dispatch & Full Tracking</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}