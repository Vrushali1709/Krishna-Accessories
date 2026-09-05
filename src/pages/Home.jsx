// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import ProductCard from '../components/ProductCard';
// import { getProducts } from '../utils/productStore';
// import { addToCart } from '../utils/cart';
// import { getCurrentUser } from '../utils/auth';
// import { ShieldCheckIcon, TruckIcon, StarIcon, ArrowRightIcon, BoxIcon } from '../components/Icons';

// const categoryBanners = [
//   {
//     name: 'Watches',
//     description: 'Heritage Swiss & Smart Chronographs',
//     image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900',
//     tag: 'Titan, Fossil, Rolex, Casio'
//   },
//   {
//     name: 'Bags & Wallets',
//     description: 'Genuine Leather & Urban Backpacks',
//     image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900',
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
//     image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900',
//     tag: 'Apple, Samsung, OnePlus'
//   },
//   {
//     name: 'Laptops',
//     description: 'High-Performance OLED Workstations',
//     image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900',
//     tag: 'Apple, Dell, HP, Asus'
//   },
//   {
//     name: 'Electronics',
//     description: 'Audiophile Noise-Cancelling Sound',
//     image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900',
//     tag: 'Sony, Bose, JBL, Marshall'
//   },
// ];

// export default function Home() {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState(() => getProducts());
//   const [toastMessage, setToastMessage] = useState('');

//   useEffect(() => {
//     const handleUpdate = () => setProducts(getProducts());
//     window.addEventListener('productsUpdated', handleUpdate);
//     return () => window.removeEventListener('productsUpdated', handleUpdate);
//   }, []);

//   const featured = products.slice(0, 8);

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
//     { name: 'Dell', cat: 'Laptops' }
//   ];

//   return (
//     <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
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

//                 {/* Curated Heritage Caption Bar (Positioned below the image so image is 100% visible and unobstructed) */}
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

//       {/* ================= CURATED DEPARTMENTS ================= */}
//       <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
//         <div className="flex items-end justify-between mb-4">
//           <div>
//             <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">Departments</span>
//             <h2 className="mt-0.5 text-lg sm:text-xl font-bold tracking-tight text-gray-950">Curated Collections</h2>
//           </div>
//           <Link to="/shop" className="text-xs font-semibold text-gray-900 hover:underline flex items-center gap-1 shrink-0">
//             <span>View All</span>
//             <ArrowRightIcon className="w-3 h-3" />
//           </Link>
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
//           {categoryBanners.map((c) => (
//             <Link
//               key={c.name}
//               to={`/shop?category=${encodeURIComponent(c.name)}`}
//               className="group relative aspect-[0.85] overflow-hidden rounded-xl border border-gray-200/80 bg-white transition-all duration-200 hover:shadow-md hover:border-gray-300"
//             >
//               <img
//                 src={c.image}
//                 alt={c.name}
//                 className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-106"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

//               <div className="absolute inset-x-2 bottom-2">
//                 <h3 className="text-xs font-bold text-white transition truncate">
//                   {c.name}
//                 </h3>
//                 <p className="text-[9px] text-gray-300 truncate">{c.tag}</p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </section>

//       {/* ================= PROMOTIONAL VOUCHER BANNER ================= */}
//       <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
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








import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { ShieldCheckIcon, TruckIcon, StarIcon, ArrowRightIcon, BoxIcon } from '../components/Icons';

/* =============================================================
   NEW THEME NOTE:
   Old theme  -> Navy (#0F172A) + Gold (#B89758) + cool white (#FAFAFB)
   New theme  -> Charcoal (#1A1512) + Warm Bronze (#C17F4B) + warm ivory (#FAF7F1)
   This gives a warmer, boutique-jewelry feel instead of the cooler
   corporate navy look. Change the hex values below if you want a
   third option later — they are centralized here for easy tweaking.
============================================================= */
const THEME = {
  dark: '#1A1512',
  darkSoft: '#241D18',
  accent: '#C17F4B',
  accentSoft: '#E8B98A',
  bg: '#FAF7F1',
  card: '#FFFFFF',
};

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

// NEW: static testimonials section (swap in real reviews later if you add a reviews API)
const testimonials = [
  {
    name: 'Aarav Shah',
    city: 'Ahmedabad',
    rating: 5,
    text: 'Bought a Titan chronograph — arrived with full warranty card and authentic packaging. Genuinely felt like a boutique experience.'
  },
  {
    name: 'Priya Mehta',
    city: 'Surat',
    rating: 5,
    text: 'The leather wallet quality is excellent and delivery was faster than promised. Will definitely order again for Diwali gifting.'
  },
  {
    name: 'Kunal Joshi',
    city: 'Vadodara',
    rating: 4,
    text: 'Good range of brands at fair prices. Customer support helped me pick the right strap size over WhatsApp.'
  }
];

