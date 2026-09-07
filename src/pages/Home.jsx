// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import ProductCard from '../components/ProductCard';
// import { getProducts, getCategories } from '../utils/productStore';
// import { addToCart } from '../utils/cart';
// import { getCurrentUser } from '../utils/auth';
// import {
//   ShieldCheckIcon,
//   TruckIcon,
//   StarIcon,
//   ArrowRightIcon,
//   BoxIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon
// } from '../components/Icons';

// const defaultCategoryBanners = [
//   {
//     name: 'Watches',
//     description: 'Heritage Swiss & Smart Chronographs',
//     image: 'https://i.pinimg.com/736x/80/4d/7c/804d7c5ba3d69a866d1303f94299d564.jpg',
//     tag: 'Titan, Fossil, Rolex, Casio'
//   },
//   {
//     name: 'Bags & Wallets',
//     description: 'Genuine Leather & Urban Backpacks',
//     image: 'https://i.pinimg.com/736x/15/dc/da/15dcdac0fcc6a94440471bf201b96b75.jpg',
//     tag: 'Hidesign, Wildcraft, Tommy'
//   },
//   {
//     name: 'Shoes',
//     description: 'Handcrafted Sneakers & Running Footwear',
//     image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900',
//     tag: 'Nike, Adidas, Puma, Jordan'
//   },
//   {
//     name: 'Mobiles',
//     description: 'Flagship Titanium Handsets & Gear',
//     image: 'https://i.pinimg.com/736x/00/9b/91/009b91eaa9c50df8e5d5681cbde9a9c3.jpg',
//     tag: 'Apple, Samsung, OnePlus'
//   },
//   {
//     name: 'Clothes & Fashion',
//     description: 'Tailored Suits, Denim & Luxury Apparel',
//     image: 'https://i.pinimg.com/1200x/7e/e0/55/7ee055c1c667557a592fa716eb5005fc.jpg',
//     tag: 'Levis, Zara, Tommy, Calvin Klein'
//   },
//   {
//     name: 'Laptops',
//     description: 'High-Performance OLED Workstations',
//     image: 'https://i.pinimg.com/1200x/fe/f7/b3/fef7b3cbaeb59afc974ab04dd20741e6.jpg',
//     tag: 'Apple, Dell, HP, Asus'
//   },
//   {
//     name: 'Electronics',
//     description: 'Audiophile Noise-Cancelling Sound',
//     image: 'https://i.pinimg.com/1200x/db/6c/da/db6cdaadde558a889e0c812ea679d8e1.jpg',
//     tag: 'Sony, Bose, JBL, Marshall'
//   },
//   {
//     name: 'Smart Gadgets',
//     description: 'Smart Rings, AI Devices & Wearables',
//     image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=900',
//     tag: 'Apple, Samsung, Google, boAt'
//   },
//   {
//     name: 'Gaming',
//     description: 'RGB Mechanical Gear & Consoles',
//     image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=900',
//     tag: 'Razer, Sony PS5, Logitech, Asus'
//   },
//   {
//     name: 'Fitness',
//     description: 'GPS Multi-Sport Trackers & Health',
//     image: 'https://i.pinimg.com/736x/ce/b4/1d/ceb41df7737b5918904522051f1f56f5.jpg',
//     tag: 'Garmin, Fitbit, Apple, Noise'
//   },
//   {
//     name: 'Fashion Accessories',
//     description: 'Polarized Eyewear & Belts',
//     image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900',
//     tag: 'Ray-Ban, Police, Titan, Fossil'
//   }
// ];

// export default function Home() {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState(() => getProducts());
//   const [toastMessage, setToastMessage] = useState('');

//   // Carousel State & Logic
//   const carouselRef = useRef(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true);
//   const [scrollProgress, setScrollProgress] = useState(0);
//   const [isDragging, setIsDragging] = useState(false);
//   const [startX, setStartX] = useState(0);
//   const [scrollLeft, setScrollLeft] = useState(0);
//   const [hasMoved, setHasMoved] = useState(false);

//   // Combine default category banners with dynamic stored categories
//   const [categoryList, setCategoryList] = useState(() => {
//     const storedCats = getCategories();
//     const bannerNames = new Set(defaultCategoryBanners.map(b => b.name.toLowerCase()));
//     const customBanners = storedCats
//       .filter(cat => !bannerNames.has(cat.toLowerCase()))
//       .map(cat => ({
//         name: cat,
//         description: `Explore ${cat} Collection`,
//         image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900',
//         tag: 'Curated Essentials'
//       }));
//     return [...defaultCategoryBanners, ...customBanners];
//   });

//   useEffect(() => {
//     const handleUpdate = () => {
//       setProducts(getProducts());
//       const storedCats = getCategories();
//       const bannerNames = new Set(defaultCategoryBanners.map(b => b.name.toLowerCase()));
//       const customBanners = storedCats
//         .filter(cat => !bannerNames.has(cat.toLowerCase()))
//         .map(cat => ({
//           name: cat,
//           description: `Explore ${cat} Collection`,
//           image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900',
//           tag: 'Curated Essentials'
//         }));
//       setCategoryList([...defaultCategoryBanners, ...customBanners]);
//     };
//     window.addEventListener('productsUpdated', handleUpdate);
//     window.addEventListener('categoriesUpdated', handleUpdate);
//     return () => {
//       window.removeEventListener('productsUpdated', handleUpdate);
//       window.removeEventListener('categoriesUpdated', handleUpdate);
//     };
//   }, []);

//   const checkScroll = useCallback(() => {
//     if (!carouselRef.current) return;
//     const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
//     setCanScrollLeft(scrollLeft > 10);
//     setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
//     const maxScroll = scrollWidth - clientWidth;
//     setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
//   }, []);

//   useEffect(() => {
//     const el = carouselRef.current;
//     if (!el) return;
//     checkScroll();
//     el.addEventListener('scroll', checkScroll, { passive: true });
//     window.addEventListener('resize', checkScroll);
//     return () => {
//       el.removeEventListener('scroll', checkScroll);
//       window.removeEventListener('resize', checkScroll);
//     };
//   }, [checkScroll, categoryList]);

//   const scrollCarousel = (direction) => {
//     if (!carouselRef.current) return;
//     const container = carouselRef.current;
//     const cardWidth = container.firstElementChild?.clientWidth || 220;
//     const scrollAmount = (cardWidth + 14) * 2;
//     container.scrollBy({
//       left: direction === 'left' ? -scrollAmount : scrollAmount,
//       behavior: 'smooth'
//     });
//   };

//   const handleMouseDown = (e) => {
//     if (!carouselRef.current) return;
//     setIsDragging(true);
//     setHasMoved(false);
//     setStartX(e.pageX - carouselRef.current.offsetLeft);
//     setScrollLeft(carouselRef.current.scrollLeft);
//   };

