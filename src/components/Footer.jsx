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
    <footer className="border-t border-[#4a4035] bg-[#211f1c] text-[#f4eee4]">

      {/* Sleek Dark Callout Banner */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#65513a] bg-[#302a24] p-6 text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-md">
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#d5ad70]">Exclusive Access</span>
              <h3 className="mt-0.5 text-xl sm:text-2xl font-bold tracking-tight text-white">
                Ready for Curated Releases?
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#c5b9aa]">
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
                  className="w-full rounded-full border border-[#ead7b9] bg-[#f7f0e5] py-2.5 pl-4 pr-24 text-xs text-[#29231d] placeholder:text-[#8d8172] outline-none shadow-2xs"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[#b8874e] px-4 py-1.5 text-xs font-semibold text-[#211f1c] transition hover:bg-[#d5ad70]"
                >
                  Join Privé
                </button>
              </form>
              {subscribed && (
                <p className="mt-1.5 text-xs font-medium text-[#9fd0ad]">
                  ✓ Thank you for subscribing! Use code <strong>KRISHNA10</strong> for 10% off.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl border-t border-[#403932] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-2.5">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d5ad70]/40 bg-[#b8874e] font-serif text-sm font-bold text-[#211f1c] shadow-2xs">
                K
              </div>
              <span className="text-sm font-bold tracking-tight text-[#f7f0e5]">
                Krishna <span className="font-bold text-[#d5ad70]">Accessories</span>
              </span>
            </Link>

            <p className="max-w-sm text-xs leading-relaxed text-[#b9aea0]">
              Ahmedabad's premier destination for certified authentic luxury timepieces, handcrafted leather goods, and lifestyle essentials.
            </p>

            <div className="space-y-0.5 pt-1 text-xs text-[#9f9487]">
              <p><strong className="text-[#e4c89c]">Flagship:</strong> Bodakdev, SG Highway, Ahmedabad 380054</p>
              <p><strong className="text-[#e4c89c]">Desk:</strong> +91 (079) 4000-5500 &bull; care@krishnaaccessories.com</p>
            </div>
          </div>

          {/* Departments */}
          <div>
            <h4 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-[#d5ad70]">
              Departments
            </h4>
            <ul className="space-y-1.5 text-xs text-[#b9aea0]">
              {defaultCategories.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(cat)}`}
                    className="transition hover:text-[#f2d7a7]"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Assistance */}
          <div>
            <h4 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-[#d5ad70]">
              Client Support
            </h4>
            <ul className="space-y-1.5 text-xs text-[#b9aea0]">
              <li>
                <Link to="/tracking" className="transition hover:text-[#f2d7a7]">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link to="/account" className="transition hover:text-[#f2d7a7]">
                  My Orders & Account
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="transition hover:text-[#f2d7a7]">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/faq" className="transition hover:text-[#f2d7a7]">
                  FAQ & Authenticity
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-[#f2d7a7]">
                  Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals & Legal */}
          <div>
            <h4 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-[#d5ad70]">
              Portals & Legal
            </h4>
            <ul className="space-y-1.5 text-xs text-[#b9aea0]">
              <li>
                <Link to="/supplier" className="font-semibold text-[#8fc4d1] transition hover:text-[#c6edf2]">
                  Vendor Partner Portal &rarr;
                </Link>
              </li>
              <li>
                <Link to="/admin" className="font-semibold text-[#f2d7a7] transition hover:text-white">
                  Admin Management &rarr;
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition hover:text-[#f2d7a7]">
                  Our Heritage & Story
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="transition hover:text-[#f2d7a7]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition hover:text-[#f2d7a7]">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[#403932] pt-5 text-[10.5px] text-[#9f9487] sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Krishna Accessories Ltd. 100% Certified Authentic Guarantee.</p>

          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#65513a] bg-[#302a24] text-[10px] font-bold text-[#d5ad70] transition hover:bg-[#b8874e] hover:text-[#211f1c]">
              𝕏
            </span>
            <span className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#65513a] bg-[#302a24] text-[10px] font-bold text-[#d5ad70] transition hover:bg-[#b8874e] hover:text-[#211f1c]">
              f
            </span>
            <span className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#65513a] bg-[#302a24] text-[10px] font-bold text-[#d5ad70] transition hover:bg-[#b8874e] hover:text-[#211f1c]">
              in
            </span>
            <span className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#65513a] bg-[#302a24] text-[10px] font-bold text-[#d5ad70] transition hover:bg-[#b8874e] hover:text-[#211f1c]">
              ig
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
}