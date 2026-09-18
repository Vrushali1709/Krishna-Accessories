// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setAdminUser, setSupplierUser, setCustomerUser, setAuthToken } from '../utils/auth';
import { usersApi, authApi } from '../utils/api';
import { syncCartFromBackend } from '../utils/cart';
import { syncWishlistFromBackend } from '../utils/productStore';
import { syncAddressesFromBackend } from '../utils/orderStore';
import { sendOtpEmail, verifyOtp, resendOtp, sendPasswordResetSuccessEmail } from '../utils/emailService';
import { LockClosedIcon, UserIcon, ArrowRightIcon, ShieldCheckIcon } from '../components/Icons';
import { Eye, EyeOff, RefreshCw, KeyRound, Mail } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 flex items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Subtle Ambient Glows */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-amber-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-slate-200/60 blur-3xl" />

      <main className="w-full max-w-md my-auto z-10">
        <div className="w-full rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-xl shadow-slate-200/50 space-y-6">

          {/* Brand Header */}
          <div className="text-center space-y-1.5">
            <img
              src="/images/krishna-logo.png"
              alt="Krishna Accessories Logo"
              className="mx-auto h-12 w-12 object-contain rounded-2xl bg-white p-1 shadow-xs border border-slate-200 mb-2"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 block">
              Krishna Accessories
            </span>
            <h1 className="text-2xl font-bold text-slate-950 tracking-tight">Sign In to Your Account</h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Access your saved bag, order timeline tracking, and address book
            </p>
          </div>

          {redirectMessage && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-900 font-medium flex items-center gap-2.5 shadow-xs">
              <span className="text-base">🔒</span>
              <div>
                <strong className="font-bold block text-amber-950">Authentication Required</strong>
                <span>{redirectMessage}</span>
              </div>
            </div>
          )}

          {/* Auth Method Selector Tabs (Password vs Instant OTP) */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${authMode === 'password'
                ? 'bg-white text-slate-950 shadow-xs'
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
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${authMode === 'otp'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Sign In via OTP</span>
            </button>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-semibold text-center animate-fade-in">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-semibold text-center flex items-center justify-center gap-1.5 animate-fade-in">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* ================= METHOD 1: PASSWORD LOGIN ================= */}
          {authMode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4" autoComplete="off">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Email Address</label>
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
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-800 focus:bg-white focus:ring-4 focus:ring-slate-800/5"
                />
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
                    className="text-[11px] text-amber-800 font-bold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 pr-11 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-800 focus:bg-white focus:ring-4 focus:ring-slate-800/5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 cursor-pointer p-0.5"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 hover:bg-black py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-slate-950/10 transition-all cursor-pointer disabled:opacity-60 active:scale-[0.98]"
              >
                {submitting ? (
                  <>
                    <BrandSpinner size="xs" variant="gold" inline={true} />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ================= METHOD 2: SIGN IN VIA EMAIL OTP ================= */}
          {authMode === 'otp' && (
            <div>
              {!loginOtpSent ? (
                <form onSubmit={handleSendLoginOtp} className="space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    We will dispatch a secure 6-digit OTP code directly to your email address for instant passwordless sign-in.
                  </p>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Your Registered Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-800 focus:bg-white focus:ring-4 focus:ring-slate-800/5"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 hover:bg-black py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-slate-950/10 transition-all cursor-pointer disabled:opacity-60 active:scale-[0.98]"
                  >
                    {submitting ? (
                      <>
                        <BrandSpinner size="xs" variant="gold" inline={true} />
                        <span>Sending Security OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Login OTP</span>
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                    <span className="truncate">Sent to: <strong>{email}</strong></span>
                    <button
                      type="button"
                      onClick={() => setLoginOtpSent(false)}
                      className="text-amber-800 font-bold hover:underline shrink-0 ml-2"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Enter 6-Digit OTP Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={loginOtpCode}
                      onChange={(e) => setLoginOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••••"
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-slate-900 outline-none focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-800/5"
                      autoFocus
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>⏱️ Valid for 5 mins</span>
                    {loginOtpTimer > 0 ? (
                      <span className="text-slate-400 font-mono">Resend code in {loginOtpTimer}s</span>
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
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all cursor-pointer disabled:opacity-60 active:scale-[0.98]"
                  >
                    {submitting ? (
                      <>
                        <BrandSpinner size="xs" variant="white" inline={true} />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Sign In</span>
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Quick Role Selection (Without 'Demo' label) */}
          <div className="border-t border-slate-100 pt-4">
            <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest mb-2.5 font-bold">
              Account Role
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectRole('customer')}
                className={`rounded-2xl py-2 px-1 text-xs transition truncate cursor-pointer font-bold ${selectedRole === 'customer'
                  ? 'border border-slate-950 bg-slate-950 text-white shadow-xs'
                  : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleSelectRole('supplier')}
                className={`rounded-2xl py-2 px-1 text-xs transition truncate cursor-pointer font-bold ${selectedRole === 'supplier'
                  ? 'border border-slate-950 bg-slate-950 text-white shadow-xs'
                  : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
              >
                Supplier
              </button>
              <button
                type="button"
                onClick={() => handleSelectRole('admin')}
                className={`rounded-2xl py-2 px-1 text-xs transition truncate cursor-pointer font-bold ${selectedRole === 'admin'
                  ? 'border border-slate-950 bg-slate-950 text-white shadow-xs'
                  : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 pt-1">
            Don&apos;t have an account?{' '}
            <Link to="/register" state={location.state} className="font-bold text-slate-950 hover:underline">
              Create Account
            </Link>
          </div>

        </div>
      </main>

      {/* ================= FORGOT PASSWORD REAL OTP MODAL ================= */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-50 text-amber-800 text-sm">
                  🔑
                </span>
                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Reset Account Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="text-slate-400 hover:text-black font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {forgotError && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-2.5 text-xs font-semibold text-red-700 animate-fade-in">
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 animate-fade-in">
                {forgotSuccess}
              </div>
            )}

            {!forgotOtpSent ? (
              <form onSubmit={handleSendForgotOtp} className="space-y-3.5 text-xs">
                <p className="text-slate-600">
                  Enter your registered email address to receive an instant 6-digit OTP verification code.
                </p>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Registered Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="registered@example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-slate-800 focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sendingForgotOtp}
                  className="w-full rounded-2xl bg-slate-950 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition cursor-pointer disabled:opacity-60 active:scale-95"
                >
                  {sendingForgotOtp ? 'Dispatching Reset OTP...' : 'Send Reset Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3.5 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
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
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-slate-900 focus:bg-white tracking-widest text-center font-bold text-base font-mono"
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Valid for 5 mins</span>
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
                  <label className="font-semibold text-slate-700 block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-slate-800 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-slate-800 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-slate-950 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition cursor-pointer active:scale-95 shadow-sm"
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