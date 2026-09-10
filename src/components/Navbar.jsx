// src/components/Navbar.jsx
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getCartCount } from '../utils/cart';
import { 
  defaultCategories, 
  getCategories, 
  getWishlist, 
  defaultBrands, 
  categoryBrandMap, 
  getBrandsByCategory 
} from '../utils/productStore';
import { getCurrentUser, logout, isAdmin, isSupplier, getAdminUser } from '../utils/auth';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../utils/orderStore';
import { 
  BagIcon, 
  SearchIcon, 
  UserIcon, 
  ChevronDownIcon, 
  HeartIcon, 
  BellIcon,
  FilterIcon,
  SlidersIcon,
  SparklesIcon,
  FireIcon,
  XMarkIcon,
  CheckCircleIcon
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

const POPULAR_SEARCHES = [
  'Titan Chrono',
  'Rolex Submariner',
  'Sneakers',
  'Leather Wallets',
  'Apple iPhone',
  'Sony ANC Headphones',
  'Smartwatch',
  'Ray-Ban Sunglasses'
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Active query filters from current URL
  const currentCategory = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentSort = searchParams.get('sort') || '';
  const currentSearch = searchParams.get('search') || '';

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [allCategories, setAllCategories] = useState(() => getCategories());

  // UI Interactive States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Mobile Filter Sheet Local Draft State
  const [sheetCategory, setSheetCategory] = useState('All');
  const [sheetBrand, setSheetBrand] = useState('All');
  const [sheetSort, setSheetSort] = useState('featured');
  const [sheetMinPrice, setSheetMinPrice] = useState('');
  const [sheetMaxPrice, setSheetMaxPrice] = useState('');
  const [sheetInStock, setSheetInStock] = useState(false);

  // Mobile Drawer Tab State
  const [drawerTab, setDrawerTab] = useState('categories'); // 'categories' | 'brands' | 'deals'

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const catTimeoutRef = useRef(null);
  const categoryScrollRef = useRef(null);

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

  // Sync mobile filter sheet draft state whenever URL query params change
  useEffect(() => {
    setSheetCategory(currentCategory || 'All');
    setSheetBrand(currentBrand || 'All');
    setSheetSort(currentSort || 'featured');
  }, [currentCategory, currentBrand, currentSort]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    setNotificationsOpen(false);
    setUserMenuOpen(false);
    setShowSearch(false);
    setMobileFilterOpen(false);
  }, [location.pathname, location.search]);

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

  // Calculate active filter count for badge indicator
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (currentCategory && currentCategory !== 'All') count++;
    if (currentBrand && currentBrand !== 'All') count++;
    if (currentSort && currentSort !== 'featured') count++;
    if (currentSearch) count++;
    return count;
  }, [currentCategory, currentBrand, currentSort, currentSearch]);

  // Dynamic available brands for chosen sheetCategory
  const availableSheetBrands = useMemo(() => {
    if (!sheetCategory || sheetCategory === 'All') {
      return ['All', ...defaultBrands.slice(0, 20)];
    }
    return ['All', ...(categoryBrandMap[sheetCategory] || [])];
  }, [sheetCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleQuickSearch = (keyword) => {
    navigate(`/shop?search=${encodeURIComponent(keyword)}`);
    setShowSearch(false);
    setSearchQuery('');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Apply filters from bottom sheet
  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (sheetCategory && sheetCategory !== 'All') {
      params.set('category', sheetCategory);
    }
    if (sheetBrand && sheetBrand !== 'All') {
      params.set('brand', sheetBrand);
    }
    if (sheetSort && sheetSort !== 'featured') {
      params.set('sort', sheetSort);
    }
    if (sheetMinPrice) {
      params.set('minPrice', sheetMinPrice);
    }
    if (sheetMaxPrice) {
      params.set('maxPrice', sheetMaxPrice);
    }
    if (sheetInStock) {
      params.set('inStock', 'true');
    }

    const queryString = params.toString();
    navigate(queryString ? `/shop?${queryString}` : '/shop');
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSheetCategory('All');
    setSheetBrand('All');
    setSheetSort('featured');
    setSheetMinPrice('');
    setSheetMaxPrice('');
    setSheetInStock(false);
    navigate('/shop');
    setMobileFilterOpen(false);
  };

  const unreadNotifsCount = notifications.filter(n => n.unread).length;

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'shadow-md border-b border-gray-200 bg-white/98 backdrop-blur-md' : 'border-b border-gray-200/80 bg-white/95 backdrop-blur-md'}`}>

      {/* ================= PRIMARY TOP NAVIGATION BAR ================= */}
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="relative flex h-14 sm:h-16 items-center justify-between gap-2">

          {/* Left: Brand Identity */}
          <div className="flex items-center shrink-0 z-10">
            <Link to="/" aria-label="Krishna Accessories home" className="flex items-center gap-2.5 group">
              <div className="flex h-8.5 w-8.5 sm:h-9.5 sm:w-9.5 shrink-0 items-center justify-center rounded-xl bg-[#0F172A] text-amber-300 font-serif font-bold text-sm sm:text-base shadow-xs border border-amber-500/20 transition-transform group-hover:scale-105">
                K
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xs sm:text-sm tracking-widest uppercase text-gray-950 leading-tight">
                  Krishna
                </span>
                <span className="text-[8.5px] sm:text-[9.5px] font-semibold tracking-[0.2em] text-[#B89758] uppercase leading-none">
                  Accessories
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Primary Navigation Links (Desktop Screens) */}
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
                        const isActive = currentCategory === cat;

                        return (
                          <Link
                            key={cat}
                            to={`/shop?category=${encodeURIComponent(cat)}`}
                            onClick={() => setCategoriesOpen(false)}
                            className={`group/cat flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold normal-case transition-all duration-150 ${
                              isActive
                                ? 'bg-gray-950 text-white shadow-xs'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-950'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-base shrink-0 transition-transform group-hover/cat:scale-110">{icon}</span>
                              <span className="truncate">{cat}</span>
                            </div>
                            <span className={`text-[11px] transition-transform duration-150 group-hover/cat:translate-x-0.5 shrink-0 ${
                              isActive ? 'text-amber-300' : 'text-gray-400 group-hover/cat:text-gray-900'
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
              New In
            </Link>

            <Link
              to="/order-tracking"
              className={`relative py-1.5 transition-colors ${location.pathname === '/order-tracking'
                ? 'text-gray-950 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#111827]'
                : 'hover:text-gray-950'
                }`}
            >
              Track Order
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

          {/* Right: Search, Actions, Mobile Filters Trigger & Drawer */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto z-10">

            {/* Search Input Bar (Desktop) */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:block relative w-36 xl:w-48 focus-within:w-60 transition-all duration-250">
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
              className={`lg:hidden flex h-8 w-8 items-center justify-center rounded-lg border transition cursor-pointer ${
                showSearch ? 'border-gray-950 bg-gray-900 text-white' : 'border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200'
              }`}
            >
              <SearchIcon className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Quick Filters Button (Direct in Header Bar) */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              aria-label="Open Filters"
              className={`flex h-8 items-center gap-1 px-2.5 rounded-lg border transition text-xs font-semibold cursor-pointer ${
                activeFiltersCount > 0 
                  ? 'border-amber-400 bg-amber-50 text-amber-950 font-bold shadow-2xs' 
                  : 'border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200'
              }`}
              title="Filter Catalog"
            >
              <SlidersIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-600 px-1 text-[8px] font-bold text-white">
                  {activeFiltersCount}
                </span>
              )}
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
                  className="flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2 text-xs font-medium text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 shadow-2xs cursor-pointer"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gray-900 text-white font-bold text-[10px]">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline truncate max-w-[70px] text-[11px] text-gray-900 font-semibold">
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
                      <div className="py-1.5 space-y-0.5">
                        <div className="px-2 py-0.5">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                            Portals & Staff
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
                        ) : (
                          <Link
                            to="/login"
                            state={{ requiredRole: 'admin', from: '/admin', message: 'Enter Administrator ID & Password to access Admin Management.' }}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold text-gray-800 hover:bg-amber-50 hover:text-amber-950 transition"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm">🔑</span>
                              <span>Admin / Staff Login</span>
                            </div>
                            <span className="text-[10px] text-gray-400">&rarr;</span>
                          </Link>
                        )}

                        {isSupplier() ? (
                          <Link
                            to="/supplier"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-bold text-blue-950 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 transition"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm">🏢</span>
                              <span>Vendor Portal</span>
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-200/80 text-blue-900 px-1.5 py-0.2 rounded-full">Active</span>
                          </Link>
                        ) : (
                          <Link
                            to="/login"
                            state={{ requiredRole: 'supplier', from: '/supplier', message: 'Enter Supplier ID & Password to access Vendor Portal.' }}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-950 transition"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm">🏢</span>
                              <span>Vendor Portal</span>
                            </div>
                            <span className="text-[10px] text-gray-400">&rarr;</span>
                          </Link>
                        )}
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
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#111827] text-white shadow-2xs transition hover:bg-black shrink-0 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-white" />
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="xl:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 transition text-sm shrink-0 cursor-pointer"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>

          </div>

        </div>
      </div>

      {/* ================= SUB-HEADER: RESPONSIVE HORIZONTAL CATEGORY & FILTER STRIP ================= */}
      {/* Visible on Mobile, Tablet & Desktop: Provides 1-touch browsing of all categories and filters */}
      <div className="w-full border-t border-gray-200/80 bg-white/95 backdrop-blur-md">
        <div className="w-full px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center h-10 sm:h-11">

            {/* Horizontal Scroll Container */}
            <div 
              ref={categoryScrollRef}
              className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 w-full text-[11px] font-medium tracking-tight pr-4 select-none"
            >
              {/* Quick Filters Trigger Pill */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1 transition-all duration-150 active:scale-95 cursor-pointer ${
                  activeFiltersCount > 0
                    ? 'bg-amber-500 text-gray-950 font-bold shadow-xs'
                    : 'bg-gray-900 text-amber-300 hover:bg-black font-semibold'
                }`}
              >
                <SlidersIcon className="w-3 h-3 text-current" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black text-white text-[8.5px] font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* All Catalog Pill */}
              <Link
                to="/shop"
                className={`shrink-0 flex items-center gap-1 rounded-full px-3 py-1 transition-all duration-150 active:scale-95 ${
                  location.pathname === '/shop' && !currentCategory && !currentSort && !currentSearch
                    ? 'bg-gray-950 text-white font-bold shadow-2xs'
                    : 'bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 hover:text-black'
                }`}
              >
                <span>✨</span>
                <span>All Catalog</span>
              </Link>

              {/* New In Pill */}
              <Link
                to="/new-arrivals"
                className={`shrink-0 flex items-center gap-1 rounded-full px-3 py-1 transition-all duration-150 active:scale-95 ${
                  location.pathname === '/new-arrivals' || currentSort === 'newest'
                    ? 'bg-gray-950 text-white font-bold shadow-2xs'
                    : 'bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 hover:text-black'
                }`}
              >
                <span>🔥</span>
                <span>New In</span>
              </Link>

              {/* Deals Pill */}
              <Link
                to="/shop?sort=discount"
                className={`shrink-0 flex items-center gap-1 rounded-full px-3 py-1 transition-all duration-150 active:scale-95 ${
                  currentSort === 'discount'
                    ? 'bg-gray-950 text-white font-bold shadow-2xs'
                    : 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-semibold'
                }`}
              >
                <span>⚡</span>
                <span>Deals</span>
              </Link>

              {/* All 11 Product Categories with Icons */}
              {allCategories.map((cat) => {
                const icon = CATEGORY_ICONS[cat] || '🏷️';
                const isActive = currentCategory === cat;

                return (
                  <Link
                    key={cat}
                    to={`/shop?category=${encodeURIComponent(cat)}`}
                    className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1 transition-all duration-150 active:scale-95 whitespace-nowrap ${
                      isActive
                        ? 'bg-gray-950 text-white font-bold shadow-2xs ring-1 ring-gray-950'
                        : 'bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 hover:text-black'
                    }`}
                  >
                    <span className="text-xs">{icon}</span>
                    <span>{cat}</span>
                  </Link>
                );
              })}

              {/* View All Drawer Trigger */}
              <button
                type="button"
                onClick={() => {
                  setDrawerTab('categories');
                  setMobileMenuOpen(true);
                }}
                className="shrink-0 flex items-center gap-1 rounded-full px-2.5 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 text-[10.5px] font-semibold cursor-pointer"
              >
                <span>+ More</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ================= MOBILE SEARCH BAR WITH TRENDING SUGGESTIONS ================= */}
      {showSearch && (
        <div className="lg:hidden border-t border-gray-200 bg-white p-3 shadow-lg animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search timepieces, footwear, bags, electronics..."
              autoFocus
              className="w-full rounded-xl border border-gray-300 bg-[#F4F4F6] py-2 pl-9 pr-14 text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon className="w-3.5 h-3.5" />
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs px-1"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-[#111827] px-2.5 py-1 text-[10px] font-bold text-white hover:bg-black transition cursor-pointer"
            >
              Find
            </button>
          </form>

          {/* Trending Suggestions */}
          <div className="mt-2.5 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Trending Searches:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SEARCHES.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => handleQuickSearch(item)}
                  className="rounded-lg bg-gray-100 px-2 py-0.8 text-[10px] font-medium text-gray-700 hover:bg-gray-200 hover:text-black transition cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MOBILE QUICK FILTERS & SORTING BOTTOM SHEET ================= */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          {/* Bottom Sheet Modal */}
          <div className="relative w-full max-h-[88vh] bg-white rounded-t-3xl shadow-2xl flex flex-col z-50 animate-slide-up border-t border-gray-200 overflow-hidden">
            
            {/* Sheet Handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5 bg-gray-50">
              <div className="flex items-center gap-2">
                <SlidersIcon className="w-4 h-4 text-gray-900" />
                <h2 className="text-sm font-bold text-gray-950 tracking-tight">Filter & Sort Catalog</h2>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Sheet Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">

              {/* Category Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-950">Select Category</span>
                  {sheetCategory !== 'All' && (
                    <button
                      type="button"
                      onClick={() => {
                        setSheetCategory('All');
                        setSheetBrand('All');
                      }}
                      className="text-[10px] text-amber-700 font-bold hover:underline"
                    >
                      Clear Category
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSheetCategory('All');
                      setSheetBrand('All');
                    }}
                    className={`flex items-center justify-between rounded-xl p-2 text-xs transition border cursor-pointer ${
                      sheetCategory === 'All'
                        ? 'bg-gray-950 text-white font-bold border-gray-950 shadow-xs'
                        : 'bg-[#F4F4F6] text-gray-700 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>✨</span>
                      <span>All Categories</span>
                    </div>
                    {sheetCategory === 'All' && <span>✓</span>}
                  </button>

                  {allCategories.map((cat) => {
                    const icon = CATEGORY_ICONS[cat] || '🏷️';
                    const isSel = sheetCategory === cat;

                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => {
                          setSheetCategory(cat);
                          setSheetBrand('All');
                        }}
                        className={`flex items-center justify-between rounded-xl p-2 text-xs transition border cursor-pointer ${
                          isSel
                            ? 'bg-gray-950 text-white font-bold border-gray-950 shadow-xs'
                            : 'bg-[#F4F4F6] text-gray-700 border-transparent hover:bg-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="shrink-0">{icon}</span>
                          <span className="truncate">{cat}</span>
                        </div>
                        {isSel && <span className="shrink-0">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Brand Selector */}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-950">
                    Brands {sheetCategory !== 'All' ? `(${sheetCategory})` : ''}
                  </span>
                  {sheetBrand !== 'All' && (
                    <button
                      type="button"
                      onClick={() => setSheetBrand('All')}
                      className="text-[10px] text-amber-700 font-bold hover:underline"
                    >
                      Reset Brand
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-gray-50 rounded-xl border border-gray-200/60">
                  {availableSheetBrands.map((brand) => (
                    <button
                      type="button"
                      key={brand}
                      onClick={() => setSheetBrand(brand)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                        sheetBrand === brand
                          ? 'bg-gray-950 text-white font-bold shadow-2xs'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sorting Options */}
              <div className="border-t border-gray-100 pt-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-950 block mb-2">Sort By</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {[
                    { id: 'featured', label: '⭐ Best Match' },
                    { id: 'price-low', label: '💰 Price: Low to High' },
                    { id: 'price-high', label: '💎 Price: High to Low' },
                    { id: 'discount', label: '⚡ Biggest Discount' },
                    { id: 'newest', label: '🔥 Newest Arrivals' },
                    { id: 'rating', label: '★ Highest Rated' },
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setSheetSort(s.id)}
                      className={`rounded-xl px-2.5 py-2 text-xs font-medium text-left transition border cursor-pointer ${
                        sheetSort === s.id
                          ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold'
                          : 'bg-[#F4F4F6] border-transparent text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Presets */}
              <div className="border-t border-gray-100 pt-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-950 block mb-2">Price Budget</span>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {[
                    { label: 'All Budgets', min: '', max: '' },
                    { label: 'Under ₹2,000', min: '0', max: '2000' },
                    { label: '₹2,000 - ₹5,000', min: '2000', max: '5000' },
                    { label: '₹5,000 - ₹15,000', min: '5000', max: '15000' },
                    { label: 'Luxury ₹15,000+', min: '15000', max: '' },
                  ].map((preset) => {
                    const isMatch = sheetMinPrice === preset.min && sheetMaxPrice === preset.max;
                    return (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => {
                          setSheetMinPrice(preset.min);
                          setSheetMaxPrice(preset.max);
                        }}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition cursor-pointer ${
                          isMatch
                            ? 'bg-gray-950 text-white font-bold'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9.5px] text-gray-400 block mb-0.5 font-medium">Min Price (₹)</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={sheetMinPrice}
                      onChange={(e) => setSheetMinPrice(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-gray-950 focus:bg-white"
                    />
                  </div>
                  <div>
                    <span className="text-[9.5px] text-gray-400 block mb-0.5 font-medium">Max Price (₹)</span>
                    <input
                      type="number"
                      placeholder="250000"
                      value={sheetMaxPrice}
                      onChange={(e) => setSheetMaxPrice(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-gray-950 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* In Stock Only Checkbox */}
              <div className="border-t border-gray-100 pt-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-semibold text-gray-900">In-Stock Products Only</span>
                  <input
                    type="checkbox"
                    checked={sheetInStock}
                    onChange={(e) => setSheetInStock(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#0F172A] cursor-pointer"
                  />
                </label>
              </div>

            </div>

            {/* Sheet Footer Action Bar */}
            <div className="border-t border-gray-200 p-3 bg-gray-50 flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 rounded-full border border-gray-300 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={handleApplyFilters}
                className="flex-2 rounded-full bg-[#0F172A] py-2.5 text-xs font-bold text-white hover:bg-black transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Apply & View Catalog</span>
                <span>&rarr;</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= ENHANCED MOBILE DRAWER / SIDE NAVIGATION ================= */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          {/* Slide-in Drawer Container */}
          <div className="relative w-full max-h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col z-50 animate-slide-up border-t border-gray-200 overflow-hidden">
            
            {/* Drawer Handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Drawer Header with Tabs */}
            <div className="border-b border-gray-200 px-4 pt-2 pb-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F172A] text-amber-300 font-serif font-bold text-xs">
                    K
                  </div>
                  <span className="font-bold text-xs uppercase tracking-wider text-gray-900">Explore Catalog & Menu</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Segmented Tab Controls */}
              <div className="grid grid-cols-3 gap-1 bg-gray-200/80 p-1 rounded-xl text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setDrawerTab('categories')}
                  className={`py-1.5 rounded-lg transition text-center cursor-pointer ${
                    drawerTab === 'categories'
                      ? 'bg-white text-gray-950 font-bold shadow-xs'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  🏷️ Categories
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerTab('brands')}
                  className={`py-1.5 rounded-lg transition text-center cursor-pointer ${
                    drawerTab === 'brands'
                      ? 'bg-white text-gray-950 font-bold shadow-xs'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  ✨ Brands
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerTab('deals')}
                  className={`py-1.5 rounded-lg transition text-center cursor-pointer ${
                    drawerTab === 'deals'
                      ? 'bg-white text-gray-950 font-bold shadow-xs'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  ⚡ Menu & Portals
                </button>
              </div>
            </div>

            {/* Tab 1: Categories Explorer */}
            {drawerTab === 'categories' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    All Departments ({allCategories.length})
                  </span>
                  <Link
                    to="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
                  >
                    <span>View All Catalog</span>
                    <span>&rarr;</span>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {allCategories.map((cat) => {
                    const icon = CATEGORY_ICONS[cat] || '✨';
                    const isActive = currentCategory === cat;

                    return (
                      <Link
                        key={cat}
                        to={`/shop?category=${encodeURIComponent(cat)}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between rounded-xl p-2.5 transition border ${
                          isActive
                            ? 'bg-gray-950 text-white font-bold border-gray-950 shadow-xs'
                            : 'bg-[#F4F4F6] text-gray-800 border-gray-200/50 hover:bg-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base shrink-0">{icon}</span>
                          <span className="text-xs font-semibold truncate">{cat}</span>
                        </div>
                        <span className={`text-[11px] ${isActive ? 'text-amber-300' : 'text-gray-400'}`}>&rarr;</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Brands Explorer */}
            {drawerTab === 'brands' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Top Featured Brand Partners
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {defaultBrands.slice(0, 24).map((brand) => (
                    <Link
                      key={brand}
                      to={`/shop?brand=${encodeURIComponent(brand)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl bg-[#F4F4F6] border border-gray-200/60 p-2.5 text-xs font-semibold text-gray-800 hover:bg-gray-200 transition"
                    >
                      <span className="truncate">{brand}</span>
                      <span className="text-gray-400 text-[10px]">&rarr;</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Menu, Deals & Portals */}
            {drawerTab === 'deals' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                
                {/* Core Quick Links */}
                <div className="space-y-1">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-gray-800 hover:bg-gray-100 font-semibold"
                  >
                    <span>🏠 Home</span>
                    <span className="text-gray-400">&rarr;</span>
                  </Link>

                  <Link
                    to="/new-arrivals"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-gray-800 hover:bg-gray-100 font-semibold"
                  >
                    <span>🔥 New In / Fresh Arrivals</span>
                    <span className="text-rose-600 font-bold text-[10px]">NEW</span>
                  </Link>

                  <Link
                    to="/shop?sort=discount"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-rose-700 bg-rose-50 border border-rose-200 font-bold"
                  >
                    <span>⚡ Clearance Offers & Deals</span>
                    <span className="text-[10px]">&rarr;</span>
                  </Link>

                  <Link
                    to="/order-tracking"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-gray-800 hover:bg-gray-100 font-semibold"
                  >
                    <span>📦 Track Order Consignment</span>
                    <span className="text-gray-400">&rarr;</span>
                  </Link>

                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-gray-800 hover:bg-gray-100 font-semibold"
                  >
                    <span>✨ About Krishna Sanctuary</span>
                    <span className="text-gray-400">&rarr;</span>
                  </Link>

                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-gray-800 hover:bg-gray-100 font-semibold"
                  >
                    <span>📞 Contact & Support Concierge</span>
                    <span className="text-gray-400">&rarr;</span>
                  </Link>
                </div>

                {/* Management Portals */}
                <div className="pt-2 border-t border-gray-100 space-y-1">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-gray-400 block px-2 mb-1">
                    Portals & Staff
                  </span>

                  {isAdmin() ? (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl px-3 py-2 font-bold text-amber-950 bg-amber-50 border border-amber-300 flex items-center justify-between"
                    >
                      <span>⚙️ Admin Dashboard</span>
                      <span className="text-[9px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">ACTIVE</span>
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      state={{ requiredRole: 'admin', from: '/admin', message: 'Enter Administrator ID to access Admin Console.' }}
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl px-3 py-2 font-semibold text-gray-800 hover:bg-amber-50 flex items-center justify-between"
                    >
                      <span>🔑 Admin / Staff Login</span>
                      <span className="text-gray-400">&rarr;</span>
                    </Link>
                  )}

                  {isSupplier() ? (
                    <Link
                      to="/supplier"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl px-3 py-2 font-bold text-blue-950 bg-blue-50 border border-blue-300 flex items-center justify-between"
                    >
                      <span>🏢 Vendor Partner Portal</span>
                      <span className="text-[9px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full">ACTIVE</span>
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      state={{ requiredRole: 'supplier', from: '/supplier', message: 'Enter Supplier ID to access Vendor Portal.' }}
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl px-3 py-2 font-semibold text-gray-800 hover:bg-blue-50 flex items-center justify-between"
                    >
                      <span>🏢 Vendor Partner Login</span>
                      <span className="text-gray-400">&rarr;</span>
                    </Link>
                  )}
                </div>

              </div>
            )}

            {/* Drawer User Account Footer */}
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              {currentUser ? (
                <div className="flex items-center justify-between gap-2">
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center gap-2 rounded-xl bg-white border border-gray-200 p-2 text-xs font-bold text-gray-900 shadow-2xs truncate"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white text-[10px]">
                      {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="truncate">{currentUser.name || currentUser.email}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer shrink-0"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full rounded-full bg-[#111827] py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white hover:bg-black shadow-md"
                >
                  Sign In / Register Account &rarr;
                </Link>
              )}
            </div>

          </div>
        </div>
      )}

    </header>
  );
}