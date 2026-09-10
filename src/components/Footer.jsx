// src/components/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { defaultCategories } from '../utils/productStore';
import { SHOP_INFO } from '../utils/shopInfo';
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ShieldCheckIcon,
  TruckIcon,
  RefreshIcon,
  HeadphonesIcon,
  ArrowRightIcon
} from './Icons';

const POPULAR_BRANDS = [
  { name: 'Titan', category: 'Watches' },
  { name: 'Fossil', category: 'Watches' },
  { name: 'Ray-Ban', category: 'Eyewear' },
  { name: 'Sony', category: 'Electronics' },
  { name: 'Hidesign', category: 'Bags' },
  { name: 'Casio', category: 'Watches' },
  { name: 'Apple', category: 'Electronics' },
  { name: 'Nike', category: 'Footwear' }
];

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const socialLinks = [
    {
      name: 'WhatsApp Concierge',
      url: SHOP_INFO.whatsappUrl,
      icon: <WhatsAppIcon className="w-4 h-4" />,
      colorHover: 'hover:bg-emerald-600 hover:border-emerald-500 hover:text-white',
      label: '+91 93213 22761'
    },
    {
      name: 'Instagram',
      url: SHOP_INFO.socials.instagram,
      icon: <InstagramIcon className="w-4 h-4" />,
      colorHover: 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-pink-500 hover:text-white',
      label: '@krishnaaccessories'
    },
    {
      name: 'Facebook',
      url: SHOP_INFO.socials.facebook,
      icon: <FacebookIcon className="w-4 h-4" />,
      colorHover: 'hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white',
      label: 'Krishna Accessories'
    }
  ];

  return (
    <>
      {/* 1. Standalone Newsletter / Curated Releases Section (Above Footer) */}
      <section className="py-8 sm:py-12 bg-[#FAF8F5] border-t border-amber-900/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-amber-900/15 bg-white p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
            {/* Subtle ambient luxury light */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
              <div className="max-w-xl">
                <span className="inline-block rounded-full bg-amber-50 border border-amber-200/80 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.18em] text-amber-900 mb-2.5">
                  Exclusive Privé Membership
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
                  Join Privé & Get 10% Off
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-600">
                  Subscribe to receive private invitations to limited-edition timepieces, handcrafted essentials, and instant discount vouchers directly to your inbox.
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
                    className="w-full rounded-2xl border border-gray-200 bg-[#F4F4F6] py-3.5 pl-4 sm:pl-5 pr-32 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-amber-400 focus:bg-white focus:shadow-xs"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl bg-gray-950 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-black active:scale-97 cursor-pointer"
                  >
                    Join Privé
                  </button>
                </form>
                {subscribed && (
                  <p className="mt-2 text-xs font-semibold text-emerald-600 animate-fade-in flex items-center gap-1">
                    <span>✓</span> Thank you for subscribing! Use code <strong className="underline">KRISHNA10</strong> at checkout for 10% instant discount.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Dark Luxury Footer */}
      <footer className="border-t border-slate-800 bg-[#090D16] text-white relative overflow-hidden select-none">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 left-1/4 -translate-y-1/2 h-64 w-[500px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 translate-y-1/2 h-64 w-[500px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

        {/* Value Proposition / Trust Pillars Strip */}
        

        {/* Main Footer Links & Company Information Grid */}
        <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">

            {/* Column 1: Company Information & Mumbai Boutique (Span 4) */}
            <div className="lg:col-span-4 space-y-4">
              <Link to="/" className="inline-flex items-center gap-2.5 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 font-serif text-base font-black text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
                  K
                </div>
                <div>
                  <span className="text-lg font-bold tracking-tight text-white block leading-none">
                    Krishna <span className="font-bold text-amber-400">Accessories</span>
                  </span>
                  <span className="text-[9.5px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
                    Mumbai • Luxury & Lifestyle
                  </span>
                </div>
              </Link>

              <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-slate-300">
                Mumbai's premier destination for certified authentic luxury timepieces, handcrafted leather essentials, designer sunglasses, and premium lifestyle goods.
              </p>

              {/* Mumbai Address & Contact Box */}
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 space-y-3 text-xs text-slate-300 backdrop-blur-xs max-w-md shadow-inner">
                {/* Mumbai Flagship Address */}
                <div className="flex items-start gap-2.5">
                  <MapPinIcon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-amber-400 font-bold block text-[10.5px] uppercase tracking-wider">
                      Mumbai Flagship Boutique:
                    </span>
                    <span className="text-slate-200 font-medium leading-snug block mt-0.5">
                      {SHOP_INFO.address}
                    </span>
                    <a
                      href="https://maps.google.com/?q=Heera+Panna+Shopping+Center+Haji+Ali+Mumbai+400026"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium"
                    >
                      <span>Get Directions on Google Maps</span>
                      <ArrowRightIcon className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Direct Phone */}
                <div className="flex items-start gap-2.5 pt-2 border-t border-slate-800/80">
                  <PhoneIcon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-amber-400 font-bold block text-[10.5px] uppercase tracking-wider">
                      Direct Concierge / Telephone:
                    </span>
                    <a
                      href={`tel:+91${SHOP_INFO.rawPhone}`}
                      className="text-slate-200 font-medium hover:text-amber-300 transition inline-block mt-0.5"
                    >
                      {SHOP_INFO.phone}
                    </a>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-start gap-2.5 pt-2 border-t border-slate-800/80">
                  <MailIcon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-amber-400 font-bold block text-[10.5px] uppercase tracking-wider">
                      Official Email:
                    </span>
                    <a
                      href={`mailto:${SHOP_INFO.email}`}
                      className="text-slate-200 font-medium hover:text-amber-300 transition break-all inline-block mt-0.5"
                    >
                      {SHOP_INFO.email}
                    </a>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span className="text-slate-300 font-semibold">Store Hours: </span>
                  {SHOP_INFO.workingHours}
                </div>
              </div>
            </div>

            {/* Column 2: Popular Categories (Span 2) */}
            <div className="lg:col-span-2">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                Categories
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
                <li>
                  <Link
                    to="/shop"
                    className="text-amber-400 font-semibold transition-all duration-200 hover:text-amber-300 hover:translate-x-1 inline-flex items-center gap-1 mt-1"
                  >
                    View All Categories &rarr;
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Major Brands (Span 2) */}
            <div className="lg:col-span-2">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                Major Brands
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                {POPULAR_BRANDS.map((brand) => (
                  <li key={brand.name}>
                    <Link
                      to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                      className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-flex items-center justify-between w-full pr-4 group"
                    >
                      <span>{brand.name}</span>
                      <span className="text-[10px] text-slate-500 group-hover:text-amber-400/80 transition-colors">
                        {brand.category}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Client Support (Span 2) */}
            <div className="lg:col-span-2">
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
                <li>
                  <Link to="/new-arrivals" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                    New Arrivals
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: Portals & Legal (Span 2) */}
            <div className="lg:col-span-2">
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

          {/* Social Media and Security / Payment Strip */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Media Links with dynamic hover styling */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="text-xs text-slate-400 font-semibold mr-1">Connect with Concierge:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={`Connect with Krishna Accessories on ${social.name}`}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-700/80 bg-slate-800/80 text-xs font-semibold text-slate-200 shadow-sm transition-all duration-200 ${social.colorHover} hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] active:scale-95`}
                >
                  {social.icon}
                  <span>{social.name}</span>
                </a>
              ))}
            </div>

            {/* Payment & Security Trust Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-[10.5px] text-slate-400">
              <span className="font-semibold text-slate-300 mr-1">Accepted Payments:</span>
              <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 font-bold text-slate-200">UPI</span>
              <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 font-bold text-slate-200">GPay</span>
              <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 font-bold text-slate-200">PhonePe</span>
              <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 font-bold text-slate-200">Visa</span>
              <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 font-bold text-slate-200">Mastercard</span>
              <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 font-bold text-slate-200">RuPay</span>
              <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 font-bold text-slate-200">NetBanking</span>
            </div>
          </div>

          {/* Bottom Copyright Strip */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-800/60 pt-6 text-xs text-slate-400 sm:flex-row">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} Krishna Accessories Ltd. All rights reserved. 100% Certified Authentic Goods.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <Link to="/privacy" className="hover:text-slate-200 transition">Privacy</Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-slate-200 transition">Terms</Link>
              <span>•</span>
              <Link to="/faq" className="hover:text-slate-200 transition">Authenticity</Link>
              <span>•</span>
              <Link to="/contact" className="hover:text-slate-200 transition">Mumbai Boutique</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}