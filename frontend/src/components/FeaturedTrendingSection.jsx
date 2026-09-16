// // src/components/FeaturedTrendingSection.jsx
// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { addToCart } from '../utils/cart';
// import { getCurrentUser } from '../utils/auth';
// import { isInWishlist, toggleWishlist } from '../utils/productStore';
// import { Reveal } from './useScrollReveal';
// import {
//   HeartIcon,
//   BagIcon,
//   StarIcon,
//   ArrowRightIcon,
//   TagIcon,
//   CheckIcon
// } from './Icons';

// export default function FeaturedTrendingSection({ products = [], onToast }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [activeTab, setActiveTab] = useState('trending'); // 'trending', 'featured', 'top-rated', 'best-deals'
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [wishlistMap, setWishlistMap] = useState({});
//   const [addedMap, setAddedMap] = useState({});

//   // Sync wishlist status
//   const syncWishlist = useCallback(() => {
//     const map = {};
//     products.forEach((p) => {
//       map[p.id] = isInWishlist(p.id);
//     });
//     setWishlistMap(map);
//   }, [products]);

//   useEffect(() => {
//     syncWishlist();
//     const handleWishlistChange = () => syncWishlist();
//     window.addEventListener('wishlistUpdated', handleWishlistChange);
//     return () => window.removeEventListener('wishlistUpdated', handleWishlistChange);
//   }, [syncWishlist]);

//   // Auth requirement check
//   const requireLogin = (action = 'continue') => {
//     if (!getCurrentUser()) {
//       const message = action === 'bag'
//         ? 'Please sign in to add items to your shopping bag.'
//         : action === 'wishlist'
//           ? 'Please sign in to save items to your wishlist.'
//           : 'Please sign in to complete your purchase.';

//       navigate('/login', {
//         state: {
//           from: location.pathname + (location.search || ''),
//           message,
//           requiredRole: 'customer'
//         }
//       });
//       return false;
//     }
//     return true;
//   };

//   const handleWishlistToggle = (e, product) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!requireLogin('wishlist')) return;

//     const active = toggleWishlist(product);
//     setWishlistMap((prev) => ({ ...prev, [product.id]: active }));
//     if (onToast) {
//       onToast(active ? `♥ Added "${product.name}" to wishlist` : `Removed "${product.name}" from wishlist`);
//     }
//   };

//   const handleAddToCart = (e, product) => {
//     e.preventDefault();
//     e.stopPropagation();

//     addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
//     setAddedMap((prev) => ({ ...prev, [product.id]: true }));
//     if (onToast) {
//       onToast(`✓ Added "${product.name}" to your bag`);
//     }

//     setTimeout(() => {
//       setAddedMap((prev) => ({ ...prev, [product.id]: false }));
//     }, 1800);
//   };

//   const handleBuyNow = (e, product) => {
//     e.preventDefault();
//     e.stopPropagation();

//     addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
//     navigate('/checkout');
//   };

//   // Category filter list
//   const categoryFilters = [
//     'All',
//     'Watches',
//     'Bags & Wallets',
//     'Shoes',
//     'Mobiles',
//     'Electronics',
//     'Laptops',
//     'Smart Gadgets',
//     'Fashion Accessories'
//   ];

//   // Tab Definitions
//   const tabs = [
//     { id: 'trending', label: 'Trending Now', icon: '🔥' },
//     { id: 'featured', label: 'Featured Picks', icon: '✦' },
//     { id: 'top-rated', label: 'Top Rated', icon: '⭐' },
//     { id: 'best-deals', label: 'Special Deals', icon: '🏷️' }
//   ];

//   // Compute products according to active tab and category
//   const filteredProducts = useMemo(() => {
//     let list = [...products];

//     // Filter by Category
//     if (selectedCategory !== 'All') {
//       list = list.filter(
//         (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
//       );
//     }

//     // Filter & Sort by Tab
//     switch (activeTab) {
//       case 'trending':
//         list.sort((a, b) => {
//           const scoreB = (Number(b.reviews) || 0) * 2 + (Number(b.rating) || 4.5) * 10;
//           const scoreA = (Number(a.reviews) || 0) * 2 + (Number(a.rating) || 4.5) * 10;
//           return scoreB - scoreA;
//         });
//         break;

