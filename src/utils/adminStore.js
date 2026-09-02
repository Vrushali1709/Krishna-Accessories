// src/utils/adminStore.js
// Specialized store utilities for Krishna Accessories Advanced Admin Panel

const SUBCATEGORIES_KEY = 'krishna_subcategories';
const VARIANTS_KEY = 'krishna_product_variants';
const MEDIA_KEY = 'krishna_media_assets';
const PROMOTIONS_KEY = 'krishna_promotions';
const ROLES_KEY = 'krishna_roles';
const PERMISSIONS_KEY = 'krishna_permissions_matrix';
const SHIPPING_KEY = 'krishna_shipping_carriers';
const SYSTEM_CONFIG_KEY = 'krishna_system_config';

// -------------------------------------------------------------
// 1. SUBCATEGORIES STORE
// -------------------------------------------------------------
export const defaultSubcategories = [
  { id: 1, name: "Automatic Watches", category: "Watches", code: "WAT-AUTO", itemCount: 12 },
  { id: 2, name: "Chronograph", category: "Watches", code: "WAT-CHRONO", itemCount: 8 },
  { id: 3, name: "Luxury Smartwatches", category: "Watches", code: "WAT-SMART", itemCount: 5 },
  { id: 4, name: "Leather Wallets", category: "Bags & Wallets", code: "BAG-WLT", itemCount: 14 },
  { id: 5, name: "Crossbody & Backpacks", category: "Bags & Wallets", code: "BAG-CRB", itemCount: 9 },
  { id: 6, name: "Sneakers & Casuals", category: "Shoes", code: "SH-SNK", itemCount: 11 },
  { id: 7, name: "Formal Oxfords", category: "Shoes", code: "SH-OXF", itemCount: 7 },
  { id: 8, name: "Flagship Smartphones", category: "Mobiles", code: "MOB-FLG", itemCount: 6 },
  { id: 9, name: "Designer Shirts", category: "Clothes & Fashion", code: "CLT-SHRT", itemCount: 15 },
  { id: 10, name: "Denim & Trousers", category: "Clothes & Fashion", code: "CLT-DNM", itemCount: 10 },
  { id: 11, name: "Gaming Laptops", category: "Laptops", code: "LAP-GAM", itemCount: 4 },
  { id: 12, name: "Wireless Earbuds & Headphones", category: "Electronics", code: "ELE-AUD", itemCount: 8 }
];

export function getSubcategories() {
  try {
    const data = localStorage.getItem(SUBCATEGORIES_KEY);
    return data ? JSON.parse(data) : defaultSubcategories;
  } catch {
    return defaultSubcategories;
  }
}

export function saveSubcategory(subcat) {
  const current = getSubcategories();
  let updated;
  if (subcat.id) {
    updated = current.map(s => s.id === subcat.id ? { ...s, ...subcat } : s);
  } else {
    const newSubcat = {
      id: Date.now(),
      name: subcat.name.trim(),
      category: subcat.category,
      code: subcat.code || `SUB-${Date.now().toString().slice(-4)}`,
      itemCount: 0
    };
    updated = [newSubcat, ...current];
  }
  localStorage.setItem(SUBCATEGORIES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('subcategoriesUpdated'));
  return updated;
}

export function deleteSubcategory(id) {
  const current = getSubcategories();
  const updated = current.filter(s => s.id !== Number(id));
  localStorage.setItem(SUBCATEGORIES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('subcategoriesUpdated'));
  return updated;
}

