// src/pages/ContactUs.jsx
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SHOP_INFO } from '../utils/shopInfo';
import { sendInquiryAcknowledgementEmail } from '../utils/emailService';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Clock,
  MapPin,
  Phone,
  Mail,
  Send,
  MessageSquare,
  CheckCircle2,
  Building2,
  ArrowRight,
  Headphones
} from 'lucide-react';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '../components/Icons';

// =========================================================================
// CUSTOM ANIMATION HOOK: Intersection Observer for on-scroll reveals
// =========================================================================
function useInView(options = { threshold: 0.1, triggerOnce: true }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (options.triggerOnce) {
          observer.unobserve(entry.target);
        }
      }
    }, options);

    const currentElem = ref.current;
    if (currentElem) observer.observe(currentElem);

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [options.threshold, options.triggerOnce]);

  return [ref, inView];
}

function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  threshold = 0.08
}) {
  const [ref, inView] = useInView({ threshold, triggerOnce: true });

  const getTransform = () => {
    if (inView) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 24px, 0)';
      case 'down':
        return 'translate3d(0, -24px, 0)';
      case 'left':
        return 'translate3d(24px, 0, 0)';
      case 'right':
        return 'translate3d(-24px, 0, 0)';
      case 'zoom':
        return 'scale(0.97)';
      default:
        return 'translate3d(0, 20px, 0)';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export default function ContactUs() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order & Product Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    const submittedForm = { ...form };
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', subject: 'Order & Product Inquiry', message: '' });

    try {
      await sendInquiryAcknowledgementEmail(submittedForm);
    } catch (err) {
      console.error('Error sending inquiry ack:', err);
    } finally {
      setSending(false);
    }

    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO BANNER (Luxury Editorial Header Matching About & New Arrivals)    */}
      {/* ========================================================================= */}
      <section className="relative bg-white border-b border-neutral-200/80 overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-left">
              {/* Eyebrow Badge with Pulse */}
              <Reveal delay={0} direction="up">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#8C6734] animate-ping" />
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8C6734]">
                    Client Concierge &amp; Relations
                  </span>
                </div>
              </Reveal>

              {/* Editorial Serif Heading */}
              <Reveal delay={100} direction="up">
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-[52px] font-medium tracking-tight text-neutral-950 leading-[1.15]">
                  How May We <br />
                  <span className="italic font-normal text-[#8C6734]">Assist You Today?</span>
                </h1>
              </Reveal>

              {/* Description */}
              <Reveal delay={180} direction="up">
                <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-xl">
                  Our dedicated client advisors are at your service for timepiece verification, bespoke consignment tracking, corporate gifting, and private showroom consultations in Mumbai.
                </p>
              </Reveal>

              {/* Trust Highlights */}
              <Reveal delay={240} direction="up">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-neutral-700">
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-[#FAFAFB] border border-neutral-200/80">
                    <Clock className="w-4 h-4 text-[#8C6734] shrink-0" />
                    <span className="font-medium text-[11px] sm:text-xs">2-Hour Response Time</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-[#FAFAFB] border border-neutral-200/80">
                    <ShieldCheck className="w-4 h-4 text-[#8C6734] shrink-0" />
                    <span className="font-medium text-[11px] sm:text-xs">Direct Senior Advisors</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-[#FAFAFB] border border-neutral-200/80">
                    <Building2 className="w-4 h-4 text-[#8C6734] shrink-0" />
                    <span className="font-medium text-[11px] sm:text-xs">Mumbai Flagship Hub</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5">
              <Reveal delay={150} direction="left">
                <div className="relative mx-auto max-w-md lg:max-w-none group">
                  <div className="aspect-[4/3.8] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-xl relative transition-transform duration-500 hover:shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80"
                      alt="Krishna Accessories Concierge Boutique"
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Floating Glassmorphism Tag */}
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3.5 rounded-lg border border-neutral-200/80 flex items-center justify-between text-xs shadow-md transition-all duration-300 group-hover:bg-white">
                      <div>
                        <p className="font-semibold text-neutral-950">Heera Panna Boutique Hub</p>
                        <p className="text-[11px] text-neutral-500">Haji Ali &bull; Mumbai, Maharashtra</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6734] bg-[#F5F2EB] px-2.5 py-1 rounded-sm border border-[#C5A880]/40">
                        Open Daily
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN CONCIERGE INQUIRY & CONTACT CHANNELS                              */}
      {/* ========================================================================= */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-[1fr_390px] items-start">

          {/* Left Column: Inquiry Form Card */}
          <Reveal delay={50} direction="up">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-10 shadow-sm space-y-6">
              <div className="border-b border-neutral-100 pb-5">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                  Direct Message
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-neutral-950 mt-1">
                  Send a Concierge Inquiry
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Fill out the form below and our advisors will respond within 2 business hours.
                </p>
              </div>

              {submitted && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 text-xs font-semibold text-emerald-900 flex items-center gap-3 animate-fade-in shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Thank you! Your inquiry has been logged with our concierge desk. We will reach out to you promptly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1.5 text-xs">
                      Your Full Name <span className="text-[#8C6734]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Rahul Patel"
                      className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1.5 text-xs">
                      Email Address <span className="text-[#8C6734]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="user@example.com"
                      className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]/30 transition-all"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1.5 text-xs">
                      Mobile Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 93213 22761"
                      className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1.5 text-xs">
                      Inquiry Purpose <span className="text-[#8C6734]">*</span>
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-[#8C6734] transition-all cursor-pointer"
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
                  <label className="font-semibold text-neutral-800 block mb-1.5 text-xs">
                    Your Message <span className="text-[#8C6734]">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Provide any specific watch references, order numbers, wrist sizes, or questions..."
                    className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#8C6734] focus:ring-1 focus:ring-[#8C6734]/30 transition-all resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#8C6734] transition-colors duration-200 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <span>{sending ? 'Transmitting Message...' : 'Send Concierge Message'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </Reveal>

          {/* Right Column: Contact Cards & Instant Channels */}
          <div className="space-y-6">

            {/* 1. Direct WhatsApp Concierge Card */}
            <Reveal delay={100} direction="up">
              <div className="rounded-2xl border border-[#C5A880]/40 bg-[#FAF8F5] p-6 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 text-[10px] font-bold uppercase tracking-wider text-[#8C6734]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Instant Concierge
                  </span>
                  <WhatsAppIcon className="w-5 h-5 text-emerald-600" />
                </div>

                <h3 className="font-serif text-lg font-medium text-neutral-950">
                  WhatsApp Concierge Desk
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Connect directly with our senior advisor for immediate product photos, wrist shots, video demonstrations, and size guidance.
                </p>

                <div className="pt-1">
                  <a
                    href={SHOP_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-emerald-800 transition-colors shadow-sm"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>Open WhatsApp Chat</span>
                  </a>
                </div>
              </div>
            </Reveal>

            {/* 2. Flagship Boutique Details Card */}
            <Reveal delay={160} direction="up">
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm space-y-4 text-xs">
                <div className="border-b border-neutral-100 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                    Direct Coordinates
                  </span>
                  <h3 className="font-serif text-base font-medium text-neutral-950 mt-0.5">
                    Flagship Boutique Contact
                  </h3>
                </div>

                <div className="space-y-3.5 text-neutral-600 leading-relaxed">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FAFAFB] border border-neutral-200/80 text-[#8C6734] flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-neutral-950 block font-semibold">Flagship Boutique:</strong>
                      <span>{SHOP_INFO.address}, India</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FAFAFB] border border-neutral-200/80 text-[#8C6734] flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-neutral-950 block font-semibold">Direct Concierge Phone:</strong>
                      <a href={`tel:+91${SHOP_INFO.rawPhone}`} className="text-neutral-900 font-semibold hover:text-[#8C6734] transition">
                        {SHOP_INFO.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FAFAFB] border border-neutral-200/80 text-[#8C6734] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-neutral-950 block font-semibold">Customer Support Email:</strong>
                      <a href={`mailto:${SHOP_INFO.email}`} className="text-neutral-900 font-semibold hover:text-[#8C6734] transition break-all">
                        {SHOP_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FAFAFB] border border-neutral-200/80 text-[#8C6734] flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-neutral-950 block font-semibold mb-0.5">Operating Hours:</strong>
                      <span>{SHOP_INFO.workingHours}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* 3. Social Media & Updates */}
            <Reveal delay={220} direction="up">
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm space-y-3.5 text-xs">
                <h3 className="font-serif text-base font-medium text-neutral-950 border-b border-neutral-100 pb-2.5">
                  Social Channels &amp; Drops
                </h3>
                <p className="text-xs text-neutral-500">
                  Follow Krishna Accessories for daily luxury new arrivals, unboxings, and private client specials.
                </p>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <a
                    href={SHOP_INFO.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-xl border border-neutral-200/80 bg-[#FAFAFB] p-2.5 text-xs font-semibold text-neutral-800 hover:border-[#C5A880] hover:bg-white transition-all duration-200 group"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-neutral-200 text-[#1877F2] group-hover:bg-[#1877F2] group-hover:text-white transition">
                      <FacebookIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>Facebook</span>
                  </a>

                  <a
                    href={SHOP_INFO.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-xl border border-neutral-200/80 bg-[#FAFAFB] p-2.5 text-xs font-semibold text-neutral-800 hover:border-[#C5A880] hover:bg-white transition-all duration-200 group"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-neutral-200 text-pink-600 group-hover:bg-gradient-to-tr group-hover:from-amber-500 group-hover:to-pink-600 group-hover:text-white transition">
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