// src/pages/Home.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  siAdidas,
  siApple,
  siBose,
  siDell,
  siGarmin,
  siNike,
  siPuma,
  siRazer,
  siSamsung,
  siSony,
  siZara
} from 'simple-icons';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Reveal, AnimatedCounter } from '../components/useScrollReveal';
import HomeDiscoveryStrip from '../components/HomeDiscoveryStrip';
import ShopByCategorySection from '../components/ShopByCategorySection';
import FeaturedTrendingSection from '../components/FeaturedTrendingSection';
import ProductsByPriceSection from '../components/ProductsByPriceSection';
import CustomerReviewsSection from '../components/CustomerReviewsSection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import InstagramClubSection from '../components/InstagramClubSection';
import { getProducts, getCategories } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TagIcon,
  CheckIcon
} from '../components/Icons';

// ============================================================
// DEFAULT CATEGORY BANNERS (11 STORE CATEGORIES)
// ============================================================
const defaultCategoryBanners = [
  {
    name: 'Watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
    description: 'Heritage Swiss & Smart Chronographs'
  },
  {
    name: 'Bags & Wallets',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80',
    description: 'Genuine Leather & Urban Backpacks'
  },
  {
    name: 'Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80',
    description: 'Handcrafted Sneakers & Footwear'
  },
  {
    name: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80',
    description: 'Flagship Titanium Handsets & Gear'
  },
  {
    name: 'Clothes & Fashion',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
    description: 'Tailored Suits, Denim & Luxury Apparel'
  },
  {
    name: 'Laptops',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=80',
    description: 'High-Performance OLED Workstations'
  },
  {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    description: 'Audiophile Noise-Cancelling Sound'
  },
  {
    name: 'Smart Gadgets',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=80',
    description: 'Smart Rings, AI Devices & Wearables'
  },
  {
    name: 'Gaming',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500&auto=format&fit=crop&q=80',
    description: 'RGB Mechanical Gear & Consoles'
  },
  {
    name: 'Fitness',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&auto=format&fit=crop&q=80',
    description: 'GPS Multi-Sport Trackers & Health'
  },
  {
    name: 'Fashion Accessories',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=80',
    description: 'Polarized Eyewear & Belts'
  }
];

// ============================================================
// WATCH HERO SLIDES
// ============================================================
const watchHeroSlides = [
  {
    tag: 'NEW COLLECTION 2026',
    titleLine1: 'PRECISION.',
    titleLine2: 'CRAFTED FOR TIME.',
    description: 'Where timeless Swiss horology meets modern prestige performance.',
    image: 'https://i.pinimg.com/736x/80/4d/7c/804d7c5ba3d69a866d1303f94299d564.jpg',
    category: 'Watches'
  },
  {
    tag: 'LIMITED BESPOKE EDITION',
    titleLine1: 'HERITAGE.',
    titleLine2: 'CHRONOGRAPH LUXE.',
    description: 'Engineered for absolute accuracy, ceramic durability, and distinguished style.',
    image: 'https://i.pinimg.com/736x/e6/df/98/e6df982c03d41dbf66fe9470007838c2.jpg',
    category: 'Watches'
  },
  {
    tag: 'AUTOMATIC MASTERPIECES',
    titleLine1: 'TIMELESS.',
    titleLine2: 'SAPPHIRE LUXURY.',
    description: 'Crafted with genuine sapphire crystal, mechanical movements, and calfskin straps.',
    image: 'https://i.pinimg.com/736x/52/cc/2a/52cc2a9343298c070a2e66503a60b5cc.jpg',
    category: 'Watches'
  }
];

