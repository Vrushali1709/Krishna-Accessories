// src/pages/OrderTracking.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getOrderById, getOrders } from '../utils/orderStore';
import { SearchIcon, TruckIcon, ShieldCheckIcon, BoxIcon } from '../components/Icons';

export default function OrderTracking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || 'KA-98421';

  const [orderIdInput, setOrderIdInput] = useState(initialId);
  const [activeOrder, setActiveOrder] = useState(() => getOrderById(initialId));
  const [notFound, setNotFound] = useState(false);

  const refreshOrder = (idToLookup) => {
    const id = idToLookup || orderIdInput;
    const found = getOrderById(id);
    if (found) {
      setActiveOrder(found);
      setNotFound(false);
    } else {
      setActiveOrder(null);
      setNotFound(true);
    }
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
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
      <Navbar />

      {/* Header Banner */}
      <section className="border-b border-gray-200 bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Logistics & Consignment Tracking
          </span>
          <h1 className="mt-1 text-2xl sm:text-4xl font-bold tracking-tight text-gray-950">
            Track Consignment
          </h1>
          <p className="mt-1.5 text-xs text-gray-500 max-w-md mx-auto">
            Enter your order reference code to view real-time transit milestones from boutique dispatch to doorstep delivery.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-6 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder="e.g. KA-98421"
                className="w-full rounded-full border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs text-gray-900 font-mono uppercase outline-none focus:border-gray-400 focus:bg-white"
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#111827] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition shadow-sm shrink-0"
            >
              <SearchIcon className="w-3.5 h-3.5 shrink-0" />
              <span>Track</span>
            </button>
          </form>

          {/* Sample ID Chips */}
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-400 flex-wrap">
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
                className="font-mono text-gray-800 font-bold hover:underline"
              >
                {sid}
              </button>
            ))}
          </div>

        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        {notFound ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h3 className="text-base font-bold text-gray-950">Consignment Reference Not Found</h3>
            <p className="mt-1.5 text-xs text-gray-500">
              No matching consignment was found for code <strong className="text-gray-900 font-mono">{orderIdInput}</strong>. Please check your order invoice.
            </p>
          </div>
        ) : activeOrder ? (
          <div className="space-y-6">

            {/* Overview Card */}
            <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-8 shadow-sm">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Consignment ID:</span>
                  <h2 className="text-lg sm:text-2xl font-bold font-mono text-gray-950 truncate">
                    {activeOrder.id}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">Placed on {activeOrder.date} &bull; {activeOrder.paymentMethod}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`rounded-full border px-3.5 py-1 text-xs font-bold ${activeOrder.status === 'Delivered'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : activeOrder.status === 'Cancelled'
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : activeOrder.status === 'Refunded'
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                          : activeOrder.status.includes('Return')
                            ? 'bg-purple-50 border-purple-200 text-purple-800'
                            : 'bg-blue-50 border-blue-200 text-blue-800'
                    }`}>
                    Status: {activeOrder.status}
                  </span>
                </div>
              </div>

              {/* Cancellation Banner */}
              {activeOrder.status === 'Cancelled' && (
                <div className="my-5 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-900 space-y-1">
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
                <div className="my-5 rounded-2xl border border-purple-200 bg-purple-50/80 p-4 text-xs text-purple-950 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-purple-800">
                      <span>⏳</span> 7-Day Return & Refund Under Review
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
                <div className="my-5 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-950 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-emerald-800">
                      <span>✅</span> Return Accepted & Refund Completed
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-gray-100 text-xs">
                <div className="min-w-0">
                  <span className="text-gray-400 block font-semibold">Courier Partner:</span>
                  <span className="font-bold text-gray-900 mt-0.5 block truncate">{activeOrder.courier || 'BlueDart Express'}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-gray-400 block font-semibold">AWB Tracking Code:</span>
                  <span className="font-mono text-gray-900 font-bold mt-0.5 block truncate">{activeOrder.trackingNumber || 'Pending'}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-gray-400 block font-semibold">Recipient:</span>
                  <span className="font-bold text-gray-900 mt-0.5 block truncate">
                    {activeOrder.customer?.firstName} {activeOrder.customer?.lastName}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-gray-400 block font-semibold">Delivery City:</span>
                  <span className="font-bold text-gray-900 mt-0.5 block truncate">
                    {activeOrder.customer?.city}, {activeOrder.customer?.state}
                  </span>
                </div>
              </div>

              {/* Shipment Milestone Vertical Timeline */}
              <div className="pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-5">
                  Shipment Transit Milestones
                </h3>

                <div className="relative pl-6 space-y-6 border-l-2 border-gray-200 ml-2">
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
                          className={`absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-white ${isCancelledNode
                              ? 'border-rose-600 bg-rose-600 text-white'
                              : isRefundNode
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : isDone
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
                                  : 'border-gray-300 bg-white'
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
                            <h4 className={`text-xs font-bold truncate ${isCancelledNode ? 'text-rose-600' : isDone ? 'text-gray-950' : 'text-gray-400'
                              }`}>
                              {stageLabel}
                            </h4>
                            {isDone && (
                              <span className="text-[10px] text-gray-400 font-mono shrink-0">{timeStamp}</span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                            {description}
                          </p>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Consignment Items Card */}
            <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-8 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-4">
                Consignment Contents ({activeOrder.items?.length || 0})
              </h3>

              <div className="divide-y divide-gray-100">
                {activeOrder.items?.map((it, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={it.image} alt="" className="h-12 w-12 rounded-xl object-contain bg-[#F4F4F6] border border-gray-200 p-1 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-gray-950 truncate">{it.name}</p>
                        <span className="text-[10px] text-gray-400 truncate block">{it.brand} &bull; Qty: {it.quantity} {it.color && `&bull; ${it.color}`}</span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-950 shrink-0 text-xs">
                      ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : null}

      </main>

      <Footer />
    </div>
  );
}