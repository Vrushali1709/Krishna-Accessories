// src/pages/ContactUs.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheckIcon } from '../components/Icons';

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
      <section className="bg-white border-b border-gray-200 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Client Relations & Concierge
          </span>
          <h1 className="mt-1 text-2xl sm:text-4xl font-bold tracking-tight text-gray-950">
            How May We Assist You?
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
            Our luxury client advisors are at your service for product inquiries, consignment tracking, corporate gifting, and bespoke boutique appointments.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-[1fr_380px]">

          {/* Contact Inquiry Form */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-10 shadow-sm space-y-6 min-w-0">
            <div>
              <h2 className="text-lg font-bold text-gray-950">Send an Inquiry</h2>
              <p className="text-xs text-gray-500 mt-0.5">We respond to all concierge communications within 2 business hours.</p>
            </div>

            {submitted && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! Your message has been received by our concierge desk. We will contact you shortly.</span>
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
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 outline-none focus:border-gray-400 focus:bg-white"
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
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 outline-none focus:border-gray-400 focus:bg-white"
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
                    placeholder="+91 98765 12345"
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 outline-none focus:border-gray-400 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Inquiry Purpose *</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 outline-none focus:border-gray-400 cursor-pointer"
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
                  className="w-full rounded-xl border border-gray-200 bg-[#F4F4F6] px-4 py-2.5 outline-none focus:border-gray-400 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto rounded-full bg-[#111827] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition shadow-sm text-center"
              >
                Send Concierge Message &rarr;
              </button>
            </form>
          </div>

          {/* Contact Details & Direct WhatsApp link */}
          <div className="space-y-6 min-w-0">

            {/* Direct WhatsApp Concierge Card */}
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6 shadow-sm space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Instant Chat</span>
              <h3 className="text-base font-bold text-gray-950">WhatsApp Concierge Desk</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Connect directly with our senior horologist for immediate product photos, wrist shots, and size guidance.
              </p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
              >
                <span>💬 Open WhatsApp Chat</span>
              </a>
            </div>

            {/* Office Info Card */}
            <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm space-y-4 text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950 border-b border-gray-100 pb-3">
                Flagship Boutique Contact
              </h3>

              <div className="space-y-3 text-gray-600 leading-relaxed">
                <div>
                  <strong className="text-gray-950 block">Flagship Boutique:</strong>
                  <span>Bodakdev, SG Highway, Ahmedabad, Gujarat 380054, India</span>
                </div>

                <div>
                  <strong className="text-gray-950 block">Direct Concierge Phone:</strong>
                  <span>+91 (079) 4000-5500</span>
                </div>

                <div>
                  <strong className="text-gray-950 block">Official Support Email:</strong>
                  <span className="break-all">care@krishnaaccessories.com</span>
                </div>

                <div>
                  <strong className="text-gray-950 block">Boutique Operating Hours:</strong>
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