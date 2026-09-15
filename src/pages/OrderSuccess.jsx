// src/pages/OrderSuccess.jsx
import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Reveal } from '../components/useScrollReveal';
import { CheckCircleIcon, PrinterIcon, ArrowRightIcon, ShieldCheckIcon, TruckIcon } from '../components/Icons';
import { Mail, RefreshCw, Check, Copy, Sparkles, Award, PackageCheck } from 'lucide-react';
import { sendOrderConfirmationEmail } from '../utils/emailService';

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  if (!order) {
    return <Navigate to="/shop" replace />;
  }

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(order.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleResendEmail = async () => {
    if (resendingEmail) return;
    setResendingEmail(true);
    setEmailStatus('');

    try {
      await sendOrderConfirmationEmail(order);
      setEmailStatus(`✓ Invoice dispatched to ${order.customer?.email}`);
    } catch {
      setEmailStatus('Failed to resend email receipt.');
    } finally {
      setResendingEmail(false);
      setTimeout(() => setEmailStatus(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">

        {/* Celebratory Success Card */}
        <Reveal direction="zoom" delay={100}>
          <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-10 text-center shadow-lg">
            
            {/* Ambient gold glow */}
            <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-amber-100/60 blur-2xl" />

            {/* Pulsing Success Ring */}
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
              <CheckCircleIcon className="w-8 h-8 relative z-10" />
            </div>

            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B89758] flex items-center justify-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Consignment Confirmed &bull; Preparing Dispatch</span>
            </p>

            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
              Thank You for Your Order
            </h1>

            <p className="mt-2 max-w-md mx-auto text-xs sm:text-sm text-gray-600 leading-relaxed">
              We have secured your items. A detailed tax invoice has been sent to <strong>{order.customer?.email}</strong> and our partner boutique is packaging your parcel with insured express delivery.
            </p>

            {/* Reference Number with 1-click copy */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-[#F4F4F6] px-5 py-2 max-w-full truncate shadow-2xs">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold shrink-0">Order Reference:</span>
              <span className="text-xs font-mono font-bold text-gray-950 truncate">{order.id}</span>
              <button
                type="button"
                onClick={handleCopyOrder}
                className="ml-1 rounded p-1 text-gray-400 hover:text-gray-900 transition cursor-pointer"
                title="Copy reference code"
              >
                {copiedId ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            {emailStatus && (
              <div className="mt-3 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl py-1.5 px-3.5 inline-block animate-fade-in">
                {emailStatus}
              </div>
            )}

            {/* Action CTAs */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              <Link
                to={`/account?tab=tracking&id=${order.id}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#111827] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-black cursor-pointer"
              >
                <span>Track in Profile</span>
                <ArrowRightIcon className="w-3 h-3" />
              </Link>

              <button
                type="button"
                onClick={handleResendEmail}
                disabled={resendingEmail}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs font-semibold text-gray-800 hover:bg-gray-200 transition cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-amber-700" />
                <span>{resendingEmail ? 'Sending...' : 'Resend Receipt'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs font-semibold text-gray-800 hover:bg-gray-200 transition cursor-pointer"
              >
                <PrinterIcon className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>

              <Link
                to="/shop"
                className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-800 hover:bg-gray-100 transition"
              >
                Continue Shopping
              </Link>
            </div>

          </div>
        </Reveal>

        {/* Invoice Summary Details */}
        <Reveal direction="up" delay={200}>
          <div className="mt-6 grid gap-4 md:grid-cols-2">

            {/* Purchased Items */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs space-y-3 min-w-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 border-b border-gray-100 pb-2">
                Consignment Items ({order.items?.length || 0})
              </h3>

              <div className="divide-y divide-gray-100 space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex items-center gap-2.5 min-w-0">
                    <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-contain bg-[#F4F4F6] border border-gray-200 p-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-950 truncate">{item.name}</p>
                      <p className="text-[10.5px] text-gray-500 truncate">{item.brand} &bull; Qty: {item.quantity} {item.color && `&bull; ${item.color}`}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-950 shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="border-t border-gray-100 pt-2 space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-semibold">₹{order.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>−₹{order.discount?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="text-emerald-700 font-bold">{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-1.5 text-xs font-bold text-gray-950">
                  <span>Total Settled</span>
                  <span className="text-sm text-gray-950">₹{order.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Shipping & Logistics Details */}
            <div className="space-y-4 min-w-0">

              <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">
                  Delivery Destination
                </h3>
                <p className="text-xs font-bold text-gray-950 truncate">
                  {order.customer?.firstName} {order.customer?.lastName}
                </p>
                <p className="mt-0.5 text-xs text-gray-600 leading-relaxed">
                  {order.customer?.address}
                </p>
                <p className="text-xs text-gray-600">
                  {order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}
                </p>
                <p className="mt-1 text-[10.5px] text-gray-400 truncate">
                  Phone: {order.customer?.phone} &bull; Email: {order.customer?.email}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-2">
                  Logistics &amp; Payment Status
                </h3>
                <div className="space-y-1.5 text-xs text-gray-700">
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