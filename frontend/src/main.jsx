import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Purge all legacy database keys from localStorage to ensure purely live backend operation
const LEGACY_STORAGE_KEYS = [
  'krishna_admin_products',
  'krishna_categories',
  'krishna_brands',
  'krishna_media_assets',
  'krishna_permissions_matrix',
  'krishna_platform_notifications',
  'krishna_platform_orders',
  'krishna_platform_suppliers',
  'krishna_platform_users',
  'krishna_product_variants',
  'krishna_promotions',
  'krishna_roles',
  'krishna_shipping_carriers',
  'krishna_subcategories',
  'krishna_system_config',
  'krishna_product_reviews',
  'krishna_wishlist',
  'krishna_user_addresses',
  'krishna_active_otps',
  'krishna_sent_emails',
  'krishna_otp_last_resend'
];

if (typeof window !== 'undefined' && window.localStorage) {
  LEGACY_STORAGE_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (_) {}
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);