// src/components/LovedByCustomers.jsx
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon
} from './Icons';

const sampleReviews = [
  {
    id: 1,
    name: 'Aditya Patel',
    location: 'Ahmedabad, Gujarat',
    category: 'Watches',
    rating: 5,
    title: 'Absolute masterpiece! 100% authentic Swiss feel.',
    review:
      'Ordered the Titan Heritage Automatic Chronograph. The packaging was immaculate with official warranty and verification seal. Arrived within 24 hours in Ahmedabad. Krishna Accessories has earned a lifelong customer!',
    productName: 'Titan Heritage Automatic Chronograph',
    productCategory: 'Watches',
    date: '3 days ago',
    verified: true,
    helpfulCount: 42,
    avatarGradient: 'from-amber-500 to-amber-700'
  },
  {
    id: 2,
    name: 'Rohan Mehta',
    location: 'Mumbai, Maharashtra',
    category: 'Bags & Wallets',
    rating: 5,
    title: 'Supreme leather craftsmanship & finish.',
    review:
      'Bought the Hidesign Vintage Full-Grain Duffel. The leather smell, brass hardware, and interior lining are top tier. Delivery to South Mumbai took just 2 days. Truly premium experience from start to finish.',
    productName: 'Hidesign Vintage Full-Grain Duffel',
    productCategory: 'Bags & Wallets',
    date: '1 week ago',
    verified: true,
    helpfulCount: 38,
    avatarGradient: 'from-slate-700 to-slate-900'
  },
  {
    id: 3,
    name: 'Pooja Shah',
    location: 'Surat, Gujarat',
    category: 'Eyewear & Accessories',
    rating: 5,
    title: 'Crystal clear polarized lenses, superb packaging.',
    review:
      'The Ray-Ban Polarized Aviators came in pristine condition with the original case and microfiber cloth. The gold frame has a luxurious weight. Customer concierge helped me choose the right frame size via WhatsApp!',
    productName: 'Ray-Ban Polarized Aviator Classic',
    productCategory: 'Fashion Accessories',
    date: '5 days ago',
    verified: true,
    helpfulCount: 29,
    avatarGradient: 'from-rose-500 to-rose-700'
  },
  {
    id: 4,
    name: 'Vikramaditya Roy',
    location: 'Bengaluru, Karnataka',
    category: 'Electronics',
    rating: 5,
    title: 'Audiophile grade sound with seamless ANC.',
    review:
      'Got the Bose QuietComfort Ultra noise-cancelling headphones. Bass is deep, mids are crystal clear, and ANC blocks out all Bangalore traffic noise. Sourced directly with original manufacturer serial registered.',
    productName: 'Bose QuietComfort Ultra Sound Edition',
    productCategory: 'Electronics',
    date: '2 weeks ago',
    verified: true,
    helpfulCount: 51,
    avatarGradient: 'from-blue-600 to-blue-900'
  },
  {
    id: 5,
    name: 'Ananya Sharma',
    location: 'New Delhi',
    category: 'Shoes',
    rating: 5,
    title: 'Unbelievable comfort and sleek styling.',
    review:
      'Nike Air Cushion running sneakers fit like a glove. Needed a quick size replacement and their 7-day doorstep exchange was completed in under 48 hours without any hassle. Exceptional customer care!',
    productName: 'Nike Air Max Cushion Edition',
    productCategory: 'Shoes',
    date: '4 days ago',
    verified: true,
    helpfulCount: 23,
    avatarGradient: 'from-emerald-600 to-teal-800'
  },
  {
    id: 6,
    name: 'Dr. Rajesh Desai',
    location: 'Vadodara, Gujarat',
    category: 'Watches',
    rating: 5,
    title: 'Heritage Casio Edifice piece with perfect accuracy.',
    review:
      'I visited their flagship sanctuary in Bodakdev before ordering online. The staff was incredibly knowledgeable and attentive. The Casio Edifice Solar Chrono arrived nicely adjusted and safely boxed.',
    productName: 'Casio Edifice Solar Sapphire Edition',
    productCategory: 'Watches',
    date: '10 days ago',
    verified: true,
    helpfulCount: 34,
    avatarGradient: 'from-indigo-600 to-indigo-950'
  },
  {
    id: 7,
    name: 'Sneha Kulkarni',
    location: 'Pune, Maharashtra',
    category: 'Bags & Wallets',
    rating: 5,
    title: 'Elegant, lightweight & luxurious wallet.',
    review:
      'The Tommy Hilfiger genuine leather bi-fold wallet has ample card slots and RFID protection. Perfect gift for my husband. The packaging box came wrapped with a luxury gold ribbon!',
    productName: 'Tommy Hilfiger Oxford Leather Wallet',
    productCategory: 'Bags & Wallets',
    date: '6 days ago',
    verified: true,
    helpfulCount: 19,
    avatarGradient: 'from-amber-600 to-orange-800'
  },
  {
    id: 8,
    name: 'Kunal Trivedi',
    location: 'Ahmedabad, Gujarat',
    category: 'Electronics',
    rating: 5,
    title: 'Sony WH-1000XM5 genuine piece with full warranty.',
    review:
      'Checked the serial number on Sony India portal and it was 100% genuine with 1-year brand warranty. Fast local same-day courier in Ahmedabad. Will always shop here for luxury tech.',
    productName: 'Sony WH-1000XM5 Wireless ANC',
    productCategory: 'Electronics',
    date: '1 day ago',
    verified: true,
    helpfulCount: 46,
    avatarGradient: 'from-neutral-800 to-black'
  }
];

