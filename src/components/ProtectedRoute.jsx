// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser, isAdmin, isSupplier } from '../utils/auth';

export default function ProtectedRoute({ children, roleRequired }) {
  const location = useLocation();
  const user = getCurrentUser();

  // 1. If not logged in at all, redirect to /login
  if (!user) {
    const message = roleRequired === 'admin'
      ? 'Administrator login required to access Admin Control Panel.'
      : roleRequired === 'supplier'
      ? 'Supplier login required to access Vendor Portal. Please enter your credentials.'
      : 'Please sign in to access this page.';

    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message,
          requiredRole: roleRequired
        }}
        replace
      />
    );
  }

  // 2. If admin access is required but user is not admin
  if (roleRequired === 'admin' && !isAdmin()) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: 'Access restricted: Administrator credentials (admin@krishna.com / admin123) required.',
          requiredRole: 'admin'
        }}
        replace
      />
    );
  }

  // 3. If supplier access is required but user is not supplier (nor admin)
  if (roleRequired === 'supplier' && !isSupplier()) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: 'Access restricted: Supplier credentials (supplier@krishna.com / supplier123) required.',
          requiredRole: 'supplier'
        }}
        replace
      />
    );
  }

  // 4. Authorized, render component
  return children;
}