//       case 'featured':
//         list.sort((a, b) => {
//           const isLuxuryA = ['Rolex', 'Titan', 'Apple', 'Dell', 'Hidesign', 'Nike', 'Sony'].includes(a.brand) ? 1 : 0;
//           const isLuxuryB = ['Rolex', 'Titan', 'Apple', 'Dell', 'Hidesign', 'Nike', 'Sony'].includes(b.brand) ? 1 : 0;
//           return isLuxuryB - isLuxuryA || (b.price || 0) - (a.price || 0);
//         });
//         break;

//       case 'top-rated':
//         list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
//         break;

//       case 'best-deals':
//         list.sort((a, b) => {
//           const discB = b.discount || (b.oldPrice && b.oldPrice > b.price ? Math.round(((b.oldPrice - b.price) / b.oldPrice) * 100) : 0);
//           const discA = a.discount || (a.oldPrice && a.oldPrice > a.price ? Math.round(((a.oldPrice - a.price) / a.oldPrice) * 100) : 0);
//           return discB - discA;
//         });
//         break;

//       default:
//         break;
//     }

//     return list.slice(0, 8);
//   }, [products, activeTab, selectedCategory]);

//   return (
//     <section className="bg-[#FAFBFD] py-8 sm:py-10 border-t border-b border-gray-200/80">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

//         {/* ============================================================
//             1. SECTION HEADER WITH TABS
//         ============================================================ */}
//         <Reveal direction="up" delay={50}>
//           <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
//             <div>
//               <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-950 mt-1">
//                 Featured &amp; Trending Products
//               </h2>
//               <p className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-xl leading-relaxed">
//                 Explore our handpicked curation of best-selling luxury timepieces, leather goods, smart electronics, and footwear.
//               </p>
//             </div>

