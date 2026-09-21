// src/pages/OrderSuccess.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { sendOrderConfirmationEmail } from '../utils/emailService';
import {
  CheckCircle2,
  Printer,
  Mail,
  ArrowRight,
  ShieldCheck,
  Package,
  Truck,
  Sparkles,
  MapPin
} from 'lucide-react';

// =========================================================================
// CUSTOM ANIMATION HOOK: Intersection Observer for on-scroll reveals
// =========================================================================
function useInView(options = { threshold: 0.1, triggerOnce: true }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (options.triggerOnce) {
          observer.unobserve(entry.target);
        }
      }
    }, options);

    const currentElem = ref.current;
    if (currentElem) observer.observe(currentElem);

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [options.threshold, options.triggerOnce]);

  return [ref, inView];
}

function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  threshold = 0.08
}) {
  const [ref, inView] = useInView({ threshold, triggerOnce: true });

  const getTransform = () => {
    if (inView) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 24px, 0)';
      case 'down':
        return 'translate3d(0, -24px, 0)';
      case 'left':
        return 'translate3d(24px, 0, 0)';
      case 'right':
        return 'translate3d(-24px, 0, 0)';
      case 'zoom':
        return 'scale(0.97)';
      default:
        return 'translate3d(0, 20px, 0)';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
}

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
      setEmailStatus(`✓ Invoice successfully re-sent to ${order.customer?.email}`);
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

        {/* ========================================================================= */}
        {/* 1. SUCCESS CONFIRMATION HERO CARD                                         */}
        {/* ========================================================================= */}
        <Reveal delay={0} direction="up">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 sm:p-12 text-center shadow-sm relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#C5A880] via-[#8C6734] to-[#C5A880]" />

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F2EB] text-[#8C6734] border border-[#C5A880]/50 shadow-2xs mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#8C6734]" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F2EB] border border-[#C5A880]/40 text-[10.5px] font-bold uppercase tracking-wider text-[#8C6734]">
              <Sparkles className="w-3 h-3" />
              Consignment Confirmed &bull; Preparing Express Dispatch
            </span>

            <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-neutral-950">
              Thank You for Your Order
            </h1>

            <p className="mt-2 max-w-lg mx-auto text-xs sm:text-sm text-neutral-600 leading-relaxed">
              We have officially logged your order. An official receipt has been dispatched to <strong className="text-neutral-950">{order.customer?.email}</strong> and our partner boutique is preparing your items for insured courier handover.
            </p>

            {/* Reference Number Chip */}
            <div className="mt-5 inline-flex items-center gap-2.5 rounded-lg border border-[#C5A880]/40 bg-[#FAF8F5] px-4 py-2">
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">Consignment Code:</span>
              <span className="text-sm font-mono font-bold text-[#8C6734]">{order.id}</span>
            </div>

            {emailStatus && (
              <div className="mt-4 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg py-2 px-4 inline-block animate-fade-in">
                {emailStatus}
              </div>
            )}

            {/* Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={`/account?tab=tracking&id=${order.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#8C6734] transition-colors duration-200 shadow-sm"
              >
                <span>Track in Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={handleResendEmail}
                disabled={resendingEmail}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-neutral-300 bg-white text-neutral-800 text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF8F5] hover:border-[#C5A880] transition-colors duration-200 cursor-pointer disabled:opacity-50"
              >
                <Mail className="w-3.5 h-3.5 text-[#8C6734]" />
                <span>{resendingEmail ? 'Sending Receipt...' : 'Resend Email Invoice'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-neutral-300 bg-white text-neutral-800 text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF8F5] hover:border-[#C5A880] transition-colors duration-200 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-neutral-300 bg-white text-neutral-800 text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF8F5] hover:border-[#C5A880] transition-colors duration-200"
              >
                <span>Continue Shopping</span>
              </Link>
            </div>

          </div>
        </Reveal>

        {/* ========================================================================= */}
        {/* 2. INVOICE BREAKDOWN & LOGISTICS DESTINATION                              */}
        {/* ========================================================================= */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 items-start">

          {/* Purchased Items Card */}
          <Reveal delay={100} direction="up">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-medium text-neutral-950 border-b border-neutral-100 pb-3">
                Consignment Items ({order.items?.length || 0})
              </h3>

              <div className="divide-y divide-neutral-100 space-y-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 rounded-lg object-contain bg-[#FAFAFB] border border-neutral-200 p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-950 truncate">{item.name}</p>
                      <p className="text-[11px] text-neutral-500 truncate">
                        {item.brand} &bull; Qty: {item.quantity} {item.color && `&bull; ${item.color}`}
                      </p>
                    </div>
                    <span className="font-serif text-sm font-medium text-neutral-950 shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="border-t border-neutral-100 pt-3 space-y-2 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-neutral-900 font-semibold">₹{order.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Voucher Savings</span>
                    <span>−₹{order.discount?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Express Shipping</span>
                  <span className="text-emerald-700 font-semibold">
                    {order.shipping === 0 ? 'FREE COMPLIMENTARY' : `₹${order.shipping}`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-neutral-200 pt-2.5 text-xs font-bold text-neutral-950">
                  <span>Total Settled</span>
                  <span className="font-serif text-base text-neutral-950">₹{order.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Logistics & Delivery Destination */}
          <div className="space-y-6">

            <Reveal delay={150} direction="up">
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 mb-3">
                  <MapPin className="w-4 h-4 text-[#8C6734]" />
                  <h3 className="font-serif text-base font-medium text-neutral-950">
                    Delivery Destination
                  </h3>
                </div>

                <p className="text-xs font-bold text-neutral-950">
                  {order.customer?.firstName} {order.customer?.lastName}
                </p>
                <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                  {order.customer?.address}
                </p>
                <p className="text-xs text-neutral-600">
                  {order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}
                </p>
                <p className="mt-2 text-[11px] text-neutral-500">
                  Phone: {order.customer?.phone} &bull; Email: {order.customer?.email}
                </p>
              </div>
            </Reveal>

            <Reveal delay={200} direction="up">
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 mb-3">
                  <Truck className="w-4 h-4 text-[#8C6734]" />
                  <h3 className="font-serif text-base font-medium text-neutral-950">
                    Logistics &amp; Payment Status
                  </h3>
                </div>

                <div className="space-y-2 text-xs text-neutral-700">
                  <div className="flex justify-between gap-2">
                    <span className="text-neutral-500">Payment Mode:</span>
                    <span className="font-semibold text-neutral-950 text-right truncate">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-neutral-500">Payment Status:</span>
                    <span className="text-emerald-700 font-bold">{order.paymentStatus || 'Paid / Confirmed'}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-neutral-500">Courier Partner:</span>
                    <span className="text-neutral-950 font-semibold">{order.courier || 'BlueDart Express'}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-neutral-500">AWB Tracking Code:</span>
                    <span className="font-mono font-bold text-[#8C6734]">{order.trackingNumber || 'Processing Dispatch'}</span>
                  </div>
                </div>
              </div>
            </Reveal>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}