// src/pages/OrderTracking.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getOrderById, getOrders } from '../utils/orderStore';
import { SearchIcon, TruckIcon, ShieldCheckIcon, BoxIcon } from '../components/Icons';
import BrandSpinner from '../components/BrandSpinner';
import { Reveal } from '../components/useScrollReveal';
import { Package, Truck, CheckCircle2, Clock, Sparkles } from 'lucide-react';

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

      {/* Header Banner */}
      <section className="border-b border-neutral-200/80 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal delay={0} direction="up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734] animate-ping" />
              <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#8C6734]">
                Logistics &amp; Consignment Tracking
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-neutral-950">
              Track Your <span className="italic font-normal text-[#8C6734]">Consignment</span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
              Enter your order reference code to view real-time transit milestones from boutique dispatch to doorstep delivery.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  placeholder="e.g. KA-98421"
                  className="w-full rounded-lg border border-neutral-200/90 bg-[#FAFAFB] px-4 py-3 text-xs text-neutral-900 font-mono uppercase tracking-wider outline-none transition-colors duration-200 focus:border-[#C5A880] focus:bg-white focus:ring-1 focus:ring-[#C5A880]"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-950 px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#8C6734] transition-colors shadow-sm shrink-0 cursor-pointer active:scale-98"
              >
                <SearchIcon className="w-3.5 h-3.5 shrink-0" />
                <span>Track</span>
              </button>
            </form>

            {/* Sample ID Chips */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400 flex-wrap">
              <span>Recent test references:</span>
              {sampleOrderIds.map((sid) => (
                <button
                  key={sid}
                  type="button"
                  onClick={() => {
                    setOrderIdInput(sid);
                    setSearchParams({ id: sid });
                    refreshOrder(sid);
                  }}
                  className="font-mono text-neutral-800 font-semibold px-2 py-0.5 rounded bg-[#FAF8F5] border border-neutral-200/80 hover:border-[#C5A880] hover:text-[#8C6734] transition-colors cursor-pointer"
                >
                  {sid}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">

        {isSearching ? (
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[300px]">
            <BrandSpinner size="lg" variant="gold" showBadge={true} label="Fetching real-time consignment status..." />
          </div>
        ) : notFound ? (
          <Reveal delay={0} direction="up">
            <div className="rounded-2xl border border-neutral-200/90 bg-white p-8 sm:p-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF8F5] border border-[#C5A880]/50 text-[#8C6734] mb-3">
                🔍
              </div>
              <h3 className="font-serif text-xl font-medium text-neutral-950">Consignment Reference Not Found</h3>
              <p className="mt-1.5 text-xs text-neutral-500 max-w-md mx-auto">
                No matching consignment was found for code <strong className="text-neutral-950 font-mono">{orderIdInput}</strong>. Please verify your invoice number.
              </p>
            </div>
          </Reveal>
        ) : activeOrder ? (
          <div className="space-y-6">

            {/* Overview Card */}
            <Reveal delay={50} direction="up">
              <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-5">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8C6734]">Consignment Reference</span>
                    <h2 className="text-xl sm:text-2xl font-mono font-bold text-neutral-950 truncate mt-0.5">
                      {activeOrder.id}
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5 truncate">Placed on {activeOrder.date} &bull; {activeOrder.paymentMethod}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${
                      activeOrder.status === 'Delivered'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : activeOrder.status === 'Cancelled'
                          ? 'bg-rose-50 border-rose-200 text-rose-800'
                          : activeOrder.status === 'Refunded'
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                            : String(activeOrder.status || '').includes('Return')
                              ? 'bg-purple-50 border-purple-200 text-purple-800'
                              : 'bg-[#FAF8F5] border-[#C5A880]/50 text-[#8C6734] font-semibold'
                    }`}>
                      Status: {activeOrder.status}
                    </span>
                  </div>
                </div>

                {/* Cancellation Banner */}
                {activeOrder.status === 'Cancelled' && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-900 space-y-1">
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
                  <div className="rounded-xl border border-purple-200 bg-purple-50/80 p-4 text-xs text-purple-950 space-y-1">
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
                  <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-950 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5 text-emerald-800">
                        <span>✅</span> Return Accepted &amp; Refund Completed
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-emerald-600 text-white shadow-xs">
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

                {/* Carrier Meta */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-neutral-100 text-xs">
                  <div className="min-w-0">
                    <span className="text-neutral-400 block font-medium">Courier Partner:</span>
                    <span className="font-semibold text-neutral-950 mt-0.5 block truncate">{activeOrder.courier || 'BlueDart Express'}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-neutral-400 block font-medium">AWB Tracking Code:</span>
                    <span className="font-mono text-[#8C6734] font-bold mt-0.5 block truncate">{activeOrder.trackingNumber || 'Pending'}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-neutral-400 block font-medium">Recipient:</span>
                    <span className="font-semibold text-neutral-950 mt-0.5 block truncate">
                      {activeOrder.customer?.firstName} {activeOrder.customer?.lastName}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-neutral-400 block font-medium">Delivery Destination:</span>
                    <span className="font-semibold text-neutral-950 mt-0.5 block truncate">
                      {activeOrder.customer?.city}, {activeOrder.customer?.state}
                    </span>
                  </div>
                </div>

                {/* Shipment Milestone Vertical Timeline */}
                <div className="pt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-950 mb-6">
                    Shipment Transit Milestones
                  </h3>

                  <div className="relative pl-7 space-y-7 border-l-2 border-neutral-200 ml-2">
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
                            className={`absolute -left-[36px] top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 bg-white ${
                              isCancelledNode
                                ? 'border-rose-600 bg-rose-600 text-white'
                                : isRefundNode
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
                                  : isDone
                                    ? 'border-[#8C6734] bg-[#8C6734] text-white shadow-2xs'
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
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
                              <h4 className={`text-xs font-semibold truncate ${
                                isCancelledNode ? 'text-rose-600' : isDone ? 'text-neutral-950 font-bold' : 'text-neutral-400'
                              }`}>
                                {stageLabel}
                              </h4>
                              {isDone && (
                                <span className="text-[10.5px] text-neutral-400 font-mono shrink-0">{timeStamp}</span>
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
            <Reveal delay={120} direction="up">
              <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-950 mb-4">
                  Consignment Contents ({activeOrder.items?.length || 0})
                </h3>

                <div className="divide-y divide-neutral-100">
                  {activeOrder.items?.map((it, idx) => (
                    <div key={idx} className="py-3.5 flex items-center justify-between gap-4 text-xs min-w-0">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img src={it.image} alt="" className="h-12 w-12 rounded-xl object-contain bg-[#FAF8F5] border border-neutral-200/80 p-1 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-950 truncate">{it.name}</p>
                          <span className="text-[10.5px] text-neutral-400 truncate block mt-0.5">{it.brand} &bull; Qty: {it.quantity} {it.color && `&bull; ${it.color}`}</span>
                        </div>
                      </div>
                      <span className="font-semibold text-neutral-950 shrink-0 text-xs tabular-nums">
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