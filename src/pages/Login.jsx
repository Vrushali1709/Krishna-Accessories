// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { setCurrentUser } from '../utils/auth';
import { getSuppliers } from '../utils/orderStore';
import { LockClosedIcon, UserIcon, ArrowRightIcon, ShieldCheckIcon } from '../components/Icons';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine initial selected role from location state or default
  const [selectedRole, setSelectedRole] = useState(() => {
    if (location.state?.requiredRole === 'admin' || location.pathname.includes('admin')) {
      return 'admin';
    }
    if (location.state?.requiredRole === 'supplier' || location.pathname.includes('supplier')) {
      return 'supplier';
    }
    return 'customer';
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const redirectMessage = location.state?.message || '';
  const returnPath = typeof location.state?.from === 'string'
    ? location.state.from
    : (location.state?.from?.pathname ? `${location.state.from.pathname}${location.state.from.search || ''}` : null);

  useEffect(() => {
    if (location.state?.requiredRole) {
      setSelectedRole(location.state.requiredRole);
      setEmail('');
      setPassword('');
      setError('');
    }
  }, [location.state]);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please type your Email ID and Password.');
      return;
    }

    // 1. Admin Authentication Check
    if (cleanEmail === 'admin@krishna.com' || cleanEmail === 'admin') {
      if (cleanPassword === 'admin123') {
        setCurrentUser({
          email: 'admin@krishna.com',
          role: 'admin',
          name: 'Super Administrator',
          phone: '+91 (079) 4000-5500'
        });
        navigate(returnPath || '/admin', { replace: true });
        return;
      } else {
        setError('Invalid password for Administrator.');
        return;
      }
    }

    // 2. Supplier Authentication Check
    const suppliers = getSuppliers();
    const matchedSupplier = suppliers.find(s => s.email?.toLowerCase() === cleanEmail);

    if (cleanEmail === 'supplier@krishna.com' || cleanEmail === 'supplier' || matchedSupplier) {
      if (cleanPassword === 'supplier123' || cleanPassword === matchedSupplier?.password) {
        setCurrentUser({
          email: matchedSupplier?.email || 'supplier@krishna.com',
          role: 'supplier',
          name: matchedSupplier?.name || 'Apex Timepieces Ltd.',
          phone: matchedSupplier?.phone || '+91 98765 43210'
        });
        navigate(returnPath || '/supplier', { replace: true });
        return;
      } else {
        setError('Invalid password for Supplier.');
        return;
      }
    }

    // 3. Customer Authentication
    if (cleanPassword.length >= 4) {
      setCurrentUser({
        email: cleanEmail,
        role: 'customer',
        name: cleanEmail.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()) || 'Valued Client',
        phone: '+91 98765 12345'
      });
      navigate(returnPath || '/account', { replace: true });
    } else {
      setError('Password must contain at least 4 characters.');
    }
  };

  const handleQuickDemoFill = (roleType) => {
    setSelectedRole(roleType);
    if (roleType === 'admin') {
      setEmail('admin@krishna.com');
      setPassword('admin123');
    } else if (roleType === 'supplier') {
      setEmail('supplier@krishna.com');
      setPassword('supplier123');
    } else {
      setEmail('rahul.patel@example.com');
      setPassword('user123');
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (forgotEmail.trim()) {
      setOtpSent(true);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (otpCode.trim() && newPassword.trim()) {
      setForgotSuccess('Password reset successfully. You may now sign in.');
      setTimeout(() => {
        setForgotModalOpen(false);
        setForgotSuccess('');
        setOtpSent(false);
        setOtpCode('');
        setNewPassword('');
      }, 1500);
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
              Boutique Access Portal
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 mt-0.5">Sign In to Your Account</h2>
            <p className="text-xs text-zinc-500 mt-1">
              Select your authorization tier to access orders, consignment tools, or catalog governance.
            </p>
          </div>

          {redirectMessage && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800 font-medium leading-relaxed">
              {redirectMessage}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-800 font-medium">
              {error}
            </div>
          )}

          {/* Role Tabs */}
          <div className="flex rounded-xl bg-zinc-100 p-1 border border-zinc-200/60">
            {[
              { id: 'customer', label: 'Customer' },
              { id: 'supplier', label: 'Vendor Partner' },
              { id: 'admin', label: 'Administrator' }
            ].map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleSelectRole(r.id)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedRole === r.id
                    ? 'bg-white text-zinc-950 shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-zinc-700 mb-1 block">
                {selectedRole === 'admin' ? 'Administrator Email / Username' : selectedRole === 'supplier' ? 'Partner Business Email' : 'Client Email Address'} *
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  selectedRole === 'admin'
                    ? 'admin@krishna.com'
                    : selectedRole === 'supplier'
                    ? 'supplier@krishna.com'
                    : 'rahul.patel@example.com'
                }
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-zinc-700">Security Password *</label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[11px] font-semibold text-[#B89035] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-zinc-900 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black transition shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Authenticate & Sign In</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick 1-Click Credentials Tester */}
          <div className="pt-3 border-t border-zinc-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2 text-center">
              Quick 1-Click Test Credentials
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[10.5px]">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('customer')}
                className="rounded border border-zinc-200 bg-zinc-50 py-1.5 px-2 font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('supplier')}
                className="rounded border border-zinc-200 bg-zinc-50 py-1.5 px-2 font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Supplier
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('admin')}
                className="rounded border border-zinc-200 bg-zinc-50 py-1.5 px-2 font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-zinc-500 pt-1">
            New client to Krishna Accessories?{' '}
            <Link to="/register" state={{ from: returnPath }} className="font-semibold text-zinc-950 hover:underline">
              Create an account &rarr;
            </Link>
          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-zinc-200 shadow-2xl space-y-4 animate-modal">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-bold text-zinc-950">Password Recovery Desk</h3>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-950 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {forgotSuccess ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-semibold text-center">
                {forgotSuccess}
              </div>
            ) : !otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <p className="text-xs text-zinc-500">
                  Enter your registered email address to receive a secure 6-digit verification PIN.
                </p>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-zinc-900 px-5 py-2 text-xs font-semibold text-white hover:bg-black"
                  >
                    Send PIN
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <p className="text-xs text-emerald-700 font-medium">
                  ✓ 6-Digit PIN sent to <strong>{forgotEmail}</strong>. (Simulated PIN: <span className="font-mono font-bold">123456</span>)
                </p>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Verification PIN *</label>
                  <input
                    type="text"
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-mono outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">New Security Password *</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters..."
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                  <button
                    type="submit"
                    className="rounded-lg bg-zinc-900 px-5 py-2 text-xs font-semibold text-white hover:bg-black"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}