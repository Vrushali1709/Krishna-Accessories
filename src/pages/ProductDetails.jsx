// src/pages/ProductDetails.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProducts, getProductById, getProductReviews, addProductReview, isInWishlist, toggleWishlist } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { ShieldCheckIcon, TruckIcon, StarIcon, BoxIcon, HeartIcon } from '../components/Icons';
import BrandSpinner from '../components/BrandSpinner';

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(false);

  // Write a Review modal
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
      const defaultColor = found.colors?.[0] || '';
      const defaultSize = found.sizes?.[0] || '';
      const defaultVariant = found.variants?.[0] || '';
      setSelectedColor(defaultColor);
      setSelectedSize(defaultSize);
      setSelectedVariant(defaultVariant);
      setSelectedImage(0);
      setQuantity(1);
    }
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('reviewsUpdated', refreshData);
    window.addEventListener('wishlistUpdated', () => setInWish(isInWishlist(id)));
    return () => {
      window.removeEventListener('reviewsUpdated', refreshData);
      window.removeEventListener('wishlistUpdated', () => setInWish(isInWishlist(id)));
    };
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAFB] text-gray-900">
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <div className="text-4xl font-bold text-gray-300 mb-2">404</div>
          <h1 className="text-xl font-bold text-gray-950">Product Not Found</h1>
          <p className="mt-1 text-xs text-gray-500">The product you are looking for may have been removed or updated.</p>
          <Link to="/shop" className="mt-4 rounded-full bg-[#111827] px-5 py-2 text-xs font-semibold text-white hover:bg-black transition">
            Explore All Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // 1. Resolve Multi-Angle Images List
  const baseImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image];

  // If a specific color image exists in colorMap, ensure it is integrated
  const activeColorImage = product.colorMap?.[selectedColor]?.image;
  const displayImages = useMemo(() => {
    if (activeColorImage && !baseImages.includes(activeColorImage)) {
      return [activeColorImage, ...baseImages.slice(1)];
    }
    return baseImages;
  }, [baseImages, activeColorImage]);

  const imageAngles = Array.isArray(product.imageAngles) && product.imageAngles.length === displayImages.length
    ? product.imageAngles
    : ["Front Perspective", "45° Angle Profile", "Craftsmanship & Details", "Lifestyle / In-Use"];

  // 2. Resolve Active Variation from variationMatrix
  const activeVariation = useMemo(() => {
    if (!product || !Array.isArray(product.variationMatrix) || product.variationMatrix.length === 0) {
      return null;
    }

    // Attempt best match with (color + size + variant)
    const exactMatch = product.variationMatrix.find(v => {
      const matchColor = !selectedColor || !v.color || v.color.toLowerCase() === selectedColor.toLowerCase();
      const matchSize = !selectedSize || !v.size || v.size.toLowerCase() === selectedSize.toLowerCase();
      const matchVariant = !selectedVariant || !v.variant || v.variant.toLowerCase() === selectedVariant.toLowerCase();
      return matchColor && matchSize && matchVariant;
    });

    if (exactMatch) return exactMatch;

    // Fallback match with (color + size) or (color + variant)
    const partialMatch = product.variationMatrix.find(v => {
      const matchColor = !selectedColor || !v.color || v.color.toLowerCase() === selectedColor.toLowerCase();
      const matchSizeOrVariant = (selectedSize && v.size && v.size.toLowerCase() === selectedSize.toLowerCase()) ||
        (selectedVariant && v.variant && v.variant.toLowerCase() === selectedVariant.toLowerCase());
      return matchColor && matchSizeOrVariant;
    });

    if (partialMatch) return partialMatch;

    // Fallback match with color only
    const colorMatch = product.variationMatrix.find(v => !selectedColor || !v.color || v.color.toLowerCase() === selectedColor.toLowerCase());
    return colorMatch || product.variationMatrix[0] || null;
  }, [product, selectedColor, selectedSize, selectedVariant]);

  // 3. Compute Live Dynamic Attributes
  const currentPrice = Number(activeVariation?.price !== undefined ? activeVariation.price : product.price) || 0;
  const currentOldPrice = activeVariation?.oldPrice !== undefined
    ? Number(activeVariation.oldPrice)
    : (product.oldPrice ? Number(product.oldPrice) : null);
  const currentStock = activeVariation?.stock !== undefined ? Number(activeVariation.stock) : (Number(product.stock) || 0);
  const currentSku = activeVariation?.sku || product.sku || `KA-${product.id}`;

  const discount = currentOldPrice && currentOldPrice > currentPrice
    ? Math.round(((currentOldPrice - currentPrice) / currentOldPrice) * 100)
    : (product.discount || 0);
  const savings = currentOldPrice && currentOldPrice > currentPrice ? currentOldPrice - currentPrice : 0;

  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

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

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    // If color has matching image, switch to it smoothly
    if (product.colorMap?.[color]?.image) {
      const idx = displayImages.indexOf(product.colorMap[color].image);
      if (idx !== -1) {
        setSelectedImage(idx);
      } else {
        setSelectedImage(0);
      }
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const chosenSpec = selectedSize || selectedVariant || '';
    const variationMeta = {
      price: currentPrice,
      oldPrice: currentOldPrice,
      sku: currentSku,
      image: displayImages[selectedImage] || displayImages[0],
      stock: currentStock
    };

    addToCart(product, quantity, selectedColor, chosenSpec, variationMeta);
    setToastMessage(`✓ Added ${quantity} × "${product.name}" (${[selectedColor, chosenSpec].filter(Boolean).join(' / ')}) to your bag`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const chosenSpec = selectedSize || selectedVariant || '';
    const variationMeta = {
      price: currentPrice,
      oldPrice: currentOldPrice,
      sku: currentSku,
      image: displayImages[selectedImage] || displayImages[0],
      stock: currentStock
    };

    addToCart(product, quantity, selectedColor, chosenSpec, variationMeta);
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

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const relatedProducts = getProducts()
    .filter(p => p.category === product.category && Number(p.id) !== Number(product.id))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900">
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-900 shadow-xl animate-slide-up">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">✓</span>
          <span>{toastMessage}</span>
          <Link to="/cart" className="ml-1.5 rounded-full bg-[#111827] px-3 py-0.5 text-[10.5px] font-semibold text-white hover:bg-black transition">
            View Bag
          </Link>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-2 text-xs text-gray-500 flex items-center gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link to="/" className="hover:text-black shrink-0">Home</Link>
          <span className="text-gray-300 shrink-0">/</span>
          <Link to="/shop" className="hover:text-black shrink-0">Catalog</Link>
          <span className="text-gray-300 shrink-0">/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-black font-medium text-gray-700 shrink-0">
            {product.category}
          </Link>
          <span className="text-gray-300 shrink-0">/</span>
          <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Product Showcase Stage */}
      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-5 sm:py-8">

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-10 items-start">

          {/* LEFT COLUMN: Multi-Angle Interactive Gallery */}
          <div className="space-y-3">

            {/* Main Stage Image Frame */}
            <div className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-200/80 bg-[#F4F4F6] p-4 sm:p-6 flex items-center justify-center shadow-2xs">

              {/* Discount Badge */}
              {discount > 0 && (
                <span className="absolute left-3 top-3 z-10 rounded-full bg-[#0F172A] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  {discount}% OFF
                </span>
              )}

              {/* Multi-Angle Badge Indicator */}
              <div className="absolute left-3 bottom-3 z-10 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-gray-800 border border-gray-200/70 shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                <span>{imageAngles[selectedImage] || `Angle ${selectedImage + 1}`} ({selectedImage + 1}/{displayImages.length})</span>
              </div>

              {/* Lightbox Trigger & Wishlist Action */}
              <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-600 shadow-2xs transition hover:scale-105 hover:text-black"
                  title="View full-screen multi-angle gallery"
                >
                  <span className="text-xs">⛶</span>
                </button>
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white/95 shadow-2xs transition hover:scale-105 ${inWish ? 'text-rose-500 border-rose-200 bg-rose-50/80' : 'text-gray-500 hover:text-black'
                    }`}
                  title={inWish ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <HeartIcon className="w-4 h-4" filled={inWish} />
                </button>
              </div>

              {/* Stage Navigation Arrows */}
              {displayImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Previous angle"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md border border-gray-200/80 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 cursor-pointer"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next angle"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md border border-gray-200/80 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 cursor-pointer"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Main Photo with smooth cursor inspection */}
              <img
                key={`${selectedImage}-${displayImages[selectedImage]}`}
                src={displayImages[selectedImage] || displayImages[0]}
                alt={`${product.name} - ${imageAngles[selectedImage] || 'Angle'}`}
                onClick={() => setLightboxOpen(true)}
                className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 ease-out hover:scale-105 cursor-zoom-in"
              />
            </div>

            {/* 3–4 Multi-Angle Thumbnail Strip */}
            {displayImages.length > 1 && (
              <div>
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-gray-500">
                    Product Perspectives & Angles ({displayImages.length} Shots)
                  </span>
                  <span className="text-[10px] text-gray-400">Click to switch angle</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {displayImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(idx)}
                      className={`group relative aspect-square overflow-hidden rounded-xl border p-1.5 bg-[#F4F4F6] transition-all text-left ${selectedImage === idx
                        ? 'border-gray-950 ring-2 ring-gray-950/20 bg-white shadow-xs'
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-100'
                        }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                      <span className="absolute inset-x-0 bottom-0 bg-gray-950/80 backdrop-blur-xs py-0.5 text-[8.5px] font-medium text-white text-center truncate px-1 opacity-0 group-hover:opacity-100 transition">
                        {imageAngles[idx] || `Angle ${idx + 1}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trust Assurances Under Gallery */}
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-gray-200/80 bg-white p-3 text-center shadow-2xs">
              <div>
                <span className="text-emerald-600 text-sm font-bold">✓</span>
                <p className="text-[11px] font-bold text-gray-900 mt-0.5">100% Genuine</p>
                <p className="text-[9.5px] text-gray-500 truncate">Official Warranty</p>
              </div>
              <div className="border-x border-gray-100">
                <span className="text-gray-900 text-sm font-bold">🚚</span>
                <p className="text-[11px] font-bold text-gray-900 mt-0.5">Free Express</p>
                <p className="text-[9.5px] text-gray-500 truncate">&ge; ₹2,000 Total</p>
              </div>
              <div>
                <span className="text-gray-900 text-sm font-bold">🛡️</span>
                <p className="text-[11px] font-bold text-gray-900 mt-0.5">Insured Transit</p>
                <p className="text-[9.5px] text-gray-500 truncate">Pan-India Support</p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Product Information & Dynamic Variations Buy Box */}
          <div className="flex flex-col justify-start rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-6 shadow-xs space-y-4">

            {/* Header: Brand, SKU & Category */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B89758]">
                  {product.brand}
                </span>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-mono text-gray-600 border border-gray-200">
                  SKU: {currentSku}
                </span>
              </div>

              <h1 className="mt-1.5 text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
                {product.name}
              </h1>

              {/* Rating & Stock Status Row */}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1 font-semibold text-gray-900 text-xs">
                  <span className="text-amber-500">★ {product.rating || 4.8}</span>
                  <span className="text-gray-400 font-normal">({reviews.length} Verified Reviews)</span>
                </div>
                <span className="text-gray-300">&bull;</span>
                <span className="text-gray-500 text-xs">Category: <strong className="text-gray-900">{product.category}</strong></span>
                <span className="text-gray-300">&bull;</span>

                {isOutOfStock ? (
                  <span className="text-rose-700 font-semibold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full text-[10px]">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="text-amber-800 font-bold bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full text-[10px] animate-pulse">
                    ⚡ Only {currentStock} Left!
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
                    In Stock ({currentStock} units)
                  </span>
                )}
              </div>
            </div>

            {/* Dynamic Price Box */}
            <div className="rounded-xl bg-[#F8F9FA] border border-gray-200 p-3.5 sm:p-4 transition-all">
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight">
                  ₹{Number(currentPrice).toLocaleString('en-IN')}
                </span>
                {currentOldPrice && currentOldPrice > currentPrice && (
                  <span className="text-sm text-gray-400 line-through font-medium">
                    ₹{Number(currentOldPrice).toLocaleString('en-IN')}
                  </span>
                )}
                {savings > 0 && (
                  <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                    Save ₹{savings.toLocaleString('en-IN')} ({discount}%)
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                Inclusive of all Taxes & GST &bull; Insured Priority Delivery across India
              </p>
            </div>

            {/* Short Description */}
            <p className="text-xs leading-relaxed text-gray-600">
              {product.description}
            </p>

            {/* PRODUCT VARIATIONS SECTION */}
            <div className="space-y-3.5 border-t border-b border-gray-100 py-3.5">

              {/* 1. COLOR VARIATION (With Visual Color Dots & Image Sync) */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                      Select Colorway / Finish:
                    </span>
                    <span className="text-xs font-semibold text-gray-950">{selectedColor}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => {
                      const hexCode = product.colorMap?.[color]?.hex || '#1F2937';
                      const isSelected = selectedColor === color;

                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleColorSelect(color)}
                          className={`group relative flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${isSelected
                            ? 'border-gray-950 bg-gray-950 text-white shadow-xs'
                            : 'border-gray-200 bg-[#F4F4F6] text-gray-800 hover:border-gray-400 hover:bg-gray-100'
                            }`}
                        >
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-black/10 shrink-0 shadow-2xs"
                            style={{ backgroundColor: hexCode }}
                          />
                          <span>{color}</span>
                          {isSelected && <span className="text-[10px] text-white">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. SIZE / STORAGE / DIMENSION VARIATION */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                      Select Size / Capacity:
                    </span>
                    <span className="text-xs font-semibold text-gray-950">{selectedSize}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      // Find matrix item for this size to determine pricing delta
                      const match = product.variationMatrix?.find(v =>
                        (!selectedColor || !v.color || v.color.toLowerCase() === selectedColor.toLowerCase()) &&
                        (v.size && v.size.toLowerCase() === size.toLowerCase())
                      );
                      const sizePrice = match ? match.price : product.price;
                      const priceDiff = sizePrice - product.price;

                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${isSelected
                            ? 'border-gray-950 bg-[#0F172A] text-white shadow-xs ring-1 ring-gray-950'
                            : 'border-gray-200 bg-[#F4F4F6] text-gray-800 hover:border-gray-400 hover:bg-gray-100'
                            }`}
                        >
                          <span>{size}</span>
                          {priceDiff > 0 && (
                            <span className={`text-[10px] font-mono px-1 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                              +₹{priceDiff.toLocaleString('en-IN')}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. SECONDARY VARIATION (e.g. Strap / Material / Edition) */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                      Select Edition / Strap / Switch:
                    </span>
                    <span className="text-xs font-semibold text-gray-950">{selectedVariant}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant === v;
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${isSelected
                            ? 'border-gray-950 bg-[#0F172A] text-white shadow-xs'
                            : 'border-gray-200 bg-[#F4F4F6] text-gray-800 hover:border-gray-400 hover:bg-gray-100'
                            }`}
                        >
                          {v}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Live Configuration Summary Banner */}
              <div className="rounded-xl bg-gray-50 border border-gray-200/80 p-2.5 text-xs flex items-center justify-between gap-2 text-gray-700">
                <div className="truncate">
                  <span className="font-semibold text-gray-900">Selected Configuration: </span>
                  <span className="text-gray-600">
                    {[selectedColor, selectedSize, selectedVariant].filter(Boolean).join(' • ')}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">
                  {isOutOfStock ? 'Sold Out' : 'Available'}
                </span>
              </div>

            </div>

            {/* Quantity Stepper & Buy Action Buttons */}
            <div className="space-y-3 pt-1">

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-gray-700">Quantity:</span>
                  <div className="flex items-center rounded-full border border-gray-200 bg-[#F4F4F6]">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-7 w-7 items-center justify-center text-xs font-bold text-gray-700 hover:text-black transition disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-xs font-semibold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= currentStock}
                      onClick={() => setQuantity(Math.min(currentStock || 10, quantity + 1))}
                      className="flex h-7 w-7 items-center justify-center text-xs font-bold text-gray-700 hover:text-black transition disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                <span className="text-[11px] text-gray-400 font-mono">
                  Max: {currentStock} units
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 pt-1">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`rounded-full border py-3 text-center text-xs font-bold uppercase tracking-wider transition active:scale-98 cursor-pointer ${isOutOfStock
                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 bg-[#F4F4F6] text-gray-900 hover:bg-gray-200'
                    }`}
                >
                  {isOutOfStock ? 'Out of Stock' : '+ Add to Bag'}
                </button>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className={`rounded-full py-3 text-center text-xs font-bold uppercase tracking-wider text-white transition shadow-xs border active:scale-98 cursor-pointer ${isOutOfStock
                    ? 'bg-gray-400 border-gray-400 cursor-not-allowed'
                    : 'bg-[#111827] border-gray-900 hover:bg-black'
                    }`}
                >
                  {isOutOfStock ? 'Unavailable' : 'Buy Now'}
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Tabbed Specifications, Reviews & Delivery */}
        <section className="mt-8 sm:mt-10 rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-6 shadow-xs">

          <div className="flex border-b border-gray-200 gap-3 sm:gap-4 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${activeTab === 'specs'
                ? 'border-b-2 border-[#111827] text-gray-950'
                : 'text-gray-400 hover:text-black'
                }`}
            >
              Specifications & Variations
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${activeTab === 'reviews'
                ? 'border-b-2 border-[#111827] text-gray-950'
                : 'text-gray-400 hover:text-black'
                }`}
            >
              Customer Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${activeTab === 'delivery'
                ? 'border-b-2 border-[#111827] text-gray-950'
                : 'text-gray-400 hover:text-black'
                }`}
            >
              Shipping & Authenticity
            </button>
          </div>

          <div className="mt-4">
            {/* Specs Tab */}
            {activeTab === 'specs' && (
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 animate-fade-in">
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex justify-between border-b border-gray-100 py-1.5 text-xs gap-2">
                    <span className="text-gray-500">Brand</span>
                    <span className="font-semibold text-gray-900">{product.brand}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-1.5 text-xs gap-2">
                    <span className="text-gray-500">Category</span>
                    <span className="font-semibold text-gray-900">{product.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-1.5 text-xs gap-2">
                    <span className="text-gray-500">Active SKU Code</span>
                    <span className="font-mono font-semibold text-gray-900">{currentSku}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-1.5 text-xs gap-2">
                    <span className="text-gray-500">Selected Color</span>
                    <span className="font-semibold text-gray-900">{selectedColor || 'Default'}</span>
                  </div>
                  {selectedSize && (
                    <div className="flex justify-between border-b border-gray-100 py-1.5 text-xs gap-2">
                      <span className="text-gray-500">Selected Size / Capacity</span>
                      <span className="font-semibold text-gray-900">{selectedSize}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-gray-100 py-1.5 text-xs gap-2">
                    <span className="text-gray-500">Authorized Vendor</span>
                    <span className="font-semibold text-gray-900">{product.supplier || 'Krishna Boutique India'}</span>
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-gray-100 py-1.5 text-xs gap-2">
                      <span className="text-gray-500">{key}</span>
                      <span className="font-semibold text-gray-900 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-bold text-gray-950">{product.rating || 4.8}</span>
                      <span className="text-amber-500 text-base">★★★★★</span>
                      <span className="text-xs text-gray-500">({reviews.length} verified reviews)</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(true)}
                    className="rounded-full bg-[#111827] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black transition cursor-pointer"
                  >
                    Write a Review
                  </button>
                </div>

                {/* Review List */}
                <div className="divide-y divide-gray-100 space-y-3">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-gray-500 py-3">No reviews yet for this product. Be the first to share your experience!</p>
                  ) : (
                    reviews.map(rev => (
                      <div key={rev.id} className="pt-3 first:pt-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-gray-900">{rev.user}</span>
                            {rev.verified && (
                              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 text-[8.5px] font-bold text-emerald-800">
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[9.5px] text-gray-400 font-mono">{rev.date}</span>
                        </div>

                        <div className="flex items-center gap-1 text-amber-500 text-xs">
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
              <div className="space-y-2 text-xs text-gray-700 leading-relaxed animate-fade-in">
                <p>📦 <strong>Express Shipping:</strong> Orders are dispatched within 24 hours via BlueDart or Delhivery. Complimentary express delivery applies to orders above ₹2,000.</p>
                <p>🔄 <strong>7-Day Returns:</strong> If you are not completely satisfied, return unopened goods in original pristine packaging with tags intact for an immediate refund.</p>
                <p>🛡️ <strong>Certified Authentic Guarantee:</strong> Every item is verified by our boutique inspection specialists prior to dispatch with official warranty certificates.</p>
              </div>
            )}
          </div>

        </section>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <section className="mt-8 sm:mt-10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-gray-400">You May Also Like</p>
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-gray-950">Similar Curated Items</h3>
              </div>
              <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="text-xs font-semibold text-gray-900 hover:underline">
                View All {product.category} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3.5 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={() => addToCart(p, 1, p.colors?.[0] || '', p.sizes?.[0] || p.variants?.[0] || '')}
                  onBuyNow={() => {
                    addToCart(p, 1, p.colors?.[0] || '', p.sizes?.[0] || p.variants?.[0] || '');
                    navigate('/checkout');
                  }}
                />
              ))}
            </div>
          </section>
        )}

      </main>

      {/* FULL-SCREEN MULTI-ANGLE LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fade-in">
          <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
            <button
              type="button"
              onClick={() => setLightboxZoom(!lightboxZoom)}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/20 transition cursor-pointer"
            >
              {lightboxZoom ? 'Zoom Out' : 'Zoom 2x'}
            </button>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer text-base font-bold"
            >
              ✕
            </button>
          </div>

          <div className="relative flex-1 w-full max-w-4xl flex items-center justify-center overflow-hidden p-4">
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition text-lg"
            >
              ‹
            </button>

            <img
              src={displayImages[selectedImage] || displayImages[0]}
              alt={product.name}
              className={`max-h-[75vh] max-w-full object-contain transition-transform duration-300 ${lightboxZoom ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                }`}
              onClick={() => setLightboxZoom(!lightboxZoom)}
            />

            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition text-lg"
            >
              ›
            </button>
          </div>

          <div className="flex items-center gap-2 pb-4 overflow-x-auto max-w-md">
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(idx)}
                className={`h-14 w-14 shrink-0 rounded-lg overflow-hidden border p-1 bg-white/10 transition ${selectedImage === idx ? 'border-white ring-2 ring-white/50' : 'border-white/20 hover:border-white/60'
                  }`}
              >
                <img src={img} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
              <h3 className="text-xs font-bold text-gray-950 uppercase tracking-wider">Write a Verified Review</h3>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-gray-400 hover:text-black font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-2.5 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-0.5">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={reviewForm.user}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, user: e.target.value }))}
                  placeholder="e.g. Anand Verma"
                  className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-3 py-1.5 outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-0.5">Rating *</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-3 py-1.5 outline-none focus:border-gray-400 cursor-pointer"
                >
                  <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                  <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                  <option value={2}>★★☆☆☆ (2 Stars - Below Expectations)</option>
                  <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-0.5">Review Headline *</label>
                <input
                  type="text"
                  required
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Masterpiece craftsmanship"
                  className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-3 py-1.5 outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-0.5">Detailed Review *</label>
                <textarea
                  required
                  rows={3}
                  value={reviewForm.text}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Share details on build quality, packaging, and design..."
                  className="w-full rounded-lg border border-gray-200 bg-[#F4F4F6] px-3 py-1.5 outline-none focus:border-gray-400"
                />
              </div>

              <div className="pt-1.5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="flex-1 rounded-full border border-gray-200 bg-gray-100 py-2 font-semibold text-gray-700 hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#111827] py-2 font-semibold uppercase tracking-wider text-white hover:bg-black cursor-pointer"
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