// src/pages/AboutUs.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheckIcon, TruckIcon, StarIcon, ArrowRightIcon, BoxIcon, CheckCircleIcon } from '../components/Icons';

export default function AboutUs() {
  const stats = [
    { label: 'Official Authenticity', value: '100%', sub: 'Direct from brand makers' },
    { label: 'Orders Dispatched', value: '15k+', sub: 'Across 28 Indian states' },
    { label: 'Heritage Brands', value: '35+', sub: 'Authorized partner network' },
    { label: 'Client Satisfaction', value: '4.9/5', sub: 'Based on 2,400+ verified reviews' },
  ];

  const pillars = [
    {
      icon: ShieldCheckIcon,
      title: 'Guaranteed Authenticity',
      desc: 'Every timepiece and accessory is procured directly from authorized manufacturers with stamped warranty paperwork serviceable nationwide.'
    },
    {
      icon: TruckIcon,
      title: 'Insured Express Air',
      desc: 'All consignments are double-boxed in tamper-evident security packaging and dispatched via insured air logistics with real-time tracking.'
    },
    {
      icon: StarIcon,
      title: 'Dedicated Concierge',
      desc: 'Our private client advisors assist with bespoke bracelet sizing, gift curation, movement diagnostics, and after-sales support.'
    }
  ];

  const categories = [
    {
      title: 'Heritage Timepieces',
      tag: 'Horology',
      desc: 'Swiss automatic calibers, solar chronographs, and iconic everyday wristwear.',
      link: '/shop?category=Watches'
    },
    {
      title: 'Handcrafted Leather',
      tag: 'Artisanal',
      desc: 'Full-grain vegetable-tanned wallets, folios, laptop sleeves, and weekender bags.',
      link: '/shop?category=Bags'
    },
    {
      title: 'Designer Eyewear',
      tag: 'Optics',
      desc: 'Precision UV400 polarized shades and bespoke everyday frames for sharp aesthetics.',
      link: '/shop?category=Accessories'
    },
    {
      title: 'Flagship Wearables',
      tag: 'Next-Gen',
      desc: 'Acoustic headphones, smart wellness devices, and high-fidelity tech companions.',
      link: '/shop?category=Electronics'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
      <Navbar />

      {/* ================= HERO HEADER ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#FAF9F5] to-white border-b border-gray-200/80 py-12 sm:py-18">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 mb-4 border border-amber-500/20 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-[#B89758]" />
            <span className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-[0.18em] text-gray-800">
              EST. 2018 &bull; Ahmedabad, Gujarat
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-950 leading-[1.18]">
            Curating Precision, <br />
            <span className="font-serif italic font-normal text-[#B89758]">Authenticity & Modern Luxury</span>
          </h1>

          <p className="mt-4 sm:mt-5 text-xs sm:text-base leading-relaxed text-gray-600 max-w-2xl mx-auto">
            Krishna Accessories is a dedicated luxury sanctuary providing discerning collectors direct access to 100% authentic timepieces, leathercraft, and curated lifestyle essentials.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-[#0F172A] px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-black hover:scale-[1.02]"
            >
              <span>Explore Catalog</span>
              <ArrowRightIcon className="w-3.5 h-3.5 text-white" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-900 transition hover:bg-gray-100 shadow-2xs"
            >
              <span>Contact Concierge</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= KEY METRICS BAR ================= */}
      <section className="border-b border-gray-200/80 bg-white py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-gray-200/70 bg-[#F9FAFB] p-4 sm:p-5 text-center transition hover:border-gray-300"
              >
                <p className="text-2xl sm:text-3xl font-bold text-gray-950">{s.value}</p>
                <p className="mt-0.5 text-xs sm:text-sm font-semibold text-gray-900">{s.label}</p>
                <p className="mt-0.5 text-[10px] sm:text-[11px] text-gray-500">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">

        {/* Story / Foundation Section */}
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B89758]">
              Our Foundation & Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 leading-snug">
              A Legacy Built on Uncompromising Authenticity
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-600">
              In an era overflowing with counterfeits and grey-market goods, Krishna Accessories was established with one uncompromising mandate: to provide verified, factory-authorized luxury goods backed by official warranties and white-glove service.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-600">
              Every watch, leather good, and accessory that passes through our Ahmedabad boutique is thoroughly checked for caliber precision, case integrity, serial authenticity, and packaging completeness.
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct brand authorized supply channels</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Nationally valid brand warranty card with every purchase</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Insured door-to-door transit across India</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-2.5 sm:p-3 shadow-md">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&auto=format&fit=crop&q=80"
                  alt="Krishna Accessories Luxury Heritage"
                  className="w-full h-[280px] sm:h-[360px] object-cover transition-transform duration-700 hover:scale-[1.02]"
                />
              </div>
              <div className="mt-2.5 flex items-center justify-between px-2 text-[11px] text-gray-500 font-medium">
                <span>Ahmedabad Flagship Boutique</span>
                <span className="text-[#B89758] font-semibold">100% Genuine Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B89758]">
              The Three Pillars
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 mt-1">
              Why Discerning Buyers Choose Us
            </h2>
          </div>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-3">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs transition hover:shadow-md hover:border-gray-300 space-y-3"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F8F9FA] text-gray-900 border border-gray-200/80">
                    <Icon className="w-5 h-5 text-gray-900" />
                  </div>
                  <h3 className="text-base font-bold text-gray-950">{p.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Curated Categories */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B89758]">
              Curated Collections
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 mt-1">
              Our Signature Specialties
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, idx) => (
              <Link
                key={idx}
                to={c.link}
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs transition hover:border-[#B89758]/50 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block text-[9.5px] font-bold uppercase tracking-wider text-[#B89758] bg-amber-500/10 px-2 py-0.5 rounded-full mb-2.5">
                    {c.tag}
                  </span>
                  <h4 className="text-sm font-bold text-gray-950 group-hover:text-[#B89758] transition">
                    {c.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-gray-900 group-hover:text-[#B89758] transition pt-2 border-t border-gray-100">
                  <span>Explore items</span>
                  <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Flagship Boutique Card */}
        <div className="rounded-3xl bg-[#0F172A] text-white p-6 sm:p-10 lg:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-[#B89758]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid gap-8 lg:grid-cols-12 items-center relative z-10">
            <div className="lg:col-span-7 space-y-3.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B89758]">
                Boutique Presence
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                Visit Our Ahmedabad Flagship Suite
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl">
                Experience our curated timepieces and leather accessories in person. Our private client viewing suites offer personalized bracelet fitting, horology diagnostics, and bespoke hospitality.
              </p>

              <div className="pt-2 grid sm:grid-cols-2 gap-3 text-xs text-gray-300">
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <p className="font-semibold text-white">📍 Location</p>
                  <p className="text-gray-400 mt-0.5">Bodakdev, SG Highway, Ahmedabad, Gujarat 380054</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <p className="font-semibold text-white">🕒 Visiting Hours</p>
                  <p className="text-gray-400 mt-0.5">Mon – Sat: 10:30 AM to 08:30 PM &bull; Sun by Appointment</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link
                to="/contact"
                className="w-full text-center rounded-full bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-950 hover:bg-gray-100 transition shadow-sm"
              >
                Schedule Private Viewing
              </Link>
              <a
                href="tel:+917940005500"
                className="w-full text-center rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 transition"
              >
                Call Concierge: (079) 4000-5500
              </a>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}