// src/utils/orderStore.js

const ORDERS_KEY = 'krishna_platform_orders';
const SUPPLIERS_KEY = 'krishna_platform_suppliers';
const USERS_KEY = 'krishna_platform_users';
const NOTIFICATIONS_KEY = 'krishna_platform_notifications';
const ADDRESSES_KEY = 'krishna_user_addresses';

const defaultSuppliers = [
  {
    id: 1,
    name: "Apex Timepieces Ltd.",
    email: "apex@timepieces.com",
    phone: "+91 98765 43210",
    category: "Watches",
    status: "Active",
    joinedDate: "15 Jan 2026",
    rating: 4.9,
    productsCount: 6,
    totalEarnings: 148500,
    address: "Unit 402, Time Center, Ring Road, Surat, Gujarat"
  },
  {
    id: 2,
    name: "Global Gadgets Inc.",
    email: "info@globalgadgets.com",
    phone: "+91 98234 56789",
    category: "Electronics",
    status: "Active",
    joinedDate: "02 Feb 2026",
    rating: 4.8,
    productsCount: 8,
    totalEarnings: 284000,
    address: "Tech Park, SG Highway, Ahmedabad, Gujarat"
  },
  {
    id: 3,
    name: "Urban Footwear Co.",
    email: "contact@urbanfootwear.in",
    phone: "+91 97123 45678",
    category: "Shoes",
    status: "Active",
    joinedDate: "20 Feb 2026",
    rating: 4.7,
    productsCount: 4,
    totalEarnings: 89400,
    address: "Industrial Area Phase 2, Rajkot, Gujarat"
  },
  {
    id: 4,
    name: "Vogue Apparel India",
    email: "partner@vogueapparel.in",
    phone: "+91 99887 76655",
    category: "Clothes & Fashion",
    status: "Pending Approval",
    joinedDate: "28 Aug 2026",
    rating: 4.5,
    productsCount: 3,
    totalEarnings: 0,
    address: "Textile Market, Ring Road, Surat, Gujarat"
  },
  {
    id: 5,
    name: "Optima Tech Solutions",
    email: "sales@optimatech.in",
    phone: "+91 98990 11223",
    category: "Laptops",
    status: "Pending Approval",
    joinedDate: "30 Aug 2026",
    rating: 4.6,
    productsCount: 2,
    totalEarnings: 0,
    address: "Infocity, Gandhinagar, Gujarat"
  }
];

const defaultUsers = [
  {
    id: 1,
    name: "Rahul Patel",
    email: "rahul.patel@example.com",
    phone: "+91 98765 12345",
    role: "Customer",
    status: "Active",
    ordersCount: 3,
    totalSpent: 42997,
    joinedDate: "10 Feb 2026"
  },
  {
    id: 2,
    name: "Priya Shah",
    email: "priya.shah@example.com",
    phone: "+91 97234 56789",
    role: "Customer",
    status: "Active",
    ordersCount: 2,
    totalSpent: 13998,
    joinedDate: "18 Mar 2026"
  },
  {
    id: 3,
    name: "Amit Mehta",
    email: "amit.mehta@example.com",
    phone: "+91 96321 45678",
    role: "Customer",
    status: "Active",
    ordersCount: 1,
    totalSpent: 32999,
    joinedDate: "05 Apr 2026"
  },
  {
    id: 4,
    name: "Vikram Desai",
    email: "vikram@krishna.com",
    phone: "+91 99001 22334",
    role: "Supplier",
    status: "Active",
    ordersCount: 0,
    totalSpent: 0,
    joinedDate: "15 Jan 2026"
  },
  {
    id: 5,
    name: "Neha Trivedi",
    email: "neha.trivedi@example.com",
    phone: "+91 95432 10987",
    role: "Customer",
    status: "Blocked",
    ordersCount: 0,
    totalSpent: 0,
    joinedDate: "12 May 2026"
  }
];

