// src/utils/auth.js

const AUTH_KEY = 'krishna_current_user';

export function getCurrentUser() {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
  window.dispatchEvent(new Event('authUpdated'));
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event('authUpdated'));
}

export function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

export function isSupplier() {
  const user = getCurrentUser();
  return user && (user.role === 'supplier' || user.role === 'admin');
}
