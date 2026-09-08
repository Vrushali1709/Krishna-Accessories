// src/utils/auth.js

export const CUSTOMER_KEY = 'krishna_customer_user';
export const ADMIN_KEY = 'krishna_admin_user';
export const SUPPLIER_KEY = 'krishna_supplier_user';
export const LEGACY_AUTH_KEY = 'krishna_current_user';

function getStoredUser(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function getCustomerUser() {
  const customer = getStoredUser(CUSTOMER_KEY);
  if (customer) return customer;
  
  // Legacy migration check
  const legacy = getStoredUser(LEGACY_AUTH_KEY);
  if (legacy && (legacy.role === 'customer' || !legacy.role)) {
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(legacy));
    return legacy;
  }
  return null;
}

export function getAdminUser() {
  const admin = getStoredUser(ADMIN_KEY);
  if (admin) return admin;

  // Legacy migration check
  const legacy = getStoredUser(LEGACY_AUTH_KEY);
  if (legacy && legacy.role === 'admin') {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(legacy));
    return legacy;
  }
  return null;
}

export function getSupplierUser() {
  const supplier = getStoredUser(SUPPLIER_KEY);
  if (supplier) return supplier;

  // Legacy migration check
  const legacy = getStoredUser(LEGACY_AUTH_KEY);
  if (legacy && legacy.role === 'supplier') {
    localStorage.setItem(SUPPLIER_KEY, JSON.stringify(legacy));
    return legacy;
  }
  return null;
}

/**
 * Returns the relevant current user.
 * If a role is passed, returns that role's user.
 * If no role is passed, prioritizes customer user on storefront, then admin, then supplier.
 */
export function getCurrentUser(role) {
  if (role === 'admin') return getAdminUser();
  if (role === 'supplier') return getSupplierUser();
  if (role === 'customer') return getCustomerUser();

  // Storefront context default: Customer > Admin > Supplier
  return getCustomerUser() || getAdminUser() || getSupplierUser() || null;
}

export function setCustomerUser(user) {
  if (user) {
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(user));
    localStorage.setItem(LEGACY_AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CUSTOMER_KEY);
  }
  window.dispatchEvent(new Event('authUpdated'));
}

export function setAdminUser(user) {
  if (user) {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(ADMIN_KEY);
  }
  window.dispatchEvent(new Event('authUpdated'));
}

export function setSupplierUser(user) {
  if (user) {
    localStorage.setItem(SUPPLIER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SUPPLIER_KEY);
  }
  window.dispatchEvent(new Event('authUpdated'));
}

export function setCurrentUser(user, explicitRole) {
  if (!user) {
    if (explicitRole === 'admin') {
      localStorage.removeItem(ADMIN_KEY);
    } else if (explicitRole === 'supplier') {
      localStorage.removeItem(SUPPLIER_KEY);
    } else if (explicitRole === 'customer') {
      localStorage.removeItem(CUSTOMER_KEY);
      localStorage.removeItem(LEGACY_AUTH_KEY);
    } else {
      localStorage.removeItem(CUSTOMER_KEY);
      localStorage.removeItem(ADMIN_KEY);
      localStorage.removeItem(SUPPLIER_KEY);
      localStorage.removeItem(LEGACY_AUTH_KEY);
    }
    window.dispatchEvent(new Event('authUpdated'));
    return;
  }

  const role = explicitRole || user.role || 'customer';
  if (role === 'admin') {
    setAdminUser(user);
  } else if (role === 'supplier') {
    setSupplierUser(user);
  } else {
    setCustomerUser(user);
  }
}

export function logoutCustomer() {
  localStorage.removeItem(CUSTOMER_KEY);
  localStorage.removeItem(LEGACY_AUTH_KEY);
  window.dispatchEvent(new Event('authUpdated'));
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_KEY);
  window.dispatchEvent(new Event('authUpdated'));
}

export function logoutSupplier() {
  localStorage.removeItem(SUPPLIER_KEY);
  window.dispatchEvent(new Event('authUpdated'));
}

export function logoutAll() {
  localStorage.removeItem(CUSTOMER_KEY);
  localStorage.removeItem(ADMIN_KEY);
  localStorage.removeItem(SUPPLIER_KEY);
  localStorage.removeItem(LEGACY_AUTH_KEY);
  window.dispatchEvent(new Event('authUpdated'));
}

export function logout(role) {
  if (role === 'admin') {
    logoutAdmin();
  } else if (role === 'supplier') {
    logoutSupplier();
  } else if (role === 'customer') {
    logoutCustomer();
  } else {
    // If on customer side, log out customer
    if (getCustomerUser()) {
      logoutCustomer();
    } else if (getAdminUser()) {
      logoutAdmin();
    } else if (getSupplierUser()) {
      logoutSupplier();
    } else {
      logoutAll();
    }
  }
}

export function isAdmin() {
  return Boolean(getAdminUser());
}

export function isSupplier() {
  return Boolean(getSupplierUser() || getAdminUser());
}

export function isCustomer() {
  return Boolean(getCustomerUser());
}

export function getActiveSessions() {
  return {
    customer: getCustomerUser(),
    admin: getAdminUser(),
    supplier: getSupplierUser()
  };
}
