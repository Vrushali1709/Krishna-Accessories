// src/components/QuickCategoryStrip.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const quickCategories = [
  {
    name: 'Women',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80',
    link: '/shop?category=Clothes%20%26%20Fashion'
  },
  {
    name: 'Men',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    link: '/shop?category=Clothes%20%26%20Fashion'
  },
  {
    name: 'Dresses',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop&q=80',
    link: '/shop?category=Clothes%20%26%20Fashion'
  },
  {
    name: 'Tops',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80',
    link: '/shop?category=Clothes%20%26%20Fashion'
  },
  {
    name: 'Shoes',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&auto=format&fit=crop&q=80',
    link: '/shop?category=Shoes'
  },
  {
    name: 'Bags',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&auto=format&fit=crop&q=80',
    link: '/shop?category=Bags%20%26%20Wallets'
  },
  {
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&auto=format&fit=crop&q=80',
    link: '/shop?category=Fashion%20Accessories'
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
  },
  {
    name: 'Laptops',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&auto=format&fit=crop&q=80',
    link: '/shop?category=Laptops'
  },
  {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
    link: '/shop?category=Electronics'
  }
];

export default function QuickCategoryStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <div className="rounded-[24px] sm:rounded-[28px] bg-white border border-gray-200/85 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-4 sm:p-5 lg:p-6 transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto no-scrollbar py-1 px-1 justify-start sm:justify-center lg:justify-between scroll-smooth">
          {quickCategories.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className="group flex flex-col items-center shrink-0 transition-transform active:scale-95 focus:outline-none"
            >
              {/* Circle Avatar */}
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#F5F3EF] p-1 border border-gray-200/70 shadow-2xs transition-all duration-300 group-hover:border-black group-hover:shadow-md group-hover:scale-105 overflow-hidden flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110 pointer-events-none"
                />
              </div>

              {/* Label */}
              <span className="mt-2 text-xs sm:text-[13px] font-semibold text-gray-800 transition-colors duration-200 group-hover:text-black text-center tracking-tight truncate max-w-[76px] sm:max-w-[90px]">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
