// src/pages/ContactUs.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SHOP_INFO } from '../utils/shopInfo';
import { sendInquiryAcknowledgementEmail } from '../utils/emailService';
import {
  ShieldCheckIcon,
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon
} from '../components/Icons';
import { Reveal } from '../components/useScrollReveal';
import { Sparkles, MessageSquare, Clock, MapPin, Phone, Mail } from 'lucide-react';

export default function ContactUs() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order & Product Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const submittedForm = { ...form };
    setForm({ name: '', email: '', phone: '', subject: 'Order & Product Inquiry', message: '' });

    try {
      await sendInquiryAcknowledgementEmail(submittedForm);
    } catch (err) {
      console.error('Error sending inquiry ack:', err);
    }

    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      {/* Header */}
      <section className="bg-white border-b border-neutral-200/80 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Reveal delay={0} direction="up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734] animate-ping" />
              <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#8C6734]">
                Client Relations &amp; Concierge
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-neutral-950">
              How May We <span className="italic font-normal text-[#8C6734]">Assist You?</span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed font-normal">
              Our luxury client advisors are at your service for product inquiries, consignment tracking, corporate gifting, and bespoke boutique appointments.
            </p>
          </Reveal>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-[1fr_390px]">

          {/* Contact Inquiry Form */}
          <Reveal delay={50} direction="up">
            <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-10 shadow-sm space-y-6 min-w-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8C6734]">Direct Communication</span>
                <h2 className="font-serif text-xl sm:text-2xl font-medium text-neutral-950 mt-0.5">Send a Concierge Inquiry</h2>
                <p className="text-xs text-neutral-500 mt-1">We respond to all concierge communications within 2 business hours.</p>
              </div>

              {submitted && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 flex items-center gap-2.5 animate-fade-in">
                  <ShieldCheckIcon className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Thank you! Your message has been received by our concierge desk. We will contact you shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="font-medium text-neutral-700 block mb-1.5">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Rahul Patel"
                      className="w-full rounded-lg border border-neutral-200/90 bg-[#FAFAFB] px-4 py-2.5 outline-none transition-colors duration-200 focus:border-[#C5A880] focus:bg-white focus:ring-1 focus:ring-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-neutral-700 block mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="user@example.com"
                      className="w-full rounded-lg border border-neutral-200/90 bg-[#FAFAFB] px-4 py-2.5 outline-none transition-colors duration-200 focus:border-[#C5A880] focus:bg-white focus:ring-1 focus:ring-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="font-medium text-neutral-700 block mb-1.5">Mobile Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 93213 22761"
                      className="w-full rounded-lg border border-neutral-200/90 bg-[#FAFAFB] px-4 py-2.5 outline-none transition-colors duration-200 focus:border-[#C5A880] focus:bg-white focus:ring-1 focus:ring-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-neutral-700 block mb-1.5">Inquiry Purpose *</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full rounded-lg border border-neutral-200/90 bg-[#FAFAFB] px-4 py-2.5 outline-none transition-colors duration-200 focus:border-[#C5A880] focus:bg-white focus:ring-1 focus:ring-[#C5A880] cursor-pointer"
                    >
                      <option value="Order & Product Inquiry">Order &amp; Product Inquiry</option>
                      <option value="Consignment & Delivery Tracking">Consignment &amp; Delivery Tracking</option>
                      <option value="Private Boutique Appointment">Private Boutique Appointment</option>
                      <option value="Corporate & Wedding Gifting">Corporate &amp; Wedding Gifting</option>
                      <option value="Vendor / Supplier Partnership">Vendor / Supplier Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1.5">Your Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Provide any specific product references, order numbers, or questions..."
                    className="w-full rounded-lg border border-neutral-200/90 bg-[#FAFAFB] px-4 py-2.5 outline-none transition-colors duration-200 focus:border-[#C5A880] focus:bg-white focus:ring-1 focus:ring-[#C5A880] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-950 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#8C6734] transition-colors shadow-sm cursor-pointer active:scale-98"
                >
                  <span>Send Concierge Message</span>
                  <span>&rarr;</span>
                </button>
              </form>
            </div>
          </Reveal>

          {/* Contact Details & Direct WhatsApp link */}
          <div className="space-y-6 min-w-0">

            {/* Direct WhatsApp Concierge Card */}
            <Reveal delay={100} direction="up">
              <div className="rounded-2xl border border-emerald-200 bg-[#FAF8F5] p-6 shadow-sm space-y-3.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-800 bg-emerald-100/60 px-2.5 py-1 rounded-full border border-emerald-200">
                  Instant Support
                </span>
                <h3 className="font-serif text-lg font-medium text-neutral-950">WhatsApp Concierge Desk</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Connect directly with our senior advisor for immediate product photos, wrist shots, and size guidance.
                </p>
                <a
                  href={SHOP_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-emerald-800 transition-colors shadow-sm"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Open WhatsApp Chat</span>
                </a>
              </div>
            </Reveal>

            {/* Office Info Card */}
            <Reveal delay={150} direction="up">
              <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm space-y-4 text-xs">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-950 border-b border-neutral-100 pb-3">
                  Flagship Boutique Contact
                </h3>

                <div className="space-y-3.5 text-neutral-600 leading-relaxed">
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF8F5] border border-[#C5A880]/40 text-[#8C6734] shrink-0 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="text-neutral-950 block">Flagship Boutique:</strong>
                      <span>{SHOP_INFO.address}, India</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF8F5] border border-[#C5A880]/40 text-[#8C6734] shrink-0 mt-0.5">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="text-neutral-950 block">Direct Concierge Phone:</strong>
                      <a href={`tel:+91${SHOP_INFO.rawPhone}`} className="text-neutral-950 font-semibold hover:text-[#8C6734] transition-colors">
                        {SHOP_INFO.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF8F5] border border-[#C5A880]/40 text-[#8C6734] shrink-0 mt-0.5">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="text-neutral-950 block">Customer Support Email:</strong>
                      <a href={`mailto:${SHOP_INFO.email}`} className="text-neutral-950 font-semibold hover:text-[#8C6734] transition-colors break-all">
                        {SHOP_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF8F5] border border-[#C5A880]/40 text-[#8C6734] shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="text-neutral-950 block">Boutique Operating Hours:</strong>
                      <span>{SHOP_INFO.workingHours}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Social Media Connect Card */}
            <Reveal delay={200} direction="up">
              <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm space-y-3.5 text-xs">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-950 border-b border-neutral-100 pb-2.5">
                  Social Media &amp; Updates
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                  Follow Krishna Accessories for daily luxury new arrivals, customer reviews, unboxings, and private client specials.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <a
                    href={SHOP_INFO.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-xl border border-neutral-200/80 bg-[#FAF8F5] p-3 text-xs font-medium text-neutral-800 hover:border-[#1877F2] hover:bg-white transition-all group"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#1877F2] border border-neutral-200 group-hover:bg-[#1877F2] group-hover:text-white transition-colors shadow-2xs">
                      <FacebookIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>Facebook</span>
                  </a>

                  <a
                    href={SHOP_INFO.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-xl border border-neutral-200/80 bg-[#FAF8F5] p-3 text-xs font-medium text-neutral-800 hover:border-pink-400 hover:bg-white transition-all group"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-pink-600 border border-neutral-200 group-hover:bg-gradient-to-tr group-hover:from-amber-500 group-hover:via-rose-500 group-hover:to-purple-600 group-hover:text-white transition-all shadow-2xs">
                      <InstagramIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </Reveal>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}