const defaultOrders = [
  {
    id: "KA-98421",
    customer: {
      firstName: "Rahul",
      lastName: "Patel",
      email: "rahul.patel@example.com",
      phone: "9876512345",
      address: "B-402, Shivalik Heights, Judges Bungalow Road, Bodakdev",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380054"
    },
    items: [
      {
        id: 1,
        name: "Classic Luxury Automatic Watch",
        brand: "Titan",
        category: "Watches",
        price: 4999,
        quantity: 1,
        color: "Gold",
        supplier: "Apex Timepieces Ltd.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700"
      }
    ],
    subtotal: 4999,
    shipping: 0,
    discount: 0,
    total: 4999,
    paymentMethod: "Online Gateway (UPI / Card / NetBanking)",
    paymentStatus: "Paid",
    status: "Shipped",
    courier: "BlueDart Express",
    trackingNumber: "BD98234110IN",
    date: "31 Aug 2026",
    timeline: [
      { status: "Order Placed", date: "31 Aug 2026, 10:15 AM", done: true, completed: true, stage: "Order Placed", time: "31 Aug 2026, 10:15 AM", description: "Consignment received and verified" },
      { status: "Payment Confirmed", date: "31 Aug 2026, 10:16 AM", done: true, completed: true, stage: "Payment Confirmed", time: "31 Aug 2026, 10:16 AM", description: "256-bit SSL transaction verified" },
      { status: "Processing & Packing", date: "31 Aug 2026, 01:45 PM", done: true, completed: true, stage: "Processing & Packing", time: "31 Aug 2026, 01:45 PM", description: "Quality verified & tamper-proof sealed" },
      { status: "Shipped", date: "31 Aug 2026, 05:30 PM", done: true, completed: true, stage: "Shipped", time: "31 Aug 2026, 05:30 PM", description: "Handed over to BlueDart courier hub" },
      { status: "Out for Delivery", date: "Expected Tomorrow", done: false, completed: false, stage: "Out for Delivery", time: "Expected Tomorrow", description: "Courier courier dispatch for final mile" },
      { status: "Delivered", date: "Expected 02 Sep 2026", done: false, completed: false, stage: "Delivered", time: "Expected 02 Sep 2026", description: "Delivery to customer" }
    ]
  },
  {
    id: "KA-98420",
    customer: {
      firstName: "Priya",
      lastName: "Shah",
      email: "priya.shah@example.com",
      phone: "9723456789",
      address: "12, Royal Palms Society, Alkapuri",
      city: "Vadodara",
      state: "Gujarat",
      pincode: "390007"
    },
    items: [
      {
        id: 2,
        name: "Premium Chronograph Royal Blue",
        brand: "Fossil",
        category: "Watches",
        price: 8999,
        quantity: 1,
        color: "Silver",
        supplier: "Apex Timepieces Ltd.",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=700"
      }
    ],
    subtotal: 8999,
    shipping: 0,
    discount: 0,
    total: 8999,
    paymentMethod: "Online Gateway (UPI / Card / NetBanking)",
    paymentStatus: "Paid",
    status: "Processing",
    courier: "Delhivery",
    trackingNumber: "DL88912304IN",
    date: "30 Aug 2026",
    timeline: [
      { status: "Order Placed", date: "30 Aug 2026, 02:20 PM", done: true, completed: true, stage: "Order Placed", time: "30 Aug 2026, 02:20 PM", description: "Consignment placed by customer" },
      { status: "Payment Confirmed", date: "30 Aug 2026, 02:21 PM", done: true, completed: true, stage: "Payment Confirmed", time: "30 Aug 2026, 02:21 PM", description: "UPI payment received successfully" },
      { status: "Processing & Packing", date: "30 Aug 2026, 04:10 PM", done: true, completed: true, stage: "Processing & Packing", time: "30 Aug 2026, 04:10 PM", description: "Under inspection at vendor facility" },
      { status: "Shipped", date: "Pending handover", done: false, completed: false, stage: "Shipped", time: "Pending handover", description: "Awaiting courier pickup" },
      { status: "Out for Delivery", date: "--", done: false, completed: false, stage: "Out for Delivery", time: "--", description: "Pending dispatch" },
      { status: "Delivered", date: "--", done: false, completed: false, stage: "Delivered", time: "--", description: "Pending delivery" }
    ]
  },
  {
    id: "KA-98419",
    customer: {
      firstName: "Amit",
      lastName: "Mehta",
      email: "amit.mehta@example.com",
      phone: "9632145678",
      address: "405, Silicon Valley, Near Pal RTO, Adajan",
      city: "Surat",
      state: "Gujarat",
      pincode: "395009"
    },
    items: [
      {
        id: 14,
        name: "Galaxy S26 Ultra 5G (AI Titanium)",
        brand: "Samsung",
        category: "Mobiles",
        price: 114999,
        quantity: 1,
        color: "Titanium Black",
        supplier: "Global Gadgets Inc.",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700"
      }
    ],
    subtotal: 114999,
    shipping: 0,
    discount: 0,
    total: 114999,
    paymentMethod: "Online (Credit Card)",
    paymentStatus: "Paid",
    status: "Delivered",
    courier: "BlueDart Express",
    trackingNumber: "BD77123984IN",
    date: "27 Aug 2026",
    timeline: [
      { status: "Order Placed", date: "27 Aug 2026, 11:00 AM", done: true, completed: true, stage: "Order Placed", time: "27 Aug 2026, 11:00 AM", description: "Order received" },
      { status: "Payment Confirmed", date: "27 Aug 2026, 11:02 AM", done: true, completed: true, stage: "Payment Confirmed", time: "27 Aug 2026, 11:02 AM", description: "Card authorized" },
      { status: "Processing & Packing", date: "27 Aug 2026, 02:30 PM", done: true, completed: true, stage: "Processing & Packing", time: "27 Aug 2026, 02:30 PM", description: "Secured in high-security packaging" },
      { status: "Shipped", date: "28 Aug 2026, 09:15 AM", done: true, completed: true, stage: "Shipped", time: "28 Aug 2026, 09:15 AM", description: "Dispatched via air express" },
      { status: "Out for Delivery", date: "29 Aug 2026, 10:30 AM", done: true, completed: true, stage: "Out for Delivery", time: "29 Aug 2026, 10:30 AM", description: "Out with delivery associate" },
      { status: "Delivered", date: "29 Aug 2026, 03:45 PM", done: true, completed: true, stage: "Delivered", time: "29 Aug 2026, 03:45 PM", description: "Delivered & signed by recipient" }
    ]
  }
];

