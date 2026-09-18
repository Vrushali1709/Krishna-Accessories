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
    <section className="relative w-full floor-prive-sanctuary py-14 sm:py-20 border-b border-[#EEEAE0] overflow-hidden">
      {/* Subtle Inset Ambient Light */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-[#C5A880]/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* VIP Privé Club Card */}
        <Reveal direction="zoom" delay={80} duration={750}>
          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#06080C] via-[#0E131F] to-[#080B12] text-white p-8 sm:p-12 lg:p-16 border border-[#C5A880]/35 shadow-[0_25px_65px_rgba(0,0,0,0.3)]">
            {/* Ambient Corner Glows */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#C5A880]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />

            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <Reveal direction="down" delay={140}>
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="h-1.5 w-6 rounded-full bg-[#C5A880]" />
                  <span className="text-[10.5px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#D5C2A5]">
                    EXCLUSIVE PRIVILEGES
                  </span>
                  <span className="h-1.5 w-6 rounded-full bg-[#C5A880]" />
                </div>
              </Reveal>

              <Reveal direction="up" delay={200}>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mt-1">
                  Join The Privé Club
                </h3>
              </Reveal>

              <Reveal direction="up" delay={260}>
                <p className="mt-3 text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed font-light">
                  Receive invitation-only access to private flash sales, bespoke showroom releases, and an instant 10% discount on your next order.
                </p>
              </Reveal>

              {subscribed ? (
                <div className="mt-7 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 p-5 text-center animate-fade-in shadow-xl">
                  <p className="text-sm font-extrabold text-emerald-300">
                    🎉 Welcome to Krishna Privé Club!
                  </p>
                  <p className="mt-1.5 text-xs text-neutral-200">
                    Use code <strong className="text-white font-mono bg-white/20 px-2 py-0.5 rounded border border-white/20">KRISHNA10</strong> at checkout for 10% instant discount.
                  </p>
                </div>
              ) : (
                <Reveal direction="up" delay={320}>
                  <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      required
                      className="flex-1 rounded-full bg-white/10 border border-white/20 px-5 py-3.5 text-xs sm:text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-[#C5A880] focus:bg-white/15 transition-all shadow-inner"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-gradient-to-r from-[#C5A880] to-[#DFCCA8] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:bg-white hover:shadow-[0_8px_25px_rgba(197,168,128,0.3)] active:scale-95 shrink-0 shadow-md cursor-pointer"
                    >
                      Subscribe
                    </button>
                  </form>
                </Reveal>
              )}

              <Reveal direction="up" delay={380}>
                <p className="mt-4 text-[10.5px] text-neutral-400 font-light">
                  🔒 We respect your privacy. No spam, unsubscribe with one click at any time.
                </p>
              </Reveal>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}

