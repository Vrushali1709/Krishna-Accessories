// src/utils/orderStore.js
import { ordersApi, suppliersApi, usersApi, notificationsApi } from './api';

const ORDERS_KEY = 'krishna_platform_orders';
const SUPPLIERS_KEY = 'krishna_platform_suppliers';
const USERS_KEY = 'krishna_platform_users';
const NOTIFICATIONS_KEY = 'krishna_platform_notifications';
const ADDRESSES_KEY = 'krishna_user_addresses';

const defaultSuppliers = [];
const defaultUsers = [];
const defaultOrders = [];
const defaultNotifications = [];
const defaultAddresses = [];

// ================= ORDERS STORE =================

export function getOrders() {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('[Store] Error reading orders:', e);
  }

  if (typeof window !== 'undefined') {
    syncOrdersFromBackend();
  }
  return defaultOrders;
}

export function getOrderById(id) {
  if (!id) return null;
  const orders = getOrders();
  const normalizedId = id.toString().trim().toUpperCase();
  return orders.find(o => o?.id != null && String(o.id).trim().toUpperCase() === normalizedId) || null;
}

export function createOrder(orderData) {
  const orders = getOrders();
  const orderNumber = `KA-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const timeFormatted = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const customerData = {
    firstName: orderData.customer?.firstName?.trim() || '',
    lastName: orderData.customer?.lastName?.trim() || '',
    email: orderData.customer?.email?.trim() || '',
    phone: orderData.customer?.phone?.trim() || '',
    address: orderData.customer?.address?.trim() || '',
    city: orderData.customer?.city?.trim() || '',
    state: orderData.customer?.state?.trim() || '',
    pincode: orderData.customer?.pincode?.trim() || ''
  };

  const newOrder = {
    id: orderNumber,
    customer: customerData,
    items: orderData.items || [],
    subtotal: orderData.subtotal || 0,
    shipping: orderData.shipping || 0,
    discount: orderData.discount || 0,
    couponCode: orderData.couponCode || null,
    total: orderData.total || 0,
    paymentMethod: orderData.paymentMethod || 'Cash on Delivery (COD)',
    paymentStatus: orderData.paymentMethod?.includes('COD') ? 'Pending' : 'Paid',
    status: 'Confirmed',
    courier: 'Pending Assignment',
    trackingNumber: null,
    date: dateFormatted,
    timeline: [
      {
        stage: 'Order Placed',
        status: 'Order Placed',
        time: `${dateFormatted}, ${timeFormatted}`,
        date: `${dateFormatted}, ${timeFormatted}`,
        description: 'Consignment received and order placed by client',
        completed: true,
        done: true
      },
      {
        stage: 'Payment Confirmed',
        status: 'Payment Confirmed',
        time: `${dateFormatted}, ${timeFormatted}`,
        date: `${dateFormatted}, ${timeFormatted}`,
        description: orderData.paymentMethod?.includes('COD')
          ? 'Cash on delivery requested upon arrival'
          : 'Payment verified successfully via secure gateway',
        completed: true,
        done: true
      },
      {
        stage: 'Processing & Packing',
        status: 'Processing & Packing',
        time: 'Pending',
        date: 'Pending',
        description: 'Under quality verification at boutique fulfillment facility',
        completed: false,
        done: false
      },
      {
        stage: 'Shipped',
        status: 'Shipped',
        time: 'Pending',
        date: 'Pending',
        description: 'Awaiting courier dispatch and airway bill generation',
        completed: false,
        done: false
      },
      {
        stage: 'Out for Delivery',
        status: 'Out for Delivery',
        time: 'Pending',
        date: 'Pending',
        description: 'Out for final-mile courier delivery to doorstep',
        completed: false,
        done: false
      },
      {
        stage: 'Delivered',
        status: 'Delivered',
        time: 'Pending',
        date: 'Pending',
        description: 'Delivered to recipient address with signature verification',
        completed: false,
        done: false
      }
    ]
  };

  const updated = [newOrder, ...orders];
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('ordersUpdated'));

  // Sync to Live FastAPI Backend
  ordersApi.create(newOrder).catch(err => console.warn('[API] Failed to create order in backend:', err));

  // Auto-record new user in client store if not existing
  if (customerData.email) {
    const users = getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === customerData.email.toLowerCase());
    if (existingUser) {
      const updatedUsers = users.map(u =>
        u.email.toLowerCase() === customerData.email.toLowerCase()
          ? {
            ...u,
            ordersCount: (u.ordersCount || 0) + 1,
            totalSpent: (u.totalSpent || 0) + (newOrder.total || 0)
          }
          : u
      );
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      window.dispatchEvent(new Event('usersUpdated'));
    } else {
      const newUser = {
        id: Date.now(),
        name: `${customerData.firstName} ${customerData.lastName}`.trim() || 'New Customer',
        email: customerData.email,
        phone: customerData.phone ? `+91 ${customerData.phone}` : '+91 98000 00000',
        role: 'Customer',
        status: 'Active',
        ordersCount: 1,
        totalSpent: newOrder.total || 0,
        joinedDate: dateFormatted
      };
      localStorage.setItem(USERS_KEY, JSON.stringify([newUser, ...users]));
      window.dispatchEvent(new Event('usersUpdated'));
      usersApi.create(newUser).catch(err => console.warn('[API] Failed to save user:', err));
    }
  }

  // Auto-add administrative notification
  addNotification({
    title: `New Order Placed: #${newOrder.id}`,
    message: `${customerData.firstName || 'Customer'} placed an order for ₹${(newOrder.total || 0).toLocaleString('en-IN')}`,
    type: 'order'
  });

  return newOrder;
}

