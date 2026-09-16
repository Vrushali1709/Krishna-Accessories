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
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <Reveal direction="up" delay={50} duration={600}>
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-neutral-950 text-white p-8 sm:p-12 lg:p-14 border border-neutral-800 shadow-[0_4px_24px_rgba(0,0,0,0.12)]">
          
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-300 mb-2">
              EXCLUSIVE PRIVILEGES
            </span>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Join The Privé Circle
            </h3>

            <p className="mt-3 text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
              Receive private invitations to limited horology releases, bespoke showroom previews, and an instant 10% discount on your next order.
            </p>

            {subscribed ? (
              <div className="mt-6 rounded-2xl bg-neutral-900 border border-neutral-700 p-4 text-center">
                <p className="text-sm font-semibold text-amber-300">
                  Welcome to the Krishna Privé Circle
                </p>
                <p className="mt-1 text-xs text-neutral-300">
                  Use coupon code <strong className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">KRISHNA10</strong> at checkout for 10% off.
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
                  className="flex-1 rounded-full bg-white/10 border border-white/15 px-5 py-3 text-xs sm:text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-amber-300 focus:bg-white/15 transition-all"
                />
                <button
                  type="submit"
                  className="rounded-full bg-white px-7 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-950 transition-all duration-200 hover:bg-neutral-200 active:scale-95 shrink-0 cursor-pointer shadow-2xs"
                >
                  Subscribe
                </button>
              </form>
            )}

            <p className="mt-4 text-[11px] text-neutral-400">
              No spam. Unsubscribe with a single click at any time.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
