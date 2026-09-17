// src/pages/OrderSuccess.jsx
import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircleIcon, PrinterIcon, ArrowRightIcon, ShieldCheckIcon } from '../components/Icons';
import { Mail, RefreshCw, Check, Sparkles, Truck, PackageCheck } from 'lucide-react';
import { sendOrderConfirmationEmail } from '../utils/emailService';
import { Reveal } from '../components/useScrollReveal';

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');

  if (!order) {
    return <Navigate to="/shop" replace />;
  }

  const handleResendEmail = async () => {
    if (resendingEmail) return;
    setResendingEmail(true);
    setEmailStatus('');

    try {
      await sendOrderConfirmationEmail(order);
      setEmailStatus(`✓ Invoice re-sent to ${order.customer?.email}`);
    } catch {
      setEmailStatus('Failed to resend email receipt.');
    } finally {
      setResendingEmail(false);
      setTimeout(() => setEmailStatus(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">

        {/* Success Card */}
        <Reveal delay={0} direction="up">
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-8 sm:p-12 text-center shadow-lg space-y-5">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#8C6734] border border-[#C5A880]/50 shadow-2xs">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734] animate-ping" />
                <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#8C6734]">
                  Consignment Confirmed &amp; Dispatched
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl font-medium tracking-tight text-neutral-950">
                Thank You for Your <span className="italic font-normal text-[#8C6734]">Order</span>
              </h1>
              <p className="max-w-md mx-auto text-xs sm:text-sm text-neutral-500 leading-relaxed font-normal">
                We have registered your purchase. An official receipt and consignment invoice have been dispatched to <strong className="text-neutral-950">{order.customer?.email}</strong>.
              </p>
            </div>

            {/* Reference Number */}
            <div className="inline-flex items-center gap-2.5 rounded-xl border border-neutral-200/80 bg-[#FAF8F5] px-5 py-2 max-w-full">
              <span className="text-[10.5px] text-neutral-500 uppercase tracking-wider font-semibold shrink-0">Order Reference:</span>
              <span className="text-sm font-mono font-bold text-[#8C6734] truncate">{order.id}</span>
            </div>

            {emailStatus && (
              <div className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg py-2 px-4 inline-block animate-fade-in">
                {emailStatus}
              </div>
            )}

            {/* Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={`/account?tab=tracking&id=${order.id}`}
                className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-sm transition-colors duration-200 hover:bg-[#8C6734]"
              >
                <span>Track Consignment</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={handleResendEmail}
                disabled={resendingEmail}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-800 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-[#8C6734]" />
                <span>{resendingEmail ? 'Sending...' : 'Resend Email Receipt'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-800 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                <PrinterIcon className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>

              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-800 hover:bg-[#FAF8F5] transition-colors"
              >
                Explore More
              </Link>
            </div>

          </div>
        </Reveal>

        {/* Invoice Summary */}
        <Reveal delay={120} direction="up">
          <div className="mt-8 grid gap-6 md:grid-cols-2">

            {/* Purchased Items */}
            <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm space-y-4 min-w-0">
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-950 border-b border-neutral-100 pb-3">
                Consignment Items ({order.items?.length || 0})
              </h3>

              <div className="divide-y divide-neutral-100 space-y-2.5">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="pt-2.5 first:pt-0 flex items-center gap-3 min-w-0">
                    <img src={item.image} alt={item.name} className="h-11 w-11 rounded-lg object-contain bg-[#FAF8F5] border border-neutral-200/80 p-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-neutral-950 truncate">{item.name}</p>
                      <p className="text-[10.5px] text-neutral-500 truncate">{item.brand} &bull; Qty: {item.quantity} {item.color && `&bull; ${item.color}`}</p>
                    </div>
                    <span className="text-xs font-semibold text-neutral-950 shrink-0 tabular-nums">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="border-t border-neutral-100 pt-3 space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-neutral-900 font-medium tabular-nums">₹{order.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount</span>
                    <span className="tabular-nums">−₹{order.discount?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="text-emerald-700 font-semibold">{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-200/90 pt-2 text-xs font-semibold text-neutral-950">
                  <span>Total Settled</span>
                  <span className="font-serif text-base text-[#8C6734] tabular-nums">₹{order.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Shipping & Logistics Details */}
            <div className="space-y-6 min-w-0">

              <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-950 border-b border-neutral-100 pb-2.5">
                  Delivery Destination
                </h3>
                <p className="text-xs font-semibold text-neutral-950 truncate">
                  {order.customer?.firstName} {order.customer?.lastName}
                </p>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {order.customer?.address}
                </p>
                <p className="text-xs text-neutral-600">
                  {order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}
                </p>
                <p className="text-[11px] text-neutral-400 truncate pt-1">
                  Phone: {order.customer?.phone} &bull; Email: {order.customer?.email}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm space-y-2.5">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-950 border-b border-neutral-100 pb-2.5">
                  Logistics &amp; Payment Status
                </h3>
                <div className="space-y-2 text-xs text-neutral-700">
                  <div className="flex justify-between gap-2">
                    <span className="text-neutral-500 shrink-0">Payment Mode:</span>
                    <span className="font-medium text-neutral-950 truncate text-right">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-neutral-500 shrink-0">Payment Status:</span>
                    <span className="text-emerald-700 font-semibold truncate text-right">{order.paymentStatus || 'Confirmed'}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-neutral-500 shrink-0">Courier Partner:</span>
                    <span className="text-neutral-950 font-medium truncate text-right">{order.courier || 'BlueDart Express'}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-neutral-500 shrink-0">AWB Tracking Code:</span>
                    <span className="font-mono font-bold text-[#8C6734] truncate text-right">{order.trackingNumber || 'Processing Dispatch'}</span>
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