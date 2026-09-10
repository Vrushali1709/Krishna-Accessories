// src/components/EmailToastNotification.jsx
import React, { useState, useEffect } from 'react';
import { Mail, Check, Copy, ExternalLink, X, ShieldAlert, Key } from 'lucide-react';

export default function EmailToastNotification() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleEmailDispatched = (e) => {
      const emailData = e.detail;
      if (!emailData) return;

      const newToast = {
        id: emailData.id || `toast-${Date.now()}-${Math.random()}`,
        to: emailData.to,
        subject: emailData.subject,
        otpCode: emailData.otpCode,
        type: emailData.type,
        timestamp: Date.now(),
        copied: false
      };

      setToasts((prev) => [newToast, ...prev].slice(0, 3));
    };

    window.addEventListener('emailDispatched', handleEmailDispatched);
    return () => {
      window.removeEventListener('emailDispatched', handleEmailDispatched);
    };
  }, []);

  // Auto-remove toasts after 8.5 seconds
  useEffect(() => {
    if (toasts.length === 0) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setToasts((prev) => prev.filter((t) => now - t.timestamp < 8500));
    }, 1000);
    return () => clearInterval(interval);
  }, [toasts.length]);

  const handleCopyOtp = (toastId, otpCode) => {
    if (!otpCode) return;
    navigator.clipboard.writeText(otpCode);
    setToasts((prev) =>
      prev.map((t) => (t.id === toastId ? { ...t, copied: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === toastId ? { ...t, copied: false } : t))
      );
    }, 2500);
  };

  const handleDismiss = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenEmailViewer = (toast) => {
    window.dispatchEvent(new CustomEvent('openEmailViewer', { detail: { emailId: toast.id } }));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm sm:max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        const isOtp = !!toast.otpCode;
        return (
          <div
            key={toast.id}
            className="pointer-events-auto rounded-2xl border border-amber-500/40 bg-[#090B0E]/95 backdrop-blur-xl p-4 text-white shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300 animate-slide-up hover:border-amber-400"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                  isOtp ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {isOtp ? <Key className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                </div>
                <div>
                  <span className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-amber-400/90 block">
                    {isOtp ? 'OTP Dispatched' : 'Email Delivered'}
                  </span>
                  <p className="text-xs font-semibold text-slate-200 line-clamp-1 max-w-[200px] sm:max-w-[240px]">
                    {toast.subject}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDismiss(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
                aria-label="Close notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Recipient info */}
            <div className="mt-2.5 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
              <span className="truncate max-w-[220px]">
                To: <strong className="text-slate-200">{toast.to}</strong>
              </span>
              <span className="text-[10px] text-slate-500">Just now</span>
            </div>

            {/* OTP Code Badge & Quick Actions */}
            {isOtp && (
              <div className="mt-3 flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Code:</span>
                  <span className="font-mono text-base font-extrabold text-amber-300 tracking-widest">
                    {toast.otpCode}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyOtp(toast.id, toast.otpCode)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    toast.copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
                  }`}
                >
                  {toast.copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy OTP</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Action Bar */}
            <div className="mt-2.5 flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleOpenEmailViewer(toast)}
                className="text-[11px] font-semibold text-slate-400 hover:text-amber-300 flex items-center gap-1 transition"
              >
                <span>View Full Email</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
