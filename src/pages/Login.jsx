// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { setCurrentUser } from '../utils/auth';
import { getSuppliers } from '../utils/orderStore';
import { LockClosedIcon, UserIcon, ArrowRightIcon, ShieldCheckIcon } from '../components/Icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const redirectMessage = location.state?.message || '';
  const returnPath = location.state?.from?.pathname;

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please enter both your Email ID and Password.');
      return;
    }

    // 1. Admin Authentication Check
    if (cleanEmail === 'admin@krishna.com' || cleanEmail === 'admin') {
      if (cleanPassword === 'admin123') {
        setCurrentUser({
          email: 'admin@krishna.com',
          role: 'admin',
          name: 'Super Administrator',
          phone: '+91 98765 00001'
        });
        navigate(returnPath || '/admin', { replace: true });
        return;
      } else {
        setError('Incorrect password for Administrator.');
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
        setError('Incorrect password for Supplier. Please enter valid credentials.');
        return;
      }
    }

    // 3. Customer Authentication
    if (cleanEmail && cleanPassword) {
      setCurrentUser({
        email: cleanEmail,
        role: 'customer',
        name: cleanEmail.includes('rahul') ? 'Rahul Patel' : cleanEmail.split('@')[0],
        phone: '+91 98765 12345'
      });
      navigate(returnPath || '/account', { replace: true });
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (forgotEmail.trim()) {
      setOtpSent(true);
      setForgotSuccess(`6-digit OTP verification code sent to ${forgotEmail}`);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (otpCode && newPassword) {
      setForgotSuccess('✓ Password reset successfully! You may now sign in.');
      setTimeout(() => {
        setForgotModalOpen(false);
        setOtpSent(false);
        setForgotEmail('');
        setOtpCode('');
        setNewPassword('');
        setForgotSuccess('');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 flex flex-col justify-between overflow-x-clip">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">

          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-white font-serif font-bold text-base mb-2.5 shadow-sm">
              K
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Account Authentication
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 mt-1">Sign In to Your Account</h2>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              Enter your registered ID and password to access your dashboard
            </p>
          </div>

          {/* Security alert if redirected from Protected Route */}
          {redirectMessage && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 font-medium flex items-center gap-2.5 shadow-2xs">
              <span className="text-base">🔒</span>
              <div>
                <strong className="font-bold block text-amber-950">Login Required</strong>
                <span>{redirectMessage}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 font-semibold text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Email ID / Username</label>
              <input
                type="text"
                required
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. supplier@krishna.com"
                className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[11px] text-gray-900 font-semibold hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white pr-10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-black cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-gray-950 hover:underline">
              Create Account
            </Link>
          </div>

        </div>
      </main>

      {/* Forgot Password OTP Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-gray-950 uppercase tracking-wider">Reset Account Password</h3>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="text-gray-400 hover:text-black font-bold p-1"
              >
                ✕
              </button>
            </div>

            {forgotSuccess && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
                {forgotSuccess}
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3.5 text-xs">
                <p className="text-gray-600">Enter your registered email address to receive an instant OTP verification code.</p>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="registered@krishna.com"
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#111827] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition"
                >
                  Send OTP Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">6-Digit OTP Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white tracking-widest text-center font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#111827] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition"
                >
                  Save New Password & Sign In
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}