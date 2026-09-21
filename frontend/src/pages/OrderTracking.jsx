// src/pages/OrderTracking.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getOrderById } from '../utils/orderStore';
import {
  Search,
  Truck,
  ShieldCheck,
  Package,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import BrandSpinner from '../components/BrandSpinner';

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

export default function OrderTracking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || 'KA-98421';

  const [orderIdInput, setOrderIdInput] = useState(initialId);
  const [activeOrder, setActiveOrder] = useState(() => getOrderById(initialId));
  const [notFound, setNotFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const refreshOrder = (idToLookup) => {
    setIsSearching(true);
    setTimeout(() => {
      const id = idToLookup || orderIdInput;
      const found = getOrderById(id);
      if (found) {
        setActiveOrder(found);
        setNotFound(false);
      } else {
        setActiveOrder(null);
        setNotFound(true);
      }
      setIsSearching(false);
    }, 280);
  };

  useEffect(() => {
    if (initialId) {
      refreshOrder(initialId);
    }
    const handleUpdate = () => refreshOrder();
    window.addEventListener('ordersUpdated', handleUpdate);
    return () => window.removeEventListener('ordersUpdated', handleUpdate);
  }, [initialId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderIdInput.trim()) {
      setSearchParams({ id: orderIdInput.trim() });
      refreshOrder(orderIdInput.trim());
    }
  };

  const sampleOrderIds = ['KA-98421', 'KA-98420', 'KA-98419'];

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO BANNER (Luxury Editorial Header Matching About & New Arrivals)    */}
      {/* ========================================================================= */}
      <section className="relative bg-white border-b border-neutral-200/80 overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center max-w-3xl">
          {/* Eyebrow Badge with Pulse */}
          <Reveal delay={0} direction="up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs mx-auto">
              <span className="w-2 h-2 rounded-full bg-[#8C6734] animate-ping" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8C6734]">
                Logistics &amp; Milestone Tracking
              </span>
            </div>
          </Reveal>

          {/* Editorial Serif Heading */}
          <Reveal delay={100} direction="up">
            <h1 className="mt-4 font-serif text-3xl sm:text-5xl font-medium tracking-tight text-neutral-950 leading-[1.15]">
              Track Consignment <br />
              <span className="italic font-normal text-[#8C6734]">Real-Time Transit Milestones.</span>
            </h1>
          </Reveal>

          {/* Description */}
          <Reveal delay={180} direction="up">
            <p className="mt-3 text-xs sm:text-sm text-neutral-600 font-normal max-w-md mx-auto">
              Enter your order reference code below to view live shipment progress from boutique dispatch to doorstep handover.
            </p>
          </Reveal>

          {/* Search Form with Luxury Polish */}
          <Reveal delay={240} direction="up">
            <form onSubmit={handleSearch} className="mt-7 max-w-md mx-auto flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  placeholder="e.g. KA-98421"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-xs text-neutral-900 font-mono uppercase tracking-wider outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]/30 shadow-2xs transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-neutral-950 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#8C6734] transition-colors duration-200 shadow-sm shrink-0 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track Order</span>
              </button>
            </form>
          </Reveal>

          {/* Sample ID Chips */}
          <Reveal delay={280} direction="up">
            <div className="mt-3.5 flex items-center justify-center gap-2 text-xs text-neutral-400 flex-wrap">
              <span>Quick reference samples:</span>
              {sampleOrderIds.map((sid) => (
                <button
                  key={sid}
                  type="button"
                  onClick={() => {
                    setOrderIdInput(sid);
                    setSearchParams({ id: sid });
                    refreshOrder(sid);
                  }}
                  className="font-mono text-xs text-neutral-700 font-semibold px-2 py-0.5 rounded-md bg-[#FAFAFB] border border-neutral-200 hover:border-[#C5A880] hover:text-[#8C6734] transition-colors cursor-pointer"
                >
                  {sid}
                </button>
              ))}
            </div>
          </Reveal>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ORDER DETAILS & TRANSIT TIMELINE                                       */}
      {/* ========================================================================= */}
      <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14 sm:px-6 lg:px-8">

        {isSearching ? (
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[300px]">
            <BrandSpinner size="lg" variant="gold" showBadge={true} label="Fetching real-time consignment status..." />
          </div>
        ) : notFound ? (
          <Reveal delay={0} direction="up">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 sm:p-12 text-center shadow-sm max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3 border border-rose-200">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-medium text-neutral-950">
                Consignment Reference Not Found
              </h3>
              <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed">
                No matching consignment was found for reference <strong className="text-neutral-950 font-mono">{orderIdInput}</strong>. Please verify your invoice number or contact concierge desk.
              </p>
            </div>
          </Reveal>
        ) : activeOrder ? (
          <div className="space-y-6">

            {/* Overview Card */}
            <Reveal delay={0} direction="up">
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-sm">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                      Consignment ID
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-medium text-neutral-950 truncate mt-0.5">
                      {activeOrder.id}
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5 truncate">
                      Placed on {activeOrder.date} &bull; {activeOrder.paymentMethod}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                      activeOrder.status === 'Delivered'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : activeOrder.status === 'Cancelled'
                          ? 'bg-rose-50 border-rose-200 text-rose-800'
                          : activeOrder.status === 'Refunded'
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                            : String(activeOrder.status || '').includes('Return')
                              ? 'bg-purple-50 border-purple-200 text-purple-800'
                              : 'bg-[#F5F2EB] border-[#C5A880]/50 text-[#8C6734]'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>Status: {activeOrder.status}</span>
                    </span>
                  </div>
                </div>

                {/* Cancellation Banner */}
                {activeOrder.status === 'Cancelled' && (
                  <div className="my-5 rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-900 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5 text-rose-800">
                        <span>🚫</span> Consignment Terminated / Cancelled
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-200/70 text-rose-900">
                        Payment: {activeOrder.paymentStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-700">
                      <strong>Cancellation Reason:</strong> {activeOrder.cancellation?.reason || 'Cancelled upon request.'}
                    </p>
                    <p className="text-[10.5px] text-rose-600">
                      Recorded on: {activeOrder.cancellation?.date || activeOrder.date}
                    </p>
                  </div>
                )}

                {/* Return / Refund Banner */}
                {activeOrder.status === 'Return Requested' && (
                  <div className="my-5 rounded-xl border border-purple-200 bg-purple-50/80 p-4 text-xs text-purple-950 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5 text-purple-800">
                        <span>⏳</span> 7-Day Return &amp; Refund Under Review
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-200/70 text-purple-900">
                        Pending Approval
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-800">
                      <strong>Reason:</strong> {activeOrder.returnRequest?.reason} &bull; <strong>Refund Method:</strong> {activeOrder.returnRequest?.refundPreference}
                    </p>
                    <p className="text-[10.5px] text-purple-600">
                      Our concierge inspection hub will review this request and assign reverse courier pickup.
                    </p>
                  </div>
                )}

                {activeOrder.status === 'Refunded' && (
                  <div className="my-5 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-950 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5 text-emerald-800">
                        <span>✅</span> Return Accepted &amp; Refund Completed
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-emerald-600 text-white shadow-2xs">
                        Settled
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      Refund of <strong>₹{(activeOrder.refundDetails?.amount || activeOrder.total)?.toLocaleString('en-IN')}</strong> settled via {activeOrder.refundDetails?.refundMode || activeOrder.paymentMethod}.
                    </p>
                    <p className="text-[10.5px] text-emerald-600">
                      Settlement Txn ID: <span className="font-mono font-bold">{activeOrder.refundDetails?.transactionId || 'REF-CONFIRMED'}</span> &bull; {activeOrder.refundDetails?.date || activeOrder.date}
                    </p>
                  </div>
                )}

                {/* Carrier Meta Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-neutral-100 text-xs">
                  <div className="min-w-0">
                    <span className="text-neutral-400 block font-semibold text-[11px] uppercase tracking-wider">Courier Partner:</span>
                    <span className="font-bold text-neutral-950 mt-0.5 block truncate">{activeOrder.courier || 'BlueDart Express'}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-neutral-400 block font-semibold text-[11px] uppercase tracking-wider">AWB Tracking Code:</span>
                    <span className="font-mono text-neutral-950 font-bold mt-0.5 block truncate text-[#8C6734]">{activeOrder.trackingNumber || 'Pending'}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-neutral-400 block font-semibold text-[11px] uppercase tracking-wider">Recipient:</span>
                    <span className="font-bold text-neutral-950 mt-0.5 block truncate">
                      {activeOrder.customer?.firstName} {activeOrder.customer?.lastName}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-neutral-400 block font-semibold text-[11px] uppercase tracking-wider">Delivery Destination:</span>
                    <span className="font-bold text-neutral-950 mt-0.5 block truncate">
                      {activeOrder.customer?.city}, {activeOrder.customer?.state}
                    </span>
                  </div>
                </div>

                {/* Shipment Milestone Vertical Timeline */}
                <div className="pt-6">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6734] mb-6">
                    Shipment Transit Milestones
                  </h3>

                  <div className="relative pl-6 space-y-7 border-l-2 border-[#C5A880]/30 ml-2">
                    {activeOrder.timeline && activeOrder.timeline.map((step, idx) => {
                      const isDone = step.done ?? step.completed ?? false;
                      const stageLabel = step.status ?? step.stage ?? "Milestone";
                      const timeStamp = step.date ?? step.time ?? "--";
                      const description = step.description || (isDone ? "Milestone verified" : "Pending transit update");
                      const isCancelledNode = stageLabel === "Cancelled";
                      const isRefundNode = stageLabel === "Refunded";

                      return (
                        <div key={idx} className="relative">

                          {/* Step Indicator Node */}
                          <span
                            className={`absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-white ${
                              isCancelledNode
                                ? 'border-rose-600 bg-rose-600 text-white'
                                : isRefundNode
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
                                  : isDone
                                    ? 'border-[#8C6734] bg-[#8C6734] text-white'
                                    : 'border-neutral-300 bg-white'
                            }`}
                          >
                            {isCancelledNode ? (
                              <span className="text-[8px] font-bold">✕</span>
                            ) : isDone ? (
                              <span className="text-[8px] font-bold">✓</span>
                            ) : null}
                          </span>

                          <div className="min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              <h4 className={`text-xs font-bold truncate ${
                                isCancelledNode ? 'text-rose-600' : isDone ? 'text-neutral-950' : 'text-neutral-400'
                              }`}>
                                {stageLabel}
                              </h4>
                              {isDone && (
                                <span className="text-[10px] text-neutral-400 font-mono shrink-0">{timeStamp}</span>
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                              {description}
                            </p>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </Reveal>

            {/* Consignment Items Card */}
            <Reveal delay={80} direction="up">
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-sm">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6734] mb-4">
                  Consignment Contents ({activeOrder.items?.length || 0})
                </h3>

                <div className="divide-y divide-neutral-100">
                  {activeOrder.items?.map((it, idx) => (
                    <div key={idx} className="py-3.5 flex items-center justify-between gap-3 text-xs min-w-0">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={it.image}
                          alt=""
                          className="h-12 w-12 rounded-lg object-contain bg-[#FAFAFB] border border-neutral-200 p-1 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-950 truncate">{it.name}</p>
                          <span className="text-[11px] text-neutral-500 truncate block">
                            {it.brand} &bull; Qty: {it.quantity} {it.color && `&bull; Color: ${it.color}`}
                          </span>
                        </div>
                      </div>
                      <span className="font-serif font-medium text-neutral-950 shrink-0 text-sm">
                        ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

          </div>
        ) : null}

      </main>

      <Footer />
    </div>
  );
}