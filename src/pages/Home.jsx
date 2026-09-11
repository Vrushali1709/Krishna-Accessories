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
import HomeDiscoveryStrip from '../components/HomeDiscoveryStrip';
import ShopByCategorySection from '../components/ShopByCategorySection';
import CustomerReviewsSection from '../components/CustomerReviewsSection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import { getProducts, getCategories } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '../components/Icons';

// ============================================================
// DEFAULT CATEGORY BANNERS (MATCHING REFERENCE SHOWCASE)
// ============================================================
const defaultCategoryBanners = [
  {
    name: 'Backpacks',
    targetCategory: 'Bags & Wallets',
    itemCount: '120+ Items',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80',
    description: 'Urban Backpacks & Travel Bags'
  },
  {
    name: 'Headphones',
    targetCategory: 'Electronics',
    itemCount: '150+ Items',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    description: 'Audiophile Noise-Cancelling Sound'
  },
  {
    name: 'Watches',
    targetCategory: 'Watches',
    itemCount: '80+ Items',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
    description: 'Heritage Swiss & Smart Chronographs'
  },
  {
    name: 'Wallets',
    targetCategory: 'Bags & Wallets',
    itemCount: '90+ Items',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=80',
    description: 'Genuine Leather Wallets & Cardholders'
  },
  {
    name: 'Gaming',
    targetCategory: 'Gaming',
    itemCount: '110+ Items',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500&auto=format&fit=crop&q=80',
    description: 'RGB Mechanical Gear & Consoles'
  },
  {
    name: 'Sunglasses',
    targetCategory: 'Fashion Accessories',
    itemCount: '70+ Items',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=80',
    description: 'Polarized Eyewear & Shades'
  },
  {
    name: 'Travel',
    targetCategory: 'Bags & Wallets',
    itemCount: '60+ Items',
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=500&auto=format&fit=crop&q=80',
    description: 'Hard-Shell Suitcases & Travel Gear'
  },
  {
    name: 'Shoes',
    targetCategory: 'Shoes',
    itemCount: '95+ Items',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80',
    description: 'Handcrafted Sneakers & Footwear'
  },
  {
    name: 'Mobiles',
    targetCategory: 'Mobiles',
    itemCount: '45+ Items',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80',
    description: 'Flagship Titanium Handsets & Gear'
  },
  {
    name: 'Clothes & Fashion',
    targetCategory: 'Clothes & Fashion',
    itemCount: '130+ Items',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
    description: 'Tailored Suits & Luxury Apparel'
  },
  {
    name: 'Laptops',
    targetCategory: 'Laptops',
    itemCount: '35+ Items',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=80',
    description: 'High-Performance Workstations'
  }
];

// ============================================================
// WATCH HERO SLIDES
// ============================================================
const watchHeroSlides = [
  {
    tag: 'NEW COLLECTION',
    titleLine1: 'PRECISION.',
    titleLine2: 'CRAFTED FOR TIME.',
    description: 'Where timeless design meets modern performance.',
    image: 'https://i.pinimg.com/736x/80/4d/7c/804d7c5ba3d69a866d1303f94299d564.jpg'
  },
  {
    tag: 'LIMITED EDITION',
    titleLine1: 'HERITAGE.',
    titleLine2: 'SWISS CHRONOGRAPHS.',
    description: 'Engineered for absolute accuracy and prestige.',
    image: 'https://i.pinimg.com/736x/e6/df/98/e6df982c03d41dbf66fe9470007838c2.jpg'
  },
  {
    tag: 'AUTOMATIC SERIES',
    titleLine1: 'TIMELESS.',
    titleLine2: 'MASTERPIECE WATCHES.',
    description: 'Crafted with sapphire crystal and fine leather.',
    image: 'https://i.pinimg.com/736x/52/cc/2a/52cc2a9343298c070a2e66503a60b5cc.jpg'
  }
];

