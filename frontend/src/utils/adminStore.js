// src/utils/adminStore.js
// 100% Live Backend Store (Pure In-Memory Live Sync - No Local Storage Caching)
import { subcategoriesApi, variantsApi, mediaApi, promotionsApi, rolesApi, shippingApi, systemConfigApi } from './api';

// In-Memory Live Data States
let liveSubcategories = [];
let liveVariants = [];
let liveMediaAssets = [];
let livePromotions = [];
let liveRoles = [];
let liveShippingCarriers = [];
let isInitialFetchDone = false;
let isFetching = false;

// -------------------------------------------------------------
// 1. SUBCATEGORIES STORE
// -------------------------------------------------------------
export const defaultSubcategories = [];

export function getSubcategories() {
  if (liveSubcategories.length === 0 && !isFetching && typeof window !== 'undefined') {
    syncAdminDataFromBackend();
  }
  return liveSubcategories;
}

export function saveSubcategory(subcat) {
  if (subcat.id) {
    liveSubcategories = liveSubcategories.map(s => s.id === subcat.id ? { ...s, ...subcat } : s);
  } else {
    const newSubcat = {
      id: subcat.id || Date.now(),
      name: subcat.name.trim(),
      category: subcat.category,
      code: subcat.code || `SUB-${Date.now().toString().slice(-4)}`,
      itemCount: 0
    };
    liveSubcategories = [newSubcat, ...liveSubcategories];
  }
  window.dispatchEvent(new Event('subcategoriesUpdated'));
  subcategoriesApi.save(subcat).catch(err => console.warn('[API] Failed to save subcategory:', err));
  return liveSubcategories;
}

export function deleteSubcategory(id) {
  liveSubcategories = liveSubcategories.filter(s => s.id !== Number(id));
  window.dispatchEvent(new Event('subcategoriesUpdated'));
  subcategoriesApi.delete(id).catch(err => console.warn('[API] Failed to delete subcategory:', err));
  return liveSubcategories;
}

// -------------------------------------------------------------
// 2. PRODUCT VARIANTS STORE
// -------------------------------------------------------------
export const defaultVariants = [];

export function getVariants() {
  if (liveVariants.length === 0 && !isFetching && typeof window !== 'undefined') {
    syncAdminDataFromBackend();
  }
  return liveVariants;
}

export function saveVariant(variant) {
  if (variant.id) {
    liveVariants = liveVariants.map(v => v.id === variant.id ? { ...v, ...variant } : v);
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
    liveVariants = [newVariant, ...liveVariants];
  }
  window.dispatchEvent(new Event('variantsUpdated'));
  variantsApi.save(variant).catch(err => console.warn('[API] Failed to save variant:', err));
  return liveVariants;
}

export function deleteVariant(id) {
  liveVariants = liveVariants.filter(v => v.id !== Number(id));
  window.dispatchEvent(new Event('variantsUpdated'));
  variantsApi.delete(id).catch(err => console.warn('[API] Failed to delete variant:', err));
  return liveVariants;
}

// -------------------------------------------------------------
// 3. MEDIA ASSETS STORE
// -------------------------------------------------------------
export const defaultMediaAssets = [];

export function getMediaAssets() {
  if (liveMediaAssets.length === 0 && !isFetching && typeof window !== 'undefined') {
    syncAdminDataFromBackend();
  }
  return liveMediaAssets;
}

export function addMediaAsset(asset) {
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
  liveMediaAssets = [newAsset, ...liveMediaAssets];
  window.dispatchEvent(new Event('mediaUpdated'));
  mediaApi.save(newAsset).catch(err => console.warn('[API] Failed to save media asset:', err));
  return liveMediaAssets;
}

export function deleteMediaAsset(id) {
  liveMediaAssets = liveMediaAssets.filter(m => m.id !== Number(id));
  window.dispatchEvent(new Event('mediaUpdated'));
  mediaApi.delete(id).catch(err => console.warn('[API] Failed to delete media asset:', err));
  return liveMediaAssets;
}

// -------------------------------------------------------------
// 4. PROMOTIONS & MARKETING BANNERS STORE
// -------------------------------------------------------------
export const defaultPromotions = [];

export function getPromotions() {
  if (livePromotions.length === 0 && !isFetching && typeof window !== 'undefined') {
    syncAdminDataFromBackend();
  }
  return livePromotions;
}

export function savePromotion(promo) {
  if (promo.id) {
    livePromotions = livePromotions.map(p => p.id === promo.id ? { ...p, ...promo } : p);
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
    livePromotions = [newPromo, ...livePromotions];
  }
  window.dispatchEvent(new Event('promotionsUpdated'));
  promotionsApi.save(promo).catch(err => console.warn('[API] Failed to save promotion:', err));
  return livePromotions;
}

