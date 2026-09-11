// src/components/InstagramClubSection.jsx
import React, { useState } from 'react';
import { Reveal } from './useScrollReveal';

export default function InstagramClubSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <section className="bg-white py-10 sm:py-14 border-t border-gray-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* VIP Privé Club Newsletter Card */}
        <Reveal direction="zoom" delay={150}>
          <div className="relative overflow-hidden rounded-3xl bg-[#090C15] text-white p-8 sm:p-12 lg:p-14 border border-neutral-800 shadow-2xl">
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-[0.28em] text-amber-300 mb-2">
                EXCLUSIVE PRIVILEGES
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                Join The Privé Club
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                Receive invitation-only access to private flash sales, bespoke showroom releases, and an instant 10% discount on your next order.
              </p>

              {subscribed ? (
                <div className="mt-6 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 p-4 text-center animate-fade-in">
                  <p className="text-sm font-bold text-emerald-300">
                    🎉 Welcome to Krishna Privé Club!
                  </p>
                  <p className="mt-1 text-xs text-neutral-300">
                    Use code <strong className="text-white font-mono bg-white/15 px-1.5 py-0.5 rounded">KRISHNA10</strong> at checkout for 10% instant discount.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-7 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="flex-1 rounded-full bg-white/10 border border-white/20 px-5 py-3 text-xs sm:text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-white px-7 py-3 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:bg-[#E5D7C5] hover:shadow-lg active:scale-95 shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}

              <p className="mt-4 text-[10px] text-neutral-500">
                🔒 We respect your privacy. No spam, unsubscribe with one click at any time.
              </p>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
