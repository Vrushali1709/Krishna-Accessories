// src/pages/Home.jsx
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  siAdidas,
  siApple,
  siDell,
  siGarmin,
  siNike,
  siPuma,
  siRazer
} from 'simple-icons';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CustomerReviewsSection from '../components/CustomerReviewsSection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import { getProducts, getCategories, getBrands } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  TruckIcon,
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
// LUXURY HERO SLIDES
// ============================================================
const watchHeroSlides = [
  {
    tag: 'EXCLUSIVE TIMEPIECES',
    titleLine1: 'PRECISION.',
    titleLine2: 'CRAFTED FOR TIME.',
    description: 'Discover certified authentic Swiss chronographs and iconic luxury accessories engineered for distinction.',
    image: 'https://i.pinimg.com/736x/80/4d/7c/804d7c5ba3d69a866d1303f94299d564.jpg',
    primaryCta: 'Shop Watches',
    primaryLink: '/shop?category=Watches',
    secondaryCta: 'Explore Novelties',
    secondaryLink: '/new-arrivals'
  },
  {
    tag: 'LIMITED EDITION HERITAGE',
    titleLine1: 'HERITAGE.',
    titleLine2: 'SWISS CHRONOGRAPHS.',
    description: 'Engineered for absolute accuracy, sapphire crystal durability, and prestigious timeless aesthetics.',
    image: 'https://i.pinimg.com/736x/e6/df/98/e6df982c03d41dbf66fe9470007838c2.jpg',
    primaryCta: 'View Chronographs',
    primaryLink: '/shop?category=Watches',
    secondaryCta: 'All Collections',
    secondaryLink: '/shop'
  },
  {
    tag: 'AUTOMATIC MASTERPIECES',
    titleLine1: 'TIMELESS.',
    titleLine2: 'LUXURY ESSENTIALS.',
    description: 'From bespoke leather goods to audiophile acoustic gear, elevate your lifestyle with genuine craftsmanship.',
    image: 'https://i.pinimg.com/736x/52/cc/2a/52cc2a9343298c070a2e66503a60b5cc.jpg',
    primaryCta: 'Shop Collections',
    primaryLink: '/shop',
    secondaryCta: 'Best Sellers',
    secondaryLink: '/shop?sort=rating'
  }
];

// ============================================================
// STORE TICKER ITEMS (INFINITE MARQUEE)
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
// TRUST & VALUE BENEFITS
// ============================================================
const trustBenefits = [
  {
    icon: ShieldCheckIcon,
    title: '100% Authentic Guarantee',
    subtitle: 'Every piece verified genuine'
  },
  {
    icon: TruckIcon,
    title: 'Insured Express Logistics',
    subtitle: 'Fast, trackable pan-India dispatch'
  },
  {
    icon: RefreshIcon,
    title: '7-Day Replacement',
    subtitle: 'Hassle-free guarantee'
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Concierge Support',
    subtitle: 'Direct advisor assistance'
  }
];

