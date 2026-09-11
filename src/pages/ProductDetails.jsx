// src/pages/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProducts, getProductById, getProductReviews, addProductReview, isInWishlist, toggleWishlist } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { ShieldCheckIcon, TruckIcon, StarIcon, BoxIcon, HeartIcon } from '../components/Icons';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(() => getProductById(id));
  const [reviews, setReviews] = useState(() => getProductReviews(id));
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [toastMessage, setToastMessage] = useState('');
  const [inWish, setInWish] = useState(() => isInWishlist(id));
  const [isSwitching, setIsSwitching] = useState(false);

  // Modals
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeGuideCategory, setSizeGuideCategory] = useState('watches');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    user: '',
    rating: 5,
    title: '',
    text: ''
  });

  const refreshData = () => {
    const found = getProductById(id);
    setProduct(found);
    setReviews(getProductReviews(id));
    setInWish(isInWishlist(id));
    if (found) {
      const initialColor = found.colors?.[0] || '';
      const initialSize = found.sizes?.[0] || '';
      const initialVariant = found.variants?.[0] || '';
      setSelectedColor(initialColor);
      setSelectedSize(initialSize);
      setSelectedVariant(initialVariant);
      setSelectedImage(0);
      setQuantity(1);

      // Default size guide tab according to category
      const cat = (found.category || '').toLowerCase();
      if (cat.includes('watch')) setSizeGuideCategory('watches');
      else if (cat.includes('shoe') || cat.includes('footwear')) setSizeGuideCategory('shoes');
      else if (cat.includes('cloth') || cat.includes('fashion') || cat.includes('apparel')) setSizeGuideCategory('apparel');
      else setSizeGuideCategory('devices');
    }
  };

  useEffect(() => {
    setIsSwitching(true);
    refreshData();
    const t = setTimeout(() => setIsSwitching(false), 120);
    window.addEventListener('reviewsUpdated', refreshData);
    window.addEventListener('wishlistUpdated', () => setInWish(isInWishlist(id)));
    return () => {
      clearTimeout(t);
      window.removeEventListener('reviewsUpdated', refreshData);
      window.removeEventListener('wishlistUpdated', () => setInWish(isInWishlist(id)));
    };
  }, [id]);

  // Handle color change and image synchronisation
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (product && product.colorImages && product.colorImages[color]) {
      const targetUrl = product.colorImages[color];
      const foundIdx = (product.images || []).findIndex(img => img === targetUrl);
      if (foundIdx >= 0) {
        setSelectedImage(foundIdx);
      }
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAFB] text-gray-900">
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <div className="text-4xl font-bold text-gray-300 mb-2">404</div>
          <h1 className="text-xl font-bold text-gray-950">Product Not Found</h1>
          <p className="mt-1 text-xs text-gray-500">The product you are looking for may have been removed or relocated.</p>
          <Link to="/shop" className="mt-4 rounded-full bg-[#111827] px-5 py-2 text-xs font-semibold text-white hover:bg-black transition">
            Explore All Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const angleLabels = product.imageAngles && product.imageAngles.length === images.length
    ? product.imageAngles
    : ['Front View', '45° Profile', 'On-Wrist / In-Use', 'Detail Zoom'];

  // Variation Price Delta Calculation
  const variantDelta = (product.variantPriceDeltas && selectedVariant && product.variantPriceDeltas[selectedVariant])
    ? Number(product.variantPriceDeltas[selectedVariant])
    : 0;

  const basePrice = Number(product.price) || 0;
  const effectivePrice = Math.max(0, basePrice + variantDelta);
  const variationKey = [selectedColor, selectedSize, selectedVariant].filter(Boolean).join(' / ');
  const effectiveStock = Number(product.variationStock?.[variationKey] ?? product.variationStock?.[selectedVariant] ?? product.stock) || 0;
  const effectiveOldPrice = product.oldPrice ? Number(product.oldPrice) + variantDelta : null;
  const savings = effectiveOldPrice && effectiveOldPrice > effectivePrice ? effectiveOldPrice - effectivePrice : 0;
  const discount = effectiveOldPrice && effectiveOldPrice > effectivePrice
    ? Math.round(((effectiveOldPrice - effectivePrice) / effectiveOldPrice) * 100)
    : (product.discount || 0);

  // Dynamic SKU
  const dynamicSku = `${product.sku || `KA-${product.id}`}${selectedColor ? `-${selectedColor.slice(0, 3).toUpperCase()}` : ''}${selectedSize ? `-${selectedSize.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase()}` : ''}`;

  const requireLogin = (action = 'continue') => {
    if (!getCurrentUser()) {
      const message = action === 'bag'
        ? 'Please sign in to add items to your shopping bag.'
        : action === 'wishlist'
          ? 'Please sign in to save items to your wishlist.'
          : 'Please sign in to complete your purchase.';

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

  const handleAddToCart = () => {
    addToCart(
      product,
      quantity,
      selectedColor,
      selectedVariant,
      selectedSize,
      effectivePrice,
      images[selectedImage] || product.image
    );
    setToastMessage(`✓ Added ${quantity} × "${product.name}" (${selectedColor || 'Standard'}${selectedSize ? `, ${selectedSize}` : ''}) to your bag`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleBuyNow = () => {
    addToCart(
      product,
      quantity,
      selectedColor,
      selectedVariant,
      selectedSize,
      effectivePrice,
      images[selectedImage] || product.image
    );
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    if (!requireLogin('wishlist')) return;
    const active = toggleWishlist(product);
    setInWish(active);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.title || !reviewForm.text) return;
    addProductReview(product.id, reviewForm);
    setReviewModalOpen(false);
    setReviewForm({ user: '', rating: 5, title: '', text: '' });
    setToastMessage('✓ Your review has been submitted successfully.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const relatedProducts = getProducts()
    .filter(p => p.category === product.category && Number(p.id) !== Number(product.id))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-xs font-semibold text-gray-900 shadow-2xl animate-slide-up">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">✓</span>
          <span className="truncate max-w-xs sm:max-w-md">{toastMessage}</span>
          <Link to="/cart" className="ml-2 shrink-0 rounded-full bg-[#111827] px-3.5 py-1 text-[11px] font-semibold text-white hover:bg-black transition">
            View Bag
          </Link>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-2.5 text-xs text-gray-500 flex items-center gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link to="/" className="hover:text-black shrink-0 transition">Home</Link>
          <span className="text-gray-300 shrink-0">/</span>
          <Link to="/shop" className="hover:text-black shrink-0 transition">Shop</Link>
          <span className="text-gray-300 shrink-0">/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-black font-medium text-gray-700 shrink-0 transition">
            {product.category}
          </Link>
          <span className="text-gray-300 shrink-0">/</span>
          <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Product Showcase */}
      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">

        <div className="grid gap-8 lg:grid-cols-12 items-start">

          {/* Left Column: 4-Angle Multi-Image Showcase (6 Cols on LG) */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4">

            {/* Main Stage Image with Zoom & Angle Badge */}
            <div className="relative group aspect-square overflow-hidden rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 flex items-center justify-center shadow-sm">
              {discount > 0 && (
                <span className="absolute left-3.5 top-3.5 sm:left-4 sm:top-4 z-10 rounded-full bg-[#0F172A] px-2.5 py-1 text-[10px] sm:text-[11px] font-bold tracking-wider text-white shadow-sm">
                  {discount}% OFF
                </span>
              )}

              {/* Active Angle Badge */}
              <div className="absolute left-3.5 bottom-3.5 sm:left-4 sm:bottom-4 z-10 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-md shadow-sm">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{angleLabels[selectedImage] || `Angle ${selectedImage + 1}`}</span>
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={handleWishlistToggle}
                className={`absolute right-3.5 top-3.5 sm:right-4 sm:top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/95 shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 ${inWish ? 'text-rose-500 border-rose-200 bg-rose-50/90' : 'text-gray-500 hover:text-black'
                  }`}
                title={inWish ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <HeartIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" filled={inWish} />
              </button>

              {/* Click to open Lightbox hint */}
              <button
                type="button"
                onClick={() => { setLightboxOpen(true); setLightboxZoom(1); }}
                className="absolute right-3.5 bottom-3.5 sm:right-4 sm:bottom-4 z-10 flex items-center gap-1 rounded-full bg-white/90 border border-gray-200 px-2.5 py-1 text-[10px] font-semibold text-gray-700 shadow-sm transition hover:bg-white hover:text-black backdrop-blur-xs"
                title="Open Fullscreen Lightbox"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
                <span>Fullscreen</span>
              </button>

              <img
                src={images[selectedImage] || images[0]}
                alt={`${product.name} - ${angleLabels[selectedImage] || 'View'}`}
                onClick={() => { setLightboxOpen(true); setLightboxZoom(1); }}
                className="h-full w-full object-contain mix-blend-multiply cursor-zoom-in transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>

            {/* 4-Angle Thumbnail Strip with Perspective Labels */}
            {images.length > 1 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-gray-500 px-1">
                  <span className="font-semibold text-gray-700 uppercase tracking-wider text-[10px]">Multi-Angle Views ({images.length} Perspectives):</span>
                  <span className="text-[10.5px]">Click thumbnail or color swatch to switch</span>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {images.map((img, idx) => {
                    const isSelected = selectedImage === idx;
                    const label = angleLabels[idx] || `Angle ${idx + 1}`;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(idx)}
                        className={`group relative flex flex-col items-center justify-between overflow-hidden rounded-2xl border p-1.5 bg-white transition-all duration-200 text-left ${isSelected
                          ? 'border-gray-950 ring-2 ring-gray-950/20 shadow-md bg-gray-50/50'
                          : 'border-gray-200 hover:border-gray-400 hover:shadow-xs'
                          }`}
                      >
                        <div className="aspect-square w-full overflow-hidden rounded-xl bg-[#F8F9FA] p-1 flex items-center justify-center">
                          <img
                            src={img}
                            alt=""
                            className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-108"
                          />
                        </div>
                        <span className={`mt-1.5 block w-full text-center text-[9px] sm:text-[10px] font-semibold truncate px-1 transition ${isSelected ? 'text-gray-950' : 'text-gray-500 group-hover:text-gray-800'
                          }`}>
                          {label}
                        </span>
                        {isSelected && (
                          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#111827]"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Trust Assurances Under Gallery */}
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-gray-200/80 bg-white p-3 sm:p-3.5 text-center shadow-xs">
              <div className="flex flex-col items-center justify-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold mb-1 border border-emerald-100">✓</span>
                <p className="text-[11px] font-bold text-gray-950">Quality Assured</p>
                <p className="text-[9.5px] text-gray-500">Verified Product Details</p>
              </div>
              <div className="flex flex-col items-center justify-center border-x border-gray-100">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-1 border border-blue-100">🚚</span>
                <p className="text-[11px] font-bold text-gray-950">Free Express</p>
                <p className="text-[9.5px] text-gray-500">Fast Dispatch 24-48h</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-1 border border-amber-100">🛡️</span>
                <p className="text-[11px] font-bold text-gray-950">7-Day Returns</p>
                <p className="text-[9.5px] text-gray-500">Hassle-Free Exchanges</p>
              </div>
            </div>

          </div>

          {/* Right Column: Product Variations & Interactive Buy Box (6 Cols on LG) */}
          <div className="lg:col-span-6 flex flex-col justify-start rounded-3xl border border-gray-200/90 bg-white p-5 sm:p-7 shadow-sm">

            {/* Brand, SKU & Category Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B89758] bg-[#FDFBF7] border border-[#EEDBBA] px-2.5 py-0.5 rounded-full">
                  {product.brand}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9.5px] font-semibold text-gray-600">
                  {product.category}
                </span>
              </div>
              <span className="rounded-md bg-[#F4F4F6] px-2 py-0.5 text-[10px] font-mono text-gray-600 border border-gray-200">
                SKU: {dynamicSku}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-gray-950 leading-tight">
              {product.name}
            </h1>

            {/* Rating & In-Stock Availability */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-gray-900 bg-amber-50/70 border border-amber-200 px-2.5 py-0.5 rounded-full">
                <span className="text-amber-500">★ {product.rating || 4.8}</span>
                <span className="text-gray-400 font-normal">({reviews.length} Reviews)</span>
              </div>
              <span className="text-gray-300">&bull;</span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10.5px]">
                {effectiveStock > 0 ? `● In Stock (${effectiveStock} units ready to dispatch)` : '● Currently unavailable'}
              </span>
            </div>

            {/* Dynamic Live Price Calculation Area */}
            <div className="mt-4 rounded-2xl bg-[#F8F9FA] border border-gray-200 p-4">
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
                  ₹{effectivePrice.toLocaleString('en-IN')}
                </span>
                {effectiveOldPrice && effectiveOldPrice > effectivePrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{effectiveOldPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {savings > 0 && (
                  <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                    Save ₹{savings.toLocaleString('en-IN')} ({discount}%)
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
                <span>Inclusive of all taxes (GST) &bull; Free All-India Insured Transit</span>
                {variantDelta > 0 && (
                  <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.2 rounded border border-amber-200">
                    +₹{variantDelta.toLocaleString('en-IN')} edition adjustment
                  </span>
                )}
              </div>
            </div>

            {/* Short Product Description */}
            <p className="mt-3 text-xs sm:text-[13px] leading-relaxed text-gray-600">
              {product.description}
            </p>

            {/* ================= VARIATIONS CONFIGURATOR ================= */}
            <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">

              {/* 1. Color / Finish Selection (Interactive Swatches with Live Image Coupling) */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-800">1. Select Color / Finish:</span>
                    </div>
                    <span className="text-xs font-bold text-gray-950 bg-gray-100 px-2 py-0.5 rounded-md">
                      {selectedColor}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor === color;
                      const hex = product.colorHex?.[color] || '#111827';
                      const hasImage = Boolean(product.colorImages?.[color]);

                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleColorSelect(color)}
                          className={`group flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${isSelected
                            ? 'border-gray-950 bg-gray-900 text-white shadow-sm ring-2 ring-gray-900/20'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 rounded-full border ${isSelected ? 'border-white ring-1 ring-white/60' : 'border-gray-300'}`}
                            style={{ backgroundColor: hex }}
                          />
                          <span>{color}</span>
                          {hasImage && !isSelected && (
                            <span className="text-[9px] text-gray-400 group-hover:text-gray-600">📷</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Size / Dimension Selection (Interactive with Size Guide Modal) */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-800">2. Select Size / Dimension:</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSizeGuideOpen(true)}
                      className="text-[11px] font-semibold text-[#B89758] hover:text-[#97793d] underline flex items-center gap-1 transition"
                    >
                      <span>📐 Size &amp; Fit Guide</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${isSelected
                            ? 'border-gray-950 bg-gray-900 text-white shadow-sm ring-2 ring-gray-900/20'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Edition / Strap / Variant Selection with Price Deltas */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-800">3. Select Edition / Strap:</span>
                    <span className="text-xs font-bold text-gray-950 bg-gray-100 px-2 py-0.5 rounded-md">
                      {selectedVariant}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant === v;
                      const delta = product.variantPriceDeltas?.[v] || 0;
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`flex items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all duration-200 text-left ${isSelected
                            ? 'border-gray-950 bg-[#0F172A] text-white shadow-sm ring-2 ring-gray-900/20'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                        >
                          <span className="truncate pr-2">{v}</span>
                          <span className={`text-[10.5px] shrink-0 font-bold px-1.5 py-0.5 rounded ${isSelected
                            ? 'bg-white/15 text-amber-200'
                            : delta > 0 ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {delta > 0 ? `+₹${delta.toLocaleString('en-IN')}` : 'Included'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Configured Product Summary Pill */}
            <div className="mt-4 rounded-xl border border-amber-200/90 bg-amber-50/50 p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="text-amber-700 text-sm">✦</span>
                <span className="text-[11.5px] font-semibold text-gray-800 truncate">
                  Configured: <strong>{selectedColor || 'Standard'}</strong>
                  {selectedSize && <span> &bull; <strong>{selectedSize}</strong></span>}
                  {selectedVariant && <span> &bull; <strong>{selectedVariant}</strong></span>}
                </span>
              </div>
              <span className="font-extrabold text-gray-950 shrink-0 text-xs">
                ₹{effectivePrice.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Quantity Stepper & Buy Action Buttons */}
            <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-gray-700">Quantity:</span>
                  <div className="flex items-center rounded-full border border-gray-200 bg-[#F4F4F6]">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-8 w-8 items-center justify-center text-sm font-bold text-gray-700 hover:text-black transition active:scale-95"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(effectiveStock || 1, quantity + 1))}
                      className="flex h-8 w-8 items-center justify-center text-sm font-bold text-gray-700 hover:text-black transition active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Amount:</span>
                  <span className="text-sm sm:text-base font-extrabold text-gray-950">
                    ₹{(effectivePrice * quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 pt-1">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="rounded-full border border-gray-300 bg-white py-3 sm:py-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-900 transition hover:bg-gray-100 hover:border-gray-400 active:scale-98 shadow-xs flex items-center justify-center gap-2"
                >
                  <span>🛍️</span>
                  <span>Add to Bag</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="rounded-full bg-[#111827] py-3 sm:py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white transition hover:bg-black active:scale-98 shadow-md border border-gray-900 flex items-center justify-center gap-2"
                >
                  <span>⚡</span>
                  <span>Buy Now &rarr;</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* ================= TABBED SPECIFICATIONS & REVIEWS ================= */}
        <section className="mt-10 sm:mt-12 rounded-3xl border border-gray-200/90 bg-white p-5 sm:p-8 shadow-xs">

          <div className="flex border-b border-gray-200 gap-4 sm:gap-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${activeTab === 'specs'
                ? 'border-b-2 border-[#111827] text-gray-950'
                : 'text-gray-400 hover:text-black'
                }`}
            >
              Specifications &amp; Variations
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${activeTab === 'reviews'
                ? 'border-b-2 border-[#111827] text-gray-950'
                : 'text-gray-400 hover:text-black'
                }`}
            >
              Customer Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${activeTab === 'delivery'
                ? 'border-b-2 border-[#111827] text-gray-950'
                : 'text-gray-400 hover:text-black'
                }`}
            >
              Shipping, Warranty &amp; Care
            </button>
          </div>

          <div className="mt-5">
            {/* Specs Tab */}
            {activeTab === 'specs' && (
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 animate-fade-in">
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-gray-100 py-2 text-xs gap-2">
                    <span className="text-gray-500 font-medium">Brand</span>
                    <span className="font-semibold text-gray-900">{product.brand}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-2 text-xs gap-2">
                    <span className="text-gray-500 font-medium">Category</span>
                    <span className="font-semibold text-gray-900">{product.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-2 text-xs gap-2">
                    <span className="text-gray-500 font-medium">Active Config SKU</span>
                    <span className="font-mono font-semibold text-gray-900">{dynamicSku}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-2 text-xs gap-2">
                    <span className="text-gray-500 font-medium">Curated Partner</span>
                    <span className="font-semibold text-gray-900">{product.supplier || 'Krishna Luxury Accessories Ltd.'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-2 text-xs gap-2">
                    <span className="text-gray-500 font-medium">Available Finishes</span>
                    <span className="font-semibold text-gray-900">{product.colors ? product.colors.join(', ') : 'Standard'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-2 text-xs gap-2">
                    <span className="text-gray-500 font-medium">Available Sizes</span>
                    <span className="font-semibold text-gray-900">{product.sizes ? product.sizes.join(', ') : 'One Size'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-gray-100 py-2 text-xs gap-2">
                      <span className="text-gray-500 font-medium">{key}</span>
                      <span className="font-semibold text-gray-900 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-extrabold text-gray-950">{product.rating || 4.8}</span>
                      <span className="text-amber-500 text-lg">★★★★★</span>
                      <span className="text-xs text-gray-500">({reviews.length} verified purchaser ratings)</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(true)}
                    className="rounded-full bg-[#111827] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black transition shadow-xs"
                  >
                    Write a Review
                  </button>
                </div>

                {/* Review List */}
                <div className="divide-y divide-gray-100 space-y-3">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-gray-500 py-4">No reviews yet for this product. Be the first to share your experience!</p>
                  ) : (
                    reviews.map(rev => (
                      <div key={rev.id} className="pt-3.5 first:pt-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-gray-900">{rev.user}</span>
                            {rev.verified && (
                              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.2 text-[9px] font-bold text-emerald-800">
                                ✓ Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">{rev.date}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-amber-500 text-xs">
                          {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                          <span className="ml-1 text-xs font-semibold text-gray-900">{rev.title}</span>
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed">{rev.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Delivery Tab */}
            {activeTab === 'delivery' && (
              <div className="space-y-3 text-xs text-gray-700 leading-relaxed animate-fade-in">
                <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-200/80">
                  <p className="font-bold text-gray-900 mb-1">📦 Express Priority Shipping Across India:</p>
                  <p>Orders placed before 2:00 PM are dispatched same day via BlueDart Apex Air or Delhivery Surface. Orders valued at ₹2,000 or above receive complimentary express delivery.</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-200/80">
                  <p className="font-bold text-gray-900 mb-1">🔄 7-Day Hassle-Free Returns &amp; Exchanges:</p>
                  <p>If you wish to exchange the size, color variation, or request a return, simply initiate a request from your Order Tracking page within 7 calendar days of receipt.</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-200/80">
                  <p className="font-bold text-gray-900 mb-1">🛡️ Quality Guarantee &amp; Brand Warranty:</p>
                  <p>Every piece undergoes rigorous multi-point inspection prior to dispatch and arrives with comprehensive product details and warranty documentation.</p>
                </div>
              </div>
            )}
          </div>

        </section>

        {/* ================= RELATED PRODUCTS SHOWCASE ================= */}
        {relatedProducts.length > 0 && (
          <section className="mt-10 sm:mt-14">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">Curated For You</p>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-gray-950">Related Luxury Pieces</h3>
              </div>
              <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="text-xs font-semibold text-gray-900 hover:underline">
                Explore All {product.category} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={() => addToCart(p, 1, p.colors?.[0] || '', p.variants?.[0] || '', p.sizes?.[0] || '')}
                  onBuyNow={() => {
                    addToCart(p, 1, p.colors?.[0] || '', p.variants?.[0] || '', p.sizes?.[0] || '');
                    navigate('/checkout');
                  }}
                />
              ))}
            </div>
          </section>
        )}

      </main>

      {/* ================= FULLSCREEN 360° LIGHTBOX MODAL ================= */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/90 p-4 backdrop-blur-md animate-fade-in text-white">
          {/* Top Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between py-2 border-b border-white/10">
            <div>
              <p className="text-xs font-mono text-gray-400">{product.brand} &bull; {angleLabels[selectedImage] || `Angle ${selectedImage + 1}`}</p>
              <h3 className="text-sm font-bold text-white truncate max-w-md">{product.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLightboxZoom(prev => Math.min(2.2, prev + 0.3))}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold hover:bg-white/20 transition"
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setLightboxZoom(prev => Math.max(1, prev - 0.3))}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold hover:bg-white/20 transition"
                title="Zoom Out"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => setLightboxZoom(1)}
                className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold hover:bg-white/20 transition"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold hover:bg-white/30 transition ml-2"
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Center Image Stage */}
          <div className="relative flex-1 w-full max-w-4xl flex items-center justify-center overflow-hidden my-4">
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => setSelectedImage(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white text-lg font-bold backdrop-blur-md transition"
              >
                ‹
              </button>
            )}

            <div className="overflow-auto max-h-full max-w-full flex items-center justify-center">
              <img
                src={images[selectedImage] || images[0]}
                alt=""
                style={{ transform: `scale(${lightboxZoom})` }}
                className="max-h-[65vh] max-w-full object-contain transition-transform duration-200"
              />
            </div>

            {images.length > 1 && (
              <button
                type="button"
                onClick={() => setSelectedImage(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white text-lg font-bold backdrop-blur-md transition"
              >
                ›
              </button>
            )}
          </div>

          {/* Bottom Thumbnails */}
          <div className="w-full max-w-md flex items-center justify-center gap-2 overflow-x-auto py-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(idx)}
                className={`h-14 w-14 rounded-xl border p-1 bg-white/10 transition shrink-0 ${selectedImage === idx ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
              >
                <img src={img} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= SIZE & FIT GUIDE MODAL ================= */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 sm:p-7 shadow-2xl text-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B89758]">Product Dimensions &amp; Fit</span>
                <h3 className="text-base font-bold text-gray-950">Size &amp; Fit Guide</h3>
              </div>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                className="text-gray-400 hover:text-black font-bold text-base"
              >
                ✕
              </button>
            </div>

            {/* Category Switcher Tabs */}
            <div className="flex gap-2 border-b border-gray-100 pb-3 mb-4 overflow-x-auto no-scrollbar text-xs">
              <button
                type="button"
                onClick={() => setSizeGuideCategory('watches')}
                className={`px-3 py-1.5 rounded-full font-semibold transition ${sizeGuideCategory === 'watches' ? 'bg-[#111827] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                ⌚ Watches &amp; Wrist
              </button>
              <button
                type="button"
                onClick={() => setSizeGuideCategory('shoes')}
                className={`px-3 py-1.5 rounded-full font-semibold transition ${sizeGuideCategory === 'shoes' ? 'bg-[#111827] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                👟 Footwear Chart
              </button>
              <button
                type="button"
                onClick={() => setSizeGuideCategory('apparel')}
                className={`px-3 py-1.5 rounded-full font-semibold transition ${sizeGuideCategory === 'apparel' ? 'bg-[#111827] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                👔 Apparel &amp; Clothing
              </button>
              <button
                type="button"
                onClick={() => setSizeGuideCategory('devices')}
                className={`px-3 py-1.5 rounded-full font-semibold transition ${sizeGuideCategory === 'devices' ? 'bg-[#111827] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                📱 Tech &amp; Storage
              </button>
            </div>

            {/* Tab 1: Watches */}
            {sizeGuideCategory === 'watches' && (
              <div className="space-y-3 text-xs">
                <p className="text-gray-600">Choose the ideal case diameter matching your wrist circumference for maximum comfort and classic aesthetic balance:</p>
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 text-left">
                  <div className="grid grid-cols-3 bg-gray-50 p-2 font-bold text-gray-800 text-[11px]">
                    <span>Case Size</span>
                    <span>Wrist Size</span>
                    <span>Recommended Fit</span>
                  </div>
                  <div className="grid grid-cols-3 p-2 text-gray-700">
                    <span className="font-semibold text-gray-900">36mm - 38mm</span>
                    <span>14.0 - 16.5 cm</span>
                    <span>Slim / Vintage Dress</span>
                  </div>
                  <div className="grid grid-cols-3 p-2 text-gray-700 bg-amber-50/40">
                    <span className="font-semibold text-gray-900">39mm - 41mm</span>
                    <span>16.0 - 19.0 cm</span>
                    <span>Universal Classic Fit (Most Popular)</span>
                  </div>
                  <div className="grid grid-cols-3 p-2 text-gray-700">
                    <span className="font-semibold text-gray-900">42mm - 45mm</span>
                    <span>18.5 - 22.0 cm</span>
                    <span>Modern Bold / Chrono Presence</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Shoes */}
            {sizeGuideCategory === 'shoes' && (
              <div className="space-y-3 text-xs">
                <p className="text-gray-600">Standard International Footwear conversion table:</p>
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 text-left">
                  <div className="grid grid-cols-4 bg-gray-50 p-2 font-bold text-gray-800 text-[11px]">
                    <span>UK / India</span>
                    <span>US Size</span>
                    <span>EU Size</span>
                    <span>Foot Length</span>
                  </div>
                  <div className="grid grid-cols-4 p-2 text-gray-700">
                    <span className="font-semibold text-gray-900">UK 7</span>
                    <span>US 8</span>
                    <span>EU 41</span>
                    <span>25.5 cm</span>
                  </div>
                  <div className="grid grid-cols-4 p-2 text-gray-700">
                    <span className="font-semibold text-gray-900">UK 8</span>
                    <span>US 9</span>
                    <span>EU 42</span>
                    <span>26.5 cm</span>
                  </div>
                  <div className="grid grid-cols-4 p-2 text-gray-700 bg-amber-50/40">
                    <span className="font-semibold text-gray-900">UK 9</span>
                    <span>US 10</span>
                    <span>EU 43</span>
                    <span>27.5 cm</span>
                  </div>
                  <div className="grid grid-cols-4 p-2 text-gray-700">
                    <span className="font-semibold text-gray-900">UK 10</span>
                    <span>US 11</span>
                    <span>EU 44</span>
                    <span>28.5 cm</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Apparel */}
            {sizeGuideCategory === 'apparel' && (
              <div className="space-y-3 text-xs">
                <p className="text-gray-600">Tailored fashion dimensions (Regular &amp; Slim fit):</p>
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 text-left">
                  <div className="grid grid-cols-3 bg-gray-50 p-2 font-bold text-gray-800 text-[11px]">
                    <span>Size</span>
                    <span>Chest (Inches)</span>
                    <span>Shoulder (Inches)</span>
                  </div>
                  <div className="grid grid-cols-3 p-2 text-gray-700">
                    <span className="font-semibold text-gray-900">S (Small)</span>
                    <span>38"</span>
                    <span>17.5"</span>
                  </div>
                  <div className="grid grid-cols-3 p-2 text-gray-700">
                    <span className="font-semibold text-gray-900">M (Medium)</span>
                    <span>40"</span>
                    <span>18.0"</span>
                  </div>
                  <div className="grid grid-cols-3 p-2 text-gray-700 bg-amber-50/40">
                    <span className="font-semibold text-gray-900">L (Large)</span>
                    <span>42"</span>
                    <span>18.5"</span>
                  </div>
                  <div className="grid grid-cols-3 p-2 text-gray-700">
                    <span className="font-semibold text-gray-900">XL / XXL</span>
                    <span>44" - 46"</span>
                    <span>19.5"</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Tech */}
            {sizeGuideCategory === 'devices' && (
              <div className="space-y-3 text-xs text-gray-600">
                <p>Storage and specifications recommendations:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                  <li><strong>128GB - 256GB:</strong> Perfect for everyday essential apps, standard photography, and 4K video clips.</li>
                  <li><strong>512GB:</strong> Recommended for creators, extensive offline lossless media, and high-performance multi-tasking.</li>
                  <li><strong>1TB:</strong> Ultimate pro storage capacity for extensive RAW photo libraries, ProRes cinema footage, and heavy computational applications.</li>
                </ul>
              </div>
            )}

            <div className="mt-5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                className="w-full rounded-full bg-[#111827] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition"
              >
                Got It &bull; Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= REVIEW SUBMISSION MODAL ================= */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3.5">
              <h3 className="text-xs font-bold text-gray-950 uppercase tracking-wider">Write a Verified Review</h3>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-gray-400 hover:text-black font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={reviewForm.user}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, user: e.target.value }))}
                  placeholder="e.g. Anand Verma"
                  className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-3.5 py-2 outline-none focus:border-gray-400 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Rating *</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-3.5 py-2 outline-none focus:border-gray-400 cursor-pointer font-medium"
                >
                  <option value={5}>★★★★★ (5 Stars - Exceptional Quality)</option>
                  <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                  <option value={2}>★★☆☆☆ (2 Stars - Below Expectations)</option>
                  <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Review Headline *</label>
                <input
                  type="text"
                  required
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Flawless finishing &amp; impeccable luxury packaging"
                  className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-3.5 py-2 outline-none focus:border-gray-400 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Detailed Review *</label>
                <textarea
                  required
                  rows={3}
                  value={reviewForm.text}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Share details regarding craftsmanship, color accuracy, dimensions, and unboxing..."
                  className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-3.5 py-2 outline-none focus:border-gray-400 font-medium"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="flex-1 rounded-full border border-gray-200 bg-gray-100 py-2.5 font-semibold text-gray-700 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#111827] py-2.5 font-semibold uppercase tracking-wider text-white hover:bg-black transition shadow-sm"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}