// src/pages/ContactUs.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import { SHOP_INFO } from '../utils/shopInfo';
import {
  ShieldCheckIcon,
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon
} from '../components/Icons';

export default function ContactUs() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order & Product Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', subject: 'Order & Product Inquiry', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
      <Navbar />

      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <Reveal effect="fade-up">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
              Client Relations & Concierge
            </span>
            <h1 className="mt-1 text-2xl sm:text-4xl font-serif font-bold tracking-tight text-gray-950">
              How May We Assist You?
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
              Our luxury client advisors in Mumbai are at your service for product inquiries, consignment tracking, corporate gifting, and bespoke boutique appointments.
            </p>

            {/* Live Boutique Status Pill */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs text-emerald-800 font-semibold shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Flagship Boutique Open Today: 10:30 AM – 08:30 PM (IST)</span>
            </div>
          </Reveal>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-[1fr_400px]">

          {/* Contact Inquiry Form */}
          <Reveal effect="fade-up">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm space-y-6 min-w-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">Direct Dispatch</span>
                <h2 className="text-xl font-serif font-bold text-gray-950 mt-0.5">Send a Concierge Inquiry</h2>
                <p className="text-xs text-gray-500 mt-1">We respond to all client communications within 2 business hours.</p>
              </div>

              {submitted && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2.5 animate-fade-in">
                  <ShieldCheckIcon className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Thank you! Your message has been received by our concierge desk in Mumbai. We will reach out shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Rahul Patel"
                      className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-3 outline-none focus:border-[#8C6734] focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="user@example.com"
                      className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-3 outline-none focus:border-[#8C6734] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Mobile Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 93213 22761"
                      className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-3 outline-none focus:border-[#8C6734] focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Inquiry Purpose *</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-3 outline-none focus:border-[#8C6734] focus:bg-white cursor-pointer transition"
                    >
                      <option value="Order & Product Inquiry">Order & Product Inquiry</option>
                      <option value="Consignment & Delivery Tracking">Consignment & Delivery Tracking</option>
                      <option value="Private Boutique Appointment">Private Boutique Appointment</option>
                      <option value="Corporate & Wedding Gifting">Corporate & Wedding Gifting</option>
                      <option value="Vendor / Supplier Partnership">Vendor / Supplier Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Your Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Provide any specific watch references, order numbers, or questions..."
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-3 outline-none focus:border-[#8C6734] focus:bg-white resize-none transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-full bg-[#111827] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition shadow-sm text-center cursor-pointer hover:-translate-y-0.5"
                >
                  Send Concierge Message &rarr;
                </button>
              </form>
            </div>
          </Reveal>

          {/* Contact Details & Direct WhatsApp link */}
          <div className="space-y-6 min-w-0">

            {/* Direct WhatsApp Concierge Card */}
            <Reveal effect="fade-up" delay={100}>
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-6 shadow-sm space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-800">Instant VIP Chat</span>
                <h3 className="text-base font-serif font-bold text-gray-950">WhatsApp Concierge Desk</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Connect directly with our senior advisor in Mumbai for immediate product photos, wrist shots, video consultations, and size guidance.
                </p>
                <a
                  href={SHOP_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm hover:-translate-y-0.5"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </Reveal>

            {/* Office Info Card */}
            <Reveal effect="fade-up" delay={200}>
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4 text-xs">
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-950 border-b border-gray-100 pb-3">
                  Mumbai Flagship Boutique
                </h3>

                <div className="space-y-3.5 text-gray-600 leading-relaxed">
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="w-4 h-4 text-[#8C6734] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-950 block">Flagship Boutique Address:</strong>
                      <span>{SHOP_INFO.address}, India</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <PhoneIcon className="w-4 h-4 text-[#8C6734] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-950 block">Direct Concierge Phone:</strong>
                      <a href={`tel:+91${SHOP_INFO.rawPhone}`} className="text-gray-900 font-semibold hover:text-[#8C6734] transition">
                        {SHOP_INFO.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MailIcon className="w-4 h-4 text-[#8C6734] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-950 block">Official Support Email:</strong>
                      <a href={`mailto:${SHOP_INFO.email}`} className="text-gray-900 font-semibold hover:text-[#8C6734] transition break-all">
                        {SHOP_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-start gap-3">
                    <ClockIcon className="w-4 h-4 text-[#8C6734] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-950 block mb-0.5">Boutique Operating Hours:</strong>
                      <span>{SHOP_INFO.workingHours}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Social Media Connect Card */}
            <Reveal effect="fade-up" delay={300}>
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-3.5 text-xs">
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-950 border-b border-gray-100 pb-2.5">
                  Official Channels
                </h3>
                <p className="text-xs text-gray-500">
                  Follow Krishna Accessories for daily luxury new arrivals, customer reviews, unboxings, and private client drops.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <a
                    href={SHOP_INFO.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-[#F4F4F6] p-3 text-xs font-semibold text-gray-800 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition hover:-translate-y-0.5 group"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-[#1877F2] group-hover:bg-white/20 group-hover:text-white transition shadow-2xs">
                      <FacebookIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>Facebook</span>
                  </a>

                  <a
                    href={SHOP_INFO.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-[#F4F4F6] p-3 text-xs font-semibold text-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white hover:border-pink-500 transition hover:-translate-y-0.5 group"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-pink-600 group-hover:bg-white/20 group-hover:text-white transition shadow-2xs">
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