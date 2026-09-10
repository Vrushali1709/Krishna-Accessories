// src/utils/auth.js

const CUSTOMER_AUTH_KEY = 'krishna_customer_user';
const ADMIN_AUTH_KEY = 'krishna_admin_user';
const SUPPLIER_AUTH_KEY = 'krishna_supplier_user';
const LEGACY_AUTH_KEY = 'krishna_current_user';

export function getCustomerUser() {
  try {
    const data = localStorage.getItem(CUSTOMER_AUTH_KEY) || localStorage.getItem(LEGACY_AUTH_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return parsed?.role === 'customer' || !parsed?.role ? parsed : null;
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
    const legacy = localStorage.getItem(LEGACY_AUTH_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
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
    const legacy = localStorage.getItem(LEGACY_AUTH_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (parsed?.role === 'supplier') return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function getCurrentUser() {
  // 1. If active customer user exists, return customer
  const customer = getCustomerUser();
  if (customer) return customer;

  // 2. If no customer, fallback to admin or supplier
  const admin = getAdminUser();
  if (admin) return admin;

  const supplier = getSupplierUser();
  if (supplier) return supplier;

  return null;
}

export function setCustomerUser(user) {
  if (user) {
    localStorage.setItem(CUSTOMER_AUTH_KEY, JSON.stringify(user));
    localStorage.setItem(LEGACY_AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CUSTOMER_AUTH_KEY);
    localStorage.removeItem(LEGACY_AUTH_KEY);
  }
  window.dispatchEvent(new Event('authUpdated'));
}

export function setAdminUser(user) {
  if (user) {
    localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(user));
    // If no customer session is active, also set legacy key
    if (!localStorage.getItem(CUSTOMER_AUTH_KEY)) {
      localStorage.setItem(LEGACY_AUTH_KEY, JSON.stringify(user));
    }
  } else {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  }
  window.dispatchEvent(new Event('authUpdated'));
}

export function setSupplierUser(user) {
  if (user) {
    localStorage.setItem(SUPPLIER_AUTH_KEY, JSON.stringify(user));
    if (!localStorage.getItem(CUSTOMER_AUTH_KEY)) {
      localStorage.setItem(LEGACY_AUTH_KEY, JSON.stringify(user));
    }
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

export function logout() {
  localStorage.removeItem(CUSTOMER_AUTH_KEY);
  localStorage.removeItem(LEGACY_AUTH_KEY);
  window.dispatchEvent(new Event('authUpdated'));
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_AUTH_KEY);
  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_AUTH_KEY) || '{}');
    if (legacy?.role === 'admin') {
      const customer = getCustomerUser();
      if (customer) {
        localStorage.setItem(LEGACY_AUTH_KEY, JSON.stringify(customer));
      } else {
        localStorage.removeItem(LEGACY_AUTH_KEY);
      }
    }
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event('authUpdated'));
}

export function logoutSupplier() {
  localStorage.removeItem(SUPPLIER_AUTH_KEY);
  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_AUTH_KEY) || '{}');
    if (legacy?.role === 'supplier') {
      const customer = getCustomerUser();
      if (customer) {
        localStorage.setItem(LEGACY_AUTH_KEY, JSON.stringify(customer));
      } else {
        localStorage.removeItem(LEGACY_AUTH_KEY);
      }
    }
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event('authUpdated'));
}

export function logoutAll() {
  localStorage.removeItem(CUSTOMER_AUTH_KEY);
  localStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem(SUPPLIER_AUTH_KEY);
  localStorage.removeItem(LEGACY_AUTH_KEY);
  window.dispatchEvent(new Event('authUpdated'));
}

export function isAdmin() {
  return !!getAdminUser();
}

export function isSupplier() {
  return !!getSupplierUser() || isAdmin();
}
