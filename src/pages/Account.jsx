// src/pages/Account.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCurrentUser, logout } from '../utils/auth';
import { getOrders, getUserAddresses, saveUserAddress, deleteUserAddress, cancelOrder, requestReturn } from '../utils/orderStore';
import { getWishlist } from '../utils/productStore';
import { UserIcon, TruckIcon, HeartIcon, ShieldCheckIcon, LockClosedIcon, ArrowRightIcon } from '../components/Icons';

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

  const handleOpenCancelOrder = (order) => {
    setSelectedOrderForCancel(order);
    setCancelReason('Ordered by mistake');
    setCancelComments('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancelOrder = (e) => {
    e.preventDefault();
    if (!selectedOrderForCancel) return;
    cancelOrder(selectedOrderForCancel.id, `${cancelReason} - ${cancelComments}`);
    setCancelModalOpen(false);
    setSelectedOrderForCancel(null);
  };

  const handleOpenReturnOrder = (order) => {
    setSelectedOrderForReturn(order);
    setReturnReason('Defective / Damaged Piece');
    setReturnComments('');
    setRefundMethod('Original Payment Method');
    setReturnCondition('Unused with Original Packaging & Tags');
    setReturnModalOpen(true);
  };

  const handleConfirmReturnOrder = (e) => {
    e.preventDefault();
    if (!selectedOrderForReturn) return;
    requestReturn(selectedOrderForReturn.id, {
      reason: returnReason,
      comments: returnComments,
      refundMethod,
      upiId: returnUpiId,
      bankDetails: returnBankDetails,
      condition: returnCondition
    });
    setReturnModalOpen(false);
    setSelectedOrderForReturn(null);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 overflow-x-clip">
      <Navbar />

      {/* Account Hub Banner */}
      <section className="border-b border-zinc-200/80 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-white font-serif font-bold text-xl shadow-xs">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 font-sans">
                    {currentUser?.name || 'Client Account'}
                  </h1>
                  <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-700">
                    {currentUser?.role || 'Customer'}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {currentUser?.email} &bull; {currentUser?.phone || '+91 (079) 4000-5500'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {currentUser?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="rounded-lg border border-zinc-900 bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-black transition shadow-xs"
                >
                  Admin Console &rarr;
                </Link>
              )}
              {currentUser?.role === 'supplier' && (
                <Link
                  to="/supplier"
                  className="rounded-lg border border-blue-600 bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-xs"
                >
                  Vendor Portal &rarr;
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition shadow-2xs"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-2 border-b border-zinc-200/80 pb-px overflow-x-auto">
          {[
            { id: 'orders', label: `My Orders (${orders.length})` },
            { id: 'addresses', label: `Delivery Addresses (${addresses.length})` },
            { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})` },
            { id: 'profile', label: 'Personal Information' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-zinc-950 text-zinc-950'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= TAB 1: ORDERS ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fade-in">
            {orders.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-xs space-y-3">
                <h3 className="text-base font-bold text-zinc-900">No Orders Placed Yet</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Browse our certified authentic horology and luxury accessories catalog to place your first consignment.
                </p>
                <Link
                  to="/shop"
                  className="mt-2 inline-block rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black"
                >
                  Explore Catalog
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                const isDelivered = order.status === 'Delivered';
                const isCancelled = order.status === 'Cancelled' || order.status === 'Refunded';
                const canCancel = !isDelivered && !isCancelled;
                const canReturn = isDelivered && !order.returnRequested;

                return (
                  <div key={order.id} className="rounded-2xl border border-zinc-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
                    
                    {/* Order Top Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-zinc-950">{order.id}</span>
                          <span className="text-zinc-300">•</span>
                          <span className="text-xs text-zinc-500">{order.date}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Paid via {order.paymentMethod || 'Online Gateway'} &bull; Courier: {order.courier || 'BlueDart'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-start sm:self-auto">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                          isDelivered
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : isCancelled
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-sm font-bold font-mono text-zinc-950">
                          ₹{order.total?.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="divide-y divide-zinc-100 space-y-2.5">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-contain bg-zinc-50 border border-zinc-200 p-1 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">{item.brand}</span>
                              <Link to={`/product/${item.id}`} className="text-xs font-bold text-zinc-900 hover:text-black line-clamp-1">
                                {item.name}
                              </Link>
                              <span className="text-[10.5px] text-zinc-500">Qty: {item.quantity} {item.color && `&bull; ${item.color}`}</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold font-mono text-zinc-950 shrink-0">
                            ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Action Buttons Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-3">
                      <Link
                        to={`/tracking?id=${order.id}`}
                        className="text-xs font-semibold text-[#B89035] hover:underline"
                      >
                        Track Milestone Delivery &rarr;
                      </Link>

                      <div className="flex items-center gap-2">
                        {canCancel && (
                          <button
                            type="button"
                            onClick={() => handleOpenCancelOrder(order)}
                            className="rounded-lg border border-rose-200 bg-rose-50/50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
                          >
                            Cancel Consignment
                          </button>
                        )}
                        {canReturn && (
                          <button
                            type="button"
                            onClick={() => handleOpenReturnOrder(order)}
                            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition"
                          >
                            Request 7-Day Return
                          </button>
                        )}
                        {order.returnRequested && (
                          <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                            Return Pending Review ({order.returnDetails?.reason || 'Initiated'})
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ================= TAB 2: ADDRESSES ================= */}
        {activeTab === 'addresses' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Saved Delivery Addresses</h3>
              <button
                type="button"
                onClick={handleOpenAddAddress}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-black transition shadow-xs"
              >
                + Add New Address
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-zinc-900">{addr.label || 'Home'}</span>
                      {addr.isDefault && (
                        <span className="rounded bg-zinc-100 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-zinc-800 border border-zinc-200">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-zinc-900 mt-1">{addr.firstName} {addr.lastName}</p>
                    <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{addr.address}</p>
                    <p className="text-xs text-zinc-600">{addr.city}, {addr.state} {addr.pincode}</p>
                    <p className="text-xs text-zinc-500 font-mono mt-1">Ph: {addr.phone}</p>
                  </div>

                  <div className="flex items-center gap-2 border-t border-zinc-100 pt-3">
                    <button
                      type="button"
                      onClick={() => handleOpenEditAddress(addr)}
                      className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="flex-1 rounded-lg border border-rose-200 bg-rose-50/50 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: WISHLIST SHORTCUT ================= */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Your Shortlisted Pieces</h3>
              <Link to="/wishlist" className="text-xs font-semibold text-[#B89035] hover:underline">
                View Full Wishlist Grid &rarr;
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {wishlist.map((p) => (
                <div key={p.id} className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs space-y-2">
                  <img src={p.image} alt="" className="aspect-square w-full rounded-lg object-contain bg-zinc-50 p-2" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-zinc-400">{p.brand}</span>
                    <h4 className="text-xs font-bold text-zinc-900 truncate">{p.name}</h4>
                    <span className="text-xs font-bold font-mono text-zinc-950 block mt-0.5">₹{p.price?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: PROFILE INFO ================= */}
        {activeTab === 'profile' && (
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs max-w-xl space-y-4 animate-fade-in">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
              Personal Information Coordinates
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-zinc-400 font-semibold block text-[10px] uppercase">Registered Name</span>
                <span className="text-zinc-900 font-bold text-sm">{currentUser?.name || 'Verified Client'}</span>
              </div>
              <div>
                <span className="text-zinc-400 font-semibold block text-[10px] uppercase">Email Address</span>
                <span className="text-zinc-900 font-medium">{currentUser?.email}</span>
              </div>
              <div>
                <span className="text-zinc-400 font-semibold block text-[10px] uppercase">Primary Telephone</span>
                <span className="text-zinc-900 font-medium">{currentUser?.phone || '+91 (079) 4000-5500'}</span>
              </div>
              <div>
                <span className="text-zinc-400 font-semibold block text-[10px] uppercase">Client Authorization Level</span>
                <span className="text-zinc-900 font-semibold uppercase">{currentUser?.role || 'Customer'}</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================= ADD/EDIT ADDRESS MODAL ================= */}
      {addrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 border border-zinc-200 shadow-2xl space-y-4 animate-modal">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-bold text-zinc-950">
                {editingAddr ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>
              <button
                type="button"
                onClick={() => setAddrModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-950 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={addrForm.firstName}
                    onChange={(e) => setAddrForm({ ...addrForm, firstName: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={addrForm.lastName}
                    onChange={(e) => setAddrForm({ ...addrForm, lastName: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={addrForm.phone}
                    onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Address Label</label>
                  <select
                    value={addrForm.label}
                    onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-zinc-900 cursor-pointer"
                  >
                    <option value="Home">Home</option>
                    <option value="Work / Office">Work / Office</option>
                    <option value="Boutique / Other">Boutique / Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">Street Address / Suite *</label>
                <input
                  type="text"
                  required
                  value={addrForm.address}
                  onChange={(e) => setAddrForm({ ...addrForm, address: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-zinc-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={addrForm.city}
                    onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={addrForm.state}
                    onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={addrForm.pincode}
                    onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-mono outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addrForm.isDefault}
                    onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
                    className="rounded accent-zinc-900"
                  />
                  <span>Set as default consignment address</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setAddrModalOpen(false)}
                  className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-zinc-900 px-5 py-2 text-xs font-semibold text-white hover:bg-black transition shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CANCEL ORDER MODAL ================= */}
      {cancelModalOpen && selectedOrderForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-zinc-200 shadow-2xl space-y-4 animate-modal">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-bold text-zinc-950">Cancel Order {selectedOrderForCancel.id}</h3>
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-950 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmCancelOrder} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">Reason for Cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-zinc-900 cursor-pointer"
                >
                  <option value="Ordered by mistake">Ordered by mistake</option>
                  <option value="Found alternative piece">Found alternative piece</option>
                  <option value="Delivery timeframe too long">Delivery timeframe too long</option>
                  <option value="Incorrect shipping address entered">Incorrect shipping address entered</option>
                  <option value="Other concierge reason">Other concierge reason</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">Additional Notes</label>
                <textarea
                  rows={3}
                  value={cancelComments}
                  onChange={(e) => setCancelComments(e.target.value)}
                  placeholder="Optional details for our concierge support..."
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-zinc-900 focus:bg-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-5 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition shadow-xs"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= RETURN ORDER MODAL ================= */}
      {returnModalOpen && selectedOrderForReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-zinc-200 shadow-2xl space-y-4 animate-modal">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-bold text-zinc-950">Initiate 7-Day Return for {selectedOrderForReturn.id}</h3>
              <button
                type="button"
                onClick={() => setReturnModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-950 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReturnOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Return Reason *</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-zinc-900 cursor-pointer"
                >
                  <option value="Defective / Damaged Piece">Defective / Damaged Piece</option>
                  <option value="Size / Fit Mismatch">Size / Fit Mismatch</option>
                  <option value="Different item received">Different item received</option>
                  <option value="Quality not as expected">Quality not as expected</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Refund Method *</label>
                <select
                  value={refundMethod}
                  onChange={(e) => setRefundMethod(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-zinc-900 cursor-pointer"
                >
                  <option value="Original Payment Method">Original Payment Method (Card/UPI)</option>
                  <option value="Direct UPI VPA Transfer">Direct UPI Transfer</option>
                  <option value="NEFT / IMPS Bank Transfer">Bank Transfer (NEFT)</option>
                </select>
              </div>

              {refundMethod === 'Direct UPI VPA Transfer' && (
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">UPI ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. yourname@okhdfcbank"
                    value={returnUpiId}
                    onChange={(e) => setReturnUpiId(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Return Details & Condition</label>
                <textarea
                  rows={3}
                  value={returnComments}
                  onChange={(e) => setReturnComments(e.target.value)}
                  placeholder="Describe condition of piece, security tags, and packaging..."
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-zinc-900 focus:bg-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setReturnModalOpen(false)}
                  className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-zinc-900 px-5 py-2 text-xs font-semibold text-white hover:bg-black transition shadow-xs"
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
