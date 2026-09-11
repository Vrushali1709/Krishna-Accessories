// src/components/Navbar.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCartCount } from '../utils/cart';
import { defaultCategories, getCategories, getWishlist } from '../utils/productStore';
import { getCurrentUser, logout, isAdmin, isSupplier, getAdminUser } from '../utils/auth';
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

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [allCategories, setAllCategories] = useState(() => getCategories());

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    setNotificationsOpen(false);
    setUserMenuOpen(false);
    setShowSearch(false);
  }, [location.pathname]);

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
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unreadNotifsCount = notifications.filter(n => n.unread).length;

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'shadow-md bg-white/98 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md'}`}>

      {/* Top Luxury Announcement & Quick Contact Bar */}
      <div className="bg-[#0B1120] text-slate-300 border-b border-slate-800 text-[11px] py-1.5 px-3 sm:px-6 lg:px-8 xl:px-10">
        <div className="mx-auto flex items-center justify-between gap-4">

          {/* Store Location Snippet */}
          <div className="flex items-center gap-2 truncate text-slate-300">
            <span className="text-amber-400 font-bold shrink-0">📍 Mumbai Boutique:</span>
            <span className="truncate hidden sm:inline text-slate-200">{SHOP_INFO.address}</span>
            <span className="truncate sm:hidden text-slate-200">Heera Panna, Haji Ali, Mumbai</span>
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
            <div className="flex items-center gap-2 border-l border-slate-700/80 pl-3">
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
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 border-b border-gray-200/80">
        <div className="relative flex h-14 sm:h-16 items-center justify-between">

          {/* Left: Brand Identity */}
          <div className="flex items-center shrink-0 z-10">
            <Link to="/" aria-label="Krishna Accessories home" className="flex items-center gap-2.5 sm:gap-3 group">
              <img
                src="/images/krishna-logo.png"
                alt="Krishna Accessories Logo"
                className="h-9 w-9 sm:h-10 sm:w-10 object-contain rounded-xl bg-white p-0.5 shadow-2xs border border-amber-500/30 transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-gray-950 leading-none group-hover:text-amber-950 transition-colors">
                  Krishna <span className="text-amber-700">Accessories</span>
                </span>
                <span className="text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.2em] text-gray-400 font-medium hidden xs:block mt-0.5">
                  Curated Luxury
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Primary Navigation Links (Strictly Centered in Viewport) */}
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

            {/* Collections Dropdown Flyout (Hover + Click) */}
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

                      <Link
                        to="/shop"
                        onClick={() => setCategoriesOpen(false)}
                        className="text-xs font-bold text-gray-900 hover:text-amber-600 transition flex items-center gap-1"
                      >
                        <span>Explore Catalog</span>
                        <span>&rarr;</span>
                      </Link>
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
              to="/about"
              className={`relative py-1.5 transition-colors ${location.pathname === '/about'
                ? 'text-gray-950 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#111827]'
                : 'hover:text-gray-950'
                }`}
            >
              About
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
                className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[9.5px] font-bold text-blue-700 hover:bg-blue-100 transition"
              >
                🏢 Vendor Portal
              </Link>
            )}
          </nav>

          {/* Right: Search & Actions (Pinned to far right end) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto z-10">

            {/* Search Input Bar (Desktop) */}
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

            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Search Catalog"
              className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 transition cursor-pointer"
            >
              <SearchIcon className="w-3.5 h-3.5" />
            </button>

            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 transition relative cursor-pointer"
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
                  {/* Mobile backdrop for easy dismissal */}
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

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className={`relative flex h-8 w-8 items-center justify-center rounded-lg border transition cursor-pointer ${location.pathname === '/wishlist'
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

            {/* Shopping Bag Button */}
            <Link
              to="/cart"
              aria-label="Shopping bag"
              title="Shopping bag"
              className={`relative flex h-8 w-8 items-center justify-center rounded-lg border transition cursor-pointer ${location.pathname === '/cart'
                ? 'border-gray-900 bg-gray-100 text-gray-950 font-bold'
                : 'border-gray-200 bg-[#F4F4F6] text-gray-700 hover:border-gray-300 hover:bg-gray-200'
                }`}
            >
              <BagIcon className="w-3.5 h-3.5 text-gray-800" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#111827] text-[8px] font-bold text-white shadow-2xs">
                {cartCount}
              </span>
            </Link>

            {/* User Profile / Menu */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex h-8.5 items-center gap-2 rounded-xl border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 shadow-2xs cursor-pointer"
                >
                  <div className="flex h-5.5 w-5.5 items-center justify-center rounded-lg bg-gray-100 text-gray-900 font-bold text-[11px]">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline truncate max-w-[85px] text-[11.5px] text-gray-900 font-semibold">
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
                          to="/account?tab=tracking"
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

                        {/* Admin Portal / Admin Login Link */}
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
                        ) : (
                          <Link
                            to="/login"
                            state={{ requiredRole: 'admin', from: '/admin', message: 'Enter Administrator ID & Password to access Admin Management.' }}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold text-gray-800 hover:bg-amber-50 hover:text-amber-950 hover:border-amber-200 transition"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm">🔑</span>
                              <span>Admin / Staff Login</span>
                            </div>
                            <span className="text-[10px] text-gray-400">&rarr;</span>
                          </Link>
                        )}

                        {/* Vendor Portal / Vendor Login Link */}
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
                        ) : (
                          <Link
                            to="/login"
                            state={{ requiredRole: 'supplier', from: '/supplier', message: 'Enter Supplier ID & Password to access Vendor Portal.' }}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-950 hover:border-blue-200 transition"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm">🏢</span>
                              <span>Vendor Partner Portal</span>
                            </div>
                            <span className="text-[10px] text-gray-400">&rarr;</span>
                          </Link>
                        )}

                        {/* Login Page (Direct access to all roles) */}
                        <Link
                          to="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-950 transition"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm">🔄</span>
                            <span>Login Page (All Roles)</span>
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
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#111827] text-white shadow-2xs transition hover:bg-black shrink-0 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-white" />
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="xl:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 transition text-sm shrink-0 cursor-pointer"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Search Bar Overlay */}
      {showSearch && (
        <div className="lg:hidden border-t border-gray-200 bg-white p-2.5 animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search timepieces, footwear, bags..."
              autoFocus
              className="w-full rounded-lg border border-gray-300 bg-[#F4F4F6] py-1.5 pl-8 pr-12 text-xs text-gray-900 outline-none"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon className="w-3 h-3" />
            </span>
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-[#111827] px-2.5 py-0.5 text-[10px] font-bold text-white"
            >
              Find
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-gray-200 bg-white px-3.5 py-3.5 shadow-xl max-h-[80vh] overflow-y-auto animate-fade-in">
          {/* Mobile Drawer Brand Identity */}
          <div className="flex items-center gap-2.5 pb-3 mb-2 border-b border-gray-100">
            <img
              src="/images/krishna-logo.png"
              alt="Krishna Accessories"
              className="h-10 w-10 object-contain rounded-xl bg-white p-0.5 border border-amber-500/30 shadow-2xs"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-gray-950 leading-tight">
                Krishna <span className="text-amber-700">Accessories</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold">
                Mumbai Boutique
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider">
            <Link
              to="/"
              className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-black transition"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-black transition"
            >
              Shop All Catalog
            </Link>

            {/* All Departments list on mobile */}
            <div className="py-2.5 px-3 border-y border-gray-100 my-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                  All Departments ({allCategories.length})
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
                      className="flex items-center gap-2 rounded-lg bg-[#F4F4F6] px-2.5 py-2 text-[11px] text-gray-800 hover:bg-gray-200 transition"
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
              className="rounded-lg px-3 py-2 text-gray-900 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between font-bold"
            >
              <div className="flex items-center gap-2">
                <span>🛍️</span>
                <span>My Shopping Bag</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold text-white ${cartCount > 0 ? 'bg-[#111827]' : 'bg-gray-400'}`}>
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-black transition flex items-center justify-between"
            >
              <span>Saved Wishlist</span>
              {wishlistCount > 0 && (
                <span className="rounded-full bg-rose-600 px-1.5 py-0.2 text-[8.5px] text-white font-bold">{wishlistCount}</span>
              )}
            </Link>
            <Link
              to="/about"
              className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-black transition"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-black transition"
            >
              Contact & Concierge
            </Link>

            {/* Portal & Staff Access links on Mobile */}
            <div className="pt-2 border-t border-gray-100 space-y-1">
              {currentUser && currentUser.role === 'admin' ? (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 font-bold text-amber-950 bg-amber-50 border border-amber-200 block"
                >
                  ⚙️ Admin Control Console
                </Link>
              ) : (
                <Link
                  to="/login"
                  state={{ requiredRole: 'admin', from: '/admin', message: 'Enter Administrator ID & Password to access Admin Management.' }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 font-semibold text-gray-800 hover:bg-amber-50 hover:text-amber-950 block"
                >
                  🔑 Admin / Staff Login &rarr;
                </Link>
              )}

              {currentUser && currentUser.role === 'supplier' ? (
                <Link
                  to="/supplier"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 font-bold text-blue-700 bg-blue-50 border border-blue-200 block"
                >
                  🏢 Vendor Portal
                </Link>
              ) : (
                <Link
                  to="/login"
                  state={{ requiredRole: 'supplier', from: '/supplier', message: 'Enter Supplier ID & Password to access Vendor Portal.' }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-950 block"
                >
                  🏢 Vendor Partner Portal &rarr;
                </Link>
              )}

              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 font-semibold text-gray-600 hover:bg-gray-100 block"
              >
                🔄 Login Page (All Roles) &rarr;
              </Link>
            </div>

            <div className="border-t border-gray-100 pt-2.5 mt-1.5">
              {currentUser ? (
                <div className="space-y-1.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    <Link
                      to="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-lg bg-gray-100 py-2 text-center text-xs font-bold text-gray-900 hover:bg-gray-200 truncate px-2"
                    >
                      👤 Account
                    </Link>
                    <Link
                      to="/account?tab=tracking"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-lg bg-gray-100 py-2 text-center text-xs font-bold text-gray-900 hover:bg-gray-200 truncate px-2"
                    >
                      🚚 Track Order
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full rounded-lg border border-rose-200 bg-rose-50 py-1.5 text-center text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full rounded-full bg-[#111827] py-2 text-center text-xs font-semibold uppercase tracking-wider text-white hover:bg-black"
                  >
                    <span className="text-white">Sign In to Account</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Boutique Info & Social Links */}
            <div className="border-t border-gray-100 pt-3 mt-1 text-[11px] text-gray-500 space-y-2">
              <p className="text-gray-900 font-semibold flex items-center gap-1.5">
                <span>📍</span>
                <span className="truncate">{SHOP_INFO.shortAddress}</span>
              </p>

              <div className="flex flex-col gap-1 text-gray-600">
                <a href={`tel:+91${SHOP_INFO.rawPhone}`} className="hover:text-black flex items-center gap-1.5">
                  <span>📞</span>
                  <span>{SHOP_INFO.phone}</span>
                </a>
                <a href={`mailto:${SHOP_INFO.email}`} className="hover:text-black flex items-center gap-1.5 break-all">
                  <span>✉️</span>
                  <span>{SHOP_INFO.email}</span>
                </a>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Social:</span>
                <a
                  href={SHOP_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-[#1877F2] hover:bg-gray-200 transition"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={SHOP_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-pink-600 hover:bg-gray-200 transition"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={SHOP_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-emerald-600 hover:bg-gray-200 transition"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}