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
import { Sparkles, Shield, PackageCheck, RotateCcw, Lock } from 'lucide-react';
import { Reveal } from '../components/useScrollReveal';

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

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      {/* Breadcrumb & Cart Header */}
      <section className="border-b border-neutral-200/80 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal delay={0} direction="up">
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3 font-medium">
              <Link to="/" className="hover:text-neutral-950 transition-colors">Home</Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-neutral-950 transition-colors">Catalog</Link>
              <span>/</span>
              <span className="text-neutral-950 font-semibold">Shopping Bag</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734] animate-ping" />
                  <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#8C6734]">
                    Boutique Bag &amp; Selection
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-4xl font-medium tracking-tight text-neutral-950">
                  Your Shopping Bag <span className="text-neutral-400 text-lg sm:text-2xl font-normal font-sans">({cart.reduce((s, i) => s + (i.quantity || 1), 0)} {cart.length === 1 && cart[0]?.quantity === 1 ? 'item' : 'items'})</span>
                </h1>
              </div>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-semibold text-neutral-400 hover:text-rose-600 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer py-1.5 px-3 rounded-md hover:bg-rose-50"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                  <span>Empty Bag</span>
                </button>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">

        {cart.length === 0 ? (
          /* Empty Bag State */
          <Reveal delay={100} direction="up">
            <div className="flex min-h-[440px] flex-col items-center justify-center rounded-2xl border border-neutral-200/90 bg-white p-8 sm:p-12 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FAF8F5] border border-[#C5A880]/50 text-[#8C6734] mb-3 shadow-2xs">
                <BagIcon className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl font-medium text-neutral-950">Your Shopping Bag is Empty</h2>
              <p className="mt-2 max-w-md text-xs sm:text-sm text-neutral-500 leading-relaxed font-normal">
                Explore our curated boutique collection of premium Swiss timepieces, handcrafted Italian leather, designer footwear, and modern electronics.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-sm transition-colors duration-200 hover:bg-[#8C6734]"
                >
                  <span>Explore Catalog</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/new-arrivals"
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-800 transition-colors duration-200 hover:bg-neutral-50"
                >
                  <span>Season New Arrivals</span>
                </Link>
              </div>
            </div>
          </Reveal>
        ) : (
          /* 2-Column Cart Grid */
          <div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_410px]">

            {/* Left Column: Items List & Free Shipping Meter */}
            <div className="space-y-5 min-w-0">

              {/* Free Shipping Progress Indicator */}
              <Reveal delay={50} direction="up">
                <div className="rounded-xl border border-neutral-200/90 bg-white p-4 sm:p-5 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2 font-medium text-neutral-900 truncate">
                      <TruckIcon className="w-4 h-4 text-[#8C6734] shrink-0" />
                      {freeShippingDifference > 0 ? (
                        <span className="truncate text-xs text-neutral-700">
                          Add <strong className="text-[#8C6734] font-bold">₹{freeShippingDifference.toLocaleString('en-IN')}</strong> more for <strong className="text-neutral-950">Free Express Air Shipping</strong>
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <span>✓</span> Unlocked Complimentary Express Air Shipping!
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-neutral-500 shrink-0 tabular-nums">{progressToFreeShipping}%</span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${qualifiesForFreeShipping ? 'bg-emerald-600' : 'bg-[#8C6734]'}`}
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>
              </Reveal>

              {/* Items List Table Card */}
              <Reveal delay={120} direction="up">
                <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-6 shadow-sm divide-y divide-neutral-100">
                  <div className="pb-3 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                      Product Details ({cart.length} unique {cart.length === 1 ? 'item' : 'items'})
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400 hidden sm:block">
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
                        key={`${item.id}-${itemColor}-${itemSize}-${itemVariant}-${idx}`}
                        className="py-4 sm:py-5 first:pt-4 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >

                        {/* Item Image & Description */}
                        <div className="flex items-center gap-4 min-w-0">
                          <Link
                            to={`/product/${item.id}`}
                            className="aspect-square h-20 w-20 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-xl bg-[#FAFAFB] p-2 border border-neutral-200/80 flex items-center justify-center group hover:border-[#C5A880] transition-colors"
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
                              <div className="flex h-full w-full items-center justify-center text-neutral-400 text-xs font-semibold">
                                KA
                              </div>
                            )}
                          </Link>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8C6734] truncate">
                                {item.brand || 'Krishna Essentials'}
                              </span>
                              {item.category && (
                                <span className="rounded-full bg-[#F5F2EB] px-2 py-0.5 text-[9.5px] font-medium text-neutral-700 border border-[#C5A880]/30">
                                  {item.category}
                                </span>
                              )}
                            </div>

                            <Link
                              to={`/product/${item.id}`}
                              className="font-medium text-xs sm:text-sm text-neutral-950 hover:text-[#8C6734] transition-colors block truncate mt-0.5"
                              title={item.name}
                            >
                              {item.name}
                            </Link>

                            {/* Selected Color & Variant Spec Chips */}
                            {(itemColor || itemSize || itemVariant) && (
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {itemColor && (
                                  <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF8F5] border border-neutral-200/80 px-2 py-0.5 text-[10px] font-medium text-neutral-700">
                                    <span>Color:</span>
                                    <strong className="font-semibold text-neutral-950">{itemColor}</strong>
                                  </span>
                                )}
                                {itemSize && (
                                  <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF8F5] border border-neutral-200/80 px-2 py-0.5 text-[10px] font-medium text-neutral-700">
                                    <span>Size:</span>
                                    <strong className="font-semibold text-neutral-950">{itemSize}</strong>
                                  </span>
                                )}
                                {itemVariant && (
                                  <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF8F5] border border-neutral-200/80 px-2 py-0.5 text-[10px] font-medium text-neutral-700">
                                    <span>Spec:</span>
                                    <strong className="font-semibold text-neutral-950">{itemVariant}</strong>
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Price Display */}
                            <div className="flex items-baseline gap-2 mt-1.5">
                              <span className="text-xs sm:text-sm font-semibold text-neutral-950">
                                ₹{Number(item.price).toLocaleString('en-IN')}
                              </span>
                              {item.oldPrice && item.oldPrice > item.price && (
                                <span className="text-[10.5px] text-neutral-400 line-through">
                                  ₹{Number(item.oldPrice).toLocaleString('en-IN')}
                                </span>
                              )}
                              <span className="text-[10px] text-neutral-400 font-mono">
                                (SKU: {item.sku || `KA-${item.id}`})
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Stepper + Subtotal + Remove */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 shrink-0">

                          {/* Quantity Counter */}
                          <div className="flex items-center rounded-lg border border-neutral-200/90 bg-[#FAF8F5] p-0.5">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item, (item.quantity || 1) - 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold text-neutral-700 hover:bg-white hover:text-black hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                              title="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-neutral-950 tabular-nums">
                              {item.quantity || 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item, (item.quantity || 1) + 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold text-neutral-700 hover:bg-white hover:text-black hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                              title="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          {/* Line Total & Remove Action */}
                          <div className="text-right min-w-[95px]">
                            <span className="text-xs sm:text-sm font-semibold text-neutral-950 block tabular-nums">
                              ₹{lineTotal.toLocaleString('en-IN')}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemove(item)}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-800 hover:underline transition-colors mt-0.5 cursor-pointer"
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
              </Reveal>

              {/* Bottom Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6734] hover:text-neutral-950 transition-colors"
                >
                  <span>&larr;</span>
                  <span>Continue Exploring Catalog</span>
                </Link>

                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#8C6734]" /> 256-bit SSL Security
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <TruckIcon className="w-3 h-3 text-[#8C6734]" /> Insured Transit
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: Coupon & Order Financial Summary */}
            <div className="space-y-5">

              {/* Coupon Voucher Form & Recommendations */}
              <Reveal delay={80} direction="up">
                <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 block">
                      Voucher Privé Code
                    </span>
                    <TagIcon className="w-3.5 h-3.5 text-[#8C6734]" />
                  </div>

                  {couponCodeString ? (
                    <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 font-medium gap-2">
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
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold hover:underline shrink-0 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={(e) => handleApplyCoupon(e)} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        placeholder="e.g. KRISHNA10"
                        className="flex-1 rounded-lg border border-neutral-200 bg-[#FAFAFB] px-3.5 py-2 text-xs text-neutral-900 uppercase font-semibold placeholder:normal-case placeholder:font-normal outline-none focus:border-[#C5A880] focus:bg-white focus:ring-1 focus:ring-[#C5A880] min-w-0 transition-colors"
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-neutral-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#8C6734] transition-colors shrink-0 cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponMsg && (
                    <p className={`text-[11px] font-medium ${couponMsg.type === 'success' ? 'text-emerald-700' : couponMsg.type === 'error' ? 'text-rose-600' : 'text-blue-600'}`}>
                      {couponMsg.text}
                    </p>
                  )}

                  {/* Quick 1-Click Available Vouchers */}
                  <div className="pt-2 border-t border-neutral-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400 block">
                      Privé Offers Available
                    </span>
                    <div className="space-y-1.5">
                      {Object.values(AVAILABLE_COUPONS).map((c) => {
                        const isApplied = couponCodeString === c.code;
                        const eligible = subtotal >= c.minSpend;
                        return (
                          <div
                            key={c.code}
                            className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-colors ${
                              isApplied
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                                : 'bg-[#FAF8F5] border-neutral-200/80 text-neutral-700 hover:border-[#C5A880]'
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <span className="font-mono font-bold text-neutral-950">{c.code}</span>
                              <span className="text-neutral-500 block text-[10.5px] mt-0.5">{c.description}</span>
                            </div>
                            {!isApplied && (
                              <button
                                type="button"
                                onClick={() => handleApplyCoupon(null, c.code)}
                                className={`rounded-md px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                                  eligible
                                    ? 'bg-neutral-950 text-white hover:bg-[#8C6734]'
                                    : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
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
              </Reveal>

              {/* Order Summary Total Card */}
              <Reveal delay={150} direction="up">
                <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-950 border-b border-neutral-100 pb-3 flex items-center justify-between">
                    <span>Order Summary</span>
                    <span className="text-[11px] font-normal text-neutral-400 normal-case">
                      {cart.reduce((s, i) => s + (i.quantity || 1), 0)} items
                    </span>
                  </h3>

                  <div className="space-y-3 text-xs text-neutral-600">
                    <div className="flex justify-between">
                      <span>Bag Subtotal</span>
                      <span className="font-semibold text-neutral-950 tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span className="flex items-center gap-1">
                          <span>🏷️ Voucher Savings</span>
                          {couponCodeString && <span className="font-mono text-[10px]">({couponCodeString})</span>}
                        </span>
                        <span className="tabular-nums">−₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div>
                        <span>Express Air Shipping</span>
                        {shipping === 0 && subtotal > 0 && (
                          <p className="text-[10px] text-emerald-600 font-medium">Complimentary Boutique Delivery</p>
                        )}
                      </div>
                      <span className="font-semibold text-neutral-950 tabular-nums">
                        {shipping === 0 ? (
                          <span className="text-emerald-700 font-bold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Free
                          </span>
                        ) : (
                          `₹${shipping}`
                        )}
                      </span>
                    </div>

                    <div className="border-t border-neutral-200/90 pt-3 flex justify-between items-baseline">
                      <div>
                        <span className="text-sm font-semibold text-neutral-950">Total Payable</span>
                        <p className="text-[10.5px] text-neutral-400 font-medium">Inclusive of all duties &amp; GST</p>
                      </div>
                      <span className="font-serif text-xl sm:text-2xl font-semibold text-neutral-950 tabular-nums text-[#8C6734]">
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Primary Proceed Button */}
                  <button
                    type="button"
                    onClick={() => navigate('/checkout')}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-950 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-sm transition-all duration-200 hover:bg-[#8C6734] active:scale-98 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </button>

                  {/* Trust & Guarantees */}
                  <div className="rounded-xl bg-[#FAF8F5] border border-neutral-200/80 p-3.5 text-[11px] text-neutral-600 space-y-1.5">
                    <p className="flex items-center gap-1.5 font-semibold text-neutral-950">
                      <ShieldCheckIcon className="w-4 h-4 text-[#8C6734] shrink-0" />
                      <span>The Krishna Privé Assurance</span>
                    </p>
                    <p className="text-neutral-500 pl-5.5 leading-relaxed text-[10.5px]">
                      Verified product sourcing, manufacturer warranty, tamper-proof luxury packaging &amp; 7-day hassle-free return window.
                    </p>
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