// src/utils/productStore.js
import { productsApi, categoriesApi, brandsApi } from './api';

const PRODUCTS_KEY = "krishna_admin_products";
const CATEGORIES_KEY = "krishna_categories";
const BRANDS_KEY = "krishna_brands";
const WISHLIST_KEY = "krishna_wishlist";
const REVIEWS_KEY = "krishna_product_reviews";
const DB_VERSION_KEY = "krishna_db_version";
const CURRENT_VERSION = "2026_live_v2";

// Automatic Purge of Old Mock / Hardcoded Data from localStorage
export function purgeOldMockCache() {
  if (typeof window === 'undefined') return;
  try {
    const currentVersion = localStorage.getItem(DB_VERSION_KEY);
    if (currentVersion !== CURRENT_VERSION) {
      localStorage.removeItem(PRODUCTS_KEY);
      localStorage.removeItem(CATEGORIES_KEY);
      localStorage.removeItem(BRANDS_KEY);
      localStorage.removeItem('krishna_platform_orders');
      localStorage.removeItem('krishna_platform_suppliers');
      localStorage.removeItem('krishna_platform_users');
      localStorage.removeItem('krishna_platform_notifications');
      localStorage.removeItem('krishna_subcategories');
      localStorage.removeItem('krishna_product_variants');
      localStorage.removeItem('krishna_media_assets');
      localStorage.removeItem('krishna_promotions');
      localStorage.removeItem('krishna_roles');
      localStorage.removeItem('krishna_permissions_matrix');
      localStorage.removeItem('krishna_shipping_carriers');
      localStorage.removeItem('krishna_system_config');
      localStorage.setItem(DB_VERSION_KEY, CURRENT_VERSION);
    }
  } catch (e) {
    console.warn('Error purging old cache:', e);
  }
}

if (typeof window !== 'undefined') {
  purgeOldMockCache();
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

// No local mock products - everything comes from live backend
export const defaultProducts = [];

export function getWatchTypes() {
  return [];
}

export function getProducts() {
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeProduct).filter(Boolean);
      }
    }
  } catch (err) {
    console.warn('[Store] Error reading products from cache:', err);
  }

  // Trigger sync in background if empty
  if (typeof window !== 'undefined') {
    syncProductsFromBackend();
  }
  return [];
}

export const getStoredProducts = getProducts;

export function getProductById(id) {
  const products = getProducts();
  return products.find(p => Number(p.id) === Number(id)) || null;
}

export function saveProduct(product) {
  const products = getProducts();
  let updated;
  const isExisting = product.id && products.some(p => Number(p.id) === Number(product.id));

  if (isExisting) {
    updated = products.map(p => Number(p.id) === Number(product.id) ? normalizeProduct({ ...p, ...product }) : p);
  } else {
    const newProduct = normalizeProduct({ ...product, id: product.id || Date.now() });
    updated = [newProduct, ...products];
  }
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('productsUpdated'));

  // Sync with Live FastAPI Backend
  if (isExisting) {
    productsApi.update(product.id, product).catch(err => console.warn('[API] Failed to update product in backend:', err));
  } else {
    productsApi.create(product).catch(err => console.warn('[API] Failed to create product in backend:', err));
  }

  return updated;
}

export function addStoreProduct(product) {
  return saveProduct(product);
}

export function updateStoreProduct(id, updatedProduct) {
  return saveProduct({ ...updatedProduct, id: Number(id) });
}

export function deleteProduct(id) {
  const products = getProducts();
  const updated = products.filter(p => Number(p.id) !== Number(id));
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('productsUpdated'));

  // Sync with Live FastAPI Backend
  productsApi.delete(id).catch(err => console.warn('[API] Failed to delete product in backend:', err));

  return updated;
}

export const deleteStoreProduct = deleteProduct;

// ================= CATEGORIES MANAGEMENT =================

export function getCategories() {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('[Store] Error reading categories:', err);
  }

  // Trigger sync in background if empty
  if (typeof window !== 'undefined') {
    syncProductsFromBackend();
  }
  return defaultCategories;
}

export function addCategory(category) {
  const categories = getCategories();
  const trimmed = category.trim();
  if (trimmed && !categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
    const updated = [...categories, trimmed];
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('categoriesUpdated'));
    categoriesApi.create(trimmed).catch(err => console.warn('[API] Failed to add category to backend:', err));
    return updated;
  }
  return categories;
}

export function deleteCategory(category) {
  const categories = getCategories();
  const updated = categories.filter(item => item !== category);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('categoriesUpdated'));
  categoriesApi.delete(category).catch(err => console.warn('[API] Failed to delete category from backend:', err));
  return updated;
}

// ================= BRANDS MANAGEMENT =================

