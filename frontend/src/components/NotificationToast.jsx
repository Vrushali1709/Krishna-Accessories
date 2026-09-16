// src/components/NotificationToast.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TOAST_DURATION = 4500; // 4.5 seconds

// Subtle Web Audio Chime
function playSubtleChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.15); // D6

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.35);
    osc2.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // Audio autostart restrictions in browser - fail silently
  }
}

const TYPE_CONFIG = {
  order: {
    icon: '📦',
    badge: 'Order Update',
    bg: 'bg-[#0E1726]/95 border-blue-500/40',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    progressBg: 'bg-blue-400',
    btnBg: 'bg-blue-500 hover:bg-blue-600 text-white'
  },
  cart: {
    icon: '🛍️',
    badge: 'Shopping Bag',
    bg: 'bg-[#091E16]/95 border-emerald-500/40',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    progressBg: 'bg-emerald-400',
    btnBg: 'bg-emerald-500 hover:bg-emerald-600 text-white'
  },
  wishlist: {
    icon: '❤️',
    badge: 'Wishlist',
    bg: 'bg-[#1C0F17]/95 border-rose-500/40',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    progressBg: 'bg-rose-400',
    btnBg: 'bg-rose-500 hover:bg-rose-600 text-white'
  },
  promo: {
    icon: '🏷️',
    badge: 'Offer & Voucher',
    bg: 'bg-[#1D1606]/95 border-amber-500/40',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    progressBg: 'bg-amber-400',
    btnBg: 'bg-amber-500 hover:bg-amber-600 text-black font-bold'
  },
  account: {
    icon: '👤',
    badge: 'Account & Security',
    bg: 'bg-[#111322]/95 border-indigo-500/40',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    progressBg: 'bg-indigo-400',
    btnBg: 'bg-indigo-500 hover:bg-indigo-600 text-white'
  },
  supplier: {
    icon: '🏢',
    badge: 'Supplier Portal',
    bg: 'bg-[#0E1726]/95 border-cyan-500/40',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    progressBg: 'bg-cyan-400',
    btnBg: 'bg-cyan-500 hover:bg-cyan-600 text-white'
  },
  admin: {
    icon: '⚙️',
    badge: 'Admin Console',
    bg: 'bg-[#171324]/95 border-purple-500/40',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    progressBg: 'bg-purple-400',
    btnBg: 'bg-purple-500 hover:bg-purple-600 text-white'
  },
  email: {
    icon: '✉️',
    badge: 'Notification Dispatched',
    bg: 'bg-[#14121B]/95 border-amber-500/40',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    progressBg: 'bg-amber-400',
    btnBg: 'bg-amber-500 hover:bg-amber-600 text-black font-bold'
  },
  info: {
    icon: '✨',
    badge: 'Notification',
    bg: 'bg-[#0E131F]/95 border-slate-700/60',
    badgeBg: 'bg-slate-700/40 text-slate-300 border-slate-600/40',
    progressBg: 'bg-amber-400',
    btnBg: 'bg-slate-800 hover:bg-slate-700 text-white'
  }
};

export default function NotificationToast() {
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();
  const timersRef = useRef({});

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  };

  useEffect(() => {
    const handleAppNotification = (e) => {
      const notif = e.detail;
      if (!notif || !notif.title) return;

      const toastId = notif.id || Date.now() + Math.random();
      const newToastItem = {
        ...notif,
        id: toastId,
        createdAt: Date.now()
      };

      // Play soft chime
      playSubtleChime();

      setToasts((prev) => {
        // Keep maximum 3 latest visible toasts
        const filtered = prev.filter(t => t.id !== toastId);
        return [newToastItem, ...filtered].slice(0, 3);
      });

      // Auto dismiss timer
      timersRef.current[toastId] = setTimeout(() => {
        removeToast(toastId);
      }, TOAST_DURATION);
    };

    window.addEventListener('appNotification', handleAppNotification);
    return () => {
      window.removeEventListener('appNotification', handleAppNotification);
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-16 sm:top-20 right-3 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-[calc(100vw-24px)] sm:max-w-md w-full pointer-events-none select-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const config = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border-2 backdrop-blur-xl p-3.5 sm:p-4 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 transform animate-slide-up relative overflow-hidden ${config.bg}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 text-sm shrink-0 shadow-inner">
                  {config.icon}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`inline-block rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${config.badgeBg}`}>
                      {config.badge}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Just now
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight mt-0.5 truncate">
                    {toast.title}
                  </h4>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white text-xs p-1 rounded-lg hover:bg-white/10 transition shrink-0 cursor-pointer"
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>

            {/* Message Body */}
            {toast.message && (
              <p className="mt-1.5 text-xs text-gray-300 leading-relaxed break-words line-clamp-2">
                {toast.message}
              </p>
            )}

            {/* Action Buttons if Link Provided */}
            {toast.link && (
              <div className="mt-2.5 flex items-center justify-end gap-2 pt-1 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    removeToast(toast.id);
                    navigate(toast.link);
                  }}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1 ${config.btnBg}`}
                >
                  <span>{toast.actionText || 'View Details'}</span>
                  <span>&rarr;</span>
                </button>
              </div>
            )}

            {/* Auto-Dismiss Countdown Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/10 overflow-hidden">
              <div
                className={`h-full ${config.progressBg}`}
                style={{
                  animation: `toastProgress ${TOAST_DURATION}ms linear forwards`
                }}
              />
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
