// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setCurrentUser, setAuthToken } from '../utils/auth';
import { usersApi } from '../utils/api';
import { addSupplier } from '../utils/orderStore';
import { sendOtpEmail, verifyOtp, resendOtp, sendWelcomeEmail } from '../utils/emailService';
import { ArrowRightIcon, ShieldCheckIcon } from '../components/Icons';
import { RefreshCw, Mail, KeyRound, ArrowLeft } from 'lucide-react';
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
  const [supplierGstin, setSupplierGstin] = useState('');
  const [supplierAddress, setSupplierAddress] = useState('');
  const [supplierContactPerson, setSupplierContactPerson] = useState('');

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
        address: supplierAddress.trim() || "Gujarat, India",
        gstin: supplierGstin.trim() || "",
        contactPerson: supplierContactPerson.trim() || name.trim(),
        status: "Pending Approval"
      });
      setSubmitting(false);
      hideLoading();
      setSuccess('Supplier onboarding registered & verified! Directing to vendor portal...');
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
              {step === 1 ? 'Client Registration' : 'Email Verification Step'}
            </span>
            <h1 className="text-2xl font-bold text-slate-950 tracking-tight">
              {step === 1 ? 'Create an Account' : 'Verify Your Email'}
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {step === 1
                ? 'Join Krishna Accessories for bespoke concierge ordering and tracking'
                : `We have sent a 6-digit security OTP to ${email}`}
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-center gap-2">
            <div className={`h-1.5 w-12 rounded-full transition-all ${step === 1 ? 'bg-slate-950' : 'bg-emerald-600'}`} />
            <div className={`h-1.5 w-12 rounded-full transition-all ${step === 2 ? 'bg-slate-950' : 'bg-slate-200'}`} />
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

          {/* ================= STEP 1: REGISTRATION INPUT FORM ================= */}
          {step === 1 && (
            <form onSubmit={handleInitiateRegister} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  {role === 'Supplier' ? 'Company / Business Name *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'Supplier' ? "e.g. Apex Timepieces Ltd." : "e.g. Rahul Patel"}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-800 focus:bg-white focus:ring-4 focus:ring-slate-800/5"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-800 focus:bg-white focus:ring-4 focus:ring-slate-800/5"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 12345"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-800 focus:bg-white focus:ring-4 focus:ring-slate-800/5"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Account Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-900 outline-none transition-all focus:border-slate-800 focus:bg-white focus:ring-4 focus:ring-slate-800/5 cursor-pointer"
                >
                  <option value="Customer">Customer (Shop, Track Orders &amp; Wishlist)</option>
                  <option value="Supplier">Supplier / Vendor Partner (Publish Products &amp; Fulfill Orders)</option>
                </select>
              </div>

              {role === 'Supplier' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Contact Person Name</label>
                    <input
                      type="text"
                      value={supplierContactPerson}
                      onChange={(e) => setSupplierContactPerson(e.target.value)}
                      placeholder="e.g. Rajesh Vora (Director/Manager)"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-800 focus:bg-white focus:ring-4 focus:ring-slate-800/5"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Primary Product Category *</label>
                    <select
                      value={supplierCategory}
                      onChange={(e) => setSupplierCategory(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-900 outline-none transition-all focus:border-slate-800 focus:bg-white focus:ring-4 focus:ring-slate-800/5 cursor-pointer"
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1.5 block">GSTIN / Tax ID</label>
                      <input
                        type="text"
                        value={supplierGstin}
                        onChange={(e) => setSupplierGstin(e.target.value)}
                        placeholder="24AAACA1234F1Z8"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs font-mono uppercase text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-800 focus:bg-white focus:ring-4 focus:ring-slate-800/5"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Warehouse Dispatch City/State</label>
                      <input
                        type="text"
                        value={supplierAddress}
                        onChange={(e) => setSupplierAddress(e.target.value)}
                        placeholder="Surat, Gujarat"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-800 focus:bg-white focus:ring-4 focus:ring-slate-800/5"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-800 focus:bg-white focus:ring-4 focus:ring-slate-800/5"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 hover:bg-black py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-slate-950/10 transition-all cursor-pointer disabled:opacity-60 active:scale-[0.98] mt-2"
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
              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
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
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Enter 6-Digit Verification Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-slate-900 outline-none focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-800/5"
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
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all cursor-pointer disabled:opacity-60 active:scale-[0.98]"
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
                  className="text-xs text-slate-500 hover:text-black font-semibold cursor-pointer"
                >
                  &larr; Back to Registration Form
                </button>
              </div>
            </form>
          )}

          <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-slate-950 hover:underline">
              Sign In
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}