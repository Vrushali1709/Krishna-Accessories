// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { setAdminUser, setSupplierUser, setCustomerUser, setAuthToken } from '../utils/auth';
import { usersApi, authApi } from '../utils/api';
import { syncCartFromBackend } from '../utils/cart';
import { syncWishlistFromBackend } from '../utils/productStore';
import { syncAddressesFromBackend } from '../utils/orderStore';
import { sendOtpEmail, verifyOtp, resendOtp, sendPasswordResetSuccessEmail } from '../utils/emailService';
import { LockClosedIcon, UserIcon, ArrowRightIcon, ShieldCheckIcon } from '../components/Icons';
import {
  Eye,
  EyeOff,
  RefreshCw,
  KeyRound,
  Mail,
  Shield,
  Sparkles,
  CheckCircle2,
  Building2,
  UserCheck,
  Lock,
  ArrowUpRight,
  Clock
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
    if (role === 'customer') {
      setEmail('rahul.patel@example.com');
      setPassword('customer123');
    } else if (role === 'admin') {
      setEmail('admin@krishna.com');
      setPassword('krishna123');
    } else if (role === 'supplier') {
      setEmail('supplier@krishna.com');
      setPassword('supplier123');
    } else {
      setEmail('');
      setPassword('');
    }
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
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 flex flex-col justify-between selection:bg-amber-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 lg:py-16">
        <div className="w-full max-w-5xl rounded-[2.5rem] bg-white border border-gray-200/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">

            {/* ================= LEFT COLUMN: LUXURY BRAND HERO SHOWCASE ================= */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0B1120] via-[#0F172A] to-[#1E293B] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
              {/* Decorative Luxury Background Glow Rings */}
              <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

              {/* Brand Top Header */}
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
                      Privé Concierge
                    </span>
                    <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-tight">
                      Krishna <span className="text-amber-400">Accessories</span>
                    </h1>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Exclusive Luxury Portals</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-tight">
                    Seamless Access to Bespoke Luxury
                  </h2>
                  <p className="mt-2.5 text-xs text-slate-300 leading-relaxed max-w-sm">
                    Sign in to track luxury horology orders, manage your curated wishlist, and access dedicated partner consoles.
                  </p>
                </div>
              </div>

              {/* Luxury Feature Pillars */}
              <div className="relative z-10 my-8 space-y-4">
                <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm transition hover:bg-white/10">
                  <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 shrink-0">
                    <ShieldCheckIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Bank-Grade 256-Bit Security</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Instant OTP email verification & encrypted session tokens</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm transition hover:bg-white/10">
                  <div className="p-2 rounded-xl bg-blue-400/10 text-blue-400 shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Multi-Role Architecture</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Custom portals for Customers, Vendor Suppliers & Staff Admins</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm transition hover:bg-white/10">
                  <div className="p-2 rounded-xl bg-emerald-400/10 text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">100% Genuine Certified Goods</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Direct luxury supply chain with verified authentic warranties</p>
                  </div>
                </div>
              </div>

              {/* Boutique Footer Trust Stamp */}
              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>📍 Mumbai Boutique Hub</span>
                <span className="text-amber-400 font-semibold">24/7 Concierge Support</span>
              </div>
            </div>

            {/* ================= RIGHT COLUMN: INTERACTIVE AUTH FORM ================= */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
              <div className="space-y-6">

                {/* Top Role Selector Tabs */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      Select Access Level
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {selectedRole.toUpperCase()} PORTAL
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100/80 rounded-2xl border border-gray-200/80">
                    <button
                      type="button"
                      onClick={() => handleSelectRole('customer')}
                      className={`py-2 px-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                        selectedRole === 'customer'
                          ? 'bg-white text-gray-950 shadow-sm border border-gray-200/60'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <UserIcon className="w-3.5 h-3.5 text-gray-700" />
                      <span className="truncate">Customer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectRole('supplier')}
                      className={`py-2 px-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                        selectedRole === 'supplier'
                          ? 'bg-white text-blue-900 shadow-sm border border-blue-200'
                          : 'text-gray-500 hover:text-blue-900'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      <span className="truncate">Supplier</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectRole('admin')}
                      className={`py-2 px-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                        selectedRole === 'admin'
                          ? 'bg-white text-amber-950 shadow-sm border border-amber-300'
                          : 'text-gray-500 hover:text-amber-950'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5 text-amber-600" />
                      <span className="truncate">Admin</span>
                    </button>
                  </div>
                </div>

                {/* Form Title & Subtitle */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950 tracking-tight">
                    {selectedRole === 'admin'
                      ? 'Administrator Sign In'
                      : selectedRole === 'supplier'
                        ? 'Vendor Partner Portal Login'
                        : 'Sign In to Your Account'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedRole === 'admin'
                      ? 'Staff verification required to access site settings, inventory & orders.'
                      : selectedRole === 'supplier'
                        ? 'Manage your supplied product listings, catalog inventory, and settlements.'
                        : 'Welcome back! Access your saved bag, order timeline tracking & addresses.'}
                  </p>
                </div>

                {/* Redirect Notice Banner */}
                {redirectMessage && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-950 font-medium flex items-center gap-3 animate-fade-in shadow-xs">
                    <div className="p-1.5 rounded-xl bg-amber-200/60 text-amber-900 shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="font-bold block text-amber-950">Authentication Required</strong>
                      <span>{redirectMessage}</span>
                    </div>
                  </div>
                )}

                {/* Auth Method Selector Tabs (Password vs Instant OTP) */}
                <div className="flex items-center p-1 rounded-2xl bg-gray-100/80 border border-gray-200/80">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('password');
                      setError('');
                      setSuccess('');
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      authMode === 'password'
                        ? 'bg-white text-gray-950 shadow-xs border border-gray-200/60'
                        : 'text-gray-500 hover:text-gray-900'
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
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      authMode === 'otp'
                        ? 'bg-white text-gray-950 shadow-xs border border-gray-200/60'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email OTP Login</span>
                  </button>
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

                {/* ================= METHOD 1: PASSWORD LOGIN ================= */}
                {authMode === 'password' && (
                  <form onSubmit={handlePasswordLogin} className="space-y-4" autoComplete="off">
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>Email Address</span>
                      </label>
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
                        className="w-full rounded-2xl border border-gray-200 bg-[#F8F9FA] px-4 py-3 text-xs text-gray-900 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/10 font-medium"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                          <LockClosedIcon className="w-3.5 h-3.5 text-gray-400" />
                          <span>Password</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setForgotModalOpen(true);
                            setForgotEmail(email);
                            setForgotError('');
                            setForgotSuccess('');
                          }}
                          className="text-[11px] text-amber-800 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                        >
                          <span>Forgot Password?</span>
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full rounded-2xl border border-gray-200 bg-[#F8F9FA] px-4 py-3 pr-11 text-xs text-gray-900 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/10 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((visible) => !visible)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 cursor-pointer p-1"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gray-950 via-slate-900 to-gray-950 hover:from-black hover:to-neutral-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-200 cursor-pointer disabled:opacity-60 active:scale-[0.98] border border-slate-800"
                    >
                      {submitting ? (
                        <>
                          <BrandSpinner size="xs" variant="gold" inline={true} />
                          <span>Authenticating Access...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to {selectedRole === 'admin' ? 'Admin Panel' : selectedRole === 'supplier' ? 'Supplier Portal' : 'Store'}</span>
                          <ArrowRightIcon className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ================= METHOD 2: SIGN IN VIA EMAIL OTP ================= */}
                {authMode === 'otp' && (
                  <div className="animate-fade-in">
                    {!loginOtpSent ? (
                      <form onSubmit={handleSendLoginOtp} className="space-y-4">
                        <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-3.5 text-xs text-gray-600 flex items-start gap-3">
                          <span className="text-amber-600 text-base">✨</span>
                          <span>Passwordless instant login. We will send a secure 6-digit code to your email.</span>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span>Your Registered Email</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="w-full rounded-2xl border border-gray-200 bg-[#F8F9FA] px-4 py-3 text-xs text-gray-900 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/10 font-medium"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gray-950 via-slate-900 to-gray-950 hover:from-black hover:to-neutral-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-200 cursor-pointer disabled:opacity-60 active:scale-[0.98]"
                        >
                          {submitting ? (
                            <>
                              <BrandSpinner size="xs" variant="gold" inline={true} />
                              <span>Dispatching Security OTP...</span>
                            </>
                          ) : (
                            <>
                              <span>Send 6-Digit Login Code</span>
                              <ArrowRightIcon className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
                        <div className="flex items-center justify-between text-xs text-gray-700 bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80">
                          <div className="flex items-center gap-2 min-w-0">
                            <Mail className="w-4 h-4 text-amber-700 shrink-0" />
                            <span className="truncate">Sent to: <strong>{email}</strong></span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setLoginOtpSent(false)}
                            className="text-amber-800 font-bold hover:underline shrink-0 ml-2 text-[11px] cursor-pointer"
                          >
                            Edit
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
                            value={loginOtpCode}
                            onChange={(e) => setLoginOtpCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="••••••"
                            className="w-full rounded-2xl border border-gray-300 bg-[#F8F9FA] px-4 py-3.5 text-center text-xl font-mono font-black tracking-[0.4em] text-gray-900 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/10"
                            autoFocus
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>Valid for 5 mins</span>
                          </div>
                          {loginOtpTimer > 0 ? (
                            <span className="text-amber-800 font-mono font-bold">Resend in {loginOtpTimer}s</span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendLoginOtp}
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
                              <span>Verifying Credentials...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheckIcon className="w-4 h-4" />
                              <span>Verify &amp; Sign In</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                )}

              </div>

              {/* Bottom Quick Test Credentials Bar & Signup Link */}
              <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                {/* 1-Click Quick Fill Credentials */}
                <div className="rounded-2xl bg-gray-50 border border-gray-200/80 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Demo Quick Access
                    </span>
                    <span className="text-[9.5px] text-gray-400">1-Click autofill credentials</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectRole('customer')}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                        selectedRole === 'customer'
                          ? 'bg-amber-100/80 text-amber-900 border border-amber-300'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <span>🛍️ Customer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectRole('supplier')}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                        selectedRole === 'supplier'
                          ? 'bg-blue-100 text-blue-950 border border-blue-300'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <span>🏢 Supplier</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectRole('admin')}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                        selectedRole === 'admin'
                          ? 'bg-amber-100 text-amber-950 border border-amber-300'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <span>⚙️ Admin</span>
                    </button>
                  </div>
                </div>

                {/* Create Account Link */}
                <div className="text-center text-xs text-gray-500">
                  Don&apos;t have an account yet?{' '}
                  <Link
                    to="/register"
                    state={location.state}
                    className="font-bold text-gray-950 hover:text-amber-800 transition underline underline-offset-4"
                  >
                    Create a Krishna Privé Account &rarr;
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* ================= FORGOT PASSWORD REAL OTP MODAL ================= */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                  🔑
                </span>
                <div>
                  <h3 className="text-sm font-bold text-gray-950 uppercase tracking-wider">Reset Account Password</h3>
                  <span className="text-[10px] text-gray-400">Krishna Security Verification</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="text-gray-400 hover:text-black font-bold p-1 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {forgotError && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 flex items-center gap-2 animate-fade-in">
                <span>⚠️</span>
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fade-in">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {!forgotOtpSent ? (
              <form onSubmit={handleSendForgotOtp} className="space-y-4 text-xs">
                <p className="text-gray-600">
                  Enter your registered email address to receive an instant 6-digit OTP verification code.
                </p>
                <div>
                  <label className="font-bold text-gray-700 block mb-1.5">Registered Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="registered@example.com"
                    className="w-full rounded-2xl border border-gray-200 bg-[#F8F9FA] px-4 py-3 text-xs text-gray-900 outline-none focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/10 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sendingForgotOtp}
                  className="w-full rounded-2xl bg-gray-950 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition cursor-pointer disabled:opacity-60 active:scale-[0.98] shadow-sm"
                >
                  {sendingForgotOtp ? 'Dispatching Reset OTP...' : 'Send Reset Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-gray-700">6-Digit Verification Code</label>
                    <span className="text-[10px] text-gray-400">Sent to {forgotEmail}</span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={forgotOtpCode}
                    onChange={(e) => setForgotOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-full rounded-2xl border border-gray-300 bg-[#F8F9FA] px-4 py-3 text-xs text-gray-900 outline-none focus:border-amber-600 focus:bg-white tracking-[0.3em] text-center font-bold text-lg font-mono"
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 px-1">
                  <span>⏱️ Valid for 5 mins</span>
                  {forgotOtpTimer > 0 ? (
                    <span className="font-mono text-amber-800 font-bold">Resend in {forgotOtpTimer}s</span>
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
                  <label className="font-bold text-gray-700 block mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full rounded-2xl border border-gray-200 bg-[#F8F9FA] px-4 py-3 text-xs text-gray-900 outline-none focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/10 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-2xl border border-gray-200 bg-[#F8F9FA] px-4 py-3 text-xs text-gray-900 outline-none focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/10 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gray-950 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition cursor-pointer active:scale-[0.98] shadow-sm"
                >
                  Save New Password &amp; Continue
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