// -------------------------------------------------------------
// 2. PRODUCT VARIANTS STORE
// -------------------------------------------------------------
export const defaultVariants = [
  { id: 1, productName: "Rolex Submariner Date 41mm", sku: "KA-WAT-41-BLK", attributeType: "Dial Color", value: "Onyx Black", priceModifier: 0, stock: 8, status: "In Stock" },
  { id: 2, productName: "Rolex Submariner Date 41mm", sku: "KA-WAT-41-GRN", attributeType: "Dial Color", value: "Kermit Green", priceModifier: 25000, stock: 3, status: "Low Stock" },
  { id: 3, productName: "Rolex Submariner Date 41mm", sku: "KA-WAT-41-BLU", attributeType: "Dial Color", value: "Royal Blue", priceModifier: 15000, stock: 5, status: "In Stock" },
  { id: 4, productName: "Titan Grandmaster Automatic", sku: "KA-WAT-TIT-SLV", attributeType: "Strap Material", value: "Stainless Mesh", priceModifier: 0, stock: 12, status: "In Stock" },
  { id: 5, productName: "Titan Grandmaster Automatic", sku: "KA-WAT-TIT-LEA", attributeType: "Strap Material", value: "Italian Alligator Leather", priceModifier: 3500, stock: 7, status: "In Stock" },
  { id: 6, productName: "Nike Air Jordan 1 Retro High", sku: "KA-SH-AJ-09", attributeType: "Shoe Size", value: "UK 9 / US 10", priceModifier: 0, stock: 14, status: "In Stock" },
  { id: 7, productName: "Nike Air Jordan 1 Retro High", sku: "KA-SH-AJ-10", attributeType: "Shoe Size", value: "UK 10 / US 11", priceModifier: 0, stock: 2, status: "Low Stock" },
  { id: 8, productName: "Apple iPhone 16 Pro Max", sku: "KA-MOB-IP16-256", attributeType: "Storage", value: "256 GB - Desert Titanium", priceModifier: 0, stock: 9, status: "In Stock" },
  { id: 9, productName: "Apple iPhone 16 Pro Max", sku: "KA-MOB-IP16-512", attributeType: "Storage", value: "512 GB - Natural Titanium", priceModifier: 20000, stock: 4, status: "In Stock" }
];

export function getVariants() {
  try {
    const data = localStorage.getItem(VARIANTS_KEY);
    return data ? JSON.parse(data) : defaultVariants;
  } catch {
    return defaultVariants;
  }
}

export function saveVariant(variant) {
  const current = getVariants();
  let updated;
  if (variant.id) {
    updated = current.map(v => v.id === variant.id ? { ...v, ...variant } : v);
  } else {
    const newVariant = {
      id: Date.now(),
      productName: variant.productName,
      sku: variant.sku || `VAR-${Date.now().toString().slice(-4)}`,
      attributeType: variant.attributeType || "Attribute",
      value: variant.value,
      priceModifier: Number(variant.priceModifier) || 0,
      stock: Number(variant.stock) || 0,
      status: Number(variant.stock) > 3 ? "In Stock" : Number(variant.stock) > 0 ? "Low Stock" : "Out of Stock"
    };
    updated = [newVariant, ...current];
  }
  localStorage.setItem(VARIANTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('variantsUpdated'));
  return updated;
}

export function deleteVariant(id) {
  const current = getVariants();
  const updated = current.filter(v => v.id !== Number(id));
  localStorage.setItem(VARIANTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('variantsUpdated'));
  return updated;
}

