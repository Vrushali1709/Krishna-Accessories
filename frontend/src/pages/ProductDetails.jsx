// src/pages/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import {
  getProducts,
  getProductById,
  getProductReviews,
  addProductReview,
  isInWishlist,
  toggleWishlist,
  syncProductReviewsFromBackend
} from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { ShieldCheckIcon, TruckIcon, StarIcon, BoxIcon, HeartIcon } from '../components/Icons';
import { Reveal } from '../components/useScrollReveal';
import { Sparkles, Shield, PackageCheck, Heart, ArrowRight, Check, Star, Ruler, MessageSquare } from 'lucide-react';

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
    syncProductReviewsFromBackend(id);
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
      <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <div className="font-serif text-5xl font-medium text-neutral-300 mb-2">404</div>
          <h1 className="font-serif text-2xl font-medium text-neutral-950">Product Not Found</h1>
          <p className="mt-1 text-xs text-neutral-500">The product you are looking for may have been removed or relocated.</p>
          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#8C6734] transition-colors">
            <span>Explore All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
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
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 z-50 flex items-center justify-between sm:justify-start gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-xs font-semibold text-neutral-950 shadow-2xl animate-slide-up max-w-md">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">✓</span>
            <span className="truncate text-xs">{toastMessage}</span>
          </div>
          <Link to="/cart" className="ml-2 shrink-0 rounded-lg bg-neutral-950 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#8C6734] transition-colors">
            View Bag
          </Link>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="border-b border-neutral-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 text-xs text-neutral-400 flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap font-medium">
          <Link to="/" className="hover:text-neutral-950 transition-colors shrink-0">Home</Link>
          <span className="text-neutral-300 shrink-0">/</span>
          <Link to="/shop" className="hover:text-neutral-950 transition-colors shrink-0">Catalog</Link>
          <span className="text-neutral-300 shrink-0">/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-neutral-950 text-neutral-700 shrink-0 transition-colors">
            {product.category}
          </Link>
          <span className="text-neutral-300 shrink-0">/</span>
          <span className="text-neutral-950 font-semibold truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Product Showcase */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        <div className="grid gap-8 lg:grid-cols-12 items-start">

          {/* Left Column: Multi-Angle Image Gallery (6 Cols) */}
          <div className="lg:col-span-6 space-y-4 min-w-0">
            <Reveal delay={0} direction="up">
              {/* Main Stage Image with Zoom & Angle Badge */}
              <div className="relative group aspect-square overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-10 flex items-center justify-center shadow-sm">
                {discount > 0 && (
                  <span className="absolute left-4 top-4 z-10 rounded-full bg-neutral-950 px-3 py-1 text-[10.5px] font-bold tracking-wider text-white shadow-sm">
                    {discount}% OFF
                  </span>
                )}

                {/* Active Angle Badge */}
                <div className="absolute left-4 bottom-4 z-10 flex items-center gap-1.5 rounded-full bg-neutral-950/80 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-md shadow-sm">
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="truncate">{angleLabels[selectedImage] || `Angle ${selectedImage + 1}`}</span>
                </div>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className={`absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200/80 bg-white/95 shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
                    inWish ? 'text-rose-500 border-rose-200 bg-rose-50/90' : 'text-neutral-400 hover:text-neutral-950'
                  }`}
                  title={inWish ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={`w-4 h-4 ${inWish ? 'fill-rose-500' : ''}`} />
                </button>

                {/* Lightbox Hint */}
                <button
                  type="button"
                  onClick={() => { setLightboxOpen(true); setLightboxZoom(1); }}
                  className="absolute right-4 bottom-4 z-10 flex items-center gap-1 rounded-full bg-white/90 border border-neutral-200 px-2.5 py-1 text-[10px] font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-white hover:text-neutral-950 backdrop-blur-xs cursor-pointer"
                  title="Open Fullscreen Lightbox"
                >
                  <span>⤢ Fullscreen</span>
                </button>

                {/* Main Stage Image */}
                <img
                  src={images[selectedImage] || images[0]}
                  alt={`${product.name} - ${angleLabels[selectedImage] || 'View'}`}
                  onClick={() => { setLightboxOpen(true); setLightboxZoom(1); }}
                  className="h-full w-full object-contain mix-blend-multiply cursor-zoom-in transition-all duration-500 ease-out group-hover:scale-105"
                />

                {/* Prev/Next Quick Angle Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 border border-neutral-200 shadow-md text-neutral-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-neutral-950 hover:text-white cursor-pointer"
                      title="Previous Angle"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 border border-neutral-200 shadow-md text-neutral-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-neutral-950 hover:text-white cursor-pointer"
                      title="Next Angle"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Multi-Angle Thumbnails */}
              {images.length > 1 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
                    <span className="font-semibold uppercase tracking-[0.14em] text-[10px] text-neutral-400">
                      Multi-Angle Perspectives ({images.length})
                    </span>
                    <span className="text-[10.5px] text-[#8C6734] font-medium">Click thumbnail to switch</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {images.map((img, idx) => {
                      const isSelected = selectedImage === idx;
                      const label = angleLabels[idx] || `Angle ${idx + 1}`;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImage(idx)}
                          onMouseEnter={() => setSelectedImage(idx)}
                          className={`group/thumb relative flex flex-col items-center justify-between overflow-hidden rounded-xl border p-1.5 bg-white transition-all duration-200 text-left cursor-pointer ${
                            isSelected
                              ? 'border-[#8C6734] ring-2 ring-[#C5A880]/30 shadow-sm bg-[#FAF8F5]'
                              : 'border-neutral-200/80 hover:border-neutral-400'
                          }`}
                        >
                          <div className="aspect-square w-full overflow-hidden rounded-lg bg-[#FAFAFB] p-1 flex items-center justify-center">
                            <img
                              src={img}
                              alt=""
                              className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover/thumb:scale-108"
                            />
                          </div>
                          <span className={`mt-1.5 block w-full text-center text-[9.5px] font-medium truncate px-0.5 ${
                            isSelected ? 'text-[#8C6734] font-bold' : 'text-neutral-500 group-hover/thumb:text-neutral-900'
                          }`}>
                            {label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Trust Assurances Under Gallery */}
              <div className="grid grid-cols-3 gap-2 rounded-xl border border-neutral-200/80 bg-white p-3.5 text-center shadow-2xs mt-4">
                <div className="flex flex-col items-center justify-center p-1">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF8F5] text-[#8C6734] text-xs font-bold mb-1 border border-[#C5A880]/40">✓</span>
                  <p className="text-[11px] font-semibold text-neutral-950 leading-tight">Quality Assured</p>
                  <p className="text-[9.5px] text-neutral-500 leading-tight mt-0.5">Verified Details</p>
                </div>
                <div className="flex flex-col items-center justify-center border-x border-neutral-100 p-1">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF8F5] text-[#8C6734] text-xs font-bold mb-1 border border-[#C5A880]/40">🚚</span>
                  <p className="text-[11px] font-semibold text-neutral-950 leading-tight">Express Air</p>
                  <p className="text-[9.5px] text-neutral-500 leading-tight mt-0.5">BlueDart Priority</p>
                </div>
                <div className="flex flex-col items-center justify-center p-1">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF8F5] text-[#8C6734] text-xs font-bold mb-1 border border-[#C5A880]/40">🛡️</span>
                  <p className="text-[11px] font-semibold text-neutral-950 leading-tight">7-Day Privilege</p>
                  <p className="text-[9.5px] text-neutral-500 leading-tight mt-0.5">Hassle-Free Return</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Product Variations & Interactive Buy Box (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-start rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-sm min-w-0 space-y-5">
            <Reveal delay={50} direction="up">
              {/* Brand & SKU Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C6734] bg-[#F5F2EB] border border-[#C5A880]/40 px-3 py-0.5 rounded-full">
                    {product.brand}
                  </span>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-medium text-neutral-600">
                    {product.category}
                  </span>
                </div>
                <span className="rounded-md bg-[#FAF8F5] px-2.5 py-0.5 text-[10px] font-mono text-neutral-600 border border-neutral-200/80">
                  SKU: {dynamicSku}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-neutral-950 leading-snug mt-2">
                {product.name}
              </h1>

              {/* Rating & In-Stock Availability */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs pt-1">
                <div className="flex items-center gap-1.5 font-semibold text-neutral-900 bg-[#FAF8F5] border border-[#C5A880]/40 px-3 py-1 rounded-full">
                  <span className="text-amber-500 font-bold">★ {product.rating || 4.8}</span>
                  <span className="text-neutral-400 font-normal">({reviews.length} Reviews)</span>
                </div>
                <span className="text-neutral-300">&bull;</span>
                <span className="text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-[11px]">
                  {effectiveStock > 0 ? `● In Stock (${effectiveStock} units)` : '● Currently unavailable'}
                </span>
              </div>

              {/* Dynamic Live Price Area */}
              <div className="rounded-xl bg-[#FAF8F5] border border-neutral-200/80 p-4 sm:p-5 space-y-1.5">
                <div className="flex flex-wrap items-baseline gap-2.5">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight text-[#8C6734] tabular-nums">
                    ₹{effectivePrice.toLocaleString('en-IN')}
                  </span>
                  {effectiveOldPrice && effectiveOldPrice > effectivePrice && (
                    <span className="text-xs sm:text-sm text-neutral-400 line-through tabular-nums">
                      ₹{effectiveOldPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {savings > 0 && (
                    <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                      Save ₹{savings.toLocaleString('en-IN')} ({discount}%)
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] text-neutral-500 pt-1">
                  <span>Inclusive of all duties &amp; GST &bull; Free Pan-India Insured Transit</span>
                  {variantDelta > 0 && (
                    <span className="font-semibold text-[#8C6734] bg-white px-2 py-0.5 rounded border border-[#C5A880]/40 self-start sm:self-auto">
                      +₹{variantDelta.toLocaleString('en-IN')} edition adjustment
                    </span>
                  )}
                </div>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-[13px] leading-relaxed text-neutral-600 font-normal">
                {product.description}
              </p>

              {/* ================= VARIATIONS CONFIGURATOR ================= */}
              <div className="space-y-4 border-t border-neutral-100 pt-4">

                {/* 1. Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-600">1. Select Color / Finish:</span>
                      <span className="text-xs font-semibold text-[#8C6734] bg-[#FAF8F5] border border-[#C5A880]/40 px-2.5 py-0.5 rounded-md">
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
                            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'border-[#8C6734] bg-[#FAF8F5] text-[#8C6734] font-bold shadow-2xs'
                                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                            }`}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 rounded-full border ${isSelected ? 'border-[#8C6734] ring-1 ring-[#8C6734]' : 'border-neutral-300'}`}
                              style={{ backgroundColor: hex }}
                            />
                            <span>{color}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-600">2. Select Size / Dimension:</span>
                      <button
                        type="button"
                        onClick={() => setSizeGuideOpen(true)}
                        className="text-[11px] font-semibold text-[#8C6734] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Ruler className="w-3.5 h-3.5" />
                        <span>Size &amp; Fit Guide</span>
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
                            className={`rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'border-[#8C6734] bg-neutral-950 text-white shadow-2xs'
                                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Edition / Strap Variant */}
                {product.variants && product.variants.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-600">3. Select Edition / Strap:</span>
                      <span className="text-xs font-semibold text-[#8C6734] bg-[#FAF8F5] border border-[#C5A880]/40 px-2.5 py-0.5 rounded-md">
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
                            className={`flex items-center justify-between rounded-lg border p-2.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'border-[#8C6734] bg-[#FAF8F5] text-[#8C6734] font-bold shadow-2xs'
                                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                            }`}
                          >
                            <span className="truncate pr-2">{v}</span>
                            <span className={`text-[10px] shrink-0 font-semibold px-2 py-0.5 rounded ${
                              isSelected
                                ? 'bg-[#F5F2EB] text-[#8C6734]'
                                : delta > 0 ? 'bg-[#FAF8F5] text-[#8C6734] border border-[#C5A880]/30' : 'bg-neutral-100 text-neutral-500'
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
              <div className="rounded-lg border border-[#C5A880]/40 bg-[#FAF8F5] p-3 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 min-w-0 pr-1">
                  <span className="text-[#8C6734] text-sm shrink-0">✦</span>
                  <span className="text-[11.5px] font-medium text-neutral-800 truncate">
                    Selected: <strong className="text-neutral-950">{selectedColor || 'Standard'}</strong>
                    {selectedSize && <span> &bull; <strong className="text-neutral-950">{selectedSize}</strong></span>}
                    {selectedVariant && <span> &bull; <strong className="text-neutral-950">{selectedVariant}</strong></span>}
                  </span>
                </div>
                <span className="font-serif font-bold text-neutral-950 shrink-0 text-sm text-[#8C6734]">
                  ₹{effectivePrice.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Quantity Stepper & Buy Action Buttons */}
              <div className="space-y-3.5 border-t border-neutral-100 pt-4">

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-semibold text-neutral-700">Quantity:</span>
                    <div className="flex items-center rounded-lg border border-neutral-200/90 bg-[#FAF8F5] p-0.5">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="flex h-7 w-7 items-center justify-center text-xs font-bold text-neutral-700 hover:bg-white hover:text-black hover:shadow-2xs rounded transition active:scale-95 cursor-pointer"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-neutral-950 tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(effectiveStock || 1, quantity + 1))}
                        className="flex h-7 w-7 items-center justify-center text-xs font-bold text-neutral-700 hover:bg-white hover:text-black hover:shadow-2xs rounded transition active:scale-95 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Amount:</span>
                    <span className="font-serif text-lg font-bold text-neutral-950 tabular-nums">
                      ₹{(effectivePrice * quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 pt-1">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="rounded-lg border border-neutral-300 bg-white py-3.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-neutral-900 transition-colors hover:border-[#C5A880] hover:bg-[#FAF8F5] active:scale-98 shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>🛍️</span>
                    <span>Add to Bag</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="rounded-lg bg-neutral-950 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:bg-[#8C6734] active:scale-98 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>⚡</span>
                    <span>Buy Now &rarr;</span>
                  </button>
                </div>

              </div>
            </Reveal>
          </div>

        </div>

        {/* ================= TABBED SPECIFICATIONS & REVIEWS ================= */}
        <section className="mt-12 sm:mt-16 rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-10 shadow-sm">
          <Reveal delay={0} direction="up">
            <div className="flex border-b border-neutral-200 gap-6 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 text-xs font-semibold uppercase tracking-[0.14em] transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'specs'
                    ? 'border-b-2 border-[#8C6734] text-[#8C6734] font-bold'
                    : 'text-neutral-400 hover:text-neutral-950'
                }`}
              >
                Specifications &amp; Variations
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 text-xs font-semibold uppercase tracking-[0.14em] transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-[#8C6734] text-[#8C6734] font-bold'
                    : 'text-neutral-400 hover:text-neutral-950'
                }`}
              >
                Verified Reviews ({reviews.length})
              </button>
              <button
                onClick={() => setActiveTab('delivery')}
                className={`pb-3 text-xs font-semibold uppercase tracking-[0.14em] transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'delivery'
                    ? 'border-b-2 border-[#8C6734] text-[#8C6734] font-bold'
                    : 'text-neutral-400 hover:text-neutral-950'
                }`}
              >
                Shipping, Warranty &amp; Care
              </button>
            </div>

            <div className="mt-6">
              {/* Specs Tab */}
              {activeTab === 'specs' && (
                <div className="grid gap-4 sm:gap-8 sm:grid-cols-2 animate-fade-in">
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-neutral-100 py-2.5 text-xs gap-3">
                      <span className="text-neutral-500 font-medium shrink-0">Brand Partner</span>
                      <span className="font-semibold text-neutral-950 text-right">{product.brand}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 py-2.5 text-xs gap-3">
                      <span className="text-neutral-500 font-medium shrink-0">Category</span>
                      <span className="font-semibold text-neutral-950 text-right">{product.category}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 py-2.5 text-xs gap-3">
                      <span className="text-neutral-500 font-medium shrink-0">Dynamic SKU</span>
                      <span className="font-mono font-semibold text-[#8C6734] text-right">{dynamicSku}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 py-2.5 text-xs gap-3">
                      <span className="text-neutral-500 font-medium shrink-0">Curated Sourcing</span>
                      <span className="font-semibold text-neutral-950 text-right">{product.supplier || 'Krishna Luxury Accessories Boutique'}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 py-2.5 text-xs gap-3">
                      <span className="text-neutral-500 font-medium shrink-0">Available Finishes</span>
                      <span className="font-semibold text-neutral-950 text-right">{product.colors ? product.colors.join(', ') : 'Standard'}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 py-2.5 text-xs gap-3">
                      <span className="text-neutral-500 font-medium shrink-0">Available Sizes</span>
                      <span className="font-semibold text-neutral-950 text-right">{product.sizes ? product.sizes.join(', ') : 'Standard Fit'}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="flex justify-between border-b border-neutral-100 py-2.5 text-xs gap-3">
                        <span className="text-neutral-500 font-medium shrink-0">{key}</span>
                        <span className="font-semibold text-neutral-950 text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-serif text-3xl font-bold text-neutral-950">{product.rating || 4.8}</span>
                        <span className="text-amber-500 text-lg">★★★★★</span>
                        <span className="text-xs text-neutral-500">({reviews.length} verified ratings)</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReviewModalOpen(true)}
                      className="rounded-lg bg-neutral-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#8C6734] transition-colors shadow-2xs cursor-pointer"
                    >
                      Write a Review
                    </button>
                  </div>

                  {/* Review List */}
                  <div className="divide-y divide-neutral-100 space-y-4">
                    {reviews.length === 0 ? (
                      <p className="text-xs text-neutral-500 py-4 font-normal">No customer reviews yet for this product. Be the first to share your experience!</p>
                    ) : (
                      reviews.map(rev => (
                        <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs text-neutral-950">{rev.user}</span>
                              {rev.verified && (
                                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9.5px] font-semibold text-emerald-800">
                                  ✓ Verified Buyer
                                </span>
                              )}
                            </div>
                            <span className="text-[10.5px] text-neutral-400 font-mono">{rev.date}</span>
                          </div>

                          <div className="flex items-center gap-2 text-amber-500 text-xs">
                            {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                            <span className="text-xs font-semibold text-neutral-900">{rev.title}</span>
                          </div>

                          <p className="text-xs text-neutral-600 leading-relaxed font-normal">{rev.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Delivery Tab */}
              {activeTab === 'delivery' && (
                <div className="space-y-4 text-xs text-neutral-700 leading-relaxed animate-fade-in font-normal">
                  <div className="rounded-xl bg-[#FAF8F5] p-4 border border-neutral-200/80">
                    <p className="font-semibold text-neutral-950 mb-1">📦 Express Priority Shipping Across India:</p>
                    <p>Orders placed before 2:00 PM are dispatched same day via BlueDart Apex Air or Delhivery Express. Orders valued at ₹2,000 or above receive complimentary insured express delivery.</p>
                  </div>
                  <div className="rounded-xl bg-[#FAF8F5] p-4 border border-neutral-200/80">
                    <p className="font-semibold text-neutral-950 mb-1">🔄 7-Day Hassle-Free Returns &amp; Exchanges:</p>
                    <p>If you wish to exchange the size, color variation, or request a return, simply initiate a request from your Order Tracking page within 7 calendar days of receipt.</p>
                  </div>
                  <div className="rounded-xl bg-[#FAF8F5] p-4 border border-neutral-200/80">
                    <p className="font-semibold text-neutral-950 mb-1">🛡️ Quality Guarantee &amp; Brand Warranty:</p>
                    <p>Every piece undergoes rigorous multi-point inspection prior to dispatch and arrives with comprehensive product details and manufacturer warranty documentation.</p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </section>

        {/* ================= RELATED PRODUCTS SHOWCASE ================= */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <Reveal delay={0} direction="up">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#8C6734]">Curated Recommendations</span>
                  <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-neutral-950 mt-0.5">Related Luxury Pieces</h3>
                </div>
                <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="text-xs font-semibold text-[#8C6734] hover:text-neutral-950 transition-colors uppercase tracking-wider">
                  Explore All &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
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
            </Reveal>
          </section>
        )}

      </main>

      {/* ================= FULLSCREEN LIGHTBOX MODAL ================= */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/90 p-4 backdrop-blur-md animate-fade-in text-white">
          <div className="w-full max-w-5xl flex items-center justify-between py-2 border-b border-white/10 gap-2">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-mono text-neutral-400 truncate">{product.brand} &bull; {angleLabels[selectedImage] || `Angle ${selectedImage + 1}`}</p>
              <h3 className="text-sm font-bold text-white truncate max-w-md">{product.name}</h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setLightboxZoom(prev => Math.min(2.2, prev + 0.3))}
                className="rounded-lg bg-white/10 px-3 py-1 text-xs font-bold hover:bg-white/20 transition cursor-pointer"
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setLightboxZoom(prev => Math.max(1, prev - 0.3))}
                className="rounded-lg bg-white/10 px-3 py-1 text-xs font-bold hover:bg-white/20 transition cursor-pointer"
                title="Zoom Out"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => setLightboxZoom(1)}
                className="rounded-lg bg-white/10 px-3 py-1 text-[11px] font-semibold hover:bg-white/20 transition cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="rounded-lg bg-white/20 px-3.5 py-1 text-xs font-bold hover:bg-white/30 transition ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="relative flex-1 w-full max-w-4xl flex items-center justify-center overflow-hidden my-4">
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => setSelectedImage(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white text-lg font-bold backdrop-blur-md transition cursor-pointer"
              >
                ‹
              </button>
            )}

            <div className="overflow-auto max-h-full max-w-full flex items-center justify-center p-2">
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
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white text-lg font-bold backdrop-blur-md transition cursor-pointer"
              >
                ›
              </button>
            )}
          </div>

          <div className="w-full max-w-md flex items-center justify-center gap-2 overflow-x-auto py-2 no-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(idx)}
                className={`h-12 w-12 rounded-lg border p-1 bg-white/10 transition shrink-0 cursor-pointer ${
                  selectedImage === idx ? 'border-[#C5A880] ring-2 ring-[#C5A880]/50' : 'border-white/20 opacity-60 hover:opacity-100'
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
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl text-neutral-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
              <div>
                <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#8C6734]">Dimensions &amp; Sizing</span>
                <h3 className="font-serif text-lg font-medium text-neutral-950">Size &amp; Fit Guide</h3>
              </div>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                className="text-neutral-400 hover:text-black font-bold text-base p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Category Switcher Tabs */}
            <div className="flex gap-2 border-b border-neutral-100 pb-3 mb-4 overflow-x-auto no-scrollbar text-xs">
              <button
                type="button"
                onClick={() => setSizeGuideCategory('watches')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${sizeGuideCategory === 'watches' ? 'bg-neutral-950 text-white font-semibold' : 'bg-[#FAF8F5] text-neutral-700 hover:bg-neutral-200'}`}
              >
                ⌚ Watches
              </button>
              <button
                type="button"
                onClick={() => setSizeGuideCategory('shoes')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${sizeGuideCategory === 'shoes' ? 'bg-neutral-950 text-white font-semibold' : 'bg-[#FAF8F5] text-neutral-700 hover:bg-neutral-200'}`}
              >
                👟 Footwear
              </button>
              <button
                type="button"
                onClick={() => setSizeGuideCategory('apparel')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${sizeGuideCategory === 'apparel' ? 'bg-neutral-950 text-white font-semibold' : 'bg-[#FAF8F5] text-neutral-700 hover:bg-neutral-200'}`}
              >
                👔 Apparel
              </button>
              <button
                type="button"
                onClick={() => setSizeGuideCategory('devices')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${sizeGuideCategory === 'devices' ? 'bg-neutral-950 text-white font-semibold' : 'bg-[#FAF8F5] text-neutral-700 hover:bg-neutral-200'}`}
              >
                📱 Storage
              </button>
            </div>

            {/* Tab 1: Watches */}
            {sizeGuideCategory === 'watches' && (
              <div className="space-y-3 text-xs text-neutral-600">
                <p>Choose the ideal case diameter matching your wrist circumference for balanced luxury proportion:</p>
                <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100 text-left">
                  <div className="grid grid-cols-3 bg-[#FAF8F5] p-2.5 font-bold text-neutral-900 text-[11px]">
                    <span>Case Diameter</span>
                    <span>Wrist Size</span>
                    <span>Recommended Style</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5">
                    <span className="font-semibold text-neutral-950">36mm - 38mm</span>
                    <span>14.0 - 16.5 cm</span>
                    <span>Vintage Dress Fit</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 bg-[#F5F2EB]/50">
                    <span className="font-semibold text-neutral-950">39mm - 41mm</span>
                    <span>16.0 - 19.0 cm</span>
                    <span>Universal Classic Fit</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5">
                    <span className="font-semibold text-neutral-950">42mm - 45mm</span>
                    <span>18.5 - 22.0 cm</span>
                    <span>Bold Chronograph</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Shoes */}
            {sizeGuideCategory === 'shoes' && (
              <div className="space-y-3 text-xs text-neutral-600">
                <p>Standard International Footwear conversion table:</p>
                <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100 text-left">
                  <div className="grid grid-cols-4 bg-[#FAF8F5] p-2.5 font-bold text-neutral-900 text-[11px]">
                    <span>UK / India</span>
                    <span>US</span>
                    <span>EU</span>
                    <span>Length</span>
                  </div>
                  <div className="grid grid-cols-4 p-2.5">
                    <span className="font-semibold text-neutral-950">UK 7</span>
                    <span>US 8</span>
                    <span>EU 41</span>
                    <span>25.5 cm</span>
                  </div>
                  <div className="grid grid-cols-4 p-2.5">
                    <span className="font-semibold text-neutral-950">UK 8</span>
                    <span>US 9</span>
                    <span>EU 42</span>
                    <span>26.5 cm</span>
                  </div>
                  <div className="grid grid-cols-4 p-2.5 bg-[#F5F2EB]/50">
                    <span className="font-semibold text-neutral-950">UK 9</span>
                    <span>US 10</span>
                    <span>EU 43</span>
                    <span>27.5 cm</span>
                  </div>
                  <div className="grid grid-cols-4 p-2.5">
                    <span className="font-semibold text-neutral-950">UK 10</span>
                    <span>US 11</span>
                    <span>EU 44</span>
                    <span>28.5 cm</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Apparel */}
            {sizeGuideCategory === 'apparel' && (
              <div className="space-y-3 text-xs text-neutral-600">
                <p>Tailored luxury fashion sizing dimensions:</p>
                <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100 text-left">
                  <div className="grid grid-cols-3 bg-[#FAF8F5] p-2.5 font-bold text-neutral-900 text-[11px]">
                    <span>Size</span>
                    <span>Chest</span>
                    <span>Shoulder</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5">
                    <span className="font-semibold text-neutral-950">S (Small)</span>
                    <span>38"</span>
                    <span>17.5"</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5">
                    <span className="font-semibold text-neutral-950">M (Medium)</span>
                    <span>40"</span>
                    <span>18.0"</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 bg-[#F5F2EB]/50">
                    <span className="font-semibold text-neutral-950">L (Large)</span>
                    <span>42"</span>
                    <span>18.5"</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5">
                    <span className="font-semibold text-neutral-950">XL / XXL</span>
                    <span>44" - 46"</span>
                    <span>19.5"</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Tech */}
            {sizeGuideCategory === 'devices' && (
              <div className="space-y-3 text-xs text-neutral-600">
                <p>Storage capacity &amp; performance recommendations:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-neutral-700">
                  <li><strong>128GB - 256GB:</strong> Perfect for everyday essential apps and standard 4K media.</li>
                  <li><strong>512GB:</strong> Recommended for extensive lossless audio libraries and multi-tasking.</li>
                  <li><strong>1TB:</strong> Ultimate pro capacity for RAW photography and computational heavy media.</li>
                </ul>
              </div>
            )}

            <div className="mt-6 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                className="w-full rounded-lg bg-neutral-950 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#8C6734] transition-colors cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= REVIEW SUBMISSION MODAL ================= */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
              <h3 className="font-serif text-base font-medium text-neutral-950">Write a Verified Review</h3>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-neutral-400 hover:text-black font-bold text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-medium text-neutral-700 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={reviewForm.user}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, user: e.target.value }))}
                  placeholder="e.g. Anand Verma"
                  className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFB] px-3.5 py-2 outline-none focus:border-[#C5A880] focus:bg-white"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Rating *</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFB] px-3.5 py-2 outline-none focus:border-[#C5A880] focus:bg-white cursor-pointer"
                >
                  <option value={5}>★★★★★ (5 Stars - Exceptional Quality)</option>
                  <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                  <option value={2}>★★☆☆☆ (2 Stars - Below Expectations)</option>
                  <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Review Headline *</label>
                <input
                  type="text"
                  required
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Impeccable craftsmanship and packaging"
                  className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFB] px-3.5 py-2 outline-none focus:border-[#C5A880] focus:bg-white"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Detailed Review *</label>
                <textarea
                  required
                  rows={3}
                  value={reviewForm.text}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Share details regarding finishing, dimensions, and unboxing..."
                  className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFB] px-3.5 py-2 outline-none focus:border-[#C5A880] focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="flex-1 rounded-lg border border-neutral-200 bg-white py-2.5 font-medium text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-neutral-950 py-2.5 font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#8C6734] transition-colors shadow-sm cursor-pointer"
                >
                  Submit
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