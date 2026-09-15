// src/components/Navbar.jsx
import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCartCount } from '../utils/cart';
import { getCategories, getWishlist } from '../utils/productStore';
import { getCurrentUser, logout, isAdmin, isSupplier } from '../utils/auth';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../utils/orderStore';
import { SHOP_INFO } from '../utils/shopInfo';
import {
  BagIcon,
  SearchIcon,
  UserIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HeartIcon,
  BellIcon,
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  PhoneIcon,
  MailIcon,
  MenuIcon,
  CloseIcon,
  ArrowRightIcon,
  MapPinIcon
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

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [allCategories, setAllCategories] = useState(() => getCategories());

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCatsExpanded, setMobileCatsExpanded] = useState(false);
  const [mobileNotifsView, setMobileNotifsView] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const catTimeoutRef = useRef(null);

  const handleCatMouseEnter = () => {
    if (catTimeoutRef.current) clearTimeout(catTimeoutRef.current);
    setCategoriesOpen(true);
  };

  const handleCatMouseLeave = () => {
    catTimeoutRef.current = setTimeout(() => {
      setCategoriesOpen(false);
    }, 150);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (catTimeoutRef.current) clearTimeout(catTimeoutRef.current);
    };
  }, []);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setMobileNotifsView(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const refreshState = () => {
    setCartCount(getCartCount());
    setWishlistCount(getWishlist().length);
    setNotifications(getNotifications());
    setCurrentUser(getCurrentUser());
    setAllCategories(getCategories());
  };

  useEffect(() => {
    refreshState();
    window.addEventListener('cartUpdated', refreshState);
    window.addEventListener('wishlistUpdated', refreshState);
    window.addEventListener('notificationsUpdated', refreshState);
    window.addEventListener('categoriesUpdated', refreshState);
    window.addEventListener('authUpdated', refreshState);
    window.addEventListener('storage', refreshState);

    return () => {
      window.removeEventListener('cartUpdated', refreshState);
      window.removeEventListener('wishlistUpdated', refreshState);
      window.removeEventListener('notificationsUpdated', refreshState);
      window.removeEventListener('categoriesUpdated', refreshState);
      window.removeEventListener('authUpdated', refreshState);
      window.removeEventListener('storage', refreshState);
    };
  }, [location.pathname]);

  // Close menus on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    setNotificationsOpen(false);
    setUserMenuOpen(false);
    setShowSearch(false);
    setMobileNotifsView(false);
  }, [location.pathname]);

  // Click outside to dismiss popups
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
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    navigate('/');
  };

  const unreadNotifsCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'shadow-md bg-white/98 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md'}`}>

        {/* Top Announcement & Boutique Contact Bar */}
        <div className="bg-[#0B1120] text-slate-300 border-b border-slate-800 text-[11px] py-1.5 px-3 sm:px-6 lg:px-8 xl:px-10">
          <div className="mx-auto flex items-center justify-between gap-3">

            {/* Boutique Location */}
            <div className="flex items-center gap-1.5 truncate text-slate-300">
              <span className="text-amber-400 font-bold shrink-0">📍 Mumbai Boutique:</span>
              <span className="truncate hidden sm:inline text-slate-200">{SHOP_INFO.address}</span>
              <span className="truncate sm:hidden text-slate-200">Heera Panna, Haji Ali</span>
            </div>

            {/* Quick Direct Contacts & Social Icons */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Phone */}
              <a
                href={`tel:+91${SHOP_INFO.rawPhone}`}
                className="hidden md:inline-flex items-center gap-1 text-slate-200 hover:text-amber-300 transition"
                title="Direct Concierge Line"
              >
                <PhoneIcon className="w-3 h-3 text-amber-400" />
                <span>{SHOP_INFO.phone}</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${SHOP_INFO.email}`}
                className="hidden lg:inline-flex items-center gap-1 text-slate-200 hover:text-amber-300 transition"
                title="Customer Support Email"
              >
                <MailIcon className="w-3 h-3 text-amber-400" />
                <span>{SHOP_INFO.email}</span>
              </a>

              {/* Social Icons Strip */}
              <div className="flex items-center gap-2.5 border-l border-slate-700/80 pl-2.5 sm:pl-3">
                <a
                  href={SHOP_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook"
                  aria-label="Facebook"
                  className="text-slate-400 hover:text-[#1877F2] transition hover:scale-110"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={SHOP_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                  aria-label="Instagram"
                  className="text-slate-400 hover:text-pink-400 transition hover:scale-110"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={SHOP_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="WhatsApp Concierge"
                  aria-label="WhatsApp Concierge"
                  className="text-slate-400 hover:text-emerald-400 transition hover:scale-110"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>

          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 border-b border-gray-200/80">
          <div className="relative flex h-14 sm:h-16 items-center justify-between gap-2">

            {/* Left: Brand Identity */}
            <div className="flex items-center shrink-0 min-w-0 z-10">
              <Link to="/" aria-label="Krishna Accessories home" className="flex items-center gap-2 sm:gap-3 group min-w-0">
                <img
                  src="/images/krishna-logo.png"
                  alt="Krishna Accessories Logo"
                  className="h-8.5 w-8.5 sm:h-10 sm:w-10 object-contain rounded-xl bg-white p-0.5 shadow-2xs border border-amber-500/30 transition-transform group-hover:scale-105 shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-[13.5px] xs:text-sm sm:text-base tracking-tight text-gray-950 leading-none group-hover:text-amber-950 transition-colors truncate">
                    Krishna <span className="text-amber-700">Accessories</span>
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-gray-400 font-medium hidden xs:block mt-0.5">
                    Curated Luxury
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links (Centered on Desktop) */}
            <nav className="hidden xl:flex items-center gap-7 text-[12px] font-semibold uppercase tracking-[0.14em] text-gray-600 absolute left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
              <Link
                to="/"
                className={`relative py-1.5 transition-colors ${location.pathname === '/'
                  ? 'text-gray-950 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#111827]'
                  : 'hover:text-gray-950'
                  }`}
              >
                Home
              </Link>

              <Link
                to="/about"
                className={`relative py-1.5 transition-colors ${location.pathname === '/about'
                  ? 'text-gray-950 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#111827]'
                  : 'hover:text-gray-950'
                  }`}
              >
                About
              </Link>

              {/* Collections Dropdown Flyout */}
              <div
                className="relative"
                ref={dropdownRef}
                onMouseEnter={handleCatMouseEnter}
                onMouseLeave={handleCatMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className={`flex items-center gap-1.5 py-1.5 transition-colors uppercase cursor-pointer ${location.pathname === '/shop' && !location.search
                    ? 'text-gray-950 font-bold'
                    : 'hover:text-gray-950'
                    }`}
                >
                  <span>Collections</span>
                  <ChevronDownIcon
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesOpen ? 'rotate-180 text-gray-950' : 'text-gray-400'
                      }`}
                  />
                </button>

                {categoriesOpen && (
                  <div
                    onMouseEnter={handleCatMouseEnter}
                    onMouseLeave={handleCatMouseLeave}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[460px] sm:w-[520px] z-50 animate-fade-in"
                  >
                    <div className="rounded-3xl border border-gray-200/90 bg-white/98 backdrop-blur-xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
                      {/* Header */}
                      <div className="px-2 pb-3 mb-2.5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                            All Departments
                          </span>
                          <span className="rounded-full bg-amber-50 border border-amber-200/60 px-2 py-0.5 text-[9.5px] font-bold text-amber-900">
                            {allCategories.length} Collections
                          </span>
                        </div>

                      </div>

                      {/* All Categories 2-Column Clean Grid */}
                      <div className="grid grid-cols-2 gap-1.5">
                        {allCategories.map((cat) => {
                          const icon = CATEGORY_ICONS[cat] || '✨';
                          const isActive = location.search.includes(`category=${encodeURIComponent(cat)}`);

                          return (
                            <Link
                              key={cat}
                              to={`/shop?category=${encodeURIComponent(cat)}`}
                              onClick={() => setCategoriesOpen(false)}
                              className={`group/cat flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold normal-case transition-all duration-150 ${isActive
                                ? 'bg-gray-950 text-white shadow-xs'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-950'
                                }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-base shrink-0 transition-transform group-hover/cat:scale-110">{icon}</span>
                                <span className="truncate">{cat}</span>
                              </div>
                              <span className={`text-[11px] transition-transform duration-150 group-hover/cat:translate-x-0.5 shrink-0 ${isActive ? 'text-amber-300' : 'text-gray-400 group-hover/cat:text-gray-900'
                                }`}>
                                &rarr;
                              </span>
                            </Link>
                          );
                        })}
                      </div>

                      {/* Bottom strip */}
                      <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between px-2 text-[10.5px] text-gray-400 font-medium">
                        <span>★ Quality Products &amp; Trusted Shopping</span>
                        <span className="text-gray-300">&bull;</span>
                        <span>Express Doorstep Delivery</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/shop"
                className={`relative py-1.5 transition-colors ${location.pathname === '/shop' && !location.search
                  ? 'text-gray-950 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#111827]'
                  : 'hover:text-gray-950'
                  }`}
              >
                Shop All
              </Link>

              <Link
                to="/new-arrivals"
                className={`relative py-1.5 transition-colors ${location.pathname === '/new-arrivals'
                  ? 'text-gray-950 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#111827]'
                  : 'hover:text-gray-950'
                  }`}
              >
                New Arrivals
              </Link>

              {/* Portal Link: Admin */}
              {isAdmin() && (
                <Link
                  to="/admin"
                  className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[9.5px] font-bold text-amber-900 hover:bg-amber-100 transition shadow-2xs"
                >
                  ⚙️ Admin Panel
                </Link>
              )}

              {/* Portal Link: Supplier */}
              {isSupplier() && (
                <Link
                  to="/supplier"
                  className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-[9.5px] font-bold text-gray-700 hover:bg-gray-50 transition"
                >
                  🏢 Vendor Portal
                </Link>
              )}
            </nav>

            {/* Right: Actions & Mobile Navigation Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto z-10">

              {/* Search Input Bar (Desktop lg+) */}
              <form onSubmit={handleSearchSubmit} className="hidden lg:block relative w-36 xl:w-44 focus-within:w-56 transition-all duration-250">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search catalog..."
                  className="h-8.5 w-full rounded-full border border-gray-200 bg-[#F4F4F6] pl-7 pr-9 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-gray-400 focus:bg-white"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <SearchIcon className="w-3 h-3" />
                </span>
                {searchQuery && (
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[#111827] px-2 py-0.5 text-[8.5px] font-bold text-white hover:bg-black transition cursor-pointer"
                  >
                    Go
                  </button>
                )}
              </form>

              {/* Mobile / Tablet Search Toggle Button */}
              <button
                type="button"
                onClick={() => setShowSearch(!showSearch)}
                aria-label="Search Catalog"
                className={`lg:hidden flex h-8.5 w-8.5 items-center justify-center rounded-lg border transition cursor-pointer ${showSearch
                  ? 'border-gray-950 bg-gray-950 text-white'
                  : 'border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <SearchIcon className="w-3.5 h-3.5" />
              </button>

              {/* Notifications Popover (Hidden on mobile < sm:, available in drawer & sm+) */}
              <div className="relative hidden sm:block" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  aria-label="Notifications"
                  className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 transition relative cursor-pointer"
                >
                  <BellIcon className="w-3.5 h-3.5 text-gray-700" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[8px] font-bold text-white shadow-2xs">
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
                            <span className="rounded-full bg-rose-600 px-1.5 py-0.2 text-[8.5px] font-bold text-white">
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
                              className={`rounded-xl p-2.5 text-xs transition cursor-pointer ${n.unread ? 'bg-[#F4F4F6] border border-gray-200' : 'hover:bg-gray-50'
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

              {/* Wishlist Button (Hidden on mobile < sm:, available in drawer & sm+) */}
              <Link
                to="/wishlist"
                className={`hidden sm:flex relative h-8.5 w-8.5 items-center justify-center rounded-lg border transition cursor-pointer ${location.pathname === '/wishlist'
                  ? 'border-gray-900 bg-gray-100 text-gray-950 font-bold'
                  : 'border-gray-200 bg-[#F4F4F6] text-gray-700 hover:border-gray-300 hover:bg-gray-200'
                  }`}
                title="Saved Wishlist"
                aria-label="Wishlist"
              >
                <HeartIcon className="w-3.5 h-3.5 text-gray-700 shrink-0" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[8px] font-bold text-white shadow-2xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Button (Always Visible) */}
              <Link
                to="/cart"
                aria-label="Shopping bag"
                title="Shopping bag"
                className={`relative flex h-8.5 w-8.5 items-center justify-center rounded-lg border transition cursor-pointer ${location.pathname === '/cart'
                  ? 'border-gray-900 bg-gray-100 text-gray-950 font-bold'
                  : 'border-gray-200 bg-[#F4F4F6] text-gray-700 hover:border-gray-300 hover:bg-gray-200'
                  }`}
              >
                <BagIcon className="w-3.5 h-3.5 text-gray-800" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#111827] text-[8px] font-bold text-white shadow-2xs">
                  {cartCount}
                </span>
              </Link>

              {/* User Profile / Menu (Hidden on mobile < md:, fully in drawer) */}
              {currentUser ? (
                <div className="relative hidden md:block" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex h-8.5 items-center gap-2 rounded-xl border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 shadow-2xs cursor-pointer"
                  >
                    <div className="flex h-5.5 w-5.5 items-center justify-center rounded-lg bg-gray-100 text-gray-900 font-bold text-[11px]">
                      {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="truncate max-w-[85px] text-[11.5px] text-gray-900 font-semibold">
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
                            <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${currentUser.role === 'admin'
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

                        {/* Management Portals & Admin Login Options */}
                        <div className="py-1.5 space-y-0.5">
                          <div className="px-2 py-0.5">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                              Portals & Staff Login
                            </span>
                          </div>

                          {isAdmin() ? (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-sm">⚙️</span>
                                <span>Admin Dashboard</span>
                              </div>
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded-full">Active</span>
                            </Link>
                          ) : null}

                          {isSupplier() ? (
                            <Link
                              to="/supplier"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-bold text-blue-950 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 transition"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-sm">🏢</span>
                                <span>Vendor Partner Portal</span>
                              </div>
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-200/80 text-blue-900 px-1.5 py-0.2 rounded-full">Active</span>
                            </Link>
                          ) : null}

                          <Link
                            to="/login"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-950 transition"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm">🔄</span>
                              <span>Switch Account / Login</span>
                            </div>
                            <span className="text-[10px] text-gray-400">&rarr;</span>
                          </Link>
                        </div>

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
                  title="Login"
                  className="hidden md:inline-flex h-8.5 w-8.5 items-center justify-center rounded-full bg-[#111827] text-white shadow-2xs transition hover:bg-black shrink-0 cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-white" />
                </Link>
              )}

              {/* Mobile / Tablet Menu Toggle Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                className={`xl:hidden flex h-8.5 w-8.5 items-center justify-center rounded-lg border transition text-sm shrink-0 cursor-pointer ${mobileMenuOpen
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-[#F4F4F6] text-gray-800 hover:bg-gray-200'
                  }`}
              >
                {mobileMenuOpen ? (
                  <CloseIcon className="w-4 h-4 text-white" />
                ) : (
                  <MenuIcon className="w-4 h-4 text-gray-800" />
                )}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Search Bar Dropdown Overlay */}
        {showSearch && (
          <div className="lg:hidden border-b border-gray-200 bg-white px-3.5 py-2.5 shadow-sm animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands, luxury items..."
                  autoFocus
                  className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] py-2 pl-9 pr-8 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-gray-950 focus:bg-white"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <SearchIcon className="w-3.5 h-3.5" />
                </span>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs p-1"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="rounded-xl bg-[#111827] px-3.5 py-2 text-xs font-bold text-white hover:bg-black transition cursor-pointer shrink-0 shadow-2xs"
              >
                Search
              </button>
            </form>
          </div>
        )}

      </header>

      {/* Offcanvas Mobile Navigation Drawer (Rendered at Body Level via React Portal to prevent clipping) */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="xl:hidden fixed inset-0 z-[99999] overflow-hidden pointer-events-auto">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
          />

          {/* Slide-in Drawer Container */}
          <div className="fixed inset-y-0 right-0 w-[86vw] max-w-[370px] bg-white shadow-2xl flex flex-col z-[100000] animate-drawer-in divide-y divide-gray-100 overflow-hidden">

            {/* Drawer Header */}
            <div className="px-4 py-3.5 flex items-center justify-between bg-[#FAFAFB]">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 min-w-0"
              >
                <img
                  src="/images/krishna-logo.png"
                  alt="Krishna Accessories"
                  className="h-9 w-9 object-contain rounded-xl bg-white p-0.5 border border-amber-500/30 shadow-2xs shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-sm text-gray-950 leading-tight truncate">
                    Krishna <span className="text-amber-700">Accessories</span>
                  </span>
                  <span className="text-[8.5px] uppercase tracking-widest text-gray-400 font-semibold">
                    Mumbai Boutique
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200/80 text-gray-800 hover:bg-gray-300 transition cursor-pointer shrink-0"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">

              {/* Quick Actions 4-Grid Strip */}
              <div className="grid grid-cols-4 gap-2">
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 p-2 text-center hover:bg-gray-100 transition relative"
                >
                  <div className="relative mb-1">
                    <BagIcon className="w-5 h-5 text-gray-900" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-950 text-[8px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 leading-none">Bag</span>
                </Link>

                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 p-2 text-center hover:bg-gray-100 transition relative"
                >
                  <div className="relative mb-1">
                    <HeartIcon className="w-5 h-5 text-rose-600" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[8px] font-bold text-white">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 leading-none">Wishlist</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileNotifsView(!mobileNotifsView)}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-2 text-center transition relative cursor-pointer ${mobileNotifsView ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'}`}
                >
                  <div className="relative mb-1">
                    <BellIcon className="w-5 h-5 text-amber-600" />
                    {unreadNotifsCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[8px] font-bold text-white">
                        {unreadNotifsCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold leading-none">Alerts</span>
                </button>

                <Link
                  to={currentUser ? "/account" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 p-2 text-center hover:bg-gray-100 transition"
                >
                  <div className="mb-1">
                    <UserIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 leading-none truncate max-w-full">
                    {currentUser ? 'Account' : 'Login'}
                  </span>
                </Link>
              </div>

              {/* Inline Notifications Sub-View if Alerts Tab is active */}
              {mobileNotifsView && (
                <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-3 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/60">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-gray-950 uppercase tracking-wider">Notifications</span>
                      {unreadNotifsCount > 0 && (
                        <span className="rounded-full bg-rose-600 px-1.5 py-0.2 text-[8.5px] font-bold text-white">
                          {unreadNotifsCount} new
                        </span>
                      )}
                    </div>
                    {unreadNotifsCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        className="text-[10px] font-bold text-amber-900 hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-3">No notifications right now.</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`rounded-xl p-2 text-xs transition cursor-pointer ${n.unread ? 'bg-white border border-amber-300/80 shadow-2xs' : 'bg-white/60 border border-gray-200/60'}`}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className="font-semibold text-gray-900 text-[11px] leading-snug">{n.title}</span>
                            <span className="text-[8.5px] text-gray-400 font-mono shrink-0">{n.date}</span>
                          </div>
                          <p className="mt-0.5 text-[10.5px] text-gray-600 leading-snug break-words">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Quick Live Search in Drawer */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 500+ Luxury Items..."
                  className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] py-2 pl-9 pr-14 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <SearchIcon className="w-3.5 h-3.5" />
                </span>
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg bg-[#111827] px-2.5 py-1 text-[10px] font-bold text-white"
                >
                  Find
                </button>
              </form>

              {/* Primary Navigation Links */}
              <div className="space-y-1 font-semibold text-xs text-gray-800">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${location.pathname === '/' ? 'bg-gray-950 text-white font-bold' : 'hover:bg-gray-100'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>🏠</span>
                    <span>Home</span>
                  </div>
                  <ArrowRightIcon className="w-3.5 h-3.5 opacity-60" />
                </Link>

                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${location.pathname === '/about' ? 'bg-gray-950 text-white font-bold' : 'hover:bg-gray-100'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>ℹ️</span>
                    <span>About</span>
                  </div>
                  <ArrowRightIcon className="w-3.5 h-3.5 opacity-60" />
                </Link>

                {/* Collapsible Collections Accordion */}
                <div className="rounded-xl border border-gray-100 bg-[#FAFAFB] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setMobileCatsExpanded(!mobileCatsExpanded)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-gray-900 hover:bg-gray-100 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span>💎</span>
                      <span>Collections ({allCategories.length})</span>
                    </div>
                    <ChevronDownIcon className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${mobileCatsExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileCatsExpanded && (
                    <div className="px-2.5 pb-2.5 pt-1 space-y-1 border-t border-gray-100 bg-white">
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        {allCategories.map(cat => {
                          const icon = CATEGORY_ICONS[cat] || '✨';
                          const isCatActive = location.search.includes(`category=${encodeURIComponent(cat)}`);
                          return (
                            <Link
                              key={cat}
                              to={`/shop?category=${encodeURIComponent(cat)}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-medium transition ${isCatActive
                                ? 'bg-gray-950 text-white font-bold'
                                : 'bg-[#F4F4F6] text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                              <span className="text-xs shrink-0">{icon}</span>
                              <span className="truncate">{cat}</span>
                            </Link>
                          );
                        })}
                      </div>

                      <Link
                        to="/shop"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-center text-[10.5px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 py-1.5 rounded-lg transition mt-1"
                      >
                        Explore All Categories &rarr;
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${location.pathname === '/shop' && !location.search ? 'bg-gray-950 text-white font-bold' : 'hover:bg-gray-100'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>🛍️</span>
                    <span>Shop All</span>
                  </div>
                  <ArrowRightIcon className="w-3.5 h-3.5 opacity-60" />
                </Link>

                <Link
                  to="/new-arrivals"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${location.pathname === '/new-arrivals' ? 'bg-gray-950 text-white font-bold' : 'hover:bg-gray-100'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>🌟</span>
                    <span>New Arrivals</span>
                  </div>
                  <span className="rounded-full bg-amber-100 text-amber-900 text-[9px] font-bold px-2 py-0.5">Fresh</span>
                </Link>

                <Link
                  to="/tracking"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${location.pathname === '/tracking' ? 'bg-gray-950 text-white font-bold' : 'hover:bg-gray-100'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>🚚</span>
                    <span>Track Order</span>
                  </div>
                  <ArrowRightIcon className="w-3.5 h-3.5 opacity-60" />
                </Link>

                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${location.pathname === '/about' ? 'bg-gray-950 text-white font-bold' : 'hover:bg-gray-100'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>ℹ️</span>
                    <span>About Krishna Boutique</span>
                  </div>
                  <ArrowRightIcon className="w-3.5 h-3.5 opacity-60" />
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${location.pathname === '/contact' ? 'bg-gray-950 text-white font-bold' : 'hover:bg-gray-100'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>📞</span>
                    <span>Contact &amp; Concierge</span>
                  </div>
                  <ArrowRightIcon className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </div>

              {/* Portals & Management Section */}
              <div className="pt-2 border-t border-gray-100 space-y-1.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 px-1">
                  Management &amp; Portals
                </span>

                {currentUser && currentUser.role === 'admin' ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-amber-950 bg-amber-50 border border-amber-200"
                  >
                    <div className="flex items-center gap-2">
                      <span>⚙️</span>
                      <span>Admin Control Console</span>
                    </div>
                    <span className="text-[8.5px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded-full">ACTIVE</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    state={{ requiredRole: 'admin', from: '/admin', message: 'Enter Administrator credentials to access Admin Management.' }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-amber-50 hover:text-amber-950 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span>🔑</span>
                      <span>Admin / Staff Login</span>
                    </div>
                    <span className="text-[10px] text-gray-400">&rarr;</span>
                  </Link>
                )}

                {currentUser && currentUser.role === 'supplier' ? (
                  <Link
                    to="/supplier"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200"
                  >
                    <div className="flex items-center gap-2">
                      <span>🏢</span>
                      <span>Vendor Partner Portal</span>
                    </div>
                    <span className="text-[8.5px] bg-blue-200 text-blue-900 font-bold px-1.5 py-0.2 rounded-full">ACTIVE</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    state={{ requiredRole: 'supplier', from: '/supplier', message: 'Enter Supplier credentials to access Vendor Portal.' }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-blue-950 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span>🏢</span>
                      <span>Vendor Partner Portal</span>
                    </div>
                    <span className="text-[10px] text-gray-400">&rarr;</span>
                  </Link>
                )}
              </div>

              {/* User Account / Sign In Block */}
              <div className="pt-2 border-t border-gray-100">
                {currentUser ? (
                  <div className="space-y-2 rounded-2xl bg-gray-50 border border-gray-200/80 p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white font-bold text-xs">
                        {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-950 truncate leading-tight">{currentUser.name || 'Customer'}</p>
                        <p className="text-[10px] text-gray-500 truncate">{currentUser.email}</p>
                      </div>
                      <span className="rounded-full bg-gray-200 text-gray-700 text-[8.5px] font-bold px-1.5 py-0.5 uppercase">
                        {currentUser.role || 'Customer'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        to="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-xl bg-white border border-gray-200 py-1.5 text-center text-xs font-bold text-gray-900 hover:bg-gray-100 transition"
                      >
                        My Account
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-xl border border-rose-200 bg-rose-50 py-1.5 text-center text-xs font-bold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full rounded-xl bg-[#111827] py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-black transition"
                    >
                      Sign In to Account
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full rounded-xl border border-gray-300 bg-white py-2 text-center text-xs font-bold text-gray-800 hover:bg-gray-50 transition"
                    >
                      Create New Account
                    </Link>
                  </div>
                )}
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="bg-[#0B1120] text-slate-300 p-3.5 space-y-2.5 shrink-0">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Direct Concierge:</span>
                <a
                  href={`tel:+91${SHOP_INFO.rawPhone}`}
                  className="font-bold text-amber-400 hover:underline flex items-center gap-1"
                >
                  <PhoneIcon className="w-3 h-3" />
                  <span>{SHOP_INFO.phone}</span>
                </a>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Follow Us:</span>
                <div className="flex items-center gap-2">
                  <a
                    href={SHOP_INFO.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:text-[#1877F2] transition"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={SHOP_INFO.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:text-pink-400 transition"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={SHOP_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-950/80 text-emerald-400 hover:bg-emerald-900 transition"
                    aria-label="WhatsApp"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}