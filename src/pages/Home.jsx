// src/pages/Home.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import NewArrivalsSection from '../components/NewArrivalsSection';
import HomeDiscoveryStrip from '../components/HomeDiscoveryStrip';
import CustomerReviewsSection from '../components/CustomerReviewsSection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import { getProducts, getCategories } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { ArrowRightIcon } from '../components/Icons';

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
// STORE TICKER ITEMS
// ============================================================
const storeTickerItems = [
  { title: "100% CERTIFIED AUTHENTIC", subtitle: "Official Brand Warranty" },
  { title: "DIRECT FACTORY SOURCING", subtitle: "Titan • Casio • Fossil • Seiko • Apple" },
  { title: "MUMBAI FLAGSHIP SANCTUARY", subtitle: "Heera Panna Shopping Center, Haji Ali" },
  { title: "INSURED EXPRESS LOGISTICS", subtitle: "BlueDart & Delhivery" },
  { title: "HANDCRAFTED LEATHER GOODS", subtitle: "Hidesign • Wildcraft • Tommy" },
  { title: "7-DAY REPLACEMENT GUARANTEE", subtitle: "100% Client Peace of Mind" }
];

// ============================================================
// FEATURED BRANDS
// ============================================================
const featuredBrands = [
  { name: 'Nike', category: 'Shoes' },
  { name: 'Adidas', category: 'Shoes' },
  { name: 'Apple', category: 'Mobiles' },
  { name: 'Rolex', category: 'Watches' },
  { name: 'Puma', category: 'Shoes' },
  { name: 'Sony', category: 'Electronics' },
  { name: 'Titan', category: 'Watches' },
  { name: 'Fossil', category: 'Watches' }
];

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(() => getProducts());
  const [toastMessage, setToastMessage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Price Filter Pill State
  const [selectedPriceLimit, setSelectedPriceLimit] = useState(5000);

  // Category Carousel State
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  // Category List
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

  // Hero Auto-slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % watchHeroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Update Listeners
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

  // Drag Scroll Handlers
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

  const handleMouseUp = () => setIsDragging(false);

  const handleCategoryClick = (e) => {
    if (hasMoved) e.preventDefault();
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

  // Filtered Logic
  const productsByPrice = products.filter((p) => p.price <= selectedPriceLimit).slice(0, 8);
  const bestSellers = products
    .filter((p) => (p.rating && p.rating >= 4.5) || (p.reviews && p.reviews > 10))
    .slice(0, 8);

  const getProductCountForCategory = (catName) => {
    return products.filter((p) => p.category?.toLowerCase() === catName.toLowerCase()).length;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip select-none sm:select-auto font-sans">
      <Navbar />

      {/* Floating Alert Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl border border-gray-200 bg-white/95 px-4 py-3 text-xs font-semibold text-gray-900 shadow-2xl backdrop-blur-md transition-all duration-300">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold">✓</span>
          <span className="truncate">{toastMessage}</span>
          <Link
            to="/cart"
            className="ml-2 rounded-lg bg-black px-3 py-1 text-[11px] font-medium text-white hover:bg-gray-800 transition shrink-0"
          >
            View Bag
          </Link>
        </div>
      )}

      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative w-full overflow-hidden bg-[#070808] text-white border-b border-neutral-800 lg:h-[650px]">
        <div className="absolute inset-0">
          {watchHeroSlides.map((slide, index) => (
            <div
              key={slide.titleLine1}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.titleLine1}
                className="h-full w-full object-cover object-center opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
            </div>
          ))}
        </div>

        <div className="relative z-20 mx-auto max-w-7xl h-full px-6 sm:px-10 lg:px-12 flex flex-col justify-center py-16">
          <span className="inline-block px-3.5 py-1 mb-4 w-max rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest text-amber-300 backdrop-blur-md border border-amber-300/30">
            {watchHeroSlides[currentSlide].tag}
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-tight">
            {watchHeroSlides[currentSlide].titleLine1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
              {watchHeroSlides[currentSlide].titleLine2}
            </span>
          </h1>
          <p className="mt-4 max-w-md text-sm sm:text-base text-gray-300">
            {watchHeroSlides[currentSlide].description}
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-black transition duration-300 hover:bg-amber-400 hover:text-black shadow-lg"
            >
              <span>Explore Shop</span>
              <ArrowRightIcon className="w-4 h-4 text-black" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 2. CONTINUOUS TICKER MARQUEE ================= */}
      <div className="relative bg-[#07090E] text-white border-y border-neutral-800 py-3.5 overflow-hidden select-none">
        <div className="animate-marquee flex items-center gap-8">
          {[...storeTickerItems, ...storeTickerItems].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-3 shrink-0">
              <span className="text-amber-400 text-xs">✦</span>
              <span className="font-bold text-xs uppercase tracking-widest text-neutral-100">
                {item.title}
              </span>
              <span className="text-[11px] font-normal text-amber-200/70 tracking-wider">
                ({item.subtitle})
              </span>
            </div>
          ))}
        </div>
      </div>

      <HomeDiscoveryStrip categories={categoryList} />

      {/* ================= 3. FEATURED BRANDS ================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-600">Official Partners</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 mt-1">Featured Brands</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {featuredBrands.map((brand) => (
            <Link
              key={brand.name}
              to={`/shop?brand=${encodeURIComponent(brand.name)}`}
              className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-black hover:-translate-y-1 transition-all duration-300"
            >
              <span className="font-extrabold text-base tracking-tight text-gray-800 group-hover:scale-110 group-hover:text-amber-600 transition-transform">
                {brand.name}
              </span>
              <span className="text-[10px] font-semibold text-gray-400 mt-1 group-hover:text-black">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= 4. SHOP BY CATEGORY ================= */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">Shop by Category</h2>
          <Link to="/shop" className="text-xs font-bold text-gray-700 hover:text-black hover:underline">
            View All →
          </Link>
        </div>

        <div
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex gap-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {categoryList.map((c) => {
            const count = getProductCountForCategory(c.name);
            return (
              <Link
                key={c.name}
                to={`/shop?category=${encodeURIComponent(c.name)}`}
                onClick={handleCategoryClick}
                className="group relative flex-shrink-0 w-[220px] sm:w-[250px] p-3 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="relative aspect-[1/0.95] overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-medium text-white border border-white/10">
                    {count} items
                  </span>
                </div>
                <div className="pt-3">
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-black">{c.name}</h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{c.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ================= 5. PRODUCTS BY PRICE ================= */}
      <section className="bg-gray-100/70 border-y border-gray-200/80 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600">Smart Shopping</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 mt-1">Products by Price</h2>
              <p className="text-xs text-gray-500 mt-1">Find top-rated items matching your exact budget</p>
            </div>

            {/* Price Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {[5000, 10000, 15000, 20000].map((limit) => (
                <button
                  key={limit}
                  onClick={() => setSelectedPriceLimit(limit)}
                  className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-300 shrink-0 ${
                    selectedPriceLimit === limit
                      ? 'bg-black text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  Under ₹{limit.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {productsByPrice.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {productsByPrice.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-sm font-semibold text-gray-500">No products found under ₹{selectedPriceLimit.toLocaleString('en-IN')}</p>
            </div>
          )}
        </div>
      </section>

      {/* ================= 6. BEST SELLERS ================= */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-600">Top Rated & Loved</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 mt-1">Best Sellers</h2>
          </div>
          <Link to="/shop" className="text-xs font-bold text-gray-900 hover:text-rose-600 hover:underline">
            View All Best Sellers →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          ))}
        </div>
      </section>

      {/* ================= 7. NEW ARRIVALS ================= */}
      <NewArrivalsSection products={products} onToast={setToastMessage} />

      {/* ================= 8. WHY CHOOSE US ================= */}
      <WhyChooseUsSection />

      {/* ================= 9. REVIEWS ================= */}
      <CustomerReviewsSection />

      <Footer />
    </div>
  );
}