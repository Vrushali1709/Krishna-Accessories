// src/components/InstagramClubSection.jsx
import React, { useState } from 'react';
import { Reveal } from './useScrollReveal';
import { SHOP_INFO } from '../utils/shopInfo';
import { InstagramIcon, ArrowRightIcon } from './Icons';

const INSTA_GALLERY = [
  {
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    tag: '@aesthetics_mumbai',
    category: 'Watches'
  },
  {
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    tag: '@gentleman_lifestyle',
    category: 'Leather Bags'
  },
  {
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    tag: '@audiophile_india',
    category: 'Audio & Gear'
  },
  {
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    tag: '@luxury_daily',
    category: 'Eyewear'
  },
  {
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    tag: '@sneakerhead_in',
    category: 'Footwear'
  },
  {
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    tag: '@tech_curator',
    category: 'Smart Gadgets'
  }
];

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
    <section className="bg-white py-14 sm:py-20 border-t border-gray-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <Reveal direction="up" delay={50}>
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
              <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
              <span>Community Style</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-950">
              Follow Us <span className="font-extrabold text-[#C5A880]">@krishnaaccessories</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-500">
              Tag us in your styling stories to be featured in our seasonal Mumbai flagship editorial gallery.
            </p>
          </div>
        </Reveal>

        {/* Instagram 6-Grid Images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-14 sm:mb-18">
          {INSTA_GALLERY.map((item, idx) => (
            <Reveal key={idx} direction="up" delay={idx * 60} duration={600}>
              <a
                href={SHOP_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square block overflow-hidden rounded-2xl bg-neutral-100 shadow-2xs border border-gray-200/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <img
                  src={item.image}
                  alt={item.category}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-white text-center backdrop-blur-xs">
                  <InstagramIcon className="w-6 h-6 text-white mb-1.5" />
                  <span className="text-[11px] font-bold tracking-tight">{item.tag}</span>
                  <span className="text-[9.5px] text-neutral-300 uppercase tracking-wider mt-0.5">{item.category}</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

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
