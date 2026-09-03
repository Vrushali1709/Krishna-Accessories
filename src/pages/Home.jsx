import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import {
  ShieldCheckIcon,
  TruckIcon,
  StarIcon,
  ArrowRightIcon,
  BoxIcon
} from '../components/Icons';

const categoryBanners = [
  {
    name: 'Watches',
    description: 'Heritage Swiss & Smart Chronographs',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900',
    tag: 'Titan, Fossil, Rolex, Casio'
  },
  {
    name: 'Bags & Wallets',
    description: 'Genuine Leather & Urban Backpacks',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900',
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
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900',
    tag: 'Apple, Samsung, OnePlus'
  },
  {
    name: 'Laptops',
    description: 'High-Performance OLED Workstations',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900',
    tag: 'Apple, Dell, HP, Asus'
  },
  {
    name: 'Electronics',
    description: 'Audiophile Noise-Cancelling Sound',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900',
    tag: 'Sony, Bose, JBL, Marshall'
  }
];

const lookbookData = [
  {
    id: 'look-1',
    tag: 'Look 01',
    title: 'The Executive Connoisseur',
    subtitle: 'Swiss Horology & Handcrafted Leather',
    description: 'An impeccable sartorial statement combining automatic mechanical mastery, full-grain vegetable-tanned leather, and timeless prestige for boardroom confidence.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80',
    badge: 'Executive Capsule',
    hotspots: [
      {
        id: 'hs-1-1',
        x: 42,
        y: 50,
        productId: 1,
        fallbackName: 'Classic Luxury Automatic Watch',
        fallbackBrand: 'Titan',
        fallbackPrice: 4999,
        fallbackOldPrice: 6999,
        fallbackImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700',
        label: 'Automatic Timepiece',
        category: 'Watches'
      },
      {
        id: 'hs-1-2',
        x: 74,
        y: 68,
        productId: 7,
        fallbackName: 'Executive Top-Grain Leather Briefcase',
        fallbackBrand: 'Hidesign',
        fallbackPrice: 8499,
        fallbackOldPrice: 11999,
        fallbackImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700',
        label: 'Leather Briefcase',
        category: 'Bags & Wallets'
      },
      {
        id: 'hs-1-3',
        x: 28,
        y: 28,
        productId: 6,
        fallbackName: 'Heritage Chrono Automatic 1853',
        fallbackBrand: 'Tissot',
        fallbackPrice: 34999,
        fallbackOldPrice: 42999,
        fallbackImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=700',
        label: 'Heritage Powermatic',
        category: 'Watches'
      }
    ]
  },
  {
    id: 'look-2',
    tag: 'Look 02',
    title: 'Cosmopolitan & High-Fidelity',
    subtitle: 'Audiophile Sound & Tough Solar Horology',
    description: 'Engineered for modern creators demanding studio-grade noise isolation, light-powered Japanese solar chronographs, and rugged ballistic travel gear.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
    badge: 'Acoustic & Tech',
    hotspots: [
      {
        id: 'hs-2-1',
        x: 36,
        y: 35,
        productId: 18,
        fallbackName: 'WH-1000XM5 Wireless Noise-Cancelling Headphones',
        fallbackBrand: 'Sony',
        fallbackPrice: 26999,
        fallbackOldPrice: 34999,
        fallbackImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700',
        label: 'Flagship ANC Headphones',
        category: 'Electronics'
      },
      {
        id: 'hs-2-2',
        x: 64,
        y: 62,
        productId: 3,
        fallbackName: 'Edifice Tough Solar Chronograph',
        fallbackBrand: 'Casio',
        fallbackPrice: 9499,
        fallbackOldPrice: 12999,
        fallbackImage: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=700',
        label: 'Solar Chronograph',
        category: 'Watches'
      },
      {
        id: 'hs-2-3',
        x: 82,
        y: 34,
        productId: 8,
        fallbackName: 'Modern Urban Backpack Pro 32L',
        fallbackBrand: 'Wildcraft',
        fallbackPrice: 2499,
        fallbackOldPrice: 3499,
        fallbackImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700',
        label: 'Urban Backpack 32L',
        category: 'Bags & Wallets'
      }
    ]
  },
  {
    id: 'look-3',
    tag: 'Look 03',
    title: 'Sartorial Leisure & Sport',
    subtitle: 'Ceramic Diver Caliber & Tumbled Leather',
    description: 'Effortless weekend luxury pairing perpetual automatic craftsmanship with iconic high-top silhouettes and structured monogram accessories.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=80',
    badge: 'Prestige Weekend',
    hotspots: [
      {
        id: 'hs-3-1',
        x: 32,
        y: 52,
        productId: 4,
        fallbackName: 'Submariner Luxury Tribute Edition',
        fallbackBrand: 'Rolex',
        fallbackPrice: 18999,
        fallbackOldPrice: 24999,
        fallbackImage: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=700',
        label: 'Ceramic Diver Caliber',
        category: 'Watches'
      },
      {
        id: 'hs-3-2',
        x: 66,
        y: 72,
        productId: 13,
        fallbackName: 'Retro High OG Leather Sneakers',
        fallbackBrand: 'Jordan',
        fallbackPrice: 14999,
        fallbackOldPrice: 17999,
        fallbackImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=700',
        label: 'Retro High OG Leather',
        category: 'Shoes'
      },
      {
        id: 'hs-3-3',
        x: 78,
        y: 38,
        productId: 9,
        fallbackName: 'Signature Monogram Tote Bag',
        fallbackBrand: 'Tommy Hilfiger',
        fallbackPrice: 6999,
        fallbackOldPrice: 9999,
        fallbackImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700',
        label: 'Signature Monogram Tote',
        category: 'Bags & Wallets'
      }
    ]
  }
];

