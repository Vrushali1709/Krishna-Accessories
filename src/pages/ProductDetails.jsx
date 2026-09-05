// src/pages/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProducts, getProductById, getProductReviews, addProductReview, isInWishlist, toggleWishlist } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';
import { ShieldCheckIcon, TruckIcon, StarIcon, BoxIcon, HeartIcon, ArrowRightIcon } from '../components/Icons';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(() => getProductById(id));
  const [reviews, setReviews] = useState(() => getProductReviews(id));
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [toastMessage, setToastMessage] = useState('');
  const [inWish, setInWish] = useState(() => isInWishlist(id));

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
      setSelectedColor(found.colors?.[0] || '');
      setSelectedVariant(found.variants?.[0] || '');
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
      <div className="min-h-screen bg-[#FAFAF9] text-zinc-900">
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <div className="text-4xl font-bold text-zinc-300 mb-2 font-mono">404</div>
          <h1 className="text-xl font-bold text-zinc-950">Product Not Found</h1>
          <p className="mt-1 text-xs text-zinc-500">The requested timepiece or luxury accessory could not be found.</p>
          <Link to="/shop" className="mt-4 rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-black transition shadow-xs">
            Explore All Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const discount = product.discount || (product.oldPrice && product.oldPrice > product.price ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0);
  const savings = product.oldPrice && product.oldPrice > product.price ? product.oldPrice - product.price : 0;

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
    if (!requireLogin('bag')) return;
    addToCart(product, quantity, selectedColor, selectedVariant);
    setToastMessage(`✓ Added ${quantity} × "${product.name}" to your bag`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleBuyNow = () => {
    if (!requireLogin('buy')) return;
    addToCart(product, quantity, selectedColor, selectedVariant);
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
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900">
      <Navbar />

      {/* Floating Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-900 shadow-xl animate-slide-up max-w-[calc(100vw-32px)]">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs">✓</span>
          <span className="truncate">{toastMessage}</span>
          <Link to="/cart" className="ml-1 rounded-md bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-black transition shrink-0">
            View Bag
          </Link>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="border-b border-zinc-200/80 bg-white py-2.5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-[11px] text-zinc-500 flex items-center gap-2 overflow-x-auto">
          <Link to="/" className="hover:text-zinc-900">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-zinc-900">Collections</Link>
          <span>/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category || '')}`} className="hover:text-zinc-900">{product.category}</Link>
          <span>/</span>
          <span className="text-zinc-900 font-semibold truncate">{product.name}</span>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">

        {/* 2-Column Product Main Stage */}
        <div className="grid gap-10 lg:grid-cols-12 items-start">

          {/* Left Column: Gallery (Span 6) */}
          <div className="lg:col-span-6 space-y-3">
            
            {/* Main Stage Image */}
            <div className="relative aspect-square w-full rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 flex items-center justify-center shadow-xs overflow-hidden">
              {discount > 0 && (
                <span className="absolute left-4 top-4 rounded-md bg-zinc-900 px-2 py-1 text-[10px] font-bold text-white shadow-2xs">
                  {discount}% OFF
                </span>
              )}
              <span className="absolute right-4 top-4 rounded-md bg-zinc-100 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-wider text-zinc-600 border border-zinc-200/60">
                {product.category}
              </span>

              <img
                src={images[selectedImage] || product.image}
                alt={product.name}
                className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Thumbnails Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-white p-1 transition ${
                      selectedImage === idx
                        ? 'border-zinc-900 ring-2 ring-zinc-900/10 shadow-2xs'
                        : 'border-zinc-200 opacity-70 hover:opacity-100 hover:border-zinc-400'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* Right Column: Product Purchase & Specifications Stage (Span 6) */}
          <div className="lg:col-span-6 space-y-5">

            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B89035]">
                  {product.brand} &bull; SKU: {product.sku || `KA-${product.id}`}
                </span>
                
                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    inWish
                      ? 'border-rose-200 bg-rose-50 text-rose-600'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-rose-600'
                  }`}
                >
                  <span>{inWish ? '♥ Saved' : '♡ Save to Wishlist'}</span>
                </button>
              </div>

              <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-sans">
                {product.name}
              </h1>

              {/* Rating & Review Counter */}
              <div className="mt-2 flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <span>★</span>
                  <span className="text-zinc-900 font-semibold">{product.rating || 4.8}</span>
                </div>
                <span className="text-zinc-300">•</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('reviews');
                    const el = document.getElementById('product-tabs-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-zinc-600 hover:text-zinc-950 hover:underline"
                >
                  {reviews.length} Verified Reviews
                </button>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="rounded-xl border border-zinc-200/80 bg-white p-4 space-y-1 shadow-2xs">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight font-mono">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-sm text-zinc-400 line-through">
                    ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                  </span>
                )}
                {savings > 0 && (
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                    Save ₹{savings.toLocaleString('en-IN')} ({discount}%)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-500">
                Inclusive of all taxes & complimentary insured express delivery nationwide.
              </p>
            </div>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 block">
                  Select Edition / Color: <span className="font-normal text-zinc-600">{selectedColor}</span>
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                        selectedColor === c
                          ? 'bg-zinc-900 text-white shadow-xs'
                          : 'border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 block">
                  Specification / Size: <span className="font-normal text-zinc-600">{selectedVariant}</span>
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                        selectedVariant === v
                          ? 'bg-zinc-900 text-white shadow-xs'
                          : 'border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Stock Status */}
            <div className="flex items-center gap-4 pt-1">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Quantity</span>
                <div className="flex items-center rounded-lg border border-zinc-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-sm font-bold text-zinc-600 hover:text-zinc-950"
                  >
                    −
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold font-mono text-zinc-950 min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-sm font-bold text-zinc-600 hover:text-zinc-950"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Status</span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  {product.stock > 0 ? `${product.stock} units in stock` : 'Available to Order'}
                </span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 rounded-lg border border-zinc-300 bg-white py-3 text-xs font-semibold uppercase tracking-wider text-zinc-900 hover:bg-zinc-50 hover:border-zinc-400 transition shadow-2xs cursor-pointer"
              >
                Add to Shopping Bag
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 rounded-lg bg-zinc-900 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black transition shadow-xs cursor-pointer"
              >
                Buy Now
              </button>
            </div>

            {/* Trust Accordion / Guarantees List */}
            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-4 space-y-2.5 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-zinc-900 shrink-0" />
                <span><strong>Authenticity:</strong> 100% genuine with stamped manufacturer warranty card.</span>
              </div>
              <div className="flex items-center gap-2">
                <TruckIcon className="w-4 h-4 text-zinc-900 shrink-0" />
                <span><strong>Express Delivery:</strong> Dispatched within 24 hours via BlueDart / Delhivery.</span>
              </div>
              <div className="flex items-center gap-2">
                <BoxIcon className="w-4 h-4 text-zinc-900 shrink-0" />
                <span><strong>7-Day Returns:</strong> Hassle-free pickup for unopened pristine returns.</span>
              </div>
            </div>

          </div>

        </div>

        {/* ================= DETAILED SPECIFICATIONS & REVIEWS TABS ================= */}
        <div id="product-tabs-section" className="space-y-6 pt-6 border-t border-zinc-200/80">
          
          <div className="flex items-center gap-2 border-b border-zinc-200/80 pb-px">
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`border-b-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'specs'
                  ? 'border-zinc-950 text-zinc-950'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Specifications & Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`border-b-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-zinc-950 text-zinc-950'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Customer Reviews ({reviews.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('warranty')}
              className={`border-b-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'warranty'
                  ? 'border-zinc-950 text-zinc-950'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Warranty & Verification
            </button>
          </div>

          {/* TAB 1: Specifications */}
          {activeTab === 'specs' && (
            <div className="space-y-5 animate-fade-in">
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-zinc-950">Curator Description</h3>
                <p className="text-xs text-zinc-600 leading-relaxed max-w-3xl">
                  {product.description || 'This exclusive edition represents the pinnacle of luxury craftsmanship, sourced directly through authorized horological and lifestyle brand distributors.'}
                </p>

                {product.specifications && (
                  <div className="pt-3 border-t border-zinc-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">
                      Technical Specifications
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <div key={key} className="rounded-lg bg-zinc-50 p-3 border border-zinc-200/60">
                          <span className="text-[10px] font-semibold uppercase text-zinc-400 block">{key}</span>
                          <span className="text-xs font-bold text-zinc-900 mt-0.5 block">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Customer Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-2xs">
                <div>
                  <h3 className="text-base font-bold text-zinc-950">Verified Buyer Reviews</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Average Rating: {product.rating || 4.8} / 5.0 based on {reviews.length} reviews</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(true)}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-black transition shadow-xs self-start sm:self-auto cursor-pointer"
                >
                  Write a Review
                </button>
              </div>

              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-950">{rev.user}</span>
                        {rev.verified && (
                          <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[9.5px] font-semibold text-emerald-800 border border-emerald-200/60">
                            ✓ Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-[10.5px] text-zinc-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 text-xs">
                      {[...Array(rev.rating)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>

                    <h4 className="text-xs font-bold text-zinc-900">{rev.title}</h4>
                    <p className="text-xs text-zinc-600 leading-relaxed">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Warranty & Verification */}
          {activeTab === 'warranty' && (
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-zinc-950">Official Manufacturer Warranty & Authenticity</h3>
              <p className="text-xs text-zinc-600 leading-relaxed max-w-3xl">
                Every timepiece and lifestyle good sold through Krishna Accessories includes the official manufacturer warranty card stamped by authorized partner boutiques. Service is honored at any brand service center across India.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
                  <h4 className="text-xs font-bold text-zinc-950">Boutique Inspection</h4>
                  <p className="text-[11px] text-zinc-500 mt-1">Multi-point movement and aesthetic authenticity check prior to dispatch.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
                  <h4 className="text-xs font-bold text-zinc-950">Warranty Duration</h4>
                  <p className="text-[11px] text-zinc-500 mt-1">2 Years standard manufacturer international warranty coverage.</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ================= RELATED PIECES ================= */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-zinc-200/80">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B89035]">
                  Complementary Editions
                </span>
                <h2 className="text-xl font-bold tracking-tight text-zinc-950 mt-0.5">
                  You May Also Admire
                </h2>
              </div>
              <Link to={`/shop?category=${encodeURIComponent(product.category || '')}`} className="text-xs font-semibold text-zinc-700 hover:text-zinc-950">
                View Category &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ================= WRITE A REVIEW MODAL ================= */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-zinc-200 shadow-2xl space-y-4 animate-modal">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-bold text-zinc-950">Write a Review</h3>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-950 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul P."
                  value={reviewForm.user}
                  onChange={(e) => setReviewForm({ ...reviewForm, user: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">Rating</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 font-semibold cursor-pointer"
                >
                  <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                  <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                  <option value={2}>★★☆☆☆ (2 Stars - Below Average)</option>
                  <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Magnificent craftsmanship and fast delivery"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">Detailed Feedback</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details regarding movement precision, packaging, and feel..."
                  value={reviewForm.text}
                  onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white resize-none transition"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-zinc-900 px-5 py-2 text-xs font-semibold text-white hover:bg-black transition shadow-xs"
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