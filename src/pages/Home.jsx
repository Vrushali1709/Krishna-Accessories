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
    description: 'Genuine Leather & Urban Briefcases',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900',
    tag: 'Hidesign, Wildcraft, Tommy'
  },
  {
    name: 'Shoes',
    description: 'Handcrafted Sneakers & Oxford Footwear',
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

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(() => getProducts());
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const handleUpdate = () => setProducts(getProducts());
    window.addEventListener('productsUpdated', handleUpdate);
    return () => window.removeEventListener('productsUpdated', handleUpdate);
  }, []);

  const featured = products.slice(0, 8);

  const handleAddToCart = (product) => {
    if (!getCurrentUser()) {
      navigate('/login');
      return;
    }
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setToastMessage(`✓ Added "${product.name}" to your bag`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleBuyNow = (product) => {
    if (!getCurrentUser()) {
      navigate('/login');
      return;
    }
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

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
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 overflow-x-clip">
      <Navbar />

      {/* Floating Alert Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-900 shadow-xl animate-slide-up max-w-[calc(100vw-32px)]">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs">✓</span>
          <span className="truncate">{toastMessage}</span>
          <Link to="/cart" className="ml-1 rounded-md bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-black transition shrink-0">
            View Bag
          </Link>
        </div>
      )}

      {/* ================= EDITORIAL LUXURY HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#FAF9F5] to-[#FAFAF9] border-b border-zinc-200/80">
        <div className="mx-auto flex min-h-[480px] lg:min-h-[540px] max-w-7xl items-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">

            {/* Left Column: Refined Typography & Actions */}
            <div className="lg:col-span-6 text-center lg:text-left animate-fade-in mx-auto lg:mx-0 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 mb-5 border border-amber-500/20 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-[#B89035]" />
                <span className="text-[10px] font-bold tracking-[0.14em] text-zinc-800 uppercase">
                  Authorized Retailer & Luxury Horology
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-tight text-zinc-950 leading-[1.12]">
                Curated Luxury <br />
                <span className="font-serif italic font-normal text-[#B89035]">Timepieces & Essentials</span>
              </h1>

              <p className="mt-4 text-xs sm:text-[13.5px] leading-relaxed text-zinc-600 max-w-lg mx-auto lg:mx-0">
                Direct access to brand-certified Swiss and heritage horology, handcrafted leather goods, designer footwear, and flagship technology with 100% verified authenticity and complimentary insured express shipping.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition hover:bg-black hover:shadow-sm"
                >
                  <span>Explore Catalog</span>
                  <ArrowRightIcon className="w-3.5 h-3.5 text-white" />
                </Link>

                <Link
                  to="/shop?category=Watches"
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-900 transition hover:bg-zinc-50 hover:border-zinc-400 shadow-2xs"
                >
                  <span>Watch Collections</span>
                </Link>
              </div>

              {/* Verified Trust Badges */}
              <div className="mt-8 pt-6 border-t border-zinc-200/80 grid grid-cols-3 gap-3 text-left">
                <div>
                  <p className="text-base font-bold text-zinc-950 font-mono tracking-tight">100%</p>
                  <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Certified Authentic</p>
                </div>
                <div>
                  <p className="text-base font-bold text-zinc-950 font-mono tracking-tight">24-48H</p>
                  <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Express Dispatch</p>
                </div>
                <div>
                  <p className="text-base font-bold text-zinc-950 font-mono tracking-tight">7-Days</p>
                  <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Return Privilege</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Stage */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-white p-6 sm:p-8 border border-zinc-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center">
                
                <span className="absolute top-4 left-4 rounded-md bg-zinc-900 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-2xs">
                  Boutique Spotlight
                </span>

                <img
                  src="https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=900"
                  alt="Rolex Submariner Date"
                  className="h-64 sm:h-72 w-auto object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105"
                />

                <div className="w-full mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Rolex Collection</span>
                    <h3 className="text-xs font-bold text-zinc-900">Submariner Date 41mm Oyster</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-zinc-950 font-mono">₹1,180,000</span>
                    <span className="block text-[9.5px] text-emerald-600 font-semibold">Available</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 4 BRAND PILLARS STRIP ================= */}
      <section className="border-b border-zinc-200/80 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 sm:gap-6">
            
            <div className="flex items-start gap-3 p-3 rounded-xl">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-950">100% Brand Certified</h4>
                <p className="text-[11px] text-zinc-500 mt-0.5 leading-normal">Stamped warranty card & serial validation.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900">
                <TruckIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-950">Insured Air Express</h4>
                <p className="text-[11px] text-zinc-500 mt-0.5 leading-normal">Free delivery on orders &ge; ₹2,000.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900">
                <BoxIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-950">7-Day Privilege</h4>
                <p className="text-[11px] text-zinc-500 mt-0.5 leading-normal">Hassle-free returns & swift refunds.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900">
                <StarIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-950">Flagship Concierge</h4>
                <p className="text-[11px] text-zinc-500 mt-0.5 leading-normal">Private boutique appointments in Ahmedabad.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CURATED DEPARTMENTS SHOWCASE ================= */}
      <section className="py-12 sm:py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B89035]">
              Curated Departments
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 mt-1">
              Explore by Specialty
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Departments</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryBanners.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative h-64 overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-900 p-6 flex flex-col justify-between transition-all duration-300 hover:border-zinc-400 hover:shadow-md"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 h-full w-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />

              <span className="relative z-10 self-start rounded-md bg-white/20 backdrop-blur-xs px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-wider text-white border border-white/20">
                {cat.tag}
              </span>

              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white tracking-tight">{cat.name}</h3>
                <p className="text-xs text-zinc-300 mt-0.5 line-clamp-1">{cat.description}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 group-hover:translate-x-1 transition-transform">
                  <span>Explore Collection</span>
                  <span>&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= FEATURED BOUTIQUE EDITIONS ================= */}
      <section className="py-12 sm:py-16 bg-white border-y border-zinc-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B89035]">
                Curated Horology & Goods
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 mt-1">
                Featured Boutique Editions
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Full Catalog ({products.length})</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= PARTNER BRANDS DIRECTORY ================= */}
      <section className="py-12 sm:py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
            Authorized Distribution
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 mt-1">
            Partner Luxury Maisons
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Direct consignment relationships ensuring manufacturer warranty validation across India.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {partnerBrands.map((b) => (
            <Link
              key={b.name}
              to={`/shop?brand=${encodeURIComponent(b.name)}`}
              className="group rounded-xl border border-zinc-200/80 bg-white p-4 text-center transition hover:border-zinc-400 hover:shadow-2xs"
            >
              <span className="text-xs font-bold text-zinc-900 group-hover:text-black transition block truncate">
                {b.name}
              </span>
              <span className="text-[9.5px] font-medium text-zinc-400 uppercase tracking-wider block mt-0.5 truncate">
                {b.cat}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= EDITORIAL FLAGSHIP SANCTUARY BANNER ================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="rounded-3xl bg-[#121316] text-white p-8 sm:p-12 border border-zinc-800 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300">
                Ahmedabad Flagship Boutique
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                Private Viewing Suites & Movement Diagnostics
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
                Experience our curated Swiss calibers and handcrafted accessories in person at our flagship showroom on SG Highway, Bodakdev. Enjoy private sizing, horological consultation, and complimentary refreshments.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-xs font-semibold text-zinc-950 hover:bg-zinc-100 transition shadow-2xs text-center"
              >
                Schedule Private Viewing
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-transparent px-6 py-3 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-500 transition text-center"
              >
                Explore Heritage Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}