// NEW: journal / guide teaser cards (static content, purely for trust + SEO)
const journalPosts = [
  {
    title: 'How to Spot a Fake Luxury Watch',
    tag: 'Authenticity Guide',
    image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600'
  },
  {
    title: 'Leather Care 101: Keep Your Bag Looking New',
    tag: 'Care & Maintenance',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600'
  },
  {
    title: "Choosing the Right Watch Strap Size",
    tag: 'Buying Guide',
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600'
  }
];

// NEW: simple countdown hook for the limited-time offer banner
function useCountdown(hours = 6) {
  const [target] = useState(() => Date.now() + hours * 60 * 60 * 1000);
  const [remaining, setRemaining] = useState(target - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(Math.max(0, target - Date.now()));
    }, 1000);
    return () => clearInterval(timer);
  }, [target]);

  const totalSeconds = Math.floor(remaining / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return { h, m, s };
}

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(() => getProducts());
  const [toastMessage, setToastMessage] = useState('');
  const countdown = useCountdown(6);

  useEffect(() => {
    const handleUpdate = () => setProducts(getProducts());
    window.addEventListener('productsUpdated', handleUpdate);
    return () => window.removeEventListener('productsUpdated', handleUpdate);
  }, []);

  // Top rated products (rating-sorted instead of raw list order)
  const topRated = useMemo(() => {
    return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8);
  }, [products]);

  // NEW: New Arrivals — most recently added products (highest id assumed = newest)
  const newArrivals = useMemo(() => {
    return [...products].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 4);
  }, [products]);

  // Dynamic brand showcase derived from live product data
  const partnerBrands = useMemo(() => {
    const seen = new Map();
    products.forEach((p) => {
      if (p.brand && !seen.has(p.brand)) {
        seen.set(p.brand, p.category || 'Shop');
      }
    });
    return Array.from(seen.entries()).slice(0, 12).map(([name, cat]) => ({ name, cat }));
  }, [products]);

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

  return (
    <div className="min-h-screen text-gray-900 overflow-x-clip" style={{ backgroundColor: THEME.bg }}>
      <Navbar />

      {/* Floating Alert Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-900 shadow-xl animate-slide-up max-w-[calc(100vw-32px)]">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">✓</span>
          <span className="truncate">{toastMessage}</span>
          <Link
            to="/cart"
            className="ml-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white hover:opacity-90 transition shrink-0"
            style={{ backgroundColor: THEME.dark }}
          >
            Bag
          </Link>
        </div>
      )}

      {/* ================= HERO ================= */}
      <section
        className="relative overflow-hidden border-b"
        style={{ background: `linear-gradient(180deg, #FFFDF9 0%, ${THEME.bg} 60%, ${THEME.bg} 100%)`, borderColor: '#EAE2D6' }}
      >
        <div className="mx-auto flex min-h-[460px] lg:min-h-[520px] max-w-7xl items-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">

            <div className="lg:col-span-5 text-center lg:text-left mx-auto lg:mx-0 max-w-xl">
              <div
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 mb-4 border shadow-2xs"
                style={{ borderColor: `${THEME.accent}40` }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: THEME.accent }} />
                <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.16em] text-gray-800 uppercase">
                  Authorized Retailer & Luxury Consignment
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight leading-[1.14]" style={{ color: THEME.dark }}>
                Curated Luxury <br />
                <span className="font-serif italic font-normal" style={{ color: THEME.accent }}>Timepieces & Essentials</span>
              </h1>

              <p className="mt-3.5 text-xs sm:text-[13.5px] leading-relaxed text-gray-600 max-w-md mx-auto lg:mx-0">
                Direct access to brand-certified Swiss and heritage watches, handcrafted leather bags, performance sneakers, and flagship technology with 100% verified authenticity and complimentary insured shipping.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md transition hover:scale-[1.02]"
                  style={{ backgroundColor: THEME.dark }}
                >
                  <span>Explore Catalog</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to="/shop?category=Watches"
                  className="inline-flex items-center gap-2 rounded-full border bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition hover:bg-gray-50 shadow-2xs"
                  style={{ borderColor: '#DDD2C2', color: THEME.dark }}
                >
                  Watch Collections
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 border-t pt-5 max-w-md mx-auto lg:mx-0" style={{ borderColor: '#EAE2D6' }}>
                <div>
                  <p className="text-base sm:text-xl font-bold" style={{ color: THEME.dark }}>100%</p>
                  <p className="text-[9.5px] sm:text-[10px] text-gray-500 font-medium">Genuine Authenticity</p>
                </div>
                <div className="border-x px-2 sm:px-3" style={{ borderColor: '#EAE2D6' }}>
                  <p className="text-base sm:text-xl font-bold" style={{ color: THEME.dark }}>₹2,000+</p>
                  <p className="text-[9.5px] sm:text-[10px] text-gray-500 font-medium">Free Insured Air</p>
                </div>
                <div>
                  <p className="text-base sm:text-xl font-bold" style={{ color: THEME.dark }}>7 Days</p>
                  <p className="text-[9.5px] sm:text-[10px] text-gray-500 font-medium">Return Privilege</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 relative w-full">
              <div className="rounded-2xl sm:rounded-3xl border bg-white p-2 sm:p-2.5 shadow-xl group" style={{ borderColor: '#EAE2D6' }}>
                <div className="overflow-hidden rounded-xl sm:rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1200&q=80"
                    alt="Curated Luxury Collection"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                  />
                </div>

                <div
                  className="mt-2 sm:mt-2.5 flex items-center justify-between gap-2.5 sm:gap-4 rounded-xl border px-3 sm:px-4 py-2 sm:py-2.5"
                  style={{ backgroundColor: '#FBF6EE', borderColor: '#EAE2D6' }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border text-xs font-bold shrink-0"
                      style={{ backgroundColor: `${THEME.accent}20`, borderColor: `${THEME.accent}55`, color: THEME.accent }}
                    >
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
                  <span
                    className="hidden sm:inline-flex text-[9.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0"
                    style={{ color: THEME.accent, backgroundColor: `${THEME.accent}15`, borderColor: `${THEME.accent}40` }}
                  >
                    100% Authentic
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= TRUST STRIP ================= */}
      <section className="border-b bg-white py-6 sm:py-8" style={{ borderColor: '#EAE2D6' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {[
              { icon: <ShieldCheckIcon className="w-3.5 h-3.5" />, title: 'Certified Authentic', sub: 'Official brand warranty' },
              { icon: <TruckIcon className="w-3.5 h-3.5" />, title: 'Express Dispatch', sub: 'Free on orders ≥ ₹2,000' },
              { icon: <BoxIcon className="w-3.5 h-3.5" />, title: 'Secure Packaging', sub: 'Multi-point inspected' },
              { icon: <StarIcon className="w-3.5 h-3.5" />, title: 'Concierge Desk', sub: 'Ahmedabad flagship' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-2.5 rounded-xl border p-3 transition hover:shadow-sm min-w-0" style={{ borderColor: '#EFE7DA', backgroundColor: '#FCFAF6' }}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${THEME.accent}20`, color: THEME.dark }}>
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-wider truncate" style={{ color: THEME.dark }}>{item.title}</h4>
                  <p className="text-[9px] sm:text-[9.5px] text-gray-500 truncate">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NEW: NEW ARRIVALS ================= */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">Just In</span>
              <h2 className="mt-0.5 text-lg sm:text-xl font-bold tracking-tight" style={{ color: THEME.dark }}>New Arrivals</h2>
            </div>
            <Link to="/shop" className="text-xs font-semibold hover:underline flex items-center gap-1 shrink-0" style={{ color: THEME.dark }}>
              <span>View All</span>
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
            ))}
          </div>
        </section>
      )}

      {/* ================= CURATED DEPARTMENTS ================= */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">Departments</span>
            <h2 className="mt-0.5 text-lg sm:text-xl font-bold tracking-tight" style={{ color: THEME.dark }}>Curated Collections</h2>
          </div>
          <Link to="/shop" className="text-xs font-semibold hover:underline flex items-center gap-1 shrink-0" style={{ color: THEME.dark }}>
            <span>View All</span>
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
          {categoryBanners.map((c) => (
            <Link
              key={c.name}
              to={`/shop?category=${encodeURIComponent(c.name)}`}
              className="group relative aspect-[0.85] overflow-hidden rounded-xl border bg-white transition-all duration-200 hover:shadow-md"
              style={{ borderColor: '#EFE7DA' }}
            >
              <img src={c.image} alt={c.name} className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-106" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-2 bottom-2">
                <h3 className="text-xs font-bold text-white truncate">{c.name}</h3>
                <p className="text-[9px] text-gray-300 truncate">{c.tag}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= NEW: TESTIMONIALS ================= */}
      <section className="py-8 sm:py-10 border-y bg-white" style={{ borderColor: '#EAE2D6' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">Client Voices</span>
            <h2 className="mt-0.5 text-lg sm:text-xl font-bold tracking-tight" style={{ color: THEME.dark }}>What Our Clients Say</h2>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-3">
            {testimonials.map((t, idx) => (
              <div key={idx} className="rounded-2xl border p-4 sm:p-5 space-y-2.5" style={{ borderColor: '#EFE7DA', backgroundColor: '#FCFAF6' }}>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="w-3.5 h-3.5" filled={i < t.rating} />
                  ))}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">"{t.text}"</p>
                <p className="text-[10.5px] font-bold" style={{ color: THEME.dark }}>
                  {t.name} <span className="font-normal text-gray-400">&bull; {t.city}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NEW: LIVE COUNTDOWN OFFER BANNER ================= */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div
          className="rounded-2xl text-white p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 shadow-sm border"
          style={{ backgroundColor: THEME.dark, borderColor: THEME.darkSoft }}
        >
          <div className="flex items-center gap-3 w-full md:w-auto min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base border" style={{ backgroundColor: `${THEME.accent}25`, borderColor: `${THEME.accent}40` }}>
              🎁
            </div>
            <div className="min-w-0">
              <span className="text-[8.5px] font-bold uppercase tracking-[0.14em]" style={{ color: THEME.accentSoft }}>Exclusive Privé &bull; Limited Time</span>
              <h3 className="text-sm sm:text-base font-bold text-white leading-snug truncate">Save 10% Instant Discount &gt; ₹1,000</h3>
              <p className="text-[10px] sm:text-[10.5px] text-gray-300 truncate">
                Code: <strong className="text-white font-mono bg-white/10 px-1 py-0.2 rounded border border-white/10">KRISHNA10</strong>
                <span className="ml-2">Ends in {countdown.h}:{countdown.m}:{countdown.s}</span>
              </p>
            </div>
          </div>
          <Link
            to="/shop"
            className="w-full md:w-auto text-center rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition shrink-0 shadow-2xs"
            style={{ color: THEME.dark }}
          >
            Claim Offer &rarr;
          </Link>
        </div>
      </section>

      {/* ================= TOP RATED ================= */}
      <section className="bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-3 mb-5">
            <div>
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">Top Recommendations</span>
              <h2 className="mt-0.5 text-lg sm:text-xl font-bold tracking-tight" style={{ color: THEME.dark }}>Selected Editions</h2>
            </div>
            <Link to="/shop" className="text-xs font-semibold hover:underline flex items-center gap-1 shrink-0" style={{ color: THEME.dark }}>
              <span>View All</span>
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {topRated.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= BRAND SHOWCASE (dynamic) ================= */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="text-center mb-5">
          <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">Official Brand Partners</span>
          <h2 className="mt-0.5 text-lg sm:text-xl font-bold tracking-tight" style={{ color: THEME.dark }}>Explore by Brand</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {partnerBrands.map((b) => (
            <Link
              key={b.name}
              to={`/shop?category=${encodeURIComponent(b.cat)}&brand=${encodeURIComponent(b.name)}`}
              className="group flex flex-col items-center justify-center p-2.5 rounded-xl border bg-white text-center transition-all duration-150 hover:text-white"
              style={{ borderColor: '#EFE7DA' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = THEME.dark; e.currentTarget.style.borderColor = THEME.dark; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#EFE7DA'; }}
            >
              <span className="text-xs font-semibold group-hover:text-white transition-colors truncate max-w-full" style={{ color: THEME.dark }}>{b.name}</span>
              <span className="text-[9px] text-gray-400 group-hover:text-gray-300 transition-colors truncate max-w-full">{b.cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= NEW: JOURNAL / GUIDE TEASER ================= */}
      <section className="border-t py-8 sm:py-10" style={{ borderColor: '#EAE2D6', backgroundColor: '#FCFAF6' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">From the Journal</span>
            <h2 className="mt-0.5 text-lg sm:text-xl font-bold tracking-tight" style={{ color: THEME.dark }}>Guides & Authenticity Tips</h2>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-3">
            {journalPosts.map((post, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden border bg-white group cursor-pointer" style={{ borderColor: '#EFE7DA' }}>
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-105" />
                </div>
                <div className="p-3.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: THEME.accent }}>{post.tag}</span>
                  <h3 className="mt-1 text-xs font-bold text-gray-900 leading-snug">{post.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}