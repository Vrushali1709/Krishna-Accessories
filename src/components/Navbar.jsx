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

const POPULAR_SEARCHES = ['Watches', 'Leather Bag', 'Sneakers', 'Smartwatch', 'Perfume'];

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
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

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    setNotificationsOpen(false);
    setUserMenuOpen(false);
    setShowSearch(false);
  }, [location.pathname]);

  // Click & Touch outside handlers
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
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const handleQuickSearch = (term) => {
    navigate(`/shop?search=${encodeURIComponent(term)}`);
    setShowSearch(false);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const unreadNotifsCount = notifications.filter(n => n.unread).length;

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'shadow-md bg-white/98 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md'}`}>

      {/* Top Luxury Announcement & Quick Contact Bar */}
      <div className="bg-[#0B1120] text-slate-300 border-b border-slate-800 text-[10.5px] sm:text-[11px] py-1.5 px-3 sm:px-6 lg:px-8 xl:px-10">
        <div className="mx-auto flex items-center justify-between gap-2 sm:gap-4 overflow-hidden">

          {/* Store Location Snippet */}
          <div className="flex items-center gap-1.5 sm:gap-2 truncate text-slate-300 min-w-0">
            <span className="text-amber-400 font-bold shrink-0">📍 Boutique:</span>
            <span className="truncate hidden sm:inline text-slate-200">{SHOP_INFO.address}</span>
            <span className="truncate sm:hidden text-slate-200">Heera Panna, Haji Ali, Mumbai</span>
          </div>

          {/* Quick Direct Contacts & Social Icons */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Phone (Desktop) */}
            <a
              href={`tel:+91${SHOP_INFO.rawPhone}`}
              className="hidden md:inline-flex items-center gap-1 text-slate-200 hover:text-amber-300 transition"
              title="Direct Concierge Line"
            >
              <PhoneIcon className="w-3 h-3 text-amber-400" />
              <span>{SHOP_INFO.phone}</span>
            </a>

            {/* Email (Large Screens) */}
            <a
              href={`mailto:${SHOP_INFO.email}`}
              className="hidden lg:inline-flex items-center gap-1 text-slate-200 hover:text-amber-300 transition"
              title="Official Support Email"
            >
              <MailIcon className="w-3 h-3 text-amber-400" />
              <span>{SHOP_INFO.email}</span>
            </a>

            {/* Social Icons Strip */}
            <div className="flex items-center gap-2 border-l border-slate-700/80 pl-2 sm:pl-3">
              <a
                href={SHOP_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                aria-label="Facebook"
                className="text-slate-400 hover:text-[#1877F2] transition hover:scale-110"
              >
                <FacebookIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </a>
              <a
                href={SHOP_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                aria-label="Instagram"
                className="text-slate-400 hover:text-pink-400 transition hover:scale-110"
              >
                <InstagramIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </a>
              <a
                href={SHOP_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Concierge"
                aria-label="WhatsApp Concierge"
                className="text-slate-400 hover:text-emerald-400 transition hover:scale-110"
              >
                <WhatsAppIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
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
                className="h-9 w-9 sm:h-10 sm:w-10 min-w-[36px] object-contain rounded-xl bg-white p-0.5 shadow-2xs border border-amber-500/30 transition-transform group-hover:scale-105 shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-serif font-bold text-sm sm:text-base tracking-tight text-gray-950 leading-tight group-hover:text-amber-950 transition-colors">
                  Krishna <span className="text-amber-700 font-extrabold">Accessories</span>
                </span>
                <span className="text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.18em] text-gray-400 font-medium hidden xs:block">
                  Curated Luxury
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Primary Navigation Links (Strictly Centered in Viewport on Desktop) */}
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
                      <span>★ 100% Certified Authentic Guarantee</span>
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

          {/* Right Actions: Balanced for Mobile & Desktop */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto z-10">

            {/* Desktop Search Bar */}
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

            {/* Mobile Search Toggle Button */}
            <button
              type="button"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Search Catalog"
              className={`flex h-8.5 w-8.5 items-center justify-center rounded-xl border transition cursor-pointer ${showSearch ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200'}`}
            >
              <SearchIcon className="w-3.5 h-3.5" />
            </button>

            {/* Notifications Popover Button (Hidden on small mobile to prevent clutter, accessible in drawer) */}
            <div className="hidden sm:block relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
                className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 transition relative cursor-pointer"
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
                  <div className="fixed inset-x-3 top-16 sm:inset-auto sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-80 rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xl z-50 animate-fade-in">
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

            {/* Wishlist Button (Desktop & Tablet) */}
            <Link
              to="/wishlist"
              className={`hidden md:flex relative h-8.5 w-8.5 items-center justify-center rounded-xl border transition cursor-pointer ${location.pathname === '/wishlist'
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
              className={`relative flex h-8.5 w-8.5 items-center justify-center rounded-xl border transition cursor-pointer ${location.pathname === '/cart'
                ? 'border-gray-900 bg-gray-100 text-gray-950 font-bold'
                : 'border-gray-200 bg-[#F4F4F6] text-gray-700 hover:border-gray-300 hover:bg-gray-200'
                }`}
            >
              <BagIcon className="w-3.5 h-3.5 text-gray-800" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#111827] text-[8px] font-bold text-white shadow-2xs">
                {cartCount}
              </span>
            </Link>

            {/* User Profile / Menu (Desktop & Tablet) */}
            {currentUser ? (
              <div className="hidden sm:block relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="User Account Menu"
                  className="flex h-8.5 items-center gap-1.5 sm:gap-2 rounded-xl border border-gray-200 bg-white px-2 sm:px-2.5 text-xs font-medium text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 shadow-2xs cursor-pointer"
                >
                  <div className="flex h-5.5 w-5.5 items-center justify-center rounded-lg bg-amber-100 text-amber-950 font-bold text-[11px]">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : (currentUser.email ? currentUser.email[0].toUpperCase() : 'U')}
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
                    <div className="fixed inset-x-3 top-16 sm:inset-auto sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-72 rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl z-50 animate-fade-in divide-y divide-gray-100">
                      {/* User Info Header */}
                      <div className="px-2 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-950 font-bold text-sm">
                            {currentUser.name ? currentUser.name[0].toUpperCase() : (currentUser.email ? currentUser.email[0].toUpperCase() : 'U')}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-gray-950 truncate leading-tight">{currentUser.name || 'Valued Client'}</p>
                            <p className="text-[10.5px] text-gray-500 truncate mt-0.5">{currentUser.email}</p>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center gap-1.5">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${currentUser.role === 'admin'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300/60'
                            : currentUser.role === 'supplier'
                              ? 'bg-blue-100 text-blue-900 border border-blue-300/60'
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}>
                            {currentUser.role === 'admin' ? 'Super Admin' : (currentUser.role === 'supplier' ? 'Vendor Partner' : 'Customer')}
                          </span>
                        </div>
                      </div>

                      {/* Navigation Links */}
                      <div className="py-2 space-y-0.5 text-xs">
                        <Link
                          to="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-950 transition"
                        >
                          <span className="text-sm">👤</span>
                          <span>My Account & Orders</span>
                        </Link>

                        <Link
                          to="/account?tab=tracking"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-950 transition"
                        >
                          <span className="text-sm">🚚</span>
                          <span>Track Live Order</span>
                        </Link>

                        <Link
                          to="/wishlist"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-between rounded-xl px-2.5 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-950 transition"
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
                          className="flex items-center justify-between rounded-xl px-2.5 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-950 transition"
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
                        <div className="py-2 space-y-1">
                          {isAdmin() && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm">⚙️</span>
                                <span>Admin Dashboard</span>
                              </div>
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded-full">Active</span>
                            </Link>
                          )}

                          {isSupplier() && (
                            <Link
                              to="/supplier"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-bold text-blue-950 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 transition"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm">🏢</span>
                                <span>Vendor Portal</span>
                              </div>
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-200/80 text-blue-900 px-1.5 py-0.2 rounded-full">Active</span>
                            </Link>
                          )}
                        </div>
                      )}

                      {/* Sign Out Button */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-50 border border-rose-200 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 active:scale-98 transition shadow-2xs cursor-pointer"
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
                title="Sign In / Register"
                className="hidden sm:inline-flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-[#111827] text-white shadow-2xs transition hover:bg-black shrink-0 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-white" />
              </Link>
            )}

            {/* Mobile Menu 3-Lines (Hamburger) Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="xl:hidden flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-gray-200 bg-[#F4F4F6] text-gray-900 hover:bg-gray-200 transition text-base font-bold shrink-0 cursor-pointer"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Search Bar Overlay */}
      {showSearch && (
        <div className="lg:hidden border-t border-gray-200 bg-white p-3 shadow-md animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search timepieces, bags, footwear, accessories..."
              autoFocus
              className="w-full rounded-xl border border-gray-300 bg-[#F4F4F6] py-2 pl-9 pr-16 text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon className="w-3.5 h-3.5" />
            </span>
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-[#111827] px-3 py-1 text-[10px] font-bold text-white hover:bg-black transition cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Quick Keyword Pills */}
          <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-[10.5px]">
            <span className="text-gray-400 font-semibold shrink-0">Popular:</span>
            {POPULAR_SEARCHES.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickSearch(tag)}
                className="shrink-0 rounded-full bg-gray-100 hover:bg-gray-200 px-2.5 py-0.5 text-gray-700 font-medium transition cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Full Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs animate-fade-in xl:hidden"
          />

          {/* Full Height Slide-In Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[340px] sm:max-w-[380px] h-[100dvh] bg-white shadow-2xl flex flex-col animate-slide-in-right xl:hidden overflow-hidden">

            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/krishna-logo.png"
                  alt="Krishna Accessories Logo"
                  className="h-10 w-10 min-w-[40px] object-contain rounded-xl bg-white p-0.5 border border-amber-500/30 shadow-xs shrink-0"
                />
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-sm text-gray-950 leading-tight">
                    Krishna <span className="text-amber-700">Accessories</span>
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold">
                    Mumbai Boutique
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black transition cursor-pointer text-sm font-bold shrink-0"
                aria-label="Close navigation"
              >
                ✕
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 space-y-4 pb-20">

              {/* 1. Account Section (Prominently placed at TOP) */}
              {currentUser ? (
                <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/80 via-white to-slate-50 p-3.5 shadow-2xs space-y-3">
                  {/* User Profile Header */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-200/80 text-amber-950 font-bold text-sm shadow-xs shrink-0">
                      {currentUser.name ? currentUser.name[0].toUpperCase() : (currentUser.email ? currentUser.email[0].toUpperCase() : 'U')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-gray-950 truncate leading-tight">
                          {currentUser.name || 'Valued Client'}
                        </p>
                        <span className={`rounded-full px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider shrink-0 ${currentUser.role === 'admin'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : currentUser.role === 'supplier'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : 'bg-gray-100 text-gray-800'
                          }`}>
                          {currentUser.role === 'admin' ? 'Super Admin' : (currentUser.role === 'supplier' ? 'Vendor' : 'Customer')}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-gray-500 truncate mt-0.5">{currentUser.email}</p>
                    </div>
                  </div>

                  {/* 2x2 Quick Link Grid */}
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold">
                    <Link
                      to="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl bg-white border border-gray-200/80 px-2.5 py-2 text-gray-800 hover:bg-gray-50 shadow-2xs transition truncate"
                    >
                      <span>👤</span>
                      <span className="truncate">My Account</span>
                    </Link>

                    <Link
                      to="/account?tab=tracking"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl bg-white border border-gray-200/80 px-2.5 py-2 text-gray-800 hover:bg-gray-50 shadow-2xs transition truncate"
                    >
                      <span>🚚</span>
                      <span className="truncate">Track Order</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl bg-white border border-gray-200/80 px-2.5 py-2 text-gray-800 hover:bg-gray-50 shadow-2xs transition truncate"
                    >
                      <div className="flex items-center gap-1.5 min-w-0 truncate">
                        <span className="text-rose-500">♥</span>
                        <span className="truncate">Wishlist</span>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="rounded-full bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 text-[8.5px] shrink-0">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      to="/cart"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl bg-white border border-gray-200/80 px-2.5 py-2 text-gray-800 hover:bg-gray-50 shadow-2xs transition truncate"
                    >
                      <div className="flex items-center gap-1.5 min-w-0 truncate">
                        <span>🛍️</span>
                        <span className="truncate">Bag</span>
                      </div>
                      <span className="rounded-full bg-gray-900 text-white font-bold px-1.5 py-0.2 text-[8.5px] shrink-0">
                        {cartCount}
                      </span>
                    </Link>
                  </div>

                  {/* Portals if Admin or Supplier */}
                  {currentUser.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl bg-amber-100/70 border border-amber-300 px-3 py-2 text-xs font-bold text-amber-950 hover:bg-amber-100 transition"
                    >
                      <span>⚙️ Admin Control Center</span>
                      <span>&rarr;</span>
                    </Link>
                  )}

                  {currentUser.role === 'supplier' && (
                    <Link
                      to="/supplier"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl bg-blue-100/70 border border-blue-300 px-3 py-2 text-xs font-bold text-blue-950 hover:bg-blue-100 transition"
                    >
                      <span>🏢 Vendor Partner Portal</span>
                      <span>&rarr;</span>
                    </Link>
                  )}

                  {/* PROMINENT MOBILE SIGN OUT BUTTON */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-50 border border-rose-200/90 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 active:scale-98 transition shadow-2xs cursor-pointer"
                  >
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-3.5 space-y-2.5">
                  <div>
                    <p className="text-xs font-bold text-gray-950">Welcome to Krishna Accessories</p>
                    <p className="text-[10.5px] text-gray-500 mt-0.5">Sign in to track orders, manage wishlist & checkout fast.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center rounded-xl bg-[#111827] text-white py-2 text-xs font-semibold hover:bg-black transition shadow-2xs"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-800 py-2 text-xs font-semibold hover:bg-gray-100 transition shadow-2xs"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}

              {/* 2. Primary Navigation Links */}
              <div className="space-y-1 text-xs font-semibold">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${location.pathname === '/' ? 'bg-gray-950 text-white font-bold' : 'text-gray-800 hover:bg-gray-100'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span>🏠</span>
                    <span>Home</span>
                  </span>
                  <span className="text-xs">&rarr;</span>
                </Link>

                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${location.pathname === '/shop' && !location.search ? 'bg-gray-950 text-white font-bold' : 'text-gray-800 hover:bg-gray-100'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span>🛍️</span>
                    <span>Shop All Catalog</span>
                  </span>
                  <span className="text-xs">&rarr;</span>
                </Link>

                <Link
                  to="/new-arrivals"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${location.pathname === '/new-arrivals' ? 'bg-gray-950 text-white font-bold' : 'text-gray-800 hover:bg-gray-100'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span>✨</span>
                    <span>New Arrivals</span>
                  </span>
                  <span className="rounded-full bg-amber-100 text-amber-900 font-bold px-2 py-0.2 text-[9px]">Hot</span>
                </Link>

                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${location.pathname === '/wishlist' ? 'bg-gray-950 text-white font-bold' : 'text-gray-800 hover:bg-gray-100'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span>♥</span>
                    <span>Saved Wishlist</span>
                  </span>
                  {wishlistCount > 0 && (
                    <span className="rounded-full bg-rose-600 text-white font-bold px-2 py-0.2 text-[9px]">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${location.pathname === '/about' ? 'bg-gray-950 text-white font-bold' : 'text-gray-800 hover:bg-gray-100'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span>🏛️</span>
                    <span>About Boutique & Heritage</span>
                  </span>
                  <span className="text-xs">&rarr;</span>
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${location.pathname === '/contact' ? 'bg-gray-950 text-white font-bold' : 'text-gray-800 hover:bg-gray-100'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span>📞</span>
                    <span>Contact & Concierge</span>
                  </span>
                  <span className="text-xs">&rarr;</span>
                </Link>

                <Link
                  to="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${location.pathname === '/faq' ? 'bg-gray-950 text-white font-bold' : 'text-gray-800 hover:bg-gray-100'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span>❓</span>
                    <span>FAQ & Authenticity Guarantee</span>
                  </span>
                  <span className="text-xs">&rarr;</span>
                </Link>
              </div>

              {/* 3. All Departments & Categories Grid */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    All Collections ({allCategories.length})
                  </span>
                  <Link
                    to="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[10.5px] font-bold text-gray-900 hover:text-amber-700 transition"
                  >
                    View All &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {allCategories.map((c) => {
                    const icon = CATEGORY_ICONS[c] || '✨';
                    const isActive = location.search.includes(`category=${encodeURIComponent(c)}`);
                    return (
                      <Link
                        key={c}
                        to={`/shop?category=${encodeURIComponent(c)}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between rounded-xl px-2.5 py-2 text-[11px] font-medium transition ${isActive
                          ? 'bg-gray-900 text-white shadow-xs font-semibold'
                          : 'bg-[#F4F4F6] text-gray-800 hover:bg-gray-200'
                          }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0 truncate">
                          <span className="text-xs shrink-0">{icon}</span>
                          <span className="truncate">{c}</span>
                        </div>
                        <span className={`text-[10px] shrink-0 ${isActive ? 'text-amber-300' : 'text-gray-400'}`}>&rarr;</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* 4. Boutique Quick Concierge & Socials */}
              <div className="pt-3 border-t border-gray-100 space-y-2.5 pb-2">
                <a
                  href={SHOP_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-bold shadow-xs transition"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp VIP Concierge</span>
                </a>

                <div className="bg-gray-50 rounded-xl p-2.5 text-[11px] text-gray-600 space-y-1 border border-gray-100">
                  <p className="text-gray-900 font-semibold flex items-center gap-1.5">
                    <span>📍</span>
                    <span className="truncate">{SHOP_INFO.address}</span>
                  </p>
                  <a href={`tel:+91${SHOP_INFO.rawPhone}`} className="hover:text-black flex items-center gap-1.5">
                    <span>📞</span>
                    <span>{SHOP_INFO.phone}</span>
                  </a>
                </div>

                <div className="flex items-center justify-between pt-1 px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Connect With Us:</span>
                  <div className="flex items-center gap-2">
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

          </div>
        </>
      )}

    </header>
  );
}