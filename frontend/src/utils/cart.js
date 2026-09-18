// src/utils/cart.js
import { cartApi, promotionsApi } from './api';

const CART_KEY = 'krishna_cart';
const APPLIED_COUPON_KEY = 'krishna_applied_coupon';

function loadCartFromStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('[Cart] Error reading cart from localStorage:', e);
  }
  return [];
}

function loadCouponFromStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = localStorage.getItem(APPLIED_COUPON_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('[Cart] Error reading coupon from localStorage:', e);
  }
  return null;
}

let cartMemory = loadCartFromStorage();
let appliedCouponMemory = loadCouponFromStorage();

export const FREE_SHIPPING_THRESHOLD = 2000;
export const AVAILABLE_COUPONS = {
  KRISHNA10: {
    code: 'KRISHNA10',
    type: 'Percentage',
    value: 10,
    discountPercent: 10,
    minSpend: 1000,
    minOrder: 1000,
    maxDiscount: null,
    description: '10% instant discount on orders above ₹1,000'
  },
  FESTIVE20: {
    code: 'FESTIVE20',
    type: 'Percentage',
    value: 20,
    discountPercent: 20,
    minSpend: 4999,
    minOrder: 4999,
    maxDiscount: 2000,
    description: '20% off on luxury collections above ₹4,999'
  },
  WELCOME500: {
    code: 'WELCOME500',
    type: 'Fixed',
    value: 500,
    discountAmount: 500,
    minSpend: 2999,
    minOrder: 2999,
    maxDiscount: 500,
    description: 'Flat ₹500 off on orders above ₹2,999'
  }
};

/**
 * Retrieves the current cart array from memory/localStorage.
 */
export function getCart() {
  if ((!cartMemory || cartMemory.length === 0) && typeof window !== 'undefined' && window.localStorage) {
    const stored = loadCartFromStorage();
    if (stored.length > 0) {
      cartMemory = stored;
    }
  }

  return cartMemory.map((item) => ({
      ...item,
      quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
      price: Number(item.price) || 0,
      color: item.color || item.selectedColor || '',
      variant: item.variant || item.selectedVariant || '',
      size: item.size || item.selectedSize || ''
    }));
}

/**
 * Saves the cart to memory & localStorage and broadcasts the cartUpdated event.
 */
export function saveCart(cart) {
  cartMemory = Array.isArray(cart) ? cart : [];
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cartMemory));
    } catch (e) {
      console.warn('[Cart] Error saving cart to localStorage:', e);
    }
  }
  window.dispatchEvent(new Event('cartUpdated'));
  cartApi.save(cartMemory).catch(err => console.warn('[API] Failed to save cart:', err));
}

export async function syncCartFromBackend() {
  try {
    const cart = await cartApi.get();
    if (Array.isArray(cart) && cart.length > 0) {
      cartMemory = cart;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(CART_KEY, JSON.stringify(cartMemory));
      }
      window.dispatchEvent(new Event('cartUpdated'));
    } else if (cartMemory.length > 0) {
      // Sync guest/local items to backend if backend was empty
      cartApi.save(cartMemory).catch(() => {});
    }
  } catch (err) {
    // Fail silently to local storage cart
  }
}

// Auto-trigger sync on load in browser if logged in
if (typeof window !== 'undefined') {
  if (localStorage.getItem('krishna_auth_token')) {
    syncCartFromBackend();
  }
}

/**
 * Adds a product into the cart with specific color/variant specifications.
 */
export function addToCart(product, quantity = 1, color = '', variant = '', size = '', price = null, image = '') {
  if (!product || product.id === undefined || product.id === null) {
    return getCart();
  }

  const cart = getCart();
  const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);
  const targetColor = typeof color === 'string' ? color.trim() : '';
  const targetVariant = typeof variant === 'string' ? variant.trim() : '';
  const targetSize = typeof size === 'string' ? size.trim() : '';

  const existingIndex = cart.findIndex((item) => {
    const itemColor = (item.color || item.selectedColor || '').trim();
    const itemVariant = (item.variant || item.selectedVariant || '').trim();
    const itemSize = (item.size || item.selectedSize || '').trim();
    return (
      String(item.id) === String(product.id) &&
      itemColor === targetColor &&
      itemVariant === targetVariant &&
      itemSize === targetSize
    );
  });

  if (existingIndex > -1) {
    cart[existingIndex].quantity = (cart[existingIndex].quantity || 0) + qtyToAdd;
  } else {
    let productImage = '';
    if (image) {
      productImage = image;
    } else if (Array.isArray(product.images) && product.images.length > 0) {
      productImage = product.images[0];
    } else if (product.image) {
      productImage = product.image;
    }

    cart.push({
      id: product.id,
      name: product.name || 'Selected Accessory',
      brand: product.brand || 'Krishna Accessories',
      category: product.category || 'Luxury Goods',
      sku: product.sku || `KA-${product.id}`,
      supplier: product.supplier || 'Krishna Accessories',
      price: price === null ? Number(product.price) || 0 : Number(price) || 0,
      oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
      image: productImage,
      color: targetColor,
      variant: targetVariant,
      size: targetSize,
      quantity: qtyToAdd,
    });
  }

  saveCart(cart);
  return cart;
}

