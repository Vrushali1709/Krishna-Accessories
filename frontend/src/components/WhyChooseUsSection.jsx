// src/components/WhyChooseUsSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from './useScrollReveal';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Truck,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const BRAND_PILLARS = [
  {
    number: '01',
    pillar: 'Pillar 01',
    icon: ShieldCheck,
    title: 'Quality Assurance Guarantee',
    text: 'High quality products curated with verified product details and brand warranty cards serviceable at brand service centers nationwide.',
    badge: 'Verified Brand Selections'
  },
  {
    number: '02',
    pillar: 'Pillar 02',
    icon: Sparkles,
    title: 'Curated Quality & Craftsmanship',
    text: 'Every watch, leather wallet, backpack, footwear model, and tech gadget is hand-selected for durability, mechanical accuracy, and timeless aesthetics.',
    badge: 'Multi-Point Pre-dispatch Inspection'
  },
  {
    number: '03',
    pillar: 'Pillar 03',
    icon: Truck,
    title: 'Insured Express Logistics',
    text: 'Dispatched securely via premium couriers (BlueDart Express & Delhivery) in tamper-evident sealed packaging with real-time tracking.',
    badge: 'Tamper-Evident Packaging'
  },
  {
    number: '04',
    pillar: 'Pillar 04',
    icon: Award,
    title: 'Dedicated Mumbai Concierge',
    text: 'Personalized guidance for luxury gifting, watch sizing, corporate bulk requirements, and direct assistance from our Mumbai flagship team.',
    badge: 'In-Store & Online Support'
  }
];

export default function WhyChooseUsSection({ items = BRAND_PILLARS }) {
  return (
    <section className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14 pt-10 sm:pt-16 pb-8 sm:pb-12">
      
      {/* ============================================================
          1. SECTION HEADER
      ============================================================ */}
      <Reveal direction="up" delay={40}>
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F2EB] border border-[#C5A880]/40 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734] animate-ping" />
            <span className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C6734] font-sans">
              VALUES &amp; DISTINCTION
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-medium text-neutral-950 tracking-tight leading-tight">
            Why Shop at <span className="italic font-normal text-[#8C6734]">Krishna Accessories</span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-lg mx-auto font-normal font-sans">
            Four foundational commitments that guide every product we stock, every parcel we dispatch, and every client relationship.
          </p>
        </div>
      </Reveal>

      {/* ============================================================
          2. 4 BRAND PILLAR CARDS WITH SOPHISTICATED HOVER
      ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-12 sm:mb-16">
        {items.map((item, idx) => {
          const Icon = item.icon || ShieldCheck;
          return (
            <Reveal key={item.number} direction="up" delay={idx * 70} duration={700}>
              <div className="h-full p-6 sm:p-7 rounded-2xl bg-[#FAFAFB] border border-neutral-200/80 hover:border-[#C5A880] hover:bg-white transition-all duration-300 shadow-2xs hover:shadow-xl hover:-translate-y-2 flex flex-col justify-between text-left group relative overflow-hidden">
                
                {/* Subtle Hover Ambient Sheen */}
                <div className="pointer-events-none absolute -top-16 -right-16 w-32 h-32 rounded-full bg-[#C5A880]/5 group-hover:bg-[#C5A880]/15 blur-2xl transition-all duration-500" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-3xl sm:text-4xl font-light text-[#C5A880] group-hover:text-[#8C6734] transition-colors">
                      {item.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 text-[#8C6734] flex items-center justify-center shadow-2xs group-hover:bg-neutral-950 group-hover:text-[#C5A880] group-hover:border-neutral-950 transition-all duration-300 group-hover:scale-110">
                      <Icon className="w-4.5 h-4.5 transition-transform duration-300" />
                    </div>
                  </div>

                  <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#8C6734]">
                    {item.pillar}
                  </p>

                  <h3 className="text-[15px] sm:text-base font-bold text-neutral-950 mt-1 mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
                    {item.text}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-neutral-200/60 flex items-center justify-between text-[11px] font-medium text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#8C6734] shrink-0" />
                    <span className="text-[10.5px] group-hover:text-neutral-900 transition-colors">{item.badge}</span>
                  </div>
                  <div className="h-1 w-5 rounded-full bg-neutral-200 group-hover:w-8 group-hover:bg-[#8C6734] transition-all duration-300" />
                </div>

              </div>
            </Reveal>
          );
        })}
      </div>

      {/* ============================================================
          3. MUMBAI FLAGSHIP SANCTUARY & BOUTIQUE SHOWCASE BANNER
      ============================================================ */}
      <Reveal direction="up" delay={100}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-3xl overflow-hidden border border-neutral-200/90 shadow-md bg-white">
          
          {/* Left Visual: Store Interior with Cinematic Hover */}
          <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[300px] lg:min-h-full group overflow-hidden bg-neutral-900">
            <img
              src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1000&auto=format&fit=crop"
              alt="Krishna Accessories Mumbai Boutique at Heera Panna"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-[#C5A880] bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded border border-[#C5A880]/30 mb-1">
                Mumbai Flagship
              </span>
              <p className="font-serif text-lg font-medium text-white">Heera Panna Shopping Center</p>
              <p className="text-[11px] text-neutral-300">Haji Ali, Mumbai 400026</p>
            </div>
          </div>

          {/* Right Information Panel */}
          <div className="lg:col-span-7 p-6 sm:p-9 lg:p-10 flex flex-col justify-between space-y-6 text-left">
            
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="w-5 h-[1.5px] bg-[#8C6734]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                  VISIT OUR FLAGSHIP
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-neutral-950 tracking-tight leading-tight">
                Experience Krishna Accessories in person.
              </h3>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mt-2 font-normal font-sans">
                Visit our premier boutique in South Mumbai to try on Swiss timepieces, inspect full-grain leather finishes, test high-fidelity acoustics, and consult with our personal luxury advisors.
              </p>
            </div>

            {/* Location & Hours Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
              
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
                  <MapPin className="w-3.5 h-3.5 text-[#8C6734] shrink-0" />
                  <span>Store Location</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed pl-5 font-normal">
                  Shop No. 64, Heera Panna Shopping Center,<br />
                  Haji Ali, Mumbai 400026
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
                  <Clock className="w-3.5 h-3.5 text-[#8C6734] shrink-0" />
                  <span>Opening Hours</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed pl-5 font-normal">
                  Mon – Sat: 10:30 AM – 08:30 PM<br />
                  <span className="text-[#8C6734] font-semibold">Sunday by Appointment</span>
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
                  <Phone className="w-3.5 h-3.5 text-[#8C6734] shrink-0" />
                  <span>Private Desk</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed pl-5 font-normal">
                  +91 93213 22761 / shantilal6186@gmail.com
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
                  <Sparkles className="w-3.5 h-3.5 text-[#8C6734] shrink-0" />
                  <span>In-Store Services</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed pl-5 font-normal">
                  Complimentary Sizing &bull; Battery Swap &bull; Luxury Gift Wrap
                </p>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-950 hover:bg-[#8C6734] text-white text-xs font-semibold tracking-[0.16em] uppercase rounded-full transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-0.5 group active:scale-95 cursor-pointer"
              >
                <span>Schedule a Private Viewing</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A880] group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-neutral-300 text-neutral-800 hover:text-neutral-950 hover:border-neutral-900 text-xs font-semibold tracking-[0.14em] uppercase rounded-full transition-all duration-300 hover:bg-neutral-50 active:scale-95 cursor-pointer"
              >
                <span>Read Our Full Story</span>
              </Link>
            </div>

          </div>

        </div>
      </Reveal>

    </section>
  );
}
