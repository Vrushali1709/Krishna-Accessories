// src/components/Footer.jsx
import React from 'react';
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
  ArrowRightIcon
} from './Icons';

const POPULAR_BRANDS = [
  'Titan',
  'Fossil',
  'Ray-Ban',
  'Sony',
  'Hidesign',
  'Casio',
  'Apple',
  'Nike'
];

export default function Footer() {
  const socialLinks = [
    {
      name: 'WhatsApp Concierge',
      url: SHOP_INFO.whatsappUrl,
      icon: <WhatsAppIcon className="w-4 h-4 text-emerald-400" />,
      colorHover: 'hover:bg-emerald-600 hover:border-emerald-500 hover:text-white',
      label: '+91 93213 22761'
    },
    {
      name: 'Instagram',
      url: SHOP_INFO.socials.instagram,
      icon: <InstagramIcon className="w-4 h-4 text-pink-400" />,
      colorHover: 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-pink-500 hover:text-white',
      label: '@krishnaaccessories'
    },
    {
      name: 'Facebook',
      url: SHOP_INFO.socials.facebook,
      icon: <FacebookIcon className="w-4 h-4 text-blue-400" />,
      colorHover: 'hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white',
      label: 'Krishna Accessories'
    }
  ];

  return (
    <footer className="border-t border-slate-800 bg-[#0B0F19] text-white relative overflow-hidden select-none">
      {/* Subtle ambient luxury glow effect */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 h-72 w-[550px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-y-1/2 h-72 w-[550px] rounded-full bg-slate-700/10 blur-3xl pointer-events-none" />

      {/* Main Footer Content Grid */}
      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">

          {/* Column 1: Brand Info & Mumbai Boutique Contact (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/images/krishna-logo.png"
                alt="Krishna Accessories Logo"
                className="h-10 w-10 sm:h-11 sm:w-11 object-contain rounded-2xl bg-white p-1 shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform duration-200"
              />
              <div>
                <span className="text-lg font-bold tracking-tight text-white block leading-tight">
                  Krishna <span className="font-bold text-amber-400">Accessories</span>
                </span>
                <span className="text-[9.5px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
                  Mumbai • Luxury & Lifestyle
                </span>
              </div>
            </Link>

            <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-slate-300">
              Mumbai's premier destination for premium luxury timepieces, handcrafted leather essentials, designer sunglasses, and quality lifestyle goods.
            </p>

            {/* Mumbai Flagship Address & Contact Box */}
            <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-4 space-y-3 text-xs text-slate-300 backdrop-blur-sm max-w-md shadow-inner">
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
                    className="mt-1 inline-flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 underline font-medium"
                  >
                    <span>Get Directions on Google Maps</span>
                    <ArrowRightIcon className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Direct Concierge Phone */}
              <div className="flex items-start gap-2.5 pt-2.5 border-t border-slate-800/90">
                <PhoneIcon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-amber-400 font-bold block text-[10.5px] uppercase tracking-wider">
                    Direct Concierge / Telephone:
                  </span>
                  <a
                    href={`tel:+91${SHOP_INFO.rawPhone}`}
                    className="text-slate-200 font-medium hover:text-white transition inline-block mt-0.5"
                  >
                    {SHOP_INFO.phone}
                  </a>
                </div>
              </div>

              {/* Customer Support Email */}
              <div className="flex items-start gap-2.5 pt-2.5 border-t border-slate-800/90">
                <MailIcon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-amber-400 font-bold block text-[10.5px] uppercase tracking-wider">
                    Customer Support Email:
                  </span>
                  <a
                    href={`mailto:${SHOP_INFO.email}`}
                    className="text-slate-200 font-medium hover:text-white transition break-all inline-block mt-0.5"
                  >
                    {SHOP_INFO.email}
                  </a>
                </div>
              </div>

              {/* Store Hours */}
              <div className="pt-2.5 border-t border-slate-800/90 text-[11px] text-slate-400">
                <span className="text-slate-300 font-semibold">Store Hours: </span>
                {SHOP_INFO.workingHours}
              </div>
            </div>
          </div>

          {/* Column 2: Categories (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-amber-400">
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
              <li className="pt-1">
                <Link
                  to="/shop"
                  className="text-amber-400 font-semibold transition-all duration-200 hover:text-amber-300 hover:translate-x-1 inline-flex items-center gap-1"
                >
                  <span>View All Categories</span>
                  <span>&rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Major Brands (Span 2 - Clean names without side labels) */}
          <div className="lg:col-span-2">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-amber-400">
              Major Brands
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              {POPULAR_BRANDS.map((brandName) => (
                <li key={brandName}>
                  <Link
                    to={`/shop?brand=${encodeURIComponent(brandName)}`}
                    className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block"
                  >
                    {brandName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Client Support (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-amber-400">
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
                  FAQ & Product Quality
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link to="/shop" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal & Information (Span 2 - Clean Customer Links Only) */}
          <div className="lg:col-span-2">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-amber-400">
              Legal & Info
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
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
              <li>
                <Link to="/faq" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                  Store Locator
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Social Media and Security / Payment Strip */}
        <div className="mt-12 pt-8 border-t border-slate-800/90 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Media Links */}
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
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-200 shadow-xs transition-all duration-200 ${social.colorHover} active:scale-95`}
              >
                {social.icon}
                <span>{social.name}</span>
              </a>
            ))}
          </div>

          {/* Payment & Security Trust Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-[10.5px] text-slate-400">
            <span className="font-semibold text-slate-300 mr-1">Accepted Payments:</span>
            <span className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 font-bold text-slate-200">UPI</span>
            <span className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 font-bold text-slate-200">GPay</span>
            <span className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 font-bold text-slate-200">PhonePe</span>
            <span className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 font-bold text-slate-200">Visa</span>
            <span className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 font-bold text-slate-200">Mastercard</span>
            <span className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 font-bold text-slate-200">RuPay</span>
            <span className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 font-bold text-slate-200">NetBanking</span>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-400 sm:flex-row">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Krishna Accessories Ltd. All rights reserved. Quality &amp; Premium Lifestyle Products.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <Link to="/privacy" className="hover:text-slate-200 transition">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-200 transition">Terms</Link>
            <span>•</span>
            <Link to="/faq" className="hover:text-slate-200 transition">Product FAQs</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-200 transition">Mumbai Boutique</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}