// src/pages/Register.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { setCurrentUser } from '../utils/auth';
import { addSupplier } from '../utils/orderStore';
import {
  generateAndSendOtp,
  verifyOtp,
  resendOtp,
  saveRegisteredAccount,
  findAccountByEmail,
  sendWelcomeEmail
} from '../utils/emailService';
import { ArrowRightIcon, ShieldCheckIcon } from '../components/Icons';
import { Eye, EyeOff, Mail, Key, RotateCcw, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLoading } from '../context/LoadingContext';
import BrandSpinner from '../components/BrandSpinner';

export default function Register() {
  const [step, setStep] = useState(1); // 1 = Form Details, 2 = OTP Verification
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Customer');
  const [supplierCategory, setSupplierCategory] = useState('Watches');

  // OTP State
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const otpInputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { showLoading, hideLoading } = useLoading();

  const returnPath = typeof location.state?.from === 'string'
    ? location.state.from
    : (location.state?.from?.pathname ? `${location.state.from.pathname}${location.state.from.search || ''}` : null);

  // Resend Countdown Timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Submit Details & Trigger OTP
  const handleInitiateRegistration = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || !cleanPhone || !cleanPassword) {
      setError('Please fill out all mandatory registration fields.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (cleanPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Check if user already exists
    const existing = findAccountByEmail(cleanEmail);
    if (existing) {
      setError('An account with this email address already exists. Please Sign In.');
      return;
    }

    setSubmitting(true);
    showLoading('Dispatching 6-Digit Email Verification Code...');

    setTimeout(() => {
      const res = generateAndSendOtp(cleanEmail, 'registration', {
        name: cleanName,
        phone: cleanPhone,
        role: role.toLowerCase(),
        category: supplierCategory
      });

      setSubmitting(false);
      hideLoading();

      if (res.success) {
        setStep(2);
        setResendCooldown(60);
        setSuccess(`Verification code sent to ${cleanEmail}`);
        setOtpDigits(['', '', '', '', '', '']);
        setTimeout(() => {
          if (otpInputRefs.current[0]) {
            otpInputRefs.current[0].focus();
          }
        }, 100);
      } else {
        setError(res.error || 'Failed to dispatch verification email. Please try again.');
      }
    }, 450);
  };

  // Handle OTP Box Typing
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setError('');

    // Auto-advance
    if (digit && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0 && otpInputRefs.current[index - 1]) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setOtpDigits(newDigits);

    const nextIndex = Math.min(pastedData.length, 5);
    if (otpInputRefs.current[nextIndex]) {
      otpInputRefs.current[nextIndex].focus();
    }
  };

  // Step 2: Verify OTP & Activate Account
  const handleVerifyOtpAndRegister = (e) => {
    e.preventDefault();
    setError('');

    const fullCode = otpDigits.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setSubmitting(true);
    showLoading('Verifying OTP & Securing Account...');

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const verifyRes = verifyOtp(cleanEmail, fullCode, 'registration');

      if (!verifyRes.success) {
        setSubmitting(false);
        hideLoading();
        setError(verifyRes.error || 'Invalid OTP code.');
        return;
      }

      // Save credentials into persistent registry
      const newUser = {
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        password: password.trim(),
        role: role.toLowerCase(),
        category: supplierCategory,
        verified: true
      };

      saveRegisteredAccount(newUser);
      setCurrentUser(newUser);

      // Send Welcome Confirmation Email
      sendWelcomeEmail(newUser);

      if (role === 'Supplier') {
        addSupplier({
          name: name.trim(),
          email: cleanEmail,
          phone: phone.trim(),
          category: supplierCategory,
          address: "Gujarat, India",
          status: "Pending Approval"
        });
      }

      setSubmitting(false);
      hideLoading();
      setSuccess('✓ Account verified successfully! Directing you to your portal...');

      setTimeout(() => {
        if (role === 'Supplier') {
          navigate('/supplier', { replace: true });
        } else {
          navigate(returnPath || '/account', { replace: true });
        }
      }, 700);
    }, 500);
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (resendCooldown > 0) return;
    setError('');
    setSuccess('');

    const cleanEmail = email.trim().toLowerCase();
    const res = resendOtp(cleanEmail, 'registration', {
      name: name.trim(),
      role: role.toLowerCase()
    });

    if (res.success) {
      setResendCooldown(60);
      setSuccess(`A fresh 6-digit OTP code has been sent to ${cleanEmail}`);
    } else {
      setError(res.error || 'Failed to resend OTP.');
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
              Client Authentication &bull; Step {step} of 2
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 mt-1">
              {step === 1 ? 'Create Your Account' : 'Verify Email Address'}
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              {step === 1
                ? 'Join Krishna Accessories for bespoke concierge ordering and live tracking'
                : `Enter the 6-digit OTP verification code sent to ${email}`}
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 font-semibold flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-semibold flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Step 1: Details Entry Form */}
          {step === 1 && (
            <form onSubmit={handleInitiateRegistration} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-gray-700 mb-1 block">
                  {role === 'Supplier' ? 'Company / Business Name *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'Supplier' ? 'e.g. Apex Timepieces Ltd.' : 'e.g. Rahul Patel'}
                  className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 outline-none focus:border-gray-400 focus:bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 mb-1 block">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 outline-none focus:border-gray-400 focus:bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 mb-1 block">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 12345"
                  className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 outline-none focus:border-gray-400 focus:bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 mb-1 block">Account Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 outline-none focus:border-gray-400 cursor-pointer text-gray-900"
                >
                  <option value="Customer">Customer (Shop, Track Orders &amp; Wishlist)</option>
                  <option value="Supplier">Supplier / Vendor Partner (Publish Products &amp; Fulfill Orders)</option>
                </select>
              </div>

              {role === 'Supplier' && (
                <div>
                  <label className="font-semibold text-gray-700 mb-1 block">Primary Product Category *</label>
                  <select
                    value={supplierCategory}
                    onChange={(e) => setSupplierCategory(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 outline-none focus:border-gray-400 cursor-pointer text-gray-900"
                  >
                    <option value="Watches">Watches &amp; Horology</option>
                    <option value="Bags &amp; Wallets">Bags &amp; Leather Wallets</option>
                    <option value="Shoes">Footwear &amp; Sneakers</option>
                    <option value="Mobiles">Mobiles &amp; Smart Tech</option>
                    <option value="Clothes &amp; Fashion">Clothes &amp; Luxury Apparel</option>
                    <option value="Laptops">Laptops &amp; Workstations</option>
                    <option value="Electronics">Electronics &amp; Audio</option>
                  </select>
                </div>
              )}

              <div>
                <label className="font-semibold text-gray-700 mb-1 block">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 pr-10 outline-none focus:border-gray-400 focus:bg-white text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-black mt-2 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <BrandSpinner size="xs" variant="gold" inline={true} />
                    <span>Dispatching OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Email &amp; Register</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: 6-Digit OTP Verification Form */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4 text-xs animate-fade-in">
              <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-amber-700 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-900 block">Target Email</span>
                    <span className="text-xs font-bold text-gray-900">{email}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-[11px] font-bold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Change</span>
                </button>
              </div>

              {/* 6-Digit Code Input Boxes */}
              <div>
                <label className="font-semibold text-gray-700 block mb-2 text-center">
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex justify-center gap-2 sm:gap-2.5" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="h-12 w-10 sm:h-13 sm:w-11 text-center font-mono text-lg sm:text-xl font-extrabold rounded-xl border border-gray-300 bg-[#F4F4F6] text-gray-900 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-200/60 transition shadow-2xs"
                    />
                  ))}
                </div>
              </div>

              {/* Resend OTP & Expiry Countdown */}
              <div className="flex items-center justify-between text-[11px] pt-1 text-gray-500">
                <span>Code valid for 10 minutes</span>
                <button
                  type="button"
                  disabled={resendCooldown > 0}
                  onClick={handleResendOtp}
                  className={`font-bold transition cursor-pointer flex items-center gap-1 ${
                    resendCooldown > 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-950 hover:text-amber-700 hover:underline'
                  }`}
                >
                  <RotateCcw className={`h-3 w-3 ${resendCooldown > 0 ? '' : 'hover:rotate-180 transition-transform'}`} />
                  <span>
                    {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend Code'}
                  </span>
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-black mt-2 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <BrandSpinner size="xs" variant="gold" inline={true} />
                    <span>Activating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Verify OTP &amp; Create Account</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center text-xs text-gray-500 border-t border-gray-100 pt-4">
            Already have an account?{' '}
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