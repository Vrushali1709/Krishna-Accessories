// src/pages/SupplierDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSupplierUser, logoutSupplier } from '../utils/auth';
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
  ChevronDown,
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
  LogOut,
  Image as ImageIcon,
  Menu,
  Store,
  Check,
  ShoppingBag,
  Eye,
  SlidersHorizontal,
  CreditCard,
  Calendar,
  MapPin,
  Phone,
  Copy,
  DollarSign,
  Send
} from 'lucide-react';
import ProductImagePicker, { ProductImagePreview } from '../components/ProductImagePicker';

export default function SupplierDashboard() {
  const navigate = useNavigate();
  const [supplierUser, setSupplierUser] = useState(() => getSupplierUser());
  const suppliers = getSuppliers();
  const [activeSupplierName, setActiveSupplierName] = useState(suppliers[0]?.name || 'Apex Timepieces Ltd.');
  const [activeTab, setActiveTab] = useState('overview');

  // App shell states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Store data
  const [allProducts, setAllProducts] = useState(() => getProducts());
  const [allOrders, setAllOrders] = useState(() => getOrders());

  // Filter & Search states
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productStockFilter, setProductStockFilter] = useState('All');
  const [productViewMode, setProductViewMode] = useState('table'); // 'table' | 'grid'

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrderToUpdate, setSelectedOrderToUpdate] = useState(null);
  const [courierInput, setCourierInput] = useState('BlueDart Express');
  const [awbInput, setAwbInput] = useState('');

  // Delete confirmation modal state
  const [productToDelete, setProductToDelete] = useState(null);

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
    image2: '',
    image3: '',
    image4: '',
    angle1: 'Front View',
    angle2: 'Side Profile',
    angle3: 'Back View',
    angle4: 'Detail View',
    description: '',
    material: '',
    warranty: '2 Years'
  });

  const categories = getCategories();
  const brands = getBrands();

  // Show Toast Alert helper
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Reload data on events
  const refreshData = () => {
    setIsRefreshing(true);
    setAllProducts(getProducts());
    setAllOrders(getOrders());
    setSupplierUser(getSupplierUser());
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Supplier data synchronized in real-time');
    }, 400);
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('productsUpdated', refreshData);
    window.addEventListener('ordersUpdated', refreshData);
    window.addEventListener('authUpdated', refreshData);
    return () => {
      window.removeEventListener('productsUpdated', refreshData);
      window.removeEventListener('ordersUpdated', refreshData);
      window.removeEventListener('authUpdated', refreshData);
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

  // Filtered products
  const filteredProducts = useMemo(() => {
    return supplierProducts.filter(p => {
      const q = productSearch.toLowerCase();
      const matchesSearch = !productSearch.trim() ||
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q);

      const matchesCategory = productCategoryFilter === 'All' || p.category === productCategoryFilter;

      let matchesStock = true;
      const stockNum = Number(p.stock || 0);
      if (productStockFilter === 'In Stock') matchesStock = stockNum >= 10;
      else if (productStockFilter === 'Low Stock') matchesStock = stockNum > 0 && stockNum < 10;
      else if (productStockFilter === 'Out of Stock') matchesStock = stockNum === 0;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [supplierProducts, productSearch, productCategoryFilter, productStockFilter]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return supplierOrders.filter(o => {
      const q = orderSearch.toLowerCase();
      const matchesSearch = !orderSearch.trim() ||
        o.id?.toLowerCase().includes(q) ||
        `${o.customer?.firstName} ${o.customer?.lastName}`.toLowerCase().includes(q) ||
        o.customer?.phone?.includes(q) ||
        o.trackingNumber?.toLowerCase().includes(q) ||
        o.courier?.toLowerCase().includes(q);

      const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [supplierOrders, orderSearch, orderStatusFilter]);

  // Calculate Metrics
  const totalStockUnits = supplierProducts.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const totalStockValue = supplierProducts.reduce((sum, p) => sum + (Number(p.price || 0) * Number(p.stock || 0)), 0);
  const pendingOrders = supplierOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled' && o.status !== 'Refunded');
  const pendingOrdersCount = pendingOrders.length;
  const deliveredOrdersCount = supplierOrders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = supplierOrders
    .filter(o => o.status !== 'Cancelled' && o.status !== 'Refunded')
    .reduce((sum, o) => sum + Number(o.total || 0), 0);
  const netEarnings = Math.round(totalRevenue * 0.95); // 5% platform fee
  const platformFee = Math.round(totalRevenue * 0.05);

  // Low stock products (< 10 units)
  const lowStockItems = supplierProducts.filter(p => Number(p.stock || 0) < 10 && Number(p.stock || 0) > 0);
  const outOfStockItems = supplierProducts.filter(p => Number(p.stock || 0) === 0);

  // Active supplier details
  const activeSupplierData = suppliers.find(s => s.name.toLowerCase() === activeSupplierName.toLowerCase()) || {
    name: activeSupplierName,
    category: 'Luxury Accessories',
    rating: 4.9,
    status: 'Active'
  };

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
      image2: '',
      image3: '',
      image4: '',
      angle1: 'Front View',
      angle2: 'Side Profile',
      angle3: 'Back View',
      angle4: 'Detail View',
      description: '',
      material: 'Stainless Steel',
      warranty: '2 Years'
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    const imgList = Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image || ''];
    const angles = Array.isArray(product.imageAngles) && product.imageAngles.length === 4
      ? product.imageAngles
      : ['Front View', 'Side Profile', 'Back View', 'Detail View'];

    setForm({
      name: product.name || '',
      brand: product.brand || brands[0],
      category: product.category || categories[0],
      subcategory: product.subcategory || '',
      sku: product.sku || '',
      price: product.price || '',
      oldPrice: product.oldPrice || '',
      stock: product.stock || 0,
      image: imgList[0] || product.image || '',
      image2: imgList[1] || '',
      image3: imgList[2] || '',
      image4: imgList[3] || '',
      angle1: angles[0] || 'Front View',
      angle2: angles[1] || 'Side Profile',
      angle3: angles[2] || 'Back View',
      angle4: angles[3] || 'Detail View',
      description: product.description || '',
      material: product.specifications?.Material || '',
      warranty: product.specifications?.Warranty || '2 Years'
    });
    setModalOpen(true);
  };

  const handleSaveProductSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      showToast('Please fill all required fields (Name, Price)', 'error');
      return;
    }

    const price = Number(form.price);
    const oldPrice = Number(form.oldPrice) || Math.round(price * 1.25);
    const discount = Math.round(((oldPrice - price) / oldPrice) * 100);

    const img1 = (form.image || '').trim();
    const img2 = (form.image2 || '').trim();
    const img3 = (form.image3 || '').trim();
    const img4 = (form.image4 || '').trim();

    const rawImages = [img1, img2, img3, img4].filter(Boolean);
    const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700';
    const finalImages = rawImages.length > 0 ? rawImages : [fallbackImage];
    const mainImage = finalImages[0];

    const finalAngles = [
      form.angle1?.trim() || 'Front View',
      form.angle2?.trim() || 'Side Profile',
      form.angle3?.trim() || 'Back View',
      form.angle4?.trim() || 'Detail View'
    ].slice(0, Math.max(4, finalImages.length));

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
      image: mainImage,
      images: finalImages,
      imageAngles: finalAngles,
      description: form.description || 'Luxury product provided by verified supplier.',
      specifications: {
        Material: form.material || 'Premium',
        Warranty: form.warranty || '2 Years'
      }
    };

    saveProduct(productPayload);
    setModalOpen(false);
    showToast(editingProduct ? `Product "${productPayload.name}" updated successfully!` : `New product "${productPayload.name}" published to store catalog!`);
  };

  const handleDeleteProduct = (id) => {
    deleteProduct(id);
    setProductToDelete(null);
    showToast('Product removed from catalog');
  };

  const handleQuickStockAdjust = (product, delta) => {
    const newStock = Math.max(0, Number(product.stock || 0) + delta);
    saveProduct({ ...product, stock: newStock });
    showToast(`Stock updated for ${product.name}: ${newStock} units`);
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
    showToast(`Order ${selectedOrderToUpdate.id} marked as "${newStatus}"!`);
    setSelectedOrderToUpdate(null);
  };

  const handleSupplierLogout = () => {
    logoutSupplier();
    navigate('/login', {
      state: {
        message: 'You have been successfully signed out from the Supplier Portal.',
        requiredRole: 'supplier'
      },
      replace: true
    });
  };

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} urgent` : null, badgeColor: 'bg-amber-500' },
    { id: 'products', label: 'Products Catalog', icon: Package, badge: supplierProducts.length, badgeColor: 'bg-zinc-700' },
    { id: 'inventory', label: 'Stock Control', icon: Boxes, badge: lowStockItems.length > 0 ? `${lowStockItems.length} low` : null, badgeColor: 'bg-rose-500' },
    { id: 'orders', label: 'Order Fulfillment', icon: Truck, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null, badgeColor: 'bg-amber-500' },
    { id: 'earnings', label: 'Payouts & Settlement', icon: Wallet, badge: '95% Net', badgeColor: 'bg-emerald-600' }
  ];

  return (
    <div className="min-h-screen bg-[#0F1117] text-zinc-100 flex flex-col antialiased selection:bg-amber-500/30 selection:text-amber-200">

      {/* Floating Interactive Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border ${
            toastMessage.type === 'error'
              ? 'bg-rose-950/90 border-rose-700/60 text-rose-200'
              : 'bg-zinc-900/95 border-amber-500/40 text-zinc-100'
          } backdrop-blur-md`}>
            {toastMessage.type === 'error' ? (
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
            )}
            <span className="text-xs font-semibold">{toastMessage.message}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-zinc-400 hover:text-zinc-200 ml-2"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Vendor Portal Shell Layout */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 bg-[#141721] border-r border-zinc-800/80 flex flex-col transition-all duration-300 lg:static ${
            sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'
          } ${mobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}`}
        >
          {/* Portal Brand Header */}
          <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-zinc-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/10 shrink-0">
                <Store className="h-5 w-5" />
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase block">
                    Vendor Portal
                  </span>
                  <h2 className="text-sm font-bold text-white tracking-tight truncate">
                    Krishna Accessories
                  </h2>
                </div>
              )}
            </div>
            {mobileMenuOpen && (
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden h-8 w-8 rounded-lg bg-zinc-800/60 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Active Supplier Switcher & Profile Card */}
          <div className="p-3 border-b border-zinc-800/60">
            {!sidebarCollapsed ? (
              <div className="bg-[#191D2B] border border-zinc-800/90 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-[10px] font-bold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Verified Vendor
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">★ {activeSupplierData.rating || '4.9'}</span>
                </div>

                <div className="min-w-0">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block mb-1">
                    Active Catalog Vendor
                  </label>
                  <div className="relative">
                    <select
                      value={activeSupplierName}
                      onChange={(e) => {
                        setActiveSupplierName(e.target.value);
                        showToast(`Switched vendor context to "${e.target.value}"`);
                      }}
                      className="w-full appearance-none rounded-xl border border-zinc-700/80 bg-zinc-900/90 hover:bg-zinc-900 px-3 py-2 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/60 transition cursor-pointer pr-8"
                    >
                      {suppliers.map(s => (
                        <option key={s.id} value={s.name} className="bg-zinc-900 text-white">
                          {s.name} ({s.category})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center" title={activeSupplierName}>
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs">
                  {activeSupplierName.substring(0, 2).toUpperCase()}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
            {!sidebarCollapsed && (
              <span className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                Merchant Operations
              </span>
            )}
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 border border-amber-500/30 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                  } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                  title={tab.label}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                    {!sidebarCollapsed && <span>{tab.label}</span>}
                  </div>
                  {!sidebarCollapsed && tab.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono text-white ${tab.badgeColor || 'bg-zinc-800'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {!sidebarCollapsed && (
              <div className="pt-4 mt-4 border-t border-zinc-800/60">
                <span className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                  Quick Access
                </span>
                <Link
                  to="/shop"
                  target="_blank"
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-amber-300 hover:bg-zinc-800/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-4 w-4 text-zinc-500" />
                    <span>Live Customer Store</span>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
                </Link>
                <Link
                  to="/"
                  target="_blank"
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-amber-300 hover:bg-zinc-800/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-4 w-4 text-zinc-500" />
                    <span>Storefront Home</span>
                  </div>
                </Link>
              </div>
            )}
          </nav>

          {/* Supplier User Profile & Sign Out Footer */}
          <div className="p-3 border-t border-zinc-800/80 bg-[#10131B]">
            {!sidebarCollapsed ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">
                      {supplierUser?.name ? supplierUser.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {supplierUser?.name || 'Vendor Admin'}
                      </p>
                      <p className="text-[10px] text-zinc-400 truncate">
                        {supplierUser?.email || 'vendor@krishna.com'}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSupplierLogout}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-800/60 bg-rose-950/40 hover:bg-rose-900/60 px-3 py-2 text-xs font-semibold text-rose-300 transition cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out of Portal</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSupplierLogout}
                className="w-full flex items-center justify-center p-2 rounded-xl text-rose-400 hover:bg-rose-950/50 transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </aside>

        {/* Backdrop for mobile menu */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0C0E14] overflow-y-auto">

          {/* Top Portal Navigation Bar */}
          <header className="sticky top-0 z-20 bg-[#12151F]/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden h-9 w-9 rounded-xl bg-zinc-800/80 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <Menu className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex h-9 w-9 rounded-xl bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-800 items-center justify-center transition cursor-pointer"
                title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                <Menu className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-500 font-medium">Portal</span>
                <span className="text-zinc-600">/</span>
                <span className="font-bold text-white capitalize">{activeTab}</span>
                <span className="hidden sm:inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] font-medium text-zinc-400 border border-zinc-700/60">
                  <Building2 className="h-3 w-3 text-amber-400" />
                  {activeSupplierName}
                </span>
              </div>
            </div>

            {/* Top Bar Quick Action Controls */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Refresh / Sync Button */}
              <button
                onClick={refreshData}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition disabled:opacity-50 cursor-pointer"
                title="Synchronize Catalog and Orders"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">Sync Data</span>
              </button>

              {/* Quick Add Product CTA */}
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold px-3.5 py-2 text-xs transition shadow-lg shadow-amber-500/10 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Add Product</span>
              </button>
            </div>
          </header>

          {/* Main Dashboard View Content */}
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">

            {/* Top KPI Metrics Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {/* Stat 1: Active Catalog */}
              <div className="rounded-2xl border border-zinc-800/90 bg-gradient-to-br from-[#151926] to-[#12141F] p-4 sm:p-5 shadow-sm hover:border-zinc-700 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Active Catalog</span>
                  <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                    <Package className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                  {supplierProducts.length}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  Live in Storefront
                </div>
              </div>

              {/* Stat 2: Total Stock Units */}
              <div className="rounded-2xl border border-zinc-800/90 bg-gradient-to-br from-[#151926] to-[#12141F] p-4 sm:p-5 shadow-sm hover:border-zinc-700 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Stock</span>
                  <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                    <Boxes className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                  {totalStockUnits.toLocaleString()}
                </p>
                <div className="mt-2 text-[11px]">
                  {lowStockItems.length > 0 ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
                      <AlertTriangle className="h-3 w-3" />
                      {lowStockItems.length} low stock alerts
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-semibold text-zinc-400">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      Optimal depth
                    </span>
                  )}
                </div>
              </div>

              {/* Stat 3: Pending Orders */}
              <div className="rounded-2xl border border-zinc-800/90 bg-gradient-to-br from-[#151926] to-[#12141F] p-4 sm:p-5 shadow-sm hover:border-zinc-700 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Pending Dispatch</span>
                  <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                    <Truck className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl sm:text-3xl font-bold font-mono text-amber-400 tracking-tight">
                  {pendingOrdersCount}
                </p>
                <span className="mt-2 text-[11px] text-zinc-400 font-medium block truncate">
                  {pendingOrdersCount === 0 ? 'All orders dispatched' : 'Requires courier packaging'}
                </span>
              </div>

              {/* Stat 4: Net Earnings */}
              <div className="rounded-2xl border border-zinc-800/90 bg-gradient-to-br from-[#151926] to-[#12141F] p-4 sm:p-5 shadow-sm hover:border-zinc-700 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Net Payout (95%)</span>
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <Wallet className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tracking-tight">
                  ₹{netEarnings.toLocaleString('en-IN')}
                </p>
                <span className="mt-2 text-[11px] text-zinc-400 block">
                  Gross: ₹{totalRevenue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">

                {/* Urgent Fulfillment Banner */}
                {pendingOrdersCount > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-[#1F1912] to-[#16141A] p-5 shadow-lg">
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-amber-200">
                          {pendingOrdersCount} customer {pendingOrdersCount === 1 ? 'order requires' : 'orders require'} urgent fulfillment
                        </h4>
                        <p className="text-xs text-amber-300/80 mt-0.5">
                          Package products and attach logistics AWB tracking number to notify customers in real-time.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2.5 text-xs transition shadow-md shrink-0 cursor-pointer"
                    >
                      <span>Open Dispatch Queue</span>
                      <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                )}

                {/* Dual Overview Cards Grid */}
                <div className="grid gap-6 lg:grid-cols-2">

                  {/* Recent Orders Queue Card */}
                  <div className="rounded-2xl border border-zinc-800/80 bg-[#141722] p-5 sm:p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
                      <div>
                        <h3 className="text-sm font-bold text-white">Recent Customer Orders</h3>
                        <p className="text-xs text-zinc-400">Transactions assigned to your inventory catalog</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                      >
                        <span>View all ({supplierOrders.length})</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="divide-y divide-zinc-800/80">
                      {supplierOrders.slice(0, 4).map(order => (
                        <div key={order.id} className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between hover:bg-zinc-800/30 rounded-xl px-2 -mx-2 transition">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-white">{order.id}</span>
                              <span className="text-zinc-600">•</span>
                              <span className="text-xs text-zinc-400">{order.date}</span>
                            </div>
                            <p className="text-xs font-semibold text-zinc-200">
                              {order.customer?.firstName} {order.customer?.lastName}
                            </p>
                            <p className="text-[11px] text-zinc-400">
                              {order.items?.length || 0} items &bull; {order.paymentMethod || 'Prepaid'}
                            </p>
                          </div>

                          <div className="text-right space-y-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                              order.status === 'Delivered' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60' :
                              order.status === 'Shipped' ? 'bg-blue-950/80 text-blue-400 border border-blue-700/60' :
                              order.status === 'Out for Delivery' ? 'bg-purple-950/80 text-purple-400 border border-purple-700/60' :
                              'bg-amber-950/80 text-amber-400 border border-amber-700/60'
                            }`}>
                              {order.status}
                            </span>
                            <p className="text-xs font-bold font-mono text-white">₹{Number(order.total || 0).toLocaleString('en-IN')}</p>
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

                  {/* Low Stock Alerts & Fast Restock Card */}
                  <div className="rounded-2xl border border-zinc-800/80 bg-[#141722] p-5 sm:p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
                      <div>
                        <h3 className="text-sm font-bold text-white">Stock Depletion Alerts</h3>
                        <p className="text-xs text-zinc-400">Items requiring fast inventory replenishment</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('inventory')}
                        className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                      >
                        <span>Inventory control</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {lowStockItems.length > 0 || outOfStockItems.length > 0 ? (
                      <div className="divide-y divide-zinc-800/80">
                        {[...outOfStockItems, ...lowStockItems].slice(0, 4).map(item => (
                          <div key={item.id} className="py-3 first:pt-1 last:pb-1 flex items-center justify-between hover:bg-zinc-800/30 rounded-xl px-2 -mx-2 transition">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-10 w-10 rounded-xl object-cover bg-zinc-900 border border-zinc-800 p-0.5 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-white truncate max-w-[170px]">{item.name}</p>
                                <span className="text-[10px] font-mono text-zinc-400">{item.sku}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold font-mono ${
                                Number(item.stock) === 0
                                  ? 'bg-rose-950/80 text-rose-400 border border-rose-700/60'
                                  : 'bg-amber-950/80 text-amber-400 border border-amber-700/60'
                              }`}>
                                {item.stock} left
                              </span>
                              <button
                                onClick={() => handleQuickStockAdjust(item, 10)}
                                className="rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-semibold px-2.5 py-1 transition cursor-pointer"
                              >
                                +10 Stock
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center space-y-2">
                        <div className="h-10 w-10 rounded-2xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-800/50">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-bold text-zinc-200">All products have healthy inventory levels</p>
                        <p className="text-[11px] text-zinc-400">No stock depletion warnings active for this supplier catalog.</p>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: PRODUCTS CATALOG */}
            {activeTab === 'products' && (
              <div className="space-y-5">

                {/* Filter & Search Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141722] p-4 rounded-2xl border border-zinc-800/80">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Search input */}
                    <div className="relative min-w-[220px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Search SKU, name, category..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="pl-8 pr-8 py-2 text-xs rounded-xl border border-zinc-700/80 bg-zinc-900/90 placeholder:text-zinc-500 text-white outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 w-full transition"
                      />
                      {productSearch && (
                        <button onClick={() => setProductSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {/* Category Filter */}
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className="rounded-xl border border-zinc-700/80 bg-zinc-900/90 px-3 py-2 text-xs font-semibold text-zinc-200 outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="All">All Categories</option>
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>

                    {/* Stock status filter */}
                    <select
                      value={productStockFilter}
                      onChange={(e) => setProductStockFilter(e.target.value)}
                      className="rounded-xl border border-zinc-700/80 bg-zinc-900/90 px-3 py-2 text-xs font-semibold text-zinc-200 outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="All">All Stock Levels</option>
                      <option value="In Stock">In Stock (10+)</option>
                      <option value="Low Stock">Low Stock (&lt; 10)</option>
                      <option value="Out of Stock">Out of Stock (0)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    <button
                      type="button"
                      onClick={handleOpenAddModal}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2 text-xs transition shadow-md cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Add New Product</span>
                    </button>
                  </div>
                </div>

                {/* Products Table View */}
                <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#141722] shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-zinc-800 bg-[#11131C] text-zinc-400 uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Product Details</th>
                          <th className="py-3 px-4">Department & Brand</th>
                          <th className="py-3 px-4">SKU Code</th>
                          <th className="py-3 px-4">Price (₹)</th>
                          <th className="py-3 px-4">Inventory</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/80">
                        {filteredProducts.map(p => (
                          <tr key={p.id} className="hover:bg-zinc-800/40 transition group">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <img
                                    src={p.image || p.images?.[0]}
                                    alt={p.name}
                                    className="h-12 w-12 rounded-xl object-cover bg-zinc-900 border border-zinc-800 shrink-0 p-0.5"
                                  />
                                  {Array.isArray(p.images) && p.images.length > 1 && (
                                    <span className="absolute -bottom-1 -right-1 bg-zinc-900 border border-zinc-700 text-[9px] font-bold text-amber-400 px-1 rounded-md">
                                      {p.images.length}V
                                    </span>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <Link
                                    to={`/product/${p.id}`}
                                    target="_blank"
                                    className="font-bold text-white hover:text-amber-400 transition inline-flex items-center gap-1 max-w-xs truncate"
                                  >
                                    <span>{p.name}</span>
                                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition text-zinc-400" />
                                  </Link>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-amber-400 font-semibold">★ {p.rating || 4.8}</span>
                                    <span className="text-zinc-600">•</span>
                                    <span className="text-[10px] text-zinc-400">{p.subcategory || 'Standard'}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center rounded-md bg-zinc-800 border border-zinc-700/80 px-2 py-0.5 text-[10px] font-semibold text-zinc-200">
                                {p.category}
                              </span>
                              <p className="text-[11px] text-zinc-400 font-medium mt-1">{p.brand}</p>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-zinc-300 text-xs">{p.sku}</td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-white font-mono text-xs">₹{Number(p.price || 0).toLocaleString('en-IN')}</span>
                              {p.oldPrice && (
                                <span className="text-[10px] text-zinc-500 line-through block font-mono">₹{Number(p.oldPrice || 0).toLocaleString('en-IN')}</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                                Number(p.stock) === 0
                                  ? 'bg-rose-950/80 text-rose-400 border border-rose-700/60'
                                  : Number(p.stock) < 10
                                  ? 'bg-amber-950/80 text-amber-400 border border-amber-700/60'
                                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60'
                              }`}>
                                {p.stock} units
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-1.5">
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 text-xs font-semibold text-zinc-200 transition cursor-pointer"
                              >
                                <Edit3 className="h-3 w-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => setProductToDelete(p)}
                                className="inline-flex items-center gap-1 rounded-lg border border-rose-800/80 bg-rose-950/50 hover:bg-rose-900/60 px-2.5 py-1 text-xs font-semibold text-rose-300 transition cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-xs text-zinc-400">
                              No matching products found in catalog for current search or filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: INVENTORY STOCK CONTROL */}
            {activeTab === 'inventory' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141722] p-4 rounded-2xl border border-zinc-800/80">
                  <div>
                    <h3 className="text-sm font-bold text-white">Stock Control & Replenishment Center</h3>
                    <p className="text-xs text-zinc-400">Adjust physical units in real-time. Stock delta syncs immediately with storefront checkout.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-400">Total Inventory Value:</span>
                    <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                      ₹{totalStockValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {supplierProducts.map(p => (
                    <div key={p.id} className="rounded-2xl border border-zinc-800/80 bg-[#141722] p-5 shadow-sm flex flex-col justify-between hover:border-zinc-700 transition">
                      <div>
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt=""
                            className="h-12 w-12 rounded-xl object-cover bg-zinc-900 border border-zinc-800 p-0.5 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                            <span className="text-[10px] text-zinc-400 font-mono block">{p.sku}</span>
                            <span className="text-[10px] text-zinc-400">{p.category} &bull; {p.brand}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between rounded-xl bg-zinc-900/80 p-3 border border-zinc-800">
                          <span className="text-xs text-zinc-400 font-medium">Available Units:</span>
                          <span className={`text-sm font-bold font-mono ${
                            Number(p.stock) === 0 ? 'text-rose-400' :
                            Number(p.stock) < 10 ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {p.stock} Units
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-1.5">
                        <button
                          onClick={() => handleQuickStockAdjust(p, -1)}
                          className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800/80 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition cursor-pointer"
                          title="Decrease by 1"
                        >
                          −1
                        </button>
                        <button
                          onClick={() => handleQuickStockAdjust(p, +5)}
                          className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800/80 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700 transition cursor-pointer"
                          title="Add 5 units"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => handleQuickStockAdjust(p, +20)}
                          className="flex-1 rounded-xl bg-amber-500 py-1.5 text-xs font-bold text-zinc-950 hover:bg-amber-400 transition shadow-sm cursor-pointer"
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

            {/* TAB 4: ORDER FULFILLMENT QUEUE */}
            {activeTab === 'orders' && (
              <div className="space-y-5">
                {/* Search & Filter bar for orders */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141722] p-4 rounded-2xl border border-zinc-800/80">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[220px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Search Order ID, Customer, Courier..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="pl-8 pr-8 py-2 text-xs rounded-xl border border-zinc-700/80 bg-zinc-900/90 placeholder:text-zinc-500 text-white outline-none focus:border-amber-500 w-full transition"
                      />
                      {orderSearch && (
                        <button onClick={() => setOrderSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      {['All', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(st => (
                        <button
                          key={st}
                          onClick={() => setOrderStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                            orderStatusFilter === st
                              ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                              : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#141722] shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-zinc-800 bg-[#11131C] text-zinc-400 uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Order ID & Date</th>
                          <th className="py-3 px-4">Customer & Destination</th>
                          <th className="py-3 px-4">Assigned Line Items</th>
                          <th className="py-3 px-4">Order Total</th>
                          <th className="py-3 px-4">Fulfillment Status</th>
                          <th className="py-3 px-4 text-right">Dispatch Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/80">
                        {filteredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-zinc-800/40 transition">
                            <td className="py-3.5 px-4">
                              <span className="font-mono text-xs font-bold text-white">{order.id}</span>
                              <p className="text-[10px] text-zinc-400 mt-0.5">{order.date}</p>
                              <span className="inline-flex items-center rounded-md bg-zinc-800 border border-zinc-700 px-1.5 py-0.2 text-[9px] font-medium text-zinc-300 mt-1">
                                {order.paymentMethod || 'Prepaid'}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <p className="font-bold text-white">{order.customer?.firstName} {order.customer?.lastName}</p>
                              <p className="text-[11px] text-zinc-400 truncate max-w-xs">{order.customer?.city}, {order.customer?.state}</p>
                              <p className="text-[10px] text-zinc-400 font-mono">Ph: {order.customer?.phone}</p>
                            </td>

                            <td className="py-3.5 px-4 space-y-1">
                              {order.items?.map((it, idx) => (
                                <div key={idx} className="text-xs text-zinc-300 flex items-center gap-1.5">
                                  <span className="h-1 w-1 rounded-full bg-amber-400"></span>
                                  <span>{it.name}</span>
                                  <strong className="text-white font-mono">×{it.quantity}</strong>
                                </div>
                              ))}
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="font-bold text-white font-mono text-xs">₹{Number(order.total || 0).toLocaleString('en-IN')}</span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                                order.status === 'Delivered' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60' :
                                order.status === 'Shipped' ? 'bg-blue-950/80 text-blue-400 border border-blue-700/60' :
                                order.status === 'Out for Delivery' ? 'bg-purple-950/80 text-purple-400 border border-purple-700/60' :
                                order.status === 'Cancelled' ? 'bg-rose-950/80 text-rose-400 border border-rose-700/60' :
                                'bg-amber-950/80 text-amber-400 border border-amber-700/60'
                              }`}>
                                {order.status}
                              </span>
                              {order.trackingNumber && (
                                <p className="text-[10px] font-mono text-zinc-400 mt-1">
                                  {order.courier ? `${order.courier}: ` : ''}{order.trackingNumber}
                                </p>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleOpenStatusModal(order)}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-3.5 py-1.5 text-xs transition shadow-sm cursor-pointer"
                              >
                                <Truck className="h-3.5 w-3.5 stroke-[2.5]" />
                                <span>Update Logistics</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-xs text-zinc-400">
                              No orders match the selected criteria for {activeSupplierName}.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: PAYOUTS & SETTLEMENT */}
            {activeTab === 'earnings' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-zinc-800/80 bg-[#141722] p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      Vendor Financial Settlement Breakdown
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Automated revenue split and payout reconciliation for {activeSupplierName}</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                      <span className="text-xs text-zinc-400 font-medium">Gross Merchandise Sales</span>
                      <p className="text-2xl font-bold font-mono text-white mt-1.5">₹{totalRevenue.toLocaleString('en-IN')}</p>
                      <span className="text-[10px] text-zinc-500 mt-1 block">From active & delivered customer orders</span>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                      <span className="text-xs text-zinc-400 font-medium">Marketplace Service Fee (5%)</span>
                      <p className="text-2xl font-bold font-mono text-rose-400 mt-1.5">−₹{platformFee.toLocaleString('en-IN')}</p>
                      <span className="text-[10px] text-zinc-500 mt-1 block">Platform listing & payment processing</span>
                    </div>
                    <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-4">
                      <span className="text-xs text-emerald-300 font-bold">Net Payout to Vendor (95%)</span>
                      <p className="text-2xl font-bold font-mono text-emerald-400 mt-1.5">₹{netEarnings.toLocaleString('en-IN')}</p>
                      <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">Direct Bank Transfer (NEFT/RTGS)</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-4 text-xs text-zinc-300 flex items-start gap-3">
                    <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold text-white">Settlement Cycle & Direct Payout</p>
                      <p className="text-zinc-400">
                        Vendor earnings are calculated on all orders marked <strong>Delivered</strong> and disbursed every Tuesday to your verified bank account via automated IMPS/NEFT transfer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl border border-zinc-700 bg-[#161926] p-6 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto text-zinc-100">

            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Supplier Catalog Console</span>
                <h3 className="text-lg font-bold text-white">
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Storefront'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="h-8 w-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-4">

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900/90 px-3.5 py-2 text-xs text-white outline-none focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">Brand *</label>
                  <select
                    value={form.brand}
                    onChange={e => setForm({ ...form, brand: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900/90 px-3.5 py-2 text-xs text-white outline-none focus:border-amber-500 transition cursor-pointer"
                  >
                    {brands.map(b => (
                      <option key={b} value={b} className="bg-zinc-900 text-white">{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900/90 px-3.5 py-2 text-xs text-white outline-none focus:border-amber-500 transition cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c} value={c} className="bg-zinc-900 text-white">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">SKU Code</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={e => setForm({ ...form, sku: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900/90 px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900/90 px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">Original Price (₹)</label>
                  <input
                    type="number"
                    value={form.oldPrice}
                    onChange={e => setForm({ ...form, oldPrice: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900/90 px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">Initial Stock Units</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900/90 px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">Warranty Duration</label>
                  <input
                    type="text"
                    value={form.warranty}
                    onChange={e => setForm({ ...form, warranty: e.target.value })}
                    placeholder="e.g. 2 Years"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900/90 px-3.5 py-2 text-xs text-white outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              {/* Multi-Angle Product Gallery (4 Perspectives) */}
              <div className="rounded-xl border border-zinc-700/80 bg-zinc-900/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-white block text-xs">
                      Product Multi-Angle Gallery (4 Perspectives)
                    </label>
                    <p className="text-[11px] text-zinc-400">
                      Upload 4 angles (Front, Side, Back, Detail) for the 360-view customer showcase.
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold bg-zinc-800 text-amber-400 border border-zinc-700 px-2 py-0.5 rounded-full">
                    4 Views
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Angle 1: Front View */}
                  <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-zinc-950 text-[9px] font-bold">1</span>
                        Primary / Front View *
                      </span>
                      <input
                        type="text"
                        value={form.angle1}
                        onChange={e => setForm({ ...form, angle1: e.target.value })}
                        placeholder="Front View"
                        className="w-24 text-[10.5px] px-1.5 py-0.5 border border-zinc-700 bg-zinc-800 rounded text-right text-zinc-300 focus:outline-none focus:border-amber-500"
                        title="Perspective label"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-14 w-14 rounded-md border border-zinc-700 bg-zinc-950 shrink-0 overflow-hidden flex items-center justify-center">
                        <ProductImagePreview value={form.image} alt="Angle 1" />
                      </div>
                      <ProductImagePicker
                        value={form.image}
                        onChange={image => setForm({ ...form, image })}
                        required
                        alt="Angle 1"
                      />
                    </div>
                  </div>

                  {/* Angle 2: Side Profile */}
                  <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-700 text-white text-[9px] font-bold">2</span>
                        Side Profile
                      </span>
                      <input
                        type="text"
                        value={form.angle2}
                        onChange={e => setForm({ ...form, angle2: e.target.value })}
                        placeholder="Side Profile"
                        className="w-24 text-[10.5px] px-1.5 py-0.5 border border-zinc-700 bg-zinc-800 rounded text-right text-zinc-300 focus:outline-none focus:border-amber-500"
                        title="Perspective label"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-14 w-14 rounded-md border border-zinc-700 bg-zinc-950 shrink-0 overflow-hidden flex items-center justify-center">
                        <ProductImagePreview value={form.image2} alt="Angle 2" />
                      </div>
                      <ProductImagePicker
                        value={form.image2}
                        onChange={image2 => setForm({ ...form, image2 })}
                        alt="Angle 2"
                      />
                    </div>
                  </div>

                  {/* Angle 3: Back View */}
                  <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-700 text-white text-[9px] font-bold">3</span>
                        Back / Case View
                      </span>
                      <input
                        type="text"
                        value={form.angle3}
                        onChange={e => setForm({ ...form, angle3: e.target.value })}
                        placeholder="Back View"
                        className="w-24 text-[10.5px] px-1.5 py-0.5 border border-zinc-700 bg-zinc-800 rounded text-right text-zinc-300 focus:outline-none focus:border-amber-500"
                        title="Perspective label"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-14 w-14 rounded-md border border-zinc-700 bg-zinc-950 shrink-0 overflow-hidden flex items-center justify-center">
                        <ProductImagePreview value={form.image3} alt="Angle 3" />
                      </div>
                      <ProductImagePicker
                        value={form.image3}
                        onChange={image3 => setForm({ ...form, image3 })}
                        alt="Angle 3"
                      />
                    </div>
                  </div>

                  {/* Angle 4: Detail View */}
                  <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-700 text-white text-[9px] font-bold">4</span>
                        Detail / In-Use View
                      </span>
                      <input
                        type="text"
                        value={form.angle4}
                        onChange={e => setForm({ ...form, angle4: e.target.value })}
                        placeholder="Detail View"
                        className="w-24 text-[10.5px] px-1.5 py-0.5 border border-zinc-700 bg-zinc-800 rounded text-right text-zinc-300 focus:outline-none focus:border-amber-500"
                        title="Perspective label"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-14 w-14 rounded-md border border-zinc-700 bg-zinc-950 shrink-0 overflow-hidden flex items-center justify-center">
                        <ProductImagePreview value={form.image4} alt="Angle 4" />
                      </div>
                      <ProductImagePicker
                        value={form.image4}
                        onChange={image4 => setForm({ ...form, image4 })}
                        alt="Angle 4"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">Product Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900/90 px-3.5 py-2 text-xs text-white outline-none focus:border-amber-500 transition"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-2 text-xs font-bold text-zinc-950 transition shadow-md cursor-pointer"
                >
                  {editingProduct ? 'Update Product' : 'Publish Product to Store'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER LOGISTICS & STATUS UPDATE */}
      {statusModalOpen && selectedOrderToUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-[#161926] p-6 shadow-2xl space-y-5 text-zinc-100">

            <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">Logistics Dispatch Center</span>
                <h3 className="text-base font-bold text-white font-mono">{selectedOrderToUpdate.id}</h3>
              </div>
              <button
                onClick={() => setStatusModalOpen(false)}
                className="h-8 w-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Courier Delivery Partner</label>
                <input
                  type="text"
                  value={courierInput}
                  onChange={e => setCourierInput(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900/90 px-3.5 py-2 text-xs text-white outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Tracking AWB Code</label>
                  <button
                    type="button"
                    onClick={() => setAwbInput(`BD${Math.floor(10000000 + Math.random() * 90000000)}IN`)}
                    className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                  >
                    Generate Auto AWB
                  </button>
                </div>
                <input
                  type="text"
                  value={awbInput}
                  onChange={e => setAwbInput(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900/90 px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            {/* Quick Status Advance Buttons */}
            <div className="space-y-2 pt-3 border-t border-zinc-800">
              <span className="text-[11px] text-zinc-400 block font-semibold">Advance Order Stage:</span>

              <button
                type="button"
                onClick={() => handleUpdateOrderStatusSubmit('Processing')}
                className="w-full flex items-center justify-between rounded-xl border border-amber-500/40 bg-amber-950/40 px-4 py-2.5 text-xs font-semibold text-amber-200 hover:bg-amber-900/60 transition cursor-pointer"
              >
                <span>1. Mark as Processing & Packaging</span>
                <Clock className="h-3.5 w-3.5 text-amber-400" />
              </button>

              <button
                type="button"
                onClick={() => handleUpdateOrderStatusSubmit('Shipped')}
                className="w-full flex items-center justify-between rounded-xl border border-blue-500/40 bg-blue-950/40 px-4 py-2.5 text-xs font-semibold text-blue-200 hover:bg-blue-900/60 transition cursor-pointer"
              >
                <span>2. Mark as Shipped via Courier</span>
                <Truck className="h-3.5 w-3.5 text-blue-400" />
              </button>

              <button
                type="button"
                onClick={() => handleUpdateOrderStatusSubmit('Out for Delivery')}
                className="w-full flex items-center justify-between rounded-xl border border-purple-500/40 bg-purple-950/40 px-4 py-2.5 text-xs font-semibold text-purple-200 hover:bg-purple-900/60 transition cursor-pointer"
              >
                <span>3. Mark as Out for Delivery</span>
                <ArrowRight className="h-3.5 w-3.5 text-purple-400" />
              </button>

              <button
                type="button"
                onClick={() => handleUpdateOrderStatusSubmit('Delivered')}
                className="w-full flex items-center justify-between rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white transition shadow-md cursor-pointer"
              >
                <span>4. Mark as Delivered</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: DELETE PRODUCT CONFIRMATION */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-700 bg-[#161926] p-6 shadow-2xl space-y-4 text-zinc-100">
            <div className="h-10 w-10 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="h-5 w-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Delete Product</h3>
              <p className="text-xs text-zinc-400">
                Are you sure you want to remove <span className="font-semibold text-white">"{productToDelete.name}"</span> from your catalog?
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(productToDelete.id)}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 py-2 text-xs font-bold text-white transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}