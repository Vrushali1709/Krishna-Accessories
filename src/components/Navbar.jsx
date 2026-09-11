// src/components/Navbar.jsx
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCart, getCartCount } from '../utils/cart';
import { defaultCategories, getCategories, getWishlist, getProducts } from '../utils/productStore';
import { getCurrentUser, logout, isAdmin, isSupplier } from '../utils/auth';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../utils/orderStore';
import { SHOP_INFO } from '../utils/shopInfo';
import {
  BagIcon,
  SearchIcon,
  UserIcon,
  ChevronDownIcon,
  HeartIcon,
  BellIcon,
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  PhoneIcon,
  MailIcon
} from './Icons';

const CATEGORY_ICONS = {
  'Watches': '⌚',
  'Bags & Wallets': '👜',
  'Shoes': '👟',
  'Mobiles': '📱',
  'Clothes & Fashion': '👔',
  'Laptops': '💻',
  'Electronics': '🎧',
  'Smart Gadgets': '⚡',
  'Gaming': '🎮',
  'Fitness': '🏃',
  'Fashion Accessories': '🕶️'
};

const PRICE_TIERS_NAV = [
  { label: 'Under ₹5,000', price: 5000, tag: 'Smart Essentials', icon: '🏷️' },
  { label: 'Under ₹10,000', price: 10000, tag: 'Popular Value', icon: '⚡' },
  { label: 'Under ₹15,000', price: 15000, tag: 'Signature Luxe', icon: '✦' },
  { label: 'Under ₹20,000', price: 20000, tag: 'Executive Class', icon: '👑' }
];

