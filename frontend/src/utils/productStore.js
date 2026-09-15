// src/utils/productStore.js
// 100% Live Backend Store (Pure In-Memory Live Sync - No Local Storage Caching)
import { productsApi, categoriesApi, brandsApi } from './api';

// In-Memory Live Data States
let liveProducts = [];
let liveCategories = [];
let liveBrands = [];
let isInitialFetchDone = false;
let isFetching = false;

// Purge all legacy data keys from localStorage so Chrome DevTools Local Storage is 100% clean
export function purgeAllLocalData() {
  if (typeof window === 'undefined') return;
  try {
    const keysToRemove = [
      'krishna_db_version',
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
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.warn('Error purging local storage keys:', e);
  }
}

if (typeof window !== 'undefined') {
  purgeAllLocalData();
}

const DEFAULT_SIZES_BY_CATEGORY = {
  Watches: ["One Size"],
  "Bags & Wallets": ["Small", "Medium", "Large"],
  Shoes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
  Mobiles: ["128 GB", "256 GB", "512 GB"],
  "Clothes & Fashion": ["S", "M", "L", "XL"],
  Laptops: ["8 GB / 512 GB", "16 GB / 512 GB", "16 GB / 1 TB"],
  Electronics: ["Standard"],
  "Smart Gadgets": ["Standard"],
  Gaming: ["Standard"],
  Fitness: ["One Size"],
  "Fashion Accessories": ["Standard", "Large"],
};

const DEFAULT_ANGLE_LABELS = ["Front View", "Side Profile", "Back View", "Detail View"];

function withImageQuery(url, crop) {
  if (!url) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}fit=crop&crop=${crop}`;
}

export function normalizeProduct(product) {
  if (!product) return null;
  const sourceImages = Array.isArray(product.images) && product.images.length
    ? product.images.filter(Boolean)
    : [product.image].filter(Boolean);
  const baseImage = sourceImages[0] || product.image || "";
  const images = [...sourceImages];
  ["center", "right", "left", "top"].forEach((crop) => {
    if (images.length < 4 && baseImage) images.push(withImageQuery(baseImage, crop));
  });
  const colors = Array.isArray(product.colors) && product.colors.length ? product.colors : ["Standard"];
  const variants = Array.isArray(product.variants) && product.variants.length ? product.variants : ["Standard"];
  const sizes = Array.isArray(product.sizes) && product.sizes.length
    ? product.sizes
    : (DEFAULT_SIZES_BY_CATEGORY[product.category] || ["Standard"]);
  const colorImages = { ...(product.colorImages || {}) };
  colors.forEach((color, index) => {
    if (!colorImages[color]) colorImages[color] = images[index % Math.max(images.length, 1)] || baseImage;
  });
  const variantPriceDeltas = { ...(product.variantPriceDeltas || {}) };
  variants.forEach((variant) => {
    if (variantPriceDeltas[variant] === undefined) variantPriceDeltas[variant] = 0;
  });

  return {
    ...product,
    image: baseImage,
    images: images.length > 0 ? images : [baseImage].filter(Boolean),
    imageAngles: product.imageAngles?.length === 4 ? product.imageAngles : DEFAULT_ANGLE_LABELS,
    colors,
    sizes,
    variants,
    colorImages,
    variantPriceDeltas,
    variationStock: { ...(product.variationStock || {}) },
  };
}

export const defaultCategories = [
  "Watches",
  "Bags & Wallets",
  "Shoes",
  "Mobiles",
  "Clothes & Fashion",
  "Laptops",
  "Electronics",
  "Smart Gadgets",
  "Gaming",
  "Fitness",
  "Fashion Accessories",
];

export const defaultBrands = [];
export const categoryBrandMap = {};
export const WATCH_TYPES = [];
export const WATCH_TYPE_METADATA = {};
export const defaultProducts = [];

export function getWatchTypes() {
  return [];
}

export function getProducts() {
  if (!isInitialFetchDone && !isFetching && typeof window !== 'undefined') {
    syncProductsFromBackend();
  }
  return liveProducts;
}

export const getStoredProducts = getProducts;

export function getProductById(id) {
  if (!id) return null;
  return liveProducts.find(p => Number(p.id) === Number(id)) || null;
}

export function saveProduct(product) {
  const isExisting = product.id && liveProducts.some(p => Number(p.id) === Number(product.id));
  const normalized = normalizeProduct(product);

  if (isExisting) {
    liveProducts = liveProducts.map(p => Number(p.id) === Number(product.id) ? { ...p, ...normalized } : p);
  } else {
    liveProducts = [{ ...normalized, id: normalized.id || Date.now() }, ...liveProducts];
  }
  window.dispatchEvent(new Event('productsUpdated'));

  // Sync directly with Live FastAPI Backend
  if (isExisting) {
    productsApi.update(product.id, product).catch(err => console.warn('[API] Failed to update product in backend:', err));
  } else {
    productsApi.create(product).then(res => {
      if (res?.id) {
        liveProducts = liveProducts.map(p => p.id === normalized.id ? { ...p, id: res.id } : p);
        window.dispatchEvent(new Event('productsUpdated'));
      }
    }).catch(err => console.warn('[API] Failed to create product in backend:', err));
  }

  return liveProducts;
}

export function addStoreProduct(product) {
  return saveProduct(product);
}

export function updateStoreProduct(id, updatedProduct) {
  return saveProduct({ ...updatedProduct, id: Number(id) });
}

export function deleteProduct(id) {
  liveProducts = liveProducts.filter(p => Number(p.id) !== Number(id));
  window.dispatchEvent(new Event('productsUpdated'));

  // Sync directly with Live FastAPI Backend
  productsApi.delete(id).catch(err => console.warn('[API] Failed to delete product in backend:', err));

  return liveProducts;
}

export const deleteStoreProduct = deleteProduct;

// ================= CATEGORIES MANAGEMENT =================

export function getCategories() {
  if (liveCategories.length === 0 && !isFetching && typeof window !== 'undefined') {
    syncProductsFromBackend();
  }
  return liveCategories.length > 0 ? liveCategories : defaultCategories;
}

export function addCategory(category) {
  const trimmed = category.trim();
  if (trimmed && !liveCategories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
    liveCategories = [...liveCategories, trimmed];
    window.dispatchEvent(new Event('categoriesUpdated'));
    categoriesApi.create(trimmed).catch(err => console.warn('[API] Failed to add category to backend:', err));
  }
  return liveCategories;
}

export function deleteCategory(category) {
  liveCategories = liveCategories.filter(item => item !== category);
  window.dispatchEvent(new Event('categoriesUpdated'));
  categoriesApi.delete(category).catch(err => console.warn('[API] Failed to delete category from backend:', err));
  return liveCategories;
}

// ================= BRANDS MANAGEMENT =================

export function getBrands() {
  if (liveBrands.length === 0) {
    const fromProds = Array.from(new Set(liveProducts.map(p => p.brand).filter(Boolean)));
    if (fromProds.length > 0) return fromProds;
  }
  return liveBrands;
}

export function addBrand(brand, category = "Watches") {
  const trimmed = brand.trim();
  if (trimmed && !liveBrands.some(b => (typeof b === 'string' ? b : b.name).toLowerCase() === trimmed.toLowerCase())) {
    liveBrands = [...liveBrands, trimmed];
    window.dispatchEvent(new Event('brandsUpdated'));
    brandsApi.create(trimmed, category).catch(err => console.warn('[API] Failed to add brand to backend:', err));
  }
  return liveBrands;
}

export function deleteBrand(brand) {
  const brandName = typeof brand === 'string' ? brand : brand.name;
  liveBrands = liveBrands.filter(item => (typeof item === 'string' ? item : item.name) !== brandName);
  window.dispatchEvent(new Event('brandsUpdated'));
  brandsApi.delete(brandName).catch(err => console.warn('[API] Failed to delete brand from backend:', err));
  return liveBrands;
}

// ================= BACKEND SYNC =================
export async function syncProductsFromBackend() {
  if (isFetching) return liveProducts;
  isFetching = true;
  try {
    const [fetchedProducts, fetchedCategories, fetchedBrands] = await Promise.all([
      productsApi.getAll().catch(e => { console.warn('[API] Products fetch failed:', e); return null; }),
      categoriesApi.getAll().catch(e => { console.warn('[API] Categories fetch failed:', e); return null; }),
      brandsApi.getAll().catch(e => { console.warn('[API] Brands fetch failed:', e); return null; })
    ]);

    let updated = false;

    if (Array.isArray(fetchedProducts)) {
      liveProducts = fetchedProducts.map(normalizeProduct).filter(Boolean);
      window.dispatchEvent(new Event('productsUpdated'));
      updated = true;
    }

    if (Array.isArray(fetchedCategories) && fetchedCategories.length > 0) {
      liveCategories = fetchedCategories;
      window.dispatchEvent(new Event('categoriesUpdated'));
      updated = true;
    }

    if (Array.isArray(fetchedBrands) && fetchedBrands.length > 0) {
      liveBrands = fetchedBrands.map(b => (typeof b === 'object' ? b.name : b));
      window.dispatchEvent(new Event('brandsUpdated'));
      updated = true;
    }

    isInitialFetchDone = true;
    return liveProducts;
  } catch (err) {
    console.warn('[API] Failed syncing products from backend:', err);
    return liveProducts;
  } finally {
    isFetching = false;
  }
}

// Auto-trigger sync on load in browser
if (typeof window !== 'undefined') {
  syncProductsFromBackend();
}

// Dynamic brand finder for specific category
export function getBrandsByCategory(categoryName) {
  if (!categoryName || categoryName === 'All') {
    const all = Array.from(new Set(liveProducts.map(p => p.brand).filter(Boolean)));
    return all.length > 0 ? all : getBrands();
  }

  const brandsInCat = new Set(
    liveProducts.filter(p => p.category?.toLowerCase() === categoryName.toLowerCase()).map(p => p.brand).filter(Boolean)
  );
  if (brandsInCat.size > 0) return Array.from(brandsInCat);

  const allBrands = getBrands();
  return allBrands.slice(0, 10);
}

// Dynamic Subcategory / Product Type finder for specific category
export function getSubcategoriesByCategory(categoryName) {
  let filtered = liveProducts;
  if (categoryName && categoryName !== 'All') {
    filtered = liveProducts.filter(p => p.category?.toLowerCase() === categoryName.toLowerCase());
  }
  const subcats = new Set(filtered.map(p => p.subcategory).filter(Boolean));
  return Array.from(subcats);
}

// ================= WISHLIST MANAGEMENT =================

const WISHLIST_KEY = "krishna_wishlist";

export function getWishlist() {
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isInWishlist(productId) {
  const list = getWishlist();
  return list.some(item => Number(item.id) === Number(productId));
}

export function toggleWishlist(product) {
  if (!product) return false;
  const list = getWishlist();
  const exists = list.some(item => Number(item.id) === Number(product.id));
  let updated;
  if (exists) {
    updated = list.filter(item => Number(item.id) !== Number(product.id));
  } else {
    updated = [{
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice,
      discount: product.discount,
      rating: product.rating,
      image: product.image || product.images?.[0],
      stock: product.stock
    }, ...list];
  }
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  } catch {}
  window.dispatchEvent(new Event('wishlistUpdated'));
  return !exists;
}

export function removeFromWishlist(productId) {
  const list = getWishlist();
  const updated = list.filter(item => Number(item.id) !== Number(productId));
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  } catch {}
  window.dispatchEvent(new Event('wishlistUpdated'));
  return updated;
}

export function clearWishlist() {
  try {
    localStorage.removeItem(WISHLIST_KEY);
  } catch {}
  window.dispatchEvent(new Event('wishlistUpdated'));
}

// ================= REVIEWS MANAGEMENT =================
let liveReviews = {};

export function getProductReviews(productId) {
  return liveReviews[productId] || [];
}

export function addProductReview(productId, review) {
  const current = liveReviews[productId] || [];
  const newReview = {
    id: Date.now(),
    productId: Number(productId),
    user: review.user || "Verified Customer",
    rating: Number(review.rating) || 5,
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    title: review.title || "Excellent quality",
    text: review.text || "",
    verified: true
  };
  liveReviews[productId] = [newReview, ...current];
  window.dispatchEvent(new Event('reviewsUpdated'));

  // Sync review to live backend
  productsApi.addReview(newReview).catch(err => console.warn('[API] Failed to save review:', err));

  return liveReviews[productId];
}