const showcaseTabs = [
  { id: 'all', label: '✨ Curated Highlights', filterType: 'all' },
  { id: 'trending', label: '🔥 Trending Now', filterType: 'trending' },
  { id: 'bestsellers', label: '👑 Best Sellers (4.8★+)', filterType: 'bestsellers' },
  { id: 'Watches', label: '⏱ Swiss & Heritage Watches', filterType: 'category', category: 'Watches' },
  { id: 'Bags & Wallets', label: '💼 Handcrafted Leather', filterType: 'category', category: 'Bags & Wallets' },
  { id: 'Tech', label: '🎧 Flagship Tech & Audio', filterType: 'categoryList', categories: ['Electronics', 'Mobiles', 'Laptops', 'Smart Gadgets'] },
  { id: 'Shoes', label: '👟 Prestige Footwear', filterType: 'category', category: 'Shoes' }
];

const partnerBrands = [
  { name: 'Titan', cat: 'Watches' },
  { name: 'Fossil', cat: 'Watches' },
  { name: 'Rolex', cat: 'Watches' },
  { name: 'Casio', cat: 'Watches' },
  { name: 'Nike', cat: 'Shoes' },
  { name: 'Adidas', cat: 'Shoes' },
  { name: 'Hidesign', cat: 'Bags & Wallets' },
  { name: 'Apple', cat: 'Mobiles' },
  { name: 'Samsung', cat: 'Mobiles' },
  { name: 'Sony', cat: 'Electronics' },
  { name: 'Bose', cat: 'Electronics' },
  { name: 'Dell', cat: 'Laptops' }
];

const clientReviews = [
  {
    name: 'Vikramaditya Shah',
    location: 'Mumbai',
    product: 'Titan Automatic & Hidesign Leather',
    text: 'Impeccable craftsmanship and packaging. The timepiece arrived in pristine presentation with authentic certification documents. Unmatched concierge service.',
    rating: 5
  },
  {
    name: 'Aanya Singhania',
    location: 'Ahmedabad',
    product: 'Sony WH-1000XM5 & Tommy Tote',
    text: 'The curated lookbook feature made shopping effortless. The product quality exceeds standard retail and the insured express air delivery was flawless.',
    rating: 5
  },
  {
    name: 'Rajesh Mehta',
    location: 'Bengaluru',
    product: 'Rolex Submariner Edition & Jordan OG',
    text: 'Genuine luxury consignment at fair market values. Exceptional attention to authenticity and detail. Krishna Accessories is my top choice.',
    rating: 5
  }
];

