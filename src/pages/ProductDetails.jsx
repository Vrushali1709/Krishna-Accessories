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
      <div className="min-h-screen bg-[#FAFAFB] text-gray-900">
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <div className="text-4xl font-bold text-gray-300 mb-2">404</div>
          <h1 className="text-xl font-bold text-gray-950">Product Not Found</h1>
          <p className="mt-1 text-xs text-gray-500">The product you are looking for may have been removed.</p>
          <Link to="/shop" className="mt-4 rounded-full bg-[#111827] px-5 py-2 text-xs font-semibold text-white hover:bg-black transition">
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
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900">
      <Navbar />

      {/* Toast Alert */}
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
        <div className="mx-auto max-w-7xl px-4 py-2.5 text-xs text-gray-500 sm:px-6 lg:px-8 flex items-center gap-1.5">
          <Link to="/" className="hover:text-black">Home</Link>
          <span className="text-gray-300">/</span>
          <Link to="/shop" className="hover:text-black">Shop</Link>
          <span className="text-gray-300">/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-black font-medium text-gray-700">
            {product.category}
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Product Showcase */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 items-start">

          {/* Left Column: Images Gallery */}
          <div className="space-y-3">

            {/* Main Stage Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200/80 bg-[#F4F4F6] p-6 flex items-center justify-center shadow-2xs">
              {discount > 0 && (
                <span className="absolute left-3 top-3 z-10 rounded-full bg-[#0F172A] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                  {discount}% OFF
                </span>
              )}

              <button
                type="button"
                onClick={handleWishlistToggle}
                className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white/95 shadow-2xs transition hover:scale-105 ${inWish ? 'text-rose-500 border-rose-200 bg-rose-50/80' : 'text-gray-500 hover:text-black'
                  }`}
                title={inWish ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <HeartIcon className="w-4 h-4" filled={inWish} />
              </button>

              <img
                src={images[selectedImage] || images[0]}
                alt={product.name}
                className="h-full w-full object-contain mix-blend-multiply transition-transform duration-400 ease-out hover:scale-104"
              />
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square overflow-hidden rounded-xl border p-1.5 bg-[#F4F4F6] transition ${selectedImage === idx
                      ? 'border-gray-950 ring-1 ring-gray-950/20'
                      : 'border-gray-200 hover:border-gray-400'
                      }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Assurances Under Gallery */}
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-gray-200/80 bg-white p-3 text-center shadow-2xs">
              <div>
                <span className="text-emerald-600 text-sm font-bold">✓</span>
                <p className="text-[11px] font-bold text-gray-900 mt-0.2">100% Genuine</p>
                <p className="text-[9.5px] text-gray-500">Official Warranty Card</p>
              </div>
              <div className="border-x border-gray-100">
                <span className="text-gray-900 text-sm font-bold">🚚</span>
                <p className="text-[11px] font-bold text-gray-900 mt-0.2">Free Express</p>
                <p className="text-[9.5px] text-gray-500">Orders &ge; ₹2,000</p>
              </div>
              <div>
                <span className="text-gray-900 text-sm font-bold">🛡️</span>
                <p className="text-[11px] font-bold text-gray-900 mt-0.2">Warranty</p>
                <p className="text-[9.5px] text-gray-500">All-India Network</p>
              </div>
            </div>

          </div>

          {/* Right Column: Product Info & Buy Box */}
          <div className="flex flex-col justify-start rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs">

            {/* Header info: Brand, SKU & Supplier */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#B89758]">
                {product.brand}
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[9.5px] font-mono text-gray-600 border border-gray-200">
                SKU: {product.sku || `KA-${product.id}`}
              </span>
            </div>

            <h1 className="mt-1.5 text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
              {product.name}
            </h1>

            {/* Rating & Stock Status */}
            <div className="mt-2 flex flex-wrap items-center gap-2.5 text-xs">
              <div className="flex items-center gap-1 font-semibold text-gray-900">
                <span className="text-amber-500">★ {product.rating || 4.8}</span>
                <span className="text-gray-400 font-normal">({reviews.length} Reviews)</span>
              </div>
              <span className="text-gray-300">&bull;</span>
              <span className="text-gray-500">Category: <strong className="text-gray-900">{product.category}</strong></span>
              <span className="text-gray-300">&bull;</span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-full text-[10px]">
                In Stock ({product.stock} units)
              </span>
            </div>

            {/* Price Box */}
            <div className="mt-3.5 rounded-xl bg-[#F8F9FA] border border-gray-200 p-3.5">
              <div className="flex items-baseline gap-2.5">
                <span className="text-xl sm:text-2xl font-bold text-gray-950">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                {product.oldPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                  </span>
                )}
                {savings > 0 && (
                  <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2 py-0.2 text-[10.5px] font-semibold text-emerald-800">
                    Save ₹{savings.toLocaleString('en-IN')} ({discount}%)
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[11px] text-gray-500">
                Inclusive of all GST &bull; Insured Express Delivery across India
              </p>
            </div>

            {/* Short Description */}
            <p className="mt-3 text-xs leading-relaxed text-gray-600">
              {product.description}
            </p>

            {/* Color Options */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-700">Finish:</span>
                  <span className="text-[11px] text-gray-900 font-semibold">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-lg border px-3 py-1 text-xs font-medium transition ${selectedColor === color
                        ? 'border-gray-950 bg-[#0F172A] text-white shadow-2xs'
                        : 'border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant Options */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-700">Edition / Size:</span>
                  <span className="text-[11px] text-gray-900 font-semibold">{selectedVariant}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`rounded-lg border px-3 py-1 text-xs font-medium transition ${selectedVariant === v
                        ? 'border-gray-950 bg-[#0F172A] text-white shadow-2xs'
                        : 'border-gray-200 bg-[#F4F4F6] text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Actions */}
            <div className="mt-4 space-y-3 border-t border-gray-100 pt-3.5">

              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold text-gray-700">Quantity:</span>
                <div className="flex items-center rounded-full border border-gray-200 bg-[#F4F4F6]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-7 w-7 items-center justify-center text-xs font-bold text-gray-700 hover:text-black transition"
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-xs font-semibold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    className="flex h-7 w-7 items-center justify-center text-xs font-bold text-gray-700 hover:text-black transition"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-gray-400">
                  (In Stock: {product.stock})
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid gap-2 sm:grid-cols-2 pt-1">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="rounded-full border border-gray-300 bg-[#F4F4F6] py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-900 transition hover:bg-gray-200"
                >
                  Add to Bag
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="rounded-full bg-[#111827] py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-black shadow-xs border border-gray-900"
                >
                  Buy Now
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Tabbed Specifications & Customer Reviews */}
        <section className="mt-10 rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs">

          <div className="flex border-b border-gray-200 gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${activeTab === 'specs'
                ? 'border-b-2 border-[#111827] text-gray-950'
                : 'text-gray-400 hover:text-black'
                }`}
            >
              Specifications
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
              <div className="grid gap-4 sm:grid-cols-2 animate-fade-in">
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-gray-100 py-1.5 text-xs">
                    <span className="text-gray-500">Brand</span>
                    <span className="font-semibold text-gray-900">{product.brand}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-1.5 text-xs">
                    <span className="text-gray-500">Category</span>
                    <span className="font-semibold text-gray-900">{product.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-1.5 text-xs">
                    <span className="text-gray-500">SKU Code</span>
                    <span className="font-mono font-semibold text-gray-900">{product.sku}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-1.5 text-xs">
                    <span className="text-gray-500">Authorized Vendor</span>
                    <span className="font-semibold text-gray-900">{product.supplier || 'Apex Timepieces Ltd.'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-gray-100 py-1.5 text-xs">
                      <span className="text-gray-500">{key}</span>
                      <span className="font-semibold text-gray-900">{val}</span>
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
                    className="rounded-full bg-[#111827] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black transition"
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
                                Verified
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
                <p>🛡️ <strong>Certified Authentic Guarantee:</strong> Every item is verified by our boutique inspection specialists prior to dispatch with official warranty cards.</p>
              </div>
            )}
          </div>

        </section>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-gray-400">You May Also Like</p>
                <h3 className="text-lg font-bold tracking-tight text-gray-950">Similar Curated Items</h3>
              </div>
              <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="text-xs font-semibold text-gray-900 hover:underline">
                View All {product.category} &rarr;
              </Link>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Review Submission Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
              <h3 className="text-xs font-bold text-gray-950 uppercase tracking-wider">Write a Verified Review</h3>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-gray-400 hover:text-black font-bold"
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
                  className="flex-1 rounded-full border border-gray-200 bg-gray-100 py-2 font-semibold text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#111827] py-2 font-semibold uppercase tracking-wider text-white hover:bg-black"
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