// ============================================================
// BRAND LOGO RENDER MAP (Predefined vector logos)
// ============================================================
const KNOWN_BRAND_LOGOS = {
  titan: () => (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <svg viewBox="0 0 32 32" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-950 fill-current">
        <path d="M5 8h22v4h-8.5v16h-5V12H5V8z M16 1.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
      </svg>
      <span className="font-sans font-bold text-xs sm:text-sm tracking-[0.2em] text-gray-950">TITAN</span>
    </div>
  ),
  rolex: () => (
    <div className="flex flex-col items-center justify-center">
      <svg viewBox="0 0 24 14" className="h-4 sm:h-5 w-6 sm:w-7 text-[#006039] fill-current">
        <path d="M12 1l2.2 4.5 3.8-3 1.5 5.5-3.5 1.5 4.5 3H3.5l4.5-3-3.5-1.5 1.5-5.5 3.8 3L12 1zm-5 11.5h10V14H7v-1.5z" />
      </svg>
      <span className="font-serif font-bold text-[10px] sm:text-xs tracking-[0.25em] text-[#006039] leading-tight mt-0.5">ROLEX</span>
    </div>
  ),
  fossil: () => (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-[#3D2314] text-white font-sans font-black text-[10px] sm:text-xs shadow-2xs">F</span>
      <span className="font-sans font-black text-xs sm:text-sm tracking-[0.16em] text-gray-950">FOSSIL</span>
    </div>
  ),
  casio: () => (
    <span className="font-sans font-black text-sm sm:text-base md:text-lg tracking-[0.12em] text-[#003B95]">CASIO</span>
  ),
  nike: () => (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-8 sm:w-10 fill-current text-gray-950">
        <path d={siNike.path} />
      </svg>
      <span className="font-sans font-black text-xs sm:text-sm tracking-[0.15em] text-gray-950 italic hidden sm:inline">NIKE</span>
    </div>
  ),
  adidas: () => (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-6 sm:w-7 fill-current text-gray-950">
        <path d={siAdidas.path} />
      </svg>
      <span className="font-sans font-bold text-xs sm:text-sm tracking-wide text-gray-950">adidas</span>
    </div>
  ),
  apple: () => (
    <div className="flex items-center gap-1 sm:gap-1.5">
      <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-5 sm:w-6 fill-current text-gray-950">
        <path d={siApple.path} />
      </svg>
      <span className="font-sans font-semibold text-xs sm:text-sm tracking-tight text-gray-950">Apple</span>
    </div>
  ),
  samsung: () => (
    <span className="font-sans font-black text-xs sm:text-sm md:text-[15px] tracking-[0.2em] text-[#034EA2]">SAMSUNG</span>
  ),
  puma: () => (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-6 sm:w-7 fill-current text-[#111827]">
        <path d={siPuma.path} />
      </svg>
      <span className="font-sans font-black text-xs sm:text-sm tracking-[0.16em] text-[#111827]">PUMA</span>
    </div>
  ),
  sony: () => (
    <span className="font-serif font-black text-sm sm:text-base md:text-lg tracking-[0.22em] text-gray-950">SONY</span>
  ),
  bose: () => (
    <span className="font-serif italic font-black text-sm sm:text-base md:text-lg tracking-[0.16em] text-gray-950">BOSE</span>
  ),
  dell: () => (
    <div className="flex items-center gap-1.5">
      <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-5 sm:w-6 fill-current text-[#0076CE]">
        <path d={siDell.path} />
      </svg>
      <span className="font-sans font-bold text-xs sm:text-sm tracking-[0.14em] text-[#0076CE]">DELL</span>
    </div>
  ),
  zara: () => (
    <span className="font-serif font-black text-sm sm:text-base md:text-lg tracking-[0.28em] text-gray-950">ZARA</span>
  ),
  hidesign: () => (
    <div className="flex items-center gap-1.5">
      <span className="text-amber-800 text-xs sm:text-sm">🦌</span>
      <span className="font-serif font-bold text-xs sm:text-sm tracking-[0.2em] text-gray-900">HIDESIGN</span>
    </div>
  ),
  'ray-ban': () => (
    <span className="font-serif italic font-black text-sm sm:text-base md:text-lg text-[#E31837] tracking-tight">Ray•Ban</span>
  ),
  razer: () => (
    <div className="flex items-center gap-1.5">
      <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-5 sm:w-6 fill-current text-[#00E700]">
        <path d={siRazer.path} />
      </svg>
      <span className="font-sans font-black text-xs sm:text-sm tracking-[0.18em] text-gray-900">RAZER</span>
    </div>
  ),
  garmin: () => (
    <div className="flex items-center gap-1.5">
      <svg viewBox="0 0 24 24" className="h-5 sm:h-6 w-5 sm:w-6 fill-current text-[#007CC3]">
        <path d={siGarmin.path} />
      </svg>
      <span className="font-sans font-bold text-xs sm:text-sm tracking-[0.16em] text-gray-900">GARMIN</span>
    </div>
  )
};

// Curated Collection blocks linking to filtered category shop views
const curatedStyleCollections = [
  {
    title: 'Heritage Chronographs',
    tagline: 'Swiss & Japanese Timepieces',
    description: 'Precision mechanical & automatic chronographs designed to make a statement.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900',
    link: '/shop?category=Watches',
    btnText: 'Explore Watches'
  },
  {
    title: 'Artisanal Leather Goods',
    tagline: 'Handcrafted Carrying Essentials',
    description: 'Full-grain leather backpacks, messenger bags, and sleek designer wallets.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900',
    link: '/shop?category=Bags%20%26%20Wallets',
    btnText: 'Shop Leather'
  },
  {
    title: 'Acoustic Sound & Tech',
    tagline: 'Audiophile Noise-Cancelling Gear',
    description: 'Flagship headphones, smart rings, and luxury smart gadgets for modern living.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900',
    link: '/shop?category=Electronics',
    btnText: 'Discover Audio'
  },
  {
    title: 'Modern Footwear & Style',
    tagline: 'Iconic Sneakers & Accessories',
    description: 'Curated luxury lifestyle footwear, polarized eyewear, and wardrobe staples.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900',
    link: '/shop?category=Shoes',
    btnText: 'Shop Footwear'
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(() => getProducts());
  const [brands, setBrands] = useState(() => getBrands());
  const [toastMessage, setToastMessage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Price Tier Active Tab State
  const [activePriceTier, setActivePriceTier] = useState('5000');

  // Category Carousel State
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  // New Arrivals Filter Tab
  const [newArrivalCategory, setNewArrivalCategory] = useState('All');

  // Sync Categories from store
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

  // Hero Auto-Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % watchHeroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  // Real-time Event Listeners for Admin updates
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
  const checkCategoryScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft: sLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(sLeft > 10);
    setCanScrollRight(sLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    checkCategoryScroll();
    el.addEventListener('scroll', checkCategoryScroll, { passive: true });
    window.addEventListener('resize', checkCategoryScroll);
    return () => {
      el.removeEventListener('scroll', checkCategoryScroll);
      window.removeEventListener('resize', checkCategoryScroll);
    };
  }, [checkCategoryScroll, categoryList]);

  const scrollCategoryCarousel = (direction) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cardWidth = container.firstElementChild?.clientWidth || 220;
    const scrollAmount = (cardWidth + 16) * 2;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleMouseDown = (e) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) setHasMoved(true);
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCategoryLinkClick = (e) => {
    if (hasMoved) {
      e.preventDefault();
    }
  };

  // Helper: Cart & Toast actions
  const handleAddToCart = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setToastMessage(`✓ Added "${product.name}" to your bag`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleBuyNow = (product) => {
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  // 1. Dynamic brand list with product count
  const brandListWithCounts = useMemo(() => {
    return brands.map((b) => {
      const count = products.filter(
        (p) => p.brand && p.brand.trim().toLowerCase() === b.trim().toLowerCase()
      ).length;
      return {
        name: b,
        count
      };
    });
  }, [brands, products]);

  // 2. New Arrivals (Latest additions)
  const newArrivals = useMemo(() => {
    let list = [...products];
    if (newArrivalCategory !== 'All') {
      list = list.filter((p) => p.category?.toLowerCase() === newArrivalCategory.toLowerCase());
    }
    return list.slice(0, 8);
  }, [products, newArrivalCategory]);

  // 3. Best Sellers (Sorted by rating / reviews / popularity)
  const bestSellers = useMemo(() => {
    const list = [...products];
    list.sort((a, b) => {
      const scoreA = (Number(a.rating) || 4.5) * 100 + (Number(a.reviews) || 0);
      const scoreB = (Number(b.rating) || 4.5) * 100 + (Number(b.reviews) || 0);
      return scoreB - scoreA;
    });
    return list.slice(0, 8);
  }, [products]);

  // 4. Products by Price Tiers
  const productsUnder5k = useMemo(() => {
    return products.filter((p) => Number(p.price) < 5000);
  }, [products]);

  const productsUnder10k = useMemo(() => {
    return products.filter((p) => Number(p.price) < 10000);
  }, [products]);

  const productsUnder15k = useMemo(() => {
    return products.filter((p) => Number(p.price) < 15000);
  }, [products]);

  const productsUnder20k = useMemo(() => {
    return products.filter((p) => Number(p.price) < 20000);
  }, [products]);

  const currentTierProducts = useMemo(() => {
    switch (activePriceTier) {
      case '5000':
        return productsUnder5k.slice(0, 8);
      case '10000':
        return productsUnder10k.slice(0, 8);
      case '15000':
        return productsUnder15k.slice(0, 8);
      case '20000':
        return productsUnder20k.slice(0, 8);
      default:
        return productsUnder5k.slice(0, 8);
    }
  }, [activePriceTier, productsUnder5k, productsUnder10k, productsUnder15k, productsUnder20k]);

  const priceTierMeta = {
    '5000': {
      title: 'Under ₹5,000',
      subtitle: 'Premium picks that fit your budget without compromising craftsmanship.',
      maxPrice: 5000,
      totalCount: productsUnder5k.length
    },
    '10000': {
      title: 'Under ₹10,000',
      subtitle: 'More style, more choice — high-precision accessories for daily refinement.',
      maxPrice: 10000,
      totalCount: productsUnder10k.length
    },
    '15000': {
      title: 'Under ₹15,000',
      subtitle: 'Elevate your collection with certified premium brands and materials.',
      maxPrice: 15000,
      totalCount: productsUnder15k.length
    },
    '20000': {
      title: 'Under ₹20,000',
      subtitle: 'Discover top-tier luxury favorites, Swiss timepieces, and flagship gear.',
      maxPrice: 20000,
      totalCount: productsUnder20k.length
    }
  };

  const getProductCountForCategory = (catName) => {
    return products.filter((p) => p.category?.toLowerCase() === catName.toLowerCase()).length;
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

      {/* ============================================================
          1. LUXURY HERO BANNER SECTION (AUTO-SLIDER)
      ============================================================ */}
      <section className="relative w-full overflow-hidden bg-[#070808] text-white border-b border-neutral-800 lg:h-[680px] lg:min-h-[680px]">
        <div className="absolute inset-0">
          {watchHeroSlides.map((slide, index) => (
            <div
              key={slide.titleLine1 + index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="absolute inset-0 lg:left-auto lg:right-0 lg:w-[56%] xl:w-[50%] 2xl:w-[46%] h-full w-full">
                <img
                  src={slide.image}
                  alt={slide.titleLine1}
                  className="h-full w-full object-cover object-[72%_center] sm:object-[68%_center] lg:object-center scale-[1.02] lg:scale-100 transition-transform duration-7000 ease-out"
                />
                <div className="hidden lg:block absolute inset-y-0 left-0 w-48 xl:w-64 bg-gradient-to-r from-[#070808] to-transparent pointer-events-none" />
              </div>

              {/* Refined Luxury Vignettes */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10 lg:from-[#070808] lg:via-[#070808]/90 lg:via-45% lg:to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/95 via-black/40 to-transparent lg:from-[#070808] lg:via-[#070808]/60 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,transparent_0%,rgba(0,0,0,0.1)_45%,rgba(0,0,0,0.4)_100%)] lg:bg-[radial-gradient(ellipse_at_75%_50%,transparent_30%,rgba(7,8,8,0.4)_75%,#070808_100%)] pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="relative z-20 mx-auto max-w-7xl w-full min-h-[560px] sm:min-h-[590px] lg:min-h-[680px] lg:h-full px-5 sm:px-8 lg:px-10 pt-16 sm:pt-20 lg:pt-0 pb-8 lg:pb-6 flex flex-col justify-between">
          <div className="max-w-[640px] lg:my-auto lg:py-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#C5A880]" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#D5C2A5]">
                {watchHeroSlides[currentSlide].tag}
              </span>
            </div>

            <h1 className="text-[42px] leading-[1.02] tracking-[-0.03em] font-semibold sm:text-5xl lg:text-[68px] xl:text-[74px]">
              <span className="block text-white font-sans">{watchHeroSlides[currentSlide].titleLine1}</span>
              <span className="block mt-1 font-light text-[#C9AB80] font-serif italic">
                {watchHeroSlides[currentSlide].titleLine2}
              </span>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-[#B0B2B8] max-w-md font-light leading-relaxed">
              {watchHeroSlides[currentSlide].description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={watchHeroSlides[currentSlide].primaryLink}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-black transition-all hover:bg-[#E5D7C5] hover:scale-102 active:scale-98 shadow-md"
              >
                <span>{watchHeroSlides[currentSlide].primaryCta}</span>
                <ArrowRightIcon className="w-4 h-4 text-black" />
              </Link>

              <Link
                to={watchHeroSlides[currentSlide].secondaryLink}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-black/40 backdrop-blur-md px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-white transition-all hover:border-neutral-400 hover:bg-black/70 hover:scale-102 active:scale-98"
              >
                <span>{watchHeroSlides[currentSlide].secondaryCta}</span>
              </Link>
            </div>
          </div>

          {/* Slide Navigation and Indicators */}
          <div className="flex items-center justify-between border-t border-neutral-800/80 pt-4">
            <div className="flex items-center gap-2">
              {watchHeroSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
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

      {/* ============================================================
          2. CONTINUOUS STORE TICKER (INFINITE MARQUEE)
      ============================================================ */}
      <div className="relative bg-[#07090E] text-white border-y border-neutral-800/90 py-3 sm:py-3.5 overflow-hidden select-none">
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

      {/* ============================================================
          3. LUXURY TRUST & VALUE STRIP
      ============================================================ */}
      <section className="bg-white border-b border-gray-200/80 py-5 sm:py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {trustBenefits.map(({ icon: Icon, title, subtitle }, index) => (
              <div
                key={title}
                className={`flex items-center gap-3.5 pt-3 sm:pt-0 ${index > 0 ? 'sm:pl-6' : ''}`}
              >
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-gray-50 border border-gray-200/80 text-gray-900 transition-transform duration-200 hover:scale-105">
                  <Icon className="h-5 w-5 text-gray-900" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-950 truncate tracking-tight">{title}</h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate mt-0.5">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          4. FEATURED BRANDS SECTION (DYNAMIC STORE BRANDS)
      ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:pt-14 pb-8 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B89758]" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-gray-500">
                Official Heritage & Global Makers
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
              Featured Brands
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-lg">
              Explore 100% certified authentic collections from iconic watchmakers and luxury houses.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-900 hover:text-black hover:underline group shrink-0"
          >
            <span>View All Brands</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Dynamic Brand Grid with Logo rendering & Product Counts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {brandListWithCounts.slice(0, 12).map((b) => {
            const normalized = b.name.toLowerCase().trim();
            const logoRenderer = KNOWN_BRAND_LOGOS[normalized];

            return (
              <Link
                key={b.name}
                to={`/shop?brand=${encodeURIComponent(b.name)}`}
                className="group relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-200 hover:-translate-y-1 hover:border-[#C5A880]/80 hover:shadow-md active:scale-98"
                title={`${b.name} (${b.count} products)`}
              >
                <div className="h-10 sm:h-12 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                  {logoRenderer ? (
                    logoRenderer()
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-950 text-white font-serif font-bold text-xs">
                        {b.name.charAt(0)}
                      </span>
                      <span className="font-serif font-bold text-xs sm:text-sm tracking-wider text-gray-900 uppercase">
                        {b.name}
                      </span>
                    </div>
                  )}
                </div>

                {b.count > 0 && (
                  <span className="mt-2 text-[10px] font-medium text-gray-400 group-hover:text-gray-700 transition-colors">
                    {b.count} {b.count === 1 ? 'product' : 'products'}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          5. SHOP BY CATEGORY (INTERACTIVE CAROUSEL)
      ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-gray-500">
                Curated Departments
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
              Shop by Category
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Discover curated luxury essentials tailored for your personal style.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Link
              to="/shop"
              className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-black hover:underline mr-2"
            >
              View All
            </Link>

            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollCategoryCarousel('left')}
                disabled={!canScrollLeft}
                aria-label="Previous categories"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                  canScrollLeft
                    ? 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-900 hover:text-white cursor-pointer active:scale-95 shadow-xs'
                    : 'border border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronLeftIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollCategoryCarousel('right')}
                disabled={!canScrollRight}
                aria-label="Next categories"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                  canScrollRight
                    ? 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-900 hover:text-white cursor-pointer active:scale-95 shadow-xs'
                    : 'border border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex gap-3.5 sm:gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categoryList.map((c) => {
            const count = getProductCountForCategory(c.name);
            return (
              <Link
                key={c.name}
                to={`/shop?category=${encodeURIComponent(c.name)}`}
                onClick={handleCategoryLinkClick}
                className="group relative flex-shrink-0 w-[210px] sm:w-[235px] md:w-[255px] lg:w-[265px] p-3 rounded-[24px] bg-white border border-gray-200/80 shadow-[0_4px_18px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.09)] transition-all duration-300 hover:-translate-y-1 snap-start flex flex-col justify-between"
              >
                <div className="relative w-full aspect-[1/0.95] overflow-hidden rounded-[18px] bg-gray-100">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-106 pointer-events-none"
                  />

                  <div className="absolute top-2.5 left-2.5 pointer-events-none">
                    <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-medium text-white border border-white/15 shadow-2xs">
                      {count > 0 ? `${count} ${count === 1 ? 'item' : 'items'}` : 'Top rated'}
                    </span>
                  </div>

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

                <div className="pt-3 pb-1 px-1 flex flex-col gap-2.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-[14.5px] font-bold text-gray-900 tracking-tight group-hover:text-black transition-colors truncate">
                      {c.name}
                    </h3>
                    <span className="text-[11px] text-gray-400 font-normal truncate max-w-[48%] text-right">
                      {c.tag || c.description}
                    </span>
                  </div>

                  <div className="w-full py-2 rounded-full bg-[#181a1f] group-hover:bg-black text-white text-[11px] sm:text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.98] shadow-2xs">
                    <span>Explore Collection</span>
                    <ArrowRightIcon className="w-3 h-3 text-white/80 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          6. NEW ARRIVALS SECTION (LATEST STORE NOVELTIES)
      ============================================================ */}
      <section className="bg-white border-y border-gray-200/80 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span className="text-[10.5px] font-mono font-medium uppercase tracking-[0.25em] text-neutral-500">
                  NEW SEASON / 2026
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
                New Arrivals
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-md">
                Fresh drops, newly engineered timepieces, and latest additions to the boutique.
              </p>
            </div>

            <Link
              to="/new-arrivals"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-900 hover:text-black hover:underline self-start md:self-auto group shrink-0"
            >
              <span>View All New Arrivals</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 sm:mb-8 no-scrollbar">
            {['All', 'Watches', 'Bags & Wallets', 'Shoes', 'Electronics', 'Mobiles', 'Fashion Accessories'].map(
              (cat) => {
                const isActive = newArrivalCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewArrivalCategory(cat)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gray-950 text-white shadow-sm scale-102'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black'
                    }`}
                  >
                    {cat === 'All' ? 'All New Arrivals' : cat}
                  </button>
                );
              }
            )}
          </div>

          {/* Responsive Products Grid */}
          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
              {newArrivals.map((product) => (
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
              <p className="text-sm font-semibold text-gray-700">No products found in this category.</p>
              <button
                type="button"
                onClick={() => setNewArrivalCategory('All')}
                className="mt-3 text-xs font-bold text-black underline cursor-pointer"
              >
                View all arrivals
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          7. CURATED COLLECTIONS / SHOP BY STYLE (EDITORIAL SHOWCASE)
      ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-16 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-[#B89758]">
            Curated For You
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-950">
            Signature Style Collections
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            Handpicked edits crafted for timeless elegance, daily utility, and elevated living.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {curatedStyleCollections.map((col) => (
            <Link
              key={col.title}
              to={col.link}
              className="group relative overflow-hidden rounded-[26px] bg-neutral-900 text-white min-h-[300px] sm:min-h-[340px] flex flex-col justify-end p-6 sm:p-8 border border-neutral-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <img
                src={col.image}
                alt={col.title}
                className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              <div className="relative z-10 max-w-md">
                <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-2.5 border border-white/20">
                  {col.tagline}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {col.title}
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-neutral-300 line-clamp-2 leading-relaxed">
                  {col.description}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-gray-950 transition-all group-hover:bg-[#E5D7C5]">
                  <span>{col.btnText}</span>
                  <ArrowRightIcon className="w-3.5 h-3.5 text-black transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================
          8. BEST SELLERS SECTION (TOP RATED & CUSTOMER FAVORITES)
      ============================================================ */}
      <section className="bg-white border-y border-gray-200/80 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-amber-900">
                  TOP PICKS & CLIENT FAVORITES
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
                Best Sellers
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-md">
                Customer favourites worth discovering — certified authentic pieces with glowing reviews.
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-900 hover:text-black hover:underline group shrink-0"
            >
              <span>View All Products</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={`bestseller-${product.id}`}
                product={product}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          9. SHOP BY PRICE TIERS (UNDER 5K, 10K, 15K, 20K)
      ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-16 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B89758]" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-gray-500">
                Budget & Value Curation
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
              Shop by Price
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-md">
              {priceTierMeta[activePriceTier].subtitle}
            </p>
          </div>

          <Link
            to={`/shop?maxPrice=${priceTierMeta[activePriceTier].maxPrice}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-900 hover:text-black hover:underline group shrink-0"
          >
            <span>View More {priceTierMeta[activePriceTier].title}</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Interactive Price Tier Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6 sm:mb-8">
          {[
            { id: '5000', label: 'Under ₹5,000', sub: 'Budget Luxury Picks', count: productsUnder5k.length },
            { id: '10000', label: 'Under ₹10,000', sub: 'Everyday Style', count: productsUnder10k.length },
            { id: '15000', label: 'Under ₹15,000', sub: 'Elevated Edits', count: productsUnder15k.length },
            { id: '20000', label: 'Under ₹20,000', sub: 'Flagship Creations', count: productsUnder20k.length }
          ].map((tier) => {
            const isActive = activePriceTier === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setActivePriceTier(tier.id)}
                className={`flex flex-col items-start p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gray-950 text-white border-gray-950 shadow-md scale-[1.02]'
                    : 'bg-white text-gray-900 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs sm:text-sm font-bold">{tier.label}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tier.count} items
                  </span>
                </div>
                <span
                  className={`mt-1 text-[11px] truncate w-full ${
                    isActive ? 'text-gray-300' : 'text-gray-400'
                  }`}
                >
                  {tier.sub}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filtered Products for the Active Price Tier */}
        {currentTierProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
            {currentTierProducts.map((product) => (
              <ProductCard
                key={`tier-${activePriceTier}-${product.id}`}
                product={product}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl bg-white border border-gray-200/80">
            <p className="text-sm font-semibold text-gray-700">
              No products found {priceTierMeta[activePriceTier].title}.
            </p>
            <Link
              to="/shop"
              className="mt-3 inline-block text-xs font-bold text-black underline cursor-pointer"
            >
              Browse all items in shop
            </Link>
          </div>
        )}
      </section>

      {/* ============================================================
          10. PROMOTIONAL PRIVÉ VOUCHER BANNER
      ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
        <div className="rounded-3xl bg-[#0B132B] text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="flex items-center gap-4 w-full md:w-auto z-10">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-xl border border-white/10 backdrop-blur-md">
              🎁
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                Exclusive Privé Reward
              </span>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight">
                Save 10% Instant Discount on Orders &gt; ₹1,000
              </h3>
              <p className="text-xs text-gray-300 mt-0.5 flex items-center gap-1.5">
                Apply coupon code at checkout:{' '}
                <strong className="text-white font-mono bg-white/15 px-2 py-0.5 rounded border border-white/20">
                  KRISHNA10
                </strong>
              </p>
            </div>
          </div>

          <Link
            to="/shop"
            className="w-full md:w-auto text-center rounded-full bg-white px-7 py-3 text-xs font-bold uppercase tracking-wider text-gray-950 hover:bg-[#E5D7C5] transition-all shrink-0 shadow-sm z-10"
          >
            Claim Offer Now →
          </Link>
        </div>
      </section>

      {/* ============================================================
          11. CUSTOMER REVIEWS & TESTIMONIALS
      ============================================================ */}
      <CustomerReviewsSection />

      {/* ============================================================
          12. WHY SHOP WITH US (THE DIFFERENCE)
      ============================================================ */}
      <WhyChooseUsSection />

      {/* ============================================================
          13. FOOTER
      ============================================================ */}
      <Footer />
    </div>
  );
}