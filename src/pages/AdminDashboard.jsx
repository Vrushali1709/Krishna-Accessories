// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Users,
  Zap,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Plus,
  Trash2,
  Eye,
  Printer,
  TrendingUp,
  Clock,
  Truck,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Database,
  Lock,
  Tag,
  ImageIcon,
  Folder,
  Copy,
  Download,
  Layers,
  Store,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
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
  addSupplier,
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

  // Add Vendor / Supplier Modal State
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Fitness',
    address: 'Gujarat, India'
  });

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

  // Admin Order Details Inspector Modal State
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderCourier, setSelectedOrderCourier] = useState('BlueDart Express Air');
  const [selectedOrderTracking, setSelectedOrderTracking] = useState('');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('Confirmed');

  const handleOpenOrderModal = (order) => {
    setSelectedOrder(order);
    setSelectedOrderCourier(order.courier || 'BlueDart Express Air');
    setSelectedOrderTracking(order.trackingNumber || `BD${Math.floor(10000000 + Math.random() * 90000000)}IN`);
    setSelectedOrderStatus(order.status || 'Confirmed');
    setOrderModalOpen(true);
  };

  const handleUpdateOrderDetails = (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, selectedOrderStatus, {
      courier: selectedOrderCourier,
      trackingNumber: selectedOrderTracking
    });
    showToast(`Order ${selectedOrder.id} fulfillment details updated!`);
    setSelectedOrder(prev => prev ? ({ ...prev, status: selectedOrderStatus, courier: selectedOrderCourier, trackingNumber: selectedOrderTracking }) : null);
  };

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

  // Navigation Hierarchy Definition
  const navSections = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      badge: unreadNotifs > 0 ? `${unreadNotifs}` : null,
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
      title: 'Catalog',
      icon: Package,
      badge: products.length,
      subItems: [
        { id: 'products', label: 'Products' },
        { id: 'categories', label: 'Categories' },
        { id: 'subcategories', label: 'Subcategories' },
        { id: 'brands', label: 'Brands' },
        { id: 'variants', label: 'Variants' },
        { id: 'images', label: 'Images & Media' }
      ]
    },
    {
      id: 'commerce',
      title: 'Commerce',
      icon: CreditCard,
      badge: activeOrdersCount > 0 ? `${activeOrdersCount}` : null,
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
      title: 'People',
      icon: Users,
      badge: users.length,
      subItems: [
        { id: 'users', label: 'Customers' },
        { id: 'suppliers', label: 'Suppliers' },
        { id: 'roles', label: 'Roles' },
        { id: 'permissions', label: 'Permissions' }
      ]
    },
    {
      id: 'operations',
      title: 'Operations',
      icon: Zap,
      badge: lowStockItems.length > 0 ? `${lowStockItems.length}` : null,
      subItems: [
        { id: 'inventory', label: 'Inventory' },
        { id: 'shipping', label: 'Shipping Carriers' },
        { id: 'order-status', label: 'Order Status' },
        { id: 'notifications', label: 'Broadcasts' }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: BarChart3,
      subItems: [
        { id: 'daily-sales', label: 'Daily Sales' },
        { id: 'monthly-sales', label: 'Monthly Sales' },
        { id: 'product-perf', label: 'Product Performance' },
        { id: 'supplier-perf', label: 'Supplier GMV' },
        { id: 'customer-reports', label: 'Customer Retention' }
      ]
    },
    {
      id: 'system',
      title: 'System',
      icon: Settings,
      subItems: [
        { id: 'settings', label: 'Store Settings' },
        { id: 'audit-logs', label: 'Audit Trail' },
        { id: 'security', label: 'Security' },
        { id: 'backups', label: 'Backups' },
        { id: 'configuration', label: 'Gateways' }
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
    showToast(editingProduct ? 'Product updated successfully' : 'New product published to catalog');

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
    showToast('Subcategory registered');
  };

  // Variant Form Submit
  const handleAddVariant = (e) => {
    e.preventDefault();
    if (!variantForm.value.trim()) return;
    saveVariant(variantForm);
    setVariantModalOpen(false);
    setVariantForm({ productName: products[0]?.name || 'Rolex Submariner Date 41mm', attributeType: 'Dial Color', value: '', priceModifier: '', stock: '10', sku: '' });
    showToast('Variant configuration saved');
  };

  // Media Asset Submit
  const handleAddMedia = (e) => {
    e.preventDefault();
    if (!mediaForm.url.trim()) return;
    addMediaAsset(mediaForm);
    setMediaModalOpen(false);
    setMediaForm({ title: '', category: 'Watches', url: '', size: '1.8 MB' });
    showToast('Media asset indexed');
  };

  // Promotion Submit
  const handleAddPromotion = (e) => {
    e.preventDefault();
    if (!promoForm.title.trim()) return;
    savePromotion(promoForm);
    setPromoModalOpen(false);
    setPromoForm({ title: '', code: '', discount: '20% Off', targetCategory: 'All Departments', bannerType: 'Hero Banner', startDate: 'Today', endDate: '30 Days' });
    showToast('Campaign banner launched');
  };

  // Role Submit
  const handleAddRole = (e) => {
    e.preventDefault();
    if (!roleForm.name.trim()) return;
    saveRole(roleForm);
    setRoleModalOpen(false);
    setRoleForm({ name: '', description: '', membersCount: '1' });
    showToast('Governance role registered');
  };

  // Add Supplier / Vendor Submit
  const handleAddSupplierSubmit = (e) => {
    e.preventDefault();
    if (!supplierForm.name.trim() || !supplierForm.email.trim()) return;
    addSupplier({
      name: supplierForm.name.trim(),
      email: supplierForm.email.trim().toLowerCase(),
      phone: supplierForm.phone.trim() || '+91 98765 00000',
      category: supplierForm.category || 'Fitness',
      address: supplierForm.address || 'Gujarat, India',
      status: 'Active'
    });
    setSuppliers(getSuppliers());
    setSupplierModalOpen(false);
    setSupplierForm({
      name: '',
      email: '',
      phone: '',
      category: 'Fitness',
      address: 'Gujarat, India'
    });
    showToast('Vendor partner onboarded');
  };

  // Category & Brand Form Submit
  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    addCategory(newCatInput.trim());
    setNewCatInput('');
    showToast('Department category created');
  };

  const handleAddBrandSubmit = (e) => {
    e.preventDefault();
    if (!newBrandInput.trim()) return;
    addBrand(newBrandInput.trim());
    setNewBrandInput('');
    showToast('Luxury brand registered');
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
    showToast('Discount voucher created');
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
    showToast('Return & refund decision executed');
    refreshAll();
  };

  // System Settings Save
  const handleSaveSettings = (e) => {
    e.preventDefault();
    saveSystemConfig(systemConfig);
    showToast('Store configuration saved');
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
    showToast('Database JSON backup downloaded');
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
    showToast('System announcement broadcasted');
  };

  // Dedicated Admin Login Check
  if (!authenticatedAsAdmin) {
    return (
      <div className="min-h-screen bg-[#F9F9F8] text-zinc-900 flex flex-col justify-center items-center px-4 py-12 font-sans selection:bg-zinc-900 selection:text-white">
        <div className="w-full max-w-sm bg-white border border-zinc-200/80 rounded-2xl p-7 sm:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white font-serif font-bold text-lg shadow-sm">
            KA
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 block">
              Governance Console
            </span>
            <h1 className="text-xl font-semibold text-zinc-900 tracking-tight mt-1">
              Krishna Accessories
            </h1>
            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
              Enterprise commerce administration & store management.
            </p>
          </div>
          <div className="pt-2 space-y-2.5">
            <button
              onClick={handleQuickAdminLogin}
              className="w-full rounded-xl bg-zinc-900 hover:bg-black py-2.5 text-xs font-semibold text-white shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>1-Click Super Admin Login</span>
            </button>
            <Link
              to="/login"
              className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 py-2.5 text-xs font-medium text-zinc-700 transition"
            >
              Sign In with Password &rarr;
            </Link>
            <Link
              to="/"
              className="inline-block text-xs text-zinc-400 hover:text-zinc-700 pt-2 transition font-medium"
            >
              &larr; Back to Storefront
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
    <div className="min-h-screen bg-[#F9F9F8] text-zinc-900 flex overflow-hidden font-sans selection:bg-zinc-900 selection:text-white">

      {/* ==========================================
          TOAST ALERT BANNER
      ========================================== */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-xl bg-zinc-900 text-white border border-zinc-800 px-4 py-2.5 text-xs font-medium shadow-xl animate-fade-in flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ==========================================
          1. DEDICATED HIERARCHICAL SIDEBAR
      ========================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between bg-[#121316] text-zinc-300 border-r border-zinc-800/80 transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        
        {/* Sidebar Brand Header */}
        <div className="flex flex-col min-h-0 flex-1">
          <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-800/80 shrink-0">
            <Link to="/admin" className="flex items-center gap-3 overflow-hidden min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-100 font-serif font-bold text-xs border border-zinc-700/60 shadow-xs">
                KA
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-zinc-100 tracking-tight text-xs truncate">
                    Krishna Accessories
                  </span>
                  <span className="text-[9.5px] font-medium tracking-widest text-zinc-400 uppercase truncate">
                    Admin Governance
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-zinc-400 hover:text-white p-1 text-sm shrink-0 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Items (Scrollable Hierarchical Accordion) */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
            {navSections.map((sec) => {
              const isSectionActive = activeSection === sec.id;
              const isExpanded = expandedSections[sec.id];
              const IconComp = sec.icon;

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
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 font-medium transition-colors cursor-pointer ${
                      isSectionActive
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

                  {/* Sub-items List (Rendered when expanded) */}
                  {!sidebarCollapsed && isExpanded && (
                    <div className="ml-4 pl-3 border-l border-zinc-800/80 space-y-0.5 pt-0.5 pb-1">
                      {sec.subItems.map((sub) => {
                        const isSubActive = isSectionActive && activeSubTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleNavSelect(sec.id, sub.id)}
                            className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-[11.5px] transition cursor-pointer ${
                              isSubActive
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
                    SA
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#0F1012]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-200 truncate">Super Admin</p>
                    <p className="text-[10px] text-zinc-400 truncate">admin@krishna.com</p>
                  </div>
                </div>

                <button
                  onClick={handleAdminLogout}
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
                  onClick={handleAdminLogout}
                  className="flex items-center justify-center rounded-lg bg-zinc-800/40 hover:bg-rose-950/40 border border-zinc-800 hover:border-rose-900/50 py-1.5 text-[10.5px] font-medium text-zinc-300 hover:text-rose-300 transition truncate px-1 cursor-pointer"
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
                className="text-zinc-400 hover:text-rose-400 p-2 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ==========================================
          2. MAIN CONTENT WRAPPER WITH TOP HEADER
      ========================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen bg-[#F9F9F8]">

        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-zinc-200/80 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
          
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-sm shrink-0 cursor-pointer"
            >
              <Menu className="h-4 w-4" />
            </button>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 text-xs font-mono shrink-0 cursor-pointer"
              title="Toggle sidebar collapse"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-center gap-1.5 text-xs text-zinc-500 truncate min-w-0 font-medium">
              <span className="text-zinc-400 shrink-0">Admin</span>
              <span className="text-zinc-300 shrink-0">/</span>
              <span className="text-zinc-700 truncate">{currentSectionObj.title}</span>
              <span className="text-zinc-300 shrink-0">/</span>
              <span className="text-zinc-900 font-semibold truncate">{currentSubItemObj.label}</span>
            </div>
          </div>

          {/* Center: Global Search */}
          <div className="hidden md:flex relative w-60 lg:w-72">
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search catalog, orders, users..."
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-1.5 pl-8 pr-4 text-xs text-zinc-800 placeholder:text-zinc-400 outline-none transition focus:border-zinc-400 focus:bg-white"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 h-3.5 w-3.5 pointer-events-none" />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Right: Actions, Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition shadow-2xs"
            >
              <Store className="h-3.5 w-3.5" />
              <span>Storefront</span>
              <ExternalLink className="h-2.5 w-2.5 text-zinc-400" />
            </Link>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setNotifsOpen(!notifsOpen)}
                className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 transition cursor-pointer"
              >
                <Bell className="h-3.5 w-3.5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[8.5px] font-bold text-white shadow-xs">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {notifsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-zinc-200 bg-white p-3.5 shadow-xl z-50 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2 mb-2">
                    <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                      Platform Alerts ({notifications.length})
                    </span>
                    {unreadNotifs > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10.5px] text-zinc-600 font-semibold hover:text-zinc-950 cursor-pointer"
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
                          n.unread ? 'bg-zinc-50 border border-zinc-200/80 font-medium' : 'hover:bg-zinc-50 text-zinc-600'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-zinc-900 text-xs">{n.title}</span>
                          <span className="text-[9px] text-zinc-400 font-mono shrink-0">{n.date}</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-zinc-600 leading-snug">{n.message}</p>
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
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 transition shadow-2xs cursor-pointer"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-900 text-white text-[9px] font-bold shrink-0">
                  SA
                </div>
                <span className="hidden sm:inline text-xs font-medium">Super Admin</span>
                <ChevronDown className="h-3 w-3 text-zinc-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl z-50 animate-fade-in text-xs font-medium">
                  <div className="px-2.5 py-2 border-b border-zinc-100 mb-1">
                    <p className="font-semibold text-zinc-950">Super Admin</p>
                    <p className="text-[10px] text-zinc-400">admin@krishna.com</p>
                  </div>
                  <button
                    onClick={() => { handleNavSelect('system', 'settings'); setUserDropdownOpen(false); }}
                    className="w-full text-left rounded-lg px-2.5 py-1.5 text-zinc-700 hover:bg-zinc-100 transition cursor-pointer flex items-center gap-2"
                  >
                    <Settings className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Store Settings</span>
                  </button>
                  <button
                    onClick={() => { handleNavSelect('system', 'audit-logs'); setUserDropdownOpen(false); }}
                    className="w-full text-left rounded-lg px-2.5 py-1.5 text-zinc-700 hover:bg-zinc-100 transition cursor-pointer flex items-center gap-2"
                  >
                    <FileText className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Audit Trail</span>
                  </button>
                  <div className="border-t border-zinc-100 pt-1 mt-1">
                    <button
                      onClick={handleAdminLogout}
                      className="w-full text-left rounded-lg px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 font-medium transition cursor-pointer flex items-center gap-2"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* Section Sub-Navigation Tabs Bar */}
        <div className="bg-[#FAF9F8] border-b border-zinc-200/80 px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto flex items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mr-2 shrink-0">
            {currentSectionObj.title}:
          </span>
          {currentSectionObj.subItems.map((sub) => {
            const isSubActive = activeSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition whitespace-nowrap shrink-0 cursor-pointer ${
                  isSubActive
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-white border border-zinc-200/80 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                {sub.label}
                {sub.badge && (
                  <span className={`ml-1.5 rounded-full px-1.5 py-0.2 text-[9px] font-semibold ${isSubActive ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-100 text-zinc-600'}`}>
                    {sub.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ==========================================
            3. MAIN BODY CONTENT (ALL SUB-VIEWS)
        ========================================== */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">

          {/* ==========================================
              MODULE 1: DASHBOARD
          ========================================== */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                    Operational Intelligence Dashboard
                  </h1>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Live gross merchandise volume, fulfillment pipelines, and governance actions.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenAddProduct}
                    className="rounded-lg bg-zinc-900 hover:bg-black px-3.5 py-1.5 text-xs font-medium text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>

              {/* 5 Core Top Metric Cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                
                {/* 1. Revenue */}
                <div
                  onClick={() => setActiveSubTab('revenue')}
                  className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs hover:border-zinc-400 cursor-pointer transition"
                >
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span className="font-semibold uppercase tracking-wider text-[9.5px]">Revenue (GMV)</span>
                    <span className="text-emerald-700 font-semibold text-[10px] flex items-center gap-0.5">
                      <TrendingUp className="h-3 w-3" /> +18.4%
                    </span>
                  </div>
                  <p className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight truncate tabular-nums">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Gross processed volume</p>
                </div>

                {/* 2. Total Orders */}
                <div
                  onClick={() => setActiveSubTab('orders')}
                  className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs hover:border-zinc-400 cursor-pointer transition"
                >
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span className="font-semibold uppercase tracking-wider text-[9.5px]">Total Orders</span>
                    <span className="text-zinc-600 font-medium text-[10px]">{activeOrdersCount} in transit</span>
                  </div>
                  <p className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight truncate tabular-nums">
                    {orders.length}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Completed & active</p>
                </div>

                {/* 3. Products */}
                <div
                  onClick={() => setActiveSubTab('products')}
                  className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs hover:border-zinc-400 cursor-pointer transition"
                >
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span className="font-semibold uppercase tracking-wider text-[9.5px]">Catalog</span>
                    <span className="text-zinc-500 font-medium text-[10px]">{categories.length} Depts</span>
                  </div>
                  <p className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight truncate tabular-nums">
                    {products.length} Items
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{brands.length} luxury brands</p>
                </div>

                {/* 4. Suppliers */}
                <div
                  onClick={() => setActiveSubTab('suppliers')}
                  className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs hover:border-zinc-400 cursor-pointer transition"
                >
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span className="font-semibold uppercase tracking-wider text-[9.5px]">Suppliers</span>
                    <span className={pendingSuppliers.length > 0 ? "text-amber-700 font-medium text-[10px]" : "text-emerald-700 font-medium text-[10px]"}>
                      {pendingSuppliers.length > 0 ? `${pendingSuppliers.length} pending` : '✓ All Active'}
                    </span>
                  </div>
                  <p className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight truncate tabular-nums">
                    {suppliers.length}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Approved partners</p>
                </div>

                {/* 5. Total Users */}
                <div
                  onClick={() => setActiveSubTab('users')}
                  className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs hover:border-zinc-400 cursor-pointer col-span-2 sm:col-span-1 transition"
                >
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span className="font-semibold uppercase tracking-wider text-[9.5px]">Users</span>
                    <span className="text-zinc-500 font-medium text-[10px]">100% Verified</span>
                  </div>
                  <p className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight truncate tabular-nums">
                    {users.length}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Customer profiles</p>
                </div>

              </div>

              {/* Sub-item: Pending Actions Highlight */}
              {(activeSubTab === 'overview' || activeSubTab === 'pending') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                      Pending Governance Actions ({pendingSuppliers.length + returnRequests.length + lowStockItems.length})
                    </h3>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {/* Pending Suppliers */}
                    <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold text-zinc-900 text-xs flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-zinc-500" />
                            <span>Vendor Onboarding</span>
                          </span>
                          <span className="text-[10px] font-medium bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-md">
                            {pendingSuppliers.length} Pending
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          {pendingSuppliers.length > 0
                            ? `${pendingSuppliers.map(s => s.name).join(', ')} awaiting catalog publishing authorization.`
                            : 'All supplier credentials and trade licenses are currently approved.'}
                        </p>
                      </div>
                      {pendingSuppliers.length > 0 && (
                        <button
                          onClick={() => handleNavSelect('people', 'suppliers')}
                          className="mt-3 text-left text-xs font-semibold text-zinc-900 hover:underline cursor-pointer"
                        >
                          Review Vendor Documents &rarr;
                        </button>
                      )}
                    </div>

                    {/* Pending Returns */}
                    <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold text-zinc-900 text-xs flex items-center gap-1.5">
                            <RotateCcw className="h-3.5 w-3.5 text-zinc-500" />
                            <span>Return & RMA Requests</span>
                          </span>
                          <span className="text-[10px] font-medium bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-md">
                            {returnRequests.length} Pending
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          {returnRequests.length > 0
                            ? `${returnRequests.length} customer return requests awaiting warehouse RMA decision.`
                            : 'No customer return requests currently pending inspection.'}
                        </p>
                      </div>
                      {returnRequests.length > 0 && (
                        <button
                          onClick={() => handleNavSelect('commerce', 'returns')}
                          className="mt-3 text-left text-xs font-semibold text-zinc-900 hover:underline cursor-pointer"
                        >
                          Review RMA Returns &rarr;
                        </button>
                      )}
                    </div>

                    {/* Low Stock Warnings */}
                    <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold text-zinc-900 text-xs flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                            <span>Low Inventory Alerts</span>
                          </span>
                          <span className="text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                            {lowStockItems.length} Low
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          {lowStockItems.length > 0
                            ? `${lowStockItems.length} items have less than 5 units left in warehouse bins.`
                            : 'All product inventories are above reorder safety thresholds.'}
                        </p>
                      </div>
                      {lowStockItems.length > 0 && (
                        <button
                          onClick={() => handleNavSelect('operations', 'inventory')}
                          className="mt-3 text-left text-xs font-semibold text-zinc-900 hover:underline cursor-pointer"
                        >
                          Replenish Stock Ledger &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-item: Sales Charts */}
              {(activeSubTab === 'overview' || activeSubTab === 'charts' || activeSubTab === 'revenue') && (
                <div className="grid gap-6 lg:grid-cols-3">
                  
                  {/* Revenue Trend Chart */}
                  <div className="lg:col-span-2 rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                      <div>
                        <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                          Revenue Performance & Monthly Growth
                        </h3>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Processed GMV breakdown in INR (₹)</p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full self-start sm:self-auto tabular-nums">
                        AOV: ₹{Math.round(totalRevenue / Math.max(1, orders.length)).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-44 pt-4 px-2">
                      {[
                        { month: 'Apr', amount: 84000, height: '40%' },
                        { month: 'May', amount: 112000, height: '55%' },
                        { month: 'Jun', amount: 145000, height: '70%' },
                        { month: 'Jul', amount: 168000, height: '80%' },
                        { month: 'Aug', amount: 195000, height: '92%' },
                        { month: 'Sep', amount: totalRevenue, height: '100%', active: true }
                      ].map(bar => (
                        <div key={bar.month} className="flex flex-col items-center gap-1.5 h-full justify-end group min-w-0">
                          <span className="text-[9px] font-semibold font-mono text-zinc-600 opacity-0 group-hover:opacity-100 transition truncate">
                            ₹{(bar.amount / 1000).toFixed(0)}k
                          </span>
                          <div
                            style={{ height: bar.height }}
                            className={`w-full rounded-t-lg transition-all duration-300 ${
                              bar.active ? 'bg-zinc-900' : 'bg-zinc-200 hover:bg-zinc-300'
                            }`}
                          />
                          <span className={`text-[10.5px] font-medium truncate ${bar.active ? 'text-zinc-950 font-semibold' : 'text-zinc-400'}`}>
                            {bar.month}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category Distribution */}
                  <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                      <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                        Department Share
                      </h3>
                      <button onClick={() => handleNavSelect('catalog', 'categories')} className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 cursor-pointer">
                        Manage
                      </button>
                    </div>

                    <div className="space-y-3">
                      {categories.slice(0, 5).map(cat => {
                        const count = products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
                        const pct = Math.round((count / Math.max(1, products.length)) * 100);
                        return (
                          <div key={cat} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium text-zinc-800">{cat}</span>
                              <span className="text-zinc-400 font-mono text-[11px]">{count} ({pct}%)</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                              <div style={{ width: `${pct}%` }} className="h-full bg-zinc-800 rounded-full" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
                      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                        Product Catalog & Inventory
                      </h1>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Manage {products.length} luxury products, SKUs, inventory counts, and price tiers.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddProduct}
                      className="rounded-lg bg-zinc-900 hover:bg-black px-3.5 py-2 text-xs font-medium text-white shadow-xs transition self-start sm:self-auto flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Product</span>
                    </button>
                  </div>

                  {/* Search & Filter Bar */}
                  <div className="grid gap-3 sm:grid-cols-3 rounded-xl border border-zinc-200/80 bg-white p-3 shadow-2xs">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchCatalog}
                        onChange={e => setSearchCatalog(e.target.value)}
                        placeholder="Filter by title, SKU, brand..."
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-1.5 pl-8 text-xs text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white"
                      />
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 h-3.5 w-3.5 pointer-events-none" />
                    </div>

                    <select
                      value={filterCat}
                      onChange={e => {
                        setFilterCat(e.target.value);
                        setFilterBrand('All');
                      }}
                      className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 outline-none focus:border-zinc-400 cursor-pointer font-medium"
                    >
                      <option value="All">All Departments</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select
                      value={filterBrand}
                      onChange={e => setFilterBrand(e.target.value)}
                      className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 outline-none focus:border-zinc-400 cursor-pointer font-medium"
                    >
                      <option value="All">All Brands</option>
                      {(filterCat === 'All' ? brands : getBrandsByCategory(filterCat)).map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Products Master Table */}
                  <div className="overflow-x-auto rounded-xl border border-zinc-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[750px]">
                      <thead className="border-b border-zinc-200 bg-zinc-50/75 text-zinc-500 uppercase text-[10px] font-semibold tracking-wider">
                        <tr>
                          <th className="p-3.5">Product</th>
                          <th className="p-3.5">Department & Brand</th>
                          <th className="p-3.5">SKU & Gender</th>
                          <th className="p-3.5">Price</th>
                          <th className="p-3.5">Stock Controls</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 font-normal">
                        {filteredProducts.map(p => (
                          <tr key={p.id} className="hover:bg-zinc-50/75 transition">
                            <td className="p-3.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image || p.images?.[0]}
                                  alt=""
                                  className="h-11 w-11 rounded-lg object-contain bg-zinc-50 border border-zinc-200 shrink-0 p-1"
                                />
                                <div className="min-w-0">
                                  <span className="font-semibold text-zinc-900 block truncate max-w-xs">{p.name}</span>
                                  <span className="text-[10px] text-zinc-400">Rating ★ {p.rating || 4.9}</span>
                                </div>
                              </div>
                            </td>

                            <td className="p-3.5">
                              <span className="font-medium text-zinc-900 block">{p.category}</span>
                              <span className="text-[10.5px] text-zinc-500">{p.brand}</span>
                            </td>

                            <td className="p-3.5">
                              <span className="font-mono text-zinc-700 block">{p.sku}</span>
                              {p.gender && (
                                <span className="text-[10px] text-zinc-400 font-medium">{p.gender}</span>
                              )}
                            </td>

                            <td className="p-3.5">
                              <span className="font-semibold text-zinc-900 block tabular-nums">₹{Number(p.price).toLocaleString('en-IN')}</span>
                              {p.oldPrice && (
                                <span className="text-[10px] text-zinc-400 line-through tabular-nums">₹{Number(p.oldPrice).toLocaleString('en-IN')}</span>
                              )}
                            </td>

                            <td className="p-3.5">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleStockAdjust(p.id, -1)}
                                  className="h-6 w-6 rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 font-medium text-zinc-700 flex items-center justify-center text-xs shrink-0 cursor-pointer"
                                >
                                  −
                                </button>
                                <span className={`font-semibold font-mono px-1.5 text-xs ${p.stock < 5 ? 'text-rose-700' : 'text-zinc-800'}`}>
                                  {p.stock}
                                </span>
                                <button
                                  onClick={() => handleStockAdjust(p.id, 1)}
                                  className="h-6 w-6 rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 font-medium text-zinc-700 flex items-center justify-center text-xs shrink-0 cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 transition cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="rounded-md border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 px-2.5 py-1 text-xs font-medium transition cursor-pointer"
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
                      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                        Store Departments ({categories.length})
                      </h1>
                      <p className="text-xs text-zinc-500 mt-0.5">Master product departmental classification.</p>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-4 h-fit">
                      <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">+ Add Department</h3>
                      <form onSubmit={handleAddCategorySubmit} className="space-y-3">
                        <input
                          type="text"
                          required
                          value={newCatInput}
                          onChange={e => setNewCatInput(e.target.value)}
                          placeholder="e.g. Fine Jewelry, Footwear..."
                          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium outline-none focus:bg-white focus:border-zinc-400"
                        />
                        <button
                          type="submit"
                          className="w-full rounded-lg bg-zinc-900 hover:bg-black py-2 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
                        >
                          Create Department
                        </button>
                      </form>
                    </div>

                    <div className="lg:col-span-2 rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-3">
                      <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">Active Departments</h3>
                      <div className="divide-y divide-zinc-100">
                        {categories.map(cat => {
                          const count = products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
                          return (
                            <div key={cat} className="flex items-center justify-between py-2.5 text-xs">
                              <div className="flex items-center gap-2.5">
                                <Folder className="h-4 w-4 text-zinc-400" />
                                <div>
                                  <span className="font-semibold text-zinc-900 block">{cat}</span>
                                  <span className="text-[10.5px] text-zinc-400">{count} products linked</span>
                                </div>
                              </div>
                              <button
                                onClick={() => deleteCategory(cat)}
                                className="text-zinc-400 hover:text-rose-600 font-medium p-1 cursor-pointer"
                                title="Delete Category"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
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
                      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                        Subcategories Taxonomy ({subcategories.length})
                      </h1>
                      <p className="text-xs text-zinc-500 mt-0.5">Classification mapped to parent departments.</p>
                    </div>
                    <button
                      onClick={() => setSubcatModalOpen(true)}
                      className="rounded-lg bg-zinc-900 hover:bg-black px-3.5 py-1.5 text-xs font-medium text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Subcategory</span>
                    </button>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-3">
                    {subcategories.map(sub => (
                      <div key={sub.id} className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono font-semibold text-[10px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-md">
                              {sub.code}
                            </span>
                            <button
                              onClick={() => deleteSubcategory(sub.id)}
                              className="text-zinc-400 hover:text-rose-600 p-1 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <h4 className="font-semibold text-zinc-900 text-sm">{sub.name}</h4>
                          <p className="text-[11px] text-zinc-500 mt-0.5">Parent: {sub.category}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-zinc-100 text-[10.5px] text-zinc-400">
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
                      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                        Authorized Brands ({brands.length})
                      </h1>
                      <p className="text-xs text-zinc-500 mt-0.5">Registered luxury manufacturer partners.</p>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-4 h-fit">
                      <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">+ Register Brand</h3>
                      <form onSubmit={handleAddBrandSubmit} className="space-y-3">
                        <input
                          type="text"
                          required
                          value={newBrandInput}
                          onChange={e => setNewBrandInput(e.target.value)}
                          placeholder="e.g. Bulgari, Cartier, Rolex..."
                          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-medium outline-none focus:bg-white focus:border-zinc-400"
                        />
                        <button
                          type="submit"
                          className="w-full rounded-lg bg-zinc-900 hover:bg-black py-2 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
                        >
                          Add Brand
                        </button>
                      </form>
                    </div>

                    <div className="lg:col-span-2 rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-3">
                      <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">Brand Directory</h3>
                      <div className="flex flex-wrap gap-2">
                        {brands.map(b => {
                          const count = products.filter(p => p.brand?.toLowerCase() === b.toLowerCase()).length;
                          return (
                            <span key={b} className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-800">
                              <span>{b}</span>
                              {count > 0 && <span className="text-[10px] text-zinc-600 bg-zinc-200 px-1.5 py-0.2 rounded-md">{count}</span>}
                              <button onClick={() => deleteBrand(b)} className="text-zinc-400 hover:text-rose-600 ml-1 cursor-pointer">
                                <X className="h-3 w-3" />
                              </button>
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
                      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                        Product Variants & Attribute Matrix
                      </h1>
                      <p className="text-xs text-zinc-500 mt-0.5">Configure size, color, strap material, and storage variations.</p>
                    </div>
                    <button
                      onClick={() => setVariantModalOpen(true)}
                      className="rounded-lg bg-zinc-900 hover:bg-black px-3.5 py-1.5 text-xs font-medium text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Create Variant</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-zinc-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead className="border-b border-zinc-200 bg-zinc-50/75 text-zinc-500 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="p-3.5">Product</th>
                          <th className="p-3.5">Variant SKU</th>
                          <th className="p-3.5">Attribute & Option</th>
                          <th className="p-3.5">Price Delta</th>
                          <th className="p-3.5">Inventory</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 font-normal">
                        {variants.map(v => (
                          <tr key={v.id} className="hover:bg-zinc-50/75">
                            <td className="p-3.5 font-semibold text-zinc-900">{v.productName}</td>
                            <td className="p-3.5 font-mono text-zinc-600">{v.sku}</td>
                            <td className="p-3.5">
                              <span className="font-medium text-zinc-900">{v.attributeType}:</span> {v.value}
                            </td>
                            <td className="p-3.5 font-medium text-zinc-900 tabular-nums">
                              {v.priceModifier > 0 ? `+ ₹${v.priceModifier.toLocaleString('en-IN')}` : 'Base Price'}
                            </td>
                            <td className="p-3.5 font-medium font-mono text-emerald-800">{v.stock} in stock</td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => deleteVariant(v.id)}
                                className="text-zinc-400 hover:text-rose-600 p-1 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
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
                      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                        Media & Image Asset Gallery ({mediaAssets.length})
                      </h1>
                      <p className="text-xs text-zinc-500 mt-0.5">High-resolution catalog media assets, previews, and URLs.</p>
                    </div>
                    <button
                      onClick={() => setMediaModalOpen(true)}
                      className="rounded-lg bg-zinc-900 hover:bg-black px-3.5 py-1.5 text-xs font-medium text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Index Media Asset</span>
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {mediaAssets.map(m => (
                      <div key={m.id} className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-2xs space-y-2.5">
                        <div className="h-44 w-full bg-zinc-50 rounded-lg overflow-hidden relative group border border-zinc-100">
                          <img src={m.url} alt={m.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText(m.url);
                              showToast('Image URL copied to clipboard');
                            }}
                            className="absolute bottom-2 right-2 rounded-md bg-zinc-900/80 hover:bg-zinc-900 text-white px-2 py-1 text-[10.5px] font-medium backdrop-blur-xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="h-3 w-3" />
                            <span>Copy URL</span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-zinc-900 text-xs truncate max-w-[180px]">{m.title}</h4>
                            <p className="text-[10px] text-zinc-400">{m.dimensions} &bull; {m.size}</p>
                          </div>
                          <button
                            onClick={() => deleteMediaAsset(m.id)}
                            className="text-zinc-400 hover:text-rose-600 p-1 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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
                      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                        Orders & Shipments
                      </h1>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Fulfillment registry for {orders.length} store transactions.
                      </p>
                    </div>

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

                  <div className="overflow-x-auto rounded-xl border border-zinc-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[800px]">
                      <thead className="border-b border-zinc-200 bg-zinc-50/75 text-zinc-500 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="p-3.5">Order ID & Date</th>
                          <th className="p-3.5">Customer</th>
                          <th className="p-3.5">Payment</th>
                          <th className="p-3.5">Invoice Amount</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions & Lifecycle</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 font-normal">
                        {filteredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-zinc-50/75 transition">
                            <td className="p-3.5">
                              <span className="font-mono font-semibold text-zinc-900 block">{order.id}</span>
                              <span className="text-[10px] text-zinc-400">{order.date}</span>
                            </td>

                            <td className="p-3.5">
                              <span className="font-medium text-zinc-900 block">{order.customer?.firstName} {order.customer?.lastName}</span>
                              <span className="text-[10px] text-zinc-500">{order.customer?.city}, {order.customer?.state}</span>
                            </td>

                            <td className="p-3.5">
                              <span className="text-zinc-800 font-medium">{order.paymentMethod || 'Online Gateway'}</span>
                              <span className={`text-[10px] font-semibold block ${
                                order.paymentStatus === 'Refunded' ? 'text-purple-700' : 'text-emerald-700'
                              }`}>
                                {order.paymentStatus || 'Paid'}
                              </span>
                            </td>

                            <td className="p-3.5 font-semibold text-zinc-900 tabular-nums">
                              ₹{Number(order.total || 0).toLocaleString('en-IN')}
                            </td>

                            <td className="p-3.5">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium border ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : order.status === 'Shipped'
                                  ? 'bg-sky-50 text-sky-800 border-sky-200'
                                  : order.status === 'Cancelled'
                                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                                  : order.status === 'Refunded'
                                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                                  : order.status === 'Return Requested'
                                  ? 'bg-amber-50 text-amber-800 border-amber-200 font-semibold'
                                  : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                              }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${
                                  order.status === 'Delivered' ? 'bg-emerald-500' :
                                  order.status === 'Shipped' ? 'bg-sky-500' :
                                  order.status === 'Cancelled' ? 'bg-rose-500' :
                                  order.status === 'Refunded' ? 'bg-purple-500' :
                                  order.status === 'Return Requested' ? 'bg-amber-500' : 'bg-zinc-400'
                                }`} />
                                <span>{order.status}</span>
                              </span>
                            </td>

                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenOrderModal(order)}
                                  className="rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 px-2.5 py-1 text-[11px] font-medium shadow-2xs transition shrink-0 cursor-pointer"
                                >
                                  Details
                                </button>

                                {order.status === 'Return Requested' && (
                                  <button
                                    onClick={() => handleOpenAdminReturnModal(order)}
                                    className="rounded-md bg-zinc-900 hover:bg-black text-white px-2.5 py-1 text-[11px] font-medium shadow-2xs transition shrink-0 cursor-pointer"
                                  >
                                    Review
                                  </button>
                                )}

                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                  className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-900 outline-none cursor-pointer"
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
                      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                        Payments Ledger & Settlements
                      </h1>
                      <p className="text-xs text-zinc-500 mt-0.5">Payment settlements, PG fee breakdown, and transaction status.</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs">
                      <span className="text-[10px] font-semibold uppercase text-zinc-400">Total Settled Volume</span>
                      <p className="text-xl font-semibold text-zinc-900 mt-1 tabular-nums">₹{totalRevenue.toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-emerald-700 font-medium mt-1">✓ 256-Bit SSL Encrypted</p>
                    </div>
                    <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs">
                      <span className="text-[10px] font-semibold uppercase text-zinc-400">Gateway Fees (Est. 2%)</span>
                      <p className="text-xl font-semibold text-zinc-900 mt-1 tabular-nums">₹{Math.round(totalRevenue * 0.02).toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Razorpay / UPI Interchange</p>
                    </div>
                    <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs">
                      <span className="text-[10px] font-semibold uppercase text-zinc-400">Net Merchant Payout</span>
                      <p className="text-xl font-semibold text-emerald-800 mt-1 tabular-nums">₹{Math.round(totalRevenue * 0.98).toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Direct Bank Account Credit</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-zinc-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[750px]">
                      <thead className="border-b border-zinc-200 bg-zinc-50/75 text-zinc-500 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="p-3.5">Txn ID & Date</th>
                          <th className="p-3.5">Order Ref</th>
                          <th className="p-3.5">Customer & Method</th>
                          <th className="p-3.5">Gross Amount</th>
                          <th className="p-3.5">Fee</th>
                          <th className="p-3.5">Net Payout</th>
                          <th className="p-3.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 font-normal">
                        {paymentTransactions.map(txn => (
                          <tr key={txn.id} className="hover:bg-zinc-50/75">
                            <td className="p-3.5">
                              <span className="font-mono font-semibold text-zinc-900 block">{txn.id}</span>
                              <span className="text-[10px] text-zinc-400">{txn.date}</span>
                            </td>
                            <td className="p-3.5 font-mono text-zinc-700">{txn.orderId}</td>
                            <td className="p-3.5">
                              <span className="font-medium text-zinc-900 block">{txn.customer}</span>
                              <span className="text-[10.5px] text-zinc-500">{txn.method}</span>
                            </td>
                            <td className="p-3.5 font-medium text-zinc-900 tabular-nums">₹{txn.amount.toLocaleString('en-IN')}</td>
                            <td className="p-3.5 text-zinc-500 tabular-nums">₹{txn.fee.toLocaleString('en-IN')}</td>
                            <td className="p-3.5 font-semibold text-emerald-800 tabular-nums">₹{txn.netSettlement.toLocaleString('en-IN')}</td>
                            <td className="p-3.5 text-right">
                              <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-medium">
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
                      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                        Customer Returns & RMA
                      </h1>
                      <p className="text-xs text-zinc-500 mt-0.5">Review inspection notes, return conditions, and authorize reverse logistics.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-zinc-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[750px]">
                      <thead className="border-b border-zinc-200 bg-zinc-50/75 text-zinc-500 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="p-3.5">Order Ref</th>
                          <th className="p-3.5">Customer Details</th>
                          <th className="p-3.5">Return Reason & Notes</th>
                          <th className="p-3.5">Amount</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 font-normal">
                        {orders.filter(o => o.status === 'Return Requested' || o.returnRequest).map(order => (
                          <tr key={order.id} className="hover:bg-zinc-50/75">
                            <td className="p-3.5 font-mono font-semibold text-zinc-900">{order.id}</td>
                            <td className="p-3.5">
                              <span className="font-medium text-zinc-900 block">{order.customer?.firstName} {order.customer?.lastName}</span>
                              <span className="text-[10px] text-zinc-400">{order.customer?.city}</span>
                            </td>
                            <td className="p-3.5">
                              <p className="font-medium text-zinc-900">{order.returnRequest?.reason || 'Exchange Requested'}</p>
                              <p className="text-[10.5px] text-zinc-500">Condition: {order.returnRequest?.condition || 'Inspected'}</p>
                            </td>
                            <td className="p-3.5 font-semibold text-zinc-900 tabular-nums">₹{order.total?.toLocaleString('en-IN')}</td>
                            <td className="p-3.5">
                              <span className="rounded-full bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-0.5 text-[10px] font-medium">
                                {order.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleOpenAdminReturnModal(order)}
                                className="rounded-md bg-zinc-900 hover:bg-black text-white px-3 py-1 text-xs font-medium transition shadow-xs cursor-pointer"
                              >
                                Review & Refund
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
                      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                        Refunds Disbursement Ledger
                      </h1>
                      <p className="text-xs text-zinc-500 mt-0.5">Track refunded invoices and banking transaction IDs.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-zinc-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead className="border-b border-zinc-200 bg-zinc-50/75 text-zinc-500 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="p-3.5">Refund Ref</th>
                          <th className="p-3.5">Order ID</th>
                          <th className="p-3.5">Customer & Mode</th>
                          <th className="p-3.5">Refund Amount</th>
                          <th className="p-3.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 font-normal">
                        {refundsList.map(o => (
                          <tr key={o.id} className="hover:bg-zinc-50/75">
                            <td className="p-3.5 font-mono font-semibold text-zinc-900">
                              {o.refundDetails?.transactionId || `REF-${o.id.replace(/[^0-9]/g, '')}`}
                            </td>
                            <td className="p-3.5 font-mono text-zinc-700">{o.id}</td>
                            <td className="p-3.5">
                              <span className="font-medium text-zinc-900 block">{o.customer?.firstName} {o.customer?.lastName}</span>
                              <span className="text-[10.5px] text-zinc-500">{o.paymentMethod}</span>
                            </td>
                            <td className="p-3.5 font-semibold text-emerald-800 tabular-nums">₹{Number(o.total || 0).toLocaleString('en-IN')}</td>
                            <td className="p-3.5 text-right">
                              <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-medium">
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
                      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                        Discount Vouchers & Coupons
                      </h1>
                      <p className="text-xs text-zinc-500 mt-0.5">Create discount promo codes and minimum spend rules.</p>
                    </div>
                  </div>

                  <form onSubmit={handleAddCoupon} className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs grid gap-3 sm:grid-cols-4 items-end">
                    <div>
                      <label className="text-xs font-medium text-zinc-700 block mb-1">Promo Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. LUXURY20"
                        value={newCouponCode}
                        onChange={e => setNewCouponCode(e.target.value)}
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-mono font-semibold uppercase outline-none focus:bg-white focus:border-zinc-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-700 block mb-1">Discount (% or ₹) *</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 20"
                        value={newCouponDiscount}
                        onChange={e => setNewCouponDiscount(e.target.value)}
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium outline-none focus:bg-white focus:border-zinc-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-700 block mb-1">Min Spend (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 5000"
                        value={newCouponMin}
                        onChange={e => setNewCouponMin(e.target.value)}
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium outline-none focus:bg-white focus:border-zinc-400"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-lg bg-zinc-900 hover:bg-black py-2 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
                    >
                      + Create Coupon
                    </button>
                  </form>

                  <div className="grid gap-3.5 sm:grid-cols-3">
                    {coupons.map(c => (
                      <div key={c.code} className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono font-semibold text-xs bg-zinc-100 px-2 py-0.5 rounded-md text-zinc-900 border border-zinc-200/70">
                              {c.code}
                            </span>
                            <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              {c.status}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-zinc-900">{c.discount}% Off Discount</p>
                          <p className="text-[10.5px] text-zinc-500 mt-0.5">
                            Min spend: ₹{c.minSpend.toLocaleString('en-IN')} &bull; Used {c.usageCount} times
                          </p>
                        </div>
                        <div className="mt-4 pt-2 border-t border-zinc-100 flex justify-end">
                          <button
                            onClick={() => setCoupons(prev => prev.filter(cp => cp.code !== c.code))}
                            className="text-xs font-medium text-rose-600 hover:underline cursor-pointer"
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
                      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                        Promotions & Campaign Banners
                      </h1>
                      <p className="text-xs text-zinc-500 mt-0.5">Seasonal sales, flash discounts, and hero storefront banners.</p>
                    </div>
                    <button
                      onClick={() => setPromoModalOpen(true)}
                      className="rounded-lg bg-zinc-900 hover:bg-black px-3.5 py-1.5 text-xs font-medium text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Create Promotion</span>
                    </button>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {promotions.map(p => (
                      <div key={p.id} className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-semibold text-xs bg-zinc-100 text-zinc-900 border border-zinc-200 px-2 py-0.5 rounded-md">
                            {p.code}
                          </span>
                          <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {p.status}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-zinc-900 text-sm">{p.title}</h4>
                          <p className="text-xs font-medium text-zinc-600 mt-0.5">{p.discount} &bull; {p.targetCategory}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[10.5px] text-zinc-400">
                          <span>{p.impressions.toLocaleString()} views &bull; {p.clicks.toLocaleString()} clicks</span>
                          <button onClick={() => deletePromotion(p.id)} className="text-rose-600 font-medium hover:underline cursor-pointer">
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
                      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                        Customer & User Accounts ({users.length})
                      </h1>
                      <p className="text-xs text-zinc-500 mt-0.5">Manage buyer accounts, contact records, and access permissions.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-zinc-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[650px]">
                      <thead className="border-b border-zinc-200 bg-zinc-50/75 text-zinc-500 uppercase text-[10px] font-semibold">
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
                      <tbody className="divide-y divide-zinc-100 font-normal">
                        {users.map(u => (
                          <tr key={u.id} className="hover:bg-zinc-50/75">
                            <td className="p-3.5 font-semibold text-zinc-900">{u.name}</td>
                            <td className="p-3.5 text-zinc-600 font-mono text-[11.5px]">{u.email}</td>
                            <td className="p-3.5 text-zinc-500">{u.phone || '—'}</td>
                            <td className="p-3.5">
                              <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700">
                                {u.role}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono text-zinc-700">{u.ordersCount || 0}</td>
                            <td className="p-3.5">
                              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium border ${
                                u.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                              }`}>
                                {u.status || 'Active'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => {
                                  toggleUserStatus(u.id);
                                  showToast(`User ${u.name} status updated`);
                                  refreshAll();
                                }}
                                className="rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 transition cursor-pointer"
                              >
                                {u.status === 'Disabled' ? 'Activate' : 'Disable'}
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
                      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                        Vendor Partners & Suppliers ({suppliers.length})
                      </h1>
                      <p className="text-xs text-zinc-500 mt-0.5">Approve vendor onboardings and manage supply relationships.</p>
                    </div>
                    <button
                      onClick={() => setSupplierModalOpen(true)}
                      className="rounded-lg bg-zinc-900 hover:bg-black px-3.5 py-1.5 text-xs font-medium text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Onboard Vendor</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-zinc-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead className="border-b border-zinc-200 bg-zinc-50/75 text-zinc-500 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="p-3.5">Vendor Name</th>
                          <th className="p-3.5">Department</th>
                          <th className="p-3.5">Email & Phone</th>
                          <th className="p-3.5">Address</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 font-normal">
                        {suppliers.map(s => (
                          <tr key={s.id} className="hover:bg-zinc-50/75">
                            <td className="p-3.5 font-semibold text-zinc-900">{s.name}</td>
                            <td className="p-3.5 text-zinc-600">{s.category}</td>
                            <td className="p-3.5">
                              <span className="font-mono text-zinc-700 block">{s.email}</span>
                              <span className="text-[10.5px] text-zinc-400">{s.phone}</span>
                            </td>
                            <td className="p-3.5 text-zinc-500">{s.address}</td>
                            <td className="p-3.5">
                              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium border ${
                                s.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}>
                                {s.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-1.5">
                              {s.status === 'Pending Approval' ? (
                                <button
                                  onClick={() => {
                                    approveSupplier(s.id);
                                    showToast(`Vendor ${s.name} approved`);
                                    refreshAll();
                                  }}
                                  className="rounded-md bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 text-xs font-medium transition cursor-pointer"
                                >
                                  Approve
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    toggleSupplierStatus(s.id);
                                    showToast(`Supplier status updated`);
                                    refreshAll();
                                  }}
                                  className="rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 transition cursor-pointer"
                                >
                                  {s.status === 'Active' ? 'Deactivate' : 'Activate'}
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
                      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                        Governance Roles ({roles.length})
                      </h1>
                      <p className="text-xs text-zinc-500 mt-0.5">Platform access levels and functional permissions.</p>
                    </div>
                    <button
                      onClick={() => setRoleModalOpen(true)}
                      className="rounded-lg bg-zinc-900 hover:bg-black px-3.5 py-1.5 text-xs font-medium text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Role</span>
                    </button>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {roles.map(r => (
                      <div key={r.id} className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-900 text-sm">{r.name}</span>
                          <span className="text-[10px] font-medium bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-md">
                            {r.membersCount} Assigned
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">{r.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-item: Permissions Matrix */}
              {activeSubTab === 'permissions' && (
                <div className="space-y-5">
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                      Permissions Matrix
                    </h1>
                    <p className="text-xs text-zinc-500 mt-0.5">Granular feature capabilities mapped to platform roles.</p>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-zinc-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[650px]">
                      <thead className="border-b border-zinc-200 bg-zinc-50/75 text-zinc-500 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="p-3.5">Capability / Permission</th>
                          <th className="p-3.5 text-center">Super Admin</th>
                          <th className="p-3.5 text-center">Catalog Ops</th>
                          <th className="p-3.5 text-center">Finance Lead</th>
                          <th className="p-3.5 text-center">Support</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 font-normal">
                        {permissionsMatrix.map(perm => (
                          <tr key={perm.id} className="hover:bg-zinc-50/75">
                            <td className="p-3.5">
                              <span className="font-medium text-zinc-900 block">{perm.capability}</span>
                              <span className="text-[10.5px] text-zinc-400">{perm.category}</span>
                            </td>
                            <td className="p-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={perm.superAdmin}
                                onChange={e => updateRolePermission(perm.id, 'superAdmin', e.target.checked)}
                                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 cursor-pointer"
                              />
                            </td>
                            <td className="p-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={perm.catalogManager}
                                onChange={e => updateRolePermission(perm.id, 'catalogManager', e.target.checked)}
                                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 cursor-pointer"
                              />
                            </td>
                            <td className="p-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={perm.financeLead}
                                onChange={e => updateRolePermission(perm.id, 'financeLead', e.target.checked)}
                                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 cursor-pointer"
                              />
                            </td>
                            <td className="p-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={perm.supportAgent}
                                onChange={e => updateRolePermission(perm.id, 'supportAgent', e.target.checked)}
                                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 cursor-pointer"
                              />
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
              MODULE 5: OPERATIONS
          ========================================== */}
          {activeSection === 'operations' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Sub-item: Inventory */}
              {activeSubTab === 'inventory' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                        Inventory Health & Stock Ledger
                      </h1>
                      <p className="text-xs text-zinc-500 mt-0.5">Real-time unit availability and replenishment thresholds.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-zinc-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead className="border-b border-zinc-200 bg-zinc-50/75 text-zinc-500 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="p-3.5">Product SKU</th>
                          <th className="p-3.5">Title</th>
                          <th className="p-3.5">Department</th>
                          <th className="p-3.5">Current Stock</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Quick Restock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 font-normal">
                        {products.map(p => {
                          const stock = Number(p.stock) || 0;
                          return (
                            <tr key={p.id} className="hover:bg-zinc-50/75">
                              <td className="p-3.5 font-mono text-zinc-700">{p.sku}</td>
                              <td className="p-3.5 font-medium text-zinc-900 truncate max-w-xs">{p.name}</td>
                              <td className="p-3.5 text-zinc-500">{p.category}</td>
                              <td className="p-3.5 font-mono font-semibold tabular-nums text-zinc-900">{stock} Units</td>
                              <td className="p-3.5">
                                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium border ${
                                  stock <= 0 ? 'bg-rose-50 text-rose-800 border-rose-200' : stock < 5 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                }`}>
                                  {stock <= 0 ? 'Out of Stock' : stock < 5 ? 'Low Stock' : 'Healthy'}
                                </span>
                              </td>
                              <td className="p-3.5 text-right space-x-1.5">
                                <button
                                  onClick={() => handleStockAdjust(p.id, 5)}
                                  className="rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 transition cursor-pointer"
                                >
                                  +5 Units
                                </button>
                                <button
                                  onClick={() => handleStockAdjust(p.id, 20)}
                                  className="rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 transition cursor-pointer"
                                >
                                  +20 Units
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-item: Shipping */}
              {activeSubTab === 'shipping' && (
                <div className="space-y-5">
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                      Logistics Carriers & SLAs
                    </h1>
                    <p className="text-xs text-zinc-500 mt-0.5">Configure integrated express delivery carriers.</p>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {shippingCarriers.map(c => (
                      <div key={c.id} className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-zinc-600" />
                            <h4 className="font-semibold text-zinc-900 text-sm">{c.name}</h4>
                          </div>
                          <button
                            onClick={() => {
                              toggleCarrierStatus(c.id);
                              refreshAll();
                              showToast('Carrier status updated');
                            }}
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium border cursor-pointer ${
                              c.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                            }`}
                          >
                            {c.status}
                          </button>
                        </div>
                        <div className="text-xs text-zinc-500 space-y-1">
                          <p><strong>Tracking Format:</strong> <span className="font-mono">{c.trackingFormat}</span></p>
                          <p><strong>Delivery SLA:</strong> {c.sla}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-item: Order Status Distribution */}
              {activeSubTab === 'order-status' && (
                <div className="space-y-5">
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                      Order Fulfillment Pipeline
                    </h1>
                    <p className="text-xs text-zinc-500 mt-0.5">Live distribution across delivery stages.</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-4">
                    {[
                      { stage: 'Confirmed', count: orders.filter(o => o.status === 'Confirmed').length, color: 'border-zinc-300' },
                      { stage: 'Processing', count: orders.filter(o => o.status === 'Processing').length, color: 'border-zinc-300' },
                      { stage: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length, color: 'border-sky-300' },
                      { stage: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length, color: 'border-emerald-300' }
                    ].map(st => (
                      <div key={st.stage} className={`rounded-xl border ${st.color} bg-white p-4 shadow-2xs`}>
                        <span className="text-[10px] font-semibold uppercase text-zinc-400">{st.stage}</span>
                        <p className="text-2xl font-semibold text-zinc-900 mt-1 tabular-nums">{st.count}</p>
                        <p className="text-[10.5px] text-zinc-400 mt-0.5">Active Consignments</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-item: Notifications */}
              {activeSubTab === 'notifications' && (
                <div className="space-y-5">
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                      Platform Broadcasts & Alerts
                    </h1>
                    <p className="text-xs text-zinc-500 mt-0.5">Publish global announcements to all store administrators and customers.</p>
                  </div>

                  <form onSubmit={handleBroadcastNotification} className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-3.5 max-w-xl">
                    <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">+ Send Broadcast</h3>
                    <div>
                      <label className="text-xs font-medium text-zinc-700 block mb-1">Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Scheduled Maintenance Window"
                        value={newNotificationTitle}
                        onChange={e => setNewNotificationTitle(e.target.value)}
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium outline-none focus:bg-white focus:border-zinc-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-700 block mb-1">Message *</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Announcement message content..."
                        value={newNotificationText}
                        onChange={e => setNewNotificationText(e.target.value)}
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs outline-none focus:bg-white focus:border-zinc-400 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-lg bg-zinc-900 hover:bg-black px-4 py-2 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
                    >
                      Broadcast Message
                    </button>
                  </form>
                </div>
              )}

            </div>
          )}

          {/* ==========================================
              MODULE 6: ANALYTICS
          ========================================== */}
          {activeSection === 'analytics' && (
            <div className="space-y-6 animate-fade-in">
              
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                  Store Analytics & Intelligence
                </h1>
                <p className="text-xs text-zinc-500 mt-0.5">Commercial metrics, conversion, and supplier performance reporting.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs">
                  <span className="text-[10px] font-semibold uppercase text-zinc-400">Total GMV</span>
                  <p className="text-2xl font-semibold text-zinc-900 mt-1 tabular-nums">₹{totalRevenue.toLocaleString('en-IN')}</p>
                  <p className="text-[10.5px] text-emerald-700 font-medium mt-0.5">↑ +18.4% vs last period</p>
                </div>
                <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs">
                  <span className="text-[10px] font-semibold uppercase text-zinc-400">Average Order Value</span>
                  <p className="text-2xl font-semibold text-zinc-900 mt-1 tabular-nums">
                    ₹{Math.round(totalRevenue / Math.max(1, orders.length)).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10.5px] text-zinc-400 mt-0.5">Based on completed sales</p>
                </div>
                <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs">
                  <span className="text-[10px] font-semibold uppercase text-zinc-400">Repeat Retention Rate</span>
                  <p className="text-2xl font-semibold text-zinc-900 mt-1 tabular-nums">42.8%</p>
                  <p className="text-[10.5px] text-zinc-400 mt-0.5">Verified customer base</p>
                </div>
              </div>

              {/* Top Products Table */}
              <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-3">
                <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">Top Performing Products</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-zinc-200 bg-zinc-50/75 text-zinc-500 uppercase text-[10px] font-semibold">
                      <tr>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Unit Price</th>
                        <th className="p-3 text-right">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 font-normal">
                      {products.slice(0, 5).map(p => (
                        <tr key={p.id} className="hover:bg-zinc-50/75">
                          <td className="p-3 font-semibold text-zinc-900">{p.name}</td>
                          <td className="p-3 text-zinc-500">{p.category}</td>
                          <td className="p-3 font-medium text-zinc-900 tabular-nums">₹{Number(p.price).toLocaleString('en-IN')}</td>
                          <td className="p-3 text-right font-mono tabular-nums">{p.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              MODULE 7: SYSTEM
          ========================================== */}
          {activeSection === 'system' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Sub-item: Settings */}
              {activeSubTab === 'settings' && (
                <div className="space-y-5 max-w-xl">
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                      Store Profile & Global Settings
                    </h1>
                    <p className="text-xs text-zinc-500 mt-0.5">Master platform parameters and financial currencies.</p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-3.5 text-xs">
                    <div>
                      <label className="font-medium text-zinc-700 block mb-1">Store Name</label>
                      <input
                        type="text"
                        value={systemConfig.storeName}
                        onChange={e => setSystemConfigState({ ...systemConfig, storeName: e.target.value })}
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white focus:border-zinc-400 font-semibold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-medium text-zinc-700 block mb-1">Currency Symbol</label>
                        <input
                          type="text"
                          value={systemConfig.currency}
                          onChange={e => setSystemConfigState({ ...systemConfig, currency: e.target.value })}
                          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white focus:border-zinc-400"
                        />
                      </div>
                      <div>
                        <label className="font-medium text-zinc-700 block mb-1">Tax Rate (GST %)</label>
                        <input
                          type="number"
                          value={systemConfig.taxRate}
                          onChange={e => setSystemConfigState({ ...systemConfig, taxRate: Number(e.target.value) })}
                          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white focus:border-zinc-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-medium text-zinc-700 block mb-1">Support Email</label>
                      <input
                        type="email"
                        value={systemConfig.supportEmail}
                        onChange={e => setSystemConfigState({ ...systemConfig, supportEmail: e.target.value })}
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white focus:border-zinc-400"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-lg bg-zinc-900 hover:bg-black px-5 py-2 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
                    >
                      Save Configuration
                    </button>
                  </form>
                </div>
              )}

              {/* Sub-item: Audit Logs */}
              {activeSubTab === 'audit-logs' && (
                <div className="space-y-5">
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                      Security & Governance Audit Trail
                    </h1>
                    <p className="text-xs text-zinc-500 mt-0.5">Immutable record of administrator actions and modifications.</p>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-zinc-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[650px]">
                      <thead className="border-b border-zinc-200 bg-zinc-50/75 text-zinc-500 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="p-3.5">Action</th>
                          <th className="p-3.5">Event Detail</th>
                          <th className="p-3.5">Administrator</th>
                          <th className="p-3.5">Timestamp</th>
                          <th className="p-3.5 text-right">IP Address</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 font-normal">
                        {auditLogs.map(log => (
                          <tr key={log.id} className="hover:bg-zinc-50/75">
                            <td className="p-3.5 font-semibold text-zinc-900">{log.action}</td>
                            <td className="p-3.5 text-zinc-600">{log.detail}</td>
                            <td className="p-3.5 font-medium text-zinc-800">{log.admin}</td>
                            <td className="p-3.5 text-zinc-400">{log.time}</td>
                            <td className="p-3.5 text-right font-mono text-[11px] text-zinc-500">{log.ip}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-item: Security */}
              {activeSubTab === 'security' && (
                <div className="space-y-5 max-w-xl">
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                      Platform Security Overview
                    </h1>
                    <p className="text-xs text-zinc-500 mt-0.5">Authentication policies and encryption certificates.</p>
                  </div>

                  <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-3.5 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <div>
                        <span className="font-semibold text-zinc-900 block">Two-Factor Authentication (2FA)</span>
                        <p className="text-zinc-500 text-[11px]">Enforced for all administrative sessions</p>
                      </div>
                      <span className="text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
                        ✓ Enabled
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <div>
                        <span className="font-semibold text-zinc-900 block">TLS / SSL Encryption</span>
                        <p className="text-zinc-500 text-[11px]">High-grade SHA-256 with RSA Certificate</p>
                      </div>
                      <span className="text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
                        ✓ Active (A+ Grade)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-zinc-900 block">Session Inactivity Timeout</span>
                        <p className="text-zinc-500 text-[11px]">Auto-locks idle consoles after 30 minutes</p>
                      </div>
                      <span className="font-mono text-zinc-700 font-medium">30 Mins</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-item: Backups */}
              {activeSubTab === 'backups' && (
                <div className="space-y-5 max-w-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                        Database Backups & Snapshot Recovery
                      </h1>
                      <p className="text-xs text-zinc-500 mt-0.5">Export full store state as JSON or restore from snapshot.</p>
                    </div>
                    <button
                      onClick={handleDownloadBackup}
                      className="rounded-lg bg-zinc-900 hover:bg-black text-white px-3.5 py-1.5 text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Export JSON Backup</span>
                    </button>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-3">
                      <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">Automated Backup Schedule</h3>
                      <p className="text-xs text-zinc-500">
                        Nightly snapshots are saved automatically to redundant storage.
                      </p>
                      <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/60 text-xs space-y-1">
                        <p className="font-semibold text-zinc-900">Last Snapshot: Today at 04:30 AM</p>
                        <p className="text-zinc-400 text-[11px]">Includes: Products, Orders, Suppliers, Users, Config</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-3">
                      <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">Restore Database from JSON</h3>
                      <textarea
                        rows={3}
                        value={backupJsonInput}
                        onChange={e => setBackupJsonInput(e.target.value)}
                        placeholder="Paste exported backup JSON content here to restore state..."
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 text-xs font-mono outline-none focus:bg-white focus:border-zinc-400 resize-none"
                      />
                      <button
                        onClick={handleRestoreBackup}
                        className="rounded-lg bg-zinc-900 hover:bg-black px-3.5 py-2 text-xs font-semibold text-white shadow-xs cursor-pointer"
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
                    <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                      System Infrastructure & Gateways
                    </h1>
                    <p className="text-xs text-zinc-500 mt-0.5">API keys, SMTP mailer status, and maintenance mode toggles.</p>
                  </div>

                  <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <div>
                        <span className="font-semibold text-zinc-900 block">Payment Gateway (Razorpay API)</span>
                        <p className="text-zinc-500 text-[11px]">Production merchant keys active</p>
                      </div>
                      <span className="text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
                        ✓ Connected
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <div>
                        <span className="font-semibold text-zinc-900 block">Transactional Email SMTP</span>
                        <p className="text-zinc-500 text-[11px]">{systemConfig.smtpMailerStatus}</p>
                      </div>
                      <span className="text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
                        ✓ Connected
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <div>
                        <span className="font-semibold text-zinc-900 block">Storefront Maintenance Mode</span>
                        <p className="text-zinc-500 text-[11px]">Temporary downtime overlay for customers</p>
                      </div>
                      <button
                        onClick={() => {
                          const updated = saveSystemConfig({ maintenanceMode: !systemConfig.maintenanceMode });
                          setSystemConfigState(updated);
                          showToast(updated.maintenanceMode ? 'Maintenance Mode activated' : 'Store is live');
                        }}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                          systemConfig.maintenanceMode ? 'bg-rose-600 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                        }`}
                      >
                        {systemConfig.maintenanceMode ? 'Active (Store Offline)' : 'Inactive (Store Live)'}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-semibold text-zinc-900">
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Product'}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">Live synchronization with customer storefront</p>
              </div>
              <button
                onClick={() => setProductModalOpen(false)}
                className="text-zinc-400 hover:text-black p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Submariner Date 41mm Cerachrom"
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 outline-none focus:bg-white focus:border-zinc-400"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Department *</label>
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
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white font-medium cursor-pointer"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Brand *</label>
                  <select
                    value={productForm.brand}
                    onChange={e => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white font-medium cursor-pointer"
                  >
                    {(getBrandsByCategory(productForm.category) || brands).map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Gender / Dept</label>
                  <select
                    value={productForm.gender}
                    onChange={e => setProductForm({ ...productForm, gender: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white font-medium cursor-pointer"
                  >
                    <option value="Men's">Men's</option>
                    <option value="Ladies">Ladies</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="e.g. 945000"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.oldPrice}
                    onChange={e => setProductForm({ ...productForm, oldPrice: e.target.value })}
                    placeholder="e.g. 1050000"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="e.g. 15"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={e => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="e.g. KA-ROL-001"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Assigned Vendor</label>
                  <select
                    value={productForm.supplier}
                    onChange={e => setProductForm({ ...productForm, supplier: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white cursor-pointer font-medium"
                  >
                    {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-zinc-700 block mb-1">Product Image URL</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="font-medium text-zinc-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Detailed specifications and features..."
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-4 py-2 font-medium text-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-zinc-900 hover:bg-black px-5 py-2 font-semibold text-white shadow-xs cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <h3 className="text-sm font-semibold text-zinc-900">Add New Subcategory</h3>
              <button onClick={() => setSubcatModalOpen(false)} className="text-zinc-400 font-bold cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubcategory} className="space-y-3">
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Parent Department *</label>
                <select
                  value={subcatForm.category}
                  onChange={e => setSubcatForm({ ...subcatForm, category: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none font-medium cursor-pointer"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Subcategory Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chronograph Watches, Leather Wallets"
                  value={subcatForm.name}
                  onChange={e => setSubcatForm({ ...subcatForm, name: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white focus:border-zinc-400"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setSubcatModalOpen(false)} className="rounded-lg px-3.5 py-1.5 border border-zinc-200 bg-white font-medium cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg px-4 py-1.5 bg-zinc-900 text-white font-semibold cursor-pointer">
                  Save Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Variant Modal */}
      {variantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <h3 className="text-sm font-semibold text-zinc-900">Add Product Variant</h3>
              <button onClick={() => setVariantModalOpen(false)} className="text-zinc-400 font-bold cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddVariant} className="space-y-3">
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Parent Product *</label>
                <select
                  value={variantForm.productName}
                  onChange={e => setVariantForm({ ...variantForm, productName: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none font-medium cursor-pointer"
                >
                  {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Attribute Type *</label>
                <select
                  value={variantForm.attributeType}
                  onChange={e => setVariantForm({ ...variantForm, attributeType: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none font-medium cursor-pointer"
                >
                  <option value="Dial Color">Dial Color</option>
                  <option value="Strap Material">Strap Material</option>
                  <option value="Shoe Size">Shoe Size</option>
                  <option value="Storage">Storage / Capacity</option>
                  <option value="Color Finish">Color Finish</option>
                </select>
              </div>
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Option Value *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kermit Green, UK 10, 512 GB"
                  value={variantForm.value}
                  onChange={e => setVariantForm({ ...variantForm, value: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white focus:border-zinc-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Price Add-on (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={variantForm.priceModifier}
                    onChange={e => setVariantForm({ ...variantForm, priceModifier: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={variantForm.stock}
                    onChange={e => setVariantForm({ ...variantForm, stock: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setVariantModalOpen(false)} className="rounded-lg px-3.5 py-1.5 border border-zinc-200 bg-white font-medium cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg px-4 py-1.5 bg-zinc-900 text-white font-semibold cursor-pointer">
                  Save Variant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Media Asset Modal */}
      {mediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <h3 className="text-sm font-semibold text-zinc-900">Index Media Asset</h3>
              <button onClick={() => setMediaModalOpen(false)} className="text-zinc-400 font-bold cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddMedia} className="space-y-3">
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Asset Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rolex Submariner Macro Studio"
                  value={mediaForm.title}
                  onChange={e => setMediaForm({ ...mediaForm, title: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white focus:border-zinc-400"
                />
              </div>
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={mediaForm.url}
                  onChange={e => setMediaForm({ ...mediaForm, url: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white focus:border-zinc-400"
                />
              </div>
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Category</label>
                <select
                  value={mediaForm.category}
                  onChange={e => setMediaForm({ ...mediaForm, category: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none font-medium cursor-pointer"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setMediaModalOpen(false)} className="rounded-lg px-3.5 py-1.5 border border-zinc-200 bg-white font-medium cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg px-4 py-1.5 bg-zinc-900 text-white font-semibold cursor-pointer">
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Promotion Modal */}
      {promoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <h3 className="text-sm font-semibold text-zinc-900">Create Promotional Campaign</h3>
              <button onClick={() => setPromoModalOpen(false)} className="text-zinc-400 font-bold cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddPromotion} className="space-y-3">
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Autumn Horology Showcase"
                  value={promoForm.title}
                  onChange={e => setPromoForm({ ...promoForm, title: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white focus:border-zinc-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Promo Code</label>
                  <input
                    type="text"
                    placeholder="AUTUMN20"
                    value={promoForm.code}
                    onChange={e => setPromoForm({ ...promoForm, code: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono uppercase font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Discount Text</label>
                  <input
                    type="text"
                    placeholder="Flat 20% Off"
                    value={promoForm.discount}
                    onChange={e => setPromoForm({ ...promoForm, discount: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Target Department</label>
                <select
                  value={promoForm.targetCategory}
                  onChange={e => setPromoForm({ ...promoForm, targetCategory: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none font-medium cursor-pointer"
                >
                  <option value="All Departments">All Departments</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setPromoModalOpen(false)} className="rounded-lg px-3.5 py-1.5 border border-zinc-200 bg-white font-medium cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg px-4 py-1.5 bg-zinc-900 text-white font-semibold cursor-pointer">
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Role Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <h3 className="text-sm font-semibold text-zinc-900">Add Governance Role</h3>
              <button onClick={() => setRoleModalOpen(false)} className="text-zinc-400 font-bold cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddRole} className="space-y-3">
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Concierge Manager"
                  value={roleForm.name}
                  onChange={e => setRoleForm({ ...roleForm, name: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white focus:border-zinc-400"
                />
              </div>
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Role Description</label>
                <textarea
                  rows={2}
                  placeholder="Responsibilities and access scope..."
                  value={roleForm.description}
                  onChange={e => setRoleForm({ ...roleForm, description: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white resize-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setRoleModalOpen(false)} className="rounded-lg px-3.5 py-1.5 border border-zinc-200 bg-white font-medium cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg px-4 py-1.5 bg-zinc-900 text-white font-semibold cursor-pointer">
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Admin Return & Refund Review Modal */}
      {adminReturnModalOpen && selectedReturnOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-800 font-semibold text-xs">
                  <RotateCcw className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">
                    Review Return & Settle Refund
                  </h3>
                  <span className="font-mono text-[10px] text-zinc-400">Order: {selectedReturnOrder.id}</span>
                </div>
              </div>
              <button
                onClick={() => setAdminReturnModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-900 p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl border border-zinc-200/70 bg-zinc-50/70 p-3.5 space-y-2 text-zinc-900">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-900">Customer: {selectedReturnOrder.customer?.firstName} {selectedReturnOrder.customer?.lastName}</span>
                <span className="font-mono font-semibold text-zinc-900">₹{selectedReturnOrder.total?.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-zinc-600">
                <strong>Reason:</strong> {selectedReturnOrder.returnRequest?.reason || 'Not specified'}
              </p>
              <p className="text-[11px] text-zinc-600">
                <strong>Condition:</strong> {selectedReturnOrder.returnRequest?.condition || 'Inspected'}
              </p>
            </div>

            <form onSubmit={handleProcessAdminReturn} className="space-y-3.5">
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Administrative Decision *</label>
                <select
                  value={adminReturnDecision}
                  onChange={e => setAdminReturnDecision(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white text-xs font-semibold text-zinc-900 cursor-pointer"
                >
                  <option value="Refunded">Approve Return & Issue Full Refund (Refunded)</option>
                  <option value="Return Approved">Authorize Return Pickup (Pending Warehouse Inspection)</option>
                  <option value="Return Rejected">Decline / Reject Return Request</option>
                </select>
              </div>

              {adminReturnDecision === 'Refunded' && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="font-medium text-zinc-700 block mb-1">Refund Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      value={adminRefundAmount}
                      onChange={e => setAdminRefundAmount(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white font-mono font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-zinc-700 block mb-1">Refund Txn ID *</label>
                    <input
                      type="text"
                      required
                      value={adminRefundTxn}
                      onChange={e => setAdminRefundTxn(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-medium text-zinc-700 block mb-1">Admin Audit Notes / Feedback</label>
                <textarea
                  rows={2}
                  value={adminReturnNotes}
                  onChange={e => setAdminReturnNotes(e.target.value)}
                  placeholder="Notes logged in customer timeline..."
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setAdminReturnModalOpen(false)}
                  className="rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-4 py-2 font-medium text-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`rounded-lg px-5 py-2 font-semibold text-white shadow-xs cursor-pointer ${
                    adminReturnDecision === 'Return Rejected'
                      ? 'bg-rose-700 hover:bg-rose-800'
                      : 'bg-zinc-900 hover:bg-black'
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

      {/* 8. Add Supplier / Vendor Modal */}
      {supplierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">Onboard New Vendor</h3>
                <p className="text-[11px] text-zinc-500">Register a new supplier for product fulfillment</p>
              </div>
              <button onClick={() => setSupplierModalOpen(false)} className="text-zinc-400 font-bold hover:text-black cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddSupplierSubmit} className="space-y-3">
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Company / Vendor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Timepieces Ltd."
                  value={supplierForm.name}
                  onChange={e => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white focus:border-zinc-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Department</label>
                  <select
                    value={supplierForm.category}
                    onChange={e => setSupplierForm({ ...supplierForm, category: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none font-medium cursor-pointer"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={supplierForm.phone}
                    onChange={e => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white focus:border-zinc-400"
                  />
                </div>
              </div>
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Business Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="vendor@company.com"
                  value={supplierForm.email}
                  onChange={e => setSupplierForm({ ...supplierForm, email: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white focus:border-zinc-400"
                />
              </div>
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Registered Address</label>
                <input
                  type="text"
                  placeholder="City, State, India"
                  value={supplierForm.address}
                  onChange={e => setSupplierForm({ ...supplierForm, address: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white focus:border-zinc-400"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100">
                <button type="button" onClick={() => setSupplierModalOpen(false)} className="rounded-lg px-3.5 py-1.5 border border-zinc-200 bg-white font-medium hover:bg-zinc-50 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg px-4 py-1.5 bg-zinc-900 text-white font-semibold hover:bg-black cursor-pointer shadow-xs">
                  Add Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Admin Order Details Inspector & Invoice Modal */}
      {orderModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-5 sm:p-7 shadow-2xl space-y-5 text-xs max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center text-sm font-semibold shadow-xs">
                  <Package className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-zinc-900 tracking-tight">
                      Order Consignment {selectedOrder.id}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                      selectedOrder.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : selectedOrder.status === 'Shipped'
                        ? 'bg-sky-50 text-sky-800 border-sky-200'
                        : selectedOrder.status === 'Cancelled'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Placed on {selectedOrder.date} &bull; Payment: <strong className="text-zinc-700 font-medium">{selectedOrder.paymentMethod} ({selectedOrder.paymentStatus || 'Paid'})</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition flex items-center gap-1.5 cursor-pointer"
                  title="Print Consignment Invoice"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setOrderModalOpen(false)}
                  className="rounded-lg bg-zinc-100 hover:bg-zinc-200 h-8 w-8 flex items-center justify-center text-zinc-500 hover:text-zinc-900 font-bold transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 2-Column Grid */}
            <div className="grid gap-5 md:grid-cols-2">
              
              {/* Left Column: Customer & Delivery Destination */}
              <div className="space-y-4">
                <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Client & Contact
                    </span>
                    <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Verified Client
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-zinc-900">
                      {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                    </p>
                    <p className="text-zinc-600 flex items-center gap-1.5">
                      <span className="text-zinc-400">Email:</span>
                      <a href={`mailto:${selectedOrder.customer?.email}`} className="text-zinc-900 font-medium hover:underline">
                        {selectedOrder.customer?.email || 'Not provided'}
                      </a>
                    </p>
                    <p className="text-zinc-600 flex items-center gap-1.5">
                      <span className="text-zinc-400">Phone:</span>
                      <a href={`tel:${selectedOrder.customer?.phone}`} className="text-zinc-900 font-medium hover:underline font-mono">
                        {selectedOrder.customer?.phone || 'Not provided'}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Shipping Destination
                    </span>
                    <span className="font-mono text-[10.5px] font-semibold text-zinc-700">
                      PIN: {selectedOrder.customer?.pincode || '380001'}
                    </span>
                  </div>

                  <div className="space-y-1 text-zinc-700 leading-relaxed">
                    <p className="font-medium text-zinc-900">
                      {selectedOrder.customer?.address || 'Standard Address'}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-medium">
                      {selectedOrder.customer?.city || 'Ahmedabad'}, {selectedOrder.customer?.state || 'Gujarat'} - {selectedOrder.customer?.pincode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Financial Breakdown & Fast Status/Courier Assignment */}
              <div className="space-y-4">
                
                {/* Financial Summary */}
                <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block border-b border-zinc-200/60 pb-1.5">
                    Financial Summary
                  </span>
                  <div className="space-y-1.5 text-xs text-zinc-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-zinc-900 tabular-nums">₹{(selectedOrder.subtotal || 0).toLocaleString('en-IN')}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-800 font-medium">
                        <span>Discount Applied</span>
                        <span className="tabular-nums">−₹{selectedOrder.discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping Handling</span>
                      <span className="font-semibold text-zinc-900 tabular-nums">
                        {selectedOrder.shipping === 0 ? <span className="text-emerald-800 font-semibold">FREE</span> : `₹${selectedOrder.shipping}`}
                      </span>
                    </div>
                    <div className="border-t border-zinc-200 pt-2 flex justify-between items-baseline">
                      <span className="font-semibold text-zinc-900">Total Invoice Amount</span>
                      <span className="text-base font-semibold text-zinc-900 tabular-nums">
                        ₹{(selectedOrder.total || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Logistics & Status Form */}
                <form onSubmit={handleUpdateOrderDetails} className="rounded-xl border border-zinc-200/80 bg-white p-4 space-y-3 shadow-2xs">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block border-b border-zinc-100 pb-1.5">
                    Fulfillment & Courier Controls
                  </span>

                  <div>
                    <label className="text-[11px] font-medium text-zinc-700 block mb-1">Fulfillment Status</label>
                    <select
                      value={selectedOrderStatus}
                      onChange={e => setSelectedOrderStatus(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-900 outline-none cursor-pointer"
                    >
                      <option value="Confirmed">Confirmed (Order Accepted)</option>
                      <option value="Processing">Processing & Packing</option>
                      <option value="Shipped">Shipped (Dispatched to Courier)</option>
                      <option value="Out for Delivery">Out for Delivery (Final Mile)</option>
                      <option value="Delivered">Delivered (Completed)</option>
                      <option value="Return Requested">Return Requested</option>
                      <option value="Refunded">Refunded</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-medium text-zinc-700 block mb-1">Carrier Partner</label>
                      <select
                        value={selectedOrderCourier}
                        onChange={e => setSelectedOrderCourier(e.target.value)}
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-900 outline-none cursor-pointer"
                      >
                        <option value="BlueDart Express Air">BlueDart Express Air</option>
                        <option value="Delhivery Surface & Air">Delhivery Surface & Air</option>
                        <option value="FedEx Luxury Secure">FedEx Luxury Secure</option>
                        <option value="DTDC Prime Gold">DTDC Prime Gold</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-zinc-700 block mb-1">AWB Tracking No.</label>
                      <input
                        type="text"
                        value={selectedOrderTracking}
                        onChange={e => setSelectedOrderTracking(e.target.value)}
                        placeholder="e.g. BD98234110IN"
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-mono font-semibold text-zinc-900 outline-none focus:bg-white focus:border-zinc-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-zinc-900 hover:bg-black py-2 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
                  >
                    Save Fulfillment Details
                  </button>
                </form>

              </div>

            </div>

            {/* Purchased Items Table */}
            <div className="rounded-xl border border-zinc-200/80 bg-white overflow-hidden shadow-2xs">
              <div className="bg-zinc-50/75 px-4 py-2.5 border-b border-zinc-200 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Consignment Items Checklist ({selectedOrder.items?.length || 0})
                </span>
                <span className="font-mono text-[10px] text-zinc-400">Inventory Verified</span>
              </div>

              <div className="divide-y divide-zinc-100 max-h-48 overflow-y-auto">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image}
                        alt=""
                        className="h-10 w-10 rounded-lg object-contain bg-zinc-50 border border-zinc-200 p-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-900 truncate">{item.name}</p>
                        <p className="text-[10.5px] text-zinc-400 truncate">
                          {item.brand || 'Luxury Edition'} {item.color && `&bull; ${item.color}`} &bull; Qty: <strong className="text-zinc-700 font-semibold">{item.quantity}</strong>
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 font-mono">
                      <span className="font-semibold text-zinc-900 block tabular-nums">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-zinc-400 tabular-nums">₹{(item.price || 0).toLocaleString('en-IN')} each</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setOrderModalOpen(false)}
                className="rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-4 py-1.5 font-medium text-zinc-700 transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}