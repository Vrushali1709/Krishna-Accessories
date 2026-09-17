// src/pages/PrivacyPolicy.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Reveal } from '../components/useScrollReveal';
import { ShieldCheck, Lock, FileText, Sparkles } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      <section className="bg-white border-b border-neutral-200/80 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal delay={0} direction="up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734] animate-ping" />
              <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#8C6734]">
                Legal Security &amp; Compliance
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-neutral-950">
              Privacy <span className="italic font-normal text-[#8C6734]">Policy</span>
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
                <span className="text-[#8C6734]">1.</span> Commitment to Client Confidentiality
              </h2>
              <p className="text-neutral-600">
                Krishna Accessories Ltd. ("Krishna Accessories", "we", "us", or "our") respects the privacy of our esteemed clientele. This policy describes how we collect, utilize, and protect your personal information when you interact with our website, concierge services, and boutique showrooms located in Mumbai, Gujarat, and online.
              </p>
            </section>

            <section className="space-y-2.5">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
                <span className="text-[#8C6734]">2.</span> Information We Collect
              </h2>
              <p className="text-neutral-600">
                We collect information provided directly by you during account creation, order checkout, consignment tracking inquiries, and concierge requests. This includes:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
                <li>Full name, telephone number, and delivery address coordinates.</li>
                <li>Email address and transaction invoice history.</li>
                <li>Consignment preferences and saved wishlist records.</li>
              </ul>
            </section>

            <section className="space-y-2.5">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
                <span className="text-[#8C6734]">3.</span> Payment Security &amp; Encryption
              </h2>
              <p className="text-neutral-600">
                We do not store complete payment card credentials on our servers. All transactions are securely processed through RBI-regulated payment gateways complying with PCI-DSS Tier 1 standards and 256-bit SSL encryption.
              </p>
            </section>

            <section className="space-y-2.5">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
                <span className="text-[#8C6734]">4.</span> Sharing with Certified Logistics Partners
              </h2>
              <p className="text-neutral-600">
                Your contact details and delivery destination coordinates are shared exclusively with certified courier partners (e.g. BlueDart Express, Delhivery) strictly for executing insured delivery.
              </p>
            </section>

            <section className="space-y-2.5">
              <h2 className="font-serif text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
                <span className="text-[#8C6734]">5.</span> Contact Our Privacy Officer
              </h2>
              <p className="text-neutral-600">
                If you have any questions regarding your data privacy or wish to request data erasure, write to our Data Protection Officer at <strong className="text-neutral-950 font-semibold break-all">shantilal6186@gmail.com</strong> or visit our Mumbai boutique.
              </p>
            </section>
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}