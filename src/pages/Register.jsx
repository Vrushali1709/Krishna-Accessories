// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  const returnPath = typeof location.state?.from === 'string'
    ? location.state.from
    : (location.state?.from?.pathname ? `${location.state.from.pathname}${location.state.from.search || ''}` : null);

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
      setSuccess('Account created successfully! Directing you back...');
      setTimeout(() => navigate(returnPath || '/account'), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-5 animate-fade-in">

          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-amber-300 font-serif font-bold text-base mb-2.5 shadow-xs border border-amber-500/25">
              K
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B89035]">
              Client Registration
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 mt-0.5">Create an Account</h2>
            <p className="text-xs text-zinc-500 mt-1">
              Join Krishna Accessories for bespoke consignment ordering and priority access.
            </p>
          </div>

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-semibold text-center flex items-center justify-center gap-1.5">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-zinc-700 mb-1 block">
                {role === 'Supplier' ? 'Company / Business Name *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'Supplier' ? "e.g. Apex Timepieces Ltd." : "e.g. Rahul Patel"}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 mb-1 block">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 mb-1 block">Mobile Telephone *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 12345"
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 mb-1 block">Security Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a strong password..."
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 mb-1 block">Account Purpose / Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-900 cursor-pointer"
              >
                <option value="Customer">Private Client / Buyer</option>
                <option value="Supplier">Vendor / Certified Brand Supplier</option>
              </select>
            </div>

            {role === 'Supplier' && (
              <div>
                <label className="text-xs font-semibold text-zinc-700 mb-1 block">Primary Catalog Department</label>
                <select
                  value={supplierCategory}
                  onChange={(e) => setSupplierCategory(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-900 cursor-pointer"
                >
                  <option value="Watches">Watches & Horology</option>
                  <option value="Bags & Wallets">Bags & Leather Goods</option>
                  <option value="Shoes">Footwear & Sneakers</option>
                  <option value="Mobiles">Mobile Technology</option>
                  <option value="Laptops">Laptops & Workstations</option>
                  <option value="Electronics">Electronics & Audio</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-zinc-900 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black transition shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Register Account</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center text-xs text-zinc-500 pt-1">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-zinc-950 hover:underline">
              Sign in &rarr;
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}