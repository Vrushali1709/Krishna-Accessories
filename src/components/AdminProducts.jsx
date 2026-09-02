// src/components/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      sku: formData.sku || `KA-${formData.category.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`
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
      <div className="min-h-screen bg-[#FAFAFB] text-gray-900 flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-900">
              🔒
            </div>
            <h2 className="text-xl font-bold text-gray-950">Admin Access Restricted</h2>
            <p className="text-xs text-gray-500 leading-5">
              Please sign in with Admin credentials to manage catalog products.
            </p>
            <Link
              to="/login"
              className="inline-block rounded-full bg-[#111827] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black"
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
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Admin Console</span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 mt-1">Catalog & Product Manager</h1>
          </div>
          <Link to="/admin" className="rounded-full border border-gray-200 bg-[#F4F4F6] px-4 py-2 text-xs font-bold text-gray-800 hover:bg-gray-200 transition">
            &larr; Full Admin Dashboard
          </Link>
        </div>

        {/* --- ADD / EDIT FORM --- */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl mb-8 border border-gray-200 grid gap-4 md:grid-cols-2 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-950 md:col-span-2">
            {formData.id ? 'Edit Product in Store' : 'Add New Product to Store'}
          </h2>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Product Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Classic Luxury Watch"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#F4F4F6] px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-xs outline-none focus:border-gray-400 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">SKU Code</label>
            <input
              type="text"
              name="sku"
              placeholder="e.g. KA-TIT-001"
              value={formData.sku}
              onChange={handleChange}
              className="w-full bg-[#F4F4F6] px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 font-mono text-xs outline-none focus:border-gray-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Price (₹) *</label>
            <input
              type="number"
              name="price"
              placeholder="e.g. 4999"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-[#F4F4F6] px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-xs outline-none focus:border-gray-400 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Original Price (₹)</label>
            <input
              type="number"
              name="oldPrice"
              placeholder="e.g. 6999"
              value={formData.oldPrice}
              onChange={handleChange}
              className="w-full bg-[#F4F4F6] px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-xs outline-none focus:border-gray-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#F4F4F6] px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-xs outline-none focus:border-gray-400" required>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Brand *</label>
            <select name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-[#F4F4F6] px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-xs outline-none focus:border-gray-400" required>
              <option value="">Select Brand</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Stock Quantity</label>
            <input
              type="number"
              name="stock"
              placeholder="e.g. 25"
              value={formData.stock}
              onChange={handleChange}
              className="w-full bg-[#F4F4F6] px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-xs outline-none focus:border-gray-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Product Image URL</label>
            <input
              type="text"
              name="image"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={handleChange}
              className="w-full bg-[#F4F4F6] px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-xs outline-none focus:border-gray-400 focus:bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-gray-700 block mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Product description and details..."
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-[#F4F4F6] px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-xs outline-none focus:border-gray-400 focus:bg-white resize-none"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-2.5 pt-2">
            {formData.id && (
              <button
                type="button"
                onClick={() => setFormData({ id: null, name: '', price: '', oldPrice: '', category: '', brand: '', image: '', description: '', stock: '25', sku: '' })}
                className="rounded-full border border-gray-200 bg-[#F4F4F6] px-5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200"
              >
                Cancel Edit
              </button>
            )}
            <button type="submit" className="bg-[#111827] hover:bg-black text-white font-bold px-7 py-2.5 rounded-full text-xs uppercase tracking-wider transition shadow-sm">
              {formData.id ? 'Update Product' : 'Publish Product to Store UI'}
            </button>
          </div>
        </form>

        {/* --- ADMIN PRODUCT LIST --- */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-950">Live Store Products ({products.length})</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-3xl border border-gray-200 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center gap-3.5">
                    <img src={p.image} alt={p.name} className="h-14 w-14 rounded-2xl object-contain bg-[#F4F4F6] border border-gray-200 shrink-0 p-1.5" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase text-gray-400">{p.brand}</span>
                      <h3 className="font-bold text-gray-950 text-xs truncate">{p.name}</h3>
                      <p className="text-[10px] text-gray-500">{p.category} &bull; Stock: {p.stock}</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm font-bold text-gray-950">
                    ₹{p.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
                  <button onClick={() => handleEdit(p)} className="flex-1 bg-[#F4F4F6] hover:bg-gray-200 text-gray-800 text-xs font-bold py-1.5 rounded-full transition">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold py-1.5 rounded-full transition">
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