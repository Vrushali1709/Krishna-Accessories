// src/components/NewsletterVIPSection.jsx
import React, { useState } from 'react';

export default function NewsletterVIPSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('PRIVÉ500');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1120] via-[#0F172A] to-[#1E293B] text-white p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-2xl">
        {/* Ambient Gold Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/15 border border-amber-400/30 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-300 backdrop-blur-md mb-4">
            <span>👑</span>
            <span>Krishna Privé Inner Circle</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-white">
            Unlock Instant <span className="text-amber-400">₹500 Privilege</span>
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-gray-300 font-light max-w-lg mx-auto leading-relaxed">
            Subscribe for private invitations to rare Swiss chronograph drops, secret sales, and complimentary insured delivery across India.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your VIP email address..."
                className="flex-1 rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-hidden focus:border-amber-400 focus:bg-white/15 transition backdrop-blur-md"
              />
              <button
                type="submit"
                className="rounded-2xl bg-amber-400 px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-black hover:bg-amber-300 transition active:scale-95 shadow-md shrink-0 cursor-pointer"
              >
                Join Privé →
              </button>
            </form>
          ) : (
            <div className="mt-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-center animate-fade-in max-w-md mx-auto">
              <p className="text-xs font-bold text-amber-300">
                🎉 Welcome to Krishna Privé! Use code at checkout:
              </p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="font-mono text-base font-extrabold bg-black/50 px-3 py-1 rounded-lg border border-amber-400/50 text-white tracking-widest">
                  PRIVÉ500
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="rounded-lg bg-amber-400 px-3 py-1 text-xs font-bold text-black hover:bg-amber-300 transition cursor-pointer"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-gray-400">
            <span>✓ No spam guarantee</span>
            <span>•</span>
            <span>✓ Instant discount</span>
            <span>•</span>
            <span>✓ VIP drop alerts</span>
          </div>
        </div>
      </div>
    </section>
  );
}
