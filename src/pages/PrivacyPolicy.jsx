// src/pages/PrivacyPolicy.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Reveal } from '../components/useScrollReveal';
import { ShieldCheckIcon, LockClosedIcon } from '../components/Icons';
import { Shield, Lock, EyeOff, Server, FileText, CheckCircle2 } from 'lucide-react';
import { SHOP_INFO } from '../utils/shopInfo';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white py-12 sm:py-16">
        <div className="pointer-events-none absolute -top-16 right-1/4 h-64 w-64 rounded-full bg-blue-50 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal direction="down" delay={50}>
            <div className="mb-3 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
              <Link to="/" className="hover:text-gray-900 transition">Home</Link>
              <span>/</span>
              <span className="text-[#B89758] font-semibold">Privacy &amp; Security</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={100}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.2em] text-blue-800">
              <Shield className="h-3.5 w-3.5" />
              <span>Legal Protection &amp; Data Security</span>
            </span>
          </Reveal>

          <Reveal direction="up" delay={200}>
            <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-gray-950">
              Privacy Policy
            </h1>
          </Reveal>

          <Reveal direction="up" delay={300}>
            <p className="mt-2 text-xs sm:text-sm text-gray-500">
              Effective Date: 01 September 2026 &bull; Krishna Accessories Ltd.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8 space-y-8">
        
        {/* Trust Badges Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Reveal direction="up" delay={100}>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs text-center space-y-1">
              <Lock className="mx-auto h-5 w-5 text-emerald-600" />
              <div className="text-xs font-bold text-gray-950">256-Bit SSL Encrypted</div>
              <p className="text-[11px] text-gray-500">Bank-grade end-to-end encryption</p>
            </div>
          </Reveal>

          <Reveal direction="up" delay={200}>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs text-center space-y-1">
              <EyeOff className="mx-auto h-5 w-5 text-purple-600" />
              <div className="text-xs font-bold text-gray-950">Zero Card Data Storage</div>
              <p className="text-[11px] text-gray-500">PCI-DSS Tier 1 RBI regulated</p>
            </div>
          </Reveal>

          <Reveal direction="up" delay={300}>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs text-center space-y-1">
              <Server className="mx-auto h-5 w-5 text-blue-600" />
              <div className="text-xs font-bold text-gray-950">Strict Confidentiality</div>
              <p className="text-[11px] text-gray-500">Never sold to 3rd party brokers</p>
            </div>
          </Reveal>
        </div>

        {/* Detailed Legal Clauses */}
        <Reveal direction="up" delay={200}>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
            
            <section className="space-y-2 border-b border-gray-100 pb-6">
              <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-900">1</span>
                <span>Commitment to Client Confidentiality</span>
              </h2>
              <p>
                Krishna Accessories Ltd. ("Krishna Accessories", "we", "us", or "our") respects the privacy and discretion expected by our clientele. This policy outlines our standards for gathering, safeguarding, and utilizing your personal information across our website, mobile interface, and concierge operations.
              </p>
            </section>

            <section className="space-y-2 border-b border-gray-100 pb-6">
              <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-900">2</span>
                <span>Information We Collect</span>
              </h2>
              <p>
                We collect personal information directly provided by you during account creation, consignment tracking inquiries, and order checkout:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                <li>Full legal name, phone number, and delivery destination coordinates.</li>
                <li>Email address for consignment invoices, OTP authentication, and status notifications.</li>
                <li>Wishlist records, shopping bag selections, and boutique communication notes.</li>
              </ul>
            </section>

            <section className="space-y-2 border-b border-gray-100 pb-6">
              <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-900">3</span>
                <span>Payment Security &amp; Encryption</span>
              </h2>
              <p>
                We do not store your complete card credentials, CVV codes, or net banking passwords. Transactions are processed via certified, RBI-licensed payment gateways adhering to global PCI-DSS Level 1 compliance and 256-bit AES encryption.
              </p>
            </section>

            <section className="space-y-2 border-b border-gray-100 pb-6">
              <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-900">4</span>
                <span>Sharing with Logistics Partners</span>
              </h2>
              <p>
                Your contact details and delivery coordinates are shared exclusively with certified express logistics partners (e.g. BlueDart Express, Delhivery) strictly to fulfill insured consignment transit and delivery verification.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-900">5</span>
                <span>Data Protection Officer</span>
              </h2>
              <p>
                For privacy rights inquiries, account deletions, or data requests, contact our Compliance Officer at <strong className="text-gray-950 font-bold">{SHOP_INFO.email}</strong> or call <strong className="text-gray-950 font-bold">{SHOP_INFO.phone}</strong>.
              </p>
            </section>

          </div>
        </Reveal>

      </main>

      <Footer />
    </div>
  );
}