const defaultNotifications = [
  {
    id: 1,
    title: "Welcome to Krishna Accessories",
    message: "Thank you for choosing Ahmedabad's premier curated boutique for authenticated timepieces and essentials.",
    date: "Just now",
    unread: true,
    type: "info"
  },
  {
    id: 2,
    title: "Voucher Code Active: KRISHNA10",
    message: "Enjoy 10% instant discount on orders over ₹1,000 using promo code KRISHNA10.",
    date: "1 hour ago",
    unread: true,
    type: "promo"
  },
  {
    id: 3,
    title: "Consignment KA-98421 Dispatched",
    message: "Your Titan Luxury Watch order has been dispatched via BlueDart Express (AWB: BD98234110IN).",
    date: "31 Aug 2026",
    unread: false,
    type: "order"
  }
];

const defaultAddresses = [];

// ================= ORDERS STORE =================

export function getOrders() {
  const data = localStorage.getItem(ORDERS_KEY);
  if (!data) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(defaultOrders));
    return defaultOrders;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultOrders;
  } catch {
    return defaultOrders;
  }
}

export function getOrderById(id) {
  if (!id) return null;
  const orders = getOrders();
  const normalizedId = id.toString().trim().toUpperCase();
  return orders.find(o => o.id.toUpperCase() === normalizedId) || null;
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
    total: orderData.total || (orderData.subtotal + orderData.shipping - (orderData.discount || 0)),
    paymentMethod: orderData.paymentMethod || "Online Gateway (UPI / Card)",
    paymentStatus: orderData.paymentMethod?.includes("Cash on Delivery") ? "Pending (COD)" : "Paid",
    status: "Confirmed",
    courier: "BlueDart Express",
    trackingNumber: `BD${Math.floor(10000000 + Math.random() * 90000000)}IN`,
    date: dateFormatted,
    timeline: [
      { status: "Order Placed", date: `${dateFormatted}, ${timeFormatted}`, done: true, completed: true, stage: "Order Placed", time: `${dateFormatted}, ${timeFormatted}`, description: "Consignment created & verified" },
      { status: "Payment Confirmed", date: `${dateFormatted}, ${timeFormatted}`, done: true, completed: true, stage: "Payment Confirmed", time: `${dateFormatted}, ${timeFormatted}`, description: "Payment approved" },
      { status: "Processing & Packing", date: "In Progress", done: true, completed: true, stage: "Processing & Packing", time: "In Progress", description: "Boutique inspection & luxury packaging" },
      { status: "Shipped", date: "Pending courier pickup", done: false, completed: false, stage: "Shipped", time: "Pending", description: "Awaiting courier handover" },
      { status: "Out for Delivery", date: "Pending dispatch", done: false, completed: false, stage: "Out for Delivery", time: "Pending", description: "Final mile dispatch" },
      { status: "Delivered", date: "Expected in 2-3 business days", done: false, completed: false, stage: "Delivered", time: "Pending", description: "Doorstep delivery" }
    ]
  };

  const updatedOrders = [newOrder, ...orders];
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
  
  // Update or add user to Platform Users Registry for Admin
  try {
    const users = getUsers();
    const customerEmail = customerData.email.toLowerCase();
    const customerFullName = `${customerData.firstName} ${customerData.lastName}`.trim() || 'Client';
    
    const existingUserIndex = users.findIndex(u => u.email?.toLowerCase() === customerEmail);
    if (existingUserIndex >= 0) {
      users[existingUserIndex].ordersCount = (users[existingUserIndex].ordersCount || 0) + 1;
      users[existingUserIndex].totalSpent = (users[existingUserIndex].totalSpent || 0) + newOrder.total;
      if (customerData.phone && !users[existingUserIndex].phone) {
        users[existingUserIndex].phone = customerData.phone;
      }
    } else if (customerEmail) {
      users.unshift({
        id: Date.now(),
        name: customerFullName,
        email: customerData.email,
        phone: customerData.phone || '+91 98765 00000',
        role: "Customer",
        status: "Active",
        ordersCount: 1,
        totalSpent: newOrder.total,
        joinedDate: dateFormatted
      });
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    window.dispatchEvent(new Event('usersUpdated'));
  } catch (err) {
    console.error("Failed to sync customer profile:", err);
  }

  // Also add a notification for the customer & admin
  addNotification({
    title: `Order Placed: ${orderNumber}`,
    message: `Thank you ${customerData.firstName || ''}! Your order for ₹${newOrder.total.toLocaleString('en-IN')} has been confirmed.`,
    type: "order"
  });

  window.dispatchEvent(new Event('ordersUpdated'));
  return newOrder;
}

