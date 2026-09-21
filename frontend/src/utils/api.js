// src/utils/api.js
// Centralized API Client for Krishna Accessories Python Backend (FastAPI)

export const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://127.0.0.1:8000/api' : 'https://krishna-backend-3os6.onrender.com/api');

// Check if Python backend is alive
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return { connected: false };
    const data = await res.json();
    return { connected: true, ...data };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}

// Generic Request Helper
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(typeof localStorage !== 'undefined' && localStorage.getItem('krishna_auth_token')
        ? { Authorization: `Bearer ${localStorage.getItem('krishna_auth_token')}` }
        : {}),
      ...(options.headers || {})
    },
    ...options
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.warn(`[API] Error on ${options.method || 'GET'} ${endpoint}:`, err.message);
    if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
      throw new Error(`Unable to connect to the server (${API_BASE_URL}). Please verify that your Python backend is running.`);
    }
    throw err;
  }
}

// ==========================================
// 1. PRODUCTS API
// ==========================================
export const productsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.brand && params.brand !== 'All') query.append('brand', params.brand);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    const qs = query.toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => request(`/products/${id}`),
  create: (product) => request('/products', { method: 'POST', body: product }),
  update: (id, product) => request(`/products/${id}`, { method: 'PUT', body: product }),
  delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  getReviews: (productId) => request(`/reviews/${productId}`),
  addReview: (review) => request('/reviews', { method: 'POST', body: review })
};

// ==========================================
// 2. CATEGORIES & BRANDS API
// ==========================================
export const categoriesApi = {
  getAll: () => request('/categories'),
  create: (name) => request('/categories', { method: 'POST', body: { name } }),
  delete: (name) => request(`/categories/${encodeURIComponent(name)}`, { method: 'DELETE' })
};

export const brandsApi = {
  getAll: (category) => request(`/brands${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  create: (name, category) => request('/brands', { method: 'POST', body: { name, category } }),
  delete: (name) => request(`/brands/${encodeURIComponent(name)}`, { method: 'DELETE' })
};

// ==========================================
// 3. SUBCATEGORIES & VARIANTS API
// ==========================================
export const subcategoriesApi = {
  getAll: (category) => request(`/subcategories${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  save: (subcat) => request('/subcategories', { method: 'POST', body: subcat }),
  delete: (id) => request(`/subcategories/${id}`, { method: 'DELETE' })
};

export const variantsApi = {
  getAll: () => request('/variants'),
  save: (variant) => request('/variants', { method: 'POST', body: variant }),
  delete: (id) => request(`/variants/${id}`, { method: 'DELETE' })
};

// ==========================================
// 4. ORDERS API
// ==========================================
export const ordersApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.customerEmail) query.append('customer_email', params.customerEmail);
    if (params.orderStatus && params.orderStatus !== 'All') query.append('order_status', params.orderStatus);
    if (params.search) query.append('search', params.search);
    const qs = query.toString();
    return request(`/orders${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => request(`/orders/${id}`),
  create: (order) => request('/orders', { method: 'POST', body: order }),
  updateStatus: (id, status, note = '') => request(`/orders/${id}/status`, { method: 'PUT', body: { status, note } }),
  cancel: (id, reason) => request(`/orders/${id}/cancel`, { method: 'POST', body: { reason } }),
  returnOrder: (id, returnDetails, returnStatus) => request(`/orders/${id}/return`, { method: 'POST', body: { returnDetails, returnStatus } })
};

// ==========================================
// 5. SUPPLIERS API
// ==========================================
export const suppliersApi = {
  getAll: () => request('/suppliers'),
  create: (supplier) => request('/suppliers', { method: 'POST', body: supplier }),
  update: (id, data) => request(`/suppliers/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/suppliers/${id}`, { method: 'DELETE' })
};

// ==========================================
// 6. USERS & AUTH API
// ==========================================
export const usersApi = {
  getAll: () => request('/users'),
  create: (user) => request('/users', { method: 'POST', body: user }),
  update: (id, data) => request(`/users/${id}`, { method: 'PUT', body: data }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials })
};

export const cartApi = {
  get: () => request('/cart'),
  save: (items) => request('/cart', { method: 'POST', body: { items } }),
  clear: () => request('/cart', { method: 'DELETE' })
};

export const wishlistApi = {
  get: () => request('/wishlist'),
  save: (items) => request('/wishlist', { method: 'POST', body: { items } }),
  clear: () => request('/wishlist', { method: 'DELETE' })
};

export const addressesApi = {
  get: () => request('/addresses'),
  save: (address) => request('/addresses', { method: 'POST', body: address }),
  delete: (id) => request(`/addresses/${id}`, { method: 'DELETE' })
};

export const authApi = {
  sendOtp: (email, type) => request('/auth/otp/send', { method: 'POST', body: { email, type } }),
  verifyOtp: (email, code, type) => request('/auth/otp/verify', { method: 'POST', body: { email, code, type } }),
  resetPassword: (email, password) => request('/auth/password/reset', { method: 'POST', body: { email, password } })
};

export const emailApi = {
  log: (emailRecord) => request('/email/log', { method: 'POST', body: emailRecord })
};

// ==========================================
// 7. PROMOTIONS & COUPONS API
// ==========================================
export const promotionsApi = {
  getAll: () => request('/promotions'),
  save: (promo) => request('/promotions', { method: 'POST', body: promo }),
  delete: (id) => request(`/promotions/${id}`, { method: 'DELETE' }),
  validateCoupon: (code, subtotal) => request('/coupons/validate', { method: 'POST', body: { code, subtotal } })
};

// ==========================================
// 8. MEDIA ASSETS API
// ==========================================
export const mediaApi = {
  getAll: () => request('/media'),
  save: (asset) => request('/media', { method: 'POST', body: asset }),
  delete: (id) => request(`/media/${id}`, { method: 'DELETE' })
};

// ==========================================
// 9. ROLES & PERMISSIONS API
// ==========================================
export const rolesApi = {
  getAll: () => request('/roles'),
  save: (role) => request('/roles', { method: 'POST', body: role }),
  getPermissions: () => request('/permissions'),
  updatePermissions: (matrix) => request('/permissions', { method: 'PUT', body: matrix })
};

// ==========================================
// 10. SHIPPING CARRIERS API
// ==========================================
export const shippingApi = {
  getAll: () => request('/shipping-carriers'),
  update: (id, carrier) => request(`/shipping-carriers/${id}`, { method: 'PUT', body: carrier })
};

// ==========================================
// 11. SYSTEM CONFIG API
// ==========================================
export const systemConfigApi = {
  get: () => request('/system-config'),
  save: (config) => request('/system-config', { method: 'POST', body: config })
};

// ==========================================
// 12. NOTIFICATIONS API
// ==========================================
export const notificationsApi = {
  getAll: () => request('/notifications'),
  add: (notif) => request('/notifications', { method: 'POST', body: notif }),
  markRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllRead: () => request('/notifications/read-all', { method: 'PUT' }),
  clear: () => request('/notifications', { method: 'DELETE' })
};

// ==========================================
// 13. ADMIN ANALYTICS API
// ==========================================
export const analyticsApi = {
  getStats: () => request('/admin/analytics'),
  getBackup: () => request('/system/backup')
};
