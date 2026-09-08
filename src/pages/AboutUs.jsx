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
  Gem,
  Check,
  Star
} from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 overflow-x-clip font-sans selection:bg-[#111827] selection:text-white">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. PREMIUM ABOUT HERO                                                     */}
      {/* ========================================================================= */}
      <section className="relative bg-[#0B0D13] text-white border-b border-neutral-800/80 overflow-hidden">
        {/* Subtle Luxury Ambient Glow */}
        <div 
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#C5A880]/10 blur-[120px] pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute -bottom-40 right-0 w-[500px] h-[500px] rounded-full bg-[#C5A880]/8 blur-[150px] pointer-events-none" 
          aria-hidden="true" 
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Editorial Text */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
              
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#C5A880]/30 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
                <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#C5A880]">
                  The Krishna Accessories Story
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.15]">
                Precision, Authenticity, <br />
                <span className="italic font-normal text-[#C5A880]">Crafted for You.</span>
              </h1>

              {/* Narrative Subtitle */}
              <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-xl">
                Founded with an unwavering passion for horological excellence and timeless aesthetics, Krishna Accessories stands as Gujarat’s foremost authorized destination for certified authentic luxury timepieces, handcrafted leather goods, and refined lifestyle essentials.
              </p>

              {/* Key Trust Highlights */}
              <div className="pt-2 flex flex-wrap gap-y-3 gap-x-6 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C5A880]" />
                  <span>100% Brand Authorized</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C5A880]" />
                  <span>Official Nationwide Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C5A880]" />
                  <span>Ahmedabad Flagship Boutique</span>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#C5A880] hover:bg-[#b59870] text-[#0B0D13] text-xs font-bold tracking-[0.18em] uppercase transition-all duration-300 shadow-lg hover:shadow-xl rounded-sm group"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href="#our-story"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-neutral-700/80 hover:border-[#C5A880]/60 text-neutral-200 hover:text-white text-xs font-medium tracking-[0.18em] uppercase transition-all duration-300 rounded-sm bg-neutral-900/40 backdrop-blur-sm"
                >
                  <span>Our Story</span>
                  <ChevronDown className="w-4 h-4 text-[#C5A880]" />
                </a>
              </div>
            </div>

            {/* Right Hero Luxury Imagery */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Image Frame with Elegant Golden Trim */}
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl group">
                  <img
                    src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop"
                    alt="Luxury Chronograph Timepiece"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D13] via-transparent to-black/20" />

                  {/* Corner Accent Detail */}
                  <div className="absolute top-4 right-4 text-[10px] tracking-[0.2em] uppercase font-mono text-[#C5A880] bg-black/60 backdrop-blur-md px-3 py-1 rounded-sm border border-[#C5A880]/30">
                    Est. Gujarat
                  </div>
                </div>

                {/* Floating Certification Card (Desktop overlay) */}
                <div className="hidden sm:block absolute -bottom-6 -left-6 bg-[#121620]/95 backdrop-blur-md border border-[#C5A880]/30 p-4 rounded-lg shadow-2xl max-w-[280px]">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#C5A880]/15 flex items-center justify-center shrink-0 border border-[#C5A880]/40 text-[#C5A880]">
                      <Gem className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white tracking-wide">
                        100% Certified Authentic
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                        Direct distribution with official manufacturer seals and warranty.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. BRAND INTRO / STORY SECTION                                            */}
      {/* ========================================================================= */}
      <section id="our-story" className="py-20 sm:py-28 bg-[#FAFAFB] relative border-b border-neutral-200/80 scroll-mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Editorial Image with Offset Stamp */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative">
                {/* Background Framing Shadow */}
                <div className="absolute inset-0 -translate-x-3 -translate-y-3 bg-[#EAE6DF] rounded-xl -z-10" />
                
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop"
                    alt="Artisanal Horology Craftsmanship"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Authenticated Since Day One Badge */}
                <div className="absolute -bottom-5 right-4 sm:-right-4 bg-white border border-neutral-200 p-4 rounded-lg shadow-xl max-w-[240px]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                    Official Sanctuary
                  </p>
                  <p className="font-serif text-sm font-semibold text-neutral-900 mt-1">
                    Authenticated Since Day One
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Zero compromise on origin, heritage, and mechanical integrity.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Story Copy */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-left">
              
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8C6734] flex items-center gap-2">
                  <span className="w-6 h-[1.5px] bg-[#C5A880]" />
                  Our Foundation
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-medium text-neutral-950 tracking-tight leading-tight">
                  A Legacy Built on Trust & Precision
                </h2>
              </div>

              {/* Narrative Paragraphs */}
              <div className="space-y-4 text-neutral-600 text-sm sm:text-base leading-relaxed font-light">
                <p>
                  At Krishna Accessories, every timepiece and luxury lifestyle piece in our catalog is sourced directly from brand-authorized manufacturers and certified distributors. We reject replicas, parallel grey-market imports, and compromised craftsmanship without exception.
                </p>
                <p>
                  Whether you are acquiring an intricate mechanical automatic caliber, an iconic solar chronograph, or handcrafted full-grain leather goods from celebrated heritage houses including Titan, Casio, and Hidesign, each parcel arrives with factory-stamped warranty documentation and official authentication seals.
                </p>
              </div>

              {/* Gold Ornament Divider */}
              <div className="w-16 h-0.5 bg-[#C5A880]" />

              {/* Editorial Quote Box */}
              <div className="p-5 rounded-lg bg-[#F3EFEA]/60 border-l-2 border-[#C5A880]">
                <p className="font-serif italic text-sm sm:text-base text-neutral-800 leading-snug">
                  “Authenticity is not merely our promise—it is the enduring cornerstone upon which every collector relationship is forged.”
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-neutral-500 mt-2">
                  — The Krishna Accessories Curatorial Team
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-neutral-900 hover:text-[#8C6734] transition-colors group"
                >
                  <span>Browse Authenticated Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-[#C5A880]" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. VALUES / BRAND PILLARS                                                 */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 bg-white border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16 sm:mb-20">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8C6734]">
              Values & Distinction
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-neutral-950 tracking-tight">
              Why Krishna Accessories
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light">
              Three foundational principles that define our dedication to collectors, connoisseurs, and everyday discerning clients.
            </p>
          </div>

          {/* 3 Elegant Value Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            
            {/* 01 — AUTHENTICITY */}
            <div className="group relative p-8 sm:p-10 rounded-lg bg-[#FAFAFB] border border-neutral-200/80 hover:border-[#C5A880]/60 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-4xl sm:text-5xl font-light text-[#C5A880]/70 group-hover:text-[#C5A880] transition-colors">
                    01
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-800 shadow-xs group-hover:bg-[#C5A880] group-hover:text-white group-hover:border-[#C5A880] transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                  Pillar of Trust
                </p>
                <h3 className="font-serif text-xl font-semibold text-neutral-950 mt-1 mb-3">
                  100% Authenticity
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                  100% genuine products sourced exclusively through authorized distributor channels with official manufacturer warranty paperwork valid nationwide.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200/60 flex items-center gap-1.5 text-[11px] font-medium text-neutral-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Direct Brand Sourcing</span>
              </div>
            </div>

            {/* 02 — CRAFTSMANSHIP */}
            <div className="group relative p-8 sm:p-10 rounded-lg bg-[#FAFAFB] border border-neutral-200/80 hover:border-[#C5A880]/60 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-4xl sm:text-5xl font-light text-[#C5A880]/70 group-hover:text-[#C5A880] transition-colors">
                    02
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-800 shadow-xs group-hover:bg-[#C5A880] group-hover:text-white group-hover:border-[#C5A880] transition-colors">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                  Curatorial Standard
                </p>
                <h3 className="font-serif text-xl font-semibold text-neutral-950 mt-1 mb-3">
                  Master Craftsmanship
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                  Carefully curated timepieces, fine leather goods, and lifestyle essentials selected for superior mechanical precision, resilience, and timeless elegance.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200/60 flex items-center gap-1.5 text-[11px] font-medium text-neutral-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Multi-Point Inspection</span>
              </div>
            </div>

            {/* 03 — CONCIERGE SERVICE */}
            <div className="group relative p-8 sm:p-10 rounded-lg bg-[#FAFAFB] border border-neutral-200/80 hover:border-[#C5A880]/60 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-4xl sm:text-5xl font-light text-[#C5A880]/70 group-hover:text-[#C5A880] transition-colors">
                    03
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-800 shadow-xs group-hover:bg-[#C5A880] group-hover:text-white group-hover:border-[#C5A880] transition-colors">
                    <Award className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                  Personalized Care
                </p>
                <h3 className="font-serif text-xl font-semibold text-neutral-950 mt-1 mb-3">
                  Concierge Service
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                  Personalized client advisors assisting with bespoke sizing, corporate acquisitions, luxury gifting, and private viewing appointments.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200/60 flex items-center gap-1.5 text-[11px] font-medium text-neutral-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Dedicated Advisors</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. AUTHENTICITY FEATURE SECTION                                           */}
      {/* ========================================================================= */}
      <section className="bg-[#0B0D11] text-white py-20 sm:py-28 relative overflow-hidden border-b border-neutral-800">
        
        {/* Subtle Ambient Background Gradients */}
        <div 
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#C5A880]/5 blur-[120px] pointer-events-none" 
          aria-hidden="true" 
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A880] flex items-center gap-2">
                  <span className="w-6 h-[1.5px] bg-[#C5A880]" />
                  Zero Compromise
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-tight">
                  Every Detail, Authenticated.
                </h2>
              </div>

              <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                We believe true luxury begins with uncompromised peace of mind. Every product in our collection is rigorously verified against manufacturer serial standards, complete with official warranty documentation and certified packaging.
              </p>

              {/* 3 Small Trust Indicators */}
              <div className="pt-2 space-y-4">
                
                <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-neutral-800 hover:border-[#C5A880]/40 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#C5A880]/15 flex items-center justify-center shrink-0 text-[#C5A880]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Official Warranty</h3>
                    <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed font-light">
                      Manufacturer warranty cards honored at all official brand service centers nationwide.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-neutral-800 hover:border-[#C5A880]/40 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#C5A880]/15 flex items-center justify-center shrink-0 text-[#C5A880]">
                    <PackageCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Verified Sourcing</h3>
                    <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed font-light">
                      Direct factory and certified distributor procurement with zero grey-market intermediaries.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-neutral-800 hover:border-[#C5A880]/40 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#C5A880]/15 flex items-center justify-center shrink-0 text-[#C5A880]">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Secure Delivery</h3>
                    <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed font-light">
                      Fully insured transit in tamper-evident sealed packaging via BlueDart Express & premier couriers.
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Watch Macro Movement Visual */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop"
                  alt="Certified Timepiece Inspection & Horology"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0B0D11]/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 bg-[#0B0D11]/90 backdrop-blur-md border border-neutral-800 p-3.5 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-neutral-300">
                    <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                    <span>Multi-Point Inspection Protocol</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#C5A880]">
                    100% Guaranteed
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FLAGSHIP BOUTIQUE SECTION                                              */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 bg-[#FAFAFB] border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-2xl overflow-hidden border border-neutral-200 shadow-lg bg-white">
            
            {/* Left Image: Luxury Boutique Interior */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
              <img
                src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1000&auto=format&fit=crop"
                alt="Krishna Accessories Ahmedabad Flagship Showroom"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
              <div className="absolute bottom-4 left-4 lg:hidden text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A880]">
                  Ahmedabad Showroom
                </span>
                <p className="font-serif text-lg font-semibold">Private Viewing Suite</p>
              </div>
            </div>

            {/* Right Information Panel */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between space-y-8">
              
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8C6734] flex items-center gap-2">
                  <span className="w-6 h-[1.5px] bg-[#C5A880]" />
                  Visit Our Flagship
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-medium text-neutral-950 tracking-tight leading-snug">
                  Experience Krishna Accessories in person.
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                  Step into our Ahmedabad sanctuary. Discover curated collections in private viewing suites offering bespoke bracelet fitting, movement diagnostics, and luxury hospitality.
                </p>
              </div>

              {/* Clean Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-neutral-100">
                
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
                    <MapPin className="w-3.5 h-3.5 text-[#8C6734]" />
                    <span>Location</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed font-light pl-5">
                    Bodakdev, SG Highway,<br />
                    Ahmedabad, Gujarat 380054
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
                    <Clock className="w-3.5 h-3.5 text-[#8C6734]" />
                    <span>Boutique Hours</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed font-light pl-5">
                    Mon – Sat: 10:30 AM to 08:30 PM<br />
                    <span className="text-[#8C6734] font-medium">Sunday by Appointment</span>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
                    <Phone className="w-3.5 h-3.5 text-[#8C6734]" />
                    <span>Private Desk</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed font-light pl-5">
                    +91 (079) 4000-5500<br />
                    <span className="text-neutral-400">concierge@krishnaaccessories.com</span>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
                    <Sparkles className="w-3.5 h-3.5 text-[#8C6734]" />
                    <span>VIP Privileges</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed font-light pl-5">
                    Private Viewing Suites &bull; Bespoke Sizing &bull; Luxury Gifting Consultation
                  </p>
                </div>

              </div>

              {/* CTA Action */}
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#111827] hover:bg-black text-white text-xs font-bold tracking-[0.18em] uppercase transition-all duration-300 shadow-md hover:shadow-lg rounded-sm group"
                >
                  <span>Schedule a Private Viewing</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A880] transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FINAL BRAND STATEMENT                                                  */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 bg-white text-center relative overflow-hidden">
        
        {/* Subtle Ornamental Top Accent */}
        <div className="mx-auto flex justify-center items-center gap-3 mb-6" aria-hidden="true">
          <div className="w-12 h-[1px] bg-neutral-200" />
          <div className="w-2 h-2 rotate-45 border border-[#C5A880] bg-[#C5A880]/20" />
          <div className="w-12 h-[1px] bg-neutral-200" />
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8C6734]">
            The Art of Distinction
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-neutral-950 font-medium tracking-tight leading-tight">
            TIMELESS PIECES.<br />
            <span className="italic font-normal text-neutral-500">LASTING IMPRESSIONS.</span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 font-light tracking-wide max-w-md mx-auto">
            Curated with precision. Chosen with confidence.
          </p>

          <div className="pt-4">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-[#111827] hover:bg-black text-[#C5A880] hover:text-white text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-sm shadow-md hover:shadow-2xl group border border-neutral-800"
            >
              <span>Shop the Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#C5A880]" />
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}