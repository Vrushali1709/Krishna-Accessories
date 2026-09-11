// src/components/LiveEmailToast.jsx
import React, { useState, useEffect } from 'react';

export default function LiveEmailToast() {
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleEmailDelivered = (e) => {
      if (!e.detail) return;
      setToast(e.detail);
      setCopied(false);

      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setToast(null);
      }, 10000);

      return () => clearTimeout(timer);
    };

    window.addEventListener('liveEmailDelivered', handleEmailDelivered);
    return () => window.removeEventListener('liveEmailDelivered', handleEmailDelivered);
  }, []);

  if (!toast) return null;

  const handleCopy = (code) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code);
    } else {
      const input = document.createElement('input');
      input.value = code;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md w-full animate-slide-up select-none">
      <div className="rounded-2xl border-2 border-amber-500/40 bg-[#080B11]/95 backdrop-blur-xl p-4 text-white shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-400/20 text-amber-300 text-xs">
              📩
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300 leading-tight">
                Live Email Dispatched
              </p>
              <p className="text-xs font-semibold text-neutral-200 truncate max-w-[220px]">
                To: {toast.to}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-neutral-400 hover:text-white text-xs p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Subject */}
        <p className="text-xs text-neutral-300 mb-2.5 font-medium leading-snug">
          {toast.subject}
        </p>

        {/* OTP Code Box (if applicable) */}
        {toast.otpCode && (
          <div className="flex items-center justify-between gap-3 bg-white/10 border border-white/15 rounded-xl p-2.5 mt-2">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold block">
                Verification Code
              </span>
              <span className="text-xl font-mono font-black text-amber-300 tracking-widest">
                {toast.otpCode}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(toast.otpCode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-400 hover:bg-amber-300 text-black font-extrabold shadow-xs'
              }`}
            >
              <span>{copied ? '✓ Copied' : 'Copy Code'}</span>
            </button>
          </div>
        )}

        <div className="mt-2.5 flex items-center justify-between text-[10px] text-neutral-400">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Delivered via Krishna Secure Mail</span>
          </span>
          <span>{toast.date?.split(',')[1] || 'Just now'}</span>
        </div>

      </div>
    </div>
  );
}
