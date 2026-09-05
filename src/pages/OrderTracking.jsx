// src/pages/OrderTracking.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getOrderById, getOrders } from '../utils/orderStore';
import { SearchIcon, TruckIcon, ShieldCheckIcon, BoxIcon, CheckCircleIcon } from '../components/Icons';

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

  const getStepIndex = (status) => {
    switch (status) {
      case 'Delivered': return 4;
      case 'Out for Delivery': return 3;
      case 'Shipped': return 2;
      case 'Processing':
      case 'Confirmed': return 1;
      default: return 0;
    }
  };

  const currentStep = activeOrder ? getStepIndex(activeOrder.status) : 0;

  const steps = [
    { title: 'Order Stamped', desc: 'Payment verified & order registered' },
    { title: 'Boutique Inspected', desc: 'Authenticity & movement diagnostics' },
    { title: 'In Insured Transit', desc: 'Dispatched via BlueDart / Delhivery' },
    { title: 'Out for Delivery', desc: 'With local delivery agent' },
    { title: 'Delivered', desc: 'Securely received by client' }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 overflow-x-clip">
      <Navbar />

      {/* Header Banner */}
      <section className="border-b border-zinc-200/80 bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B89035]">
            Logistics & Consignment Tracking
          </span>
          <h1 className="mt-1 text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-sans">
            Track Consignment
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed">
            Enter your order reference code to view real-time transit milestones from boutique packaging to doorstep delivery.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-6 max-w-md mx-auto flex gap-2">
            <input
              type="text"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="e.g. KA-98421"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs text-zinc-900 font-mono uppercase outline-none focus:border-zinc-900 focus:bg-white transition"
              required
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black transition shadow-xs shrink-0 cursor-pointer"
            >
              <SearchIcon className="w-3.5 h-3.5" />
              <span>Track</span>
            </button>
          </form>

          {/* Sample ID Chips */}
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-zinc-400 flex-wrap">
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
                className="font-mono text-zinc-800 font-bold hover:underline"
              >
                {sid}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">

        {notFound && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-xs space-y-3">
            <h3 className="text-base font-bold text-zinc-900">Consignment Not Found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              No order found matching reference <strong className="font-mono text-zinc-800">{orderIdInput}</strong>. Please double check the ID from your receipt.
            </p>
          </div>
        )}

        {activeOrder && (
          <div className="space-y-6">

            {/* Consignment Status Header */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Order Reference</span>
                  <h2 className="text-xl font-bold font-mono text-zinc-950">{activeOrder.id}</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Placed on: {activeOrder.date}</p>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                    activeOrder.status === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : activeOrder.status === 'Cancelled' || activeOrder.status === 'Refunded'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    Current Status: {activeOrder.status}
                  </span>
                  <p className="text-xs text-zinc-500 font-medium">
                    Courier: {activeOrder.courier || 'BlueDart Air Express'} {activeOrder.trackingNumber && `(${activeOrder.trackingNumber})`}
                  </p>
                </div>
              </div>

              {/* Progress Milestones Timeline */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                  Consignment Milestone Progression
                </h3>

                <div className="relative grid grid-cols-1 md:grid-cols-5 gap-4">
                  {steps.map((step, idx) => {
                    const isCompleted = currentStep >= idx;
                    const isCurrent = currentStep === idx;

                    return (
                      <div key={idx} className="relative flex flex-row md:flex-col items-start gap-3 p-2">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                          isCompleted
                            ? 'bg-zinc-900 text-white shadow-xs'
                            : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                        }`}>
                          {isCompleted ? '✓' : idx + 1}
                        </div>

                        <div className="min-w-0">
                          <h4 className={`text-xs font-bold ${isCompleted ? 'text-zinc-950' : 'text-zinc-400'}`}>
                            {step.title}
                          </h4>
                          <p className="text-[10.5px] text-zinc-500 leading-tight mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Consignment Items & Coordinates */}
            <div className="grid gap-6 md:grid-cols-2">

              {/* Items in Consignment */}
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-2.5">
                  Items in Parcel ({activeOrder.items?.length || 0})
                </h3>

                <div className="divide-y divide-zinc-100 space-y-2">
                  {activeOrder.items?.map((item, idx) => (
                    <div key={idx} className="pt-2 first:pt-0 flex items-center gap-3">
                      <img src={item.image} alt="" className="h-10 w-10 rounded-lg object-contain bg-zinc-50 border border-zinc-200 p-0.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-zinc-950 truncate">{item.name}</p>
                        <p className="text-[10px] text-zinc-400">Qty: {item.quantity} &bull; {item.brand}</p>
                      </div>
                      <span className="text-xs font-bold font-mono text-zinc-950">
                        ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destination & Concierge */}
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs space-y-3 text-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-2.5">
                  Delivery Destination Coordinates
                </h3>
                <p className="font-bold text-zinc-900">{activeOrder.customer?.firstName} {activeOrder.customer?.lastName}</p>
                <p className="text-zinc-600">{activeOrder.customer?.address}</p>
                <p className="text-zinc-600">{activeOrder.customer?.city}, {activeOrder.customer?.state} {activeOrder.customer?.pincode}</p>
                
                <div className="pt-3 border-t border-zinc-100 space-y-1 text-zinc-500">
                  <p>Concierge Line: <strong className="text-zinc-800">+91 (079) 4000-5500</strong></p>
                  <p>Insured Value: <strong className="font-mono text-zinc-950">₹{activeOrder.total?.toLocaleString('en-IN')}</strong></p>
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