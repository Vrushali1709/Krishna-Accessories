import React, { useState, useMemo, useEffect } from 'react';
import {
  Users, ShoppingBag, DollarSign, TrendingUp, Search, Bell, Filter, Eye, ChevronRight,
  TrendingDown, ShieldCheck, Tag, Box, ArrowUpRight, CheckCircle2, Clock, XCircle, RefreshCw, AlertTriangle
} from 'lucide-react';
import { initialOrders } from '../data/mockData';

export default function AdminDashboard({ products = [], isMock = false }) {
  // Global State
  const [globalSearch, setGlobalSearch] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'overview' | 'orders' | 'inventory' | 'customers'

  // Orders State & Filters
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('nexus_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Inventory Filters
  const [inventoryStockFilter, setInventoryStockFilter] = useState('All'); // 'All' | 'Low' | 'Out' | 'InStock'
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('All');

  // Customer Filters
  const [customerSearch, setCustomerSearch] = useState('');

  // Sync orders with localStorage
  useEffect(() => {
    localStorage.getItem('nexus_orders');
  }, []);

  const saveOrdersToStorage = (updatedOrders) => {
    setOrders(updatedOrders);
    localStorage.setItem('nexus_orders', JSON.stringify(updatedOrders));
  };

  // Status Change Handlers
  const handleOrderStatusChange = (orderId, newStatus) => {
    const updated = orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          history: [
            ...(order.history || []),
            { status: newStatus, date: new Date().toISOString().split('T')[0], note: `Status updated to ${newStatus}` }
          ]
        };
      }
      return order;
    });
    saveOrdersToStorage(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
  };

  // Order Metrics Calculations
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => ['Confirmed', 'Processing', 'Return Requested'].includes(o.status)).length;
    
    // Unique Customers
    const uniqueEmails = new Set(orders.map(o => o.customer?.email).filter(Boolean));
    const totalCustomers = uniqueEmails.size;

    return {
      revenue: totalRevenue,
      orders: totalOrders,
      pending: pendingOrders,
      customers: totalCustomers
    };
  }, [orders]);

  // Filter Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const q = globalSearch.trim().toLowerCase();
      const matchesSearch = !q ||
        o.id?.toString().toLowerCase().includes(q) ||
        o.customer?.name?.toLowerCase().includes(q) ||
        o.customer?.email?.toLowerCase().includes(q) ||
        o.items?.some(it => it.name?.toLowerCase().includes(q));
      const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, globalSearch, orderStatusFilter]);

  // Filter Inventory
  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const q = globalSearch.trim().toLowerCase();
      const matchesSearch = !q ||
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q);
      
      const matchesCategory = inventoryCategoryFilter === 'All' || p.category === inventoryCategoryFilter;
      
      let matchesStock = true;
      const stock = p.stock ?? 0;
      if (inventoryStockFilter === 'Low') matchesStock = stock > 0 && stock <= 5;
      else if (inventoryStockFilter === 'Out') matchesStock = stock === 0;
      else if (inventoryStockFilter === 'InStock') matchesStock = stock > 5;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, globalSearch, inventoryCategoryFilter, inventoryStockFilter]);

  // Extract Customer Data from Orders
  const customerList = useMemo(() => {
    const customerMap = {};
    orders.forEach(order => {
      const email = order.customer?.email;
      if (!email) return;
      if (!customerMap[email]) {
        customerMap[email] = {
          name: order.customer?.name || 'Unknown',
          email: email,
          totalSpent: 0,
          ordersCount: 0,
          lastOrderDate: order.date
        };
      }
      customerMap[email].totalSpent += (order.total || 0);
      customerMap[email].ordersCount += 1;
      if (new Date(order.date) > new Date(customerMap[email].lastOrderDate)) {
        customerMap[email].lastOrderDate = order.date;
      }
    });
    
    return Object.values(customerMap).filter(c => {
      const q = (globalSearch || customerSearch).trim().toLowerCase();
      return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    });
  }, [orders, globalSearch, customerSearch]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      case 'Processing':
      case 'Confirmed':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'Return Requested':
        return 'bg-purple-50 text-purple-700 border-purple-200/60';
      case 'Refunded':
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200/60';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-16 font-sans antialiased">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-zinc-900">Admin Operations</h1>
              <p className="text-xs text-zinc-500">Store Management Console</p>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="relative hidden w-full max-w-xs md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search orders, customers, items..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-1.5 pl-9 pr-4 text-xs text-zinc-900 placeholder-zinc-400 transition focus:border-zinc-400 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-xl border border-zinc-200 bg-white p-2 text-zinc-600 hover:bg-zinc-50">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500"></span>
            </button>
            <div className="h-8 w-[1px] bg-zinc-200"></div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-700">
                AD
              </div>
              <span className="hidden text-xs font-medium text-zinc-700 sm:inline">Administrator</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="mb-6 flex space-x-1 border-b border-zinc-200 pb-2">
          {[
            { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingBag },
            { id: 'inventory', label: 'Inventory & Stock', icon: Box },
            { id: 'customers', label: 'Customers', icon: Users },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? 'border-zinc-900 text-zinc-900'
                    : 'border-transparent text-zinc-500 hover:text-zinc-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Metric Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Total Revenue</span>
              <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-zinc-900">${metrics.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+12.5% from last month</span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Total Orders</span>
              <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                <ShoppingBag className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-zinc-900">{metrics.orders}</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+8.2% new volume</span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Pending Processing</span>
              <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-zinc-900">{metrics.pending}</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
              <span>Requires attention</span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Total Customers</span>
              <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-zinc-900">{metrics.customers}</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-purple-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Active buyer base</span>
            </div>
          </div>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
            <div className="flex flex-col gap-4 border-b border-zinc-200/80 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-zinc-900">Order Management</h2>
                <p className="text-xs text-zinc-500">Filter, inspect, and update customer order fulfillment</p>
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
                {['All', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Return Requested', 'Refunded', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                      orderStatusFilter === st
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'bg-white border border-zinc-200/80 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-200 bg-zinc-50/50 text-zinc-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Order ID</th>
                    <th className="px-5 py-3 font-semibold">Customer</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Items</th>
                    <th className="px-5 py-3 font-semibold">Total</th>
                    <th className="px-5 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/80 text-zinc-700">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-zinc-500">
                        No orders found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-zinc-50/80 transition">
                        <td className="px-5 py-4 font-semibold text-zinc-900">#{order.id}</td>
                        <td className="px-5 py-4">
                          <div className="font-medium text-zinc-900">{order.customer?.name}</div>
                          <div className="text-zinc-500 text-[11px]">{order.customer?.email}</div>
                        </td>
                        <td className="px-5 py-4 text-zinc-600">{order.date}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-zinc-600">
                          {order.items?.length || 0} items
                        </td>
                        <td className="px-5 py-4 font-semibold text-zinc-900">
                          ${order.total?.toFixed(2)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
            <div className="flex flex-col gap-4 border-b border-zinc-200/80 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-zinc-900">Inventory Management</h2>
                <p className="text-xs text-zinc-500">Track product stock levels and categories</p>
              </div>

              <div className="flex items-center gap-2">
                {/* Category Filter */}
                <select
                  value={inventoryCategoryFilter}
                  onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                  className="rounded-lg border border-zinc-200/80 bg-white px-3 py-1.5 text-xs text-zinc-700 focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>Category: {cat}</option>
                  ))}
                </select>

                {/* Stock Filter */}
                <select
                  value={inventoryStockFilter}
                  onChange={(e) => setInventoryStockFilter(e.target.value)}
                  className="rounded-lg border border-zinc-200/80 bg-white px-3 py-1.5 text-xs text-zinc-700 focus:outline-none"
                >
                  <option value="All">All Stock Levels</option>
                  <option value="InStock">In Stock (&gt;5)</option>
                  <option value="Low">Low Stock (&le;5)</option>
                  <option value="Out">Out of Stock (0)</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-200 bg-zinc-50/50 text-zinc-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Product</th>
                    <th className="px-5 py-3 font-semibold">Category</th>
                    <th className="px-5 py-3 font-semibold">Price</th>
                    <th className="px-5 py-3 font-semibold">Stock Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/80 text-zinc-700">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-zinc-500">
                        No inventory items found.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(product => {
                      const stock = product.stock ?? 0;
                      return (
                        <tr key={product.id} className="hover:bg-zinc-50/80 transition">
                          <td className="px-5 py-4 font-medium text-zinc-900">{product.name}</td>
                          <td className="px-5 py-4 text-zinc-600">{product.category || 'General'}</td>
                          <td className="px-5 py-4 font-semibold text-zinc-900">${product.price?.toFixed(2)}</td>
                          <td className="px-5 py-4">
                            {stock === 0 ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-200">
                                Out of Stock
                              </span>
                            ) : stock <= 5 ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                                Low Stock ({stock})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                                In Stock ({stock})
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
            <div className="p-5 border-b border-zinc-200/80">
              <h2 className="text-base font-semibold text-zinc-900">Customer Records</h2>
              <p className="text-xs text-zinc-500">Overview of active shoppers and purchase histories</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-200 bg-zinc-50/50 text-zinc-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Customer Name</th>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Total Orders</th>
                    <th className="px-5 py-3 font-semibold">Total Lifetime Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/80 text-zinc-700">
                  {customerList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-zinc-500">
                        No customer records available.
                      </td>
                    </tr>
                  ) : (
                    customerList.map((cust, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50/80 transition">
                        <td className="px-5 py-4 font-semibold text-zinc-900">{cust.name}</td>
                        <td className="px-5 py-4 text-zinc-600">{cust.email}</td>
                        <td className="px-5 py-4 font-medium">{cust.ordersCount} orders</td>
                        <td className="px-5 py-4 font-semibold text-emerald-600">${cust.totalSpent.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDER DETAILS MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white shadow-xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-200 p-5">
                <div>
                  <h3 className="text-base font-bold text-zinc-900">Order #{selectedOrder.id}</h3>
                  <p className="text-xs text-zinc-500">Placed on {selectedOrder.date}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                {/* Status Modifier */}
                <div className="rounded-xl bg-zinc-50 p-4 border border-zinc-200/80 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Current Status</p>
                    <span className={`mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Update Status</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleOrderStatusChange(selectedOrder.id, e.target.value)}
                      className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 font-medium focus:outline-none"
                    >
                      {['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Return Requested', 'Refunded', 'Cancelled'].map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Items List */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Order Items</h4>
                  <div className="divide-y divide-zinc-200/80 rounded-xl border border-zinc-200/80 bg-white">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 text-xs">
                        <div>
                          <p className="font-semibold text-zinc-900">{item.name}</p>
                          <p className="text-zinc-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-zinc-900">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Summary */}
                <div className="flex justify-between border-t border-zinc-200 pt-4 text-sm font-bold text-zinc-900">
                  <span>Total Amount Paid</span>
                  <span>${selectedOrder.total?.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-zinc-200 bg-zinc-50/50 p-4 text-right">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}