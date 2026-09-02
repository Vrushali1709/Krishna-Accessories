// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { setCurrentUser } from '../utils/auth';
import { addSupplier } from '../utils/orderStore';
import { ArrowRightIcon, LockClosedIcon, ShieldCheckIcon } from '../components/Icons';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const [supplierCategory, setSupplierCategory] = useState('Watches');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      alert('Please fill out all registration fields.');
      return;
    }

    const newUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role.toLowerCase(),
      phone: phone.trim()
    };

    setCurrentUser(newUser);

    if (role === 'Supplier') {
      addSupplier({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        category: supplierCategory,
        address: "Gujarat, India",
        status: "Pending Approval"
      });
      setSuccess('Supplier registered! Directing to vendor portal...');
      setTimeout(() => navigate('/supplier'), 1200);
    } else {
      setSuccess('Account created successfully! Directing to account dashboard...');
      setTimeout(() => navigate('/account'), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-14">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">

          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-white font-serif font-bold text-base mb-2.5 shadow-sm">
              K
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Client Registration
            </span>
            <h2 className="text-2xl font-bold text-gray-950 mt-1">Create an Account</h2>
            <p className="text-xs text-gray-500 mt-1">
              Join Krishna Accessories for bespoke concierge ordering and tracking
            </p>
          </div>

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800 font-semibold text-center flex items-center justify-center gap-1.5">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                {role === 'Supplier' ? 'Company / Business Name *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'Supplier' ? "e.g. Apex Timepieces Ltd." : "e.g. Rahul Patel"}
                className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Phone Number *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 12345"
                className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Account Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-400 cursor-pointer"
              >
                <option value="Customer">Customer (Shop, Track Orders & Wishlist)</option>
                <option value="Supplier">Supplier / Vendor Partner (Publish Products & Fulfill Orders)</option>
              </select>
            </div>

            {role === 'Supplier' && (
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Primary Product Category *</label>
                <select
                  value={supplierCategory}
                  onChange={(e) => setSupplierCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-400 cursor-pointer"
                >
                  <option value="Watches">Watches & Horology</option>
                  <option value="Bags & Wallets">Bags & Leather Wallets</option>
                  <option value="Shoes">Footwear & Sneakers</option>
                  <option value="Mobiles">Mobiles & Smart Tech</option>
                  <option value="Clothes & Fashion">Clothes & Luxury Apparel</option>
                  <option value="Laptops">Laptops & Workstations</option>
                  <option value="Electronics">Electronics & Audio</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-black mt-2"
            >
              <span>{role === 'Supplier' ? 'Submit Vendor Registration' : 'Create Account'}</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center text-xs text-gray-500 border-t border-gray-100 pt-4">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-gray-950 hover:underline">
              Sign In
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}