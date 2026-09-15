// src/utils/orderStore.js
// 100% Live Backend Store (Pure In-Memory Live Sync - No Local Storage Caching)
import { ordersApi, suppliersApi, usersApi, notificationsApi } from './api';

// In-Memory Live Data States
let liveOrders = [];
let liveSuppliers = [];
let liveUsers = [];
let liveNotifications = [];
let isInitialFetchDone = false;
let isFetching = false;

// ================= ORDERS STORE =================

export function getOrders() {
  if (!isInitialFetchDone && !isFetching && typeof window !== 'undefined') {
    syncOrdersFromBackend();
  }
  return liveOrders;
}

export function getOrderById(id) {
  if (!id) return null;
  const normalizedId = id.toString().trim().toUpperCase();
  return liveOrders.find(o => o?.id != null && String(o.id).trim().toUpperCase() === normalizedId) || null;
}

export function createOrder(orderData) {
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

  liveOrders = [newOrder, ...liveOrders];
  window.dispatchEvent(new Event('ordersUpdated'));

  // Sync directly to Live FastAPI Backend
  ordersApi.create(newOrder).catch(err => console.warn('[API] Failed to create order in backend:', err));

  // Auto-record new user in live users store
  if (customerData.email) {
    const existingUser = liveUsers.find(u => u.email?.toLowerCase() === customerData.email.toLowerCase());
    if (existingUser) {
      liveUsers = liveUsers.map(u =>
        u.email?.toLowerCase() === customerData.email.toLowerCase()
          ? {
            ...u,
            ordersCount: (u.ordersCount || 0) + 1,
            totalSpent: (u.totalSpent || 0) + (newOrder.total || 0)
          }
          : u
      );
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
      liveUsers = [newUser, ...liveUsers];
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

  liveOrders = liveOrders.map(order => {
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

  window.dispatchEvent(new Event('ordersUpdated'));

  // Sync to Live FastAPI Backend
  ordersApi.updateStatus(orderId, nextStatus, courierInfo.note || '').catch(err => console.warn('[API] Failed to update order status:', err));

  return liveOrders;
}

export function cancelOrder(orderId, reason = "Customer request", cancelledBy = "Customer") {
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

  liveOrders = liveOrders.map(order => {
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

  window.dispatchEvent(new Event('ordersUpdated'));

  // Sync to Live FastAPI Backend
  ordersApi.cancel(orderId, reason).catch(err => console.warn('[API] Failed to cancel order in backend:', err));

  return liveOrders;
}

export function requestReturn(orderId, returnData = {}) {
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

  liveOrders = liveOrders.map(order => {
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

  window.dispatchEvent(new Event('ordersUpdated'));

  // Sync to Live FastAPI Backend
  ordersApi.returnOrder(orderId, returnDetails, 'Return Requested').catch(err => console.warn('[API] Failed to request return in backend:', err));

  return liveOrders;
}

export function processReturnStatus(orderId, newStatus, resolution = {}) {
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

  liveOrders = liveOrders.map(order => {
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

  window.dispatchEvent(new Event('ordersUpdated'));

  // Sync to Live FastAPI Backend
  ordersApi.returnOrder(orderId, resolution, newStatus).catch(err => console.warn('[API] Failed to process return status:', err));

  return liveOrders;
}

export function getSupplierOrders(supplierName) {
  if (!supplierName) return liveOrders;
  return liveOrders.filter(o =>
    o.items && o.items.some(item => !item.supplier || item.supplier.toLowerCase() === supplierName.toLowerCase())
  );
}

// ================= SUPPLIERS STORE =================

export function getSuppliers() {
  if (liveSuppliers.length === 0 && !isFetching && typeof window !== 'undefined') {
    syncOrdersFromBackend();
  }
  return liveSuppliers;
}

export function approveSupplier(id) {
  liveSuppliers = liveSuppliers.map(s => s.id === Number(id) ? { ...s, status: "Active" } : s);
  window.dispatchEvent(new Event('suppliersUpdated'));
  suppliersApi.update(id, { status: "Active" }).catch(err => console.warn('[API] Failed to approve supplier:', err));
  return liveSuppliers;
}

export function toggleSupplierStatus(id, newStatus) {
  liveSuppliers = liveSuppliers.map(s => s.id === Number(id) ? { ...s, status: newStatus } : s);
  window.dispatchEvent(new Event('suppliersUpdated'));
  suppliersApi.update(id, { status: newStatus }).catch(err => console.warn('[API] Failed to toggle supplier status:', err));
  return liveSuppliers;
}

export function addSupplier(supplier) {
  const newSupplier = {
    ...supplier,
    id: supplier.id || Date.now(),
    joinedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: supplier.status || "Pending Approval",
    rating: 5.0,
    productsCount: 0,
    totalEarnings: 0
  };
  liveSuppliers = [newSupplier, ...liveSuppliers];
  window.dispatchEvent(new Event('suppliersUpdated'));
  suppliersApi.create(newSupplier).catch(err => console.warn('[API] Failed to add supplier:', err));
  return liveSuppliers;
}

// ================= USERS STORE =================

export function getUsers() {
  if (liveUsers.length === 0 && !isFetching && typeof window !== 'undefined') {
    syncOrdersFromBackend();
  }
  return liveUsers;
}

export function toggleUserStatus(id, newStatus) {
  liveUsers = liveUsers.map(u => u.id === Number(id) ? { ...u, status: newStatus } : u);
  window.dispatchEvent(new Event('usersUpdated'));
  usersApi.update(id, { status: newStatus }).catch(err => console.warn('[API] Failed to update user status:', err));
  return liveUsers;
}

// ================= NOTIFICATIONS STORE =================

export function getNotifications() {
  if (liveNotifications.length === 0 && !isFetching && typeof window !== 'undefined') {
    syncOrdersFromBackend();
  }
  return liveNotifications;
}

export function addNotification(notif) {
  const newNotif = {
    id: notif.id || Date.now(),
    title: notif.title,
    message: notif.message,
    date: "Just now",
    unread: true,
    type: notif.type || "info"
  };
  liveNotifications = [newNotif, ...liveNotifications];
  window.dispatchEvent(new Event('notificationsUpdated'));
  notificationsApi.add(newNotif).catch(err => console.warn('[API] Failed to add notification:', err));
  return liveNotifications;
}

export function markNotificationRead(id) {
  liveNotifications = liveNotifications.map(n => n.id === Number(id) ? { ...n, unread: false } : n);
  window.dispatchEvent(new Event('notificationsUpdated'));
  notificationsApi.markRead(id).catch(err => console.warn('[API] Failed to mark notification read:', err));
  return liveNotifications;
}

export function markAllNotificationsRead() {
  liveNotifications = liveNotifications.map(n => ({ ...n, unread: false }));
  window.dispatchEvent(new Event('notificationsUpdated'));
  notificationsApi.markAllRead().catch(err => console.warn('[API] Failed to mark all notifications read:', err));
  return liveNotifications;
}

export function clearNotifications() {
  liveNotifications = [];
  window.dispatchEvent(new Event('notificationsUpdated'));
  notificationsApi.clear().catch(err => console.warn('[API] Failed to clear notifications:', err));
  return [];
}

// ================= BACKEND SYNC =================
export async function syncOrdersFromBackend() {
  if (isFetching) return true;
  isFetching = true;
  try {
    const [fetchedOrders, fetchedSuppliers, fetchedUsers, fetchedNotifs] = await Promise.all([
      ordersApi.getAll().catch(() => null),
      suppliersApi.getAll().catch(() => null),
      usersApi.getAll().catch(() => null),
      notificationsApi.getAll().catch(() => null)
    ]);

    if (Array.isArray(fetchedOrders)) {
      liveOrders = fetchedOrders;
      window.dispatchEvent(new Event('ordersUpdated'));
    }

    if (Array.isArray(fetchedSuppliers)) {
      liveSuppliers = fetchedSuppliers;
      window.dispatchEvent(new Event('suppliersUpdated'));
    }

    if (Array.isArray(fetchedUsers)) {
      liveUsers = fetchedUsers;
      window.dispatchEvent(new Event('usersUpdated'));
    }

    if (Array.isArray(fetchedNotifs)) {
      liveNotifications = fetchedNotifs;
      window.dispatchEvent(new Event('notificationsUpdated'));
    }

    isInitialFetchDone = true;
    return true;
  } catch (err) {
    console.warn('[API] Failed syncing orders/suppliers from backend:', err);
    return false;
  } finally {
    isFetching = false;
  }
}

// Auto-trigger sync on load in browser
if (typeof window !== 'undefined') {
  syncOrdersFromBackend();
}

// ================= USER ADDRESSES STORE =================
let liveAddresses = [];

export function getUserAddresses() {
  return liveAddresses;
}

export function saveUserAddress(address) {
  if (address.id) {
    liveAddresses = liveAddresses.map(a => a.id === address.id ? { ...a, ...address } : a);
  } else {
    const newAddr = { ...address, id: Date.now() };
    if (newAddr.isDefault) {
      liveAddresses = [newAddr, ...liveAddresses.map(a => ({ ...a, isDefault: false }))];
    } else {
      liveAddresses = [newAddr, ...liveAddresses];
    }
  }
  window.dispatchEvent(new Event('addressesUpdated'));
  return liveAddresses;
}

export function deleteUserAddress(id) {
  liveAddresses = liveAddresses.filter(a => a.id !== Number(id));
  window.dispatchEvent(new Event('addressesUpdated'));
  return liveAddresses;
}