// ============================================================
// CONTINUOUS SCROLLING TICKER ITEMS (STORE OFFERS & HIGHLIGHTS)
// ============================================================
const storeTickerItems = [
  {
    badge: 'SPECIAL OFFER',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    title: 'FLAT 10% OFF SITEWIDE',
    subtitle: 'Use Code: KRISHNA10 on orders above ₹1,000',
    code: 'KRISHNA10',
    isOffer: true
  },
  {
    badge: 'FREE DELIVERY',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    title: 'INSURED EXPRESS SHIPPING',
    subtitle: 'Free across India on prepaid orders above ₹2,000',
    isOffer: true
  },
  {
    badge: 'FESTIVE SALE',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    title: 'UP TO 40% OFF LUXURY CATALOG',
    subtitle: 'Watches • Sunglasses • Premium Audio • Leather',
    isOffer: true
  },
  {
    badge: 'BUY 2 SAVE MORE',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    title: 'EXTRA 5% COMBO SAVINGS',
    subtitle: 'Auto-applied at checkout on 2+ items',
    isOffer: true
  },
  {
    badge: '100% AUTHENTIC',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    title: 'OFFICIAL BRAND WARRANTY',
    subtitle: 'Titan • Casio • Fossil • Seiko • Apple • Sony',
    isOffer: false
  },
  {
    badge: 'PEACE OF MIND',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    title: '7-DAY HASSLE-FREE RETURNS',
    subtitle: '100% Client satisfaction guarantee',
    isOffer: false
  },
  {
    badge: 'LEATHER LUXE',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    title: 'HANDCRAFTED LEATHER GOODS',
    subtitle: 'Hidesign • Wildcraft • Tommy Hilfiger',
    isOffer: false
  },
  {
    badge: 'FLAGSHIP STORE',
    badgeColor: 'bg-neutral-500/20 text-neutral-300 border-neutral-500/40',
    title: 'MUMBAI SANCTUARY',
    subtitle: 'Visit Heera Panna Shopping Center, Haji Ali',
    isOffer: false
  }
];

// ============================================================
// PARTNER BRANDS WITH CLEAN VECTOR LOGOS
// ============================================================
const brandRow1 = [
  {
    name: 'Titan',
    cat: 'Watches',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <svg viewBox="0 0 32 32" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-950 fill-current">
          <path d="M5 8h22v4h-8.5v16h-5V12H5V8z M16 1.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
        </svg>
        <span className="font-sans font-bold text-xs sm:text-sm md:text-[15px] tracking-[0.2em] text-gray-950">TITAN</span>
      </div>
    )
  },
  {
    name: 'Rolex',
    cat: 'Watches',
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center">
        <svg viewBox="0 0 24 14" className="h-4 sm:h-5 w-6 sm:w-7 text-[#006039] fill-current">
          <path d="M12 1l2.2 4.5 3.8-3 1.5 5.5-3.5 1.5 4.5 3H3.5l4.5-3-3.5-1.5 1.5-5.5 3.8 3L12 1zm-5 11.5h10V14H7v-1.5z" />
        </svg>
        <span className="font-serif font-bold text-[10px] sm:text-xs tracking-[0.25em] text-[#006039] leading-tight mt-0.5">ROLEX</span>
      </div>
    )
  },
  {
    name: 'Fossil',
    cat: 'Watches',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-[#3D2314] text-white font-sans font-black text-[10px] sm:text-xs shadow-2xs">F</span>
        <span className="font-sans font-black text-xs sm:text-sm md:text-[15px] tracking-[0.16em] text-gray-950">FOSSIL</span>
      </div>
    )
  },
  {
    name: 'Casio',
    cat: 'Watches',
    renderLogo: () => (
      <span className="font-sans font-black text-sm sm:text-base md:text-lg tracking-[0.12em] text-[#003B95]">CASIO</span>
    )
  },
  {
    name: 'Nike',
    cat: 'Shoes',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-8 sm:w-10 fill-current text-gray-950">
          <path d={siNike.path} />
        </svg>
        <span className="font-sans font-black text-xs sm:text-sm md:text-[15px] tracking-[0.15em] text-gray-950 italic hidden sm:inline">NIKE</span>
      </div>
    )
  },
  {
    name: 'Adidas',
    cat: 'Shoes',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-6 sm:w-7 fill-current text-gray-950">
          <path d={siAdidas.path} />
        </svg>
        <span className="font-sans font-bold text-xs sm:text-sm md:text-[14px] tracking-wide text-gray-950">adidas</span>
      </div>
    )
  },
  {
    name: 'Apple',
    cat: 'Mobiles',
    renderLogo: () => (
      <div className="flex items-center gap-1 sm:gap-1.5">
        <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-5 sm:w-6 fill-current text-gray-950">
          <path d={siApple.path} />
        </svg>
        <span className="font-sans font-semibold text-xs sm:text-sm md:text-[15px] tracking-tight text-gray-950">Apple</span>
      </div>
    )
  },
  {
    name: 'Samsung',
    cat: 'Mobiles',
    renderLogo: () => (
      <span className="font-sans font-black text-xs sm:text-sm md:text-[15px] tracking-[0.2em] text-[#034EA2]">SAMSUNG</span>
    )
  }
];

