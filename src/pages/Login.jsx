// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { setCurrentUser } from '../utils/auth';
import { LockClosedIcon, UserIcon, ArrowRightIcon, ShieldCheckIcon } from '../components/Icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Admin Authentication Check
    if (cleanEmail === 'admin@krishna.com' || cleanEmail === 'admin') {
      if (cleanPassword === 'admin123') {
        setCurrentUser({
          email: 'admin@krishna.com',
          role: 'admin',
          name: 'Super Administrator',
          phone: '+91 98765 00001'
        });
        navigate('/admin');
        return;
      } else {
        setError('Invalid password for Administrator (Hint: admin123).');
        return;
      }
    }

    // 2. Supplier Authentication Check
    if (cleanEmail === 'supplier@krishna.com' || cleanEmail === 'supplier') {
      if (cleanPassword === 'supplier123') {
        setCurrentUser({
          email: 'supplier@krishna.com',
          role: 'supplier',
          name: 'Apex Timepieces Ltd.',
          phone: '+91 98765 43210'
        });
        navigate('/supplier');
        return;
      } else {
        setError('Invalid password for Supplier (Hint: supplier123).');
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
      navigate('/account');
    } else {
      setError('Please provide your email and password.');
    }
  };

  const handleQuickLogin = (role) => {
    setError('');

    if (role === 'admin') {
      setEmail('admin@krishna.com');
      setPassword('admin123');
    } else if (role === 'supplier') {
      setEmail('supplier@krishna.com');
      setPassword('supplier123');
    } else {
      setEmail('rahul.patel@example.com');
      setPassword('customer123');
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
              Client Authentication
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 mt-1">Sign In to Your Account</h2>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              Access your saved bag, order timeline tracking, and address book
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Email Address</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
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
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-black"
            >
              <span>Sign In</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Access Account Selector */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-[10px] text-center text-gray-400 uppercase tracking-wider mb-2.5 font-bold">
              Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('customer')}
                className="rounded-full border border-gray-200 bg-[#F4F4F6] py-1.5 px-1 text-[11px] sm:text-xs font-semibold text-gray-800 hover:bg-gray-200 transition truncate"
              >
                Customer Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('supplier')}
                className="rounded-full border border-blue-200 bg-blue-50 py-1.5 px-1 text-[11px] sm:text-xs font-bold text-blue-700 hover:bg-blue-100 transition truncate"
              >
                Supplier Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="rounded-full border border-gray-300 bg-gray-100 py-1.5 px-1 text-[11px] sm:text-xs font-bold text-gray-950 hover:bg-gray-200 transition truncate"
              >
                Admin Demo
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500">
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
                    placeholder="user@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-3.5 py-2 outline-none focus:border-gray-400"
                  />
                </div>
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="flex-1 rounded-full border border-gray-200 bg-gray-100 py-2.5 font-bold text-gray-700 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-[#111827] py-2.5 font-bold uppercase tracking-wider text-white hover:bg-black"
                  >
                    Send OTP &rarr;
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Enter 6-Digit OTP Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-3.5 py-2 font-mono text-center tracking-widest text-base font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-3.5 py-2 outline-none"
                  />
                </div>
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="flex-1 rounded-full border border-gray-200 bg-gray-100 py-2.5 font-bold text-gray-700 hover:bg-gray-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-[#111827] py-2.5 font-bold uppercase tracking-wider text-white hover:bg-black"
                  >
                    Confirm Reset
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