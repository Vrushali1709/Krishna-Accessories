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

    const res = applyCoupon(couponCodeInput.trim(), subtotal);
    if (res.success) {
      setCouponMsg({ type: 'success', text: `✓ ${res.message} (₹${res.discount.toLocaleString('en-IN')} off)` });
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
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
      <Navbar />

      {/* Cart Banner */}
      <section className="border-b border-gray-200/80 bg-white py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#B89758]">
            Shopping Bag Overview
          </span>
          <h1 className="mt-0.5 text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
            Your Selected Editions ({cart.length})
          </h1>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {cart.length === 0 ? (
          /* Empty Bag State */
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-gray-200/80 bg-white p-8 text-center shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-800">
              <BagIcon className="w-6 h-6" />
            </div>
            <h2 className="mt-3 text-lg font-bold text-gray-950">Your Bag is Empty</h2>
            <p className="mt-1 max-w-sm text-xs text-gray-500 leading-relaxed">
              Explore our boutique catalog of certified Swiss timepieces, leather goods, and footwear.
            </p>
            <Link
              to="/shop"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#111827] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition hover:bg-black"
            >
              <span>Explore Catalog</span>
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          /* 2-Column Cart Grid */
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

            {/* Left Column: Items List & Free Shipping Meter */}
            <div className="space-y-4 min-w-0">

              {/* Free Shipping Progress Indicator */}
              <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                  <div className="flex items-center gap-1.5 font-semibold text-gray-900 truncate">
                    <TruckIcon className="w-3.5 h-3.5 text-gray-900 shrink-0" />
                    {remainingForFreeShipping > 0 ? (
                      <span className="truncate">
                        Add <strong className="text-[#B89758]">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> more for Free Express Shipping
                      </span>
                    ) : (
                      <span className="text-emerald-700 truncate">✓ Unlocked Free Express Shipping!</span>
                    )}
                  </div>
                  <span className="text-[9.5px] font-semibold text-gray-400 shrink-0">{progressToFreeShipping}%</span>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-[#111827]"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs divide-y divide-gray-100">
                {cart.map((item, idx) => {
                  const itemColor = item.color || item.selectedColor;
                  const itemVariant = item.variant || item.selectedVariant;
                  return (
                    <div key={`${item.id}-${itemColor || ''}-${itemVariant || ''}-${idx}`} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                      {/* Item Details */}
                      <div className="flex items-center gap-3 min-w-0">
                        <Link to={`/product/${item.id}`} className="aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F4F4F6] p-1.5 border border-gray-200/80 flex items-center justify-center">
                          <img src={item.image} alt={item.name} className="h-full w-full object-contain mix-blend-multiply transition-transform hover:scale-105" />
                        </Link>

                        <div className="min-w-0 pr-1">
                          <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 truncate block">
                            {item.brand}
                          </span>
                          <Link to={`/product/${item.id}`} className="font-semibold text-xs text-gray-950 hover:underline block truncate max-w-[200px] sm:max-w-xs">
                            {item.name}
                          </Link>

                          {(itemColor || itemVariant) && (
                            <p className="text-[10.5px] text-gray-500 mt-0.5 truncate">
                              {itemColor && <span>Color: <strong className="text-gray-700">{itemColor}</strong> </span>}
                              {itemVariant && <span>&bull; Size: <strong className="text-gray-700">{itemVariant}</strong></span>}
                            </p>
                          )}

                          <span className="text-xs font-bold text-gray-950 mt-0.5 block">
                            ₹{Number(item.price).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Stepper & Subtotal */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50 shrink-0">
                        <div className="flex items-center rounded-full border border-gray-200 bg-[#F4F4F6]">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            className="flex h-7 w-7 sm:h-6 sm:w-6 items-center justify-center text-xs font-bold text-gray-700 hover:text-black transition"
                            title="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            className="flex h-7 w-7 sm:h-6 sm:w-6 items-center justify-center text-xs font-bold text-gray-700 hover:text-black transition"
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right min-w-[85px]">
                          <span className="text-xs font-bold text-gray-950 block">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemove(item)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-500 hover:text-rose-700 hover:underline transition mt-0.5"
                            title="Remove from bag"
                          >
                            <TrashIcon className="w-3 h-3 text-rose-500" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right Column: Coupon & Order Financial Summary */}
            <div className="space-y-4">

              {/* Coupon Voucher Form */}
              <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
                  Voucher Privé Code
                </span>

                {coupon ? (
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-800 font-semibold gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <TagIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{coupon} Applied (10% Off)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[11px] text-emerald-900 hover:underline font-bold shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      placeholder="e.g. KRISHNA10"
                      className="flex-1 rounded-full border border-gray-200 bg-[#F4F4F6] px-3.5 py-1.5 text-xs text-gray-900 uppercase placeholder:normal-case outline-none focus:border-gray-400 focus:bg-white min-w-0"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-[#111827] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black transition shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponMsg && (
                  <p className={`mt-1.5 text-[10.5px] font-semibold truncate ${couponMsg.type === 'success' ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {couponMsg.text}
                  </p>
                )}

                <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10.5px] text-gray-400">
                  <span>Code: <strong className="text-gray-800 font-mono">KRISHNA10</strong></span>
                  <span>10% off &gt; ₹1,000</span>
                </div>
              </div>

              {/* Order Summary Card */}
              <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 border-b border-gray-100 pb-2.5">
                  Summary Total
                </h3>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount ({coupon})</span>
                      <span>−₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Express Air Shipping</span>
                    <span className="font-semibold text-gray-900">
                      {shipping === 0 ? <span className="text-emerald-700 font-bold uppercase text-[9.5px]">Free</span> : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-2.5 flex justify-between items-baseline">
                    <div>
                      <span className="text-xs font-bold text-gray-950">Total Amount</span>
                      <p className="text-[9.5px] text-gray-400">Incl. all taxes</p>
                    </div>
                    <span className="text-lg font-bold text-gray-950">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-[#111827] py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition hover:bg-black"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRightIcon className="w-3 h-3" />
                </Link>

                <div className="rounded-xl bg-gray-50 border border-gray-100 p-2.5 text-[9.5px] text-gray-500 space-y-0.5">
                  <p className="flex items-center gap-1 font-semibold text-gray-800">
                    <ShieldCheckIcon className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Krishna Certified Protection</span>
                  </p>
                  <p>100% Genuine &bull; 7-Day Return Guarantee</p>
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