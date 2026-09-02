// src/components/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { defaultCategories } from '../utils/productStore';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="border-t border-gray-200/80 bg-[#F8F9FA] text-gray-900">

      {/* Sleek Dark Callout Banner */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#0F172A] p-6 sm:p-8 text-white shadow-sm border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-md">
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-amber-300">Exclusive Access</span>
              <h3 className="mt-0.5 text-xl sm:text-2xl font-bold tracking-tight text-white">
                Ready for Curated Releases?
              </h3>
              <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                Receive private invitations to limited-edition timepieces and member promotions directly from authorized boutiques.
              </p>
            </div>

            <div className="flex-1 max-w-md">
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full rounded-full bg-white py-2.5 pl-4 pr-24 text-xs text-gray-900 placeholder:text-gray-400 outline-none shadow-2xs"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[#111827] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-black"
                >
                  Join Privé
                </button>
              </form>
              {subscribed && (
                <p className="mt-1.5 text-xs text-emerald-400 font-medium">
                  ✓ Thank you for subscribing! Use code <strong>KRISHNA10</strong> for 10% off.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-2.5">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F172A] text-amber-300 font-serif font-bold text-sm shadow-2xs border border-amber-500/20">
                K
              </div>
              <span className="text-sm font-bold tracking-tight text-gray-950">
                Krishna <span className="text-[#B89758] font-bold">Accessories</span>
              </span>
            </Link>

            <p className="text-xs text-gray-600 leading-relaxed max-w-sm">
              Ahmedabad's premier destination for certified authentic luxury timepieces, handcrafted leather goods, and lifestyle essentials.
            </p>

            <div className="pt-1 text-xs text-gray-500 space-y-0.5">
              <p><strong className="text-gray-800">Flagship:</strong> Bodakdev, SG Highway, Ahmedabad 380054</p>
              <p><strong className="text-gray-800">Desk:</strong> +91 (079) 4000-5500 &bull; care@krishnaaccessories.com</p>
            </div>
          </div>

          {/* Departments */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-950 mb-2.5">
              Departments
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-600">
              {defaultCategories.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(cat)}`}
                    className="hover:text-black transition"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Assistance */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-950 mb-2.5">
              Client Support
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li>
                <Link to="/tracking" className="hover:text-black transition">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-black transition">
                  My Orders & Account
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-black transition">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-black transition">
                  FAQ & Authenticity
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-black transition">
                  Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals & Legal */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-950 mb-2.5">
              Portals & Legal
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li>
                <Link to="/supplier" className="hover:text-black transition font-semibold text-blue-700">
                  Vendor Partner Portal &rarr;
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-black transition font-semibold text-gray-900">
                  Admin Management &rarr;
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-black transition">
                  Our Heritage & Story
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-black transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-black transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="mt-8 border-t border-gray-200 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10.5px] text-gray-500">
          <p>&copy; {new Date().getFullYear()} Krishna Accessories Ltd. 100% Certified Authentic Guarantee.</p>

          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-800 text-[10px] font-bold hover:bg-black hover:text-white transition cursor-pointer">
              𝕏
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-800 text-[10px] font-bold hover:bg-black hover:text-white transition cursor-pointer">
              f
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-800 text-[10px] font-bold hover:bg-black hover:text-white transition cursor-pointer">
              in
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-800 text-[10px] font-bold hover:bg-black hover:text-white transition cursor-pointer">
              ig
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
}