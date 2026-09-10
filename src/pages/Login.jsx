// src/pages/Login.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { setAdminUser, setSupplierUser, setCustomerUser, setCurrentUser } from '../utils/auth';
import { getSuppliers } from '../utils/orderStore';
import {
  generateAndSendOtp,
  verifyOtp,
  resendOtp,
  getRegisteredAccounts,
  findAccountByEmail,
  updateAccountPassword
} from '../utils/emailService';
import { LockClosedIcon, UserIcon, ArrowRightIcon, ShieldCheckIcon } from '../components/Icons';
import { Eye, EyeOff, Mail, Key, RotateCcw, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLoading } from '../context/LoadingContext';
import BrandSpinner from '../components/BrandSpinner';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [submitting, setSubmitting] = useState(false);

  // Sign in Mode: 'password' | 'otp'
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

  // Password Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Passwordless OTP Login State
  const [otpLoginEmail, setOtpLoginEmail] = useState('');
  const [otpLoginSent, setOtpLoginSent] = useState(false);
  const [otpLoginDigits, setOtpLoginDigits] = useState(['', '', '', '', '', '']);
  const [otpLoginCooldown, setOtpLoginCooldown] = useState(0);
  const otpLoginInputRefs = useRef([]);

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP + New Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtpDigits, setForgotOtpDigits] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotCooldown, setForgotCooldown] = useState(0);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const forgotOtpRefs = useRef([]);

  const redirectMessage = location.state?.message || '';
  const returnPath = typeof location.state?.from === 'string'
    ? location.state.from
    : (location.state?.from?.pathname ? `${location.state.from.pathname}${location.state.from.search || ''}` : null);

  useEffect(() => {
    if (location.state?.requiredRole) {
      setSelectedRole(location.state.requiredRole);
      setEmail('');
      setPassword('');
      setError('');
    }
  }, [location.state]);

  // Timers for Resend Cooldowns
  useEffect(() => {
    let timer;
    if (otpLoginCooldown > 0) {
      timer = setInterval(() => setOtpLoginCooldown((p) => Math.max(0, p - 1)), 1000);
    }
    return () => clearInterval(timer);
  }, [otpLoginCooldown]);

  useEffect(() => {
    let timer;
    if (forgotCooldown > 0) {
      timer = setInterval(() => setForgotCooldown((p) => Math.max(0, p - 1)), 1000);
    }
    return () => clearInterval(timer);
  }, [forgotCooldown]);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setError('');
    setEmail('');
    setPassword('');
  };

  // 1. Password Login Handler
  const handlePasswordLogin = (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please type your Email ID and Password.');
      return;
    }

    // A. Check Administrator Privileges
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
        }, 350);
        return;
      } else {
        setError('Invalid password for Administrator.');
        return;
      }
    }

    // B. Check Supplier Accounts
    const suppliers = getSuppliers();
    const matchedSupplier = suppliers.find((s) => s.email?.toLowerCase() === cleanEmail);

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
        }, 350);
        return;
      } else {
        setError('Invalid password for Supplier.');
        return;
      }
    }

    // C. Check Registered Accounts Store
    const registeredAccounts = getRegisteredAccounts();
    const registered = registeredAccounts.find((a) => a.email.toLowerCase() === cleanEmail);

    if (registered) {
      if (registered.password === cleanPassword) {
        setSubmitting(true);
        showLoading('Signing into your Krishna Account...');
        setTimeout(() => {
          const userObj = {
            id: registered.id,
            name: registered.name,
            email: registered.email,
            phone: registered.phone || '+91 98765 12345',
            role: registered.role || 'customer'
          };
          setCurrentUser(userObj);
          setSubmitting(false);
          hideLoading();
          if (registered.role === 'supplier') {
            navigate(returnPath || '/supplier', { replace: true });
          } else if (registered.role === 'admin') {
            navigate(returnPath || '/admin', { replace: true });
          } else {
            navigate(returnPath || '/account', { replace: true });
          }
        }, 350);
        return;
      } else {
        setError('Incorrect password. Click "Forgot?" to reset via OTP.');
        return;
      }
    }

    // D. General Customer Fallback (for demo accounts)
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
      }, 350);
    } else {
      setError('Please provide a valid email and password.');
    }
  };

  // 2. Passwordless Email OTP Login: Request OTP
  const handleSendLoginOtp = (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = otpLoginEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address to receive sign-in OTP.');
      return;
    }

    setSubmitting(true);
    showLoading('Dispatching 6-Digit Instant Sign-In OTP...');

    setTimeout(() => {
      const res = generateAndSendOtp(cleanEmail, 'login', {
        name: cleanEmail.split('@')[0]
      });

      setSubmitting(false);
      hideLoading();

      if (res.success) {
        setOtpLoginSent(true);
        setOtpLoginCooldown(60);
        setOtpLoginDigits(['', '', '', '', '', '']);
        setTimeout(() => {
          if (otpLoginInputRefs.current[0]) {
            otpLoginInputRefs.current[0].focus();
          }
        }, 100);
      } else {
        setError(res.error || 'Failed to dispatch sign-in OTP.');
      }
    }, 400);
  };

  // 2. Passwordless Email OTP Login: Verify OTP & Sign In
  const handleVerifyLoginOtp = (e) => {
    e.preventDefault();
    setError('');

    const code = otpLoginDigits.join('');
    if (code.length !== 6) {
      setError('Please enter the full 6-digit OTP code.');
      return;
    }

    setSubmitting(true);
    showLoading('Verifying OTP & Establishing Session...');

    setTimeout(() => {
      const cleanEmail = otpLoginEmail.trim().toLowerCase();
      const verifyRes = verifyOtp(cleanEmail, code, 'login');

      if (!verifyRes.success) {
        setSubmitting(false);
        hideLoading();
        setError(verifyRes.error || 'Invalid OTP verification code.');
        return;
      }

      // Find if registered or create user session
      const registered = findAccountByEmail(cleanEmail);
      let userObj;

      if (cleanEmail === 'admin@krishna.com') {
        userObj = { email: cleanEmail, role: 'admin', name: 'Super Administrator', phone: '+91 98765 00001' };
        setAdminUser(userObj);
      } else if (cleanEmail.includes('supplier') || registered?.role === 'supplier') {
        userObj = { email: cleanEmail, role: 'supplier', name: registered?.name || 'Apex Timepieces Ltd.', phone: registered?.phone || '+91 98765 43210' };
        setSupplierUser(userObj);
      } else {
        userObj = {
          email: cleanEmail,
          role: 'customer',
          name: registered?.name || (cleanEmail.includes('rahul') ? 'Rahul Patel' : cleanEmail.split('@')[0]),
          phone: registered?.phone || '+91 98765 12345'
        };
        setCustomerUser(userObj);
      }

      setSubmitting(false);
      hideLoading();

      if (userObj.role === 'admin') {
        navigate(returnPath || '/admin', { replace: true });
      } else if (userObj.role === 'supplier') {
        navigate(returnPath || '/supplier', { replace: true });
      } else {
        navigate(returnPath || '/account', { replace: true });
      }
    }, 450);
  };

  // Resend Login OTP
  const handleResendLoginOtp = () => {
    if (otpLoginCooldown > 0) return;
    const cleanEmail = otpLoginEmail.trim().toLowerCase();
    const res = resendOtp(cleanEmail, 'login');
    if (res.success) {
      setOtpLoginCooldown(60);
      setError('');
    } else {
      setError(res.error || 'Failed to resend code.');
    }
  };

  // 3. Forgot Password: Step 1 Request OTP
  const handleRequestForgotOtp = (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    const cleanEmail = forgotEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setForgotError('Please enter a valid registered email address.');
      return;
    }

    setSubmitting(true);
    showLoading('Dispatching Password Reset Security OTP...');

    setTimeout(() => {
      const res = generateAndSendOtp(cleanEmail, 'reset_password', {
        name: cleanEmail.split('@')[0]
      });

      setSubmitting(false);
      hideLoading();

      if (res.success) {
        setForgotStep(2);
        setForgotCooldown(60);
        setForgotSuccess(`6-digit password reset OTP sent to ${cleanEmail}`);
        setForgotOtpDigits(['', '', '', '', '', '']);
        setTimeout(() => {
          if (forgotOtpRefs.current[0]) {
            forgotOtpRefs.current[0].focus();
          }
        }, 100);
      } else {
        setForgotError(res.error || 'Failed to dispatch reset OTP.');
      }
    }, 400);
  };

  // 3. Forgot Password: Step 2 Verify OTP & Reset Password
  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    const code = forgotOtpDigits.join('');
    if (code.length !== 6) {
      setForgotError('Please enter the 6-digit OTP code.');
      return;
    }

    if (newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match. Please verify.');
      return;
    }

    setSubmitting(true);
    showLoading('Verifying OTP & Updating Password...');

    setTimeout(() => {
      const cleanEmail = forgotEmail.trim().toLowerCase();
      const verifyRes = verifyOtp(cleanEmail, code, 'reset_password');

      if (!verifyRes.success) {
        setSubmitting(false);
        hideLoading();
        setForgotError(verifyRes.error || 'Invalid OTP code.');
        return;
      }

      // Update password in persistent account registry
      updateAccountPassword(cleanEmail, newPassword.trim());

      setSubmitting(false);
      hideLoading();
      setForgotSuccess('✓ Password reset successfully! Confirmation email sent.');

      setTimeout(() => {
        setForgotModalOpen(false);
        setForgotStep(1);
        setEmail(cleanEmail);
        setPassword('');
        setForgotError('');
        setForgotSuccess('');
      }, 1500);
    }, 500);
  };

  // Resend Forgot Password OTP
  const handleResendForgotOtp = () => {
    if (forgotCooldown > 0) return;
    const cleanEmail = forgotEmail.trim().toLowerCase();
    const res = resendOtp(cleanEmail, 'reset_password');
    if (res.success) {
      setForgotCooldown(60);
      setForgotSuccess(`Fresh reset OTP sent to ${cleanEmail}`);
    } else {
      setForgotError(res.error || 'Failed to resend code.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 flex flex-col justify-between overflow-x-clip">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-5 animate-fade-in">

          {/* Logo & Header */}
          <div className="text-center">
            <img
              src="/images/krishna-logo.png"
              alt="Krishna Accessories Logo"
              className="mx-auto h-12 w-12 object-contain rounded-2xl bg-white p-1 shadow-xs border border-gray-200 mb-2.5"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Client Authentication
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 mt-1">
              Sign In to Your Account
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              Access your saved bag, order timeline tracking, and address book
            </p>
          </div>

          {/* Authentication Mode Switcher Tabs */}
          <div className="grid grid-cols-2 rounded-2xl bg-[#F4F4F6] p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setError('');
              }}
              className={`rounded-xl py-2 transition cursor-pointer ${
                authMode === 'password'
                  ? 'bg-white text-gray-950 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Password Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('otp');
                setError('');
              }}
              className={`rounded-xl py-2 transition cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'otp'
                  ? 'bg-white text-gray-950 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Key className="h-3.5 w-3.5 text-amber-600" />
              <span>Sign In with OTP</span>
            </button>
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

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 font-semibold flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Mode 1: Standard Password Form */}
          {authMode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-3.5 text-xs" autoComplete="off">
              <div>
                <label className="font-semibold text-gray-700 mb-1 block">Email Address</label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === 'supplier'
                      ? 'supplier@krishna.com'
                      : selectedRole === 'admin'
                        ? 'admin@krishna.com'
                        : 'name@domain.com'
                  }
                  className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 outline-none focus:border-gray-400 focus:bg-white text-gray-900"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotModalOpen(true);
                      setForgotStep(1);
                      setForgotEmail(email || '');
                      setForgotError('');
                      setForgotSuccess('');
                    }}
                    className="text-[11px] text-gray-900 font-bold hover:underline cursor-pointer"
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
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 pr-11 outline-none focus:border-gray-400 focus:bg-white text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-black cursor-pointer disabled:opacity-60"
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

          {/* Mode 2: Passwordless Email OTP Form */}
          {authMode === 'otp' && (
            <div className="space-y-3.5 text-xs animate-fade-in">
              {!otpLoginSent ? (
                <form onSubmit={handleSendLoginOtp} className="space-y-3.5">
                  <div>
                    <label className="font-semibold text-gray-700 mb-1 block">Registered Email Address</label>
                    <input
                      type="email"
                      required
                      value={otpLoginEmail}
                      onChange={(e) => setOtpLoginEmail(e.target.value)}
                      placeholder="e.g. user@example.com"
                      className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 outline-none focus:border-gray-400 focus:bg-white text-gray-900"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      We will dispatch a secure 6-digit One-Time Password to your inbox.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-amber-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-amber-700 cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <BrandSpinner size="xs" variant="gold" inline={true} />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-3.5 h-3.5" />
                        <span>Send Instant Sign-In OTP</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
                  <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-900 truncate max-w-[200px]">
                      OTP sent to: <strong>{otpLoginEmail}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtpLoginSent(false)}
                      className="text-[11px] font-bold text-amber-800 hover:underline"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-2 text-center">
                      Enter 6-Digit Sign-In Code
                    </label>
                    <div className="flex justify-center gap-2 sm:gap-2.5">
                      {otpLoginDigits.map((d, i) => (
                        <input
                          key={i}
                          ref={(el) => (otpLoginInputRefs.current[i] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={d}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '').slice(-1);
                            const updated = [...otpLoginDigits];
                            updated[i] = val;
                            setOtpLoginDigits(updated);
                            if (val && i < 5 && otpLoginInputRefs.current[i + 1]) {
                              otpLoginInputRefs.current[i + 1].focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !otpLoginDigits[i] && i > 0 && otpLoginInputRefs.current[i - 1]) {
                              otpLoginInputRefs.current[i - 1].focus();
                            }
                          }}
                          className="h-12 w-10 text-center font-mono text-xl font-extrabold rounded-xl border border-gray-300 bg-[#F4F4F6] text-gray-900 outline-none focus:border-amber-500 focus:bg-white"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>Valid for 10 mins</span>
                    <button
                      type="button"
                      disabled={otpLoginCooldown > 0}
                      onClick={handleResendLoginOtp}
                      className={`font-bold transition flex items-center gap-1 ${
                        otpLoginCooldown > 0 ? 'text-gray-400' : 'text-gray-950 hover:underline'
                      }`}
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>{otpLoginCooldown > 0 ? `Resend in ${otpLoginCooldown}s` : 'Resend Code'}</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-black cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <BrandSpinner size="xs" variant="gold" inline={true} />
                        <span>Verifying Session...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify &amp; Sign In</span>
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
              Demo Quick Select
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  handleSelectRole('customer');
                  setEmail('rahul.patel@example.com');
                  setPassword('password123');
                }}
                className="rounded-full py-1.5 px-1 text-[11px] sm:text-xs transition truncate cursor-pointer border border-gray-200 bg-[#F4F4F6] font-semibold text-gray-800 hover:bg-gray-200"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSelectRole('supplier');
                  setEmail('apex@timepieces.com');
                  setPassword('supplier123');
                }}
                className="rounded-full py-1.5 px-1 text-[11px] sm:text-xs transition truncate cursor-pointer border border-gray-200 bg-[#F4F4F6] font-semibold text-gray-800 hover:bg-gray-200"
              >
                Supplier
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSelectRole('admin');
                  setEmail('admin@krishna.com');
                  setPassword('admin123');
                }}
                className="rounded-full py-1.5 px-1 text-[11px] sm:text-xs transition truncate cursor-pointer border border-gray-300 bg-gray-100 font-semibold text-gray-950 hover:bg-gray-200"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" state={location.state} className="font-bold text-gray-950 hover:underline">
              Create Account
            </Link>
          </div>

        </div>
      </main>

      {/* Forgot Password OTP Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-amber-600" />
                <h3 className="text-sm font-bold text-gray-950 uppercase tracking-wider">
                  {forgotStep === 1 ? 'Reset Password' : 'Enter OTP & Set New Password'}
                </h3>
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
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800 font-semibold flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800 font-semibold flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {forgotStep === 1 && (
              <form onSubmit={handleRequestForgotOtp} className="space-y-3.5 text-xs">
                <p className="text-gray-600">
                  Enter your registered email address to receive an instant 6-digit OTP verification code.
                </p>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 outline-none focus:border-gray-400 focus:bg-white text-gray-900"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-[#111827] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition cursor-pointer disabled:opacity-60"
                >
                  Send Reset OTP Code
                </button>
              </form>
            )}

            {forgotStep === 2 && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5 text-xs animate-fade-in">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1.5 text-center">
                    6-Digit OTP Code sent to {forgotEmail}
                  </label>
                  <div className="flex justify-center gap-2">
                    {forgotOtpDigits.map((d, i) => (
                      <input
                        key={i}
                        ref={(el) => (forgotOtpRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '').slice(-1);
                          const updated = [...forgotOtpDigits];
                          updated[i] = val;
                          setForgotOtpDigits(updated);
                          if (val && i < 5 && forgotOtpRefs.current[i + 1]) {
                            forgotOtpRefs.current[i + 1].focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !forgotOtpDigits[i] && i > 0 && forgotOtpRefs.current[i - 1]) {
                            forgotOtpRefs.current[i - 1].focus();
                          }
                        }}
                        className="h-11 w-9 text-center font-mono text-lg font-bold rounded-xl border border-gray-300 bg-[#F4F4F6] text-gray-900 outline-none focus:border-amber-500 focus:bg-white"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span>Valid for 10 mins</span>
                  <button
                    type="button"
                    disabled={forgotCooldown > 0}
                    onClick={handleResendForgotOtp}
                    className={`font-bold transition flex items-center gap-1 ${
                      forgotCooldown > 0 ? 'text-gray-400' : 'text-gray-950 hover:underline'
                    }`}
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>{forgotCooldown > 0 ? `Resend in ${forgotCooldown}s` : 'Resend OTP'}</span>
                  </button>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 pr-10 outline-none focus:border-gray-400 focus:bg-white text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Confirm New Password</label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 outline-none focus:border-gray-400 focus:bg-white text-gray-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-[#111827] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition cursor-pointer disabled:opacity-60"
                >
                  Verify OTP &amp; Save New Password
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