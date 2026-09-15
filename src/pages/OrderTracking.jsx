// src/pages/OrderTracking.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getOrderById, getOrders } from '../utils/orderStore';
import { SearchIcon, TruckIcon, ShieldCheckIcon, BoxIcon } from '../components/Icons';
import BrandSpinner from '../components/BrandSpinner';
import { Reveal } from '../components/useScrollReveal';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  Package,
  Copy,
  Check,
  Building2,
  Phone,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { SHOP_INFO } from '../utils/shopInfo';

export default function OrderTracking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || 'KA-98421';

  const [orderIdInput, setOrderIdInput] = useState(initialId);
  const [activeOrder, setActiveOrder] = useState(() => getOrderById(initialId));
  const [notFound, setNotFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

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

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const sampleOrderIds = ['KA-98421', 'KA-98420', 'KA-98419'];

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
      <Navbar />

      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white py-12 sm:py-16">
        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-blue-50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          {/* Breadcrumb */}
          <Reveal direction="down" delay={50}>
            <div className="mb-3 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
              <Link to="/" className="hover:text-gray-900 transition">Home</Link>
              <span>/</span>
              <span className="text-[#B89758] font-semibold">Track Consignment</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={100}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.2em] text-blue-800">
              <Truck className="h-3.5 w-3.5" />
              <span>Logistics &amp; Consignment Tracking</span>
            </span>
          </Reveal>

          <Reveal direction="up" delay={200}>
            <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-gray-950">
              Track Consignment
            </h1>
          </Reveal>

          <Reveal direction="up" delay={300}>
            <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              Enter your order reference code to view real-time transit milestones from boutique packaging to doorstep delivery.
            </p>
          </Reveal>

          {/* Search Form */}
          <Reveal direction="up" delay={400}>
            <form onSubmit={handleSearch} className="mt-6 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  placeholder="e.g. KA-98421"
                  className="w-full rounded-full border border-gray-200 bg-[#F4F4F6] px-5 py-3 text-xs text-gray-900 font-mono uppercase outline-none focus:border-gray-900 focus:bg-white shadow-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition shadow-sm shrink-0 cursor-pointer"
              >
                <SearchIcon className="w-3.5 h-3.5 shrink-0" />
                <span>Track</span>
              </button>
            </form>
          </Reveal>

          {/* Sample ID Chips */}
          <Reveal direction="up" delay={450}>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 flex-wrap">
              <span>Try recent references:</span>
              {sampleOrderIds.map((sid) => (
                <button
                  key={sid}
                  type="button"
                  onClick={() => {
                    setOrderIdInput(sid);
                    setSearchParams({ id: sid });
                    refreshOrder(sid);
                  }}
                  className="font-mono text-gray-800 font-bold hover:text-[#B89758] underline underline-offset-2 cursor-pointer transition"
                >
                  {sid}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Main Results Section */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        {isSearching ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[300px]">
            <BrandSpinner size="lg" variant="gold" showBadge={true} label="Fetching real-time consignment status..." />
          </div>
        ) : notFound ? (
          <Reveal direction="zoom" delay={100}>
            <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm space-y-3">
              <BoxIcon className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="text-base font-bold text-gray-950">Consignment Reference Not Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No matching consignment was found for reference <strong className="text-gray-900 font-mono">{orderIdInput}</strong>. Please verify your invoice number or contact concierge desk.
              </p>
              <Link
                to="/account?tab=orders"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#111827] px-6 py-2.5 text-xs font-bold text-white hover:bg-black transition"
              >
                View Orders in Account
              </Link>
            </div>
          </Reveal>
        ) : activeOrder ? (
          <div className="space-y-6">

            {/* Overview Card */}
            <Reveal direction="up" delay={100}>
              <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Consignment Reference</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <h2 className="text-xl sm:text-2xl font-bold font-mono text-gray-950 truncate">
                        {activeOrder.id}
                      </h2>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(activeOrder.id)}
                        className="rounded-lg p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer"
                        title="Copy Reference"
                      >
                        {copiedId ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">Placed on {activeOrder.date} &bull; {activeOrder.paymentMethod}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`rounded-full border px-4 py-1.5 text-xs font-bold shadow-2xs ${
                      activeOrder.status === 'Delivered'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : activeOrder.status === 'Cancelled'
                          ? 'bg-rose-50 border-rose-200 text-rose-800'
                          : activeOrder.status === 'Refunded'
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                            : activeOrder.status.includes('Return')
                              ? 'bg-purple-50 border-purple-200 text-purple-800'
                              : 'bg-blue-50 border-blue-200 text-blue-800'
                    }`}>
                      <span className="inline-block w-2 h-2 rounded-full mr-1.5 bg-current animate-pulse" />
                      Status: {activeOrder.status}
                    </span>
                  </div>
                </div>

                {/* Carrier Meta Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-gray-100 text-xs">
                  <div className="min-w-0">
                    <span className="text-gray-400 block font-semibold text-[11px]">Courier Partner:</span>
                    <span className="font-bold text-gray-900 mt-0.5 block truncate">{activeOrder.courier || 'BlueDart Express'}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-gray-400 block font-semibold text-[11px]">AWB Tracking Code:</span>
                    <span className="font-mono text-gray-900 font-bold mt-0.5 block truncate">{activeOrder.trackingNumber || 'Pending Dispatch'}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-gray-400 block font-semibold text-[11px]">Recipient:</span>
                    <span className="font-bold text-gray-900 mt-0.5 block truncate">
                      {activeOrder.customer?.firstName} {activeOrder.customer?.lastName}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-gray-400 block font-semibold text-[11px]">Destination:</span>
                    <span className="font-bold text-gray-900 mt-0.5 block truncate">
                      {activeOrder.customer?.city}, {activeOrder.customer?.state}
                    </span>
                  </div>
                </div>

                {/* Shipment Milestone Vertical Timeline */}
                <div className="pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-5 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#B89758]" />
                    <span>Shipment Transit Milestones</span>
                  </h3>

                  <div className="relative pl-6 space-y-6 border-l-2 border-gray-200 ml-2">
                    {activeOrder.timeline && activeOrder.timeline.map((step, idx) => {
                      const isDone = step.done ?? step.completed ?? false;
                      const stageLabel = step.status ?? step.stage ?? "Milestone";

                      return (
                        <div key={idx} className="relative group">
                          {/* Dot / Indicator */}
                          <div className={`absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${
                            isDone ? 'bg-emerald-500 text-white' : 'bg-gray-300'
                          }`}>
                            {isDone && <CheckCircle2 className="h-3 w-3" />}
                          </div>

                          <div>
                            <p className={`text-xs font-bold ${isDone ? 'text-gray-950' : 'text-gray-400'}`}>
                              {stageLabel}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {step.date || 'Pending update'} &bull; {step.location || 'Hub Processing'}
                            </p>
                            {step.note && (
                              <p className="text-[11px] text-gray-600 mt-1 italic">"{step.note}"</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ordered Items Preview */}
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-4">
                    Items in this Consignment ({activeOrder.items?.length || 0})
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {activeOrder.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#F4F4F6] p-3">
                        <img src={item.image} alt={item.name} className="h-12 w-12 rounded-xl object-contain bg-white p-1 border border-gray-200 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-950 truncate">{item.name}</p>
                          <p className="text-[10.5px] text-gray-500">Qty: {item.quantity} &bull; ₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </Reveal>

            {/* Concierge Contact Callout */}
            <Reveal direction="up" delay={200}>
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-950">Need assistance with your consignment?</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Our client advisors can re-route deliveries or arrange signature collection.</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={SHOP_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp Concierge</span>
                  </a>
                  <Link
                    to="/contact"
                    className="rounded-full border border-gray-200 bg-[#F4F4F6] px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-200 transition"
                  >
                    Contact Support
                  </Link>
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