export function updateOrderStatus(orderId, nextStatus, courierInfo = {}) {
  const orders = getOrders();
  const updated = orders.map(order => {
    if (order.id.toUpperCase() === orderId.toUpperCase()) {
      const now = new Date();
      const timeStr = `${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
      
      const newTimeline = order.timeline ? order.timeline.map(step => {
        if (nextStatus === "Processing" && (step.status === "Order Placed" || step.status === "Payment Confirmed" || step.status === "Processing & Packing")) {
          return { ...step, done: true, completed: true };
        }
        if (nextStatus === "Shipped" && (step.status === "Order Placed" || step.status === "Payment Confirmed" || step.status === "Processing & Packing" || step.status === "Shipped")) {
          return { ...step, done: true, completed: true, date: step.status === "Shipped" ? timeStr : step.date, time: step.status === "Shipped" ? timeStr : step.time };
        }
        if (nextStatus === "Out for Delivery" && step.status !== "Delivered") {
          return { ...step, done: true, completed: true, date: step.status === "Out for Delivery" ? timeStr : step.date, time: step.status === "Out for Delivery" ? timeStr : step.time };
        }
        if (nextStatus === "Delivered") {
          return { ...step, done: true, completed: true, date: step.status === "Delivered" ? timeStr : step.date, time: step.status === "Delivered" ? timeStr : step.time };
        }
        return step;
      }) : [];

      return {
        ...order,
        status: nextStatus,
        courier: courierInfo.courier || order.courier,
        trackingNumber: courierInfo.trackingNumber || order.trackingNumber,
        timeline: newTimeline
      };
    }
    return order;
  });

  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('ordersUpdated'));
  return updated;
}

export function cancelOrder(orderId, reason = "Customer request", cancelledBy = "Customer") {
  const orders = getOrders();
  const now = new Date();
  const dateFormatted = `${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

  const updated = orders.map(order => {
    if (order.id.toUpperCase() === orderId.toUpperCase()) {
      const isPaid = order.paymentStatus === 'Paid';
      return {
        ...order,
        status: "Cancelled",
        paymentStatus: isPaid ? "Refund Initiated" : "Cancelled",
        cancellation: {
          reason: reason || "Cancelled upon request",
          date: dateFormatted,
          cancelledBy: cancelledBy
        },
        timeline: [
          ...(order.timeline ? order.timeline.filter(t => t.done) : []),
          {
            status: "Cancelled",
            date: dateFormatted,
            done: true,
            completed: true,
            stage: "Cancelled",
            time: dateFormatted,
            description: `Order cancelled by ${cancelledBy}. Reason: ${reason}`
          }
        ]
      };
    }
    return order;
  });

  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));

  addNotification({
    title: `Order Cancelled: ${orderId}`,
    message: `Order ${orderId} has been successfully cancelled. ${reason ? `Reason: ${reason}` : ''}`,
    type: "order"
  });

  window.dispatchEvent(new Event('ordersUpdated'));
  return updated;
}

export function requestReturn(orderId, returnData = {}) {
  const orders = getOrders();
  const now = new Date();
  const dateFormatted = `${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

  const updated = orders.map(order => {
    if (order.id.toUpperCase() === orderId.toUpperCase()) {
      return {
        ...order,
        status: "Return Requested",
        returnRequest: {
          reason: returnData.reason || "Defective or Damaged",
          comments: returnData.comments || "",
          refundPreference: returnData.refundPreference || "Original Payment Method",
          upiId: returnData.upiId || "",
          bankDetails: returnData.bankDetails || "",
          condition: returnData.condition || "Unopened / Original Box",
          requestDate: dateFormatted,
          status: "Pending Approval"
        },
        timeline: [
          ...(order.timeline || []),
          {
            status: "Return Requested",
            date: dateFormatted,
            done: true,
            completed: true,
            stage: "Return Requested",
            time: dateFormatted,
            description: `Return initiated by customer: ${returnData.reason || 'General Return'}`
          }
        ]
      };
    }
    return order;
  });

  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));

  addNotification({
    title: `Return Requested: ${orderId}`,
    message: `Return request for order ${orderId} has been submitted and is under verification.`,
    type: "order"
  });

  window.dispatchEvent(new Event('ordersUpdated'));
  return updated;
}

export function processReturnStatus(orderId, newStatus, resolution = {}) {
  const orders = getOrders();
  const now = new Date();
  const dateFormatted = `${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

  const updated = orders.map(order => {
    if (order.id.toUpperCase() === orderId.toUpperCase()) {
      const isRefunded = newStatus === 'Refunded';
      const refundAmount = resolution.refundAmount || order.total || 0;
      const refundTxn = resolution.transactionId || `REF-${Math.floor(100000 + Math.random() * 900000)}`;

      return {
        ...order,
        status: newStatus,
        paymentStatus: isRefunded ? "Refunded" : order.paymentStatus,
        returnRequest: {
          ...(order.returnRequest || {}),
          status: newStatus,
          adminNotes: resolution.notes || "",
          resolvedDate: dateFormatted
        },
        refundDetails: isRefunded ? {
          amount: refundAmount,
          date: dateFormatted,
          transactionId: refundTxn,
          refundMode: order.returnRequest?.refundPreference || "Direct Refund"
        } : order.refundDetails,
        timeline: [
          ...(order.timeline || []),
          {
            status: newStatus,
            date: dateFormatted,
            done: true,
            completed: true,
            stage: newStatus,
            time: dateFormatted,
            description: isRefunded 
              ? `Refund of ₹${refundAmount.toLocaleString('en-IN')} issued. Txn ID: ${refundTxn}`
              : `Return status updated to ${newStatus}. Notes: ${resolution.notes || 'Verified'}`
          }
        ]
      };
    }
    return order;
  });

  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));

  addNotification({
    title: `Return Update: ${orderId} (${newStatus})`,
    message: newStatus === 'Refunded'
      ? `Refund of ₹${(resolution.refundAmount || 0).toLocaleString('en-IN')} for order ${orderId} has been credited.`
      : `Order ${orderId} return status updated to ${newStatus}.`,
    type: "order"
  });

  window.dispatchEvent(new Event('ordersUpdated'));
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
  const data = localStorage.getItem(SUPPLIERS_KEY);
  if (!data) {
    localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(defaultSuppliers));
    return defaultSuppliers;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultSuppliers;
  } catch {
    return defaultSuppliers;
  }
}

