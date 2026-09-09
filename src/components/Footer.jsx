// src/components/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { defaultCategories } from '../utils/productStore';
import {
  Sparkles,
  Mail,
  Gift,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Crown,
  Star,
  Lock
} from 'lucide-react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText('KRISHNA10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {/* 1. Standalone Newsletter / Curated Releases Section (Outside Footer) */}
      <section className="py-10 sm:py-16 bg-[#F4F5F8] relative overflow-hidden">
        {/* Subtle background ambient mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[360px] bg-gradient-to-r from-amber-300/15 via-blue-400/10 to-amber-200/15 blur-3xl rounded-full" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden bg-gradient-to-br from-[#060A14] via-[#0C1427] to-[#111C38] border border-amber-500/30 sm:border-amber-400/40 p-6 sm:p-10 lg:p-12 shadow-[0_24px_60px_-15px_rgba(2,6,23,0.5),0_0_40px_rgba(245,158,11,0.09)]">
            
            {/* Shimmering Top Gold Accent Line */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            
            {/* Ambient Radial Glows */}
            <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
            <div className="absolute right-1/3 bottom-0 h-48 w-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

            {/* Subtle Luxury Pattern / Grid */}
            <div 
              className="absolute inset-0 opacity-[0.035] pointer-events-none" 
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: VIP Badge, Heading, Subtitle & Perks */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                
                {/* VIP Access Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/5 border border-amber-400/40 px-3.5 py-1.5 backdrop-blur-md">
                  <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
                    Krishna Privé • VIP Access
                  </span>
                </div>

                {/* Heading */}
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-serif leading-tight">
                  Ready for <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 bg-clip-text text-transparent">Curated Releases</span>?
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm leading-relaxed text-slate-300 max-w-xl">
                  Receive private invitations to limited-edition timepieces, handcrafted essentials, and members-only promotions directly from authorized boutiques.
                </p>

                {/* VIP Perks Badges */}
                <div className="pt-1 flex flex-wrap gap-2.5 sm:gap-3">
                  <div className="flex items-center gap-1.5 rounded-xl bg-white/[0.06] border border-white/[0.08] px-3 py-1.5 text-[11px] sm:text-xs text-amber-200/90 backdrop-blur-xs">
                    <Gift className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><strong>10% Off</strong> Welcome Voucher</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl bg-white/[0.06] border border-white/[0.08] px-3 py-1.5 text-[11px] sm:text-xs text-slate-300 backdrop-blur-xs">
                    <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span><strong>24h Early Access</strong> to Drops</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl bg-white/[0.06] border border-white/[0.08] px-3 py-1.5 text-[11px] sm:text-xs text-slate-300 backdrop-blur-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>100% Certified Authentic</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Interactive Subscription Form & VIP Perks Card */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.05] p-5 sm:p-6 backdrop-blur-md shadow-inner">
                  
                  {!subscribed ? (
                    <form onSubmit={handleSubscribe} className="space-y-3.5">
                      <div className="flex items-center justify-between text-xs text-slate-300 px-1">
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          Join 14,800+ Connoisseurs
                        </span>
                        <span className="text-[11px] text-amber-300 font-medium">
                          Zero Spam • 1-Click Exit
                        </span>
                      </div>

                      {/* Email Input Field with Icon */}
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-400/80 group-focus-within:text-amber-400 transition-colors">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          placeholder="Enter your email address..."
                          className="w-full rounded-2xl border border-white/20 bg-slate-900/80 py-3.5 pl-11 pr-4 text-xs sm:text-sm text-white placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-amber-400 focus:bg-slate-950 focus:ring-2 focus:ring-amber-400/25 shadow-inner"
                        />
                      </div>

                      {/* Action Button */}
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 py-3.5 px-6 text-xs sm:text-sm font-bold tracking-wide text-slate-950 shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all duration-200 hover:from-amber-300 hover:via-amber-400 hover:to-amber-500 hover:shadow-[0_6px_25px_rgba(245,158,11,0.45)] hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
                      >
                        <span>Join Privé & Claim Access</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <div className="flex items-center justify-between text-[10.5px] text-slate-400 px-1 pt-1">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          4.9/5 Rating by Luxury Buyers
                        </span>
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3 text-slate-400" />
                          256-Bit Encrypted
                        </span>
                      </div>
                    </form>
                  ) : (
                    /* Subscribed Success Box */
                    <div className="rounded-2xl bg-emerald-950/40 border border-emerald-500/40 p-5 text-center space-y-3.5 animate-fade-in">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">
                          Welcome to Krishna Privé!
                        </h4>
                        <p className="text-xs text-slate-300 mt-1">
                          Your private invitation & welcome voucher are active.
                        </p>
                      </div>

                      {/* Promo Code Copy Card */}
                      <div className="flex items-center justify-between rounded-xl bg-slate-900/90 border border-amber-500/30 px-4 py-2.5">
                        <div className="text-left">
                          <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                            Your 10% Welcome Code
                          </span>
                          <span className="font-mono font-bold text-sm tracking-wider text-amber-300">
                            KRISHNA10
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={copyCode}
                          className="flex items-center gap-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 px-3 py-1.5 text-xs font-semibold text-amber-300 transition-all cursor-pointer active:scale-95"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSubscribed(false)}
                        className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                      >
                        Enter another email
                      </button>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Dark Luxury Footer */}
      <footer className="border-t border-slate-800 bg-[#090D16] text-white relative overflow-hidden">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 left-1/4 -translate-y-1/2 h-48 w-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 translate-y-1/2 h-48 w-96 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">

            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="inline-flex items-center gap-2.5 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 font-serif text-base font-black text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
                  K
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                  Krishna <span className="font-bold text-amber-400">Accessories</span>
                </span>
              </Link>

              <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-slate-300">
                Ahmedabad's premier luxury destination for certified authentic timepieces, handcrafted leather goods, premium electronics, and curated lifestyle essentials.
              </p>

              {/* Store & Contact details container */}
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-2 text-xs text-slate-300 backdrop-blur-xs max-w-md">
                <p className="flex items-start gap-2">
                  <span className="text-amber-400 font-semibold shrink-0">📍 Flagship:</span>
                  <span className="text-slate-200 font-medium">Bodakdev, SG Highway, Ahmedabad 380054</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-amber-400 font-semibold shrink-0">📞 Desk:</span>
                  <span className="text-slate-200 font-medium">+91 (079) 4000-5500 &bull; care@krishnaaccessories.com</span>
                </p>
              </div>
            </div>

            {/* Departments */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                Departments
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                {defaultCategories.slice(0, 6).map((cat) => (
                  <li key={cat}>
                    <Link
                      to={`/shop?category=${encodeURIComponent(cat)}`}
                      className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block"
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Client Assistance */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                Client Support
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li>
                  <Link to="/tracking" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                    Track Consignment
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                    My Orders & Account
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                    Saved Wishlist
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                    FAQ & Authenticity
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                    Contact Concierge
                  </Link>
                </li>
              </ul>
            </div>

            {/* Portals & Legal */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                Portals & Legal
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li>
                  <Link to="/supplier" className="font-semibold text-cyan-400 transition-all duration-200 hover:text-cyan-300 hover:translate-x-1 inline-flex items-center gap-1">
                    Vendor Partner Portal &rarr;
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="font-semibold text-amber-400 transition-all duration-200 hover:text-amber-300 hover:translate-x-1 inline-flex items-center gap-1">
                    Admin Management &rarr;
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                    Our Heritage & Story
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Strip */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-400 sm:flex-row">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} Krishna Accessories Ltd. 100% Certified Authentic Guarantee.
            </p>

            {/* Social media badges */}
            <div className="flex items-center gap-2">
              {[
                { name: 'X', icon: '𝕏' },
                { name: 'Facebook', icon: 'f' },
                { name: 'LinkedIn', icon: 'in' },
                { name: 'Instagram', icon: 'ig' }
              ].map((social) => (
                <span
                  key={social.name}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/80 text-xs font-bold text-slate-300 shadow-sm transition-all duration-200 hover:border-amber-400 hover:bg-amber-400 hover:text-slate-950 hover:shadow-[0_0_12px_rgba(251,191,36,0.3)] active:scale-95"
                  title={social.name}
                >
                  {social.icon}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}