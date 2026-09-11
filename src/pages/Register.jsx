// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { setCurrentUser } from '../utils/auth';
import { addSupplier } from '../utils/orderStore';
import { sendOtpEmail, verifyOtp, resendOtp, sendWelcomeEmail } from '../utils/emailService';
import { ArrowRightIcon, LockClosedIcon, ShieldCheckIcon } from '../components/Icons';
import { RefreshCw, Mail, ArrowLeft, KeyRound } from 'lucide-react';
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

    const verifyResult = verifyOtp(cleanEmail, cleanCode, 'registration_otp');
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

    setCurrentUser(newUser);

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
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 flex flex-col justify-between overflow-x-clip select-none">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">

          <div className="text-center">
            <img
              src="/images/krishna-logo.png"
              alt="Krishna Accessories Logo"
              className="mx-auto h-12 w-12 object-contain rounded-2xl bg-white p-1 shadow-xs border border-gray-200 mb-2.5"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              {step === 1 ? 'Client Registration' : 'Email Verification Step'}
            </span>
            <h2 className="text-2xl font-bold text-gray-950 mt-1">
              {step === 1 ? 'Create an Account' : 'Verify Your Email'}
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              {step === 1
                ? 'Join Krishna Accessories for bespoke concierge ordering and tracking'
                : `We have sent a 6-digit security OTP to ${email}`}
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-center gap-2">
            <div className={`h-1.5 w-12 rounded-full transition-all ${step === 1 ? 'bg-black' : 'bg-emerald-600'}`} />
            <div className={`h-1.5 w-12 rounded-full transition-all ${step === 2 ? 'bg-black' : 'bg-gray-200'}`} />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 font-semibold text-center animate-fade-in">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800 font-semibold text-center flex items-center justify-center gap-1.5 animate-fade-in">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* ================= STEP 1: REGISTRATION INPUT FORM ================= */}
          {step === 1 && (
            <form onSubmit={handleInitiateRegister} className="space-y-3.5">
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
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-black mt-2 disabled:opacity-60 cursor-pointer active:scale-95"
              >
                {submitting ? (
                  <>
                    <BrandSpinner size="xs" variant="gold" inline={true} />
                    <span>Dispatching OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Verify Email</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ================= STEP 2: OTP VERIFICATION FORM ================= */}
          {step === 2 && (
            <form onSubmit={handleVerifyAndComplete} className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                <span className="truncate">Verification Email: <strong>{email}</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-amber-800 font-bold hover:underline shrink-0 ml-2 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Enter 6-Digit Verification Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full rounded-xl border border-gray-300 bg-[#F4F4F6] px-4 py-3 text-center text-lg font-mono font-black tracking-widest text-gray-900 outline-none focus:border-neutral-900 focus:bg-white"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>⏱️ Code valid for 5 mins</span>
                {otpTimer > 0 ? (
                  <span className="text-neutral-400 font-mono">Resend code in {otpTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-amber-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend OTP Code</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 hover:bg-emerald-800 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition cursor-pointer disabled:opacity-60 active:scale-95"
              >
                {submitting ? (
                  <>
                    <BrandSpinner size="xs" variant="white" inline={true} />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span>Verify &amp; Create Account</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-500 hover:text-black font-semibold cursor-pointer"
                >
                  &larr; Back to Registration Form
                </button>
              </div>
            </form>
          )}

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