// ============================================================
// CONTINUOUS SCROLLING TICKER ITEMS (STORE HIGHLIGHTS)
// ============================================================
const storeTickerItems = [
  { title: "100% CERTIFIED AUTHENTIC", subtitle: "Official Brand Warranty" },
  { title: "DIRECT FACTORY SOURCING", subtitle: "Titan • Casio • Fossil • Seiko • Apple" },
  { title: "MUMBAI FLAGSHIP SANCTUARY", subtitle: "Heera Panna Shopping Center, Haji Ali" },
  { title: "INSURED EXPRESS LOGISTICS", subtitle: "BlueDart & Delhivery" },
  { title: "HANDCRAFTED LEATHER GOODS", subtitle: "Hidesign • Wildcraft • Tommy" },
  { title: "7-DAY REPLACEMENT GUARANTEE", subtitle: "100% Client Peace of Mind" },
  { title: "PREMIUM AUDIO & FLAGSHIP TECH", subtitle: "Sony • Bose • Samsung • boAt" },
  { title: "POLARIZED & LUXURY EYEWEAR", subtitle: "Ray-Ban • Police • Fastrack" },
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

  const handleBuyNow = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip select-none sm:select-auto">
      <Navbar />

      {/* Floating Alert Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-900 shadow-xl animate-slide-up max-w-[calc(100vw-32px)]">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">✓</span>
          <span className="truncate">{toastMessage}</span>
          <Link
            to="/cart"
            className="ml-1 rounded-full bg-[#111827] px-2.5 py-0.5 text-[10px] font-semibold text-white hover:bg-black transition shrink-0"
          >
            Bag
          </Link>
        </div>
      )}

      {/* ================= LUXURY WATCH HERO SECTION ================= */}
      <section className="relative w-full overflow-hidden bg-[#070808] text-white border-b border-neutral-800 lg:h-[670px] lg:min-h-[670px]">
        <div className="absolute inset-0">
          {watchHeroSlides.map((slide, index) => (
            <div
              key={slide.titleLine1}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
              <div className="absolute inset-0 lg:left-auto lg:right-0 lg:w-[56%] xl:w-[50%] 2xl:w-[46%] h-full w-full">
                <img
                  src={slide.image}
                  alt={slide.titleLine1}
                  className="h-full w-full object-cover object-[72%_center] sm:object-[68%_center] lg:object-center scale-[1.02] lg:scale-100"
                />
                <div className="hidden lg:block absolute inset-y-0 left-0 w-48 xl:w-64 bg-gradient-to-r from-[#070808] to-transparent pointer-events-none" />
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/10 lg:from-[#070808] lg:via-[#070808]/90 lg:via-45% lg:to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/90 via-black/30 to-transparent lg:from-[#070808] lg:via-[#070808]/60 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,transparent_0%,rgba(0,0,0,0.08)_45%,rgba(0,0,0,0.35)_100%)] lg:bg-[radial-gradient(ellipse_at_75%_50%,transparent_30%,rgba(7,8,8,0.4)_75%,#070808_100%)] pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="relative z-20 mx-auto max-w-7xl w-full min-h-[560px] sm:min-h-[590px] lg:min-h-[670px] lg:h-full px-5 sm:px-8 lg:px-10 pt-16 sm:pt-20 lg:pt-0 pb-8 lg:pb-6 flex flex-col justify-between">
          <div className="max-w-[620px] lg:my-auto lg:py-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#C5A880]" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#D5C2A5]">
                {watchHeroSlides[currentSlide].tag}
              </span>
            </div>

            <h1 className="text-[42px] leading-[1.02] tracking-[-0.03em] font-semibold sm:text-5xl lg:text-[68px] xl:text-[74px]">
              <span className="block text-white">{watchHeroSlides[currentSlide].titleLine1}</span>
              <span className="block mt-1 font-light text-[#C9AB80]">{watchHeroSlides[currentSlide].titleLine2}</span>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-[#B0B2B8] max-w-md font-light leading-relaxed">
              {watchHeroSlides[currentSlide].description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/shop?category=Watches"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-black transition hover:bg-[#E5D7C5]"
              >
                <span>Shop Watches</span>
                <ArrowRightIcon className="w-4 h-4 text-black" />
              </Link>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-black/40 backdrop-blur-md px-6 py-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-white transition hover:border-neutral-500 hover:bg-black/60"
              >
                <span>All Collections</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-neutral-800/80 pt-4">
            <div className="flex items-center gap-2">
              {watchHeroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 transition-all duration-300 rounded-full ${i === currentSlide ? 'w-8 bg-[#C5A880]' : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                    }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <span className="text-[11px] font-medium text-neutral-400 tracking-wider">
              0{currentSlide + 1} / 0{watchHeroSlides.length}
            </span>
          </div>
        </div>
      </section>

      {/* ================= CONTINUOUS TICKER LINE (INFINITE MARQUEE) ================= */}
      <div className="relative bg-[#07090E] text-white border-y border-neutral-800/90 py-3 sm:py-3.5 overflow-hidden select-none">
        {/* Left & Right subtle gradient masks for smooth fade edge */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-[#07090E] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-[#07090E] to-transparent z-10" />

        <div className="animate-marquee flex items-center gap-6 sm:gap-8">
          {[...storeTickerItems, ...storeTickerItems].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-3 sm:gap-4 shrink-0">
              <span className="text-amber-400 text-xs">✦</span>
              <span className="font-bold text-[11px] sm:text-xs uppercase tracking-[0.2em] text-neutral-100">
                {item.title}
              </span>
              <span className="hidden sm:inline-block text-[10.5px] font-normal text-amber-200/70 tracking-wider">
                ({item.subtitle})
              </span>
              <span className="h-1 w-1 rounded-full bg-neutral-600 ml-1" />
            </div>
          ))}
        </div>
      </div>

      <HomeDiscoveryStrip categories={categoryList} />



      {/* ================= SHOP BY CATEGORY SECTION ================= */}
      <ShopByCategorySection
        categories={categoryList}
        getProductCount={getProductCountForCategory}
      />

      {/* ================= PROMOTIONAL VOUCHER ================= */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pb-6">
        <div className="rounded-2xl bg-[#0F172A] text-white p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 shadow-sm border border-slate-800">
          <div className="flex items-center gap-3 w-full md:w-auto min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-base border border-white/10">
              🎁
            </div>
            <div className="min-w-0">
              <span className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-amber-300">Exclusive Privé</span>
              <h3 className="text-sm sm:text-base font-bold text-white leading-snug truncate">Save 10% Instant Discount &gt; ₹1,000</h3>
              <p className="text-[10px] sm:text-[10.5px] text-gray-400 truncate">
                Coupon code:{' '}
                <strong className="text-white font-mono bg-white/10 px-1 py-0.2 rounded border border-white/10">KRISHNA10</strong>
              </p>
            </div>
          </div>
          <Link
            to="/shop"
            className="w-full md:w-auto text-center rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-gray-950 hover:bg-gray-100 transition shrink-0 shadow-2xs"
          >
            Claim Offer →
          </Link>
        </div>
      </section>

      {/* =========================================================
          SECTION 1: TOP PICKS FOR YOU — BEST SELLERS ♡
      ========================================================= */}
      <section className="bg-white py-10 sm:py-14 border-t border-gray-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-neutral-600">
              TOP PICKS FOR YOU
            </p>
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-1.5">
              <span className="h-px w-10 sm:w-16 bg-neutral-300" />
              <h2 className="font-serif text-2xl sm:text-3xl md:text-[34px] font-normal text-neutral-900 flex items-center gap-2">
                <span>Best Sellers</span>
                <span className="text-xl sm:text-2xl font-light text-rose-500 leading-none">♡</span>
              </h2>
              <span className="h-px w-10 sm:w-16 bg-neutral-300" />
            </div>
          </div>

          {/* 4 Cards Grid */}
          {bestSellers.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
              {bestSellers.map((product) => (
                <ProductCard
                  key={`bestseller-${product.id}`}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  showRating={true}
                />
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
          SECTION 2: CHECK OUT WHAT'S NEW — NEW ARRIVALS
      ========================================================= */}
      <section className="bg-white py-10 sm:py-14 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-neutral-600">
              CHECK OUT WHAT&apos;S NEW
            </p>
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-1.5">
              <span className="h-px w-10 sm:w-16 bg-neutral-300" />
              <h2 className="font-serif text-2xl sm:text-3xl md:text-[34px] font-normal text-neutral-900">
                New Arrivals
              </h2>
              <span className="h-px w-10 sm:w-16 bg-neutral-300" />
            </div>
          </div>

          {/* 4 Cards Grid */}
          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
              {newArrivals.map((product) => (
                <ProductCard
                  key={`newarrival-${product.id}`}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  showRating={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl bg-gray-50 border border-gray-200/80">
              <p className="text-sm font-semibold text-gray-700">No new arrivals found.</p>
            </div>
          )}

        </div>
      </section>

      {/* ======================================================
          OFFICIAL BRAND PARTNERS - CAPSULE SHOWCASE (MATCHING USER REFERENCE UI)
      ====================================================== */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:pt-14 pb-4 sm:pb-6 lg:px-8">
        <div className="text-center mb-7 sm:mb-9">

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
            Explore by Brand
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
            Discover 100% certified authentic luxury pieces direct from authorized heritage houses and global makers.
          </p>
        </div>

        {/* Dual Capsule Infinite Scrolling Carousel Strips */}
        <div className="space-y-3 sm:space-y-3.5">

          {/* Track 1 (Row 1 Brands - Scrolling Left) */}
          <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-gray-200/90 bg-[#F9FAFB]/90 p-2 sm:p-2.5 sm:px-3 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            {/* Left & Right fade masks */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#F9FAFB] to-transparent z-10 rounded-l-[24px] sm:rounded-l-[32px]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#F9FAFB] to-transparent z-10 rounded-r-[24px] sm:rounded-r-[32px]" />

            <div className="animate-marquee flex items-center gap-2.5 sm:gap-3 py-0.5">
              {[...brandRow1, ...brandRow1, ...brandRow1, ...brandRow1].map((b, idx) => (
                <Link
                  key={`${b.name}-t1-${idx}`}
                  to={`/shop?category=${encodeURIComponent(b.cat)}&brand=${encodeURIComponent(b.name)}`}
                  className="group relative flex-shrink-0 flex items-center justify-center w-[140px] sm:w-[160px] md:w-[175px] h-15 sm:h-18 lg:h-19 px-4 rounded-xl sm:rounded-2xl border border-gray-200/80 bg-white shadow-2xs transition-all duration-200 hover:border-amber-400/90 hover:shadow-md hover:scale-[1.03] active:scale-98"
                  title={`${b.name} • ${b.cat}`}
                >
                  <div className="transition-transform duration-200 group-hover:scale-105">
                    {b.renderLogo()}
                  </div>
                </Link>
              ))}
            </div>
          </div>



          {/* Track 2 (Row 2 Brands - Scrolling Right / Reverse) */}
          <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-gray-200/90 bg-[#F9FAFB]/90 p-2 sm:p-2.5 sm:px-3 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            {/* Left & Right fade masks */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#F9FAFB] to-transparent z-10 rounded-l-[24px] sm:rounded-l-[32px]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#F9FAFB] to-transparent z-10 rounded-r-[24px] sm:rounded-r-[32px]" />

            <div className="animate-marquee-reverse flex items-center gap-2.5 sm:gap-3 py-0.5">
              {[...brandRow2, ...brandRow2, ...brandRow2, ...brandRow2].map((b, idx) => (
                <Link
                  key={`${b.name}-t2-${idx}`}
                  to={`/shop?category=${encodeURIComponent(b.cat)}&brand=${encodeURIComponent(b.name)}`}
                  className="group relative flex-shrink-0 flex items-center justify-center w-[140px] sm:w-[160px] md:w-[175px] h-15 sm:h-18 lg:h-19 px-4 rounded-xl sm:rounded-2xl border border-gray-200/80 bg-white shadow-2xs transition-all duration-200 hover:border-amber-400/90 hover:shadow-md hover:scale-[1.03] active:scale-98"
                  title={`${b.name} • ${b.cat}`}
                >
                  <div className="transition-transform duration-200 group-hover:scale-105">
                    {b.renderLogo()}
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ================= WHY CHOOSE US (THE DIFFERENCE) ================= */}
      <WhyChooseUsSection />

      {/* ================= CUSTOMER REVIEWS (CAROUSEL) ================= */}
      <CustomerReviewsSection />

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}