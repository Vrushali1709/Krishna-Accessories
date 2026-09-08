// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser, isAdmin, isSupplier, getCustomerUser } from '../utils/auth';

export default function ProtectedRoute({ children, roleRequired }) {
  const location = useLocation();

  // 1. If admin access is required
  if (roleRequired === 'admin') {
    if (!isAdmin()) {
      return (
        <Navigate
          to="/login"
          state={{
            from: location,
            message: 'Admin ID & Password required. Please sign in as Administrator.',
            requiredRole: 'admin'
          }}
          replace
        />
      );
    }
    return children;
  }

  // 2. If supplier access is required
  if (roleRequired === 'supplier') {
    if (!isSupplier()) {
      return (
        <Navigate
          to="/login"
          state={{
            from: location,
            message: 'Supplier ID & Password required. Please sign in as Vendor Partner.',
            requiredRole: 'supplier'
          }}
          replace
        />
      );
    }
    return children;
  }

  // 3. Customer / General Protected Routes (/account, /cart, /checkout, /wishlist)
  const user = getCustomerUser() || getCurrentUser();
  if (!user) {
    let message = 'Please sign in with your credentials to access this page.';
    if (location.pathname === '/wishlist') {
      message = 'Please sign in to access and manage your Wishlist.';
    } else if (location.pathname === '/cart') {
      message = 'Please sign in to view and access your Shopping Bag.';
    } else if (location.pathname === '/checkout') {
      message = 'Please sign in to proceed with Checkout.';
    } else if (location.pathname === '/account') {
      message = 'Please sign in to access your Account & Orders.';
    }

    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message,
          requiredRole: 'customer'
        }}
        replace
      />
    );
  }

  // 4. Authorized, render component
  return children;
}