export default function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState(() => getProducts());
  const [toastMessage, setToastMessage] = useState('');

  // Lookbook State
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [activeHotspotId, setActiveHotspotId] = useState(lookbookData[0].hotspots[0].id);

  // Curated Showcase Dynamic Tab
  const [activeTab, setActiveTab] = useState('all');

  // Limited-Time Private Sale Countdown
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 18
  });

  // Newsletter Email State
  const [priveEmail, setPriveEmail] = useState('');
  const [priveSubscribed, setPriveSubscribed] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setProducts(getProducts());
    window.addEventListener('productsUpdated', handleUpdate);
    return () => window.removeEventListener('productsUpdated', handleUpdate);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds -= 1;
        } else if (minutes > 0) {
          minutes -= 1;
          seconds = 59;
        } else if (hours > 0) {
          hours -= 1;
          minutes = 59;
          seconds = 59;
        } else {
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product) => {
    if (!getCurrentUser()) {
      navigate('/login', {
        state: {
          from: '/',
          message: 'Please sign in to add items to your shopping bag.',
          requiredRole: 'customer'
        }
      });
      return;
    }

    addToCart(
      product,
      1,
      product.colors?.[0] || '',
      product.variants?.[0] || ''
    );

    setToastMessage(`✓ Added "${product.name}" to your bag`);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleBuyNow = (product) => {
    if (!getCurrentUser()) {
      navigate('/login', {
        state: {
          from: '/checkout',
          message: 'Please sign in to complete your purchase.',
          requiredRole: 'customer'
        }
      });
      return;
    }

    addToCart(
      product,
      1,
      product.colors?.[0] || '',
      product.variants?.[0] || ''
    );

    navigate('/checkout');
  };

  // Resolve product data for lookbook hotspot
  const resolveProduct = (hotspot) => {
    const match = products.find((p) => p.id === hotspot.productId);
    if (match) return match;
    return {
      id: hotspot.productId,
      name: hotspot.fallbackName,
      brand: hotspot.fallbackBrand,
      price: hotspot.fallbackPrice,
      oldPrice: hotspot.fallbackOldPrice,
      image: hotspot.fallbackImage,
      category: hotspot.category,
      rating: 4.8,
      reviews: 95
    };
  };

  // Add all pieces in current lookbook ensemble to cart
  const handleAddEnsembleToBag = (look) => {
    if (!getCurrentUser()) {
      navigate('/login', {
        state: {
          from: '/',
          message: 'Please sign in to add this luxury ensemble to your bag.',
          requiredRole: 'customer'
        }
      });
      return;
    }

    look.hotspots.forEach((hs) => {
      const prod = resolveProduct(hs);
      addToCart(prod, 1, prod.colors?.[0] || '', prod.variants?.[0] || '');
    });

    setToastMessage(`✓ Complete 3-piece "${look.title}" ensemble added to bag!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Filter products for Unified Dynamic Showcase
  const currentTabConfig = showcaseTabs.find((t) => t.id === activeTab) || showcaseTabs[0];
  const filteredShowcaseProducts = products.filter((p) => {
    if (currentTabConfig.filterType === 'trending') {
      return (Number(p.reviews) >= 80 || p.discount >= 25);
    }
    if (currentTabConfig.filterType === 'bestsellers') {
      return (Number(p.rating) >= 4.7 && Number(p.reviews) >= 50) || p.price > 8000;
    }
    if (currentTabConfig.filterType === 'category') {
      return p.category === currentTabConfig.category;
    }
    if (currentTabConfig.filterType === 'categoryList') {
      return currentTabConfig.categories.includes(p.category);
    }
    return true;
  }).slice(0, 8);

  const activeLook = lookbookData[activeLookIndex];
  const activeHotspot = activeLook.hotspots.find((h) => h.id === activeHotspotId) || activeLook.hotspots[0];
  const activeSpotProduct = resolveProduct(activeHotspot);

  // Total value for active ensemble
  const ensembleTotalValue = activeLook.hotspots.reduce((sum, hs) => {
    const p = resolveProduct(hs);
    return sum + (Number(p.price) || 0);
  }, 0);

  const formatTime = (value) => String(value).padStart(2, '0');

  const handlePriveSubmit = (e) => {
    e.preventDefault();
    if (priveEmail) {
      setPriveSubscribed(true);
      setPriveEmail('');
      setTimeout(() => setPriveSubscribed(false), 5000);
    }
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#FAFAFB] text-gray-900">
      <Navbar />

      {/* Floating Alert Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-32px)] items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-900 shadow-xl animate-slide-up">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-700">
            ✓
          </span>
          <span className="truncate">{toastMessage}</span>
          <Link
            to="/cart"
            className="ml-1 shrink-0 rounded-full bg-[#111827] px-2.5 py-1 text-[10px] font-semibold text-white transition hover:bg-black"
          >
            Bag
          </Link>
        </div>
      )}

      {/* =========================================================
          1. EDITORIAL LUXURY HERO SECTION
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-gray-200/80 bg-gradient-to-b from-[#FDFBF7] via-[#FAF9F5] to-white">
        <div className="mx-auto flex min-h-[460px] max-w-7xl items-center px-4 py-8 sm:px-6 sm:py-12 lg:min-h-[520px] lg:px-8">
          <div className="grid w-full items-center gap-8 lg:grid-cols-12 lg:gap-12">

            <div className="mx-auto max-w-xl text-center lg:col-span-5 lg:mx-0 lg:text-left">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-white px-3 py-1 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#B89758]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-800 sm:text-[10px]">
                  Authorized Retailer & Luxury Consignment
                </span>
              </div>

              <h1 className="text-3xl font-bold leading-[1.14] tracking-tight text-gray-950 sm:text-4xl lg:text-[44px]">
                Curated Luxury
                <br />
                <span className="font-serif italic font-normal text-[#B89758]">
                  Timepieces & Essentials
                </span>
              </h1>

              <p className="mx-auto mt-3.5 max-w-md text-xs leading-relaxed text-gray-600 sm:text-[13.5px] lg:mx-0">
                Direct access to brand-certified Swiss and heritage watches, handcrafted leather bags, performance sneakers, and flagship technology with 100% verified authenticity and complimentary insured air shipping.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 lg:justify-start">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0F172A] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:scale-[1.02] hover:bg-black sm:px-6 sm:py-3 sm:text-sm"
                >
                  Explore Catalog
                  <ArrowRightIcon className="h-3.5 w-3.5 text-white" />
                </Link>

                <Link
                  to="/shop?category=Watches"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-900 shadow-sm transition hover:bg-gray-100 sm:px-6 sm:py-3 sm:text-sm"
                >
                  Watch Collections
                </Link>
              </div>

              {/* Service Highlights Metrics */}
              <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3 border-t border-gray-200/80 pt-5 lg:mx-0">
                <div>
                  <p className="text-base font-bold text-gray-950 sm:text-xl">
                    100%
                  </p>
                  <p className="text-[9.5px] font-medium text-gray-500 sm:text-[10px]">
                    Genuine Authenticity
                  </p>
                </div>

                <div className="border-x border-gray-200/80 px-2 sm:px-3">
                  <p className="text-base font-bold text-gray-950 sm:text-xl">
                    ₹2,000+
                  </p>
                  <p className="text-[9.5px] font-medium text-gray-500 sm:text-[10px]">
                    Free Insured Air
                  </p>
                </div>

                <div>
                  <p className="text-base font-bold text-gray-950 sm:text-xl">
                    7 Days
                  </p>
                  <p className="text-[9.5px] font-medium text-gray-500 sm:text-[10px]">
                    Return Privilege
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full lg:col-span-7">
              <div className="group rounded-2xl border border-gray-200 bg-white p-2 shadow-xl sm:rounded-3xl sm:p-2.5">
                <div className="overflow-hidden rounded-xl sm:rounded-2xl">
                  <img
                    src="/images/hero-luxury-bright.jpg"
                    alt="Curated Luxury Collection"
                    className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                  />
                </div>

                <div className="mt-2.5 flex items-center justify-between gap-3 rounded-xl border border-gray-200/80 bg-[#FAF9F6] px-3 py-2.5 sm:px-4">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-200/60 bg-amber-50 text-xs text-amber-600">
                      ★
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-bold uppercase tracking-wider text-gray-900 sm:text-[11.5px]">
                        Curated Heritage Showcase
                      </p>

                      <p className="truncate text-[9px] text-gray-500 sm:text-[10px]">
                        Swiss Timepieces &bull; Handcrafted Leather &bull; Curated Goods
                      </p>
                    </div>
                  </div>

                  <span className="hidden shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wider text-[#B89758] sm:inline-flex">
                    100% Authentic
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          2. FOUR PILLARS GUARANTEE
      ========================================================= */}
      <section className="border-b border-gray-200/80 bg-white py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-4">

            <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-gray-200/70 bg-[#F8F9FA] p-3 transition hover:border-gray-300">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-200/80 text-gray-900">
                <ShieldCheckIcon className="h-3.5 w-3.5" />
              </div>

              <div className="min-w-0">
                <h4 className="truncate text-[10.5px] font-semibold uppercase tracking-wider text-gray-950">
                  Certified Authentic
                </h4>
                <p className="truncate text-[9px] text-gray-500 sm:text-[9.5px]">
                  Official brand warranty
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-gray-200/70 bg-[#F8F9FA] p-3 transition hover:border-gray-300">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-200/80 text-gray-900">
                <TruckIcon className="h-3.5 w-3.5" />
              </div>

              <div className="min-w-0">
                <h4 className="truncate text-[10.5px] font-semibold uppercase tracking-wider text-gray-950">
                  Express Dispatch
                </h4>
                <p className="truncate text-[9px] text-gray-500 sm:text-[9.5px]">
                  Free on orders &ge; ₹2,000
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-gray-200/70 bg-[#F8F9FA] p-3 transition hover:border-gray-300">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-200/80 text-gray-900">
                <BoxIcon className="h-3.5 w-3.5" />
              </div>

              <div className="min-w-0">
                <h4 className="truncate text-[10.5px] font-semibold uppercase tracking-wider text-gray-950">
                  Secure Packaging
                </h4>
                <p className="truncate text-[9px] text-gray-500 sm:text-[9.5px]">
                  Multi-point inspected
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-gray-200/70 bg-[#F8F9FA] p-3 transition hover:border-gray-300">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-200/80 text-gray-900">
                <StarIcon className="h-3.5 w-3.5" />
              </div>

              <div className="min-w-0">
                <h4 className="truncate text-[10.5px] font-semibold uppercase tracking-wider text-gray-950">
                  Concierge Desk
                </h4>
                <p className="truncate text-[9px] text-gray-500 sm:text-[9.5px]">
                  Ahmedabad flagship
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          3. CURATED COLLECTIONS (DEPARTMENTS)
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">
              Departments
            </span>

            <h2 className="mt-0.5 text-lg font-bold tracking-tight text-gray-950 sm:text-xl">
              Curated Collections
            </h2>
          </div>

          <Link
            to="/shop"
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-gray-900 hover:underline"
          >
            <span>View All</span>
            <ArrowRightIcon className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3.5 lg:grid-cols-6">
          {categoryBanners.map((category) => (
            <Link
              key={category.name}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group relative aspect-[0.85] overflow-hidden rounded-xl border border-gray-200/80 bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-lg"
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute inset-x-2 bottom-2">
                <h3 className="truncate text-xs font-bold text-white">
                  {category.name}
                </h3>

                <p className="truncate text-[9px] text-gray-300">
                  {category.tag}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================
          4. SHOP THE LOOK • INTERACTIVE EDITORIAL LOOKBOOK
      ========================================================= */}
      <section className="bg-gradient-to-b from-[#F8F9FA] via-white to-[#F8F9FA] py-10 sm:py-14 border-y border-gray-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-500/20 px-2.5 py-0.5 mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B89758]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#8C6734]">Editorial Style Guide</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
                Shop The Look <span className="font-serif italic font-normal text-[#B89758]">&bull; Interactive Lookbook</span>
              </h2>
              <p className="mt-1 text-xs text-gray-600 max-w-xl">
                Explore fully coordinated luxury ensembles. Hover or tap the pulsating markers to preview pieces, or acquire the complete curated set.
              </p>
            </div>

            {/* Look Switcher Pills */}
            <div className="flex items-center gap-1.5 bg-gray-100/90 p-1 rounded-full border border-gray-200 self-start md:self-auto overflow-x-auto max-w-full">
              {lookbookData.map((look, idx) => (
                <button
                  key={look.id}
                  type="button"
                  onClick={() => {
                    setActiveLookIndex(idx);
                    setActiveHotspotId(look.hotspots[0].id);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${activeLookIndex === idx
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-950 hover:bg-white/60'
                    }`}
                >
                  {look.tag}: {look.badge}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Lookbook Main Container */}
          <div className="grid lg:grid-cols-12 gap-6 items-stretch">

            {/* Left Col (7 Cols): Editorial Stage with Hotspots */}
            <div className="lg:col-span-7 relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200 bg-black shadow-lg min-h-[440px] sm:min-h-[520px]">
              <img
                src={activeLook.image}
                alt={activeLook.title}
                className="absolute inset-0 h-full w-full object-cover opacity-90 transition-all duration-700 hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />

              {/* Lookbook Top Badge */}
              <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-900 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {activeLook.tag} &bull; {activeLook.title}
                </span>
                <span className="rounded-full bg-black/50 backdrop-blur-md px-2.5 py-1 text-[9.5px] font-medium text-white/90 border border-white/20">
                  Tap &bull; Hotspots
                </span>
              </div>

              {/* Interactive Hotspots Layer */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                {activeLook.hotspots.map((hs) => {
                  const isSelected = activeHotspotId === hs.id;
                  return (
                    <div
                      key={hs.id}
                      style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveHotspotId(hs.id)}
                        onMouseEnter={() => setActiveHotspotId(hs.id)}
                        aria-label={`View ${hs.label}`}
                        className={`group relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full transition-all duration-200 ${isSelected
                          ? 'bg-[#B89758] text-white ring-4 ring-amber-400/40 scale-110 shadow-lg'
                          : 'bg-white/95 text-gray-950 hover:bg-[#B89758] hover:text-white shadow-md animate-radar'
                          }`}
                      >
                        <span className="text-xs font-bold leading-none">
                          {isSelected ? '✓' : '+'}
                        </span>

                        <span className="pointer-events-none absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 hidden sm:group-hover:flex items-center whitespace-nowrap rounded-md bg-gray-950 px-2 py-0.5 text-[9.5px] font-semibold text-white shadow-md border border-gray-800">
                          {hs.label}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Floating Hotspot Live Preview Card */}
              <div className="relative z-20 p-4 sm:p-6">
                <div className="rounded-2xl border border-white/25 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 text-gray-900 shadow-2xl animate-fade-in">
                  <div className="flex items-center gap-3.5">
                    <Link
                      to={`/product/${activeSpotProduct.id}`}
                      className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 p-1.5 border border-gray-200/80 group"
                    >
                      <img
                        src={activeSpotProduct.image || activeSpotProduct.images?.[0]}
                        alt={activeSpotProduct.name}
                        className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-108"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#B89758] bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60">
                          {activeSpotProduct.brand}
                        </span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-wider">
                          {activeSpotProduct.category}
                        </span>
                      </div>

                      <Link
                        to={`/product/${activeSpotProduct.id}`}
                        className="mt-0.5 block text-xs sm:text-sm font-bold text-gray-950 hover:text-black line-clamp-1"
                      >
                        {activeSpotProduct.name}
                      </Link>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-gray-950">
                          ₹{Number(activeSpotProduct.price).toLocaleString('en-IN')}
                        </span>
                        {activeSpotProduct.oldPrice && activeSpotProduct.oldPrice > activeSpotProduct.price && (
                          <span className="text-[10px] text-gray-400 line-through">
                            ₹{Number(activeSpotProduct.oldPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-[9.5px] font-semibold text-emerald-700 bg-emerald-50 px-1 rounded">
                          In Stock
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(activeSpotProduct)}
                        className="rounded-full bg-[#0F172A] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-black transition shadow-xs whitespace-nowrap active:scale-95"
                      >
                        Add to Bag
                      </button>
                      <Link
                        to={`/product/${activeSpotProduct.id}`}
                        className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-center text-xs font-semibold text-gray-800 hover:bg-gray-100 transition whitespace-nowrap"
                      >
                        Details &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Col (5 Cols): Ensemble Rack & Bundle CTA */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-gray-400">Ensemble Breakdown</span>
                    <h3 className="text-base font-bold text-gray-950 leading-tight">{activeLook.title}</h3>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-700 border border-gray-200">
                    3 Pieces Included
                  </span>
                </div>

                <p className="mt-2.5 text-xs leading-relaxed text-gray-600">
                  {activeLook.description}
                </p>

                {/* Ensemble Items List */}
                <div className="mt-4 space-y-2.5">
                  {activeLook.hotspots.map((hs) => {
                    const prod = resolveProduct(hs);
                    const isFocus = activeHotspotId === hs.id;
                    return (
                      <div
                        key={hs.id}
                        onClick={() => setActiveHotspotId(hs.id)}
                        className={`flex items-center justify-between gap-3 rounded-xl border p-2.5 transition cursor-pointer ${isFocus
                          ? 'border-[#B89758] bg-[#FDFBF7] shadow-xs'
                          : 'border-gray-200/80 bg-[#FAFAFB] hover:border-gray-300 hover:bg-white'
                          }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white p-1 border border-gray-200 flex items-center justify-center">
                            <img
                              src={prod.image || prod.images?.[0]}
                              alt={prod.name}
                              className="h-full w-full object-contain mix-blend-multiply"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[8.5px] font-bold uppercase tracking-wider text-gray-400">{prod.brand}</span>
                              <span className="text-[8px] text-emerald-600 font-semibold">&bull; 100% Genuine</span>
                            </div>
                            <h4 className="text-xs font-semibold text-gray-950 truncate">{prod.name}</h4>
                            <p className="text-[11px] font-bold text-gray-900">
                              ₹{Number(prod.price).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(prod);
                          }}
                          className="rounded-full border border-gray-300 bg-white px-3 py-1 text-[11px] font-semibold text-gray-800 hover:bg-gray-900 hover:text-white transition shrink-0 active:scale-95"
                        >
                          + Bag
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ensemble Purchase Footer */}
              <div className="mt-6 border-t border-gray-200/80 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Total Ensemble Value</p>
                    <p className="text-lg font-bold text-gray-950">₹{ensembleTotalValue.toLocaleString('en-IN')}</p>
                  </div>
                  <span className="text-[9.5px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Complimentary White-Glove Air
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddEnsembleToBag(activeLook)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0F172A] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-black hover:scale-[1.01] transition active:scale-98"
                >
                  <span>Complete The Look &bull; Add All 3 Pieces</span>
                  <ArrowRightIcon className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          5. UNIFIED DYNAMIC TABBED SHOWCASE (Trending, Best Sellers, Highlights, Categories)
      ========================================================= */}
      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section Header with Dynamic Category Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                Exclusive Vault &bull; Live Gallery
              </span>
              <h2 className="mt-0.5 text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
                Curated Luxury Showcase
              </h2>
            </div>

            {/* Dynamic Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none max-w-full">
              {showcaseTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${isActive
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : 'bg-[#F4F4F6] text-gray-700 hover:bg-gray-200 hover:text-gray-950'
                      }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Showcase Counter Strip */}
          <div className="mb-4 flex items-center justify-between text-xs text-gray-500 border-b border-gray-100 pb-2.5">
            <span className="font-medium">
              Showing <strong className="text-gray-950">{filteredShowcaseProducts.length}</strong> authenticated luxury editions
            </span>
            <Link
              to={
                currentTabConfig.category
                  ? `/shop?category=${encodeURIComponent(currentTabConfig.category)}`
                  : currentTabConfig.categories
                  ? `/shop?category=${encodeURIComponent(currentTabConfig.categories[0])}`
                  : '/shop'
              }
              className="font-semibold text-gray-900 hover:underline flex items-center gap-1"
            >
              <span>Explore All {currentTabConfig.label.replace(/[^a-zA-Z &]/g, '').trim()}</span>
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>

          {/* Dynamic Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-fade-in">
            {filteredShowcaseProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>

          {/* Bottom Explore Catalog CTA */}
          <div className="mt-8 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-900 shadow-2xs transition hover:bg-gray-100 hover:border-gray-400"
            >
              <span>View Full Luxury Vault Catalog</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================
          6. LIMITED TIME PRIVATE SALE & PRIVÉ VOUCHER BANNER
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-4 items-stretch">

          {/* Left: Private Sale Countdown (7 Cols) */}
          <div className="md:col-span-7 relative overflow-hidden rounded-2xl bg-[#111827] p-5 sm:p-6 text-white shadow-md flex flex-col justify-between">
            <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full border border-white/10" />
            <div className="relative">
              <span className="text-[8.5px] font-bold uppercase tracking-[0.18em] text-amber-300">
                Exclusive Vault Drop
              </span>
              <h3 className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-white">
                Limited Time Private Sale
              </h3>
              <p className="mt-1 text-[10.5px] text-gray-400">
                Special consignment pricing on certified timepieces & leather goods.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <div className="rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-center">
                  <p className="text-base font-bold text-white leading-none">{formatTime(timeLeft.hours)}</p>
                  <p className="text-[7.5px] uppercase tracking-wider text-gray-400 mt-0.5">Hours</p>
                </div>
                <span className="text-gray-500 font-bold">:</span>
                <div className="rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-center">
                  <p className="text-base font-bold text-white leading-none">{formatTime(timeLeft.minutes)}</p>
                  <p className="text-[7.5px] uppercase tracking-wider text-gray-400 mt-0.5">Min</p>
                </div>
                <span className="text-gray-500 font-bold">:</span>
                <div className="rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-center">
                  <p className="text-base font-bold text-white leading-none">{formatTime(timeLeft.seconds)}</p>
                  <p className="text-[7.5px] uppercase tracking-wider text-gray-400 mt-0.5">Sec</p>
                </div>
              </div>

              <Link
                to="/shop"
                className="rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-gray-950 hover:bg-gray-100 transition shadow-xs"
              >
                Shop The Sale &rarr;
              </Link>
            </div>
          </div>

          {/* Right: Voucher Banner (5 Cols) */}
          <div className="md:col-span-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-5 sm:p-6 shadow-md border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/20 text-amber-300 text-sm border border-amber-400/30">
                  🎁
                </span>
                <span className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-amber-300">
                  Instant Privé Voucher
                </span>
              </div>
              <h3 className="mt-2 text-base sm:text-lg font-bold text-white leading-snug">
                10% Instant Privilege Discount
              </h3>
              <p className="mt-1 text-[10.5px] text-gray-400">
                Applicable across orders &gt; ₹1,000. Apply code at checkout.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-slate-700/80">
              <span className="font-mono text-xs font-bold text-white bg-white/10 px-2.5 py-1 rounded border border-white/15">
                KRISHNA10
              </span>
              <Link
                to="/shop"
                className="rounded-full bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold px-4 py-1.5 text-xs uppercase tracking-wider transition"
              >
                Claim &rarr;
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          7. OFFICIAL BRAND PARTNERS
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-5 text-center">
          <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">
            Official Brand Partners
          </span>

          <h2 className="mt-0.5 text-lg font-bold tracking-tight text-gray-950 sm:text-xl">
            Explore by Brand
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {partnerBrands.map((brand) => (
            <Link
              key={brand.name}
              to={`/shop?category=${encodeURIComponent(
                brand.cat
              )}&brand=${encodeURIComponent(brand.name)}`}
              className="group flex flex-col items-center justify-center rounded-xl border border-gray-200/80 bg-white p-3 text-center transition-all duration-200 hover:border-[#0F172A] hover:bg-[#0F172A] hover:shadow-md"
            >
              <span className="max-w-full truncate text-xs font-semibold text-gray-950 transition-colors group-hover:text-white">
                {brand.name}
              </span>

              <span className="mt-0.5 max-w-full truncate text-[9px] text-gray-400 transition-colors group-hover:text-gray-300">
                {brand.cat}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================
          8. CLIENT EXPERIENCES & VERIFIED REVIEWS
      ========================================================= */}
      <section className="border-t border-gray-200/80 bg-[#F8F8F7] py-9 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-6 text-center">
            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-400">
              Client Experiences
            </span>

            <h2 className="mt-1 text-lg sm:text-2xl font-bold tracking-tight text-gray-950">
              Loved by Luxury Connoisseurs
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {clientReviews.map((review) => (
              <div
                key={review.name}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-xs text-[#B89758]">
                      {'★'.repeat(review.rating)}
                    </div>
                    <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Verified Buyer
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-gray-600 italic">
                    “{review.text}”
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2.5 border-t border-gray-100 pt-3.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111827] text-[10px] font-bold text-white shrink-0">
                    {review.name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {review.name}
                    </p>
                    <p className="text-[9.5px] text-gray-400 truncate">
                      {review.location} &bull; <span className="text-gray-500">{review.product}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================
          9. KRISHNA PRIVÉ VIP CLUB
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-[#FCFAF4] via-white to-[#F7F3E8] p-6 text-center sm:p-10 shadow-sm">

          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full border border-amber-200/40" />
          <div className="absolute -bottom-24 -right-10 h-48 w-48 rounded-full border border-amber-200/30" />

          <div className="relative mx-auto max-w-2xl">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B89758]">
              Krishna Privé
            </span>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Enter the World of
              <span className="font-serif italic font-normal text-[#B89758]">
                {' '}Privileged Access
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-[10px] leading-relaxed text-gray-500 sm:text-xs">
              Receive private invitations, early access to new limited vault drops, and personalized styling recommendations.
            </p>

            {priveSubscribed ? (
              <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-300 px-5 py-2.5 text-xs font-bold text-emerald-800 animate-fade-in">
                <span>✓ Welcome to Krishna Privé! Exclusive invitations will be sent to your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handlePriveSubmit} className="mx-auto mt-5 flex max-w-md flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  required
                  value={priveEmail}
                  onChange={(e) => setPriveEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="min-w-0 flex-1 rounded-full border border-gray-300 bg-white px-4 py-3 text-xs outline-none transition placeholder:text-gray-400 focus:border-[#B89758]"
                />

                <button
                  type="submit"
                  className="rounded-full bg-[#111827] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-black active:scale-95"
                >
                  Join Privé
                </button>
              </form>
            )}

            <p className="mt-3 text-[8px] text-gray-400">
              By joining, you agree to receive official private salon updates. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


