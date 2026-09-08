// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser, isAdmin, isSupplier } from '../utils/auth';

export default function ProtectedRoute({ children, roleRequired }) {
  const location = useLocation();
  const user = getCurrentUser();
  const hasAdmin = isAdmin();
  const hasSupplier = isSupplier();

  // 1. Admin route protection
  if (roleRequired === 'admin') {
    if (!hasAdmin) {
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

  // 2. Supplier route protection
  if (roleRequired === 'supplier') {
    if (!hasSupplier) {
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

  // 3. Customer route protection (cart, checkout, wishlist, account)
  if (!user && !hasAdmin && !hasSupplier) {
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