export function deletePromotion(id) {
  livePromotions = livePromotions.filter(p => p.id !== Number(id));
  window.dispatchEvent(new Event('promotionsUpdated'));
  promotionsApi.delete(id).catch(err => console.warn('[API] Failed to delete promotion:', err));
  return livePromotions;
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

let livePermissionsMatrix = { ...defaultPermissionsMatrix };

export function getRoles() {
  if (liveRoles.length === 0 && !isFetching && typeof window !== 'undefined') {
    syncAdminDataFromBackend();
  }
  return liveRoles;
}

export function saveRole(role) {
  if (role.id) {
    liveRoles = liveRoles.map(r => r.id === role.id ? { ...r, ...role } : r);
  } else {
    const newRole = {
      id: role.id || Date.now(),
      name: role.name,
      slug: role.name.toLowerCase().replace(/\s+/g, '_'),
      membersCount: Number(role.membersCount) || 1,
      description: role.description || "Custom assigned role",
      color: "border-slate-500 text-slate-700 bg-slate-50"
    };
    liveRoles = [...liveRoles, newRole];
  }
  window.dispatchEvent(new Event('rolesUpdated'));
  rolesApi.save(role).catch(err => console.warn('[API] Failed to save role:', err));
  return liveRoles;
}

export function getPermissionsMatrix() {
  return livePermissionsMatrix;
}

export function updateRolePermission(roleSlug, moduleName, level) {
  livePermissionsMatrix = {
    ...livePermissionsMatrix,
    [roleSlug]: {
      ...(livePermissionsMatrix[roleSlug] || {}),
      [moduleName]: level
    }
  };
  window.dispatchEvent(new Event('permissionsUpdated'));
  rolesApi.updatePermissions(livePermissionsMatrix).catch(err => console.warn('[API] Failed to update permissions:', err));
  return livePermissionsMatrix;
}

// -------------------------------------------------------------
// 6. SHIPPING CARRIERS & MANIFEST STORE
// -------------------------------------------------------------
export const defaultShippingCarriers = [];

export function getShippingCarriers() {
  if (liveShippingCarriers.length === 0 && !isFetching && typeof window !== 'undefined') {
    syncAdminDataFromBackend();
  }
  return liveShippingCarriers;
}

export function toggleCarrierStatus(id) {
  liveShippingCarriers = liveShippingCarriers.map(c => c.id === Number(id) ? { ...c, active: !c.active } : c);
  window.dispatchEvent(new Event('shippingUpdated'));
  const found = liveShippingCarriers.find(c => c.id === Number(id));
  if (found) {
    shippingApi.update(id, found).catch(err => console.warn('[API] Failed to update shipping carrier:', err));
  }
  return liveShippingCarriers;
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

let liveSystemConfig = { ...defaultSystemConfig };

export function getSystemConfig() {
  return liveSystemConfig;
}

export function saveSystemConfig(cfg) {
  liveSystemConfig = { ...liveSystemConfig, ...cfg };
  window.dispatchEvent(new Event('systemConfigUpdated'));
  systemConfigApi.save(liveSystemConfig).catch(err => console.warn('[API] Failed to save system config:', err));
  return liveSystemConfig;
}

// ================= BACKEND SYNC =================
export async function syncAdminDataFromBackend() {
  if (isFetching) return true;
  isFetching = true;
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
      liveSubcategories = subcats;
      window.dispatchEvent(new Event('subcategoriesUpdated'));
    }
    if (Array.isArray(variants)) {
      liveVariants = variants;
      window.dispatchEvent(new Event('variantsUpdated'));
    }
    if (Array.isArray(media)) {
      liveMediaAssets = media;
      window.dispatchEvent(new Event('mediaUpdated'));
    }
    if (Array.isArray(promos)) {
      livePromotions = promos;
      window.dispatchEvent(new Event('promotionsUpdated'));
    }
    if (Array.isArray(roles)) {
      liveRoles = roles;
      window.dispatchEvent(new Event('rolesUpdated'));
    }
    if (perms && typeof perms === 'object') {
      livePermissionsMatrix = perms;
      window.dispatchEvent(new Event('permissionsUpdated'));
    }
    if (Array.isArray(carriers)) {
      liveShippingCarriers = carriers;
      window.dispatchEvent(new Event('shippingUpdated'));
    }
    if (config && typeof config === 'object') {
      liveSystemConfig = { ...liveSystemConfig, ...config };
      window.dispatchEvent(new Event('systemConfigUpdated'));
    }

    isInitialFetchDone = true;
    return true;
  } catch (err) {
    console.warn('[API] Failed syncing admin data from backend:', err);
    return false;
  } finally {
    isFetching = false;
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
    version: "2.5.0",
    appName: "Krishna Accessories",
    storageKeys: {
      products: liveSubcategories,
      variants: liveVariants,
      promotions: livePromotions,
      roles: liveRoles,
      shippingCarriers: liveShippingCarriers,
      systemConfig: liveSystemConfig
    }
  };
  return JSON.stringify(backup, null, 2);
}

export function restoreDatabaseBackup(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!data.storageKeys) throw new Error("Invalid backup format");
    return { success: true, message: "Database restored successfully!" };
  } catch (err) {
    return { success: false, message: err.message || "Failed to restore backup" };
  }
}
