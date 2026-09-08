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
    <>
      {/* 1. Standalone Newsletter / Curated Releases Section (Outside Footer) */}
      <section className="bg-gradient-to-b from-gray-50/80 to-white py-12 sm:py-16 border-t border-gray-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200/80 bg-white p-7 sm:p-10 lg:p-12 shadow-[0_12px_36px_rgba(0,0,0,0.05)] relative overflow-hidden">
            {/* Subtle ambient luxury light */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
              <div className="max-w-xl">
                <span className="inline-block rounded-full bg-amber-50 border border-amber-200/80 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.18em] text-amber-900 mb-2.5">
                  Exclusive Access
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
                  Ready for Curated Releases?
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-600">
                  Receive private invitations to limited-edition timepieces, handcrafted essentials, and members-only promotions directly from authorized boutiques.
                </p>
              </div>

              <div className="w-full lg:max-w-md">
                <form onSubmit={handleSubscribe} className="relative flex items-center">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full rounded-2xl border border-gray-200 bg-[#F4F4F6] py-3.5 pl-4 sm:pl-5 pr-32 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-gray-400 focus:bg-white focus:shadow-xs"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl bg-gray-950 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-black active:scale-97 cursor-pointer"
                  >
                    Join Privé
                  </button>
                </form>
                {subscribed && (
                  <p className="mt-2 text-xs font-semibold text-emerald-600 animate-fade-in">
                    ✓ Thank you for subscribing! Use code <strong className="underline">KRISHNA10</strong> for 10% off.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Dark Luxury Footer */}
      <footer className="border-t border-slate-800 bg-[#090D16] text-white relative overflow-hidden">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 left-1/4 -translate-y-1/2 h-48 w-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 translate-y-1/2 h-48 w-96 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">

            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="inline-flex items-center gap-2.5 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 font-serif text-base font-black text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
                  K
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                  Krishna <span className="font-bold text-amber-400">Accessories</span>
                </span>
              </Link>

              <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-slate-300">
                Ahmedabad's premier luxury destination for certified authentic timepieces, handcrafted leather goods, premium electronics, and curated lifestyle essentials.
              </p>

              {/* Store & Contact details container */}
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-2 text-xs text-slate-300 backdrop-blur-xs max-w-md">
                <p className="flex items-start gap-2">
                  <span className="text-amber-400 font-semibold shrink-0">📍 Flagship:</span>
                  <span className="text-slate-200 font-medium">Bodakdev, SG Highway, Ahmedabad 380054</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-amber-400 font-semibold shrink-0">📞 Desk:</span>
                  <span className="text-slate-200 font-medium">+91 (079) 4000-5500 &bull; care@krishnaaccessories.com</span>
                </p>
              </div>
            </div>

            {/* Departments */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                Departments
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                {defaultCategories.slice(0, 6).map((cat) => (
                  <li key={cat}>
                    <Link
                      to={`/shop?category=${encodeURIComponent(cat)}`}
                      className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block"
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Client Assistance */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                Client Support
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li>
                  <Link to="/tracking" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                    Track Consignment
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                    My Orders & Account
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                    Saved Wishlist
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                    FAQ & Authenticity
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                    Contact Concierge
                  </Link>
                </li>
              </ul>
            </div>

            {/* Portals & Legal */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                Portals & Legal
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li>
                  <Link to="/supplier" className="font-semibold text-cyan-400 transition-all duration-200 hover:text-cyan-300 hover:translate-x-1 inline-flex items-center gap-1">
                    Vendor Partner Portal &rarr;
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="font-semibold text-amber-400 transition-all duration-200 hover:text-amber-300 hover:translate-x-1 inline-flex items-center gap-1">
                    Admin Management &rarr;
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                    Our Heritage & Story
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Strip */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-400 sm:flex-row">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} Krishna Accessories Ltd. 100% Certified Authentic Guarantee.
            </p>

            {/* Social media badges */}
            <div className="flex items-center gap-2">
              {[
                { name: 'X', icon: '𝕏' },
                { name: 'Facebook', icon: 'f' },
                { name: 'LinkedIn', icon: 'in' },
                { name: 'Instagram', icon: 'ig' }
              ].map((social) => (
                <span
                  key={social.name}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/80 text-xs font-bold text-slate-300 shadow-sm transition-all duration-200 hover:border-amber-400 hover:bg-amber-400 hover:text-slate-950 hover:shadow-[0_0_12px_rgba(251,191,36,0.3)] active:scale-95"
                  title={social.name}
                >
                  {social.icon}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}