/**
 * Updates the quantity of a specific item in the cart.
 * Signature supports:
 *   updateCartQuantity(id, color, variant, quantity)
 *   updateCartQuantity(id, color, quantity)
 *   updateCartQuantity(id, quantity)
 */
export function updateCartQuantity(id, colorOrQty = '', variantOrQty = '', quantityParam = 1, size = '') {
  const cart = getCart();
  let targetColor = '';
  let targetVariant = '';
  let newQuantity = 1;

  if (typeof colorOrQty === 'number') {
    newQuantity = colorOrQty;
  } else if (typeof variantOrQty === 'number') {
    targetColor = typeof colorOrQty === 'string' ? colorOrQty.trim() : '';
    newQuantity = variantOrQty;
  } else {
    targetColor = typeof colorOrQty === 'string' ? colorOrQty.trim() : '';
    targetVariant = typeof variantOrQty === 'string' ? variantOrQty.trim() : '';
    newQuantity = typeof quantityParam === 'number' ? quantityParam : parseInt(quantityParam, 10) || 1;
  }
  const targetSize = typeof size === 'string' ? size.trim() : '';

  if (newQuantity <= 0) {
    return removeFromCart(id, targetColor, targetVariant);
  }

  const item = cart.find((p) => {
    const pColor = (p.color || p.selectedColor || '').trim();
    const pVariant = (p.variant || p.selectedVariant || '').trim();
    const pSize = (p.size || p.selectedSize || '').trim();
    return (
      String(p.id) === String(id) &&
      pColor === targetColor &&
      pVariant === targetVariant &&
      pSize === targetSize
    );
  });

  if (item) {
    item.quantity = Math.max(1, newQuantity);
    saveCart(cart);
  }

  return cart;
}

/**
 * Removes an item from the cart matching id, color, and variant.
 */
export function removeFromCart(id, color = '', variant = '', size = '') {
  const cart = getCart();
  const targetColor = typeof color === 'string' ? color.trim() : '';
  const targetVariant = typeof variant === 'string' ? variant.trim() : '';
  const targetSize = typeof size === 'string' ? size.trim() : '';

  const updatedCart = cart.filter((item) => {
    const itemColor = (item.color || item.selectedColor || '').trim();
    const itemVariant = (item.variant || item.selectedVariant || '').trim();
    const itemSize = (item.size || item.selectedSize || '').trim();
    const matches =
      String(item.id) === String(id) &&
      itemColor === targetColor &&
      itemVariant === targetVariant &&
      itemSize === targetSize;
    return !matches;
  });

  saveCart(updatedCart);
  return updatedCart;
}

/**
 * Completely empties the cart and resets applied coupons.
 */
export function clearCart() {
  cartMemory = [];
  appliedCouponMemory = null;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(APPLIED_COUPON_KEY);
    } catch (e) {
      console.warn('[Cart] Error clearing cart from localStorage:', e);
    }
  }
  window.dispatchEvent(new Event('cartUpdated'));
  cartApi.clear().catch(err => console.warn('[API] Failed to clear cart:', err));
}

/**
 * Returns the total number of items in the cart.
 */
export function getCartCount() {
  return getCart().reduce((total, item) => total + (item.quantity || 1), 0);
}

/**
 * Returns the raw subtotal amount of all products in the cart.
 */
export function getCartSubtotal() {
  return getCart().reduce((total, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return total + price * qty;
  }, 0);
}

// ================= COUPON HELPERS =================

/**
 * Retrieves the currently applied coupon object or null.
 */
export function getAppliedCoupon() {
  if (!appliedCouponMemory && typeof window !== 'undefined' && window.localStorage) {
    appliedCouponMemory = loadCouponFromStorage();
  }
  return appliedCouponMemory;
}

/**
 * Applies a coupon code if valid and eligible.
 */
