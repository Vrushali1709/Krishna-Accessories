// src/pages/ContactUs.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SHOP_INFO } from '../utils/shopInfo';
import { sendInquiryAcknowledgementEmail } from '../utils/emailService';
import { Reveal } from '../components/useScrollReveal';
import {
  ShieldCheckIcon,
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon
} from '../components/Icons';
import {
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  Headphones,
  Building2,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export default function ContactUs() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order & Product Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const submittedForm = { ...form };
    setForm({ name: '', email: '', phone: '', subject: 'Order & Product Inquiry', message: '' });

    try {
      await sendInquiryAcknowledgementEmail(submittedForm);
    } catch (err) {
      console.error('Error sending inquiry ack:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }

    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white py-12 sm:py-16">
        <div className="pointer-events-none absolute -top-16 right-0 h-64 w-64 rounded-full bg-amber-100/50 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumb */}
          <Reveal direction="down" delay={50}>
            <div className="mb-3 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
              <Link to="/" className="hover:text-gray-900 transition">Home</Link>
              <span>/</span>
              <span className="text-[#B89758] font-semibold">Concierge &amp; Contact</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={100}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/80 px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#8c6734]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Client Relations &amp; Boutique Concierge</span>
            </span>
          </Reveal>

          <Reveal direction="up" delay={200}>
            <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-gray-950">
              How May We Assist You?
            </h1>
          </Reveal>

          <Reveal direction="up" delay={300}>
            <p className="mt-3 text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
              Our luxury client advisors in Mumbai are at your service for product inquiries, consignment tracking, boutique appointments, and corporate gifting.
            </p>
          </Reveal>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-[1fr_400px]">

          {/* Left Column: Contact Inquiry Form */}
          <Reveal direction="left" delay={150}>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm space-y-6 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-950">Send an Inquiry</h2>
                  <p className="text-xs text-gray-500 mt-0.5">We respond to all communications within 2 business hours.</p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 self-start sm:self-auto">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Advisors Online</span>
                </div>
              </div>

              {submitted && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 flex items-start gap-3 animate-fade-in">
                  <ShieldCheckIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Inquiry Received Successfully!</strong>
                    <span>Your message has been assigned to our concierge desk. We have sent an acknowledgement to your email and will be in touch shortly.</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1.5">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Rahul Patel"
                      className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 outline-none transition focus:border-gray-900 focus:bg-white text-gray-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g. rahul.patel@example.com"
                      className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 outline-none transition focus:border-gray-900 focus:bg-white text-gray-900 text-xs"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1.5">Mobile Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 93213 22761"
                      className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 outline-none transition focus:border-gray-900 focus:bg-white text-gray-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1.5">Inquiry Purpose *</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 outline-none transition focus:border-gray-900 focus:bg-white text-gray-900 text-xs cursor-pointer font-medium"
                    >
                      <option value="Order & Product Inquiry">Order &amp; Product Inquiry</option>
                      <option value="Consignment & Delivery Tracking">Consignment &amp; Delivery Tracking</option>
                      <option value="Private Boutique Appointment">Private Boutique Appointment</option>
                      <option value="Corporate & Wedding Gifting">Corporate &amp; Wedding Gifting</option>
                      <option value="Vendor / Supplier Partnership">Vendor / Supplier Partnership</option>
                      <option value="Warranty & Service Request">Warranty &amp; Service Request</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1.5">Your Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Provide any specific watch references, order numbers, wrist sizes, or questions..."
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 outline-none transition focus:border-gray-900 focus:bg-white text-gray-900 text-xs resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isSubmitting ? 'Transmitting...' : 'Send Concierge Message'}</span>
                  </button>
                  <span className="text-[11px] text-gray-400">🔒 Encrypted transmission</span>
                </div>
              </form>
            </div>
          </Reveal>

          {/* Right Column: Instant WhatsApp, Flagship Details & FAQ */}
          <div className="space-y-6 min-w-0">

            {/* Direct WhatsApp Concierge Card */}
            <Reveal direction="right" delay={200}>
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-sm space-y-3 relative overflow-hidden">
                <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-200/40 blur-xl" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> Instant Chat
                </span>
                <h3 className="text-base font-bold text-gray-950">WhatsApp Concierge Desk</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Connect directly with our senior advisor for immediate product photos, wrist shots, and size guidance.
                </p>
                <a
                  href={SHOP_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm hover:scale-[1.02]"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Open WhatsApp (+91 93213 22761)</span>
                </a>
              </div>
            </Reveal>

            {/* Flagship Boutique Contact Card */}
            <Reveal direction="right" delay={300}>
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4 text-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#B89758]" />
                  <span>Flagship Boutique Contact</span>
                </h3>

                <div className="space-y-3.5 text-gray-600 leading-relaxed">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700 shrink-0">
                      <MapPinIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-gray-950 block">Flagship Boutique:</strong>
                      <span>{SHOP_INFO.address}, India</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700 shrink-0">
                      <PhoneIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-gray-950 block">Direct Concierge Line:</strong>
                      <a href={`tel:+91${SHOP_INFO.rawPhone}`} className="text-gray-900 font-bold hover:text-amber-700 transition">
                        {SHOP_INFO.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700 shrink-0">
                      <MailIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-gray-950 block">Customer Support Email:</strong>
                      <a href={`mailto:${SHOP_INFO.email}`} className="text-gray-900 font-bold hover:text-amber-700 transition break-all">
                        {SHOP_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-700 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-gray-950 block">Boutique Operating Hours:</strong>
                      <span>{SHOP_INFO.workingHours}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Quick FAQ Link Card */}
            <Reveal direction="right" delay={400}>
              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-950 font-bold">
                  <HelpCircle className="h-4 w-4 text-blue-600" />
                  <span>Looking for quick answers?</span>
                </div>
                <p className="text-gray-500 leading-relaxed text-[11.5px]">
                  Find instant answers about delivery timelines, return policies, and product authentication in our knowledge base.
                </p>
                <Link
                  to="/faq"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-950 hover:text-amber-700 transition pt-1"
                >
                  <span>Visit FAQ Center</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </Reveal>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}