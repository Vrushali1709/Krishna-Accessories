// src/pages/Home.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Reveal } from '../components/useScrollReveal';
import HomeDiscoveryStrip from '../components/HomeDiscoveryStrip';
import FeaturedBrandsSection from '../components/FeaturedBrandsSection';
import ShopByCategorySection from '../components/ShopByCategorySection';
import BestSellersSection from '../components/BestSellersSection';
import PromoVoucherBanner from '../components/PromoVoucherBanner';
import PriceTierUnder5k from '../components/PriceTierUnder5k';
import EditorialSpotlightSection from '../components/EditorialSpotlightSection';
import PriceTierUnder10k from '../components/PriceTierUnder10k';
import NewArrivalsSection from '../components/NewArrivalsSection';
import PriceTierUnder15k from '../components/PriceTierUnder15k';
import FeaturedTrendingSection from '../components/FeaturedTrendingSection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import CustomerReviewsSection from '../components/CustomerReviewsSection';
import InstagramClubSection from '../components/InstagramClubSection';

import { getProducts, getCategories } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { ArrowRightIcon } from '../components/Icons';

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
    description: 'Where timeless Swiss horology meets modern prestige performance and certified manufacture warranties.',
    image: 'https://i.pinimg.com/736x/80/4d/7c/804d7c5ba3d69a866d1303f94299d564.jpg',
    category: 'Watches'
  },
  {
    tag: 'LIMITED BESPOKE EDITION',
    titleLine1: 'HERITAGE.',
    titleLine2: 'CHRONOGRAPH LUXE.',
    description: 'Engineered for absolute accuracy, sapphire durability, and distinguished executive elegance.',
    image: 'https://i.pinimg.com/736x/e6/df/98/e6df982c03d41dbf66fe9470007838c2.jpg',
    category: 'Watches'
  },
  {
    tag: 'AUTOMATIC MASTERPIECES',
    titleLine1: 'TIMELESS.',
    titleLine2: 'SAPPHIRE LUXURY.',
    description: 'Crafted with genuine sapphire crystal, mechanical movements, and hand-finished calfskin straps.',
    image: 'https://i.pinimg.com/736x/52/cc/2a/52cc2a9343298c070a2e66503a60b5cc.jpg',
    category: 'Watches'
  }
];

