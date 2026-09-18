// src/pages/SupplierDashboard.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSupplierUser, logoutSupplier } from '../utils/auth';
import { getProducts, saveProduct, deleteProduct, getCategories, getBrands } from '../utils/productStore';
import { getOrders, updateOrderStatus, getSuppliers } from '../utils/orderStore';
import {
  LayoutDashboard,
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
  Send,
  Zap,
  Tag,
  Folder,
  ArrowUp,
  RotateCcw,
  FileText,
  User,
  Users,
  Bell,
  CheckCheck
} from 'lucide-react';
import ProductImagePicker, { ProductImagePreview } from '../components/ProductImagePicker';

export default function SupplierDashboard() {
  const navigate = useNavigate();
  const [supplierUser, setSupplierUser] = useState(() => getSupplierUser());
  const suppliers = getSuppliers();
  const [activeSupplierName, setActiveSupplierName] = useState(suppliers[0]?.name || 'Apex Timepieces Ltd.');

  // Navigation Hierarchical State (matching Admin structure)
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({
    dashboard: true,
    catalog: true,
    fulfillment: true,
    inventory: true,
    financials: true
  });

  // Shell Layout States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Notifications State & Ref
  const [notifsOpen, setNotifsOpen] = useState(false);
  const notifsRef = useRef(null);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'New Order Received',
      message: 'Order #KA-8942 with 2 items assigned to your warehouse for dispatch.',
      time: '12m ago',
      type: 'order',
      unread: true,
      targetSection: 'fulfillment',
      targetSubTab: 'orders'
    },
    {
      id: 'notif-2',
      title: 'Low Stock Alert',
      message: 'Titan Octane Chronograph is down to 3 units. Restock recommended.',
      time: '1h ago',
      type: 'inventory',
      unread: true,
      targetSection: 'catalog',
      targetSubTab: 'low-stock'
    },
    {
      id: 'notif-3',
      title: 'Payout Dispatched',
      message: 'Bi-weekly vendor settlement of ₹58,400 successfully credited to HDFC Bank.',
      time: 'Yesterday',
      type: 'financial',
      unread: false,
      targetSection: 'financials',
      targetSubTab: 'payouts'
    },
    {
      id: 'notif-4',
      title: 'Compliance Verified',
      message: 'Supplier vendor license & GST compliance renewal verified for 2026.',
      time: '2d ago',
      type: 'system',
      unread: false,
      targetSection: 'financials',
      targetSubTab: 'bank-info'
    }
  ]);

  // Scroll Container Ref
  const supplierContentScrollRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Core Data Stores
  const [allProducts, setAllProducts] = useState(() => getProducts());
  const [allOrders, setAllOrders] = useState(() => getOrders());

  // Search & Filter States
  const [globalSearch, setGlobalSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productBrandFilter, setProductBrandFilter] = useState('All');
  const [productStockFilter, setProductStockFilter] = useState('All');

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Modals State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrderToUpdate, setSelectedOrderToUpdate] = useState(null);
  const [courierInput, setCourierInput] = useState('BlueDart Express');
  const [awbInput, setAwbInput] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    brand: 'Titan',
    category: 'Watches',
    subcategory: '',
    sku: '',
    price: '',
    oldPrice: '',
    stock: '20',
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

  // Scroll handling
  const handleSupplierScroll = (e) => {
    if (e.currentTarget.scrollTop > 200) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  const scrollToTop = () => {
    if (supplierContentScrollRef.current) {
      supplierContentScrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Reset scroll when switching tabs
  useEffect(() => {
    if (supplierContentScrollRef.current) {
      supplierContentScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeSection, activeSubTab]);

  // Toast Notification
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Close notifications popover on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target)) {
        setNotifsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Notifications Helpers
  const unreadNotifsCount = notifications.filter(n => n.unread).length;

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast('All notifications marked as read');
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const deleteNotification = (e, id) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification removed');
  };

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.targetSection) {
      setActiveSection(notif.targetSection);
      if (notif.targetSubTab) {
        setActiveSubTab(notif.targetSubTab);
      }
      setNotifsOpen(false);
    }
  };

  // Data Refresh
  const refreshData = () => {
    setIsRefreshing(true);
    setAllProducts(getProducts());
    setAllOrders(getOrders());
    setSupplierUser(getSupplierUser());
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Supplier catalog & fulfillment data synchronized');
    }, 350);
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

  // Filter products for active supplier
  const supplierProducts = useMemo(() => {
    return allProducts.filter(p => !p.supplier || p.supplier.toLowerCase() === activeSupplierName.toLowerCase());
  }, [allProducts, activeSupplierName]);

  // Filter orders containing items for active supplier
  const supplierOrders = useMemo(() => {
    return allOrders.filter(o =>
      o.items && o.items.some(item => !item.supplier || item.supplier.toLowerCase() === activeSupplierName.toLowerCase())
    );
  }, [allOrders, activeSupplierName]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return supplierProducts.filter(p => {
      const q = (productSearch || globalSearch).toLowerCase().trim();
      const matchesSearch = !q ||
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q);

      const matchesCat = productCategoryFilter === 'All' || p.category === productCategoryFilter;
      const matchesBrand = productBrandFilter === 'All' || p.brand === productBrandFilter;

      let matchesStock = true;
      const stockNum = Number(p.stock || 0);
      if (productStockFilter === 'In Stock') matchesStock = stockNum >= 10;
      else if (productStockFilter === 'Low Stock') matchesStock = stockNum > 0 && stockNum < 10;
      else if (productStockFilter === 'Out of Stock') matchesStock = stockNum === 0;

      return matchesSearch && matchesCat && matchesBrand && matchesStock;
    });
  }, [supplierProducts, productSearch, globalSearch, productCategoryFilter, productBrandFilter, productStockFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return supplierOrders.filter(o => {
      const q = (orderSearch || globalSearch).toLowerCase().trim();
      const customerName = `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`.toLowerCase();
      const matchesSearch = !q ||
        o.id?.toString().toLowerCase().includes(q) ||
        customerName.includes(q) ||
        o.customer?.phone?.includes(q) ||
        o.trackingNumber?.toLowerCase().includes(q) ||
        o.courier?.toLowerCase().includes(q) ||
        o.items?.some(it => it.name?.toLowerCase().includes(q));

      let matchesStatus = true;
      if (orderStatusFilter === 'All') matchesStatus = true;
      else if (orderStatusFilter === 'Processing') matchesStatus = o.status === 'Processing' || o.status === 'Placed' || o.status === 'Pending';
      else if (orderStatusFilter === 'Shipped') matchesStatus = o.status === 'Shipped' || o.status === 'Out for Delivery';
      else if (orderStatusFilter === 'Delivered') matchesStatus = o.status === 'Delivered';
      else if (orderStatusFilter === 'Cancelled') matchesStatus = o.status === 'Cancelled' || o.status === 'Refunded' || o.status === 'Return Requested';
      else matchesStatus = o.status === orderStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [supplierOrders, orderSearch, globalSearch, orderStatusFilter]);

  // Metric Computations
  const totalStockUnits = supplierProducts.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const totalStockValue = supplierProducts.reduce((sum, p) => sum + (Number(p.price || 0) * Number(p.stock || 0)), 0);
  const pendingOrders = supplierOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled' && o.status !== 'Refunded');
  const pendingOrdersCount = pendingOrders.length;
  const deliveredOrdersCount = supplierOrders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = supplierOrders
    .filter(o => o.status !== 'Cancelled' && o.status !== 'Refunded')
    .reduce((sum, o) => sum + Number(o.total || 0), 0);
  const netEarnings = Math.round(totalRevenue * 0.95);
  const platformFee = Math.round(totalRevenue * 0.05);

  const lowStockItems = supplierProducts.filter(p => Number(p.stock || 0) < 10 && Number(p.stock || 0) > 0);
  const outOfStockItems = supplierProducts.filter(p => Number(p.stock || 0) === 0);

  const activeSupplierData = suppliers.find(s => s.name.toLowerCase() === activeSupplierName.toLowerCase()) || {
    name: activeSupplierName,
    category: 'Luxury Accessories',
    rating: 4.9,
    status: 'Active'
  };

  // Navigation Structure (Exact hierarchy style of Admin)
  const navSections = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : null,
      subItems: [
        { id: 'overview', label: 'Overview' },
        { id: 'pending', label: 'Pending Dispatch', badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : null },
        { id: 'insights', label: 'Performance & Revenue' }
      ]
    },
    {
      id: 'catalog',
      title: 'Catalog',
      icon: Package,
      badge: supplierProducts.length,
      subItems: [
        { id: 'products', label: 'My Products' },
        { id: 'add-product', label: 'Add New Product' },
        { id: 'low-stock', label: 'Low Stock Alerts', badge: lowStockItems.length > 0 ? `${lowStockItems.length}` : null }
      ]
    },
    {
      id: 'fulfillment',
      title: 'Fulfillment',
      icon: Truck,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : null,
      subItems: [
        { id: 'orders', label: 'All Orders' },
        { id: 'processing', label: 'Packaging Queue', badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : null },
        { id: 'shipped', label: 'In-Transit Logistics' },
        { id: 'delivered', label: 'Delivered History' }
      ]
    },
    {
      id: 'inventory',
      title: 'Inventory',
      icon: Boxes,
      badge: lowStockItems.length + outOfStockItems.length > 0 ? `${lowStockItems.length + outOfStockItems.length}` : null,
      subItems: [
        { id: 'stock-control', label: 'Stock Control' },
        { id: 'replenishment', label: 'Fast Restock' }
      ]
    },
    {
      id: 'financials',
      title: 'Financials',
      icon: Wallet,
      badge: '95%',
      subItems: [
        { id: 'payouts', label: 'Payouts & Earnings' },
        { id: 'settlement', label: 'Settlement Ledger' },
        { id: 'bank-info', label: 'Verified Bank Account' }
      ]
    }
  ];

  const toggleSectionExpand = (secId) => {
    setExpandedSections(prev => ({
      ...prev,
      [secId]: !prev[secId]
    }));
  };

  const handleNavSelect = (sectionId, subItemId) => {
    if (subItemId === 'add-product') {
      handleOpenAddProduct();
      return;
    }
    setActiveSection(sectionId);
    setActiveSubTab(subItemId);
    setMobileSidebarOpen(false);
  };

  // Add / Edit Product Modals
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
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
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (p) => {
    setEditingProduct(p);
    const imgList = Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image || ''];
    const angles = Array.isArray(p.imageAngles) && p.imageAngles.length === 4
      ? p.imageAngles
      : ['Front View', 'Side Profile', 'Back View', 'Detail View'];

    setProductForm({
      name: p.name || '',
      brand: p.brand || brands[0],
      category: p.category || categories[0],
      subcategory: p.subcategory || '',
      sku: p.sku || '',
      price: p.price || '',
      oldPrice: p.oldPrice || '',
      stock: p.stock || 0,
      image: imgList[0] || p.image || '',
      image2: imgList[1] || '',
      image3: imgList[2] || '',
      image4: imgList[3] || '',
      angle1: angles[0] || 'Front View',
      angle2: angles[1] || 'Side Profile',
      angle3: angles[2] || 'Back View',
      angle4: angles[3] || 'Detail View',
      description: p.description || '',
      material: p.specifications?.Material || '',
      warranty: p.specifications?.Warranty || '2 Years'
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    const price = Number(productForm.price);
    const oldPrice = Number(productForm.oldPrice) || Math.round(price * 1.25);
    const discount = Math.round(((oldPrice - price) / oldPrice) * 100);

    const img1 = (productForm.image || '').trim();
    const img2 = (productForm.image2 || '').trim();
    const img3 = (productForm.image3 || '').trim();
    const img4 = (productForm.image4 || '').trim();

    const rawImages = [img1, img2, img3, img4].filter(Boolean);
    const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700';
    const finalImages = rawImages.length > 0 ? rawImages : [fallbackImage];
    const mainImage = finalImages[0];

    const finalAngles = [
      productForm.angle1?.trim() || 'Front View',
      productForm.angle2?.trim() || 'Side Profile',
      productForm.angle3?.trim() || 'Back View',
      productForm.angle4?.trim() || 'Detail View'
    ].slice(0, Math.max(4, finalImages.length));

    const payload = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: productForm.name.trim(),
      brand: productForm.brand,
      category: productForm.category,
      subcategory: productForm.subcategory || 'General',
      sku: productForm.sku.trim() || `KA-SKU-${Date.now().toString().slice(-4)}`,
      price,
      oldPrice,
      discount,
      stock: Number(productForm.stock) || 0,
      rating: editingProduct?.rating || 4.8,
      supplier: activeSupplierName,
      image: mainImage,
      images: finalImages,
      imageAngles: finalAngles,
      description: productForm.description || 'Verified luxury product provided by supplier.',
      specifications: {
        Material: productForm.material || 'Premium',
        Warranty: productForm.warranty || '2 Years'
      }
    };

    saveProduct(payload);
    setProductModalOpen(false);
    showToast(editingProduct ? 'Product updated successfully' : 'New product published to catalog');
  };

  const handleDeleteProduct = (id) => {
    deleteProduct(id);
    setProductToDelete(null);
    showToast('Product removed from catalog');
  };

  const handleStockAdjust = (product, delta) => {
    const newStock = Math.max(0, Number(product.stock || 0) + delta);
    saveProduct({ ...product, stock: newStock });
    showToast(`Stock updated: ${product.name} (${newStock} units)`);
  };

  // Logistics Update Modal
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
    showToast(`Order #${selectedOrderToUpdate.id} updated to "${newStatus}"`);
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

  // Find Current Active Section and Sub Item for Breadcrumbs
  const currentSectionObj = navSections.find(s => s.id === activeSection) || navSections[0];
  const currentSubItemObj = currentSectionObj.subItems.find(sub => sub.id === activeSubTab) || currentSectionObj.subItems[0];

  return (
    <div className="h-screen max-h-screen w-full bg-[#F9F9F8] text-zinc-900 flex overflow-hidden font-sans selection:bg-zinc-900 selection:text-white">

      {/* ==========================================
          TOAST ALERT NOTIFICATION
      ========================================== */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-xl bg-zinc-900 text-white border border-zinc-800 px-4 py-2.5 text-xs font-medium shadow-xl flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-zinc-400 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ==========================================
          1. DEDICATED ADMIN-STYLE SIDEBAR
      ========================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between bg-[#121316] text-zinc-300 border-r border-zinc-800/80 transition-all duration-300 ease-in-out lg:static lg:h-screen lg:max-h-screen shrink-0 ${mobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
          } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Sidebar Brand Header */}
        <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
          <div className={`flex h-16 items-center ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'} border-b border-zinc-800/80 shrink-0`}>
            <div className="flex items-center gap-3 overflow-hidden min-w-0">
              <img
                src="/images/krishna-logo.png"
                alt="Krishna Accessories Logo"
                className="h-8 w-8 shrink-0 rounded-lg object-contain bg-white p-0.5 border border-zinc-700/60 shadow-xs cursor-pointer"
                onClick={() => sidebarCollapsed && setSidebarCollapsed(false)}
                title={sidebarCollapsed ? "Expand sidebar" : undefined}
              />
              {!sidebarCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-zinc-100 tracking-tight text-xs truncate">
                    Krishna Accessories
                  </span>
                  <span className="text-[9.5px] font-medium tracking-widest text-zinc-400 uppercase truncate">
                    Supplier Portal
                  </span>
                </div>
              )}
            </div>

            {/* Toggle Icon inside Sidebar Header */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700 text-xs transition cursor-pointer shrink-0"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-zinc-400 hover:text-white p-1 text-sm shrink-0 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Active Vendor Switcher Pill in Sidebar */}
          {!sidebarCollapsed && (
            <div className="px-3 pt-3 pb-1 shrink-0">
              <div className="bg-[#18191E] border border-zinc-800/90 rounded-xl p-2.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-[9.5px] font-bold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Verified Vendor
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">★ {activeSupplierData.rating || '4.9'}</span>
                </div>

                <div className="relative">
                  <select
                    value={activeSupplierName}
                    onChange={(e) => {
                      setActiveSupplierName(e.target.value);
                      showToast(`Switched vendor context to "${e.target.value}"`);
                    }}
                    className="w-full appearance-none rounded-lg border border-zinc-700/80 bg-zinc-900 px-2.5 py-1.5 text-[11px] font-semibold text-white outline-none focus:border-zinc-500 cursor-pointer pr-6"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.name} className="bg-zinc-900 text-white">
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Accordion Sections */}
          <nav className="flex-1 overflow-y-auto min-h-0 p-3 space-y-1 text-xs">
            {navSections.map((sec) => {
              const isSectionActive = activeSection === sec.id;
              const isExpanded = expandedSections[sec.id];
              const IconComp = sec.icon;

              return (
                <div key={sec.id} className="space-y-0.5">
                  {/* Parent Section Button */}
                  <button
                    onClick={() => {
                      if (sidebarCollapsed) {
                        setSidebarCollapsed(false);
                        toggleSectionExpand(sec.id);
                        handleNavSelect(sec.id, sec.subItems[0].id);
                      } else {
                        toggleSectionExpand(sec.id);
                        if (!isSectionActive) {
                          handleNavSelect(sec.id, sec.subItems[0].id);
                        }
                      }
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 font-medium transition-colors cursor-pointer ${isSectionActive
                        ? 'bg-zinc-800/90 text-white font-semibold'
                        : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComp className={`h-4 w-4 shrink-0 ${isSectionActive ? 'text-zinc-100' : 'text-zinc-400'}`} />
                      {!sidebarCollapsed && (
                        <span className="truncate text-left">{sec.title}</span>
                      )}
                    </div>

                    {!sidebarCollapsed && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {sec.badge && (
                          <span className="rounded-full bg-zinc-800 px-1.5 py-0.2 text-[9.5px] font-semibold text-zinc-300">
                            {sec.badge}
                          </span>
                        )}
                        <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    )}
                  </button>

                  {/* Sub-items list */}
                  {!sidebarCollapsed && isExpanded && (
                    <div className="ml-4 pl-3 border-l border-zinc-800/80 space-y-0.5 pt-0.5 pb-1">
                      {sec.subItems.map((sub) => {
                        const isSubActive = isSectionActive && activeSubTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleNavSelect(sec.id, sub.id)}
                            className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-[11.5px] transition cursor-pointer ${isSubActive
                                ? 'bg-zinc-800/80 text-white font-semibold'
                                : 'text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-200 font-normal'
                              }`}
                          >
                            <span className="truncate">{sub.label}</span>
                            {sub.badge && (
                              <span className="rounded-full bg-zinc-800 text-zinc-300 px-1.5 py-0.2 text-[9px] font-semibold">
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-3 border-t border-zinc-800/80 bg-[#0F1012] shrink-0">
          {!sidebarCollapsed ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-200 font-semibold text-xs border border-zinc-700">
                    {supplierUser?.name ? supplierUser.name.charAt(0).toUpperCase() : 'V'}
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#0F1012]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-200 truncate">{supplierUser?.name || 'Verified Supplier'}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{supplierUser?.email || 'supplier@krishna.com'}</p>
                  </div>
                </div>

                <button
                  onClick={handleSupplierLogout}
                  title="Sign Out"
                  className="text-zinc-400 hover:text-rose-400 p-1 transition shrink-0 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <Link
                  to="/"
                  target="_blank"
                  className="flex items-center justify-center gap-1 rounded-lg bg-zinc-800/70 hover:bg-zinc-800 py-1.5 text-[10.5px] font-medium text-zinc-300 transition truncate px-1"
                >
                  <span>Storefront</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </Link>
                <button
                  onClick={handleSupplierLogout}
                  className="flex items-center justify-center rounded-lg bg-zinc-800/40 hover:bg-rose-950/40 border border-zinc-800 hover:border-rose-900/50 py-1.5 text-[10.5px] font-medium text-zinc-300 hover:text-rose-300 transition truncate px-1 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleSupplierLogout}
                title="Sign Out"
                className="text-zinc-400 hover:text-rose-400 p-2 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ==========================================
          2. MAIN SCROLL CONTAINER & TOPBAR
      ========================================== */}
      <div
        ref={supplierContentScrollRef}
        id="supplier-main-scroll"
        onScroll={handleSupplierScroll}
        className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen max-h-screen bg-[#F9F9F8] scroll-smooth relative"
      >
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-zinc-200/80 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-sm shrink-0 cursor-pointer"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1.5 text-xs text-zinc-500 truncate min-w-0 font-medium">
              <span className="text-zinc-700 font-medium truncate">{currentSectionObj.title}</span>
              <span className="text-zinc-300 shrink-0">/</span>
              <span className="text-zinc-900 font-semibold truncate">{currentSubItemObj.label}</span>
            </div>
          </div>

          {/* Right: Search, Vendor Switcher, Sync & Add Product */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search catalog or orders..."
                className="h-8 w-44 lg:w-56 rounded-xl border border-zinc-200 bg-zinc-50 pl-8 pr-3 text-xs outline-none focus:bg-white focus:border-zinc-400 transition"
              />
              {globalSearch && (
                <button onClick={() => setGlobalSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Supplier Notifications Popover (Replaced vendor dropdown) */}
            <div className="relative" ref={notifsRef}>
              <button
                onClick={() => setNotifsOpen(prev => !prev)}
                className={`relative flex h-8 w-8 items-center justify-center rounded-xl border transition cursor-pointer shadow-2xs ${
                  notifsOpen
                    ? 'border-zinc-400 bg-zinc-100 text-zinc-900 ring-2 ring-zinc-900/5'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                }`}
                title="Supplier Notifications"
                aria-label="Toggle notifications"
                aria-expanded={notifsOpen}
              >
                <Bell className="h-4 w-4 text-zinc-700" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-xs">
                    {unreadNotifsCount}
                    <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping -z-10" />
                  </span>
                )}
              </button>

              {notifsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-zinc-200/90 bg-white p-3.5 sm:p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Popover Header */}
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-900 text-white">
                        <Bell className="h-3 w-3" />
                      </div>
                      <span className="text-xs font-bold text-zinc-900 tracking-tight">
                        Supplier Alerts
                      </span>
                      {unreadNotifsCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                          {unreadNotifsCount} new
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {unreadNotifsCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="flex items-center gap-1 text-[10.5px] font-semibold text-zinc-600 hover:text-zinc-950 transition cursor-pointer px-1.5 py-0.5 rounded-md hover:bg-zinc-100"
                        >
                          <CheckCheck className="h-3 w-3 text-zinc-500" />
                          <span>Mark read</span>
                        </button>
                      )}
                      <button
                        onClick={() => setNotifsOpen(false)}
                        className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg hover:bg-zinc-100 transition cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Notification List */}
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-zinc-400 space-y-2">
                      <div className="h-10 w-10 mx-auto rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      </div>
                      <p className="text-xs font-semibold text-zinc-700">All caught up!</p>
                      <p className="text-[11px] text-zinc-400">No new alerts for your supplier account.</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                      {notifications.map((n) => {
                        let IconComponent = Bell;
                        let iconBg = 'bg-zinc-100 text-zinc-700';
                        if (n.type === 'order') {
                          IconComponent = ShoppingBag;
                          iconBg = 'bg-blue-50 text-blue-600 border border-blue-100';
                        } else if (n.type === 'inventory') {
                          IconComponent = AlertTriangle;
                          iconBg = 'bg-amber-50 text-amber-600 border border-amber-100';
                        } else if (n.type === 'financial') {
                          IconComponent = Wallet;
                          iconBg = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
                        } else if (n.type === 'system') {
                          IconComponent = ShieldCheck;
                          iconBg = 'bg-purple-50 text-purple-600 border border-purple-100';
                        }

                        return (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`group relative flex items-start gap-3 rounded-xl p-2.5 text-xs transition cursor-pointer ${
                              n.unread
                                ? 'bg-zinc-50 border border-zinc-200/80 font-medium hover:bg-zinc-100/70'
                                : 'hover:bg-zinc-50 text-zinc-600 border border-transparent'
                            }`}
                          >
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                              <IconComponent className="h-4 w-4" />
                            </div>

                            <div className="flex-1 min-w-0 pr-4">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`text-xs truncate ${n.unread ? 'font-bold text-zinc-900' : 'font-semibold text-zinc-700'}`}>
                                  {n.title}
                                </span>
                                <span className="text-[9.5px] font-mono text-zinc-400 shrink-0">{n.time}</span>
                              </div>
                              <p className="mt-0.5 text-[11px] text-zinc-500 leading-snug line-clamp-2">
                                {n.message}
                              </p>
                              {n.targetSection && (
                                <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-zinc-900 group-hover:translate-x-0.5 transition">
                                  <span>View details</span>
                                  <ArrowRight className="h-2.5 w-2.5" />
                                </div>
                              )}
                            </div>

                            {/* Unread indicator dot */}
                            {n.unread && (
                              <span className="absolute top-3 right-2.5 h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                            )}

                            {/* Dismiss button on hover */}
                            <button
                              onClick={(e) => deleteNotification(e, n.id)}
                              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                              title="Dismiss"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Popover Footer */}
                  <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between text-[10.5px] text-zinc-400 px-1">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Supplier Stream
                    </span>
                    <button
                      onClick={() => {
                        setActiveSection('dashboard');
                        setActiveSubTab('overview');
                        setNotifsOpen(false);
                      }}
                      className="font-medium text-zinc-600 hover:text-zinc-900 transition cursor-pointer"
                    >
                      Activity Log →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sync Data Button */}
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="flex h-8 items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition shadow-2xs cursor-pointer disabled:opacity-50"
              title="Sync Supplier Stores"
            >
              <RefreshCw className={`h-3 w-3 text-zinc-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            {/* Add Product Button */}
            <button
              onClick={handleOpenAddProduct}
              className="flex h-8 items-center gap-1.5 rounded-xl bg-zinc-900 hover:bg-black px-3 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Product</span>
            </button>
          </div>
        </header>

        {/* ==========================================
            3. MAIN WORKSPACE DASHBOARD CONTENT
        ========================================== */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full flex-1">

          {/* KPI Stat Cards Bar */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {/* KPI 1: Active Catalog */}
            <div className="group rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs transition hover:shadow-xs hover:border-zinc-300">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">Active Catalog</span>
                <div className="h-7 w-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white transition">
                  <Package className="h-3.5 w-3.5" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 font-mono">{supplierProducts.length}</p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Live in Storefront Catalog
              </div>
            </div>

            {/* KPI 2: Total Stock Units */}
            <div className="group rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs transition hover:shadow-xs hover:border-zinc-300">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">Total Stock Units</span>
                <div className="h-7 w-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white transition">
                  <Boxes className="h-3.5 w-3.5" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 font-mono">{totalStockUnits.toLocaleString()}</p>
              <div className="mt-2 text-[11px]">
                {lowStockItems.length > 0 ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                    <AlertTriangle className="h-3 w-3" />
                    {lowStockItems.length} items low on stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold text-zinc-600">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    Optimal inventory depth
                  </span>
                )}
              </div>
            </div>

            {/* KPI 3: Pending Dispatch */}
            <div className="group rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs transition hover:shadow-xs hover:border-zinc-300">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">Pending Dispatch</span>
                <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 transition">
                  <Truck className="h-3.5 w-3.5" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600 font-mono">{pendingOrdersCount}</p>
              <span className="mt-2 text-[11px] text-zinc-600 font-medium block">Awaiting packaging & courier</span>
            </div>

            {/* KPI 4: Net Earnings */}
            <div className="group rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs transition hover:shadow-xs hover:border-zinc-300">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">Net Earnings (95%)</span>
                <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 transition">
                  <Wallet className="h-3.5 w-3.5" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 font-mono">₹{netEarnings.toLocaleString('en-IN')}</p>
              <span className="mt-2 text-[11px] text-zinc-600 block">Gross volume: ₹{totalRevenue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* VIEW SECTION 1: DASHBOARD (Overview, Pending, Insights) */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">

              {/* Urgent Fulfillment Banner */}
              {pendingOrdersCount > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-5 shadow-2xs">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="h-9 w-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-950">
                        {pendingOrdersCount} customer {pendingOrdersCount === 1 ? 'order requires' : 'orders require'} urgent fulfillment
                      </h4>
                      <p className="text-xs text-amber-800/90 mt-0.5">
                        Process packaging and attach courier tracking number to notify customers.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveSection('fulfillment');
                      setActiveSubTab('orders');
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-black transition shadow-xs shrink-0 cursor-pointer"
                  >
                    <span>View Order Queue</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Dual Overview Cards Grid */}
              <div className="grid gap-6 lg:grid-cols-2">

                {/* Recent Customer Orders */}
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900">Recent Customer Orders</h3>
                      <p className="text-xs text-zinc-400">Latest transactions assigned to {activeSupplierName}</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveSection('fulfillment');
                        setActiveSubTab('orders');
                      }}
                      className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-900 font-semibold hover:underline cursor-pointer"
                    >
                      <span>View all ({supplierOrders.length})</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="divide-y divide-zinc-100">
                    {supplierOrders.slice(0, 4).map(order => (
                      <div key={order.id} className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between hover:bg-zinc-50/50 rounded-xl px-2 -mx-2 transition">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-zinc-900">{order.id}</span>
                            <span className="text-zinc-300">•</span>
                            <span className="text-xs text-zinc-500">{order.date}</span>
                          </div>
                          <p className="text-xs font-medium text-zinc-800">
                            {order.customer?.firstName} {order.customer?.lastName}
                          </p>
                          <p className="text-[11px] text-zinc-400">
                            {order.items?.length || 0} line items &bull; {order.paymentMethod || 'Prepaid'}
                          </p>
                        </div>

                        <div className="text-right space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                              order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200/60' :
                                'bg-amber-50 text-amber-700 border border-amber-200/60'
                            }`}>
                            {order.status}
                          </span>
                          <p className="text-xs font-bold font-mono text-zinc-900">₹{Number(order.total || 0).toLocaleString('en-IN')}</p>
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

                {/* Low Stock Alerts */}
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900">Inventory Stock Health</h3>
                      <p className="text-xs text-zinc-400">Items requiring immediate stock replenishment</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveSection('inventory');
                        setActiveSubTab('stock-control');
                      }}
                      className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-900 font-semibold hover:underline cursor-pointer"
                    >
                      <span>Manage stock</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {lowStockItems.length > 0 || outOfStockItems.length > 0 ? (
                    <div className="divide-y divide-zinc-100">
                      {[...outOfStockItems, ...lowStockItems].slice(0, 4).map(item => (
                        <div key={item.id} className="py-3 first:pt-1 last:pb-1 flex items-center justify-between hover:bg-zinc-50/50 rounded-xl px-2 -mx-2 transition">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-10 w-10 rounded-xl object-cover bg-zinc-50 border border-zinc-200/80 p-0.5 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-zinc-900 truncate max-w-[170px]">{item.name}</p>
                              <span className="text-[10px] font-mono text-zinc-400">{item.sku}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-rose-50 text-rose-700 border border-rose-200/60 px-2 py-0.5 text-[10px] font-bold font-mono">
                              {item.stock} left
                            </span>
                            <button
                              onClick={() => handleStockAdjust(item, 10)}
                              className="rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 text-[11px] font-semibold px-2.5 py-1 transition shadow-2xs cursor-pointer"
                            >
                              +10 Restock
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center space-y-2">
                      <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-bold text-zinc-800">All products have healthy inventory levels</p>
                      <p className="text-[11px] text-zinc-400">No low stock warnings active for this supplier catalog.</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* VIEW SECTION 2: CATALOG (Products & Low Stock) */}
          {activeSection === 'catalog' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-900">
                    Product Catalog ({supplierProducts.length})
                  </h3>
                  <p className="text-xs text-zinc-500">Products assigned to {activeSupplierName} displayed across Krishna Accessories store.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search SKU, name, category..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-8 pr-3 py-2 text-xs rounded-xl border border-zinc-200 bg-white placeholder:text-zinc-400 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5 w-52 transition shadow-2xs"
                    />
                    {productSearch && (
                      <button onClick={() => setProductSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 outline-none focus:border-zinc-400 cursor-pointer shadow-2xs"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <select
                    value={productStockFilter}
                    onChange={(e) => setProductStockFilter(e.target.value)}
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 outline-none focus:border-zinc-400 cursor-pointer shadow-2xs"
                  >
                    <option value="All">All Stock</option>
                    <option value="In Stock">In Stock (10+)</option>
                    <option value="Low Stock">Low Stock (&lt; 10)</option>
                    <option value="Out of Stock">Out of Stock (0)</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleOpenAddProduct}
                    className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-black transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
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
                                  target="_blank"
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
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-800">
                                {p.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-500 font-medium mt-1">{p.brand}</p>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-zinc-700 text-xs">{p.sku}</td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-zinc-900 font-mono text-xs">₹{Number(p.price || 0).toLocaleString('en-IN')}</span>
                            {p.oldPrice && (
                              <span className="text-[10px] text-zinc-400 line-through block font-mono">₹{Number(p.oldPrice || 0).toLocaleString('en-IN')}</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${Number(p.stock) === 0
                                ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                                : Number(p.stock) < 10
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              }`}>
                              {p.stock} units
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 transition shadow-2xs cursor-pointer"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => setProductToDelete(p)}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-200/80 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700 transition shadow-2xs cursor-pointer"
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
                            No matching products found in catalog for current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW SECTION 3: FULFILLMENT (Orders Queue & Stages) */}
          {activeSection === 'fulfillment' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-900">Customer Order Fulfillment Queue</h3>
                  <p className="text-xs text-zinc-500">Advance order dispatch stages from Processing to Shipped & Delivered. Status updates sync in real-time.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search Order, Customer, AWB..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="pl-8 pr-3 py-2 text-xs rounded-xl border border-zinc-200 bg-white placeholder:text-zinc-400 outline-none focus:border-zinc-400 w-52 transition shadow-2xs"
                    />
                    {orderSearch && (
                      <button onClick={() => setOrderSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 outline-none focus:border-zinc-400 cursor-pointer shadow-2xs"
                  >
                    <option value="All">All Stages</option>
                    <option value="Processing">Processing & Packaging</option>
                    <option value="Shipped">Shipped & In-Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled / Returns</option>
                  </select>
                </div>
              </div>

              {/* Order Fulfillment Table */}
              <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
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
                      {filteredOrders.map(order => (
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
                            <span className="font-bold text-zinc-900 font-mono text-xs">₹{Number(order.total || 0).toLocaleString('en-IN')}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                                order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200/60' :
                                  order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-200/60' :
                                    'bg-amber-50 text-amber-700 border border-amber-200/60'
                              }`}>
                              {order.status}
                            </span>
                            {order.trackingNumber && (
                              <p className="text-[10px] font-mono text-zinc-400 mt-1">AWB: {order.trackingNumber}</p>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleOpenStatusModal(order)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black transition shadow-2xs cursor-pointer"
                            >
                              <Truck className="h-3 w-3" />
                              <span>Update Logistics</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredOrders.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-xs text-zinc-400">
                            No orders currently match for {activeSupplierName}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW SECTION 4: INVENTORY (Stock Control & Replenishment) */}
          {activeSection === 'inventory' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-900">Inventory Stock Control & Valuation</h3>
                  <p className="text-xs text-zinc-500">Quick adjust physical stock units and replenish catalog inventory on demand.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-zinc-500">Total Valuation:</span>
                  <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                    ₹{totalStockValue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {supplierProducts.map(p => (
                  <div key={p.id} className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs flex flex-col justify-between hover:border-zinc-300 transition">
                    <div>
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt=""
                          className="h-12 w-12 rounded-xl object-cover bg-zinc-50 border border-zinc-200/80 p-0.5 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-zinc-900 truncate">{p.name}</h4>
                          <span className="text-[10px] text-zinc-400 font-mono block">{p.sku}</span>
                          <span className="text-[10px] text-zinc-500">{p.category} &bull; {p.brand}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between rounded-xl bg-zinc-50/80 p-3 border border-zinc-100">
                        <span className="text-xs text-zinc-500 font-medium">Available Stock:</span>
                        <span className={`text-sm font-bold font-mono ${Number(p.stock) < 10 ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {p.stock} Units
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleStockAdjust(p, -1)}
                        className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50/80 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition cursor-pointer"
                        title="Decrease by 1"
                      >
                        −1
                      </button>
                      <button
                        onClick={() => handleStockAdjust(p, +5)}
                        className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50/80 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 transition cursor-pointer"
                        title="Add 5 units"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => handleStockAdjust(p, +20)}
                        className="flex-1 rounded-xl bg-zinc-900 py-1.5 text-xs font-semibold text-white hover:bg-black transition shadow-2xs cursor-pointer"
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

          {/* VIEW SECTION 5: FINANCIALS (Payouts, Settlement, Bank) */}
          {activeSection === 'financials' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
                    Vendor Financial Settlement Breakdown
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Automated revenue split and payout reconciliation for {activeSupplierName}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4">
                    <span className="text-xs text-zinc-500 font-medium">Gross Merchandise Sales</span>
                    <p className="text-2xl font-bold font-mono text-zinc-900 mt-1.5">₹{totalRevenue.toLocaleString('en-IN')}</p>
                    <span className="text-[10px] text-zinc-400 mt-1 block">From fulfilled & active orders</span>
                  </div>
                  <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4">
                    <span className="text-xs text-zinc-500 font-medium">Platform Service Fee (5%)</span>
                    <p className="text-2xl font-bold font-mono text-rose-600 mt-1.5">−₹{platformFee.toLocaleString('en-IN')}</p>
                    <span className="text-[10px] text-zinc-400 mt-1 block">Standard marketplace commission</span>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-100/70 p-4">
                    <span className="text-xs text-zinc-700 font-bold">Net Payout to Vendor</span>
                    <p className="text-2xl font-bold font-mono text-zinc-950 mt-1.5">₹{netEarnings.toLocaleString('en-IN')}</p>
                    <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Direct Bank Transfer (NEFT/RTGS)</span>
                  </div>
                </div>

                <div className="rounded-xl bg-zinc-50 border border-zinc-200/70 p-4 text-xs text-zinc-600 flex items-start gap-3">
                  <Info className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-zinc-900">Settlement Cycle Schedule</p>
                    <p className="text-zinc-500">
                      Vendor earnings are calculated on all orders marked <strong>Delivered</strong> and disbursed every Tuesday to your verified bank account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Floating Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg hover:bg-black transition cursor-pointer"
            title="Scroll to Top"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ==========================================
          MODAL: ADD / EDIT PRODUCT
      ========================================== */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-xl max-h-[92vh] overflow-y-auto">

            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Supplier Catalog</span>
                <h3 className="text-lg font-bold text-zinc-900">
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Store'}
                </h3>
              </div>
              <button
                onClick={() => setProductModalOpen(false)}
                className="h-8 w-8 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex items-center justify-center transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Brand *</label>
                  <select
                    value={productForm.brand}
                    onChange={e => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition cursor-pointer"
                  >
                    {brands.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">SKU Code</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={e => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs font-mono text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs font-mono text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Original Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.oldPrice}
                    onChange={e => setProductForm({ ...productForm, oldPrice: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs font-mono text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Initial Stock Units</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs font-mono text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Warranty Duration</label>
                  <input
                    type="text"
                    value={productForm.warranty}
                    onChange={e => setProductForm({ ...productForm, warranty: e.target.value })}
                    placeholder="e.g. 2 Years"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Multi-Angle Gallery */}
              <div className="rounded-xl border border-zinc-200/90 bg-zinc-50/70 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-semibold text-zinc-900 block text-xs">
                      Product Multi-Angle Gallery (4 Perspectives)
                    </label>
                    <p className="text-[11px] text-zinc-500">
                      Set up 4 distinct angles (Front, Side, Back, Detail) for the interactive customer 360-view.
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded-full">
                    4 Views
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Angle 1 */}
                  <div className="rounded-lg border border-zinc-200 bg-white p-2.5 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-white text-[9px] font-bold">1</span>
                        Primary / Front View *
                      </span>
                      <input
                        type="text"
                        value={productForm.angle1}
                        onChange={e => setProductForm({ ...productForm, angle1: e.target.value })}
                        placeholder="Front View"
                        className="w-24 text-[10.5px] px-1.5 py-0.5 border border-zinc-200 rounded text-right text-zinc-600 focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-14 w-14 rounded-md border border-zinc-200 bg-zinc-50 shrink-0 overflow-hidden flex items-center justify-center">
                        <ProductImagePreview value={productForm.image} alt="Angle 1" />
                      </div>
                      <ProductImagePicker
                        value={productForm.image}
                        onChange={image => setProductForm({ ...productForm, image })}
                        required
                        alt="Angle 1"
                      />
                    </div>
                  </div>

                  {/* Angle 2 */}
                  <div className="rounded-lg border border-zinc-200 bg-white p-2.5 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-700 text-white text-[9px] font-bold">2</span>
                        Side Profile
                      </span>
                      <input
                        type="text"
                        value={productForm.angle2}
                        onChange={e => setProductForm({ ...productForm, angle2: e.target.value })}
                        placeholder="Side Profile"
                        className="w-24 text-[10.5px] px-1.5 py-0.5 border border-zinc-200 rounded text-right text-zinc-600 focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-14 w-14 rounded-md border border-zinc-200 bg-zinc-50 shrink-0 overflow-hidden flex items-center justify-center">
                        <ProductImagePreview value={productForm.image2} alt="Angle 2" />
                      </div>
                      <ProductImagePicker
                        value={productForm.image2}
                        onChange={image2 => setProductForm({ ...productForm, image2 })}
                        alt="Angle 2"
                      />
                    </div>
                  </div>

                  {/* Angle 3 */}
                  <div className="rounded-lg border border-zinc-200 bg-white p-2.5 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-700 text-white text-[9px] font-bold">3</span>
                        Back / Case View
                      </span>
                      <input
                        type="text"
                        value={productForm.angle3}
                        onChange={e => setProductForm({ ...productForm, angle3: e.target.value })}
                        placeholder="Back View"
                        className="w-24 text-[10.5px] px-1.5 py-0.5 border border-zinc-200 rounded text-right text-zinc-600 focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-14 w-14 rounded-md border border-zinc-200 bg-zinc-50 shrink-0 overflow-hidden flex items-center justify-center">
                        <ProductImagePreview value={productForm.image3} alt="Angle 3" />
                      </div>
                      <ProductImagePicker
                        value={productForm.image3}
                        onChange={image3 => setProductForm({ ...productForm, image3 })}
                        alt="Angle 3"
                      />
                    </div>
                  </div>

                  {/* Angle 4 */}
                  <div className="rounded-lg border border-zinc-200 bg-white p-2.5 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-700 text-white text-[9px] font-bold">4</span>
                        Detail / In-Use View
                      </span>
                      <input
                        type="text"
                        value={productForm.angle4}
                        onChange={e => setProductForm({ ...productForm, angle4: e.target.value })}
                        placeholder="Detail View"
                        className="w-24 text-[10.5px] px-1.5 py-0.5 border border-zinc-200 rounded text-right text-zinc-600 focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-14 w-14 rounded-md border border-zinc-200 bg-zinc-50 shrink-0 overflow-hidden flex items-center justify-center">
                        <ProductImagePreview value={productForm.image4} alt="Angle 4" />
                      </div>
                      <ProductImagePicker
                        value={productForm.image4}
                        onChange={image4 => setProductForm({ ...productForm, image4 })}
                        alt="Angle 4"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Product Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-zinc-900 px-5 py-2 text-xs font-semibold text-white hover:bg-black transition shadow-xs cursor-pointer"
                >
                  {editingProduct ? 'Update Product' : 'Publish Product to Store'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: ORDER LOGISTICS UPDATE
      ========================================== */}
      {statusModalOpen && selectedOrderToUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl space-y-5">

            <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5">
              <div>
                <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Fulfillment & Logistics</span>
                <h3 className="text-base font-bold text-zinc-900 font-mono">{selectedOrderToUpdate.id}</h3>
              </div>
              <button
                onClick={() => setStatusModalOpen(false)}
                className="h-8 w-8 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex items-center justify-center transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1.5">Courier Delivery Partner</label>
                <input
                  type="text"
                  value={courierInput}
                  onChange={e => setCourierInput(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-700">Tracking AWB Code</label>
                  <button
                    type="button"
                    onClick={() => setAwbInput(`BD${Math.floor(10000000 + Math.random() * 90000000)}IN`)}
                    className="text-[10px] text-zinc-500 hover:text-zinc-900 font-semibold cursor-pointer"
                  >
                    Auto Generate AWB
                  </button>
                </div>
                <input
                  type="text"
                  value={awbInput}
                  onChange={e => setAwbInput(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2 text-xs font-mono text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Stage Progression Buttons */}
            <div className="space-y-2 pt-3 border-t border-zinc-100">
              <span className="text-[11px] text-zinc-500 block font-semibold">Advance Order Stage:</span>

              <button
                type="button"
                onClick={() => handleUpdateOrderStatusSubmit('Processing')}
                className="w-full flex items-center justify-between rounded-xl border border-amber-200/80 bg-amber-50/70 px-4 py-2.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition cursor-pointer"
              >
                <span>1. Mark as Processing & Packaging</span>
                <Clock className="h-3.5 w-3.5 text-amber-600" />
              </button>

              <button
                type="button"
                onClick={() => handleUpdateOrderStatusSubmit('Shipped')}
                className="w-full flex items-center justify-between rounded-xl border border-blue-200/80 bg-blue-50/70 px-4 py-2.5 text-xs font-semibold text-blue-900 hover:bg-blue-100 transition cursor-pointer"
              >
                <span>2. Mark as Shipped via Courier</span>
                <Truck className="h-3.5 w-3.5 text-blue-600" />
              </button>

              <button
                type="button"
                onClick={() => handleUpdateOrderStatusSubmit('Out for Delivery')}
                className="w-full flex items-center justify-between rounded-xl border border-purple-200/80 bg-purple-50/70 px-4 py-2.5 text-xs font-semibold text-purple-900 hover:bg-purple-100 transition cursor-pointer"
              >
                <span>3. Mark as Out for Delivery</span>
                <ArrowRight className="h-3.5 w-3.5 text-purple-600" />
              </button>

              <button
                type="button"
                onClick={() => handleUpdateOrderStatusSubmit('Delivered')}
                className="w-full flex items-center justify-between rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-2xs cursor-pointer"
              >
                <span>4. Mark as Delivered</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: DELETE PRODUCT CONFIRMATION
      ========================================== */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl space-y-4">
            <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="h-5 w-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-zinc-900">Delete Product</h3>
              <p className="text-xs text-zinc-500">
                Are you sure you want to remove <span className="font-semibold text-zinc-800">"{productToDelete.name}"</span> from your catalog?
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(productToDelete.id)}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 py-2 text-xs font-bold text-white transition cursor-pointer"
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