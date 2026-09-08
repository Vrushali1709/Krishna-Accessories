// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser, isAdmin, isSupplier } from '../utils/auth';

export default function ProtectedRoute({ children, roleRequired }) {
  const location = useLocation();
  const user = getCurrentUser();

  // 1. If not logged in at all, redirect to /login
  if (!user) {
    let message = 'Please sign in with your credentials to access this page.';
    if (roleRequired === 'admin') {
      message = 'Admin ID and Password required to access Admin Management.';
    } else if (roleRequired === 'supplier') {
      message = 'Supplier ID and Password required to access Vendor Partner Portal.';
    } else if (location.pathname === '/wishlist') {
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
          requiredRole: roleRequired || 'customer'
        }}
        replace
      />
    );
  }

  // 2. If admin access is required but user is not logged in as admin
  if (roleRequired === 'admin' && !isAdmin()) {
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

  // 3. If supplier access is required but user is not logged in as supplier (nor admin)
  if (roleRequired === 'supplier' && !isSupplier()) {
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

  // 4. Authorized, render component
  return children;
}
