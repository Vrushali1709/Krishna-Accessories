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
import NewArrivalsSection from '../components/NewArrivalsSection';
import CustomerReviewsSection from '../components/CustomerReviewsSection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import { getProducts, getCategories, getBrands } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TruckIcon,
  ShieldCheckIcon,
  RefreshIcon,
  HeadphonesIcon
} from '../components/Icons';

// ============================================================
// DEFAULT CATEGORY BANNERS
// ============================================================
const defaultCategoryBanners = [
  {
    name: 'Watches',
    description: 'Heritage Swiss & Smart Chronographs',
    image: 'https://i.pinimg.com/736x/80/4d/7c/804d7c5ba3d69a866d1303f94299d564.jpg',
    tag: 'Titan, Fossil, Rolex, Casio'
  },
  {
    name: 'Bags & Wallets',
    description: 'Genuine Leather & Urban Backpacks',
    image: 'https://i.pinimg.com/736x/15/dc/da/15dcdac0fcc6a94440471bf201b96b75.jpg',
    tag: 'Hidesign, Wildcraft, Tommy'
  },
  {
    name: 'Shoes',
    description: 'Handcrafted Sneakers & Running Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900',
    tag: 'Nike, Adidas, Puma, Jordan'
  },
  {
    name: 'Mobiles',
    description: 'Flagship Titanium Handsets & Gear',
    image: 'https://i.pinimg.com/736x/00/9b/91/009b91eaa9c50df8e5d5681cbde9a9c3.jpg',
    tag: 'Apple, Samsung, OnePlus'
  },
  {
    name: 'Clothes & Fashion',
    description: 'Tailored Suits, Denim & Luxury Apparel',
    image: 'https://i.pinimg.com/1200x/7e/e0/55/7ee055c1c667557a592fa716eb5005fc.jpg',
    tag: 'Levis, Zara, Tommy, Calvin Klein'
  },
  {
    name: 'Laptops',
    description: 'High-Performance OLED Workstations',
    image: 'https://i.pinimg.com/1200x/fe/f7/b3/fef7b3cbaeb59afc974ab04dd20741e6.jpg',
    tag: 'Apple, Dell, HP, Asus'
  },
  {
    name: 'Electronics',
    description: 'Audiophile Noise-Cancelling Sound',
    image: 'https://i.pinimg.com/1200x/db/6c/da/db6cdaadde558a889e0c812ea679d8e1.jpg',
    tag: 'Sony, Bose, JBL, Marshall'
  },
  {
    name: 'Smart Gadgets',
    description: 'Smart Rings, AI Devices & Wearables',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=900',
    tag: 'Apple, Samsung, Google, boAt'
  },
  {
    name: 'Gaming',
    description: 'RGB Mechanical Gear & Consoles',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=900',
    tag: 'Razer, Sony PS5, Logitech, Asus'
  },
  {
    name: 'Fitness',
    description: 'GPS Multi-Sport Trackers & Health',
    image: 'https://i.pinimg.com/736x/ce/b4/1d/ceb41df7737b5918904522051f1f56f5.jpg',
    tag: 'Garmin, Fitbit, Apple, Noise'
  },
  {
    name: 'Fashion Accessories',
    description: 'Polarized Eyewear & Belts',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900',
    tag: 'Ray-Ban, Police, Titan, Fossil'
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
    description: 'Where timeless design meets modern performance. Explore certified authentic heritage timepieces and chronographs.',
    image: 'https://i.pinimg.com/736x/80/4d/7c/804d7c5ba3d69a866d1303f94299d564.jpg',
    category: 'Watches'
  },
  {
    tag: 'LIMITED EDITION',
    titleLine1: 'HERITAGE.',
    titleLine2: 'SWISS CHRONOGRAPHS.',
    description: 'Engineered for absolute accuracy and prestige. Featuring sapphire crystal, automatic movements, and fine leather straps.',
    image: 'https://i.pinimg.com/736x/e6/df/98/e6df982c03d41dbf66fe9470007838c2.jpg',
    category: 'Watches'
  },
  {
    tag: 'AUTOMATIC SERIES',
    titleLine1: 'TIMELESS.',
    titleLine2: 'MASTERPIECE WATCHES.',
    description: 'Crafted with uncompromising attention to detail. Certified genuine with manufacturer warranty and showroom authenticity.',
    image: 'https://i.pinimg.com/736x/52/cc/2a/52cc2a9343298c070a2e66503a60b5cc.jpg',
    category: 'Watches'
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
// TRUST PILLARS
// ============================================================
const trustPillars = [
  {
    title: 'Free Insured Shipping',
    subtitle: 'On orders above ₹2,000 via BlueDart & Delhivery',
    icon: TruckIcon
  },
  {
    title: '100% Certified Authentic',
    subtitle: 'Direct authorized sourcing with brand warranty',
    icon: ShieldCheckIcon
  },
  {
    title: '7-Day Easy Replacement',
    subtitle: 'Hassle-free exchange for client peace of mind',
    icon: RefreshIcon
  },
  {
    title: '24/7 Client Concierge',
    subtitle: 'Dedicated assistance & Mumbai store support',
    icon: HeadphonesIcon
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
  const [brands, setBrands] = useState(() => getBrands());
  const [toastMessage, setToastMessage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Category Carousel State
  const categoryCarouselRef = useRef(null);
  const [canCatScrollLeft, setCanCatScrollLeft] = useState(false);
  const [canCatScrollRight, setCanCatScrollRight] = useState(true);
  const [isCatDragging, setIsCatDragging] = useState(false);
  const [catStartX, setCatStartX] = useState(0);
  const [catScrollLeft, setCatScrollLeft] = useState(0);
  const [catHasMoved, setCatHasMoved] = useState(false);

  // Best Sellers Filter State
  const [bestSellerCategory, setBestSellerCategory] = useState('All');

  // Category List dynamically synced with store
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

  // Hero auto-slider timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % watchHeroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Sync with Admin Panel updates (Products, Categories, Brands)
  useEffect(() => {
    const handleUpdate = () => {
      setProducts(getProducts());
      setBrands(getBrands());
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
    window.addEventListener('brandsUpdated', handleUpdate);
    return () => {
      window.removeEventListener('productsUpdated', handleUpdate);
      window.removeEventListener('categoriesUpdated', handleUpdate);
      window.removeEventListener('brandsUpdated', handleUpdate);
    };
  }, []);

  // Category Carousel scroll check
  const checkCatScroll = useCallback(() => {
    if (!categoryCarouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = categoryCarouselRef.current;
    setCanCatScrollLeft(scrollLeft > 10);
    setCanCatScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = categoryCarouselRef.current;
    if (!el) return;
    checkCatScroll();
    el.addEventListener('scroll', checkCatScroll, { passive: true });
    window.addEventListener('resize', checkCatScroll);
    return () => {
      el.removeEventListener('scroll', checkCatScroll);
      window.removeEventListener('resize', checkCatScroll);
    };
  }, [checkCatScroll, categoryList]);

  const scrollCategoryCarousel = (direction) => {
    if (!categoryCarouselRef.current) return;
    const container = categoryCarouselRef.current;
    const cardWidth = container.firstElementChild?.clientWidth || 230;
    const scrollAmount = (cardWidth + 16) * 2;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleCatMouseDown = (e) => {
    if (!categoryCarouselRef.current) return;
    setIsCatDragging(true);
    setCatHasMoved(false);
    setCatStartX(e.pageX - categoryCarouselRef.current.offsetLeft);
    setCatScrollLeft(categoryCarouselRef.current.scrollLeft);
  };

  const handleCatMouseMove = (e) => {
    if (!isCatDragging || !categoryCarouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoryCarouselRef.current.offsetLeft;
    const walk = (x - catStartX) * 1.5;
    if (Math.abs(walk) > 5) setCatHasMoved(true);
    categoryCarouselRef.current.scrollLeft = catScrollLeft - walk;
  };

  const handleCatMouseUp = () => {
    setIsCatDragging(false);
  };

  const handleCategoryCardClick = (e) => {
    if (catHasMoved) {
      e.preventDefault();
    }
  };

  const getProductCountForCategory = (catName) => {
    return products.filter((p) => p.category?.toLowerCase() === catName.toLowerCase()).length;
  };

  // -------------------------------------------------------------
  // Cart & Buy Actions
  // -------------------------------------------------------------
  const handleAddToCart = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setToastMessage(`✓ Added "${product.name}" to your bag`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleBuyNow = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  const handleCopyCoupon = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText('KRISHNA10');
    }
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2200);
  };

  // -------------------------------------------------------------
  // Best Sellers Filtered List
  // -------------------------------------------------------------
  const bestSellerCategories = ['All', 'Watches', 'Bags & Wallets', 'Shoes', 'Electronics', 'Fashion Accessories'];

  const filteredBestSellers = useMemo(() => {
    let list = [...products];
    if (bestSellerCategory !== 'All') {
      list = list.filter((p) => p.category?.toLowerCase() === bestSellerCategory.toLowerCase());
    }
    // Prioritize high rating or featured items
    list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    return list.slice(0, 8);
  }, [products, bestSellerCategory]);

  // -------------------------------------------------------------
  // Shop by Price Buckets
  // -------------------------------------------------------------
  const priceTiers = useMemo(() => {
    const under5kProducts = products.filter((p) => Number(p.price) < 5000);
    const under10kProducts = products.filter((p) => Number(p.price) < 10000);
    const under15kProducts = products.filter((p) => Number(p.price) < 15000);
    const under20kProducts = products.filter((p) => Number(p.price) < 20000);

    return [
      {
        title: 'Under ₹5,000',
        subtitle: 'Daily Luxury & Essentials',
        maxPrice: 5000,
        count: under5kProducts.length,
        image: under5kProducts[0]?.image || under5kProducts[0]?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
        badge: 'ACCESSIBLE LUXURY'
      },
      {
        title: 'Under ₹10,000',
        subtitle: 'Premium Craft & Trendsetters',
        maxPrice: 10000,
        count: under10kProducts.length,
        image: under10kProducts[0]?.image || under10kProducts[0]?.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
        badge: 'POPULAR CHOICE'
      },
      {
        title: 'Under ₹15,000',
        subtitle: 'Heritage Horology & Flagship Audio',
        maxPrice: 15000,
        count: under15kProducts.length,
        image: under15kProducts[0]?.image || under15kProducts[0]?.images?.[0] || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600',
        badge: 'SIGNATURE VALUE'
      },
      {
        title: 'Under ₹20,000',
        subtitle: 'Masterpiece Chronographs & Prestige',
        maxPrice: 20000,
        count: under20kProducts.length,
        image: under20kProducts[0]?.image || under20kProducts[0]?.images?.[0] || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
        badge: 'EXECUTIVE TIER'
      }
    ];
  }, [products]);

  // -------------------------------------------------------------
  // Trending / Popular Spotlight & Grid
  // -------------------------------------------------------------
  const spotlightProduct = useMemo(() => {
    return products.find((p) => (Number(p.rating) >= 4.8 || p.discount >= 20) && p.image) || products[0];
  }, [products]);

  const trendingProducts = useMemo(() => {
    return products.filter((p) => p.id !== spotlightProduct?.id).slice(0, 4);
  }, [products, spotlightProduct]);

  // Dynamic brands list combined with default logos
  const knownBrandNames = new Set([...brandRow1, ...brandRow2].map((b) => b.name.toLowerCase()));
  const dynamicCustomBrands = brands.filter((b) => !knownBrandNames.has(b.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip select-none sm:select-auto">
      {/* 1. NAVBAR */}
      <Navbar />

      {/* Floating Bag Alert Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 shadow-2xl animate-slide-up max-w-[calc(100vw-32px)]">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">✓</span>
          <span className="truncate">{toastMessage}</span>
          <Link
            to="/cart"
            className="ml-1 rounded-full bg-[#111827] px-3 py-1 text-[10.5px] font-semibold text-white hover:bg-black transition shrink-0"
          >
            View Bag
          </Link>
        </div>
      )}

      {/* ============================================================
          2. PREMIUM HERO SECTION (WATCH HERO SLIDER)
      ============================================================ */}
      <section className="relative w-full overflow-hidden bg-[#070808] text-white border-b border-neutral-800 lg:h-[680px] lg:min-h-[680px]">
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

              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/15 lg:from-[#070808] lg:via-[#070808]/90 lg:via-45% lg:to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/90 via-black/30 to-transparent lg:from-[#070808] lg:via-[#070808]/60 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,transparent_0%,rgba(0,0,0,0.08)_45%,rgba(0,0,0,0.35)_100%)] lg:bg-[radial-gradient(ellipse_at_75%_50%,transparent_30%,rgba(7,8,8,0.4)_75%,#070808_100%)] pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="relative z-20 mx-auto max-w-7xl w-full min-h-[560px] sm:min-h-[600px] lg:min-h-[680px] lg:h-full px-5 sm:px-8 lg:px-10 pt-16 sm:pt-20 lg:pt-0 pb-8 lg:pb-6 flex flex-col justify-between">
          <div className="max-w-[640px] lg:my-auto lg:py-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#C5A880]" />
              <span className="text-[10.5px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#D5C2A5]">
                {watchHeroSlides[currentSlide].tag}
              </span>
            </div>

            <h1 className="text-[40px] leading-[1.04] tracking-[-0.03em] font-semibold sm:text-5xl lg:text-[68px] xl:text-[74px]">
              <span className="block text-white font-serif">{watchHeroSlides[currentSlide].titleLine1}</span>
              <span className="block mt-1 font-light text-[#C9AB80]">{watchHeroSlides[currentSlide].titleLine2}</span>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-[#B0B2B8] max-w-md font-light leading-relaxed">
              {watchHeroSlides[currentSlide].description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={`/shop?category=${encodeURIComponent(watchHeroSlides[currentSlide].category)}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-black transition hover:bg-[#E5D7C5] shadow-lg active:scale-95"
              >
                <span>Shop Watches</span>
                <ArrowRightIcon className="w-4 h-4 text-black" />
              </Link>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-black/40 backdrop-blur-md px-6 py-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-white transition hover:border-neutral-500 hover:bg-black/60 active:scale-95"
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
                  className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${i === currentSlide ? 'w-8 bg-[#C5A880]' : 'w-2 bg-neutral-700 hover:bg-neutral-500'
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

      {/* ============================================================
          3. TRUST / BENEFITS STRIP & STORE HIGHLIGHTS
      ============================================================ */}
      <section className="bg-white border-b border-gray-200/80">
        {/* Infinite Marquee Strip */}
        <div className="relative bg-[#07090E] text-white py-3 overflow-hidden select-none border-b border-neutral-800">
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

        {/* 4 Pillars Trust Grid */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {trustPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className={`flex items-center gap-3.5 pt-3 sm:pt-0 ${idx > 0 ? 'sm:pl-6' : ''}`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F7F5F0] text-[#A68037] border border-[#EEDFBC]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-[13px] font-bold text-gray-950 tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="mt-0.5 text-[10.5px] sm:text-[11px] text-gray-500 font-normal leading-tight">
                      {pillar.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          4. SHOP BY CATEGORY (DYNAMIC CAROUSEL)
      ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
              <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#A68037]">
                CURATED DEPARTMENTS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 font-sans">
              Shop by Category
            </h2>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Link
              to="/shop"
              className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-black hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View All Categories</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>

            {/* Carousel Buttons */}
            <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-gray-200">
              <button
                type="button"
                onClick={() => scrollCategoryCarousel('left')}
                disabled={!canCatScrollLeft}
                aria-label="Previous categories"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${canCatScrollLeft
                  ? 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-950 hover:text-white cursor-pointer active:scale-95'
                  : 'border border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                  }`}
              >
                <ChevronLeftIcon className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => scrollCategoryCarousel('right')}
                disabled={!canCatScrollRight}
                aria-label="Next categories"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${canCatScrollRight
                  ? 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-950 hover:text-white cursor-pointer active:scale-95'
                  : 'border border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                  }`}
              >
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={categoryCarouselRef}
          onMouseDown={handleCatMouseDown}
          onMouseMove={handleCatMouseMove}
          onMouseUp={handleCatMouseUp}
          onMouseLeave={handleCatMouseUp}
          className={`flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar select-none ${isCatDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categoryList.map((c) => {
            const count = getProductCountForCategory(c.name);
            return (
              <Link
                key={c.name}
                to={`/shop?category=${encodeURIComponent(c.name)}`}
                onClick={handleCategoryCardClick}
                className="group relative flex-shrink-0 w-[205px] sm:w-[230px] md:w-[250px] lg:w-[260px] p-2.5 sm:p-3 rounded-[24px] bg-white border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.09)] transition-all duration-300 hover:-translate-y-1 snap-start flex flex-col justify-between"
              >
                {/* Image Container with Inset Badges */}
                <div className="relative w-full aspect-[1/0.95] overflow-hidden rounded-[18px] bg-gray-100">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-106 pointer-events-none"
                  />

                  {/* Top Left Badge */}
                  <div className="absolute top-2.5 left-2.5 pointer-events-none">
                    <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] sm:text-[10.5px] font-medium text-white border border-white/15 shadow-2xs">
                      {count > 0 ? `${count} ${count === 1 ? 'item' : 'items'}` : 'Top rated'}
                    </span>
                  </div>

                  {/* Top Right Arrow Pill */}
                  <div className="absolute top-2.5 right-2.5 pointer-events-none">
                    <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 shadow-2xs transition-all duration-300 group-hover:bg-black group-hover:scale-110">
                      <svg
                        className="w-3.5 h-3.5 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5L19.5 4.5m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Bottom Card Content */}
                <div className="pt-3 pb-1 px-1 flex flex-col gap-2.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-[14px] sm:text-[15px] font-bold text-gray-900 tracking-tight group-hover:text-black transition-colors truncate">
                      {c.name}
                    </h3>
                    <span className="text-[10.5px] sm:text-[11px] text-gray-400 font-normal truncate max-w-[48%] text-right">
                      {c.tag || c.description}
                    </span>
                  </div>

                  {/* Pill Action Button */}
                  <div className="w-full py-2 sm:py-2.5 rounded-full bg-[#181a1f] group-hover:bg-black text-white text-[11px] sm:text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.98] shadow-2xs">
                    <span>Explore Now</span>
                    <ArrowRightIcon className="w-3 h-3 text-white/80 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          5. FEATURED BRANDS (MARQUEE & DYNAMIC ADMIN BRAND SYNC)
      ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:pt-6 pb-10 sm:pb-14 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 mb-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
            <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#A68037]">
              OFFICIAL PARTNERS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
            Explore by Brand
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
            Discover 100% certified authentic luxury pieces direct from authorized heritage houses and global makers.
          </p>
        </div>

        {/* Dual Capsule Infinite Scrolling Strips */}
        <div className="space-y-3 sm:space-y-3.5">
          {/* Track 1 */}
          <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-gray-200/90 bg-[#F9FAFB]/90 p-2 sm:p-2.5 sm:px-3 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
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

          {/* Track 2 */}
          <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-gray-200/90 bg-[#F9FAFB]/90 p-2 sm:p-2.5 sm:px-3 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
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

          {/* Dynamic Admin-Added Brands Strip (Rendered when custom brands exist in store) */}
          {dynamicCustomBrands.length > 0 && (
            <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar justify-center flex-wrap">
              {dynamicCustomBrands.map((customBrand) => (
                <Link
                  key={customBrand}
                  to={`/shop?brand=${encodeURIComponent(customBrand)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-800 hover:border-black hover:bg-black hover:text-white transition-all shadow-xs"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>{customBrand}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          6. NEW ARRIVALS
      ============================================================ */}
      <NewArrivalsSection products={products} onToast={setToastMessage} />

      {/* ============================================================
          7. BEST SELLERS
      ============================================================ */}
      <section className="bg-white border-b border-gray-200/80 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="inline-flex items-center gap-2 mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
                <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#A68037]">
                  CLIENT FAVORITES
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 font-sans">
                Curated Best Sellers
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-md">
                Our most coveted, highest-rated essentials across fine horology, leather craft, and audio gear.
              </p>
            </div>

            <Link
              to="/shop?sort=rating"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-900 hover:text-black hover:underline self-start md:self-auto group shrink-0"
            >
              <span>Explore All Best Sellers</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 sm:mb-8 no-scrollbar">
            {bestSellerCategories.map((cat) => {
              const isActive = bestSellerCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setBestSellerCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${isActive
                    ? 'bg-gray-950 text-white shadow-sm scale-102'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black'
                    }`}
                >
                  {cat === 'All' ? 'All Best Sellers' : cat}
                </button>
              );
            })}
          </div>

          {/* 4-Column Product Grid */}
          {filteredBestSellers.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
              {filteredBestSellers.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl bg-gray-50 border border-gray-200/80">
              <p className="text-sm font-semibold text-gray-700">No best seller products found in this category.</p>
              <button
                type="button"
                onClick={() => setBestSellerCategory('All')}
                className="mt-3 text-xs font-bold text-black underline cursor-pointer"
              >
                View all best sellers
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          8. SHOP BY PRICE (4 INTERACTIVE TIERS)
      ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
              <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#A68037]">
                BUDGET & INVESTMENT TIERS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
              Shop by Price Range
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-md">
              Explore curated luxury and everyday essentials tailored to your preferred investment.
            </p>
          </div>

          <Link
            to="/shop"
            className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-black hover:underline flex items-center gap-1 shrink-0"
          >
            <span>All Price Ranges</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Price Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {priceTiers.map((tier) => (
            <Link
              key={tier.title}
              to={`/shop?maxPrice=${tier.maxPrice}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-gray-200/90 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-[#C5A059]/50"
            >
              <div>
                {/* Header Tag & Count */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#A68037] bg-[#F7F3E8] border border-[#EEDFBC] px-2 py-0.5 rounded-full">
                    {tier.badge}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400">
                    {tier.count} {tier.count === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Price Heading */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-950 tracking-tight group-hover:text-black">
                  {tier.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500 leading-snug">
                  {tier.subtitle}
                </p>

                {/* Preview Image Frame */}
                <div className="mt-4 relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 border border-gray-100">
                  <img
                    src={tier.image}
                    alt={tier.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-semibold backdrop-blur-sm bg-black/40 px-2.5 py-1 rounded-full border border-white/20">
                    <span>Up to ₹{tier.maxPrice.toLocaleString('en-IN')}</span>
                    <span className="text-amber-300">View →</span>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-900 group-hover:text-[#A68037] transition-colors">
                <span>Explore Collection</span>
                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================
          9. TRENDING / POPULAR PRODUCTS (SPOTLIGHT SHOWCASE)
      ============================================================ */}
      <section className="bg-white border-y border-gray-200/80 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
                <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#A68037]">
                  TRENDING NOW
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 font-sans">
                Popular Picks & Spotlight
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-md">
                Real-time customer favorites capturing attention this week across all luxury departments.
              </p>
            </div>

            <Link
              to="/shop?sort=discount"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-900 hover:text-black hover:underline self-start md:self-auto group shrink-0"
            >
              <span>View All Trending</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Split Spotlight Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Hero Spotlight Card */}
            {spotlightProduct && (
              <div className="lg:col-span-5 rounded-[28px] border border-gray-200/90 bg-[#0F172A] text-white p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                      ★ Spotlight of the Week
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {spotlightProduct.category}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 line-clamp-2">
                    {spotlightProduct.name}
                  </h3>
                  <p className="text-xs text-gray-300 line-clamp-2 mb-4 font-light">
                    {spotlightProduct.description || 'Certified authentic luxury piece crafted with timeless precision and premier materials.'}
                  </p>

                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-800/80 mb-5 border border-slate-700/80">
                    <img
                      src={spotlightProduct.image || spotlightProduct.images?.[0]}
                      alt={spotlightProduct.name}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                      ₹{Number(spotlightProduct.price).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(spotlightProduct)}
                    className="flex-1 rounded-full bg-white text-gray-950 py-2.5 px-4 text-xs font-bold uppercase tracking-wider hover:bg-amber-100 transition active:scale-95 shadow-md cursor-pointer"
                  >
                    + Add to Bag
                  </button>
                  <Link
                    to={`/product/${spotlightProduct.id}`}
                    className="rounded-full border border-slate-700 bg-slate-800/80 text-white py-2.5 px-5 text-xs font-bold uppercase tracking-wider hover:bg-slate-700 transition active:scale-95 shrink-0"
                  >
                    Details
                  </Link>
                </div>
              </div>
            )}

            {/* Right Companion Products Grid (4 items) */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-3.5 sm:gap-5">
              {trendingProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          10. PROMOTIONAL OFFER BANNER
      ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-800">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 max-w-2xl">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-2xl border border-amber-400/20 shadow-inner">
                🎁
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">
                    EXCLUSIVE PRIVÉ PRIVILEGE
                  </span>
                  <span className="h-1 w-1 rounded-full bg-amber-400" />
                  <span className="text-[10px] text-gray-400">Limited Period</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Save 10% Instant Discount on Orders Above ₹1,000
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-300 font-light">
                  Apply coupon code at checkout for immediate savings across our entire catalogue.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
              {/* Interactive Coupon Box */}
              <div className="flex items-center rounded-2xl bg-black/40 border border-white/15 px-4 py-2.5 backdrop-blur-md">
                <span className="text-xs text-gray-400 mr-2 font-mono">CODE:</span>
                <span className="font-mono text-sm font-bold text-amber-300 tracking-wider">
                  KRISHNA10
                </span>
                <button
                  type="button"
                  onClick={handleCopyCoupon}
                  className={`ml-3 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${copiedCoupon
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/15 text-white hover:bg-white/25'
                    }`}
                >
                  {copiedCoupon ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              <Link
                to="/shop"
                className="rounded-2xl bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-950 hover:bg-amber-100 transition shadow-md shrink-0 active:scale-95"
              >
                Claim Offer →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          11. WHY CHOOSE US (THE DIFFERENCE)
      ============================================================ */}
      <WhyChooseUsSection />

      {/* ============================================================
          12. CUSTOMER REVIEWS (CAROUSEL & TESTIMONIALS)
      ============================================================ */}
      <CustomerReviewsSection />

      {/* ============================================================
          13. FOOTER
      ============================================================ */}
      <Footer />
    </div>
  );
}