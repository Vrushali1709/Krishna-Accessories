// src/pages/OrderTracking.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getOrderById } from '../utils/orderStore';
import {
  Search,
  Truck,
  Package,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';

export default function OrderTracking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || 'KA-98421';

  const [orderIdInput, setOrderIdInput] = useState(initialId);
  const [activeOrder, setActiveOrder] = useState(() => getOrderById(initialId));
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopyId = () => {
    if (activeOrder?.id) {
      navigator.clipboard.writeText(activeOrder.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sampleOrderIds = ['KA-98421', 'KA-98420', 'KA-98419'];

  // Stepper helper logic
  const getStepStatus = (order) => {
    if (!order) return { currentStep: 0, steps: [] };
    const status = order.status?.toLowerCase() || '';

    const steps = [
      { key: 'placed', label: 'Order Placed', desc: 'Verified & Confirmed' },
      { key: 'processing', label: 'Processing', desc: 'Quality Inspected' },
      { key: 'shipped', label: 'In Transit', desc: 'Courier Dispatched' },
      { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Final Mile Courier' },
      { key: 'delivered', label: 'Delivered', desc: 'Doorstep Completed' },
    ];

    let currentStep = 0;
    if (status.includes('deliver') || status === 'delivered') currentStep = 4;
    else if (status.includes('out')) currentStep = 3;
    else if (status.includes('ship') || status === 'shipped') currentStep = 2;
    else if (status.includes('process') || status === 'processing' || status.includes('pack')) currentStep = 1;
    else currentStep = 0;

    return { currentStep, steps };
  };

  const { currentStep, steps } = getStepStatus(activeOrder);

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. MINIMAL LUXURY TRACKING HERO & SEARCH BAR                             */}
      {/* ========================================================================= */}
      <section className="bg-white border-b border-neutral-200/80 py-12 sm:py-16 relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734] animate-pulse" />
            <span className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-[#8C6734]">
              Live Consignment Tracking
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-neutral-950">
            Track Your Consignment
          </h1>

          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
            Enter your order reference code to view real-time transit milestones from boutique dispatch to doorstep delivery.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="mt-6 max-w-lg mx-auto flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder="e.g. KA-98421"
                className="w-full rounded-xl border border-neutral-200 bg-[#F4F4F6] px-4 py-3 text-xs sm:text-sm text-neutral-900 font-mono uppercase tracking-wider outline-none transition-all focus:border-[#C5A880] focus:bg-white focus:shadow-xs"
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all shadow-sm hover:shadow-md active:scale-98 shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#C5A880]" />
              <span>Track Order</span>
            </button>
          </form>

          {/* Quick Demo Reference Chips */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-neutral-400 flex-wrap">
            <span className="text-[11px]">Quick references:</span>
            {sampleOrderIds.map((sid) => (
              <button
                key={sid}
                type="button"
                onClick={() => {
                  setOrderIdInput(sid);
                  setSearchParams({ id: sid });
                  refreshOrder(sid);
                }}
                className={`font-mono text-xs px-2.5 py-0.5 rounded-md border transition-all cursor-pointer ${
                  activeOrder?.id === sid
                    ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {sid}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN TRACKING CONTENT AREA                                             */}
      {/* ========================================================================= */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">

        {notFound ? (
          /* Not Found Empty State */
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-10 sm:p-14 text-center shadow-sm max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-500">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-950">
                Consignment Reference Not Found
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 leading-relaxed">
                No matching order was found for reference <strong className="text-neutral-900 font-mono">{orderIdInput}</strong>. Please verify the code from your order confirmation SMS or invoice.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setOrderIdInput('KA-98421');
                  setSearchParams({ id: 'KA-98421' });
                  refreshOrder('KA-98421');
                }}
                className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase rounded-lg transition-all"
              >
                View Sample Order (KA-98421)
              </button>
            </div>
          </div>
        ) : activeOrder ? (
          <div className="space-y-6 sm:space-y-8">

            {/* A. Top Overview Summary Card */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6734]">
                      Consignment Order
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 mt-0.5">
                    <h2 className="text-xl sm:text-2xl font-bold font-mono text-neutral-950 tracking-tight">
                      {activeOrder.id}
                    </h2>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      title="Copy Reference ID"
                      className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Placed on {activeOrder.date} &bull; {activeOrder.paymentMethod}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold ${
                    activeOrder.status === 'Delivered'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : activeOrder.status === 'Cancelled'
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : activeOrder.status === 'Refunded'
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                          : activeOrder.status.includes('Return')
                            ? 'bg-purple-50 border-purple-200 text-purple-800'
                            : 'bg-[#F5F2EB] border-[#C5A880]/60 text-[#8C6734]'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      activeOrder.status === 'Delivered'
                        ? 'bg-emerald-600'
                        : activeOrder.status === 'Cancelled'
                          ? 'bg-rose-600'
                          : 'bg-[#8C6734] animate-pulse'
                    }`} />
                    <span>Status: {activeOrder.status}</span>
                  </span>
                </div>
              </div>

              {/* B. Modern Horizontal Stepper Progress */}
              <div className="py-8 sm:py-10">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="hidden sm:block absolute top-4 left-0 right-0 h-0.5 bg-neutral-200 -z-0" />
                  <div
                    className="hidden sm:block absolute top-4 left-0 h-0.5 bg-[#8C6734] transition-all duration-700 ease-out -z-0"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                  />

                  {/* Steps Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                    {steps.map((step, idx) => {
                      const isCompleted = idx < currentStep;
                      const isCurrent = idx === currentStep;
                      const isUpcoming = idx > currentStep;

                      return (
                        <div key={step.key} className="flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-3.5 sm:gap-2">
                          
                          {/* Step Icon Node */}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300 ${
                              isCompleted
                                ? 'bg-[#8C6734] border-[#8C6734] text-white shadow-xs'
                                : isCurrent
                                  ? 'bg-white border-[#8C6734] text-[#8C6734] ring-4 ring-[#C5A880]/20'
                                  : 'bg-white border-neutral-200 text-neutral-300'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-4 h-4 text-white" />
                            ) : (
                              <span className="text-xs font-bold font-mono">{idx + 1}</span>
                            )}
                          </div>

                          {/* Step Text */}
                          <div className="min-w-0">
                            <p className={`text-xs font-bold leading-tight ${
                              isCurrent ? 'text-neutral-950 font-bold' : isCompleted ? 'text-neutral-800' : 'text-neutral-400'
                            }`}>
                              {step.label}
                            </p>
                            <p className="text-[11px] text-neutral-400 leading-tight mt-0.5 sm:block hidden">
                              {step.desc}
                            </p>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* C. Carrier & Destination Quick Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-neutral-100 text-xs">
                <div>
                  <span className="text-[11px] text-neutral-400 block font-medium">Courier Partner:</span>
                  <span className="font-bold text-neutral-900 mt-0.5 block truncate">
                    {activeOrder.courier || 'BlueDart Express'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block font-medium">AWB Tracking Code:</span>
                  <span className="font-mono text-neutral-900 font-bold mt-0.5 block truncate">
                    {activeOrder.trackingNumber || 'Pending Assignment'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block font-medium">Recipient:</span>
                  <span className="font-bold text-neutral-900 mt-0.5 block truncate">
                    {activeOrder.customer?.firstName} {activeOrder.customer?.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block font-medium">Delivery Destination:</span>
                  <span className="font-bold text-neutral-900 mt-0.5 block truncate">
                    {activeOrder.customer?.city}, {activeOrder.customer?.state}
                  </span>
                </div>
              </div>

            </div>

            {/* D. Main 2-Column Details: Milestones (Left) & Package Contents / Summary (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              
              {/* Left Column: Transit Milestones Timeline (7 Cols) */}
              <div className="lg:col-span-7 rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-7 shadow-xs space-y-6">
                
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#8C6734]" />
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-950">
                      Transit Milestones
                    </h3>
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    Real-time updates
                  </span>
                </div>

                <div className="relative pl-6 space-y-6 border-l-2 border-neutral-200 ml-2">
                  {activeOrder.timeline && activeOrder.timeline.map((step, idx) => {
                    const isDone = step.done ?? step.completed ?? false;
                    const stageLabel = step.status ?? step.stage ?? "Milestone";
                    const timeStamp = step.date ?? step.time ?? "--";
                    const description = step.description || (isDone ? "Milestone verified" : "Pending transit update");
                    const isCancelledNode = stageLabel === "Cancelled";
                    const isRefundNode = stageLabel === "Refunded";

                    return (
                      <div key={idx} className="relative group">
                        
                        {/* Milestone Node */}
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
                            <span className="text-[7px] font-bold">✕</span>
                          ) : isDone ? (
                            <span className="text-[7px] font-bold">✓</span>
                          ) : null}
                        </span>

                        <div className="min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h4 className={`text-xs sm:text-sm font-bold truncate ${
                              isCancelledNode ? 'text-rose-600' : isDone ? 'text-neutral-950' : 'text-neutral-400'
                            }`}>
                              {stageLabel}
                            </h4>
                            {isDone && (
                              <span className="text-[11px] text-neutral-400 font-mono shrink-0">
                                {timeStamp}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                            {description}
                          </p>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Right Column: Consignment Items & Support (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Items in Consignment */}
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#8C6734]" />
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-950">
                        Package Contents ({activeOrder.items?.length || 0})
                      </h3>
                    </div>
                  </div>

                  <div className="divide-y divide-neutral-100">
                    {activeOrder.items?.map((it, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={it.image}
                            alt=""
                            className="h-12 w-12 rounded-lg object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-neutral-950 truncate leading-snug">{it.name}</p>
                            <span className="text-[11px] text-neutral-500 truncate block">
                              {it.brand} &bull; Qty: {it.quantity} {it.color && `&bull; ${it.color}`}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-neutral-950 shrink-0 text-xs sm:text-sm">
                          ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Financial Summary */}
                  <div className="pt-3 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-neutral-900">₹{(activeOrder.subtotal || activeOrder.total)?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insured Express Shipping</span>
                      <span className="font-semibold text-emerald-700">FREE</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-neutral-100 text-sm font-bold text-neutral-950">
                      <span>Total Paid</span>
                      <span>₹{Number(activeOrder.total).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address & Help Card */}
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-3.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-950">
                    <MapPin className="w-4 h-4 text-[#8C6734]" />
                    <span>Delivery Address</span>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                    <strong className="text-neutral-900 block font-semibold">
                      {activeOrder.customer?.firstName} {activeOrder.customer?.lastName}
                    </strong>
                    {activeOrder.customer?.address}<br />
                    {activeOrder.customer?.city}, {activeOrder.customer?.state} — {activeOrder.customer?.pincode}
                  </p>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-neutral-500 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#8C6734]" />
                      <span>Need help with delivery?</span>
                    </span>
                    <Link
                      to="/contact"
                      className="font-semibold text-[#8C6734] hover:text-neutral-950 flex items-center gap-1 transition-colors"
                    >
                      <span>Contact Desk</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

              </div>

            </div>

          </div>
        ) : null}

      </main>

      <Footer />
    </div>
  );
}