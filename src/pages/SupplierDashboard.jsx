// src/pages/SupplierDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getProducts, saveProduct, deleteProduct, getCategories, getBrands } from '../utils/productStore';
import { getOrders, updateOrderStatus, getSuppliers } from '../utils/orderStore';
import {
  Building2,
  Package,
  Boxes,
  Truck,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronRight,
  Clock,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Search,
  X,
  Layers,
  Filter,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  Coins,
  Info,
  ChevronDown
} from 'lucide-react';

export default function SupplierDashboard() {
  const suppliers = getSuppliers();
  const [activeSupplierName, setActiveSupplierName] = useState(suppliers[0]?.name || 'Apex Timepieces Ltd.');
  const [activeTab, setActiveTab] = useState('overview');

  const [allProducts, setAllProducts] = useState(() => getProducts());
  const [allOrders, setAllOrders] = useState(() => getOrders());

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrderToUpdate, setSelectedOrderToUpdate] = useState(null);
  const [courierInput, setCourierInput] = useState('BlueDart Express');
  const [awbInput, setAwbInput] = useState('');

  // Search filter for products table
  const [productSearch, setProductSearch] = useState('');

  // Product Form state
  const [form, setForm] = useState({
    name: '',
    brand: 'Titan',
    category: 'Watches',
    subcategory: '',
    sku: '',
    price: '',
    oldPrice: '',
    stock: '',
    image: '',
    description: '',
    material: '',
    warranty: '2 Years'
  });

  const categories = getCategories();
  const brands = getBrands();

  // Reload data on events
  const refreshData = () => {
    setAllProducts(getProducts());
    setAllOrders(getOrders());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('productsUpdated', refreshData);
    window.addEventListener('ordersUpdated', refreshData);
    return () => {
      window.removeEventListener('productsUpdated', refreshData);
      window.removeEventListener('ordersUpdated', refreshData);
    };
  }, []);

  // Filter products for the active supplier
  const supplierProducts = useMemo(() => {
    return allProducts.filter(p => !p.supplier || p.supplier.toLowerCase() === activeSupplierName.toLowerCase());
  }, [allProducts, activeSupplierName]);

  // Filter orders containing items for this supplier
  const supplierOrders = useMemo(() => {
    return allOrders.filter(o =>
      o.items && o.items.some(item => !item.supplier || item.supplier.toLowerCase() === activeSupplierName.toLowerCase())
    );
  }, [allOrders, activeSupplierName]);

  // Filtered products with search
  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return supplierProducts;
    const q = productSearch.toLowerCase();
    return supplierProducts.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q)
    );
  }, [supplierProducts, productSearch]);

  // Calculate Metrics
  const totalStockUnits = supplierProducts.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const pendingOrdersCount = supplierOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled' && o.status !== 'Refunded').length;
  const totalRevenue = supplierOrders
    .filter(o => o.status !== 'Cancelled' && o.status !== 'Refunded')
    .reduce((sum, o) => sum + Number(o.total || 0), 0);
  const netEarnings = Math.round(totalRevenue * 0.95); // 5% platform fee

  // Low stock products (< 10 units)
  const lowStockItems = supplierProducts.filter(p => Number(p.stock || 0) < 10);

  // Handle Add/Edit Product
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      brand: brands[0] || 'Titan',
      category: categories[0] || 'Watches',
      subcategory: '',
      sku: `KA-${activeSupplierName.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      price: '',
      oldPrice: '',
      stock: '20',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700',
      description: '',
      material: 'Stainless Steel',
      warranty: '2 Years'
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || '',
      brand: product.brand || brands[0],
      category: product.category || categories[0],
      subcategory: product.subcategory || '',
      sku: product.sku || '',
      price: product.price || '',
      oldPrice: product.oldPrice || '',
      stock: product.stock || 0,
      image: product.image || product.images?.[0] || '',
      description: product.description || '',
      material: product.specifications?.Material || '',
      warranty: product.specifications?.Warranty || '2 Years'
    });
    setModalOpen(true);
  };

  const handleSaveProductSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    const price = Number(form.price);
    const oldPrice = Number(form.oldPrice) || Math.round(price * 1.25);
    const discount = Math.round(((oldPrice - price) / oldPrice) * 100);

    const productPayload = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: form.name.trim(),
      brand: form.brand,
      category: form.category,
      subcategory: form.subcategory || 'General',
      sku: form.sku.trim() || `KA-SKU-${Date.now().toString().slice(-4)}`,
      price,
      oldPrice,
      discount,
      stock: Number(form.stock) || 0,
      rating: editingProduct?.rating || 4.8,
      supplier: activeSupplierName,
      image: form.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700',
      images: [form.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700'],
      description: form.description || 'Luxury product provided by verified supplier.',
      specifications: {
        Material: form.material || 'Premium',
        Warranty: form.warranty || '2 Years'
      }
    };

    saveProduct(productPayload);
    setModalOpen(false);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product from your supplier catalog?')) {
      deleteProduct(id);
    }
  };

  const handleQuickStockAdjust = (product, delta) => {
    const newStock = Math.max(0, Number(product.stock || 0) + delta);
    saveProduct({ ...product, stock: newStock });
  };

  // Status Change Dialog for Order
  const handleOpenStatusModal = (order) => {
    setSelectedOrderToUpdate(order);
    setCourierInput(order.courier || 'BlueDart Express');
    setAwbInput(order.trackingNumber || `BD${Math.floor(10000000 + Math.random() * 90000000)}IN`);
    setStatusModalOpen(true);
  };

  const handleUpdateOrderStatusSubmit = (newStatus) => {
    if (!selectedOrderToUpdate) return;
    updateOrderStatus(selectedOrderToUpdate.id, newStatus, {
      courier: courierInput,
      trackingNumber: awbInput
    });
    setStatusModalOpen(false);
    setSelectedOrderToUpdate(null);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-zinc-900 font-sans antialiased selection:bg-zinc-900 selection:text-white w-full overflow-x-hidden">
      <Navbar />

      {/* Supplier Top Header */}
      <section className="border-b border-zinc-200/80 bg-white/95 backdrop-blur-md sticky top-14 sm:top-16 z-20 shadow-2xs transition-all">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-3.5 sm:py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3.5 sm:gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-emerald-800 border border-emerald-200/60 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Verified Supplier
                </span>
                <span className="text-[11px] sm:text-xs text-zinc-400 font-medium tracking-wide">Fulfillment & Inventory Console</span>
              </div>
              <h1 className="mt-1 sm:mt-1.5 text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                </div>
                <span className="truncate">{activeSupplierName}</span>
              </h1>
            </div>

            {/* Supplier Switcher Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 w-full md:w-auto">
              <label className="text-[11px] sm:text-xs text-zinc-500 font-medium">Switch Vendor Account:</label>
              <div className="relative w-full sm:w-auto">
                <select
                  value={activeSupplierName}
                  onChange={(e) => setActiveSupplierName(e.target.value)}
                  className="w-full sm:w-auto appearance-none rounded-xl border border-zinc-200 bg-zinc-50/90 hover:bg-zinc-100/80 pl-3 pr-8 py-2 text-xs font-semibold text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 cursor-pointer transition shadow-2xs truncate"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 w-full">

        {/* KPI Stat Cards */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">

          {/* KPI 1: Active Catalog */}
          <div className="group rounded-xl sm:rounded-2xl border border-zinc-200/80 bg-white p-3.5 sm:p-5 shadow-2xs transition hover:shadow-xs hover:border-zinc-300">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-zinc-600 truncate">Active Catalog</span>
              <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white transition shrink-0">
                <Package className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </div>
            </div>
            <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 font-mono">{supplierProducts.length}</p>
            <div className="mt-1.5 sm:mt-2 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-emerald-700 leading-tight">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="truncate">Live in Storefront</span>
            </div>
          </div>

          {/* KPI 2: Total Stock Units */}
          <div className="group rounded-xl sm:rounded-2xl border border-zinc-200/80 bg-white p-3.5 sm:p-5 shadow-2xs transition hover:shadow-xs hover:border-zinc-300">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-zinc-600 truncate">Total Stock</span>
              <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white transition shrink-0">
                <Boxes className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </div>
            </div>
            <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 font-mono">{totalStockUnits.toLocaleString()}</p>
            <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] leading-tight">
              {lowStockItems.length > 0 ? (
                <span className="inline-flex items-center gap-1 font-semibold text-amber-700 truncate">
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  <span>{lowStockItems.length} items low</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-semibold text-zinc-600 truncate">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>Optimal depth</span>
                </span>
              )}
            </div>
          </div>

          {/* KPI 3: Pending Orders */}
          <div className="group rounded-xl sm:rounded-2xl border border-zinc-200/80 bg-white p-3.5 sm:p-5 shadow-2xs transition hover:shadow-xs hover:border-zinc-300">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-zinc-600 truncate">Pending Orders</span>
              <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 transition shrink-0">
                <Truck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </div>
            </div>
            <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold tracking-tight text-amber-600 font-mono">{pendingOrdersCount}</p>
            <span className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] text-zinc-600 font-medium block truncate">Awaiting dispatch</span>
          </div>

          {/* KPI 4: Net Supplier Payout */}
          <div className="group rounded-xl sm:rounded-2xl border border-zinc-200/80 bg-white p-3.5 sm:p-5 shadow-2xs transition hover:shadow-xs hover:border-zinc-300">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-zinc-600 truncate">Net Earnings (95%)</span>
              <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 transition shrink-0">
                <Wallet className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </div>
            </div>
            <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 font-mono truncate">₹{netEarnings.toLocaleString('en-IN')}</p>
            <span className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] text-zinc-600 block truncate">Gross: ₹{totalRevenue.toLocaleString('en-IN')}</span>
          </div>

        </div>

        {/* Tab Navigation Pill Bar (Scrollable on mobile) */}
        <div className="w-full overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 pb-1 scrollbar-none">
          <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1 rounded-xl sm:rounded-2xl bg-zinc-200/70 border border-zinc-200/80 min-w-max">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: BarChart3, count: null },
              { id: 'products', label: 'My Products', icon: Package, count: supplierProducts.length },
              { id: 'inventory', label: 'Stock Control', icon: Boxes, count: null },
              { id: 'orders', label: 'Order Fulfillment', icon: Truck, count: supplierOrders.length },
              { id: 'earnings', label: 'Payouts & Earnings', icon: Wallet, count: null }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold tracking-wide transition whitespace-nowrap ${isActive
                    ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200/70'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/50'
                    }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`px-1.5 py-0.2 rounded-md text-[9.5px] sm:text-[10px] font-mono font-bold ${isActive ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-200/70 text-zinc-500'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-5 sm:space-y-6">

            {/* Urgent Fulfillment Banner */}
            {pendingOrdersCount > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 rounded-xl sm:rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 sm:p-5 shadow-2xs">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 mt-0.5 sm:mt-0">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                      {pendingOrdersCount} customer {pendingOrdersCount === 1 ? 'order requires' : 'orders require'} urgent fulfillment
                    </h4>
                    <p className="text-[11px] sm:text-xs text-amber-800/90 mt-0.5">
                      Process packaging and attach courier tracking number to notify customers.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 sm:py-2.5 text-xs font-semibold text-white hover:bg-black transition shadow-xs shrink-0 w-full sm:w-auto"
                >
                  <span>View Order Queue</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Quick Actions & Recent Orders Preview */}
            <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">

              {/* Recent Orders Card */}
              <div className="rounded-xl sm:rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-900">Recent Customer Orders</h3>
                    <p className="text-[11px] sm:text-xs text-zinc-400">Latest transactions involving your inventory</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-zinc-600 hover:text-zinc-900 font-semibold hover:underline shrink-0"
                  >
                    <span>View all ({supplierOrders.length})</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-zinc-100">
                  {supplierOrders.slice(0, 4).map(order => (
                    <div key={order.id} className="py-3 first:pt-1 last:pb-1 flex items-center justify-between hover:bg-zinc-50/50 rounded-xl px-1.5 sm:px-2 -mx-1.5 sm:-mx-2 transition gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="font-mono text-[11px] sm:text-xs font-bold text-zinc-900">{order.id}</span>
                          <span className="text-zinc-300">•</span>
                          <span className="text-[10px] sm:text-xs text-zinc-500 truncate">{order.date}</span>
                        </div>
                        <p className="text-xs font-medium text-zinc-800 truncate">
                          {order.customer?.firstName} {order.customer?.lastName}
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate">
                          {order.items?.length || 0} items &bull; {order.paymentMethod || 'Prepaid'}
                        </p>
                      </div>

                      <div className="text-right space-y-1 shrink-0">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-semibold tracking-wide ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                          order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200/60' :
                            'bg-amber-50 text-amber-700 border border-amber-200/60'
                          }`}>
                          {order.status}
                        </span>
                        <p className="text-xs font-bold font-mono text-zinc-900">₹{order.total?.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                  {supplierOrders.length === 0 && (
                    <div className="py-8 text-center text-xs text-zinc-400">
                      No customer orders recorded yet for {activeSupplierName}.
                    </div>
                  )}
                </div>
              </div>

              {/* Low Stock Alerts Card */}
              <div className="rounded-xl sm:rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-900">Inventory Stock Health</h3>
                    <p className="text-[11px] sm:text-xs text-zinc-400">Items requiring immediate replenishment</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-zinc-600 hover:text-zinc-900 font-semibold hover:underline shrink-0"
                  >
                    <span>Manage stock</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {lowStockItems.length > 0 ? (
                  <div className="divide-y divide-zinc-100">
                    {lowStockItems.slice(0, 4).map(item => (
                      <div key={item.id} className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between hover:bg-zinc-50/50 rounded-xl px-1.5 sm:px-2 -mx-1.5 sm:-mx-2 transition gap-2">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl object-cover bg-zinc-50 border border-zinc-200/80 p-0.5 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-zinc-900 truncate max-w-[130px] sm:max-w-[180px]">{item.name}</p>
                            <span className="text-[10px] font-mono text-zinc-400 block truncate">{item.sku}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                          <span className="rounded-full bg-rose-50 text-rose-700 border border-rose-200/60 px-2 py-0.5 text-[9.5px] sm:text-[10px] font-bold font-mono">
                            {item.stock} left
                          </span>
                          <button
                            onClick={() => handleQuickStockAdjust(item, 10)}
                            className="rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-1 transition shadow-2xs"
                          >
                            +10
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center space-y-2">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <p className="text-xs font-bold text-zinc-800">All products have healthy inventory levels</p>
                    <p className="text-[11px] text-zinc-400">No low stock warnings active for this supplier catalog.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: My Products Catalog */}
        {activeTab === 'products' && (
          <div className="space-y-4 sm:space-y-5">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-zinc-900">Product Catalog ({supplierProducts.length})</h3>
                <p className="text-[11px] sm:text-xs text-zinc-500">Products assigned to {activeSupplierName} displayed across store catalog.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search SKU, name, brand..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-8 pr-7 py-2 text-xs rounded-xl border border-zinc-200 bg-white placeholder:text-zinc-400 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5 transition shadow-2xs"
                  />
                  {productSearch && (
                    <button onClick={() => setProductSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-black transition shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Mobile View: Product Cards */}
            <div className="block md:hidden space-y-3">
              {filteredProducts.map(p => (
                <div key={p.id} className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={p.image || p.images?.[0]}
                      alt={p.name}
                      className="h-14 w-14 rounded-xl object-cover bg-zinc-50 border border-zinc-200/80 shrink-0 p-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          to={`/product/${p.id}`}
                          className="font-bold text-xs text-zinc-900 hover:text-zinc-700 transition inline-flex items-center gap-1 line-clamp-2"
                        >
                          <span>{p.name}</span>
                          <ExternalLink className="h-3 w-3 shrink-0 text-zinc-400" />
                        </Link>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="inline-flex items-center rounded-md bg-zinc-100 px-1.5 py-0.2 text-[9.5px] font-semibold text-zinc-800">
                          {p.category}
                        </span>
                        <span className="text-[10px] text-zinc-400">&bull;</span>
                        <span className="text-[10px] text-zinc-600 font-medium">{p.brand}</span>
                        <span className="text-[10px] text-zinc-400">&bull;</span>
                        <span className="text-[10px] font-mono text-zinc-400">{p.sku}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-sm text-zinc-900 font-mono">₹{p.price.toLocaleString('en-IN')}</span>
                        {p.oldPrice && (
                          <span className="text-[10px] text-zinc-400 line-through font-mono">₹{p.oldPrice.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      <span className={`inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-semibold font-mono mt-0.5 ${Number(p.stock) < 10
                        ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        }`}>
                        {p.stock} in stock
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 transition shadow-2xs"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200/80 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700 transition shadow-2xs"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="py-10 text-center text-xs text-zinc-400 bg-white rounded-xl border border-zinc-200/80">
                  No matching products found for query "{productSearch}".
                </div>
              )}
            </div>

            {/* Desktop View: Rich Data Table */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[640px]">
                  <thead className="border-b border-zinc-200/80 bg-zinc-50/70 text-zinc-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Product Details</th>
                      <th className="py-3 px-4">Department & Brand</th>
                      <th className="py-3 px-4">SKU Code</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Inventory</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-zinc-50/60 transition group">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image || p.images?.[0]}
                              alt={p.name}
                              className="h-11 w-11 rounded-xl object-cover bg-zinc-50 border border-zinc-200/80 shrink-0 p-0.5"
                            />
                            <div>
                              <Link
                                to={`/product/${p.id}`}
                                className="font-bold text-zinc-900 hover:text-zinc-700 transition inline-flex items-center gap-1"
                              >
                                <span>{p.name}</span>
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition text-zinc-400" />
                              </Link>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-amber-600 font-semibold">★ {p.rating || 4.8}</span>
                                <span className="text-zinc-300">•</span>
                                <span className="text-[10px] text-zinc-400">{p.subcategory || 'Standard'}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-800">
                            {p.category}
                          </span>
                          <p className="text-[11px] text-zinc-500 font-medium mt-1">{p.brand}</p>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-zinc-700 text-xs">{p.sku}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-zinc-900 font-mono text-xs">₹{p.price.toLocaleString('en-IN')}</span>
                          {p.oldPrice && (
                            <span className="text-[10px] text-zinc-400 line-through block font-mono">₹{p.oldPrice.toLocaleString('en-IN')}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${Number(p.stock) < 10
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            }`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 transition shadow-2xs"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200/80 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700 transition shadow-2xs"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-xs text-zinc-400">
                          No matching products found for query "{productSearch}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Inventory Management */}
        {activeTab === 'inventory' && (
          <div className="space-y-4 sm:space-y-5">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-900">Inventory Stock Control</h3>
              <p className="text-[11px] sm:text-xs text-zinc-500">Quick adjust physical stock units and replenish catalog inventory on demand.</p>
            </div>

            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {supplierProducts.map(p => (
                <div key={p.id} className="rounded-xl sm:rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-5 shadow-2xs flex flex-col justify-between hover:border-zinc-300 transition">
                  <div>
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt=""
                        className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl object-cover bg-zinc-50 border border-zinc-200/80 p-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-zinc-900 truncate">{p.name}</h4>
                        <span className="text-[10px] text-zinc-400 font-mono block">{p.sku}</span>
                        <span className="text-[10px] text-zinc-500">{p.category} &bull; {p.brand}</span>
                      </div>
                    </div>

                    <div className="mt-3.5 sm:mt-4 flex items-center justify-between rounded-xl bg-zinc-50/80 p-2.5 sm:p-3 border border-zinc-100">
                      <span className="text-xs text-zinc-500 font-medium">Available Stock:</span>
                      <span className={`text-sm font-bold font-mono ${p.stock < 10 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {p.stock} Units
                      </span>
                    </div>
                  </div>

                  <div className="mt-3.5 sm:mt-4 flex gap-2">
                    <button
                      onClick={() => handleQuickStockAdjust(p, -1)}
                      className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50/80 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition active:scale-95"
                      title="Decrease by 1"
                    >
                      −1
                    </button>
                    <button
                      onClick={() => handleQuickStockAdjust(p, +5)}
                      className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50/80 py-2 text-xs font-bold text-zinc-800 hover:bg-zinc-100 transition active:scale-95"
                      title="Add 5 units"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => handleQuickStockAdjust(p, +20)}
                      className="flex-1 rounded-xl bg-zinc-900 py-2 text-xs font-bold text-white hover:bg-black transition shadow-2xs active:scale-95"
                      title="Add 20 units"
                    >
                      +20
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Order Fulfillment Responsibility */}
        {activeTab === 'orders' && (
          <div className="space-y-4 sm:space-y-5">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-900">Customer Order Fulfillment Queue</h3>
              <p className="text-[11px] sm:text-xs text-zinc-500">Advance order dispatch stages from Processing to Shipped & Delivered. Status updates sync with customer tracking.</p>
            </div>

            {/* Mobile View: Order Cards */}
            <div className="block md:hidden space-y-3">
              {supplierOrders.map(order => (
                <div key={order.id} className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-zinc-100 pb-2.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-zinc-900">{order.id}</span>
                        <span className="inline-flex items-center rounded-md bg-zinc-100 px-1.5 py-0.2 text-[9px] font-medium text-zinc-600">
                          {order.paymentMethod || 'Prepaid'}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-0.5">{order.date}</p>
                    </div>

                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-semibold tracking-wide ${order.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : order.status === 'Shipped'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                          : order.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                            : order.status === 'Refunded'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                              : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}>
                        {order.status}
                      </span>
                      <p className="text-xs font-bold font-mono text-zinc-900 mt-0.5">₹{order.total?.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="text-xs text-zinc-700 space-y-0.5">
                    <p className="font-bold text-zinc-900">{order.customer?.firstName} {order.customer?.lastName}</p>
                    <p className="text-[11px] text-zinc-500">{order.customer?.city}, {order.customer?.state} (Ph: {order.customer?.phone})</p>
                  </div>

                  {/* Line Items */}
                  <div className="bg-zinc-50/80 rounded-lg p-2.5 text-xs space-y-1 border border-zinc-100">
                    <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider block">Assigned Items:</span>
                    {order.items?.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-zinc-800 text-[11px]">
                        <span className="truncate pr-2">{it.name}</span>
                        <strong className="font-mono shrink-0">×{it.quantity}</strong>
                      </div>
                    ))}
                  </div>

                  {order.trackingNumber && (
                    <p className="text-[10px] font-mono text-zinc-500 bg-zinc-100/70 rounded-md px-2 py-1">
                      Courier: <strong>{order.courier || 'BlueDart'}</strong> &bull; AWB: <strong>{order.trackingNumber}</strong>
                    </p>
                  )}

                  <button
                    onClick={() => handleOpenStatusModal(order)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-black transition shadow-2xs"
                  >
                    <Truck className="h-3.5 w-3.5" />
                    <span>Update Logistics & Dispatch</span>
                  </button>
                </div>
              ))}

              {supplierOrders.length === 0 && (
                <div className="py-10 text-center text-xs text-zinc-400 bg-white rounded-xl border border-zinc-200/80">
                  No orders currently assigned to {activeSupplierName}.
                </div>
              )}
            </div>

            {/* Desktop View: Full Logistics Table */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="border-b border-zinc-200/80 bg-zinc-50/70 text-zinc-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4">Customer & Destination</th>
                      <th className="py-3 px-4">Assigned Line Items</th>
                      <th className="py-3 px-4">Order Total</th>
                      <th className="py-3 px-4">Fulfillment Status</th>
                      <th className="py-3 px-4 text-right">Dispatch Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {supplierOrders.map(order => (
                      <tr key={order.id} className="hover:bg-zinc-50/60 transition">
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-xs font-bold text-zinc-900">{order.id}</span>
                          <p className="text-[10px] text-zinc-400 mt-0.5">{order.date}</p>
                          <span className="inline-flex items-center rounded-md bg-zinc-100 px-1.5 py-0.2 text-[9px] font-medium text-zinc-600 mt-1">
                            {order.paymentMethod || 'Prepaid'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-bold text-zinc-900">{order.customer?.firstName} {order.customer?.lastName}</p>
                          <p className="text-[11px] text-zinc-500 truncate max-w-xs">{order.customer?.city}, {order.customer?.state}</p>
                          <p className="text-[10px] text-zinc-400 font-mono">Ph: {order.customer?.phone}</p>
                        </td>

                        <td className="py-3.5 px-4 space-y-1">
                          {order.items?.map((it, idx) => (
                            <div key={idx} className="text-xs text-zinc-700 flex items-center gap-1.5">
                              <span className="h-1 w-1 rounded-full bg-zinc-400"></span>
                              <span>{it.name}</span>
                              <strong className="text-zinc-900 font-mono">×{it.quantity}</strong>
                            </div>
                          ))}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-zinc-900 font-mono text-xs">₹{order.total?.toLocaleString('en-IN')}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : order.status === 'Shipped'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                              : order.status === 'Cancelled'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                                : order.status === 'Refunded'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                                  : order.status === 'Return Requested'
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            }`}>
                            {order.status}
                          </span>
                          {order.cancellation && (
                            <p className="text-[10px] text-rose-600 mt-1 font-medium truncate max-w-[150px]">
                              Cancel: {order.cancellation.reason}
                            </p>
                          )}
                          {order.returnRequest && (
                            <p className="text-[10px] text-purple-700 mt-1 font-medium truncate max-w-[150px]">
                              Return: {order.returnRequest.reason}
                            </p>
                          )}
                          {order.trackingNumber && (
                            <p className="text-[10px] font-mono text-zinc-400 mt-1">AWB: {order.trackingNumber}</p>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleOpenStatusModal(order)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black transition shadow-2xs"
                          >
                            <Truck className="h-3 w-3" />
                            <span>Update Logistics</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {supplierOrders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-xs text-zinc-400">
                          No orders currently assigned to {activeSupplierName}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Payouts & Earnings */}
        {activeTab === 'earnings' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="rounded-xl sm:rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-6 shadow-2xs space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-900">
                  Vendor Financial Settlement Breakdown
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">Automated revenue split and payout reconciliation</p>
              </div>

              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
                <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3.5 sm:p-4">
                  <span className="text-xs text-zinc-500 font-medium">Gross Sales Volume</span>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">From active & fulfilled orders</span>
                </div>
                <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3.5 sm:p-4">
                  <span className="text-xs text-zinc-500 font-medium">Platform Service Fee (5%)</span>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-rose-600 mt-1">−₹{Math.round(totalRevenue * 0.05).toLocaleString('en-IN')}</p>
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">Standard marketplace fee</span>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-100/70 p-3.5 sm:p-4">
                  <span className="text-xs text-zinc-700 font-bold">Net Payout to Vendor</span>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-zinc-950 mt-1">₹{netEarnings.toLocaleString('en-IN')}</p>
                  <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">Direct Bank Transfer (NEFT/RTGS)</span>
                </div>
              </div>

              <div className="rounded-xl bg-zinc-50 border border-zinc-200/70 p-3.5 sm:p-4 text-xs text-zinc-600 flex items-start gap-2.5 sm:gap-3">
                <Info className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-zinc-900">Settlement Cycle Schedule</p>
                  <p className="text-zinc-500 leading-relaxed">
                    Vendor earnings are calculated on all orders marked <strong>Delivered</strong> and disbursed every Tuesday to your registered bank account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 sm:p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-4 sm:p-7 shadow-xl max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5 mb-4 sm:mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Supplier Catalog</span>
                <h3 className="text-base sm:text-lg font-bold text-zinc-900">
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Store'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="h-8 w-8 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex items-center justify-center transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-3.5 sm:space-y-4">

              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1 block">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1 block">Brand *</label>
                  <select
                    value={form.brand}
                    onChange={e => setForm({ ...form, brand: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                  >
                    {brands.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1 block">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1 block">SKU Code</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={e => setForm({ ...form, sku: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs font-mono text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1 block">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs font-mono text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1 block">Original Price (₹)</label>
                  <input
                    type="number"
                    value={form.oldPrice}
                    onChange={e => setForm({ ...form, oldPrice: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs font-mono text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1 block">Initial Stock Units</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs font-mono text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1 block">Warranty Duration</label>
                  <input
                    type="text"
                    value={form.warranty}
                    onChange={e => setForm({ ...form, warranty: e.target.value })}
                    placeholder="e.g. 2 Years"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 mb-1 block">Image URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 mb-1 block">Product Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-2.5 pt-3.5 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-full sm:w-auto rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-xl bg-zinc-900 px-5 py-2 text-xs font-semibold text-white hover:bg-black transition shadow-xs text-center"
                >
                  {editingProduct ? 'Update Product' : 'Publish Product to Store'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Order Status Update Modal */}
      {statusModalOpen && selectedOrderToUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 sm:p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-xl space-y-4 sm:space-y-5">

            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Fulfillment & Logistics</span>
                <h3 className="text-base font-bold text-zinc-900 font-mono">{selectedOrderToUpdate.id}</h3>
              </div>
              <button
                onClick={() => setStatusModalOpen(false)}
                className="h-8 w-8 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex items-center justify-center transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">Courier Delivery Partner</label>
                <input
                  type="text"
                  value={courierInput}
                  onChange={e => setCourierInput(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">Tracking AWB Code</label>
                <input
                  type="text"
                  value={awbInput}
                  onChange={e => setAwbInput(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs font-mono text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Quick Status Advance Buttons */}
            <div className="space-y-2 pt-2.5 border-t border-zinc-100">
              <span className="text-[11px] text-zinc-500 block font-semibold">Advance Order Stage:</span>

              <button
                type="button"
                onClick={() => handleUpdateOrderStatusSubmit('Processing')}
                className="w-full flex items-center justify-between rounded-xl border border-amber-200/80 bg-amber-50/70 px-3.5 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition text-left"
              >
                <span>1. Processing & Packaging</span>
                <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleUpdateOrderStatusSubmit('Shipped')}
                className="w-full flex items-center justify-between rounded-xl border border-blue-200/80 bg-blue-50/70 px-3.5 py-2 text-xs font-semibold text-blue-900 hover:bg-blue-100 transition text-left"
              >
                <span>2. Shipped via Courier</span>
                <Truck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleUpdateOrderStatusSubmit('Out for Delivery')}
                className="w-full flex items-center justify-between rounded-xl border border-purple-200/80 bg-purple-50/70 px-3.5 py-2 text-xs font-semibold text-purple-900 hover:bg-purple-100 transition text-left"
              >
                <span>3. Out for Delivery</span>
                <ArrowRight className="h-3.5 w-3.5 text-purple-600 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleUpdateOrderStatusSubmit('Delivered')}
                className="w-full flex items-center justify-between rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-2xs text-left"
              >
                <span>4. Mark as Delivered</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0" />
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}