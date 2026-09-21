// src/pages/Account.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCurrentUser, logout } from '../utils/auth';
import {
  getOrders,
  getUserAddresses,
  saveUserAddress,
  deleteUserAddress,
  cancelOrder,
  requestReturn,
  getOrderById
} from '../utils/orderStore';
import { getWishlist } from '../utils/productStore';
import {
  User,
  Truck,
  Heart,
  ShieldCheck,
  Lock,
  Search,
  CheckCircle2,
  Package,
  MapPin,
  Clock,
  RotateCcw,
  LogOut,
  Sparkles,
  Award,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  ArrowRight
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

export default function Account() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';
  const initialOrderId = searchParams.get('id') || '';

  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [orders, setOrders] = useState(() => getOrders());
  const [addresses, setAddresses] = useState(() => getUserAddresses());
  const [wishlist, setWishlist] = useState(() => getWishlist());
  const [activeTab, setActiveTab] = useState(initialTab);

  // Tracking state inside profile
  const [trackingIdInput, setTrackingIdInput] = useState(initialOrderId);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);
  const [trackingNotFound, setTrackingNotFound] = useState(false);

  // Address Modal state
  const [addrModalOpen, setAddrModalOpen] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);
  const [addrForm, setAddrForm] = useState({
    label: 'Home',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  // Cancel Order Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('Ordered by mistake');
  const [cancelComments, setCancelComments] = useState('');

  // Return Order Modal state
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
  const [returnReason, setReturnReason] = useState('Defective / Damaged Piece');
  const [returnComments, setReturnComments] = useState('');
  const [refundMethod, setRefundMethod] = useState('Original Payment Method');
  const [returnUpiId, setReturnUpiId] = useState('');
  const [returnBankDetails, setReturnBankDetails] = useState('');
  const [returnCondition, setReturnCondition] = useState('Unused with Original Packaging & Tags');

  const refreshData = () => {
    setCurrentUser(getCurrentUser());
    setOrders(getOrders());
    setAddresses(getUserAddresses());
    setWishlist(getWishlist());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('ordersUpdated', refreshData);
    window.addEventListener('addressesUpdated', refreshData);
    window.addEventListener('wishlistUpdated', refreshData);
    window.addEventListener('authUpdated', refreshData);
    return () => {
      window.removeEventListener('ordersUpdated', refreshData);
      window.removeEventListener('addressesUpdated', refreshData);
      window.removeEventListener('wishlistUpdated', refreshData);
      window.removeEventListener('authUpdated', refreshData);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleOpenAddAddress = () => {
    setEditingAddr(null);
    setAddrForm({
      label: 'Home',
      firstName: currentUser?.name?.split(' ')[0] || '',
      lastName: currentUser?.name?.split(' ')[1] || '',
      phone: currentUser?.phone || '',
      address: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400026',
      isDefault: addresses.length === 0
    });
    setAddrModalOpen(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddr(addr);
    setAddrForm({
      label: addr.label || 'Home',
      firstName: addr.firstName || '',
      lastName: addr.lastName || '',
      phone: addr.phone || '',
      address: addr.address || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      isDefault: addr.isDefault || false
    });
    setAddrModalOpen(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addrForm.address || !addrForm.pincode) return;

    saveUserAddress({
      id: editingAddr ? editingAddr.id : undefined,
      ...addrForm
    });
    setAddrModalOpen(false);
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm('Delete this delivery address from your profile?')) {
      deleteUserAddress(id);
    }
  };

  const handleOpenCancelModal = (order) => {
    setSelectedOrderForCancel(order);
    setCancelReason('Ordered by mistake');
    setCancelComments('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = (e) => {
    e.preventDefault();
    if (!selectedOrderForCancel) return;
    const finalReason = cancelComments.trim() ? `${cancelReason} - ${cancelComments.trim()}` : cancelReason;
    cancelOrder(selectedOrderForCancel.id, finalReason, currentUser?.name || 'Customer');
    setCancelModalOpen(false);
    setSelectedOrderForCancel(null);
    refreshData();
  };

  const handleOpenReturnModal = (order) => {
    setSelectedOrderForReturn(order);
    setReturnReason('Defective / Damaged Piece');
    setReturnComments('');
    setRefundMethod('Original Payment Method');
    setReturnUpiId('');
    setReturnBankDetails('');
    setReturnCondition('Unused with Original Packaging & Tags');
    setReturnModalOpen(true);
  };

  const handleConfirmReturn = (e) => {
    e.preventDefault();
    if (!selectedOrderForReturn) return;
    requestReturn(selectedOrderForReturn.id, {
      reason: returnReason,
      comments: returnComments,
      refundPreference: refundMethod,
      upiId: returnUpiId,
      bankDetails: returnBankDetails,
      condition: returnCondition
    });
    setReturnModalOpen(false);
    setSelectedOrderForReturn(null);
    refreshData();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. PROFILE HEADER HERO                                                    */}
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

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div className="flex items-center gap-4">
              {/* Avatar Initial in Gold/Dark Circle */}
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-neutral-950 text-[#C5A880] border border-[#C5A880]/40 flex items-center justify-center font-serif text-2xl sm:text-3xl font-medium shadow-md">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'K'}
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 text-[10px] font-bold uppercase tracking-wider text-[#8C6734]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734] animate-ping" />
                  <span>Krishna Privé Client</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-neutral-950">
                  {currentUser?.name || 'Valued Client'}
                </h1>
                <p className="text-xs text-neutral-500">
                  {currentUser?.email || 'Logged in member'} &bull; {currentUser?.phone || '+91 Direct Contact'}
                </p>
              </div>
            </div>

            {/* Quick Stats & Logout */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-[#FAFAFB] px-4 py-2 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[10px] font-semibold uppercase">Total Orders</span>
                  <span className="font-serif font-medium text-sm text-neutral-950">{orders.length}</span>
                </div>
                <div className="h-6 w-px bg-neutral-200" />
                <div>
                  <span className="text-neutral-400 block text-[10px] font-semibold uppercase">Wishlist</span>
                  <span className="font-serif font-medium text-sm text-neutral-950">{wishlist.length}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-neutral-300 bg-white text-xs font-semibold uppercase tracking-wider text-neutral-700 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/50 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TAB NAVIGATION & MAIN CONTENT                                          */}
      {/* ========================================================================= */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        
        {/* Tab Switcher */}
        <div className="flex gap-2 overflow-x-auto border-b border-neutral-200 pb-3 no-scrollbar text-xs font-semibold">
          {[
            { id: 'orders', label: `My Orders (${orders.length})`, icon: Package },
            { id: 'addresses', label: `Saved Addresses (${addresses.length})`, icon: MapPin },
            { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: Heart }
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap uppercase tracking-wider transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-neutral-950 text-white shadow-2xs'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:border-[#C5A880] hover:bg-[#FAF8F5]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#C5A880]' : 'text-[#8C6734]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === 'orders' && (
          <div className="mt-8 space-y-6">
            {orders.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-12 text-center max-w-md mx-auto shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-[#F5F2EB] text-[#8C6734] flex items-center justify-center mx-auto mb-3 border border-[#C5A880]/40">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-medium text-neutral-950 mb-1">No Orders Recorded Yet</h3>
                <p className="text-xs text-neutral-500 mb-5">Explore our boutique catalog to place your first luxury order.</p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C6734] transition-colors"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-7 shadow-sm space-y-4 transition hover:border-[#C5A880]/60"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6734]">Order Code:</span>
                        <span className="font-mono font-bold text-neutral-950 text-sm">{order.id}</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">Placed on {order.date} &bull; {order.paymentMethod}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : order.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-[#F5F2EB] text-[#8C6734] border border-[#C5A880]/50'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Purchased Items Preview */}
                  <div className="divide-y divide-neutral-100">
                    {order.items?.map((it, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={it.image}
                            alt=""
                            className="h-10 w-10 rounded-lg object-contain bg-[#FAFAFB] border border-neutral-200 p-0.5 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-neutral-950">{it.name}</p>
                            <span className="text-[10.5px] text-neutral-500">{it.brand} &bull; Qty: {it.quantity} {it.color && `&bull; ${it.color}`}</span>
                          </div>
                        </div>
                        <span className="font-serif font-medium text-neutral-950">
                          ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-neutral-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500">Total Settled:</span>
                      <span className="font-serif text-base font-medium text-neutral-950">₹{order.total?.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/tracking?id=${order.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C6734] transition-colors"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Live Tracking</span>
                      </Link>

                      {order.status !== 'Cancelled' && order.status !== 'Delivered' && !String(order.status).includes('Return') && (
                        <button
                          type="button"
                          onClick={() => handleOpenCancelModal(order)}
                          className="px-3.5 py-2 rounded-md border border-neutral-300 text-neutral-700 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 text-xs font-semibold cursor-pointer transition"
                        >
                          Cancel Order
                        </button>
                      )}

                      {order.status === 'Delivered' && (
                        <button
                          type="button"
                          onClick={() => handleOpenReturnModal(order)}
                          className="px-3.5 py-2 rounded-md border border-neutral-300 text-neutral-700 hover:text-[#8C6734] hover:border-[#C5A880] text-xs font-semibold cursor-pointer transition"
                        >
                          7-Day Return Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-medium text-neutral-950">Saved Delivery Destinations</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Manage coordinates for expedited checkout</p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddAddress}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C6734] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs space-y-3 relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                      <span className="font-semibold text-xs text-neutral-950 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#8C6734]" />
                        {addr.label || 'Home'}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold text-[#8C6734] bg-[#F5F2EB] px-2 py-0.5 rounded border border-[#C5A880]/40">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <div className="pt-2 text-xs text-neutral-600 leading-relaxed space-y-0.5">
                      <p className="font-bold text-neutral-950">{addr.firstName} {addr.lastName}</p>
                      <p>{addr.address}</p>
                      <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-[11px] text-neutral-400 pt-1">Phone: {addr.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 text-xs">
                    <button
                      type="button"
                      onClick={() => handleOpenEditAddress(addr)}
                      className="text-neutral-600 hover:text-neutral-950 font-semibold p-1"
                    >
                      Edit
                    </button>
                    <span className="text-neutral-300">&bull;</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-rose-600 hover:underline font-semibold p-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Wishlist Quick Tab */}
        {activeTab === 'wishlist' && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-medium text-neutral-950">Shortlisted Pieces ({wishlist.length})</h3>
              <Link to="/wishlist" className="text-xs font-semibold text-[#8C6734] hover:underline uppercase tracking-wider">
                Open Full Wishlist &rarr;
              </Link>
            </div>

            {wishlist.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {wishlist.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="p-3 rounded-xl bg-white border border-neutral-200/80 hover:border-[#C5A880] transition space-y-2 block"
                  >
                    <div className="aspect-square bg-[#FAFAFB] rounded-lg p-2 flex items-center justify-center">
                      <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-[#8C6734] block">{product.brand}</span>
                    <p className="text-xs font-bold text-neutral-950 truncate">{product.name}</p>
                    <p className="text-xs font-serif font-medium text-neutral-950">₹{Number(product.price).toLocaleString('en-IN')}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500">Your wishlist is currently empty.</p>
            )}
          </div>
        )}

      </main>

      {/* Add / Edit Address Modal */}
      {addrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-lg font-medium text-neutral-950">
                {editingAddr ? 'Edit Address' : 'Add Delivery Address'}
              </h3>
              <button
                type="button"
                onClick={() => setAddrModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={addrForm.firstName}
                    onChange={(e) => setAddrForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#8C6734]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={addrForm.lastName}
                    onChange={(e) => setAddrForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#8C6734]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={addrForm.address}
                  onChange={(e) => setAddrForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#8C6734]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={addrForm.city}
                    onChange={(e) => setAddrForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#8C6734]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={addrForm.state}
                    onChange={(e) => setAddrForm(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#8C6734]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={addrForm.pincode}
                    onChange={(e) => setAddrForm(prev => ({ ...prev, pincode: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#8C6734]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Mobile Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={addrForm.phone}
                  onChange={(e) => setAddrForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#8C6734]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C6734] transition-colors cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative max-w-md w-full bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-medium text-neutral-950">Cancel Consignment #{selectedOrderForCancel?.id}</h3>
            <form onSubmit={handleConfirmCancel} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Reason for Cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs outline-none"
                >
                  <option value="Ordered by mistake">Ordered by mistake</option>
                  <option value="Found better alternative">Found better alternative</option>
                  <option value="Change of delivery destination">Change of delivery destination</option>
                  <option value="Payment / billing clarification">Payment / billing clarification</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Additional Comments</label>
                <textarea
                  rows={3}
                  value={cancelComments}
                  onChange={(e) => setCancelComments(e.target.value)}
                  placeholder="Optional details..."
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs outline-none resize-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  className="flex-1 py-2.5 border border-neutral-300 rounded-md font-semibold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 text-white rounded-md font-semibold hover:bg-rose-700"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
