// src/pages/PrivacyPolicy.jsx
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheck, Lock, FileText, Eye, CheckCircle2 } from 'lucide-react';

// =========================================================================
// CUSTOM ANIMATION HOOK: Intersection Observer for on-scroll reveals
// =========================================================================
function useInView(options = { threshold: 0.1, triggerOnce: true }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (options.triggerOnce) {
          observer.unobserve(entry.target);
        }
      }
    }, options);

    const currentElem = ref.current;
    if (currentElem) observer.observe(currentElem);

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [options.threshold, options.triggerOnce]);

  return [ref, inView];
}

function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  threshold = 0.08
}) {
  const [ref, inView] = useInView({ threshold, triggerOnce: true });

  const getTransform = () => {
    if (inView) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 24px, 0)';
      case 'down':
        return 'translate3d(0, -24px, 0)';
      case 'left':
        return 'translate3d(24px, 0, 0)';
      case 'right':
        return 'translate3d(-24px, 0, 0)';
      case 'zoom':
        return 'scale(0.97)';
      default:
        return 'translate3d(0, 20px, 0)';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO BANNER (Luxury Editorial Header Matching About & New Arrivals)    */}
      {/* ========================================================================= */}
      <section className="relative bg-white border-b border-neutral-200/80 overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          {/* Eyebrow Badge with Pulse */}
          <Reveal delay={0} direction="up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs mx-auto">
              <span className="w-2 h-2 rounded-full bg-[#8C6734] animate-ping" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8C6734]">
                Legal Security &amp; Protection
              </span>
            </div>
          </Reveal>

          {/* Editorial Serif Heading */}
          <Reveal delay={100} direction="up">
            <h1 className="mt-4 font-serif text-3xl sm:text-5xl font-medium tracking-tight text-neutral-950 leading-[1.15]">
              Privacy Policy <br />
              <span className="italic font-normal text-[#8C6734]">&amp; Data Confidentiality.</span>
            </h1>
          </Reveal>

          {/* Description */}
          <Reveal delay={180} direction="up">
            <p className="mt-3 text-xs sm:text-sm text-neutral-500 font-normal">
              Effective Date: 01 September 2026 &bull; Krishna Accessories Private Limited
            </p>
          </Reveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. LEGAL POLICY CONTENT CARD                                              */}
      {/* ========================================================================= */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        <Reveal delay={50} direction="up">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-12 shadow-sm space-y-8 text-xs sm:text-sm text-neutral-700 leading-relaxed">
            
            <section className="space-y-2.5">
              <div className="flex items-center gap-2 text-[#8C6734]">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Section 01</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-neutral-950">
                1. Commitment to Client Confidentiality
              </h2>
              <p>
                Krishna Accessories ("Krishna Accessories", "we", "us", or "our") deeply values and respects the privacy of our clientele. This privacy policy transparently details how we collect, safeguard, and utilize your personal information when you access our platform, boutique services, and client communications.
              </p>
            </section>

            <section className="space-y-2.5 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2 text-[#8C6734]">
                <FileText className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Section 02</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-neutral-950">
                2. Information We Collect
              </h2>
              <p>
                We gather necessary details explicitly provided by you during account creation, checkout placement, consignment status lookups, and customer concierge inquiries:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-neutral-600">
                <li className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FAFAFB] border border-neutral-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734]" />
                  <span>Full name and delivery destination</span>
                </li>
                <li className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FAFAFB] border border-neutral-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734]" />
                  <span>Contact telephone &amp; email records</span>
                </li>
                <li className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FAFAFB] border border-neutral-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734]" />
                  <span>Transaction invoices and consignment logs</span>
                </li>
                <li className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FAFAFB] border border-neutral-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734]" />
                  <span>Saved wishlist &amp; bag preferences</span>
                </li>
              </ul>
            </section>

            <section className="space-y-2.5 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2 text-[#8C6734]">
                <Lock className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Section 03</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-neutral-950">
                3. Payment Security &amp; Encryption
              </h2>
              <p>
                We do not store your full debit or credit card credentials on our servers. All digital transactions are processed through RBI-regulated payment gateways complying with PCI-DSS Tier 1 standards and 256-bit SSL encryption.
              </p>
            </section>

            <section className="space-y-2.5 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2 text-[#8C6734]">
                <Eye className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Section 04</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-neutral-950">
                4. Logistics Partner Sharing
              </h2>
              <p>
                Your delivery coordinates and contact telephone number are shared exclusively with certified air courier partners (e.g. BlueDart Express, Delhivery) strictly for executing verified, insured doorstep delivery.
              </p>
            </section>

            <section className="space-y-2.5 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2 text-[#8C6734]">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Section 05</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-neutral-950">
                5. Contact Our Privacy Officer
              </h2>
              <p>
                If you have questions regarding your client data, rights, or wish to request data removal, write directly to our Data Protection Officer at <strong className="text-neutral-950 font-semibold">shantilal6186@gmail.com</strong> or visit our flagship boutique at Heera Panna Shopping Center, Haji Ali, Mumbai.
              </p>
            </section>

          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}