export function approveSupplier(id) {
  const suppliers = getSuppliers();
  const updated = suppliers.map(s => s.id === Number(id) ? { ...s, status: "Active" } : s);
  localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('suppliersUpdated'));
  return updated;
}

export function toggleSupplierStatus(id, newStatus) {
  const suppliers = getSuppliers();
  const updated = suppliers.map(s => s.id === Number(id) ? { ...s, status: newStatus } : s);
  localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('suppliersUpdated'));
  return updated;
}

export function addSupplier(supplier) {
  const suppliers = getSuppliers();
  const newSupplier = {
    ...supplier,
    id: Date.now(),
    joinedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: supplier.status || "Pending Approval",
    rating: 5.0,
    productsCount: 0,
    totalEarnings: 0
  };
  const updated = [newSupplier, ...suppliers];
  localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('suppliersUpdated'));
  return updated;
}

// ================= USERS STORE =================

export function getUsers() {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultUsers;
  } catch {
    return defaultUsers;
  }
}

export function toggleUserStatus(id, newStatus) {
  const users = getUsers();
  const updated = users.map(u => u.id === Number(id) ? { ...u, status: newStatus } : u);
  localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('usersUpdated'));
  return updated;
}

// ================= NOTIFICATIONS STORE =================

export function getNotifications() {
  try {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    return data ? JSON.parse(data) : defaultNotifications;
  } catch {
    return defaultNotifications;
  }
}

export function addNotification(notif) {
  const current = getNotifications();
  const newNotif = {
    id: Date.now(),
    title: notif.title,
    message: notif.message,
    date: "Just now",
    unread: true,
    type: notif.type || "info"
  };
  const updated = [newNotif, ...current];
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('notificationsUpdated'));
  return updated;
}

export function markNotificationRead(id) {
  const current = getNotifications();
  const updated = current.map(n => n.id === Number(id) ? { ...n, unread: false } : n);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('notificationsUpdated'));
  return updated;
}

export function markAllNotificationsRead() {
  const current = getNotifications();
  const updated = current.map(n => ({ ...n, unread: false }));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('notificationsUpdated'));
  return updated;
}

export function clearNotifications() {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
  window.dispatchEvent(new Event('notificationsUpdated'));
  return [];
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
