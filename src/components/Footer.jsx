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
    <footer className="border-t border-zinc-200/80 bg-[#F4F4F5] text-zinc-900 mt-16">

      {/* Sleek Obsidian Newsletter Callout Banner */}
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#121316] p-6 sm:p-8 text-white shadow-xs border border-zinc-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-md">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-300">
                Exclusive Member Privé
              </span>
              <h3 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                Curated Private Releases
              </h3>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Receive private invitations to limited-edition horology releases, boutique member events, and authenticated consignment alerts.
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
                  className="w-full rounded-lg bg-zinc-900 border border-zinc-700/80 py-2.5 pl-4 pr-28 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-zinc-400 transition"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-white px-4 py-1.5 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-100 cursor-pointer shadow-2xs"
                >
                  Join Privé
                </button>
              </form>
              {subscribed && (
                <p className="mt-2 text-xs text-emerald-400 font-medium animate-fade-in">
                  ✓ Thank you for subscribing. Use code <strong className="font-mono">KRISHNA10</strong> for 10% off your next consignment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links Grid */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-amber-300 font-serif font-bold text-xs shadow-xs border border-amber-500/25">
                K
              </div>
              <span className="text-sm font-bold tracking-tight text-zinc-950">
                Krishna <span className="text-[#B89035] font-semibold">Accessories</span>
              </span>
            </Link>

            <p className="text-xs text-zinc-600 leading-relaxed max-w-sm">
              Gujarat's authorized sanctuary for certified authentic luxury timepieces, handcrafted leather accessories, and curated lifestyle essentials.
            </p>

            <div className="pt-2 text-xs text-zinc-500 space-y-1">
              <p><strong className="text-zinc-800">Flagship:</strong> Bodakdev, SG Highway, Ahmedabad 380054</p>
              <p><strong className="text-zinc-800">Concierge Desk:</strong> +91 (079) 4000-5500 &bull; care@krishnaaccessories.com</p>
            </div>
          </div>

          {/* Departments */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-900 mb-3">
              Departments
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600">
              {defaultCategories.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(cat)}`}
                    className="hover:text-zinc-950 transition"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Assistance */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-900 mb-3">
              Client Support
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li>
                <Link to="/tracking" className="hover:text-zinc-950 transition">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-zinc-950 transition">
                  My Orders & Account
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-zinc-950 transition">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-zinc-950 transition">
                  FAQ & Authenticity
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-zinc-950 transition">
                  Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals & Legal */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-900 mb-3">
              Portals & Governance
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li>
                <Link to="/supplier" className="hover:text-zinc-950 transition font-semibold text-blue-700">
                  Vendor Partner Portal &rarr;
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-zinc-950 transition font-semibold text-zinc-900">
                  Admin Console &rarr;
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-zinc-950 transition">
                  Our Heritage & Mission
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-zinc-950 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-zinc-950 transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="mt-10 border-t border-zinc-200/90 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Krishna Accessories Ltd. 100% Certified Authentic Guarantee.</p>

          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-200/80 text-zinc-800 text-[10px] font-bold hover:bg-zinc-900 hover:text-white transition cursor-pointer">
              𝕏
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-200/80 text-zinc-800 text-[10px] font-bold hover:bg-zinc-900 hover:text-white transition cursor-pointer">
              f
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-200/80 text-zinc-800 text-[10px] font-bold hover:bg-zinc-900 hover:text-white transition cursor-pointer">
              in
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-200/80 text-zinc-800 text-[10px] font-bold hover:bg-zinc-900 hover:text-white transition cursor-pointer">
              ig
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
}