// src/pages/PrivacyPolicy.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
      <Navbar />

      <section className="bg-white border-b border-gray-200 py-10 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Legal & Security</span>
          <h1 className="mt-1 text-2xl sm:text-4xl font-bold tracking-tight text-gray-950">Privacy Policy</h1>
          <p className="mt-2 text-xs text-gray-500">Effective Date: 01 September 2026</p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-10 shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed min-w-0">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-950">1. Commitment to Client Confidentiality</h2>
            <p>
              Krishna Accessories Ltd. ("Krishna Accessories", "we", "us", or "our") respects the privacy of our esteemed clientele. This policy describes how we collect, utilize, and protect your personal information when you interact with our website, concierge services, and boutique showrooms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-950">2. Information We Collect</h2>
            <p>
              We collect information provided directly by you during account creation, order checkout, consignment tracking inquiries, and concierge requests. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
              <li>Full name, telephone number, and delivery address coordinates.</li>
              <li>Email address and transaction history.</li>
              <li>Consignment preferences and wishlist records.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-950">3. Payment Security & Encryption</h2>
            <p>
              We do not store your complete payment card credentials on our servers. All transactions are securely processed through RBI-authorized payment gateways complying with PCI-DSS Tier 1 standards and 256-bit SSL encryption.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-950">4. Sharing with Logistics Partners</h2>
            <p>
              Your contact details and delivery destination are shared exclusively with certified courier partners (e.g. BlueDart Express, Delhivery) strictly for the purpose of executing insured delivery.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-950">5. Contact Our Privacy Officer</h2>
            <p>
              If you have any questions regarding your data privacy, write to our Data Protection Officer at <strong className="break-all">privacy@krishnaaccessories.com</strong>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}