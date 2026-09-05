// src/components/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Search
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { getProducts, saveProduct, deleteProduct, getCategories, getBrands } from "../utils/productStore";
import { isAdmin } from '../utils/auth';

export default function AdminProducts() {
  const authenticatedAsAdmin = isAdmin();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    price: '',
    oldPrice: '',
    category: '',
    brand: '',
    image: '',
    description: '',
    stock: '25',
    sku: ''
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setProducts(getProducts());
    setCategories(getCategories());
    setBrands(getBrands());
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return alert("Please enter product name and price.");

    const price = Number(formData.price);
    const oldPrice = Number(formData.oldPrice) || Math.round(price * 1.25);
    const discount = Math.round(((oldPrice - price) / oldPrice) * 100);

    const updatedList = saveProduct({
      ...formData,
      price,
      oldPrice,
      discount,
      stock: Number(formData.stock || 0),
      sku: formData.sku || `KA-${(formData.category || 'GEN').substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`
    });

    setProducts(updatedList);
    setFormData({ id: null, name: '', price: '', oldPrice: '', category: '', brand: '', image: '', description: '', stock: '25', sku: '' });
    alert("Product saved successfully and published to Shop UI!");
  };

  const handleEdit = (product) => {
    setFormData(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this product permanently?")) {
      const updatedList = deleteProduct(id);
      setProducts(updatedList);
    }
  };

  if (!authenticatedAsAdmin) {
    return (
      <div className="min-h-screen bg-[#F9F9F8] text-zinc-900 flex flex-col justify-between font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-200/80 bg-white p-7 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800 text-xl">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900">Admin Access Restricted</h2>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Please sign in with authorized administrator credentials to manage catalog products.
            </p>
            <Link
              to="/login"
              className="inline-block rounded-lg bg-zinc-900 px-5 py-2 text-xs font-semibold text-white hover:bg-black transition shadow-xs"
            >
              Sign In as Admin &rarr;
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200/80 pb-4 gap-3">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Admin Console</span>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 mt-0.5">Catalog & Product Manager</h1>
          </div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition shadow-2xs self-start sm:self-auto"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Full Admin Dashboard</span>
          </Link>
        </div>

        {/* --- ADD / EDIT FORM --- */}
        <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200/80 grid gap-3.5 md:grid-cols-2 shadow-2xs">
          <div className="md:col-span-2 border-b border-zinc-100 pb-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
              {formData.id ? 'Edit Product Details' : 'Add New Product to Store'}
            </h2>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 block mb-1">Product Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Classic Chronograph Timepiece"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-zinc-50 px-3.5 py-2 border border-zinc-200 rounded-lg text-zinc-900 text-xs outline-none focus:border-zinc-400 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 block mb-1">SKU Code</label>
            <input
              type="text"
              name="sku"
              placeholder="e.g. KA-WAT-001"
              value={formData.sku}
              onChange={handleChange}
              className="w-full bg-zinc-50 px-3.5 py-2 border border-zinc-200 rounded-lg text-zinc-900 font-mono text-xs outline-none focus:border-zinc-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 block mb-1">Selling Price (₹) *</label>
            <input
              type="number"
              name="price"
              placeholder="e.g. 4999"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-zinc-50 px-3.5 py-2 border border-zinc-200 rounded-lg text-zinc-900 text-xs outline-none focus:border-zinc-400 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 block mb-1">Original MRP (₹)</label>
            <input
              type="number"
              name="oldPrice"
              placeholder="e.g. 6999"
              value={formData.oldPrice}
              onChange={handleChange}
              className="w-full bg-zinc-50 px-3.5 py-2 border border-zinc-200 rounded-lg text-zinc-900 text-xs outline-none focus:border-zinc-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 block mb-1">Category / Department *</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-zinc-50 px-3.5 py-2 border border-zinc-200 rounded-lg text-zinc-900 text-xs outline-none focus:border-zinc-400 font-medium cursor-pointer" required>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 block mb-1">Brand *</label>
            <select name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-zinc-50 px-3.5 py-2 border border-zinc-200 rounded-lg text-zinc-900 text-xs outline-none focus:border-zinc-400 font-medium cursor-pointer" required>
              <option value="">Select Brand</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 block mb-1">Stock Quantity</label>
            <input
              type="number"
              name="stock"
              placeholder="e.g. 25"
              value={formData.stock}
              onChange={handleChange}
              className="w-full bg-zinc-50 px-3.5 py-2 border border-zinc-200 rounded-lg text-zinc-900 text-xs outline-none focus:border-zinc-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 block mb-1">Product Image URL</label>
            <input
              type="text"
              name="image"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={handleChange}
              className="w-full bg-zinc-50 px-3.5 py-2 border border-zinc-200 rounded-lg text-zinc-900 text-xs outline-none focus:border-zinc-400 focus:bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-medium text-zinc-700 block mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Product specifications and features..."
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-zinc-50 px-3.5 py-2 border border-zinc-200 rounded-lg text-zinc-900 text-xs outline-none focus:border-zinc-400 focus:bg-white resize-none"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-zinc-100">
            {formData.id && (
              <button
                type="button"
                onClick={() => setFormData({ id: null, name: '', price: '', oldPrice: '', category: '', brand: '', image: '', description: '', stock: '25', sku: '' })}
                className="rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-700 cursor-pointer"
              >
                Cancel Edit
              </button>
            )}
            <button type="submit" className="bg-zinc-900 hover:bg-black text-white font-semibold px-5 py-2 rounded-lg text-xs tracking-wide transition shadow-xs cursor-pointer">
              {formData.id ? 'Update Product' : 'Publish Product'}
            </button>
          </div>
        </form>

        {/* --- ADMIN PRODUCT LIST --- */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Live Catalog Products ({products.length})</h2>

          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-xl border border-zinc-200/80 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="h-12 w-12 rounded-lg object-contain bg-zinc-50 border border-zinc-200 shrink-0 p-1" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold uppercase text-zinc-400">{p.brand}</span>
                      <h3 className="font-semibold text-zinc-900 text-xs truncate">{p.name}</h3>
                      <p className="text-[10.5px] text-zinc-500">{p.category} &bull; Stock: {p.stock}</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm font-semibold text-zinc-900 tabular-nums">
                    ₹{p.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="mt-4 flex gap-2 border-t border-zinc-100 pt-3">
                  <button onClick={() => handleEdit(p)} className="flex-1 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-medium py-1.5 rounded-lg transition cursor-pointer">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="flex-1 border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 text-xs font-medium py-1.5 rounded-lg transition cursor-pointer">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}