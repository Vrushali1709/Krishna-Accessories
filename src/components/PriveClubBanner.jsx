// src/components/PriveClubBanner.jsx
import { useState } from 'react';

export default function PriveClubBanner({ onToast }) {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const couponCode = 'KRISHNA10';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    if (onToast) onToast('✓ Coupon code KRISHNA10 copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      if (onToast) onToast('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    if (onToast) onToast('🎉 Welcome to Krishna Privé Club! Your 10% discount is unlocked.');
    setEmail('');
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-[#0B0F19] via-[#0F172A] to-[#1E293B] text-white p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-xl">
        
        {/* Decorative Background Accents */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Privé Benefits & Voucher */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-400 text-sm">✦</span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.28em] text-amber-300">
                VIP Privé Membership
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Unlock 10% Instant Privilege On Your First Order
            </h2>

            <p className="mt-2.5 text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              Join our distinguished circle of 50,000+ luxury connoisseurs. Enjoy priority concierge service, private vault drops, and certified authenticity guarantee.
            </p>

            {/* Coupon Code Pill */}
            <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-2 sm:p-2.5">
              <span className="text-xs text-slate-300 pl-2">Use voucher:</span>
              <span className="font-mono text-sm sm:text-base font-black text-amber-300 tracking-wider bg-black/40 px-3 py-1 rounded-xl border border-amber-400/30">
                {couponCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="rounded-xl bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-amber-300 transition shadow-2xs cursor-pointer active:scale-95"
              >
                {copied ? '✓ Copied!' : 'Copy Code'}
              </button>
            </div>

            {/* Micro Feature Checkmarks */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-[11px] sm:text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Official Brand Warranty
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Free Insured Express Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> 7-Day Peace of Mind Return
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Newsletter Subscription */}
          <div className="lg:col-span-5 bg-black/40 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-7">
            <h3 className="text-base sm:text-lg font-bold text-white">
              Join the Privé Newsletter
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Be the first to know when limited Swiss watches & flagship tech drops go live.
            </p>

            {subscribed ? (
              <div className="mt-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 p-4 text-center">
                <span className="text-xl">🎉</span>
                <h4 className="mt-1 text-xs font-bold text-emerald-300">You're on the VIP list!</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">Check your inbox for exclusive catalog previews.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-4 space-y-3">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none transition focus:border-amber-400 focus:bg-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-white py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-amber-300 transition shadow-md active:scale-98 cursor-pointer"
                >
                  Join Krishna Privé →
                </button>
              </form>
            )}

            <p className="mt-3 text-[10px] text-slate-500 text-center">
              We respect your privacy. Unsubscribe anytime in 1 click.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
