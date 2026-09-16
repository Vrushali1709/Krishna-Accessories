// src/utils/auth.js

const CUSTOMER_AUTH_KEY = 'krishna_customer_user';
const ADMIN_AUTH_KEY = 'krishna_admin_user';
const SUPPLIER_AUTH_KEY = 'krishna_supplier_user';
const LEGACY_AUTH_KEY = 'krishna_current_user';
const AUTH_TOKEN_KEY = 'krishna_auth_token';

export function setAuthToken(token) {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  else localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getCustomerUser() {
  try {
    const data = localStorage.getItem(CUSTOMER_AUTH_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && (parsed.role === 'customer' || !parsed.role)) return parsed;
    }
    // Clean legacy migration only if it was a true customer
    const legacy = localStorage.getItem(LEGACY_AUTH_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (parsed && parsed.role === 'customer') return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function getAdminUser() {
  try {
    const data = localStorage.getItem(ADMIN_AUTH_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed?.role === 'admin') return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function getSupplierUser() {
  try {
    const data = localStorage.getItem(SUPPLIER_AUTH_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed?.role === 'supplier') return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

// Storefront customer user (used for Checkout, Account, Cart, Wishlist)
export function getCurrentUser() {
  return getCustomerUser();
}

export function setCustomerUser(user) {
  if (user) {
    localStorage.setItem(CUSTOMER_AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CUSTOMER_AUTH_KEY);
    localStorage.removeItem(LEGACY_AUTH_KEY);
  }
  window.dispatchEvent(new Event('authUpdated'));
}

export function setAdminUser(user) {
  if (user) {
    localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  }
  window.dispatchEvent(new Event('authUpdated'));
}

export function setSupplierUser(user) {
  if (user) {
    localStorage.setItem(SUPPLIER_AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SUPPLIER_AUTH_KEY);
  }
  window.dispatchEvent(new Event('authUpdated'));
}

export function setCurrentUser(user) {
  if (!user) {
    logout();
    return;
  }

  if (user.role === 'admin') {
    setAdminUser(user);
  } else if (user.role === 'supplier') {
    setSupplierUser(user);
  } else {
    setCustomerUser(user);
  }
}

// Log out only storefront customer session
export function logout() {
  localStorage.removeItem(CUSTOMER_AUTH_KEY);
  localStorage.removeItem(LEGACY_AUTH_KEY);
  setAuthToken(null);
  window.dispatchEvent(new Event('authUpdated'));
}

// Log out only admin session
export function logoutAdmin() {
  localStorage.removeItem(ADMIN_AUTH_KEY);
  setAuthToken(null);
  window.dispatchEvent(new Event('authUpdated'));
}

// Log out only supplier session
export function logoutSupplier() {
  localStorage.removeItem(SUPPLIER_AUTH_KEY);
  setAuthToken(null);
  window.dispatchEvent(new Event('authUpdated'));
}

// Log out all sessions
export function logoutAll() {
  localStorage.removeItem(CUSTOMER_AUTH_KEY);
  localStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem(SUPPLIER_AUTH_KEY);
  localStorage.removeItem(LEGACY_AUTH_KEY);
  setAuthToken(null);
  window.dispatchEvent(new Event('authUpdated'));
}

// Active user for UI Navbar & Profile menus (checks active route or existing sessions)
export function getActiveAuthUser() {
  try {
    if (typeof window !== 'undefined' && window.location) {
      if (window.location.pathname.startsWith('/supplier')) {
        return getSupplierUser() || getCustomerUser() || getAdminUser() || null;
      }
      if (window.location.pathname.startsWith('/admin')) {
        return getAdminUser() || getCustomerUser() || getSupplierUser() || null;
      }
    }
  } catch {}
  return getCustomerUser() || getSupplierUser() || getAdminUser() || null;
}

export function logoutRole(role) {
  if (role === 'admin') {
    logoutAdmin();
  } else if (role === 'supplier') {
    logoutSupplier();
  } else {
    logout();
  }
}

export function isAdmin() {
  return !!getAdminUser();
}

export function isSupplier() {
  return !!getSupplierUser();
}

