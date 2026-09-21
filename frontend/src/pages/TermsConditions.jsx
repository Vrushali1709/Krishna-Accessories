// src/pages/TermsConditions.jsx
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheck, Scale, FileText, CheckCircle2 } from 'lucide-react';

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

export default function TermsConditions() {
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
                Legal Agreement &amp; Governance
              </span>
            </div>
          </Reveal>

          {/* Editorial Serif Heading */}
          <Reveal delay={100} direction="up">
            <h1 className="mt-4 font-serif text-3xl sm:text-5xl font-medium tracking-tight text-neutral-950 leading-[1.15]">
              Terms &amp; Conditions <br />
              <span className="italic font-normal text-[#8C6734]">Of Sale &amp; Service.</span>
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
      {/* 2. TERMS & CONDITIONS CONTENT CARD                                        */}
      {/* ========================================================================= */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        <Reveal delay={50} direction="up">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-12 shadow-sm space-y-8 text-xs sm:text-sm text-neutral-700 leading-relaxed">
            
            <section className="space-y-2.5">
              <div className="flex items-center gap-2 text-[#8C6734]">
                <Scale className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Section 01</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-neutral-950">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing, browsing, or placing orders via the Krishna Accessories digital catalog or concierge service, you agree to be bound by these Terms and Conditions and all applicable laws and regulations of the Republic of India.
              </p>
            </section>

            <section className="space-y-2.5 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2 text-[#8C6734]">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Section 02</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-neutral-950">
                2. Product Authenticity &amp; Transparent Pricing
              </h2>
              <p>
                All timepieces, leather goods, footwear, and consumer tech products offered are strictly quality verified through certified brand channels. All listed prices are shown in Indian Rupees (₹) inclusive of all applicable GST, duties, and official warranty paperwork.
              </p>
            </section>

            <section className="space-y-2.5 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2 text-[#8C6734]">
                <FileText className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Section 03</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-neutral-950">
                3. Consignment Fulfillment &amp; Transit Insurance
              </h2>
              <p>
                Every order undergoes pre-dispatch inspection at our boutique prior to tamper-evident sealed packaging. In the rare event of transit delays due to courier operational constraints, our concierge team proactively provides real-time milestone updates.
              </p>
            </section>

            <section className="space-y-2.5 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2 text-[#8C6734]">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Section 04</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-neutral-950">
                4. 7-Day Inspection &amp; Return Privilege
              </h2>
              <p>
                Clients may initiate a return or exchange within 7 calendar days of delivery, provided goods remain unused in pristine condition with original serial tags, boxes, and protective films intact.
              </p>
            </section>

            <section className="space-y-2.5 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2 text-[#8C6734]">
                <Scale className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Section 05</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-neutral-950">
                5. Legal Jurisdiction
              </h2>
              <p>
                These terms are governed by and construed under the laws of the State of Maharashtra, India. Any disputes arising in connection with these terms shall fall under the exclusive jurisdiction of the competent courts of Mumbai, Maharashtra.
              </p>
            </section>

          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
