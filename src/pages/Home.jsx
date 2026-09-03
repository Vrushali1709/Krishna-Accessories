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
    image:
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900',
    tag: 'Titan, Fossil, Rolex, Casio'
  },
  {
    name: 'Bags & Wallets',
    description: 'Genuine Leather & Urban Backpacks',
    image:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900',
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
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900',
    tag: 'Apple, Samsung, OnePlus'
  },
  {
    name: 'Laptops',
    description: 'High-Performance OLED Workstations',
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900',
    tag: 'Apple, Dell, HP, Asus'
  },
  {
    name: 'Electronics',
    description: 'Audiophile Noise-Cancelling Sound',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900',
    tag: 'Sony, Bose, JBL, Marshall'
  }
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

const reviews = [
  {
    name: 'Rahul P.',
    text: 'Excellent quality and very fast delivery. The product looked even better in person.',
    rating: 5
  },
  {
    name: 'Priya S.',
    text: 'Beautiful packaging and genuine product. The whole shopping experience felt premium.',
    rating: 5
  },
  {
    name: 'Amit K.',
    text: 'Very smooth ordering experience. Product quality and delivery were both excellent.',
    rating: 5
  }
];

export default function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState(() => getProducts());
  const [toastMessage, setToastMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 18
  });

  useEffect(() => {
    const handleUpdate = () => setProducts(getProducts());

    window.addEventListener('productsUpdated', handleUpdate);

    return () => {
      window.removeEventListener('productsUpdated', handleUpdate);
    };
  }, []);

  // Limited-time countdown
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

  const featured = products.slice(0, 8);
  const trending = products.slice(8, 12);
  const bestSellers = products.slice(12, 16);

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

    setToastMessage(`✓ Added "${product.name}" to your bag`);

    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

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

  const formatTime = (value) => String(value).padStart(2, '0');

  return (
    <div className="min-h-screen overflow-x-clip bg-[#FAFAFB] text-gray-900">
      <Navbar />

      {/* =========================================================
          TOAST
      ========================================================= */}
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
          HERO
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
                Direct access to brand-certified Swiss and heritage watches,
                handcrafted leather bags, performance sneakers, and flagship
                technology with verified authenticity and complimentary
                insured shipping.
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
                        Swiss Timepieces • Handcrafted Leather • Curated Goods
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
          TRUST / GUARANTEE
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
                  Free on orders ≥ ₹2,000
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
          CURATED COLLECTIONS
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
            View All
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
          LIMITED TIME OFFER
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 pb-7 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-[#111827] p-5 text-white shadow-lg sm:p-7">

          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border border-white/10" />
          <div className="absolute -bottom-20 right-20 h-48 w-48 rounded-full border border-white/5" />

          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-300">
                Private Sale
              </span>

              <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                Limited Time Luxury Edit
              </h2>

              <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
                Enjoy exclusive savings on selected premium pieces.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-center">
                <p className="text-lg font-bold">
                  {formatTime(timeLeft.hours)}
                </p>
                <p className="text-[8px] uppercase tracking-wider text-gray-400">
                  Hours
                </p>
              </div>

              <span className="text-gray-500">:</span>

              <div className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-center">
                <p className="text-lg font-bold">
                  {formatTime(timeLeft.minutes)}
                </p>
                <p className="text-[8px] uppercase tracking-wider text-gray-400">
                  Min
                </p>
              </div>

              <span className="text-gray-500">:</span>

              <div className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-center">
                <p className="text-lg font-bold">
                  {formatTime(timeLeft.seconds)}
                </p>
                <p className="text-[8px] uppercase tracking-wider text-gray-400">
                  Sec
                </p>
              </div>
            </div>

            <Link
              to="/shop"
              className="relative shrink-0 rounded-full bg-white px-6 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-gray-950 transition hover:bg-gray-100"
            >
              Shop The Sale
            </Link>

          </div>
        </div>
      </section>

      {/* =========================================================
          TRENDING NOW
      ========================================================= */}
      {trending.length > 0 && (
        <section className="border-y border-gray-200/80 bg-[#F8F8F7] py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                  Most Wanted
                </span>

                <h2 className="mt-0.5 text-lg font-bold tracking-tight text-gray-950 sm:text-xl">
                  Trending Now
                </h2>
              </div>

              <Link
                to="/shop"
                className="flex shrink-0 items-center gap-1 text-xs font-semibold text-gray-900 hover:underline"
              >
                View All
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-4">
              {trending.map((product) => (
                <div key={product.id} className="relative">
                  <div className="absolute left-2 top-2 z-10 rounded-full bg-[#111827] px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider text-white shadow-sm">
                    Trending
                  </div>

                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* =========================================================
          VOUCHER
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-[#0F172A] p-4 text-white shadow-sm sm:p-5 md:flex-row">

          <div className="flex w-full min-w-0 items-center gap-3 md:w-auto">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-base">
              🎁
            </div>

            <div className="min-w-0">
              <span className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-amber-300">
                Exclusive Privé
              </span>

              <h3 className="truncate text-sm font-bold leading-snug sm:text-base">
                Save 10% Instant Discount &gt; ₹1,000
              </h3>

              <p className="truncate text-[10px] text-gray-400 sm:text-[10.5px]">
                Coupon code:{' '}
                <strong className="rounded border border-white/10 bg-white/10 px-1 font-mono text-white">
                  KRISHNA10
                </strong>
              </p>
            </div>
          </div>

          <Link
            to="/shop"
            className="w-full shrink-0 rounded-full bg-white px-5 py-2 text-center text-xs font-bold uppercase tracking-wider text-gray-950 transition hover:bg-gray-100 md:w-auto"
          >
            Claim Offer →
          </Link>
        </div>
      </section>

      {/* =========================================================
          FEATURED PRODUCTS
      ========================================================= */}
      <section className="border-y border-gray-200/80 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                Top Recommendations
              </span>

              <h2 className="mt-0.5 text-lg font-bold tracking-tight text-gray-950 sm:text-xl">
                Selected Editions
              </h2>
            </div>

            <Link
              to="/shop"
              className="flex shrink-0 items-center gap-1 text-xs font-semibold text-gray-900 hover:underline"
            >
              View All
              <ArrowRightIcon className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-4">
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

      {/* =========================================================
          EDITORIAL BANNER
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="relative min-h-[260px] overflow-hidden rounded-3xl bg-[#171717] sm:min-h-[320px]">

          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1400"
            alt="Luxury lifestyle collection"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/10" />

          <div className="relative flex min-h-[260px] max-w-xl items-center p-6 sm:min-h-[320px] sm:p-10">

            <div>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-300">
                The Krishna Edit
              </span>

              <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-4xl">
                The Art of
                <br />
                <span className="font-serif italic font-normal text-[#D4B36A]">
                  Everyday Luxury
                </span>
              </h2>

              <p className="mt-3 max-w-md text-[10px] leading-relaxed text-gray-300 sm:text-xs">
                Discover timeless accessories and premium essentials selected
                for modern lifestyles.
              </p>

              <Link
                to="/shop"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-950 transition hover:bg-gray-100 sm:text-xs"
              >
                Discover The Edit
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          BEST SELLERS
      ========================================================= */}
      {bestSellers.length > 0 && (
        <section className="bg-white py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                  Customer Favorites
                </span>

                <h2 className="mt-0.5 text-lg font-bold tracking-tight text-gray-950 sm:text-xl">
                  Best Sellers
                </h2>
              </div>

              <Link
                to="/shop"
                className="flex shrink-0 items-center gap-1 text-xs font-semibold text-gray-900 hover:underline"
              >
                View All
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-4">
              {bestSellers.map((product) => (
                <div key={product.id} className="relative">
                  <div className="absolute left-2 top-2 z-10 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider text-amber-700">
                    Best Seller
                  </div>

                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* =========================================================
          BRAND SHOWCASE
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
          CUSTOMER REVIEWS
      ========================================================= */}
      <section className="border-y border-gray-200/80 bg-[#F8F8F7] py-9 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-6 text-center">
            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-400">
              Client Experiences
            </span>

            <h2 className="mt-1 text-lg font-bold tracking-tight text-gray-950 sm:text-xl">
              Loved by Our Customers
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {reviews.map((review) => (
              <div
                key={review.name}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center gap-1 text-sm text-[#B89758]">
                  {'★'.repeat(review.rating)}
                </div>

                <p className="mt-3 text-xs leading-relaxed text-gray-600">
                  “{review.text}”
                </p>

                <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111827] text-[10px] font-bold text-white">
                    {review.name.charAt(0)}
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-gray-900">
                      {review.name}
                    </p>

                    <p className="text-[9px] text-gray-400">
                      Verified Buyer
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================
          VIP CLUB
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-[#FCFAF4] via-white to-[#F7F3E8] p-6 text-center sm:p-10">

          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full border border-amber-200/40" />
          <div className="absolute -bottom-24 -right-10 h-48 w-48 rounded-full border border-amber-200/30" />

          <div className="relative mx-auto max-w-2xl">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B89758]">
              Krishna Privé
            </span>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Enter the World of
              <span className="font-serif italic font-normal text-[#B89758]">
                {' '}
                Privileged Access
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-[10px] leading-relaxed text-gray-500 sm:text-xs">
              Get early access to new collections, private offers and
              exclusive luxury edits.
            </p>

            <div className="mx-auto mt-5 flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email address"
                className="min-w-0 flex-1 rounded-full border border-gray-300 bg-white px-4 py-3 text-xs outline-none transition placeholder:text-gray-400 focus:border-[#B89758]"
              />

              <button
                type="button"
                className="rounded-full bg-[#111827] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-black"
              >
                Join Privé
              </button>
            </div>

            <p className="mt-3 text-[8px] text-gray-400">
              By joining, you agree to receive occasional updates and offers.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


