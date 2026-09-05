// src/pages/ContactUs.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheckIcon, ArrowRightIcon } from '../components/Icons';

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
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 overflow-x-clip">
      <Navbar />

      {/* Header */}
      <section className="bg-white border-b border-zinc-200/80 py-10 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B89035]">
            Client Relations & Concierge Desk
          </span>
          <h1 className="mt-1 text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-sans">
            How May We Assist You?
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500 max-w-xl mx-auto">
            Our luxury client advisors are at your service for product inquiries, consignment tracking, corporate gifting, and bespoke boutique appointments.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 items-start">

          {/* Contact Inquiry Form (Span 8) */}
          <div className="lg:col-span-8 rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-zinc-950">Send a Concierge Inquiry</h2>
              <p className="text-xs text-zinc-500 mt-0.5">We respond to all communications within 2 business hours.</p>
            </div>

            {submitted && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! Your message has been received by our concierge desk. We will contact you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Rahul Patel"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="user@example.com"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 12345"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Inquiry Purpose *</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-zinc-900 outline-none focus:border-zinc-900 cursor-pointer"
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
                <label className="font-semibold text-zinc-700 block mb-1">Your Message *</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Provide any specific watch references, order numbers, or questions..."
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white resize-none transition"
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-zinc-900 px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black transition shadow-xs text-center cursor-pointer"
              >
                Send Concierge Message &rarr;
              </button>
            </form>
          </div>

          {/* Right Column: WhatsApp Card & Flagship Details (Span 4) */}
          <div className="lg:col-span-4 space-y-4">

            {/* Direct WhatsApp Concierge Card */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-2xs space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Instant Advisory</span>
              <h3 className="text-base font-bold text-zinc-950">WhatsApp Concierge Desk</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Connect directly with our senior horologist for immediate product photos, wrist shots, and movement sizing.
              </p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs"
              >
                <span>💬 Open WhatsApp Chat</span>
              </a>
            </div>

            {/* Office Coordinates Card */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs space-y-3 text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-100 pb-2.5">
                Flagship Boutique Contact
              </h3>

              <div className="space-y-3 text-zinc-600 leading-relaxed">
                <div>
                  <strong className="text-zinc-900 block">Flagship Boutique:</strong>
                  <span>Bodakdev, SG Highway, Ahmedabad, Gujarat 380054, India</span>
                </div>

                <div>
                  <strong className="text-zinc-900 block">Direct Telephone Desk:</strong>
                  <span>+91 (079) 4000-5500</span>
                </div>

                <div>
                  <strong className="text-zinc-900 block">Official Concierge Email:</strong>
                  <span className="break-all">care@krishnaaccessories.com</span>
                </div>

                <div>
                  <strong className="text-zinc-900 block">Boutique Operating Hours:</strong>
                  <span>Monday – Saturday: 10:30 AM – 08:30 PM (IST)</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}