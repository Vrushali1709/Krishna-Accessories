// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setAdminUser, setSupplierUser, setCustomerUser, setAuthToken } from '../utils/auth';
import { usersApi } from '../utils/api';
import { syncCartFromBackend } from '../utils/cart';
import { syncWishlistFromBackend } from '../utils/productStore';
import { syncAddressesFromBackend } from '../utils/orderStore';
import { sendOtpEmail, verifyOtp, resendOtp, sendPasswordResetSuccessEmail } from '../utils/emailService';
import {
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw,
  KeyRound,
  Mail,
  Sparkles,
  Building2,
  ShieldAlert
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
      try {
        setAuthToken(verifyResult.token);
        const user = verifyResult.user || { email: cleanEmail, name: cleanEmail.split('@')[0], role: selectedRole };
        if (selectedRole === 'admin') setAdminUser(user);
        else if (selectedRole === 'supplier') setSupplierUser(user);
        else setCustomerUser({ ...user, role: 'customer' });

        await Promise.all([syncCartFromBackend(), syncWishlistFromBackend(), syncAddressesFromBackend()]);
        navigate(returnPath || (selectedRole === 'admin' ? '/admin' : selectedRole === 'supplier' ? '/supplier' : '/account'), { replace: true });
      } catch (err) {
        setError('Login verification encountered an error.');
      } finally {
        setSubmitting(false);
        hideLoading();
      }
    }, 400);
  };

  // Forgot Password: Send OTP
  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    const cleanEmail = forgotEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setForgotError('Please enter a valid email address.');
      return;
    }

    setSendingForgotOtp(true);
    const res = await sendOtpEmail(cleanEmail, 'password_reset_otp');
    setSendingForgotOtp(false);

    if (res.success) {
      setForgotOtpSent(true);
      setForgotOtpTimer(60);
      setForgotSuccess(`✓ Password reset OTP dispatched to ${cleanEmail}`);
    } else {
      setForgotError(res.error || 'Unable to dispatch reset OTP.');
    }
  };

  // Forgot Password: Reset & Update
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');

    if (newPassword.length < 4) {
      setForgotError('New password must be at least 4 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match.');
      return;
    }

    const verifyResult = await verifyOtp(forgotEmail.trim().toLowerCase(), forgotOtpCode.trim(), 'password_reset_otp');
    if (!verifyResult.success) {
      setForgotError(verifyResult.error);
      return;
    }

    try {
      await usersApi.updatePassword({ email: forgotEmail.trim().toLowerCase(), newPassword });
      await sendPasswordResetSuccessEmail(forgotEmail.trim().toLowerCase());
      setForgotSuccess('Password updated successfully! You may now sign in.');
      setTimeout(() => {
        setForgotModalOpen(false);
        setForgotOtpSent(false);
        setForgotEmail('');
        setForgotOtpCode('');
        setNewPassword('');
        setConfirmPassword('');
      }, 1500);
    } catch (err) {
      setForgotError(err.message || 'Failed to update password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white flex flex-col justify-between overflow-x-clip">
      <Navbar />

      <main className="mx-auto max-w-md w-full px-4 py-12 sm:py-16">
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-7 sm:p-9 shadow-sm space-y-6">

          {/* Header Brand */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734] animate-ping" />
              <span className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-[#8C6734]">
                Boutique Authentication
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-neutral-950">
              Sign In to Krishna Privé
            </h1>
            <p className="text-xs text-neutral-500">
              Access your personal wishlist, order tracking, and concierge settings.
            </p>
          </div>

          {redirectMessage && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-900">
              {redirectMessage}
            </div>
          )}

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

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-[#FAFAFB] p-1 border border-neutral-200">
            {['customer', 'supplier', 'admin'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleSelectRole(role)}
                className={`py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedRole === role
                    ? 'bg-neutral-950 text-white shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                {role === 'customer' ? 'Client' : role === 'supplier' ? 'Vendor' : 'Admin'}
              </button>
            ))}
          </div>

          {/* Mode Switcher: Password vs OTP */}
          <div className="flex border-b border-neutral-100 text-xs">
            <button
              type="button"
              onClick={() => { setAuthMode('password'); setError(''); }}
              className={`flex-1 pb-2.5 font-semibold transition-all cursor-pointer ${
                authMode === 'password'
                  ? 'border-b-2 border-[#8C6734] text-neutral-950'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('otp'); setError(''); }}
              className={`flex-1 pb-2.5 font-semibold transition-all cursor-pointer ${
                authMode === 'otp'
                  ? 'border-b-2 border-[#8C6734] text-neutral-950'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Email OTP Login
            </button>
          </div>

          {/* Password Mode Form */}
          {authMode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Registered Email ID</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]/30 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-neutral-800">Password</label>
                  <button
                    type="button"
                    onClick={() => { setForgotModalOpen(true); setForgotError(''); setForgotSuccess(''); }}
                    className="text-[11px] text-[#8C6734] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 pr-10 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#8C6734] transition-colors duration-200 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <span>{submitting ? 'Verifying...' : 'Sign In'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* OTP Mode Form */}
          {authMode === 'otp' && (
            <div className="space-y-4 text-xs">
              {!loginOtpSent ? (
                <form onSubmit={handleSendLoginOtp} className="space-y-4">
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">Registered Email ID</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]/30 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#8C6734] transition-colors duration-200 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Send Verification Code</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">Enter 6-Digit OTP Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={loginOtpCode}
                      onChange={(e) => setLoginOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-center font-mono text-base tracking-widest text-neutral-950 outline-none focus:border-[#8C6734] transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span>Code sent to {email}</span>
                    <button
                      type="button"
                      disabled={loginOtpTimer > 0}
                      onClick={handleSendLoginOtp}
                      className="text-[#8C6734] font-semibold hover:underline disabled:opacity-40 cursor-pointer"
                    >
                      {loginOtpTimer > 0 ? `Resend (${loginOtpTimer}s)` : 'Resend Code'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#8C6734] transition-colors duration-200 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <span>Verify &amp; Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Registration Link Footer */}
          <div className="border-t border-neutral-100 pt-4 text-center text-xs text-neutral-500">
            <span>Don't have a Krishna account? </span>
            <Link to="/register" className="font-semibold text-[#8C6734] hover:underline">
              Create Account
            </Link>
          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-lg font-medium text-neutral-950">Reset Password</h3>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {forgotError && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-900">
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-900">
                {forgotSuccess}
              </div>
            )}

            {!forgotOtpSent ? (
              <form onSubmit={handleForgotSendOtp} className="space-y-4 text-xs">
                <p className="text-neutral-600 text-xs">
                  Enter your registered email address to receive a secure password reset OTP code.
                </p>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-[#8C6734]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sendingForgotOtp}
                  className="w-full py-2.5 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C6734] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <span>{sendingForgotOtp ? 'Dispatching OTP...' : 'Send Reset Code'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">6-Digit OTP Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={forgotOtpCode}
                    onChange={(e) => setForgotOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-center font-mono text-sm tracking-widest outline-none focus:border-[#8C6734]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-[#8C6734]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-[#8C6734]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C6734] transition-colors cursor-pointer"
                  >
                    Confirm &amp; Update Password
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