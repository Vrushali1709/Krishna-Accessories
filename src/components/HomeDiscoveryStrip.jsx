import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  HeadphonesIcon,
  RefreshIcon,
  ShieldCheckIcon,
  TruckIcon
} from './Icons';

const benefits = [
  {
    title: 'Free Shipping',
    subtitle: 'On orders above ₹2,000',
    icon: TruckIcon,
    to: '/shop'
  },
  {
    title: 'Easy Returns',
    subtitle: '7 days return policy',
    icon: RefreshIcon,
    to: '/terms'
  },
  {
    title: 'Secure Payments',
    subtitle: '100% secure checkout',
    icon: ShieldCheckIcon,
    to: '/checkout'
  },
  {
    title: '24/7 Support',
    subtitle: "We're here to help",
    icon: HeadphonesIcon,
    to: '/contact'
  }
];

const categoryIcons = {
  'New Arrivals': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=220',
  Watches: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=220',
  'Bags & Wallets': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=220',
  Shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=220',
  Mobiles: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=220',
  Electronics: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=220',
  'Smart Gadgets': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=220',
  Gaming: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=220',
  Fitness: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=220',
  'Fashion Accessories': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=220'
};

const categoryLinks = [
  { label: 'New Arrivals', category: null, badge: 'NEW' },
  { label: 'Watches', category: 'Watches' },
  { label: 'Bags & Wallets', category: 'Bags & Wallets' },
  { label: 'Shoes', category: 'Shoes' },
  { label: 'Mobiles', category: 'Mobiles' },
  { label: 'Electronics', category: 'Electronics' },
  { label: 'Smart Gadgets', category: 'Smart Gadgets' },
  { label: 'Gaming', category: 'Gaming' },
  { label: 'Fitness', category: 'Fitness' },
  { label: 'Fashion Accessories', category: 'Fashion Accessories' }
];

export default function HomeDiscoveryStrip({ categories = [] }) {
  const availableCategories = new Set(categories.map((item) => item.name));
  const visibleCategories = categoryLinks.filter(
    (item) => !item.category || availableCategories.has(item.category)
  );

  return (
    <section className="bg-[#FAFAFB] px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[18px] border border-gray-200/90 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.035)]">
        <div className="grid grid-cols-2 divide-x divide-y divide-gray-200/80 sm:grid-cols-4 sm:divide-y-0">
          {benefits.map(({ title, subtitle, icon: Icon, to }, index) => (
            <Link
              key={title}
              to={to}
              className={`group flex min-h-[82px] items-center gap-3 px-3.5 py-3.5 transition-colors hover:bg-gray-50 sm:px-5 lg:px-7 ${index > 1 ? 'border-t-0' : ''}`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F7F7F5] text-gray-900 ring-1 ring-gray-200/80 transition-transform group-hover:scale-105">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <strong className="block truncate text-[11px] font-bold text-gray-950 sm:text-xs">{title}</strong>
                <span className="mt-0.5 block truncate text-[10px] text-gray-500 sm:text-[11px]">{subtitle}</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="border-t border-gray-200/80 px-3 py-4 sm:px-6 sm:py-5 lg:px-7">
          <div className="flex snap-x gap-4 overflow-x-auto pb-1 no-scrollbar sm:justify-between sm:gap-3">
            {visibleCategories.map(({ label, category, badge }) => {
              const to = label === 'New Arrivals'
                ? '/new-arrivals'
                : `/shop?category=${encodeURIComponent(category)}`;
              const image = categoryIcons[label];

              return (
                <Link
                  key={label}
                  to={to}
                  className="group flex w-[74px] shrink-0 snap-start flex-col items-center gap-2 text-center sm:w-[84px]"
                >
                  <span className="relative block h-[68px] w-[68px] overflow-visible rounded-full bg-gray-100 ring-1 ring-gray-200/80 sm:h-[76px] sm:w-[76px]">
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full rounded-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    {badge && (
                      <span className="absolute -right-1 -bottom-1 rounded-full border-2 border-white bg-gray-950 px-1.5 py-0.5 text-[8px] font-bold text-white">
                        {badge}
                      </span>
                    )}
                  </span>
                  <span className="whitespace-nowrap text-[10px] font-semibold text-gray-700 transition-colors group-hover:text-gray-950 sm:text-[11px]">
                    {label}
                  </span>
                </Link>
              );
            })}

            <Link
              to="/shop"
              className="group flex w-[74px] shrink-0 snap-start flex-col items-center gap-2 text-center sm:w-[84px]"
            >
              <span className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#F4F5F6] text-gray-950 ring-1 ring-gray-200 transition group-hover:bg-gray-950 group-hover:text-white sm:h-[76px] sm:w-[76px]">
                <span className="flex flex-col items-center gap-0.5">
                  <span className="text-[10px] font-bold leading-tight">View All</span>
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
              <span className="whitespace-nowrap text-[10px] font-semibold text-gray-700 sm:text-[11px]">Categories</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}