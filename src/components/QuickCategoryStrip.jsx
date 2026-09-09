// src/components/QuickCategoryStrip.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from './Icons';

const categories = [
  {
    name: 'New Arrivals',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&auto=format&fit=crop&q=80',
    link: '/new-arrivals',
    badge: 'NEW'
  },
  {
    name: 'Women',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    link: '/shop?category=Clothes%20%26%20Fashion'
  },
  {
    name: 'Men',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    link: '/shop?category=Clothes%20%26%20Fashion'
  },
  {
    name: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop&q=80',
    link: '/shop'
  },
  {
    name: 'Beauty',
    image: 'https://images.unsplash.com/photo-1608248597359-007a33b93a6c?w=400&auto=format&fit=crop&q=80',
    link: '/shop?category=Fashion%20Accessories'
  },
  {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
    link: '/shop?category=Electronics'
  },
  {
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80',
    link: '/shop?category=Fashion%20Accessories'
  },
  {
    name: 'Sports',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80',
    link: '/shop?category=Shoes'
  },
  {
    name: 'Kids',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400&auto=format&fit=crop&q=80',
    link: '/shop'
  },
  {
    name: 'Watches',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&auto=format&fit=crop&q=80',
    link: '/shop?category=Watches'
  },
  {
    name: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&auto=format&fit=crop&q=80',
    link: '/shop?category=Mobiles'
  }
];

export default function QuickCategoryStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
      <div className="rounded-[24px] sm:rounded-[28px] bg-white border border-gray-200/85 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-4 sm:p-5 lg:p-6 transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-4 sm:gap-5 lg:gap-6 overflow-x-auto no-scrollbar py-1 px-1 justify-start scroll-smooth">
          {categories.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className="group flex flex-col items-center shrink-0 transition-transform active:scale-95 focus:outline-none"
            >
              {/* Circle Avatar with Optional Badge */}
              <div className="relative h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20 rounded-full bg-[#F6F4F0] p-1 border border-gray-200/70 shadow-2xs transition-all duration-300 group-hover:border-black group-hover:shadow-md group-hover:scale-105 flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 pointer-events-none"
                  />
                </div>

                {/* Overlapping Pill Badge (for New Arrivals) */}
                {item.badge && (
                  <span className="absolute bottom-0 right-0 bg-white text-gray-950 font-extrabold text-[8.5px] sm:text-[9.5px] px-1.5 py-0.5 rounded-full border border-gray-200 shadow-xs tracking-wider">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className="mt-2 text-xs sm:text-[13px] font-semibold text-gray-800 transition-colors duration-200 group-hover:text-black text-center tracking-tight truncate max-w-[76px] sm:max-w-[90px]">
                {item.name}
              </span>
            </Link>
          ))}

          {/* Special "View All Categories →" Action Circle */}
          <Link
            to="/shop"
            className="group flex flex-col items-center shrink-0 transition-transform active:scale-95 focus:outline-none"
          >
            <div className="relative h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20 rounded-full bg-[#F6F4F0] border border-gray-200/70 shadow-2xs transition-all duration-300 group-hover:bg-black group-hover:border-black group-hover:shadow-md group-hover:scale-105 flex flex-col items-center justify-center p-2 text-center">
              <span className="text-[10.5px] sm:text-[11.5px] font-bold text-gray-800 group-hover:text-white transition-colors leading-tight">
                View All
              </span>
              <span className="text-[9.5px] sm:text-[10px] font-medium text-gray-500 group-hover:text-white/80 transition-colors leading-tight">
                Categories
              </span>
              <ArrowRightIcon className="w-3 h-3 text-gray-700 group-hover:text-white transition-transform group-hover:translate-x-0.5 mt-0.5" />
            </div>

            <span className="mt-2 text-xs sm:text-[13px] font-semibold text-transparent select-none">
              &nbsp;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
