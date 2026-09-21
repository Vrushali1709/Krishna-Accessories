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
  syncProductReviewsFromBackend
} from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Heart,
  ShoppingBag,
  ArrowRight,
  Maximize2,
  Plus,
  Minus,
  Sparkles,
  Award,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Clock,
  Package,
  Ruler
} from 'lucide-react';

// =========================================================================
// CUSTOM ANIMATION HOOK: Intersection Observer for on-scroll reveals
// =========================================================================
function useInView(options = { threshold: 0.1, triggerOnce: true }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (options.triggerOnce) {
          observer.unobserve(entry.target);
        }
      }
    }, options);

    const currentElem = ref.current;
    if (currentElem) observer.observe(currentElem);

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [options.threshold, options.triggerOnce]);

  return [ref, inView];
}

function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  threshold = 0.08
}) {
  const [ref, inView] = useInView({ threshold, triggerOnce: true });

  const getTransform = () => {
    if (inView) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 24px, 0)';
      case 'down':
        return 'translate3d(0, -24px, 0)';
      case 'left':
        return 'translate3d(24px, 0, 0)';
      case 'right':
        return 'translate3d(-24px, 0, 0)';
      case 'zoom':
        return 'scale(0.97)';
      default:
        return 'translate3d(0, 20px, 0)';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
}

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

  // Modals
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
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
    }
  };

  useEffect(() => {
    refreshData();
    syncProductReviewsFromBackend(id);
    window.addEventListener('reviewsUpdated', refreshData);
    window.addEventListener('wishlistUpdated', () => setInWish(isInWishlist(id)));
    return () => {
      window.removeEventListener('reviewsUpdated', refreshData);
      window.removeEventListener('wishlistUpdated', () => setInWish(isInWishlist(id)));
    };
  }, [id]);

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
          <h1 className="font-serif text-2xl font-medium text-neutral-950">Piece Not Located</h1>
          <p className="mt-1 text-xs text-neutral-500">The product you are looking for may have been archived or updated.</p>
          <Link
            to="/shop"
            className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#8C6734] transition-colors"
          >
            <span>Explore Complete Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const variantDelta = (product.variantPriceDeltas && selectedVariant && product.variantPriceDeltas[selectedVariant])
    ? Number(product.variantPriceDeltas[selectedVariant])
    : 0;

  const basePrice = Number(product.price) || 0;
  const effectivePrice = Math.max(0, basePrice + variantDelta);
  const effectiveOldPrice = product.oldPrice ? Number(product.oldPrice) + variantDelta : null;
  const discount = effectiveOldPrice && effectiveOldPrice > effectivePrice
    ? Math.round(((effectiveOldPrice - effectivePrice) / effectiveOldPrice) * 100)
    : (product.discount || 0);

  const dynamicSku = `${product.sku || `KA-${product.id}`}${selectedColor ? `-${selectedColor.slice(0, 3).toUpperCase()}` : ''}${selectedSize ? `-${selectedSize.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase()}` : ''}`;

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
    setToastMessage(`✓ Added ${quantity} × "${product.name}" to your bag`);
    setTimeout(() => setToastMessage(''), 3500);
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
    const user = getCurrentUser();
    if (!user) {
      navigate('/login', {
        state: {
          from: location.pathname,
          message: 'Please sign in to save pieces to your wishlist.',
          requiredRole: 'customer'
        }
      });
      return;
    }
    const active = toggleWishlist(product);
    setInWish(active);
    setToastMessage(active ? `✓ Added "${product.name}" to wishlist` : `Removed "${product.name}" from wishlist`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.user.trim() || !reviewForm.text.trim()) return;

    await addProductReview(product.id, {
      user: reviewForm.user.trim(),
      rating: Number(reviewForm.rating),
      title: reviewForm.title.trim(),
      text: reviewForm.text.trim()
    });

    setReviewForm({ user: '', rating: 5, title: '', text: '' });
    setReviewModalOpen(false);
    refreshData();
  };

  const allProducts = getProducts();
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-neutral-200 bg-white/95 backdrop-blur-md px-4 py-3.5 text-xs font-semibold shadow-2xl animate-fade-in">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5F2EB] text-[#8C6734] border border-[#C5A880]/40 text-[11px] font-bold">
            ✓
          </span>
          <span className="text-neutral-800">{toastMessage}</span>
          <Link
            to="/cart"
            className="ml-2 rounded-md bg-neutral-950 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#C5A880] hover:text-white hover:bg-neutral-800 transition-colors"
          >
            View Bag
          </Link>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. BREADCRUMBS BAR                                                        */}
      {/* ========================================================================= */}
      <div className="border-b border-neutral-200/80 bg-white py-3.5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2 truncate font-medium">
            <Link to="/" className="hover:text-neutral-950 transition">Home</Link>
            <span>/</span>
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-neutral-950 transition">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-semibold truncate">{product.name}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <span className="text-[10.5px] font-mono text-neutral-500 font-semibold bg-[#FAFAFB] px-2.5 py-0.5 rounded border border-neutral-200">
              SKU: {dynamicSku}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PRODUCT MAIN SHOWCASE: GALLERY (LEFT) + DETAILS (RIGHT)                */}
      {/* ========================================================================= */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 items-start">

          {/* Left 6 Cols: Product Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <Reveal delay={0} direction="up">
              <div className="relative aspect-square w-full rounded-2xl bg-white border border-neutral-200/80 p-6 flex items-center justify-center overflow-hidden shadow-sm group">
                <img
                  src={images[selectedImage] || product.image}
                  alt={product.name}
                  className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  {discount > 0 && (
                    <span className="rounded-md bg-neutral-950 text-[#C5A880] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                      {discount}% Privilege Savings
                    </span>
                  )}
                  {product.tag && (
                    <span className="rounded-md bg-[#F5F2EB] text-[#8C6734] border border-[#C5A880]/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                      {product.tag}
                    </span>
                  )}
                </div>

                {/* Lightbox Trigger & Wishlist Heart */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-neutral-200 text-neutral-600 hover:text-neutral-950 hover:bg-white shadow-xs transition cursor-pointer"
                    title="Zoom High-Res View"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleWishlistToggle}
                    className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md border shadow-xs transition-all cursor-pointer ${
                      inWish
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : 'bg-white/90 text-neutral-600 border-neutral-200 hover:text-rose-600 hover:bg-white'
                    }`}
                    title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className="w-4 h-4" fill={inWish ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <Reveal delay={50} direction="up">
                <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(idx)}
                      className={`h-20 w-20 rounded-xl bg-white p-2 border transition-all shrink-0 cursor-pointer ${
                        selectedImage === idx
                          ? 'border-neutral-950 ring-2 ring-[#C5A880]/40 shadow-xs'
                          : 'border-neutral-200/80 hover:border-neutral-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-contain" />
                    </button>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* Right 6 Cols: Product Details & Buying Actions */}
          <div className="lg:col-span-6 space-y-6">
            <Reveal delay={50} direction="up">
              <div className="space-y-4">
                
                {/* Brand & Verification Eyebrow */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734] animate-ping" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                      {product.brand} &bull; Authentic Edition
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    In Stock &bull; Ready for Express Air Dispatch
                  </span>
                </div>

                {/* Product Title */}
                <h1 className="font-serif text-2xl sm:text-4xl font-medium tracking-tight text-neutral-950 leading-[1.2]">
                  {product.name}
                </h1>

                {/* Rating & Reviews Bar */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating || '4.8'}</span>
                  </div>
                  <span className="text-neutral-300">&bull;</span>
                  <a href="#reviews" onClick={() => setActiveTab('reviews')} className="text-neutral-600 hover:text-[#8C6734] hover:underline font-medium">
                    {reviews.length} Verified Client {reviews.length === 1 ? 'Review' : 'Reviews'}
                  </a>
                  <span className="text-neutral-300">&bull;</span>
                  <span className="text-neutral-500">Official Brand Warranty Included</span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 pt-2 border-t border-neutral-100">
                  <span className="font-serif text-2xl sm:text-3xl font-medium text-neutral-950">
                    ₹{effectivePrice.toLocaleString('en-IN')}
                  </span>
                  {effectiveOldPrice && effectiveOldPrice > effectivePrice && (
                    <span className="text-sm sm:text-base text-neutral-400 line-through">
                      ₹{effectiveOldPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                      Save {discount}%
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed pt-1">
                  {product.description}
                </p>

                {/* Color Swatches (if available) */}
                {product.colors && product.colors.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-neutral-900">
                      <span>Color Finish: <strong className="text-[#8C6734]">{selectedColor}</strong></span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleColorSelect(color)}
                          className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                            selectedColor === color
                              ? 'border-neutral-950 bg-neutral-950 text-white shadow-2xs'
                              : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes Selector (if available) */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-neutral-900">
                      <span>Select Size: <strong className="text-[#8C6734]">{selectedSize}</strong></span>
                      <button
                        type="button"
                        onClick={() => setSizeGuideOpen(true)}
                        className="text-[#8C6734] hover:underline flex items-center gap-1 cursor-pointer font-semibold text-[11px]"
                      >
                        <Ruler className="w-3 h-3" />
                        <span>Size Guidance</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[42px] px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                            selectedSize === size
                              ? 'border-neutral-950 bg-neutral-950 text-white shadow-2xs'
                              : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variant Selector (if available) */}
                {product.variants && product.variants.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <span className="text-xs font-semibold text-neutral-900 block">
                      Edition &bull; Dial / Strap: <strong className="text-[#8C6734]">{selectedVariant}</strong>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                            selectedVariant === v
                              ? 'border-[#8C6734] bg-[#FAF8F5] text-[#8C6734] font-bold ring-1 ring-[#8C6734]'
                              : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Stepper + Add to Bag & Buy Now */}
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    {/* Stepper */}
                    <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-white p-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-md transition cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-neutral-900 min-w-[32px] text-center tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-md transition cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Add to Bag CTA */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#8C6734] transition-colors duration-200 shadow-sm cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Add to Bag</span>
                    </button>

                    {/* Buy Now CTA */}
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-md bg-[#8C6734] text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-neutral-950 transition-colors duration-200 shadow-sm cursor-pointer"
                    >
                      <span>Buy Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Trust Guarantee Cards */}
                <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-neutral-100 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-neutral-200/80">
                    <ShieldCheck className="w-4 h-4 text-[#8C6734] shrink-0" />
                    <div>
                      <span className="font-semibold text-neutral-900 block text-[11px]">100% Verified Quality</span>
                      <span className="text-[10px] text-neutral-500">Multi-point boutique inspection</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-neutral-200/80">
                    <Truck className="w-4 h-4 text-[#8C6734] shrink-0" />
                    <div>
                      <span className="font-semibold text-neutral-900 block text-[11px]">Insured Air Delivery</span>
                      <span className="text-[10px] text-neutral-500">BlueDart 24-48h metro dispatch</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-neutral-200/80">
                    <RotateCcw className="w-4 h-4 text-[#8C6734] shrink-0" />
                    <div>
                      <span className="font-semibold text-neutral-900 block text-[11px]">7-Day Replacement</span>
                      <span className="text-[10px] text-neutral-500">Doorstep reverse courier pickup</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-neutral-200/80">
                    <Award className="w-4 h-4 text-[#8C6734] shrink-0" />
                    <div>
                      <span className="font-semibold text-neutral-900 block text-[11px]">Official Brand Warranty</span>
                      <span className="text-[10px] text-neutral-500">Valid across brand centers India</span>
                    </div>
                  </div>
                </div>

              </div>
            </Reveal>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. TABBED SECTIONS: SPECIFICATIONS, REVIEWS, WARRANTY, SHIPPING            */}
        {/* ========================================================================= */}
        <div className="mt-14 pt-8 border-t border-neutral-200/80" id="reviews">
          {/* Tabs Navigation */}
          <div className="flex border-b border-neutral-200 gap-6 text-xs sm:text-sm font-semibold">
            {[
              { id: 'specs', label: 'Specifications & Details' },
              { id: 'reviews', label: `Client Reviews (${reviews.length})` },
              { id: 'warranty', label: 'Warranty & Care' },
              { id: 'shipping', label: 'Express Delivery' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-b-2 border-[#8C6734] text-neutral-950 font-bold'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pt-6">
            {/* Tab 1: Specifications */}
            {activeTab === 'specs' && (
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-4">
                <h3 className="font-serif text-lg font-medium text-neutral-950">Technical Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex justify-between border-b border-neutral-100 pb-2">
                    <span className="text-neutral-500">Brand Partner:</span>
                    <span className="font-semibold text-neutral-950">{product.brand}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 pb-2">
                    <span className="text-neutral-500">Category:</span>
                    <span className="font-semibold text-neutral-950">{product.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 pb-2">
                    <span className="text-neutral-500">Item SKU Reference:</span>
                    <span className="font-mono font-bold text-[#8C6734]">{dynamicSku}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 pb-2">
                    <span className="text-neutral-500">Warranty Term:</span>
                    <span className="font-semibold text-neutral-950">{product.warranty || '2-Year Official Brand Warranty'}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 pb-2">
                    <span className="text-neutral-500">Package Includes:</span>
                    <span className="font-semibold text-neutral-950">{product.packaging || 'Boutique Presentation Box & Certificate'}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 pb-2">
                    <span className="text-neutral-500">Country of Origin / Sourcing:</span>
                    <span className="font-semibold text-neutral-950">India / Verified Official Channel</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Reviews */}
            {activeTab === 'reviews' && (
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-neutral-950">Client Impressions &amp; Ratings</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">Real verified purchases from Krishna Accessories clients</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C6734] transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Write a Review</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((rev, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#FAFAFB] border border-neutral-200/80 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-950">{rev.user || 'Verified Client'}</span>
                            <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">Verified Purchase</span>
                          </div>
                          <div className="flex text-amber-400 text-xs">
                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        {rev.title && <h4 className="font-semibold text-neutral-900">{rev.title}</h4>}
                        <p className="text-neutral-600 leading-relaxed">{rev.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-neutral-500 text-center py-6">Be the first client to review this piece.</p>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Warranty */}
            {activeTab === 'warranty' && (
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-4 text-xs text-neutral-600 leading-relaxed">
                <h3 className="font-serif text-lg font-medium text-neutral-950">Warranty Policy &amp; Care Guidance</h3>
                <p>
                  All timepieces and electronics curated through Krishna Accessories carry valid manufacturer warranty coverage against mechanical defects and internal component faults.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Keep the provided purchase invoice and stamped warranty card safely.</li>
                  <li>For service assistance, contact any authorized brand service center nationwide or reach out to our concierge desk.</li>
                  <li>Water resistance ratings must be observed as indicated on the caseback or product documentation.</li>
                </ul>
              </div>
            )}

            {/* Tab 4: Shipping */}
            {activeTab === 'shipping' && (
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-4 text-xs text-neutral-600 leading-relaxed">
                <h3 className="font-serif text-lg font-medium text-neutral-950">Express Insured Courier Delivery</h3>
                <p>
                  All shipments are packed in tamper-evident security cartons and dispatched via air courier with insurance coverage.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#FAFAFB] border border-neutral-200">
                    <strong className="text-neutral-950 block mb-0.5">Tier 1 Metros:</strong>
                    <span>Mumbai, Delhi NCR, Bengaluru, Ahmedabad — 24 to 48 Hours.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAFAFB] border border-neutral-200">
                    <strong className="text-neutral-950 block mb-0.5">Rest of India:</strong>
                    <span>All pin codes across Gujarat &amp; nationwide — 2 to 4 Business Days.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. CONNOISSEUR RECOMMENDATIONS SECTION                                    */}
        {/* ========================================================================= */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-neutral-200/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                  Curated Pairings
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-neutral-950 mt-1">
                  You May Also Appreciate
                </h2>
              </div>
              <Link
                to={`/shop?category=${encodeURIComponent(product.category)}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6734] hover:underline uppercase tracking-wider"
              >
                <span>View More in {product.category}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct.id}
                  product={relProduct}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-2xl w-full bg-white rounded-2xl p-6 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-black text-sm font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
            <img
              src={images[selectedImage] || product.image}
              alt={product.name}
              className="max-h-[70vh] mx-auto object-contain"
            />
            <p className="mt-4 font-serif text-base font-medium text-neutral-950">{product.name}</p>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-lg font-medium text-neutral-950">Write a Verified Review</h3>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewForm.user}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, user: e.target.value }))}
                  placeholder="e.g. Rahul Patel"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-[#8C6734]"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Star Rating</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-[#8C6734]"
                >
                  <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                  <option value={4}>★★★★☆ (4 Stars - Highly Satisfied)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                  <option value={2}>★★☆☆☆ (2 Stars - Average)</option>
                  <option value={1}>★☆☆☆☆ (1 Star - Needs Improvement)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Review Headline</label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Stunning craftsmanship and fast delivery"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-[#8C6734]"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Your Feedback</label>
                <textarea
                  rows={4}
                  required
                  value={reviewForm.text}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Describe the build quality, finish, wrist comfort, or delivery experience..."
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-[#8C6734] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C6734] transition-colors cursor-pointer"
                >
                  Submit Client Review
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