const brandRow2 = [
  {
    name: 'Puma',
    cat: 'Shoes',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-6 sm:w-7 fill-current text-[#111827]">
          <path d={siPuma.path} />
        </svg>
        <span className="font-sans font-black text-xs sm:text-sm md:text-[14px] tracking-[0.16em] text-[#111827]">PUMA</span>
      </div>
    )
  },
  {
    name: 'Sony',
    cat: 'Electronics',
    renderLogo: () => (
      <span className="font-serif font-black text-sm sm:text-base md:text-lg tracking-[0.22em] text-gray-950">SONY</span>
    )
  },
  {
    name: 'Bose',
    cat: 'Electronics',
    renderLogo: () => (
      <span className="font-serif italic font-black text-sm sm:text-base md:text-lg tracking-[0.16em] text-gray-950">BOSE</span>
    )
  },
  {
    name: 'Dell',
    cat: 'Laptops',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-5 sm:w-6 fill-current text-[#0076CE]">
          <path d={siDell.path} />
        </svg>
        <span className="font-sans font-bold text-xs sm:text-sm md:text-[14px] tracking-[0.14em] text-[#0076CE]">DELL</span>
      </div>
    )
  },
  {
    name: 'Zara',
    cat: 'Clothes & Fashion',
    renderLogo: () => (
      <span className="font-serif font-black text-sm sm:text-base md:text-lg tracking-[0.28em] text-gray-950">ZARA</span>
    )
  },
  {
    name: 'Hidesign',
    cat: 'Bags & Wallets',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <span className="text-amber-800 text-xs sm:text-sm">🦌</span>
        <span className="font-serif font-bold text-xs sm:text-xs md:text-sm tracking-[0.2em] text-gray-900">HIDESIGN</span>
      </div>
    )
  },
  {
    name: 'Ray-Ban',
    cat: 'Fashion Accessories',
    renderLogo: () => (
      <span className="font-serif italic font-black text-sm sm:text-base md:text-lg text-[#E31837] tracking-tight">Ray•Ban</span>
    )
  },
  {
    name: 'Razer',
    cat: 'Gaming',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-5 sm:w-6 fill-current text-[#00E700]">
          <path d={siRazer.path} />
        </svg>
        <span className="font-sans font-black text-xs sm:text-xs md:text-sm tracking-[0.18em] text-gray-900">RAZER</span>
      </div>
    )
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(() => getProducts());
  const [toastMessage, setToastMessage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Category List with dynamically synced categories
  const [categoryList, setCategoryList] = useState(() => {
    const storedCats = getCategories();
    const bannerNames = new Set(defaultCategoryBanners.map((b) => b.name.toLowerCase()));
    const customBanners = storedCats
      .filter((cat) => !bannerNames.has(cat.toLowerCase()))
      .map((cat) => ({
        name: cat,
        description: `Explore ${cat} Collection`,
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900',
        tag: 'Curated Essentials'
      }));
    return [...defaultCategoryBanners, ...customBanners];
  });

  // Hero auto-slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % watchHeroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Update listener
  useEffect(() => {
    const handleUpdate = () => {
      setProducts(getProducts());
      const storedCats = getCategories();
      const bannerNames = new Set(defaultCategoryBanners.map((b) => b.name.toLowerCase()));
      const customBanners = storedCats
        .filter((cat) => !bannerNames.has(cat.toLowerCase()))
        .map((cat) => ({
          name: cat,
          description: `Explore ${cat} Collection`,
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900',
          tag: 'Curated Essentials'
        }));
      setCategoryList([...defaultCategoryBanners, ...customBanners]);
    };

    window.addEventListener('productsUpdated', handleUpdate);
    window.addEventListener('categoriesUpdated', handleUpdate);
    return () => {
      window.removeEventListener('productsUpdated', handleUpdate);
      window.removeEventListener('categoriesUpdated', handleUpdate);
    };
  }, []);

  // Top Picks For You (Best Sellers) - Sorted by rating and popularity
  const bestSellers = useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      const scoreB = (Number(b.rating) || 4.5) * 100 + (Number(b.reviews) || 10);
      const scoreA = (Number(a.rating) || 4.5) * 100 + (Number(a.reviews) || 10);
      return scoreB - scoreA;
    });
    return sorted.slice(0, 4);
  }, [products]);

  // Check Out What's New (New Arrivals) - Fresh novelties from catalog
  const newArrivals = useMemo(() => {
    const bestSellerIds = new Set(bestSellers.map((p) => p.id));
    const sortedNew = [...products]
      .filter((p) => !bestSellerIds.has(p.id))
      .sort((a, b) => (b.id || 0) - (a.id || 0));

    if (sortedNew.length >= 4) {
      return sortedNew.slice(0, 4);
    }
    return [...products].slice(0, 4);
  }, [products, bestSellers]);

  const getProductCountForCategory = (catName) => {
    return products.filter((p) => p.category?.toLowerCase() === catName.toLowerCase()).length;
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setToastMessage(`✓ Added "${product.name}" to your bag`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleCopyCode = (code, e) => {
    if (e) e.stopPropagation();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code);
    } else {
      const input = document.createElement('input');
      input.value = code;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setToastMessage(`🎉 Coupon code "${code}" copied to clipboard!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleBuyNow = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip selection:bg-neutral-900 selection:text-white">
      <Navbar />

      {/* Floating Alert Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-md px-4 py-3 text-xs font-semibold text-gray-900 shadow-2xl animate-slide-up max-w-[calc(100vw-32px)]">
          <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">✓</span>
          <span className="truncate">{toastMessage}</span>
          <Link
            to="/cart"
            className="ml-2 rounded-full bg-[#111827] px-3 py-1 text-[11px] font-bold text-white hover:bg-black transition shrink-0 shadow-xs"
          >
            View Bag
          </Link>
        </div>
      )}

      {/* =========================================================
          1. LUXURY WATCH HERO SLIDER SECTION
      ========================================================= */}
      <section className="relative w-full overflow-hidden bg-[#070808] text-white border-b border-neutral-800 lg:h-[700px] lg:min-h-[700px]">
        <div className="absolute inset-0">
          {watchHeroSlides.map((slide, index) => (
            <div
              key={slide.titleLine1}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
              <div className="absolute inset-0 lg:left-auto lg:right-0 lg:w-[58%] xl:w-[52%] 2xl:w-[48%] h-full w-full">
                <img
                  src={slide.image}
                  alt={slide.titleLine1}
                  className="h-full w-full object-cover object-[72%_center] sm:object-[68%_center] lg:object-center scale-[1.02] lg:scale-100 transition-transform duration-10000 ease-out"
                />
                <div className="hidden lg:block absolute inset-y-0 left-0 w-48 xl:w-64 bg-gradient-to-r from-[#070808] to-transparent pointer-events-none" />
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10 lg:from-[#070808] lg:via-[#070808]/90 lg:via-48% lg:to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/95 via-black/40 to-transparent lg:from-[#070808] lg:via-[#070808]/70 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,transparent_0%,rgba(0,0,0,0.1)_45%,rgba(0,0,0,0.4)_100%)] lg:bg-[radial-gradient(ellipse_at_75%_50%,transparent_30%,rgba(7,8,8,0.4)_75%,#070808_100%)] pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="relative z-20 mx-auto max-w-7xl w-full min-h-[580px] sm:min-h-[620px] lg:min-h-[700px] lg:h-full px-5 sm:px-8 lg:px-10 pt-16 sm:pt-20 lg:pt-0 pb-8 lg:pb-8 flex flex-col justify-between">
          <div className="max-w-[620px] lg:my-auto lg:py-8" key={`hero-slide-${currentSlide}`}>
            <Reveal direction="down" delay={60}>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-[#C5A880]" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#D5C2A5]">
                  {watchHeroSlides[currentSlide].tag}
                </span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={130}>
              <h1 className="text-[42px] leading-[1.02] tracking-[-0.03em] font-extrabold sm:text-5xl lg:text-[68px] xl:text-[76px]">
                <span className="block text-white">{watchHeroSlides[currentSlide].titleLine1}</span>
                <span className="block mt-1 font-light text-[#C9AB80]">{watchHeroSlides[currentSlide].titleLine2}</span>
              </h1>
            </Reveal>

            <Reveal direction="up" delay={200}>
              <p className="mt-5 text-sm sm:text-base text-[#B0B2B8] max-w-md font-light leading-relaxed">
                {watchHeroSlides[currentSlide].description}
              </p>
            </Reveal>

            <Reveal direction="up" delay={280}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/shop?category=Watches"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs sm:text-sm font-bold tracking-wider uppercase text-black transition-all duration-300 hover:bg-[#E5D7C5] hover:shadow-[0_8px_25px_rgba(255,255,255,0.2)] active:scale-95"
                >
                  <span>Shop Watches</span>
                  <ArrowRightIcon className="w-4 h-4 text-black" />
                </Link>

                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-black/40 backdrop-blur-md px-6 py-3.5 text-xs sm:text-sm font-bold tracking-wider uppercase text-white transition-all duration-300 hover:border-neutral-400 hover:bg-black/70 active:scale-95"
                >
                  <span>All Collections</span>
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal direction="up" delay={340}>
            <div className="flex items-center justify-between border-t border-neutral-800/80 pt-4">
              <div className="flex items-center gap-2">
                {watchHeroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${i === currentSlide ? 'w-8 bg-[#C5A880]' : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                      }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <span className="text-[11px] font-mono font-medium text-neutral-400 tracking-wider">
                0{currentSlide + 1} / 0{watchHeroSlides.length}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================
          2. CONTINUOUS SCROLLING SPECIAL OFFERS & TRUST TICKER RIBBON (FULL WIDTH)
      ========================================================= */}
      <Reveal direction="up" delay={50}>
        <div className="w-full relative bg-[#080B11] text-white border-y border-[#C5A880]/35 py-3 sm:py-3.5 overflow-hidden select-none shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#080B11] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#080B11] to-transparent z-10" />

          <div className="animate-marquee flex items-center gap-6 sm:gap-8">
            {[...storeTickerItems, ...storeTickerItems].map((item, idx) => (
              <div
                key={idx}
                onClick={() => item.code && handleCopyCode(item.code)}
                className={`inline-flex items-center gap-2.5 sm:gap-3.5 shrink-0 transition-opacity duration-200 ${item.code ? 'cursor-pointer hover:opacity-90' : ''}`}
              >
                <span className="text-amber-400 text-xs">✦</span>
                
                {/* Offer / Category Badge */}
                {item.badge && (
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider border shadow-xs ${item.badgeColor || 'bg-amber-400/15 text-amber-300 border-amber-400/30'}`}>
                    {item.isOffer && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-300"></span>
                      </span>
                    )}
                    {item.badge}
                  </span>
                )}

                {/* Title */}
                <span className="font-bold text-[11px] sm:text-xs uppercase tracking-[0.18em] text-neutral-100">
                  {item.title}
                </span>

                {/* Subtitle */}
                <span className="text-[10.5px] sm:text-[11px] font-normal text-amber-100/75 tracking-wide">
                  ({item.subtitle})
                </span>

                {/* Clickable Code Tag */}
                {item.code && (
                  <button
                    type="button"
                    onClick={(e) => handleCopyCode(item.code, e)}
                    title="Click to copy coupon code"
                    className="inline-flex items-center gap-1.5 rounded-md bg-amber-400/15 hover:bg-amber-400/25 px-2 py-0.5 text-[9.5px] sm:text-[10.5px] font-mono font-bold text-amber-300 border border-amber-400/40 transition active:scale-95 cursor-pointer shadow-xs"
                  >
                    <span>CODE: {item.code}</span>
                    <span className="text-[10px]">📋</span>
                  </button>
                )}

                <span className="h-1 w-1 rounded-full bg-neutral-600 ml-1.5" />
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* =========================================================
          3. SERVICE & ASSURANCE STRIP (FREE SHIPPING, EASY RETURNS, SECURE PAYMENT, CONCIERGE)
      ========================================================= */}
      <HomeDiscoveryStrip />

      {/* =========================================================
          4. SHOP BY CATEGORY (CURATED CAROUSEL WITH ALL CATEGORIES BUTTON)
      ========================================================= */}
      <ShopByCategorySection
        categories={categoryList}
        getProductCount={getProductCountForCategory}
      />

      {/* =========================================================
          4. FEATURED / TRENDING PRODUCTS SECTION (TABBED CATALOG)
      ========================================================= */}
      <FeaturedTrendingSection
        products={products}
        onToast={setToastMessage}
      />

      {/* =========================================================
          5. TOP PICKS FOR YOU — BEST SELLERS
      ========================================================= */}
      <section className="bg-white pt-8 sm:pt-12 pb-10 sm:pb-14 border-t border-gray-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <Reveal direction="up" delay={50}>
            <div className="text-center mb-7 sm:mb-9">
              <p className="text-[10.5px] sm:text-xs font-bold uppercase tracking-[0.28em] text-neutral-400">
                TOP PICKS FOR YOU
              </p>
              <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2">
                <span className="h-px w-10 sm:w-16 bg-neutral-300" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-950">
                  Best Sellers
                </h2>
                <span className="h-px w-10 sm:w-16 bg-neutral-300" />
              </div>
              <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
                Client favorites across timepieces, designer sunglasses, and premium audio.
              </p>
            </div>
          </Reveal>

          {/* 4 Cards Grid */}
          {bestSellers.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
              {bestSellers.map((product, idx) => (
                <Reveal key={`bestseller-${product.id}`} direction="up" delay={idx * 80} duration={650}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    showRating={true}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl bg-gray-50 border border-gray-200/80">
              <p className="text-sm font-semibold text-gray-700">No products found.</p>
            </div>
          )}

        </div>
      </section>

      {/* =========================================================
          6. PRODUCTS BY PRICE (CURATED BUDGET TIERS)
      ========================================================= */}
      <ProductsByPriceSection
        products={products}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* =========================================================
          7. CHECK OUT WHAT'S NEW — NEW ARRIVALS
      ========================================================= */}
      <section className="bg-[#FAFAFB] pt-8 sm:pt-12 pb-10 sm:pb-14 border-t border-gray-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <Reveal direction="up" delay={50}>
            <div className="text-center mb-7 sm:mb-9">
              <p className="text-[10.5px] sm:text-xs font-bold uppercase tracking-[0.28em] text-neutral-400">
                CHECK OUT WHAT&apos;S NEW
              </p>
              <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2">
                <span className="h-px w-10 sm:w-16 bg-neutral-300" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-950">
                  New Arrivals
                </h2>
                <span className="h-px w-10 sm:w-16 bg-neutral-300" />
              </div>
              <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
                Fresh seasonal releases, novelties, and smart devices straight to catalog.
              </p>
            </div>
          </Reveal>

          {/* 4 Cards Grid */}
          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
              {newArrivals.map((product, idx) => (
                <Reveal key={`newarrival-${product.id}`} direction="up" delay={idx * 80} duration={650}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    showRating={true}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl bg-gray-50 border border-gray-200/80">
              <p className="text-sm font-semibold text-gray-700">No new arrivals found.</p>
            </div>
          )}

        </div>
      </section>

      {/* =========================================================
          7. OFFICIAL BRAND PARTNERS (LUXURY BRAND HOUSES SHOWCASE)
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:pt-10 pb-4 sm:pb-6 lg:px-8">
        <Reveal direction="up" delay={50}>
          <div className="text-center mb-8 sm:mb-10">
           
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-950 mt-1">
              Explore by Brand
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto leading-relaxed">
              Discover certified authentic luxury collections direct from authorized heritage houses &amp; global makers.
            </p>
          </div>
        </Reveal>

        {/* Unified Luxury Brand Showcase Box */}
        <Reveal direction="up" delay={120}>
          <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-gradient-to-b from-white via-[#F8F9FA] to-[#EFF2F6] p-4 sm:p-7 md:p-8 border border-gray-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.03)]">
            
            {/* Subtle Ambient Gold Glow */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#C5A880]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

            {/* Left & Right Gradient Mask Overlays */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10 rounded-l-[28px] sm:rounded-l-[36px]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10 rounded-r-[28px] sm:rounded-r-[36px]" />

            <div className="space-y-3.5 sm:space-y-4">
              {/* Track 1 (Row 1 Brands - Scrolling Left) */}
              <div className="animate-marquee flex items-center gap-3 sm:gap-4 py-1">
                {[...brandRow1, ...brandRow1, ...brandRow1, ...brandRow1].map((b, idx) => (
                  <Link
                    key={`${b.name}-t1-${idx}`}
                    to={`/shop?category=${encodeURIComponent(b.cat)}&brand=${encodeURIComponent(b.name)}`}
                    className="group relative flex-shrink-0 flex flex-col items-center justify-center w-[165px] sm:w-[195px] md:w-[215px] h-20 sm:h-24 px-5 py-3 rounded-[20px] sm:rounded-[22px] border border-gray-200/90 bg-white/95 backdrop-blur-xs shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-amber-400 hover:shadow-[0_12px_28px_rgba(197,168,128,0.18)] hover:-translate-y-1 active:scale-98"
                    title={`${b.name} • ${b.cat}`}
                  >
                    <div className="transition-transform duration-300 group-hover:scale-108 flex items-center justify-center h-8">
                      {b.renderLogo()}
                    </div>
                    <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400 group-hover:text-[#9E8362] transition-colors mt-1">
                      {b.cat}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Track 2 (Row 2 Brands - Scrolling Right / Reverse) */}
              <div className="animate-marquee-reverse flex items-center gap-3 sm:gap-4 py-1">
                {[...brandRow2, ...brandRow2, ...brandRow2, ...brandRow2].map((b, idx) => (
                  <Link
                    key={`${b.name}-t2-${idx}`}
                    to={`/shop?category=${encodeURIComponent(b.cat)}&brand=${encodeURIComponent(b.name)}`}
                    className="group relative flex-shrink-0 flex flex-col items-center justify-center w-[165px] sm:w-[195px] md:w-[215px] h-20 sm:h-24 px-5 py-3 rounded-[20px] sm:rounded-[22px] border border-gray-200/90 bg-white/95 backdrop-blur-xs shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-amber-400 hover:shadow-[0_12px_28px_rgba(197,168,128,0.18)] hover:-translate-y-1 active:scale-98"
                    title={`${b.name} • ${b.cat}`}
                  >
                    <div className="transition-transform duration-300 group-hover:scale-108 flex items-center justify-center h-8">
                      {b.renderLogo()}
                    </div>
                    <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400 group-hover:text-[#9E8362] transition-colors mt-1">
                      {b.cat}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </Reveal>
      </section>

      {/* =========================================================
          11. WHY CHOOSE US (THE DIFFERENCE)
      ========================================================= */}
      <WhyChooseUsSection />

      {/* =========================================================
          12. CUSTOMER REVIEWS (CAROUSEL)
      ========================================================= */}
      <CustomerReviewsSection />

      {/* =========================================================
          13. INSTAGRAM LIFESTYLE COMMUNITY & VIP PRIVÉ CLUB
      ========================================================= */}
      <InstagramClubSection />

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <Footer />
    </div>
  );
}