const TOP_HERITAGE_BRANDS = [
  { name: 'Titan', cat: 'Watches' },
  { name: 'Rolex', cat: 'Watches' },
  { name: 'Casio', cat: 'Watches' },
  { name: 'Fossil', cat: 'Watches' },
  { name: 'Apple', cat: 'Mobiles' },
  { name: 'Hidesign', cat: 'Bags & Wallets' },
  { name: 'Ray-Ban', cat: 'Fashion Accessories' },
  { name: 'Sony', cat: 'Electronics' }
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => getCart());
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [allCategories, setAllCategories] = useState(() => getCategories());
  const [allProducts, setAllProducts] = useState(() => getProducts());

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const cartPreviewRef = useRef(null);
  const searchContainerRef = useRef(null);
  const catTimeoutRef = useRef(null);
  const cartTimeoutRef = useRef(null);

  const handleCatMouseEnter = () => {
    if (catTimeoutRef.current) clearTimeout(catTimeoutRef.current);
    setCategoriesOpen(true);
  };

  const handleCatMouseLeave = () => {
    catTimeoutRef.current = setTimeout(() => {
      setCategoriesOpen(false);
    }, 180);
  };

  const handleCartMouseEnter = () => {
    if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
    setCartPreviewOpen(true);
  };

  const handleCartMouseLeave = () => {
    cartTimeoutRef.current = setTimeout(() => {
      setCartPreviewOpen(false);
    }, 200);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (catTimeoutRef.current) clearTimeout(catTimeoutRef.current);
      if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
    };
  }, []);

  const refreshState = () => {
    setCart(getCart());
    setCartCount(getCartCount());
    setWishlistCount(getWishlist().length);
    setNotifications(getNotifications());
    setCurrentUser(getCurrentUser());
    setAllCategories(getCategories());
    setAllProducts(getProducts());
  };

  useEffect(() => {
    refreshState();
    window.addEventListener('cartUpdated', refreshState);
    window.addEventListener('wishlistUpdated', refreshState);
    window.addEventListener('notificationsUpdated', refreshState);
    window.addEventListener('categoriesUpdated', refreshState);
    window.addEventListener('productsUpdated', refreshState);
    window.addEventListener('authUpdated', refreshState);
    window.addEventListener('storage', refreshState);

    return () => {
      window.removeEventListener('cartUpdated', refreshState);
      window.removeEventListener('wishlistUpdated', refreshState);
      window.removeEventListener('notificationsUpdated', refreshState);
      window.removeEventListener('categoriesUpdated', refreshState);
      window.removeEventListener('productsUpdated', refreshState);
      window.removeEventListener('authUpdated', refreshState);
      window.removeEventListener('storage', refreshState);
    };
  }, [location.pathname]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    setNotificationsOpen(false);
    setUserMenuOpen(false);
    setCartPreviewOpen(false);
    setSearchFocused(false);
    setShowSearchMobile(false);
  }, [location.pathname]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategoriesOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (cartPreviewRef.current && !cartPreviewRef.current.contains(event.target)) {
        setCartPreviewOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchFocused(false);
      setShowSearchMobile(false);
      setSearchQuery('');
    }
  };

  const handleQuickSearchTag = (term) => {
    navigate(`/shop?search=${encodeURIComponent(term)}`);
    setSearchFocused(false);
    setShowSearchMobile(false);
    setSearchQuery('');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unreadNotifsCount = notifications.filter(n => n.unread).length;

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  }, [cart]);

  // Live matching search results
  const liveSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allProducts
      .filter((p) =>
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [searchQuery, allProducts]);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled
        ? 'shadow-[0_10px_35px_rgba(0,0,0,0.06)] bg-white/92 backdrop-blur-xl border-b border-gray-200/90'
        : 'bg-white/98 backdrop-blur-md border-b border-gray-200/70'
    }`}>

      {/* =========================================================
          1. TOP LUXURY CONCIERGE & ANNOUNCEMENT STRIP (OBSIDIAN DARK)
      ========================================================= */}
      <div className="bg-[#080B11] text-neutral-300 border-b border-neutral-800/80 text-[11px] py-1.5 px-3 sm:px-6 lg:px-8 xl:px-10 select-none">
        <div className="mx-auto flex items-center justify-between gap-4 max-w-7xl">

          {/* Left: Store Location Snippet */}
          <div className="flex items-center gap-2 truncate text-neutral-300">
            <span className="text-amber-400 font-bold shrink-0">📍 Mumbai Sanctuary:</span>
            <span className="truncate hidden md:inline text-neutral-200 font-medium">{SHOP_INFO.address}</span>
            <span className="truncate md:hidden text-neutral-200 font-medium">Heera Panna, Haji Ali</span>
          </div>

          {/* Center (Desktop only highlight): Brand Guarantee & Coupon */}
          <div className="hidden xl:flex items-center gap-2 text-neutral-400 font-medium">
            <span className="text-amber-400 text-xs">✦</span>
            <span>100% Certified Authentic</span>
            <span className="text-neutral-600">•</span>
            <span>Insured Express Shipping</span>
            <span className="text-neutral-600">•</span>
            <span className="text-amber-300 font-bold font-mono bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.2 rounded">KRISHNA10</span>
            <span>for 10% Off</span>
          </div>

          {/* Right: Quick Direct Contacts & Order Tracking */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Quick Track Order Link */}
            <Link
              to="/tracking"
              className="hidden sm:inline-flex items-center gap-1.5 text-neutral-200 hover:text-amber-300 transition text-[11px] font-medium"
            >
              <span>📦 Track Order</span>
            </Link>

            {/* Direct Phone Concierge */}
            <a
              href={`tel:+91${SHOP_INFO.rawPhone}`}
              className="hidden lg:inline-flex items-center gap-1 text-neutral-200 hover:text-amber-300 transition"
              title="Direct Concierge Line"
            >
              <PhoneIcon className="w-3 h-3 text-amber-400" />
              <span>{SHOP_INFO.phone}</span>
            </a>

            {/* VIP WhatsApp Concierge (Live Status Dot) */}
            <a
              href={SHOP_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 hover:bg-emerald-900/60 transition shadow-2xs"
              title="24/7 VIP WhatsApp Concierge"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              </span>
              <span>Online Concierge</span>
            </a>

            {/* Social Icons Strip */}
            <div className="hidden sm:flex items-center gap-2 border-l border-neutral-700/80 pl-3">
              <a
                href={SHOP_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                aria-label="Facebook"
                className="text-neutral-400 hover:text-[#1877F2] transition hover:scale-110"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={SHOP_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                aria-label="Instagram"
                className="text-neutral-400 hover:text-pink-400 transition hover:scale-110"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={SHOP_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Concierge"
                aria-label="WhatsApp Concierge"
                className="text-neutral-400 hover:text-emerald-400 transition hover:scale-110"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* =========================================================
          2. MAIN LUXURY NAVIGATION BAR
      ========================================================= */}
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 max-w-7xl mx-auto">
        <div className="relative flex h-15 sm:h-16 items-center justify-between gap-4">

          {/* Left: Brand Logo & Emblem */}
          <div className="flex items-center shrink-0 z-20">
            <Link to="/" aria-label="Krishna Accessories Home" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="relative">
                <img
                  src="/images/krishna-logo.png"
                  alt="Krishna Accessories Emblem"
                  className="h-9.5 w-9.5 sm:h-10.5 sm:w-10.5 object-contain rounded-xl bg-white p-0.5 shadow-2xs border border-amber-500/40 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[8px] text-black font-black border border-white">
                  ✓
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[15px] sm:text-[17px] tracking-tight text-gray-950 leading-none group-hover:text-amber-900 transition-colors">
                  Krishna <span className="text-amber-700 font-black">Accessories</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.24em] text-neutral-400 font-bold mt-1">
                  MUMBAI SANCTUARY
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Primary Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8 text-[12px] font-bold uppercase tracking-[0.14em] text-neutral-600 absolute left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
            {/* Home */}
            <Link
              to="/"
              className={`relative py-1.5 transition-colors ${
                location.pathname === '/'
                  ? 'text-gray-950 font-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gray-950'
                  : 'hover:text-gray-950'
              }`}
            >
              Home
            </Link>

            {/* Collections Mega-Menu Dropdown */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={handleCatMouseEnter}
              onMouseLeave={handleCatMouseLeave}
            >
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className={`flex items-center gap-1.5 py-1.5 transition-colors uppercase cursor-pointer ${
                  categoriesOpen || (location.pathname === '/shop' && !location.search)
                    ? 'text-gray-950 font-black'
                    : 'hover:text-gray-950'
                }`}
              >
                <span>Collections</span>
                <ChevronDownIcon
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    categoriesOpen ? 'rotate-180 text-gray-950' : 'text-gray-400'
                  }`}
                />
              </button>

              {/* Luxury Wide Mega-Menu Overlay */}
              {categoriesOpen && (
                <div
                  onMouseEnter={handleCatMouseEnter}
                  onMouseLeave={handleCatMouseLeave}
                  className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[720px] max-w-[90vw] z-50 animate-fade-in"
                >
                  <div className="rounded-[28px] border border-gray-200/90 bg-white/98 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
                    
                    <div className="grid grid-cols-12 gap-5">
                      
                      {/* Col 1: All 11 Curated Categories (Col Span 7) */}
                      <div className="col-span-7 pr-4 border-r border-gray-100">
                        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-gray-100">
                          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-400">
                            ALL DEPARTMENTS ({allCategories.length})
                          </span>
                          <Link
                            to="/shop"
                            onClick={() => setCategoriesOpen(false)}
                            className="text-xs font-bold text-gray-900 hover:text-amber-700 transition flex items-center gap-1"
                          >
                            <span>Browse Everything</span>
                            <span>&rarr;</span>
                          </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                          {allCategories.map((cat) => {
                            const icon = CATEGORY_ICONS[cat] || '✨';
                            const isActive = location.search.includes(`category=${encodeURIComponent(cat)}`);

                            return (
                              <Link
                                key={cat}
                                to={`/shop?category=${encodeURIComponent(cat)}`}
                                onClick={() => setCategoriesOpen(false)}
                                className={`group/cat flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold normal-case transition-all duration-150 ${
                                  isActive
                                    ? 'bg-gray-950 text-white shadow-xs'
                                    : 'text-gray-700 hover:bg-neutral-100 hover:text-gray-950'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="text-base shrink-0 transition-transform group-hover/cat:scale-110">{icon}</span>
                                  <span className="truncate">{cat}</span>
                                </div>
                                <span className="text-[11px] text-gray-400 group-hover/cat:text-gray-900 group-hover/cat:translate-x-0.5 transition-transform">
                                  &rarr;
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      {/* Col 2: Shop by Budget & Heritage Brands (Col Span 5) */}
                      <div className="col-span-5 flex flex-col justify-between">
                        
                        {/* Shop by Price Tiers */}
                        <div>
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-900">
                              🏷️ SHOP BY PRICE
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 mb-4">
                            {PRICE_TIERS_NAV.map((tier) => (
                              <Link
                                key={tier.label}
                                to={`/shop?maxPrice=${tier.price}`}
                                onClick={() => setCategoriesOpen(false)}
                                className="group flex flex-col p-2 rounded-xl bg-neutral-50 hover:bg-amber-50/70 border border-gray-200/80 hover:border-amber-300 transition normal-case"
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs">{tier.icon}</span>
                                  <span className="text-xs font-bold text-gray-950">{tier.label}</span>
                                </div>
                                <span className="text-[9.5px] text-neutral-500 group-hover:text-amber-900 mt-0.5">
                                  {tier.tag}
                                </span>
                              </Link>
                            ))}
                          </div>

                          {/* Heritage Brand Shortcuts */}
                          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-gray-100">
                            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-400">
                              TOP HOUSES
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 normal-case">
                            {TOP_HERITAGE_BRANDS.map((b) => (
                              <Link
                                key={b.name}
                                to={`/shop?category=${encodeURIComponent(b.cat)}&brand=${encodeURIComponent(b.name)}`}
                                onClick={() => setCategoriesOpen(false)}
                                className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-900 hover:text-white text-[11px] font-bold text-neutral-700 transition"
                              >
                                {b.name}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Special Promo Coupon Strip */}
                        <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-[#080B11] to-[#1E293B] text-white flex items-center justify-between gap-2 shadow-xs">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                              PROMO PRIVILEGE
                            </p>
                            <p className="text-xs font-bold text-white leading-tight">
                              Flat 10% Off Sitewide
                            </p>
                          </div>
                          <span className="font-mono text-[10.5px] font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded border border-white/20">
                            KRISHNA10
                          </span>
                        </div>

                      </div>

                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Shop All */}
            <Link
              to="/shop"
              className={`relative py-1.5 transition-colors ${
                location.pathname === '/shop' && !location.search
                  ? 'text-gray-950 font-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gray-950'
                  : 'hover:text-gray-950'
              }`}
            >
              Shop All
            </Link>

            {/* New Arrivals (with Badge) */}
            <Link
              to="/new-arrivals"
              className={`relative py-1.5 transition-colors flex items-center gap-1.5 ${
                location.pathname === '/new-arrivals'
                  ? 'text-gray-950 font-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gray-950'
                  : 'hover:text-gray-950'
              }`}
            >
              <span>New Arrivals</span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-1.5 py-0.2 text-[8.5px] font-black uppercase tracking-wider border border-emerald-300/60">
                New
              </span>
            </Link>

            {/* Special Deals / Offers */}
            <Link
              to="/shop?sort=discount"
              className="relative py-1.5 transition-colors flex items-center gap-1.5 hover:text-gray-950"
            >
              <span>Offers</span>
              <span className="rounded-full bg-rose-50 text-rose-600 px-1.5 py-0.2 text-[8.5px] font-black uppercase tracking-wider border border-rose-200">
                Sale
              </span>
            </Link>

            {/* About */}
            <Link
              to="/about"
              className={`relative py-1.5 transition-colors ${
                location.pathname === '/about'
                  ? 'text-gray-950 font-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gray-950'
                  : 'hover:text-gray-950'
              }`}
            >
              About
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className={`relative py-1.5 transition-colors ${
                location.pathname === '/contact'
                  ? 'text-gray-950 font-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gray-950'
                  : 'hover:text-gray-950'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right: Search, Notifications, Wishlist, Bag with Mini-Cart Preview, User */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto z-20">

            {/* Spotlight Interactive Search Bar (Desktop) */}
            <div className="hidden lg:block relative" ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit} className="relative w-44 xl:w-56 focus-within:w-64 transition-all duration-300">
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search timepieces, brands..."
                  className="h-9 w-full rounded-full border border-gray-200 bg-[#F4F4F6] pl-8 pr-12 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-neutral-900 focus:bg-white shadow-2xs"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <SearchIcon className="w-3.5 h-3.5" />
                </span>
                
                {searchQuery ? (
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gray-950 px-2.5 py-1 text-[9px] font-bold text-white hover:bg-black transition cursor-pointer"
                  >
                    Go
                  </button>
                ) : (
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9.5px] font-mono text-gray-400 border border-gray-200 bg-white px-1.5 py-0.5 rounded pointer-events-none">
                    ⌘K
                  </span>
                )}
              </form>

              {/* Spotlight Live Search Dropdown */}
              {searchFocused && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-gray-200/90 bg-white p-3.5 shadow-2xl z-50 animate-fade-in">
                  {searchQuery.trim() ? (
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Matching Products ({liveSearchResults.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSearchSubmit()}
                          className="text-[11px] font-bold text-amber-700 hover:underline"
                        >
                          View all results &rarr;
                        </button>
                      </div>

                      {liveSearchResults.length > 0 ? (
                        <div className="space-y-1.5">
                          {liveSearchResults.map((prod) => (
                            <Link
                              key={prod.id}
                              to={`/product/${prod.id}`}
                              onClick={() => setSearchFocused(false)}
                              className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 transition"
                            >
                              <img
                                src={prod.image || prod.images?.[0]}
                                alt={prod.name}
                                className="h-10 w-10 rounded-lg object-cover bg-neutral-100 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-gray-950 truncate leading-snug">{prod.name}</p>
                                <p className="text-[10px] text-neutral-400 truncate">{prod.brand} • {prod.category}</p>
                              </div>
                              <span className="text-xs font-black text-gray-950 shrink-0">
                                ₹{Number(prod.price).toLocaleString('en-IN')}
                              </span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-400 py-3 text-center">No products matching &quot;{searchQuery}&quot;</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                        🔥 Trending Searches
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {['Titan Watches', 'Casio Chronograph', 'Leather Wallets', 'Ray-Ban', 'Rolex', 'Sony Audio', 'Under ₹5,000'].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleQuickSearchTag(tag)}
                            className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-gray-950 hover:text-white text-[11px] font-semibold text-neutral-700 transition cursor-pointer"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => setShowSearchMobile(!showSearchMobile)}
              aria-label="Search Catalog"
              className="lg:hidden flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 transition cursor-pointer shadow-2xs"
            >
              <SearchIcon className="w-3.5 h-3.5" />
            </button>

            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
                className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 transition relative cursor-pointer shadow-2xs"
              >
                <BellIcon className="w-3.5 h-3.5 text-gray-700" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[8.5px] font-black text-black shadow-xs">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <>
                  <div
                    onClick={() => setNotificationsOpen(false)}
                    className="fixed inset-0 z-40 sm:hidden bg-black/20 backdrop-blur-[1px]"
                  />
                  <div className="fixed left-3 right-3 top-14 sm:inset-auto sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-80 rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xl z-50 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-950 uppercase tracking-wider">Notifications</span>
                        {unreadNotifsCount > 0 && (
                          <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[8.5px] font-bold text-black">
                            {unreadNotifsCount} new
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadNotifsCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllNotificationsRead}
                            className="text-[10px] text-gray-500 font-semibold hover:text-black transition cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setNotificationsOpen(false)}
                          className="sm:hidden text-gray-400 hover:text-gray-700 text-xs px-1 cursor-pointer"
                          aria-label="Close"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-[60vh] sm:max-h-64 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-5">No notifications yet.</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`rounded-xl p-2.5 text-xs transition cursor-pointer ${
                              n.unread ? 'bg-[#F4F4F6] border border-gray-200' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-1">
                              <span className="font-semibold text-gray-900 text-[11.5px] leading-snug">{n.title}</span>
                              <span className="text-[9px] text-gray-400 font-mono shrink-0">{n.date}</span>
                            </div>
                            <p className="mt-1 text-[11px] text-gray-600 leading-snug break-words">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className={`relative flex h-8.5 w-8.5 items-center justify-center rounded-xl border transition cursor-pointer shadow-2xs ${
                location.pathname === '/wishlist'
                  ? 'border-gray-900 bg-gray-100 text-gray-950 font-bold'
                  : 'border-gray-200 bg-[#F4F4F6] text-gray-700 hover:border-gray-300 hover:bg-gray-200'
              }`}
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <HeartIcon className="w-3.5 h-3.5 text-gray-700 shrink-0" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[8px] font-bold text-white shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Button with Hover / Click Mini-Cart Flyout */}
            <div
              className="relative"
              ref={cartPreviewRef}
              onMouseEnter={handleCartMouseEnter}
              onMouseLeave={handleCartMouseLeave}
            >
              <Link
                to="/cart"
                aria-label="Shopping bag"
                title="Shopping bag"
                className={`relative flex h-8.5 w-8.5 items-center justify-center rounded-xl border transition cursor-pointer shadow-2xs ${
                  location.pathname === '/cart'
                    ? 'border-gray-900 bg-gray-100 text-gray-950 font-bold'
                    : 'border-gray-200 bg-[#F4F4F6] text-gray-700 hover:border-gray-300 hover:bg-gray-200'
                }`}
              >
                <BagIcon className="w-3.5 h-3.5 text-gray-800" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-950 text-[8px] font-bold text-amber-300 shadow-xs">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mini-Cart Hover Dropdown Preview */}
              {cartPreviewOpen && (
                <div
                  onMouseEnter={handleCartMouseEnter}
                  onMouseLeave={handleCartMouseLeave}
                  className="hidden sm:block absolute right-0 top-full pt-2 w-80 z-50 animate-fade-in"
                >
                  <div className="rounded-2xl border border-gray-200/90 bg-white/98 backdrop-blur-xl p-4 shadow-2xl">
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-950 uppercase tracking-wider">Shopping Bag</span>
                        <span className="rounded-full bg-neutral-100 px-2 py-0.2 text-[10px] font-bold text-neutral-800">
                          {cartCount} items
                        </span>
                      </div>
                      <Link
                        to="/cart"
                        onClick={() => setCartPreviewOpen(false)}
                        className="text-[11px] font-bold text-amber-700 hover:underline"
                      >
                        View Bag &rarr;
                      </Link>
                    </div>

                    {cart.length > 0 ? (
                      <div>
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {cart.slice(0, 3).map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-neutral-50">
                              <img
                                src={item.image || (Array.isArray(item.images) && item.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                                alt={item.name}
                                className="h-11 w-11 rounded-lg object-cover bg-neutral-100 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-gray-950 truncate leading-snug">{item.name}</p>
                                <p className="text-[10px] text-neutral-400 truncate">
                                  Qty: {item.quantity} {item.color ? `• ${item.color}` : ''}
                                </p>
                              </div>
                              <span className="text-xs font-bold text-gray-950 shrink-0">
                                ₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {cart.length > 3 && (
                          <p className="text-[10.5px] text-center text-neutral-400 py-1">
                            +{cart.length - 3} more items in bag
                          </p>
                        )}

                        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-neutral-500">Subtotal:</span>
                          <span className="text-sm font-black text-gray-950">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <Link
                            to="/cart"
                            onClick={() => setCartPreviewOpen(false)}
                            className="py-2 text-center rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-gray-900 transition"
                          >
                            View Bag
                          </Link>
                          <Link
                            to="/checkout"
                            onClick={() => setCartPreviewOpen(false)}
                            className="py-2 text-center rounded-xl bg-gray-950 hover:bg-black text-xs font-bold text-white shadow-xs transition"
                          >
                            Checkout
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-sm text-neutral-400 mb-2">Your shopping bag is empty</p>
                        <Link
                          to="/shop"
                          onClick={() => setCartPreviewOpen(false)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline"
                        >
                          Start shopping &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Menu */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex h-8.5 items-center gap-2 rounded-xl border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 shadow-2xs cursor-pointer"
                >
                  <div className="flex h-5.5 w-5.5 items-center justify-center rounded-lg bg-gray-950 text-amber-300 font-bold text-[11px]">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline truncate max-w-[85px] text-[11.5px] text-gray-900 font-bold">
                    {currentUser.name || currentUser.email.split('@')[0]}
                  </span>
                  <ChevronDownIcon className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      onClick={() => setUserMenuOpen(false)}
                      className="fixed inset-0 z-40 sm:hidden bg-black/20 backdrop-blur-[1px]"
                    />
                    <div className="fixed right-3 top-14 sm:inset-auto sm:absolute sm:right-0 sm:top-full sm:mt-2 w-64 max-w-[calc(100vw-24px)] rounded-2xl border border-gray-200 bg-white p-2.5 shadow-2xl z-50 animate-fade-in divide-y divide-gray-100">
                      {/* User Info Header */}
                      <div className="px-2 pb-2">
                        <p className="text-xs font-bold text-gray-950 truncate leading-tight">{currentUser.name || 'Account'}</p>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">{currentUser.email}</p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            currentUser.role === 'admin'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300/60'
                              : currentUser.role === 'supplier'
                              ? 'bg-blue-100 text-blue-900 border border-blue-300/60'
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                            {currentUser.role || 'Customer'}
                          </span>
                        </div>
                      </div>

                      {/* Customer Navigation Links */}
                      <div className="py-1.5 space-y-0.5">
                        <Link
                          to="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-950 transition"
                        >
                          <span className="text-sm">👤</span>
                          <span>Account & Orders</span>
                        </Link>

                        <Link
                          to="/tracking"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-950 transition"
                        >
                          <span className="text-sm">🚚</span>
                          <span>Track Order</span>
                        </Link>

                        <Link
                          to="/wishlist"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-950 transition"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm text-rose-500">♥</span>
                            <span>Saved Wishlist</span>
                          </div>
                          {wishlistCount > 0 && (
                            <span className="rounded-full bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 text-[9px]">
                              {wishlistCount}
                            </span>
                          )}
                        </Link>

                        <Link
                          to="/cart"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-950 transition"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm">🛍️</span>
                            <span>My Shopping Bag</span>
                          </div>
                          {cartCount > 0 && (
                            <span className="rounded-full bg-gray-900 text-white font-bold px-1.5 py-0.2 text-[9px]">
                              {cartCount}
                            </span>
                          )}
                        </Link>
                      </div>

                      {/* Management Portals */}
                      {(isAdmin() || isSupplier()) && (
                        <div className="py-1.5 space-y-0.5">
                          <div className="px-2 py-0.5">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                              Portals
                            </span>
                          </div>

                          {isAdmin() && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-sm">⚙️</span>
                                <span>Admin Dashboard</span>
                              </div>
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded-full">Admin</span>
                            </Link>
                          )}

                          {isSupplier() && (
                            <Link
                              to="/supplier"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-bold text-blue-950 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 transition"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-sm">🏢</span>
                                <span>Vendor Portal</span>
                              </div>
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-200/80 text-blue-900 px-1.5 py-0.2 rounded-full">Supplier</span>
                            </Link>
                          )}
                        </div>
                      )}

                      {/* Sign Out */}
                      <div className="pt-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <span>🚪</span>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                aria-label="Login"
                title="Login / Account"
                className="inline-flex h-8.5 items-center gap-1.5 rounded-full bg-gray-950 px-3.5 text-white shadow-2xs transition hover:bg-black shrink-0 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-xs font-bold hidden sm:inline text-white">Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="xl:hidden flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 transition text-sm shrink-0 cursor-pointer shadow-2xs"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Search Bar Overlay */}
      {showSearchMobile && (
        <div className="lg:hidden border-t border-gray-200 bg-white p-3 animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search timepieces, footwear, bags..."
              autoFocus
              className="w-full rounded-full border border-gray-300 bg-[#F4F4F6] py-2 pl-9 pr-14 text-xs text-gray-900 outline-none focus:border-black focus:bg-white"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon className="w-3.5 h-3.5" />
            </span>
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gray-950 px-3 py-1 text-[10px] font-bold text-white"
            >
              Find
            </button>
          </form>
        </div>
      )}

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-gray-200 bg-white px-4 py-4 shadow-2xl max-h-[85vh] overflow-y-auto animate-fade-in">
          
          {/* Mobile Drawer Brand Identity */}
          <div className="flex items-center gap-2.5 pb-3.5 mb-3 border-b border-gray-100">
            <img
              src="/images/krishna-logo.png"
              alt="Krishna Accessories"
              className="h-10 w-10 object-contain rounded-xl bg-white p-0.5 border border-amber-500/30 shadow-2xs"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-gray-950 leading-tight">
                Krishna <span className="text-amber-700">Accessories</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">
                Mumbai Sanctuary
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-gray-800 hover:bg-neutral-100 transition"
            >
              Home
            </Link>
            
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-gray-800 hover:bg-neutral-100 transition"
            >
              Shop All Catalog
            </Link>

            <Link
              to="/new-arrivals"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-gray-800 hover:bg-neutral-100 transition flex items-center justify-between"
            >
              <span>New Arrivals</span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[9px] font-bold">New</span>
            </Link>

            {/* Shop by Price Tiers on Mobile */}
            <div className="py-2.5 px-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 my-1 normal-case">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block mb-2">
                🏷️ Shop by Price
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {PRICE_TIERS_NAV.map((tier) => (
                  <Link
                    key={tier.label}
                    to={`/shop?maxPrice=${tier.price}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-white border border-amber-200/70 text-gray-900 font-bold text-xs flex items-center gap-1.5"
                  >
                    <span>{tier.icon}</span>
                    <span>{tier.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* All Departments list on mobile */}
            <div className="py-2.5 px-3 border-y border-gray-100 my-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                  Departments ({allCategories.length})
                </span>
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[10px] font-bold text-gray-900 hover:underline normal-case"
                >
                  View All &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-1.5 normal-case font-medium">
                {allCategories.map(c => {
                  const icon = CATEGORY_ICONS[c] || '✨';
                  return (
                    <Link
                      key={c}
                      to={`/shop?category=${encodeURIComponent(c)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl bg-[#F4F4F6] px-2.5 py-2 text-[11px] text-gray-800 hover:bg-gray-200 transition font-semibold"
                    >
                      <span className="text-xs shrink-0">{icon}</span>
                      <span className="truncate">{c}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-gray-900 bg-neutral-100 hover:bg-neutral-200 transition flex items-center justify-between font-bold"
            >
              <div className="flex items-center gap-2">
                <span>🛍️</span>
                <span>My Shopping Bag</span>
              </div>
              <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold text-amber-300 bg-gray-950">
                {cartCount} items
              </span>
            </Link>

            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-gray-800 hover:bg-gray-100 transition flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-rose-500">♥</span>
                <span>Saved Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[9px] text-white font-bold">{wishlistCount}</span>
              )}
            </Link>

            <Link
              to="/tracking"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-gray-800 hover:bg-gray-100 transition flex items-center gap-2"
            >
              <span>🚚</span>
              <span>Track Order</span>
            </Link>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-gray-800 hover:bg-gray-100 transition"
            >
              About Us
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-gray-800 hover:bg-gray-100 transition"
            >
              Contact & Concierge
            </Link>

            {/* Account Status / Login */}
            <div className="border-t border-gray-100 pt-3 mt-2">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-xl bg-gray-100 py-2.5 text-center text-xs font-bold text-gray-900 hover:bg-gray-200 truncate px-2"
                    >
                      👤 Account
                    </Link>
                    <Link
                      to="/tracking"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-xl bg-gray-100 py-2.5 text-center text-xs font-bold text-gray-900 hover:bg-gray-200 truncate px-2"
                    >
                      🚚 Tracking
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full rounded-xl border border-rose-200 bg-rose-50 py-2 text-center text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full rounded-full bg-gray-950 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white hover:bg-black shadow-sm"
                >
                  <span className="text-white">Sign In to Account</span>
                </Link>
              )}
            </div>

            {/* Mobile Boutique Contact Details */}
            <div className="border-t border-gray-100 pt-3 mt-2 text-[11px] text-neutral-500 space-y-2 normal-case">
              <p className="text-gray-900 font-bold flex items-center gap-1.5">
                <span>📍</span>
                <span className="truncate">{SHOP_INFO.address}</span>
              </p>

              <div className="flex flex-col gap-1 text-gray-600 font-medium">
                <a href={`tel:+91${SHOP_INFO.rawPhone}`} className="hover:text-black flex items-center gap-1.5">
                  <span>📞</span>
                  <span>{SHOP_INFO.phone}</span>
                </a>
                <a href={`mailto:${SHOP_INFO.email}`} className="hover:text-black flex items-center gap-1.5 break-all">
                  <span>✉️</span>
                  <span>{SHOP_INFO.email}</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}