// src/pages/AboutUs.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  PackageCheck,
  Truck,
  Check,
  Watch,
  Briefcase,
  Headphones,
  Glasses
} from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Minimalist, Editorial, Grounded)                         */}
      {/* ========================================================================= */}
      <section className="relative bg-white border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F2EB] border border-[#C5A880]/40">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734]" />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8C6734]">
                  The Krishna Accessories Story
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[52px] font-medium tracking-tight text-neutral-950 leading-[1.15]">
                Precision, Authenticity, <br />
                <span className="italic font-normal text-[#8C6734]">Crafted for You.</span>
              </h1>

              {/* Real, Grounded Brand Story Intro */}
              <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-xl">
                Founded in Ahmedabad, Krishna Accessories is Gujarat’s premier multi-category destination for 100% certified authentic timepieces, handcrafted leather goods, footwear, and curated lifestyle essentials. We connect discerning buyers directly with authorized brand manufacturers and official warranties.
              </p>

              {/* Real Store Promises */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-neutral-700">
                <div className="flex items-center gap-2 p-2.5 rounded-md bg-[#FAFAFB] border border-neutral-200/60">
                  <Check className="w-4 h-4 text-[#8C6734] shrink-0" />
                  <span className="font-medium">Direct Authorized Sourcing</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-md bg-[#FAFAFB] border border-neutral-200/60">
                  <Check className="w-4 h-4 text-[#8C6734] shrink-0" />
                  <span className="font-medium">Official Brand Warranty</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-md bg-[#FAFAFB] border border-neutral-200/60">
                  <Check className="w-4 h-4 text-[#8C6734] shrink-0" />
                  <span className="font-medium">Ahmedabad Flagship Store</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold tracking-[0.16em] uppercase rounded-sm transition-all shadow-sm hover:shadow-md group"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-[#C5A880]" />
                </Link>

                <a
                  href="#our-story"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-neutral-300 hover:border-neutral-900 text-neutral-800 hover:text-neutral-950 text-xs font-medium tracking-[0.16em] uppercase rounded-sm transition-all bg-white"
                >
                  <span>Our Story</span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                </a>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/4.8] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-lg relative group">
                  <img
                    src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop"
                    alt="Authentic Luxury Timepieces & Accessories"
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-102"
                  />
                  
                  {/* Discreet Bottom Label */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-lg border border-neutral-200/80 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-neutral-950">100% Certified Authentic</p>
                      <p className="text-[11px] text-neutral-500">Titan &bull; Casio &bull; Fossil &bull; Hidesign &bull; Apple</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6734] bg-[#F5F2EB] px-2 py-1 rounded">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. REAL CATEGORIES WE CURATE (Direct connection to the actual website)    */}
      {/* ========================================================================= */}
      <section className="py-12 bg-[#FAFAFB] border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                Curated Categories
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-neutral-950 mt-1">
                What We Curate at Krishna Accessories
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6734] hover:text-neutral-950 tracking-wider uppercase transition-colors"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            
            {/* Watches */}
            <Link
              to="/shop?category=Watches"
              className="p-4 rounded-xl bg-white border border-neutral-200/80 hover:border-[#C5A880] transition-all hover:shadow-md group text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-[#F5F2EB] text-[#8C6734] flex items-center justify-center mb-3 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <Watch className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">Watches</h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">Titan, Casio, Fossil, Seiko</p>
            </Link>

            {/* Bags & Leather */}
            <Link
              to="/shop?category=Bags%20%26%20Wallets"
              className="p-4 rounded-xl bg-white border border-neutral-200/80 hover:border-[#C5A880] transition-all hover:shadow-md group text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-[#F5F2EB] text-[#8C6734] flex items-center justify-center mb-3 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">Bags & Wallets</h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">Hidesign, Wildcraft, Tommy</p>
            </Link>

            {/* Footwear */}
            <Link
              to="/shop?category=Shoes"
              className="p-4 rounded-xl bg-white border border-neutral-200/80 hover:border-[#C5A880] transition-all hover:shadow-md group text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-[#F5F2EB] text-[#8C6734] flex items-center justify-center mb-3 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <PackageCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">Footwear</h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">Nike, Adidas, Puma, Woodland</p>
            </Link>

            {/* Audio & Electronics */}
            <Link
              to="/shop?category=Electronics"
              className="p-4 rounded-xl bg-white border border-neutral-200/80 hover:border-[#C5A880] transition-all hover:shadow-md group text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-[#F5F2EB] text-[#8C6734] flex items-center justify-center mb-3 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <Headphones className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">Audio & Tech</h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">Sony, Bose, Apple, Samsung</p>
            </Link>

            {/* Fashion Accessories */}
            <Link
              to="/shop?category=Fashion%20Accessories"
              className="p-4 rounded-xl bg-white border border-neutral-200/80 hover:border-[#C5A880] transition-all hover:shadow-md group text-left col-span-2 sm:col-span-1"
            >
              <div className="w-9 h-9 rounded-lg bg-[#F5F2EB] text-[#8C6734] flex items-center justify-center mb-3 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <Glasses className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">Eyewear & Accessories</h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">Ray-Ban, Police, Fastrack</p>
            </Link>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BRAND INTRO / STORY SECTION                                            */}
      {/* ========================================================================= */}
      <section id="our-story" className="py-16 sm:py-24 bg-white border-b border-neutral-200/80 scroll-mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Column: Authentic Craftsmanship Image */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative">
                <div className="aspect-[4/4.6] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop"
                    alt="Authentic Precision & Quality Check"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Grounded Authenticity Stamp */}
                <div className="absolute -bottom-4 right-2 sm:-right-4 bg-white border border-neutral-200 p-3.5 rounded-lg shadow-lg max-w-[230px]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8C6734]">
                    Authorized Retailer
                  </p>
                  <p className="text-xs font-semibold text-neutral-900 mt-0.5">
                    Authenticated Since Day One
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Gujarat's trusted multi-brand store with verified provenance.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Genuine Narrative Copy */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-5 text-left">
              
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8C6734] flex items-center gap-2">
                  <span className="w-5 h-[1.5px] bg-[#8C6734]" />
                  Our Foundation
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-medium text-neutral-950 tracking-tight leading-tight mt-2">
                  A Legacy Built on Trust & Precision
                </h2>
              </div>

              <div className="space-y-3.5 text-neutral-600 text-sm sm:text-base leading-relaxed font-normal">
                <p>
                  At Krishna Accessories, every timepiece, leather bag, footwear pair, and tech accessory in our catalog is sourced directly from brand-authorized manufacturers and certified distribution networks. We maintain zero tolerance for replicas, grey-market imports, and compromised quality.
                </p>
                <p>
                  Whether you are ordering an automatic watch from Titan, a rugged chronograph from Casio, handcrafted leather accessories from Hidesign, or premium electronics from Sony and Apple, each item arrives with stamped warranty paperwork, official seals, and original retail packaging.
                </p>
              </div>

              {/* Minimal Divider */}
              <div className="w-12 h-0.5 bg-[#C5A880]" />

              {/* Customer Guarantee Quote Box */}
              <div className="p-4 rounded-lg bg-[#FAF8F5] border-l-2 border-[#8C6734]">
                <p className="italic text-xs sm:text-sm text-neutral-800 leading-normal">
                  “We believe when customers invest in premium accessories, they deserve 100% peace of mind, prompt customer support, and genuine manufacturer-backed warranties.”
                </p>
                <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mt-1.5">
                  — The Krishna Accessories Promise
                </p>
              </div>

              <div className="pt-1">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-neutral-950 hover:text-[#8C6734] transition-colors group"
                >
                  <span>Browse All Authenticated Products</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-[#8C6734]" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. VALUES / BRAND PILLARS (Clean, Human, Minimal)                         */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#FAFAFB] border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-12 sm:mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8C6734]">
              Values & Distinction
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-medium text-neutral-950 tracking-tight">
              Why Krishna Accessories
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              Three clear commitments that guide every product we stock and every order we fulfill.
            </p>
          </div>

          {/* 3 Value Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* 01 — AUTHENTICITY */}
            <div className="p-7 rounded-xl bg-white border border-neutral-200/80 hover:border-[#C5A880] transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-serif text-3xl sm:text-4xl font-light text-[#C5A880]">
                    01
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-[#F5F2EB] text-[#8C6734] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8C6734]">
                  Pillar 01
                </p>
                <h3 className="text-base font-bold text-neutral-950 mt-1 mb-2">
                  100% Authenticity Guarantee
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  100% genuine products sourced exclusively from authorized distributors with official warranty cards serviceable at certified brand service centers nationwide.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] font-medium text-neutral-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8C6734]" />
                <span>Authorized Brand Partnerships</span>
              </div>
            </div>

            {/* 02 — CRAFTSMANSHIP */}
            <div className="p-7 rounded-xl bg-white border border-neutral-200/80 hover:border-[#C5A880] transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-serif text-3xl sm:text-4xl font-light text-[#C5A880]">
                    02
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-[#F5F2EB] text-[#8C6734] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8C6734]">
                  Pillar 02
                </p>
                <h3 className="text-base font-bold text-neutral-950 mt-1 mb-2">
                  Curated Quality & Craftsmanship
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Every watch, leather wallet, backpack, footwear model, and tech gadget is hand-selected for durability, mechanical accuracy, and timeless aesthetics.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] font-medium text-neutral-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8C6734]" />
                <span>Multi-Point Pre-dispatch Inspection</span>
              </div>
            </div>

            {/* 03 — CONCIERGE SERVICE */}
            <div className="p-7 rounded-xl bg-white border border-neutral-200/80 hover:border-[#C5A880] transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-serif text-3xl sm:text-4xl font-light text-[#C5A880]">
                    03
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-[#F5F2EB] text-[#8C6734] flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8C6734]">
                  Pillar 03
                </p>
                <h3 className="text-base font-bold text-neutral-950 mt-1 mb-2">
                  Dedicated Client Assistance
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Personalized guidance for luxury gifting, watch sizing, corporate bulk requirements, and direct assistance from our Ahmedabad flagship team.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] font-medium text-neutral-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8C6734]" />
                <span>In-Store & Online Support</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. AUTHENTICITY FEATURE SECTION (Charcoal Luxury, Clean & Trustworthy)     */}
      {/* ========================================================================= */}
      <section className="bg-[#111827] text-white py-16 sm:py-20 border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880] flex items-center gap-2">
                  <span className="w-5 h-[1.5px] bg-[#C5A880]" />
                  Zero Compromise
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-medium text-white tracking-tight leading-tight mt-2">
                  Every Detail, Authenticated.
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                We believe trust is built on consistency. Every parcel leaving our Ahmedabad fulfillment hub undergoes rigorous packaging and verification, arriving safely at your doorstep with valid manufacturer credentials.
              </p>

              {/* 3 Trust Indicators */}
              <div className="space-y-3 pt-1">
                
                <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-white/5 border border-neutral-800">
                  <div className="w-7 h-7 rounded-md bg-[#C5A880]/15 flex items-center justify-center shrink-0 text-[#C5A880]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white">Official Warranty</h3>
                    <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
                      Brand warranty cards honored at all official brand service centers nationwide.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-white/5 border border-neutral-800">
                  <div className="w-7 h-7 rounded-md bg-[#C5A880]/15 flex items-center justify-center shrink-0 text-[#C5A880]">
                    <PackageCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white">Verified Sourcing</h3>
                    <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
                      Direct factory and certified distributor procurement with genuine batch codes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-white/5 border border-neutral-800">
                  <div className="w-7 h-7 rounded-md bg-[#C5A880]/15 flex items-center justify-center shrink-0 text-[#C5A880]">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white">Secure Delivery</h3>
                    <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
                      Insured transit in tamper-evident sealed packaging via BlueDart Express & Delhivery.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop"
                  alt="Verified Horology & Accessories Quality"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-3 rounded-lg border border-neutral-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-neutral-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Direct Factory Authorized</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-wider">
                    Gujarat Hub
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FLAGSHIP BOUTIQUE SECTION (Clean, Realistic, Ahmedabad Store)           */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-2xl overflow-hidden border border-neutral-200/80 shadow-md bg-white">
            
            {/* Left Image: Real Store Interior */}
            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
              <img
                src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1000&auto=format&fit=crop"
                alt="Krishna Accessories Ahmedabad Store"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
              <div className="absolute bottom-3 left-3 text-white lg:hidden">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A880]">
                  Ahmedabad Flagship
                </span>
                <p className="font-semibold text-sm">Bodakdev, SG Highway</p>
              </div>
            </div>

            {/* Right Information Panel */}
            <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6 text-left">
              
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8C6734] flex items-center gap-2">
                  <span className="w-5 h-[1.5px] bg-[#8C6734]" />
                  Visit Our Flagship
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-neutral-950 tracking-tight mt-1.5 mb-3">
                  Experience Krishna Accessories in person.
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Visit our flagship store in Ahmedabad to inspect timepieces, feel genuine leather textures, test audio gear, and receive personalized assistance.
                </p>
              </div>

              {/* Clean Location & Hours Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-neutral-100">
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
                    <MapPin className="w-3.5 h-3.5 text-[#8C6734]" />
                    <span>Store Location</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed pl-5">
                    Bodakdev, SG Highway,<br />
                    Ahmedabad, Gujarat 380054
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
                    <Clock className="w-3.5 h-3.5 text-[#8C6734]" />
                    <span>Opening Hours</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed pl-5">
                    Mon – Sat: 10:30 AM to 08:30 PM<br />
                    <span className="text-[#8C6734] font-medium">Sunday by Appointment</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
                    <Phone className="w-3.5 h-3.5 text-[#8C6734]" />
                    <span>Private Desk & Enquiries</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed pl-5">
                    +91 (079) 4000-5500<br />
                    <span className="text-neutral-400">concierge@krishnaaccessories.com</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
                    <Sparkles className="w-3.5 h-3.5 text-[#8C6734]" />
                    <span>In-Store Services</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed pl-5">
                    Complimentary Sizing &bull; Battery Replacement &bull; Gifting Wrap
                  </p>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold tracking-[0.16em] uppercase rounded-sm transition-all shadow-sm hover:shadow-md group"
                >
                  <span>Schedule a Private Viewing</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A880] transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FINAL BRAND STATEMENT & SHOP CTA                                       */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 bg-white text-center border-t border-neutral-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-5">
          
          <div className="w-8 h-0.5 bg-[#8C6734] mx-auto" />

          <h2 className="font-serif text-3xl sm:text-5xl text-neutral-950 font-medium tracking-tight leading-tight">
            TIMELESS PIECES.<br />
            <span className="italic font-normal text-neutral-500">LASTING IMPRESSIONS.</span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-500 font-normal tracking-wide max-w-md mx-auto">
            Curated with precision. Chosen with confidence.
          </p>

          <div className="pt-3">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 rounded-sm shadow-md hover:shadow-xl group"
            >
              <span className="text-[#C5A880] group-hover:text-white transition-colors">Shop the Collection</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-[#C5A880]" />
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}