export async function applyCoupon(code, currentSubtotal = null) {
  if (!code || typeof code !== 'string') {
    return { success: false, message: 'Please enter a valid voucher code.' };
  }

  const normalized = code.trim().toUpperCase();
  const subtotal = typeof currentSubtotal === 'number' ? currentSubtotal : getCartSubtotal();
  
  let coupon = null;
  let discount = 0;
  let message = '';

  try {
    const result = await promotionsApi.validateCoupon(normalized, subtotal);
    if (result && result.valid) {
      coupon = result.coupon;
      discount = Number(result.discount) || 0;
      message = result.message || `Coupon ${normalized} applied successfully!`;
    } else if (result && result.message) {
      return { success: false, message: result.message };
    }
  } catch (err) {
    console.warn('[Cart] Backend coupon validation failed, checking fallback:', err);
  }

  // Fallback to AVAILABLE_COUPONS if backend was unreachable or coupon found locally
  if (!coupon && AVAILABLE_COUPONS[normalized]) {
    const local = AVAILABLE_COUPONS[normalized];
    const minThreshold = Number(local.minOrder ?? local.minSpend ?? 0);
    if (subtotal < minThreshold) {
      return {
        success: false,
        message: `Minimum order value of ₹${minThreshold.toLocaleString('en-IN')} required for coupon ${normalized}.`
      };
    }
    coupon = local;
    const isPercent = (local.type || '').toLowerCase() === 'percentage' || local.discountPercent !== undefined;
    const val = Number(local.value ?? local.discountPercent ?? local.discountAmount ?? 0);
    if (isPercent) {
      let calc = Math.round((subtotal * val) / 100);
      if (local.maxDiscount && calc > Number(local.maxDiscount)) {
        calc = Number(local.maxDiscount);
      }
      discount = calc;
    } else {
      discount = Math.min(subtotal, val);
    }
    message = `Coupon ${normalized} applied successfully!`;
  }

  if (!coupon) {
    return { success: false, message: 'Invalid or expired voucher code.' };
  }

  appliedCouponMemory = coupon;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(APPLIED_COUPON_KEY, JSON.stringify(coupon));
    } catch (e) {
      console.warn('[Cart] Error saving coupon to localStorage:', e);
    }
  }

  window.dispatchEvent(new Event('cartUpdated'));

  return {
    success: true,
    coupon,
    discount,
    message
  };
}

/**
 * Removes the currently applied coupon.
 */
export function removeCoupon() {
  appliedCouponMemory = null;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem(APPLIED_COUPON_KEY);
    } catch (e) {
      console.warn('[Cart] Error removing coupon from localStorage:', e);
    }
  }
  window.dispatchEvent(new Event('cartUpdated'));
}

/**
 * Calculates complete summary of the cart including subtotal, discount, shipping, and total.
 */
export function calculateCartSummary() {
  const cart = getCart();
  const subtotal = getCartSubtotal();
  const rawCoupon = getAppliedCoupon();

  let discount = 0;
  let validCoupon = null;

  if (rawCoupon && subtotal > 0) {
    const minThreshold = Number(rawCoupon.minOrder ?? rawCoupon.minorder ?? rawCoupon.minSpend ?? 0);
    if (subtotal >= minThreshold) {
      validCoupon = rawCoupon;
      const typeStr = (rawCoupon.type || '').toString().toLowerCase();
      const isPercent = typeStr === 'percentage' ||
                        rawCoupon.discountPercent !== undefined ||
                        (rawCoupon.value !== undefined && Number(rawCoupon.value) <= 100 && typeStr !== 'fixed');

      const rawVal = rawCoupon.value ?? rawCoupon.discountPercent ?? rawCoupon.discountAmount ?? rawCoupon.discount ?? 0;
      const numericVal = typeof rawVal === 'string' ? (parseFloat(rawVal.replace(/[^0-9.]/g, '')) || 0) : (Number(rawVal) || 0);

      if (isPercent) {
        let calc = Math.round((subtotal * numericVal) / 100);
        const rawMax = rawCoupon.maxDiscount ?? rawCoupon.maxdiscount;
        if (rawMax !== null && rawMax !== undefined && Number(rawMax) > 0 && calc > Number(rawMax)) {
          calc = Number(rawMax);
        }
        discount = calc;
      } else {
        discount = Math.min(subtotal, numericVal);
      }
    } else {
      // Order amount fell below threshold; automatically invalidate coupon
      removeCoupon();
    }
  }

  const shipping = subtotal === 0 ? 0 : (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE);
  const total = Math.max(0, subtotal - discount + shipping);
  const freeShippingDifference = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD && subtotal > 0;

  return {
    cart,
    subtotal,
    discount,
    coupon: validCoupon,
    shipping,
    total,
    qualifiesForFreeShipping,
    freeShippingDifference,
    threshold: FREE_SHIPPING_THRESHOLD
  };
}