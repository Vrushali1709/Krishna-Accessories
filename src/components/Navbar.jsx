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
    }, 140);
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
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      scrolled
        ? 'border-b border-zinc-200/90 bg-white/95 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.03)]'
        : 'border-b border-zinc-200/70 bg-white/90 backdrop-blur-sm'
    }`}>

      {/* Top Luxury Announcement Strip */}
      <div className="border-b border-zinc-800 bg-[#121316] text-zinc-300 px-3 sm:px-6 py-1.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-[10px] sm:text-[11px] font-medium tracking-[0.06em] uppercase">
          <span className="hidden sm:inline text-zinc-400">
            Complimentary Insured Shipping on Orders &ge; ₹2,000
          </span>
          <span className="mx-auto sm:mx-0 text-amber-300 font-semibold tracking-wider text-center">
            ★ 100% Certified Authentic &bull; Stamped Manufacturer Warranty
          </span>
          <div className="hidden lg:flex items-center gap-3.5 text-zinc-400">
            <Link to="/about" className="hover:text-white transition">Heritage</Link>
            <span className="text-zinc-600">&bull;</span>
            <Link to="/contact" className="hover:text-white transition">Concierge Desk</Link>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-zinc-200 font-medium">+91 (079) 4000-5500</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-15 sm:h-16 items-center justify-between gap-3">

          {/* Left: Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-amber-300 font-serif font-bold text-sm shadow-xs border border-amber-500/25 transition-transform duration-200 group-hover:scale-105">
              K
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold tracking-tight text-zinc-950 font-sans leading-none">
                Krishna <span className="text-[#B89035] font-semibold">Accessories</span>
              </span>
              <span className="text-[9px] font-medium tracking-[0.14em] uppercase text-zinc-400 mt-0.5">
                Luxury Horology & Essentials
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-700">
            <Link to="/shop" className="hover:text-zinc-950 transition-colors py-1">
              All Collections
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={handleCatMouseEnter}
              onMouseLeave={handleCatMouseLeave}
            >
              <button
                type="button"
                onClick={() => setCategoriesOpen(prev => !prev)}
                className={`flex items-center gap-1 hover:text-zinc-950 transition-colors py-1 cursor-pointer ${
                  categoriesOpen ? 'text-zinc-950 font-semibold' : ''
                }`}
              >
                <span>Departments</span>
                <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-150 ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 z-50 mt-1 w-64 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl animate-fade-in divide-y divide-zinc-100">
                  <div className="py-1">
                    <span className="block px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Curated Categories
                    </span>
                    <div className="grid grid-cols-1 gap-0.5 mt-1">
                      {defaultCategories.slice(0, 8).map((cat) => (
                        <Link
                          key={cat}
                          to={`/shop?category=${encodeURIComponent(cat)}`}
                          className="flex items-center justify-between rounded-lg px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition"
                        >
                          <span>{cat}</span>
                          <span className="text-[10px] text-zinc-400">&rarr;</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="pt-1.5 px-3 pb-1">
                    <Link
                      to="/shop"
                      className="block text-[11px] font-semibold text-[#B89035] hover:text-amber-800 transition"
                    >
                      View All 11 Departments &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/about" className="hover:text-zinc-950 transition-colors py-1">
              About
            </Link>
            <Link to="/tracking" className="hover:text-zinc-950 transition-colors py-1">
              Track Consignment
            </Link>
            <Link to="/contact" className="hover:text-zinc-950 transition-colors py-1">
              Concierge
            </Link>
          </nav>

          {/* Right: Quick Search, Notifications, Wishlist, Cart & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Search Trigger or Input */}
            <div className="relative">
              {showSearch ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center animate-fade-in">
                  <input
                    ref={searchInputRef}
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search watches, bags, brands..."
                    className="w-48 sm:w-64 rounded-full border border-zinc-300 bg-zinc-50 py-1.5 pl-3.5 pr-8 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSearch(false)}
                    className="absolute right-2.5 text-zinc-400 hover:text-zinc-700 text-xs font-semibold cursor-pointer"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSearch(true)}
                  aria-label="Search"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition"
                >
                  <SearchIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(prev => !prev)}
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition"
              >
                <BellIcon className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[9px] font-bold text-white shadow-xs">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-full z-50 mt-1.5 w-80 rounded-xl border border-zinc-200 bg-white p-3 shadow-xl animate-fade-in">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                    <span className="text-xs font-semibold text-zinc-900">Broadcasts & Alerts</span>
                    {unreadNotifsCount > 0 && (
                      <button
                        type="button"
                        onClick={() => markAllNotificationsRead()}
                        className="text-[10px] font-medium text-[#B89035] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-zinc-100 mt-1">
                    {notifications.length === 0 ? (
                      <p className="py-4 text-center text-xs text-zinc-400">No current notifications.</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2 rounded-lg text-xs cursor-pointer transition ${
                            n.unread ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-zinc-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-zinc-900 text-[11px]">{n.title}</strong>
                            <span className="text-[9.5px] text-zinc-400">{n.date}</span>
                          </div>
                          <p className="text-[11px] text-zinc-600 mt-0.5 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition"
            >
              <HeartIcon className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[9px] font-bold text-white shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              aria-label="Shopping Bag"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition"
            >
              <BagIcon className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#121316] text-[9px] font-bold text-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth Menu */}
            <div className="relative ml-1" ref={userMenuRef}>
              {currentUser ? (
                <>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(prev => !prev)}
                    className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 py-1 pl-1 pr-2.5 text-xs font-medium text-zinc-800 hover:bg-zinc-100 hover:border-zinc-300 transition"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-semibold text-white">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline font-semibold text-zinc-900 max-w-[90px] truncate">
                      {currentUser.name?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDownIcon className="w-3 h-3 text-zinc-500" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full z-50 mt-1.5 w-56 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl animate-fade-in divide-y divide-zinc-100">
                      <div className="px-3 py-2">
                        <p className="text-xs font-semibold text-zinc-950 truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-zinc-500 truncate">{currentUser.email}</p>
                        <span className="inline-block mt-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-700">
                          {currentUser.role || 'Customer'}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/account"
                          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition"
                        >
                          <span>Orders & Addresses</span>
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition"
                        >
                          <span>Saved Wishlist</span>
                        </Link>
                        {currentUser.role === 'supplier' && (
                          <Link
                            to="/supplier"
                            className="flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition"
                          >
                            <span>Vendor Portal</span>
                            <span>&rarr;</span>
                          </Link>
                        )}
                        {currentUser.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-900 hover:bg-zinc-100 transition"
                          >
                            <span>Admin Console</span>
                            <span>&rarr;</span>
                          </Link>
                        )}
                      </div>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left rounded-lg px-3 py-1.5 text-xs text-rose-600 font-medium hover:bg-rose-50 transition cursor-pointer"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black transition shadow-2xs"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle navigation menu"
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-zinc-700 hover:bg-zinc-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-3 shadow-lg animate-slide-up">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog..."
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-3.5 pr-8 text-xs text-zinc-900 outline-none"
            />
            <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400">
              <SearchIcon className="w-3.5 h-3.5" />
            </button>
          </form>

          <nav className="space-y-1 text-xs font-medium text-zinc-800">
            <Link to="/shop" className="block rounded-lg px-3 py-2 hover:bg-zinc-50">
              Explore All Collections
            </Link>
            <Link to="/tracking" className="block rounded-lg px-3 py-2 hover:bg-zinc-50">
              Track Consignment
            </Link>
            <Link to="/about" className="block rounded-lg px-3 py-2 hover:bg-zinc-50">
              Our Heritage
            </Link>
            <Link to="/contact" className="block rounded-lg px-3 py-2 hover:bg-zinc-50">
              Concierge Desk
            </Link>
            {currentUser?.role === 'admin' && (
              <Link to="/admin" className="block rounded-lg px-3 py-2 font-semibold text-zinc-950 bg-zinc-100">
                Admin Console &rarr;
              </Link>
            )}
            {currentUser?.role === 'supplier' && (
              <Link to="/supplier" className="block rounded-lg px-3 py-2 font-semibold text-blue-700 bg-blue-50">
                Vendor Partner Portal &rarr;
              </Link>
            )}
          </nav>
        </div>
      )}

    </header>
  );
}