// src/components/ProductsByPriceSection.jsx
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Reveal } from './useScrollReveal';
import ProductCard from './ProductCard';
import { addToCart } from '../utils/cart';
import { ArrowRightIcon } from './Icons';

const PRICE_TIERS = [
  {
    id: 'under-5k',
    maxPrice: 5000,
    minPrice: 0,
    label: 'Under ₹5,000',
    subtitle: 'Everyday Essentials'
  },
  {
    id: 'under-10k',
    maxPrice: 10000,
    minPrice: 0,
    label: 'Under ₹10,000',
    subtitle: 'Popular Curation'
  },
  {
    id: 'under-15k',
    maxPrice: 15000,
    minPrice: 0,
    label: 'Under ₹15,000',
    subtitle: 'Prestige & Performance'
  },
  {
    id: 'under-20k',
    maxPrice: 20000,
    minPrice: 0,
    label: 'Under ₹20,000',
    subtitle: 'Luxury Class'
  }
];

export default function ProductsByPriceSection({
  products = [],
  onAddToCart,
  onBuyNow
}) {
  const navigate = useNavigate();
  const [activeTierId, setActiveTierId] = useState('under-5k');

  const activeTier = useMemo(() => {
    return PRICE_TIERS.find((t) => t.id === activeTierId) || PRICE_TIERS[0];
  }, [activeTierId]);

  // Compute products count for each tier
  const tierCounts = useMemo(() => {
    const counts = {};
    PRICE_TIERS.forEach((tier) => {
      counts[tier.id] = products.filter(
        (p) => Number(p.price) <= tier.maxPrice && Number(p.price) >= tier.minPrice
      ).length;
    });
    return counts;
  }, [products]);

  // Filter top 4 products for the active tier
  const activeProducts = useMemo(() => {
    const list = products
      .filter((p) => Number(p.price) <= activeTier.maxPrice && Number(p.price) >= activeTier.minPrice)
      .sort((a, b) => {
        const scoreB = (Number(b.rating) || 4.5) * 50 + (Number(b.reviews) || 10);
        const scoreA = (Number(a.rating) || 4.5) * 50 + (Number(a.reviews) || 10);
        return scoreB - scoreA;
      });

    return list.slice(0, 4);
  }, [products, activeTier]);

  const handleQuickAdd = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    }
  };

  const handleInstantBuy = (product) => {
    if (onBuyNow) {
      onBuyNow(product);
    } else {
      addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
      navigate('/checkout');
    }
  };

  return (
    <section className="bg-white py-10 sm:py-16 border-t border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* 1. Header with Clean Segmented Budget Switcher */}
        <Reveal direction="up" delay={40}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
                PRICE DISCOVERY
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-950">
                Shop by Budget
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 max-w-lg leading-relaxed">
                Discover exceptional timepieces and designer accessories tailored to your price range.
              </p>
            </div>

            {/* Segmented Budget Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-full border border-neutral-200/80 overflow-x-auto no-scrollbar">
              {PRICE_TIERS.map((tier) => {
                const isActive = activeTierId === tier.id;
                const count = tierCounts[tier.id] || 0;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setActiveTierId(tier.id)}
                    className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-neutral-950 text-white shadow-2xs'
                        : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                    }`}
                  >
                    <span>{tier.label}</span>
                    <span className={`text-[10px] font-mono ${isActive ? 'text-amber-300' : 'text-neutral-400'}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* 2. 4-Product Grid */}
        {activeProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-7">
            {activeProducts.map((product, idx) => (
              <Reveal
                key={`budget-prod-${activeTier.id}-${product.id}`}
                direction="up"
                delay={idx * 60}
                duration={600}
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleQuickAdd}
                  onBuyNow={handleInstantBuy}
                  showRating={true}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl bg-neutral-50 border border-neutral-200">
            <p className="text-sm font-medium text-neutral-600">
              No products found in this budget tier currently.
            </p>
            <Link
              to="/shop"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-5 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
            >
              Explore Full Catalog
            </Link>
          </div>
        )}

        {/* 3. Subtle View All in Tier Footer Link */}
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-neutral-100">
          <p className="text-xs text-neutral-500">
            Showing top curated selections <span className="font-semibold text-neutral-900">{activeTier.label}</span> ({activeTier.subtitle})
          </p>

          <Link
            to={`/shop?maxPrice=${activeTier.maxPrice}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-black transition-colors"
          >
            <span>View All {tierCounts[activeTier.id] || 0} Products {activeTier.label}</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