//   const handleMouseMove = (e) => {
//     if (!isDragging || !carouselRef.current) return;
//     e.preventDefault();
//     const x = e.pageX - carouselRef.current.offsetLeft;
//     const walk = (x - startX) * 1.5;
//     if (Math.abs(walk) > 5) setHasMoved(true);
//     carouselRef.current.scrollLeft = scrollLeft - walk;
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   const handleCategoryClick = (e) => {
//     if (hasMoved) {
//       e.preventDefault();
//     }
//   };

//   const featured = products.slice(0, 8);

//   const getProductCountForCategory = (catName) => {
//     return products.filter(p => p.category?.toLowerCase() === catName.toLowerCase()).length;
//   };

//   const handleAddToCart = (product) => {
//     if (!getCurrentUser()) {
//       navigate('/login');
//       return;
//     }
//     addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
//     setToastMessage(`✓ Added "${product.name}" to your bag`);
//     setTimeout(() => setToastMessage(''), 3000);
//   };

//   const handleBuyNow = (product) => {
//     if (!getCurrentUser()) {
//       navigate('/login');
//       return;
//     }
//     addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
//     navigate('/checkout');
//   };

//   const partnerBrands = [
//     { name: 'Titan', cat: 'Watches' },
//     { name: 'Fossil', cat: 'Watches' },
//     { name: 'Rolex', cat: 'Watches' },
//     { name: 'Casio', cat: 'Watches' },
//     { name: 'Nike', cat: 'Shoes' },
//     { name: 'Adidas', cat: 'Shoes' },
//     { name: 'Hidesign', cat: 'Bags & Wallets' },
//     { name: 'Apple', cat: 'Mobiles' },
//     { name: 'Samsung', cat: 'Mobiles' },
//     { name: 'Sony', cat: 'Electronics' },
//     { name: 'Bose', cat: 'Electronics' },
//     { name: 'Dell', cat: 'Laptops' },
//     { name: 'Zara', cat: 'Clothes & Fashion' },
//     { name: 'Razer', cat: 'Gaming' },
//     { name: 'Garmin', cat: 'Fitness' },
//     { name: 'Ray-Ban', cat: 'Fashion Accessories' }
//   ];

//   return (
//     <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip select-none sm:select-auto">
//       <Navbar />

//       {/* Floating Alert Toast */}
//       {toastMessage && (
//         <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-900 shadow-xl animate-slide-up max-w-[calc(100vw-32px)]">
//           <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">✓</span>
//           <span className="truncate">{toastMessage}</span>
//           <Link to="/cart" className="ml-1 rounded-full bg-[#111827] px-2.5 py-0.5 text-[10px] font-semibold text-white hover:bg-black transition shrink-0">
//             <span className="text-white">Bag</span>
//           </Link>
//         </div>
//       )}

//       {/* ================= EDITORIAL BRIGHT LUXURY HERO SECTION ================= */}
//       <section className="relative overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#FAF9F5] to-white border-b border-gray-200/80">
//         <div className="mx-auto flex min-h-[460px] lg:min-h-[520px] max-w-7xl items-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
//           <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">

//             {/* Left Column: Refined Typography & Actions */}
//             <div className="lg:col-span-5 text-center lg:text-left animate-fade-in mx-auto lg:mx-0 max-w-xl">
//               <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 mb-4 border border-amber-500/20 shadow-2xs">
//                 <span className="h-2 w-2 rounded-full bg-[#B89758]" />
//                 <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.16em] text-gray-800 uppercase">
//                   Authorized Retailer & Luxury Consignment
//                 </span>
//               </div>

//               <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-gray-950 leading-[1.14]">
//                 Curated Luxury <br />
//                 <span className="font-serif italic font-normal text-[#B89758]">Timepieces & Essentials</span>
//               </h1>

//               <p className="mt-3.5 text-xs sm:text-[13.5px] leading-relaxed text-gray-600 max-w-md mx-auto lg:mx-0">
//                 Direct access to brand-certified Swiss and heritage watches, handcrafted leather bags, performance sneakers, and flagship technology with 100% verified authenticity and complimentary insured shipping.
//               </p>

//               <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
//                 <Link
//                   to="/shop"
//                   className="inline-flex items-center gap-2 rounded-full bg-[#0F172A] px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-black hover:scale-[1.02]"
//                 >
//                   <span className="text-white">Explore Catalog</span>
//                   <ArrowRightIcon className="w-3.5 h-3.5 text-white" />
//                 </Link>

//                 <Link
//                   to="/shop?category=Watches"
//                   className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-900 transition hover:bg-gray-100 shadow-2xs"
//                 >
//                   <span className="text-gray-900">Watch Collections</span>
//                 </Link>
//               </div>

//               {/* Service Highlights */}
//               <div className="mt-8 grid grid-cols-3 gap-3 border-t border-gray-200/80 pt-5 text-gray-900 max-w-md mx-auto lg:mx-0">
//                 <div>
//                   <p className="text-base sm:text-xl font-bold text-gray-950">100%</p>
//                   <p className="text-[9.5px] sm:text-[10px] text-gray-500 font-medium">Genuine Authenticity</p>
//                 </div>
//                 <div className="border-x border-gray-200/80 px-2 sm:px-3">
//                   <p className="text-base sm:text-xl font-bold text-gray-950">₹2,000+</p>
//                   <p className="text-[9.5px] sm:text-[10px] text-gray-500 font-medium">Free Insured Air</p>
//                 </div>
//                 <div>
//                   <p className="text-base sm:text-xl font-bold text-gray-950">7 Days</p>
//                   <p className="text-[9.5px] sm:text-[10px] text-gray-500 font-medium">Return Privilege</p>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column: Full Clear Bright Luxury Image */}
//             <div className="lg:col-span-7 relative animate-fade-in w-full">
//               <div className="rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-2 sm:p-2.5 shadow-xl group">
//                 <div className="overflow-hidden rounded-xl sm:rounded-2xl">
//                   <img
//                     src="/images/hero-luxury-bright.jpg"
//                     alt="Curated Luxury Collection"
//                     className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.01]"
//                   />
//                 </div>

//                 {/* Curated Heritage Caption Bar */}
//                 <div className="mt-2 sm:mt-2.5 flex items-center justify-between gap-2.5 sm:gap-4 rounded-xl bg-[#FAF9F6] border border-gray-200/80 px-3 sm:px-4 py-2 sm:py-2.5">
//                   <div className="flex items-center gap-2.5 min-w-0">
//                     <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-amber-50 border border-amber-200/60 text-amber-600 text-xs font-bold shrink-0">
//                       ★
//                     </span>
//                     <div className="min-w-0">
//                       <p className="text-[10px] sm:text-[11.5px] font-bold uppercase tracking-wider text-gray-900 truncate">
//                         Curated Heritage Showcase
//                       </p>
//                       <p className="text-[9px] sm:text-[10px] text-gray-500 truncate">
//                         Swiss Timepieces &bull; Handcrafted Leather &bull; Curated Goods
//                       </p>
//                     </div>
//                   </div>
//                   <span className="hidden sm:inline-flex text-[9.5px] font-bold text-[#B89758] uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 shrink-0">
//                     100% Authentic
//                   </span>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* ================= FOUR PILLARS GUARANTEE ================= */}
//       <section className="border-b border-gray-200/80 bg-white py-6 sm:py-8">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">

//             <div className="flex items-center gap-2.5 rounded-xl border border-gray-200/70 bg-[#F8F9FA] p-3 transition hover:border-gray-300 min-w-0">
//               <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-200/80 text-gray-900">
//                 <ShieldCheckIcon className="w-3.5 h-3.5" />
//               </div>
//               <div className="min-w-0">
//                 <h4 className="text-[10.5px] sm:text-[11px] font-semibold text-gray-950 uppercase tracking-wider truncate">Certified Authentic</h4>
//                 <p className="text-[9px] sm:text-[9.5px] text-gray-500 truncate">Official brand warranty</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2.5 rounded-xl border border-gray-200/70 bg-[#F8F9FA] p-3 transition hover:border-gray-300 min-w-0">
//               <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-200/80 text-gray-900">
//                 <TruckIcon className="w-3.5 h-3.5" />
//               </div>
//               <div className="min-w-0">
//                 <h4 className="text-[10.5px] sm:text-[11px] font-semibold text-gray-950 uppercase tracking-wider truncate">Express Dispatch</h4>
//                 <p className="text-[9px] sm:text-[9.5px] text-gray-500 truncate">Free on orders &ge; ₹2,000</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2.5 rounded-xl border border-gray-200/70 bg-[#F8F9FA] p-3 transition hover:border-gray-300 min-w-0">
//               <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-200/80 text-gray-900">
//                 <BoxIcon className="w-3.5 h-3.5" />
//               </div>
//               <div className="min-w-0">
//                 <h4 className="text-[10.5px] sm:text-[11px] font-semibold text-gray-950 uppercase tracking-wider truncate">Secure Packaging</h4>
//                 <p className="text-[9px] sm:text-[9.5px] text-gray-500 truncate">Multi-point inspected</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2.5 rounded-xl border border-gray-200/70 bg-[#F8F9FA] p-3 transition hover:border-gray-300 min-w-0">
//               <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-200/80 text-gray-900">
//                 <StarIcon className="w-3.5 h-3.5 text-gray-900" />
//               </div>
//               <div className="min-w-0">
//                 <h4 className="text-[10.5px] sm:text-[11px] font-semibold text-gray-950 uppercase tracking-wider truncate">Concierge Desk</h4>
//                 <p className="text-[9px] sm:text-[9.5px] text-gray-500 truncate">Ahmedabad flagship</p>
//               </div>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* ================= CURATED DEPARTMENTS - INTERACTIVE CAROUSEL ================= */}
//       <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 relative">
//         <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
//           <div>
//             <div className="flex items-center gap-2">
//               <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
//                 Explore Categories ({categoryList.length})
//               </span>
//               <span className="text-[9px] text-gray-400 font-medium hidden sm:inline">&bull; Swipe or use arrows</span>
//             </div>
//             <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
//               Curated Collections
//             </h2>
//           </div>

//           {/* Carousel Controls & View All */}
//           <div className="flex items-center gap-2.5 self-end sm:self-auto">
//             <Link
//               to="/shop"
//               className="text-xs font-semibold text-gray-700 hover:text-black hover:underline flex items-center gap-1 shrink-0 mr-1.5"
//             >
//               <span>View All</span>
//               <ArrowRightIcon className="w-3 h-3" />
//             </Link>

//             {/* Left Carousel Arrow */}
//             <button
//               type="button"
//               onClick={() => scrollCarousel('left')}
//               disabled={!canScrollLeft}
//               aria-label="Previous categories"
//               className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition-all duration-200 shadow-2xs ${
//                 canScrollLeft
//                   ? 'border-gray-300 bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 active:scale-95 cursor-pointer'
//                   : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed opacity-50'
//               }`}
//             >
//               <ChevronLeftIcon className="w-4 h-4" />
//             </button>

//             {/* Right Carousel Arrow */}
//             <button
//               type="button"
//               onClick={() => scrollCarousel('right')}
//               disabled={!canScrollRight}
//               aria-label="Next categories"
//               className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition-all duration-200 shadow-2xs ${
//                 canScrollRight
//                   ? 'border-gray-300 bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 active:scale-95 cursor-pointer'
//                   : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed opacity-50'
//               }`}
//             >
//               <ChevronRightIcon className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {/* Carousel Scroll Container */}
//         <div
//           ref={carouselRef}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           onMouseLeave={handleMouseUp}
//           className={`flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar select-none ${
//             isDragging ? 'cursor-grabbing' : 'cursor-grab'
//           }`}
//           style={{
//             scrollbarWidth: 'none',
//             msOverflowStyle: 'none'
//           }}
//         >
//           {categoryList.map((c) => {
//             const count = getProductCountForCategory(c.name);
//             return (
//               <Link
//                 key={c.name}
//                 to={`/shop?category=${encodeURIComponent(c.name)}`}
//                 onClick={handleCategoryClick}
//                 className="group relative flex-shrink-0 w-[165px] sm:w-[195px] md:w-[215px] lg:w-[225px] aspect-[0.82] overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-gray-300 hover:-translate-y-1 snap-start"
//               >
//                 {/* Background Luxury Photo */}
//                 <img
//                   src={c.image}
//                   alt={c.name}
//                   loading="lazy"
//                   className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108 pointer-events-none"
//                 />

//                 {/* Dark Cinematic Gradient Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

//                 {/* Top Badge: Product Count / Tag */}
//                 <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
//                   {count > 0 ? (
//                     <span className="rounded-full bg-black/40 backdrop-blur-md px-2 py-0.5 text-[8.5px] font-semibold text-white/90 border border-white/10 shadow-2xs">
//                       {count} {count === 1 ? 'Item' : 'Items'}
//                     </span>
//                   ) : (
//                     <span className="rounded-full bg-white/20 backdrop-blur-md px-2 py-0.5 text-[8.5px] font-medium text-white/90 border border-white/10">
//                       Curated
//                     </span>
//                   )}
//                   <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                     <ArrowRightIcon className="w-2.5 h-2.5" />
//                   </span>
//                 </div>

//                 {/* Bottom Content Bar */}
//                 <div className="absolute inset-x-2.5 bottom-2.5 pointer-events-none">
//                   <h3 className="text-xs sm:text-[13px] font-bold text-white transition-colors group-hover:text-amber-300 truncate leading-snug">
//                     {c.name}
//                   </h3>
//                   <p className="text-[9px] sm:text-[9.5px] text-gray-300 truncate mt-0.5 opacity-90 leading-tight">
//                     {c.tag || c.description}
//                   </p>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>

//         {/* Carousel Progress Indicator Track */}
//         <div className="mt-1 flex items-center justify-between gap-3 px-1">
//           <div className="h-1 flex-1 rounded-full bg-gray-200/80 overflow-hidden max-w-xs">
//             <div
//               className="h-full bg-[#0F172A] rounded-full transition-all duration-150"
//               style={{ width: `${Math.max(12, scrollProgress)}%` }}
//             />
//           </div>
//           <div className="flex items-center gap-1 text-[9px] text-gray-400 font-medium">
//             <span>Scroll for more categories ({categoryList.length})</span>
//           </div>
//         </div>
//       </section>

//       {/* ================= PROMOTIONAL VOUCHER BANNER ================= */}
//       <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pb-6">
//         <div className="rounded-2xl bg-[#0F172A] text-white p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 shadow-sm border border-slate-800">
//           <div className="flex items-center gap-3 w-full md:w-auto min-w-0">
//             <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-base border border-white/10">
//               🎁
//             </div>
//             <div className="min-w-0">
//               <span className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-amber-300">Exclusive Privé</span>
//               <h3 className="text-sm sm:text-base font-bold text-white leading-snug truncate">Save 10% Instant Discount &gt; ₹1,000</h3>
//               <p className="text-[10px] sm:text-[10.5px] text-gray-400 truncate">Coupon code: <strong className="text-white font-mono bg-white/10 px-1 py-0.2 rounded border border-white/10">KRISHNA10</strong></p>
//             </div>
//           </div>
//           <Link
//             to="/shop"
//             className="w-full md:w-auto text-center rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-gray-950 hover:bg-gray-100 transition shrink-0 shadow-2xs"
//           >
//             <span className="text-gray-950 font-bold">Claim Offer &rarr;</span>
//           </Link>
//         </div>
//       </section>

//       {/* ================= FEATURED RECOMMENDATIONS ================= */}
//       <section className="bg-white border-y border-gray-200/80 py-8 sm:py-10">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

//           <div className="flex items-end justify-between gap-3 mb-5">
//             <div>
//               <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">
//                 Top Recommendations
//               </span>
//               <h2 className="mt-0.5 text-lg sm:text-xl font-bold tracking-tight text-gray-950">
//                 Selected Editions
//               </h2>
//             </div>
//             <Link to="/shop" className="text-xs font-semibold text-gray-900 hover:underline flex items-center gap-1 shrink-0">
//               <span>View All</span>
//               <ArrowRightIcon className="w-3 h-3" />
//             </Link>
//           </div>

//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
//             {featured.map((product) => (
//               <ProductCard
//                 key={product.id}
//                 product={product}
//                 onAddToCart={handleAddToCart}
//                 onBuyNow={handleBuyNow}
//               />
//             ))}
//           </div>

//         </div>
//       </section>

//       {/* ================= CATEGORY-WISE BRAND SHOWCASE ================= */}
//       <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
//         <div className="text-center mb-5">
//           <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">Official Brand Partners</span>
//           <h2 className="mt-0.5 text-lg sm:text-xl font-bold tracking-tight text-gray-950">Explore by Brand</h2>
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
//           {partnerBrands.map((b) => (
//             <Link
//               key={b.name}
//               to={`/shop?category=${encodeURIComponent(b.cat)}&brand=${encodeURIComponent(b.name)}`}
//               className="group flex flex-col items-center justify-center p-2.5 rounded-xl border border-gray-200/80 bg-white text-center transition-all duration-150 hover:bg-[#0F172A] hover:text-white hover:border-[#0F172A]"
//             >
//               <span className="text-xs font-semibold text-gray-950 group-hover:text-white transition-colors truncate max-w-full">{b.name}</span>
//               <span className="text-[9px] text-gray-400 group-hover:text-gray-300 transition-colors truncate max-w-full">{b.cat}</span>
//             </Link>
//           ))}
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }        







