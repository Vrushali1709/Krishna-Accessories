// src/pages/ProductDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
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
  getColorHex
} from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import {
  ShieldCheckIcon,
  TruckIcon,
  StarIcon,
  BoxIcon,
  HeartIcon,
  ArrowRightIcon,
  TagIcon,
  BagIcon
} from '../components/Icons';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Core Product & Review Data State
  const [product, setProduct] = useState(() => getProductById(id));
  const [reviews, setReviews] = useState(() => getProductReviews(id));
  const [inWish, setInWish] = useState(() => isInWishlist(id));

  // Interactive Gallery State
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef(null);

  // Variation Selection State
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [validationError, setValidationError] = useState('');

  // UI Tabs & Notifications State
  const [activeTab, setActiveTab] = useState('specs');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Pincode Delivery Estimator State
  const [pincodeInput, setPincodeInput] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState(null);

  // Write Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    user: '',
    rating: 5,
    title: '',
    text: ''
  });

  // Load and refresh product data
  const refreshData = () => {
    const found = getProductById(id);
    setProduct(found);
    setReviews(getProductReviews(id));
    setInWish(isInWishlist(id));
    if (found) {
      // Pick sensible default variations (first in-stock color & variant)
      setSelectedColor(found.colors?.[0] || '');
      setSelectedVariant(found.variants?.[0] || '');
      setSelectedImage(0);
      setQuantity(1);
      setValidationError('');
    }
  };

  useEffect(() => {
    refreshData();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleReviewsUpdate = () => setReviews(getProductReviews(id));
    const handleWishlistUpdate = () => setInWish(isInWishlist(id));
    const handleProductsUpdate = () => {
      const updated = getProductById(id);
      if (updated) setProduct(updated);
    };

    window.addEventListener('reviewsUpdated', handleReviewsUpdate);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    window.addEventListener('productsUpdated', handleProductsUpdate);

    return () => {
      window.removeEventListener('reviewsUpdated', handleReviewsUpdate);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAFB] text-gray-900 flex flex-col justify-between">
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100 text-gray-400 text-3xl font-bold mb-4">
            404
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-950">Product Not Found</h1>
          <p className="mt-2 max-w-sm text-xs sm:text-sm text-gray-500 leading-relaxed">
            The boutique accessory you are looking for may have been retired or is currently unavailable.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/shop"
              className="rounded-full bg-[#111827] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-black transition"
            >
              Browse Full Catalog
            </Link>
            <Link
              to="/"
              className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Return Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Multi-image list
  const rawImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'];
  const images = rawImages.filter(Boolean);

  // Dynamic Variation Pricing & Stock calculation
  const variantInfo = product.variantDetails?.[selectedVariant] || null;
  const priceModifier = variantInfo?.priceModifier || 0;
  const currentPrice = Number(product.price || 0) + priceModifier;
  const currentOldPrice = product.oldPrice ? Number(product.oldPrice) + priceModifier : null;
  const currentStock = variantInfo?.stock !== undefined ? variantInfo.stock : (product.stock || 0);
  const currentSku = variantInfo?.skuSuffix
    ? `${product.sku || `KA-${product.id}`}-${variantInfo.skuSuffix}`
    : (product.sku || `KA-${product.id}`);

  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  const discount = currentOldPrice && currentOldPrice > currentPrice
    ? Math.round(((currentOldPrice - currentPrice) / currentOldPrice) * 100)
    : (product.discount || 0);

  const savings = currentOldPrice && currentOldPrice > currentPrice
    ? currentOldPrice - currentPrice
    : 0;

  // Determine attribute section label based on category
  const getVariantLabel = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('shoe')) return 'Shoe Size (UK)';
    if (c.includes('cloth') || c.includes('fashion') || c.includes('jean')) return 'Size / Waist';
    if (c.includes('mobile') || c.includes('laptop')) return 'Storage / Memory Edition';
    if (c.includes('watch')) return 'Strap & Dial Edition';
    if (c.includes('gaming')) return 'Switch Type';
    if (c.includes('eyewear') || c.includes('accessori')) return 'Frame & Lens Size';
    return 'Edition / Option';
  };

  // Image Navigation Handlers
  const handlePrevImage = (e) => {
    e?.stopPropagation();
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Magnifier Zoom Handler on hover
  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    });
  };

  // Authentication check helper
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

  // Cart Handlers with Validation
  const handleAddToCart = () => {
    if (isOutOfStock) {
      setToastType('error');
      setToastMessage('This variant is currently out of stock.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    if (product.colors?.length > 0 && !selectedColor) {
      setValidationError('Please select a color finish.');
      return;
    }
    if (product.variants?.length > 0 && !selectedVariant) {
      setValidationError(`Please select a ${getVariantLabel(product.category)}.`);
      return;
    }
    setValidationError('');

    addToCart(
      product,
      quantity,
      selectedColor,
      selectedVariant,
      currentPrice,
      images[selectedImage] || product.image,
      currentSku
    );

    const variantLabel = [selectedColor, selectedVariant].filter(Boolean).join(' • ');
    setToastType('success');
    setToastMessage(`✓ Added ${quantity} × "${product.name}"${variantLabel ? ` (${variantLabel})` : ''} to your bag`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    if (product.colors?.length > 0 && !selectedColor) {
      setValidationError('Please select a color finish.');
      return;
    }
    if (product.variants?.length > 0 && !selectedVariant) {
      setValidationError(`Please select a ${getVariantLabel(product.category)}.`);
      return;
    }
    setValidationError('');

    addToCart(
      product,
      quantity,
      selectedColor,
      selectedVariant,
      currentPrice,
      images[selectedImage] || product.image,
      currentSku
    );
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    if (!requireLogin('wishlist')) return;
    const active = toggleWishlist(product);
    setInWish(active);
    setToastType('success');
    setToastMessage(active ? '✓ Saved to your Wishlist' : 'Item removed from Wishlist');
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Indian Pincode Delivery Estimator
  const handleCheckPincode = (e) => {
    e.preventDefault();
    const pin = pincodeInput.trim();
    if (!/^\d{6}$/.test(pin)) {
      setDeliveryEstimate({
        valid: false,
        message: 'Please enter a valid 6-digit Indian PIN code.'
      });
      return;
    }

    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + (pin.startsWith('4') || pin.startsWith('1') ? 2 : 3));

    const dateStr = deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });

    setDeliveryEstimate({
      valid: true,
      pin,
      date: dateStr,
      freeShipping: currentPrice >= 2000,
      cod: true
    });
  };

  // Customer Review Submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.title.trim() || !reviewForm.text.trim()) return;
    addProductReview(product.id, reviewForm);
    setReviewModalOpen(false);
    setReviewForm({ user: '', rating: 5, title: '', text: '' });
    setToastType('success');
    setToastMessage('✓ Thank you! Your verified review has been published.');
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Category-Relevant Related Products
  const relatedProducts = getProducts()
    .filter((p) => p.category === product.category && Number(p.id) !== Number(product.id))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-hidden font-sans selection:bg-[#111827] selection:text-white">
      <Navbar />

      {/* Floating Animated Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/95 px-4 py-3 text-xs font-semibold text-gray-950 shadow-2xl backdrop-blur-md animate-slide-up">
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${toastType === 'error'
              ? 'bg-rose-100 text-rose-700'
              : 'bg-emerald-100 text-emerald-700'
              }`}
          >
            {toastType === 'error' ? '!' : '✓'}
          </span>
          <span className="truncate max-w-xs">{toastMessage}</span>
          <Link
            to="/cart"
            className="ml-2 rounded-full bg-[#111827] px-3.5 py-1 text-[11px] font-bold text-white hover:bg-black transition shadow-2xs shrink-0"
          >
            View Bag
          </Link>
        </div>
      )}

      {/* Breadcrumb Navigation Strip */}
      <nav aria-label="Breadcrumb" className="border-b border-gray-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 text-xs text-gray-500 flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link to="/" className="hover:text-gray-950 transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link to="/shop" className="hover:text-gray-950 transition">Catalog</Link>
          <span className="text-gray-300">/</span>
          <Link
            to={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-gray-950 font-medium text-gray-700 transition"
          >
            {product.category}
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-950 font-semibold truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </div>
      </nav>

      {/* Main Showcase Grid */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-start">

          {/* ================= LEFT COLUMN: MULTI-IMAGE GALLERY (5 Cols) ================= */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-3.5">

            {/* 1. Main Stage Image with Zoom Lens & Lightbox Trigger */}
            <div
              ref={imageContainerRef}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              onClick={() => setLightboxOpen(true)}
              className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-gray-200/80 bg-[#F6F7F9] p-4 sm:p-8 flex items-center justify-center shadow-xs cursor-zoom-in select-none"
            >
              {/* Badges & Actions Overlay */}
              <div className="absolute top-3.5 inset-x-3.5 z-20 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {discount > 0 && (
                    <span className="rounded-full bg-[#111827] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                      {discount}% OFF
                    </span>
                  )}
                  {product.status === 'Active' && (
                    <span className="rounded-full bg-white/90 border border-gray-200/70 backdrop-blur-md px-2.5 py-0.5 text-[9.5px] font-semibold text-gray-700">
                      100% Genuine
                    </span>
                  )}
                </div>

                {/* Floating Wishlist Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlistToggle();
                  }}
                  aria-label={inWish ? "Remove from Wishlist" : "Add to Wishlist"}
                  className={`pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 ${inWish
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                    : 'border-gray-200 bg-white/90 text-gray-600 hover:text-rose-600 hover:bg-white'
                    }`}
                  title={inWish ? "Remove from Wishlist" : "Save to Wishlist"}
                >
                  <HeartIcon className="w-4 h-4" filled={inWish} />
                </button>
              </div>

              {/* Main Product Image (Supports normal state and smooth cursor zoom preview) */}
              <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
                <img
                  src={images[selectedImage] || images[0]}
                  alt={`${product.name} view ${selectedImage + 1}`}
                  className={`h-full w-full object-contain mix-blend-multiply transition-transform duration-300 ease-out ${isZooming ? 'scale-130' : 'scale-100 group-hover:scale-103'
                    }`}
                  style={
                    isZooming
                      ? {
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                      }
                      : undefined
                  }
                  loading="eager"
                />
              </div>

              {/* Next / Previous Overlay Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Previous product image"
                    className="absolute left-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200/80 bg-white/90 text-gray-700 opacity-80 backdrop-blur-md shadow-sm transition hover:opacity-100 hover:scale-105 active:scale-95 sm:opacity-0 group-hover:opacity-100"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next product image"
                    className="absolute right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200/80 bg-white/90 text-gray-700 opacity-80 backdrop-blur-md shadow-sm transition hover:opacity-100 hover:scale-105 active:scale-95 sm:opacity-0 group-hover:opacity-100"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Hover Zoom Hint Overlay */}
              <div className="hidden sm:block absolute bottom-3 right-3 z-10 rounded-lg bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-semibold text-white/90 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Hover to zoom • Click for full screen
              </div>
            </div>

            {/* 2. Thumbnail Strip Navigation (Shows 3-4 images with active ring & hover state) */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1 pt-0.5">
                {images.map((img, idx) => (
                  <button
                    key={`thumb-${idx}`}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    aria-label={`Select product image ${idx + 1}`}
                    className={`relative aspect-square w-16 sm:w-20 shrink-0 overflow-hidden rounded-2xl border p-1.5 bg-[#F6F7F9] transition-all duration-200 cursor-pointer ${selectedImage === idx
                      ? 'border-gray-950 ring-2 ring-gray-950/20 shadow-xs'
                      : 'border-gray-200 hover:border-gray-400 hover:scale-102 opacity-80 hover:opacity-100'
                      }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-contain mix-blend-multiply"
                    />
                    {selectedImage === idx && (
                      <span className="absolute bottom-1 right-1 flex h-1.5 w-1.5 rounded-full bg-gray-950" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* 3. Luxury Trust Assurances Under Gallery */}
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-gray-200/80 bg-white p-3.5 text-center shadow-2xs">
              <div className="flex flex-col items-center justify-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-1">
                  ✓
                </span>
                <p className="text-[11px] font-bold text-gray-900">100% Genuine</p>
                <p className="text-[9.5px] text-gray-500">Official Warranty</p>
              </div>
              <div className="flex flex-col items-center justify-center border-x border-gray-100 px-1">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-[#B89758] text-xs font-bold mb-1">
                  🚚
                </span>
                <p className="text-[11px] font-bold text-gray-900">Express Air</p>
                <p className="text-[9.5px] text-gray-500">Free &ge; ₹2,000</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1">
                  🛡️
                </span>
                <p className="text-[11px] font-bold text-gray-900">7-Day Returns</p>
                <p className="text-[9.5px] text-gray-500">Tamper-Proof Pack</p>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: PRODUCT INFO & BUY BOX (6 Cols) ================= */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-start rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-7 shadow-xs space-y-4">

            {/* Brand, Category & SKU Pill */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B89758]">
                  {product.brand}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-medium text-gray-500">
                  {product.category}
                </span>
              </div>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-mono font-medium text-gray-600 border border-gray-200/70">
                SKU: {currentSku}
              </span>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-950 leading-tight">
                {product.name}
              </h1>

              {/* Star Rating & Verified Review Count */}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                  <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <span>★</span>
                    <span>{product.rating || 4.8}</span>
                  </span>
                  <span className="text-gray-400 font-normal">
                    ({reviews.length} {reviews.length === 1 ? 'Customer Review' : 'Customer Reviews'})
                  </span>
                </div>

                <span className="text-gray-300">•</span>

                {/* Live Stock Availability Badge */}
                {isOutOfStock ? (
                  <span className="rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10.5px] font-bold text-rose-700">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10.5px] font-bold text-amber-800 animate-pulse">
                    Only {currentStock} left in stock - order soon
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-800">
                    In Stock ({currentStock} available)
                  </span>
                )}
              </div>
            </div>

            {/* Dynamic Price Display Box */}
            <div className="rounded-2xl bg-[#F8F9FA] border border-gray-200/90 p-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 tabular-nums">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>

                {currentOldPrice && (
                  <span className="text-sm sm:text-base text-gray-400 line-through tabular-nums">
                    ₹{currentOldPrice.toLocaleString('en-IN')}
                  </span>
                )}

                {savings > 0 && (
                  <span className="rounded-full bg-emerald-100 border border-emerald-200/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                    Save ₹{savings.toLocaleString('en-IN')} ({discount}%)
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-gray-500 flex items-center gap-1.5">
                <span>Inclusive of all GST & taxes</span>
                <span>•</span>
                <span className="font-semibold text-emerald-700">
                  {currentPrice >= 2000 ? 'Free Express Delivery Unlocked' : 'Express Delivery Available'}
                </span>
              </p>
            </div>

            {/* Short Narrative Description */}
            <p className="text-xs sm:text-sm leading-relaxed text-gray-600">
              {product.description}
            </p>

            {/* Validation Notice Alert */}
            {validationError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 flex items-center gap-2">
                <span>⚠️</span>
                <span>{validationError}</span>
              </div>
            )}

            {/* ================= VARIATION 1: COLOR SWATCHES ================= */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-gray-700 text-[11px]">
                    Color / Finish:
                  </span>
                  <span className="font-bold text-gray-950 text-xs">
                    {selectedColor || 'Please select'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color;
                    const hexCode = getColorHex(color);

                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          setSelectedColor(color);
                          setValidationError('');
                        }}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer ${isSelected
                          ? 'border-gray-950 bg-gray-950 text-white shadow-xs'
                          : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50'
                          }`}
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-black/10 shrink-0 shadow-2xs"
                          style={{ backgroundColor: hexCode }}
                        />
                        <span>{color}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= VARIATION 2: SIZE / EDITION / STORAGE / STRAP ================= */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-gray-700 text-[11px]">
                    {getVariantLabel(product.category)}:
                  </span>
                  <span className="font-bold text-gray-950 text-xs">
                    {selectedVariant || 'Please select'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant === v;
                    const optDetail = product.variantDetails?.[v];
                    const optStock = optDetail?.stock !== undefined ? optDetail.stock : 10;
                    const optModifier = optDetail?.priceModifier || 0;
                    const isOptOutOfStock = optStock <= 0;

                    return (
                      <button
                        key={v}
                        type="button"
                        disabled={isOptOutOfStock}
                        onClick={() => {
                          setSelectedVariant(v);
                          setValidationError('');
                        }}
                        className={`relative rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-150 cursor-pointer ${isSelected
                          ? 'border-gray-950 bg-gray-950 text-white shadow-xs'
                          : isOptOutOfStock
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                            : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{v}</span>
                          {optModifier !== 0 && (
                            <span
                              className={`text-[10px] rounded-md px-1.5 py-0.2 ${isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                              {optModifier > 0 ? `+₹${optModifier.toLocaleString('en-IN')}` : `-₹${Math.abs(optModifier).toLocaleString('en-IN')}`}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= QUANTITY & ACTION BUTTONS ================= */}
            <div className="space-y-3.5 border-t border-gray-100 pt-4">

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Quantity:</span>

                <div className="flex items-center rounded-full border border-gray-200 bg-[#F6F7F9] p-0.5">
                  <button
                    type="button"
                    disabled={quantity <= 1 || isOutOfStock}
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-gray-700 hover:bg-white hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-9 text-center text-xs font-bold text-gray-950 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={quantity >= currentStock || isOutOfStock}
                    onClick={() => setQuantity((prev) => Math.min(currentStock, prev + 1))}
                    aria-label="Increase quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-gray-700 hover:bg-white hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Bag & Buy Now */}
              <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 pt-1">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="w-full rounded-full border border-gray-300 bg-white py-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-900 shadow-2xs transition-all hover:bg-gray-100 hover:border-gray-400 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  <BagIcon className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
                </button>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="w-full rounded-full bg-[#111827] py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-black active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 border border-gray-950"
                >
                  <span>{isOutOfStock ? 'Notify Me' : 'Buy Now'}</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* ================= PINCODE EXPRESS DELIVERY CHECKER ================= */}
            <div className="rounded-2xl border border-gray-200/80 bg-[#FAFAFB] p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <TruckIcon className="w-4 h-4 text-[#B89758]" />
                <span>Estimate Delivery to Your Location</span>
              </div>

              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit PIN code (e.g. 400001)"
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-900"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#111827] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition cursor-pointer"
                >
                  Check
                </button>
              </form>

              {deliveryEstimate && (
                <div
                  className={`mt-2 rounded-xl p-2.5 text-xs font-medium ${deliveryEstimate.valid
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                >
                  {deliveryEstimate.valid ? (
                    <div>
                      <p className="font-bold">
                        🚚 Express delivery to PIN {deliveryEstimate.pin} by <strong>{deliveryEstimate.date}</strong>
                      </p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        {deliveryEstimate.freeShipping ? '✓ Free Express Air Delivery' : '✓ Standard Delivery Available'} • Cash on Delivery Available
                      </p>
                    </div>
                  ) : (
                    <p>{deliveryEstimate.message}</p>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* ================= BOTTOM TABBED INFORMATION AREA ================= */}
        <section className="mt-10 sm:mt-14 rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-8 shadow-xs">

          {/* Tab Selection Header */}
          <div className="flex border-b border-gray-200 gap-4 sm:gap-6 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeTab === 'specs'
                ? 'border-b-2 border-[#111827] text-gray-950 font-extrabold'
                : 'text-gray-400 hover:text-gray-950'
                }`}
            >
              Technical Specifications
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('highlights')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeTab === 'highlights'
                ? 'border-b-2 border-[#111827] text-gray-950 font-extrabold'
                : 'text-gray-400 hover:text-gray-950'
                }`}
            >
              Highlights & Craftsmanship
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeTab === 'reviews'
                ? 'border-b-2 border-[#111827] text-gray-950 font-extrabold'
                : 'text-gray-400 hover:text-gray-950'
                }`}
            >
              Customer Reviews ({reviews.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('delivery')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeTab === 'delivery'
                ? 'border-b-2 border-[#111827] text-gray-950 font-extrabold'
                : 'text-gray-400 hover:text-gray-950'
                }`}
            >
              Authenticity & Shipping Terms
            </button>
          </div>

          <div className="mt-6">

            {/* TAB 1: SPECIFICATIONS */}
            {activeTab === 'specs' && (
              <div className="grid gap-4 sm:gap-8 md:grid-cols-2 animate-fade-in">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">General Information</h3>
                  <div className="flex justify-between border-b border-gray-100 py-2 text-xs">
                    <span className="text-gray-500">Brand Manufacturer</span>
                    <span className="font-semibold text-gray-950">{product.brand}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-2 text-xs">
                    <span className="text-gray-500">Category & Department</span>
                    <span className="font-semibold text-gray-950">{product.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-2 text-xs">
                    <span className="text-gray-500">Subcategory</span>
                    <span className="font-semibold text-gray-950">{product.subcategory || product.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-2 text-xs">
                    <span className="text-gray-500">SKU Code</span>
                    <span className="font-mono font-semibold text-gray-950">{currentSku}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-2 text-xs">
                    <span className="text-gray-500">Authorized Boutique Vendor</span>
                    <span className="font-semibold text-gray-950">{product.supplier || 'Krishna Luxury Accessories'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Product Attributes & Specs</h3>
                  {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-gray-100 py-2 text-xs gap-3">
                      <span className="text-gray-500 shrink-0">{key}</span>
                      <span className="font-semibold text-gray-950 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: HIGHLIGHTS & CRAFTSMANSHIP */}
            {activeTab === 'highlights' && (
              <div className="space-y-6 animate-fade-in text-xs sm:text-sm">
                <div>
                  <h3 className="font-bold text-gray-950 mb-2">Curated Key Highlights</h3>
                  <ul className="grid gap-2.5 sm:grid-cols-2">
                    {(product.highlights || [
                      "Crafted with handpicked premium grade raw materials",
                      "Tested for precision durability and daily wear resistance",
                      "Includes official manufacturer warranty certificate",
                      "Individually inspected and authenticated before packaging"
                    ]).map((hl, i) => (
                      <li key={i} className="flex items-start gap-2.5 rounded-xl border border-gray-100 bg-[#F9F9FB] p-3">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span className="text-gray-700 font-medium">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-gray-200/80 bg-white p-5">
                  <h3 className="font-bold text-gray-950 mb-1.5">Detailed Overview</h3>
                  <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">
                    {product.description}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: CUSTOMER REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-fade-in">
                {/* Review Header Stats */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-extrabold text-gray-950 tracking-tight">
                        {product.rating || 4.8}
                      </span>
                      <div>
                        <div className="text-amber-500 text-sm font-bold">★★★★★</div>
                        <p className="text-[11px] text-gray-500">Based on {reviews.length} verified customer ratings</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(true)}
                    className="rounded-full bg-[#111827] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition shadow-xs cursor-pointer self-start sm:self-auto"
                  >
                    Write a Verified Review
                  </button>
                </div>

                {/* Reviews List */}
                <div className="divide-y divide-gray-100 space-y-4">
                  {reviews.length === 0 ? (
                    <div className="py-8 text-center text-xs text-gray-500">
                      No customer reviews yet for this product. Be the first to share your experience!
                    </div>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-gray-950">{rev.user}</span>
                            {rev.verified && (
                              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.2 text-[9px] font-bold text-emerald-800">
                                ✓ Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">{rev.date}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-amber-500 font-bold">
                            {'★'.repeat(Number(rev.rating) || 5)}{'☆'.repeat(5 - (Number(rev.rating) || 5))}
                          </span>
                          <span className="font-bold text-gray-950">{rev.title}</span>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{rev.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: SHIPPING & AUTHENTICITY */}
            {activeTab === 'delivery' && (
              <div className="grid gap-4 sm:grid-cols-3 text-xs leading-relaxed animate-fade-in">
                <div className="rounded-2xl border border-gray-100 bg-[#F9F9FB] p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-gray-950">
                    <TruckIcon className="w-4 h-4 text-[#B89758]" />
                    <span>Express Air Shipping</span>
                  </div>
                  <p className="text-gray-600">
                    Dispatched within 24 hours from our centralized temperature-controlled warehouse via BlueDart, Delhivery, or DTDC Express. Complimentary shipping applies to all orders over ₹2,000.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#F9F9FB] p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-gray-950">
                    <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                    <span>100% Certified Authentic</span>
                  </div>
                  <p className="text-gray-600">
                    Every timepiece, sneaker, bag, and gadget is vetted by certified horologists and luxury authenticators prior to dispatch with official warranty cards and tamper-evident seal tags.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#F9F9FB] p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-gray-950">
                    <BoxIcon className="w-4 h-4 text-blue-600" />
                    <span>7-Day Return Policy</span>
                  </div>
                  <p className="text-gray-600">
                    If you are not completely enchanted with your purchase, initiate an easy return within 7 days of delivery for an immediate full refund or seamless size/color exchange.
                  </p>
                </div>
              </div>
            )}

          </div>

        </section>

        {/* ================= RELATED PRODUCTS SHOWCASE ================= */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B89758]">
                  Curated Collection
                </p>
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-gray-950 mt-0.5">
                  You May Also Like
                </h2>
              </div>
              <Link
                to={`/shop?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-bold text-gray-950 hover:underline flex items-center gap-1"
              >
                <span>View All {product.category}</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={() => {
                    addToCart(p, 1, p.colors?.[0] || '', p.variants?.[0] || '');
                    setToastType('success');
                    setToastMessage(`✓ Added "${p.name}" to your bag`);
                    setTimeout(() => setToastMessage(''), 3500);
                  }}
                  onBuyNow={() => {
                    addToCart(p, 1, p.colors?.[0] || '', p.variants?.[0] || '');
                    navigate('/checkout');
                  }}
                />
              ))}
            </div>
          </section>
        )}

      </main>

      {/* ================= FULLSCREEN LIGHTBOX PREVIEW MODAL ================= */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fade-in cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-4xl w-full flex flex-col items-center justify-center"
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl font-bold p-2 cursor-pointer"
            >
              ✕
            </button>

            <img
              src={images[selectedImage] || images[0]}
              alt={product.name}
              className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl"
            />

            {images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {images.map((img, i) => (
                  <button
                    key={`lb-${i}`}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={`h-12 w-12 rounded-lg border p-1 bg-white/10 overflow-hidden cursor-pointer ${selectedImage === i ? 'border-white' : 'border-white/30 opacity-60'
                      }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= WRITE REVIEW MODAL DIALOG ================= */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B89758]">Feedback</span>
                <h3 className="text-sm font-bold text-gray-950">Write a Verified Customer Review</h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-gray-400 hover:text-gray-950 text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={reviewForm.user}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, user: e.target.value }))}
                  placeholder="e.g. Meera Patel"
                  className="w-full rounded-xl border border-gray-200 bg-[#F6F7F9] px-3.5 py-2 text-xs outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Rating *</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-gray-200 bg-[#F6F7F9] px-3.5 py-2 text-xs outline-none focus:border-gray-900 cursor-pointer font-medium"
                >
                  <option value={5}>★★★★★ (5 Stars - Exceptional Quality)</option>
                  <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                  <option value={2}>★★☆☆☆ (2 Stars - Below Expectation)</option>
                  <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Review Headline *</label>
                <input
                  type="text"
                  required
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Exquisite craftsmanship and finish"
                  className="w-full rounded-xl border border-gray-200 bg-[#F6F7F9] px-3.5 py-2 text-xs outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Detailed Review *</label>
                <textarea
                  required
                  rows={3}
                  value={reviewForm.text}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, text: e.target.value }))}
                  placeholder="Share details regarding build quality, material feel, packaging, and fit..."
                  className="w-full rounded-xl border border-gray-200 bg-[#F6F7F9] px-3.5 py-2 text-xs outline-none focus:border-gray-900 resize-none"
                />
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="flex-1 rounded-full border border-gray-200 bg-gray-100 py-2.5 font-bold text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#111827] py-2.5 font-bold uppercase tracking-wider text-white hover:bg-black transition shadow-xs cursor-pointer"
                >
                  Publish Review
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