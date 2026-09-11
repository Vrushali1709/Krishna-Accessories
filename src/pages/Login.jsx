// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { setAdminUser, setSupplierUser, setCustomerUser } from '../utils/auth';
import { getSuppliers } from '../utils/orderStore';
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
    setEmail('');
    setPassword('');
  };

  // Standard Password Authentication
  const handlePasswordLogin = (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please provide your Email ID and Password.');
      return;
    }

    // 1. Admin Authentication Check
    if (cleanEmail === 'admin@krishna.com' || cleanEmail === 'admin') {
      if (cleanPassword === 'admin123') {
        setSubmitting(true);
        showLoading('Authenticating Administrator Privileges...');
        setTimeout(() => {
          setAdminUser({
            email: 'admin@krishna.com',
            role: 'admin',
            name: 'Super Administrator',
            phone: '+91 98765 00001'
          });
          setSubmitting(false);
          hideLoading();
          navigate(returnPath || '/admin', { replace: true });
        }, 400);
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
        setSubmitting(true);
        showLoading('Connecting to Supplier Portal...');
        setTimeout(() => {
          setSupplierUser({
            email: matchedSupplier?.email || 'supplier@krishna.com',
            role: 'supplier',
            name: matchedSupplier?.name || 'Apex Timepieces Ltd.',
            phone: matchedSupplier?.phone || '+91 98765 43210'
          });
          setSubmitting(false);
          hideLoading();
          navigate(returnPath || '/supplier', { replace: true });
        }, 400);
        return;
      } else {
        setError('Invalid password for Supplier.');
        return;
      }
    }

    // 3. Customer Authentication
    if (cleanEmail && cleanPassword) {
      if (cleanPassword.length < 3) {
        setError('Password is too short.');
        return;
      }
      setSubmitting(true);
      showLoading('Signing into your Krishna Account...');
      setTimeout(() => {
        setCustomerUser({
          email: cleanEmail,
          role: 'customer',
          name: cleanEmail.includes('rahul') ? 'Rahul Patel' : cleanEmail.split('@')[0],
          phone: '+91 98765 12345'
        });
        setSubmitting(false);
        hideLoading();
        navigate(returnPath || '/account', { replace: true });
      }, 400);
    } else {
      setError('Please enter a valid email and password.');
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
  const handleVerifyLoginOtp = (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = loginOtpCode.trim();

    if (!cleanCode || cleanCode.length < 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    const verifyResult = verifyOtp(cleanEmail, cleanCode, 'login_otp');
    if (!verifyResult.success) {
      setError(verifyResult.error);
      return;
    }

    setSubmitting(true);
    showLoading('Verifying OTP & Logging In...');
    setTimeout(() => {
      setCustomerUser({
        email: cleanEmail,
        role: 'customer',
        name: cleanEmail.split('@')[0],
        phone: '+91 98765 12345'
      });
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

    const verifyResult = verifyOtp(cleanEmail, cleanCode, 'forgot_password');
    if (!verifyResult.success) {
      setForgotError(verifyResult.error);
      return;
    }

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
              Client Authentication
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 mt-1">Sign In to Your Account</h2>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              Access your saved bag, order timeline tracking, and address book
            </p>
          </div>

          {redirectMessage && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 font-medium flex items-center gap-2.5 shadow-xs">
              <span className="text-base">🔒</span>
              <div>
                <strong className="font-bold block text-amber-950">Authentication Required</strong>
                <span>{redirectMessage}</span>
              </div>
            </div>
          )}

          {/* Auth Method Selector Tabs (Password vs Instant OTP) */}
          <div className="flex items-center p-1 rounded-2xl bg-[#F4F4F6] border border-gray-200">
            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'password'
                  ? 'bg-white text-gray-950 shadow-xs'
                  : 'text-neutral-500 hover:text-black'
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
                  ? 'bg-white text-gray-950 shadow-xs'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Sign In via OTP</span>
            </button>
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

          {/* ================= METHOD 1: PASSWORD LOGIN ================= */}
          {authMode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-3.5" autoComplete="off">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Email Address</label>
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
                  className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700">Password</label>
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
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 pr-11 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-black cursor-pointer disabled:opacity-60 active:scale-95"
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
                <form onSubmit={handleSendLoginOtp} className="space-y-3.5">
                  <p className="text-xs text-neutral-500">
                    We will dispatch a secure 6-digit OTP code directly to your email address for instant passwordless sign-in.
                  </p>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Your Registered Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-black cursor-pointer disabled:opacity-60 active:scale-95"
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
                <form onSubmit={handleVerifyLoginOtp} className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
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
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Enter 6-Digit OTP Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={loginOtpCode}
                      onChange={(e) => setLoginOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••••"
                      className="w-full rounded-xl border border-gray-300 bg-[#F4F4F6] px-4 py-3 text-center text-lg font-mono font-black tracking-widest text-gray-900 outline-none focus:border-neutral-900 focus:bg-white"
                      autoFocus
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>⏱️ Valid for 5 mins</span>
                    {loginOtpTimer > 0 ? (
                      <span className="text-neutral-400 font-mono">Resend code in {loginOtpTimer}s</span>
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
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 hover:bg-emerald-800 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition cursor-pointer disabled:opacity-60 active:scale-95"
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

          {/* Quick Access Account Selector */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-[10px] text-center text-gray-400 uppercase tracking-wider mb-2.5 font-bold">
              Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectRole('customer')}
                className={`rounded-full py-1.5 px-1 text-[11px] sm:text-xs transition truncate cursor-pointer ${
                  selectedRole === 'customer'
                    ? 'border border-blue-200 bg-blue-50 font-bold text-blue-700'
                    : 'border border-gray-200 bg-[#F4F4F6] font-semibold text-gray-800 hover:bg-gray-200'
                }`}
              >
                Customer Demo
              </button>
              <button
                type="button"
                onClick={() => handleSelectRole('supplier')}
                className={`rounded-full py-1.5 px-1 text-[11px] sm:text-xs transition truncate cursor-pointer ${
                  selectedRole === 'supplier'
                    ? 'border border-blue-200 bg-blue-50 font-bold text-blue-700'
                    : 'border border-gray-200 bg-[#F4F4F6] font-semibold text-gray-800 hover:bg-gray-200'
                }`}
              >
                Supplier Demo
              </button>
              <button
                type="button"
                onClick={() => handleSelectRole('admin')}
                className={`rounded-full py-1.5 px-1 text-[11px] sm:text-xs transition truncate cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'border border-blue-200 bg-blue-50 font-bold text-blue-700'
                    : 'border border-gray-300 bg-gray-100 font-semibold text-gray-950 hover:bg-gray-200'
                }`}
              >
                Admin Demo
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" state={location.state} className="font-bold text-gray-950 hover:underline">
              Create Account
            </Link>
          </div>

        </div>
      </main>

      {/* ================= FORGOT PASSWORD REAL OTP MODAL ================= */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-50 text-amber-800 text-sm">
                  🔑
                </span>
                <h3 className="text-sm font-bold text-gray-950 uppercase tracking-wider">Reset Account Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="text-gray-400 hover:text-black font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {forgotError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-semibold text-red-700 animate-fade-in">
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 animate-fade-in">
                {forgotSuccess}
              </div>
            )}

            {!forgotOtpSent ? (
              <form onSubmit={handleSendForgotOtp} className="space-y-3.5 text-xs">
                <p className="text-gray-600">
                  Enter your registered email address to receive an instant 6-digit OTP verification code.
                </p>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Registered Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="registered@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sendingForgotOtp}
                  className="w-full rounded-full bg-[#111827] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition cursor-pointer disabled:opacity-60 active:scale-95"
                >
                  {sendingForgotOtp ? 'Dispatching Reset OTP...' : 'Send Reset Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3.5 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-gray-700">6-Digit Verification Code</label>
                    <span className="text-[10px] text-neutral-400">Sent to {forgotEmail}</span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={forgotOtpCode}
                    onChange={(e) => setForgotOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-full rounded-xl border border-gray-300 bg-[#F4F4F6] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white tracking-widest text-center font-bold text-base font-mono"
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-500">
                  <span>Valid for 5 mins</span>
                  {forgotOtpTimer > 0 ? (
                    <span className="font-mono text-neutral-400">Resend in {forgotOtpTimer}s</span>
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

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#111827] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition cursor-pointer active:scale-95 shadow-sm"
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