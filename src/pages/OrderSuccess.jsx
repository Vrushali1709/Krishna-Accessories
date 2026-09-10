// src/pages/OrderSuccess.jsx
import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import { CheckCircleIcon, PrinterIcon, ArrowRightIcon, ShieldCheckIcon } from '../components/Icons';

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Success Card */}
        <Reveal effect="fade-up">
          <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-10 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-2xs">
              <CheckCircleIcon className="w-7 h-7" />
            </div>

            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
              Consignment Confirmed
            </p>

            <h1 className="mt-1 text-2xl sm:text-3xl font-serif font-bold tracking-tight text-gray-950">
              Thank You for Your Order
            </h1>

            <p className="mt-2 max-w-md mx-auto text-xs sm:text-sm text-gray-600 leading-relaxed">
              We have received and authenticated your consignment. An official receipt has been dispatched to your email, and our Mumbai flagship boutique is preparing your items for express delivery.
            </p>

            {/* Reference Number */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-[#F4F4F6] px-5 py-2 max-w-full truncate shadow-2xs">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold shrink-0">Order Reference:</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-gray-950 truncate">{order.id}</span>
            </div>

            {/* Action CTAs */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              <Link
                to={`/account?tab=tracking&id=${order.id}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#111827] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-black hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Track in Profile</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-[#F4F4F6] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-800 hover:bg-gray-200 transition hover:-translate-y-0.5 cursor-pointer"
              >
                <PrinterIcon className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>

              <Link
                to="/shop"
                className="rounded-full border border-gray-200 bg-[#F4F4F6] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-800 hover:bg-gray-200 transition hover:-translate-y-0.5 cursor-pointer"
              >
                Continue Shopping
              </Link>
            </div>

          </div>
        </Reveal>

        {/* Invoice Summary */}
        <Reveal effect="fade-up" delay={150}>
          <div className="mt-6 grid gap-5 md:grid-cols-2">

            {/* Purchased Items */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm space-y-4 min-w-0">
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-950 border-b border-gray-100 pb-2.5">
                Consignment Items ({order.items?.length || 0})
              </h3>

              <div className="divide-y divide-gray-100 space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="pt-2.5 first:pt-0 flex items-center gap-3 min-w-0">
                    <img src={item.image} alt={item.name} className="h-12 w-12 rounded-xl object-contain bg-[#F4F4F6] border border-gray-200 p-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-950 truncate">{item.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{item.brand} &bull; Qty: {item.quantity} {item.color && `&bull; ${item.color}`}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-950 shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-semibold">₹{order.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Privé Privilege Discount</span>
                    <span>−₹{order.discount?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Insured Courier</span>
                  <span className="text-emerald-700 font-bold">{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-xs font-bold text-gray-950">
                  <span>Total Settled</span>
                  <span className="text-base text-gray-950 font-serif">₹{order.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Shipping & Logistics Details */}
            <div className="space-y-5 min-w-0">

              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-950 mb-3">
                  Delivery Destination
                </h3>
                <p className="text-xs font-bold text-gray-950 truncate">
                  {order.customer?.firstName} {order.customer?.lastName}
                </p>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                  {order.customer?.address}
                </p>
                <p className="text-xs text-gray-600">
                  {order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}
                </p>
                <p className="mt-2 text-[11px] text-gray-400 truncate">
                  Phone: {order.customer?.phone} &bull; Email: {order.customer?.email}
                </p>
              </div>

              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-950 mb-3">
                  Logistics & Payment Status
                </h3>
                <div className="space-y-2 text-xs text-gray-700">
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500 shrink-0">Payment Method:</span>
                    <span className="font-semibold text-gray-950 truncate text-right">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500 shrink-0">Payment Status:</span>
                    <span className="text-emerald-700 font-bold truncate text-right">{order.paymentStatus || 'Paid'}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500 shrink-0">Courier Partner:</span>
                    <span className="text-gray-950 font-semibold truncate text-right">{order.courier || 'BlueDart Express'}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500 shrink-0">AWB Tracking Code:</span>
                    <span className="font-mono font-bold text-gray-950 truncate text-right">{order.trackingNumber || 'Processing Dispatch'}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </Reveal>

      </main>

      <Footer />
    </div>
  );
}