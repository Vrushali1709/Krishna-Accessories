import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { ArrowRightIcon } from '../components/Icons';
import { getProducts } from '../utils/productStore';
import { addToCart } from '../utils/cart';
import { getCurrentUser } from '../utils/auth';

const categoryTabs = ['All', 'Watches', 'Bags & Wallets', 'Shoes', 'Mobiles', 'Electronics'];

export default function NewArrivals() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(() => getProducts());
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const handleProductsUpdate = () => setProducts(getProducts());
    window.addEventListener('productsUpdated', handleProductsUpdate);
    return () => window.removeEventListener('productsUpdated', handleProductsUpdate);
  }, []);

  const arrivals = useMemo(() => {
    const filtered = category === 'All'
      ? [...products]
      : products.filter((product) => product.category?.toLowerCase() === category.toLowerCase());

    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    if (sort === 'discount') filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    if (sort === 'newest') filtered.sort((a, b) => b.id - a.id);
    return filtered;
  }, [products, category, sort]);

  const handleAddToCart = (product) => {
    if (!getCurrentUser()) {
      navigate('/login', { state: { from: '/new-arrivals', requiredRole: 'customer' } });
      return;
    }
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    setToastMessage(`Added "${product.name}" to your bag`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleBuyNow = (product) => {
    if (!getCurrentUser()) {
      navigate('/login', { state: { from: '/new-arrivals', requiredRole: 'customer' } });
      return;
    }
    addToCart(product, 1, product.colors?.[0] || '', product.variants?.[0] || '');
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900">
      <Navbar />

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-semibold shadow-xl">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✓</span>
          <span>{toastMessage}</span>
          <Link to="/cart" className="rounded-full bg-gray-950 px-3 py-1 text-[10px] text-white">View Bag</Link>
        </div>
      )}

      <main>
        <section className="border-b border-gray-200 bg-[#111827] text-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-300">Season 2026 / Just In</p>
              <h1 className="mt-3 text-4xl font-light tracking-tight sm:text-6xl">New Arrivals</h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-gray-300 sm:text-base">
                Meet the latest additions to the Krishna Accessories collection, carefully selected for everyday distinction.
              </p>
              <Link to="/shop" className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:text-amber-300">
                Explore full catalog <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-5 border-b border-gray-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700">Curated edit</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950">Fresh from the collection</h2>
              <p className="mt-1 text-xs text-gray-500">{arrivals.length} pieces available now</p>
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
              Sort by
              <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-900">
                <option value="newest">Latest first</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="discount">Best offers</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categoryTabs.map((tab) => (
              <button key={tab} type="button" onClick={() => setCategory(tab)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${category === tab ? 'bg-gray-950 text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-100'}`}>
                {tab === 'All' ? 'All arrivals' : tab}
              </button>
            ))}
          </div>

          {arrivals.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {arrivals.map((product) => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />)}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-500">No new arrivals in this category yet.</div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}