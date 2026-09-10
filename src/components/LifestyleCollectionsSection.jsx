// src/components/LifestyleCollectionsSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from './Icons';

const LIFESTYLE_EDITS = [
  {
    id: 'executive',
    title: 'Executive & Business Luxe',
    subtitle: 'Heritage Chronographs & Italian Leather',
    tag: 'Corporate Elegance',
    category: 'Watches',
    image: 'https://i.pinimg.com/736x/15/dc/da/15dcdac0fcc6a94440471bf201b96b75.jpg',
    span: 'col-span-1 md:col-span-2 lg:col-span-2',
    link: '/shop?category=Watches'
  },
  {
    id: 'streetwear',
    title: 'Urban Streetwear & Kicks',
    subtitle: 'Limited-Edition Sneakers & Statement Sunglasses',
    tag: 'Trendsetter',
    category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900',
    span: 'col-span-1 md:col-span-1 lg:col-span-1',
    link: '/shop?category=Shoes'
  },
  {
    id: 'audiophile',
    title: 'Audiophile & Studio Immersion',
    subtitle: 'Industry-Leading Noise Cancelling Sound',
    tag: 'Pure Acoustics',
    category: 'Electronics',
    image: 'https://i.pinimg.com/1200x/db/6c/da/db6cdaadde558a889e0c812ea679d8e1.jpg',
    span: 'col-span-1 md:col-span-1 lg:col-span-1',
    link: '/shop?category=Electronics'
  },
  {
    id: 'fitness',
    title: 'Athletic & Smart Performance',
    subtitle: 'Multi-Sport GPS Trackers & Titanium Wearables',
    tag: 'Endurance & Tech',
    category: 'Fitness',
    image: 'https://i.pinimg.com/736x/ce/b4/1d/ceb41df7737b5918904522051f1f56f5.jpg',
    span: 'col-span-1 md:col-span-2 lg:col-span-2',
    link: '/shop?category=Fitness'
  }
];

export default function LifestyleCollectionsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-amber-600">
            Curated Style Guides
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
            Shop by Lifestyle & Occasion
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-lg">
            Purposefully styled edits tailored for boardrooms, weekend travels, fitness goals, and studio sound.
          </p>
        </div>

        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-900 hover:text-black group self-start sm:self-auto shrink-0"
        >
          <span>Explore All Lookbooks</span>
          <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid of Lifestyle Cards with Dynamic Aspect & Dark Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {LIFESTYLE_EDITS.map((edit) => (
          <Link
            key={edit.id}
            to={edit.link}
            className={`group relative overflow-hidden rounded-3xl min-h-[280px] sm:min-h-[320px] p-6 sm:p-7 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 ${edit.span}`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={edit.image}
                alt={edit.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20 group-hover:via-black/55 transition-colors duration-300" />
            </div>

            {/* Top Pill */}
            <div className="relative z-10">
              <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-white/25">
                {edit.tag}
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 mt-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug group-hover:text-amber-200 transition-colors">
                {edit.title}
              </h3>
              <p className="mt-1 text-xs text-gray-300 font-light line-clamp-1">
                {edit.subtitle}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                <span>Shop the Collection</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-md group-hover:bg-amber-400 group-hover:text-black transition-all">
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
