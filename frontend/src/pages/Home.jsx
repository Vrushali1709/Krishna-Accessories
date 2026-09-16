// src/pages/Home.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  siAdidas,
  siApple,
  siBose,
  siDell,
  siNike,
  siPuma,
  siRazer,
  siSamsung,
  siSony,
  siZara
} from 'simple-icons';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Reveal } from '../components/useScrollReveal';
import ShopByCategorySection from '../components/ShopByCategorySection';
import FeaturedTrendingSection from '../components/FeaturedTrendingSection';
import EditorialSpotlightSection from '../components/EditorialSpotlightSection';
import ProductsByPriceSection from '../components/ProductsByPriceSection';
import CustomerReviewsSection from '../components/CustomerReviewsSection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import InstagramClubSection from '../components/InstagramClubSection';
import { getProducts, getCategories } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import {
  ArrowRightIcon,
  CheckIcon
} from '../components/Icons';

// ============================================================
// DEFAULT CATEGORY LIST
// ============================================================
const defaultCategoryBanners = [
  {
    name: 'Watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    description: 'Heritage Swiss & Smart Chronographs'
  },
  {
    name: 'Bags & Wallets',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    description: 'Genuine Leather & Urban Backpacks'
  },
  {
    name: 'Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    description: 'Handcrafted Sneakers & Footwear'
  },
  {
    name: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    description: 'Flagship Handsets & Gear'
  },
  {
    name: 'Clothes & Fashion',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    description: 'Tailored Suits, Denim & Apparel'
  },
  {
    name: 'Laptops',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
    description: 'High-Performance Workstations'
  },
  {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'Audiophile Noise-Cancelling Sound'
  },
  {
    name: 'Smart Gadgets',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
    description: 'Smart Rings & AI Wearables'
  },
  {
    name: 'Gaming',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&auto=format&fit=crop&q=80',
    description: 'Mechanical Gear & Consoles'
  },
  {
    name: 'Fitness',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80',
    description: 'GPS Multi-Sport Trackers'
  },
  {
    name: 'Fashion Accessories',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    description: 'Polarized Eyewear & Belts'
  }
];

// ============================================================
// EDITORIAL HERO SHOWCASE SLIDES
// ============================================================
const heroSlides = [
  {
    id: 'watches',
    tag: '2026 HOROLOGY EDITION',
    title: 'Crafted for Distinction',
    accentText: 'Swiss Chronographs & Mechanical Masterpieces',
    description: 'Engineered with sapphire crystal, ceramic bezels, and authentic brand warranty. Handpicked timepieces for the discerning collector.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=85',
    category: 'Watches',
    specCard: {
      badge: 'Heritage Series',
      title: 'Titan Edge Ceramic Chronograph',
      detail: 'Sapphire Crystal • 50M Water Resistance'
    }
  },
  {
    id: 'leather',
    tag: 'ARTISANAL LEATHERCRAFT',
    title: 'Pure Full-Grain Elegance',
    accentText: 'Handcrafted Executive Bags & Wallets',
    description: 'Vegetable-tanned hides designed to develop a rich, personal patina over decades of distinguished journeys.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&auto=format&fit=crop&q=85',
    category: 'Bags & Wallets',
    specCard: {
      badge: 'Artisanal Series',
      title: 'Hidesign Genuine Leather Duffle',
      detail: 'Solid Brass Hardware • Hand-Stitched'
    }
  },
  {
    id: 'audio',
    tag: 'ACOUSTIC ENGINEERING',
    title: 'Pure Audiophile Fidelity',
    accentText: 'Flagship Active Noise-Cancelling Sound',
    description: 'Immersive soundscapes, high-resolution wireless acoustics, and studio-grade precision tuned for true music lovers.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=85',
    category: 'Electronics',
    specCard: {
      badge: 'Studio Audio',
      title: 'Sony WH-1000XM5 Wireless ANC',
      detail: '30-Hr Battery • Hi-Res Audio Certified'
    }
  }
];

