// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
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

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'WhatsApp',
      url: SHOP_INFO.whatsappUrl,
      icon: <WhatsAppIcon className="w-4 h-4" />,
      hoverBg: 'hover:bg-emerald-600 hover:text-white hover:border-emerald-500'
    },
    {
      name: 'Instagram',
      url: SHOP_INFO.socials.instagram,
      icon: <InstagramIcon className="w-4 h-4" />,
      hoverBg: 'hover:bg-pink-600 hover:text-white hover:border-pink-500'
    },
    {
      name: 'Facebook',
      url: SHOP_INFO.socials.facebook,
      icon: <FacebookIcon className="w-4 h-4" />,
      hoverBg: 'hover:bg-blue-600 hover:text-white hover:border-blue-500'
    }
  ];

  return (
    <footer className="border-t border-neutral-800/80 bg-[#0E1015] text-white select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Grid: Compact 4 Columns */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12">

          {/* Col 1: Brand Info & Quick Contact (Span 5 on lg) */}
          <div className="lg:col-span-5 space-y-3.5">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/images/krishna-logo.png"
                alt="Krishna Accessories Logo"
                className="h-9 w-9 object-contain rounded-xl bg-white p-1 group-hover:scale-105 transition-transform duration-200"
              />
              <div>
                <span className="text-base font-bold tracking-tight text-white block leading-tight">
                  Krishna <span className="text-[#C5A880]">Accessories</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                  Mumbai • Luxury & Lifestyle
                </span>
              </div>
            </Link>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Mumbai's destination for premium luxury timepieces, handcrafted leather goods, designer sunglasses, and lifestyle essentials.
            </p>

            {/* Compact Contact Badges */}
            <div className="flex flex-col gap-1.5 text-xs text-neutral-300 pt-1">
              <a
                href={`tel:+91${SHOP_INFO.rawPhone}`}
                className="inline-flex items-center gap-2 hover:text-[#C5A880] transition-colors duration-150 w-fit"
              >
                <PhoneIcon className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span>{SHOP_INFO.phone}</span>
              </a>

              <a
                href={`mailto:${SHOP_INFO.email}`}
                className="inline-flex items-center gap-2 hover:text-[#C5A880] transition-colors duration-150 w-fit"
              >
                <MailIcon className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span>{SHOP_INFO.email}</span>
              </a>

              <a
                href="https://maps.google.com/?q=Heera+Panna+Shopping+Center+Haji+Ali+Mumbai+400026"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-[#C5A880] transition-colors duration-150 w-fit"
                title="View on Google Maps"
              >
                <MapPinIcon className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span className="truncate">Shop 64, Heera Panna, Haji Ali, Mumbai</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={`Connect on ${social.name}`}
                  className={`w-8 h-8 rounded-lg border border-neutral-800 bg-neutral-900/90 text-neutral-400 flex items-center justify-center transition-all duration-200 ${social.hoverBg} hover:border-transparent active:scale-95`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Categories / Shop (Span 2 on lg) */}
          <div className="lg:col-span-2">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#C5A880]">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/shop?category=Watches" className="hover:text-white transition-colors duration-150 inline-block">
                  Watches
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Bags%20%26%20Wallets" className="hover:text-white transition-colors duration-150 inline-block">
                  Bags &amp; Wallets
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Shoes" className="hover:text-white transition-colors duration-150 inline-block">
                  Shoes
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Clothes%20%26%20Fashion" className="hover:text-white transition-colors duration-150 inline-block">
                  Fashion &amp; Apparel
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-[#C5A880] hover:text-[#E5D7C5] font-semibold inline-flex items-center gap-1 mt-1 transition-colors duration-150">
                  <span>View All Shop</span>
                  <ArrowRightIcon className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care (Span 2 on lg) */}
          <div className="lg:col-span-2">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#C5A880]">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/tracking" className="hover:text-white transition-colors duration-150 inline-block">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-white transition-colors duration-150 inline-block">
                  My Account &amp; Orders
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors duration-150 inline-block">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors duration-150 inline-block">
                  FAQs &amp; Help
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors duration-150 inline-block">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Boutique & Legal (Span 3 on lg) */}
          <div className="lg:col-span-3">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#C5A880]">
              About &amp; Policies
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors duration-150 inline-block">
                  Our Story &amp; Heritage
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors duration-150 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors duration-150 inline-block">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li className="pt-2 text-[11px] text-neutral-500 leading-normal">
                <span className="text-neutral-400 font-semibold block">Store Hours:</span>
                Mon – Sat: 10:30 AM – 8:30 PM (IST)
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Clean & Compact */}
        <div className="mt-8 pt-5 border-t border-neutral-800/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <p className="text-neutral-500 text-center sm:text-left text-[11px]">
            &copy; {currentYear} Krishna Accessories. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-neutral-400">
            <span className="mr-1 text-neutral-500">Accepted Payments:</span>
            <span className="rounded border border-neutral-800 bg-neutral-900/90 px-2 py-0.5 text-neutral-300 font-medium">UPI</span>
            <span className="rounded border border-neutral-800 bg-neutral-900/90 px-2 py-0.5 text-neutral-300 font-medium">Cards</span>
            <span className="rounded border border-neutral-800 bg-neutral-900/90 px-2 py-0.5 text-neutral-300 font-medium">NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}