const categories = [
  'All',
  'Watches',
  'Bags & Wallets',
  'Shoes',
  'Electronics',
  'Eyewear & Accessories'
];

export default function LovedByCustomers({ onToast }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [reviewsList, setReviewsList] = useState(sampleReviews);
  const [helpfulMap, setHelpfulMap] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Review Form State
  const [formName, setFormName] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formCategory, setFormCategory] = useState('Watches');
  const [formProduct, setFormProduct] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formReview, setFormReview] = useState('');

  const scrollContainerRef = useRef(null);

  const filteredReviews =
    selectedCategory === 'All'
      ? reviewsList
      : reviewsList.filter((r) => r.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleScroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 380;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleHelpfulToggle = (reviewId) => {
    const isLiked = helpfulMap[reviewId];
    setHelpfulMap((prev) => ({ ...prev, [reviewId]: !isLiked }));
    setReviewsList((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            helpfulCount: isLiked ? r.helpfulCount - 1 : r.helpfulCount + 1
          };
        }
        return r;
      })
    );
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formReview.trim() || !formTitle.trim()) return;

    const newReview = {
      id: Date.now(),
      name: formName.trim(),
      location: formCity.trim() ? `${formCity.trim()}, India` : 'Verified Buyer',
      category: formCategory,
      rating: formRating,
      title: formTitle.trim(),
      review: formReview.trim(),
      productName: formProduct.trim() || `${formCategory} Luxury Edition`,
      productCategory: formCategory,
      date: 'Just now',
      verified: true,
      helpfulCount: 1,
      avatarGradient: 'from-amber-600 to-amber-800'
    };

    setReviewsList([newReview, ...reviewsList]);
    setIsModalOpen(false);

    // Reset Form
    setFormName('');
    setFormCity('');
    setFormProduct('');
    setFormTitle('');
    setFormReview('');
    setFormRating(5);

    if (onToast) {
      onToast('✓ Thank you! Your verified review has been published.');
    }
  };

  return (
    <section className="bg-white py-14 sm:py-20 relative overflow-hidden border-b border-gray-200/80">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-10 right-1/4 h-80 w-80 rounded-full bg-amber-400/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-900 shadow-2xs mb-2.5">
              <span className="text-amber-600">★ 4.9 RATED STORE</span>
              <span className="h-1 w-1 rounded-full bg-amber-500" />
              <span>12,480+ REVIEWS</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-950">
              Loved by Our Customers
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-gray-600 max-w-xl leading-relaxed">
              Real reviews and unboxing experiences from certified buyers across India who celebrate authenticity with Krishna Accessories.
            </p>
          </div>

          {/* Action Buttons & Rating Snapshot */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50/80 px-4 py-2.5 shadow-2xs">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 fill-current text-amber-400" />
                ))}
              </div>
              <div className="text-left leading-tight">
                <span className="font-bold text-xs text-gray-900 block">4.9 / 5.0</span>
                <span className="text-[10px] text-gray-500">99.4% Recommend</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-full bg-gray-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-black transition active:scale-97 cursor-pointer"
            >
              Write a Review ✍️
            </button>
          </div>
        </div>

        {/* Category Filter Pills & Carousel Nav Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const count =
                cat === 'All'
                  ? reviewsList.length
                  : reviewsList.filter((r) => r.category.toLowerCase() === cat.toLowerCase()).length;
              const isActive = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gray-950 text-white shadow-sm scale-102'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Carousel Arrow Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 hover:text-black shadow-2xs transition active:scale-95 cursor-pointer"
              aria-label="Previous Reviews"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 hover:text-black shadow-2xs transition active:scale-95 cursor-pointer"
              aria-label="Next Reviews"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Testimonials Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {filteredReviews.map((item) => {
            const isLiked = !!helpfulMap[item.id];

            return (
              <div
                key={item.id}
                className="group flex-shrink-0 w-[290px] sm:w-[350px] md:w-[380px] rounded-[26px] bg-[#FDFDFE] border border-gray-200/90 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 snap-start flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Stars + Verified Badge + Date */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(item.rating)].map((_, i) => (
                        <StarIcon key={i} className="w-3.5 h-3.5 fill-current text-amber-400" />
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        <CheckCircleIcon className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">{item.date}</span>
                    </div>
                  </div>

                  {/* Review Title */}
                  <h3 className="text-sm sm:text-base font-bold text-gray-950 tracking-tight leading-snug mb-2 group-hover:text-black">
                    "{item.title}"
                  </h3>

                  {/* Review Body */}
                  <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed line-clamp-4">
                    {item.review}
                  </p>

                  {/* Purchased Product Tag */}
                  <div className="mt-4 pt-3 border-t border-gray-100/90">
                    <Link
                      to={`/shop?category=${encodeURIComponent(item.productCategory)}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100/80 hover:bg-gray-200/90 px-2.5 py-1.5 text-[11px] font-medium text-gray-800 transition max-w-full"
                    >
                      <span className="text-amber-600 font-bold shrink-0">🛍️ Item:</span>
                      <span className="truncate">{item.productName}</span>
                    </Link>
                  </div>
                </div>

                {/* Bottom Row: Customer Info + Helpful Button */}
                <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Avatar Initials */}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr ${item.avatarGradient} font-bold text-white text-xs shadow-2xs`}
                    >
                      {item.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-950 truncate leading-tight">
                        {item.name}
                      </p>
                      <p className="text-[10.5px] text-gray-500 truncate leading-tight mt-0.5">
                        {item.location}
                      </p>
                    </div>
                  </div>

                  {/* Helpful Button */}
                  <button
                    type="button"
                    onClick={() => handleHelpfulToggle(item.id)}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition cursor-pointer shrink-0 ${
                      isLiked
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60'
                    }`}
                    title="Mark review as helpful"
                  >
                    <span>👍</span>
                    <span className="text-[10px] font-bold">{item.helpfulCount}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 shadow-md">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300 text-xl border border-amber-400/30">
              💎
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                Share your Krishna Accessories experience!
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Review your recent purchase and receive an exclusive ₹500 voucher on your next order.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-950 hover:bg-amber-50 hover:text-black transition shrink-0 shadow-sm cursor-pointer"
          >
            Leave Feedback →
          </button>
        </div>
      </div>

      {/* ================= WRITE A REVIEW MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-200 animate-slide-up max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black transition cursor-pointer"
            >
              ✕
            </button>

            <div className="mb-6">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Verified Feedback
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-950 mt-2">
                Write Your Review
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Help other connoisseurs discover authentic luxury by sharing your thoughts.
              </p>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              {/* Star Rating Select */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className="p-1 cursor-pointer transition transform hover:scale-115"
                    >
                      <StarIcon
                        className={`w-6 h-6 ${
                          star <= formRating
                            ? 'fill-current text-amber-400'
                            : 'text-gray-300 fill-none'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-900 ml-2">
                    {formRating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Name & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="e.g. Ahmedabad, Mumbai"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>
              </div>

              {/* Category & Product Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white cursor-pointer"
                  >
                    <option value="Watches">Watches</option>
                    <option value="Bags & Wallets">Bags & Wallets</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion Accessories">Eyewear & Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Purchased Item
                  </label>
                  <input
                    type="text"
                    value={formProduct}
                    onChange={(e) => setFormProduct(e.target.value)}
                    placeholder="e.g. Titan Automatic Chrono"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Best luxury shopping experience!"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              {/* Detailed Review */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Review / Experience *
                </label>
                <textarea
                  rows="3"
                  required
                  value={formReview}
                  onChange={(e) => setFormReview(e.target.value)}
                  placeholder="Tell us about the product quality, packaging, delivery speed..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gray-950 px-6 py-2 text-xs font-bold text-white hover:bg-black transition shadow-sm cursor-pointer"
                >
                  Submit Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
