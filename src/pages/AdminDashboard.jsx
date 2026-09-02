// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getProducts,
  saveProduct,
  deleteProduct,
  getCategories,
  addCategory,
  deleteCategory,
  getBrands,
  getBrandsByCategory,
  addBrand,
  deleteBrand
} from '../utils/productStore';
import {
  getOrders,
  updateOrderStatus,
  cancelOrder,
  requestReturn,
  processReturnStatus,
  getSuppliers,
  approveSupplier,
  toggleSupplierStatus,
  getUsers,
  toggleUserStatus,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  addNotification,
  clearNotifications
} from '../utils/orderStore';
import {
  getSubcategories,
  saveSubcategory,
  deleteSubcategory,
  getVariants,
  saveVariant,
  deleteVariant,
  getMediaAssets,
  addMediaAsset,
  deleteMediaAsset,
  getPromotions,
  savePromotion,
  deletePromotion,
  getRoles,
  saveRole,
  getPermissionsMatrix,
  updateRolePermission,
  getShippingCarriers,
  toggleCarrierStatus,
  getSystemConfig,
  saveSystemConfig,
  exportFullDatabaseBackup,
  restoreDatabaseBackup
} from '../utils/adminStore';
import { getCurrentUser, setCurrentUser, logout, isAdmin } from '../utils/auth';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Navigation Hierarchical State
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({
    dashboard: true,
    catalog: true,
    commerce: true,
    people: true,
    operations: true,
    analytics: true,
    system: true
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUserState] = useState(() => getCurrentUser());
  const authenticatedAsAdmin = isAdmin();

  // Core Data Stores State
  const [products, setProducts] = useState(() => getProducts());
  const [categories, setCategories] = useState(() => getCategories());
  const [brands, setBrands] = useState(() => getBrands());
  const [suppliers, setSuppliers] = useState(() => getSuppliers());
  const [orders, setOrders] = useState(() => getOrders());
  const [users, setUsers] = useState(() => getUsers());
  const [notifications, setNotifications] = useState(() => getNotifications());

  // Extended Advanced Stores State
  const [subcategories, setSubcategories] = useState(() => getSubcategories());
  const [variants, setVariants] = useState(() => getVariants());
  const [mediaAssets, setMediaAssets] = useState(() => getMediaAssets());
  const [promotions, setPromotions] = useState(() => getPromotions());
  const [roles, setRoles] = useState(() => getRoles());
  const [permissionsMatrix, setPermissionsMatrix] = useState(() => getPermissionsMatrix());
  const [shippingCarriers, setShippingCarriers] = useState(() => getShippingCarriers());
  const [systemConfig, setSystemConfigState] = useState(() => getSystemConfig());

  // Global & Local Search Filters
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchCatalog, setSearchCatalog] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [filterBrand, setFilterBrand] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Add / Edit Product Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: 'Rolex',
    category: 'Watches',
    subcategory: 'Automatic Watches',
    gender: "Men's",
    sku: '',
    price: '',
    oldPrice: '',
    stock: '15',
    supplier: 'Apex Timepieces Ltd.',
    image: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800',
    description: '',
    material: 'Oystersteel & Sapphire Crystal',
    warranty: '5 Years'
  });

  // Coupons State
  const [coupons, setCoupons] = useState([
    { code: 'KRISHNA10', discount: 10, type: 'percentage', minSpend: 1000, status: 'Active', usageCount: 48 },
    { code: 'LUXURY20', discount: 20, type: 'percentage', minSpend: 50000, status: 'Active', usageCount: 19 },
    { code: 'WELCOME500', discount: 500, type: 'fixed', minSpend: 2500, status: 'Active', usageCount: 65 }
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [newCouponMin, setNewCouponMin] = useState('');

  // Modals & Form States
  const [subcatModalOpen, setSubcatModalOpen] = useState(false);
  const [subcatForm, setSubcatForm] = useState({ name: '', category: 'Watches', code: '' });

  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [variantForm, setVariantForm] = useState({ productName: 'Rolex Submariner Date 41mm', attributeType: 'Dial Color', value: '', priceModifier: '', stock: '10', sku: '' });

  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaForm, setMediaForm] = useState({ title: '', category: 'Watches', url: '', size: '1.8 MB' });

  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [promoForm, setPromoForm] = useState({ title: '', code: '', discount: '20% Off', targetCategory: 'All Departments', bannerType: 'Hero Banner', startDate: 'Today', endDate: '30 Days' });

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [roleForm, setRoleForm] = useState({ name: '', description: '', membersCount: '1' });

  const [newNotificationText, setNewNotificationText] = useState('');
  const [newNotificationTitle, setNewNotificationTitle] = useState('');

  const [newCatInput, setNewCatInput] = useState('');
  const [newBrandInput, setNewBrandInput] = useState('');

  // Admin Return Review Modal State
  const [adminReturnModalOpen, setAdminReturnModalOpen] = useState(false);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);
  const [adminReturnDecision, setAdminReturnDecision] = useState('Refunded');
  const [adminRefundAmount, setAdminRefundAmount] = useState('');
  const [adminRefundTxn, setAdminRefundTxn] = useState('');
  const [adminReturnNotes, setAdminReturnNotes] = useState('');

  // Top header popovers & alert toasts
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [backupJsonInput, setBackupJsonInput] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, action: 'Product Created', detail: 'Added Rolex Submariner Cerachrom to Watches catalog', time: '10 mins ago', admin: 'Super Admin', ip: '103.21.144.20' },
    { id: 2, action: 'Supplier Verified', detail: 'Approved Apex Timepieces Ltd. vendor license & GSTIN', time: '1 hour ago', admin: 'Super Admin', ip: '103.21.144.20' },
    { id: 3, action: 'Order Status Updated', detail: 'Marked order KA-98421 as Shipped via BlueDart Express Air', time: '2 hours ago', admin: 'Super Admin', ip: '103.21.144.20' },
    { id: 4, action: 'Coupon Created', detail: 'Generated KRISHNA10 promo code for customer checkout', time: '1 day ago', admin: 'Super Admin', ip: '103.21.144.20' },
    { id: 5, action: 'Security Checkpoint', detail: '2FA verification verified for Super Admin session', time: '2 days ago', admin: 'Security Bot', ip: 'System Core' }
  ]);

  const refreshAll = () => {
    setProducts(getProducts());
    setCategories(getCategories());
    setBrands(getBrands());
    setSuppliers(getSuppliers());
    setOrders(getOrders());
    setUsers(getUsers());
    setNotifications(getNotifications());
    setSubcategories(getSubcategories());
    setVariants(getVariants());
    setMediaAssets(getMediaAssets());
    setPromotions(getPromotions());
    setRoles(getRoles());
    setPermissionsMatrix(getPermissionsMatrix());
    setShippingCarriers(getShippingCarriers());
    setSystemConfigState(getSystemConfig());
    setCurrentUserState(getCurrentUser());
  };

  useEffect(() => {
    refreshAll();
    const listeners = [
      'productsUpdated', 'categoriesUpdated', 'brandsUpdated', 'suppliersUpdated',
      'ordersUpdated', 'usersUpdated', 'notificationsUpdated', 'authUpdated',
      'subcategoriesUpdated', 'variantsUpdated', 'mediaUpdated', 'promotionsUpdated',
      'rolesUpdated', 'permissionsUpdated', 'shippingUpdated', 'systemConfigUpdated'
    ];
    listeners.forEach(ev => window.addEventListener(ev, refreshAll));
    return () => listeners.forEach(ev => window.removeEventListener(ev, refreshAll));
  }, []);

  // Filter Catalog Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const q = searchCatalog.trim().toLowerCase() || globalSearch.trim().toLowerCase();
      const matchesSearch = !q ||
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q);
      const matchesCat = filterCat === 'All' || p.category?.toLowerCase() === filterCat.toLowerCase();
      const matchesBrand = filterBrand === 'All' || p.brand?.toLowerCase() === filterBrand.toLowerCase();
      return matchesSearch && matchesCat && matchesBrand;
    });
  }, [products, searchCatalog, globalSearch, filterCat, filterBrand]);

  // Filter Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const q = globalSearch.trim().toLowerCase();
      const matchesSearch = !q ||
        o.id?.toLowerCase().includes(q) ||
        `${o.customer?.firstName} ${o.customer?.lastName}`.toLowerCase().includes(q) ||
        o.customer?.city?.toLowerCase().includes(q) ||
        o.paymentMethod?.toLowerCase().includes(q);
      const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, globalSearch, orderStatusFilter]);

  // Metric Computations
  const totalRevenue = useMemo(() => {
    return orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + Number(o.total || 0), 0);
  }, [orders]);

  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled' && o.status !== 'Refunded').length;
  const pendingSuppliers = suppliers.filter(s => s.status === 'Pending Approval');
  const returnRequests = orders.filter(o => o.status === 'Return Requested');
  const lowStockItems = products.filter(p => (Number(p.stock) || 0) < 5);
  const unreadNotifs = notifications.filter(n => n.unread).length;

  // Payments Ledger Computations
  const paymentTransactions = useMemo(() => {
    return orders.map(o => ({
      id: `TXN-${o.id.replace('KA-', '')}`,
      orderId: o.id,
      customer: `${o.customer?.firstName} ${o.customer?.lastName}`,
      method: o.paymentMethod || 'Online Gateway (UPI)',
      gatewayRef: `PG_PAY_${o.id.replace(/[^0-9]/g, '')}77X`,
      amount: o.total || 0,
      fee: Math.round((o.total || 0) * 0.02),
      netSettlement: (o.total || 0) - Math.round((o.total || 0) * 0.02),
      status: o.paymentStatus || (o.status === 'Cancelled' ? 'Void' : o.status === 'Refunded' ? 'Refunded' : 'Settled'),
      date: o.date || '31 Aug 2026'
    }));
  }, [orders]);

  const refundsList = useMemo(() => {
    return orders.filter(o => o.status === 'Refunded' || o.paymentStatus === 'Refunded' || o.returnRequest);
  }, [orders]);

  // Navigation Hierarchy Definition Matching the Exact User Spec
  const navSections = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: '📊',
      badge: unreadNotifs > 0 ? `${unreadNotifs} alerts` : null,
      subItems: [
        { id: 'overview', label: 'Overview' },
        { id: 'users', label: 'Total Users' },
        { id: 'suppliers', label: 'Suppliers' },
        { id: 'products', label: 'Products' },
        { id: 'orders', label: 'Orders' },
        { id: 'revenue', label: 'Revenue' },
        { id: 'pending', label: 'Pending Actions', badge: pendingSuppliers.length + returnRequests.length > 0 ? `${pendingSuppliers.length + returnRequests.length}` : null },
        { id: 'charts', label: 'Sales Charts' }
      ]
    },
    {
      id: 'catalog',
      title: 'Catalog Management',
      icon: '📦',
      badge: products.length,
      subItems: [
        { id: 'products', label: 'Products' },
        { id: 'categories', label: 'Categories' },
        { id: 'subcategories', label: 'Subcategories' },
        { id: 'brands', label: 'Brands' },
        { id: 'variants', label: 'Variants' },
        { id: 'images', label: 'Images' }
      ]
    },
    {
      id: 'commerce',
      title: 'Commerce Management',
      icon: '💳',
      badge: activeOrdersCount > 0 ? `${activeOrdersCount} live` : null,
      subItems: [
        { id: 'orders', label: 'Orders' },
        { id: 'payments', label: 'Payments' },
        { id: 'returns', label: 'Returns', badge: returnRequests.length > 0 ? `${returnRequests.length}` : null },
        { id: 'refunds', label: 'Refunds' },
        { id: 'coupons', label: 'Coupons' },
        { id: 'promotions', label: 'Promotions' }
      ]
    },
    {
      id: 'people',
      title: 'People Management',
      icon: '👥',
      badge: users.length,
      subItems: [
        { id: 'users', label: 'Users' },
        { id: 'suppliers', label: 'Suppliers' },
        { id: 'roles', label: 'Roles' },
        { id: 'permissions', label: 'Permissions' }
      ]
    },
    {
      id: 'operations',
      title: 'Operations',
      icon: '⚡',
      badge: lowStockItems.length > 0 ? `⚠️ ${lowStockItems.length} low` : null,
      subItems: [
        { id: 'inventory', label: 'Inventory' },
        { id: 'shipping', label: 'Shipping' },
        { id: 'order-status', label: 'Order Status' },
        { id: 'notifications', label: 'Notifications' }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: '📈',
      subItems: [
        { id: 'daily-sales', label: 'Daily Sales' },
        { id: 'monthly-sales', label: 'Monthly Sales' },
        { id: 'product-perf', label: 'Product Performance' },
        { id: 'supplier-perf', label: 'Supplier Performance' },
        { id: 'customer-reports', label: 'Customer Reports' }
      ]
    },
    {
      id: 'system',
      title: 'System',
      icon: '⚙️',
      subItems: [
        { id: 'settings', label: 'Settings' },
        { id: 'audit-logs', label: 'Audit Logs' },
        { id: 'security', label: 'Security' },
        { id: 'backups', label: 'Backups' },
        { id: 'configuration', label: 'Configuration' }
      ]
    }
  ];

  // Navigation Click Handler
  const handleNavSelect = (sectionId, subItemId) => {
    setActiveSection(sectionId);
    setActiveSubTab(subItemId);
    setMobileSidebarOpen(false);
  };

  const toggleSectionExpand = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Auth Handlers
  const handleQuickAdminLogin = () => {
    setCurrentUser({
      email: 'admin@krishna.com',
      role: 'admin',
      name: 'Super Administrator',
      phone: '+91 (079) 4000-5500'
    });
    refreshAll();
  };

  const handleAdminLogout = () => {
    logout();
    navigate('/login');
  };

  // Product Actions
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    const cat = categories[0] || 'Watches';
    const catBrands = getBrandsByCategory(cat);
    const catSub = subcategories.find(s => s.category === cat)?.name || 'Luxury Goods';
    setProductForm({
      name: '',
      brand: catBrands[0] || 'Rolex',
      category: cat,
      subcategory: catSub,
      gender: "Men's",
      sku: `KA-${cat.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      price: '',
      oldPrice: '',
      stock: '15',
      supplier: suppliers[0]?.name || 'Apex Timepieces Ltd.',
      image: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800',
      description: '',
      material: 'Surgical Stainless Steel & Sapphire Glass',
      warranty: '2 Years International'
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name || '',
      brand: p.brand || 'Rolex',
      category: p.category || 'Watches',
      subcategory: p.subcategory || 'Automatic Watches',
      gender: p.gender || "Men's",
      sku: p.sku || '',
      price: p.price || '',
      oldPrice: p.oldPrice || '',
      stock: p.stock || 0,
      supplier: p.supplier || suppliers[0]?.name || 'Apex Timepieces Ltd.',
      image: p.image || p.images?.[0] || '',
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

    const payload = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: productForm.name.trim(),
      brand: productForm.brand,
      category: productForm.category,
      subcategory: productForm.subcategory || 'Luxury Goods',
      gender: productForm.gender || "Unisex",
      sku: productForm.sku.trim() || `KA-SKU-${Date.now().toString().slice(-4)}`,
      price,
      oldPrice,
      discount,
      stock: Number(productForm.stock) || 0,
      supplier: productForm.supplier,
      rating: editingProduct?.rating || 4.9,
      reviews: editingProduct?.reviews || 50,
      image: productForm.image || 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800',
      images: [productForm.image || 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800'],
      description: productForm.description || 'Exclusive luxury piece from Krishna Accessories.',
      specifications: {
        Material: productForm.material || 'Genuine Luxury Material',
        Warranty: productForm.warranty || '2 Years'
      }
    };

    saveProduct(payload);
    setProductModalOpen(false);
    showToast(editingProduct ? 'Product updated successfully!' : 'New product published to live store!');

    setAuditLogs(prev => [
      {
        id: Date.now(),
        action: editingProduct ? 'Product Updated' : 'Product Published',
        detail: `${payload.name} (${payload.brand} - ₹${payload.price.toLocaleString('en-IN')})`,
        time: 'Just now',
        admin: currentUser?.name || 'Super Admin',
        ip: '103.21.144.20'
      },
      ...prev
    ]);
  };

  const handleDeleteProduct = (id) => {
    const target = products.find(p => p.id === id);
    if (window.confirm(`Delete product "${target?.name || id}" permanently from store catalog?`)) {
      deleteProduct(id);
      showToast('Product removed from catalog');
      setAuditLogs(prev => [
        {
          id: Date.now(),
          action: 'Product Deleted',
          detail: `Removed product ID #${id} (${target?.name || ''})`,
          time: 'Just now',
          admin: currentUser?.name || 'Super Admin',
          ip: '103.21.144.20'
        },
        ...prev
      ]);
    }
  };

  const handleStockAdjust = (id, delta) => {
    const target = products.find(p => p.id === id);
    if (!target) return;
    const newStock = Math.max(0, (target.stock || 0) + delta);
    saveProduct({ ...target, stock: newStock });
  };

  // Subcategory Form Submit
  const handleAddSubcategory = (e) => {
    e.preventDefault();
    if (!subcatForm.name.trim()) return;
    saveSubcategory(subcatForm);
    setSubcatModalOpen(false);
    setSubcatForm({ name: '', category: categories[0] || 'Watches', code: '' });
    showToast('Subcategory created successfully!');
  };

  // Variant Form Submit
  const handleAddVariant = (e) => {
    e.preventDefault();
    if (!variantForm.value.trim()) return;
    saveVariant(variantForm);
    setVariantModalOpen(false);
    setVariantForm({ productName: products[0]?.name || 'Rolex Submariner Date 41mm', attributeType: 'Dial Color', value: '', priceModifier: '', stock: '10', sku: '' });
    showToast('Variant configuration saved!');
  };

  // Media Asset Submit
  const handleAddMedia = (e) => {
    e.preventDefault();
    if (!mediaForm.url.trim()) return;
    addMediaAsset(mediaForm);
    setMediaModalOpen(false);
    setMediaForm({ title: '', category: 'Watches', url: '', size: '1.8 MB' });
    showToast('Media asset indexed into asset gallery!');
  };

  // Promotion Submit
  const handleAddPromotion = (e) => {
    e.preventDefault();
    if (!promoForm.title.trim()) return;
    savePromotion(promoForm);
    setPromoModalOpen(false);
    setPromoForm({ title: '', code: '', discount: '20% Off', targetCategory: 'All Departments', bannerType: 'Hero Banner', startDate: 'Today', endDate: '30 Days' });
    showToast('Promotional campaign banner launched!');
  };

  // Role Submit
  const handleAddRole = (e) => {
    e.preventDefault();
    if (!roleForm.name.trim()) return;
    saveRole(roleForm);
    setRoleModalOpen(false);
    setRoleForm({ name: '', description: '', membersCount: '1' });
    showToast('New governance role registered!');
  };

  // Category & Brand Form Submit
  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    addCategory(newCatInput.trim());
    setNewCatInput('');
    showToast('Department category added!');
  };

  const handleAddBrandSubmit = (e) => {
    e.preventDefault();
    if (!newBrandInput.trim()) return;
    addBrand(newBrandInput.trim());
    setNewBrandInput('');
    showToast('Luxury brand registered!');
  };

  // Coupon Submit
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode.trim() || !newCouponDiscount) return;
    setCoupons(prev => [
      {
        code: newCouponCode.trim().toUpperCase(),
        discount: Number(newCouponDiscount),
        type: 'percentage',
        minSpend: Number(newCouponMin) || 1000,
        status: 'Active',
        usageCount: 0
      },
      ...prev
    ]);
    setNewCouponCode('');
    setNewCouponDiscount('');
    setNewCouponMin('');
    showToast('Discount promo code generated!');
  };

  // Return & Refund Review Flow
  const handleOpenAdminReturnModal = (order) => {
    setSelectedReturnOrder(order);
    setAdminReturnDecision('Refunded');
    setAdminRefundAmount(order.total || '');
    setAdminRefundTxn(`REF-${Math.floor(100000 + Math.random() * 900000)}`);
    setAdminReturnNotes('Inspection verified. Full refund disbursed to customer source account.');
    setAdminReturnModalOpen(true);
  };

  const handleProcessAdminReturn = (e) => {
    e.preventDefault();
    if (!selectedReturnOrder) return;
    processReturnStatus(selectedReturnOrder.id, adminReturnDecision, {
      refundAmount: Number(adminRefundAmount) || selectedReturnOrder.total,
      transactionId: adminRefundTxn,
      notes: adminReturnNotes
    });
    setAdminReturnModalOpen(false);
    setSelectedReturnOrder(null);
    showToast('Return & refund decision executed successfully!');
    refreshAll();
  };

  // System Settings Save
  const handleSaveSettings = (e) => {
    e.preventDefault();
    saveSystemConfig(systemConfig);
    showToast('Store global configuration saved!');
  };

  // Database Backup Actions
  const handleDownloadBackup = () => {
    const jsonStr = exportFullDatabaseBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `krishna_accessories_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database JSON backup downloaded!');
  };

  const handleRestoreBackup = () => {
    if (!backupJsonInput.trim()) {
      alert("Please paste backup JSON string first.");
      return;
    }
    const res = restoreDatabaseBackup(backupJsonInput.trim());
    if (res.success) {
      showToast(res.message);
      setBackupJsonInput('');
      refreshAll();
    } else {
      alert(res.message);
    }
  };

  // Global Notification Broadcast
  const handleBroadcastNotification = (e) => {
    e.preventDefault();
    if (!newNotificationTitle.trim() || !newNotificationText.trim()) return;
    addNotification({
      title: newNotificationTitle.trim(),
      message: newNotificationText.trim(),
      type: "announcement"
    });
    setNewNotificationTitle('');
    setNewNotificationText('');
    showToast('System announcement broadcasted!');
  };

  // Dedicated Admin Login Check
  if (!authenticatedAsAdmin) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-gray-100 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B1120] border border-amber-500/30 text-amber-300 font-serif font-bold text-2xl shadow-lg">
            K
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B89758]">
              Governance Console
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Krishna Accessories Admin
            </h1>
            <p className="text-xs text-gray-400 mt-1.5 max-w-xs mx-auto">
              Unified multi-module management console for authorized system administrators.
            </p>
          </div>
          <div className="pt-2 space-y-3">
            <button
              onClick={handleQuickAdminLogin}
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md transition transform active:scale-98"
            >
              ⚡ 1-Click Sign In as Super Admin
            </button>
            <Link
              to="/login"
              className="block w-full rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 py-2.5 text-xs font-bold text-gray-200 transition"
            >
              Sign In with Password &rarr;
            </Link>
            <Link
              to="/"
              className="inline-block text-xs text-gray-400 hover:text-white pt-2 transition"
            >
              &larr; Back to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Find Current Active Section and Sub Item for Breadcrumb
  const currentSectionObj = navSections.find(s => s.id === activeSection) || navSections[0];
  const currentSubItemObj = currentSectionObj.subItems.find(sub => sub.id === activeSubTab) || currentSectionObj.subItems[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex overflow-hidden font-sans">

      {/* ==========================================
          TOAST ALERT BANNER
      ========================================== */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-2xl bg-[#0F172A] text-amber-300 border border-amber-500/40 px-4 py-2.5 text-xs font-bold shadow-2xl animate-fade-in flex items-center gap-2">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ==========================================
          1. DEDICATED HIERARCHICAL SIDEBAR
      ========================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between bg-[#0B1120] text-slate-300 border-r border-slate-800 transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}`}
      >
        
        {/* Sidebar Brand Header */}
        <div className="flex flex-col min-h-0 flex-1">
          <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80 shrink-0">
            <Link to="/admin" className="flex items-center gap-3 overflow-hidden min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0F172A] text-amber-300 font-serif font-bold text-sm border border-amber-500/30 shadow-md">
                K
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-serif font-bold text-white tracking-tight text-sm truncate">
                    Krishna Accessories
                  </span>
                  <span className="text-[9px] font-bold tracking-[0.16em] text-[#B89758] uppercase truncate">
                    Admin Governance
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1 text-sm shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Navigation Items (Scrollable Hierarchical Accordion) */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 text-xs">
            {navSections.map((sec) => {
              const isSectionActive = activeSection === sec.id;
              const isExpanded = expandedSections[sec.id];

              return (
                <div key={sec.id} className="space-y-0.5">
                  
                  {/* Parent Section Header */}
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
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 font-bold transition-all ${
                      isSectionActive
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">{sec.icon}</span>
                      {!sidebarCollapsed && (
                        <span className="truncate text-left">{sec.title}</span>
                      )}
                    </div>

                    {!sidebarCollapsed && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {sec.badge && (
                          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-amber-300">
                            {sec.badge}
                          </span>
                        )}
                        <span className={`text-[9px] text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </div>
                    )}
                  </button>

                  {/* Sub-items List (Rendered when expanded) */}
                  {!sidebarCollapsed && isExpanded && (
                    <div className="ml-4 pl-3 border-l border-slate-800 space-y-0.5 pt-0.5 pb-1">
                      {sec.subItems.map((sub) => {
                        const isSubActive = isSectionActive && activeSubTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleNavSelect(sec.id, sub.id)}
                            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium transition ${
                              isSubActive
                                ? 'bg-amber-400/20 text-white font-bold'
                                : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                            }`}
                          >
                            <span className="truncate">{sub.label}</span>
                            {sub.badge && (
                              <span className="rounded-full bg-rose-500/20 text-rose-300 px-1.5 py-0.2 text-[8.5px] font-bold">
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
        <div className="p-3 border-t border-slate-800/80 bg-[#080D1A] shrink-0">
          {!sidebarCollapsed ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/40">
                    SA
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#080D1A]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">Super Admin</p>
                    <p className="text-[10px] text-slate-400 truncate">admin@krishna.com</p>
                  </div>
                </div>

                <button
                  onClick={handleAdminLogout}
                  title="Sign Out"
                  className="text-slate-400 hover:text-rose-400 p-1 transition shrink-0"
                >
                  ⏻
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <Link
                  to="/"
                  target="_blank"
                  className="flex items-center justify-center gap-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 py-1.5 text-[10.5px] font-bold text-slate-200 transition truncate px-1"
                >
                  <span>Live Store</span>
                  <span className="text-[9px]">↗</span>
                </Link>
                <button
                  onClick={handleAdminLogout}
                  className="flex items-center justify-center rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 py-1.5 text-[10.5px] font-bold text-rose-300 transition truncate px-1"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleAdminLogout}
                title="Sign Out"
                className="text-slate-400 hover:text-rose-400 p-2"
              >
                ⏻
              </button>
            </div>
          )}
        </div>

      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ==========================================
          2. MAIN CONTENT WRAPPER WITH TOP HEADER
      ========================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen bg-[#F8FAFC]">

        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-3 sm:px-6 lg:px-8 backdrop-blur-md">
          
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-base shrink-0"
            >
              ☰
            </button>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-mono shrink-0"
              title="Toggle sidebar collapse"
            >
              {sidebarCollapsed ? '⇥' : '⇤'}
            </button>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate min-w-0">
              <span className="font-semibold text-slate-400 shrink-0">Admin</span>
              <span className="shrink-0">/</span>
              <span className="font-bold text-slate-700 truncate">{currentSectionObj.title}</span>
              <span className="shrink-0">/</span>
              <span className="font-bold text-amber-600 truncate">{currentSubItemObj.label}</span>
            </div>
          </div>

          {/* Center: Global Search */}
          <div className="hidden md:flex relative w-56 lg:w-80">
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search catalog, orders, users..."
              className="w-full rounded-full border border-slate-200 bg-slate-100/80 py-1.5 pl-8 pr-4 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-slate-400 focus:bg-white"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">
              🔍
            </span>
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right: Actions, Notifications & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-800 transition shadow-2xs"
            >
              <span>View Store</span>
              <span className="text-[10px] text-slate-500">↗</span>
            </Link>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setNotifsOpen(!notifsOpen)}
                className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                <span>🔔</span>
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[8.5px] font-bold text-white shadow-xs">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {notifsOpen && (
                <div className="absolute right-0 top-full mt-2 w-[calc(100vw-32px)] max-w-xs sm:w-80 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xl z-50 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Platform Alerts ({notifications.length})
                    </span>
                    {unreadNotifs > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10px] text-[#B89758] font-bold hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`rounded-xl p-2.5 text-xs transition cursor-pointer ${
                          n.unread ? 'bg-amber-50/70 border border-amber-200/60' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-slate-900 text-xs">{n.title}</span>
                          <span className="text-[9px] text-slate-400 font-mono shrink-0">{n.date}</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-600 leading-snug">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-slate-200 bg-white px-2 sm:px-2.5 py-1.5 text-xs font-bold text-slate-900 hover:bg-slate-50 transition shadow-2xs"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0F172A] text-amber-300 text-[10px] font-bold shrink-0">
                  K
                </div>
                <span className="hidden sm:inline">Super Admin</span>
                <span className="text-slate-400 text-[9px]">▼</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 animate-fade-in text-xs font-semibold">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="font-bold text-slate-950">Super Admin</p>
                    <p className="text-[10px] text-slate-400">admin@krishna.com</p>
                  </div>
                  <button
                    onClick={() => { handleNavSelect('system', 'settings'); setUserDropdownOpen(false); }}
                    className="w-full text-left rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100 transition"
                  >
                    ⚙️ Store Settings
                  </button>
                  <button
                    onClick={() => { handleNavSelect('system', 'audit-logs'); setUserDropdownOpen(false); }}
                    className="w-full text-left rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100 transition"
                  >
                    📜 Audit Trail
                  </button>
                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button
                      onClick={handleAdminLogout}
                      className="w-full text-left rounded-xl px-3 py-2 text-rose-600 hover:bg-rose-50 font-bold transition"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* Section Sub-Navigation Tabs Bar */}
        <div className="bg-white border-b border-slate-200/80 px-3 sm:px-6 lg:px-8 py-2.5 overflow-x-auto flex items-center gap-1.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-2 shrink-0">
            {currentSectionObj.title}:
          </span>
          {currentSectionObj.subItems.map((sub) => {
            const isSubActive = activeSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id)}
                className={`rounded-full px-3.5 py-1 text-xs font-bold transition whitespace-nowrap shrink-0 ${
                  isSubActive
                    ? 'bg-[#0F172A] text-amber-300 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {sub.label}
                {sub.badge && (
                  <span className={`ml-1.5 rounded-full px-1.5 py-0.2 text-[9px] ${isSubActive ? 'bg-amber-400/30 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {sub.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ==========================================
            3. MAIN BODY CONTENT (35+ SUB-VIEWS)
        ========================================== */}
        <main className="p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">

          {/* ==========================================
              MODULE 1: DASHBOARD
          ========================================== */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                    Operational Intelligence Dashboard
                  </h1>
                  <p className="text-xs text-slate-500">
                    Live KPIs, gross merchandise volume, fulfillment pipelines, and governance actions.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenAddProduct}
                    className="rounded-full bg-[#0F172A] hover:bg-black px-4 py-2 text-xs font-bold text-white shadow-xs transition"
                  >
                    + Add Product
                  </button>
                </div>
              </div>

              {/* 5 Core Top Metric Cards (Total Users, Suppliers, Products, Orders, Revenue) */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                
                {/* 1. Revenue */}
                <div
                  onClick={() => setActiveSubTab('revenue')}
                  className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:border-amber-400 cursor-pointer transition"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span className="font-bold uppercase tracking-wider text-[9.5px]">Revenue (GMV)</span>
                    <span className="text-emerald-600 font-bold text-[10px]">↑ +18.4%</span>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold text-slate-950 tracking-tight truncate">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Gross processed volume</p>
                </div>

                {/* 2. Total Orders */}
                <div
                  onClick={() => setActiveSubTab('orders')}
                  className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:border-amber-400 cursor-pointer transition"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span className="font-bold uppercase tracking-wider text-[9.5px]">Total Orders</span>
                    <span className="text-blue-600 font-bold text-[10px]">{activeOrdersCount} Active</span>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold text-slate-950 tracking-tight truncate">
                    {orders.length}
                  </p>
                  <p className="text-[10px] text-amber-600 font-bold mt-0.5">{activeOrdersCount} in transit</p>
                </div>

                {/* 3. Products */}
                <div
                  onClick={() => setActiveSubTab('products')}
                  className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:border-amber-400 cursor-pointer transition"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span className="font-bold uppercase tracking-wider text-[9.5px]">Catalog Products</span>
                    <span className="text-slate-500 font-bold text-[10px]">{categories.length} Depts</span>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold text-slate-950 tracking-tight truncate">
                    {products.length} Items
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{brands.length} luxury brands</p>
                </div>

                {/* 4. Suppliers */}
                <div
                  onClick={() => setActiveSubTab('suppliers')}
                  className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:border-amber-400 cursor-pointer transition"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span className="font-bold uppercase tracking-wider text-[9.5px]">Suppliers</span>
                    <span className={pendingSuppliers.length > 0 ? "text-rose-600 font-bold text-[10px]" : "text-emerald-600 font-bold text-[10px]"}>
                      {pendingSuppliers.length > 0 ? `⚠️ ${pendingSuppliers.length} pending` : '✓ All Active'}
                    </span>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold text-slate-950 tracking-tight truncate">
                    {suppliers.length}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Approved vendor partners</p>
                </div>

                {/* 5. Total Users */}
                <div
                  onClick={() => setActiveSubTab('users')}
                  className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:border-amber-400 cursor-pointer col-span-2 sm:col-span-1 transition"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span className="font-bold uppercase tracking-wider text-[9.5px]">Total Users</span>
                    <span className="text-emerald-600 font-bold text-[10px]">100% Verified</span>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold text-slate-950 tracking-tight truncate">
                    {users.length}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Customer profiles</p>
                </div>

              </div>

              {/* Sub-item: Pending Actions Highlight */}
              {(activeSubTab === 'overview' || activeSubTab === 'pending') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">
                      Pending Governance Actions ({pendingSuppliers.length + returnRequests.length + lowStockItems.length})
                    </h3>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {/* Pending Suppliers */}
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-amber-950 text-xs">🏢 Vendor Onboarding</span>
                          <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                            {pendingSuppliers.length} Pending
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-800">
                          {pendingSuppliers.length > 0
                            ? `${pendingSuppliers.map(s => s.name).join(', ')} awaiting catalog publishing access.`
                            : 'All vendor credentials and trade licenses are currently approved.'}
                        </p>
                      </div>
                      {pendingSuppliers.length > 0 && (
                        <button
                          onClick={() => handleNavSelect('people', 'suppliers')}
                          className="mt-3 text-left text-xs font-bold text-amber-900 underline"
                        >
                          Review Vendor Documents &rarr;
                        </button>
                      )}
                    </div>

                    {/* Pending Returns */}
                    <div className="rounded-2xl border border-purple-200 bg-purple-50/80 p-4 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-purple-950 text-xs">↩ Return & RMA Requests</span>
                          <span className="text-[10px] font-bold bg-purple-200/80 text-purple-900 px-2 py-0.5 rounded-full">
                            {returnRequests.length} Pending
                          </span>
                        </div>
                        <p className="text-[11px] text-purple-800">
                          {returnRequests.length > 0
                            ? `${returnRequests.length} customer return requests awaiting warehouse RMA decision.`
                            : 'No customer return requests currently pending inspection.'}
                        </p>
                      </div>
                      {returnRequests.length > 0 && (
                        <button
                          onClick={() => handleNavSelect('commerce', 'returns')}
                          className="mt-3 text-left text-xs font-bold text-purple-900 underline"
                        >
                          Review RMA Returns &rarr;
                        </button>
                      )}
                    </div>

                    {/* Low Stock Warnings */}
                    <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-rose-950 text-xs">⚠️ Low Inventory Alerts</span>
                          <span className="text-[10px] font-bold bg-rose-200/80 text-rose-900 px-2 py-0.5 rounded-full">
                            {lowStockItems.length} Low
                          </span>
                        </div>
                        <p className="text-[11px] text-rose-800">
                          {lowStockItems.length > 0
                            ? `${lowStockItems.length} items have less than 5 units left in warehouse bins.`
                            : 'All product inventories are above reorder safety thresholds.'}
                        </p>
                      </div>
                      {lowStockItems.length > 0 && (
                        <button
                          onClick={() => handleNavSelect('operations', 'inventory')}
                          className="mt-3 text-left text-xs font-bold text-rose-900 underline"
                        >
                          Replenish Stock Ledger &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-item: Sales Charts Simulation */}
              {(activeSubTab === 'overview' || activeSubTab === 'charts' || activeSubTab === 'revenue') && (
                <div className="grid gap-6 lg:grid-cols-3">
                  
                  {/* Revenue Trend Chart */}
                  <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">
                          Revenue Performance & Monthly Growth
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Processed GMV breakdown in INR (₹)</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                        Avg Order Value: ₹{Math.round(totalRevenue / Math.max(1, orders.length)).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-44 pt-4 px-1 sm:px-2">
                      {[
                        { month: 'Apr', amount: 84000, height: '40%' },
                        { month: 'May', amount: 112000, height: '55%' },
                        { month: 'Jun', amount: 145000, height: '70%' },
                        { month: 'Jul', amount: 168000, height: '80%' },
                        { month: 'Aug', amount: 195000, height: '92%' },
                        { month: 'Sep', amount: totalRevenue, height: '100%', active: true }
                      ].map(bar => (
                        <div key={bar.month} className="flex flex-col items-center gap-1.5 h-full justify-end group min-w-0">
                          <span className="text-[9px] font-bold font-mono text-slate-600 opacity-0 group-hover:opacity-100 transition truncate">
                            ₹{(bar.amount / 1000).toFixed(0)}k
                          </span>
                          <div
                            style={{ height: bar.height }}
                            className={`w-full rounded-t-xl transition-all duration-300 ${
                              bar.active ? 'bg-gradient-to-t from-[#0B1120] to-amber-500' : 'bg-slate-200 hover:bg-slate-300'
                            }`}
                          />
                          <span className={`text-[10px] font-bold truncate ${bar.active ? 'text-slate-950' : 'text-slate-400'}`}>
                            {bar.month}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category Distribution */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">
                        Department Share
                      </h3>
                      <button onClick={() => handleNavSelect('catalog', 'categories')} className="text-xs font-bold text-[#B89758] hover:underline">
                        Manage
                      </button>
                    </div>

                    <div className="space-y-3">
                      {categories.slice(0, 5).map(cat => {
                        const count = products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
                        const pct = Math.round((count / Math.max(1, products.length)) * 100);
                        return (
                          <div key={cat} className="space-y-1 text-xs">
                            <div className="flex justify-between font-semibold">
                              <span className="text-slate-800 truncate pr-2">{cat}</span>
                              <span className="text-slate-500 font-mono shrink-0">{count} items ({pct}%)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#0F172A] rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* Sub-item: Orders Snapshot */}
              {(activeSubTab === 'overview' || activeSubTab === 'orders') && (
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">
                        Recent Fulfillment Orders
                      </h3>
                      <p className="text-[11px] text-slate-400">Live order status and express courier tracking</p>
                    </div>
                    <button onClick={() => handleNavSelect('commerce', 'orders')} className="text-xs font-bold text-[#B89758] hover:underline shrink-0">
                      View All Orders ({orders.length}) &rarr;
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[650px]">
                      <thead className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase text-[9.5px] font-bold">
                        <tr>
                          <th className="p-3">Order ID</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Items Summary</th>
                          <th className="p-3">Total Amount</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Quick Update</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {orders.slice(0, 4).map(o => (
                          <tr key={o.id} className="hover:bg-slate-50 transition">
                            <td className="p-3 font-mono font-bold text-slate-950">{o.id}</td>
                            <td className="p-3">
                              <p className="font-bold text-slate-900">{o.customer?.firstName} {o.customer?.lastName}</p>
                              <p className="text-[10px] text-slate-400">{o.customer?.city || 'India'}</p>
                            </td>
                            <td className="p-3 text-slate-600">{o.items?.length || 1} items &bull; {o.paymentMethod || 'Online UPI'}</td>
                            <td className="p-3 font-bold text-slate-950">₹{Number(o.total || 0).toLocaleString('en-IN')}</td>
                            <td className="p-3">
                              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9.5px] font-bold ${
                                o.status === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : o.status === 'Shipped'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <select
                                value={o.status}
                                onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                className="rounded-lg border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold cursor-pointer outline-none"
                              >
                                <option value="Confirmed">Confirmed</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ==========================================
              MODULE 2: CATALOG MANAGEMENT
          ========================================== */}
          {activeSection === 'catalog' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Sub-item: Products */}
              {activeSubTab === 'products' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Product Catalog & Inventory
                      </h1>
                      <p className="text-xs text-slate-500">
                        Manage {products.length} luxury products, SKUs, inventory counts, and price tiers.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddProduct}
                      className="rounded-full bg-[#0F172A] hover:bg-black px-5 py-2.5 text-xs font-bold text-white shadow-xs transition self-start sm:self-auto"
                    >
                      + Add New Product
                    </button>
                  </div>

                  {/* Search & Filter Bar */}
                  <div className="grid gap-3 sm:grid-cols-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                    <input
                      type="text"
                      value={searchCatalog}
                      onChange={e => setSearchCatalog(e.target.value)}
                      placeholder="Filter by title, SKU, brand..."
                      className="rounded-xl border border-slate-200 bg-slate-100/80 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                    />

                    <select
                      value={filterCat}
                      onChange={e => {
                        setFilterCat(e.target.value);
                        setFilterBrand('All');
                      }}
                      className="rounded-xl border border-slate-200 bg-slate-100/80 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-slate-400 cursor-pointer font-semibold"
                    >
                      <option value="All">All Departments / Categories</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select
                      value={filterBrand}
                      onChange={e => setFilterBrand(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-slate-100/80 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-slate-400 cursor-pointer font-semibold"
                    >
                      <option value="All">All Brands</option>
                      {(filterCat === 'All' ? brands : getBrandsByCategory(filterCat)).map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Products Master Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[750px]">
                      <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[9.5px] font-bold tracking-wider">
                        <tr>
                          <th className="p-3.5">Product</th>
                          <th className="p-3.5">Category & Brand</th>
                          <th className="p-3.5">SKU & Gender</th>
                          <th className="p-3.5">Price</th>
                          <th className="p-3.5">Stock Controls</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredProducts.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50/80 transition">
                            <td className="p-3.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image || p.images?.[0]}
                                  alt=""
                                  className="h-12 w-12 rounded-xl object-contain bg-slate-100 border border-slate-200 shrink-0 p-1"
                                />
                                <div className="min-w-0">
                                  <span className="font-bold text-slate-950 block truncate max-w-xs">{p.name}</span>
                                  <span className="text-[10px] text-amber-600 font-bold">★ {p.rating || 4.9}</span>
                                </div>
                              </div>
                            </td>

                            <td className="p-3.5">
                              <span className="font-bold text-slate-900 block">{p.category}</span>
                              <span className="text-[10px] text-[#B89758] font-bold">{p.brand}</span>
                            </td>

                            <td className="p-3.5">
                              <span className="font-mono text-slate-700 block">{p.sku}</span>
                              {p.gender && (
                                <span className="text-[10px] text-slate-400 font-semibold">{p.gender}</span>
                              )}
                            </td>

                            <td className="p-3.5">
                              <span className="font-bold text-slate-950 block">₹{Number(p.price).toLocaleString('en-IN')}</span>
                              {p.oldPrice && (
                                <span className="text-[10px] text-slate-400 line-through">₹{Number(p.oldPrice).toLocaleString('en-IN')}</span>
                              )}
                            </td>

                            <td className="p-3.5">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleStockAdjust(p.id, -1)}
                                  className="h-6 w-6 rounded-md bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center text-xs shrink-0"
                                >
                                  −
                                </button>
                                <span className={`font-bold font-mono px-1.5 ${p.stock < 5 ? 'text-rose-600' : 'text-emerald-700'}`}>
                                  {p.stock}
                                </span>
                                <button
                                  onClick={() => handleStockAdjust(p.id, 1)}
                                  className="h-6 w-6 rounded-md bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center text-xs shrink-0"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="rounded-full border border-slate-200 bg-slate-100 hover:bg-slate-200 px-3 py-1 text-xs font-bold text-slate-800 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 transition"
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

              {/* Sub-item: Categories */}
              {activeSubTab === 'categories' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Store Departments & Categories ({categories.length})
                      </h1>
                      <p className="text-xs text-slate-500">Master product departmental classification.</p>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4 h-fit">
                      <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">+ Add Department</h3>
                      <form onSubmit={handleAddCategorySubmit} className="space-y-3">
                        <input
                          type="text"
                          required
                          value={newCatInput}
                          onChange={e => setNewCatInput(e.target.value)}
                          placeholder="e.g. Fine Jewelry, Sunglasses..."
                          className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-bold outline-none focus:bg-white"
                        />
                        <button
                          type="submit"
                          className="w-full rounded-xl bg-[#0F172A] hover:bg-black py-2 text-xs font-bold text-white shadow-xs transition"
                        >
                          Create Category
                        </button>
                      </form>
                    </div>

                    <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3">
                      <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Active Category Hierarchy</h3>
                      <div className="divide-y divide-slate-100">
                        {categories.map(cat => {
                          const count = products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
                          return (
                            <div key={cat} className="flex items-center justify-between py-2.5 text-xs">
                              <div className="flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-700 font-bold text-xs">📁</span>
                                <div>
                                  <span className="font-bold text-slate-950 block">{cat}</span>
                                  <span className="text-[10.5px] text-slate-400">{count} products linked</span>
                                </div>
                              </div>
                              <button
                                onClick={() => deleteCategory(cat)}
                                className="text-slate-400 hover:text-rose-600 font-bold p-1 text-sm"
                                title="Delete Category"
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-item: Subcategories */}
              {activeSubTab === 'subcategories' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Subcategories Taxonomy ({subcategories.length})
                      </h1>
                      <p className="text-xs text-slate-500">Detailed product classification mapped to parent departments.</p>
                    </div>
                    <button
                      onClick={() => setSubcatModalOpen(true)}
                      className="rounded-full bg-[#0F172A] hover:bg-black px-5 py-2 text-xs font-bold text-white shadow-xs"
                    >
                      + Add Subcategory
                    </button>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-3">
                    {subcategories.map(sub => (
                      <div key={sub.id} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono font-bold text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                              {sub.code}
                            </span>
                            <button
                              onClick={() => deleteSubcategory(sub.id)}
                              className="text-slate-400 hover:text-rose-600 font-bold text-xs"
                            >
                              ✕
                            </button>
                          </div>
                          <h4 className="font-bold text-slate-950 text-sm">{sub.name}</h4>
                          <p className="text-[11px] text-amber-700 font-semibold mt-0.5">Parent: {sub.category}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 text-[10.5px] text-slate-400">
                          {sub.itemCount || 0} catalog products mapped
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-item: Brands */}
              {activeSubTab === 'brands' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Authorized Luxury Brands ({brands.length})
                      </h1>
                      <p className="text-xs text-slate-500">Official registered luxury manufacturer partners.</p>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4 h-fit">
                      <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">+ Register Brand</h3>
                      <form onSubmit={handleAddBrandSubmit} className="space-y-3">
                        <input
                          type="text"
                          required
                          value={newBrandInput}
                          onChange={e => setNewBrandInput(e.target.value)}
                          placeholder="e.g. Bulgari, Gucci, Cartier..."
                          className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-bold outline-none focus:bg-white"
                        />
                        <button
                          type="submit"
                          className="w-full rounded-xl bg-[#0F172A] hover:bg-black py-2 text-xs font-bold text-white shadow-xs transition"
                        >
                          Add Brand
                        </button>
                      </form>
                    </div>

                    <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3">
                      <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Brand Directory</h3>
                      <div className="flex flex-wrap gap-2">
                        {brands.map(b => {
                          const count = products.filter(p => p.brand?.toLowerCase() === b.toLowerCase()).length;
                          return (
                            <span key={b} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-800">
                              <span>{b}</span>
                              {count > 0 && <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-full">{count}</span>}
                              <button onClick={() => deleteBrand(b)} className="text-slate-400 hover:text-rose-600 font-bold ml-1">✕</button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-item: Variants */}
              {activeSubTab === 'variants' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Product Variants & Attribute Matrix
                      </h1>
                      <p className="text-xs text-slate-500">Configure size, color, strap material, and storage variations.</p>
                    </div>
                    <button
                      onClick={() => setVariantModalOpen(true)}
                      className="rounded-full bg-[#0F172A] hover:bg-black px-5 py-2 text-xs font-bold text-white shadow-xs"
                    >
                      + Create Variant
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[9.5px] font-bold">
                        <tr>
                          <th className="p-3.5">Product</th>
                          <th className="p-3.5">Variant SKU</th>
                          <th className="p-3.5">Attribute & Option</th>
                          <th className="p-3.5">Price Delta</th>
                          <th className="p-3.5">Inventory</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {variants.map(v => (
                          <tr key={v.id} className="hover:bg-slate-50">
                            <td className="p-3.5 font-bold text-slate-950">{v.productName}</td>
                            <td className="p-3.5 font-mono text-slate-600">{v.sku}</td>
                            <td className="p-3.5">
                              <span className="font-bold text-slate-900">{v.attributeType}:</span> {v.value}
                            </td>
                            <td className="p-3.5 font-bold text-slate-900">
                              {v.priceModifier > 0 ? `+ ₹${v.priceModifier.toLocaleString('en-IN')}` : 'Base Price'}
                            </td>
                            <td className="p-3.5 font-bold font-mono text-emerald-700">{v.stock} in stock</td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => deleteVariant(v.id)}
                                className="text-slate-400 hover:text-rose-600 font-bold p-1"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-item: Images & Media Asset Manager */}
              {activeSubTab === 'images' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Media & Image Asset Gallery ({mediaAssets.length})
                      </h1>
                      <p className="text-xs text-slate-500">High-resolution catalog media assets, previews, and URLs.</p>
                    </div>
                    <button
                      onClick={() => setMediaModalOpen(true)}
                      className="rounded-full bg-[#0F172A] hover:bg-black px-5 py-2 text-xs font-bold text-white shadow-xs"
                    >
                      + Index Media Asset
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {mediaAssets.map(m => (
                      <div key={m.id} className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xs space-y-2.5">
                        <div className="h-44 w-full bg-slate-100 rounded-xl overflow-hidden relative group">
                          <img src={m.url} alt={m.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText(m.url);
                              showToast('Image URL copied to clipboard!');
                            }}
                            className="absolute bottom-2 right-2 rounded-lg bg-black/70 hover:bg-black text-white px-2.5 py-1 text-[10.5px] font-bold backdrop-blur-xs transition"
                          >
                            📋 Copy URL
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-slate-950 text-xs truncate max-w-[180px]">{m.title}</h4>
                            <p className="text-[10px] text-slate-400">{m.dimensions} &bull; {m.size}</p>
                          </div>
                          <button
                            onClick={() => deleteMediaAsset(m.id)}
                            className="text-slate-400 hover:text-rose-600 font-bold p-1 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ==========================================
              MODULE 3: COMMERCE MANAGEMENT
          ========================================== */}
          {activeSection === 'commerce' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Sub-item: Orders */}
              {activeSubTab === 'orders' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Orders & Shipments Lifecycle
                      </h1>
                      <p className="text-xs text-slate-500">
                        Master fulfillment registry for {orders.length} transactions.
                      </p>
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
                      {['All', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Return Requested', 'Refunded', 'Cancelled'].map(st => (
                        <button
                          key={st}
                          onClick={() => setOrderStatusFilter(st)}
                          className={`rounded-full px-3 py-1 text-xs font-bold transition whitespace-nowrap ${
                            orderStatusFilter === st
                              ? 'bg-[#0F172A] text-amber-200 shadow-2xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[800px]">
                      <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[9.5px] font-bold">
                        <tr>
                          <th className="p-3.5">Order ID & Date</th>
                          <th className="p-3.5">Customer</th>
                          <th className="p-3.5">Payment Method</th>
                          <th className="p-3.5">Invoice Amount</th>
                          <th className="p-3.5">Fulfillment Status</th>
                          <th className="p-3.5 text-right">Actions & Lifecycle</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-50 transition">
                            <td className="p-3.5">
                              <span className="font-mono font-bold text-slate-950 block">{order.id}</span>
                              <span className="text-[10px] text-slate-400">{order.date}</span>
                            </td>

                            <td className="p-3.5">
                              <span className="font-bold text-slate-900 block">{order.customer?.firstName} {order.customer?.lastName}</span>
                              <span className="text-[10px] text-slate-500">{order.customer?.city}, {order.customer?.state}</span>
                            </td>

                            <td className="p-3.5">
                              <span className="text-slate-800 font-semibold">{order.paymentMethod || 'Online Gateway'}</span>
                              <span className={`text-[10px] font-bold block ${
                                order.paymentStatus === 'Refunded' ? 'text-purple-700' : 'text-emerald-700'
                              }`}>
                                {order.paymentStatus || 'Paid'}
                              </span>
                            </td>

                            <td className="p-3.5 font-bold text-slate-950">
                              ₹{Number(order.total || 0).toLocaleString('en-IN')}
                            </td>

                            <td className="p-3.5">
                              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9.5px] font-bold ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : order.status === 'Shipped'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : order.status === 'Cancelled'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : order.status === 'Refunded'
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : order.status === 'Return Requested'
                                  ? 'bg-purple-50 text-purple-800 border border-purple-200 font-bold animate-pulse'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {order.status}
                              </span>
                            </td>

                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {order.status === 'Return Requested' && (
                                  <button
                                    onClick={() => handleOpenAdminReturnModal(order)}
                                    className="rounded-lg bg-purple-700 hover:bg-purple-800 text-white px-2.5 py-1 text-[11px] font-bold shadow-2xs transition shrink-0"
                                  >
                                    Review Return
                                  </button>
                                )}

                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                  className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-900 outline-none cursor-pointer"
                                >
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Out for Delivery">Out for Delivery</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Return Requested">Return Requested</option>
                                  <option value="Refunded">Refunded</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-item: Payments */}
              {activeSubTab === 'payments' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Payments Ledger & Gateway Reconciliation
                      </h1>
                      <p className="text-xs text-slate-500">Real-time payment settlements, PG fee breakdown, and transaction status.</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Total Settled Volume</span>
                      <p className="text-2xl font-bold text-slate-950 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-emerald-700 font-semibold mt-1">✓ 100% 256-Bit SSL Encrypted</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Gateway Processing Fees (Est. 2%)</span>
                      <p className="text-2xl font-bold text-slate-950 mt-1">₹{Math.round(totalRevenue * 0.02).toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-slate-500 mt-1">Razorpay / UPI Interchange</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Net Merchant Payout</span>
                      <p className="text-2xl font-bold text-emerald-700 mt-1">₹{Math.round(totalRevenue * 0.98).toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-slate-500 mt-1">Direct Bank Account Credit</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[750px]">
                      <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[9.5px] font-bold">
                        <tr>
                          <th className="p-3.5">Txn ID & Date</th>
                          <th className="p-3.5">Order Ref</th>
                          <th className="p-3.5">Customer & Method</th>
                          <th className="p-3.5">Gross Amount</th>
                          <th className="p-3.5">Gateway Fee</th>
                          <th className="p-3.5">Net Payout</th>
                          <th className="p-3.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {paymentTransactions.map(txn => (
                          <tr key={txn.id} className="hover:bg-slate-50">
                            <td className="p-3.5">
                              <span className="font-mono font-bold text-slate-950 block">{txn.id}</span>
                              <span className="text-[10px] text-slate-400">{txn.date}</span>
                            </td>
                            <td className="p-3.5 font-mono font-bold text-slate-700">{txn.orderId}</td>
                            <td className="p-3.5">
                              <span className="font-bold text-slate-900 block">{txn.customer}</span>
                              <span className="text-[10.5px] text-slate-500">{txn.method}</span>
                            </td>
                            <td className="p-3.5 font-bold text-slate-950">₹{txn.amount.toLocaleString('en-IN')}</td>
                            <td className="p-3.5 text-slate-500">₹{txn.fee.toLocaleString('en-IN')}</td>
                            <td className="p-3.5 font-bold text-emerald-700">₹{txn.netSettlement.toLocaleString('en-IN')}</td>
                            <td className="p-3.5 text-right">
                              <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[9.5px] font-bold">
                                {txn.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-item: Returns */}
              {activeSubTab === 'returns' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Customer Returns & RMA Desk
                      </h1>
                      <p className="text-xs text-slate-500">Review inspection notes, return conditions, and authorize reverse logistics.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[750px]">
                      <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[9.5px] font-bold">
                        <tr>
                          <th className="p-3.5">Order Ref</th>
                          <th className="p-3.5">Customer Details</th>
                          <th className="p-3.5">Return Reason & Notes</th>
                          <th className="p-3.5">Amount</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {orders.filter(o => o.status === 'Return Requested' || o.returnRequest).map(order => (
                          <tr key={order.id} className="hover:bg-slate-50">
                            <td className="p-3.5 font-mono font-bold text-slate-950">{order.id}</td>
                            <td className="p-3.5">
                              <span className="font-bold text-slate-900 block">{order.customer?.firstName} {order.customer?.lastName}</span>
                              <span className="text-[10px] text-slate-400">{order.customer?.city}</span>
                            </td>
                            <td className="p-3.5">
                              <p className="font-bold text-purple-950">{order.returnRequest?.reason || 'Exchange Requested'}</p>
                              <p className="text-[10.5px] text-slate-500">Condition: {order.returnRequest?.condition || 'Inspected'}</p>
                            </td>
                            <td className="p-3.5 font-bold text-slate-950">₹{order.total?.toLocaleString('en-IN')}</td>
                            <td className="p-3.5">
                              <span className="rounded-full bg-purple-100 text-purple-800 px-2.5 py-0.5 text-[9.5px] font-bold">
                                {order.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleOpenAdminReturnModal(order)}
                                className="rounded-full bg-purple-700 hover:bg-purple-800 text-white px-3.5 py-1 text-xs font-bold transition shadow-xs"
                              >
                                Review & Refund &rarr;
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-item: Refunds */}
              {activeSubTab === 'refunds' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Refunds Disbursement Ledger
                      </h1>
                      <p className="text-xs text-slate-500">Track refunded invoices and banking transaction IDs.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[9.5px] font-bold">
                        <tr>
                          <th className="p-3.5">Refund Ref</th>
                          <th className="p-3.5">Order ID</th>
                          <th className="p-3.5">Customer & Mode</th>
                          <th className="p-3.5">Refund Amount</th>
                          <th className="p-3.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {refundsList.map(o => (
                          <tr key={o.id} className="hover:bg-slate-50">
                            <td className="p-3.5 font-mono font-bold text-slate-950">
                              {o.refundDetails?.transactionId || `REF-${o.id.replace(/[^0-9]/g, '')}`}
                            </td>
                            <td className="p-3.5 font-mono text-slate-700">{o.id}</td>
                            <td className="p-3.5">
                              <span className="font-bold text-slate-900 block">{o.customer?.firstName} {o.customer?.lastName}</span>
                              <span className="text-[10.5px] text-slate-500">{o.paymentMethod}</span>
                            </td>
                            <td className="p-3.5 font-bold text-emerald-700">₹{Number(o.total || 0).toLocaleString('en-IN')}</td>
                            <td className="p-3.5 text-right">
                              <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[9.5px] font-bold">
                                Settled
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-item: Coupons */}
              {activeSubTab === 'coupons' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Coupons & Discount Vouchers
                      </h1>
                      <p className="text-xs text-slate-500">Create discount promo codes and minimum spend rules.</p>
                    </div>
                  </div>

                  <form onSubmit={handleAddCoupon} className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs grid gap-3 sm:grid-cols-4 items-end">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Promo Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. FESTIVE20"
                        value={newCouponCode}
                        onChange={e => setNewCouponCode(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-mono font-bold uppercase outline-none focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Discount (% or Flat ₹) *</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 20"
                        value={newCouponDiscount}
                        onChange={e => setNewCouponDiscount(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-bold outline-none focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Min Order Spend (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 5000"
                        value={newCouponMin}
                        onChange={e => setNewCouponMin(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-bold outline-none focus:bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-xl bg-[#0F172A] hover:bg-black py-2.5 text-xs font-bold text-white shadow-xs transition"
                    >
                      + Generate Coupon
                    </button>
                  </form>

                  <div className="grid gap-3.5 sm:grid-cols-3">
                    {coupons.map(c => (
                      <div key={c.code} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono font-bold text-sm bg-slate-100 px-2.5 py-0.5 rounded-lg text-slate-900 border border-slate-200">
                              {c.code}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              {c.status}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-800">{c.discount}% Instant Off</p>
                          <p className="text-[10.5px] text-slate-500 mt-0.5">
                            Min spend: ₹{c.minSpend.toLocaleString('en-IN')} &bull; Used {c.usageCount} times
                          </p>
                        </div>
                        <div className="mt-4 pt-2 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={() => setCoupons(prev => prev.filter(cp => cp.code !== c.code))}
                            className="text-xs font-bold text-rose-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-item: Promotions */}
              {activeSubTab === 'promotions' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Marketing Promotions & Campaign Banners
                      </h1>
                      <p className="text-xs text-slate-500">Run seasonal sales, flash discounts, and hero storefront banners.</p>
                    </div>
                    <button
                      onClick={() => setPromoModalOpen(true)}
                      className="rounded-full bg-[#0F172A] hover:bg-black px-5 py-2 text-xs font-bold text-white shadow-xs"
                    >
                      + Create Promotion
                    </button>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {promotions.map(p => (
                      <div key={p.id} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-lg">
                            {p.code}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {p.status}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-950 text-sm">{p.title}</h4>
                          <p className="text-xs font-bold text-amber-700 mt-0.5">{p.discount} &bull; {p.targetCategory}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10.5px] text-slate-400">
                          <span>{p.impressions.toLocaleString()} views &bull; {p.clicks.toLocaleString()} clicks</span>
                          <button onClick={() => deletePromotion(p.id)} className="text-rose-600 font-bold hover:underline">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ==========================================
              MODULE 4: PEOPLE MANAGEMENT
          ========================================== */}
          {activeSection === 'people' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Sub-item: Users */}
              {activeSubTab === 'users' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Customer & User Accounts ({users.length})
                      </h1>
                      <p className="text-xs text-slate-500">Manage buyer accounts, order histories, and account statuses.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[650px]">
                      <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[9.5px] font-bold">
                        <tr>
                          <th className="p-3.5">Customer Name</th>
                          <th className="p-3.5">Email</th>
                          <th className="p-3.5">Phone</th>
                          <th className="p-3.5">Role</th>
                          <th className="p-3.5">Total Orders</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Access Control</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {users.map(u => (
                          <tr key={u.id} className="hover:bg-slate-50 transition">
                            <td className="p-3.5 font-bold text-slate-950">{u.name}</td>
                            <td className="p-3.5 text-slate-700">{u.email}</td>
                            <td className="p-3.5 text-slate-600 font-mono">{u.phone}</td>
                            <td className="p-3.5">
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800 uppercase">
                                {u.role}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold font-mono text-slate-900">{u.ordersCount || 0} orders</td>
                            <td className="p-3.5">
                              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9.5px] font-bold ${
                                u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                              }`}>
                                {u.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => toggleUserStatus(u.id, u.status === 'Active' ? 'Blocked' : 'Active')}
                                className={`rounded-full px-3 py-1 text-xs font-bold transition whitespace-nowrap ${
                                  u.status === 'Active'
                                    ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                                    : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                }`}
                              >
                                {u.status === 'Active' ? 'Block User' : 'Unblock'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-item: Suppliers */}
              {activeSubTab === 'suppliers' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Supplier Partners & Verification ({suppliers.length})
                      </h1>
                      <p className="text-xs text-slate-500">Approve vendor credentials, verify GSTIN, and monitor supplier fulfillment.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[9.5px] font-bold">
                        <tr>
                          <th className="p-3.5">Vendor Company</th>
                          <th className="p-3.5">Contact Details</th>
                          <th className="p-3.5">Department</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Verification Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {suppliers.map(s => (
                          <tr key={s.id} className="hover:bg-slate-50 transition">
                            <td className="p-3.5">
                              <span className="font-bold text-slate-950 block">{s.name}</span>
                              <span className="text-[10px] text-slate-400">Joined: {s.joinedDate}</span>
                            </td>

                            <td className="p-3.5">
                              <p className="text-slate-900 font-semibold">{s.email}</p>
                              <p className="text-[10px] text-slate-400">{s.phone}</p>
                            </td>

                            <td className="p-3.5">
                              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10.5px] font-bold text-slate-800">
                                {s.category}
                              </span>
                            </td>

                            <td className="p-3.5">
                              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9.5px] font-bold ${
                                s.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {s.status}
                              </span>
                            </td>

                            <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                              {s.status === 'Pending Approval' ? (
                                <button
                                  onClick={() => approveSupplier(s.id)}
                                  className="rounded-full bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1 text-xs font-bold text-white shadow-2xs transition"
                                >
                                  ✓ Approve Vendor
                                </button>
                              ) : (
                                <button
                                  onClick={() => toggleSupplierStatus(s.id, s.status === 'Active' ? 'Suspended' : 'Active')}
                                  className="rounded-full border border-slate-200 bg-slate-100 hover:bg-slate-200 px-3.5 py-1 text-xs font-bold text-slate-700"
                                >
                                  {s.status === 'Active' ? 'Suspend' : 'Reactivate'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-item: Roles */}
              {activeSubTab === 'roles' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Governance Roles & Staff Access
                      </h1>
                      <p className="text-xs text-slate-500">Define staff responsibilities and module access hierarchies.</p>
                    </div>
                    <button
                      onClick={() => setRoleModalOpen(true)}
                      className="rounded-full bg-[#0F172A] hover:bg-black px-5 py-2 text-xs font-bold text-white shadow-xs"
                    >
                      + Add Custom Role
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {roles.map(r => (
                      <div key={r.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold text-xs px-3 py-1 rounded-full border ${r.color || 'bg-slate-100 text-slate-800'}`}>
                            {r.name}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">{r.membersCount} Assigned Users</span>
                        </div>
                        <p className="text-xs text-slate-600">{r.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-item: Permissions */}
              {activeSubTab === 'permissions' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Granular Permissions Matrix
                      </h1>
                      <p className="text-xs text-slate-500">Module-level Read / Write / Delete / Full access rights.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[9.5px] font-bold">
                        <tr>
                          <th className="p-3.5">Role</th>
                          <th className="p-3.5 text-center">Dashboard</th>
                          <th className="p-3.5 text-center">Catalog</th>
                          <th className="p-3.5 text-center">Commerce</th>
                          <th className="p-3.5 text-center">People</th>
                          <th className="p-3.5 text-center">Operations</th>
                          <th className="p-3.5 text-center">Analytics</th>
                          <th className="p-3.5 text-center">System</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {roles.map(r => {
                          const perms = permissionsMatrix[r.slug] || {};
                          return (
                            <tr key={r.id} className="hover:bg-slate-50">
                              <td className="p-3.5 font-bold text-slate-950">{r.name}</td>
                              {['dashboard', 'catalog', 'commerce', 'people', 'operations', 'analytics', 'system'].map(mod => (
                                <td key={mod} className="p-3.5 text-center">
                                  <span className={`inline-block rounded-full px-2 py-0.5 text-[9.5px] font-bold ${
                                    perms[mod] === 'Full'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : perms[mod] === 'Write'
                                      ? 'bg-blue-100 text-blue-800'
                                      : perms[mod] === 'Read'
                                      ? 'bg-slate-100 text-slate-700'
                                      : 'bg-rose-50 text-rose-500'
                                  }`}>
                                    {perms[mod] || 'None'}
                                  </span>
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ==========================================
              MODULE 5: OPERATIONS
          ========================================== */}
          {activeSection === 'operations' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Sub-item: Inventory */}
              {activeSubTab === 'inventory' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Warehouse Inventory & Bin Locations
                      </h1>
                      <p className="text-xs text-slate-500">Real-time stock ledger across physical storage racks.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[9.5px] font-bold">
                        <tr>
                          <th className="p-3.5">Product & SKU</th>
                          <th className="p-3.5">Category</th>
                          <th className="p-3.5">Warehouse Location</th>
                          <th className="p-3.5">Stock Status</th>
                          <th className="p-3.5 text-right">Quick Restock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {products.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="p-3.5">
                              <span className="font-bold text-slate-950 block">{p.name}</span>
                              <span className="font-mono text-[10.5px] text-slate-400">{p.sku}</span>
                            </td>
                            <td className="p-3.5 text-slate-700">{p.category}</td>
                            <td className="p-3.5 font-mono text-slate-600">WH-1 / Bay-{(p.id % 8) + 1}</td>
                            <td className="p-3.5 font-bold">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9.5px] ${
                                p.stock < 5 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {p.stock} units
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleStockAdjust(p.id, 10)}
                                className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1 text-xs font-bold transition"
                              >
                                +10 Restock
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-item: Shipping */}
              {activeSubTab === 'shipping' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Courier Logistics & Carrier Partners
                      </h1>
                      <p className="text-xs text-slate-500">Manage BlueDart, Delhivery, FedEx priority integrations.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {shippingCarriers.map(c => (
                      <div key={c.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-slate-950 text-sm">{c.name}</h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-bold ${c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                              {c.active ? 'Active Carrier' : 'Disabled'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">Service: {c.serviceType} &bull; Transit: {c.avgTransit}</p>
                          <p className="text-[10.5px] text-slate-400 mt-1">{c.shipmentsHandled} dispatches handled &bull; Rating: ★ {c.rating}</p>
                        </div>
                        <div className="mt-4 pt-2 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={() => toggleCarrierStatus(c.id)}
                            className={`rounded-full px-3.5 py-1 text-xs font-bold transition ${
                              c.active ? 'border border-rose-200 bg-rose-50 text-rose-700' : 'bg-emerald-600 text-white'
                            }`}
                          >
                            {c.active ? 'Disable Carrier' : 'Enable Carrier'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-item: Order Status Pipeline */}
              {activeSubTab === 'order-status' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Live Order Status Pipeline
                      </h1>
                      <p className="text-xs text-slate-500">Visual fulfillment stages tracker across order lifecycle.</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                    {['Confirmed', 'Processing', 'Shipped', 'Delivered'].map(stage => {
                      const stageOrders = orders.filter(o => o.status === stage);
                      return (
                        <div key={stage} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="font-bold text-xs text-slate-950 uppercase">{stage}</span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                              {stageOrders.length}
                            </span>
                          </div>
                          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                            {stageOrders.map(o => (
                              <div key={o.id} className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs space-y-1">
                                <div className="flex justify-between font-bold">
                                  <span className="font-mono text-slate-950">{o.id}</span>
                                  <span className="text-amber-700">₹{o.total?.toLocaleString('en-IN')}</span>
                                </div>
                                <p className="text-[11px] text-slate-600 truncate">{o.customer?.firstName} {o.customer?.lastName}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-item: Notifications Broadcast */}
              {activeSubTab === 'notifications' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        System Notifications & Broadcast Center
                      </h1>
                      <p className="text-xs text-slate-500">Broadcast platform announcements to users and vendors.</p>
                    </div>
                  </div>

                  <form onSubmit={handleBroadcastNotification} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3">
                    <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Broadcast Announcement</h3>
                    <input
                      type="text"
                      required
                      value={newNotificationTitle}
                      onChange={e => setNewNotificationTitle(e.target.value)}
                      placeholder="Notification Title (e.g. Scheduled Maintenance, Festive VIP Sale)..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-bold outline-none focus:bg-white"
                    />
                    <textarea
                      rows={2}
                      required
                      value={newNotificationText}
                      onChange={e => setNewNotificationText(e.target.value)}
                      placeholder="Message content delivered to all active sessions..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs outline-none focus:bg-white resize-none"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-[#0F172A] hover:bg-black px-6 py-2 text-xs font-bold text-white shadow-xs transition"
                    >
                      📢 Broadcast Notification
                    </button>
                  </form>

                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-bold text-slate-950 uppercase">Notification History ({notifications.length})</h3>
                      <button onClick={clearNotifications} className="text-xs font-bold text-rose-600 hover:underline">
                        Clear All
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {notifications.map(n => (
                        <div key={n.id} className="py-2.5 text-xs flex justify-between items-start">
                          <div>
                            <span className="font-bold text-slate-950 block">{n.title}</span>
                            <p className="text-[11px] text-slate-600 mt-0.5">{n.message}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">{n.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ==========================================
              MODULE 6: ANALYTICS
          ========================================== */}
          {activeSection === 'analytics' && (
            <div className="space-y-6 animate-fade-in">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                    Business Intelligence & Executive Analytics
                  </h1>
                  <p className="text-xs text-slate-500">
                    In-depth sales metrics, vendor conversion, and customer lifetime value.
                  </p>
                </div>
                <button
                  onClick={() => alert("Comprehensive Analytics Report exported as CSV.")}
                  className="rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-800 transition shadow-2xs self-start sm:self-auto"
                >
                  📥 Export CSV Report
                </button>
              </div>

              {/* Sub-item: Daily Sales */}
              {(activeSubTab === 'daily-sales' || activeSubTab === 'overview') && (
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Daily Sales & Volume Breakdown</h3>
                  <div className="grid gap-3 sm:grid-cols-4">
                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Today's Processed GMV</span>
                      <p className="text-xl font-bold text-slate-950 mt-1">₹48,990</p>
                      <p className="text-[10px] text-emerald-700 font-bold mt-0.5">↑ +14.2% vs yesterday</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Daily Orders</span>
                      <p className="text-xl font-bold text-slate-950 mt-1">4 Orders</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">100% successful gateway checkout</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Peak Sales Hour</span>
                      <p className="text-xl font-bold text-slate-950 mt-1">08:00 PM - 10:00 PM</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Evening prime purchasing</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Conversion Rate</span>
                      <p className="text-xl font-bold text-emerald-700 mt-1">4.2%</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Above luxury industry benchmark</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-item: Monthly Sales */}
              {(activeSubTab === 'monthly-sales' || activeSubTab === 'overview') && (
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Month-on-Month Revenue Growth</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase text-[9.5px] font-bold">
                        <tr>
                          <th className="p-3">Month</th>
                          <th className="p-3">Gross Revenue</th>
                          <th className="p-3">Orders Count</th>
                          <th className="p-3">Average Order Value</th>
                          <th className="p-3 text-right">Growth Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {[
                          { m: 'September 2026', rev: totalRevenue, orders: orders.length, aov: Math.round(totalRevenue / Math.max(1, orders.length)), growth: '+21.5%' },
                          { m: 'August 2026', rev: 195000, orders: 5, aov: 39000, growth: '+16.0%' },
                          { m: 'July 2026', rev: 168000, orders: 4, aov: 42000, growth: '+15.8%' },
                          { m: 'June 2026', rev: 145000, orders: 4, aov: 36250, growth: '+29.4%' }
                        ].map(row => (
                          <tr key={row.m} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-950">{row.m}</td>
                            <td className="p-3 font-bold text-slate-900">₹{row.rev.toLocaleString('en-IN')}</td>
                            <td className="p-3">{row.orders} orders</td>
                            <td className="p-3 font-mono">₹{row.aov.toLocaleString('en-IN')}</td>
                            <td className="p-3 text-right font-bold text-emerald-700">{row.growth}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-item: Product Performance */}
              {(activeSubTab === 'product-perf' || activeSubTab === 'overview') && (
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Top Performing Products Leaderboard</h3>
                  <div className="divide-y divide-slate-100">
                    {products.slice(0, 5).map((p, idx) => (
                      <div key={p.id} className="flex items-center justify-between py-3 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                            #{idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-slate-950 block">{p.name}</span>
                            <span className="text-[10px] text-slate-400">{p.brand} &bull; {p.category}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-950 block">₹{Number(p.price).toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-emerald-700 font-bold">★ {p.rating || 4.9} ({p.reviews || 50} reviews)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-item: Supplier Performance */}
              {activeSubTab === 'supplier-perf' && (
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Supplier Performance & SLA Scorecard</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {suppliers.map(s => (
                      <div key={s.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2 text-xs">
                        <div className="flex justify-between font-bold text-slate-950">
                          <span>{s.name}</span>
                          <span className="text-amber-600">★ {s.rating || 4.8}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">Department: {s.category}</p>
                        <div className="flex justify-between pt-2 border-t border-slate-200/60 font-semibold text-[10.5px]">
                          <span>Fulfillment Rate: 99.4%</span>
                          <span>On-Time Dispatch: 98.2%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-item: Customer Reports */}
              {activeSubTab === 'customer-reports' && (
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Customer Lifetime Value (LTV) & VIP Buyers</h3>
                  <div className="divide-y divide-slate-100">
                    {users.map(u => (
                      <div key={u.id} className="flex items-center justify-between py-3 text-xs">
                        <div>
                          <span className="font-bold text-slate-950 block">{u.name}</span>
                          <span className="text-[10px] text-slate-400">{u.email}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-950 block">₹{(u.totalSpent || 42997).toLocaleString('en-IN')} LTV</span>
                          <span className="text-[10px] text-amber-700 font-bold">{u.ordersCount || 3} lifetime orders</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ==========================================
              MODULE 7: SYSTEM
          ========================================== */}
          {activeSection === 'system' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Sub-item: Settings */}
              {activeSubTab === 'settings' && (
                <div className="space-y-5 max-w-2xl">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                      Store Global Settings
                    </h1>
                    <p className="text-xs text-slate-500">General preferences, concierge contact info, and tax rates.</p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Store Legal Name</label>
                      <input
                        type="text"
                        value={systemConfig.storeName}
                        onChange={e => setSystemConfigState({ ...systemConfig, storeName: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-bold outline-none focus:bg-white"
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Support Email</label>
                        <input
                          type="email"
                          value={systemConfig.supportEmail}
                          onChange={e => setSystemConfigState({ ...systemConfig, supportEmail: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs outline-none focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Support Hotline</label>
                        <input
                          type="text"
                          value={systemConfig.supportPhone}
                          onChange={e => setSystemConfigState({ ...systemConfig, supportPhone: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs outline-none focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Free Shipping Threshold (₹)</label>
                        <input
                          type="number"
                          value={systemConfig.freeShippingThreshold}
                          onChange={e => setSystemConfigState({ ...systemConfig, freeShippingThreshold: Number(e.target.value) })}
                          className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs outline-none focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Standard GST Rate (%)</label>
                        <input
                          type="number"
                          value={systemConfig.taxGSTRate}
                          onChange={e => setSystemConfigState({ ...systemConfig, taxGSTRate: Number(e.target.value) })}
                          className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs outline-none focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="rounded-full bg-[#0F172A] hover:bg-black px-6 py-2.5 text-xs font-bold text-white shadow-xs transition"
                      >
                        Save Configuration
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Sub-item: Audit Logs */}
              {activeSubTab === 'audit-logs' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Immutable Security & Audit Trail
                      </h1>
                      <p className="text-xs text-slate-500">Chronological security ledger of all administrative events.</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 bg-white divide-y divide-slate-100 shadow-2xs">
                    {auditLogs.map(log => (
                      <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition text-xs">
                        <div className="min-w-0 pr-2">
                          <span className="font-bold text-slate-900 block">{log.action}</span>
                          <p className="text-slate-600 mt-0.5">{log.detail}</p>
                          <span className="text-[10px] text-slate-400 font-mono">IP: {log.ip || '103.21.144.20'}</span>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <span className="font-mono text-[10px] text-slate-400 block">{log.time}</span>
                          <p className="text-[10.5px] font-bold text-[#B89758]">{log.admin}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-item: Security */}
              {activeSubTab === 'security' && (
                <div className="space-y-5 max-w-2xl">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                      Security Policies & Access Guard
                    </h1>
                    <p className="text-xs text-slate-500">Manage 2FA, session timeouts, and password governance.</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-950 block">Two-Factor Authentication (2FA)</span>
                        <p className="text-slate-500 text-[11px]">Require OTP verification on Super Admin sign-in</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 text-emerald-800 font-bold px-3 py-1 text-[10px]">
                        Enforced Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-950 block">Session Timeout Duration</span>
                        <p className="text-slate-500 text-[11px]">Automatically terminate inactive administrative sessions</p>
                      </div>
                      <span className="font-mono font-bold text-slate-800">60 Minutes</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-950 block">Password Complexity Policy</span>
                        <p className="text-slate-500 text-[11px]">Strict enforcement of numbers, symbols, and casing</p>
                      </div>
                      <span className="rounded-full bg-slate-100 text-slate-700 font-bold px-3 py-1 text-[10px]">
                        High Enterprise
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-item: Backups */}
              {activeSubTab === 'backups' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        Database Snapshots & Disaster Recovery
                      </h1>
                      <p className="text-xs text-slate-500">Export complete platform JSON backup or restore from archive.</p>
                    </div>
                    <button
                      onClick={handleDownloadBackup}
                      className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 text-xs font-bold shadow-xs transition"
                    >
                      💾 Export JSON Backup
                    </button>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3">
                      <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Automated Backup Schedule</h3>
                      <p className="text-xs text-slate-600">
                        Nightly snapshots are saved automatically to redundant storage.
                      </p>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <p className="font-bold text-slate-900">Last Snapshot: Today at 04:30 AM</p>
                        <p className="text-slate-500 text-[11px]">Includes: Products, Orders, Suppliers, Users, Media, Config</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3">
                      <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Restore Database from JSON</h3>
                      <textarea
                        rows={3}
                        value={backupJsonInput}
                        onChange={e => setBackupJsonInput(e.target.value)}
                        placeholder="Paste exported backup JSON content here to restore state..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-xs font-mono outline-none focus:bg-white resize-none"
                      />
                      <button
                        onClick={handleRestoreBackup}
                        className="rounded-xl bg-[#0F172A] hover:bg-black px-4 py-2 text-xs font-bold text-white shadow-xs"
                      >
                        Restore Database Snapshot
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-item: Configuration */}
              {activeSubTab === 'configuration' && (
                <div className="space-y-5 max-w-2xl">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                      System Infrastructure & Gateways
                    </h1>
                    <p className="text-xs text-slate-500">API keys, SMTP mailer status, and maintenance mode toggles.</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-950 block">Payment Gateway (Razorpay API)</span>
                        <p className="text-slate-500 text-[11px]">Production merchant keys active</p>
                      </div>
                      <span className="text-emerald-700 font-bold">✓ Live Production</span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-950 block">Transactional Email SMTP</span>
                        <p className="text-slate-500 text-[11px]">{systemConfig.smtpMailerStatus}</p>
                      </div>
                      <span className="text-emerald-700 font-bold">✓ Connected</span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-950 block">SMS Notification Gateway</span>
                        <p className="text-slate-500 text-[11px]">{systemConfig.smsGatewayStatus}</p>
                      </div>
                      <span className="text-emerald-700 font-bold">✓ Active</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="font-bold text-slate-950 block">Storefront Maintenance Mode</span>
                        <p className="text-slate-500 text-[11px]">Temporary downtime overlay for customers</p>
                      </div>
                      <button
                        onClick={() => {
                          const updated = saveSystemConfig({ maintenanceMode: !systemConfig.maintenanceMode });
                          setSystemConfigState(updated);
                          showToast(updated.maintenanceMode ? 'Maintenance Mode activated' : 'Store is live');
                        }}
                        className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                          systemConfig.maintenanceMode ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {systemConfig.maintenanceMode ? 'Mode: Active (Store Offline)' : 'Mode: Inactive (Store Live)'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </main>

      </div>

      {/* ==========================================
          MODALS
      ========================================== */}

      {/* 1. Add/Edit Product Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-950">
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Catalog'}
                </h3>
                <p className="text-xs text-slate-500">Live synchronization with customer storefront</p>
              </div>
              <button
                onClick={() => setProductModalOpen(false)}
                className="text-slate-400 hover:text-black font-bold p-1 text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Submariner Date 41mm Cerachrom"
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 outline-none focus:bg-white focus:border-slate-400"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department *</label>
                  <select
                    value={productForm.category}
                    onChange={e => {
                      const newCat = e.target.value;
                      const catBrands = getBrandsByCategory(newCat);
                      setProductForm({
                        ...productForm,
                        category: newCat,
                        brand: catBrands[0] || brands[0]
                      });
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none focus:bg-white font-semibold cursor-pointer"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand *</label>
                  <select
                    value={productForm.brand}
                    onChange={e => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none focus:bg-white font-semibold cursor-pointer"
                  >
                    {(getBrandsByCategory(productForm.category) || brands).map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender / Dept</label>
                  <select
                    value={productForm.gender}
                    onChange={e => setProductForm({ ...productForm, gender: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none focus:bg-white font-semibold cursor-pointer"
                  >
                    <option value="Men's">Men's</option>
                    <option value="Ladies">Ladies</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="e.g. 945000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.oldPrice}
                    onChange={e => setProductForm({ ...productForm, oldPrice: e.target.value })}
                    placeholder="e.g. 1050000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="e.g. 15"
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={e => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="e.g. KA-ROL-001"
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 font-mono outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Vendor</label>
                  <select
                    value={productForm.supplier}
                    onChange={e => setProductForm({ ...productForm, supplier: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none focus:bg-white"
                  >
                    {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Image URL</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Detailed specifications and features..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="rounded-full border border-slate-200 bg-slate-100 hover:bg-slate-200 px-5 py-2 font-bold text-slate-700 order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#0F172A] hover:bg-black px-6 py-2 font-bold uppercase tracking-wider text-white shadow-xs order-1 sm:order-2"
                >
                  {editingProduct ? 'Update Product' : 'Publish Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 2. Subcategory Modal */}
      {subcatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-950">Add New Subcategory</h3>
              <button onClick={() => setSubcatModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddSubcategory} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Parent Category *</label>
                <select
                  value={subcatForm.category}
                  onChange={e => setSubcatForm({ ...subcatForm, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none font-semibold"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subcategory Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chronograph Watches, Leather Wallets"
                  value={subcatForm.name}
                  onChange={e => setSubcatForm({ ...subcatForm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none focus:bg-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setSubcatModalOpen(false)} className="rounded-full px-4 py-2 bg-slate-100 font-bold">
                  Cancel
                </button>
                <button type="submit" className="rounded-full px-5 py-2 bg-[#0F172A] text-white font-bold">
                  Save Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Variant Modal */}
      {variantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-950">Add Product Variant</h3>
              <button onClick={() => setVariantModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddVariant} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Parent Product *</label>
                <select
                  value={variantForm.productName}
                  onChange={e => setVariantForm({ ...variantForm, productName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none font-semibold"
                >
                  {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Attribute Type *</label>
                <select
                  value={variantForm.attributeType}
                  onChange={e => setVariantForm({ ...variantForm, attributeType: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none font-semibold"
                >
                  <option value="Dial Color">Dial Color</option>
                  <option value="Strap Material">Strap Material</option>
                  <option value="Shoe Size">Shoe Size</option>
                  <option value="Storage">Storage / Capacity</option>
                  <option value="Color Finish">Color Finish</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Option Value *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kermit Green, UK 10, 512 GB"
                  value={variantForm.value}
                  onChange={e => setVariantForm({ ...variantForm, value: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none focus:bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price Add-on (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={variantForm.priceModifier}
                    onChange={e => setVariantForm({ ...variantForm, priceModifier: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={variantForm.stock}
                    onChange={e => setVariantForm({ ...variantForm, stock: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setVariantModalOpen(false)} className="rounded-full px-4 py-2 bg-slate-100 font-bold">
                  Cancel
                </button>
                <button type="submit" className="rounded-full px-5 py-2 bg-[#0F172A] text-white font-bold">
                  Save Variant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Media Asset Modal */}
      {mediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-950">Index Media Asset</h3>
              <button onClick={() => setMediaModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddMedia} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Asset Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rolex Submariner Macro Studio"
                  value={mediaForm.title}
                  onChange={e => setMediaForm({ ...mediaForm, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={mediaForm.url}
                  onChange={e => setMediaForm({ ...mediaForm, url: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={mediaForm.category}
                  onChange={e => setMediaForm({ ...mediaForm, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none font-semibold"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setMediaModalOpen(false)} className="rounded-full px-4 py-2 bg-slate-100 font-bold">
                  Cancel
                </button>
                <button type="submit" className="rounded-full px-5 py-2 bg-[#0F172A] text-white font-bold">
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Promotion Modal */}
      {promoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-950">Create Promotional Campaign</h3>
              <button onClick={() => setPromoModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddPromotion} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Autumn Horology Showcase"
                  value={promoForm.title}
                  onChange={e => setPromoForm({ ...promoForm, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none focus:bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Promo Code</label>
                  <input
                    type="text"
                    placeholder="AUTUMN20"
                    value={promoForm.code}
                    onChange={e => setPromoForm({ ...promoForm, code: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 font-mono uppercase font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Text</label>
                  <input
                    type="text"
                    placeholder="Flat 20% Off"
                    value={promoForm.discount}
                    onChange={e => setPromoForm({ ...promoForm, discount: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Department</label>
                <select
                  value={promoForm.targetCategory}
                  onChange={e => setPromoForm({ ...promoForm, targetCategory: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none font-semibold"
                >
                  <option value="All Departments">All Departments</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setPromoModalOpen(false)} className="rounded-full px-4 py-2 bg-slate-100 font-bold">
                  Cancel
                </button>
                <button type="submit" className="rounded-full px-5 py-2 bg-[#0F172A] text-white font-bold">
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Role Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-950">Add Governance Role</h3>
              <button onClick={() => setRoleModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddRole} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Concierge Manager"
                  value={roleForm.name}
                  onChange={e => setRoleForm({ ...roleForm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Role Description</label>
                <textarea
                  rows={2}
                  placeholder="Responsibilities and access scope..."
                  value={roleForm.description}
                  onChange={e => setRoleForm({ ...roleForm, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none resize-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setRoleModalOpen(false)} className="rounded-full px-4 py-2 bg-slate-100 font-bold">
                  Cancel
                </button>
                <button type="submit" className="rounded-full px-5 py-2 bg-[#0F172A] text-white font-bold">
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Admin Return & Refund Review Modal */}
      {adminReturnModalOpen && selectedReturnOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-purple-200 bg-white p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-800 font-bold text-sm">
                  ↩
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-950">
                    Review Return & Settle Refund
                  </h3>
                  <span className="font-mono text-[10px] text-slate-400">Order Ref: {selectedReturnOrder.id}</span>
                </div>
              </div>
              <button
                onClick={() => setAdminReturnModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl border border-purple-100 bg-purple-50/70 p-3.5 space-y-2 text-slate-900">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-950">Customer: {selectedReturnOrder.customer?.firstName} {selectedReturnOrder.customer?.lastName}</span>
                <span className="font-mono font-bold text-purple-900">₹{selectedReturnOrder.total?.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-slate-700">
                <strong>Reason:</strong> {selectedReturnOrder.returnRequest?.reason || 'Not specified'}
              </p>
              <p className="text-[11px] text-slate-700">
                <strong>Condition:</strong> {selectedReturnOrder.returnRequest?.condition || 'Inspected'}
              </p>
            </div>

            <form onSubmit={handleProcessAdminReturn} className="space-y-3.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Administrative Decision *</label>
                <select
                  value={adminReturnDecision}
                  onChange={e => setAdminReturnDecision(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none focus:bg-white text-xs font-bold text-slate-900"
                >
                  <option value="Refunded">Approve Return & Issue Full Refund (Refunded)</option>
                  <option value="Return Approved">Authorize Return Pickup (Pending Warehouse Inspection)</option>
                  <option value="Return Rejected">Decline / Reject Return Request</option>
                </select>
              </div>

              {adminReturnDecision === 'Refunded' && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Refund Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      value={adminRefundAmount}
                      onChange={e => setAdminRefundAmount(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none focus:bg-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Refund Txn ID *</label>
                    <input
                      type="text"
                      required
                      value={adminRefundTxn}
                      onChange={e => setAdminRefundTxn(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none focus:bg-white font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Admin Audit Notes / Feedback</label>
                <textarea
                  rows={2}
                  value={adminReturnNotes}
                  onChange={e => setAdminReturnNotes(e.target.value)}
                  placeholder="Notes logged in customer timeline..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 outline-none focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAdminReturnModalOpen(false)}
                  className="rounded-full border border-slate-200 bg-slate-100 hover:bg-slate-200 px-5 py-2 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`rounded-full px-6 py-2 font-bold uppercase tracking-wider text-white shadow-xs ${
                    adminReturnDecision === 'Return Rejected'
                      ? 'bg-rose-700 hover:bg-rose-800'
                      : 'bg-[#0F172A] hover:bg-black'
                  }`}
                >
                  {adminReturnDecision === 'Refunded'
                    ? 'Confirm & Settle Refund'
                    : adminReturnDecision === 'Return Approved'
                    ? 'Authorize Reverse Pickup'
                    : 'Decline Return'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}