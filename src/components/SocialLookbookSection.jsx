// src/components/SocialLookbookSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from './Icons';

const LOOKBOOK_ITEMS = [
  {
    id: 1,
    image: 'https://i.pinimg.com/736x/80/4d/7c/804d7c5ba3d69a866d1303f94299d564.jpg',
    handle: '@rohit_mumbai',
    location: 'Bandra, Mumbai',
    productName: 'Titan Automatic Swiss Series',
    price: '₹7,999',
    category: 'Watches'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900',
    handle: '@sneakerhead_in',
    location: 'South Mumbai',
    productName: 'Nike Air Heritage Sneakers',
    price: '₹4,499',
    category: 'Shoes'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900',
    handle: '@ananya_style',
    location: 'Juhu, Mumbai',
    productName: 'Ray-Ban Polarized Aviator',
    price: '₹2,499',
    category: 'Fashion Accessories'
  },
  {
    id: 4,
    image: 'https://i.pinimg.com/736x/15/dc/da/15dcdac0fcc6a94440471bf201b96b75.jpg',
    handle: '@karan_executive',
    location: 'Nariman Point',
    productName: 'Hidesign Vintage Leather Brief',
    price: '₹3,499',
    category: 'Bags & Wallets'
  },
  {
    id: 5,
    image: 'https://i.pinimg.com/1200x/db/6c/da/db6cdaadde558a889e0c812ea679d8e1.jpg',
    handle: '@dj_aarav',
    location: 'Worli Studio',
    productName: 'Sony WH-1000XM5 Studio',
    price: '₹14,999',
    category: 'Electronics'
  },
  {
    id: 6,
    image: 'https://i.pinimg.com/736x/52/cc/2a/52cc2a9343298c070a2e66503a60b5cc.jpg',
    handle: '@priya_luxury',
    location: 'Haji Ali Sanctuary',
    productName: 'Fossil Grant Chronograph',
    price: '₹4,999',
    category: 'Watches'
  }
];

export default function SocialLookbookSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-600">
          Community & Culture
        </span>
        <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
          #StyledWithKrishna
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
          See how tastemakers and luxury enthusiasts wear Krishna Accessories in their everyday lifestyles.
        </p>
      </div>

      {/* Grid of Social Style Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {LOOKBOOK_ITEMS.map((item) => (
          <Link
            key={item.id}
            to={`/shop?category=${encodeURIComponent(item.category)}`}
            className="group relative aspect-[3/4] overflow-hidden rounded-2xl sm:rounded-3xl bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.productName}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Top Instagram Handle Pill (Visible on hover) */}
            <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-semibold text-white">
                {item.handle}
              </span>
              <span className="text-white text-xs">📸</span>
            </div>

            {/* Bottom Product Info Bar (Slides up on hover) */}
            <div className="absolute inset-x-2.5 bottom-2.5 z-10 p-2.5 rounded-xl bg-black/75 backdrop-blur-md text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <p className="text-[10px] font-bold text-amber-300 truncate">
                {item.productName}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] font-extrabold text-white">{item.price}</span>
                <span className="text-[9px] text-gray-300 uppercase tracking-wider">Shop Look →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
