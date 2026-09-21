// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setCurrentUser, setAuthToken } from '../utils/auth';
import { usersApi } from '../utils/api';
import { addSupplier } from '../utils/orderStore';
import { sendOtpEmail, verifyOtp, resendOtp, sendWelcomeEmail } from '../utils/emailService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  User,
  ArrowRight,
  ShieldCheck,
  Mail,
  KeyRound,
  ArrowLeft,
  Sparkles,
  Building2,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useLoading } from '../context/LoadingContext';
import BrandSpinner from '../components/BrandSpinner';

export default function Register() {
  const [step, setStep] = useState(1); // 1: Registration form, 2: OTP Verification
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const [supplierCategory, setSupplierCategory] = useState('Watches');

  // OTP Verification state
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { showLoading, hideLoading } = useLoading();

  const returnPath = typeof location.state?.from === 'string'
    ? location.state.from
    : (location.state?.from?.pathname ? `${location.state.from.pathname}${location.state.from.search || ''}` : null);

  // Resend Countdown Timer for OTP
  useEffect(() => {
    let interval = null;
    if (step === 2 && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  // Step 1: Send Registration OTP Code
  const handleInitiateRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError('Please fill out all registration fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setSubmitting(true);
    showLoading('Dispatching Verification OTP to your Email...');

    const res = await sendOtpEmail(email.trim().toLowerCase(), 'registration_otp', name.trim());
    setSubmitting(false);
    hideLoading();

    if (res.success) {
      setStep(2);
      setOtpTimer(60);
      setSuccess(`✓ 6-Digit security OTP dispatched to ${email.trim().toLowerCase()}`);
    } else {
      setError(res.error || 'Failed to dispatch verification code. Please check email address.');
    }
  };

  // Step 2: Verify OTP and finalize account creation
  const handleVerifyAndComplete = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = otpCode.trim();

    if (!cleanCode || cleanCode.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    const verifyResult = await verifyOtp(cleanEmail, cleanCode, 'registration_otp');
    if (!verifyResult.success) {
      setError(verifyResult.error);
      return;
    }

    setSubmitting(true);
    showLoading(role === 'Supplier' ? 'Activating Supplier Partner Account...' : 'Creating Krishna Privé Account...');

    const newUser = {
      name: name.trim(),
      email: cleanEmail,
      role: role.toLowerCase(),
      phone: phone.trim()
    };

    try {
      const createdUser = await usersApi.create({ ...newUser, password });
      const loginResult = await usersApi.login({ email: cleanEmail, password, role: newUser.role });
      setAuthToken(loginResult.token);
      setCurrentUser(createdUser);

      // Send Welcome Email with promo coupon
      await sendWelcomeEmail(cleanEmail, name.trim(), role);

      if (role === 'Supplier') {
        addSupplier({
          name: name.trim(),
          email: cleanEmail,
          phone: phone.trim(),
          category: supplierCategory,
          address: "Gujarat, India",
          status: "Pending Approval"
        });
        setSubmitting(false);
        hideLoading();
        setSuccess('Supplier registered & verified! Directing to vendor portal...');
        setTimeout(() => navigate('/supplier'), 600);
      } else {
        setSubmitting(false);
        hideLoading();
        setSuccess('Account verified & created successfully! Welcome to Krishna Privé.');
        setTimeout(() => navigate(returnPath || '/account'), 600);
      }
    } catch (err) {
      setSubmitting(false);
      hideLoading();
      setError(err.message || 'Error completing registration.');
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (otpTimer > 0) return;
    setError('');
    const res = await resendOtp(email, 'registration_otp', name);
    if (res.success) {
      setOtpTimer(60);
      setSuccess('✓ Fresh 6-digit OTP code dispatched to your email.');
    } else {
      setError(res.error || 'Failed to resend code.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white flex flex-col justify-between overflow-x-clip">
      <Navbar />

      <main className="mx-auto max-w-md w-full px-4 py-12 sm:py-16">
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-7 sm:p-9 shadow-sm space-y-6">

          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734] animate-ping" />
              <span className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-[#8C6734]">
                {step === 1 ? 'Client Registration' : 'Email Security Verification'}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-neutral-950">
              {step === 1 ? 'Join Krishna Privé' : 'Verify Your Email'}
            </h1>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              {step === 1
                ? 'Create an account for personal wishlist tracking, order history, and concierge booking.'
                : `We dispatched a 6-digit verification code to ${email}`}
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-900 animate-fade-in">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-900 animate-fade-in">
              {success}
            </div>
          )}

          {/* STEP 1: Registration Form Details */}
          {step === 1 && (
            <form onSubmit={handleInitiateRegister} className="space-y-4 text-xs">
              {/* Account Type Selection */}
              <div>
                <label className="font-semibold text-neutral-800 block mb-1.5">Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('Customer')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      role === 'Customer'
                        ? 'border-neutral-950 bg-neutral-950 text-white shadow-2xs'
                        : 'border-neutral-200 bg-[#FAFAFB] text-neutral-700 hover:bg-white'
                    }`}
                  >
                    Client Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Supplier')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      role === 'Supplier'
                        ? 'border-neutral-950 bg-neutral-950 text-white shadow-2xs'
                        : 'border-neutral-200 bg-[#FAFAFB] text-neutral-700 hover:bg-white'
                    }`}
                  >
                    Vendor Partner
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Full Legal Name <span className="text-[#8C6734]">*</span></label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Patel"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]/30 transition-all"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Email Address <span className="text-[#8C6734]">*</span></label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]/30 transition-all"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Mobile Phone Number <span className="text-[#8C6734]">*</span></label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 93213 22761"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]/30 transition-all"
                />
              </div>

              {role === 'Supplier' && (
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Primary Product Category</label>
                  <select
                    value={supplierCategory}
                    onChange={(e) => setSupplierCategory(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-[#8C6734] transition-all cursor-pointer"
                  >
                    <option value="Watches">Luxury Watches &amp; Horology</option>
                    <option value="Bags & Wallets">Bags &amp; Leather Accessories</option>
                    <option value="Shoes">Footwear &amp; Sneakers</option>
                    <option value="Electronics">Electronics &amp; Audio</option>
                    <option value="Fashion Accessories">Eyewear &amp; Lifestyle</option>
                  </select>
                </div>
              )}

              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Set Password <span className="text-[#8C6734]">*</span></label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]/30 transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#8C6734] transition-colors duration-200 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <span>{submitting ? 'Preparing Verification...' : 'Send Verification OTP'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyAndComplete} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Enter 6-Digit Email Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-center font-mono text-base tracking-widest text-neutral-950 outline-none focus:border-[#8C6734] transition-all"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-neutral-600 hover:text-neutral-950 inline-flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Edit Details</span>
                </button>

                <button
                  type="button"
                  disabled={otpTimer > 0}
                  onClick={handleResendOtp}
                  className="text-[#8C6734] font-semibold hover:underline disabled:opacity-40 cursor-pointer"
                >
                  {otpTimer > 0 ? `Resend (${otpTimer}s)` : 'Resend Code'}
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#8C6734] transition-colors duration-200 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <span>{submitting ? 'Validating...' : 'Verify & Complete Registration'}</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Login Link Footer */}
          <div className="border-t border-neutral-100 pt-4 text-center text-xs text-neutral-500">
            <span>Already have a Krishna account? </span>
            <Link to="/login" className="font-semibold text-[#8C6734] hover:underline">
              Sign In Instead
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}