//             {/* Interactive Feature Tabs (Clean 2x2 grid on Mobile, Flex on Desktop) */}
//             <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-neutral-200/70 backdrop-blur-md rounded-2xl border border-neutral-300/60 shadow-xs w-full lg:w-auto sm:flex sm:flex-wrap sm:items-center sm:gap-2">
//               {tabs.map((tab) => {
//                 const isActive = activeTab === tab.id;
//                 return (
//                   <button
//                     key={tab.id}
//                     type="button"
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 text-center ${
//                       isActive
//                         ? 'bg-neutral-950 text-white shadow-sm font-extrabold scale-[1.01]'
//                         : 'text-neutral-700 hover:text-black hover:bg-white/80 bg-white/40 sm:bg-transparent'
//                     }`}
//                   >
//                     <span className="text-sm shrink-0">{tab.icon}</span>
//                     <span className="truncate">{tab.label}</span>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </Reveal>

//         {/* ============================================================
//             2. CATEGORY FILTER SUB-BAR
//         ============================================================ */}
//         <Reveal direction="up" delay={100}>
//           <div className="flex items-center gap-2 overflow-x-auto pb-2.5 mb-6 sm:mb-8 no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
//             {categoryFilters.map((cat) => {
//               const isActive = selectedCategory === cat;
//               return (
//                 <button
//                   key={cat}
//                   type="button"
//                   onClick={() => setSelectedCategory(cat)}
//                   className={`shrink-0 px-3.5 sm:px-4 py-1.5 text-xs sm:text-[12.5px] font-bold rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer shadow-2xs ${
//                     isActive
//                       ? 'bg-neutral-950 text-white border-2 border-neutral-950 shadow-xs font-black scale-[1.02]'
//                       : 'bg-white text-gray-700 border border-gray-200/90 hover:border-gray-400 hover:text-gray-950 hover:bg-gray-50'
//                   }`}
//                 >
//                   {cat}
//                 </button>
//               );
//             })}
//           </div>
//         </Reveal>

//         {/* ============================================================
//             3. PRODUCT CARDS GRID (PROPER SIZES & LUXURY SPACING)
//         ============================================================ */}
//         {filteredProducts.length > 0 ? (
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-7">
//             {filteredProducts.map((product, idx) => {
//               const isWish = Boolean(wishlistMap[product.id]);
//               const isAdded = Boolean(addedMap[product.id]);

//               const discount = product.discount || (
//                 product.oldPrice && product.oldPrice > product.price
//                   ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
//                   : 0
//               );

//               // Visual badge determination
//               let badgeText = '';
//               let badgeColor = '';

//               if (discount >= 20) {
//                 badgeText = `${discount}% OFF`;
//                 badgeColor = 'bg-rose-600 text-white';
//               } else if (activeTab === 'trending' || idx === 0) {
//                 badgeText = '🔥 TRENDING';
//                 badgeColor = 'bg-amber-500 text-white';
//               } else if (product.rating >= 4.8) {
//                 badgeText = '★ TOP RATED';
//                 badgeColor = 'bg-neutral-900 text-white';
//               } else {
//                 badgeText = '✦ LUXE PICK';
//                 badgeColor = 'bg-neutral-900 text-white';
//               }

//               return (
//                 <Reveal key={`feat-trend-${activeTab}-${selectedCategory}-${product.id}`} direction="up" delay={(idx % 4) * 80} duration={650}>
//                   <div className="group relative flex flex-col justify-between h-full rounded-[20px] sm:rounded-[28px] border border-gray-200/90 bg-white p-3 sm:p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-400 hover:shadow-[0_20px_45px_rgba(0,0,0,0.09)] hover:border-amber-400/70 hover:-translate-y-2">
                    
//                     {/* 1. Product Image Frame with Hover Canvas */}
//                     <div className="relative aspect-square w-full overflow-hidden rounded-[16px] sm:rounded-[20px] bg-gradient-to-b from-[#F7F7F8] to-[#EDEDF0] mb-3 sm:mb-4">
//                       <Link
//                         to={`/product/${product.id}`}
//                         className="relative flex h-full w-full items-center justify-center cursor-pointer overflow-hidden"
//                       >
//                         <img
//                           src={product.image || product.images?.[0]}
//                           alt={product.name}
//                           className={`h-full w-full object-cover object-center transition-all duration-500 ease-out ${
//                             product.images && product.images.length > 1
//                               ? 'group-hover:opacity-0 group-hover:scale-105'
//                               : 'group-hover:scale-108'
//                           }`}
//                           loading="lazy"
//                         />
//                         {product.images && product.images.length > 1 && (
//                           <img
//                             src={product.images[1]}
//                             alt={`${product.name} alternate angle`}
//                             className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-105 pointer-events-none"
//                             loading="lazy"
//                           />
//                         )}
//                       </Link>

//                       {/* Top Badges & Actions Overlay */}
//                       <div className="absolute top-2 sm:top-3 inset-x-2 sm:inset-x-3 z-10 flex items-center justify-between pointer-events-none">
//                         {/* Dynamic Badge */}
//                         <span className={`rounded-md sm:rounded-lg px-2 sm:px-2.5 py-0.5 sm:py-1 text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md border border-white/10 ${badgeColor}`}>
//                           {badgeText}
//                         </span>

//                         {/* Wishlist Button */}
//                         <button
//                           type="button"
//                           onClick={(e) => handleWishlistToggle(e, product)}
//                           aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
//                           className={`pointer-events-auto flex h-7.5 w-7.5 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-300 hover:scale-115 active:scale-90 cursor-pointer ${
//                             isWish
//                               ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-100 scale-105'
//                               : 'bg-white/95 text-gray-700 hover:text-rose-600 border border-gray-200/90 hover:bg-white'
//                           }`}
//                           title={isWish ? 'In Wishlist' : 'Add to Wishlist'}
//                         >
//                           <HeartIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors" filled={isWish} />
//                         </button>
//                       </div>

//                       {/* Brand / Category Subtle Floating Bottom Pill */}
//                       <div className="absolute bottom-2 sm:bottom-2.5 left-2 sm:left-3 pointer-events-none">
//                         <span className="rounded-full bg-black/65 backdrop-blur-md px-2 sm:px-2.5 py-0.5 text-[8.5px] sm:text-[9.5px] font-bold text-white uppercase tracking-wider border border-white/10">
//                           {product.brand || product.category}
//                         </span>
//                       </div>
//                     </div>

//                     {/* 2. Product Information Content */}
//                     <div className="flex flex-1 flex-col justify-between">
//                       <div>
//                         {/* Category & Verified Sourcing */}
//                         <div className="flex items-center justify-between gap-1 mb-1">
//                           <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-[#C5A880] truncate">
//                             {product.category}
//                           </span>
//                           <span className="text-[9px] sm:text-[10px] font-medium text-neutral-400 hidden xs:inline">
//                             Premium
//                           </span>
//                         </div>

//                         {/* Product Title */}
//                         <Link
//                           to={`/product/${product.id}`}
//                           className="block font-bold text-gray-950 text-[13.5px] sm:text-[16px] transition-colors duration-200 hover:text-[#9E8362] line-clamp-1 leading-snug"
//                           title={product.name}
//                         >
//                           {product.name}
//                         </Link>

//                         {/* Rating Stars & Customer Review Count */}
//                         <div className="flex items-center gap-1 sm:gap-1.5 mt-1 sm:mt-2">
//                           <div className="flex items-center text-amber-500">
//                             <StarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" filled={true} />
//                           </div>
//                           <span className="font-bold text-gray-900 text-[11px] sm:text-xs tabular-nums">
//                             {product.rating ? Number(product.rating).toFixed(1) : '4.9'}
//                           </span>
//                           <span className="text-gray-400 text-[10px] sm:text-[11px] tabular-nums truncate">
//                             ({product.reviews || 48})
//                           </span>
//                         </div>

//                         {/* Price Architecture (Price + MRP + Save Pill) */}
//                         <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 mt-2 pt-2 border-t border-gray-100">
//                           <span className="text-base sm:text-xl font-black text-gray-950 tabular-nums">
//                             ₹{Number(product.price).toLocaleString('en-IN')}
//                           </span>

//                           {product.oldPrice && product.oldPrice > product.price && (
//                             <span className="text-[11px] sm:text-sm text-neutral-400 line-through tabular-nums font-normal">
//                               ₹{Number(product.oldPrice).toLocaleString('en-IN')}
//                             </span>
//                           )}

//                           {discount > 0 && (
//                             <span className="ml-auto text-[9px] sm:text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full">
//                               -{discount}%
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       {/* 3. Action Buttons (Add to Bag & Buy Now) */}
//                       <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-col xs:flex-row items-center gap-1.5 sm:gap-2">
//                         {/* Primary Add to Bag Button */}
//                         <button
//                           type="button"
//                           onClick={(e) => handleAddToCart(e, product)}
//                           className={`w-full flex-1 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-xs flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
//                             isAdded
//                               ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700 scale-[1.02]'
//                               : 'bg-neutral-950 text-white hover:bg-black hover:shadow-md'
//                           }`}
//                         >
//                           {isAdded ? (
//                             <>
//                               <CheckIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//                               <span>Added</span>
//                             </>
//                           ) : (
//                             <>
//                               <BagIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
//                               <span className="truncate">Add to Bag</span>
//                             </>
//                           )}
//                         </button>

//                         {/* Secondary Instant Buy Now Button */}
//                         <button
//                           type="button"
//                           onClick={(e) => handleBuyNow(e, product)}
//                           className="w-full xs:w-auto px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-wider border border-gray-300 bg-white text-gray-800 hover:border-gray-950 hover:bg-gray-50 transition-all duration-300 active:scale-95 cursor-pointer shadow-2xs shrink-0"
//                         >
//                           Buy
//                         </button>
//                       </div>

//                     </div>

//                   </div>
//                 </Reveal>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="text-center py-16 rounded-3xl bg-white border border-gray-200/80 shadow-xs">
//             <p className="text-sm font-semibold text-neutral-700">No products found for the selected filter.</p>
//             <button
//               type="button"
//               onClick={() => { setSelectedCategory('All'); setActiveTab('trending'); }}
//               className="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2 text-xs font-bold text-white hover:bg-black cursor-pointer shadow-sm"
//             >
//               Reset Filters
//             </button>
//           </div>
//         )}

//       </div>
//     </section>
//   );
// }









// src/components/FeaturedTrendingSection.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { isInWishlist, toggleWishlist } from '../utils/productStore';
import { HeartIcon, StarIcon, CheckIcon } from './Icons';

const TABS = [
  { id: 'trending', label: 'Trending' },
  { id: 'featured', label: 'Featured' },
  { id: 'top-rated', label: 'Top rated' },
  { id: 'best-deals', label: 'On offer' }
];

const CATEGORY_FILTERS = [
  'All',
  'Watches',
  'Bags & Wallets',
  'Shoes',
  'Mobiles',
  'Electronics',
  'Laptops',
  'Smart Gadgets',
  'Fashion Accessories'
];

export default function FeaturedTrendingSection({ products = [], onToast }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('trending');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [wishlistMap, setWishlistMap] = useState({});
  const [addedMap, setAddedMap] = useState({});

  const syncWishlist = useCallback(() => {
    const map = {};
    products.forEach((p) => {
      map[p.id] = isInWishlist(p.id);
    });
    setWishlistMap(map);
  }, [products]);

  useEffect(() => {
    syncWishlist();
    const handleWishlistChange = () => syncWishlist();
    window.addEventListener('wishlistUpdated', handleWishlistChange);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistChange);
  }, [syncWishlist]);

  const requireLogin = (action = 'continue') => {
    if (!getCurrentUser()) {
      const message =
        action === 'bag'
          ? 'Sign in to add items to your bag.'
          : action === 'wishlist'
            ? 'Sign in to save items to your wishlist.'
            : 'Sign in to complete your purchase.';

      navigate('/login', {
        state: {
          from: location.pathname + (location.search || ''),
          message,
          requiredRole: 'customer'
        }
      });
      return false;
    }
    return true;
  };

  const handleWishlistToggle = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireLogin('wishlist')) return;

    const active = toggleWishlist(product);
    setWishlistMap((prev) => ({ ...prev, [product.id]: active }));
    if (onToast) {
      onToast(active ? `Saved ${product.name}` : `Removed ${product.name} from saved`);
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    if (onToast) onToast(`Added ${product.name} to your bag`);

    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const handleBuyNow = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'All') {
      list = list.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    switch (activeTab) {
      case 'trending':
        list.sort((a, b) => {
          const scoreB = (Number(b.reviews) || 0) * 2 + (Number(b.rating) || 4.5) * 10;
          const scoreA = (Number(a.reviews) || 0) * 2 + (Number(a.rating) || 4.5) * 10;
          return scoreB - scoreA;
        });
        break;

      case 'featured':
        list.sort((a, b) => {
          const known = ['Rolex', 'Titan', 'Apple', 'Dell', 'Hidesign', 'Nike', 'Sony'];
          const isA = known.includes(a.brand) ? 1 : 0;
          const isB = known.includes(b.brand) ? 1 : 0;
          return isB - isA || (b.price || 0) - (a.price || 0);
        });
        break;

      case 'top-rated':
        list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
        break;

      case 'best-deals':
        list.sort((a, b) => {
          const discB =
            b.discount ||
            (b.oldPrice && b.oldPrice > b.price
              ? Math.round(((b.oldPrice - b.price) / b.oldPrice) * 100)
              : 0);
          const discA =
            a.discount ||
            (a.oldPrice && a.oldPrice > a.price
              ? Math.round(((a.oldPrice - a.price) / a.oldPrice) * 100)
              : 0);
          return discB - discA;
        });
        break;

      default:
        break;
    }

    return list.slice(0, 8);
  }, [products, activeTab, selectedCategory]);

  return (
    <section className="border-t border-line py-14 sm:py-18">
      <div className="wrap">

        {/* Heading + tabs share one baseline rule */}
        <div className="border-b border-line">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <h2 className="text-[22px] font-semibold leading-tight sm:text-[27px] lg:text-[30px]">
                Picked from the counter
              </h2>
              <p className="mt-1 max-w-[60ch] text-[13px] text-ash">
                The pieces our staff reach for first, sorted four ways.
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Product selections"
              className="-mb-px flex items-center gap-6 overflow-x-auto no-scrollbar"
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 whitespace-nowrap border-b-2 pb-3 text-[13px] transition-colors ${
                      isActive
                        ? 'border-ink font-semibold text-ink'
                        : 'border-transparent text-ash hover:text-ink'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="-mx-5 mt-5 flex items-center gap-2 overflow-x-auto px-5 no-scrollbar sm:mx-0 sm:px-0">
          {CATEGORY_FILTERS.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12px] transition-colors ${
                  isActive
                    ? 'border-ink bg-ink font-medium text-paper'
                    : 'border-line text-ash hover:border-line-strong hover:text-ink'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {filteredProducts.map((product) => {
              const isWish = Boolean(wishlistMap[product.id]);
              const isAdded = Boolean(addedMap[product.id]);

              const discount =
                product.discount ||
                (product.oldPrice && product.oldPrice > product.price
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                  : 0);

              return (
                <article key={`feat-${activeTab}-${selectedCategory}-${product.id}`} className="group flex min-w-0 flex-col">

                  {/* Image */}
                  <div className="plate relative aspect-square w-full">
                    <Link
                      to={`/product/${product.id}`}
                      className="block h-full w-full"
                      aria-label={product.name}
                    >
                      <img
                        src={product.image || product.images?.[0]}
                        alt={product.name}
                        className={`h-full w-full object-cover transition-all duration-500 ease-out ${
                          product.images?.length > 1
                            ? 'group-hover:opacity-0'
                            : 'group-hover:scale-[1.04]'
                        }`}
                        loading="lazy"
                      />
                      {product.images?.length > 1 && (
                        <img
                          src={product.images[1]}
                          alt=""
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                          loading="lazy"
                        />
                      )}
                    </Link>

                    {discount > 0 && (
                      <span className="num absolute left-0 top-0 bg-sale px-2 py-1 text-[11px] font-semibold text-paper">
                        −{discount}%
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => handleWishlistToggle(e, product)}
                      aria-label={isWish ? 'Remove from saved' : 'Save for later'}
                      className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 transition-colors ${
                        isWish ? 'text-sale' : 'text-ash hover:text-ink'
                      }`}
                    >
                      <HeartIcon className="h-4 w-4" filled={isWish} />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="mt-3 flex flex-1 flex-col">
                    <p className="text-[11px] text-mute">{product.brand || product.category}</p>

                    <h3 className="mt-1 text-[13.5px] font-medium leading-snug sm:text-[14.5px]">
                      <Link to={`/product/${product.id}`} className="line-clamp-2 hover:underline underline-offset-4">
                        {product.name}
                      </Link>
                    </h3>

                    <div className="num mt-2 flex flex-wrap items-baseline gap-x-2">
                      <span className="text-[15px] font-semibold sm:text-[17px]">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </span>
                      {product.oldPrice > product.price && (
                        <span className="text-[12px] text-mute line-through">
                          ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="num mt-1.5 flex items-center gap-1 text-[11.5px] text-ash">
                      <StarIcon className="h-3 w-3 text-ink" filled={true} />
                      <span>{product.rating ? Number(product.rating).toFixed(1) : '4.9'}</span>
                      <span className="text-mute">({product.reviews || 48})</span>
                    </div>

                    <div className="mt-3.5 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`btn btn-sm flex-1 ${isAdded ? 'btn-solid' : 'btn-line'}`}
                      >
                        {isAdded ? (
                          <>
                            <CheckIcon className="h-3.5 w-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <span>Add to bag</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(e, product)}
                        className="shrink-0 text-[12px] text-ash underline underline-offset-4 transition-colors hover:text-ink"
                      >
                        Buy now
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-9 border border-line px-6 py-16 text-center">
            <p className="text-[14px] text-ash">
              Nothing in {selectedCategory} under this selection yet.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setActiveTab('trending');
              }}
              className="btn btn-line btn-sm mt-4"
            >
              Show everything
            </button>
          </div>
        )}
      </div>
    </section>
  );
}