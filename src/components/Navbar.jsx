// src/components/Navbar.jsx
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getCartCount } from '../utils/cart';
import { defaultCategories, getCategories, getWishlist, categoryBrandMap, defaultBrands } from '../utils/productStore';
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
  MailIcon,
  FilterIcon,
  SlidersIcon,
  SparklesIcon,
  XMarkIcon,
  GridIcon
} from './Icons';

export const CATEGORY_ICONS = {
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

const POPULAR_BRANDS = [
  'Rolex', 'Apple', 'Titan', 'Nike', 'Sony', 'Zara',
  'Casio', 'Wildcraft', 'Adidas', 'Fossil', 'Samsung', 'Ray-Ban'
];

const PRICE_PRESETS = [
  { label: 'All Prices', min: 0, max: 250000 },
  { label: 'Under ₹2,000', min: 0, max: 2000 },
  { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
  { label: '₹5,000 - ₹15,000', min: 5000, max: 15000 },
  { label: '₹15,000+ (Luxury)', min: 15000, max: 250000 }
];

const SORT_OPTIONS = [
  { value: 'featured', label: '✨ Featured' },
  { value: 'price-low', label: '💰 Price: Low to High' },
  { value: 'price-high', label: '💎 Price: High to Low' },
  { value: 'rating', label: '⭐ Top Rated' },
  { value: 'discount', label: '🏷️ Biggest Discount' },
  { value: 'newest', label: '🆕 New Arrivals' }
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [allCategories, setAllCategories] = useState(() => getCategories());

  // UI state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Mobile Filter Sheet State
  const [mobileFilterModalOpen, setMobileFilterModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterBrand, setFilterBrand] = useState('All');
  const [filterPricePreset, setFilterPricePreset] = useState('All Prices');
  const [filterSort, setFilterSort] = useState('featured');
  const [filterInStock, setFilterInStock] = useState(false);

  // Mobile Menu Active Tab
  const [mobileDrawerTab, setMobileDrawerTab] = useState('categories'); // 'categories' | 'filters' | 'menu'
  const [categorySearchTerm, setCategorySearchTerm] = useState('');

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const catTimeoutRef = useRef(null);
  const categoryScrollRef = useRef(null);

  // Active Category & Brand from current URL
  const currentCategory = useMemo(() => {
    if (location.pathname === '/shop') {
      return searchParams.get('category') || 'All';
    }
    return '';
  }, [location.pathname, searchParams]);

  const currentBrand = useMemo(() => {
    if (location.pathname === '/shop') {
      return searchParams.get('brand') || 'All';
    }
    return 'All';
  }, [location.pathname, searchParams]);

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

  // Sync filter modal default selections with active URL params
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    setNotificationsOpen(false);
    setUserMenuOpen(false);
    setShowSearch(false);
    setMobileFilterModalOpen(false);

    if (location.pathname === '/shop') {
      setFilterCategory(searchParams.get('category') || 'All');
      setFilterBrand(searchParams.get('brand') || 'All');
      setFilterSort(searchParams.get('sort') || 'featured');
      setFilterInStock(searchParams.get('inStock') === 'true');
    }
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Brands dynamically filtered by selected category
  const availableBrands = useMemo(() => {
    if (filterCategory && filterCategory !== 'All' && categoryBrandMap[filterCategory]) {
      return ['All', ...categoryBrandMap[filterCategory]];
    }
    return ['All', ...POPULAR_BRANDS];
  }, [filterCategory]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleQuickCategorySelect = (cat) => {
    if (cat === 'All') {
      navigate('/shop');
    } else {
      navigate(`/shop?category=${encodeURIComponent(cat)}`);
    }
    setMobileMenuOpen(false);
    setMobileFilterModalOpen(false);
    setShowSearch(false);
  };

  const handleQuickBrandSelect = (brand) => {
    if (brand === 'All') {
      navigate('/shop');
    } else {
      navigate(`/shop?brand=${encodeURIComponent(brand)}`);
    }
    setMobileMenuOpen(false);
    setMobileFilterModalOpen(false);
  };

  const handleApplyFilterModal = () => {
    const params = new URLSearchParams();
    if (filterCategory && filterCategory !== 'All') {
      params.set('category', filterCategory);
    }
    if (filterBrand && filterBrand !== 'All') {
      params.set('brand', filterBrand);
    }
    if (filterSort && filterSort !== 'featured') {
      params.set('sort', filterSort);
    }
    const preset = PRICE_PRESETS.find(p => p.label === filterPricePreset);
    if (preset && (preset.min > 0 || preset.max < 250000)) {
      if (preset.min > 0) params.set('minPrice', preset.min);
      if (preset.max < 250000) params.set('maxPrice', preset.max);
    }
    if (filterInStock) {
      params.set('inStock', 'true');
    }

    const queryString = params.toString();
    navigate(`/shop${queryString ? `?${queryString}` : ''}`);
    setMobileFilterModalOpen(false);
  };

  const handleResetFilterModal = () => {
    setFilterCategory('All');
    setFilterBrand('All');
    setFilterPricePreset('All Prices');
    setFilterSort('featured');
    setFilterInStock(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unreadNotifsCount = notifications.filter(n => n.unread).length;

  const filteredCategoriesList = useMemo(() => {
    if (!categorySearchTerm.trim()) return allCategories;
    return allCategories.filter(c => c.toLowerCase().includes(categorySearchTerm.toLowerCase().trim()));
  }, [allCategories, categorySearchTerm]);

  // Active filter count for badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterCategory && filterCategory !== 'All') count++;
    if (filterBrand && filterBrand !== 'All') count++;
    if (filterPricePreset !== 'All Prices') count++;
    if (filterSort !== 'featured') count++;
    if (filterInStock) count++;
    return count;
  }, [filterCategory, filterBrand, filterPricePreset, filterSort, filterInStock]);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'shadow-md bg-white/98 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md'}`}>

      {/* Top Luxury Announcement & Quick Contact Bar */}
      <div className="bg-[#0B1120] text-slate-300 border-b border-slate-800 text-[11px] py-1.5 px-3 sm:px-6 lg:px-8 xl:px-10">
        <div className="mx-auto flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Store Location Snippet */}
          <div className="flex items-center gap-1.5 sm:gap-2 truncate text-slate-300">
            <span className="text-amber-400 font-bold shrink-0">📍 Mumbai Boutique:</span>
            <span className="truncate hidden sm:inline text-slate-200">{SHOP_INFO.address}</span>
            <span className="truncate sm:hidden text-slate-200">Heera Panna, Haji Ali</span>
          </div>

          {/* Quick Direct Contacts & Social Icons */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Phone */}
            <a
              href={`tel:+91${SHOP_INFO.rawPhone}`}
              className="hidden md:inline-flex items-center gap-1 text-slate-200 hover:text-amber-300 transition text-[11px]"
              title="Direct Concierge Line"
            >
              <PhoneIcon className="w-3 h-3 text-amber-400" />
              <span>{SHOP_INFO.phone}</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${SHOP_INFO.email}`}
              className="hidden lg:inline-flex items-center gap-1 text-slate-200 hover:text-amber-300 transition text-[11px]"
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
          <div className="flex items-center shrink-0 z-10">
            <Link to="/" aria-label="Krishna Accessories home" className="flex items-center gap-2 sm:gap-2.5 group">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-[#0F172A] text-amber-300 font-serif font-bold text-sm sm:text-base shadow-xs border border-amber-500/20 transition-transform group-hover:scale-105">
                K
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-sm sm:text-base font-extrabold tracking-wider text-[#0F172A] uppercase leading-tight group-hover:text-amber-700 transition">
                  Krishna
                </span>
                <span className="text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.22em] text-amber-700 uppercase -mt-0.5">
                  Accessories
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Primary Navigation Links (Desktop) */}
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
                  className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[480px] sm:w-[540px] z-50 animate-fade-in"
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

          {/* Right: Search & Actions (Pinned to far right) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto z-10">

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
              className={`lg:hidden flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-lg border transition cursor-pointer ${
                showSearch ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200'
              }`}
            >
              <SearchIcon className="w-3.5 h-3.5" />
            </button>

            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
                className="flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-lg border border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 transition relative cursor-pointer"
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
              className={`relative flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-lg border transition cursor-pointer ${location.pathname === '/wishlist'
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
              className={`relative flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-lg border transition cursor-pointer ${location.pathname === '/cart'
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
                  className="flex h-8 sm:h-8.5 items-center gap-1.5 sm:gap-2 rounded-xl border border-gray-200 bg-white px-2 sm:px-2.5 text-xs font-medium text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 shadow-2xs cursor-pointer"
                >
                  <div className="flex h-5 w-5 sm:h-5.5 sm:w-5.5 items-center justify-center rounded-lg bg-[#0F172A] text-amber-300 font-bold text-[10px] sm:text-[11px]">
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

                      {/* Management Portals */}
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
                              <span>Vendor Partner Portal</span>
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
                              <span>Vendor Partner Portal</span>
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
                className="inline-flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-full bg-[#111827] text-white shadow-2xs transition hover:bg-black shrink-0 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-white" />
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className={`xl:hidden flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-lg border transition text-sm shrink-0 cursor-pointer ${
                mobileMenuOpen ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200'
              }`}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>

          </div>

        </div>
      </div>

      {/* Sub-Header: Mobile & Responsive Category & Quick Filter Strip */}
      <div className="w-full border-b border-gray-200/90 bg-white/95 backdrop-blur-md shadow-2xs overflow-hidden">
        <div className="relative flex items-center px-2 sm:px-4 py-2 gap-1.5 sm:gap-2">

          {/* Quick "⚡ Filters" Action Pill Button */}
          <button
            type="button"
            onClick={() => setMobileFilterModalOpen(true)}
            className="flex items-center gap-1.5 shrink-0 rounded-full bg-[#0F172A] px-3 py-1.5 text-[11px] font-bold text-amber-300 hover:bg-black transition shadow-2xs active:scale-95 border border-amber-400/30 cursor-pointer z-10"
            title="Open Catalog Filters"
          >
            <SlidersIcon className="w-3.5 h-3.5 text-amber-300" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[8.5px] font-extrabold text-[#0B1120]">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Vertical Separator */}
          <div className="h-4 w-px bg-gray-300 shrink-0" />

          {/* Horizontal Scrollable Category Rail */}
          <div
            ref={categoryScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5 pr-2"
          >
            {/* "All" Pill */}
            <button
              type="button"
              onClick={() => handleQuickCategorySelect('All')}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                (location.pathname === '/shop' && (!currentCategory || currentCategory === 'All'))
                  ? 'bg-gray-950 text-white font-bold shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-950 border border-gray-200/60'
              }`}
            >
              <span>✨</span>
              <span>All Items</span>
            </button>

            {/* Category Pills */}
            {allCategories.map((cat) => {
              const icon = CATEGORY_ICONS[cat] || '🏷️';
              const isActive = currentCategory === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleQuickCategorySelect(cat)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#0F172A] text-amber-300 font-bold border border-amber-500/30 shadow-xs'
                      : 'bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 hover:text-gray-950 border border-gray-200/70'
                  }`}
                >
                  <span className="text-xs">{icon}</span>
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Right Gradient Indicator to hint horizontal scrolling */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/90 to-transparent" />
        </div>
      </div>

      {/* Mobile Search Bar Overlay */}
      {showSearch && (
        <div className="lg:hidden border-b border-gray-200 bg-white p-3 shadow-lg animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search timepieces, bags, smartphones, footwear..."
              autoFocus
              className="w-full rounded-xl border border-gray-300 bg-[#F4F4F6] py-2 pl-9 pr-14 text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition shadow-inner"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon className="w-3.5 h-3.5" />
            </span>
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-[#0F172A] px-3 py-1 text-[10.5px] font-bold text-amber-300 hover:bg-black transition cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Quick Trending Filter Tags in Search Overlay */}
          <div className="mt-2.5 pt-2 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Popular Searches & Categories
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['Watches', 'Shoes', 'Bags & Wallets', 'Mobiles', 'Electronics', 'Smart Gadgets'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickCategorySelect(tag)}
                  className="rounded-lg bg-gray-100 hover:bg-gray-200 px-2 py-1 text-[10.5px] font-medium text-gray-700 transition cursor-pointer flex items-center gap-1"
                >
                  <span>{CATEGORY_ICONS[tag] || '🔍'}</span>
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Mobile Filter & Categories Sheet (Modal/Bottom Sheet) */}
      {mobileFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobileFilterModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl z-10 animate-slide-up border border-gray-200 overflow-hidden">
            {/* Drag Handle on Mobile */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-2 sm:hidden shrink-0" />

            {/* Modal Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F172A] text-amber-300">
                  <SlidersIcon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-950 leading-none">Filter & Browse</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">Customize your luxury catalog view</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilterModal}
                    className="text-[11px] font-semibold text-gray-500 hover:text-rose-600 transition cursor-pointer px-2 py-1"
                  >
                    Reset All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMobileFilterModalOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200/80 text-gray-700 hover:bg-gray-300 transition text-xs font-bold cursor-pointer"
                  aria-label="Close Filter Sheet"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-4 overflow-y-auto space-y-4 divide-y divide-gray-100 text-xs">

              {/* 1. Category Selector */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🏷️</span>
                    <span>1. Select Category</span>
                  </span>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    {filterCategory}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-44 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => setFilterCategory('All')}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left font-medium transition cursor-pointer ${
                      filterCategory === 'All'
                        ? 'bg-gray-950 text-white font-bold shadow-xs'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200/60'
                    }`}
                  >
                    <span className="text-sm">✨</span>
                    <span className="truncate text-[11px]">All Categories</span>
                  </button>

                  {allCategories.map((cat) => {
                    const icon = CATEGORY_ICONS[cat] || '🏷️';
                    const isSelected = filterCategory === cat;

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setFilterCategory(cat);
                          setFilterBrand('All'); // Reset brand when category changes
                        }}
                        className={`flex items-center gap-2 p-2 rounded-xl text-left font-medium transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#0F172A] text-amber-300 font-bold border border-amber-500/40 shadow-xs'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200/60'
                        }`}
                      >
                        <span className="text-sm">{icon}</span>
                        <span className="truncate text-[11px]">{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Brand Selector (Dynamic based on Category) */}
              <div className="pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>👑</span>
                    <span>2. Brand / Designer</span>
                  </span>
                  <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                    {filterBrand}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {availableBrands.map((brand) => {
                    const isSelected = filterBrand === brand;
                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => setFilterBrand(brand)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition cursor-pointer ${
                          isSelected
                            ? 'bg-gray-950 text-white font-bold'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                      >
                        {brand === 'All' ? 'All Brands' : brand}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Price Range Presets */}
              <div className="pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>💵</span>
                    <span>3. Price Range</span>
                  </span>
                  <span className="text-[10px] font-semibold text-gray-600">
                    {filterPricePreset}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {PRICE_PRESETS.map((preset) => {
                    const isSelected = filterPricePreset === preset.label;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setFilterPricePreset(preset.label)}
                        className={`rounded-xl px-2.5 py-2 text-[11px] text-center font-medium transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#0F172A] text-amber-300 font-bold border border-amber-500/40 shadow-xs'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200/60'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Sort Options */}
              <div className="pt-3">
                <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider block mb-2">
                  ⚡ 4. Sort Order
                </span>

                <div className="grid grid-cols-2 gap-1.5">
                  {SORT_OPTIONS.map((s) => {
                    const isSelected = filterSort === s.value;
                    return (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setFilterSort(s.value)}
                        className={`rounded-xl px-2.5 py-1.5 text-left text-[11px] font-medium transition cursor-pointer ${
                          isSelected
                            ? 'bg-gray-950 text-white font-bold'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200/60'
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. In-Stock Availability Toggle */}
              <div className="pt-3 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-gray-900 block">In-Stock Only</span>
                  <span className="text-[10px] text-gray-500">Hide out of stock items</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFilterInStock(!filterInStock)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    filterInStock ? 'bg-amber-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform ${
                      filterInStock ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

            </div>

            {/* Modal Sticky Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResetFilterModal}
                className="w-1/3 rounded-xl border border-gray-300 bg-white py-2 text-center text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleApplyFilterModal}
                className="w-2/3 rounded-xl bg-[#0F172A] py-2 text-center text-xs font-bold text-amber-300 hover:bg-black transition shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Apply Filters</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Mobile Drawer (Hamburger Menu) */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-gray-200 bg-white shadow-2xl max-h-[85vh] flex flex-col animate-fade-in">
          
          {/* Mobile Drawer Tab Header */}
          <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-50/80 p-1.5 gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setMobileDrawerTab('categories')}
              className={`rounded-lg py-1.5 text-center text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                mobileDrawerTab === 'categories'
                  ? 'bg-white text-gray-950 shadow-xs border border-gray-200/80'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <span>🏷️</span>
              <span>Categories</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileDrawerTab('filters')}
              className={`rounded-lg py-1.5 text-center text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                mobileDrawerTab === 'filters'
                  ? 'bg-white text-gray-950 shadow-xs border border-gray-200/80'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <span>⚡</span>
              <span>Quick Filters</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileDrawerTab('menu')}
              className={`rounded-lg py-1.5 text-center text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                mobileDrawerTab === 'menu'
                  ? 'bg-white text-gray-950 shadow-xs border border-gray-200/80'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <span>🧭</span>
              <span>Navigation</span>
            </button>
          </div>

          {/* Drawer Body Area */}
          <div className="p-3.5 overflow-y-auto space-y-3 flex-1 text-xs">

            {/* TAB 1: CATEGORIES & COLLECTIONS */}
            {mobileDrawerTab === 'categories' && (
              <div className="space-y-3 animate-fade-in">
                {/* Search in categories */}
                <div className="relative">
                  <input
                    type="text"
                    value={categorySearchTerm}
                    onChange={(e) => setCategorySearchTerm(e.target.value)}
                    placeholder="Filter collections..."
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] py-1.5 pl-8 pr-3 text-xs text-gray-900 outline-none"
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <SearchIcon className="w-3 h-3" />
                  </span>
                  {categorySearchTerm && (
                    <button
                      type="button"
                      onClick={() => setCategorySearchTerm('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs hover:text-black"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Explore Full Catalog Banner Card */}
                <button
                  type="button"
                  onClick={() => handleQuickCategorySelect('All')}
                  className="w-full flex items-center justify-between rounded-xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] p-3 text-white shadow-md transition hover:scale-[1.01] cursor-pointer text-left"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                      Complete Catalog
                    </span>
                    <h4 className="text-xs font-bold text-white mt-0.5">Explore All {allCategories.length} Collections</h4>
                  </div>
                  <span className="text-sm text-amber-300 font-bold">&rarr;</span>
                </button>

                {/* 2-Column Categories Grid */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      All Departments ({filteredCategoriesList.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {filteredCategoriesList.map((cat) => {
                      const icon = CATEGORY_ICONS[cat] || '✨';
                      const isActive = currentCategory === cat;

                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleQuickCategorySelect(cat)}
                          className={`flex items-center justify-between rounded-xl p-2.5 text-left font-medium transition cursor-pointer ${
                            isActive
                              ? 'bg-gray-950 text-white font-bold shadow-xs'
                              : 'bg-[#F4F4F6] hover:bg-gray-200 text-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm shrink-0">{icon}</span>
                            <span className="truncate text-[11px] font-semibold">{cat}</span>
                          </div>
                          <span className={`text-[10px] ${isActive ? 'text-amber-300' : 'text-gray-400'}`}>&rarr;</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: QUICK FILTERS & BRANDS */}
            {mobileDrawerTab === 'filters' && (
              <div className="space-y-3.5 animate-fade-in">
                
                {/* Advanced Filter Modal Trigger Card */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setMobileFilterModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between rounded-xl bg-amber-50 border border-amber-200 p-3 text-amber-950 shadow-2xs hover:bg-amber-100 transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">⚡</span>
                    <div>
                      <h4 className="text-xs font-bold leading-tight">Advanced Filter Studio</h4>
                      <p className="text-[10px] text-amber-800 mt-0.5">Filter by brand, price range & sort</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
                    Open &rarr;
                  </span>
                </button>

                {/* Popular Luxury Brands */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
                    Filter by Top Luxury Brands
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {POPULAR_BRANDS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => handleQuickBrandSelect(b)}
                        className={`rounded-xl py-2 px-1 text-center text-[11px] font-semibold transition cursor-pointer truncate ${
                          currentBrand === b
                            ? 'bg-gray-950 text-white shadow-xs'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Presets */}
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
                    Filter by Price Tier
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PRICE_PRESETS.slice(1).map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          const params = new URLSearchParams();
                          if (p.min > 0) params.set('minPrice', p.min);
                          if (p.max < 250000) params.set('maxPrice', p.max);
                          navigate(`/shop?${params.toString()}`);
                          setMobileMenuOpen(false);
                        }}
                        className="rounded-xl bg-[#F4F4F6] hover:bg-gray-200 p-2 text-left text-[11px] font-medium text-gray-800 transition cursor-pointer"
                      >
                        <span className="font-bold text-gray-950 block">{p.label}</span>
                        <span className="text-[9.5px] text-gray-500">Quick filter</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: NAVIGATION & PORTALS */}
            {mobileDrawerTab === 'menu' && (
              <div className="space-y-2.5 animate-fade-in">
                <div className="grid grid-cols-2 gap-1.5 font-semibold text-xs">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl bg-gray-100 p-2.5 text-gray-900 hover:bg-gray-200"
                  >
                    <span>🏠</span>
                    <span>Home Page</span>
                  </Link>

                  <Link
                    to="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl bg-gray-100 p-2.5 text-gray-900 hover:bg-gray-200"
                  >
                    <span>🛍️</span>
                    <span>Shop Catalog</span>
                  </Link>

                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl bg-gray-100 p-2.5 text-gray-900 hover:bg-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <span>🛍️</span>
                      <span>Bag</span>
                    </div>
                    <span className="rounded-full bg-gray-900 px-1.5 py-0.2 text-[9px] font-bold text-white">
                      {cartCount}
                    </span>
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl bg-gray-100 p-2.5 text-gray-900 hover:bg-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-rose-500">♥</span>
                      <span>Wishlist</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="rounded-full bg-rose-600 px-1.5 py-0.2 text-[9px] font-bold text-white">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl bg-gray-100 p-2.5 text-gray-900 hover:bg-gray-200"
                  >
                    <span>ℹ️</span>
                    <span>About Us</span>
                  </Link>

                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl bg-gray-100 p-2.5 text-gray-900 hover:bg-gray-200"
                  >
                    <span>📞</span>
                    <span>Contact Us</span>
                  </Link>
                </div>

                {/* Portals Section */}
                <div className="pt-2 border-t border-gray-100 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">
                    Staff & Partner Portals
                  </span>

                  {currentUser && currentUser.role === 'admin' ? (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl p-2.5 font-bold text-amber-950 bg-amber-50 border border-amber-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span>⚙️</span>
                        <span>Admin Console</span>
                      </div>
                      <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-full uppercase">Active</span>
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      state={{ requiredRole: 'admin', from: '/admin', message: 'Enter Administrator ID & Password.' }}
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl p-2.5 font-semibold text-gray-800 bg-gray-50 hover:bg-amber-50 hover:text-amber-950 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span>🔑</span>
                        <span>Admin / Staff Login</span>
                      </div>
                      <span className="text-gray-400">&rarr;</span>
                    </Link>
                  )}

                  {currentUser && currentUser.role === 'supplier' ? (
                    <Link
                      to="/supplier"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl p-2.5 font-bold text-blue-700 bg-blue-50 border border-blue-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span>🏢</span>
                        <span>Vendor Partner Portal</span>
                      </div>
                      <span className="text-[9px] bg-blue-200 text-blue-900 px-1.5 py-0.5 rounded-full uppercase">Active</span>
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      state={{ requiredRole: 'supplier', from: '/supplier', message: 'Enter Supplier ID & Password.' }}
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl p-2.5 font-semibold text-gray-800 bg-gray-50 hover:bg-blue-50 hover:text-blue-950 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span>🏢</span>
                        <span>Vendor Partner Portal</span>
                      </div>
                      <span className="text-gray-400">&rarr;</span>
                    </Link>
                  )}
                </div>

                {/* Account / Authentication */}
                <div className="pt-2 border-t border-gray-100">
                  {currentUser ? (
                    <div className="space-y-1.5">
                      <div className="grid grid-cols-2 gap-1.5">
                        <Link
                          to="/account"
                          onClick={() => setMobileMenuOpen(false)}
                          className="rounded-xl bg-gray-100 py-2 text-center text-xs font-bold text-gray-900"
                        >
                          👤 Account
                        </Link>
                        <Link
                          to="/account?tab=tracking"
                          onClick={() => setMobileMenuOpen(false)}
                          className="rounded-xl bg-gray-100 py-2 text-center text-xs font-bold text-gray-900"
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
                        className="w-full rounded-xl border border-rose-200 bg-rose-50 py-1.5 text-center text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full rounded-xl bg-[#0F172A] py-2.5 text-center text-xs font-bold text-amber-300 hover:bg-black uppercase tracking-wider"
                    >
                      Sign In to Account
                    </Link>
                  )}
                </div>

                {/* Boutique Direct Info & Social Contacts */}
                <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 space-y-1.5">
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
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </header>
  );
}