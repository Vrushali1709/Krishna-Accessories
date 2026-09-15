// src/utils/cart.js

const CART_KEY = 'krishna_accessories_cart';
const COUPON_KEY = 'krishna_applied_coupon';

export const FREE_SHIPPING_THRESHOLD = 2000;
export const STANDARD_SHIPPING_FEE = 99;

export const AVAILABLE_COUPONS = {
  'KRISHNA10': {
    code: 'KRISHNA10',
    discountPercent: 10,
    minSpend: 1000,
    description: '10% OFF on orders above ₹1,000'
  },
  'LUXURY500': {
    code: 'LUXURY500',
    discountAmount: 500,
    minSpend: 4000,
    description: '₹500 Flat OFF on orders above ₹4,000'
  },
  'FESTIVE15': {
    code: 'FESTIVE15',
    discountPercent: 15,
    minSpend: 2500,
    description: '15% Festive OFF on orders above ₹2,500'
  }
};

/**
 * Retrieves the current cart array from localStorage.
 */
export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      ...item,
      quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
      price: Number(item.price) || 0,
      color: item.color || item.selectedColor || '',
      variant: item.variant || item.selectedVariant || '',
      size: item.size || item.selectedSize || ''
    }));
  } catch (error) {
    console.error('Cart read error:', error);
    return [];
  }
}

/**
 * Saves the cart to localStorage and broadcasts the cartUpdated event.
 */
export function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Cart save error:', error);
  }
  window.dispatchEvent(new Event('cartUpdated'));
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
  try {
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(COUPON_KEY);
  } catch (err) {
    console.error('Clear cart error:', err);
  }
  window.dispatchEvent(new Event('cartUpdated'));
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
  try {
    const data = localStorage.getItem(COUPON_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return parsed && typeof parsed === 'object' && parsed.code ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Applies a coupon code if valid and eligible.
 */
export function applyCoupon(code, currentSubtotal = null) {
  if (!code || typeof code !== 'string') {
    return { success: false, message: 'Please provide a coupon code.' };
  }

  const normalized = code.trim().toUpperCase();
  const coupon = AVAILABLE_COUPONS[normalized];

  if (!coupon) {
    return {
      success: false,
      message: `Invalid voucher code "${normalized}". Available codes: KRISHNA10, FESTIVE15, LUXURY500.`
    };
  }

  const subtotal = typeof currentSubtotal === 'number' ? currentSubtotal : getCartSubtotal();

  if (subtotal < coupon.minSpend) {
    return {
      success: false,
      message: `Minimum order amount of ₹${coupon.minSpend.toLocaleString('en-IN')} required for voucher ${coupon.code}.`
    };
  }

  let discount = 0;
  if (coupon.discountPercent) {
    discount = Math.round((subtotal * coupon.discountPercent) / 100);
  } else if (coupon.discountAmount) {
    discount = Math.min(subtotal, coupon.discountAmount);
  }

  try {
    localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
  } catch (err) {
    console.error('Save coupon error:', err);
  }

  window.dispatchEvent(new Event('cartUpdated'));

  return {
    success: true,
    coupon,
    discount,
    message: `Voucher ${coupon.code} applied successfully!`
  };
}

/**
 * Removes the currently applied coupon.
 */
export function removeCoupon() {
  try {
    localStorage.removeItem(COUPON_KEY);
  } catch (err) {
    console.error('Remove coupon error:', err);
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
    if (subtotal >= (rawCoupon.minSpend || 0)) {
      validCoupon = rawCoupon;
      if (rawCoupon.discountPercent) {
        discount = Math.round((subtotal * rawCoupon.discountPercent) / 100);
      } else if (rawCoupon.discountAmount) {
        discount = Math.min(subtotal, rawCoupon.discountAmount);
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