// -------------------------------------------------------------
// 3. MEDIA ASSETS STORE
// -------------------------------------------------------------
export const defaultMediaAssets = [
  { id: 1, title: "Rolex Submariner Front View", category: "Watches", size: "1.8 MB", dimensions: "1200x1200", url: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800", date: "28 Aug 2026", usage: "Active on 4 products" },
  { id: 2, title: "Titan Grandmaster Dial Close-up", category: "Watches", size: "2.1 MB", dimensions: "1200x1200", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", date: "25 Aug 2026", usage: "Active on 2 products" },
  { id: 3, title: "Hidesign Pure Leather Tote", category: "Bags & Wallets", size: "1.4 MB", dimensions: "1080x1080", url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800", date: "22 Aug 2026", usage: "Active on 3 products" },
  { id: 4, title: "Nike Air Jordan High Studio", category: "Shoes", size: "2.6 MB", dimensions: "1500x1500", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", date: "20 Aug 2026", usage: "Active on 6 products" },
  { id: 5, title: "Apple iPhone 16 Pro Desert View", category: "Mobiles", size: "1.9 MB", dimensions: "1400x1400", url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800", date: "18 Aug 2026", usage: "Active on 1 product" },
  { id: 6, title: "Sony WH-1000XM5 Noise Cancelling", category: "Electronics", size: "2.3 MB", dimensions: "1200x1200", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", date: "15 Aug 2026", usage: "Active on 2 products" }
];

export function getMediaAssets() {
  try {
    const data = localStorage.getItem(MEDIA_KEY);
    return data ? JSON.parse(data) : defaultMediaAssets;
  } catch {
    return defaultMediaAssets;
  }
}

export function addMediaAsset(asset) {
  const current = getMediaAssets();
  const newAsset = {
    id: Date.now(),
    title: asset.title || "Catalog Asset",
    category: asset.category || "General",
    size: asset.size || "1.5 MB",
    dimensions: asset.dimensions || "1200x1200",
    url: asset.url,
    date: "Just now",
    usage: "Direct Media Link"
  };
  const updated = [newAsset, ...current];
  localStorage.setItem(MEDIA_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('mediaUpdated'));
  return updated;
}

export function deleteMediaAsset(id) {
  const current = getMediaAssets();
  const updated = current.filter(m => m.id !== Number(id));
  localStorage.setItem(MEDIA_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('mediaUpdated'));
  return updated;
}

// -------------------------------------------------------------
// 4. PROMOTIONS & MARKETING BANNERS STORE
// -------------------------------------------------------------
export const defaultPromotions = [
  { id: 1, title: "Grand Festive Luxury Showcase", code: "DIWALI2026", discount: "Up to 30% Off", targetCategory: "All Departments", bannerType: "Hero Banner", status: "Active", startDate: "01 Sep 2026", endDate: "30 Sep 2026", impressions: 14850, clicks: 3290 },
  { id: 2, title: "Swiss & Heritage Horology Fair", code: "CHRONO15", discount: "Flat 15% Off", targetCategory: "Watches", bannerType: "Category Strip", status: "Active", startDate: "15 Aug 2026", endDate: "15 Sep 2026", impressions: 8420, clicks: 1940 },
  { id: 3, title: "VIP Private Member Early Access", code: "VIPELITE", discount: "Extra ₹2,500 Off", targetCategory: "Luxury Goods", bannerType: "Modal Popover", status: "Active", startDate: "20 Aug 2026", endDate: "10 Oct 2026", impressions: 5120, clicks: 1480 },
  { id: 4, title: "End of Season Designer Clearance", code: "EOSR40", discount: "Flat 40% Off", targetCategory: "Clothes & Fashion", bannerType: "Flash Deal", status: "Scheduled", startDate: "01 Oct 2026", endDate: "15 Oct 2026", impressions: 0, clicks: 0 }
];

export function getPromotions() {
  try {
    const data = localStorage.getItem(PROMOTIONS_KEY);
    return data ? JSON.parse(data) : defaultPromotions;
  } catch {
    return defaultPromotions;
  }
}

export function savePromotion(promo) {
  const current = getPromotions();
  let updated;
  if (promo.id) {
    updated = current.map(p => p.id === promo.id ? { ...p, ...promo } : p);
  } else {
    const newPromo = {
      id: Date.now(),
      title: promo.title,
      code: promo.code?.toUpperCase() || `PROMO-${Date.now().toString().slice(-4)}`,
      discount: promo.discount || "10% Off",
      targetCategory: promo.targetCategory || "All",
      bannerType: promo.bannerType || "Hero Banner",
      status: promo.status || "Active",
      startDate: promo.startDate || "Today",
      endDate: promo.endDate || "30 Days Later",
      impressions: 0,
      clicks: 0
    };
    updated = [newPromo, ...current];
  }
  localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('promotionsUpdated'));
  return updated;
}

export function deletePromotion(id) {
  const current = getPromotions();
  const updated = current.filter(p => p.id !== Number(id));
  localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('promotionsUpdated'));
  return updated;
}

// -------------------------------------------------------------
// 5. ROLES & PERMISSIONS MATRIX STORE
// -------------------------------------------------------------
export const defaultRoles = [
  { id: 1, name: "Super Administrator", slug: "super_admin", membersCount: 2, description: "Full unrestricted platform access, financial settlements, role assignments, and system config.", color: "border-amber-500 text-amber-600 bg-amber-50" },
  { id: 2, name: "Catalog Director", slug: "catalog_manager", membersCount: 3, description: "Manage products, subcategories, brands, imagery, pricing, and supplier catalog reviews.", color: "border-blue-500 text-blue-600 bg-blue-50" },
  { id: 3, name: "Operations & Logistics Lead", slug: "operations_lead", membersCount: 4, description: "Process orders, assign courier carriers, generate shipping manifests, and manage warehouse stock.", color: "border-emerald-500 text-emerald-600 bg-emerald-50" },
  { id: 4, name: "Financial Controller", slug: "finance_auditor", membersCount: 2, description: "View GMV, process customer refunds, manage payments gateway ledger, and tax auditing.", color: "border-purple-500 text-purple-600 bg-purple-50" },
  { id: 5, name: "Customer Concierge Officer", slug: "support_agent", membersCount: 5, description: "Handle customer inquiries, review return requests, inspect returns, and manage user accounts.", color: "border-rose-500 text-rose-600 bg-rose-50" }
];

export const defaultPermissionsMatrix = {
  super_admin: { dashboard: "Full", catalog: "Full", commerce: "Full", people: "Full", operations: "Full", analytics: "Full", system: "Full" },
  catalog_manager: { dashboard: "Read", catalog: "Full", commerce: "Read", people: "Read", operations: "Write", analytics: "Read", system: "None" },
  operations_lead: { dashboard: "Read", catalog: "Read", commerce: "Write", people: "Read", operations: "Full", analytics: "Read", system: "None" },
  finance_auditor: { dashboard: "Read", catalog: "Read", commerce: "Full", people: "Read", operations: "Read", analytics: "Full", system: "Read" },
  support_agent: { dashboard: "Read", catalog: "Read", commerce: "Write", people: "Write", operations: "Read", analytics: "None", system: "None" }
};

export function getRoles() {
  try {
    const data = localStorage.getItem(ROLES_KEY);
    return data ? JSON.parse(data) : defaultRoles;
  } catch {
    return defaultRoles;
  }
}

export function saveRole(role) {
  const current = getRoles();
  let updated;
  if (role.id) {
    updated = current.map(r => r.id === role.id ? { ...r, ...role } : r);
  } else {
    const newRole = {
      id: Date.now(),
      name: role.name,
      slug: role.name.toLowerCase().replace(/\s+/g, '_'),
      membersCount: Number(role.membersCount) || 1,
      description: role.description || "Custom assigned role",
      color: "border-slate-500 text-slate-700 bg-slate-50"
    };
    updated = [...current, newRole];
  }
  localStorage.setItem(ROLES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('rolesUpdated'));
  return updated;
}

export function getPermissionsMatrix() {
  try {
    const data = localStorage.getItem(PERMISSIONS_KEY);
    return data ? JSON.parse(data) : defaultPermissionsMatrix;
  } catch {
    return defaultPermissionsMatrix;
  }
}

export function updateRolePermission(roleSlug, moduleName, level) {
  const matrix = getPermissionsMatrix();
  const updated = {
    ...matrix,
    [roleSlug]: {
      ...(matrix[roleSlug] || {}),
      [moduleName]: level
    }
  };
  localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('permissionsUpdated'));
  return updated;
}

// -------------------------------------------------------------
// 6. SHIPPING CARRIERS & MANIFEST STORE
// -------------------------------------------------------------
export const defaultShippingCarriers = [
  { id: 1, name: "BlueDart Express Air", code: "BLUEDART", serviceType: "Priority Express", avgTransit: "24-48 Hours", trackingUrl: "https://www.bluedart.com/tracking?track=", active: true, shipmentsHandled: 142, rating: 4.9 },
  { id: 2, name: "Delhivery Surface & Air", code: "DELHIVERY", serviceType: "Secured Parcel", avgTransit: "2-4 Days", trackingUrl: "https://www.delhivery.com/track/package/", active: true, shipmentsHandled: 98, rating: 4.7 },
  { id: 3, name: "FedEx Luxury Secure", code: "FEDEX", serviceType: "Armored High-Value", avgTransit: "24-36 Hours", trackingUrl: "https://www.fedex.com/fedextrack/?trknbr=", active: true, shipmentsHandled: 45, rating: 5.0 },
  { id: 4, name: "DTDC Prime Gold", code: "DTDC", serviceType: "Express Cargo", avgTransit: "3-5 Days", trackingUrl: "https://tracking.dtdc.com/ct/track.html?trk=", active: false, shipmentsHandled: 18, rating: 4.3 }
];

export function getShippingCarriers() {
  try {
    const data = localStorage.getItem(SHIPPING_KEY);
    return data ? JSON.parse(data) : defaultShippingCarriers;
  } catch {
    return defaultShippingCarriers;
  }
}

export function toggleCarrierStatus(id) {
  const current = getShippingCarriers();
  const updated = current.map(c => c.id === Number(id) ? { ...c, active: !c.active } : c);
  localStorage.setItem(SHIPPING_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('shippingUpdated'));
  return updated;
}

// -------------------------------------------------------------
// 7. SYSTEM CONFIG & BACKUP ENGINE
// -------------------------------------------------------------
export const defaultSystemConfig = {
  storeName: "Krishna Accessories",
  legalEntity: "Krishna Luxury Goods Private Limited",
  supportEmail: "concierge@krishnaaccessories.com",
  supportPhone: "+91 (079) 4000-5500",
  currency: "INR (₹)",
  freeShippingThreshold: 2000,
  taxGSTRate: 18,
  orderPrefix: "KA-ORD-",
  twoFactorAuth: true,
  sessionTimeoutMinutes: 60,
  passwordPolicy: "Strong (Min 8 chars, Numbers & Symbols)",
  maintenanceMode: false,
  razorpayLiveMode: true,
  smtpMailerStatus: "Connected (smtp.sendgrid.net)",
  smsGatewayStatus: "Active (Twilio India SMS)",
  lastBackupDate: "Today at 04:30 AM"
};

export function getSystemConfig() {
  try {
    const data = localStorage.getItem(SYSTEM_CONFIG_KEY);
    return data ? JSON.parse(data) : defaultSystemConfig;
  } catch {
    return defaultSystemConfig;
  }
}

export function saveSystemConfig(cfg) {
  const updated = { ...getSystemConfig(), ...cfg };
  localStorage.setItem(SYSTEM_CONFIG_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('systemConfigUpdated'));
  return updated;
}

// Database Export / Import Backup JSON
export function exportFullDatabaseBackup() {
  const backup = {
    exportTimestamp: new Date().toISOString(),
    version: "2.4.0",
    appName: "Krishna Accessories",
    storageKeys: {}
  };

  const keysToBackup = [
    'krishna_admin_products',
    'krishna_categories',
    'krishna_brands',
    'krishna_platform_orders',
    'krishna_platform_suppliers',
    'krishna_platform_users',
    'krishna_platform_notifications',
    'krishna_subcategories',
    'krishna_product_variants',
    'krishna_media_assets',
    'krishna_promotions',
    'krishna_roles',
    'krishna_permissions_matrix',
    'krishna_shipping_carriers',
    'krishna_system_config'
  ];

  keysToBackup.forEach(k => {
    try {
      backup.storageKeys[k] = JSON.parse(localStorage.getItem(k) || 'null');
    } catch {
      backup.storageKeys[k] = localStorage.getItem(k);
    }
  });

  return JSON.stringify(backup, null, 2);
}

export function restoreDatabaseBackup(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!data.storageKeys) throw new Error("Invalid backup format");

    Object.entries(data.storageKeys).forEach(([k, val]) => {
      if (val !== null && val !== undefined) {
        localStorage.setItem(k, typeof val === 'object' ? JSON.stringify(val) : String(val));
      }
    });

    window.dispatchEvent(new Event('productsUpdated'));
    window.dispatchEvent(new Event('categoriesUpdated'));
    window.dispatchEvent(new Event('brandsUpdated'));
    window.dispatchEvent(new Event('ordersUpdated'));
    window.dispatchEvent(new Event('suppliersUpdated'));
    window.dispatchEvent(new Event('usersUpdated'));
    window.dispatchEvent(new Event('notificationsUpdated'));
    window.dispatchEvent(new Event('subcategoriesUpdated'));
    window.dispatchEvent(new Event('variantsUpdated'));
    window.dispatchEvent(new Event('mediaUpdated'));
    window.dispatchEvent(new Event('promotionsUpdated'));
    window.dispatchEvent(new Event('rolesUpdated'));
    window.dispatchEvent(new Event('shippingUpdated'));
    window.dispatchEvent(new Event('systemConfigUpdated'));

    return { success: true, message: "Database restored successfully!" };
  } catch (err) {
    return { success: false, message: err.message || "Failed to restore backup" };
  }
}
