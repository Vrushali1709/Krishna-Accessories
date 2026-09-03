import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { ShieldCheckIcon, TruckIcon, StarIcon, ArrowRightIcon, BoxIcon } from '../components/Icons';

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
  },
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
  { id: 'all', label: '✨ Curated Highlights', categoryFilter: null },
  { id: 'bestsellers', label: '🔥 Best Sellers (4.8★+)', categoryFilter: null, isBestSeller: true },
  { id: 'Watches', label: '⏱ Swiss & Heritage Watches', categoryFilter: 'Watches' },
  { id: 'Bags & Wallets', label: '💼 Handcrafted Leather', categoryFilter: 'Bags & Wallets' },
  { id: 'Tech', label: '🎧 Flagship Tech & Audio', categoryFilter: ['Electronics', 'Mobiles', 'Laptops', 'Smart Gadgets'] },
  { id: 'Shoes', label: '👟 Prestige Footwear', categoryFilter: 'Shoes' }
];

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(() => getProducts());
  const [toastMessage, setToastMessage] = useState('');

  // Lookbook State
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [activeHotspotId, setActiveHotspotId] = useState(lookbookData[0].hotspots[0].id);

  // Curated Showcase State
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const handleUpdate = () => setProducts(getProducts());
    window.addEventListener('productsUpdated', handleUpdate);
    return () => window.removeEventListener('productsUpdated', handleUpdate);
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
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setToastMessage(`✓ Added "${product.name}" to your bag`);
    setTimeout(() => setToastMessage(''), 3000);
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
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
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

  // Filter products for Curated Showcase
  const currentTabConfig = showcaseTabs.find((t) => t.id === activeTab) || showcaseTabs[0];
  const filteredShowcaseProducts = products.filter((p) => {
    if (currentTabConfig.isBestSeller) {
      return (Number(p.rating) >= 4.7 && Number(p.reviews) >= 60) || p.price > 8000;
    }
    if (Array.isArray(currentTabConfig.categoryFilter)) {
      return currentTabConfig.categoryFilter.includes(p.category);
    }
    if (currentTabConfig.categoryFilter) {
      return p.category === currentTabConfig.categoryFilter;
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

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
      <Navbar />

      {/* Floating Alert Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-900 shadow-xl animate-slide-up max-w-[calc(100vw-32px)]">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">✓</span>
          <span className="truncate">{toastMessage}</span>
          <Link to="/cart" className="ml-1 rounded-full bg-[#111827] px-2.5 py-0.5 text-[10px] font-semibold text-white hover:bg-black transition shrink-0">
            <span className="text-white">Bag</span>
          </Link>
        </div>
      )}

      {/* ================= EDITORIAL BRIGHT LUXURY HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#FAF9F5] to-white border-b border-gray-200/80">
        <div className="mx-auto flex min-h-[460px] lg:min-h-[520px] max-w-7xl items-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">

            {/* Left Column: Refined Typography & Actions */}
            <div className="lg:col-span-5 text-center lg:text-left animate-fade-in mx-auto lg:mx-0 max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 mb-4 border border-amber-500/20 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-[#B89758]" />
                <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.16em] text-gray-800 uppercase">
                  Authorized Retailer & Luxury Consignment
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-gray-950 leading-[1.14]">
                Curated Luxury <br />
                <span className="font-serif italic font-normal text-[#B89758]">Timepieces & Essentials</span>
              </h1>

              <p className="mt-3.5 text-xs sm:text-[13.5px] leading-relaxed text-gray-600 max-w-md mx-auto lg:mx-0">
                Direct access to brand-certified Swiss and heritage watches, handcrafted leather bags, performance sneakers, and flagship technology with 100% verified authenticity and complimentary insured shipping.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0F172A] px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-black hover:scale-[1.02]"
                >
                  <span className="text-white">Explore Catalog</span>
                  <ArrowRightIcon className="w-3.5 h-3.5 text-white" />
                </Link>

                <Link
                  to="/shop?category=Watches"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-900 transition hover:bg-gray-100 shadow-2xs"
                >
                  <span className="text-gray-900">Watch Collections</span>
                </Link>
              </div>

              {/* Service Highlights */}
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-gray-200/80 pt-5 text-gray-900 max-w-md mx-auto lg:mx-0">
                <div>
                  <p className="text-base sm:text-xl font-bold text-gray-950">100%</p>
                  <p className="text-[9.5px] sm:text-[10px] text-gray-500 font-medium">Genuine Authenticity</p>
                </div>
                <div className="border-x border-gray-200/80 px-2 sm:px-3">
                  <p className="text-base sm:text-xl font-bold text-gray-950">₹2,000+</p>
                  <p className="text-[9.5px] sm:text-[10px] text-gray-500 font-medium">Free Insured Air</p>
                </div>
                <div>
                  <p className="text-base sm:text-xl font-bold text-gray-950">7 Days</p>
                  <p className="text-[9.5px] sm:text-[10px] text-gray-500 font-medium">Return Privilege</p>
                </div>
              </div>
            </div>

            {/* Right Column: Full Clear Bright Luxury Image */}
            <div className="lg:col-span-7 relative animate-fade-in w-full">
              <div className="rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-2 sm:p-2.5 shadow-xl group">
                <div className="overflow-hidden rounded-xl sm:rounded-2xl">
                  <img
                    src="/images/hero-luxury-bright.jpg"
                    alt="Curated Luxury Collection"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                  />
                </div>

                {/* Curated Heritage Caption Bar */}
                <div className="mt-2 sm:mt-2.5 flex items-center justify-between gap-2.5 sm:gap-4 rounded-xl bg-[#FAF9F6] border border-gray-200/80 px-3 sm:px-4 py-2 sm:py-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-amber-50 border border-amber-200/60 text-amber-600 text-xs font-bold shrink-0">
                      ★
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-[11.5px] font-bold uppercase tracking-wider text-gray-900 truncate">
                        Curated Heritage Showcase
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-gray-500 truncate">
                        Swiss Timepieces &bull; Handcrafted Leather &bull; Curated Goods
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex text-[9.5px] font-bold text-[#B89758] uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 shrink-0">
                    100% Authentic
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FOUR PILLARS GUARANTEE ================= */}
      <section className="border-b border-gray-200/80 bg-white py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">

            <div className="flex items-center gap-2.5 rounded-xl border border-gray-200/70 bg-[#F8F9FA] p-3 transition hover:border-gray-300 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-200/80 text-gray-900">
                <ShieldCheckIcon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[10.5px] sm:text-[11px] font-semibold text-gray-950 uppercase tracking-wider truncate">Certified Authentic</h4>
                <p className="text-[9px] sm:text-[9.5px] text-gray-500 truncate">Official brand warranty</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-gray-200/70 bg-[#F8F9FA] p-3 transition hover:border-gray-300 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-200/80 text-gray-900">
                <TruckIcon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[10.5px] sm:text-[11px] font-semibold text-gray-950 uppercase tracking-wider truncate">Express Dispatch</h4>
                <p className="text-[9px] sm:text-[9.5px] text-gray-500 truncate">Free on orders &ge; ₹2,000</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-gray-200/70 bg-[#F8F9FA] p-3 transition hover:border-gray-300 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-200/80 text-gray-900">
                <BoxIcon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[10.5px] sm:text-[11px] font-semibold text-gray-950 uppercase tracking-wider truncate">Secure Packaging</h4>
                <p className="text-[9px] sm:text-[9.5px] text-gray-500 truncate">Multi-point inspected</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-gray-200/70 bg-[#F8F9FA] p-3 transition hover:border-gray-300 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-200/80 text-gray-900">
                <StarIcon className="w-3.5 h-3.5 text-gray-900" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[10.5px] sm:text-[11px] font-semibold text-gray-950 uppercase tracking-wider truncate">Concierge Desk</h4>
                <p className="text-[9px] sm:text-[9.5px] text-gray-500 truncate">Ahmedabad flagship</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURE 1: INTERACTIVE EDITORIAL LOOKBOOK ("SHOP THE LOOK") ================= */}
      <section className="bg-gradient-to-b from-[#F8F9FA] via-white to-[#F8F9FA] py-10 sm:py-14 border-b border-gray-200/80">
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
                Explore fully coordinated luxury ensembles. Hover or tap the pulsating markers to view pieces, or acquire the complete curated set.
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

            {/* Left Col (7 Cols): The Editorial Stage with Interactive Hotspots */}
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
                {activeLook.hotspots.map((hs, idx) => {
                  const isSelected = activeHotspotId === hs.id;
                  return (
                    <div
                      key={hs.id}
                      style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                    >
                      {/* Pulsing Hotspot Button */}
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
                          {isSelected ? '✓' : `+`}
                        </span>

                        {/* Tooltip on Hover */}
                        <span className="pointer-events-none absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 hidden sm:group-hover:flex items-center whitespace-nowrap rounded-md bg-gray-950 px-2 py-0.5 text-[9.5px] font-semibold text-white shadow-md border border-gray-800">
                          {hs.label}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Floating Hotspot Live Preview Card (Inside Stage Bottom) */}
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

                    {/* Quick Add / View Actions */}
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

            {/* Right Col (5 Cols): The Curated Ensemble Rack & Bundle Action */}
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
                              <span className="text-[8px] text-emerald-600 font-semibold">• 100% Genuine</span>
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
                    Complimentary White-Glove Air Shipping
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

      {/* ================= CURATED DEPARTMENTS ================= */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">Departments</span>
            <h2 className="mt-0.5 text-lg sm:text-xl font-bold tracking-tight text-gray-950">Curated Collections</h2>
          </div>
          <Link to="/shop" className="text-xs font-semibold text-gray-900 hover:underline flex items-center gap-1 shrink-0">
            <span>View All</span>
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
          {categoryBanners.map((c) => (
            <Link
              key={c.name}
              to={`/shop?category=${encodeURIComponent(c.name)}`}
              className="group relative aspect-[0.85] overflow-hidden rounded-xl border border-gray-200/80 bg-white transition-all duration-200 hover:shadow-md hover:border-gray-300"
            >
              <img
                src={c.image}
                alt={c.name}
                className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-106"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute inset-x-2 bottom-2">
                <h3 className="text-xs font-bold text-white transition truncate">
                  {c.name}
                </h3>
                <p className="text-[9px] text-gray-300 truncate">{c.tag}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= PROMOTIONAL VOUCHER BANNER ================= */}
      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#0F172A] text-white p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 shadow-sm border border-slate-800">
          <div className="flex items-center gap-3 w-full md:w-auto min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-base border border-white/10">
              🎁
            </div>
            <div className="min-w-0">
              <span className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-amber-300">Exclusive Privé</span>
              <h3 className="text-sm sm:text-base font-bold text-white leading-snug truncate">Save 10% Instant Discount &gt; ₹1,000</h3>
              <p className="text-[10px] sm:text-[10.5px] text-gray-400 truncate">Coupon code: <strong className="text-white font-mono bg-white/10 px-1 py-0.2 rounded border border-white/10">KRISHNA10</strong></p>
            </div>
          </div>
          <Link
            to="/shop"
            className="w-full md:w-auto text-center rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-gray-950 hover:bg-gray-100 transition shrink-0 shadow-2xs"
          >
            <span className="text-gray-950 font-bold">Claim Offer &rarr;</span>
          </Link>
        </div>
      </section>

      {/* ================= FEATURE 3: DYNAMIC TABBED CURATED SHOWCASE ================= */}
      <section className="bg-white border-y border-gray-200/80 py-10 sm:py-12">
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
                currentTabConfig.categoryFilter
                  ? `/shop?category=${encodeURIComponent(Array.isArray(currentTabConfig.categoryFilter) ? currentTabConfig.categoryFilter[0] : currentTabConfig.categoryFilter)}`
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
              <span>View Full 50+ Luxury Vault Catalog</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= CATEGORY-WISE BRAND SHOWCASE ================= */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="text-center mb-5">
          <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">Official Brand Partners</span>
          <h2 className="mt-0.5 text-lg sm:text-xl font-bold tracking-tight text-gray-950">Explore by Brand</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {partnerBrands.map((b) => (
            <Link
              key={b.name}
              to={`/shop?category=${encodeURIComponent(b.cat)}&brand=${encodeURIComponent(b.name)}`}
              className="group flex flex-col items-center justify-center p-2.5 rounded-xl border border-gray-200/80 bg-white text-center transition-all duration-150 hover:bg-[#0F172A] hover:text-white hover:border-[#0F172A]"
            >
              <span className="text-xs font-semibold text-gray-950 group-hover:text-white transition-colors truncate max-w-full">{b.name}</span>
              <span className="text-[9px] text-gray-400 group-hover:text-gray-300 transition-colors truncate max-w-full">{b.cat}</span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}