// ============================================================
// MONOCHROME MINIMAL LUXURY BRANDS
// ============================================================
const brandLogos = [
  {
    name: 'Titan',
    cat: 'Watches',
    render: () => (
      <span className="font-sans font-black text-sm tracking-[0.2em] text-neutral-800 hover:text-black transition-colors">
        TITAN
      </span>
    )
  },
  {
    name: 'Rolex',
    cat: 'Watches',
    render: () => (
      <div className="flex items-center gap-1.5 text-neutral-800 hover:text-black transition-colors">
        <svg viewBox="0 0 24 14" className="h-3.5 w-5 fill-current">
          <path d="M12 1l2.2 4.5 3.8-3 1.5 5.5-3.5 1.5 4.5 3H3.5l4.5-3-3.5-1.5 1.5-5.5 3.8 3L12 1zm-5 11.5h10V14H7v-1.5z" />
        </svg>
        <span className="font-serif font-bold text-xs tracking-[0.25em]">ROLEX</span>
      </div>
    )
  },
  {
    name: 'Casio',
    cat: 'Watches',
    render: () => (
      <span className="font-sans font-black text-sm tracking-[0.14em] text-neutral-800 hover:text-black transition-colors">
        CASIO
      </span>
    )
  },
  {
    name: 'Fossil',
    cat: 'Watches',
    render: () => (
      <span className="font-sans font-bold text-xs tracking-[0.2em] text-neutral-800 hover:text-black transition-colors">
        FOSSIL
      </span>
    )
  },
  {
    name: 'Apple',
    cat: 'Mobiles',
    render: () => (
      <div className="flex items-center gap-1 text-neutral-800 hover:text-black transition-colors">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
          <path d={siApple.path} />
        </svg>
        <span className="font-sans font-medium text-xs tracking-tight">Apple</span>
      </div>
    )
  },
  {
    name: 'Sony',
    cat: 'Electronics',
    render: () => (
      <span className="font-serif font-bold text-xs tracking-[0.24em] text-neutral-800 hover:text-black transition-colors">
        SONY
      </span>
    )
  },
  {
    name: 'Bose',
    cat: 'Electronics',
    render: () => (
      <span className="font-serif italic font-bold text-xs tracking-[0.18em] text-neutral-800 hover:text-black transition-colors">
        BOSE
      </span>
    )
  },
  {
    name: 'Nike',
    cat: 'Shoes',
    render: () => (
      <div className="flex items-center gap-1.5 text-neutral-800 hover:text-black transition-colors">
        <svg viewBox="0 0 24 24" className="h-4 w-7 fill-current">
          <path d={siNike.path} />
        </svg>
        <span className="font-sans font-black text-xs tracking-wider italic">NIKE</span>
      </div>
    )
  },
  {
    name: 'Adidas',
    cat: 'Shoes',
    render: () => (
      <div className="flex items-center gap-1.5 text-neutral-800 hover:text-black transition-colors">
        <svg viewBox="0 0 24 24" className="h-4 w-5 fill-current">
          <path d={siAdidas.path} />
        </svg>
        <span className="font-sans font-bold text-xs tracking-wide">adidas</span>
      </div>
    )
  },
  {
    name: 'Hidesign',
    cat: 'Bags & Wallets',
    render: () => (
      <span className="font-serif font-bold text-xs tracking-[0.2em] text-neutral-800 hover:text-black transition-colors">
        HIDESIGN
      </span>
    )
  },
  {
    name: 'Ray-Ban',
    cat: 'Fashion Accessories',
    render: () => (
      <span className="font-serif italic font-black text-xs tracking-tight text-neutral-800 hover:text-black transition-colors">
        Ray•Ban
      </span>
    )
  },
  {
    name: 'Zara',
    cat: 'Clothes & Fashion',
    render: () => (
      <span className="font-serif font-bold text-xs tracking-[0.28em] text-neutral-800 hover:text-black transition-colors">
        ZARA
      </span>
    )
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(() => getProducts());
  const [toastMessage, setToastMessage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sync category list dynamically
  const [categoryList, setCategoryList] = useState(() => {
    const storedCats = getCategories();
    const bannerNames = new Set(defaultCategoryBanners.map((b) => b.name.toLowerCase()));
    const customBanners = storedCats
      .filter((cat) => !bannerNames.has(cat.toLowerCase()))
      .map((cat) => ({
        name: cat,
        description: `Explore ${cat} Collection`,
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
        tag: 'Curated'
      }));
    return [...defaultCategoryBanners, ...customBanners];
  });

  // Hero auto-slider timer (8 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Update listeners for real-time changes
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
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
          tag: 'Curated'
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
    setToastMessage(`Coupon code "${code}" copied to clipboard!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const activeHero = heroSlides[currentSlide];

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 overflow-x-clip selection:bg-neutral-900 selection:text-white">
      <Navbar />

      {/* Floating Alert Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-neutral-200 bg-white/95 backdrop-blur-md px-4 py-3 text-xs font-semibold text-neutral-900 shadow-xl animate-slide-up max-w-[calc(100vw-32px)]">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">✓</span>
          <span className="truncate">{toastMessage}</span>
          <Link
            to="/cart"
            className="ml-2 rounded-full bg-neutral-950 px-3 py-1 text-[11px] font-semibold text-white hover:bg-black transition shrink-0"
          >
            View Bag
          </Link>
        </div>
      )}

      {/* =========================================================
          1. CLEAN REFINED ANNOUNCEMENT STRIP
      ========================================================= */}
      <div className="w-full bg-neutral-950 text-white border-b border-neutral-800 py-2.5 px-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 truncate mx-auto sm:mx-0">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
            <span className="text-neutral-300 font-light truncate">
              Complimentary insured express shipping across India on prepaid orders above ₹2,000
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <span className="text-neutral-400">Special Offer:</span>
            <button
              type="button"
              onClick={(e) => handleCopyCode('KRISHNA10', e)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-3 py-0.5 text-[11px] font-mono font-semibold text-amber-300 border border-white/10 transition cursor-pointer"
              title="Click to copy coupon code"
            >
              <span>CODE: KRISHNA10 (10% OFF)</span>
              <span className="text-[10px]">📋</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          2. EDITORIAL ASYMMETRIC HERO SECTION
      ========================================================= */}
      <section className="relative w-full bg-white border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Narrative Column (7 cols on lg) */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <Reveal direction="down" delay={40}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-px w-6 bg-neutral-400" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                    {activeHero.tag}
                  </span>
                </div>
              </Reveal>

              <Reveal direction="up" delay={80}>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.08]">
                  <span>{activeHero.title}</span>
                  <span className="block mt-2 font-normal text-neutral-500 text-2xl sm:text-3xl lg:text-4xl">
                    {activeHero.accentText}
                  </span>
                </h1>
              </Reveal>

              <Reveal direction="up" delay={120}>
                <p className="mt-5 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-lg font-light">
                  {activeHero.description}
                </p>
              </Reveal>

              <Reveal direction="up" delay={160}>
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <Link
                    to={`/shop?category=${encodeURIComponent(activeHero.category)}`}
                    className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-7 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-neutral-800 transition-all duration-200 active:scale-95"
                  >
                    <span>Explore {activeHero.category}</span>
                    <ArrowRightIcon className="w-4 h-4 text-amber-300" />
                  </Link>

                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white hover:border-neutral-900 hover:bg-neutral-50 px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-800 transition-all duration-200 active:scale-95"
                  >
                    <span>All Collections</span>
                  </Link>
                </div>
              </Reveal>

              {/* 3 Minimal Reassurance Metrics */}
              <Reveal direction="up" delay={200}>
                <div className="mt-10 pt-6 border-t border-neutral-100 grid grid-cols-3 gap-3">
                  <div>
                    <span className="block text-xs sm:text-sm font-bold text-neutral-950">100% Verified</span>
                    <span className="text-[11px] text-neutral-400 font-normal">Authentic Sourcing</span>
                  </div>
                  <div>
                    <span className="block text-xs sm:text-sm font-bold text-neutral-950">Insured Delivery</span>
                    <span className="text-[11px] text-neutral-400 font-normal">BlueDart / Delhivery</span>
                  </div>
                  <div>
                    <span className="block text-xs sm:text-sm font-bold text-neutral-950">Haji Ali Boutique</span>
                    <span className="text-[11px] text-neutral-400 font-normal">Mumbai Flagship</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Visual Image Showcase (5 cols on lg) */}
            <div className="lg:col-span-6 relative">
              <Reveal direction="up" delay={100}>
                <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-3xl overflow-hidden border border-neutral-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] bg-neutral-100">
                  
                  {heroSlides.map((slide, idx) => (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="h-full w-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </div>
                  ))}

                  {/* Floating Glass Spec Card */}
                  <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between rounded-2xl bg-white/90 backdrop-blur-md p-4 border border-white/40 shadow-lg">
                    <div className="min-w-0 pr-3">
                      <span className="inline-block text-[9.5px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md mb-1">
                        {activeHero.specCard.badge}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-950 truncate">
                        {activeHero.specCard.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                        {activeHero.specCard.detail}
                      </p>
                    </div>

                    <Link
                      to={`/shop?category=${encodeURIComponent(activeHero.category)}`}
                      className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 text-white hover:bg-neutral-800 transition"
                      aria-label="View product"
                    >
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>

              {/* Slider Pagination Controls */}
              <div className="mt-4 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                        i === currentSlide ? 'w-8 bg-neutral-950' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>

                <span className="text-xs font-mono font-medium text-neutral-400">
                  0{currentSlide + 1} / 0{heroSlides.length}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          3. MINIMALIST MONOCHROME BRAND BAR
      ========================================================= */}
      <section className="border-b border-neutral-200/80 bg-[#FBFBFC] py-6 sm:py-8 overflow-hidden select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 overflow-x-auto no-scrollbar py-2 opacity-80 hover:opacity-100 transition-opacity">
            {brandLogos.map((brand, idx) => (
              <Link
                key={`brand-${brand.name}-${idx}`}
                to={`/shop?category=${encodeURIComponent(brand.cat)}&brand=${encodeURIComponent(brand.name)}`}
                className="shrink-0 px-4 py-2 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-200"
                title={`${brand.name} • ${brand.cat}`}
              >
                {brand.render()}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          4. CURATED DEPARTMENTS (EDITORIAL GRID)
      ========================================================= */}
      <ShopByCategorySection
        categories={categoryList}
        getProductCount={(catName) => products.filter((p) => p.category?.toLowerCase() === catName.toLowerCase()).length}
      />

      {/* =========================================================
          5. FEATURED & TRENDING CATALOG (UNIFIED TABBED SHOWCASE)
      ========================================================= */}
      <div className="border-t border-neutral-200/80 bg-white">
        <FeaturedTrendingSection
          products={products}
          onToast={setToastMessage}
        />
      </div>

      {/* =========================================================
          6. DUAL EDITORIAL SPOTLIGHT (TIMEPIECES & LEATHER)
      ========================================================= */}
      <div className="border-t border-neutral-200/80 bg-[#FAFAFB]">
        <EditorialSpotlightSection />
      </div>

      {/* =========================================================
          7. SHOP BY BUDGET (MINIMAL TIER DISCOVERY)
      ========================================================= */}
      <ProductsByPriceSection
        products={products}
        onAddToCart={(p) => {
          addToCart(p, 1, p.colors?.[0] || '', p.variants?.[0] || '');
          setToastMessage(`Added "${p.name}" to shopping bag`);
          setTimeout(() => setToastMessage(''), 3500);
        }}
        onBuyNow={(p) => {
          addToCart(p, 1, p.colors?.[0] || '', p.variants?.[0] || '');
          navigate('/checkout');
        }}
      />

      {/* =========================================================
          8. THE KRISHNA STANDARD (BOUTIQUE ASSURANCE PILLARS)
      ========================================================= */}
      <div className="border-t border-neutral-200/80 bg-[#FAFAFB]">
        <WhyChooseUsSection />
      </div>

      {/* =========================================================
          9. VERIFIED CUSTOMER REVIEWS & TESTIMONIALS
      ========================================================= */}
      <div className="border-t border-neutral-200/80 bg-white">
        <CustomerReviewsSection />
      </div>

      {/* =========================================================
          10. PRIVÉ CIRCLE NEWSLETTER & WELCOME VOUCHER
      ========================================================= */}
      <div className="border-t border-neutral-200/80 bg-[#FAFAFB]">
        <InstagramClubSection />
      </div>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <Footer />
    </div>
  );
}