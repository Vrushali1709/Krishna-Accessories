// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  TrendingDown,
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
  Upload,
  Layers,
  Store,
  SlidersHorizontal,
  CheckCircle2,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Smartphone,
  Laptop,
  Check,
  HelpCircle,
  Activity,
  Globe,
  DollarSign,
  Key,
  Server,
  Radio,
  Shield,
  Send,
  MoreVertical,
  Edit2,
  ShoppingBag,
  Sparkles,
  Command,
  ChevronUp,
  Sliders,
  Calendar,
  UserCheck,
  Building2,
  Grid,
  List
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

  // SaaS Controls State
  const [timeRange, setTimeRange] = useState('30D');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [catalogViewMode, setCatalogViewMode] = useState('table'); // 'table' | 'grid'
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [chartMetric, setChartMetric] = useState('revenue'); // 'revenue' | 'orders' | 'aov'

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
    category: 'Watches',
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

  // Top header popovers & alert toasts
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [backupJsonInput, setBackupJsonInput] = useState('');

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, action: 'Product Published', detail: 'Added Rolex Submariner Cerachrom 41mm to Watches', time: '8 mins ago', admin: 'Super Admin', ip: '103.21.144.20' },
    { id: 2, action: 'Vendor Verified', detail: 'Approved Apex Timepieces Ltd. GSTIN & Trade Certificate', time: '42 mins ago', admin: 'Super Admin', ip: '103.21.144.20' },
    { id: 3, action: 'Order Consignment Dispatched', detail: 'Marked order KA-98421 Shipped via BlueDart Express Air', time: '2 hours ago', admin: 'Super Admin', ip: '103.21.144.20' },
    { id: 4, action: 'Campaign Created', detail: 'Launched KRISHNA10 promo code for customer checkout', time: '1 day ago', admin: 'Super Admin', ip: '103.21.144.20' },
    { id: 5, action: 'Security Handshake', detail: '2FA authentication verified for Admin Console Session', time: '2 days ago', admin: 'Security Daemon', ip: 'System Core' }
  ]);

  const refreshAll = useCallback(() => {
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
  }, []);

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
  }, [refreshAll]);

  // Global Command Palette Shortcut Listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setNotifsOpen(false);
        setUserDropdownOpen(false);
        setQuickCreateOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
  const averageOrderValue = Math.round(totalRevenue / Math.max(1, orders.filter(o => o.status !== 'Cancelled').length));

  // Payments Ledger Computations
  const paymentTransactions = useMemo(() => {
    return orders.map(o => ({
      id: `TXN-${o.id.replace('KA-', '')}`,
      orderId: o.id,
      customer: `${o.customer?.firstName || 'Guest'} ${o.customer?.lastName || 'Client'}`,
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
        { id: 'overview', label: 'Executive Overview' },
        { id: 'revenue', label: 'GMV & Revenue' },
        { id: 'orders', label: 'Live Orders' },
        { id: 'pending', label: 'Action Center', badge: pendingSuppliers.length + returnRequests.length + lowStockItems.length > 0 ? `${pendingSuppliers.length + returnRequests.length + lowStockItems.length}` : null },
        { id: 'charts', label: 'Sales Visualizer' }
      ]
    },
    {
      id: 'commerce',
      title: 'Commerce',
      icon: CreditCard,
      badge: activeOrdersCount > 0 ? `${activeOrdersCount}` : null,
      subItems: [
        { id: 'orders', label: 'Orders & Shipments' },
        { id: 'payments', label: 'Payments & Settlement' },
        { id: 'returns', label: 'RMA & Returns', badge: returnRequests.length > 0 ? `${returnRequests.length}` : null },
        { id: 'refunds', label: 'Refunds Ledger' },
        { id: 'coupons', label: 'Coupons & Vouchers' },
        { id: 'promotions', label: 'Marketing Campaigns' }
      ]
    },
    {
      id: 'catalog',
      title: 'Catalog & Inventory',
      icon: Package,
      badge: products.length,
      subItems: [
        { id: 'products', label: 'Master Products' },
        { id: 'categories', label: 'Departments' },
        { id: 'subcategories', label: 'Subcategories' },
        { id: 'brands', label: 'Luxury Brands' },
        { id: 'variants', label: 'Variant Matrix' },
        { id: 'images', label: 'Media Library' }
      ]
    },
    {
      id: 'people',
      title: 'Partners & Users',
      icon: Users,
      badge: users.length,
      subItems: [
        { id: 'users', label: 'Customer Directory' },
        { id: 'suppliers', label: 'Vendor Partners', badge: pendingSuppliers.length > 0 ? `${pendingSuppliers.length}` : null },
        { id: 'roles', label: 'Team Roles' },
        { id: 'permissions', label: 'Permissions Matrix' }
      ]
    },
    {
      id: 'operations',
      title: 'Logistics & Ops',
      icon: Zap,
      badge: lowStockItems.length > 0 ? `${lowStockItems.length}` : null,
      subItems: [
        { id: 'inventory', label: 'Stock Health & Restock' },
        { id: 'shipping', label: 'Integrated Carriers' },
        { id: 'order-status', label: 'Fulfillment Pipeline' },
        { id: 'notifications', label: 'System Broadcasts' }
      ]
    },
    {
      id: 'analytics',
      title: 'Intelligence',
      icon: BarChart3,
      subItems: [
        { id: 'daily-sales', label: 'Revenue Intel' },
        { id: 'monthly-sales', label: 'Monthly Growth' },
        { id: 'product-perf', label: 'Product Matrix' },
        { id: 'supplier-perf', label: 'Supplier GMV' },
        { id: 'customer-reports', label: 'Retention & LTV' }
      ]
    },
    {
      id: 'system',
      title: 'Platform & Security',
      icon: Settings,
      subItems: [
        { id: 'settings', label: 'Store Config' },
        { id: 'audit-logs', label: 'Audit Trail' },
        { id: 'security', label: 'Security & 2FA' },
        { id: 'backups', label: 'Snapshots & Backup' },
        { id: 'configuration', label: 'API Gateways' }
      ]
    }
  ];

  // Navigation Click Handler
  const handleNavSelect = (sectionId, subItemId) => {
    setActiveSection(sectionId);
    setActiveSubTab(subItemId);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const catSub = subcategories.find(s => s.category === cat)?.name || 'Automatic Watches';
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
    setQuickCreateOpen(false);
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
      reviewsCount: editingProduct?.reviewsCount || 12,
      badge: editingProduct?.badge || 'Best Seller',
      image: productForm.image || 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800',
      images: [
        productForm.image || 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
      ],
      description: productForm.description || `${productForm.name} crafted with the highest standard of luxury design.`,
      specifications: {
        Material: productForm.material || 'Premium Alloy & Sapphire',
        Warranty: productForm.warranty || '2 Years',
        Origin: 'Switzerland / Italy Handcrafted'
      }
    };

    saveProduct(payload);
    setProductModalOpen(false);
    showToast(editingProduct ? `Product "${payload.name}" updated successfully!` : `New product "${payload.name}" published!`);
    refreshAll();
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      deleteProduct(id);
      showToast('Product removed from catalog');
      refreshAll();
    }
  };

  const handleStockAdjust = (productId, delta) => {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;
    const newStock = Math.max(0, (Number(p.stock) || 0) + delta);
    saveProduct({ ...p, stock: newStock });
    showToast(`Stock updated: ${p.name} → ${newStock} units`);
    refreshAll();
  };

  // Subcategory Actions
  const handleAddSubcategory = (e) => {
    e.preventDefault();
    if (!subcatForm.name) return;
    saveSubcategory(subcatForm);
    setSubcatModalOpen(false);
    setSubcatForm({ name: '', category: 'Watches', code: '' });
    showToast(`Subcategory "${subcatForm.name}" created!`);
    refreshAll();
  };

  // Variant Actions
  const handleAddVariant = (e) => {
    e.preventDefault();
    if (!variantForm.value) return;
    saveVariant(variantForm);
    setVariantModalOpen(false);
    setVariantForm({ productName: products[0]?.name || 'Rolex Submariner Date 41mm', attributeType: 'Dial Color', value: '', priceModifier: '', stock: '10', sku: '' });
    showToast(`Variant "${variantForm.value}" created!`);
    refreshAll();
  };

  // Media Actions
  const handleAddMedia = (e) => {
    e.preventDefault();
    if (!mediaForm.url) return;
    addMediaAsset(mediaForm);
    setMediaModalOpen(false);
    setMediaForm({ title: '', category: 'Watches', url: '', size: '1.8 MB' });
    showToast(`Media asset indexed!`);
    refreshAll();
  };

  // Promo Actions
  const handleAddPromotion = (e) => {
    e.preventDefault();
    if (!promoForm.title) return;
    savePromotion(promoForm);
    setPromoModalOpen(false);
    setPromoForm({ title: '', code: '', discount: '20% Off', targetCategory: 'All Departments', bannerType: 'Hero Banner', startDate: 'Today', endDate: '30 Days' });
    showToast(`Promotion "${promoForm.title}" launched!`);
    refreshAll();
  };

  // Roles Actions
  const handleAddRole = (e) => {
    e.preventDefault();
    if (!roleForm.name) return;
    saveRole(roleForm);
    setRoleModalOpen(false);
    setRoleForm({ name: '', description: '', membersCount: '1' });
    showToast(`Role "${roleForm.name}" registered!`);
    refreshAll();
  };

  // Department & Brand Submit Handlers
  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    addCategory(newCatInput.trim());
    setNewCatInput('');
    showToast(`Department "${newCatInput}" added!`);
    refreshAll();
  };

  const handleAddBrandSubmit = (e) => {
    e.preventDefault();
    if (!newBrandInput.trim()) return;
    addBrand(newBrandInput.trim());
    setNewBrandInput('');
    showToast(`Brand "${newBrandInput}" registered!`);
    refreshAll();
  };

  // Supplier Actions
  const handleAddSupplierSubmit = (e) => {
    e.preventDefault();
    if (!supplierForm.name || !supplierForm.email) return;
    addSupplier({
      ...supplierForm,
      status: 'Active',
      productsCount: 0
    });
    setSupplierModalOpen(false);
    setSupplierForm({ name: '', email: '', phone: '', category: 'Watches', address: 'Gujarat, India' });
    showToast(`Vendor partner "${supplierForm.name}" onboarded!`);
    refreshAll();
  };

  // Return & RMA Actions
  const handleOpenAdminReturnModal = (order) => {
    setSelectedReturnOrder(order);
    setAdminReturnDecision('Refunded');
    setAdminRefundAmount(String(order.total || ''));
    setAdminRefundTxn(`RF-TXN-${Date.now().toString().slice(-6)}`);
    setAdminReturnNotes(order.returnRequest?.reason || 'Customer requested return processed by Admin.');
    setAdminReturnModalOpen(true);
  };

  const handleProcessAdminReturn = (e) => {
    e.preventDefault();
    if (!selectedReturnOrder) return;
    processReturnStatus(selectedReturnOrder.id, adminReturnDecision, {
      amount: Number(adminRefundAmount) || selectedReturnOrder.total,
      transactionId: adminRefundTxn,
      notes: adminReturnNotes
    });
    setAdminReturnModalOpen(false);
    showToast(`Return for Order ${selectedReturnOrder.id} finalized: ${adminReturnDecision}`);
    refreshAll();
  };

  // Order Details Modal Handler
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
    showToast(`Order ${selectedOrder.id} fulfillment saved!`);
    setSelectedOrder(prev => prev ? ({ ...prev, status: selectedOrderStatus, courier: selectedOrderCourier, trackingNumber: selectedOrderTracking }) : null);
    refreshAll();
  };

  // Bulk Orders Action
  const handleBulkMarkShipped = () => {
    if (selectedOrderIds.length === 0) return;
    selectedOrderIds.forEach(id => {
      updateOrderStatus(id, 'Shipped', {
        courier: 'BlueDart Express Air',
        trackingNumber: `BD${Math.floor(10000000 + Math.random() * 90000000)}IN`
      });
    });
    showToast(`${selectedOrderIds.length} orders marked as Shipped!`);
    setSelectedOrderIds([]);
    refreshAll();
  };

  // Coupon Actions
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode || !newCouponDiscount) return;
    const newCp = {
      code: newCouponCode.trim().toUpperCase(),
      discount: Number(newCouponDiscount),
      type: 'percentage',
      minSpend: Number(newCouponMin) || 0,
      status: 'Active',
      usageCount: 0
    };
    setCoupons(prev => [newCp, ...prev]);
    setNewCouponCode('');
    setNewCouponDiscount('');
    setNewCouponMin('');
    showToast(`Voucher ${newCp.code} generated!`);
  };

  // Broadcast Notification
  const handleBroadcastNotification = (e) => {
    e.preventDefault();
    if (!newNotificationTitle || !newNotificationText) return;
    addNotification({
      title: newNotificationTitle.trim(),
      message: newNotificationText.trim(),
      type: 'system'
    });
    setNewNotificationTitle('');
    setNewNotificationText('');
    showToast('Platform notification broadcasted!');
    refreshAll();
  };

  // Settings Save
  const handleSaveSettings = (e) => {
    e.preventDefault();
    saveSystemConfig(systemConfig);
    showToast('Store settings saved successfully!');
    refreshAll();
  };

  // Backup Download & Restore
  const handleDownloadBackup = () => {
    const jsonStr = exportFullDatabaseBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `krishna_accessories_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Database snapshot exported!');
  };

  const handleRestoreBackup = () => {
    if (!backupJsonInput.trim()) {
      showToast('Please paste a valid JSON snapshot', 'error');
      return;
    }
    const res = restoreDatabaseBackup(backupJsonInput);
    if (res.success) {
      showToast('Database snapshot restored successfully!');
      setBackupJsonInput('');
      refreshAll();
    } else {
      showToast(res.message || 'Failed to restore snapshot', 'error');
    }
  };

  // Command Palette Items
  const commandItems = useMemo(() => {
    const items = [
      { category: 'Quick Actions', label: 'Add New Product', icon: Plus, action: () => handleOpenAddProduct() },
      { category: 'Quick Actions', label: 'Onboard Vendor Partner', icon: Building2, action: () => { setSupplierModalOpen(true); setCommandPaletteOpen(false); } },
      { category: 'Quick Actions', label: 'Create Discount Voucher', icon: Tag, action: () => { handleNavSelect('commerce', 'coupons'); setCommandPaletteOpen(false); } },
      { category: 'Quick Actions', label: 'Send Broadcast Notification', icon: Send, action: () => { handleNavSelect('operations', 'notifications'); setCommandPaletteOpen(false); } },
      { category: 'Quick Actions', label: 'Export Database JSON Backup', icon: Download, action: () => { handleDownloadBackup(); setCommandPaletteOpen(false); } },
      { category: 'Navigation', label: 'Executive Dashboard Overview', icon: LayoutDashboard, action: () => { handleNavSelect('dashboard', 'overview'); setCommandPaletteOpen(false); } },
      { category: 'Navigation', label: 'Live Orders & Shipments', icon: CreditCard, action: () => { handleNavSelect('commerce', 'orders'); setCommandPaletteOpen(false); } },
      { category: 'Navigation', label: 'Master Product Catalog', icon: Package, action: () => { handleNavSelect('catalog', 'products'); setCommandPaletteOpen(false); } },
      { category: 'Navigation', label: 'Customer Accounts Directory', icon: Users, action: () => { handleNavSelect('people', 'users'); setCommandPaletteOpen(false); } },
      { category: 'Navigation', label: 'Vendor Ecosystem & Suppliers', icon: Building2, action: () => { handleNavSelect('people', 'suppliers'); setCommandPaletteOpen(false); } },
      { category: 'Navigation', label: 'Platform Settings & Config', icon: Settings, action: () => { handleNavSelect('system', 'settings'); setCommandPaletteOpen(false); } },
      { category: 'Navigation', label: 'Security & 2FA Audit Trail', icon: Shield, action: () => { handleNavSelect('system', 'audit-logs'); setCommandPaletteOpen(false); } },
    ];

    if (!commandQuery.trim()) return items;
    const q = commandQuery.toLowerCase();
    return items.filter(i => i.label.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
  }, [commandQuery, handleOpenAddProduct]);

  // If Not Authenticated As Admin
  if (!authenticatedAsAdmin) {
    return (
      <div className="min-h-screen bg-[#0E1013] text-zinc-100 flex items-center justify-center p-4 font-sans selection:bg-indigo-500 selection:text-white">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#15171C] p-8 shadow-2xl space-y-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-inner">
            <Lock className="h-7 w-7" />
          </div>
          <div>
            <span className="text-[10.5px] font-mono tracking-widest text-indigo-400 uppercase font-semibold">
              SaaS Admin Gateway
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
              Krishna Accessories
            </h1>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Enterprise administration console & multi-tenant store control plane.
            </p>
          </div>
          <div className="pt-2 space-y-3">
            <button
              onClick={handleQuickAdminLogin}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>1-Click Super Admin Login</span>
            </button>
            <Link
              to="/login"
              className="block w-full rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800 py-2.5 text-xs font-medium text-zinc-300 transition"
            >
              Sign In with Password &rarr;
            </Link>
            <Link
              to="/"
              className="inline-block text-xs text-zinc-500 hover:text-zinc-300 pt-2 transition font-medium"
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
    <div className="min-h-screen bg-[#0D0F12] text-zinc-100 flex overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">

      {/* ==========================================
          FLOATING TOAST ALERT BANNER
      ========================================== */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 rounded-xl px-4 py-3 text-xs font-medium shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fade-in border ${
          toastType === 'error'
            ? 'bg-rose-950/90 text-rose-200 border-rose-800/80 shadow-rose-950/40'
            : 'bg-zinc-900/95 text-zinc-100 border-zinc-800 shadow-black/60'
        }`}>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="text-zinc-500 hover:text-zinc-300 p-0.5 ml-2 cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ==========================================
          COMMAND PALETTE MODAL (Ctrl + K)
      ========================================== */}
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-[#15181E] p-2 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-3 py-2.5 border-b border-zinc-800/80">
              <Search className="h-4 w-4 text-zinc-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={commandQuery}
                onChange={e => setCommandQuery(e.target.value)}
                placeholder="Type a command, search modules, products, or actions..."
                className="w-full bg-transparent text-xs text-zinc-100 placeholder:text-zinc-500 outline-none"
              />
              <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">ESC</span>
            </div>

            <div className="max-h-80 overflow-y-auto p-1.5 space-y-1">
              {commandItems.length === 0 ? (
                <div className="p-4 text-center text-xs text-zinc-500">No matching commands found.</div>
              ) : (
                commandItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={item.action}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">{item.category}</span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="px-3 py-2 border-t border-zinc-800/80 bg-zinc-900/40 text-[10.5px] text-zinc-500 flex items-center justify-between">
              <span>Navigation & Direct Platform Commands</span>
              <span className="font-mono">Tip: Press ⌘K anywhere</span>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          1. DEDICATED MODERN SAAS SIDEBAR
      ========================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col justify-between bg-[#111317] border-r border-zinc-800/90 transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-68'}`}
      >
        {/* Workspace Brand Selector */}
        <div className="flex flex-col min-h-0 flex-1">
          <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-800/80 shrink-0">
            <Link to="/admin" className="flex items-center gap-3 overflow-hidden min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30">
                KA
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-zinc-100 tracking-tight text-xs truncate">
                      Krishna Accessories
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 truncate">
                    Enterprise SaaS v2.4
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

          {/* Quick Command Bar Trigger Inside Sidebar */}
          {!sidebarCollapsed && (
            <div className="p-3 pb-1">
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl border border-zinc-800/90 bg-[#16191F] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 text-xs transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-[11px]">Search & Commands...</span>
                </div>
                <span className="rounded bg-zinc-800/80 px-1.5 py-0.2 text-[9px] font-mono text-zinc-400 border border-zinc-700/50">⌘K</span>
              </button>
            </div>
          )}

          {/* Navigation Accordion Sections */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
            {navSections.map((sec) => {
              const isSectionActive = activeSection === sec.id;
              const isExpanded = expandedSections[sec.id];
              const IconComp = sec.icon;

              return (
                <div key={sec.id} className="space-y-0.5">
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
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 font-medium transition-colors cursor-pointer group ${
                      isSectionActive
                        ? 'bg-zinc-800/90 text-white font-semibold shadow-xs'
                        : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1 rounded-lg transition ${isSectionActive ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                        <IconComp className="h-4 w-4 shrink-0" />
                      </div>
                      {!sidebarCollapsed && (
                        <span className="truncate text-left text-xs">{sec.title}</span>
                      )}
                    </div>

                    {!sidebarCollapsed && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {sec.badge && (
                          <span className={`rounded-full px-1.5 py-0.2 text-[9.5px] font-semibold ${
                            isSectionActive ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {sec.badge}
                          </span>
                        )}
                        <ChevronDown className={`h-3 w-3 text-zinc-500 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-zinc-300' : ''}`} />
                      </div>
                    )}
                  </button>

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
                                ? 'bg-indigo-600/15 text-indigo-300 font-semibold border-l-2 border-indigo-500 pl-2.5'
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

        {/* Sidebar Footer & User Profile */}
        <div className="p-3 border-t border-zinc-800/80 bg-[#0E1013] shrink-0">
          {!sidebarCollapsed ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-xs border border-indigo-400/30 shadow-xs">
                    SA
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0E1013]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-200 truncate">Super Admin</p>
                    <p className="text-[10px] text-zinc-500 truncate">admin@krishna.com</p>
                  </div>
                </div>

                <button
                  onClick={handleAdminLogout}
                  title="Sign Out"
                  className="text-zinc-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition shrink-0 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <Link
                  to="/"
                  target="_blank"
                  className="flex items-center justify-center gap-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 py-1.5 text-[10.5px] font-medium text-zinc-300 transition truncate px-1 shadow-2xs"
                >
                  <Store className="h-3 w-3 text-indigo-400" />
                  <span>Storefront</span>
                  <ExternalLink className="h-2.5 w-2.5 text-zinc-400" />
                </Link>
                <button
                  onClick={handleAdminLogout}
                  className="flex items-center justify-center rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 py-1.5 text-[10.5px] font-medium text-rose-300 transition truncate px-1 cursor-pointer"
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
                className="text-zinc-400 hover:text-rose-400 p-2 rounded-xl hover:bg-zinc-800 cursor-pointer"
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
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ==========================================
          2. MAIN CONTENT WRAPPER WITH TOP HEADER
      ========================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen bg-[#0E1013]">

        {/* Modern SaaS Sticky Top Header */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-zinc-800/90 bg-[#121419]/90 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
          
          {/* Left: Mobile Toggle, Collapse & Breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm shrink-0 cursor-pointer"
            >
              <Menu className="h-4 w-4" />
            </button>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 text-xs font-mono shrink-0 cursor-pointer border border-zinc-700/60"
              title="Toggle sidebar collapse"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-center gap-1.5 text-xs text-zinc-400 truncate min-w-0 font-medium">
              <span className="text-zinc-500 shrink-0">Admin</span>
              <span className="text-zinc-600 shrink-0">/</span>
              <span className="text-zinc-300 truncate">{currentSectionObj.title}</span>
              <span className="text-zinc-600 shrink-0">/</span>
              <span className="text-indigo-400 font-semibold truncate">{currentSubItemObj.label}</span>
            </div>
          </div>

          {/* Center: Quick Search Command Pill */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-[#16181F] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 text-xs transition cursor-pointer w-64 lg:w-80 shadow-inner"
            >
              <Search className="h-3.5 w-3.5 text-zinc-500" />
              <span className="truncate text-left flex-1">Search anything... (Orders, SKUs)</span>
              <span className="rounded bg-zinc-800 px-1.5 py-0.2 text-[9.5px] font-mono text-zinc-400 border border-zinc-700/50">⌘K</span>
            </button>
          </div>

          {/* Right: Status Pill, Quick Create, Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Live Operational Status */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>99.98% SLA Operational</span>
            </div>

            {/* Quick Create Dropdown */}
            <div className="relative">
              <button
                onClick={() => setQuickCreateOpen(!quickCreateOpen)}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Create</span>
                <ChevronDown className="h-3 w-3 opacity-70" />
              </button>

              {quickCreateOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-zinc-800 bg-[#16181F] p-1.5 shadow-2xl z-50 animate-fade-in text-xs font-medium">
                  <button
                    onClick={() => { handleOpenAddProduct(); setQuickCreateOpen(false); }}
                    className="w-full text-left rounded-xl px-2.5 py-2 text-zinc-200 hover:bg-zinc-800/80 transition cursor-pointer flex items-center gap-2.5"
                  >
                    <Package className="h-3.5 w-3.5 text-indigo-400" />
                    <span>New Product</span>
                  </button>
                  <button
                    onClick={() => { setSupplierModalOpen(true); setQuickCreateOpen(false); }}
                    className="w-full text-left rounded-xl px-2.5 py-2 text-zinc-200 hover:bg-zinc-800/80 transition cursor-pointer flex items-center gap-2.5"
                  >
                    <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Onboard Vendor</span>
                  </button>
                  <button
                    onClick={() => { handleNavSelect('commerce', 'coupons'); setQuickCreateOpen(false); }}
                    className="w-full text-left rounded-xl px-2.5 py-2 text-zinc-200 hover:bg-zinc-800/80 transition cursor-pointer flex items-center gap-2.5"
                  >
                    <Tag className="h-3.5 w-3.5 text-amber-400" />
                    <span>Create Voucher</span>
                  </button>
                  <button
                    onClick={() => { handleNavSelect('operations', 'notifications'); setQuickCreateOpen(false); }}
                    className="w-full text-left rounded-xl px-2.5 py-2 text-zinc-200 hover:bg-zinc-800/80 transition cursor-pointer flex items-center gap-2.5"
                  >
                    <Send className="h-3.5 w-3.5 text-purple-400" />
                    <span>Broadcast Message</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setNotifsOpen(!notifsOpen)}
                className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-[#16181F] text-zinc-300 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              >
                <Bell className="h-3.5 w-3.5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[8.5px] font-bold text-white shadow-xs">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {notifsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-zinc-800 bg-[#16181F] p-3.5 shadow-2xl z-50 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
                    <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                      Platform Alerts ({notifications.length})
                    </span>
                    {unreadNotifs > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10.5px] text-indigo-400 font-semibold hover:text-indigo-300 cursor-pointer"
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
                          n.unread ? 'bg-indigo-500/10 border border-indigo-500/20 text-zinc-200 font-medium' : 'hover:bg-zinc-800/50 text-zinc-400'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-zinc-100 text-xs">{n.title}</span>
                          <span className="text-[9px] text-zinc-500 font-mono shrink-0">{n.date}</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-zinc-400 leading-snug">{n.message}</p>
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
                className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-[#16181F] px-2 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800 transition cursor-pointer"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[9px] font-bold shrink-0">
                  SA
                </div>
                <span className="hidden sm:inline text-xs font-medium">Super Admin</span>
                <ChevronDown className="h-3 w-3 text-zinc-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-zinc-800 bg-[#16181F] p-1.5 shadow-2xl z-50 animate-fade-in text-xs font-medium">
                  <div className="px-2.5 py-2 border-b border-zinc-800 mb-1">
                    <p className="font-semibold text-zinc-100">Super Administrator</p>
                    <p className="text-[10px] text-zinc-500">admin@krishna.com</p>
                  </div>
                  <button
                    onClick={() => { handleNavSelect('system', 'settings'); setUserDropdownOpen(false); }}
                    className="w-full text-left rounded-xl px-2.5 py-1.5 text-zinc-300 hover:bg-zinc-800 transition cursor-pointer flex items-center gap-2"
                  >
                    <Settings className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Store Settings</span>
                  </button>
                  <button
                    onClick={() => { handleNavSelect('system', 'audit-logs'); setUserDropdownOpen(false); }}
                    className="w-full text-left rounded-xl px-2.5 py-1.5 text-zinc-300 hover:bg-zinc-800 transition cursor-pointer flex items-center gap-2"
                  >
                    <FileText className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Audit Trail</span>
                  </button>
                  <div className="border-t border-zinc-800 pt-1 mt-1">
                    <button
                      onClick={handleAdminLogout}
                      className="w-full text-left rounded-xl px-2.5 py-1.5 text-rose-400 hover:bg-rose-500/10 font-medium transition cursor-pointer flex items-center gap-2"
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
        <div className="bg-[#121419]/50 border-b border-zinc-800/80 px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mr-2 shrink-0">
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
                      ? 'bg-zinc-800 text-white shadow-xs border border-zinc-700/80 font-semibold'
                      : 'bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
                  }`}
                >
                  {sub.label}
                  {sub.badge && (
                    <span className={`ml-1.5 rounded-full px-1.5 py-0.2 text-[9px] font-semibold ${isSubActive ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                      {sub.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Time Range Filter (SaaS style) */}
          <div className="hidden sm:flex items-center gap-1 bg-[#16181F] p-0.5 rounded-lg border border-zinc-800 shrink-0">
            {['Today', '7D', '30D', 'YTD'].map(tr => (
              <button
                key={tr}
                onClick={() => setTimeRange(tr)}
                className={`px-2 py-0.5 rounded text-[10.5px] font-medium transition cursor-pointer ${
                  timeRange === tr ? 'bg-zinc-800 text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tr}
              </button>
            ))}
          </div>
        </div>

        {/* ==========================================
            3. MAIN BODY CONTENT (ALL SUB-VIEWS)
        ========================================== */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">

          {/* ==========================================
              MODULE 1: DASHBOARD / OVERVIEW
          ========================================== */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Header Title with Live Metrics */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
                    <span>Operational Intelligence Hub</span>
                    <span className="rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-2 py-0.5 text-[10.5px] font-mono font-medium">
                      Live Store: Main
                    </span>
                  </h1>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Live gross merchandise volume, fulfillment pipelines, and governance action center.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => refreshAll()}
                    className="rounded-lg border border-zinc-800 bg-[#16181F] hover:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Refresh Live Metrics"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Sync</span>
                  </button>
                  <button
                    onClick={handleOpenAddProduct}
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>

              {/* 5 Core Top Metric Cards (SaaS Sparkline KPIs) */}
              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
                
                {/* 1. Revenue GMV */}
                <div
                  onClick={() => setActiveSubTab('revenue')}
                  className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4.5 shadow-lg hover:border-zinc-700 cursor-pointer transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                      <span className="font-semibold uppercase tracking-wider text-[9.5px] text-zinc-400">Total GMV</span>
                      <span className="text-emerald-400 font-semibold text-[10px] flex items-center gap-0.5 bg-emerald-500/10 px-1.5 py-0.2 rounded-md">
                        <TrendingUp className="h-3 w-3" /> +18.4%
                      </span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate tabular-nums mt-1">
                      ₹{totalRevenue.toLocaleString('en-IN')}
                    </p>
                  </div>
                  
                  {/* Monthly Goal Progress */}
                  <div className="mt-3 pt-2 border-t border-zinc-800/60">
                    <div className="flex justify-between text-[10px] text-zinc-500 mb-1">
                      <span>Monthly Goal</span>
                      <span className="font-mono text-zinc-400">82%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full w-[82%]" />
                    </div>
                  </div>
                </div>

                {/* 2. Total Orders */}
                <div
                  onClick={() => setActiveSubTab('orders')}
                  className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4.5 shadow-lg hover:border-zinc-700 cursor-pointer transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                      <span className="font-semibold uppercase tracking-wider text-[9.5px] text-zinc-400">Orders Velocity</span>
                      <span className="text-indigo-400 font-medium text-[10px] bg-indigo-500/10 px-1.5 py-0.2 rounded-md">
                        {activeOrdersCount} in transit
                      </span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate tabular-nums mt-1">
                      {orders.length}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500">
                    <span>Avg. Dispatch SLA</span>
                    <span className="font-mono text-emerald-400">1.4 Days</span>
                  </div>
                </div>

                {/* 3. Catalog & Products */}
                <div
                  onClick={() => setActiveSubTab('products')}
                  className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4.5 shadow-lg hover:border-zinc-700 cursor-pointer transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                      <span className="font-semibold uppercase tracking-wider text-[9.5px] text-zinc-400">Active SKUs</span>
                      <span className="text-zinc-400 font-medium text-[10px] bg-zinc-800 px-1.5 py-0.2 rounded-md">
                        {categories.length} Depts
                      </span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate tabular-nums mt-1">
                      {products.length} Items
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500">
                    <span>Stock Health</span>
                    <span className={lowStockItems.length > 0 ? "text-amber-400 font-medium" : "text-emerald-400 font-medium"}>
                      {lowStockItems.length > 0 ? `${lowStockItems.length} Low Stock` : 'Optimal'}
                    </span>
                  </div>
                </div>

                {/* 4. Suppliers Ecosystem */}
                <div
                  onClick={() => setActiveSubTab('suppliers')}
                  className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4.5 shadow-lg hover:border-zinc-700 cursor-pointer transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                      <span className="font-semibold uppercase tracking-wider text-[9.5px] text-zinc-400">Suppliers</span>
                      <span className={pendingSuppliers.length > 0 ? "text-amber-400 font-medium text-[10px] bg-amber-500/10 px-1.5 py-0.2 rounded-md" : "text-emerald-400 font-medium text-[10px] bg-emerald-500/10 px-1.5 py-0.2 rounded-md"}>
                        {pendingSuppliers.length > 0 ? `${pendingSuppliers.length} pending` : '✓ All Active'}
                      </span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate tabular-nums mt-1">
                      {suppliers.length}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500">
                    <span>Payout Settlement</span>
                    <span className="font-mono text-indigo-400">100% Settled</span>
                  </div>
                </div>

                {/* 5. Total Users & LTV */}
                <div
                  onClick={() => setActiveSubTab('users')}
                  className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4.5 shadow-lg hover:border-zinc-700 cursor-pointer col-span-2 sm:col-span-1 transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                      <span className="font-semibold uppercase tracking-wider text-[9.5px] text-zinc-400">Client Base</span>
                      <span className="text-emerald-400 font-medium text-[10px] bg-emerald-500/10 px-1.5 py-0.2 rounded-md">Verified</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate tabular-nums mt-1">
                      {users.length}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500">
                    <span>Repeat Retention</span>
                    <span className="font-mono text-indigo-400 font-medium">42.8%</span>
                  </div>
                </div>

              </div>

              {/* Live Action Center (Pending Governance) */}
              {(activeSubTab === 'overview' || activeSubTab === 'pending') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Operational Action Center ({pendingSuppliers.length + returnRequests.length + lowStockItems.length})</span>
                    </h3>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-3">
                    {/* Pending Suppliers */}
                    <div className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4.5 shadow-md flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-zinc-100 text-xs flex items-center gap-1.5">
                            <Building2 className="h-4 w-4 text-indigo-400" />
                            <span>Vendor Verification</span>
                          </span>
                          <span className="text-[10px] font-medium bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-700/60">
                            {pendingSuppliers.length} Pending
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {pendingSuppliers.length > 0
                            ? `${pendingSuppliers.map(s => s.name).join(', ')} awaiting catalog publishing authorization.`
                            : 'All supplier credentials and trade licenses are currently approved.'}
                        </p>
                      </div>
                      {pendingSuppliers.length > 0 && (
                        <button
                          onClick={() => handleNavSelect('people', 'suppliers')}
                          className="mt-3 text-left text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition cursor-pointer flex items-center gap-1"
                        >
                          <span>Review Vendor Credentials</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {/* Pending Returns */}
                    <div className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4.5 shadow-md flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-zinc-100 text-xs flex items-center gap-1.5">
                            <RotateCcw className="h-4 w-4 text-purple-400" />
                            <span>RMA & Return Requests</span>
                          </span>
                          <span className="text-[10px] font-medium bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-700/60">
                            {returnRequests.length} Pending
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {returnRequests.length > 0
                            ? `${returnRequests.length} customer return requests awaiting warehouse RMA decision.`
                            : 'No customer return requests currently pending inspection.'}
                        </p>
                      </div>
                      {returnRequests.length > 0 && (
                        <button
                          onClick={() => handleNavSelect('commerce', 'returns')}
                          className="mt-3 text-left text-xs font-semibold text-purple-400 hover:text-purple-300 transition cursor-pointer flex items-center gap-1"
                        >
                          <span>Review RMA Returns</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {/* Low Stock Warnings */}
                    <div className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4.5 shadow-md flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-zinc-100 text-xs flex items-center gap-1.5">
                            <AlertTriangle className="h-4 w-4 text-amber-400" />
                            <span>Inventory Replenishment</span>
                          </span>
                          <span className="text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md">
                            {lowStockItems.length} Low
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {lowStockItems.length > 0
                            ? `${lowStockItems.length} catalog products have less than 5 units left in warehouse bins.`
                            : 'All product inventories are above reorder safety thresholds.'}
                        </p>
                      </div>
                      {lowStockItems.length > 0 && (
                        <button
                          onClick={() => handleNavSelect('operations', 'inventory')}
                          className="mt-3 text-left text-xs font-semibold text-amber-400 hover:text-amber-300 transition cursor-pointer flex items-center gap-1"
                        >
                          <span>Replenish Stock Ledger</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive Analytics & Distribution Charts */}
              {(activeSubTab === 'overview' || activeSubTab === 'charts' || activeSubTab === 'revenue') && (
                <div className="grid gap-6 lg:grid-cols-3">
                  
                  {/* Revenue Growth Chart */}
                  <div className="lg:col-span-2 rounded-2xl border border-zinc-800/90 bg-[#14161C] p-5 shadow-lg space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                      <div>
                        <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                          Revenue Performance & Volume Growth
                        </h3>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Processed GMV breakdown in INR (₹)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full tabular-nums">
                          AOV: ₹{averageOrderValue.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-48 pt-4 px-2">
                      {[
                        { month: 'Apr', amount: 84000, height: '40%' },
                        { month: 'May', amount: 112000, height: '55%' },
                        { month: 'Jun', amount: 145000, height: '70%' },
                        { month: 'Jul', amount: 168000, height: '80%' },
                        { month: 'Aug', amount: 195000, height: '92%' },
                        { month: 'Sep', amount: totalRevenue, height: '100%', active: true }
                      ].map(bar => (
                        <div key={bar.month} className="flex flex-col items-center gap-1.5 h-full justify-end group min-w-0">
                          <span className="text-[9px] font-semibold font-mono text-indigo-400 opacity-0 group-hover:opacity-100 transition truncate">
                            ₹{(bar.amount / 1000).toFixed(0)}k
                          </span>
                          <div
                            style={{ height: bar.height }}
                            className={`w-full rounded-t-lg transition-all duration-300 ${
                              bar.active
                                ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-md shadow-indigo-600/30'
                                : 'bg-zinc-800 hover:bg-zinc-700'
                            }`}
                          />
                          <span className={`text-[10.5px] font-medium truncate ${bar.active ? 'text-indigo-400 font-semibold' : 'text-zinc-500'}`}>
                            {bar.month}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category Distribution */}
                  <div className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-5 shadow-lg space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                      <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                        Department Share
                      </h3>
                      <button onClick={() => handleNavSelect('catalog', 'categories')} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer">
                        Manage
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      {categories.slice(0, 5).map(cat => {
                        const count = products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
                        const pct = Math.round((count / Math.max(1, products.length)) * 100);
                        return (
                          <div key={cat} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium text-zinc-200">{cat}</span>
                              <span className="text-zinc-400 font-mono text-[11px]">{count} ({pct}%)</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                              <div style={{ width: `${pct}%` }} className="h-full bg-indigo-500 rounded-full" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* Real-time Activity Stream & Live Audit Ticker */}
              {(activeSubTab === 'overview' || activeSubTab === 'revenue') && (
                <div className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-5 shadow-lg space-y-3.5">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                    <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                      <Radio className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Live Event Feed & Audit Stream</span>
                    </h3>
                    <span className="text-[10px] text-zinc-500 font-mono">Auto-synced</span>
                  </div>

                  <div className="divide-y divide-zinc-800/60">
                    {auditLogs.slice(0, 4).map(log => (
                      <div key={log.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-2 w-2 rounded-full bg-indigo-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-semibold text-zinc-200 truncate">{log.action}</p>
                            <p className="text-[11px] text-zinc-400 truncate">{log.detail}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-zinc-500 font-mono block">{log.time}</span>
                          <span className="text-[10px] text-zinc-400 font-medium">{log.admin}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ==========================================
              MODULE 2: COMMERCE MANAGEMENT
          ========================================== */}
          {activeSection === 'commerce' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Sub-item: Orders */}
              {activeSubTab === 'orders' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl font-bold tracking-tight text-white">
                        Orders & Shipments ({orders.length})
                      </h1>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Multi-carrier fulfillment pipeline and customer invoice management.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedOrderIds.length > 0 && (
                        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-xl">
                          <span className="text-xs font-semibold text-indigo-300">
                            {selectedOrderIds.length} Selected
                          </span>
                          <button
                            onClick={handleBulkMarkShipped}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-2.5 py-1 rounded-lg transition cursor-pointer"
                          >
                            Mark Shipped
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
                        {['All', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Return Requested', 'Refunded', 'Cancelled'].map(st => (
                          <button
                            key={st}
                            onClick={() => setOrderStatusFilter(st)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                              orderStatusFilter === st
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-[#14161C] border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-zinc-800/90 bg-[#14161C] shadow-lg">
                    <table className="w-full text-left text-xs min-w-[850px]">
                      <thead className="border-b border-zinc-800 bg-[#111317] text-zinc-400 uppercase text-[10px] font-semibold tracking-wider">
                        <tr>
                          <th className="p-3.5 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedOrderIds(filteredOrders.map(o => o.id));
                                else setSelectedOrderIds([]);
                              }}
                              className="h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-800 text-indigo-600 cursor-pointer"
                            />
                          </th>
                          <th className="p-3.5">Order ID & Date</th>
                          <th className="p-3.5">Customer</th>
                          <th className="p-3.5">Payment</th>
                          <th className="p-3.5">Invoice Total</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Lifecycle Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 font-normal">
                        {filteredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-zinc-800/40 transition">
                            <td className="p-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={selectedOrderIds.includes(order.id)}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedOrderIds(prev => [...prev, order.id]);
                                  else setSelectedOrderIds(prev => prev.filter(id => id !== order.id));
                                }}
                                className="h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-800 text-indigo-600 cursor-pointer"
                              />
                            </td>
                            <td className="p-3.5">
                              <span className="font-mono font-semibold text-zinc-100 block">{order.id}</span>
                              <span className="text-[10px] text-zinc-400">{order.date}</span>
                            </td>

                            <td className="p-3.5">
                              <span className="font-medium text-zinc-200 block">{order.customer?.firstName} {order.customer?.lastName}</span>
                              <span className="text-[10px] text-zinc-400">{order.customer?.city}, {order.customer?.state}</span>
                            </td>

                            <td className="p-3.5">
                              <span className="text-zinc-300 font-medium">{order.paymentMethod || 'Online Gateway'}</span>
                              <span className={`text-[10px] font-semibold block ${
                                order.paymentStatus === 'Refunded' ? 'text-purple-400' : 'text-emerald-400'
                              }`}>
                                {order.paymentStatus || 'Paid'}
                              </span>
                            </td>

                            <td className="p-3.5 font-bold text-zinc-100 tabular-nums">
                              ₹{Number(order.total || 0).toLocaleString('en-IN')}
                            </td>

                            <td className="p-3.5">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium border ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                  : order.status === 'Shipped'
                                  ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                                  : order.status === 'Cancelled'
                                  ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                                  : order.status === 'Refunded'
                                  ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                                  : order.status === 'Return Requested'
                                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 font-semibold'
                                  : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                              }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${
                                  order.status === 'Delivered' ? 'bg-emerald-400' :
                                  order.status === 'Shipped' ? 'bg-sky-400' :
                                  order.status === 'Cancelled' ? 'bg-rose-400' :
                                  order.status === 'Refunded' ? 'bg-purple-400' :
                                  order.status === 'Return Requested' ? 'bg-amber-400' : 'bg-zinc-400'
                                }`} />
                                <span>{order.status}</span>
                              </span>
                            </td>

                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenOrderModal(order)}
                                  className="rounded-lg border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 px-2.5 py-1 text-[11px] font-medium transition shrink-0 cursor-pointer shadow-xs"
                                >
                                  Details
                                </button>

                                {order.status === 'Return Requested' && (
                                  <button
                                    onClick={() => handleOpenAdminReturnModal(order)}
                                    className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 text-[11px] font-medium transition shrink-0 cursor-pointer shadow-xs"
                                  >
                                    Review
                                  </button>
                                )}

                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                  className="rounded-lg border border-zinc-700 bg-[#16181F] px-2 py-1 text-xs font-medium text-zinc-200 outline-none cursor-pointer"
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
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                      Payments & Settlement Ledger
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">Gross volume settlements, interchange gateway fees, and net merchant credits.</p>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4.5 shadow-md">
                      <span className="text-[10px] font-semibold uppercase text-zinc-400">Total Settled Volume</span>
                      <p className="text-2xl font-bold text-white mt-1 tabular-nums">₹{totalRevenue.toLocaleString('en-IN')}</p>
                      <p className="text-[10.5px] text-emerald-400 font-medium mt-1">✓ 256-Bit SSL Encrypted</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4.5 shadow-md">
                      <span className="text-[10px] font-semibold uppercase text-zinc-400">Gateway Fees (Est. 2%)</span>
                      <p className="text-2xl font-bold text-zinc-300 mt-1 tabular-nums">₹{Math.round(totalRevenue * 0.02).toLocaleString('en-IN')}</p>
                      <p className="text-[10.5px] text-zinc-400 mt-1">Razorpay / UPI Interchange</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4.5 shadow-md">
                      <span className="text-[10px] font-semibold uppercase text-zinc-400">Net Merchant Payout</span>
                      <p className="text-2xl font-bold text-emerald-400 mt-1 tabular-nums">₹{Math.round(totalRevenue * 0.98).toLocaleString('en-IN')}</p>
                      <p className="text-[10.5px] text-zinc-400 mt-1">Direct Bank Account Credit</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-zinc-800/90 bg-[#14161C] shadow-lg">
                    <table className="w-full text-left text-xs min-w-[750px]">
                      <thead className="border-b border-zinc-800 bg-[#111317] text-zinc-400 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="p-3.5">Txn ID & Date</th>
                          <th className="p-3.5">Order Ref</th>
                          <th className="p-3.5">Customer & Mode</th>
                          <th className="p-3.5">Gross Amount</th>
                          <th className="p-3.5">PG Fee</th>
                          <th className="p-3.5">Net Payout</th>
                          <th className="p-3.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 font-normal">
                        {paymentTransactions.map(txn => (
                          <tr key={txn.id} className="hover:bg-zinc-800/40">
                            <td className="p-3.5">
                              <span className="font-mono font-semibold text-zinc-200 block">{txn.id}</span>
                              <span className="text-[10px] text-zinc-400">{txn.date}</span>
                            </td>
                            <td className="p-3.5 font-mono text-zinc-300">{txn.orderId}</td>
                            <td className="p-3.5">
                              <span className="font-medium text-zinc-200 block">{txn.customer}</span>
                              <span className="text-[10.5px] text-zinc-400">{txn.method}</span>
                            </td>
                            <td className="p-3.5 font-semibold text-zinc-200 tabular-nums">₹{txn.amount.toLocaleString('en-IN')}</td>
                            <td className="p-3.5 text-zinc-400 tabular-nums">₹{txn.fee.toLocaleString('en-IN')}</td>
                            <td className="p-3.5 font-bold text-emerald-400 tabular-nums">₹{txn.netSettlement.toLocaleString('en-IN')}</td>
                            <td className="p-3.5 text-right">
                              <span className="rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-medium">
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
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                      Customer Returns & RMA Authorization
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">Inspect return conditions and authorize reverse logistics pickups.</p>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-zinc-800/90 bg-[#14161C] shadow-lg">
                    <table className="w-full text-left text-xs min-w-[750px]">
                      <thead className="border-b border-zinc-800 bg-[#111317] text-zinc-400 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="p-3.5">Order Ref</th>
                          <th className="p-3.5">Customer Details</th>
                          <th className="p-3.5">Return Reason & Condition</th>
                          <th className="p-3.5">Amount</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 font-normal">
                        {orders.filter(o => o.status === 'Return Requested' || o.returnRequest).map(order => (
                          <tr key={order.id} className="hover:bg-zinc-800/40">
                            <td className="p-3.5 font-mono font-semibold text-zinc-200">{order.id}</td>
                            <td className="p-3.5">
                              <span className="font-medium text-zinc-200 block">{order.customer?.firstName} {order.customer?.lastName}</span>
                              <span className="text-[10px] text-zinc-400">{order.customer?.city}</span>
                            </td>
                            <td className="p-3.5">
                              <p className="font-medium text-zinc-200">{order.returnRequest?.reason || 'Exchange Requested'}</p>
                              <p className="text-[10.5px] text-zinc-400">Condition: {order.returnRequest?.condition || 'Inspected'}</p>
                            </td>
                            <td className="p-3.5 font-bold text-zinc-100 tabular-nums">₹{order.total?.toLocaleString('en-IN')}</td>
                            <td className="p-3.5">
                              <span className="rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 text-[10px] font-medium">
                                {order.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleOpenAdminReturnModal(order)}
                                className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 text-xs font-semibold transition cursor-pointer shadow-xs"
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
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                      Refunds Disbursement Ledger
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">Track settled refunds and banking reference transaction IDs.</p>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-zinc-800/90 bg-[#14161C] shadow-lg">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead className="border-b border-zinc-800 bg-[#111317] text-zinc-400 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="p-3.5">Refund Ref</th>
                          <th className="p-3.5">Order ID</th>
                          <th className="p-3.5">Customer & Mode</th>
                          <th className="p-3.5">Refund Amount</th>
                          <th className="p-3.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 font-normal">
                        {refundsList.map(o => (
                          <tr key={o.id} className="hover:bg-zinc-800/40">
                            <td className="p-3.5 font-mono font-semibold text-zinc-200">
                              {o.refundDetails?.transactionId || `REF-${o.id.replace(/[^0-9]/g, '')}`}
                            </td>
                            <td className="p-3.5 font-mono text-zinc-400">{o.id}</td>
                            <td className="p-3.5">
                              <span className="font-medium text-zinc-200 block">{o.customer?.firstName} {o.customer?.lastName}</span>
                              <span className="text-[10.5px] text-zinc-400">{o.paymentMethod}</span>
                            </td>
                            <td className="p-3.5 font-bold text-emerald-400 tabular-nums">₹{Number(o.total || 0).toLocaleString('en-IN')}</td>
                            <td className="p-3.5 text-right">
                              <span className="rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-medium">
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
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                      Discount Vouchers & Promo Engine
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">Generate promo codes, percentage discounts, and minimum cart spend rules.</p>
                  </div>

                  <form onSubmit={handleAddCoupon} className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4 shadow-lg grid gap-3 sm:grid-cols-4 items-end">
                    <div>
                      <label className="text-xs font-medium text-zinc-300 block mb-1">Promo Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. LUXURY20"
                        value={newCouponCode}
                        onChange={e => setNewCouponCode(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-mono font-bold uppercase text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-300 block mb-1">Discount (% or ₹) *</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 20"
                        value={newCouponDiscount}
                        onChange={e => setNewCouponDiscount(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-300 block mb-1">Min Spend (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 5000"
                        value={newCouponMin}
                        onChange={e => setNewCouponMin(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition cursor-pointer"
                    >
                      + Create Voucher
                    </button>
                  </form>

                  <div className="grid gap-3.5 sm:grid-cols-3">
                    {coupons.map(c => (
                      <div key={c.code} className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4.5 shadow-md flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono font-bold text-xs bg-zinc-800 px-2.5 py-1 rounded-lg text-indigo-300 border border-zinc-700">
                              {c.code}
                            </span>
                            <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              {c.status}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-zinc-100">{c.discount}% Off Discount</p>
                          <p className="text-[10.5px] text-zinc-400 mt-0.5">
                            Min spend: ₹{c.minSpend.toLocaleString('en-IN')} &bull; Used {c.usageCount} times
                          </p>
                        </div>
                        <div className="mt-4 pt-2 border-t border-zinc-800 flex justify-end">
                          <button
                            onClick={() => setCoupons(prev => prev.filter(cp => cp.code !== c.code))}
                            className="text-xs font-medium text-rose-400 hover:underline cursor-pointer"
                          >
                            Delete Voucher
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
                      <h1 className="text-xl font-bold tracking-tight text-white">
                        Promotions & Marketing Banners
                      </h1>
                      <p className="text-xs text-zinc-400 mt-0.5">Seasonal campaigns, hero store banners, and customer impression analytics.</p>
                    </div>
                    <button
                      onClick={() => setPromoModalOpen(true)}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Create Campaign</span>
                    </button>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {promotions.map(p => (
                      <div key={p.id} className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4.5 shadow-md space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs bg-zinc-800 text-indigo-300 border border-zinc-700 px-2.5 py-1 rounded-lg">
                            {p.code}
                          </span>
                          <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {p.status}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-100 text-sm">{p.title}</h4>
                          <p className="text-xs font-medium text-zinc-400 mt-0.5">{p.discount} &bull; {p.targetCategory}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-[10.5px] text-zinc-400">
                          <span>{p.impressions.toLocaleString()} impressions &bull; {p.clicks.toLocaleString()} clicks</span>
                          <button onClick={() => deletePromotion(p.id)} className="text-rose-400 font-medium hover:underline cursor-pointer">
                            Remove
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
              MODULE 3: CATALOG MANAGEMENT
          ========================================== */}
          {activeSection === 'catalog' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Sub-item: Products */}
              {activeSubTab === 'products' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl font-bold tracking-tight text-white">
                        Master Products & Inventory ({products.length})
                      </h1>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Manage luxury items, SKUs, inline inventory counts, and price tiers.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-[#14161C] border border-zinc-800 p-0.5 rounded-xl">
                        <button
                          onClick={() => setCatalogViewMode('table')}
                          className={`p-1.5 rounded-lg text-xs cursor-pointer transition ${catalogViewMode === 'table' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                          title="Table View"
                        >
                          <List className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setCatalogViewMode('grid')}
                          className={`p-1.5 rounded-lg text-xs cursor-pointer transition ${catalogViewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                          title="Grid View"
                        >
                          <Grid className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleOpenAddProduct}
                        className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition self-start sm:self-auto flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Product</span>
                      </button>
                    </div>
                  </div>

                  {/* Search & Filter Bar */}
                  <div className="grid gap-3 sm:grid-cols-3 rounded-2xl border border-zinc-800/90 bg-[#14161C] p-3 shadow-lg">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchCatalog}
                        onChange={e => setSearchCatalog(e.target.value)}
                        placeholder="Filter by title, SKU, brand..."
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-3.5 py-1.5 pl-8 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                      />
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 h-3.5 w-3.5 pointer-events-none" />
                    </div>

                    <select
                      value={filterCat}
                      onChange={e => {
                        setFilterCat(e.target.value);
                        setFilterBrand('All');
                      }}
                      className="rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-indigo-500 cursor-pointer font-medium"
                    >
                      <option value="All">All Departments</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select
                      value={filterBrand}
                      onChange={e => setFilterBrand(e.target.value)}
                      className="rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-indigo-500 cursor-pointer font-medium"
                    >
                      <option value="All">All Brands</option>
                      {(filterCat === 'All' ? brands : getBrandsByCategory(filterCat)).map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Products Table Mode */}
                  {catalogViewMode === 'table' ? (
                    <div className="overflow-x-auto rounded-2xl border border-zinc-800/90 bg-[#14161C] shadow-lg">
                      <table className="w-full text-left text-xs min-w-[750px]">
                        <thead className="border-b border-zinc-800 bg-[#111317] text-zinc-400 uppercase text-[10px] font-semibold tracking-wider">
                          <tr>
                            <th className="p-3.5">Product</th>
                            <th className="p-3.5">Department & Brand</th>
                            <th className="p-3.5">SKU & Gender</th>
                            <th className="p-3.5">Price</th>
                            <th className="p-3.5">Stock Controls</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60 font-normal">
                          {filteredProducts.map(p => (
                            <tr key={p.id} className="hover:bg-zinc-800/40 transition">
                              <td className="p-3.5">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={p.image || p.images?.[0]}
                                    alt=""
                                    className="h-11 w-11 rounded-xl object-contain bg-zinc-800 border border-zinc-700 shrink-0 p-1"
                                  />
                                  <div className="min-w-0">
                                    <span className="font-semibold text-zinc-100 block truncate max-w-xs">{p.name}</span>
                                    <span className="text-[10px] text-zinc-400">Rating ★ {p.rating || 4.9}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="p-3.5">
                                <span className="font-medium text-zinc-200 block">{p.category}</span>
                                <span className="text-[10.5px] text-zinc-400">{p.brand}</span>
                              </td>

                              <td className="p-3.5">
                                <span className="font-mono text-zinc-300 block">{p.sku}</span>
                                {p.gender && (
                                  <span className="text-[10px] text-zinc-400 font-medium">{p.gender}</span>
                                )}
                              </td>

                              <td className="p-3.5">
                                <span className="font-bold text-zinc-100 block tabular-nums">₹{Number(p.price).toLocaleString('en-IN')}</span>
                                {p.oldPrice && (
                                  <span className="text-[10px] text-zinc-500 line-through tabular-nums">₹{Number(p.oldPrice).toLocaleString('en-IN')}</span>
                                )}
                              </td>

                              <td className="p-3.5">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleStockAdjust(p.id, -1)}
                                    className="h-6 w-6 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 font-bold text-zinc-300 flex items-center justify-center text-xs shrink-0 cursor-pointer"
                                  >
                                    −
                                  </button>
                                  <span className={`font-mono font-bold px-2 text-xs ${p.stock < 5 ? 'text-rose-400' : 'text-zinc-200'}`}>
                                    {p.stock}
                                  </span>
                                  <button
                                    onClick={() => handleStockAdjust(p.id, 1)}
                                    className="h-6 w-6 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 font-bold text-zinc-300 flex items-center justify-center text-xs shrink-0 cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>

                              <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => handleOpenEditProduct(p)}
                                  className="rounded-lg border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-200 transition cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="rounded-lg border border-rose-900/60 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 px-2.5 py-1 text-xs font-medium transition cursor-pointer"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    /* Products Grid Mode */
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {filteredProducts.map(p => (
                        <div key={p.id} className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-3.5 shadow-md flex flex-col justify-between space-y-3">
                          <div className="h-40 w-full rounded-xl bg-zinc-800/80 border border-zinc-700 p-2 flex items-center justify-center overflow-hidden">
                            <img src={p.image || p.images?.[0]} alt="" className="max-h-full max-w-full object-contain" />
                          </div>
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] font-mono text-zinc-400 uppercase">{p.brand}</span>
                              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                                ★ {p.rating || 4.9}
                              </span>
                            </div>
                            <h4 className="font-semibold text-zinc-100 text-xs truncate mt-1">{p.name}</h4>
                            <p className="font-bold text-white text-sm mt-1 tabular-nums">₹{Number(p.price).toLocaleString('en-IN')}</p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleStockAdjust(p.id, -1)} className="h-5 w-5 rounded bg-zinc-800 text-zinc-300 flex items-center justify-center text-xs">-</button>
                              <span className="font-mono text-xs text-zinc-200 px-1">{p.stock}</span>
                              <button onClick={() => handleStockAdjust(p.id, 1)} className="h-5 w-5 rounded bg-zinc-800 text-zinc-300 flex items-center justify-center text-xs">+</button>
                            </div>
                            <div className="space-x-1">
                              <button onClick={() => handleOpenEditProduct(p)} className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs">Edit</button>
                              <button onClick={() => handleDeleteProduct(p.id)} className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded text-xs">Del</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sub-item: Categories */}
              {activeSubTab === 'categories' && (
                <div className="space-y-5">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                      Store Departments ({categories.length})
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">Master product departmental classification and taxonomy hierarchy.</p>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-5 shadow-lg space-y-4 h-fit">
                      <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">+ Add Department</h3>
                      <form onSubmit={handleAddCategorySubmit} className="space-y-3">
                        <input
                          type="text"
                          required
                          value={newCatInput}
                          onChange={e => setNewCatInput(e.target.value)}
                          placeholder="e.g. Fine Jewelry, Footwear..."
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium text-white outline-none focus:border-indigo-500"
                        />
                        <button
                          type="submit"
                          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition cursor-pointer"
                        >
                          Create Department
                        </button>
                      </form>
                    </div>

                    <div className="lg:col-span-2 rounded-2xl border border-zinc-800/90 bg-[#14161C] p-5 shadow-lg space-y-3">
                      <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Active Departments</h3>
                      <div className="divide-y divide-zinc-800/60">
                        {categories.map(cat => {
                          const count = products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
                          return (
                            <div key={cat} className="flex items-center justify-between py-2.5 text-xs">
                              <div className="flex items-center gap-2.5">
                                <Folder className="h-4 w-4 text-indigo-400" />
                                <div>
                                  <span className="font-semibold text-zinc-100 block">{cat}</span>
                                  <span className="text-[10.5px] text-zinc-400">{count} products linked</span>
                                </div>
                              </div>
                              <button
                                onClick={() => deleteCategory(cat)}
                                className="text-zinc-400 hover:text-rose-400 font-medium p-1 cursor-pointer"
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
                      <h1 className="text-xl font-bold tracking-tight text-white">
                        Subcategories Taxonomy ({subcategories.length})
                      </h1>
                      <p className="text-xs text-zinc-400 mt-0.5">Classification mapped to parent departments.</p>
                    </div>
                    <button
                      onClick={() => setSubcatModalOpen(true)}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Subcategory</span>
                    </button>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-3">
                    {subcategories.map(sub => (
                      <div key={sub.id} className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4.5 shadow-md flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono font-bold text-[10px] bg-zinc-800 text-indigo-300 border border-zinc-700 px-2 py-0.5 rounded-md">
                              {sub.code}
                            </span>
                            <button
                              onClick={() => deleteSubcategory(sub.id)}
                              className="text-zinc-500 hover:text-rose-400 p-1 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <h4 className="font-bold text-zinc-100 text-sm">{sub.name}</h4>
                          <p className="text-[11px] text-zinc-400 mt-0.5">Parent: {sub.category}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-zinc-800 text-[10.5px] text-zinc-500">
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
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                      Authorized Luxury Brands ({brands.length})
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">Registered manufacturer partners and authorized brand registries.</p>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-5 shadow-lg space-y-4 h-fit">
                      <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">+ Register Brand</h3>
                      <form onSubmit={handleAddBrandSubmit} className="space-y-3">
                        <input
                          type="text"
                          required
                          value={newBrandInput}
                          onChange={e => setNewBrandInput(e.target.value)}
                          placeholder="e.g. Bulgari, Cartier, Rolex..."
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-medium text-white outline-none focus:border-indigo-500"
                        />
                        <button
                          type="submit"
                          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition cursor-pointer"
                        >
                          Add Brand
                        </button>
                      </form>
                    </div>

                    <div className="lg:col-span-2 rounded-2xl border border-zinc-800/90 bg-[#14161C] p-5 shadow-lg space-y-3">
                      <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Brand Directory</h3>
                      <div className="flex flex-wrap gap-2">
                        {brands.map(b => {
                          const count = products.filter(p => p.brand?.toLowerCase() === b.toLowerCase()).length;
                          return (
                            <span key={b} className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/90 px-3 py-1.5 text-xs font-medium text-zinc-200">
                              <span>{b}</span>
                              {count > 0 && <span className="text-[10px] text-indigo-300 bg-indigo-500/20 px-1.5 py-0.2 rounded-md font-mono">{count}</span>}
                              <button onClick={() => deleteBrand(b)} className="text-zinc-500 hover:text-rose-400 ml-1 cursor-pointer">
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
                      <h1 className="text-xl font-bold tracking-tight text-white">
                        Product Variants & Attribute Matrix
                      </h1>
                      <p className="text-xs text-zinc-400 mt-0.5">Size, dial color, strap material, and storage variations.</p>
                    </div>
                    <button
                      onClick={() => setVariantModalOpen(true)}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Create Variant</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-zinc-800/90 bg-[#14161C] shadow-lg">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead className="border-b border-zinc-800 bg-[#111317] text-zinc-400 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="p-3.5">Product</th>
                          <th className="p-3.5">Variant SKU</th>
                          <th className="p-3.5">Attribute & Option</th>
                          <th className="p-3.5">Price Delta</th>
                          <th className="p-3.5">Inventory</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 font-normal">
                        {variants.map(v => (
                          <tr key={v.id} className="hover:bg-zinc-800/40">
                            <td className="p-3.5 font-semibold text-zinc-100">{v.productName}</td>
                            <td className="p-3.5 font-mono text-zinc-400">{v.sku}</td>
                            <td className="p-3.5">
                              <span className="font-medium text-zinc-200">{v.attributeType}:</span> {v.value}
                            </td>
                            <td className="p-3.5 font-semibold text-zinc-100 tabular-nums">
                              {v.priceModifier > 0 ? `+ ₹${v.priceModifier.toLocaleString('en-IN')}` : 'Base Price'}
                            </td>
                            <td className="p-3.5 font-mono text-emerald-400">{v.stock} in stock</td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => deleteVariant(v.id)}
                                className="text-zinc-500 hover:text-rose-400 p-1 cursor-pointer"
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

              {/* Sub-item: Media Assets */}
              {activeSubTab === 'images' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl font-bold tracking-tight text-white">
                        Media Library & Catalog Assets ({mediaAssets.length})
                      </h1>
                      <p className="text-xs text-zinc-400 mt-0.5">High-resolution catalog media assets, previews, and CDN links.</p>
                    </div>
                    <button
                      onClick={() => setMediaModalOpen(true)}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Index Media Asset</span>
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {mediaAssets.map(m => (
                      <div key={m.id} className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-3 shadow-md space-y-2.5">
                        <div className="h-44 w-full bg-zinc-800 rounded-xl overflow-hidden relative group border border-zinc-700">
                          <img src={m.url} alt={m.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText(m.url);
                              showToast('Asset CDN URL copied!');
                            }}
                            className="absolute bottom-2 right-2 rounded-lg bg-zinc-900/90 hover:bg-black text-white px-2.5 py-1 text-[10.5px] font-medium backdrop-blur-xs transition flex items-center gap-1 cursor-pointer shadow-md"
                          >
                            <Copy className="h-3 w-3" />
                            <span>Copy URL</span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-zinc-200 text-xs truncate max-w-[180px]">{m.title}</h4>
                            <p className="text-[10px] text-zinc-400">{m.dimensions} &bull; {m.size}</p>
                          </div>
                          <button
                            onClick={() => deleteMediaAsset(m.id)}
                            className="text-zinc-500 hover:text-rose-400 p-1 cursor-pointer"
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
              MODULE 4: PEOPLE & GOVERNANCE
          ========================================== */}
          {activeSection === 'people' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Sub-item: Users */}
              {activeSubTab === 'users' && (
                <div className="space-y-5">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                      Customer Accounts & Verified Directory ({users.length})
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">Manage buyer accounts, order frequencies, and platform access permissions.</p>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-zinc-800/90 bg-[#14161C] shadow-lg">
                    <table className="w-full text-left text-xs min-w-[650px]">
                      <thead className="border-b border-zinc-800 bg-[#111317] text-zinc-400 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="p-3.5">Customer</th>
                          <th className="p-3.5">Email</th>
                          <th className="p-3.5">Phone</th>
                          <th className="p-3.5">Role</th>
                          <th className="p-3.5">Lifetime Orders</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Access Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 font-normal">
                        {users.map(u => (
                          <tr key={u.id} className="hover:bg-zinc-800/40">
                            <td className="p-3.5 font-semibold text-zinc-100">{u.name}</td>
                            <td className="p-3.5 text-zinc-400 font-mono text-[11.5px]">{u.email}</td>
                            <td className="p-3.5 text-zinc-400">{u.phone || '—'}</td>
                            <td className="p-3.5">
                              <span className="rounded-lg bg-zinc-800 border border-zinc-700 px-2 py-0.5 text-[10px] font-medium text-zinc-300">
                                {u.role}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono text-zinc-200 font-bold">{u.ordersCount || 0}</td>
                            <td className="p-3.5">
                              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium border ${
                                u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
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
                                className="rounded-lg border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-200 transition cursor-pointer"
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
                      <h1 className="text-xl font-bold tracking-tight text-white">
                        Vendor Partners & Suppliers ({suppliers.length})
                      </h1>
                      <p className="text-xs text-zinc-400 mt-0.5">Approve vendor onboardings and manage supply relationships.</p>
                    </div>
                    <button
                      onClick={() => setSupplierModalOpen(true)}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Onboard Vendor</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-zinc-800/90 bg-[#14161C] shadow-lg">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead className="border-b border-zinc-800 bg-[#111317] text-zinc-400 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="p-3.5">Vendor Name</th>
                          <th className="p-3.5">Department</th>
                          <th className="p-3.5">Email & Phone</th>
                          <th className="p-3.5">Address</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 font-normal">
                        {suppliers.map(s => (
                          <tr key={s.id} className="hover:bg-zinc-800/40">
                            <td className="p-3.5 font-semibold text-zinc-100">{s.name}</td>
                            <td className="p-3.5 text-zinc-400">{s.category}</td>
                            <td className="p-3.5">
                              <span className="font-mono text-zinc-300 block">{s.email}</span>
                              <span className="text-[10.5px] text-zinc-500">{s.phone}</span>
                            </td>
                            <td className="p-3.5 text-zinc-400">{s.address}</td>
                            <td className="p-3.5">
                              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium border ${
                                s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
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
                                  className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 text-xs font-semibold transition cursor-pointer shadow-xs"
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
                                  className="rounded-lg border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-300 transition cursor-pointer"
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
                      <h1 className="text-xl font-bold tracking-tight text-white">
                        Governance Roles ({roles.length})
                      </h1>
                      <p className="text-xs text-zinc-400 mt-0.5">Platform access levels and functional permissions scope.</p>
                    </div>
                    <button
                      onClick={() => setRoleModalOpen(true)}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Role</span>
                    </button>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {roles.map(r => (
                      <div key={r.id} className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4.5 shadow-md space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-100 text-sm">{r.name}</span>
                          <span className="text-[10px] font-medium bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-700">
                            {r.membersCount} Assigned
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{r.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-item: Permissions */}
              {activeSubTab === 'permissions' && (
                <div className="space-y-5">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                      Granular RBAC Permissions Matrix
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">Feature capabilities mapped directly to platform governance roles.</p>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-zinc-800/90 bg-[#14161C] shadow-lg">
                    <table className="w-full text-left text-xs min-w-[650px]">
                      <thead className="border-b border-zinc-800 bg-[#111317] text-zinc-400 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="p-3.5">Capability Module</th>
                          <th className="p-3.5 text-center">Super Admin</th>
                          <th className="p-3.5 text-center">Catalog Ops</th>
                          <th className="p-3.5 text-center">Finance Lead</th>
                          <th className="p-3.5 text-center">Support Agent</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 font-normal">
                        {permissionsMatrix.map(perm => (
                          <tr key={perm.id} className="hover:bg-zinc-800/40">
                            <td className="p-3.5">
                              <span className="font-semibold text-zinc-200 block">{perm.capability}</span>
                              <span className="text-[10.5px] text-zinc-500">{perm.category}</span>
                            </td>
                            <td className="p-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={perm.superAdmin}
                                onChange={e => updateRolePermission(perm.id, 'superAdmin', e.target.checked)}
                                className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-indigo-600 cursor-pointer"
                              />
                            </td>
                            <td className="p-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={perm.catalogManager}
                                onChange={e => updateRolePermission(perm.id, 'catalogManager', e.target.checked)}
                                className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-indigo-600 cursor-pointer"
                              />
                            </td>
                            <td className="p-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={perm.financeLead}
                                onChange={e => updateRolePermission(perm.id, 'financeLead', e.target.checked)}
                                className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-indigo-600 cursor-pointer"
                              />
                            </td>
                            <td className="p-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={perm.supportAgent}
                                onChange={e => updateRolePermission(perm.id, 'supportAgent', e.target.checked)}
                                className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-indigo-600 cursor-pointer"
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
              MODULE 5: OPERATIONS & LOGISTICS
          ========================================== */}
          {activeSection === 'operations' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Sub-item: Inventory */}
              {activeSubTab === 'inventory' && (
                <div className="space-y-5">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                      Inventory Health & Stock Ledger
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">Real-time bin counts, safety replenishment thresholds, and quick-restock triggers.</p>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-zinc-800/90 bg-[#14161C] shadow-lg">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead className="border-b border-zinc-800 bg-[#111317] text-zinc-400 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="p-3.5">SKU</th>
                          <th className="p-3.5">Title</th>
                          <th className="p-3.5">Department</th>
                          <th className="p-3.5">Current Stock</th>
                          <th className="p-3.5">Health State</th>
                          <th className="p-3.5 text-right">Quick Restock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 font-normal">
                        {products.map(p => {
                          const stock = Number(p.stock) || 0;
                          return (
                            <tr key={p.id} className="hover:bg-zinc-800/40">
                              <td className="p-3.5 font-mono text-zinc-400">{p.sku}</td>
                              <td className="p-3.5 font-medium text-zinc-200 truncate max-w-xs">{p.name}</td>
                              <td className="p-3.5 text-zinc-400">{p.category}</td>
                              <td className="p-3.5 font-mono font-bold tabular-nums text-zinc-100">{stock} Units</td>
                              <td className="p-3.5">
                                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium border ${
                                  stock <= 0 ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' : stock < 5 ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                }`}>
                                  {stock <= 0 ? 'Out of Stock' : stock < 5 ? 'Low Stock' : 'Healthy'}
                                </span>
                              </td>
                              <td className="p-3.5 text-right space-x-1.5">
                                <button
                                  onClick={() => handleStockAdjust(p.id, 5)}
                                  className="rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 text-xs font-semibold text-zinc-200 transition cursor-pointer"
                                >
                                  +5 Units
                                </button>
                                <button
                                  onClick={() => handleStockAdjust(p.id, 20)}
                                  className="rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 text-xs font-semibold text-zinc-200 transition cursor-pointer"
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
                    <h1 className="text-xl font-bold tracking-tight text-white">
                      Logistics Carriers & Integrated SLAs
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">Express delivery carrier integrations, tracking SLAs, and service status.</p>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {shippingCarriers.map(c => (
                      <div key={c.id} className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4.5 shadow-md space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-indigo-400" />
                            <h4 className="font-bold text-zinc-100 text-sm">{c.name}</h4>
                          </div>
                          <button
                            onClick={() => {
                              toggleCarrierStatus(c.id);
                              refreshAll();
                              showToast('Carrier status updated');
                            }}
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium border cursor-pointer ${
                              c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                            }`}
                          >
                            {c.status}
                          </button>
                        </div>
                        <div className="text-xs text-zinc-400 space-y-1">
                          <p><strong>Tracking Format:</strong> <span className="font-mono text-zinc-300">{c.trackingFormat}</span></p>
                          <p><strong>Delivery SLA:</strong> <span className="text-zinc-300">{c.sla}</span></p>
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
                    <h1 className="text-xl font-bold tracking-tight text-white">
                      Order Fulfillment Pipeline
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">Live consignment distribution across logistical delivery stages.</p>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-4">
                    {[
                      { stage: 'Confirmed', count: orders.filter(o => o.status === 'Confirmed').length, color: 'border-zinc-700' },
                      { stage: 'Processing', count: orders.filter(o => o.status === 'Processing').length, color: 'border-zinc-700' },
                      { stage: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length, color: 'border-sky-500/40' },
                      { stage: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length, color: 'border-emerald-500/40' }
                    ].map(st => (
                      <div key={st.stage} className={`rounded-2xl border ${st.color} bg-[#14161C] p-4.5 shadow-md`}>
                        <span className="text-[10px] font-semibold uppercase text-zinc-400">{st.stage}</span>
                        <p className="text-3xl font-bold text-white mt-1 tabular-nums">{st.count}</p>
                        <p className="text-[10.5px] text-zinc-500 mt-0.5">Active Consignments</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-item: Notifications */}
              {activeSubTab === 'notifications' && (
                <div className="space-y-5">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                      Platform Broadcasts & Announcements
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">Publish global announcements to all store administrators and customers.</p>
                  </div>

                  <form onSubmit={handleBroadcastNotification} className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-5 shadow-lg space-y-3.5 max-w-xl">
                    <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">+ Send Broadcast</h3>
                    <div>
                      <label className="text-xs font-medium text-zinc-300 block mb-1">Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Scheduled System Upgrade Window"
                        value={newNotificationTitle}
                        onChange={e => setNewNotificationTitle(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-300 block mb-1">Message *</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Announcement message content..."
                        value={newNotificationText}
                        onChange={e => setNewNotificationText(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition cursor-pointer"
                    >
                      Broadcast Message
                    </button>
                  </form>
                </div>
              )}

            </div>
          )}

          {/* ==========================================
              MODULE 6: INTELLIGENCE & ANALYTICS
          ========================================== */}
          {activeSection === 'analytics' && (
            <div className="space-y-6 animate-fade-in">
              
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Store Analytics & Intelligence
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">Commercial GMV metrics, conversion velocity, and supplier performance reporting.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4.5 shadow-md">
                  <span className="text-[10px] font-semibold uppercase text-zinc-400">Total GMV</span>
                  <p className="text-2xl font-bold text-white mt-1 tabular-nums">₹{totalRevenue.toLocaleString('en-IN')}</p>
                  <p className="text-[10.5px] text-emerald-400 font-medium mt-0.5">↑ +18.4% vs last period</p>
                </div>
                <div className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4.5 shadow-md">
                  <span className="text-[10px] font-semibold uppercase text-zinc-400">Average Order Value</span>
                  <p className="text-2xl font-bold text-white mt-1 tabular-nums">
                    ₹{averageOrderValue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10.5px] text-zinc-400 mt-0.5">Based on completed sales</p>
                </div>
                <div className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-4.5 shadow-md">
                  <span className="text-[10px] font-semibold uppercase text-zinc-400">Repeat Retention Rate</span>
                  <p className="text-2xl font-bold text-indigo-400 mt-1 tabular-nums">42.8%</p>
                  <p className="text-[10.5px] text-zinc-400 mt-0.5">Verified customer base</p>
                </div>
              </div>

              {/* Top Products Table */}
              <div className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-5 shadow-lg space-y-3">
                <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Top Performing Products</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-zinc-800 bg-[#111317] text-zinc-400 uppercase text-[10px] font-semibold">
                      <tr>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Unit Price</th>
                        <th className="p-3 text-right">Available Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-normal">
                      {products.slice(0, 5).map(p => (
                        <tr key={p.id} className="hover:bg-zinc-800/40">
                          <td className="p-3 font-semibold text-zinc-100">{p.name}</td>
                          <td className="p-3 text-zinc-400">{p.category}</td>
                          <td className="p-3 font-bold text-zinc-200 tabular-nums">₹{Number(p.price).toLocaleString('en-IN')}</td>
                          <td className="p-3 text-right font-mono tabular-nums text-zinc-200">{p.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              MODULE 7: PLATFORM & SYSTEM
          ========================================== */}
          {activeSection === 'system' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Sub-item: Settings */}
              {activeSubTab === 'settings' && (
                <div className="space-y-5 max-w-xl">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                      Store Profile & Global Configuration
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">Master platform parameters and financial currencies.</p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-5 shadow-lg space-y-3.5 text-xs">
                    <div>
                      <label className="font-medium text-zinc-300 block mb-1">Store Name</label>
                      <input
                        type="text"
                        value={systemConfig.storeName}
                        onChange={e => setSystemConfigState({ ...systemConfig, storeName: e.target.value })}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500 font-semibold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-medium text-zinc-300 block mb-1">Currency Symbol</label>
                        <input
                          type="text"
                          value={systemConfig.currency}
                          onChange={e => setSystemConfigState({ ...systemConfig, currency: e.target.value })}
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="font-medium text-zinc-300 block mb-1">Tax Rate (GST %)</label>
                        <input
                          type="number"
                          value={systemConfig.taxRate || 18}
                          onChange={e => setSystemConfigState({ ...systemConfig, taxRate: Number(e.target.value) })}
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-medium text-zinc-300 block mb-1">Support Email</label>
                      <input
                        type="email"
                        value={systemConfig.supportEmail}
                        onChange={e => setSystemConfigState({ ...systemConfig, supportEmail: e.target.value })}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition cursor-pointer"
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
                    <h1 className="text-xl font-bold tracking-tight text-white">
                      Security & Governance Audit Trail
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">Immutable record of administrator actions, session authentications, and modifications.</p>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-zinc-800/90 bg-[#14161C] shadow-lg">
                    <table className="w-full text-left text-xs min-w-[650px]">
                      <thead className="border-b border-zinc-800 bg-[#111317] text-zinc-400 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="p-3.5">Action</th>
                          <th className="p-3.5">Event Detail</th>
                          <th className="p-3.5">Administrator</th>
                          <th className="p-3.5">Timestamp</th>
                          <th className="p-3.5 text-right">IP Address</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 font-normal">
                        {auditLogs.map(log => (
                          <tr key={log.id} className="hover:bg-zinc-800/40">
                            <td className="p-3.5 font-semibold text-zinc-100">{log.action}</td>
                            <td className="p-3.5 text-zinc-400">{log.detail}</td>
                            <td className="p-3.5 font-medium text-zinc-300">{log.admin}</td>
                            <td className="p-3.5 text-zinc-500">{log.time}</td>
                            <td className="p-3.5 text-right font-mono text-[11px] text-zinc-400">{log.ip}</td>
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
                    <h1 className="text-xl font-bold tracking-tight text-white">
                      Platform Security Overview
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">Authentication policies and encryption certificates.</p>
                  </div>

                  <div className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-5 shadow-lg space-y-3.5 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <div>
                        <span className="font-semibold text-zinc-100 block">Two-Factor Authentication (2FA)</span>
                        <p className="text-zinc-400 text-[11px]">Enforced for all administrative sessions</p>
                      </div>
                      <span className="text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px]">
                        ✓ Enabled
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <div>
                        <span className="font-semibold text-zinc-100 block">TLS / SSL Encryption</span>
                        <p className="text-zinc-400 text-[11px]">High-grade SHA-256 with RSA Certificate</p>
                      </div>
                      <span className="text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px]">
                        ✓ Active (A+ Grade)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-zinc-100 block">Session Inactivity Timeout</span>
                        <p className="text-zinc-400 text-[11px]">Auto-locks idle consoles after 30 minutes</p>
                      </div>
                      <span className="font-mono text-zinc-300 font-medium">30 Mins</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-item: Backups */}
              {activeSubTab === 'backups' && (
                <div className="space-y-5 max-w-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-bold tracking-tight text-white">
                        Database Backups & Snapshot Recovery
                      </h1>
                      <p className="text-xs text-zinc-400 mt-0.5">Export full store state as JSON or restore from snapshot.</p>
                    </div>
                    <button
                      onClick={handleDownloadBackup}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 text-xs font-semibold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Export JSON Backup</span>
                    </button>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-5 shadow-lg space-y-3">
                      <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Automated Backup Schedule</h3>
                      <p className="text-xs text-zinc-400">
                        Nightly snapshots are saved automatically to redundant storage.
                      </p>
                      <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-xs space-y-1">
                        <p className="font-semibold text-zinc-100">Last Snapshot: Today at 04:30 AM</p>
                        <p className="text-zinc-400 text-[11px]">Includes: Products, Orders, Suppliers, Users, Config</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-5 shadow-lg space-y-3">
                      <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Restore Database from JSON</h3>
                      <textarea
                        rows={3}
                        value={backupJsonInput}
                        onChange={e => setBackupJsonInput(e.target.value)}
                        placeholder="Paste exported backup JSON content here..."
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-2.5 text-xs font-mono text-white outline-none focus:border-indigo-500 resize-none"
                      />
                      <button
                        onClick={handleRestoreBackup}
                        className="rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3.5 py-2 text-xs font-semibold text-white cursor-pointer transition"
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
                    <h1 className="text-xl font-bold tracking-tight text-white">
                      System Infrastructure & Gateways
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">API keys, SMTP mailer status, and maintenance mode toggles.</p>
                  </div>

                  <div className="rounded-2xl border border-zinc-800/90 bg-[#14161C] p-5 shadow-lg space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <div>
                        <span className="font-semibold text-zinc-100 block">Payment Gateway (Razorpay API)</span>
                        <p className="text-zinc-400 text-[11px]">Production merchant keys active</p>
                      </div>
                      <span className="text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px]">
                        ✓ Connected
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <div>
                        <span className="font-semibold text-zinc-100 block">Transactional Email SMTP</span>
                        <p className="text-zinc-400 text-[11px]">{systemConfig.smtpMailerStatus || 'Connected'}</p>
                      </div>
                      <span className="text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px]">
                        ✓ Connected
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <div>
                        <span className="font-semibold text-zinc-100 block">Storefront Maintenance Mode</span>
                        <p className="text-zinc-400 text-[11px]">Temporary downtime overlay for customers</p>
                      </div>
                      <button
                        onClick={() => {
                          const updated = saveSystemConfig({ maintenanceMode: !systemConfig.maintenanceMode });
                          setSystemConfigState(updated);
                          showToast(updated.maintenanceMode ? 'Maintenance Mode activated' : 'Store is live');
                        }}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                          systemConfig.maintenanceMode ? 'bg-rose-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-800 bg-[#16181F] p-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Product'}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Live synchronization with customer storefront</p>
              </div>
              <button
                onClick={() => setProductModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="font-medium text-zinc-300 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Submariner Date 41mm Cerachrom"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="font-medium text-zinc-300 block mb-1">Department *</label>
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
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none cursor-pointer"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-medium text-zinc-300 block mb-1">Brand *</label>
                  <select
                    value={productForm.brand}
                    onChange={e => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none cursor-pointer"
                  >
                    {(getBrandsByCategory(productForm.category) || brands).map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-medium text-zinc-300 block mb-1">Gender / Dept</label>
                  <select
                    value={productForm.gender}
                    onChange={e => setProductForm({ ...productForm, gender: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none cursor-pointer"
                  >
                    <option value="Men's">Men's</option>
                    <option value="Ladies">Ladies</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="font-medium text-zinc-300 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="e.g. 945000"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-300 block mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.oldPrice}
                    onChange={e => setProductForm({ ...productForm, oldPrice: e.target.value })}
                    placeholder="e.g. 1050000"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-300 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="e.g. 15"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-medium text-zinc-300 block mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={e => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="e.g. KA-ROL-001"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 font-mono text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-300 block mb-1">Assigned Vendor</label>
                  <select
                    value={productForm.supplier}
                    onChange={e => setProductForm({ ...productForm, supplier: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none cursor-pointer"
                  >
                    {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-zinc-300 block mb-1">Product Image URL</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-medium text-zinc-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Detailed specifications and features..."
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="pt-3 flex flex-col sm:flex-row justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 font-medium text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2 font-semibold text-white shadow-md shadow-indigo-600/20 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#16181F] p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="text-sm font-bold text-white">Add New Subcategory</h3>
              <button onClick={() => setSubcatModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubcategory} className="space-y-3">
              <div>
                <label className="font-medium text-zinc-300 block mb-1">Parent Department *</label>
                <select
                  value={subcatForm.category}
                  onChange={e => setSubcatForm({ ...subcatForm, category: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none cursor-pointer"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="font-medium text-zinc-300 block mb-1">Subcategory Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chronograph Watches, Leather Wallets"
                  value={subcatForm.name}
                  onChange={e => setSubcatForm({ ...subcatForm, name: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setSubcatModalOpen(false)} className="rounded-xl px-3.5 py-1.5 border border-zinc-700 bg-zinc-800 text-zinc-300 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl px-4 py-1.5 bg-indigo-600 text-white font-semibold cursor-pointer">
                  Save Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Variant Modal */}
      {variantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#16181F] p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="text-sm font-bold text-white">Add Product Variant</h3>
              <button onClick={() => setVariantModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddVariant} className="space-y-3">
              <div>
                <label className="font-medium text-zinc-300 block mb-1">Parent Product *</label>
                <select
                  value={variantForm.productName}
                  onChange={e => setVariantForm({ ...variantForm, productName: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none cursor-pointer"
                >
                  {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-medium text-zinc-300 block mb-1">Attribute Type *</label>
                <select
                  value={variantForm.attributeType}
                  onChange={e => setVariantForm({ ...variantForm, attributeType: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none cursor-pointer"
                >
                  <option value="Dial Color">Dial Color</option>
                  <option value="Strap Material">Strap Material</option>
                  <option value="Shoe Size">Shoe Size</option>
                  <option value="Storage">Storage / Capacity</option>
                  <option value="Color Finish">Color Finish</option>
                </select>
              </div>
              <div>
                <label className="font-medium text-zinc-300 block mb-1">Option Value *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kermit Green, UK 10, 512 GB"
                  value={variantForm.value}
                  onChange={e => setVariantForm({ ...variantForm, value: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-zinc-300 block mb-1">Price Delta (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={variantForm.priceModifier}
                    onChange={e => setVariantForm({ ...variantForm, priceModifier: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-300 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={variantForm.stock}
                    onChange={e => setVariantForm({ ...variantForm, stock: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setVariantModalOpen(false)} className="rounded-xl px-3.5 py-1.5 border border-zinc-700 bg-zinc-800 text-zinc-300 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl px-4 py-1.5 bg-indigo-600 text-white font-semibold cursor-pointer">
                  Save Variant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Media Asset Modal */}
      {mediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#16181F] p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="text-sm font-bold text-white">Index Media Asset</h3>
              <button onClick={() => setMediaModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddMedia} className="space-y-3">
              <div>
                <label className="font-medium text-zinc-300 block mb-1">Asset Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rolex Submariner Macro Studio"
                  value={mediaForm.title}
                  onChange={e => setMediaForm({ ...mediaForm, title: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="font-medium text-zinc-300 block mb-1">Image CDN URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={mediaForm.url}
                  onChange={e => setMediaForm({ ...mediaForm, url: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="font-medium text-zinc-300 block mb-1">Department</label>
                <select
                  value={mediaForm.category}
                  onChange={e => setMediaForm({ ...mediaForm, category: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none cursor-pointer"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setMediaModalOpen(false)} className="rounded-xl px-3.5 py-1.5 border border-zinc-700 bg-zinc-800 text-zinc-300 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl px-4 py-1.5 bg-indigo-600 text-white font-semibold cursor-pointer">
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Promotion Modal */}
      {promoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#16181F] p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="text-sm font-bold text-white">Create Promotional Campaign</h3>
              <button onClick={() => setPromoModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddPromotion} className="space-y-3">
              <div>
                <label className="font-medium text-zinc-300 block mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Autumn Horology Showcase"
                  value={promoForm.title}
                  onChange={e => setPromoForm({ ...promoForm, title: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-zinc-300 block mb-1">Promo Code</label>
                  <input
                    type="text"
                    placeholder="AUTUMN20"
                    value={promoForm.code}
                    onChange={e => setPromoForm({ ...promoForm, code: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 font-mono uppercase font-bold text-white outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-300 block mb-1">Discount Text</label>
                  <input
                    type="text"
                    placeholder="Flat 20% Off"
                    value={promoForm.discount}
                    onChange={e => setPromoForm({ ...promoForm, discount: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="font-medium text-zinc-300 block mb-1">Target Department</label>
                <select
                  value={promoForm.targetCategory}
                  onChange={e => setPromoForm({ ...promoForm, targetCategory: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none cursor-pointer"
                >
                  <option value="All Departments">All Departments</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setPromoModalOpen(false)} className="rounded-xl px-3.5 py-1.5 border border-zinc-700 bg-zinc-800 text-zinc-300 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl px-4 py-1.5 bg-indigo-600 text-white font-semibold cursor-pointer">
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Role Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#16181F] p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="text-sm font-bold text-white">Add Governance Role</h3>
              <button onClick={() => setRoleModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddRole} className="space-y-3">
              <div>
                <label className="font-medium text-zinc-300 block mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Concierge Manager"
                  value={roleForm.name}
                  onChange={e => setRoleForm({ ...roleForm, name: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="font-medium text-zinc-300 block mb-1">Role Description</label>
                <textarea
                  rows={2}
                  placeholder="Responsibilities and access scope..."
                  value={roleForm.description}
                  onChange={e => setRoleForm({ ...roleForm, description: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setRoleModalOpen(false)} className="rounded-xl px-3.5 py-1.5 border border-zinc-700 bg-zinc-800 text-zinc-300 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl px-4 py-1.5 bg-indigo-600 text-white font-semibold cursor-pointer">
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Admin Return & Refund Review Modal */}
      {adminReturnModalOpen && selectedReturnOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-[#16181F] p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-semibold text-xs">
                  <RotateCcw className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Review Return & Settle Refund
                  </h3>
                  <span className="font-mono text-[10px] text-zinc-400">Order: {selectedReturnOrder.id}</span>
                </div>
              </div>
              <button
                onClick={() => setAdminReturnModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-800/50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-200">Customer: {selectedReturnOrder.customer?.firstName} {selectedReturnOrder.customer?.lastName}</span>
                <span className="font-mono font-bold text-emerald-400">₹{selectedReturnOrder.total?.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                <strong>Reason:</strong> {selectedReturnOrder.returnRequest?.reason || 'Not specified'}
              </p>
              <p className="text-[11px] text-zinc-400">
                <strong>Condition:</strong> {selectedReturnOrder.returnRequest?.condition || 'Inspected'}
              </p>
            </div>

            <form onSubmit={handleProcessAdminReturn} className="space-y-3.5">
              <div>
                <label className="font-medium text-zinc-300 block mb-1">Administrative Decision *</label>
                <select
                  value={adminReturnDecision}
                  onChange={e => setAdminReturnDecision(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 outline-none text-xs font-semibold text-white cursor-pointer"
                >
                  <option value="Refunded">Approve Return & Issue Full Refund (Refunded)</option>
                  <option value="Return Approved">Authorize Return Pickup (Pending Warehouse Inspection)</option>
                  <option value="Return Rejected">Decline / Reject Return Request</option>
                </select>
              </div>

              {adminReturnDecision === 'Refunded' && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="font-medium text-zinc-300 block mb-1">Refund Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      value={adminRefundAmount}
                      onChange={e => setAdminRefundAmount(e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 outline-none font-mono font-bold text-white focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-zinc-300 block mb-1">Refund Txn ID *</label>
                    <input
                      type="text"
                      required
                      value={adminRefundTxn}
                      onChange={e => setAdminRefundTxn(e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 outline-none font-mono text-white focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-medium text-zinc-300 block mb-1">Admin Audit Notes / Feedback</label>
                <textarea
                  rows={2}
                  value={adminReturnNotes}
                  onChange={e => setAdminReturnNotes(e.target.value)}
                  placeholder="Notes logged in customer timeline..."
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 outline-none text-white focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setAdminReturnModalOpen(false)}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 font-medium text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`rounded-xl px-5 py-2 font-semibold text-white shadow-md cursor-pointer ${
                    adminReturnDecision === 'Return Rejected'
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#16181F] p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-white">Onboard New Vendor Partner</h3>
                <p className="text-[11px] text-zinc-400">Register a new supplier for catalog fulfillment</p>
              </div>
              <button onClick={() => setSupplierModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddSupplierSubmit} className="space-y-3">
              <div>
                <label className="font-medium text-zinc-300 block mb-1">Company / Vendor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Timepieces Ltd."
                  value={supplierForm.name}
                  onChange={e => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-zinc-300 block mb-1">Department</label>
                  <select
                    value={supplierForm.category}
                    onChange={e => setSupplierForm({ ...supplierForm, category: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none cursor-pointer"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-medium text-zinc-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={supplierForm.phone}
                    onChange={e => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="font-medium text-zinc-300 block mb-1">Business Email *</label>
                <input
                  type="email"
                  required
                  placeholder="vendor@company.com"
                  value={supplierForm.email}
                  onChange={e => setSupplierForm({ ...supplierForm, email: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="font-medium text-zinc-300 block mb-1">Registered Address</label>
                <input
                  type="text"
                  placeholder="City, State, India"
                  value={supplierForm.address}
                  onChange={e => setSupplierForm({ ...supplierForm, address: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-zinc-800">
                <button type="button" onClick={() => setSupplierModalOpen(false)} className="rounded-xl px-3.5 py-1.5 border border-zinc-700 bg-zinc-800 font-medium text-zinc-300 hover:bg-zinc-700 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl px-4 py-1.5 bg-indigo-600 text-white font-semibold hover:bg-indigo-500 cursor-pointer shadow-md shadow-indigo-600/20">
                  Add Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Admin Order Details Inspector & Invoice Modal */}
      {orderModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl rounded-3xl border border-zinc-800 bg-[#16181F] p-5 sm:p-7 shadow-2xl space-y-5 text-xs max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-sm font-bold shadow-xs">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Order Consignment {selectedOrder.id}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                      selectedOrder.status === 'Delivered'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : selectedOrder.status === 'Shipped'
                        ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                        : selectedOrder.status === 'Cancelled'
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Placed on {selectedOrder.date} &bull; Payment: <strong className="text-zinc-200 font-medium">{selectedOrder.paymentMethod} ({selectedOrder.paymentStatus || 'Paid'})</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Print Consignment Invoice"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => setOrderModalOpen(false)}
                  className="rounded-xl bg-zinc-800 hover:bg-zinc-700 h-8 w-8 flex items-center justify-center text-zinc-400 hover:text-white font-bold transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 2-Column Grid */}
            <div className="grid gap-5 md:grid-cols-2">
              
              {/* Left Column: Customer & Delivery Destination */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-800/40 p-4 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Client Profile & Contact
                    </span>
                    <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Verified Client
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-zinc-100">
                      {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                    </p>
                    <p className="text-zinc-400 flex items-center gap-1.5">
                      <span className="text-zinc-500">Email:</span>
                      <a href={`mailto:${selectedOrder.customer?.email}`} className="text-indigo-400 font-medium hover:underline">
                        {selectedOrder.customer?.email || 'Not provided'}
                      </a>
                    </p>
                    <p className="text-zinc-400 flex items-center gap-1.5">
                      <span className="text-zinc-500">Phone:</span>
                      <a href={`tel:${selectedOrder.customer?.phone}`} className="text-zinc-200 font-mono">
                        {selectedOrder.customer?.phone || 'Not provided'}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-800/40 p-4 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Shipping Destination
                    </span>
                    <span className="font-mono text-[10.5px] font-semibold text-zinc-300">
                      PIN: {selectedOrder.customer?.pincode || '380001'}
                    </span>
                  </div>

                  <div className="space-y-1 text-zinc-300 leading-relaxed">
                    <p className="font-medium text-zinc-100">
                      {selectedOrder.customer?.address || 'Standard Address'}
                    </p>
                    <p className="text-[11px] text-zinc-400 font-medium">
                      {selectedOrder.customer?.city || 'Ahmedabad'}, {selectedOrder.customer?.state || 'Gujarat'} - {selectedOrder.customer?.pincode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Financial Breakdown & Fast Status/Courier Assignment */}
              <div className="space-y-4">
                
                {/* Financial Summary */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-800/40 p-4 space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block border-b border-zinc-800 pb-1.5">
                    Financial Summary
                  </span>
                  <div className="space-y-1.5 text-xs text-zinc-400">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-zinc-100 tabular-nums">₹{(selectedOrder.subtotal || 0).toLocaleString('en-IN')}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-medium">
                        <span>Discount Applied</span>
                        <span className="tabular-nums">−₹{selectedOrder.discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping Handling</span>
                      <span className="font-semibold text-zinc-100 tabular-nums">
                        {selectedOrder.shipping === 0 ? <span className="text-emerald-400 font-semibold">FREE</span> : `₹${selectedOrder.shipping}`}
                      </span>
                    </div>
                    <div className="border-t border-zinc-800 pt-2 flex justify-between items-baseline">
                      <span className="font-bold text-white">Total Invoice Amount</span>
                      <span className="text-base font-bold text-emerald-400 tabular-nums">
                        ₹{(selectedOrder.total || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Logistics & Status Form */}
                <form onSubmit={handleUpdateOrderDetails} className="rounded-2xl border border-zinc-800 bg-[#16181F] p-4 space-y-3 shadow-md">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block border-b border-zinc-800 pb-1.5">
                    Fulfillment & Courier Controls
                  </span>

                  <div>
                    <label className="text-[11px] font-medium text-zinc-300 block mb-1">Fulfillment Status</label>
                    <select
                      value={selectedOrderStatus}
                      onChange={e => setSelectedOrderStatus(e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-white outline-none cursor-pointer"
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
                      <label className="text-[11px] font-medium text-zinc-300 block mb-1">Carrier Partner</label>
                      <select
                        value={selectedOrderCourier}
                        onChange={e => setSelectedOrderCourier(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-white outline-none cursor-pointer"
                      >
                        <option value="BlueDart Express Air">BlueDart Express Air</option>
                        <option value="Delhivery Surface & Air">Delhivery Surface & Air</option>
                        <option value="FedEx Luxury Secure">FedEx Luxury Secure</option>
                        <option value="DTDC Prime Gold">DTDC Prime Gold</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-zinc-300 block mb-1">AWB Tracking No.</label>
                      <input
                        type="text"
                        value={selectedOrderTracking}
                        onChange={e => setSelectedOrderTracking(e.target.value)}
                        placeholder="e.g. BD98234110IN"
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-mono font-semibold text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition cursor-pointer"
                  >
                    Save Fulfillment Details
                  </button>
                </form>

              </div>

            </div>

            {/* Purchased Items Table */}
            <div className="rounded-2xl border border-zinc-800 bg-[#14161C] overflow-hidden shadow-md">
              <div className="bg-[#111317] px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Consignment Items Checklist ({selectedOrder.items?.length || 0})
                </span>
                <span className="font-mono text-[10px] text-emerald-400">Inventory Verified</span>
              </div>

              <div className="divide-y divide-zinc-800/60 max-h-48 overflow-y-auto">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image}
                        alt=""
                        className="h-10 w-10 rounded-xl object-contain bg-zinc-800 border border-zinc-700 p-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-100 truncate">{item.name}</p>
                        <p className="text-[10.5px] text-zinc-400 truncate">
                          {item.brand || 'Luxury Edition'} {item.color && `&bull; ${item.color}`} &bull; Qty: <strong className="text-zinc-200 font-semibold">{item.quantity}</strong>
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 font-mono">
                      <span className="font-bold text-zinc-100 block tabular-nums">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-zinc-500 tabular-nums">₹{(item.price || 0).toLocaleString('en-IN')} each</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-2 flex justify-end gap-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setOrderModalOpen(false)}
                className="rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-4 py-1.5 font-medium text-zinc-300 transition cursor-pointer"
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