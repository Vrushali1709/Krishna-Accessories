// src/pages/Account.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCurrentUser, logout } from '../utils/auth';
import { getOrders, getUserAddresses, saveUserAddress, deleteUserAddress, cancelOrder, requestReturn, getOrderById } from '../utils/orderStore';
import { getWishlist } from '../utils/productStore';
import { UserIcon, TruckIcon, HeartIcon, ShieldCheckIcon, LockClosedIcon, SearchIcon, CheckCircleIcon } from '../components/Icons';
import { Mail, Key, RotateCcw, Eye, EyeOff, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { generateAndSendOtp, verifyOtp, resendOtp, updateAccountPassword, getEmailLogs } from '../utils/emailService';

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

  // Security & Password Change with OTP state
  const [emailLogs, setEmailLogs] = useState(() => getEmailLogs());
  const [securityOtpSent, setSecurityOtpSent] = useState(false);
  const [securityOtpDigits, setSecurityOtpDigits] = useState(['', '', '', '', '', '']);
  const [securityCooldown, setSecurityCooldown] = useState(0);
  const [securityNewPassword, setSecurityNewPassword] = useState('');
  const [securityConfirmPassword, setSecurityConfirmPassword] = useState('');
  const [securityShowPassword, setSecurityShowPassword] = useState(false);
  const [securityStatus, setSecurityStatus] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (securityCooldown > 0) {
      timer = setInterval(() => setSecurityCooldown(c => Math.max(0, c - 1)), 1000);
    }
    return () => clearInterval(timer);
  }, [securityCooldown]);

  const refreshData = () => {
    setCurrentUser(getCurrentUser());
    setOrders(getOrders());
    setAddresses(getUserAddresses());
    setWishlist(getWishlist());
    setEmailLogs(getEmailLogs());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('ordersUpdated', refreshData);
    window.addEventListener('addressesUpdated', refreshData);
    window.addEventListener('wishlistUpdated', refreshData);
    window.addEventListener('authUpdated', refreshData);
    window.addEventListener('emailLogsUpdated', refreshData);
    return () => {
      window.removeEventListener('ordersUpdated', refreshData);
      window.removeEventListener('addressesUpdated', refreshData);
      window.removeEventListener('wishlistUpdated', refreshData);
      window.removeEventListener('authUpdated', refreshData);
      window.removeEventListener('emailLogsUpdated', refreshData);
    };
  }, []);

  const handleSendSecurityOtp = (e) => {
    e.preventDefault();
    if (!currentUser?.email) return;
    setSecurityError('');
    setSecurityStatus('');
    setSecurityLoading(true);

    setTimeout(() => {
      const res = generateAndSendOtp(currentUser.email, 'security_change', {
        name: currentUser.name
      });
      setSecurityLoading(false);
      if (res.success) {
        setSecurityOtpSent(true);
        setSecurityCooldown(60);
        setSecurityStatus(`6-digit verification code sent to ${currentUser.email}`);
      } else {
        setSecurityError(res.error || 'Failed to dispatch security code.');
      }
    }, 350);
  };

  const handleUpdateSecurityPassword = (e) => {
    e.preventDefault();
    setSecurityError('');
    setSecurityStatus('');

    const code = securityOtpDigits.join('');
    if (code.length !== 6) {
      setSecurityError('Please enter the 6-digit OTP code.');
      return;
    }

    if (securityNewPassword.length < 6) {
      setSecurityError('Password must be at least 6 characters.');
      return;
    }

    if (securityNewPassword !== securityConfirmPassword) {
      setSecurityError('Passwords do not match.');
      return;
    }

    setSecurityLoading(true);

    setTimeout(() => {
      const verifyRes = verifyOtp(currentUser.email, code, 'security_change');
      if (!verifyRes.success) {
        setSecurityLoading(false);
        setSecurityError(verifyRes.error || 'Invalid OTP code.');
        return;
      }

      updateAccountPassword(currentUser.email, securityNewPassword);
      setSecurityLoading(false);
      setSecurityStatus('✓ Password successfully changed! Security alert sent to your email.');
      setSecurityOtpSent(false);
      setSecurityOtpDigits(['', '', '', '', '', '']);
      setSecurityNewPassword('');
      setSecurityConfirmPassword('');
    }, 400);
  };

  const handleOpenEmailModal = (emailId) => {
    window.dispatchEvent(new CustomEvent('openEmailViewer', { detail: { emailId } }));
  };

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
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'Shipped':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'Out for Delivery':
        return 'bg-sky-50 border-sky-200 text-sky-800';
      case 'Processing':
        return 'bg-indigo-50 border-indigo-200 text-indigo-800';
      case 'Confirmed':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'Return Requested':
        return 'bg-purple-50 border-purple-200 text-purple-800 animate-pulse';
      case 'Return Approved':
        return 'bg-teal-50 border-teal-200 text-teal-800';
      case 'Refunded':
        return 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold';
      case 'Cancelled':
        return 'bg-rose-50 border-rose-200 text-rose-800';
      case 'Return Rejected':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-stone-50 border-stone-200 text-stone-800';
    }
  };

  // If user is not logged in, redirect to login
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] text-stone-900 flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md rounded-xs border border-stone-200 bg-white p-8 text-center shadow-xs space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xs bg-[#FAF9F5] text-stone-800 border border-stone-200">
              <UserIcon className="w-5 h-5" />
            </div>
            <h2 className="font-editorial-serif text-2xl font-normal text-stone-950">Client Sign In Required</h2>
            <p className="text-xs text-stone-500">
              Access your consignment history, saved delivery address book, and personalized concierge desk.
            </p>
            <Link
              to="/login"
              className="inline-block rounded-xs bg-[#121316] px-8 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#FAF9F5] hover:bg-[#25262B]"
            >
              Sign In to Your Account &rarr;
            </Link>
          </div>
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
    <div className="min-h-screen bg-[#FAF9F5] text-[#1A1A1A] overflow-x-clip">
      <Navbar />

      {/* Header Profile Hero */}
      <section className="border-b border-stone-200/80 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-13 w-13 items-center justify-center rounded-xs bg-[#121316] text-[#CBB080] font-serif font-bold text-2xl border border-[#CBB080]/30 shadow-xs">
                {(currentUser.name || currentUser.email)[0].toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-editorial-serif text-2xl sm:text-3xl font-normal text-stone-950">
                    {currentUser.name || 'Client Account'}
                  </h1>
                  <span className="rounded-xs bg-stone-100 border border-stone-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-stone-800">
                    {currentUser.role || 'Customer'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{currentUser.email} &bull; {currentUser.phone || '+91 98765 12345'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {currentUser.role === 'admin' && (
                <Link
                  to="/admin"
                  className="rounded-xs bg-[#121316] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition"
                >
                  Admin Console &rarr;
                </Link>
              )}
              {currentUser.role === 'supplier' && (
                <Link
                  to="/supplier"
                  className="rounded-xs bg-[#9C7C44] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#7A5E30] transition"
                >
                  Vendor Portal &rarr;
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xs border border-stone-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-700 hover:bg-stone-100 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Account Tabs */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Tab Strip */}
        <div className="flex border-b border-stone-200 gap-6 mb-8 overflow-x-auto">
          {[
            { id: 'orders', label: `Consignments (${userOrders.length})` },
            { id: 'tracking', label: `Track Order` },
            { id: 'addresses', label: `Address Book (${addresses.length})` },
            { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})` },
            { id: 'security', label: `Security & Mails` },
            { id: 'profile', label: `Profile Preferences` }
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
              className={`pb-3 text-xs font-bold uppercase tracking-[0.16em] transition border-b-2 whitespace-nowrap cursor-pointer ${activeTab === tab.id
                ? 'border-[#121316] text-[#121316]'
                : 'border-transparent text-stone-400 hover:text-stone-900'
                }`}
            >
              {tab.id === 'tracking' ? (
                <span className="flex items-center gap-1.5">
                  <TruckIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </span>
              ) : (
                tab.label
              )}
            </button>
          ))}
        </div>

        {/* ================= TAB 1: ORDERS & CONSIGNMENTS ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            {userOrders.length === 0 ? (
              <div className="rounded-xs border border-stone-200 bg-white p-8 text-center shadow-2xs space-y-3">
                <h3 className="font-editorial-serif text-xl text-stone-950 font-normal">No Consignments Placed Yet</h3>
                <p className="text-xs text-stone-500">Explore our curated collections and place your first consignment.</p>
                <Link to="/shop" className="mt-2 inline-block rounded-xs bg-[#121316] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FAF9F5] hover:bg-[#25262B]">
                  Explore Catalog
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map(order => (
                  <div key={order.id} className="rounded-xs border border-stone-200 bg-white p-6 shadow-xs space-y-4">

                    {/* Top Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3.5">
                      <div>
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400">Order Reference</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-stone-950">{order.id}</span>
                          <span className="text-xs text-stone-500">&bull; {order.date}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className={`rounded-xs border px-2.5 py-0.5 text-[10.5px] font-bold ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>

                        {/* Customer Action: Cancel Order for Confirmed or Processing */}
                        {(order.status === 'Confirmed' || order.status === 'Processing') && (
                          <button
                            onClick={() => handleOpenCancelModal(order)}
                            className="rounded-xs border border-rose-200 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 transition"
                          >
                            Cancel Order
                          </button>
                        )}

                        {/* Customer Action: Return / Refund Request for Delivered orders */}
                        {order.status === 'Delivered' && (
                          <button
                            onClick={() => handleOpenReturnModal(order)}
                            className="rounded-xs border border-amber-300 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 transition flex items-center gap-1"
                          >
                            <span>↩</span> Return / Refund
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleSelectOrderToTrack(order.id)}
                          className="rounded-xs bg-[#121316] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FAF9F5] hover:bg-[#25262B] shadow-2xs transition cursor-pointer"
                        >
                          Track Status &rarr;
                        </button>
                      </div>
                    </div>

                    {/* Status Feedback Notice Banners */}
                    {order.status === 'Cancelled' && (
                      <div className="rounded-xs border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-bold flex items-center gap-1.5">
                            <span>🚫</span> Consignment Cancelled ({order.cancellation?.date || order.date})
                          </p>
                          <p className="text-[11px] text-rose-700 mt-0.5">
                            Reason: {order.cancellation?.reason || 'Cancelled upon customer request.'}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-100 border border-rose-300 text-rose-800 self-start sm:self-auto">
                          Payment: {order.paymentStatus}
                        </span>
                      </div>
                    )}

                    {order.status === 'Return Requested' && (
                      <div className="rounded-xs border border-purple-200 bg-purple-50/70 p-3 text-xs text-purple-950 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold flex items-center gap-1.5">
                            <span>⏳</span> Return & Refund Request Under Verification
                          </p>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-100 border border-purple-300 text-purple-800">
                            Pending Concierge Approval
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
                      <div className="rounded-xs border border-teal-200 bg-teal-50/70 p-3 text-xs text-teal-950 space-y-1">
                        <p className="font-bold flex items-center gap-1.5">
                          <span>📦</span> Return Authorized & Reverse Pickup Scheduled
                        </p>
                        <p className="text-[11px] text-teal-800">
                          Please keep the product in its original box with all warranty cards and packaging. BlueDart courier will pick up within 1 business day.
                        </p>
                      </div>
                    )}

                    {order.status === 'Refunded' && (
                      <div className="rounded-xs border border-emerald-300 bg-emerald-50/80 p-3 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                            <span>✅</span> Refund of ₹{(order.refundDetails?.amount || order.total)?.toLocaleString('en-IN')} Completed
                          </p>
                          <p className="text-[11px] text-emerald-700 mt-0.5">
                            Settled on {order.refundDetails?.date || order.date} &bull; Mode: {order.refundDetails?.refundMode || order.paymentMethod} &bull; Txn: <span className="font-mono font-bold">{order.refundDetails?.transactionId || 'REF-CONFIRMED'}</span>
                          </p>
                        </div>
                        <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-emerald-600 text-white shadow-2xs self-start sm:self-auto">
                          Refund Settled
                        </span>
                      </div>
                    )}

                    {order.status === 'Return Rejected' && (
                      <div className="rounded-xs border border-red-200 bg-red-50/70 p-3 text-xs text-red-950 space-y-1">
                        <p className="font-bold flex items-center gap-1.5 text-red-900">
                          <span>⚠️</span> Return Request Declined
                        </p>
                        <p className="text-[11px] text-red-700">
                          Notes: {order.returnRequest?.adminNotes || 'Does not meet the return inspection conditions under the 7-day guarantee.'}
                        </p>
                      </div>
                    )}

                    {/* Items summary */}
                    <div className="divide-y divide-stone-100">
                      {order.items?.map((it, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <img src={it.image} alt="" className="h-11 w-11 rounded-xs object-contain bg-[#FAF9F5] border border-stone-200 p-1" />
                            <div>
                              <p className="font-bold text-stone-950">{it.name}</p>
                              <span className="text-[10px] text-stone-400">{it.brand} &bull; Qty: {it.quantity} {it.color && `&bull; ${it.color}`}</span>
                            </div>
                          </div>
                          <span className="font-bold text-stone-950">
                            ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-stone-100 pt-3 text-xs text-stone-600">
                      <div>
                        <span>Destination: <strong className="text-stone-900">{order.customer?.city}, {order.customer?.state}</strong></span>
                        <span className="ml-2 text-stone-400">&bull; Courier: {order.courier || 'BlueDart Air'} ({order.trackingNumber || 'Processing'})</span>
                      </div>
                      <div className="text-right">
                        <span className="text-stone-500">Settled Total: </span>
                        <strong className="text-sm font-bold text-stone-950">₹{order.total?.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: LIVE TRACK ORDER & CONSIGNMENT ================= */}
        {activeTab === 'tracking' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Search & Lookup Banner */}
            <div className="rounded-xs border border-stone-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    Live Logistics & Milestone Tracking
                  </span>
                  <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-stone-950 mt-0.5">
                    Track Consignment
                  </h3>
                </div>
                <p className="text-xs text-stone-500">
                  Real-time status updates synced directly with courier hubs and boutique dispatch.
                </p>
              </div>

              {/* Order ID Search Form */}
              <form onSubmit={handleTrackSearch} className="flex flex-col sm:flex-row gap-2 max-w-2xl">
                <div className="relative flex-1 min-w-0">
                  <input
                    type="text"
                    value={trackingIdInput}
                    onChange={(e) => setTrackingIdInput(e.target.value)}
                    placeholder="Enter Consignment ID (e.g. KA-98421) or Courier AWB..."
                    className="w-full rounded-xs border border-stone-200 bg-[#FAF9F5] pl-8 pr-4 py-2.5 text-xs font-mono uppercase text-stone-900 outline-none focus:border-stone-400 focus:bg-white"
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                    <SearchIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xs bg-[#121316] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FAF9F5] hover:bg-[#25262B] transition shadow-xs cursor-pointer shrink-0"
                >
                  <TruckIcon className="w-4 h-4 shrink-0 text-[#CBB080]" />
                  <span>Track Consignment</span>
                </button>
              </form>

              {/* Quick-Select Your Orders Chips */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2 font-medium">
                  <span>Select from your placed consignments:</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="text-[11px] font-bold text-stone-700 hover:text-black uppercase tracking-wider cursor-pointer"
                  >
                    View All Consignments &rarr;
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
                          className={`flex items-center gap-2 rounded-xs border px-3 py-1.5 text-xs transition cursor-pointer ${
                            isSelected
                              ? 'border-[#121316] bg-[#121316] text-white shadow-xs'
                              : 'border-stone-200 bg-[#FAF9F5] text-stone-700 hover:border-stone-400 hover:bg-white'
                          }`}
                        >
                          <span className="font-mono font-bold">{ord.id}</span>
                          <span className={`text-[9.5px] font-semibold px-1.5 py-0.2 rounded-2xs ${
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

            {/* Tracking Result View */}
            {trackingNotFound ? (
              <div className="rounded-xs border border-rose-200 bg-white p-8 text-center shadow-xs space-y-3">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  <span className="text-base font-bold">✕</span>
                </div>
                <h3 className="font-editorial-serif text-lg font-normal text-stone-950">
                  Consignment Reference Not Found
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  No active shipment was found matching <strong className="font-mono text-stone-900">{trackingIdInput}</strong>. Please verify the consignment code or select one of your placed orders above.
                </p>
                {userOrders.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleSelectOrderToTrack(userOrders[0].id)}
                    className="inline-block rounded-xs bg-[#121316] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#25262B] cursor-pointer"
                  >
                    Track Latest Order ({userOrders[0].id}) &rarr;
                  </button>
                )}
              </div>
            ) : activeTrackingOrder ? (
              <div className="space-y-6">

                {/* Overview Card */}
                <div className="rounded-xs border border-stone-200 bg-white p-6 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                    <div>
                      <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400">
                        Consignment Reference ID
                      </span>
                      <h2 className="font-mono text-xl sm:text-2xl font-bold text-stone-950 mt-0.5">
                        {activeTrackingOrder.id}
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Placed on {activeTrackingOrder.date} &bull; Payment: {activeTrackingOrder.paymentMethod}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`rounded-xs border px-3 py-1 text-xs font-bold ${getStatusBadge(activeTrackingOrder.status)}`}>
                        Status: {activeTrackingOrder.status}
                      </span>

                      {/* Cancel Order Action */}
                      {(activeTrackingOrder.status === 'Confirmed' || activeTrackingOrder.status === 'Processing') && (
                        <button
                          type="button"
                          onClick={() => handleOpenCancelModal(activeTrackingOrder)}
                          className="rounded-xs border border-rose-200 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 transition cursor-pointer"
                        >
                          Cancel Consignment
                        </button>
                      )}

                      {/* Return Order Action */}
                      {activeTrackingOrder.status === 'Delivered' && (
                        <button
                          type="button"
                          onClick={() => handleOpenReturnModal(activeTrackingOrder)}
                          className="rounded-xs border border-amber-300 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 transition flex items-center gap-1 cursor-pointer"
                        >
                          <span>↩</span> Return / Refund
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Special Status Notices */}
                  {activeTrackingOrder.status === 'Cancelled' && (
                    <div className="rounded-xs border border-rose-200 bg-rose-50/70 p-3.5 text-xs text-rose-900 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <span>🚫</span> Consignment Cancelled ({activeTrackingOrder.cancellation?.date || activeTrackingOrder.date})
                      </p>
                      <p className="text-[11px] text-rose-700">
                        Reason: {activeTrackingOrder.cancellation?.reason || 'Cancelled upon customer request.'}
                      </p>
                    </div>
                  )}

                  {activeTrackingOrder.status === 'Return Requested' && (
                    <div className="rounded-xs border border-purple-200 bg-purple-50/70 p-3.5 text-xs text-purple-950 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <span>⏳</span> Return & Refund Request Under Concierge Review
                      </p>
                      <p className="text-[11px] text-purple-800">
                        Reason: {activeTrackingOrder.returnRequest?.reason} &bull; Mode: {activeTrackingOrder.returnRequest?.refundPreference}
                      </p>
                    </div>
                  )}

                  {activeTrackingOrder.status === 'Return Approved' && (
                    <div className="rounded-xs border border-teal-200 bg-teal-50/70 p-3.5 text-xs text-teal-950 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <span>📦</span> Return Authorized & Reverse Courier Pickup Scheduled
                      </p>
                      <p className="text-[11px] text-teal-800">
                        Please keep the item inside original box with warranty cards intact. BlueDart courier will collect it within 24-48 hours.
                      </p>
                    </div>
                  )}

                  {activeTrackingOrder.status === 'Refunded' && (
                    <div className="rounded-xs border border-emerald-300 bg-emerald-50/80 p-3.5 text-xs text-emerald-950 space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                        <span>✅</span> Refund of ₹{(activeTrackingOrder.refundDetails?.amount || activeTrackingOrder.total)?.toLocaleString('en-IN')} Settled
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        Transaction ID: <span className="font-mono font-bold">{activeTrackingOrder.refundDetails?.transactionId || 'REF-CONFIRMED'}</span> &bull; {activeTrackingOrder.refundDetails?.date || activeTrackingOrder.date}
                      </p>
                    </div>
                  )}

                  {activeTrackingOrder.status === 'Return Rejected' && (
                    <div className="rounded-xs border border-red-200 bg-red-50/70 p-3.5 text-xs text-red-950 space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-red-900">
                        <span>⚠️</span> Return Request Declined
                      </p>
                      <p className="text-[11px] text-red-700">
                        Notes: {activeTrackingOrder.returnRequest?.adminNotes || 'Does not meet return quality verification conditions.'}
                      </p>
                    </div>
                  )}

                  {/* Carrier & Delivery Destination Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 border-y border-stone-100 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                        Courier Partner
                      </span>
                      <span className="font-bold text-stone-900 mt-1 block">
                        {activeTrackingOrder.courier || 'BlueDart Express Air'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                        AWB Airway Bill Code
                      </span>
                      <span className="font-mono font-bold text-stone-900 mt-1 block">
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
                        Destination City
                      </span>
                      <span className="font-bold text-stone-900 mt-1 block truncate">
                        {activeTrackingOrder.customer?.city}, {activeTrackingOrder.customer?.state}
                      </span>
                    </div>
                  </div>

                  {/* Live Transit Milestone Timeline */}
                  <div className="pt-2 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-950 flex items-center gap-1.5">
                      <TruckIcon className="w-4 h-4 text-stone-700" />
                      <span>Shipment Transit Milestones</span>
                    </h4>

                    <div className="relative pl-6 space-y-6 border-l-2 border-stone-200 ml-2 py-1">
                      {activeTrackingOrder.timeline && activeTrackingOrder.timeline.map((step, idx) => {
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
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
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

                  {/* Consignment Items in this shipment */}
                  <div className="border-t border-stone-100 pt-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-950">
                      Consignment Items ({activeTrackingOrder.items?.length || 0})
                    </h4>

                    <div className="divide-y divide-stone-100">
                      {activeTrackingOrder.items?.map((it, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <img src={it.image} alt="" className="h-11 w-11 rounded-xs object-contain bg-[#FAF9F5] border border-stone-200 p-1" />
                            <div>
                              <p className="font-bold text-stone-950">{it.name}</p>
                              <span className="text-[10px] text-stone-400">
                                {it.brand} &bull; Qty: {it.quantity} {it.color && `&bull; ${it.color}`}
                              </span>
                            </div>
                          </div>
                          <span className="font-bold text-stone-950">
                            ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-xs font-bold text-stone-900">
                      <span>Total Amount Settled:</span>
                      <span className="text-sm">₹{activeTrackingOrder.total?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                </div>

              </div>
            ) : null}
          </div>
        )}

        {/* ================= TAB 2: ADDRESS BOOK ================= */}
        {activeTab === 'addresses' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-editorial-serif text-xl font-normal text-stone-950">Saved Delivery Destinations</h3>
                <p className="text-xs text-stone-500">Pre-configured destinations for 1-click expedited checkout.</p>
              </div>
              <button
                onClick={handleOpenAddAddress}
                className="rounded-xs bg-[#121316] hover:bg-[#25262B] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#FAF9F5] shadow-xs"
              >
                + Add Destination
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {addresses.map(addr => (
                <div key={addr.id} className="rounded-xs border border-stone-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-stone-900 bg-stone-100 px-2 py-0.5 rounded-xs border border-stone-200">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[9.5px] font-bold text-[#9C7C44] uppercase tracking-wider">
                          Primary Default
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-xs text-stone-950">{addr.firstName} {addr.lastName}</p>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{addr.address}</p>
                    <p className="text-xs text-stone-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-[11px] text-stone-400 font-mono mt-1">Phone: {addr.phone}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 text-xs">
                    <button
                      onClick={() => handleOpenEditAddress(addr)}
                      className="text-stone-700 hover:text-black font-bold uppercase tracking-wider text-[10px]"
                    >
                      Edit
                    </button>
                    <span className="text-stone-300">&bull;</span>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-rose-600 hover:text-rose-800 font-bold uppercase tracking-wider text-[10px]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: WISHLIST ================= */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-editorial-serif text-xl font-normal text-stone-950">Curated Favorites ({wishlist.length})</h3>
              <Link to="/wishlist" className="text-xs font-bold text-[#9C7C44] hover:underline uppercase tracking-wider">
                Manage Full Wishlist &rarr;
              </Link>
            </div>

            {wishlist.length === 0 ? (
              <p className="text-xs text-stone-500">No items saved to wishlist yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {wishlist.slice(0, 4).map(p => (
                  <Link key={p.id} to={`/product/${p.id}`} className="rounded-xs border border-stone-200 bg-white p-3 shadow-2xs block">
                    <img src={p.image} alt="" className="aspect-square w-full object-contain mix-blend-multiply bg-[#FAF9F5] p-2 rounded-xs mb-2" />
                    <p className="text-[10px] font-bold text-[#9C7C44] uppercase">{p.brand}</p>
                    <p className="text-xs font-semibold text-stone-950 truncate">{p.name}</p>
                    <p className="text-xs font-bold text-stone-950 mt-1">₹{Number(p.price).toLocaleString('en-IN')}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: SECURITY & EMAILS ================= */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-fade-in text-xs max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Email Status & Credentials Card */}
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-amber-600" />
                    <h3 className="font-bold uppercase tracking-wider text-stone-950">Email Status</h3>
                  </div>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>Verified</span>
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="font-bold text-stone-600 block mb-1">Registered Customer Email</label>
                    <div className="rounded-xl border border-stone-200 bg-[#FAF9F5] px-3.5 py-2.5 font-bold text-stone-900 break-all">
                      {currentUser?.email}
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    All digital receipts, dispatch tracking links, and security alerts are securely routed to this email address.
                  </p>

                  <button
                    type="button"
                    onClick={() => handleOpenEmailModal(null)}
                    className="w-full rounded-full border border-stone-300 bg-stone-50 hover:bg-stone-100 py-2.5 font-bold text-stone-900 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-amber-600" />
                    <span>Open Delivered Emails &amp; OTP Inbox</span>
                  </button>
                </div>
              </div>

              {/* Change Password via OTP Card */}
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <Key className="h-4 w-4 text-amber-600" />
                  <h3 className="font-bold uppercase tracking-wider text-stone-950">Update Password (OTP)</h3>
                </div>

                {securityError && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-[11px] font-semibold text-rose-800">
                    {securityError}
                  </div>
                )}

                {securityStatus && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-[11px] font-semibold text-emerald-800">
                    {securityStatus}
                  </div>
                )}

                {!securityOtpSent ? (
                  <div className="space-y-3">
                    <p className="text-[11px] text-stone-600">
                      To safeguard your account, updating your credentials requires a 6-digit OTP verification code sent to <strong>{currentUser?.email}</strong>.
                    </p>
                    <button
                      type="button"
                      disabled={securityLoading}
                      onClick={handleSendSecurityOtp}
                      className="w-full rounded-full bg-[#121316] py-2.5 font-bold uppercase tracking-wider text-white hover:bg-black transition cursor-pointer disabled:opacity-60"
                    >
                      {securityLoading ? 'Sending Security Code...' : 'Send Password Change OTP'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateSecurityPassword} className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-stone-700">6-Digit Verification OTP</label>
                        <button
                          type="button"
                          disabled={securityCooldown > 0}
                          onClick={handleSendSecurityOtp}
                          className="text-[10px] font-bold text-amber-700 hover:underline"
                        >
                          {securityCooldown > 0 ? `Resend in ${securityCooldown}s` : 'Resend OTP'}
                        </button>
                      </div>
                      <div className="flex justify-center gap-1.5">
                        {securityOtpDigits.map((d, i) => (
                          <input
                            key={i}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={d}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '').slice(-1);
                              const updated = [...securityOtpDigits];
                              updated[i] = val;
                              setSecurityOtpDigits(updated);
                            }}
                            className="h-9 w-8 text-center font-mono text-base font-bold rounded-lg border border-stone-300 bg-[#FAF9F5] text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">New Strong Password</label>
                      <input
                        type="password"
                        required
                        value={securityNewPassword}
                        onChange={(e) => setSecurityNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full rounded-xl border border-stone-200 bg-[#FAF9F5] px-3 py-2 outline-none focus:bg-white text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={securityConfirmPassword}
                        onChange={(e) => setSecurityConfirmPassword(e.target.value)}
                        placeholder="Re-type new password"
                        className="w-full rounded-xl border border-stone-200 bg-[#FAF9F5] px-3 py-2 outline-none focus:bg-white text-stone-900"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={securityLoading}
                      className="w-full rounded-full bg-[#121316] py-2.5 font-bold uppercase tracking-wider text-white hover:bg-black transition cursor-pointer disabled:opacity-60"
                    >
                      {securityLoading ? 'Verifying & Saving...' : 'Save New Password'}
                    </button>
                  </form>
                )}
              </div>

            </div>

            {/* Email History Table Card */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-amber-600" />
                  <h3 className="font-bold uppercase tracking-wider text-stone-950">
                    Recent Emails &amp; Dispatches to You
                  </h3>
                </div>
                <span className="text-[11px] text-stone-500">
                  {emailLogs.filter(l => l.to?.toLowerCase() === currentUser?.email?.toLowerCase()).length} Recorded Dispatches
                </span>
              </div>

              {emailLogs.filter(l => l.to?.toLowerCase() === currentUser?.email?.toLowerCase()).length === 0 ? (
                <div className="text-center py-6 text-stone-400">
                  <Mail className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>No dispatches recorded yet for {currentUser?.email}.</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100 overflow-hidden">
                  {emailLogs
                    .filter(l => l.to?.toLowerCase() === currentUser?.email?.toLowerCase())
                    .slice(0, 5)
                    .map((log) => (
                      <div key={log.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-stone-900 truncate block">
                              {log.subject}
                            </span>
                            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.2 text-[9px] font-bold text-emerald-700">
                              {log.status || 'Delivered'}
                            </span>
                          </div>
                          <span className="text-[10.5px] text-stone-400">
                            {log.formattedDate} at {log.formattedTime}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenEmailModal(log.id)}
                          className="rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 px-3 py-1 text-[11px] font-bold text-stone-800 transition shrink-0 cursor-pointer"
                        >
                          View Email
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ================= TAB 4: PROFILE SETTINGS ================= */}
        {activeTab === 'profile' && (
          <div className="max-w-xl rounded-xs border border-stone-200 bg-white p-6 shadow-xs space-y-4 animate-fade-in text-xs">
            <h3 className="font-editorial-serif text-xl font-normal text-stone-950">Patron Credentials</h3>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser.name || 'Rahul Patel'}
                  className="w-full rounded-xs border border-stone-200 bg-[#FAF9F5] p-2 font-semibold text-stone-800"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Registered Email Address</label>
                <input
                  type="email"
                  readOnly
                  value={currentUser.email}
                  className="w-full rounded-xs border border-stone-200 bg-[#FAF9F5] p-2 font-semibold text-stone-800"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Account Role</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser.role?.toUpperCase() || 'CUSTOMER'}
                  className="w-full rounded-xs border border-stone-200 bg-[#FAF9F5] p-2 font-mono font-bold text-stone-800"
                />
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Address Modal */}
      {addrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-xs border border-stone-200 bg-white p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-950">
                {editingAddr ? 'Edit Delivery Destination' : 'Add New Delivery Destination'}
              </h3>
              <button onClick={() => setAddrModalOpen(false)} className="text-stone-400 hover:text-black font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Address Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flagship Office / Home Villa"
                  value={addrForm.label}
                  onChange={e => setAddrForm({ ...addrForm, label: e.target.value })}
                  className="w-full rounded-xs border border-stone-200 bg-[#FAF9F5] p-2 outline-none focus:bg-white"
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
                    className="w-full rounded-xs border border-stone-200 bg-[#FAF9F5] p-2 outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={addrForm.lastName}
                    onChange={e => setAddrForm({ ...addrForm, lastName: e.target.value })}
                    className="w-full rounded-xs border border-stone-200 bg-[#FAF9F5] p-2 outline-none focus:bg-white"
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
                  className="w-full rounded-xs border border-stone-200 bg-[#FAF9F5] p-2 outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Street Address / Landmark *</label>
                <input
                  type="text"
                  required
                  value={addrForm.address}
                  onChange={e => setAddrForm({ ...addrForm, address: e.target.value })}
                  className="w-full rounded-xs border border-stone-200 bg-[#FAF9F5] p-2 outline-none focus:bg-white"
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
                    className="w-full rounded-xs border border-stone-200 bg-[#FAF9F5] p-2 outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={addrForm.state}
                    onChange={e => setAddrForm({ ...addrForm, state: e.target.value })}
                    className="w-full rounded-xs border border-stone-200 bg-[#FAF9F5] p-2 outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={addrForm.pincode}
                    onChange={e => setAddrForm({ ...addrForm, pincode: e.target.value })}
                    className="w-full rounded-xs border border-stone-200 bg-[#FAF9F5] p-2 font-mono outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddrModalOpen(false)}
                  className="rounded-xs border border-stone-300 bg-stone-100 px-4 py-2 font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xs bg-[#121316] px-5 py-2 font-bold uppercase tracking-wider text-[#FAF9F5] hover:bg-[#25262B]"
                >
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CANCEL ORDER MODAL ================= */}
      {cancelModalOpen && selectedOrderForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-xs border border-rose-200 bg-white p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-rose-700">
                <span className="text-base">⚠️</span>
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Cancel Consignment {selectedOrderForCancel.id}
                </h3>
              </div>
              <button
                onClick={() => setCancelModalOpen(false)}
                className="text-stone-400 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xs bg-rose-50/70 border border-rose-200 p-3 space-y-1 text-rose-900">
              <p className="font-semibold">Are you sure you want to cancel this order?</p>
              <p className="text-[11px] text-rose-700">
                Total amount: <strong>₹{selectedOrderForCancel.total?.toLocaleString('en-IN')}</strong> ({selectedOrderForCancel.paymentMethod})
                {selectedOrderForCancel.paymentStatus === 'Paid' && ' • Full payment will be initiated for refund.'}
              </p>
            </div>

            <form onSubmit={handleConfirmCancel} className="space-y-3.5">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Select Cancellation Reason *</label>
                <select
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="w-full rounded-xs border border-stone-200 bg-[#FAF9F5] p-2.5 outline-none focus:bg-white text-xs text-stone-900"
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
                  className="w-full rounded-xs border border-stone-200 bg-[#FAF9F5] p-2 outline-none focus:bg-white text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  className="rounded-xs border border-stone-300 bg-stone-100 px-4 py-2 font-bold text-stone-700"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  className="rounded-xs bg-rose-700 px-5 py-2 font-bold uppercase tracking-wider text-white hover:bg-rose-800 shadow-xs"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= RETURN / REFUND REQUEST MODAL ================= */}
      {returnModalOpen && selectedOrderForReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-xs border border-purple-200 bg-white p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-stone-900">
                <span className="text-base text-purple-700">↩</span>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    7-Day Return & Refund Request
                  </h3>
                  <span className="text-[10px] text-stone-400 font-mono">Consignment {selectedOrderForReturn.id}</span>
                </div>
              </div>
              <button
                onClick={() => setReturnModalOpen(false)}
                className="text-stone-400 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xs bg-stone-50 border border-stone-200 p-3 space-y-1">
              <div className="flex justify-between font-bold text-stone-900">
                <span>Items in Return: {selectedOrderForReturn.items?.length || 1} Item(s)</span>
                <span>Eligible Refund: ₹{selectedOrderForReturn.total?.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Protected by Krishna Accessories 7-Day Authentic Return Policy. Reverse pickup will be arranged by BlueDart.
              </p>
            </div>

            <form onSubmit={handleConfirmReturn} className="space-y-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Reason for Return *</label>
                <select
                  value={returnReason}
                  onChange={e => setReturnReason(e.target.value)}
                  className="w-full rounded-xs border border-stone-200 bg-[#FAF9F5] p-2.5 outline-none focus:bg-white text-xs"
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
                  className="w-full rounded-xs border border-stone-200 bg-[#FAF9F5] p-2.5 outline-none focus:bg-white text-xs"
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
                  className="w-full rounded-xs border border-stone-200 bg-[#FAF9F5] p-2.5 outline-none focus:bg-white text-xs"
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
                    className="w-full rounded-xs border border-purple-200 bg-[#FAF9F5] p-2 font-mono outline-none focus:bg-white text-xs"
                  />
                </div>
              )}

              {refundMethod === 'Bank Account NEFT Transfer' && (
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Bank Name, A/C No. & IFSC Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HDFC Bank, A/C: 501002348911, IFSC: HDFC0001234"
                    value={returnBankDetails}
                    onChange={e => setReturnBankDetails(e.target.value)}
                    className="w-full rounded-xs border border-purple-200 bg-[#FAF9F5] p-2 outline-none focus:bg-white text-xs"
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
                  className="w-full rounded-xs border border-stone-200 bg-[#FAF9F5] p-2 outline-none focus:bg-white text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setReturnModalOpen(false)}
                  className="rounded-xs border border-stone-300 bg-stone-100 px-4 py-2 font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xs bg-[#121316] px-5 py-2 font-bold uppercase tracking-wider text-[#FAF9F5] hover:bg-[#25262B] shadow-xs"
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
