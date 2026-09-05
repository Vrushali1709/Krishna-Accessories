// src/pages/TermsConditions.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 overflow-x-clip">
      <Navbar />

      <section className="bg-white border-b border-zinc-200/80 py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B89035]">Legal Agreement</span>
          <h1 className="mt-1 text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-sans">Terms & Conditions</h1>
          <p className="mt-2 text-xs text-zinc-500">Effective Date: 01 September 2026</p>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-10 shadow-xs space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-zinc-950">1. Acceptance of Terms</h2>
            <p>
              By accessing and utilizing the Krishna Accessories platform, placing orders, or engaging with our vendor network, you agree to be bound by these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-zinc-950">2. Certified Authenticity & Pricing</h2>
            <p>
              All products listed are guaranteed 100% authentic and sourced from verified brand partners. Prices are displayed in Indian Rupees (₹) and include all applicable GST and duties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-zinc-950">3. Order Fulfillment & Delivery</h2>
            <p>
              Orders undergo multi-point inspection prior to handover to courier partners. In the unlikely event of transit delays caused by force majeure or courier constraints, our concierge desk provides real-time updates.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-zinc-950">4. 7-Day Return Privilege</h2>
            <p>
              Clients may initiate a return within 7 calendar days of delivery provided the goods remain unopened in original packaging with all security tags intact.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-zinc-950">5. Jurisdiction</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the State of Gujarat, India, with exclusive jurisdiction in the courts of Ahmedabad.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
