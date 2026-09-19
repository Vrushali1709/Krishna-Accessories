// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setAdminUser, setSupplierUser, setCustomerUser, setAuthToken } from '../utils/auth';
import { usersApi, authApi } from '../utils/api';
import { syncCartFromBackend } from '../utils/cart';
import { syncWishlistFromBackend } from '../utils/productStore';
import { syncAddressesFromBackend } from '../utils/orderStore';
import { sendOtpEmail, verifyOtp, resendOtp, sendPasswordResetSuccessEmail } from '../utils/emailService';
import { LockClosedIcon, ArrowRightIcon, ShieldCheckIcon } from '../components/Icons';
import {
  Eye,
  EyeOff,
  RefreshCw,
  KeyRound,
  Mail,
  Sparkles,
  Shield,
  ArrowLeft,
  Lock,
  ShoppingBag,
  Truck,
  Award,
  User,
  Building2,
  ShieldAlert,
  Star,
  CheckCircle2,
  X
} from 'lucide-react';
import { useLoading } from '../context/LoadingContext';
import BrandSpinner from '../components/BrandSpinner';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [submitting, setSubmitting] = useState(false);

  // Authentication Mode: 'password' or 'otp'
  const [authMode, setAuthMode] = useState('password');

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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login with OTP State
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtpCode, setLoginOtpCode] = useState('');
  const [loginOtpTimer, setLoginOtpTimer] = useState(60);

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtpCode, setForgotOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotOtpTimer, setForgotOtpTimer] = useState(60);
  const [sendingForgotOtp, setSendingForgotOtp] = useState(false);

  const redirectMessage = location.state?.message || '';
  const returnPath = typeof location.state?.from === 'string'
    ? location.state.from
    : (location.state?.from?.pathname ? `${location.state.from.pathname}${location.state.from.search || ''}` : null);

  // Resend Timer Countdown Effect for Login OTP
  useEffect(() => {
    let interval = null;
    if (loginOtpSent && loginOtpTimer > 0) {
      interval = setInterval(() => {
        setLoginOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loginOtpSent, loginOtpTimer]);

  // Resend Timer Countdown Effect for Forgot Password OTP
  useEffect(() => {
    let interval = null;
    if (forgotOtpSent && forgotOtpTimer > 0) {
      interval = setInterval(() => {
        setForgotOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [forgotOtpSent, forgotOtpTimer]);

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

  // Standard Password Authentication
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please provide your Email ID and Password.');
      return;
    }

    setSubmitting(true);
    showLoading('Authenticating with Krishna Backend...');
    try {
      const result = await usersApi.login({ email: cleanEmail, password: cleanPassword, role: selectedRole });
      setAuthToken(result.token);
      await Promise.all([syncCartFromBackend(), syncWishlistFromBackend(), syncAddressesFromBackend()]);
      const user = result.user;
      if (user.role?.toLowerCase() === 'admin') setAdminUser(user);
      else if (user.role?.toLowerCase() === 'supplier') setSupplierUser(user);
      else setCustomerUser({ ...user, role: 'customer' });
      navigate(returnPath || (user.role?.toLowerCase() === 'admin' ? '/admin' : user.role?.toLowerCase() === 'supplier' ? '/supplier' : '/account'), { replace: true });
    } catch (loginError) {
      setError(loginError.message || 'Unable to sign in. Please check your credentials.');
    } finally {
      setSubmitting(false);
      hideLoading();
    }
  };

  // Login With OTP: Send Code
  const handleSendLoginOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    const res = await sendOtpEmail(cleanEmail, 'login_otp');
    setSubmitting(false);

    if (res.success) {
      setLoginOtpSent(true);
      setLoginOtpTimer(60);
      setSuccess(`✓ Security OTP code dispatched to ${cleanEmail}`);
    } else {
      setError(res.error || 'Failed to send OTP email. Please try again.');
    }
  };

  // Login With OTP: Verify Code & Sign In
  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = loginOtpCode.trim();

    if (!cleanCode || cleanCode.length < 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    const verifyResult = await verifyOtp(cleanEmail, cleanCode, 'login_otp');
    if (!verifyResult.success) {
      setError(verifyResult.error);
      return;
    }

    setSubmitting(true);
    showLoading('Verifying OTP & Logging In...');
    setTimeout(async () => {
      setAuthToken(verifyResult.token);
      setCustomerUser(verifyResult.user || { email: cleanEmail, role: 'customer', name: cleanEmail.split('@')[0] });
      await Promise.all([syncCartFromBackend(), syncWishlistFromBackend(), syncAddressesFromBackend()]);
      setSubmitting(false);
      hideLoading();
      navigate(returnPath || '/account', { replace: true });
    }, 400);
  };

  // Resend Login OTP
  const handleResendLoginOtp = async () => {
    if (loginOtpTimer > 0) return;
    setError('');
    const res = await resendOtp(email, 'login_otp');
    if (res.success) {
      setLoginOtpTimer(60);
      setSuccess('✓ Fresh OTP code sent to your email.');
    } else {
      setError(res.error || 'Failed to resend code.');
    }
  };

  // Forgot Password: Send OTP
  const handleSendForgotOtp = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    const cleanEmail = forgotEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setForgotError('Please enter a valid registered email address.');
      return;
    }

    setSendingForgotOtp(true);
    const res = await sendOtpEmail(cleanEmail, 'forgot_password');
    setSendingForgotOtp(false);

    if (res.success) {
      setForgotOtpSent(true);
      setForgotOtpTimer(60);
      setForgotSuccess(`✓ 6-Digit OTP security code delivered to ${cleanEmail}`);
    } else {
      setForgotError(res.error || 'Failed to send reset code.');
    }
  };

  // Forgot Password: Verify & Reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError('');

    const cleanEmail = forgotEmail.trim().toLowerCase();
    const cleanCode = forgotOtpCode.trim();

    if (!cleanCode || cleanCode.length < 6) {
      setForgotError('Please enter the 6-digit OTP code.');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setForgotError('New password must be at least 4 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError('New password and confirm password do not match.');
      return;
    }

    const verifyResult = await verifyOtp(cleanEmail, cleanCode, 'forgot_password');
    if (!verifyResult.success) {
      setForgotError(verifyResult.error);
      return;
    }

    await authApi.resetPassword(cleanEmail, newPassword);

    // Send confirmation security notification
    await sendPasswordResetSuccessEmail(cleanEmail);

    setForgotSuccess('✓ Password reset successfully! You can now sign in with your new password.');
    setTimeout(() => {
      setForgotModalOpen(false);
      setForgotOtpSent(false);
      setForgotEmail('');
      setForgotOtpCode('');
      setNewPassword('');
      setConfirmPassword('');
      setForgotSuccess('');
    }, 2000);
  };

  // Resend Forgot Password OTP
  const handleResendForgotOtp = async () => {
    if (forgotOtpTimer > 0) return;
    setForgotError('');
    const res = await resendOtp(forgotEmail, 'forgot_password');
    if (res.success) {
      setForgotOtpTimer(60);
      setForgotSuccess('✓ New reset OTP code delivered to your email.');
    } else {
      setForgotError(res.error || 'Failed to resend code.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] lg:bg-slate-100 flex items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-hidden font-sans select-none">
      
      {/* Subtle Background Ambient Aura on Large Screens */}
      <div className="hidden lg:block pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-amber-400/10 blur-[140px]" />
      <div className="hidden lg:block pointer-events-none absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[140px]" />
      <div className="hidden lg:block pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-slate-300/20 blur-[160px]" />

      {/* Main Dual-Column Luxury Showcase Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl lg:rounded-[32px] shadow-2xl shadow-slate-900/15 border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 z-10 transition-all duration-300">

        {/* ================= LEFT COLUMN: LUXURY BRAND STORY & PRIVILEGES ================= */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-[#0B132B] to-[#1E293B] text-white p-7 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          
          {/* Decorative Gold & Indigo Background Gradients */}
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
                <span>Member Privileges &amp; Concierge</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
                Welcome to the World of Refined Elegance.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed">
                Sign in to seamlessly access your private wishlist, curated orders, bespoke collections, and priority concierge.
              </p>
            </div>
          </div>

          {/* Value Propositions / Luxury Perks (Desktop & Tablet) */}
          <div className="relative z-10 space-y-3.5 my-8 hidden sm:block">
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xs">
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">Curated Exclusive Collections</h4>
                <p className="text-[11px] text-slate-400">First-access to limited edition timepieces and bespoke fine jewelry.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xs">
              <div className="p-2 rounded-xl bg-blue-400/10 text-blue-400 border border-blue-400/20 shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">Live Timeline Order Tracking</h4>
                <p className="text-[11px] text-slate-400">Real-time status updates and priority insured white-glove dispatch.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xs">
              <div className="p-2 rounded-xl bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">100% Certified Authenticity</h4>
                <p className="text-[11px] text-slate-400">Lifetime warranty support and verified craftsmanship guarantees.</p>
              </div>
            </div>
          </div>

          {/* Social Proof Footer Badge */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300">
              <div className="flex -space-x-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[11px] font-bold text-slate-200">4.9 / 5 Rating</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">10,000+ Connoisseurs</span>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE AUTHENTICATION PANEL ================= */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          
          <div className="space-y-6">

            {/* Top Navigation & Security Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-950 transition group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition group-hover:-translate-x-1" />
                <span>Return to Store</span>
              </Link>
              
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                <Shield className="w-3 h-3 text-emerald-600" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>

            {/* Header Content */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
                Sign In to Account
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Welcome back! Please enter your details or use instant OTP sign-in.
              </p>
            </div>

            {/* Redirect Notice Message */}
            {redirectMessage && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-3.5 text-xs text-amber-900 font-medium flex items-center gap-3 shadow-xs animate-fade-in">
                <span className="text-lg">🔒</span>
                <div>
                  <strong className="font-bold block text-amber-950">Authentication Required</strong>
                  <span>{redirectMessage}</span>
                </div>
              </div>
            )}

            {/* Auth Method Selector Tabs (Password vs OTP) */}
            <div className="flex items-center p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('password');
                  setError('');
                  setSuccess('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === 'password'
                    ? 'bg-white text-slate-950 shadow-sm border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Password Login</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('otp');
                  setError('');
                  setSuccess('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === 'otp'
                    ? 'bg-white text-slate-950 shadow-sm border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Instant OTP Sign In</span>
              </button>
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

            {/* ================= METHOD 1: PASSWORD LOGIN ================= */}
            {authMode === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-4" autoComplete="off">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      autoComplete="off"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={
                        selectedRole === 'supplier'
                          ? 'supplier@krishna.com'
                          : selectedRole === 'admin'
                            ? 'admin@krishna.com'
                            : 'user@example.com'
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotModalOpen(true);
                        setForgotEmail(email);
                        setForgotError('');
                        setForgotSuccess('');
                      }}
                      className="text-[11px] text-amber-800 font-bold hover:text-amber-900 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-11 py-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 cursor-pointer p-1"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 hover:bg-black py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-slate-950/15 transition-all cursor-pointer disabled:opacity-60 active:scale-[0.99]"
                >
                  {submitting ? (
                    <>
                      <BrandSpinner size="xs" variant="gold" inline={true} />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In with Password</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ================= METHOD 2: SIGN IN VIA EMAIL OTP ================= */}
            {authMode === 'otp' && (
              <div className="space-y-4">
                {!loginOtpSent ? (
                  <form onSubmit={handleSendLoginOtp} className="space-y-4">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Enter your registered email address to receive an instant, secure 6-digit OTP code for passwordless sign-in.
                    </p>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                        Registered Email Address
                      </label>
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
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 hover:bg-black py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-slate-950/15 transition-all cursor-pointer disabled:opacity-60 active:scale-[0.99]"
                    >
                      {submitting ? (
                        <>
                          <BrandSpinner size="xs" variant="gold" inline={true} />
                          <span>Sending Security OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Send 6-Digit OTP</span>
                          <ArrowRightIcon className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="truncate">Sent code to: <strong>{email}</strong></span>
                      <button
                        type="button"
                        onClick={() => setLoginOtpSent(false)}
                        className="text-amber-800 font-bold hover:underline shrink-0 ml-2"
                      >
                        Change Email
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
                        value={loginOtpCode}
                        onChange={(e) => setLoginOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••••"
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-center text-xl font-mono font-bold tracking-[0.35em] text-slate-900 outline-none focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                        autoFocus
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>⏱️ Code valid for 5 mins</span>
                      {loginOtpTimer > 0 ? (
                        <span className="text-slate-400 font-mono">Resend in {loginOtpTimer}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendLoginOtp}
                          className="text-amber-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Resend Code</span>
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
                          <span>Verifying &amp; Logging In...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify &amp; Enter Dashboard</span>
                          <ArrowRightIcon className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Quick Role Selection Tabs */}
            <div className="border-t border-slate-100 pt-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Select Account Portal
                </span>
                <span className="text-[10px] text-slate-400">Choose your access type</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectRole('customer')}
                  className={`rounded-2xl p-2.5 text-xs transition flex flex-col items-center justify-center gap-1 cursor-pointer font-bold border ${
                    selectedRole === 'customer'
                      ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Customer</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRole('supplier')}
                  className={`rounded-2xl p-2.5 text-xs transition flex flex-col items-center justify-center gap-1 cursor-pointer font-bold border ${
                    selectedRole === 'supplier'
                      ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Supplier</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRole('admin')}
                  className={`rounded-2xl p-2.5 text-xs transition flex flex-col items-center justify-center gap-1 cursor-pointer font-bold border ${
                    selectedRole === 'admin'
                      ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

          </div>

          {/* Card Bottom: Registration Link */}
          <div className="pt-6 mt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don&apos;t have an account yet?{' '}
            <Link
              to="/register"
              state={location.state}
              className="font-bold text-slate-950 hover:text-amber-800 hover:underline transition"
            >
              Create Luxury Account &rarr;
            </Link>
          </div>

        </div>

      </div>

      {/* ================= FORGOT PASSWORD REAL OTP MODAL ================= */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-950 tracking-tight">Reset Account Password</h3>
                  <p className="text-[11px] text-slate-500">Secure verification via email OTP</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="h-7 w-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotError && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 animate-fade-in flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 animate-fade-in flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {!forgotOtpSent ? (
              <form onSubmit={handleSendForgotOtp} className="space-y-4 text-xs">
                <p className="text-slate-600 leading-relaxed">
                  Enter your registered account email address. We will dispatch a 6-digit OTP code to verify your identity.
                </p>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Registered Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="registered@example.com"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={sendingForgotOtp}
                  className="w-full rounded-2xl bg-slate-950 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition cursor-pointer disabled:opacity-60 active:scale-95 shadow-md"
                >
                  {sendingForgotOtp ? 'Dispatching Reset OTP...' : 'Send 6-Digit OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3.5 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-slate-700">6-Digit Verification Code</label>
                    <span className="text-[10px] text-slate-400">Sent to {forgotEmail}</span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={forgotOtpCode}
                    onChange={(e) => setForgotOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-slate-900 focus:bg-white tracking-[0.3em] text-center font-bold text-base font-mono"
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>⏱️ Valid for 5 mins</span>
                  {forgotOtpTimer > 0 ? (
                    <span className="font-mono text-slate-400">Resend in {forgotOtpTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendForgotOtp}
                      className="text-amber-800 font-bold hover:underline cursor-pointer"
                    >
                      Resend Code
                    </button>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">New Strong Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 4 chars)"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-slate-950 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition cursor-pointer active:scale-95 shadow-md mt-2"
                >
                  Save New Password &amp; Continue
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}