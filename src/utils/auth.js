// src/utils/auth.js

const AUTH_KEY = 'krishna_current_user';
const ROLE_SESSION_KEYS = {
  customer: 'krishna_customer_user',
  supplier: 'krishna_supplier_user',
  admin: 'krishna_admin_user'
};

function readUser(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function getCurrentUser() {
  return readUser(AUTH_KEY);
}

export function setCurrentUser(user) {
  if (user) {
    const previousUser = getCurrentUser();
    const previousRoleKey = previousUser?.role ? ROLE_SESSION_KEYS[previousUser.role] : null;
    if (previousRoleKey && !localStorage.getItem(previousRoleKey)) {
      localStorage.setItem(previousRoleKey, JSON.stringify(previousUser));
    }

    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    const roleKey = ROLE_SESSION_KEYS[user.role];
    if (roleKey) {
      localStorage.setItem(roleKey, JSON.stringify(user));
    }
  } else {
    logout();
  }
  window.dispatchEvent(new Event('authUpdated'));
}

export function logout() {
  const currentUser = getCurrentUser();
  localStorage.removeItem(AUTH_KEY);

  if (currentUser?.role && ROLE_SESSION_KEYS[currentUser.role]) {
    localStorage.removeItem(ROLE_SESSION_KEYS[currentUser.role]);
  }

  const fallbackUser = Object.keys(ROLE_SESSION_KEYS)
    .map((role) => readUser(ROLE_SESSION_KEYS[role]))
    .find(Boolean);

  if (fallbackUser) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(fallbackUser));
  }

  window.dispatchEvent(new Event('authUpdated'));
}

export function getUserForRole(role) {
  return ROLE_SESSION_KEYS[role] ? readUser(ROLE_SESSION_KEYS[role]) : null;
}

export function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

export function isSupplier() {
  const user = getCurrentUser();
  return user && (user.role === 'supplier' || user.role === 'admin');
}
