// src/components/Navbar.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCartCount } from '../utils/cart';
import { defaultCategories, getWishlist } from '../utils/productStore';
import { getCurrentUser, logout } from '../utils/auth';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../utils/orderStore';
import {
  ShoppingBag,
  Search,
  User,
  Heart,
  Bell,
  Truck,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Settings,
  Building2,
  Phone,
  Info,
  LogOut,
  SlidersHorizontal,
  Home,
  CheckCircle2,
  Clock,
  ArrowRight,
  Lock
} from 'lucide-react';

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

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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
      setMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unreadNotifsCount = notifications.filter(n => n.unread).length;

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 font-sans ${scrolled ? 'shadow-xs border-b border-zinc-200/90 bg-white/98 backdrop-blur-md' : 'border-b border-zinc-200/80 bg-white/95 backdrop-blur-md'}`}>

      {/* Top Luxury Announcement Strip */}
      <div className="border-b border-zinc-900 bg-[#0F172A] text-white px-3 sm:px-6 py-1.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-[10px] sm:text-[11px] font-medium tracking-wide">
          <div className="hidden sm:flex items-center gap-2 text-zinc-300">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span className="truncate">Free Express Delivery on Orders &ge; ₹2,000</span>
          </div>
          <div className="mx-auto sm:mx-0 flex items-center gap-1.5 text-amber-300 font-semibold tracking-wider uppercase text-[9.5px] sm:text-[10.5px]">
            <Sparkles className="h-3 w-3 text-amber-300 shrink-0" />
            <span>100% Certified Authentic &bull; Official Warranty</span>
          </div>
          <div className="hidden lg:flex items-center gap-3.5 text-zinc-300 text-[10.5px]">
            <Link to="/about" className="hover:text-white transition">Our Story</Link>
            <span className="text-zinc-600">&bull;</span>
            <Link to="/contact" className="hover:text-white transition">Concierge</Link>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-white font-mono font-semibold">+91 (079) 4000-5500</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">

          {/* Left: Brand Identity */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group min-w-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-amber-300 font-serif font-bold text-sm sm:text-base shadow-xs border border-amber-500/20 transition-transform group-hover:scale-105">
              K
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline gap-1 truncate">
                <span className="font-serif text-sm sm:text-base font-bold tracking-tight text-zinc-950 truncate">
                  KA
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.16em] text-[#B89758] uppercase truncate">
                  Krishna
                </span>
              </div>
              <span className="hidden xs:inline text-[8px] sm:text-[9px] font-medium tracking-[0.14em] text-zinc-400 uppercase truncate">
                Luxury Timepieces & Curated Goods
              </span>
            </div>
          </Link>

          {/* Center: Primary Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-7 text-xs font-semibold uppercase tracking-[0.1em] text-zinc-600">
            <Link
              to="/"
              className={`relative py-1.5 transition-colors ${location.pathname === '/'
                ? 'text-zinc-950 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-zinc-950'
                : 'hover:text-zinc-950'
                }`}
            >
              Home
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
                className={`flex items-center gap-1.5 py-1.5 transition-colors uppercase ${location.pathname === '/shop' && !location.search
                  ? 'text-zinc-950 font-bold'
                  : 'hover:text-zinc-950'
                  }`}
              >
                <span>Collections</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesOpen ? 'rotate-180 text-zinc-950' : 'text-zinc-400'
                    }`}
                />
              </button>

              {categoriesOpen && (
                <div
                  onMouseEnter={handleCatMouseEnter}
                  onMouseLeave={handleCatMouseLeave}
                  className="absolute left-0 top-full pt-2 w-80 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <div className="rounded-2xl border border-zinc-200 bg-white p-3.5 shadow-xl">
                    <div className="px-2.5 py-1 border-b border-zinc-100 mb-2.5 flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Departments</span>
                      <Link
                        to="/shop"
                        onClick={() => setCategoriesOpen(false)}
                        className="text-xs font-bold text-zinc-900 hover:underline inline-flex items-center gap-1"
                      >
                        <span>View All</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {defaultCategories.slice(0, 10).map((cat) => (
                        <Link
                          key={cat}
                          to={`/shop?category=${encodeURIComponent(cat)}`}
                          onClick={() => setCategoriesOpen(false)}
                          className="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs normal-case text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 font-medium"
                        >
                          <span className="truncate">{cat}</span>
                          <ChevronRight className="h-3 w-3 text-zinc-400" />
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
                ? 'text-zinc-950 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-zinc-950'
                : 'hover:text-zinc-950'
                }`}
            >
              Shop All
            </Link>

            <Link
              to="/tracking"
              className={`relative py-1.5 transition-colors ${location.pathname === '/tracking'
                ? 'text-zinc-950 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-zinc-950'
                : 'hover:text-zinc-950'
                }`}
            >
              Track Order
            </Link>

            <Link
              to="/about"
              className={`relative py-1.5 transition-colors ${location.pathname === '/about'
                ? 'text-zinc-950 font-bold after:after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-zinc-950'
                : 'hover:text-zinc-950'
                }`}
            >
              About
            </Link>

            {/* Portal Link: Admin */}
            {currentUser && currentUser.role === 'admin' && (
              <Link
                to="/admin"
                className="rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-[10px] font-bold text-zinc-900 hover:bg-zinc-200 transition"
              >
                Admin Panel
              </Link>
            )}

            {/* Portal Link: Supplier */}
            {currentUser && currentUser.role === 'supplier' && (
              <Link
                to="/supplier"
                className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-700 hover:bg-blue-100 transition"
              >
                Vendor Portal
              </Link>
            )}
          </nav>

          {/* Right: Search & Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

            {/* Search Input Bar (Desktop) */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:block relative w-40 xl:w-52 focus-within:w-60 transition-all duration-200">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog..."
                className="h-9 w-full rounded-xl border border-zinc-200 bg-zinc-50/80 pl-8 pr-10 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-900/5"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                <Search className="w-3.5 h-3.5" />
              </span>
              {searchQuery && (
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-0.5 text-[9px] font-bold text-white hover:bg-black transition"
                >
                  Go
                </button>
              )}
            </form>

            {/* Mobile Search Icon Button */}
            <button
              type="button"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Search Catalog"
              className="lg:hidden flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50/80 text-zinc-700 hover:bg-zinc-100 transition shadow-2xs"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications Popover (Desktop only in top bar; mobile gets it in drawer & desktop) */}
            <div className="relative hidden sm:block" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50/80 text-zinc-700 hover:bg-zinc-100 transition relative shadow-2xs"
              >
                <Bell className="w-4 h-4 text-zinc-700" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-xs">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <>
                  <div
                    onClick={() => setNotificationsOpen(false)}
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs"
                  />
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Notifications</span>
                        {unreadNotifsCount > 0 && (
                          <span className="rounded-full bg-rose-600 px-1.5 py-0.2 text-[9px] font-bold text-white">
                            {unreadNotifsCount} new
                          </span>
                        )}
                      </div>
                      {unreadNotifsCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllNotificationsRead}
                          className="text-[11px] text-zinc-500 font-semibold hover:text-zinc-950 transition"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-zinc-400 text-center py-6">No notifications right now.</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`rounded-xl p-2.5 text-xs transition cursor-pointer ${n.unread ? 'bg-zinc-50 border border-zinc-200/80' : 'hover:bg-zinc-50'
                              }`}
                          >
                            <div className="flex justify-between items-start gap-1">
                              <span className="font-semibold text-zinc-900 text-xs leading-snug">{n.title}</span>
                              <span className="text-[9px] text-zinc-400 font-mono shrink-0">{n.date}</span>
                            </div>
                            <p className="mt-1 text-[11px] text-zinc-600 leading-snug break-words">{n.message}</p>
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
              className={`relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border transition shadow-2xs ${location.pathname === '/wishlist'
                ? 'border-zinc-900 bg-zinc-900 text-white font-bold'
                : 'border-zinc-200 bg-zinc-50/80 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100'
                }`}
              title="Saved Wishlist"
            >
              <Heart className={`w-4 h-4 ${location.pathname === '/wishlist' ? 'text-white fill-white' : 'text-zinc-700'}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Button */}
            <Link
              to="/cart"
              className={`relative flex h-8 sm:h-9 items-center gap-1.5 rounded-xl border px-2 sm:px-3 transition shadow-2xs ${location.pathname === '/cart'
                ? 'border-zinc-900 bg-zinc-900 text-white font-bold'
                : 'border-zinc-200 bg-zinc-50/80 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100'
                }`}
            >
              <ShoppingBag className={`w-4 h-4 shrink-0 ${location.pathname === '/cart' ? 'text-white' : 'text-zinc-900'}`} />
              <span className={`hidden md:inline text-xs font-semibold uppercase tracking-wider ${location.pathname === '/cart' ? 'text-white' : 'text-zinc-900'}`}>Bag</span>
              {cartCount > 0 ? (
                <span className={`flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full text-[9px] font-bold shadow-xs ${location.pathname === '/cart' ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'}`}>
                  {cartCount}
                </span>
              ) : (
                <span className={`flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full text-[9px] font-bold shadow-xs ${location.pathname === '/cart' ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'}`}>
                  0
                </span>
              )}
            </Link>

            {/* User Profile / Menu (Desktop) */}
            {currentUser ? (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex h-8 sm:h-9 items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 transition shadow-2xs"
                >
                  <User className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                  <span className="hidden md:inline truncate max-w-[90px] text-xs font-semibold text-zinc-900">
                    {currentUser.name || currentUser.email.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      onClick={() => setUserMenuOpen(false)}
                      className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs"
                    />
                    <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-zinc-200 bg-white p-2.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-3 py-2 border-b border-zinc-100 mb-1.5">
                        <p className="text-xs font-bold text-zinc-900 truncate">{currentUser.name || 'Account'}</p>
                        <p className="text-[10px] text-zinc-500 truncate">{currentUser.email}</p>
                        <span className="mt-1 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-700">
                          {currentUser.role || 'Customer'}
                        </span>
                      </div>

                      <Link
                        to="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition"
                      >
                        <User className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Account & Orders</span>
                      </Link>

                      {currentUser.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-zinc-950 bg-zinc-50 hover:bg-zinc-100 transition"
                        >
                          <Settings className="h-3.5 w-3.5 text-zinc-700" />
                          <span>Admin Panel</span>
                        </Link>
                      )}

                      {currentUser.role === 'supplier' && (
                        <Link
                          to="/supplier"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
                        >
                          <Building2 className="h-3.5 w-3.5 text-blue-600" />
                          <span>Vendor Portal</span>
                        </Link>
                      )}

                      <Link
                        to="/wishlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition"
                      >
                        <Heart className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Saved Wishlist</span>
                      </Link>

                      <div className="border-t border-zinc-100 pt-1.5 mt-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition text-left"
                        >
                          <LogOut className="h-3.5 w-3.5" />
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
                className="hidden sm:inline-flex h-8 sm:h-9 items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-2xs transition hover:bg-black shrink-0"
              >
                <User className="w-3.5 h-3.5 text-white shrink-0" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className={`xl:hidden flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border transition shadow-2xs shrink-0 ${mobileMenuOpen
                ? 'border-zinc-900 bg-zinc-900 text-white'
                : 'border-zinc-200 bg-zinc-50/80 text-zinc-800 hover:bg-zinc-100'
                }`}
            >
              {mobileMenuOpen ? <X className="h-4 w-4 text-white" /> : <Menu className="h-4 w-4" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {showSearch && (
        <div className="lg:hidden border-t border-zinc-200 bg-white p-3 animate-in fade-in slide-in-from-top-2 duration-150 shadow-md">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search timepieces, jewelry, footwear, bags..."
              autoFocus
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50/80 py-2 pl-9 pr-14 text-xs text-zinc-900 outline-none focus:border-zinc-500 focus:bg-white"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-zinc-900 px-3 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-black transition"
            >
              Find
            </button>
          </form>
        </div>
      )}

      {/* Mobile Luxury Navigation Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop Blur */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="xl:hidden fixed inset-0 top-[88px] sm:top-[96px] bg-black/50 backdrop-blur-xs z-40 transition-opacity"
          />

          {/* Drawer Body */}
          <div className="xl:hidden fixed inset-x-0 top-[88px] sm:top-[96px] bottom-0 z-50 bg-[#F9F9F8] overflow-y-auto border-t border-zinc-200/80 shadow-2xl animate-in slide-in-from-top-4 duration-200 flex flex-col justify-between">

            <div className="p-4 sm:p-6 space-y-5">

              {/* User Profile / Authentication Header Card */}
              {currentUser ? (
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-zinc-900 text-amber-300 font-bold flex items-center justify-center text-sm font-serif shadow-xs">
                        {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-900 truncate">
                          {currentUser.name || 'Valued Client'}
                        </p>
                        <p className="text-[11px] text-zinc-400 truncate">{currentUser.email}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-700">
                      {currentUser.role || 'Customer'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 text-xs font-semibold">
                    <Link
                      to="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 py-2 text-zinc-800 hover:bg-zinc-100 transition"
                    >
                      <User className="h-3.5 w-3.5 text-zinc-600" />
                      <span>My Account</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/80 py-2 text-rose-700 hover:bg-rose-100 transition"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Client Access</span>
                    <h4 className="text-sm font-bold text-zinc-900">Sign in to your account</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Access saved wishlist, track order status and manage shipments.</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 rounded-xl bg-zinc-900 py-2.5 text-center text-xs font-semibold text-white hover:bg-black transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <User className="h-3.5 w-3.5 text-white" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50/80 py-2.5 text-center text-xs font-semibold text-zinc-800 hover:bg-zinc-100 transition flex items-center justify-center"
                    >
                      <span>Register</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* In-Drawer Quick Search Form */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search timepieces, bags, accessories..."
                  className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-14 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5 shadow-2xs"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <Search className="w-4 h-4" />
                </span>
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-zinc-900 px-3 py-1 text-[10px] font-bold text-white shadow-2xs hover:bg-black transition"
                >
                  Search
                </button>
              </form>

              {/* Main Navigation Links */}
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-2xs divide-y divide-zinc-100">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-zinc-50 text-xs font-semibold text-zinc-900 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center">
                      <Home className="h-3.5 w-3.5" />
                    </div>
                    <span>Home</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                </Link>

                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-zinc-50 text-xs font-semibold text-zinc-900 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center">
                      <ShoppingBag className="h-3.5 w-3.5" />
                    </div>
                    <span>Shop All Catalog</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                </Link>

                <Link
                  to="/tracking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-zinc-50 text-xs font-semibold text-zinc-900 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center">
                      <Truck className="h-3.5 w-3.5" />
                    </div>
                    <span>Track Order Consignment</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                </Link>

                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-zinc-50 text-xs font-semibold text-zinc-900 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                      <Heart className="h-3.5 w-3.5" />
                    </div>
                    <span>Saved Wishlist</span>
                  </div>
                  {wishlistCount > 0 ? (
                    <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      {wishlistCount}
                    </span>
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                  )}
                </Link>

                {/* Notifications Link inside Mobile Drawer */}
                <div className="px-3.5 py-3 rounded-xl hover:bg-zinc-50 text-xs font-semibold text-zinc-900 transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center">
                        <Bell className="h-3.5 w-3.5" />
                      </div>
                      <span>Notifications</span>
                    </div>
                    {unreadNotifsCount > 0 && (
                      <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        {unreadNotifsCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotifsCount > 0 && (
                    <div className="pl-10 space-y-1.5">
                      {notifications.slice(0, 2).map(n => (
                        <div key={n.id} className="text-[11px] text-zinc-600 bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                          <p className="font-semibold text-zinc-900">{n.title}</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Role Specific Portals */}
                {currentUser && currentUser.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-zinc-100 text-xs font-bold text-zinc-950 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
                        <Settings className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span>Admin Governance Console</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                  </Link>
                )}

                {currentUser && currentUser.role === 'supplier' && (
                  <Link
                    to="/supplier"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-blue-50/80 text-xs font-bold text-blue-900 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                        <Building2 className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span>Vendor Fulfillment Portal</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-blue-400" />
                  </Link>
                )}
              </div>

              {/* Quick Categories Section */}
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Explore Departments
                  </span>
                  <Link
                    to="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[11px] font-bold text-zinc-900 hover:underline"
                  >
                    All &rarr;
                  </Link>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {defaultCategories.slice(0, 8).map(c => (
                    <Link
                      key={c}
                      to={`/shop?category=${encodeURIComponent(c)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl border border-zinc-200 bg-zinc-50/70 px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-100 transition shadow-2xs"
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Informational Links */}
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3 text-zinc-800 hover:bg-zinc-50 transition shadow-2xs"
                >
                  <Info className="h-4 w-4 text-zinc-500 shrink-0" />
                  <span>About Our Maison</span>
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3 text-zinc-800 hover:bg-zinc-50 transition shadow-2xs"
                >
                  <Phone className="h-4 w-4 text-zinc-500 shrink-0" />
                  <span>Concierge Care</span>
                </Link>
              </div>

            </div>

            {/* Bottom Authenticity & Support Footer Strip */}
            <div className="border-t border-zinc-200 bg-white p-4 text-center space-y-1">
              <p className="text-[11px] font-semibold text-zinc-800 flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Authorized Retailer & Luxury Consignment</span>
              </p>
              <p className="text-[10px] text-zinc-400 font-mono">Concierge Assistance: +91 (079) 4000-5500</p>
            </div>

          </div>
        </>
      )}

    </header>
  );
}