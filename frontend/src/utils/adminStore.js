// src/utils/adminStore.js
// Specialized store utilities for Krishna Accessories Advanced Admin Panel
import { subcategoriesApi, variantsApi, mediaApi, promotionsApi, rolesApi, shippingApi, systemConfigApi } from './api';

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
export const defaultSubcategories = [];

export function getSubcategories() {
  try {
    const data = localStorage.getItem(SUBCATEGORIES_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('[Store] Error reading subcategories:', e);
  }

  if (typeof window !== 'undefined') {
    syncAdminDataFromBackend();
  }
  return defaultSubcategories;
}

export function saveSubcategory(subcat) {
  const current = getSubcategories();
  let updated;
  if (subcat.id) {
    updated = current.map(s => s.id === subcat.id ? { ...s, ...subcat } : s);
  } else {
    const newSubcat = {
      id: subcat.id || Date.now(),
      name: subcat.name.trim(),
      category: subcat.category,
      code: subcat.code || `SUB-${Date.now().toString().slice(-4)}`,
      itemCount: 0
    };
    updated = [newSubcat, ...current];
  }
  localStorage.setItem(SUBCATEGORIES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('subcategoriesUpdated'));
  subcategoriesApi.save(subcat).catch(err => console.warn('[API] Failed to save subcategory:', err));
  return updated;
}

export function deleteSubcategory(id) {
  const current = getSubcategories();
  const updated = current.filter(s => s.id !== Number(id));
  localStorage.setItem(SUBCATEGORIES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('subcategoriesUpdated'));
  subcategoriesApi.delete(id).catch(err => console.warn('[API] Failed to delete subcategory:', err));
  return updated;
}

// -------------------------------------------------------------
// 2. PRODUCT VARIANTS STORE
// -------------------------------------------------------------
export const defaultVariants = [];

export function getVariants() {
  try {
    const data = localStorage.getItem(VARIANTS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('[Store] Error reading variants:', e);
  }

  if (typeof window !== 'undefined') {
    syncAdminDataFromBackend();
  }
  return defaultVariants;
}

export function saveVariant(variant) {
  const current = getVariants();
  let updated;
  if (variant.id) {
    updated = current.map(v => v.id === variant.id ? { ...v, ...variant } : v);
  } else {
    const newVariant = {
      id: variant.id || Date.now(),
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
  variantsApi.save(variant).catch(err => console.warn('[API] Failed to save variant:', err));
  return updated;
}

export function deleteVariant(id) {
  const current = getVariants();
  const updated = current.filter(v => v.id !== Number(id));
  localStorage.setItem(VARIANTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('variantsUpdated'));
  variantsApi.delete(id).catch(err => console.warn('[API] Failed to delete variant:', err));
  return updated;
}

// -------------------------------------------------------------
// 3. MEDIA ASSETS STORE
// -------------------------------------------------------------
export const defaultMediaAssets = [];

export function getMediaAssets() {
  try {
    const data = localStorage.getItem(MEDIA_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('[Store] Error reading media assets:', e);
  }

  if (typeof window !== 'undefined') {
    syncAdminDataFromBackend();
  }
  return defaultMediaAssets;
}

export function addMediaAsset(asset) {
  const current = getMediaAssets();
  const newAsset = {
    id: asset.id || Date.now(),
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
  mediaApi.save(newAsset).catch(err => console.warn('[API] Failed to save media asset:', err));
  return updated;
}

export function deleteMediaAsset(id) {
  const current = getMediaAssets();
  const updated = current.filter(m => m.id !== Number(id));
  localStorage.setItem(MEDIA_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('mediaUpdated'));
  mediaApi.delete(id).catch(err => console.warn('[API] Failed to delete media asset:', err));
  return updated;
}

// -------------------------------------------------------------
// 4. PROMOTIONS & MARKETING BANNERS STORE
// -------------------------------------------------------------
export const defaultPromotions = [];

export function getPromotions() {
  try {
    const data = localStorage.getItem(PROMOTIONS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('[Store] Error reading promotions:', e);
  }

  if (typeof window !== 'undefined') {
    syncAdminDataFromBackend();
  }
  return defaultPromotions;
}

export function savePromotion(promo) {
  const current = getPromotions();
  let updated;
  if (promo.id) {
    updated = current.map(p => p.id === promo.id ? { ...p, ...promo } : p);
  } else {
    const newPromo = {
      id: promo.id || Date.now(),
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
  promotionsApi.save(promo).catch(err => console.warn('[API] Failed to save promotion:', err));
  return updated;
}

export function deletePromotion(id) {
  const current = getPromotions();
  const updated = current.filter(p => p.id !== Number(id));
  localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('promotionsUpdated'));
  promotionsApi.delete(id).catch(err => console.warn('[API] Failed to delete promotion:', err));
  return updated;
}

// -------------------------------------------------------------
// 5. ROLES & PERMISSIONS MATRIX STORE
// -------------------------------------------------------------
export const defaultRoles = [];

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
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('[Store] Error reading roles:', e);
  }

  if (typeof window !== 'undefined') {
    syncAdminDataFromBackend();
  }
  return defaultRoles;
}

export function saveRole(role) {
  const current = getRoles();
  let updated;
  if (role.id) {
    updated = current.map(r => r.id === role.id ? { ...r, ...role } : r);
  } else {
    const newRole = {
      id: role.id || Date.now(),
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
  rolesApi.save(role).catch(err => console.warn('[API] Failed to save role:', err));
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
  rolesApi.updatePermissions(updated).catch(err => console.warn('[API] Failed to update permissions:', err));
  return updated;
}

// -------------------------------------------------------------
// 6. SHIPPING CARRIERS & MANIFEST STORE
// -------------------------------------------------------------
export const defaultShippingCarriers = [];

export function getShippingCarriers() {
  try {
    const data = localStorage.getItem(SHIPPING_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('[Store] Error reading shipping carriers:', e);
  }

  if (typeof window !== 'undefined') {
    syncAdminDataFromBackend();
  }
  return defaultShippingCarriers;
}

export function toggleCarrierStatus(id) {
  const current = getShippingCarriers();
  const updated = current.map(c => c.id === Number(id) ? { ...c, active: !c.active } : c);
  localStorage.setItem(SHIPPING_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('shippingUpdated'));
  const found = updated.find(c => c.id === Number(id));
  if (found) {
    shippingApi.update(id, found).catch(err => console.warn('[API] Failed to update shipping carrier:', err));
  }
  return updated;
}

// -------------------------------------------------------------
// 7. SYSTEM CONFIG & BACKUP ENGINE
// -------------------------------------------------------------
export const defaultSystemConfig = {
  storeName: "Krishna Accessories",
  legalEntity: "Krishna Luxury Goods Private Limited",
  supportEmail: "shantilal6186@gmail.com",
  supportPhone: "+91 93213 22761",
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
  systemConfigApi.save(updated).catch(err => console.warn('[API] Failed to save system config:', err));
  return updated;
}

// ================= BACKEND SYNC =================
export async function syncAdminDataFromBackend() {
  try {
    const [subcats, variants, media, promos, roles, perms, carriers, config] = await Promise.all([
      subcategoriesApi.getAll().catch(() => null),
      variantsApi.getAll().catch(() => null),
      mediaApi.getAll().catch(() => null),
      promotionsApi.getAll().catch(() => null),
      rolesApi.getAll().catch(() => null),
      rolesApi.getPermissions().catch(() => null),
      shippingApi.getAll().catch(() => null),
      systemConfigApi.get().catch(() => null)
    ]);

    if (Array.isArray(subcats)) {
      localStorage.setItem(SUBCATEGORIES_KEY, JSON.stringify(subcats));
      window.dispatchEvent(new Event('subcategoriesUpdated'));
    }
    if (Array.isArray(variants)) {
      localStorage.setItem(VARIANTS_KEY, JSON.stringify(variants));
      window.dispatchEvent(new Event('variantsUpdated'));
    }
    if (Array.isArray(media)) {
      localStorage.setItem(MEDIA_KEY, JSON.stringify(media));
      window.dispatchEvent(new Event('mediaUpdated'));
    }
    if (Array.isArray(promos)) {
      localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(promos));
      window.dispatchEvent(new Event('promotionsUpdated'));
    }
    if (Array.isArray(roles)) {
      localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
      window.dispatchEvent(new Event('rolesUpdated'));
    }
    if (perms && typeof perms === 'object') {
      localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(perms));
      window.dispatchEvent(new Event('permissionsUpdated'));
    }
    if (Array.isArray(carriers)) {
      localStorage.setItem(SHIPPING_KEY, JSON.stringify(carriers));
      window.dispatchEvent(new Event('shippingUpdated'));
    }
    if (config && typeof config === 'object') {
      localStorage.setItem(SYSTEM_CONFIG_KEY, JSON.stringify(config));
      window.dispatchEvent(new Event('systemConfigUpdated'));
    }

    return true;
  } catch (err) {
    console.warn('[API] Failed syncing admin data from backend:', err);
    return false;
  }
}

// Auto-trigger sync on load in browser
if (typeof window !== 'undefined') {
  syncAdminDataFromBackend();
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
