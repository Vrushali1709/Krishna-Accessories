// src/pages/TermsConditions.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900">
      <Navbar />

      <section className="bg-white border-b border-gray-200 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Legal Agreement</span>
          <h1 className="mt-1 text-2xl sm:text-4xl font-bold tracking-tight text-gray-950">Terms & Conditions</h1>
          <p className="mt-2 text-xs text-gray-500">Effective Date: 01 September 2026</p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-950">1. Acceptance of Terms</h2>
            <p>
              By accessing and utilizing the Krishna Accessories platform, placing orders, or engaging with our vendor network, you agree to be bound by these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-950">2. Certified Authenticity & Pricing</h2>
            <p>
              All products listed are guaranteed 100% authentic and sourced from verified brand partners. Prices are displayed in Indian Rupees (₹) and include all applicable GST and duties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-950">3. Order Fulfillment & Delivery</h2>
            <p>
              Orders undergo multi-point inspection prior to handover to courier partners. In the unlikely event of transit delays caused by force majeure or courier constraints, our concierge desk provides real-time updates.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-950">4. 7-Day Return Privilege</h2>
            <p>
              Clients may initiate a return within 7 calendar days of delivery provided the goods remain unopened in original packaging with all security tags intact.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-950">5. Jurisdiction</h2>
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
