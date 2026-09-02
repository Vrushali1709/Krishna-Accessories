// src/pages/SupplierDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getProducts, saveProduct, deleteProduct, getCategories, getBrands } from '../utils/productStore';
import { getOrders, updateOrderStatus, getSuppliers } from '../utils/orderStore';

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
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900">
      <Navbar />

      {/* Supplier Top Header */}
      <section className="border-b border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-800 border border-gray-200">
                  Verified Vendor Portal
                </span>
                <span className="text-xs text-gray-500">Fulfillment & Inventory Console</span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 flex items-center gap-2">
                <span>🏢</span> {activeSupplierName}
              </h1>
            </div>

            {/* Supplier Switcher Dropdown */}
            <div className="flex items-center gap-2.5">
              <label className="text-xs text-gray-500 whitespace-nowrap font-bold">Active Vendor:</label>
              <select
                value={activeSupplierName}
                onChange={(e) => setActiveSupplierName(e.target.value)}
                className="rounded-xl border border-gray-200 bg-[#F4F4F6] px-3.5 py-2 text-xs font-bold text-gray-900 outline-none focus:border-gray-400 cursor-pointer"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* KPI Stat Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">

          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Active Catalog</span>
            <p className="mt-1.5 text-xl font-bold text-gray-950">{supplierProducts.length} Items</p>
            <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">Live in Customer Shop</span>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Stock Units</span>
            <p className="mt-1.5 text-xl font-bold text-gray-950">{totalStockUnits}</p>
            <span className="text-[10px] text-gray-500 mt-0.5 block">
              {lowStockItems.length > 0 ? (
                <strong className="text-amber-600 font-bold">⚠️ {lowStockItems.length} items low stock</strong>
              ) : 'Healthy inventory levels'}
            </span>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Pending Orders</span>
            <p className="mt-1.5 text-xl font-bold text-amber-600">{pendingOrdersCount}</p>
            <span className="text-[10px] text-gray-500 mt-0.5 block">Requires packing & dispatch</span>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Net Earnings (95%)</span>
            <p className="mt-1.5 text-xl font-bold text-gray-950">₹{netEarnings.toLocaleString('en-IN')}</p>
            <span className="text-[10px] text-gray-400 mt-0.5 block">Gross: ₹{totalRevenue.toLocaleString('en-IN')}</span>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 gap-2 mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Dashboard Overview' },
            { id: 'products', label: `📦 My Products (${supplierProducts.length})` },
            { id: 'inventory', label: '📋 Inventory & Stock' },
            { id: 'orders', label: `🚚 Order Fulfillment (${supplierOrders.length})` },
            { id: 'earnings', label: '💰 Payouts & Earnings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-xs sm:text-sm font-bold tracking-wide transition border-b-2 whitespace-nowrap px-2 ${activeTab === tab.id
                ? 'border-[#111827] text-gray-950'
                : 'border-transparent text-gray-500 hover:text-black'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* Urgent Fulfillment Banner */}
            {pendingOrdersCount > 0 && (
              <div className="flex items-center justify-between rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">
                      You have {pendingOrdersCount} customer orders waiting for dispatch!
                    </h4>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      Process packaging and update shipment status with courier tracking number.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="rounded-full bg-[#111827] px-4 py-2 text-xs font-bold text-white hover:bg-black"
                >
                  View Orders &rarr;
                </button>
              </div>
            )}

            {/* Quick Actions & Recent Orders Preview */}
            <div className="grid gap-6 lg:grid-cols-2">

              {/* Recent Orders Card */}
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-xs font-bold text-gray-950 uppercase tracking-wider">
                    Recent Customer Orders
                  </h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-gray-700 font-bold hover:underline">
                    View All
                  </button>
                </div>

                <div className="divide-y divide-gray-100 space-y-3">
                  {supplierOrders.slice(0, 3).map(order => (
                    <div key={order.id} className="pt-3 first:pt-0 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs font-bold text-gray-950">{order.id}</span>
                        <p className="text-xs text-gray-800 font-semibold mt-0.5">{order.customer?.firstName} {order.customer?.lastName}</p>
                        <p className="text-[10px] text-gray-400">{order.date} &bull; {order.items?.length} products</p>
                      </div>

                      <div className="text-right">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                          {order.status}
                        </span>
                        <p className="text-xs font-bold text-gray-950 mt-0.5">₹{order.total?.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Alerts Card */}
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-xs font-bold text-gray-950 uppercase tracking-wider">
                    Inventory Stock Health
                  </h3>
                  <button onClick={() => setActiveTab('inventory')} className="text-xs text-gray-700 font-bold hover:underline">
                    Manage Stock
                  </button>
                </div>

                {lowStockItems.length > 0 ? (
                  <div className="divide-y divide-gray-100 space-y-3">
                    {lowStockItems.map(item => (
                      <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="h-10 w-10 rounded-xl object-contain bg-[#F4F4F6] border border-gray-200 p-1" />
                          <div>
                            <p className="text-xs font-bold text-gray-900 truncate max-w-[180px]">{item.name}</p>
                            <span className="text-[10px] font-mono text-gray-400">{item.sku}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-red-50 text-red-700 px-2.5 py-0.5 text-[10px] font-bold">
                            {item.stock} left
                          </span>
                          <button
                            onClick={() => handleQuickStockAdjust(item, 10)}
                            className="rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 text-[10px] font-bold px-3 py-1 transition"
                          >
                            +10 Restock
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-emerald-700 font-bold">
                    ✓ All products have optimal inventory levels!
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: My Products Catalog */}
        {activeTab === 'products' && (
          <div className="space-y-5">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-gray-950">Product Catalog ({supplierProducts.length})</h3>
                <p className="text-xs text-gray-500">Products assigned to {activeSupplierName} displayed across Krishna Accessories.</p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddModal}
                className="rounded-full bg-[#111827] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-black"
              >
                + Add New Product
              </button>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-200 bg-[#F8F9FA] text-gray-600 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Product Details</th>
                    <th className="p-4">Category / Brand</th>
                    <th className="p-4">SKU Code</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {supplierProducts.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image || p.images?.[0]} alt={p.name} className="h-11 w-11 rounded-xl object-contain bg-[#F4F4F6] border border-gray-200 shrink-0 p-1" />
                          <div>
                            <Link to={`/product/${p.id}`} className="font-bold text-gray-950 hover:text-black transition">
                              {p.name}
                            </Link>
                            <p className="text-[10px] text-amber-500 font-bold mt-0.5">★ {p.rating || 4.8}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-800 font-semibold">{p.category}</span>
                        <p className="text-[10px] text-gray-400 font-bold">{p.brand}</p>
                      </td>
                      <td className="p-4 font-mono text-gray-800">{p.sku}</td>
                      <td className="p-4">
                        <span className="font-bold text-gray-950">₹{p.price.toLocaleString('en-IN')}</span>
                        {p.oldPrice && (
                          <span className="text-[10px] text-gray-400 line-through block">₹{p.oldPrice.toLocaleString('en-IN')}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`font-bold ${p.stock < 10 ? 'text-red-600' : 'text-emerald-700'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="rounded-full border border-gray-200 bg-[#F4F4F6] px-3 py-1 text-xs font-bold text-gray-800 hover:bg-gray-200 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 3: Inventory Management */}
        {activeTab === 'inventory' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-gray-950">Inventory Stock Control</h3>
              <p className="text-xs text-gray-500">Maintain physical stock counts and batch replenish inventory.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {supplierProducts.map(p => (
                <div key={p.id} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="h-11 w-11 rounded-xl object-contain bg-[#F4F4F6] border border-gray-200 p-1" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-gray-950 truncate">{p.name}</h4>
                        <span className="text-[10px] text-gray-400 font-mono">{p.sku}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#F8F9FA] p-3 border border-gray-100">
                      <span className="text-xs text-gray-500 font-semibold">Current Stock:</span>
                      <span className={`text-sm font-bold ${p.stock < 10 ? 'text-red-600' : 'text-emerald-700'}`}>
                        {p.stock} Units
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleQuickStockAdjust(p, -1)}
                      className="flex-1 rounded-full border border-gray-200 bg-[#F4F4F6] py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200"
                    >
                      −1
                    </button>
                    <button
                      onClick={() => handleQuickStockAdjust(p, +5)}
                      className="flex-1 rounded-full border border-gray-200 bg-gray-100 py-1.5 text-xs font-bold text-gray-900 hover:bg-gray-200"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => handleQuickStockAdjust(p, +20)}
                      className="flex-1 rounded-full bg-[#111827] py-1.5 text-xs font-bold text-white hover:bg-black shadow-sm"
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
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-gray-950">Customer Order Fulfillment</h3>
              <p className="text-xs text-gray-500">Advance order stages from Processing to Shipped & Delivered. Updates sync live with Customer Order Tracking!</p>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-200 bg-[#F8F9FA] text-gray-600 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Order ID & Date</th>
                    <th className="p-4">Customer & Address</th>
                    <th className="p-4">Items / Qty</th>
                    <th className="p-4">Order Value</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4 text-right">Fulfillment Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {supplierOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <span className="font-mono text-xs font-bold text-gray-950">{order.id}</span>
                        <p className="text-[10px] text-gray-400 mt-0.5">{order.date}</p>
                        <p className="text-[10px] text-gray-500">{order.paymentMethod}</p>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-gray-950">{order.customer?.firstName} {order.customer?.lastName}</p>
                        <p className="text-[10px] text-gray-500 truncate max-w-xs">{order.customer?.city}, {order.customer?.state}</p>
                        <p className="text-[10px] text-gray-400">Phone: {order.customer?.phone}</p>
                      </td>

                      <td className="p-4">
                        {order.items?.map((it, idx) => (
                          <div key={idx} className="text-xs text-gray-700">
                            &bull; {it.name} <strong className="text-gray-950">×{it.quantity}</strong>
                          </div>
                        ))}
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-gray-950">₹{order.total?.toLocaleString('en-IN')}</span>
                      </td>

                      <td className="p-4">
                        <span className={`inline-block rounded-full px-3 py-0.5 text-[10px] font-bold ${order.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700'
                          : order.status === 'Shipped'
                            ? 'bg-blue-50 text-blue-700'
                            : order.status === 'Cancelled'
                              ? 'bg-rose-50 text-rose-700'
                              : order.status === 'Refunded'
                                ? 'bg-emerald-100 text-emerald-900 font-bold'
                                : order.status === 'Return Requested'
                                  ? 'bg-purple-50 text-purple-800'
                                  : 'bg-amber-50 text-amber-700'
                          }`}>
                          {order.status}
                        </span>
                        {order.cancellation && (
                          <p className="text-[9.5px] text-rose-600 mt-1 font-semibold truncate max-w-[140px]">
                            {order.cancellation.reason}
                          </p>
                        )}
                        {order.returnRequest && (
                          <p className="text-[9.5px] text-purple-700 mt-1 font-semibold truncate max-w-[140px]">
                            Return: {order.returnRequest.reason}
                          </p>
                        )}
                        {order.trackingNumber && (
                          <p className="text-[9px] font-mono text-gray-400 mt-1">AWB: {order.trackingNumber}</p>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleOpenStatusModal(order)}
                          className="rounded-full bg-[#111827] px-4 py-1.5 text-xs font-bold text-white hover:bg-black transition shadow-sm"
                        >
                          Update Status ⚙️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Payouts & Earnings */}
        {activeTab === 'earnings' && (
          <div className="space-y-5">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-5">
                Vendor Financial Settlement Breakdown
              </h3>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-[#F8F9FA] p-4">
                  <span className="text-xs text-gray-500 font-semibold">Gross Sales Value</span>
                  <p className="text-xl font-bold text-gray-950 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-[#F8F9FA] p-4">
                  <span className="text-xs text-gray-500 font-semibold">Platform Commission (5%)</span>
                  <p className="text-xl font-bold text-red-600 mt-1">−₹{Math.round(totalRevenue * 0.05).toLocaleString('en-IN')}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gray-100 p-4">
                  <span className="text-xs text-gray-700 font-bold">Net Payout to Supplier</span>
                  <p className="text-xl font-bold text-gray-950 mt-1">₹{netEarnings.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-gray-50 border border-gray-100 p-4 text-xs text-gray-600">
                💡 Payouts are automatically settled every Tuesday to your registered bank account for all orders marked <strong>Delivered</strong>.
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
              <h3 className="text-lg font-bold text-gray-950">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Store'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-black font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-4">

              <div className="grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Brand *</label>
                  <select
                    value={form.brand}
                    onChange={e => setForm({ ...form, brand: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2 text-xs text-gray-900 outline-none focus:border-gray-400"
                  >
                    {brands.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2 text-xs text-gray-900 outline-none focus:border-gray-400"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">SKU Code</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={e => setForm({ ...form, sku: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2 text-xs font-mono text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Original Price (₹)</label>
                  <input
                    type="number"
                    value={form.oldPrice}
                    onChange={e => setForm({ ...form, oldPrice: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Initial Stock Units</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Warranty</label>
                  <input
                    type="text"
                    value={form.warranty}
                    onChange={e => setForm({ ...form, warranty: e.target.value })}
                    placeholder="e.g. 2 Years"
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Image URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Product Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full border border-gray-200 bg-[#F4F4F6] px-5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#111827] px-6 py-2 text-xs font-bold text-white hover:bg-black shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl space-y-4">

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-gray-400">Order Status Updater</span>
                <h3 className="text-base font-bold text-gray-950 font-mono">{selectedOrderToUpdate.id}</h3>
              </div>
              <button onClick={() => setStatusModalOpen(false)} className="text-gray-400 hover:text-black font-bold">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Courier Partner</label>
                <input
                  type="text"
                  value={courierInput}
                  onChange={e => setCourierInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Tracking AWB Number</label>
                <input
                  type="text"
                  value={awbInput}
                  onChange={e => setAwbInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2 text-xs font-mono text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                />
              </div>
            </div>

            {/* Quick Status Advance Buttons */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500 block font-bold">Advance Status to:</span>

              <button
                type="button"
                onClick={() => handleUpdateOrderStatusSubmit('Processing')}
                className="w-full rounded-full border border-amber-200 bg-amber-50 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition"
              >
                1. Mark as Processing & Packing
              </button>

              <button
                type="button"
                onClick={() => handleUpdateOrderStatusSubmit('Shipped')}
                className="w-full rounded-full border border-blue-200 bg-blue-50 py-2.5 text-xs font-bold text-blue-800 hover:bg-blue-100 transition"
              >
                2. Mark as Shipped via Courier
              </button>

              <button
                type="button"
                onClick={() => handleUpdateOrderStatusSubmit('Out for Delivery')}
                className="w-full rounded-full border border-purple-200 bg-purple-50 py-2.5 text-xs font-bold text-purple-800 hover:bg-purple-100 transition"
              >
                3. Mark as Out for Delivery
              </button>

              <button
                type="button"
                onClick={() => handleUpdateOrderStatusSubmit('Delivered')}
                className="w-full rounded-full bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm"
              >
                4. Mark as Delivered ✓
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}