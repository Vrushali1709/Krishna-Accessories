// src/pages/Account.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCurrentUser, logout } from '../utils/auth';
import { getOrders, getUserAddresses, saveUserAddress, deleteUserAddress, cancelOrder, requestReturn } from '../utils/orderStore';
import { getWishlist } from '../utils/productStore';
import { UserIcon, TruckIcon, HeartIcon, ShieldCheckIcon, LockClosedIcon } from '../components/Icons';

export default function Account() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [orders, setOrders] = useState(() => getOrders());
  const [addresses, setAddresses] = useState(() => getUserAddresses());
  const [wishlist, setWishlist] = useState(() => getWishlist());
  const [activeTab, setActiveTab] = useState('orders');

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
    o => !o.customer?.email || o.customer?.email?.toLowerCase() === currentUser.email?.toLowerCase() || orders.length > 0
  );

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
            { id: 'addresses', label: `Address Book (${addresses.length})` },
            { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})` },
            { id: 'profile', label: `Profile Preferences` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-xs font-bold uppercase tracking-[0.16em] transition border-b-2 whitespace-nowrap ${activeTab === tab.id
                ? 'border-[#121316] text-[#121316]'
                : 'border-transparent text-stone-400 hover:text-stone-900'
                }`}
            >
              {tab.label}
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

                        <Link
                          to={`/tracking?id=${order.id}`}
                          className="rounded-xs bg-[#121316] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FAF9F5] hover:bg-[#25262B] shadow-2xs transition"
                        >
                          Track Status &rarr;
                        </Link>
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
