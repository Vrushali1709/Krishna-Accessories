// src/pages/AboutUs.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheckIcon, TruckIcon, StarIcon, ArrowRightIcon } from '../components/Icons';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Heritage & Mission
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-gray-950 leading-tight">
            Curating Precision, <br />
            <span className="font-serif italic font-normal text-gray-500">Authenticity & Luxury</span>
          </h1>
          <p className="mt-4 sm:mt-5 text-xs sm:text-base leading-relaxed text-gray-600 max-w-2xl mx-auto">
            Founded with a passion for horology and refined craftsmanship, Krishna Accessories serves as Gujarat's foremost authorized sanctuary for authentic Swiss and heritage timepieces, leather accessories, and curated essentials.
          </p>
        </div>
      </section>

      {/* Brand Pillars & Values */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 space-y-12 sm:space-y-16">

        {/* Story Grid */}
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="space-y-4 text-center lg:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Our Foundation</span>
            <h2 className="text-xl sm:text-3xl font-bold text-gray-950 leading-snug">A Legacy of Uncompromising Standards</h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-600">
              At Krishna Accessories, every timepiece and lifestyle good in our catalog is sourced directly from brand-authorized manufacturers and certified distributors. We reject replicas, parallel imports, and compromised craftsmanship.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-600">
              Whether you are acquiring an automatic mechanical caliber from Titan, a solar chronograph from Casio, or tailored leather goods from Hidesign, each parcel arrives with stamped warranty paperwork and official authentication seals.
            </p>
            <div className="pt-2 flex justify-center lg:justify-start">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-5 sm:px-6 py-2.5 sm:py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black shadow-sm transition"
              >
                <span>Browse Authenticated Catalog</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="aspect-4/3 rounded-3xl overflow-hidden bg-[#F4F4F6] border border-gray-200 p-6 sm:p-8 flex items-center justify-center shadow-inner">
            <img
              src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900"
              alt="Boutique Timepieces"
              className="h-full w-full object-contain mix-blend-multiply drop-shadow-md"
            />
          </div>
        </div>

        {/* 3 Core Principles */}
        <div className="grid gap-5 sm:gap-6 sm:grid-cols-3">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm space-y-2.5">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-900">
              <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-950">100% Genuine Guarantee</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Direct factory distribution with valid brand warranty cards serviceable at all official brand service centers nationwide.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm space-y-2.5">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-900">
              <TruckIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-950">Insured Air Logistics</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every parcel is protected with transit insurance and dispatched via premier partners like BlueDart Express and Delhivery.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm space-y-2.5">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-900">
              <StarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
            </div>
            <h3 className="text-sm font-bold text-gray-950">Dedicated Concierge</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Personalized client advisors based out of our Ahmedabad flagship boutique assisting with bespoke sizing, gifting, and corporate orders.
            </p>
          </div>
        </div>

        {/* Flagship Boutique Info */}
        <div className="rounded-3xl bg-[#111827] text-white p-6 sm:p-12 shadow-xl">
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Physical Sanctuary</span>
              <h3 className="mt-1 text-xl sm:text-3xl font-serif font-bold text-white">Visit Our Ahmedabad Flagship</h3>
              <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
                Experience our curated timepieces and leather accessories in person. Our private viewing suites offer bespoke bracelet fitting, movement diagnostics, and luxury hospitality.
              </p>
              <div className="mt-5 sm:mt-6 space-y-2 text-xs text-gray-300">
                <p className="flex items-start gap-1.5"><span>📍</span> <span><strong>Location:</strong> Bodakdev, SG Highway, Ahmedabad, Gujarat 380054</span></p>
                <p className="flex items-start gap-1.5"><span>🕒</span> <span><strong>Hours:</strong> Mon – Sat: 10:30 AM to 08:30 PM &bull; Sunday by Appointment</span></p>
                <p className="flex items-start gap-1.5"><span>📞</span> <span><strong>Private Desk:</strong> +91 (079) 4000-5500</span></p>
              </div>
            </div>
            <div className="text-center lg:text-right pt-2 lg:pt-0">
              <Link
                to="/contact"
                className="inline-block w-full sm:w-auto rounded-full bg-white px-7 sm:px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-950 hover:bg-gray-100 transition shadow-sm"
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