export function updateOrderStatus(orderId, nextStatus, courierInfo = {}) {
  const orders = getOrders();
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const timeFormatted = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const timestamp = `${dateFormatted}, ${timeFormatted}`;

  const updated = orders.map(order => {
    if (String(order.id).trim().toUpperCase() !== String(orderId).trim().toUpperCase()) {
      return order;
    }

    const updatedTimeline = (order.timeline || []).map(step => {
      if (step.stage === nextStatus || step.status === nextStatus) {
        return {
          ...step,
          completed: true,
          done: true,
          time: timestamp,
          date: timestamp
        };
      }
      return step;
    });

    return {
      ...order,
      status: nextStatus,
      courier: courierInfo.courier || order.courier,
      trackingNumber: courierInfo.trackingNumber || order.trackingNumber,
      timeline: updatedTimeline
    };
  });

  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('ordersUpdated'));

  // Sync to Live FastAPI Backend
  ordersApi.updateStatus(orderId, nextStatus, courierInfo.note || '').catch(err => console.warn('[API] Failed to update order status:', err));

  return updated;
}

export function cancelOrder(orderId, reason = "Customer request", cancelledBy = "Customer") {
  const orders = getOrders();
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const timeFormatted = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const timestamp = `${dateFormatted}, ${timeFormatted}`;

  const updated = orders.map(order => {
    if (String(order.id).trim().toUpperCase() !== String(orderId).trim().toUpperCase()) {
      return order;
    }

    const cancelEvent = {
      stage: 'Cancelled',
      status: 'Cancelled',
      time: timestamp,
      date: timestamp,
      description: `Consignment cancelled by ${cancelledBy}. Reason: ${reason}`,
      completed: true,
      done: true
    };

    return {
      ...order,
      status: 'Cancelled',
      cancelReason: reason,
      cancelledBy: cancelledBy,
      cancelledAt: timestamp,
      timeline: [...(order.timeline || []), cancelEvent]
    };
  });

  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('ordersUpdated'));

  // Sync to Live FastAPI Backend
  ordersApi.cancel(orderId, reason).catch(err => console.warn('[API] Failed to cancel order in backend:', err));

  return updated;
}

