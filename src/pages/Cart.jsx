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
  clearCart,
  AVAILABLE_COUPONS,
  FREE_SHIPPING_THRESHOLD
} from '../utils/cart';
import {
  ShieldCheckIcon,
  TruckIcon,
  TagIcon,
  ArrowRightIcon,
  BagIcon,
  TrashIcon
} from '../components/Icons';

export default function Cart() {
  const navigate = useNavigate();
  const [cartSummary, setCartSummary] = useState(() => calculateCartSummary());
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);
  const [clearingCart, setClearingCart] = useState(false);

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
    updateCartQuantity(item.id, item.color || '', item.variant || '', item.size || '', qty);
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

  const handleApplyCoupon = (e, explicitCode = null) => {
    if (e) e.preventDefault();
    setCouponMsg(null);
    const codeToApply = (explicitCode || couponCodeInput || '').trim();
    if (!codeToApply) {
      setCouponMsg({ type: 'error', text: 'Please enter a valid voucher code.' });
      return;
    }

    const res = applyCoupon(codeToApply, subtotal);
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

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
      <Navbar />

      {/* Breadcrumb & Cart Header */}
      <section className="border-b border-gray-200/80 bg-white py-5 sm:py-7">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5 font-medium">
            <Link to="/" className="hover:text-gray-950 transition">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-gray-950 transition">Catalog</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Shopping Bag</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B89758]">
                Boutique Cart & Selection
              </span>
              <h1 className="mt-0.5 text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
                Your Shopping Bag ({cart.reduce((s, i) => s + (i.quantity || 1), 0)} {cart.length === 1 && cart[0]?.quantity === 1 ? 'item' : 'items'})
              </h1>
            </div>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-semibold text-gray-400 hover:text-rose-600 transition flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                <span>Empty Bag</span>
              </button>
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">

        {cart.length === 0 ? (
          /* Empty Bag State */
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-gray-200/80 bg-white p-8 text-center shadow-xs">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-800 mb-2">
              <BagIcon className="w-8 h-8" />
            </div>
            <h2 className="mt-3 text-xl font-bold text-gray-950">Your Shopping Bag is Empty</h2>
            <p className="mt-1.5 max-w-md text-xs sm:text-sm text-gray-500 leading-relaxed">
              Explore our curated boutique collection of certified Swiss timepieces, handcrafted Italian leather, designer footwear, and modern electronics.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-black"
              >
                <span>Explore Full Catalog</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/new-arrivals"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-[#F4F4F6] px-5 py-2.5 text-xs font-semibold text-gray-800 transition hover:bg-gray-200"
              >
                <span>Season New Arrivals</span>
              </Link>
            </div>
          </div>
        ) : (
          /* 2-Column Cart Grid */
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_390px]">

            {/* Left Column: Items List & Free Shipping Meter */}
            <div className="space-y-4 min-w-0">

              {/* Free Shipping Progress Indicator */}
              <div className="rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-2xs">
                <div className="flex items-center justify-between text-xs mb-2 gap-2">
                  <div className="flex items-center gap-2 font-semibold text-gray-900 truncate">
                    <TruckIcon className="w-4 h-4 text-[#B89758] shrink-0" />
                    {freeShippingDifference > 0 ? (
                      <span className="truncate text-xs">
                        Add <strong className="text-[#B89758] font-bold">₹{freeShippingDifference.toLocaleString('en-IN')}</strong> more for <strong className="text-gray-950">Free Express Air Shipping</strong>
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <span>✓</span> Unlocked Complimentary Express Shipping!
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 shrink-0">{progressToFreeShipping}%</span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${qualifiesForFreeShipping ? 'bg-emerald-600' : 'bg-[#111827]'}`}
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items List Table Card */}
              <div className="rounded-3xl border border-gray-200/80 bg-white p-4 sm:p-6 shadow-xs divide-y divide-gray-100">
                <div className="pb-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Product Details ({cart.length} unique items)
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hidden sm:block">
                    Quantity & Subtotal
                  </span>
                </div>

                {cart.map((item, idx) => {
                  const itemColor = (item.color || item.selectedColor || '').trim();
                  const itemVariant = (item.variant || item.selectedVariant || '').trim();
                  const itemSize = (item.size || item.selectedSize || '').trim();
                  const lineTotal = (Number(item.price) || 0) * (item.quantity || 1);

                  return (
                    <div
                      key={`${item.id}-${itemColor}-${itemVariant}-${itemSize}-${idx}`}
                      className="py-4 sm:py-5 first:pt-4 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >

                      {/* Item Image & Description */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <Link
                          to={`/product/${item.id}`}
                          className="aspect-square h-20 w-20 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-2xl bg-[#F6F7F9] p-2 border border-gray-200/80 flex items-center justify-center group"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80';
                              }}
                              className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-108"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs font-semibold">
                              KA
                            </div>
                          )}
                        </Link>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-gray-400 truncate">
                              {item.brand || 'Krishna Essentials'}
                            </span>
                            {item.category && (
                              <span className="rounded-full bg-gray-100 px-2 py-0.2 text-[9px] font-semibold text-gray-600">
                                {item.category}
                              </span>
                            )}
                          </div>

                          <Link
                            to={`/product/${item.id}`}
                            className="font-semibold text-xs sm:text-sm text-gray-950 hover:underline block truncate mt-0.5"
                            title={item.name}
                          >
                            {item.name}
                          </Link>

                          {/* Selected Color, Size & Variant Spec Chips */}
                          {(itemColor || itemVariant || itemSize) && (
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {itemColor && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-[#F4F4F6] border border-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-700">
                                  <span>Color:</span>
                                  <strong className="font-semibold text-gray-900">{itemColor}</strong>
                                </span>
                              )}
                              {itemSize && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-[#F4F4F6] border border-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-700">
                                  <span>Size:</span>
                                  <strong className="font-semibold text-gray-900">{itemSize}</strong>
                                </span>
                              )}
                              {itemVariant && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-[#F4F4F6] border border-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-700">
                                  <span>Edition:</span>
                                  <strong className="font-semibold text-gray-900">{itemVariant}</strong>
                                </span>
                              )}
                            </div>
                          )}

                          {/* Price Display */}
                          <div className="flex items-baseline gap-2 mt-1.5">
                            <span className="text-xs sm:text-sm font-bold text-gray-950">
                              ₹{Number(item.price).toLocaleString('en-IN')}
                            </span>
                            {item.oldPrice && item.oldPrice > item.price && (
                              <span className="text-[10px] text-gray-400 line-through">
                                ₹{Number(item.oldPrice).toLocaleString('en-IN')}
                              </span>
                            )}
                            <span className="text-[9.5px] text-gray-400 font-mono">
                              (SKU: {item.sku || `KA-${item.id}`})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stepper + Subtotal + Remove */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0">

                        {/* Quantity Counter */}
                        <div className="flex items-center rounded-full border border-gray-200 bg-[#F4F4F6] p-0.5 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item, (item.quantity || 1) - 1)}
                            className="flex h-7 w-7 sm:h-7 sm:w-7 items-center justify-center rounded-full text-xs font-bold text-gray-700 hover:bg-white hover:text-black hover:shadow-2xs transition active:scale-95 cursor-pointer"
                            title="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-950">
                            {item.quantity || 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item, (item.quantity || 1) + 1)}
                            className="flex h-7 w-7 sm:h-7 sm:w-7 items-center justify-center rounded-full text-xs font-bold text-gray-700 hover:bg-white hover:text-black hover:shadow-2xs transition active:scale-95 cursor-pointer"
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Line Total & Remove Action */}
                        <div className="text-right min-w-[95px]">
                          <span className="text-xs sm:text-sm font-bold text-gray-950 block tabular-nums">
                            ₹{lineTotal.toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemove(item)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-700 hover:underline transition mt-0.5 cursor-pointer"
                            title="Remove item"
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

              {/* Bottom Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-black transition"
                >
                  <span>&larr;</span>
                  <span>Continue Shopping Catalog</span>
                </Link>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>🔒 256-bit Secure Checkout</span>
                  <span>•</span>
                  <span>📦 Doorstep Insured Delivery</span>
                </div>
              </div>

            </div>

            {/* Right Column: Coupon & Order Financial Summary */}
            <div className="space-y-4">

              {/* Coupon Voucher Form & Recommendations */}
              <div className="rounded-3xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 block">
                    Voucher Privé Code
                  </span>
                  <TagIcon className="w-3.5 h-3.5 text-amber-600" />
                </div>

                {couponCodeString ? (
                  <div className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 font-semibold gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-bold">✓</span>
                      <div className="truncate">
                        <p className="font-bold truncate text-emerald-950">{couponCodeString} Applied</p>
                        <p className="text-[10.5px] text-emerald-700 font-normal">
                          {discount > 0 ? `₹${discount.toLocaleString('en-IN')} instant savings applied` : 'Active voucher'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[11px] text-rose-600 hover:text-rose-800 font-bold hover:underline shrink-0 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleApplyCoupon(e)} className="flex gap-1.5">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      placeholder="e.g. KRISHNA10"
                      className="flex-1 rounded-full border border-gray-200 bg-[#F4F4F6] px-4 py-2 text-xs text-gray-900 uppercase font-semibold placeholder:normal-case placeholder:font-normal outline-none focus:border-gray-400 focus:bg-white min-w-0 transition"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-[#111827] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition shrink-0 cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponMsg && (
                  <p className={`text-[11px] font-semibold ${couponMsg.type === 'success' ? 'text-emerald-700' : couponMsg.type === 'error' ? 'text-rose-600' : 'text-blue-600'}`}>
                    {couponMsg.text}
                  </p>
                )}

                {/* Quick 1-Click Available Vouchers */}
                <div className="pt-2 border-t border-gray-100 space-y-1.5">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-gray-400 block">
                    Available Offers
                  </span>
                  <div className="space-y-1">
                    {Object.values(AVAILABLE_COUPONS).map((c) => {
                      const isApplied = couponCodeString === c.code;
                      const eligible = subtotal >= c.minSpend;
                      return (
                        <div
                          key={c.code}
                          className={`flex items-center justify-between p-2 rounded-xl border text-[11px] transition ${isApplied
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : 'bg-gray-50/80 border-gray-200/80 text-gray-700 hover:border-gray-300'
                            }`}
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-mono font-bold text-gray-900">{c.code}</span>
                            <span className="text-gray-500 block text-[10px]">{c.description}</span>
                          </div>
                          {!isApplied && (
                            <button
                              type="button"
                              onClick={() => handleApplyCoupon(null, c.code)}
                              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition shrink-0 cursor-pointer ${eligible
                                  ? 'bg-gray-900 text-white hover:bg-black'
                                  : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                }`}
                              title={eligible ? 'Apply this coupon' : `Min. spend ₹${c.minSpend}`}
                            >
                              {eligible ? 'Apply' : `Min ₹${c.minSpend}`}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Summary Total Card */}
              <div className="rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-gray-950 border-b border-gray-100 pb-3 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-[10.5px] font-normal text-gray-400 normal-case">
                    {cart.reduce((s, i) => s + (i.quantity || 1), 0)} items
                  </span>
                </h3>

                <div className="space-y-2.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Cart Subtotal</span>
                    <span className="font-bold text-gray-950 tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span className="flex items-center gap-1">
                        <span>🏷️ Discount</span>
                        {couponCodeString && <span className="font-mono text-[10px]">({couponCodeString})</span>}
                      </span>
                      <span className="tabular-nums">−₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div>
                      <span>Express Air Shipping</span>
                      {shipping === 0 && subtotal > 0 && (
                        <p className="text-[9.5px] text-emerald-600 font-medium">Free Boutique Delivery</p>
                      )}
                    </div>
                    <span className="font-semibold text-gray-900 tabular-nums">
                      {shipping === 0 ? (
                        <span className="text-emerald-700 font-bold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Free
                        </span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>

                  <div className="border-t border-gray-200/90 pt-3 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-bold text-gray-950">Total Amount</span>
                      <p className="text-[10px] text-gray-400 font-medium">Inclusive of all duties & taxes</p>
                    </div>
                    <span className="text-xl sm:text-2xl font-bold text-gray-950 tabular-nums">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Primary Proceed Button */}
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-black active:scale-98 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>

                {/* Trust & Guarantees */}
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-3 text-[10px] text-gray-600 space-y-1">
                  <p className="flex items-center gap-1.5 font-semibold text-gray-900">
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Krishna 100% Certified Authenticity</span>
                  </p>
                  <p className="text-gray-500 pl-5 leading-relaxed">
                    Official warranties, tamper-proof luxury packaging & 7-day easy exchange.
                  </p>
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