// src/utils/cart.js

const CART_KEY = 'krishna_accessories_cart';
const COUPON_KEY = 'krishna_applied_coupon';

export const FREE_SHIPPING_THRESHOLD = 2000;
export const STANDARD_SHIPPING_FEE = 99;

export const AVAILABLE_COUPONS = {
  'KRISHNA10': { code: 'KRISHNA10', discountPercent: 10, minSpend: 1000, description: '10% OFF on orders above ₹1,000' },
  'LUXURY500': { code: 'LUXURY500', discountAmount: 500, minSpend: 4000, description: '₹500 Flat OFF on orders above ₹4,000' },
  'FESTIVE15': { code: 'FESTIVE15', discountPercent: 15, minSpend: 2500, description: '15% Festive OFF on orders above ₹2,500' }
};

export function getCart() {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Cart Error:', error);
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
}

export function addToCart(product, quantity = 1, color = '', variant = '') {
  const cart = getCart();

  const existingProduct = cart.find(
    (item) =>
      item.id === product.id &&
      item.color === color &&
      item.variant === variant
  );

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      sku: product.sku || `KA-${product.id}`,
      supplier: product.supplier || "Krishna Accessories",
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.images?.[0] || product.image,
      color,
      variant,
      quantity,
    });
  }

  saveCart(cart);
  return cart;
}

export function updateCartQuantity(id, color = '', quantity = 1, variant = '') {
  const cart = getCart();

  const item = cart.find(
    (product) =>
      product.id === id &&
      product.color === color &&
      (variant ? product.variant === variant : true)
  );

  if (item) {
    item.quantity = Math.max(1, quantity);
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(id, color = '', variant = '') {
  const cart = getCart();

  const updatedCart = cart.filter(
    (item) =>
      !(item.id === id && item.color === color && (variant ? item.variant === variant : true))
  );

  saveCart(updatedCart);
  return updatedCart;
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem(COUPON_KEY);
  window.dispatchEvent(new Event('cartUpdated'));
}

export function getCartCount() {
  return getCart().reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );
}

export function getCartSubtotal() {
  return getCart().reduce(
    (total, item) =>
      total + item.price * (item.quantity || 1),
    0
  );
}

// ================= COUPON HELPERS =================

export function getAppliedCoupon() {
  try {
    const data = localStorage.getItem(COUPON_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function applyCoupon(code) {
  const normalized = code.trim().toUpperCase();
  const coupon = AVAILABLE_COUPONS[normalized];
  if (!coupon) {
    return { success: false, message: 'Invalid coupon code.' };
  }
  const subtotal = getCartSubtotal();
  if (subtotal < coupon.minSpend) {
    return { success: false, message: `Minimum order amount of ₹${coupon.minSpend.toLocaleString('en-IN')} required for ${coupon.code}.` };
  }
  localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
  window.dispatchEvent(new Event('cartUpdated'));
  return { success: true, coupon, message: `Coupon ${coupon.code} applied successfully!` };
}

export function removeCoupon() {
  localStorage.removeItem(COUPON_KEY);
  window.dispatchEvent(new Event('cartUpdated'));
}

export function calculateCartSummary() {
  const cart = getCart();
  const subtotal = getCartSubtotal();
  const coupon = getAppliedCoupon();
  
  let discount = 0;
  if (coupon && subtotal >= coupon.minSpend) {
    if (coupon.discountPercent) {
      discount = Math.round((subtotal * coupon.discountPercent) / 100);
    } else if (coupon.discountAmount) {
      discount = Math.min(subtotal, coupon.discountAmount);
    }
  }

  const shipping = subtotal === 0 ? 0 : (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE);
  const total = Math.max(0, subtotal - discount + shipping);
  const freeShippingDifference = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  return {
    cart,
    subtotal,
    discount,
    coupon,
    shipping,
    total,
    qualifiesForFreeShipping,
    freeShippingDifference,
    threshold: FREE_SHIPPING_THRESHOLD
  };
}