export function requestReturn(orderId, returnData = {}) {
  const orders = getOrders();
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const timeFormatted = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const timestamp = `${dateFormatted}, ${timeFormatted}`;

  const returnDetails = {
    reason: returnData.reason || "Defective / Quality issue",
    pickupSlot: returnData.pickupSlot || "Next Business Day",
    bankDetails: returnData.bankDetails || "Original Payment Method",
    requestedAt: timestamp,
    status: "Return Requested"
  };

  const updated = orders.map(order => {
    if (String(order.id).trim().toUpperCase() !== String(orderId).trim().toUpperCase()) {
      return order;
    }

    const returnEvent = {
      stage: 'Return Requested',
      status: 'Return Requested',
      time: timestamp,
      date: timestamp,
      description: `Return initiated by client. Reason: ${returnDetails.reason}`,
      completed: true,
      done: true
    };

    return {
      ...order,
      status: 'Return Requested',
      returnDetails,
      timeline: [...(order.timeline || []), returnEvent]
    };
  });

  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('ordersUpdated'));

  // Sync to Live FastAPI Backend
  ordersApi.returnOrder(orderId, returnDetails, 'Return Requested').catch(err => console.warn('[API] Failed to request return in backend:', err));

  return updated;
}

export function processReturnStatus(orderId, newStatus, resolution = {}) {
  const orders = getOrders();
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const timeFormatted = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const timestamp = `${dateFormatted}, ${timeFormatted}`;

  const updated = orders.map(order => {
    if (String(order.id).trim().toUpperCase() !== String(orderId).trim().toUpperCase()) {
      return order;
    }

    const currentReturn = order.returnDetails || {};
    const updatedReturn = {
      ...currentReturn,
      status: newStatus,
      resolutionNotes: resolution.notes || currentReturn.resolutionNotes,
      refundAmount: resolution.refundAmount || order.total,
      processedAt: timestamp
    };

    const statusEvent = {
      stage: newStatus,
      status: newStatus,
      time: timestamp,
      date: timestamp,
      description: resolution.notes || `Order status updated to ${newStatus}`,
      completed: true,
      done: true
    };

    return {
      ...order,
      status: newStatus,
      returnDetails: updatedReturn,
      timeline: [...(order.timeline || []), statusEvent]
    };
  });

  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('ordersUpdated'));

  // Sync to Live FastAPI Backend
  ordersApi.returnOrder(orderId, resolution, newStatus).catch(err => console.warn('[API] Failed to process return status:', err));

  return updated;
}

export function getSupplierOrders(supplierName) {
  const orders = getOrders();
  if (!supplierName) return orders;
  return orders.filter(o =>
    o.items && o.items.some(item => !item.supplier || item.supplier.toLowerCase() === supplierName.toLowerCase())
  );
}

// ================= SUPPLIERS STORE =================

export function getSuppliers() {
  try {
    const data = localStorage.getItem(SUPPLIERS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('[Store] Error reading suppliers:', e);
  }

  if (typeof window !== 'undefined') {
    syncOrdersFromBackend();
  }
  return defaultSuppliers;
}

export function approveSupplier(id) {
  const suppliers = getSuppliers();
  const updated = suppliers.map(s => s.id === Number(id) ? { ...s, status: "Active" } : s);
  localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('suppliersUpdated'));
  suppliersApi.update(id, { status: "Active" }).catch(err => console.warn('[API] Failed to approve supplier:', err));
  return updated;
}

export function toggleSupplierStatus(id, newStatus) {
  const suppliers = getSuppliers();
  const updated = suppliers.map(s => s.id === Number(id) ? { ...s, status: newStatus } : s);
  localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('suppliersUpdated'));
  suppliersApi.update(id, { status: newStatus }).catch(err => console.warn('[API] Failed to toggle supplier status:', err));
  return updated;
}

export function addSupplier(supplier) {
  const suppliers = getSuppliers();
  const newSupplier = {
    ...supplier,
    id: supplier.id || Date.now(),
    joinedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: supplier.status || "Pending Approval",
    rating: 5.0,
    productsCount: 0,
    totalEarnings: 0
  };
  const updated = [newSupplier, ...suppliers];
  localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('suppliersUpdated'));
  suppliersApi.create(newSupplier).catch(err => console.warn('[API] Failed to add supplier:', err));
  return updated;
}

// ================= USERS STORE =================

export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('[Store] Error reading users:', e);
  }

  if (typeof window !== 'undefined') {
    syncOrdersFromBackend();
  }
  return defaultUsers;
}