// ============================================================
// CONTINUOUS SCROLLING TICKER ITEMS (STORE HIGHLIGHTS)
// ============================================================
const storeTickerItems = [
  { title: "100% CERTIFIED AUTHENTIC", subtitle: "Official Brand Warranty Included" },
  { title: "DIRECT FACTORY SOURCING", subtitle: "Titan • Casio • Fossil • Rolex • Apple • Sony" },
  { title: "MUMBAI FLAGSHIP SANCTUARY", subtitle: "Heera Panna Shopping Center, Haji Ali" },
  { title: "INSURED EXPRESS LOGISTICS", subtitle: "BlueDart & Delhivery Across India" },
  { title: "HANDCRAFTED LEATHER GOODS", subtitle: "Hidesign • Wildcraft • Tommy Hilfiger" },
  { title: "7-DAY PEACE-OF-MIND GUARANTEE", subtitle: "100% Client Satisfaction" },
  { title: "PREMIUM AUDIO & FLAGSHIP TECH", subtitle: "Sony • Bose • Samsung • boAt" },
  { title: "POLARIZED & LUXURY EYEWEAR", subtitle: "Ray-Ban • Police • Fastrack" },
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

  // Check Out What's New (New Arrivals)
  const newArrivals = useMemo(() => {
    const bestSellerIds = new Set(bestSellers.map((p) => p.id));
    const sortedNew = [...products]
      .filter((p) => !bestSellerIds.has(p.id))
      .sort((a, b) => (b.id || 0) - (a.id || 0));

    if (sortedNew.length >= 4) {
      return sortedNew;
    }
    return products;
  }, [products, bestSellers]);

  const getProductCountForCategory = (catName) => {
    return products.filter((p) => p.category?.toLowerCase() === catName.toLowerCase()).length;
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
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
          <div className="max-w-[620px] lg:my-auto lg:py-8">
            <div className="mb-5 flex items-center gap-3 animate-fade-in">
              <span className="h-px w-8 bg-[#C5A880]" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#D5C2A5]">
                {watchHeroSlides[currentSlide].tag}
              </span>
            </div>

            <h1 className="text-[42px] leading-[1.02] tracking-[-0.03em] font-semibold sm:text-5xl lg:text-[68px] xl:text-[76px]">
              <span className="block text-white font-serif">{watchHeroSlides[currentSlide].titleLine1}</span>
              <span className="block mt-1 font-light text-[#C9AB80]">{watchHeroSlides[currentSlide].titleLine2}</span>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-[#B0B2B8] max-w-md font-light leading-relaxed">
              {watchHeroSlides[currentSlide].description}
            </p>

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
          </div>

          <div className="flex items-center justify-between border-t border-neutral-800/80 pt-4">
            <div className="flex items-center gap-2">
              {watchHeroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                    i === currentSlide ? 'w-8 bg-[#C5A880]' : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <span className="text-[11px] font-mono font-medium text-neutral-400 tracking-wider">
              0{currentSlide + 1} / 0{watchHeroSlides.length}
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. CONTINUOUS SCROLLING TRUST TICKER LINE
      ========================================================= */}
      <div className="relative bg-[#07090E] text-white border-y border-neutral-800/90 py-3.5 overflow-hidden select-none">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#07090E] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#07090E] to-transparent z-10" />

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

      {/* =========================================================
          3. CORE VALUE PILLARS (4-FEATURE DISCOVERY STRIP)
      ========================================================= */}
      <HomeDiscoveryStrip />

      {/* =========================================================
          4. OFFICIAL BRAND PARTNERS (CAPSULE SHOWCASE)
      ========================================================= */}
      <FeaturedBrandsSection />

      {/* =========================================================
          5. SHOP BY CATEGORY (CURATED CAROUSEL)
      ========================================================= */}
      <ShopByCategorySection
        categories={categoryList}
        getProductCount={getProductCountForCategory}
      />

      {/* =========================================================
          6. TOP PICKS FOR YOU — BEST SELLERS (RANKED LUXURY CARDS)
      ========================================================= */}
      <BestSellersSection
        products={bestSellers}
        onToast={setToastMessage}
      />

      {/* =========================================================
          7. FLASH PROMOTIONAL VOUCHER BANNER
      ========================================================= */}
      <PromoVoucherBanner onToast={setToastMessage} />

      {/* =========================================================
          8. PRICE TIER: UNDER ₹5,000 (COMPACT QUICK-PICKS GRID)
      ========================================================= */}
      <PriceTierUnder5k
        products={products}
        onToast={setToastMessage}
      />

      {/* =========================================================
          9. CURATED EDITORIAL SPOTLIGHT (DUAL LUXURY BANNERS)
      ========================================================= */}
      <EditorialSpotlightSection />

      {/* =========================================================
          10. PRICE TIER: UNDER ₹10,000 (HORIZONTAL SPLIT CARDS)
      ========================================================= */}
      <PriceTierUnder10k
        products={products}
        onToast={setToastMessage}
      />

      {/* =========================================================
          11. THE NEW ARRIVALS (NUMBERED EDITORIAL CAROUSEL)
      ========================================================= */}
      <NewArrivalsSection
        products={newArrivals}
        onToast={setToastMessage}
      />

      {/* =========================================================
          12. PRICE TIER: EXECUTIVE SPOTLIGHT ₹15,000–₹20,000+ (ASYMMETRY)
      ========================================================= */}
      <PriceTierUnder15k
        products={products}
        onToast={setToastMessage}
      />

      {/* =========================================================
          13. FEATURED / TRENDING PRODUCTS SECTION (TABBED CATALOG)
      ========================================================= */}
      <FeaturedTrendingSection
        products={products}
        onToast={setToastMessage}
      />

      {/* =========================================================
          14. WHY CHOOSE US (THE KRISHNA PROMISE)
      ========================================================= */}
      <WhyChooseUsSection />

      {/* =========================================================
          15. CUSTOMER REVIEWS (VERIFIED TESTIMONIALS CAROUSEL)
      ========================================================= */}
      <CustomerReviewsSection />

      {/* =========================================================
          16. INSTAGRAM LIFESTYLE COMMUNITY & VIP PRIVÉ CLUB
      ========================================================= */}
      <InstagramClubSection />

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <Footer />
    </div>
  );
}