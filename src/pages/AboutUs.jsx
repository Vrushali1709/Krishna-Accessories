// src/pages/AboutUs.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheckIcon, TruckIcon, StarIcon, ArrowRightIcon } from '../components/Icons';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 overflow-x-clip">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-white border-b border-zinc-200/80 py-12 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B89035]">
            Heritage & Horological Mission
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-zinc-950 font-sans leading-tight">
            Curating Precision, <br />
            <span className="font-serif italic font-normal text-zinc-500">Authenticity & Luxury</span>
          </h1>
          <p className="mt-5 text-xs sm:text-sm leading-relaxed text-zinc-600 max-w-2xl mx-auto">
            Founded with an enduring passion for horological excellence and refined craftsmanship, Krishna Accessories serves as Gujarat's foremost sanctuary for certified authentic Swiss and heritage timepieces, leather goods, and curated essentials.
          </p>
        </div>
      </section>

      {/* Brand Pillars & Values */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 space-y-16">

        {/* Story Grid */}
        <div className="grid gap-10 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">Our Foundation</span>
            <h2 className="text-xl sm:text-3xl font-bold text-zinc-950 leading-snug">
              A Legacy of Uncompromising Standards
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-600">
              At Krishna Accessories, every timepiece and luxury item in our catalog is procured directly from brand-authorized manufacturers and certified distributors. We categorically reject replicas, gray-market imports, and compromised craftsmanship.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-600">
              Whether you are acquiring an automatic mechanical caliber from Titan or Rolex, a solar chronograph from Casio, or tailored leather goods from Hidesign, each consignment arrives with stamped warranty paperwork and official serial validation seals.
            </p>
            <div className="pt-2 flex justify-center lg:justify-start">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black shadow-xs transition"
              >
                <span>Browse Authenticated Catalog</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 aspect-4/3 rounded-3xl overflow-hidden bg-white border border-zinc-200/80 p-6 sm:p-8 flex items-center justify-center shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900"
              alt="Boutique Timepieces"
              className="h-full w-full object-contain mix-blend-multiply"
            />
          </div>
        </div>

        {/* 3 Core Principles */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
              <ShieldCheckIcon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-950">100% Genuine Guarantee</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Direct factory distribution with stamped manufacturer warranty cards valid at official service centers nationwide across India.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
              <TruckIcon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-950">Insured Air Logistics</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Every parcel is protected with complete transit insurance and dispatched via premier partners including BlueDart Express and Delhivery.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
              <StarIcon className="w-5 h-5 text-zinc-900" />
            </div>
            <h3 className="text-sm font-bold text-zinc-950">Dedicated Concierge</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Personalized horological advisors based out of our Ahmedabad flagship boutique assisting with bespoke sizing, gifting, and corporate orders.
            </p>
          </div>
        </div>

        {/* Flagship Boutique Info */}
        <div className="rounded-3xl bg-[#121316] text-white p-8 sm:p-12 border border-zinc-800 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300">Physical Sanctuary</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">Visit Our Ahmedabad Flagship</h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Experience our curated timepieces and leather accessories in person. Our private viewing suites offer bespoke bracelet fitting, movement diagnostics, and luxury hospitality.
              </p>
              <div className="pt-2 space-y-1.5 text-xs text-zinc-300">
                <p>📍 <strong>Location:</strong> Bodakdev, SG Highway, Ahmedabad, Gujarat 380054</p>
                <p>🕒 <strong>Hours:</strong> Mon – Sat: 10:30 AM to 08:30 PM &bull; Sunday by Appointment</p>
                <p>📞 <strong>Private Desk:</strong> +91 (079) 4000-5500</p>
              </div>
            </div>
            <div className="text-center lg:text-right">
              <Link
                to="/contact"
                className="inline-block rounded-lg bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-950 hover:bg-zinc-100 transition shadow-xs"
              >
                Schedule Private Viewing &rarr;
              </Link>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}