export function getBrands() {
  try {
    const data = localStorage.getItem(BRANDS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('[Store] Error reading brands:', err);
  }

  // Fallback: extract brands from current live products
  const products = getProducts();
  const productBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
  return productBrands;
}

export function addBrand(brand, category = "Watches") {
  const brands = getBrands();
  const trimmed = brand.trim();
  if (trimmed && !brands.some(b => (typeof b === 'string' ? b : b.name).toLowerCase() === trimmed.toLowerCase())) {
    const updated = [...brands, trimmed];
    localStorage.setItem(BRANDS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('brandsUpdated'));
    brandsApi.create(trimmed, category).catch(err => console.warn('[API] Failed to add brand to backend:', err));
    return updated;
  }
  return brands;
}

export function deleteBrand(brand) {
  const brands = getBrands();
  const brandName = typeof brand === 'string' ? brand : brand.name;
  const updated = brands.filter(item => (typeof item === 'string' ? item : item.name) !== brandName);
  localStorage.setItem(BRANDS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('brandsUpdated'));
  brandsApi.delete(brandName).catch(err => console.warn('[API] Failed to delete brand from backend:', err));
  return updated;
}

// ================= BACKEND SYNC =================
export async function syncProductsFromBackend() {
  try {
    const [fetchedProducts, fetchedCategories, fetchedBrands] = await Promise.all([
      productsApi.getAll().catch(e => { console.warn('[API] Products fetch failed:', e); return null; }),
      categoriesApi.getAll().catch(e => { console.warn('[API] Categories fetch failed:', e); return null; }),
      brandsApi.getAll().catch(e => { console.warn('[API] Brands fetch failed:', e); return null; })
    ]);

    let updated = false;

    if (Array.isArray(fetchedProducts)) {
      const normalized = fetchedProducts.map(normalizeProduct).filter(Boolean);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(normalized));
      window.dispatchEvent(new Event('productsUpdated'));
      updated = true;
    }

    if (Array.isArray(fetchedCategories) && fetchedCategories.length > 0) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(fetchedCategories));
      window.dispatchEvent(new Event('categoriesUpdated'));
      updated = true;
    }

    if (Array.isArray(fetchedBrands) && fetchedBrands.length > 0) {
      const brandNames = fetchedBrands.map(b => (typeof b === 'object' ? b.name : b));
      localStorage.setItem(BRANDS_KEY, JSON.stringify(brandNames));
      window.dispatchEvent(new Event('brandsUpdated'));
      updated = true;
    }

    return updated;
  } catch (err) {
    console.warn('[API] Failed syncing products from backend:', err);
    return false;
  }
}

// Auto-trigger sync on load in browser
if (typeof window !== 'undefined') {
  syncProductsFromBackend();
}

// Dynamic brand finder for specific category
export function getBrandsByCategory(categoryName) {
  const products = getProducts();
  if (!categoryName || categoryName === 'All') {
    const all = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
    return all.length > 0 ? all : getBrands();
  }

  const brandsInCat = new Set(
    products.filter(p => p.category?.toLowerCase() === categoryName.toLowerCase()).map(p => p.brand).filter(Boolean)
  );
  if (brandsInCat.size > 0) return Array.from(brandsInCat);

  const allBrands = getBrands();
  return allBrands.slice(0, 10);
}

// Dynamic Subcategory / Product Type finder for specific category
export function getSubcategoriesByCategory(categoryName) {
  const products = getProducts();
  let filtered = products;
  if (categoryName && categoryName !== 'All') {
    filtered = products.filter(p => p.category?.toLowerCase() === categoryName.toLowerCase());
  }
  const subcats = new Set(filtered.map(p => p.subcategory).filter(Boolean));
  return Array.from(subcats);
}

// ================= WISHLIST MANAGEMENT =================

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
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('wishlistUpdated'));
  return !exists;
}

export function removeFromWishlist(productId) {
  const list = getWishlist();
  const updated = list.filter(item => Number(item.id) !== Number(productId));
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('wishlistUpdated'));
  return updated;
}

export function clearWishlist() {
  localStorage.removeItem(WISHLIST_KEY);
  window.dispatchEvent(new Event('wishlistUpdated'));
}

// ================= REVIEWS MANAGEMENT =================

export function getProductReviews(productId) {
  try {
    const data = localStorage.getItem(REVIEWS_KEY);
    const allReviews = data ? JSON.parse(data) : {};
    return allReviews[productId] || [];
  } catch {
    return [];
  }
}

export function addProductReview(productId, review) {
  try {
    const data = localStorage.getItem(REVIEWS_KEY);
    const allReviews = data ? JSON.parse(data) : {};
    const current = allReviews[productId] || [];
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
    allReviews[productId] = [newReview, ...current];
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(allReviews));
    window.dispatchEvent(new Event('reviewsUpdated'));

    // Sync review to live backend
    productsApi.addReview(newReview).catch(err => console.warn('[API] Failed to save review:', err));

    return allReviews[productId];
  } catch (err) {
    console.error('Error adding review:', err);
    return [];
  }
}