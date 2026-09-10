// src/components/CuratedCollectionsSection.jsx
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from './Icons';

const COLLECTIONS = [
  {
    title: 'The Swiss & Heritage Chronograph Sanctuary',
    subtitle: 'Sapphire Crystal • Automatic Powermatic • Diver Bezels',
    tag: 'HOROLOGY EDITION',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900',
    link: '/shop?category=Watches',
    brands: 'Titan • Rolex • Fossil • Casio • Tissot'
  },
  {
    title: 'Urban Athleisure & High-Performance Footwear',
    subtitle: 'Air Zoom Cushioning • Primeknit • Full-Grain High Tops',
    tag: 'STREET & PERFORMANCE',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900',
    link: '/shop?category=Shoes',
    brands: 'Nike • Adidas • Puma • Jordan'
  },
  {
    title: 'Executive Leathercraft & Artisan Travel Goods',
    subtitle: 'Vegetable-Tanned Leather • 15.6" Laptop Compartments • Solid Brass',
    tag: 'SIGNATURE LEATHER',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900',
    link: '/shop?category=Bags%20%26%20Wallets',
    brands: 'Hidesign • Wildcraft • Tommy Hilfiger'
  },
  {
    title: 'Audiophile Noise Cancellation & Flagship Tech',
    subtitle: 'Spatial Audio • LDAC Hi-Res • Grade-5 Titanium',
    tag: 'FLAGSHIP INNOVATION',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900',
    link: '/shop?category=Electronics',
    brands: 'Sony • Bose • Apple • Samsung'
  }
];

export default function CuratedCollectionsSection() {
  return (
    <section className="bg-white py-14 sm:py-20 border-b border-gray-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-900" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.26em] text-gray-500">
                Editorial Lookbooks
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-950">
              Curated Style Collections
            </h2>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-900 hover:text-black hover:underline group shrink-0"
          >
            <span>Explore All Lookbooks</span>
            <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 2x2 Grid of Lookbook Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.title}
              to={col.link}
              className="group relative overflow-hidden rounded-[28px] border border-gray-200/90 bg-[#0F172A] text-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_18px_40px_rgba(0,0,0,0.14)] hover:-translate-y-1 h-[280px] sm:h-[340px] flex flex-col justify-between p-6 sm:p-8"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={col.image}
                  alt={col.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 opacity-65 group-hover:opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
              </div>

              {/* Top Tag Pill */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-white/20 shadow-xs">
                  {col.tag}
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:scale-110">
                  <ArrowRightIcon className="w-4 h-4" />
                </span>
              </div>

              {/* Bottom Information */}
              <div className="relative z-10">
                <span className="text-[11px] font-medium text-amber-300 tracking-wider">
                  {col.brands}
                </span>
                <h3 className="mt-1 text-xl sm:text-2xl font-bold text-white leading-snug">
                  {col.title}
                </h3>
                <p className="mt-1 text-xs text-gray-300 font-light truncate">
                  {col.subtitle}
                </p>

                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-amber-200 transition-colors">
                  <span>Explore Collection</span>
                  <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
