// src/components/Navbar.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCartCount } from '../utils/cart';
import { defaultCategories, getWishlist } from '../utils/productStore';
import { getCurrentUser, logout } from '../utils/auth';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../utils/orderStore';
import { BagIcon, SearchIcon, UserIcon, ChevronDownIcon, HeartIcon, BellIcon } from './Icons';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

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
  };

  useEffect(() => {
    refreshState();
    window.addEventListener('cartUpdated', refreshState);
    window.addEventListener('wishlistUpdated', refreshState);
    window.addEventListener('notificationsUpdated', refreshState);
    window.addEventListener('authUpdated', refreshState);
    window.addEventListener('storage', refreshState);

    return () => {
      window.removeEventListener('cartUpdated', refreshState);
      window.removeEventListener('wishlistUpdated', refreshState);
      window.removeEventListener('notificationsUpdated', refreshState);
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
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'shadow-md border-b border-gray-200 bg-white/98 backdrop-blur-md' : 'border-b border-gray-200/80 bg-white/95 backdrop-blur-md'}`}>

      {/* Top Luxury Announcement Strip */}
      <div className="border-b border-gray-100 bg-[#0F172A] text-white px-2.5 sm:px-4 py-1">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-[8px] sm:text-[9.5px] font-medium tracking-[0.12em] uppercase">
          <span className="hidden sm:inline text-gray-300 truncate">
            Free Express Shipping on Orders &ge; ₹2,000
          </span>
          <span className="mx-auto sm:mx-0 text-amber-200 font-semibold tracking-wider text-center truncate px-1">
            ★ 100% Certified Authentic &bull; Brand Warranty
          </span>
          <div className="hidden lg:flex items-center gap-3 text-gray-300">
            <Link to="/about" className="hover:text-white transition">About</Link>
            <span className="text-gray-600">&bull;</span>
            <Link to="/contact" className="hover:text-white transition">Concierge</Link>
            <span className="text-gray-600">&bull;</span>
            <span className="text-white font-semibold">+91 (079) 4000-5500</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto max-w-7xl px-2.5 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-1.5 sm:gap-4">

          {/* Left: Brand Identity */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 group min-w-0">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-[#0F172A] text-amber-300 font-serif font-bold text-xs sm:text-sm shadow-2xs border border-amber-500/20 transition-transform group-hover:scale-105">
              K
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline gap-1 truncate">
                <span className="font-serif text-xs sm:text-base font-bold tracking-tight text-gray-950 truncate">
                  KA
                </span>
                <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.14em] sm:tracking-[0.16em] text-[#B89758] uppercase truncate">
                </span>
              </div>
              <span className="hidden xs:inline text-[7px] sm:text-[8px] font-medium tracking-[0.18em] text-gray-400 uppercase truncate">
                Luxury Timepieces & Curated Goods
              </span>
            </div>
          </Link>

          {/* Center: Primary Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-600">
            <Link
              to="/"
              className={`relative py-1.5 transition-colors ${location.pathname === '/'
                ? 'text-gray-950 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#111827]'
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
                className={`flex items-center gap-1 py-1.5 transition-colors uppercase ${location.pathname === '/shop' && !location.search
                  ? 'text-gray-950 font-bold'
                  : 'hover:text-gray-950'
                  }`}
              >
                <span>Collections</span>
                <ChevronDownIcon
                  className={`w-3 h-3 transition-transform duration-150 ${categoriesOpen ? 'rotate-180 text-gray-950' : 'text-gray-400'
                    }`}
                />
              </button>

              {categoriesOpen && (
                <div
                  onMouseEnter={handleCatMouseEnter}
                  onMouseLeave={handleCatMouseLeave}
                  className="absolute left-0 top-full pt-1.5 w-80 z-50 animate-fade-in"
                >
                  <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
                    <div className="px-2.5 py-1 border-b border-gray-100 mb-2 flex justify-between items-center">
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Departments</span>
                      <Link
                        to="/shop"
                        onClick={() => setCategoriesOpen(false)}
                        className="text-[9.5px] font-bold text-gray-900 hover:underline"
                      >
                        View All &rarr;
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {defaultCategories.slice(0, 10).map((cat) => (
                        <Link
                          key={cat}
                          to={`/shop?category=${encodeURIComponent(cat)}`}
                          onClick={() => setCategoriesOpen(false)}
                          className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs normal-case text-gray-700 transition hover:bg-gray-100 hover:text-black font-medium"
                        >
                          <span className="truncate">{cat}</span>
                          <span className="text-[9.5px] text-gray-400">&rarr;</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/shop"
              className={`relative py-1.5 transition-colors ${location.pathname === '/shop' && !location.search
                ? 'text-gray-950 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#111827]'
                : 'hover:text-gray-950'
                }`}
            >
              Shop All
            </Link>

            <Link
              to="/tracking"
              className={`relative py-1.5 transition-colors ${location.pathname === '/tracking'
                ? 'text-gray-950 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#111827]'
                : 'hover:text-gray-950'
                }`}
            >
              Track Order
            </Link>

            <Link
              to="/about"
              className={`relative py-1.5 transition-colors ${location.pathname === '/about'
                ? 'text-gray-950 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#111827]'
                : 'hover:text-gray-950'
                }`}
            >
              About
            </Link>

            {/* Portal Link: Admin */}
            {currentUser && currentUser.role === 'admin' && (
              <Link
                to="/admin"
                className="rounded-full border border-gray-300 bg-gray-100 px-2.5 py-0.5 text-[9.5px] font-bold text-gray-900 hover:bg-gray-200 transition"
              >
                Admin Panel
              </Link>
            )}

            {/* Portal Link: Supplier */}
            {currentUser && currentUser.role === 'supplier' && (
              <Link
                to="/supplier"
                className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[9.5px] font-bold text-blue-700 hover:bg-blue-100 transition"
              >
                Vendor Portal
              </Link>
            )}
          </nav>

          {/* Right: Search & Utilities */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">

            {/* Search Input Bar (Desktop) */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:block relative w-36 xl:w-48 focus-within:w-56 transition-all duration-250">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog..."
                className="h-8 w-full rounded-full border border-gray-200 bg-[#F4F4F6] pl-7 pr-9 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-gray-400 focus:bg-white"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <SearchIcon className="w-3 h-3" />
              </span>
              {searchQuery && (
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[#111827] px-2 py-0.5 text-[8.5px] font-bold text-white hover:bg-black transition"
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
              className="lg:hidden flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 transition"
            >
              <SearchIcon className="w-3.5 h-3.5" />
            </button>

            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 transition relative"
              >
                <BellIcon className="w-3.5 h-3.5 text-gray-700" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-600 text-[8px] font-bold text-white shadow-2xs">
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
                            className="text-[10px] text-gray-500 font-semibold hover:text-black transition"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setNotificationsOpen(false)}
                          className="sm:hidden text-gray-400 hover:text-gray-700 text-xs px-1"
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
              className={`relative flex h-7 sm:h-8 items-center justify-center rounded-lg border px-1.5 sm:px-2.5 transition ${location.pathname === '/wishlist'
                ? 'border-gray-900 bg-gray-100 text-gray-950 font-bold'
                : 'border-gray-200 bg-[#F4F4F6] text-gray-700 hover:border-gray-300 hover:bg-gray-200'
                }`}
              title="Saved Wishlist"
            >
              <HeartIcon className="w-3.5 h-3.5 text-gray-700 shrink-0" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-600 text-[8px] font-bold text-white shadow-2xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Button */}
            <Link
              to="/cart"
              className={`relative flex h-7 sm:h-8 items-center gap-1 sm:gap-1.5 rounded-lg border px-1.5 sm:px-2.5 transition ${location.pathname === '/cart'
                ? 'border-gray-900 bg-gray-100 text-gray-950 font-bold'
                : 'border-gray-200 bg-[#F4F4F6] text-gray-700 hover:border-gray-300 hover:bg-gray-200'
                }`}
            >
              <BagIcon className="w-3.5 h-3.5 text-gray-800 shrink-0" />
              <span className="hidden md:inline text-[11px] font-semibold uppercase tracking-wider text-gray-900">Bag</span>
              {cartCount > 0 ? (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#111827] text-[8px] font-bold text-white shadow-2xs">
                  {cartCount}
                </span>
              ) : (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#111827] text-[8px] font-bold text-white shadow-2xs">
                  0
                </span>
              )}
            </Link>

            {/* User Profile / Menu */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex h-7 sm:h-8 items-center gap-1 sm:gap-1.5 rounded-lg border border-gray-200 bg-white px-1.5 sm:px-2.5 text-xs font-medium text-gray-800 hover:bg-gray-50 transition"
                >
                  <UserIcon className="w-3 h-3 text-gray-600 shrink-0" />
                  <span className="hidden md:inline truncate max-w-[85px] text-[11px] text-gray-900">
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
                    <div className="fixed right-3 top-14 sm:inset-auto sm:absolute sm:right-0 sm:top-full sm:mt-2 w-56 max-w-[calc(100vw-24px)] rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl z-50 animate-fade-in">
                      <div className="px-2.5 py-1.5 border-b border-gray-100 mb-1">
                        <p className="text-[11px] font-bold text-gray-900 truncate">{currentUser.name || 'Account'}</p>
                        <p className="text-[9.5px] text-gray-500 truncate">{currentUser.email}</p>
                        <span className="mt-0.5 inline-block rounded-full bg-gray-100 px-2 py-0.2 text-[8.5px] font-bold uppercase tracking-wider text-gray-700">
                          {currentUser.role || 'Customer'}
                        </span>
                      </div>

                      <Link
                        to="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 transition"
                      >
                        <span>👤 Account & Orders</span>
                      </Link>

                      {currentUser.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-950 bg-gray-50 hover:bg-gray-100 transition"
                        >
                          <span>⚙️ Admin Panel</span>
                        </Link>
                      )}

                      {currentUser.role === 'supplier' && (
                        <Link
                          to="/supplier"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
                        >
                          <span>🏢 Vendor Portal</span>
                        </Link>
                      )}

                      <Link
                        to="/wishlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 transition"
                      >
                        <span>♥ Saved Wishlist</span>
                      </Link>

                      <div className="border-t border-gray-100 pt-1 mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex h-7 sm:h-8 items-center gap-1 rounded-full bg-[#111827] px-2.5 sm:px-3.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-white shadow-2xs transition hover:bg-black shrink-0"
              >
                <UserIcon className="w-3 h-3 text-white shrink-0" />
                <span className="text-white hidden xs:inline">Sign In</span>
                <span className="text-white xs:hidden">Login</span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="xl:hidden flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 transition text-sm shrink-0"
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

            {/* Quick Category links on mobile */}
            <div className="py-2 px-3 border-y border-gray-100 my-1">
              <span className="text-[8.5px] text-gray-400 block mb-1.5 font-bold uppercase tracking-widest">Quick Categories</span>
              <div className="flex flex-wrap gap-1 normal-case font-medium">
                {defaultCategories.slice(0, 6).map(c => (
                  <Link
                    key={c}
                    to={`/shop?category=${encodeURIComponent(c)}`}
                    className="rounded-md bg-[#F4F4F6] px-2 py-0.5 text-[10px] text-gray-800 hover:bg-gray-200"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/tracking"
              className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-black transition"
            >
              Track Consignment
            </Link>
            <Link
              to="/wishlist"
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

            {currentUser && currentUser.role === 'admin' && (
              <Link
                to="/admin"
                className="rounded-lg px-3 py-2 font-bold text-gray-900 bg-gray-100 border border-gray-200"
              >
                Admin Control Console
              </Link>
            )}

            {currentUser && currentUser.role === 'supplier' && (
              <Link
                to="/supplier"
                className="rounded-lg px-3 py-2 font-bold text-blue-700 bg-blue-50 border border-blue-200"
              >
                Vendor Portal
              </Link>
            )}

            <div className="border-t border-gray-100 pt-2.5 mt-1.5">
              {currentUser ? (
                <div className="space-y-1.5">
                  <Link
                    to="/account"
                    className="block w-full rounded-lg bg-gray-100 py-2 text-center text-xs font-bold text-gray-900 hover:bg-gray-200"
                  >
                    My Account ({currentUser.name || currentUser.email})
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg border border-rose-200 bg-rose-50 py-1.5 text-center text-xs font-bold text-rose-700 hover:bg-rose-100"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block w-full rounded-full bg-[#111827] py-2 text-center text-xs font-semibold uppercase tracking-wider text-white hover:bg-black"
                >
                  <span className="text-white">Sign In to Account</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}