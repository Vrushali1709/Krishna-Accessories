// src/pages/TermsConditions.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Reveal } from '../components/useScrollReveal';
import { ShieldCheckIcon } from '../components/Icons';
import { FileCheck, Shield, Scale, RotateCcw, Truck, Award } from 'lucide-react';
import { SHOP_INFO } from '../utils/shopInfo';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white py-12 sm:py-16">
        <div className="pointer-events-none absolute -top-16 left-1/4 h-64 w-64 rounded-full bg-amber-50 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal direction="down" delay={50}>
            <div className="mb-3 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
              <Link to="/" className="hover:text-gray-900 transition">Home</Link>
              <span>/</span>
              <span className="text-[#B89758] font-semibold">Terms &amp; Conditions</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={100}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#8c6734]">
              <Scale className="h-3.5 w-3.5" />
              <span>Legal Agreement &amp; Operating Charter</span>
            </span>
          </Reveal>

          <Reveal direction="up" delay={200}>
            <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-gray-950">
              Terms &amp; Conditions
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

        {/* Highlight Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Reveal direction="up" delay={100}>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs text-center space-y-1">
              <Award className="mx-auto h-5 w-5 text-amber-600" />
              <div className="text-xs font-bold text-gray-950">100% Certified Goods</div>
              <p className="text-[11px] text-gray-500">Curated &amp; verified provenance</p>
            </div>
          </Reveal>

          <Reveal direction="up" delay={200}>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs text-center space-y-1">
              <RotateCcw className="mx-auto h-5 w-5 text-emerald-600" />
              <div className="text-xs font-bold text-gray-950">7-Day Return Privilege</div>
              <p className="text-[11px] text-gray-500">Unopened pristine items</p>
            </div>
          </Reveal>

          <Reveal direction="up" delay={300}>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs text-center space-y-1">
              <Truck className="mx-auto h-5 w-5 text-blue-600" />
              <div className="text-xs font-bold text-gray-950">Insured Air Logistics</div>
              <p className="text-[11px] text-gray-500">Protected transit coverage</p>
            </div>
          </Reveal>
        </div>

        {/* Detailed Legal Clauses */}
        <Reveal direction="up" delay={200}>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">

            <section className="space-y-2 border-b border-gray-100 pb-6">
              <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-900">1</span>
                <span>Acceptance of Terms</span>
              </h2>
              <p>
                By visiting or purchasing through Krishna Accessories, registering an account, or interacting with our concierge personnel, you agree to comply with these terms, our Privacy Policy, and any additional guidelines presented during checkout.
              </p>
            </section>

            <section className="space-y-2 border-b border-gray-100 pb-6">
              <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-900">2</span>
                <span>Product Curations &amp; Transparent Pricing</span>
              </h2>
              <p>
                All items displayed are sourced from authorized distributors and verified boutique suppliers. All displayed prices in Indian Rupees (₹) are inclusive of applicable Goods and Services Tax (GST).
              </p>
            </section>

            <section className="space-y-2 border-b border-gray-100 pb-6">
              <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-900">3</span>
                <span>Order Fulfillment &amp; Transit Insurance</span>
              </h2>
              <p>
                Every order undergoes multi-point inspection and is sealed in tamper-evident boutique packaging before courier handover. Each consignment is insured throughout transit until doorstep delivery confirmation.
              </p>
            </section>

            <section className="space-y-2 border-b border-gray-100 pb-6">
              <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-900">4</span>
                <span>7-Day Return Privilege &amp; Refunds</span>
              </h2>
              <p>
                Clients may request a return within 7 days of receiving the item. Products must be returned in their original packaging with security seals and protective wraps intact. Refunds are initiated to the original payment source within 24 to 48 hours of inspection approval.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-900">5</span>
                <span>Governing Law &amp; Jurisdiction</span>
              </h2>
              <p>
                These terms shall be governed by and interpreted under the laws of the Republic of India. Any legal dispute shall be subject to the exclusive jurisdiction of the competent courts of Mumbai, Maharashtra.
              </p>
            </section>

          </div>
        </Reveal>

      </main>

      <Footer />
    </div>
  );
}