export function toggleUserStatus(id, newStatus) {
  const users = getUsers();
  const updated = users.map(u => u.id === Number(id) ? { ...u, status: newStatus } : u);
  localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('usersUpdated'));
  usersApi.update(id, { status: newStatus }).catch(err => console.warn('[API] Failed to update user status:', err));
  return updated;
}

// ================= NOTIFICATIONS STORE =================

export function getNotifications() {
  try {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('[Store] Error reading notifications:', e);
  }

  if (typeof window !== 'undefined') {
    syncOrdersFromBackend();
  }
  return defaultNotifications;
}

export function addNotification(notif) {
  const current = getNotifications();
  const newNotif = {
    id: notif.id || Date.now(),
    title: notif.title,
    message: notif.message,
    date: "Just now",
    unread: true,
    type: notif.type || "info"
  };
  const updated = [newNotif, ...current];
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('notificationsUpdated'));
  notificationsApi.add(newNotif).catch(err => console.warn('[API] Failed to add notification:', err));
  return updated;
}

export function markNotificationRead(id) {
  const current = getNotifications();
  const updated = current.map(n => n.id === Number(id) ? { ...n, unread: false } : n);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('notificationsUpdated'));
  notificationsApi.markRead(id).catch(err => console.warn('[API] Failed to mark notification read:', err));
  return updated;
}

export function markAllNotificationsRead() {
  const current = getNotifications();
  const updated = current.map(n => ({ ...n, unread: false }));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('notificationsUpdated'));
  notificationsApi.markAllRead().catch(err => console.warn('[API] Failed to mark all notifications read:', err));
  return updated;
}

export function clearNotifications() {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
  window.dispatchEvent(new Event('notificationsUpdated'));
  notificationsApi.clear().catch(err => console.warn('[API] Failed to clear notifications:', err));
  return [];
}

// ================= BACKEND SYNC =================
export async function syncOrdersFromBackend() {
  try {
    const [fetchedOrders, fetchedSuppliers, fetchedUsers, fetchedNotifs] = await Promise.all([
      ordersApi.getAll().catch(() => null),
      suppliersApi.getAll().catch(() => null),
      usersApi.getAll().catch(() => null),
      notificationsApi.getAll().catch(() => null)
    ]);

    if (Array.isArray(fetchedOrders)) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(fetchedOrders));
      window.dispatchEvent(new Event('ordersUpdated'));
    }

    if (Array.isArray(fetchedSuppliers)) {
      localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(fetchedSuppliers));
      window.dispatchEvent(new Event('suppliersUpdated'));
    }

    if (Array.isArray(fetchedUsers)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(fetchedUsers));
      window.dispatchEvent(new Event('usersUpdated'));
    }

    if (Array.isArray(fetchedNotifs)) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(fetchedNotifs));
      window.dispatchEvent(new Event('notificationsUpdated'));
    }

    return true;
  } catch (err) {
    console.warn('[API] Failed syncing orders/suppliers from backend:', err);
    return false;
  }
}

// Auto-trigger sync on load in browser
if (typeof window !== 'undefined') {
  syncOrdersFromBackend();
}

// ================= USER ADDRESSES STORE =================

export function getUserAddresses() {
  try {
    const data = localStorage.getItem(ADDRESSES_KEY);
    return data ? JSON.parse(data) : defaultAddresses;
  } catch {
    return defaultAddresses;
  }
}

export function saveUserAddress(address) {
  const addresses = getUserAddresses();
  let updated;
  if (address.id) {
    updated = addresses.map(a => a.id === address.id ? { ...a, ...address } : a);
  } else {
    const newAddr = { ...address, id: Date.now() };
    if (newAddr.isDefault) {
      updated = [newAddr, ...addresses.map(a => ({ ...a, isDefault: false }))];
    } else {
      updated = [newAddr, ...addresses];
    }
  }
  localStorage.setItem(ADDRESSES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('addressesUpdated'));
  return updated;
}

export function deleteUserAddress(id) {
  const addresses = getUserAddresses();
  const updated = addresses.filter(a => a.id !== Number(id));
  localStorage.setItem(ADDRESSES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('addressesUpdated'));
  return updated;
}
