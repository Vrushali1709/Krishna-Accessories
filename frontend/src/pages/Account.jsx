// src/pages/Account.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCurrentUser, logout } from '../utils/auth';
import { getOrders, getUserAddresses, saveUserAddress, deleteUserAddress, cancelOrder, requestReturn, getOrderById } from '../utils/orderStore';
import { getWishlist } from '../utils/productStore';
import { UserIcon, TruckIcon, HeartIcon, ShieldCheckIcon, LockClosedIcon, SearchIcon, CheckCircleIcon } from '../components/Icons';
import { Reveal } from '../components/useScrollReveal';

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
      firstName: currentUser?.name?.split(' ')[0] || 'Rahul',
      lastName: currentUser?.name?.split(' ')[1] || 'Patel',
      phone: currentUser?.phone || '9876512345',
      address: '',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380054',
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 border-emerald-300/80 text-emerald-800';
      case 'Shipped':
        return 'bg-sky-50 border-sky-300/80 text-sky-800';
      case 'Out for Delivery':
        return 'bg-blue-50 border-blue-300/80 text-blue-800';
      case 'Processing':
        return 'bg-amber-50 border-amber-300/80 text-amber-800';
      case 'Confirmed':
        return 'bg-[#FAF8F5] border-[#C5A880]/60 text-[#8C6734]';
      case 'Return Requested':
        return 'bg-purple-50 border-purple-300/80 text-purple-800 animate-pulse';
      case 'Return Approved':
        return 'bg-teal-50 border-teal-300/80 text-teal-800';
      case 'Refunded':
        return 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold';
      case 'Cancelled':
        return 'bg-rose-50 border-rose-300/80 text-rose-800';
      case 'Return Rejected':
        return 'bg-red-50 border-red-300/80 text-red-800';
      default:
        return 'bg-stone-50 border-stone-200 text-stone-700';
    }
  };

  // If user is not logged in, redirect to login
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] text-stone-900 flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <Reveal>
            <div className="w-full max-w-md rounded-2xl border border-[#C5A880]/30 bg-white/90 backdrop-blur-md p-8 sm:p-10 text-center shadow-xl space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF8F5] text-[#8C6734] border border-[#C5A880]/40 shadow-inner">
                <UserIcon className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8C6734]">
                  Private Client Lounge
                </span>
                <h2 className="font-serif text-3xl font-normal text-stone-950">
                  Client Sign In Required
                </h2>
                <p className="text-xs text-stone-500 leading-relaxed pt-1">
                  Access your bespoke consignment history, saved delivery address book, and personalized concierge desk.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-[#111827] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-[#FAF9F5] hover:bg-[#8C6734] transition-all shadow-md hover:shadow-lg"
                >
                  <span>Sign In to Your Account</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </main>
        <Footer />
      </div>
    );
  }

  const userOrders = orders.filter(
    o => !o.customer?.email || o.customer?.email?.toLowerCase() === currentUser?.email?.toLowerCase() || orders.length > 0
  );

  const lookupOrder = (id) => {
    if (!id || !id.trim()) {
      setActiveTrackingOrder(null);
      setTrackingNotFound(false);
      return;
    }
    const cleanId = id.trim();
    const allOrders = getOrders();
    const found = getOrderById(cleanId) || allOrders.find(o =>
      o.id?.toLowerCase() === cleanId.toLowerCase() ||
      (o.trackingNumber && o.trackingNumber.toLowerCase() === cleanId.toLowerCase())
    );
    if (found) {
      setActiveTrackingOrder(found);
      setTrackingNotFound(false);
    } else {
      setActiveTrackingOrder(null);
      setTrackingNotFound(true);
    }
  };

  // Sync tab and id with URL search params
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const idParam = searchParams.get('id');
    if (tabParam && ['orders', 'tracking', 'addresses', 'wishlist', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    if (idParam) {
      setTrackingIdInput(idParam);
      lookupOrder(idParam);
    }
  }, [searchParams]);

  // When activeTab is set to tracking and no specific order is loaded, auto-load first order or test reference
  useEffect(() => {
    if (activeTab === 'tracking') {
      const idToLookup = trackingIdInput || searchParams.get('id') || (userOrders.length > 0 ? userOrders[0].id : 'KA-98421');
      if (idToLookup && (!activeTrackingOrder || activeTrackingOrder.id !== idToLookup)) {
        setTrackingIdInput(idToLookup);
        lookupOrder(idToLookup);
      }
    }
  }, [activeTab, orders]);

  const handleTrackSearch = (e) => {
    e.preventDefault();
    if (trackingIdInput && trackingIdInput.trim()) {
      setSearchParams({ tab: 'tracking', id: trackingIdInput.trim() });
      lookupOrder(trackingIdInput.trim());
    }
  };

  const handleSelectOrderToTrack = (orderId) => {
    setTrackingIdInput(orderId);
    setActiveTab('tracking');
    setSearchParams({ tab: 'tracking', id: orderId });
    lookupOrder(orderId);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 overflow-x-clip flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Editorial Profile Header Hero */}
        <section className="relative border-b border-[#C5A880]/20 bg-gradient-to-b from-white via-[#FAF8F5] to-white py-10 sm:py-12 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#C5A880]/5 blur-3xl pointer-events-none" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <Reveal>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-[#111827] text-[#C5A880] font-serif font-bold text-2xl sm:text-3xl border border-[#C5A880]/40 shadow-xl shrink-0">
                    {(currentUser.name || currentUser.email)[0].toUpperCase()}
                    <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#8C6734] text-white text-[10px] font-bold border-2 border-white shadow-xs">
                      ★
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-stone-950">
                        {currentUser.name || 'Client Account'}
                      </h1>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF8F5] border border-[#C5A880]/60 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8C6734] shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734]"></span>
                        {currentUser.role || 'VIP Client'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 flex items-center gap-2 flex-wrap">
                      <span>{currentUser.email}</span>
                      <span className="text-stone-300">•</span>
                      <span>{currentUser.phone || '+91 98765 12345'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {currentUser.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="rounded-xl bg-[#111827] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#8C6734] transition-all shadow-sm"
                    >
                      Admin Console &rarr;
                    </Link>
                  )}
                  {currentUser.role === 'supplier' && (
                    <Link
                      to="/supplier"
                      className="rounded-xl bg-[#8C6734] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#6e5027] transition-all shadow-sm"
                    >
                      Supplier Portal &rarr;
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-700 hover:bg-stone-50 hover:text-stone-950 transition shadow-2xs"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Editorial Navigation Tabs */}
          <div className="flex border-b border-[#C5A880]/20 gap-2 sm:gap-6 mb-8 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'orders', label: 'Consignments', count: userOrders.length },
              { id: 'tracking', label: 'Live Tracking', icon: true },
              { id: 'addresses', label: 'Address Book', count: addresses.length },
              { id: 'wishlist', label: 'Wishlist', count: wishlist.length },
              { id: 'profile', label: 'Patron Profile' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'tracking') {
                    const targetId = activeTrackingOrder?.id || trackingIdInput || (userOrders[0]?.id || 'KA-98421');
                    setSearchParams({ tab: 'tracking', id: targetId });
                  } else {
                    setSearchParams({ tab: tab.id });
                  }
                }}
                className={`group relative pb-3 px-2 text-xs font-bold uppercase tracking-[0.14em] transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-[#8C6734]'
                    : 'text-stone-400 hover:text-stone-900'
                }`}
              >
                {tab.icon && <TruckIcon className="w-3.5 h-3.5 text-current" />}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                    activeTab === tab.id ? 'bg-[#8C6734]/10 text-[#8C6734]' : 'bg-stone-100 text-stone-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8C6734] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* ================= TAB 1: ORDERS & CONSIGNMENTS ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {userOrders.length === 0 ? (
                <Reveal>
                  <div className="rounded-2xl border border-[#C5A880]/30 bg-white p-12 text-center shadow-xs space-y-4 max-w-lg mx-auto">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF8F5] text-[#8C6734] border border-[#C5A880]/40">
                      <TruckIcon className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-2xl text-stone-950 font-normal">No Consignments Placed Yet</h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Your acquisitions and custom bespoke orders will appear here for live tracking and history.
                    </p>
                    <div className="pt-2">
                      <Link
                        to="/shop"
                        className="inline-block rounded-xl bg-[#111827] px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#FAF9F5] hover:bg-[#8C6734] transition-all shadow-md"
                      >
                        Explore Curated Catalog &rarr;
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ) : (
                <div className="space-y-5">
                  {userOrders.map((order, idx) => (
                    <Reveal key={order.id} delay={idx * 60}>
                      <div className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-7 shadow-xs hover:border-[#C5A880]/50 hover:shadow-md transition-all space-y-5">
                        {/* Order Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                          <div>
                            <span className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                              Consignment Reference
                            </span>
                            <div className="flex items-center gap-2.5 mt-0.5">
                              <span className="font-mono text-sm sm:text-base font-bold text-stone-950">
                                {order.id}
                              </span>
                              <span className="text-stone-300">•</span>
                              <span className="text-xs text-stone-500">{order.date}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className={`rounded-full border px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                              {order.status}
                            </span>

                            {/* Customer Action: Cancel Order */}
                            {(order.status === 'Confirmed' || order.status === 'Processing') && (
                              <button
                                onClick={() => handleOpenCancelModal(order)}
                                className="rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 transition cursor-pointer"
                              >
                                Cancel Order
                              </button>
                            )}

                            {/* Customer Action: Return / Refund */}
                            {order.status === 'Delivered' && (
                              <button
                                onClick={() => handleOpenReturnModal(order)}
                                className="rounded-xl border border-[#C5A880] bg-[#FAF8F5] hover:bg-[#F5F2EB] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8C6734] transition flex items-center gap-1 cursor-pointer"
                              >
                                <span>↩</span> Return / Refund
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleSelectOrderToTrack(order.id)}
                              className="rounded-xl bg-[#111827] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#8C6734] transition shadow-xs cursor-pointer flex items-center gap-1.5"
                            >
                              <span>Track</span>
                              <span>&rarr;</span>
                            </button>
                          </div>
                        </div>

                        {/* Status Notice Banners */}
                        {order.status === 'Cancelled' && (
                          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 text-xs text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <p className="font-bold flex items-center gap-1.5">
                                <span>🚫</span> Consignment Cancelled ({order.cancellation?.date || order.date})
                              </p>
                              <p className="text-[11px] text-rose-700 mt-0.5">
                                Reason: {order.cancellation?.reason || 'Cancelled upon customer request.'}
                              </p>
                            </div>
                            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-rose-100 border border-rose-300 text-rose-800 self-start sm:self-auto">
                              Payment: {order.paymentStatus}
                            </span>
                          </div>
                        )}

                        {order.status === 'Return Requested' && (
                          <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-3.5 text-xs text-purple-950 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-bold flex items-center gap-1.5">
                                <span>⏳</span> Return &amp; Refund Request Under Concierge Review
                              </p>
                              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-purple-100 border border-purple-300 text-purple-800">
                                Pending Approval
                              </span>
                            </div>
                            <p className="text-[11px] text-purple-800">
                              <strong>Reason:</strong> {order.returnRequest?.reason || 'Customer Return'} &bull; <strong>Mode:</strong> {order.returnRequest?.refundPreference}
                              {order.returnRequest?.upiId && ` (${order.returnRequest.upiId})`}
                            </p>
                            <p className="text-[10px] text-purple-600">Our concierge inspection desk will arrange reverse-courier pickup within 24-48 hours.</p>
                          </div>
                        )}

                        {order.status === 'Return Approved' && (
                          <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-3.5 text-xs text-teal-950 space-y-1">
                            <p className="font-bold flex items-center gap-1.5">
                              <span>📦</span> Return Approved &amp; Reverse Courier Pickup Scheduled
                            </p>
                            <p className="text-[11px] text-teal-800">
                              Please keep the product in its original box with all warranty cards and packaging. BlueDart courier will pick up within 1 business day.
                            </p>
                          </div>
                        )}

                        {order.status === 'Refunded' && (
                          <div className="rounded-xl border border-emerald-300 bg-emerald-50/80 p-3.5 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                                <span>✅</span> Refund of ₹{(order.refundDetails?.amount || order.total)?.toLocaleString('en-IN')} Settled
                              </p>
                              <p className="text-[11px] text-emerald-700 mt-0.5">
                                Settled on {order.refundDetails?.date || order.date} &bull; Mode: {order.refundDetails?.refundMode || order.paymentMethod} &bull; Txn: <span className="font-mono font-bold">{order.refundDetails?.transactionId || 'REF-CONFIRMED'}</span>
                              </p>
                            </div>
                            <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-emerald-600 text-white shadow-xs self-start sm:self-auto">
                              Refund Settled
                            </span>
                          </div>
                        )}

                        {order.status === 'Return Rejected' && (
                          <div className="rounded-xl border border-red-200 bg-red-50/70 p-3.5 text-xs text-red-950 space-y-1">
                            <p className="font-bold flex items-center gap-1.5 text-red-900">
                              <span>⚠️</span> Return Request Declined
                            </p>
                            <p className="text-[11px] text-red-700">
                              Notes: {order.returnRequest?.adminNotes || 'Does not meet the return inspection conditions under the 7-day guarantee.'}
                            </p>
                          </div>
                        )}

                        {/* Items List */}
                        <div className="divide-y divide-stone-100">
                          {order.items?.map((it, itemIdx) => (
                            <div key={itemIdx} className="py-3 flex items-center justify-between gap-4 text-xs">
                              <div className="flex items-center gap-3.5">
                                <img
                                  src={it.image}
                                  alt={it.name}
                                  className="h-12 w-12 rounded-xl object-contain bg-[#FAF8F5] border border-stone-200/80 p-1 shrink-0"
                                />
                                <div>
                                  <p className="font-semibold text-stone-950">{it.name}</p>
                                  <p className="text-[10px] text-stone-400 mt-0.5">
                                    {it.brand} &bull; Qty: {it.quantity} {it.color && `&bull; Color: ${it.color}`}
                                  </p>
                                </div>
                              </div>
                              <span className="font-bold text-stone-950 font-serif tabular-nums text-sm">
                                ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-stone-100 pt-3.5 text-xs text-stone-500">
                          <div>
                            <span>Destination: <strong className="text-stone-900 font-medium">{order.customer?.city}, {order.customer?.state}</strong></span>
                            <span className="ml-2 text-stone-300">•</span>
                            <span className="ml-2">Courier: {order.courier || 'BlueDart Air'} ({order.trackingNumber || 'Processing'})</span>
                          </div>
                          <div className="text-right">
                            <span className="text-stone-400">Total Settled: </span>
                            <strong className="text-base font-bold text-[#8C6734] font-serif tabular-nums">
                              ₹{order.total?.toLocaleString('en-IN')}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: LIVE TRACKING ================= */}
          {activeTab === 'tracking' && (
            <div className="space-y-6">
              <Reveal>
                <div className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                        Milestone Logistics Sync
                      </span>
                      <h3 className="font-serif text-2xl font-normal text-stone-950 mt-0.5">
                        Track Consignment
                      </h3>
                    </div>
                    <p className="text-xs text-stone-500">
                      Real-time updates directly synced with regional dispatch hubs.
                    </p>
                  </div>

                  {/* Search Form */}
                  <form onSubmit={handleTrackSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
                    <div className="relative flex-1 min-w-0">
                      <input
                        type="text"
                        value={trackingIdInput}
                        onChange={(e) => setTrackingIdInput(e.target.value)}
                        placeholder="Enter Consignment ID (e.g. KA-98421) or Courier AWB..."
                        className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] pl-9 pr-4 py-3 text-xs font-mono uppercase text-stone-900 outline-none focus:border-[#C5A880] focus:bg-white transition"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                        <SearchIcon className="w-4 h-4" />
                      </span>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111827] px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#FAF9F5] hover:bg-[#8C6734] transition-all shadow-sm cursor-pointer shrink-0"
                    >
                      <TruckIcon className="w-4 h-4 text-[#C5A880]" />
                      <span>Track Consignment</span>
                    </button>
                  </form>

                  {/* Order Selector Chips */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-2.5 font-medium">
                      <span>Quick Select Placed Orders:</span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className="text-[11px] font-bold text-[#8C6734] hover:underline uppercase tracking-wider cursor-pointer"
                      >
                        All Consignments &rarr;
                      </button>
                    </div>
                    {userOrders.length === 0 ? (
                      <p className="text-xs text-stone-400 italic">No orders placed yet in this account.</p>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        {userOrders.map((ord) => {
                          const isSelected = activeTrackingOrder?.id === ord.id;
                          return (
                            <button
                              key={ord.id}
                              type="button"
                              onClick={() => handleSelectOrderToTrack(ord.id)}
                              className={`flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs transition cursor-pointer ${
                                isSelected
                                  ? 'border-[#8C6734] bg-[#8C6734] text-white shadow-sm'
                                  : 'border-stone-200 bg-[#FAF8F5] text-stone-700 hover:border-[#C5A880] hover:bg-white'
                              }`}
                            >
                              <span className="font-mono font-bold">{ord.id}</span>
                              <span className={`text-[9.5px] font-semibold px-2 py-0.2 rounded-full ${
                                isSelected ? 'bg-white/20 text-white' : getStatusBadge(ord.status)
                              }`}>
                                {ord.status}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>

              {/* Tracking Result View */}
              {trackingNotFound ? (
                <Reveal>
                  <div className="rounded-2xl border border-rose-200 bg-white p-10 text-center shadow-xs space-y-4 max-w-lg mx-auto">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      <span className="text-base font-bold">✕</span>
                    </div>
                    <h3 className="font-serif text-xl font-normal text-stone-950">
                      Consignment Not Found
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      No active consignment matching <strong className="font-mono text-stone-900">{trackingIdInput}</strong> was located.
                    </p>
                    {userOrders.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleSelectOrderToTrack(userOrders[0].id)}
                        className="inline-block rounded-xl bg-[#111827] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#8C6734] transition cursor-pointer"
                      >
                        Track Latest Order ({userOrders[0].id}) &rarr;
                      </button>
                    )}
                  </div>
                </Reveal>
              ) : activeTrackingOrder ? (
                <Reveal>
                  <div className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
                    {/* Order Details Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                      <div>
                        <span className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                          Live Consignment Record
                        </span>
                        <h2 className="font-mono text-2xl font-bold text-stone-950 mt-0.5">
                          {activeTrackingOrder.id}
                        </h2>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Placed on {activeTrackingOrder.date} &bull; Payment: {activeTrackingOrder.paymentMethod}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className={`rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${getStatusBadge(activeTrackingOrder.status)}`}>
                          {activeTrackingOrder.status}
                        </span>

                        {/* Cancel Order Action */}
                        {(activeTrackingOrder.status === 'Confirmed' || activeTrackingOrder.status === 'Processing') && (
                          <button
                            type="button"
                            onClick={() => handleOpenCancelModal(activeTrackingOrder)}
                            className="rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 transition cursor-pointer"
                          >
                            Cancel Consignment
                          </button>
                        )}

                        {/* Return Order Action */}
                        {activeTrackingOrder.status === 'Delivered' && (
                          <button
                            type="button"
                            onClick={() => handleOpenReturnModal(activeTrackingOrder)}
                            className="rounded-xl border border-[#C5A880] bg-[#FAF8F5] hover:bg-[#F5F2EB] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8C6734] transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>↩</span> Return / Refund
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Logistics Spec Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-stone-100 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                          Logistics Partner
                        </span>
                        <span className="font-bold text-stone-900 mt-1 block">
                          {activeTrackingOrder.courier || 'BlueDart Express Air'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                          Airway Bill (AWB)
                        </span>
                        <span className="font-mono font-bold text-[#8C6734] mt-1 block">
                          {activeTrackingOrder.trackingNumber || 'Pending Dispatch'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                          Recipient Patron
                        </span>
                        <span className="font-bold text-stone-900 mt-1 block truncate">
                          {activeTrackingOrder.customer?.firstName} {activeTrackingOrder.customer?.lastName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                          Destination Hub
                        </span>
                        <span className="font-bold text-stone-900 mt-1 block truncate">
                          {activeTrackingOrder.customer?.city}, {activeTrackingOrder.customer?.state}
                        </span>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="pt-2 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-stone-950 flex items-center gap-2">
                        <TruckIcon className="w-4 h-4 text-[#8C6734]" />
                        <span>Shipment Transit Milestones</span>
                      </h4>

                      <div className="relative pl-6 space-y-6 border-l-2 border-[#C5A880]/30 ml-2 py-1">
                        {activeTrackingOrder.timeline && activeTrackingOrder.timeline.map((step, stepIdx) => {
                          const isDone = step.done ?? step.completed ?? false;
                          const stageLabel = step.status ?? step.stage ?? "Milestone";
                          const timeStamp = step.date ?? step.time ?? "--";
                          const description = step.description || (isDone ? "Milestone verified" : "Pending transit update");
                          const isCancelledNode = stageLabel === "Cancelled";
                          const isRefundNode = stageLabel === "Refunded";

                          return (
                            <div key={stepIdx} className="relative">
                              <span
                                className={`absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-white ${
                                  isCancelledNode
                                    ? 'border-rose-600 bg-rose-600 text-white'
                                    : isRefundNode
                                    ? 'border-emerald-600 bg-emerald-600 text-white'
                                    : isDone
                                    ? 'border-[#8C6734] bg-[#8C6734] text-white shadow-xs'
                                    : 'border-stone-300 bg-white'
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
                                  <h5 className={`text-xs font-bold truncate ${
                                    isCancelledNode ? 'text-rose-600' : isDone ? 'text-stone-950' : 'text-stone-400'
                                  }`}>
                                    {stageLabel}
                                  </h5>
                                  {isDone && (
                                    <span className="text-[10px] text-stone-400 font-mono shrink-0">{timeStamp}</span>
                                  )}
                                </div>
                                <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                                  {description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Consignment Items in Shipment */}
                    <div className="border-t border-stone-100 pt-5 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-950">
                        Consignment Items ({activeTrackingOrder.items?.length || 0})
                      </h4>

                      <div className="divide-y divide-stone-100">
                        {activeTrackingOrder.items?.map((it, itemIdx) => (
                          <div key={itemIdx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3">
                              <img src={it.image} alt={it.name} className="h-11 w-11 rounded-xl object-contain bg-[#FAF8F5] border border-stone-200 p-1" />
                              <div>
                                <p className="font-semibold text-stone-950">{it.name}</p>
                                <span className="text-[10px] text-stone-400">
                                  {it.brand} &bull; Qty: {it.quantity} {it.color && `&bull; ${it.color}`}
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-stone-950 font-serif tabular-nums">
                              ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-stone-100 text-xs font-bold text-stone-900">
                        <span>Total Settled Amount:</span>
                        <span className="text-sm font-serif text-[#8C6734]">₹{activeTrackingOrder.total?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ) : null}
            </div>
          )}

          {/* ================= TAB 3: ADDRESS BOOK ================= */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <Reveal>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl font-normal text-stone-950">Saved Delivery Destinations</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Pre-configured destinations for expedited boutique dispatch.</p>
                  </div>
                  <button
                    onClick={handleOpenAddAddress}
                    className="rounded-xl bg-[#111827] hover:bg-[#8C6734] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-sm transition-all self-start sm:self-auto cursor-pointer"
                  >
                    + Add New Destination
                  </button>
                </div>
              </Reveal>

              <div className="grid gap-5 sm:grid-cols-2">
                {addresses.map((addr, addrIdx) => (
                  <Reveal key={addr.id} delay={addrIdx * 60}>
                    <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs hover:border-[#C5A880]/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="font-bold text-xs uppercase tracking-wider text-[#8C6734] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#C5A880]/40">
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                              Primary Default
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-sm text-stone-950">{addr.firstName} {addr.lastName}</p>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">{addr.address}</p>
                        <p className="text-xs text-stone-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-[11px] text-stone-400 font-mono mt-2">Phone: {addr.phone}</p>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100 text-xs">
                        <button
                          onClick={() => handleOpenEditAddress(addr)}
                          className="text-stone-700 hover:text-[#8C6734] font-bold uppercase tracking-wider text-[11px] transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <span className="text-stone-300">•</span>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-rose-600 hover:text-rose-800 font-bold uppercase tracking-wider text-[11px] transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 4: WISHLIST ================= */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <Reveal>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-normal text-stone-950">Curated Favorites ({wishlist.length})</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Personal pieces saved for acquisition.</p>
                  </div>
                  <Link to="/wishlist" className="text-xs font-bold text-[#8C6734] hover:underline uppercase tracking-wider">
                    Full Wishlist Gallery &rarr;
                  </Link>
                </div>
              </Reveal>

              {wishlist.length === 0 ? (
                <Reveal>
                  <div className="rounded-2xl border border-[#C5A880]/30 bg-white p-10 text-center shadow-xs space-y-3 max-w-md mx-auto">
                    <HeartIcon className="w-8 h-8 text-[#8C6734] mx-auto" />
                    <p className="text-xs text-stone-500">No items saved to wishlist yet.</p>
                    <Link
                      to="/shop"
                      className="inline-block rounded-xl bg-[#111827] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#8C6734] transition"
                    >
                      Browse Catalog &rarr;
                    </Link>
                  </div>
                </Reveal>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {wishlist.slice(0, 4).map((p, pIdx) => (
                    <Reveal key={p.id} delay={pIdx * 50}>
                      <Link
                        to={`/product/${p.id}`}
                        className="group rounded-2xl border border-stone-200/80 bg-white p-4 shadow-xs hover:border-[#C5A880]/50 hover:shadow-md transition-all block"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="aspect-square w-full object-contain mix-blend-multiply bg-[#FAF8F5] p-3 rounded-xl mb-3 group-hover:scale-105 transition-transform duration-300"
                        />
                        <p className="text-[10px] font-bold text-[#8C6734] uppercase tracking-wider">{p.brand}</p>
                        <p className="text-xs font-semibold text-stone-950 truncate mt-0.5">{p.name}</p>
                        <p className="text-xs font-bold text-stone-950 font-serif mt-1">₹{Number(p.price).toLocaleString('en-IN')}</p>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 5: PROFILE SETTINGS ================= */}
          {activeTab === 'profile' && (
            <Reveal>
              <div className="max-w-xl rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                    Verified Patron Credentials
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-stone-950 mt-0.5">
                    Account Profile
                  </h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      readOnly
                      value={currentUser.name || 'Rahul Patel'}
                      className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] p-3 font-semibold text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Registered Email Address</label>
                    <input
                      type="email"
                      readOnly
                      value={currentUser.email}
                      className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] p-3 font-semibold text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Account Role</label>
                    <input
                      type="text"
                      readOnly
                      value={currentUser.role?.toUpperCase() || 'VIP CUSTOMER'}
                      className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] p-3 font-mono font-bold text-[#8C6734]"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          )}

        </section>
      </main>

      {/* Address Modal */}
      {addrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-[#C5A880]/40 bg-white p-6 sm:p-8 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6734]">Address Registry</span>
                <h3 className="text-base font-serif font-bold text-stone-950">
                  {editingAddr ? 'Edit Delivery Destination' : 'Add New Delivery Destination'}
                </h3>
              </div>
              <button onClick={() => setAddrModalOpen(false)} className="text-stone-400 hover:text-stone-950 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3.5">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Destination Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flagship Office / Primary Villa"
                  value={addrForm.label}
                  onChange={e => setAddrForm({ ...addrForm, label: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] p-2.5 outline-none focus:border-[#C5A880] focus:bg-white transition"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={addrForm.firstName}
                    onChange={e => setAddrForm({ ...addrForm, firstName: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] p-2.5 outline-none focus:border-[#C5A880] focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={addrForm.lastName}
                    onChange={e => setAddrForm({ ...addrForm, lastName: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] p-2.5 outline-none focus:border-[#C5A880] focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Mobile Phone (For Courier OTP) *</label>
                <input
                  type="tel"
                  required
                  value={addrForm.phone}
                  onChange={e => setAddrForm({ ...addrForm, phone: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] p-2.5 outline-none focus:border-[#C5A880] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Street Address / Landmark *</label>
                <input
                  type="text"
                  required
                  value={addrForm.address}
                  onChange={e => setAddrForm({ ...addrForm, address: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] p-2.5 outline-none focus:border-[#C5A880] focus:bg-white transition"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={addrForm.city}
                    onChange={e => setAddrForm({ ...addrForm, city: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] p-2.5 outline-none focus:border-[#C5A880] focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={addrForm.state}
                    onChange={e => setAddrForm({ ...addrForm, state: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] p-2.5 outline-none focus:border-[#C5A880] focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={addrForm.pincode}
                    onChange={e => setAddrForm({ ...addrForm, pincode: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] p-2.5 font-mono outline-none focus:border-[#C5A880] focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddrModalOpen(false)}
                  className="rounded-xl border border-stone-300 bg-white px-4 py-2 font-bold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#111827] px-6 py-2 font-bold uppercase tracking-wider text-white hover:bg-[#8C6734] transition shadow-xs"
                >
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelModalOpen && selectedOrderForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 sm:p-7 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-rose-700">
                <span className="text-lg">⚠️</span>
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Cancel Consignment {selectedOrderForCancel.id}
                </h3>
              </div>
              <button
                onClick={() => setCancelModalOpen(false)}
                className="text-stone-400 hover:text-stone-950 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl bg-rose-50/70 border border-rose-200 p-3.5 space-y-1 text-rose-900">
              <p className="font-semibold">Are you sure you want to cancel this order?</p>
              <p className="text-[11px] text-rose-700">
                Total amount: <strong>₹{selectedOrderForCancel.total?.toLocaleString('en-IN')}</strong> ({selectedOrderForCancel.paymentMethod})
                {selectedOrderForCancel.paymentStatus === 'Paid' && ' • Full refund will be automatically triggered.'}
              </p>
            </div>

            <form onSubmit={handleConfirmCancel} className="space-y-3.5">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Cancellation Reason *</label>
                <select
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] p-2.5 outline-none focus:border-rose-300 focus:bg-white text-xs text-stone-900"
                >
                  <option value="Ordered by mistake">Ordered by mistake / Duplicate order</option>
                  <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                  <option value="Delivery time is too long">Delivery time is too long</option>
                  <option value="Need to change delivery address or phone">Need to change delivery address or phone</option>
                  <option value="Changed mind / No longer required">Changed mind / No longer required</option>
                  <option value="Other reasons">Other reasons</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Additional Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={cancelComments}
                  onChange={e => setCancelComments(e.target.value)}
                  placeholder="Provide any feedback for our concierge..."
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] p-2.5 outline-none focus:border-stone-400 focus:bg-white text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  className="rounded-xl border border-stone-300 bg-stone-100 px-4 py-2 font-bold text-stone-700"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-700 px-5 py-2 font-bold uppercase tracking-wider text-white hover:bg-rose-800 shadow-xs"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return / Refund Request Modal */}
      {returnModalOpen && selectedOrderForReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-[#C5A880]/50 bg-white p-6 sm:p-8 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5 text-stone-900">
                <span className="text-lg text-[#8C6734]">↩</span>
                <div>
                  <h3 className="text-sm font-serif font-bold uppercase tracking-wider">
                    7-Day Return &amp; Refund Request
                  </h3>
                  <span className="text-[10px] text-stone-400 font-mono">Consignment {selectedOrderForReturn.id}</span>
                </div>
              </div>
              <button
                onClick={() => setReturnModalOpen(false)}
                className="text-stone-400 hover:text-stone-950 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl bg-[#FAF8F5] border border-[#C5A880]/30 p-3.5 space-y-1">
              <div className="flex justify-between font-bold text-stone-900">
                <span>Items: {selectedOrderForReturn.items?.length || 1} Item(s)</span>
                <span className="text-[#8C6734] font-serif">Eligible Refund: ₹{selectedOrderForReturn.total?.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Protected by Krishna Accessories 7-Day Guarantee. BlueDart reverse logistics will collect from your address.
              </p>
            </div>

            <form onSubmit={handleConfirmReturn} className="space-y-3.5">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Reason for Return *</label>
                <select
                  value={returnReason}
                  onChange={e => setReturnReason(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] p-2.5 outline-none focus:border-[#C5A880] focus:bg-white text-xs"
                >
                  <option value="Defective / Damaged Piece">Defective / Damaged / Scratched Item</option>
                  <option value="Incorrect Product Received">Incorrect Model or Color Received</option>
                  <option value="Size / Fit / Dimension Issue">Size / Fit / Dimension Issue</option>
                  <option value="Quality Not as Expected">Quality or Material not matching expectations</option>
                  <option value="Missing Accessories or Manuals">Missing Accessories or Box Manuals</option>
                  <option value="Changed Mind">Changed Mind / Not Required</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Item Physical Condition *</label>
                <select
                  value={returnCondition}
                  onChange={e => setReturnCondition(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] p-2.5 outline-none focus:border-[#C5A880] focus:bg-white text-xs"
                >
                  <option value="Unused with Original Packaging & Tags">Brand New, Unused with All Original Packaging & Warranty</option>
                  <option value="Opened Box with Tags Intact">Opened Box, Tested once with all accessories present</option>
                  <option value="Damaged in Transit / Seal Broken">Received Damaged / Seal was broken on arrival</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Refund Settlement Mode *</label>
                <select
                  value={refundMethod}
                  onChange={e => setRefundMethod(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] p-2.5 outline-none focus:border-[#C5A880] focus:bg-white text-xs"
                >
                  <option value="Original Payment Method">Refund to Original Payment Method (Cards / NetBanking)</option>
                  <option value="Direct UPI Instant Transfer">Direct UPI Transfer (GPay / PhonePe / Paytm)</option>
                  <option value="Bank Account NEFT Transfer">Bank Account NEFT / RTGS Transfer</option>
                  <option value="Store Credit Voucher (+5% Bonus)">Krishna Luxury Store Credit (+5% Bonus Credit)</option>
                </select>
              </div>

              {refundMethod === 'Direct UPI Instant Transfer' && (
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Your UPI ID (VPA) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. yourname@oksbi or 9876543210@paytm"
                    value={returnUpiId}
                    onChange={e => setReturnUpiId(e.target.value)}
                    className="w-full rounded-xl border border-[#C5A880] bg-[#FAF8F5] p-2.5 font-mono outline-none focus:bg-white text-xs"
                  />
                </div>
              )}

              {refundMethod === 'Bank Account NEFT Transfer' && (
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Bank Name, A/C No. &amp; IFSC Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HDFC Bank, A/C: 501002348911, IFSC: HDFC0001234"
                    value={returnBankDetails}
                    onChange={e => setReturnBankDetails(e.target.value)}
                    className="w-full rounded-xl border border-[#C5A880] bg-[#FAF8F5] p-2.5 outline-none focus:bg-white text-xs"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-stone-700 block mb-1">Detailed Explanation / Issue Notes</label>
                <textarea
                  rows={2}
                  value={returnComments}
                  onChange={e => setReturnComments(e.target.value)}
                  placeholder="Explain the reason for return to accelerate concierge approval..."
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] p-2.5 outline-none focus:border-stone-400 focus:bg-white text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setReturnModalOpen(false)}
                  className="rounded-xl border border-stone-300 bg-stone-100 px-4 py-2 font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#111827] px-6 py-2 font-bold uppercase tracking-wider text-white hover:bg-[#8C6734] shadow-xs transition"
                >
                  Submit Return Request
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
