// src/pages/AboutUs.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  ShieldCheck,
  Truck,
  Sparkles,
  Award,
  Target,
  Eye,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Lock,
  Headphones
} from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip flex flex-col justify-between">
      <Navbar />

      {/* Hero Section */}
      <section className="relative border-b border-gray-200/80 bg-white py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 sm:mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B89758]"></span>
            <span>Heritage & Mission &bull; Est. 2012</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-950 leading-[1.15]">
            Curating Precision, <br />
            <span className="font-serif italic font-normal text-gray-500">Authenticity & Luxury</span>
          </h1>

          <p className="mt-5 text-xs sm:text-base leading-relaxed text-gray-600 max-w-2xl mx-auto">
            Founded with a passion for horology and refined craftsmanship, Krishna Accessories serves as Gujarat's foremost authorized sanctuary for authentic Swiss and heritage timepieces, leather accessories, and curated essentials.
          </p>
        </div>

        {/* Minimalist Stats Strip */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 rounded-2xl border border-gray-200/80 bg-[#FAFAFB] p-4 sm:p-6 shadow-xs">
            <div className="text-center p-2">
              <span className="block text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 font-serif">100%</span>
              <span className="mt-1 block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500">Certified Authentic</span>
            </div>
            <div className="text-center p-2 border-l border-gray-200/60 md:border-l">
              <span className="block text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 font-serif">10K+</span>
              <span className="mt-1 block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500">Curated Parcels</span>
            </div>
            <div className="text-center p-2 border-t md:border-t-0 md:border-l border-gray-200/60">
              <span className="block text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 font-serif">50+</span>
              <span className="mt-1 block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500">Authorized Brands</span>
            </div>
            <div className="text-center p-2 border-t md:border-t-0 border-l border-gray-200/60">
              <span className="block text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 font-serif">4.9 ★</span>
              <span className="mt-1 block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500">Client Trust Score</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:py-20 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">

        {/* Section 1: Our Story (Foundation & Heritage) */}
        <section className="grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B89758]">
              <span>Our Foundation</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-950 tracking-tight leading-tight">
              A Legacy of Uncompromising Standards
            </h2>

            <p className="text-xs sm:text-sm leading-relaxed text-gray-600">
              At Krishna Accessories, every timepiece and lifestyle good in our catalog is sourced directly from brand-authorized manufacturers and certified distributors. We reject replicas, parallel imports, and compromised craftsmanship.
            </p>

            <p className="text-xs sm:text-sm leading-relaxed text-gray-600">
              Whether you are acquiring an automatic mechanical caliber from Titan, a solar chronograph from Casio, or tailored leather goods from Hidesign, each parcel arrives with stamped warranty paperwork and official authentication seals.
            </p>

            <div className="pt-2 flex justify-center lg:justify-start">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#111827] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-black hover:shadow-md"
              >
                <span>Browse Authenticated Catalog</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-4/3 rounded-3xl overflow-hidden bg-white border border-gray-200/90 p-3 sm:p-4 shadow-sm">
              <div className="h-full w-full rounded-2xl overflow-hidden bg-[#F4F4F6] relative flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900"
                  alt="Curated Luxury Horology & Craftsmanship"
                  className="h-full w-full object-cover mix-blend-multiply opacity-95 transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 rounded-xl border border-white/80 bg-white/90 backdrop-blur-md px-3.5 py-2.5 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-[11px] font-semibold text-gray-900">Direct Brand Distribution</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase">Ahmedabad Flagship</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Mission & Vision */}
        <section className="space-y-8 sm:space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B89758]">
              Purpose & Horizon
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
              Guided by Purpose, Driven by Craft
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Our core tenets ensure an uncompromising standard across sourcing, authentication, and client concierge.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Mission Card */}
            <div className="group rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:border-gray-300 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F172A] text-amber-300 mb-5 shadow-xs">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Authenticity & Integrity
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-gray-950 tracking-tight">Our Mission</h3>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-gray-600">
                To provide discerning collectors and everyday enthusiasts with guaranteed authentic luxury timepieces and artisan leather goods, backed by direct manufacturer warranties, transparent pricing, and concierge-grade client care.
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-gray-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Tolerance for Replicas</span>
              </div>
            </div>

            {/* Vision Card */}
            <div className="group rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:border-gray-300 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F172A] text-amber-300 mb-5 shadow-xs">
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                The Horological Sanctuary
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-gray-950 tracking-tight">Our Vision</h3>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-gray-600">
                To be Western India's most trusted horological destination — seamlessly bridging timeless analog craftsmanship, master watchmaking heritage, and modern digital retail excellence with bespoke physical boutique hospitality.
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-gray-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Authorized Flagship Presence</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Why Choose Us (Core Pillars) */}
        <section className="space-y-8 sm:space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B89758]">
              The Krishna Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
              Why Discerning Clients Choose Us
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Built on transparent authentication, secure logistics, and dedicated client advisory.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Pillar 1 */}
            <div className="rounded-2xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:border-gray-300 hover:shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-900">
                <ShieldCheck className="w-5 h-5 text-gray-900" />
              </div>
              <h3 className="text-sm font-bold text-gray-950">100% Genuine Guarantee</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Direct factory distribution with valid brand warranty cards serviceable at all official brand service centers nationwide.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:border-gray-300 hover:shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-900">
                <Truck className="w-5 h-5 text-gray-900" />
              </div>
              <h3 className="text-sm font-bold text-gray-950">Insured Air Logistics</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Every parcel is protected with transit insurance and dispatched via premier partners like BlueDart Express and Delhivery.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:border-gray-300 hover:shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-900">
                <Headphones className="w-5 h-5 text-gray-900" />
              </div>
              <h3 className="text-sm font-bold text-gray-950">Dedicated Concierge</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Personalized client advisors based out of our Ahmedabad flagship boutique assisting with bespoke sizing, gifting, and corporate orders.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-2xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:border-gray-300 hover:shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-900">
                <Award className="w-5 h-5 text-gray-900" />
              </div>
              <h3 className="text-sm font-bold text-gray-950">Sealed Authentication</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tamper-evident security packaging with stamped paperwork, valid serial numbers, and official documentation.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Flagship Boutique Sanctuary */}
        <section className="rounded-3xl bg-[#0F172A] text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-800">
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
                <span>Physical Sanctuary</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Visit Our Ahmedabad Flagship
              </h3>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Experience our curated timepieces and leather accessories in person. Our private viewing suites offer bespoke bracelet fitting, movement diagnostics, and luxury hospitality.
              </p>

              <div className="pt-2 space-y-2.5 text-xs text-gray-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Location:</strong> Bodakdev, SG Highway, Ahmedabad, Gujarat 380054
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Operating Hours:</strong> Mon – Sat: 10:30 AM to 08:30 PM &bull; Sunday by Appointment
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Private Desk:</strong> +91 (079) 4000-5500
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-end justify-center gap-4 text-center lg:text-right">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-full bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-950 shadow-md transition hover:bg-gray-100 hover:shadow-lg"
              >
                <span>Schedule Private Viewing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-[11px] text-gray-400">
                Walk-ins welcomed &bull; Private suites by reservation
              </span>
            </div>
          </div>
        </section>

        {/* Section 5: Trust & Assurance Micro-Strip */}
        <section className="border-t border-gray-200/80 pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-800">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-950">Authorized Retailer</h4>
                <p className="text-[11px] text-gray-500">100% brand warranty coverage</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-800">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-950">Insured Transit</h4>
                <p className="text-[11px] text-gray-500">Safe doorstep delivery across India</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-800">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-950">Bespoke Concierge</h4>
                <p className="text-[11px] text-gray-500">Advisory on sizing & gifting</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}