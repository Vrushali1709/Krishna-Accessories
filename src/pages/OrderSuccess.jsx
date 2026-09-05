// src/pages/OrderSuccess.jsx
import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircleIcon, PrinterIcon, ArrowRightIcon, TruckIcon, ShieldCheckIcon } from '../components/Icons';

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 overflow-x-clip">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">

        {/* Success Card */}
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 text-center shadow-xs space-y-4">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircleIcon className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B89035]">
              Order Confirmed & Stamped
            </span>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-sans">
              Thank You for Your Order
            </h1>
            <p className="mt-1.5 max-w-md mx-auto text-xs text-zinc-500 leading-relaxed">
              We have secured your consignment. An official receipt has been dispatched to your email and our partner boutique is preparing your items for insured air transit.
            </p>
          </div>

          {/* Reference Number Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 shadow-2xs">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Order Reference:</span>
            <span className="text-xs font-mono font-bold text-zinc-950">{order.id}</span>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            <Link
              to={`/tracking?id=${order.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition hover:bg-black"
            >
              <span>Track Consignment</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition shadow-2xs cursor-pointer"
            >
              <PrinterIcon className="w-3.5 h-3.5" />
              <span>Print Official Invoice</span>
            </button>

            <Link
              to="/shop"
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition shadow-2xs"
            >
              Continue Shopping
            </Link>
          </div>

        </div>

        {/* Invoice & Delivery Details Grid */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Purchased Items Card */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs space-y-3.5 min-w-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-2.5">
              Consignment Items ({order.items?.length || 0})
            </h3>

            <div className="divide-y divide-zinc-100 space-y-2.5">
              {order.items?.map((item, idx) => (
                <div key={idx} className="pt-2.5 first:pt-0 flex items-center gap-3 min-w-0">
                  <img src={item.image} alt={item.name} className="h-11 w-11 rounded-lg object-contain bg-zinc-50 border border-zinc-200 p-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-950 truncate">{item.name}</p>
                    <p className="text-[10.5px] text-zinc-400 truncate">{item.brand} &bull; Qty: {item.quantity} {item.color && `&bull; ${item.color}`}</p>
                  </div>
                  <span className="text-xs font-bold text-zinc-950 font-mono shrink-0">
                    ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-zinc-100 pt-3 space-y-1.5 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-zinc-900">₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Privé Discount</span>
                  <span className="font-mono">−₹{order.discount?.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono font-semibold text-zinc-900">
                  {order.shipping === 0 ? <span className="text-emerald-700 font-bold uppercase text-[10px]">Free</span> : `₹${order.shipping}`}
                </span>
              </div>
              <div className="border-t border-zinc-100 pt-2 flex justify-between items-baseline font-bold text-zinc-950">
                <span>Total Amount Paid</span>
                <span className="text-base font-mono">₹{order.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Security Guarantee Card */}
          <div className="space-y-4">
            
            {/* Delivery Destination */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs space-y-2 text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-2.5">
                Delivery Destination
              </h3>
              <p className="font-bold text-zinc-900">{order.customer?.firstName} {order.customer?.lastName}</p>
              <p className="text-zinc-600">{order.customer?.address}</p>
              <p className="text-zinc-600">{order.customer?.city}, {order.customer?.state} {order.customer?.pincode}</p>
              <div className="pt-2 text-[11px] text-zinc-400 space-y-0.5 border-t border-zinc-100 mt-2">
                <p>Phone: <strong className="font-mono text-zinc-700">{order.customer?.phone}</strong></p>
                <p>Email: <strong className="text-zinc-700">{order.customer?.email}</strong></p>
                <p>Payment: <strong className="text-zinc-700">{order.paymentMethod}</strong></p>
              </div>
            </div>

            {/* Verification Guarantee */}
            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 text-xs text-zinc-600 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-zinc-900">
                <TruckIcon className="w-4 h-4 text-zinc-900 shrink-0" />
                <span>Express Courier Milestone Notice</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Courier airway bill tracking credentials will be generated within 12 business hours. You can inspect milestone progression at any time on our tracking portal.
              </p>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}