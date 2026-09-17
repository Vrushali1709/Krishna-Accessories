// src/pages/TermsConditions.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Reveal } from '../components/useScrollReveal';
import { ShieldCheck, Scale, FileCheck2, Sparkles } from 'lucide-react';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      <section className="bg-white border-b border-neutral-200/80 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal delay={0} direction="up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734] animate-ping" />
              <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#8C6734]">
                Legal Agreement &amp; Terms
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-neutral-950">
              Terms &amp; <span className="italic font-normal text-[#8C6734]">Conditions</span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500">Effective Date: 01 September 2026 &bull; Version 2.4</p>
          </Reveal>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14 sm:px-6 lg:px-8">
        <Reveal delay={50} direction="up">
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-12 shadow-sm space-y-8 text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal">
            <section className="space-y-2.5">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
                <span className="text-[#8C6734]">1.</span> Acceptance of Terms
              </h2>
              <p className="text-neutral-600">
                By accessing and utilizing the Krishna Accessories platform, placing orders, or engaging with our vendor network, you agree to be bound by these Terms and Conditions.
              </p>
            </section>

            <section className="space-y-2.5">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
                <span className="text-[#8C6734]">2.</span> Product Quality &amp; Pricing
              </h2>
              <p className="text-neutral-600">
                All products listed are curated for quality and sourced from verified supplier partners. Prices are displayed in Indian Rupees (₹) and include all applicable GST and duties.
              </p>
            </section>

            <section className="space-y-2.5">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
                <span className="text-[#8C6734]">3.</span> Order Fulfillment &amp; Delivery
              </h2>
              <p className="text-neutral-600">
                Orders undergo multi-point inspection prior to handover to courier partners. In the unlikely event of transit delays caused by force majeure or courier constraints, our concierge desk provides real-time updates.
              </p>
            </section>

            <section className="space-y-2.5">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
                <span className="text-[#8C6734]">4.</span> 7-Day Return Privilege
              </h2>
              <p className="text-neutral-600">
                Clients may initiate a return within 7 calendar days of delivery provided the goods remain unopened in original packaging with all security tags intact.
              </p>
            </section>

            <section className="space-y-2.5">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
                <span className="text-[#8C6734]">5.</span> Governing Jurisdiction
              </h2>
              <p className="text-neutral-600">
                These terms shall be governed by and construed in accordance with the laws of the Republic of India, with exclusive jurisdiction in the courts of Mumbai, Maharashtra.
              </p>
            </section>
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
