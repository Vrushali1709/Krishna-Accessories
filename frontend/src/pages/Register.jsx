// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { setCurrentUser, setAuthToken } from '../utils/auth';
import { usersApi } from '../utils/api';
import { addSupplier } from '../utils/orderStore';
import { sendOtpEmail, verifyOtp, resendOtp, sendWelcomeEmail } from '../utils/emailService';
import { ArrowRightIcon, LockClosedIcon, ShieldCheckIcon } from '../components/Icons';
import {
  RefreshCw,
  Mail,
  ArrowLeft,
  KeyRound,
  User,
  Phone,
  Building2,
  Sparkles,
  CheckCircle2,
  Gift,
  Shield,
  Clock,
  Briefcase
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
      setError('Please fill out all required registration fields.');
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
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 flex flex-col justify-between selection:bg-amber-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 lg:py-16">
        <div className="w-full max-w-5xl rounded-[2.5rem] bg-white border border-gray-200/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">

            {/* ================= LEFT COLUMN: BRAND HERO SHOWCASE ================= */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0B1120] via-[#0F172A] to-[#1E293B] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
              {/* Decorative Glow */}
              <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

              {/* Top Header */}
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md border border-amber-400/30 p-1 flex items-center justify-center shadow-inner">
                    <img
                      src="/images/krishna-logo.png"
                      alt="Krishna Accessories Logo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-400 block">
                      Membership Enrollment
                    </span>
                    <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-tight">
                      Krishna <span className="text-amber-400">Accessories</span>
                    </h1>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Join Krishna Privé Club</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-tight">
                    {step === 1 ? 'Unlock Bespoke Privileges' : 'Verify Security Credentials'}
                  </h2>
                  <p className="mt-2.5 text-xs text-slate-300 leading-relaxed max-w-sm">
                    {step === 1
                      ? 'Register for exclusive previews, automated delivery tracking, and bespoke client support.'
                      : `We have dispatched a 6-digit verification code to ${email}.`}
                  </p>
                </div>
              </div>

              {/* Membership Benefits List */}
              <div className="relative z-10 my-8 space-y-3.5">
                <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm transition hover:bg-white/10">
                  <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 shrink-0">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Instant 10% Welcome Voucher</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Delivered to your email upon instant OTP verification</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm transition hover:bg-white/10">
                  <div className="p-2 rounded-xl bg-blue-400/10 text-blue-400 shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Vendor &amp; Supplier Portal</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Publish products & manage fulfillment directly</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm transition hover:bg-white/10">
                  <div className="p-2 rounded-xl bg-emerald-400/10 text-emerald-400 shrink-0">
                    <ShieldCheckIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Bank-Grade Verification</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Guaranteed protection of buyer data & credentials</p>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Info */}
              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>📍 Mumbai Boutique Hub</span>
                <span className="text-amber-400 font-semibold">100% Genuine Guaranteed</span>
              </div>
            </div>

            {/* ================= RIGHT COLUMN: REGISTRATION FORM ================= */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
              <div className="space-y-5">

                {/* Stepper Indicator */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      Step {step} of 2
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {step === 1 ? 'Profile Information' : 'Email Security Verification'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${step === 1 ? 'bg-amber-600' : 'bg-emerald-600'}`} />
                    <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${step === 2 ? 'bg-amber-600' : 'bg-gray-200'}`} />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950 tracking-tight">
                    {step === 1 ? 'Create Your Account' : 'Verify Email Address'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {step === 1
                      ? 'Fill out your profile details to join Krishna Accessories client network.'
                      : `Enter the 6-digit OTP code sent to ${email} to activate your profile.`}
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-semibold flex items-center gap-2.5 animate-fade-in shadow-xs">
                    <span className="text-red-500 text-sm">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Success Banner */}
                {success && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-semibold flex items-center gap-2.5 animate-fade-in shadow-xs">
                    <ShieldCheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {/* ================= STEP 1: REGISTRATION INPUT FORM ================= */}
                {step === 1 && (
                  <form onSubmit={handleInitiateRegister} className="space-y-3.5">
                    {/* Role Selection Tabs */}
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                        Select Account Type
                      </label>
                      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100/80 rounded-2xl border border-gray-200/80">
                        <button
                          type="button"
                          onClick={() => setRole('Customer')}
                          className={`py-2 px-3 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                            role === 'Customer'
                              ? 'bg-white text-gray-950 shadow-sm border border-gray-200/60'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Customer Account</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRole('Supplier')}
                          className={`py-2 px-3 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                            role === 'Supplier'
                              ? 'bg-white text-blue-950 shadow-sm border border-blue-200'
                              : 'text-gray-500 hover:text-blue-900'
                          }`}
                        >
                          <Building2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Supplier / Vendor</span>
                        </button>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>{role === 'Supplier' ? 'Company / Business Name *' : 'Full Name *'}</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={role === 'Supplier' ? "e.g. Apex Timepieces Ltd." : "e.g. Rahul Patel"}
                        className="w-full rounded-2xl border border-gray-200 bg-[#F8F9FA] px-4 py-2.5 text-xs text-gray-900 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/10 font-medium"
                      />
                    </div>

                    {/* Email & Phone Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span>Email Address *</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="user@example.com"
                          className="w-full rounded-2xl border border-gray-200 bg-[#F8F9FA] px-4 py-2.5 text-xs text-gray-900 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/10 font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>Phone Number *</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 12345"
                          className="w-full rounded-2xl border border-gray-200 bg-[#F8F9FA] px-4 py-2.5 text-xs text-gray-900 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/10 font-medium"
                        />
                      </div>
                    </div>

                    {/* Supplier Category if Supplier */}
                    {role === 'Supplier' && (
                      <div>
                        <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                          <span>Primary Product Category *</span>
                        </label>
                        <select
                          value={supplierCategory}
                          onChange={(e) => setSupplierCategory(e.target.value)}
                          className="w-full rounded-2xl border border-gray-200 bg-[#F8F9FA] px-4 py-2.5 text-xs text-gray-900 outline-none transition focus:border-amber-600 focus:bg-white cursor-pointer font-medium"
                        >
                          <option value="Watches">⌚ Watches & Horology</option>
                          <option value="Bags & Wallets">👜 Bags & Leather Wallets</option>
                          <option value="Shoes">👟 Footwear & Luxury Sneakers</option>
                          <option value="Mobiles">📱 Mobiles & Smart Tech</option>
                          <option value="Clothes & Fashion">👔 Clothes & Luxury Apparel</option>
                          <option value="Laptops">💻 Laptops & Workstations</option>
                          <option value="Electronics">🎧 Electronics & Audio</option>
                        </select>
                      </div>
                    )}

                    {/* Password */}
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <LockClosedIcon className="w-3.5 h-3.5 text-gray-400" />
                        <span>Create Strong Password *</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full rounded-2xl border border-gray-200 bg-[#F8F9FA] px-4 py-2.5 text-xs text-gray-900 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/10 font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gray-950 via-slate-900 to-gray-950 hover:from-black hover:to-neutral-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-200 mt-2 disabled:opacity-60 cursor-pointer active:scale-[0.98]"
                    >
                      {submitting ? (
                        <>
                          <BrandSpinner size="xs" variant="gold" inline={true} />
                          <span>Dispatching Security OTP...</span>
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
                  <form onSubmit={handleVerifyAndComplete} className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between text-xs text-gray-700 bg-amber-50/80 p-3 rounded-2xl border border-amber-200/80">
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="w-4 h-4 text-amber-700 shrink-0" />
                        <span className="truncate">Verification Email: <strong>{email}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setStep(1);
                          setError('');
                          setSuccess('');
                        }}
                        className="text-amber-800 font-bold hover:underline shrink-0 ml-2 flex items-center gap-1 cursor-pointer text-[11px]"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                        <span>Enter 6-Digit OTP Code</span>
                        <span className="text-[11px] text-gray-400 font-normal">Check Inbox / Spam</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••••"
                        className="w-full rounded-2xl border border-gray-300 bg-[#F8F9FA] px-4 py-3.5 text-center text-xl font-mono font-black tracking-[0.4em] text-gray-900 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/10"
                        autoFocus
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>Code valid for 5 mins</span>
                      </div>
                      {otpTimer > 0 ? (
                        <span className="text-amber-800 font-mono font-bold">Resend in {otpTimer}s</span>
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
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-200 cursor-pointer disabled:opacity-60 active:scale-[0.98]"
                    >
                      {submitting ? (
                        <>
                          <BrandSpinner size="xs" variant="white" inline={true} />
                          <span>Verifying &amp; Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheckIcon className="w-4 h-4" />
                          <span>Verify &amp; Activate Account</span>
                        </>
                      )}
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs text-gray-500 hover:text-black font-semibold cursor-pointer transition"
                      >
                        &larr; Back to Registration Form
                      </button>
                    </div>
                  </form>
                )}

              </div>

              {/* Sign In Link */}
              <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
                Already registered with Krishna Accessories?{' '}
                <Link
                  to="/login"
                  className="font-bold text-gray-950 hover:text-amber-800 transition underline underline-offset-4"
                >
                  Sign In to Account &rarr;
                </Link>
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}