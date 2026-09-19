// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setCurrentUser, setAuthToken } from '../utils/auth';
import { usersApi } from '../utils/api';
import { addSupplier } from '../utils/orderStore';
import { sendOtpEmail, verifyOtp, resendOtp, sendWelcomeEmail } from '../utils/emailService';
import { ArrowRightIcon, ShieldCheckIcon } from '../components/Icons';
import {
  RefreshCw,
  Mail,
  KeyRound,
  ArrowLeft,
  Sparkles,
  Shield,
  ShoppingBag,
  Truck,
  Award,
  User,
  Phone,
  Building2,
  Lock,
  Star,
  CheckCircle2,
  ShieldAlert
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
    <div className="min-h-screen bg-[#0F172A] lg:bg-slate-100 flex items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-hidden font-sans select-none">
      
      {/* Subtle Background Ambient Aura on Large Screens */}
      <div className="hidden lg:block pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-amber-400/10 blur-[140px]" />
      <div className="hidden lg:block pointer-events-none absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[140px]" />
      <div className="hidden lg:block pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-slate-300/20 blur-[160px]" />

      {/* Main Dual-Column Luxury Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl lg:rounded-[32px] shadow-2xl shadow-slate-900/15 border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 z-10 transition-all duration-300">

        {/* ================= LEFT COLUMN: LUXURY BRAND STORY ================= */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-[#0B132B] to-[#1E293B] text-white p-7 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          
          <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-amber-500/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

          {/* Top Brand Block */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md p-1.5 border border-amber-400/30 shadow-lg flex items-center justify-center shrink-0">
                <img
                  src="/images/krishna-logo.png"
                  alt="Krishna Accessories"
                  className="h-full w-full object-contain filter drop-shadow"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400/90 block font-mono">
                  Haute Horlogerie &amp; Luxury
                </span>
                <span className="text-lg font-bold tracking-tight text-white">
                  KRISHNA ACCESSORIES
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[11px] font-medium tracking-wide">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>Privé Membership Invitation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
                Join India&apos;s Premier Luxury Society.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed">
                Unlock exclusive member benefits, early private sale drops, and personalized concierge assistance.
              </p>
            </div>
          </div>

          {/* Value Propositions */}
          <div className="relative z-10 space-y-3.5 my-8 hidden sm:block">
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xs">
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">Welcome Reward Privilege</h4>
                <p className="text-[11px] text-slate-400">Receive special celebratory welcome perks on your inaugural order.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xs">
              <div className="p-2 rounded-xl bg-blue-400/10 text-blue-400 border border-blue-400/20 shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">Direct Vendor &amp; Client Portals</h4>
                <p className="text-[11px] text-slate-400">Dedicated portals for luxury retail customers and supplier partners.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xs">
              <div className="p-2 rounded-xl bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">Zero Spam, 100% Security</h4>
                <p className="text-[11px] text-slate-400">Your privacy is safeguarded by strict enterprise encryption protocols.</p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300">
              <div className="flex -space-x-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[11px] font-bold text-slate-200">4.9 / 5 Trust Score</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">10,000+ Active Members</span>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: REGISTRATION FORM ================= */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          
          <div className="space-y-6">

            {/* Top Navigation & Stepper */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-950 transition group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition group-hover:-translate-x-1" />
                <span>Existing Member? Sign In</span>
              </Link>
              
              {/* Stepper Dots */}
              <div className="flex items-center gap-2">
                <div className={`h-2 rounded-full transition-all duration-300 ${step === 1 ? 'w-6 bg-slate-950' : 'w-2 bg-emerald-600'}`} />
                <div className={`h-2 rounded-full transition-all duration-300 ${step === 2 ? 'w-6 bg-slate-950' : 'w-2 bg-slate-200'}`} />
              </div>
            </div>

            {/* Header Content */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block font-mono">
                {step === 1 ? 'Registration Step 1 of 2' : 'Security Step 2 of 2'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
                {step === 1 ? 'Create Luxury Account' : 'Verify Email Address'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {step === 1
                  ? 'Join our community for bespoke concierge shopping and fast checkout.'
                  : `We dispatched a 6-digit verification code to ${email}`}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50/90 p-3.5 text-xs text-red-700 font-semibold flex items-center gap-2.5 animate-fade-in">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-xs text-emerald-800 font-semibold flex items-center gap-2.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* ================= STEP 1: REGISTRATION INPUT FORM ================= */}
            {step === 1 && (
              <form onSubmit={handleInitiateRegister} className="space-y-3.5" autoComplete="off">
                
                {/* Full Name / Business Name */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">
                    {role === 'Supplier' ? 'Company / Business Name *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={role === 'Supplier' ? "e.g. Apex Timepieces Ltd." : "e.g. Rahul Patel"}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                    />
                  </div>
                </div>

                {/* Email Address & Phone Number (2 Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Email Address *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Phone Number *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 12345"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Role Choice */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Select Account Role *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('Customer')}
                      className={`p-2.5 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        role === 'Customer'
                          ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                          : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Customer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('Supplier')}
                      className={`p-2.5 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        role === 'Supplier'
                          ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                          : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Supplier Partner</span>
                    </button>
                  </div>
                </div>

                {role === 'Supplier' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Primary Category *</label>
                    <select
                      value={supplierCategory}
                      onChange={(e) => setSupplierCategory(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-900 outline-none transition-all focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 cursor-pointer font-medium"
                    >
                      <option value="Watches">Watches &amp; Horology</option>
                      <option value="Bags & Wallets">Bags &amp; Leather Wallets</option>
                      <option value="Shoes">Footwear &amp; Sneakers</option>
                      <option value="Mobiles">Mobiles &amp; Smart Tech</option>
                      <option value="Clothes & Fashion">Clothes &amp; Luxury Apparel</option>
                      <option value="Laptops">Laptops &amp; Workstations</option>
                      <option value="Electronics">Electronics &amp; Audio</option>
                    </select>
                  </div>
                )}

                {/* Password Input */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Security Password *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="•••••••• (min 4 characters)"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 hover:bg-black py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-slate-950/15 transition-all cursor-pointer disabled:opacity-60 active:scale-[0.99] mt-2"
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
                <div className="flex items-center justify-between text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200">
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
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                    Enter 6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-center text-xl font-mono font-bold tracking-[0.35em] text-slate-900 outline-none focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>⏱️ Code valid for 5 mins</span>
                  {otpTimer > 0 ? (
                    <span className="text-slate-400 font-mono">Resend code in {otpTimer}s</span>
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
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all cursor-pointer disabled:opacity-60 active:scale-[0.99]"
                >
                  {submitting ? (
                    <>
                      <BrandSpinner size="xs" variant="white" inline={true} />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="w-4 h-4" />
                      <span>Verify &amp; Create Luxury Account</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-slate-500 hover:text-slate-950 font-semibold cursor-pointer"
                  >
                    &larr; Back to Registration Form
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Card Bottom: Existing Member Sign In Link */}
          <div className="pt-6 mt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-slate-950 hover:text-amber-800 hover:underline transition">
              Sign In to Your Account &rarr;
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}