import React, {
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react';
import {
  siAdidas,
  siApple,
  siBose,
  siDell,
  siGarmin,
  siNike,
  siRazer,
  siSamsung,
  siSony,
  siZara
} from 'simple-icons';

const brandFallbackPaths = {
  Fossil: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 3v6l4 2',
  Titan: 'M5 6h14M8 6v12m8-12v12M5 18h14',
  Rolex: 'M4 9l2-3 3 2 3-4 3 4 3-2 2 3-2 1v7H6v-7L4 9Z',
  Casio: 'M7 4h10v16H7V4Zm2 3h6v6H9V7Zm2 9h2',
  Hidesign: 'M5 8h14l-1 12H6L5 8Zm3 0a4 4 0 0 1 8 0',
  'Ray-Ban': 'M3 9h7l2 2 2-2h7l-1 7h-6l-2-3-2 3H4L3 9Z'
};

import { Link, useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

import {
  getProducts,
  getCategories
} from '../utils/productStore';

import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';

import {
  ShieldCheckIcon,
  TruckIcon,
  StarIcon,
  ArrowRightIcon,
  BoxIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '../components/Icons';


// ============================================================
// DEFAULT CATEGORY BANNERS
// ============================================================

const defaultCategoryBanners = [
  {
    name: 'Watches',
    description: 'Heritage Swiss & Smart Chronographs',
    image:
      'https://i.pinimg.com/736x/80/4d/7c/804d7c5ba3d69a866d1303f94299d564.jpg',
    tag: 'Titan, Fossil, Rolex, Casio'
  },

  {
    name: 'Bags & Wallets',
    description: 'Genuine Leather & Urban Backpacks',
    image:
      'https://i.pinimg.com/736x/15/dc/da/15dcdac0fcc6a94440471bf201b96b75.jpg',
    tag: 'Hidesign, Wildcraft, Tommy'
  },

  {
    name: 'Shoes',
    description: 'Handcrafted Sneakers & Running Footwear',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900',
    tag: 'Nike, Adidas, Puma, Jordan'
  },

  {
    name: 'Mobiles',
    description: 'Flagship Titanium Handsets & Gear',
    image:
      'https://i.pinimg.com/736x/00/9b/91/009b91eaa9c50df8e5d5681cbde9a9c3.jpg',
    tag: 'Apple, Samsung, OnePlus'
  },

  {
    name: 'Clothes & Fashion',
    description: 'Tailored Suits, Denim & Luxury Apparel',
    image:
      'https://i.pinimg.com/1200x/7e/e0/55/7ee055c1c667557a592fa716eb5005fc.jpg',
    tag: 'Levis, Zara, Tommy, Calvin Klein'
  },

  {
    name: 'Laptops',
    description: 'High-Performance OLED Workstations',
    image:
      'https://i.pinimg.com/1200x/fe/f7/b3/fef7b3cbaeb59afc974ab04dd20741e6.jpg',
    tag: 'Apple, Dell, HP, Asus'
  },

  {
    name: 'Electronics',
    description: 'Audiophile Noise-Cancelling Sound',
    image:
      'https://i.pinimg.com/1200x/db/6c/da/db6cdaadde558a889e0c812ea679d8e1.jpg',
    tag: 'Sony, Bose, JBL, Marshall'
  },

  {
    name: 'Smart Gadgets',
    description: 'Smart Rings, AI Devices & Wearables',
    image:
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=900',
    tag: 'Apple, Samsung, Google, boAt'
  },

  {
    name: 'Gaming',
    description: 'RGB Mechanical Gear & Consoles',
    image:
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=900',
    tag: 'Razer, Sony PS5, Logitech, Asus'
  },

  {
    name: 'Fitness',
    description: 'GPS Multi-Sport Trackers & Health',
    image:
      'https://i.pinimg.com/736x/ce/b4/1d/ceb41df7737b5918904522051f1f56f5.jpg',
    tag: 'Garmin, Fitbit, Apple, Noise'
  },

  {
    name: 'Fashion Accessories',
    description: 'Polarized Eyewear & Belts',
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900',
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
    description:
      'Where timeless design meets modern performance.',
    image:
      'https://i.pinimg.com/736x/80/4d/7c/804d7c5ba3d69a866d1303f94299d564.jpg'
  },

  {
    tag: 'LIMITED EDITION',
    titleLine1: 'HERITAGE.',
    titleLine2: 'SWISS CHRONOGRAPHS.',
    description:
      'Engineered for absolute accuracy and prestige.',
    image:
      'https://i.pinimg.com/736x/e6/df/98/e6df982c03d41dbf66fe9470007838c2.jpg'
  },

  {
    tag: 'AUTOMATIC SERIES',
    titleLine1: 'TIMELESS.',
    titleLine2: 'MASTERPIECE WATCHES.',
    description:
      'Crafted with sapphire crystal and fine leather.',
    image:
      'https://i.pinimg.com/736x/52/cc/2a/52cc2a9343298c070a2e66503a60b5cc.jpg'
  }
];


// ============================================================
// HOME COMPONENT
// ============================================================

export default function Home() {
  const navigate = useNavigate();

  // ----------------------------------------------------------
  // PRODUCTS
  // ----------------------------------------------------------

  const [products, setProducts] = useState(() => getProducts());

  const [toastMessage, setToastMessage] = useState('');

  // ----------------------------------------------------------
  // HERO SLIDER
  // ----------------------------------------------------------

  const [currentSlide, setCurrentSlide] = useState(0);

  // ----------------------------------------------------------
  // CATEGORY CAROUSEL
  // ----------------------------------------------------------

  const carouselRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const [canScrollRight, setCanScrollRight] = useState(true);

  const [scrollProgress, setScrollProgress] = useState(0);

  const [isDragging, setIsDragging] = useState(false);

  const [startX, setStartX] = useState(0);

  const [scrollLeft, setScrollLeft] = useState(0);

  const [hasMoved, setHasMoved] = useState(false);


  // ==========================================================
  // CATEGORY LIST
  // ==========================================================

  const [categoryList, setCategoryList] = useState(() => {
    const storedCats = getCategories();

    const bannerNames = new Set(
      defaultCategoryBanners.map((b) =>
        b.name.toLowerCase()
      )
    );

    const customBanners = storedCats
      .filter(
        (cat) =>
          !bannerNames.has(cat.toLowerCase())
      )
      .map((cat) => ({
        name: cat,
        description: `Explore ${cat} Collection`,
        image:
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900',
        tag: 'Curated Essentials'
      }));

    return [
      ...defaultCategoryBanners,
      ...customBanners
    ];
  });


  // ==========================================================
  // HERO AUTO SLIDER
  // ==========================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(
        (prev) =>
          (prev + 1) % watchHeroSlides.length
      );
    }, 6000);

    return () => clearInterval(timer);
  }, []);


  // ==========================================================
  // PRODUCT / CATEGORY UPDATE EVENTS
  // ==========================================================

  useEffect(() => {
    const handleUpdate = () => {
      setProducts(getProducts());

      const storedCats = getCategories();

      const bannerNames = new Set(
        defaultCategoryBanners.map((b) =>
          b.name.toLowerCase()
        )
      );

      const customBanners = storedCats
        .filter(
          (cat) =>
            !bannerNames.has(cat.toLowerCase())
        )
        .map((cat) => ({
          name: cat,
          description: `Explore ${cat} Collection`,
          image:
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900',
          tag: 'Curated Essentials'
        }));

      setCategoryList([
        ...defaultCategoryBanners,
        ...customBanners
      ]);
    };

    window.addEventListener(
      'productsUpdated',
      handleUpdate
    );

    window.addEventListener(
      'categoriesUpdated',
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        'productsUpdated',
        handleUpdate
      );

      window.removeEventListener(
        'categoriesUpdated',
        handleUpdate
      );
    };
  }, []);


  // ==========================================================
  // CHECK CAROUSEL SCROLL
  // ==========================================================

  const checkScroll = useCallback(() => {
    if (!carouselRef.current) return;

    const {
      scrollLeft,
      scrollWidth,
      clientWidth
    } = carouselRef.current;

    setCanScrollLeft(
      scrollLeft > 10
    );

    setCanScrollRight(
      scrollLeft <
        scrollWidth -
          clientWidth -
          10
    );

    const maxScroll =
      scrollWidth - clientWidth;

    setScrollProgress(
      maxScroll > 0
        ? (scrollLeft / maxScroll) * 100
        : 0
    );
  }, []);


  // ==========================================================
  // CAROUSEL LISTENER
  // ==========================================================

  useEffect(() => {
    const el = carouselRef.current;

    if (!el) return;

    checkScroll();

    el.addEventListener(
      'scroll',
      checkScroll,
      { passive: true }
    );

    window.addEventListener(
      'resize',
      checkScroll
    );

    return () => {
      el.removeEventListener(
        'scroll',
        checkScroll
      );

      window.removeEventListener(
        'resize',
        checkScroll
      );
    };
  }, [checkScroll, categoryList]);


  // ==========================================================
  // CAROUSEL SCROLL BUTTON
  // ==========================================================

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;

    const container =
      carouselRef.current;

    const cardWidth =
      container.firstElementChild
        ?.clientWidth || 220;

    const scrollAmount =
      (cardWidth + 14) * 2;

    container.scrollBy({
      left:
        direction === 'left'
          ? -scrollAmount
          : scrollAmount,
      behavior: 'smooth'
    });
  };


  // ==========================================================
  // DRAG CAROUSEL
  // ==========================================================

  const handleMouseDown = (e) => {
    if (!carouselRef.current) return;

    setIsDragging(true);

    setHasMoved(false);

    setStartX(
      e.pageX -
        carouselRef.current.offsetLeft
    );

    setScrollLeft(
      carouselRef.current.scrollLeft
    );
  };


  const handleMouseMove = (e) => {
    if (
      !isDragging ||
      !carouselRef.current
    ) {
      return;
    }

    e.preventDefault();

    const x =
      e.pageX -
      carouselRef.current.offsetLeft;

    const walk =
      (x - startX) * 1.5;

    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }

    carouselRef.current.scrollLeft =
      scrollLeft - walk;
  };


  const handleMouseUp = () => {
    setIsDragging(false);
  };


  const handleCategoryClick = (e) => {
    if (hasMoved) {
      e.preventDefault();
    }
  };


  // ==========================================================
  // FEATURED PRODUCTS
  // ==========================================================

  const featured =
    products.slice(0, 8);


  // ==========================================================
  // CATEGORY PRODUCT COUNT
  // ==========================================================

  const getProductCountForCategory = (
    catName
  ) => {
    return products.filter(
      (p) =>
        p.category?.toLowerCase() ===
        catName.toLowerCase()
    ).length;
  };


  // ==========================================================
  // ADD TO CART
  // ==========================================================

  const handleAddToCart = (product) => {
    if (!getCurrentUser()) {
      navigate('/login');
      return;
    }

    addToCart(
      product,
      1,
      product.colors?.[0] || '',
      product.variants?.[0] || ''
    );

    setToastMessage(
      `✓ Added "${product.name}" to your bag`
    );

    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };


  // ==========================================================
  // BUY NOW
  // ==========================================================

  const handleBuyNow = (product) => {
    if (!getCurrentUser()) {
      navigate('/login');
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


  // ==========================================================
  // PARTNER BRANDS
  // ==========================================================

  const partnerBrands = [
    {
      name: 'Titan',
      cat: 'Watches',
      icon: null
    },
    {
      name: 'Fossil',
      cat: 'Watches',
      icon: null
    },
    {
      name: 'Rolex',
      cat: 'Watches',
      icon: null
    },
    {
      name: 'Casio',
      cat: 'Watches',
      icon: null
    },
    {
      name: 'Nike',
      cat: 'Shoes',
      icon: siNike
    },
    {
      name: 'Adidas',
      cat: 'Shoes',
      icon: siAdidas
    },
    {
      name: 'Hidesign',
      cat: 'Bags & Wallets',
      icon: null
    },
    {
      name: 'Apple',
      cat: 'Mobiles',
      icon: siApple
    },
    {
      name: 'Samsung',
      cat: 'Mobiles',
      icon: siSamsung
    },
    {
      name: 'Sony',
      cat: 'Electronics',
      icon: siSony
    },
    {
      name: 'Bose',
      cat: 'Electronics',
      icon: siBose
    },
    {
      name: 'Dell',
      cat: 'Laptops',
      icon: siDell
    },
    {
      name: 'Zara',
      cat: 'Clothes & Fashion',
      icon: siZara
    },
    {
      name: 'Razer',
      cat: 'Gaming',
      icon: siRazer
    },
    {
      name: 'Garmin',
      cat: 'Fitness',
      icon: siGarmin
    },
    {
      name: 'Ray-Ban',
      cat: 'Fashion Accessories',
      icon: null
    }
  ];


  // ==========================================================
  // RETURN
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip select-none sm:select-auto">

      <Navbar />


      {/* ======================================================
          FLOATING TOAST
      ====================================================== */}

      {toastMessage && (
        <div className="
          fixed
          bottom-4
          right-4
          z-50
          flex
          items-center
          gap-2
          rounded-xl
          border
          border-gray-200
          bg-white
          px-3.5
          py-2
          text-xs
          font-semibold
          text-gray-900
          shadow-xl
          animate-slide-up
          max-w-[calc(100vw-32px)]
        ">

          <span className="
            flex
            h-5
            w-5
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-emerald-100
            text-emerald-700
            text-xs
          ">
            ✓
          </span>

          <span className="truncate">
            {toastMessage}
          </span>

          <Link
            to="/cart"
            className="
              ml-1
              rounded-full
              bg-[#111827]
              px-2.5
              py-0.5
              text-[10px]
              font-semibold
              text-white
              hover:bg-black
              transition
              shrink-0
            "
          >
            Bag
          </Link>

        </div>
      )}


      {/* ======================================================
          LUXURY WATCH HERO
      ====================================================== */}

      <section className="
        relative
        w-full
        overflow-hidden
        bg-[#070808]
        text-white
        border-b
        border-neutral-800
        lg:h-[670px]
        lg:min-h-[670px]
      ">

        {/* ----------------------------------------------------
            HERO BACKGROUND
        ---------------------------------------------------- */}

        <div className="absolute inset-0">

          {watchHeroSlides.map(
            (slide, index) => (
              <div
                key={slide.titleLine1}
                className={`
                  absolute
                  inset-0
                  transition-opacity
                  duration-1000
                  ease-in-out
                  ${
                    index === currentSlide
                      ? 'opacity-100'
                      : 'opacity-0 pointer-events-none'
                  }
                `}
              >

                {/* WATCH IMAGE CONTAINER (Responsive: Full cover on mobile/tablet, right-side framed on desktop) */}

                <div className="
                  absolute
                  inset-0
                  lg:left-auto
                  lg:right-0
                  lg:w-[56%]
                  xl:w-[50%]
                  2xl:w-[46%]
                  h-full
                  w-full
                ">
                  <img
                    src={slide.image}
                    alt={slide.titleLine1}
                    className="
                      h-full
                      w-full
                      object-cover
                      object-[72%_center]
                      sm:object-[68%_center]
                      lg:object-center
                      scale-[1.02]
                      lg:scale-100
                    "
                  />

                  {/* Desktop inner left edge fade for seamless dark blend */}
                  <div className="
                    hidden
                    lg:block
                    absolute
                    inset-y-0
                    left-0
                    w-48
                    xl:w-64
                    bg-gradient-to-r
                    from-[#070808]
                    to-transparent
                    pointer-events-none
                  " />
                </div>


                {/* LEFT DARK GRADIENT (Solid dark negative space on desktop for text legibility) */}

                <div className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-black
                  via-black/65
                  to-black/10
                  lg:from-[#070808]
                  lg:via-[#070808]/90
                  lg:via-45%
                  lg:to-transparent
                  pointer-events-none
                " />


                {/* BOTTOM GRADIENT */}

                <div className="
                  absolute
                  inset-x-0
                  bottom-0
                  h-52
                  bg-gradient-to-t
                  from-black/90
                  via-black/30
                  to-transparent
                  lg:from-[#070808]
                  lg:via-[#070808]/60
                  pointer-events-none
                " />


                {/* PREMIUM VIGNETTE */}

                <div className="
                  absolute
                  inset-0
                  bg-[radial-gradient(circle_at_72%_45%,transparent_0%,rgba(0,0,0,0.08)_45%,rgba(0,0,0,0.35)_100%)]
                  lg:bg-[radial-gradient(ellipse_at_75%_50%,transparent_30%,rgba(7,8,8,0.4)_75%,#070808_100%)]
                  pointer-events-none
                " />

              </div>
            )
          )}

        </div>


        {/* ----------------------------------------------------
            HERO CONTENT
        ---------------------------------------------------- */}

        <div className="
          relative
          z-20
          mx-auto
          max-w-7xl
          w-full
          min-h-[560px]
          sm:min-h-[590px]
          lg:min-h-[670px]
          lg:h-full
          px-5
          sm:px-8
          lg:px-10
          pt-16
          sm:pt-20
          lg:pt-0
          pb-8
          lg:pb-6
          flex
          flex-col
          justify-between
        ">

          {/* --------------------------------------------------
              MAIN CONTENT
          -------------------------------------------------- */}

          <div className="
            max-w-[620px]
            lg:my-auto
            lg:py-6
          ">

            {/* COLLECTION LABEL */}

            <div className="
              mb-5
              flex
              items-center
              gap-3
            ">

              <span className="
                h-px
                w-8
                bg-[#C5A880]
              " />

              <span className="
                text-[10px]
                sm:text-xs
                font-semibold
                uppercase
                tracking-[0.28em]
                text-[#D5C2A5]
              ">
                {watchHeroSlides[currentSlide].tag}
              </span>

            </div>


            {/* HERO TITLE */}

            <h1 className="
              text-[42px]
              leading-[1.02]
              tracking-[-0.03em]
              font-semibold
              sm:text-5xl
              lg:text-[68px]
              xl:text-[74px]
            ">

              <span className="
                block
                text-white
              ">
                {
                  watchHeroSlides[
                    currentSlide
                  ].titleLine1
                }
              </span>


              <span className="
                block
                mt-1
                font-light
                text-[#C9AB80]
              ">
                {
                  watchHeroSlides[
                    currentSlide
                  ].titleLine2
                }
              </span>

            </h1>


            {/* DESCRIPTION */}

            <p className="
              mt-6
              max-w-[430px]
              text-sm
              sm:text-[15px]
              leading-7
              text-neutral-300
            ">
              {
                watchHeroSlides[
                  currentSlide
                ].description
              }
            </p>


            {/* BUTTONS */}

            <div className="
              mt-8
              flex
              flex-wrap
              gap-3
            ">

              <Link
                to="/shop?category=Watches"
                className="
                  inline-flex
                  h-12
                  items-center
                  justify-center
                  rounded-md
                  bg-[#C5A880]
                  px-7
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-[#111]
                  transition-all
                  duration-300
                  hover:bg-[#D6BC96]
                  hover:-translate-y-0.5
                  hover:shadow-lg
                "
              >
                Shop New In
              </Link>


              <Link
                to="/shop"
                className="
                  inline-flex
                  h-12
                  items-center
                  justify-center
                  rounded-md
                  border
                  border-white/30
                  bg-white/[0.03]
                  px-7
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-white
                  backdrop-blur-sm
                  transition-all
                  duration-300
                  hover:bg-white/10
                  hover:border-white/50
                  hover:-translate-y-0.5
                "
              >
                Explore Collections
              </Link>

            </div>


            {/* SLIDER INDICATORS */}

            <div className="
              mt-9
              flex
              items-center
              gap-2
            ">

              {watchHeroSlides.map(
                (_, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setCurrentSlide(idx)
                    }
                    aria-label={`Go to slide ${
                      idx + 1
                    }`}
                    className={`
                      h-1.5
                      rounded-full
                      transition-all
                      duration-300
                      ${
                        idx === currentSlide
                          ? 'w-8 bg-[#C5A880]'
                          : 'w-2 bg-white/35 hover:bg-white/60'
                      }
                    `}
                  />
                )
              )}

            </div>

          </div>


          {/* --------------------------------------------------
              FEATURE BAR
          -------------------------------------------------- */}

          <div className="
            mt-12
            border-t
            border-white/15
            pt-6
            grid
            grid-cols-2
            gap-y-5
            gap-x-4
            md:grid-cols-4
            md:gap-6
            lg:mt-0
            lg:pt-5
            lg:pb-1
            lg:border-white/10
            lg:gap-8
          ">

            {/* FREE SHIPPING */}

            <div className="
              flex
              items-center
              gap-3
            ">

              <TruckIcon className="
                h-5
                w-5
                shrink-0
                text-[#C5A880]
              " />

              <div>

                <p className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-white
                ">
                  Free Shipping
                </p>

                <p className="
                  mt-0.5
                  text-[9px]
                  text-neutral-400
                ">
                  On orders over $75
                </p>

              </div>

            </div>


            {/* EASY RETURNS */}

            <div className="
              flex
              items-center
              gap-3
            ">

              <BoxIcon className="
                h-5
                w-5
                shrink-0
                text-[#C5A880]
              " />

              <div>

                <p className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-white
                ">
                  Easy Returns
                </p>

                <p className="
                  mt-0.5
                  text-[9px]
                  text-neutral-400
                ">
                  30-day hassle free returns
                </p>

              </div>

            </div>


            {/* SECURE PAYMENT */}

            <div className="
              flex
              items-center
              gap-3
            ">

              <ShieldCheckIcon className="
                h-5
                w-5
                shrink-0
                text-[#C5A880]
              " />

              <div>

                <p className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-white
                ">
                  Secure Payment
                </p>

                <p className="
                  mt-0.5
                  text-[9px]
                  text-neutral-400
                ">
                  100% secure checkout
                </p>

              </div>

            </div>


            {/* CUSTOMER SUPPORT */}

            <div className="
              flex
              items-center
              gap-3
            ">

              <StarIcon className="
                h-5
                w-5
                shrink-0
                text-[#C5A880]
              " />

              <div>

                <p className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-white
                ">
                  Customer Support
                </p>

                <p className="
                  mt-0.5
                  text-[9px]
                  text-neutral-400
                ">
                  We're here to help
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          CURATED COLLECTIONS
      ====================================================== */}

      <section className="
        mx-auto
        max-w-7xl
        px-4
        py-8
        sm:px-6
        sm:py-10
        lg:px-8
        relative
      ">

        {/* SECTION HEADER */}

        <div className="
          flex
          flex-col
          sm:flex-row
          sm:items-end
          justify-between
          gap-3
          mb-5
        ">

          <div>

            <div className="
              flex
              items-center
              gap-2
            ">

              <span className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-amber-600
                bg-amber-50
                px-2
                py-0.5
                rounded-full
                border
                border-amber-200/60
              ">
                Explore Categories (
                {categoryList.length}
                )
              </span>

              <span className="
                text-[9px]
                text-gray-400
                font-medium
                hidden
                sm:inline
              ">
                • Swipe or use arrows
              </span>

            </div>


            <h2 className="
              mt-1
              text-xl
              sm:text-2xl
              font-bold
              tracking-tight
              text-gray-950
            ">
              Curated Collections
            </h2>

          </div>


          {/* CAROUSEL CONTROLS */}

          <div className="
            flex
            items-center
            gap-2.5
            self-end
            sm:self-auto
          ">

            <Link
              to="/shop"
              className="
                text-xs
                font-semibold
                text-gray-700
                hover:text-black
                hover:underline
                flex
                items-center
                gap-1
                shrink-0
                mr-1.5
              "
            >
              <span>View All</span>
            </Link>

          </div>

        </div>


        {/* CATEGORY CAROUSEL */}

        <div
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`
            flex
            gap-3
            sm:gap-4
            overflow-x-auto
            pb-4
            pt-1
            snap-x
            snap-mandatory
            scroll-smooth
            no-scrollbar
            select-none
            ${
              isDragging
                ? 'cursor-grabbing'
                : 'cursor-grab'
            }
          `}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >

          {categoryList.map((c) => {

            const count =
              getProductCountForCategory(
                c.name
              );

            return (

              <Link
                key={c.name}
                to={`/shop?category=${encodeURIComponent(
                  c.name
                )}`}
                onClick={
                  handleCategoryClick
                }
                className="
                  group
                  relative
                  flex-shrink-0
                  w-[165px]
                  sm:w-[195px]
                  md:w-[215px]
                  lg:w-[225px]
                  aspect-[0.82]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-200/90
                  bg-white
                  shadow-sm
                  transition-all
                  duration-300
                  hover:shadow-xl
                  hover:border-gray-300
                  hover:-translate-y-1
                  snap-start
                "
              >

                {/* IMAGE */}

                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  draggable="false"
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-500
                    ease-out
                    group-hover:scale-[1.08]
                    pointer-events-none
                  "
                />


                {/* OVERLAY */}

                <div className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/90
                  via-black/35
                  to-transparent
                  pointer-events-none
                " />


                {/* TOP BADGES */}

                <div className="
                  absolute
                  top-2.5
                  left-2.5
                  right-2.5
                  flex
                  items-center
                  justify-between
                  pointer-events-none
                ">

                  {count > 0 ? (

                    <span className="
                      rounded-full
                      bg-black/40
                      backdrop-blur-md
                      px-2
                      py-0.5
                      text-[8.5px]
                      font-semibold
                      text-white/90
                      border
                      border-white/10
                      shadow-2xs
                    ">
                      {count}{' '}
                      {count === 1
                        ? 'Item'
                        : 'Items'}
                    </span>

                  ) : (

                    <span className="
                      rounded-full
                      bg-white/20
                      backdrop-blur-md
                      px-2
                      py-0.5
                      text-[8.5px]
                      font-medium
                      text-white/90
                      border
                      border-white/10
                    ">
                      Curated
                    </span>

                  )}


                  <span className="
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-white/20
                    backdrop-blur-md
                    text-white
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-200
                  ">
                    <ArrowRightIcon className="
                      w-2.5
                      h-2.5
                    " />
                  </span>

                </div>


                {/* BOTTOM CONTENT */}

                <div className="
                  absolute
                  inset-x-2.5
                  bottom-2.5
                  pointer-events-none
                ">

                  <h3 className="
                    text-xs
                    sm:text-[13px]
                    font-bold
                    text-white
                    transition-colors
                    group-hover:text-amber-300
                    truncate
                    leading-snug
                  ">
                    {c.name}
                  </h3>

                  <p className="
                    text-[9px]
                    sm:text-[9.5px]
                    text-gray-300
                    truncate
                    mt-0.5
                    opacity-90
                    leading-tight
                  ">
                    {c.tag ||
                      c.description}
                  </p>

                </div>

              </Link>

            );
          })}

        </div>

      </section>


      {/* ======================================================
          PROMOTIONAL VOUCHER
      ====================================================== */}

      <section className="
        mx-auto
        max-w-7xl
        px-3
        sm:px-6
        lg:px-8
        pb-6
      ">

        <div className="
          rounded-2xl
          bg-[#0F172A]
          text-white
          p-4
          sm:p-5
          flex
          flex-col
          md:flex-row
          items-center
          justify-between
          gap-3
          sm:gap-4
          shadow-sm
          border
          border-slate-800
        ">

          <div className="
            flex
            items-center
            gap-3
            w-full
            md:w-auto
            min-w-0
          ">

            <div className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-white/10
              text-base
              border
              border-white/10
            ">
              🎁
            </div>

            <div className="min-w-0">

              <span className="
                text-[8.5px]
                font-bold
                uppercase
                tracking-[0.14em]
                text-amber-300
              ">
                Exclusive Privé
              </span>

              <h3 className="
                text-sm
                sm:text-base
                font-bold
                text-white
                leading-snug
                truncate
              ">
                Save 10% Instant Discount
                &gt; ₹1,000
              </h3>

              <p className="
                text-[10px]
                sm:text-[10.5px]
                text-gray-400
                truncate
              ">
                Coupon code:{' '}

                <strong className="
                  text-white
                  font-mono
                  bg-white/10
                  px-1
                  py-0.2
                  rounded
                  border
                  border-white/10
                ">
                  KRISHNA10
                </strong>
              </p>

            </div>

          </div>


          <Link
            to="/shop"
            className="
              w-full
              md:w-auto
              text-center
              rounded-full
              bg-white
              px-5
              py-2
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-gray-950
              hover:bg-gray-100
              transition
              shrink-0
              shadow-2xs
            "
          >
            Claim Offer →
          </Link>

        </div>

      </section>


      {/* ======================================================
          FEATURED PRODUCTS
      ====================================================== */}

      <section className="
        bg-white
        border-y
        border-gray-200/80
        py-8
        sm:py-10
      ">

        <div className="
          mx-auto
          max-w-7xl
          px-4
          sm:px-6
          lg:px-8
        ">

          {/* HEADER */}

          <div className="
            flex
            items-end
            justify-between
            gap-3
            mb-5
          ">

            <div>

              <span className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-gray-400
              ">
                Top Recommendations
              </span>

              <h2 className="
                mt-0.5
                text-lg
                sm:text-xl
                font-bold
                tracking-tight
                text-gray-950
              ">
                Selected Editions
              </h2>

            </div>


            <Link
              to="/shop"
              className="
                text-xs
                font-semibold
                text-gray-900
                hover:underline
                flex
                items-center
                gap-1
                shrink-0
              "
            >
              <span>
                View All
              </span>

              <ArrowRightIcon className="
                w-3
                h-3
              " />
            </Link>

          </div>


          {/* PRODUCT GRID */}

          <div className="
            grid
            grid-cols-2
            sm:grid-cols-2
            lg:grid-cols-4
            gap-2.5
            sm:gap-3.5
          ">

            {featured.map(
              (product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={
                    handleAddToCart
                  }
                  onBuyNow={
                    handleBuyNow
                  }
                />
              )
            )}

          </div>

        </div>

      </section>


      {/* ======================================================
          BRAND SHOWCASE
      ====================================================== */}

      <section className="
        mx-auto
        max-w-7xl
        px-4
        py-8
        sm:px-6
        sm:py-10
        lg:px-8
      ">

        <div className="
          text-center
          mb-5
        ">

          <span className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-gray-400
          ">
            Official Brand Partners
          </span>

          <h2 className="
            mt-0.5
            text-lg
            sm:text-xl
            font-bold
            tracking-tight
            text-gray-950
          ">
            Explore by Brand
          </h2>

        </div>


        {/* BRANDS */}

        <div className="
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-6
          gap-2
        ">

          {partnerBrands.map(
            (b) => (

              <Link
                key={b.name}
                to={`/shop?category=${encodeURIComponent(
                  b.cat
                )}&brand=${encodeURIComponent(
                  b.name
                )}`}
                className="
                  group
                  flex
                  flex-col
                  items-center
                  justify-center
                  p-2.5
                  rounded-xl
                  border
                  border-gray-200/80
                  bg-white
                  text-center
                  transition-all
                  duration-150
                  hover:bg-[#0F172A]
                  hover:text-white
                  hover:border-[#0F172A]
                "
              >

                <span className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-800 transition-colors group-hover:border-white/30 group-hover:bg-white/10 group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4 fill-current"
                  >
                    <path d={b.icon?.path || brandFallbackPaths[b.name]} />
                  </svg>
                </span>

                <span className="
                  text-xs
                  font-semibold
                  text-gray-950
                  group-hover:text-white
                  transition-colors
                  truncate
                  max-w-full
                ">
                  {b.name}
                </span>

                <span className="
                  text-[9px]
                  text-gray-400
                  group-hover:text-gray-300
                  transition-colors
                  truncate
                  max-w-full
                ">
                  {b.cat}
                </span>

              </Link>

            )
          )}

        </div>

      </section>


      {/* ======================================================
          FOOTER
      ====================================================== */}

      <Footer />

    </div>
  );
}